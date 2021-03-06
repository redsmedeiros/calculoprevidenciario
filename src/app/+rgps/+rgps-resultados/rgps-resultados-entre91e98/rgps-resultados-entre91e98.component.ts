import { Component, OnInit, Input } from '@angular/core';
import { CarenciaProgressiva } from '../CarenciaProgressiva.model';
import { CarenciaProgressivaService } from '../CarenciaProgressiva.service';
import { ReajusteAutomatico } from '../ReajusteAutomatico.model';
import { ActivatedRoute } from '@angular/router';
import { ReajusteAutomaticoService } from '../ReajusteAutomatico.service';
import { CalculoRgps as CalculoModel } from '../../+rgps-calculos/CalculoRgps.model';
import { CalculoRgpsService } from '../../+rgps-calculos/CalculoRgps.service';
import { ValorContribuidoService } from '../../+rgps-valores-contribuidos/ValorContribuido.service'
import { RgpsResultadosComponent } from '../rgps-resultados.component'
import { MoedaService } from '../../../services/Moeda.service';
import { Moeda } from '../../../services/Moeda.model';
import * as moment from 'moment';

@Component({
  selector: 'app-rgps-resultados-entre91e98',
  templateUrl: './rgps-resultados-entre91e98.component.html',
  styleUrls: ['./rgps-resultados-entre91e98.component.css']
})
export class RgpsResultadosEntre91e98Component extends RgpsResultadosComponent implements OnInit {

  @Input() calculo;
  @Input() segurado;
  @Input() tipoCalculo;
  @Input() dadosPassoaPasso;
  @Input() listaValoresContribuidosPeriodosCT;
  @Input() numResultado;

  public boxId;
  public isUpdating = false;
  public idCalculo;
  public tipoBeneficio;
  public dataInicioBeneficio;
  public stringCabecalho;
  public moeda;
  public idadeSegurado;
  public nenhumaContrib = false;
  public conclusoes = {};
  public tableData = [];
  public listaValoresContribuidos;
  public carenciasProgressivas;
  public reajustesAutomaticos;
  public valorExportacao;
  public contribuicaoPrimaria = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundaria = { anos: 0, meses: 0, dias: 0 };
  public iscontribuicaoSecundaria = false;
  public coeficiente;
  public erros = [];
  public direito = false;
  public tableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.tableData,
    columns: [
      { data: 'id' },
      { data: 'competencia' },
      { data: 'fator' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria', visible: this.iscontribuicaoSecundaria },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada', visible: this.iscontribuicaoSecundaria },
      { data: 'limite' },
    ],
    columnDefs: [
      { 'width': '15rem', 'targets': [7] },
      {
        'targets': [0, 1, 2, 3, 4, 5],
        'className': 'text-center'
      }
    ]
  };

  public reajustesAdministrativos = true;
  public showReajustesAdministrativos = false;
  public reajustesAdministrativosTableOptionsModelo = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: [],
    columns: [
      { data: 'competencia' },
      { data: 'reajuste' },
      { data: 'beneficio' },
      { data: 'limite' },
    ]
  };
  public reajustesAdministrativosTableData = { '91_98': [], '98_99': [] };
  public reajustesAdministrativosTableOptions = {
    '91_98': {
      colReorder: false,
      paging: false,
      searching: false,
      ordering: false,
      bInfo: false,
      data: [],
      columns: [
        { data: 'competencia' },
        { data: 'reajuste' },
        { data: 'beneficio' },
        { data: 'limite' },
      ]
    },
    '98_99': {
      colReorder: false,
      paging: false,
      searching: false,
      ordering: false,
      bInfo: false,
      data: [],
      columns: [
        { data: 'competencia' },
        { data: 'reajuste' },
        { data: 'beneficio' },
        { data: 'limite' },
      ]
    }
  };

  private valorBeneficio = { '91_98': 0, '98_99': 0 };


  private numContribuicoesAteVigencia;
  private dataAteVigencia;
  private dataUltimaRemuneracaoVigencia;
  private dataLimiteRemuneracaoVigencia;
  private aplicarRejusteAposdib = false;


  constructor(
    private CarenciaProgressiva: CarenciaProgressivaService,
    protected route: ActivatedRoute,
    private ReajusteAutomatico: ReajusteAutomaticoService,
    protected ValoresContribuidos: ValorContribuidoService,
    private Moeda: MoedaService,
    private CalculoRgpsService: CalculoRgpsService,
    protected rt: ActivatedRoute,) {
    super(null, route, null, null, null, null, null, null);
  }

  ngOnInit() {

    this.isUpdating = true;
    this.idCalculo = this.calculo.id;
    this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);
    // Ajuste para novos tipos conforme reforma
    // this.tipoBeneficio = this.getEspecieReforma(this.tipoBeneficio);


    if (sessionStorage.withINPC == 'true') {
      // if (this.rt.snapshot.queryParams['withINPC'] == 'true') {
      this.reajustesAdministrativos = false;
    } else {
      this.reajustesAdministrativos = true;
    }

    this.boxId = this.generateBoxId(this.calculo.id, this.tipoCalculo);

    this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    let dataInicio = this.dataInicioBeneficio;


    this.idadeSegurado = this.getIdadeNaDIB(this.dataInicioBeneficio);
    if (this.tipoCalculo === '91_98') {

      this.stringCabecalho = '05/04/1991 e 15/12/1998'
      this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
      this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);

    } else if (this.tipoCalculo === '98_99') {

      this.stringCabecalho = '16/12/1998 e 28/11/1999'
      this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_99);
      this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_99);

    }

    // if (this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999' &&
    //   this.dataInicioBeneficio > this.dataDib99) {
    //   dataInicio = this.dataDib99;
    // }
    // if (this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998' &&
    //   this.dataInicioBeneficio > this.dataDib98) {
    //   dataInicio = this.dataDib98;
    // }

    if (this.tipoCalculo === '91_98') {
      if (this.dataInicioBeneficio > this.dataDib98) {
        dataInicio = this.dataDib98;
      }
    } else if (this.tipoCalculo === '98_99') {
      if (this.dataInicioBeneficio > this.dataDib99) {
        dataInicio = this.dataDib99;
      }
    }

    this.dataAteVigencia = (dataInicio).clone();


    // if (this.rt.snapshot.queryParams['withINPC'] == 'true') {
    //   this.reajustesAdministrativos = false;
    // } else {
    //   this.reajustesAdministrativos = true;
    // }

    // this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    // let dataInicio = this.dataInicioBeneficio;


    // this.idadeSegurado = this.getIdadeNaDIB(this.dataInicioBeneficio);
    // if (this.tipoCalculo == '91_98') {
    //   this.stringCabecalho = 'Entre 05/04/1991 e 15/12/1998'
    //   this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    //   this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);
    //   this.boxId = this.generateBoxId(this.calculo.id, '9198');
    // } else if (this.tipoCalculo == '98_99') {
    //   this.stringCabecalho = 'Entre 16/12/1998 e 28/11/1999'
    //   this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_99);
    //   this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_99);
    //   this.boxId = this.generateBoxId(this.calculo.id, '9899');
    // }

    // // if (this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999' &&
    // //   this.dataInicioBeneficio > this.dataDib99) {
    // //   dataInicio = this.dataDib99;
    // // }
    // // if (this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998' &&
    // //   this.dataInicioBeneficio > this.dataDib98) {
    // //   dataInicio = this.dataDib98;
    // // }

    // if (this.tipoCalculo == '91_98') {
    //   if (this.dataInicioBeneficio > this.dataDib98) {
    //     dataInicio = this.dataDib98;
    //   }
    // } else if (this.tipoCalculo == '98_99') {
    //   if (this.dataInicioBeneficio > this.dataDib99) {
    //     dataInicio = this.dataDib99;
    //   }
    // }


    dataInicio = (dataInicio.clone()).startOf('month');
    let mesesLimite = 0;
    let mesesLimiteTotal = 0;
    if (this.tipoBeneficio === 1 || this.tipoBeneficio === 2) {

      mesesLimite = 18;
      mesesLimiteTotal = 12;

    } else {

      mesesLimite = 48;
      mesesLimiteTotal = 36;

    }

    if (this.calculo.tipo_aposentadoria === 'Entre 05/04/1991 e 15/12/1998') {
      mesesLimite = 48;
      mesesLimiteTotal = 36;
    }

    let dataLimite;
    if (mesesLimite > 0) {

      const decrementarLimite = moment(dataInicio.clone().format('YYYY-MM-DD')).subtract(mesesLimite, 'months');
      dataLimite = moment(decrementarLimite.format('YYYY-MM-DD'));

    } else {

      dataLimite = moment('1994-07-01');

    }


    this.getValoresContribuicao(dataLimite, dataInicio, mesesLimite, mesesLimiteTotal);

  }


  private getValoresContribuicao(dataLimite, dataInicio, mesesLimite, mesesLimiteTotal) {

    if (this.isExits(this.dadosPassoaPasso)
      && this.dadosPassoaPasso.origem === 'passo-a-passo') {

      this.getSalariosContribuicoesContTempoCNIS().then((rst) => {


        this.listaValoresContribuidos = this.getlistaValoresContribuidosPeriodosCT(
          rst,
          dataLimite,
          dataInicio);

        if (this.listaValoresContribuidos.length === 0) {
          // Exibir MSG de erro e encerrar C??lculo.
          this.nenhumaContrib = true;
          this.isUpdating = false;
        } else {

          this.startCalculoApos9198();

        }

      }).catch(error => {
        console.error(error);
      });


    } else {
      this.idSegurado = this.route.snapshot.params['id_segurado'];
      // this.ValoresContribuidos.getByCalculoId(this.idCalculo, dataInicio, dataLimite, mesesLimiteTotal, this.idSegurado)
      this.ValoresContribuidos.getByCalculoId(this.idCalculo, dataInicio, moment('1930-01-01'), mesesLimite, this.idSegurado)
        .then(valorescontribuidos => {

          this.listaValoresContribuidos = valorescontribuidos;

          this.setMesesDeContribuicao(mesesLimiteTotal, mesesLimite);

          if (this.listaValoresContribuidos.length == 0) {
            // Exibir MSG de erro e encerrar C??lculo.
            this.nenhumaContrib = true;
            this.isUpdating = false;
          } else {

            this.startCalculoApos9198();

          }

        });

    }

  }



  private startCalculoApos9198() {

    const primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
    this.Moeda.getByDateRange(primeiraDataTabela, moment())
      .then((moeda: Moeda[]) => {
        this.moeda = moeda;
        let dataReajustesAutomaticos = this.dataInicioBeneficio;
        // if(this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998'){
        //   dataReajustesAutomaticos = this.dataDib98;
        // }else if(this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999'){
        //   dataReajustesAutomaticos = this.dataDib99;
        // }
        if (this.tipoCalculo === '91_98') {
          dataReajustesAutomaticos = this.dataDib98;
        } else if (this.tipoCalculo === '98_99') {
          dataReajustesAutomaticos = this.dataDib99;
        }
        this.ReajusteAutomatico.getByDate(dataReajustesAutomaticos, this.dataInicioBeneficio)
          .then(reajustes => {
            this.reajustesAutomaticos = reajustes;
            this.CarenciaProgressiva.getCarencias()
              .then(carencias => {
                this.carenciasProgressivas = carencias;
                this.calculo91_98(this.erros, this.conclusoes, this.contribuicaoPrimaria, this.contribuicaoSecundaria);
                this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
                this.isUpdating = false;
              });
          });
      });

  }

  /**
   * Ajustar o PBC
   */
  private setMesesDeContribuicao(mesesLimiteTotal, mesesLimite) {

    if (this.listaValoresContribuidos.length <= 0) {
      return 0;
    }

    this.dataUltimaRemuneracaoVigencia = this.listaValoresContribuidos[0].data;
    this.dataLimiteRemuneracaoVigencia = moment(this.dataUltimaRemuneracaoVigencia)
      .subtract(mesesLimite, 'months').format('YYYY-MM-01');

    // PBC completo mesesLimiteTotal
    this.listaValoresContribuidos = this.listaValoresContribuidos.filter(
      (contribuicao, index) =>
      (
        // moment(this.dataUltimaRemuneracaoVigencia).isSameOrAfter(contribuicao.data, 'month')
        moment(contribuicao.data).isBetween(this.dataLimiteRemuneracaoVigencia, this.dataUltimaRemuneracaoVigencia, 'month', '[)')
        && index <= mesesLimite
        && contribuicao.valor_primaria));


    // Filtrar os 36 Salarios de contribui????o
    if (this.listaValoresContribuidos.length > mesesLimiteTotal) {

      this.listaValoresContribuidos = this.listaValoresContribuidos.filter(
        (contribuicao, index) => (index < mesesLimiteTotal));
    }

    return this.listaValoresContribuidos;

  }


  calculo91_98(errorArray, conclusoes, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria) {
    let dib = this.dataInicioBeneficio;
    const dibCurrency = this.loadCurrency(dib);

    // if (this.calculo.tipoAposentadoria == 'Entre 16/12/1998 e 28/11/1999' &&
    //     this.dataInicioBeneficio > this.dataDib99) {
    //     dib = this.dataDib99;
    // }
    // if (this.calculo.tipoAposentadoria == 'Entre 05/04/1991 e 15/12/1998' &&
    //     this.dataInicioBeneficio > this.dataDib98) {
    //     dib = this.dataDib98;
    // }

    if (this.tipoCalculo === '91_98') {
      if (this.dataInicioBeneficio > this.dataDib98) {
        dib = this.dataDib98;
        this.aplicarRejusteAposdib = true;
      }
    } else if (this.tipoCalculo === '98_99') {
      if (this.dataInicioBeneficio > this.dataDib99) {
        dib = this.dataDib99;
        this.aplicarRejusteAposdib = true;
      }
    }

    let dataComparacao = (dib.clone()).startOf('month');
    if (!this.reajustesAdministrativos) {
      dataComparacao = (this.dataInicioBeneficio.clone()).startOf('month');
    }

    const dibPrimeiro = (dib.clone()).startOf('month');

    const moedaComparacao = this.Moeda.getByDate(dataComparacao);
    const moedaDIB = this.Moeda.getByDate(dib);

    this.direito = this.direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria);
    if (!this.direito) {
      return;
    }
    let totalPrimaria = 0;
    let totalSecundaria = 0;

    let contagemSecundaria = 0;
    let contagemPrimaria = 0;
    const tableData = [];
    let index = 0;
    for (const contribuicao of this.listaValoresContribuidos) {

      const valorPrimario = parseFloat(contribuicao.valor_primaria);
      const valorSecundario = parseFloat(contribuicao.valor_secundaria);
      const dataContribuicao = moment(contribuicao.data);
      let contribuicaoPrimaria = 0;

      if (valorPrimario != null) {
        contribuicaoPrimaria = valorPrimario;
      }

      let contribuicaoSecundaria = 0;
      if (valorSecundario != null) {
        contribuicaoSecundaria = valorSecundario;

      }

      if (valorSecundario > 0) {
        this.iscontribuicaoSecundaria = false
      }

      const currency = this.loadCurrency(dataContribuicao); // Definido na se????o de algortimos uteis

      const dataContribuicaoString = dataContribuicao.format('MM/YYYY');
      const contribuicaoPrimariaString = this.formatMoney(valorPrimario, currency.acronimo);
      let contribuicaoSecundariaString = '';

      if (!this.isBlackHole) {
        contribuicaoSecundariaString = this.formatMoney(valorSecundario, currency.acronimo);
      }

      const moeda = this.Moeda.getByDate(dataContribuicao);
      const fator = moeda.fator;
      const fatorLimite = moedaComparacao.fator;
      const fatorCorrigido = fator / fatorLimite;
      const fatorCorrigidoString = this.formatDecimal(fatorCorrigido, 4);

      let valorPrimarioCorrigido = 0;
      let valorSecundarioCorrigido = 0;

      let limiteString = '';
      if (contribuicaoPrimaria !== 0) {

        const valorAjustadoObj = this.limitarTetosEMinimos(contribuicaoPrimaria, dataContribuicao);
        contribuicaoPrimaria = valorAjustadoObj.valor;
        limiteString = valorAjustadoObj.aviso;
        contagemPrimaria++;
      }

      if (contribuicaoSecundaria !== 0) {
        contribuicaoSecundaria = (this.limitarTetosEMinimos(contribuicaoSecundaria, dataContribuicao)).valor;
        contagemSecundaria++;
      }

      valorPrimarioCorrigido = contribuicaoPrimaria * fatorCorrigido;
      valorSecundarioCorrigido = contribuicaoSecundaria * fatorCorrigido;

      const valorPrimarioRevisado = this.convertCurrency(valorPrimarioCorrigido, dataContribuicao, dib);
      const valorSecundarioRevisado = this.convertCurrency(valorSecundarioCorrigido, dataContribuicao, dib);

      totalPrimaria += valorPrimarioRevisado;
      totalSecundaria += valorSecundarioRevisado;

      const contribuicaoPrimariaRevisadaString = this.formatMoney(valorPrimarioRevisado, dibCurrency.acronimo);
      let contribuicaoSecundariaRevisadaString = '';
      if (!this.isBlackHole) {
        contribuicaoSecundariaRevisadaString = this.formatMoney(valorSecundarioRevisado, dibCurrency.acronimo);
        // Acronimo da moeda ap??s a convers??o.
      }
      const line = {
        id: index + 1,
        competencia: dataContribuicaoString,
        contribuicao_primaria: contribuicaoPrimariaString,
        contribuicao_secundaria: contribuicaoSecundariaString,
        fator: fatorCorrigidoString,
        contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
        contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString,
        limite: limiteString
      };
      tableData.push(line);
      index++;
    }


    if (this.tipoBeneficio === 4 || this.tipoBeneficio === 6
      || [5, 1915, 1920, 1925].includes(this.tipoBeneficio)
      || this.tipoBeneficio === 3
      || this.tipoBeneficio === 16) {
      if (contagemPrimaria < 24) {
        contagemPrimaria = 24;
      }
      if (contagemSecundaria < 24) {
        contagemSecundaria = 24;
      }
    }


    const mediaPrimaria = totalPrimaria / contagemPrimaria;
    let mediaSecundaria = 0;
    if (totalSecundaria > 0) {
      mediaSecundaria = totalSecundaria / contagemSecundaria;
    }

    const contribuicaoMedia = mediaPrimaria + mediaSecundaria;

    let rmi = (this.limitarTetosEMinimos(contribuicaoMedia, dataComparacao)).valor;

    const indiceReajuste = contribuicaoMedia / rmi;

    // Coeficiente Calculado na fun????o direitoAposentadoria
    rmi = rmi * (this.coeficiente / 100);

    rmi = (this.limitarTetosEMinimos(rmi, dataComparacao)).valor;

    const rmiValoresAdministrativos = { '91_98': 0, '98_99': 0 };

    rmiValoresAdministrativos[this.tipoCalculo] = rmi;

    // if(this.reajustesAdministrativos &&
    //   ((this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999' && this.dataInicioBeneficio >= this.dataDib99) ||
    //    (this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998' && this.dataInicioBeneficio >= this.dataDib98))){
    //        rmiValoresAdministrativos = this.getValoresAdministrativos(rmiValoresAdministrativos);
    // }


    if (this.reajustesAdministrativos &&
      ((this.tipoCalculo === '91_98' && this.dataInicioBeneficio >= this.dataDib99) ||
        (this.tipoCalculo === '98_99' && this.dataInicioBeneficio >= this.dataDib98))) {

      rmiValoresAdministrativos[this.tipoCalculo] = this.getValoresAdministrativos(rmiValoresAdministrativos[this.tipoCalculo]);

    }

    if (this.tipoBeneficio === 17 || // AuxilioAcidente30
      this.tipoBeneficio === 18 || // AuxilioAcidente40
      this.tipoBeneficio === 7 || // AuxilioAcidente50
      this.tipoBeneficio === 19) {  // AuxilioAcidente60
      let fatorAuxilio;
      switch (this.tipoBeneficio) {
        case 17:
          fatorAuxilio = 0.3;
          break;
        case 18:
          fatorAuxilio = 0.4;
          break;
        case 7:
          fatorAuxilio = 0.5;
          break;
        case 19:
          fatorAuxilio = 0.6;
          break;
      }
      const moedaAuxilio = this.Moeda.getByDate(this.dataInicioBeneficio);
      const salMinimo = moedaAuxilio.salario_minimo;

      if (contribuicaoMedia > rmiValoresAdministrativos[this.tipoCalculo]) {
        rmiValoresAdministrativos[this.tipoCalculo] = contribuicaoMedia * fatorAuxilio;
      } else {
        rmiValoresAdministrativos[this.tipoCalculo] = salMinimo * fatorAuxilio;
      }

      if (contribuicaoMedia > rmi) {
        rmi = contribuicaoMedia * fatorAuxilio;
      } else {
        rmi = rmi * fatorAuxilio;
      }
    }

    const somaContribuicoes = totalPrimaria + totalSecundaria;

    if (this.reajustesAdministrativos) {

      this.calculo.soma_contribuicao = somaContribuicoes;
      this.calculo.valor_beneficio = rmi;
      this.valorBeneficio[this.tipoCalculo] = rmi;

      this.CalculoRgpsService.update(this.calculo)
    }

    const currency = this.loadCurrency(dib);

    // Conclus??es abaixo da tabela:
    conclusoes.total_contribuicoes_primarias = this.formatMoney(totalPrimaria, currency.acronimo);
    conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaPrimaria, currency.acronimo);
    conclusoes.divisor_calculo_media = contagemPrimaria;

    if (totalSecundaria > 0) {
      conclusoes.total_contribuicoes_secundarias = this.formatMoney(totalSecundaria, currency.acronimo);
    }
    if (mediaSecundaria > 0) {
      conclusoes.media_contribuicoes_secundarias = this.formatMoney(mediaSecundaria, currency.acronimo);
      conclusoes.divisor_calculo_media_secundaria = contagemSecundaria;
    }

    conclusoes.media_contribuicoes = this.formatMoney(contribuicaoMedia, currency.acronimo);
    conclusoes.coeficiente = this.coeficiente;
    conclusoes.indice_reajuste_teto = this.formatDecimal(indiceReajuste, 6);
    conclusoes.salario_minimo = this.formatMoney(moedaComparacao.salario_minimo, currency.acronimo);
    conclusoes.teto = this.formatMoney(moedaComparacao.teto, currency.acronimo);
    conclusoes.renda_mensal_inicial = this.formatMoney(rmi, currency.acronimo);
    conclusoes.renda_mensal_inicial_data_dib = this.formatMoney(rmiValoresAdministrativos[this.tipoCalculo], currency.acronimo);
    this.valorExportacao = this.formatDecimal(rmiValoresAdministrativos[this.tipoCalculo], 2).replace(',', '.');
    this.tableData = tableData;
    // this.tableOptions = {
    //   ...this.tableOptions,
    //   data: this.tableData,
    // }

    this.tableOptions = {
      colReorder: false,
      paging: false,
      searching: false,
      ordering: false,
      bInfo: false,
      data: this.tableData,
      columns: [
        { data: 'id' },
        { data: 'competencia' },
        { data: 'fator' },
        { data: 'contribuicao_primaria' },
        { data: 'contribuicao_secundaria', visible: this.iscontribuicaoSecundaria },
        { data: 'contribuicao_primaria_revisada' },
        { data: 'contribuicao_secundaria_revisada', visible: this.iscontribuicaoSecundaria },
        { data: 'limite' },
      ],
      columnDefs: [
        { 'width': '15rem', 'targets': [7] },
        {
          'targets': [0, 1, 2, 3, 4, 5],
          'className': 'text-center'
        }
      ]
    };


    if (this.aplicarRejusteAposdib) {
      setTimeout(() => {
        this.mostrarReajustesAdministrativos(this.boxId);
      }, 2000);
    }


  }


  private getTempoTotal98() {

    let totalContribuicao = 0;
    const tempoContribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);

    // totalContribuicao = ((tempoContribuicaoPrimaria.anos * 365) +
    //   (tempoContribuicaoPrimaria.meses * 30) +
    //   (tempoContribuicaoPrimaria.dias * 1));
    // totalContribuicao /= 365;

    totalContribuicao = ((tempoContribuicaoPrimaria.anos * 365)
      + (tempoContribuicaoPrimaria.meses * 30)
      + tempoContribuicaoPrimaria.dias) / 365;

    // totalContribuicao = tempoContribuicaoPrimaria.anos +
    //   (tempoContribuicaoPrimaria.meses / 12) + (tempoContribuicaoPrimaria.dias) / 360;

    return totalContribuicao;
  }

  direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria) {

    const idadeDoSegurado = this.idadeSegurado;
    const redutorProfessor = (this.tipoBeneficio === 6) ? 5 : 0;
    const redutorSexo = (this.segurado.sexo === 'm') ? 0 : 5;
    const anosSecundaria = parseFloat(tempoContribuicaoSecundaria.anos);

    const anosPrimaria = ((parseFloat(tempoContribuicaoPrimaria.anos) * 365) +
      (parseFloat(tempoContribuicaoPrimaria.meses) * 30) + parseFloat(tempoContribuicaoPrimaria.dias)) / 365;

    const anosContribuicao = anosPrimaria;

    this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, false, dib);

    const totalContribuicao98 = this.getTempoTotal98();

    let direito = true;
    let idadeMinima = true;
    let extra = 0;
    let toll;

    const erroString = '';
    if (this.tipoBeneficio === 4 || this.tipoBeneficio === 6) {

      direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 0);

      if (!direito) {
        errorArray.push('N??O POSSUI direito ao benef??cio INTEGRAL.');

        if (dib <= this.dataDib98) {

          direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 5);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, true, dib);

        } else {

          extra = this.calcularExtra(totalContribuicao98, redutorSexo);
          toll = this.calcularToll(totalContribuicao98, 0.4, 5, redutorSexo);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, true, dib);
          direito = this.verificarIdadeNecessaria(
            this.dataDib99.diff(moment(this.segurado.data_nascimento, 'DD/MM/YYYY'), 'years')
            , 7, 0, redutorSexo, errorArray);

          if (this.tipoCalculo === '98_99'
            && this.dataInicioBeneficio >= this.dataDib98
            && sessionStorage.getItem('direito98') !== null
            && !direito) {
            direito = true;
          }

          direito = direito && this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra + 5);
        }


        const contribuicao = 35 - redutorProfessor - redutorSexo - anosContribuicao;
        const tempoFracionado = this.tratarTempoFracionado(contribuicao); // Separar o tempo de contribuicao em anos, meses e dias

        if (direito) {
          // Exibir Mensagem de beneficio Proporcional, com o tempo faltante;
          // "POSSUI direito ao benef??cio proporcional."
          // "Falta(m) 'tempoFracionado' para possuir o direito ao benef??cio INTEGRAL."
          errorArray.push('POSSUI direito ao benef??cio proporcional. Falta(m) ' +
            tempoFracionado + ' para possuir o direito ao benef??cio INTEGRAL.');
        } else {
          // Exibir Mensagem de beneficio nao concedido.
          // Falta(m) 'tempoFracionado' para completar o tempo de servi??o necess??rio para o benef??cio INTEGRAL.
          errorArray.push('Falta(m) ' + tempoFracionado + ' para completar o tempo de servi??o necess??rio para o benef??cio INTEGRAL.');
          // if (totalContribuicao98 > 0 && errorArray.length == 0) {
          if (totalContribuicao98 > 0 && this.tipoCalculo === '98_99') {
            const tempo = 35 - redutorProfessor - (extra + 5) - anosContribuicao;
            const tempoProporcional = this.tratarTempoFracionado(tempo);
            // Exibir Mensagem com o tempo faltante para o beneficio proporcioanl;
            // Falta(m) 'tempoProporcional' para completar o tempo de servi??o necess??rio para o benef??cio PROPORCIONAL.
            errorArray.push('Falta(m) ' +
              tempoProporcional + ' para completar o tempo de servi??o necess??rio para o benef??cio PROPORCIONAL.');
          }
        }
      }

      sessionStorage.removeItem('direito98');
      if (this.tipoCalculo === '91_98' && direito) {
        sessionStorage.setItem('direito98', '98ok');
      }


    } else if (this.tipoBeneficio === 3) {
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
      if (!idadeMinima) {
        return false;
      }
      if (!this.verificarCarencia(-5, redutorProfessor, redutorSexo, errorArray)) {
        return false;
      }

    } else if ([5, 1915, 1920, 1925].includes(this.tipoBeneficio)) {

      // Aposentadoria Especial
      const parametrosParaVerificarTempoDeServico = { 5: 20, 1915: 20, 1920: 15, 1925: 10 }
      const valorExtra = parametrosParaVerificarTempoDeServico[this.tipoBeneficio];

      direito = this.verificarTempoDeServico(anosContribuicao, 0, 0, valorExtra);

      if (!direito) {
        errorArray.push('N??o possui direito ao benef??cio de aposentadoria especial.');
      }

    } else if (this.tipoBeneficio === 16) {
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
      if (!idadeMinima) {
        return false;
      }
      if (!this.verificarCarencia(0, redutorProfessor, redutorSexo, errorArray)) {
        return false;
      }
    } else if (this.tipoBeneficio === 25) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 10);
      if (!direito) {
        errorArray.push('N??o h?? direito ao Benef??cio');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
    } else if (this.tipoBeneficio === 26) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 6);
      if (!direito) {
        errorArray.push('N??o h?? direito ao Benef??cio');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
    } else if (this.tipoBeneficio === 27) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 2);
      if (!direito) {
        errorArray.push('N??o h?? direito ao Benef??cio');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
    } else if (this.tipoBeneficio === 28) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 20);
      if (!direito) {
        errorArray.push('N??o h?? direito ao Benef??cio');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
      if (!this.verificarIdadeMinima(idadeDoSegurado, errorArray)) {
        errorArray.push('N??o h?? direito ao Benef??cio');
        return false; // Exibir Mensagem de erro com a idade faltando;
      }
    }
    return direito;
  }

  calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, proporcional, dib) {
    let coeficienteAux = 0;
    let porcentagem = 0.06;
    let coeficienteAux2 = 100;

    if (dib > this.dataDib98) {
      porcentagem = 0.05;
    }

    if (proporcional) {
      const extra = this.tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, 5);
      coeficienteAux2 = 100 * this.coeficienteProporcional(extra, porcentagem, toll);
    }

    anosContribuicao = Math.floor(anosContribuicao)

    switch (this.tipoBeneficio) {
      // Aux??lio Doen??a Previdenci??rio
      case 1:
        if (dib >= this.dataLei9032) {
          coeficienteAux = 91;
        } else if (dib >= this.dataLei8213) {
          coeficienteAux = 80 + anosContribuicao;
          if (coeficienteAux > 92) {
            coeficienteAux = 92;
          }
        } else {
          coeficienteAux = 80 + anosContribuicao;
        }
        break;
      // Aposentadoria por invalidez previd??nci??ria
      case 2:
        if (dib >= this.dataLei9032) {
          coeficienteAux = 100;
        } else {
          coeficienteAux = 80 + anosContribuicao;
        }
        break;
      // Aponsentadoria por idade trabalhador Urbano ou Rural
      case 3:
        coeficienteAux = 70 + anosContribuicao;
        break;
      // Aposentadoria por tempo de contribui????o
      case 4:
        coeficienteAux = coeficienteAux2;
        break;
      // Aposentadoria Especial
      case 5:
        if (dib >= this.dataLei9032) {
          coeficienteAux = 100;
        } else {
          coeficienteAux = 85 + anosContribuicao;
        }
        break;
      // Aposentadoria por tempo de servi??o de professor
      case 6:
        coeficienteAux = coeficienteAux2;
        break;
      // Aux??lio Acidente Previdenci??rio 50%
      case 7:
        coeficienteAux = 50;
        break;
      // Aponsentadoria por idade trabalhador Rural
      case 16:
        coeficienteAux = 70 + anosContribuicao;
        break;
      // Aux??lio Acidente Previdenci??rio 30%
      case 17:
        coeficienteAux = 30;
        break;
      // Aux??lio Acidente Previdenci??rio 40%
      case 18:
        coeficienteAux = 40;
        break;
      // Aux??lio Acidente Previdenci??rio 60%
      case 19:
        coeficienteAux = 60;
        break;
      // Pessoa com deficiencia Grave 100%
      case 25:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia Moderada 100%
      case 26:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia Leve 100%
      case 27:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia por Idade 70%
      case 28:
        coeficienteAux = 70 + anosContribuicao;
        break;
    }
    coeficienteAux = (coeficienteAux > 100) ? 100 : coeficienteAux;
    return coeficienteAux;
  }

  tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, extra) {
    const retVal = anosContribuicao - (35 - redutorProfessor - redutorSexo - extra);
    return retVal;
  }

  verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra) {
    const tempoNecessario = 35 - redutorProfessor - redutorSexo - extra;
    if (Math.trunc(anosContribuicao) < Math.trunc(tempoNecessario)) {
      return false;
    }
    return true;
  }


  coeficienteProporcional(extra, porcentagem, toll) {
    let coeficienteProporcional = 0.7 + (Math.trunc(extra - toll) * porcentagem);
    coeficienteProporcional = (coeficienteProporcional > 1) ? 1 : coeficienteProporcional;
    coeficienteProporcional = (coeficienteProporcional < 0.7) ? 0.7 : coeficienteProporcional;
    return coeficienteProporcional;
  }

  verificarIdadeMinima(idade, errorArray) {
    let temIdadeMinima = true;
    let idadeMinima;
    if (this.tipoBeneficio === 3) {
      if (this.segurado.sexo === 'm' && this.idadeSegurado < 65) {
        idadeMinima = 65;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo === 'f' && this.idadeSegurado < 60) {
        idadeMinima = 60;
        temIdadeMinima = false;
      }
    } else if (this.tipoBeneficio === 16 || this.tipoBeneficio === 28) {
      if (this.segurado.sexo === 'm' && this.idadeSegurado < 60) {
        idadeMinima = 60;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo === 'f' && this.idadeSegurado < 55) {
        idadeMinima = 55;
        temIdadeMinima = false;
      }
    }

    if (!temIdadeMinima) {
      errorArray.push('O segurado n??o tem a idade m??nima (' +
        idadeMinima + ' anos) para se aposentar por idade. Falta(m) ' +
        (idadeMinima - this.idadeSegurado) + ' ano(s) para atingir a idade m??nima.');
    }
    return temIdadeMinima;
  }

  getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo) {
    const idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    const anoNecessario = (moment(this.segurado.data_nascimento, 'DD/MM/YYYY')).add(idadeNecessaria, 'years');
    return anoNecessario.year();
  }

  getValoresAdministrativos(rmi) {
    let valorBeneficio = rmi;
    let dataAnterior = null;
    let dataCorrente = null;

    for (const reajusteAutomatico of this.reajustesAutomaticos) {

      if (dataAnterior == null) {
        dataAnterior = moment(reajusteAutomatico.data_reajuste);
      } else {
        dataAnterior = dataCorrente;
      }

      dataCorrente = moment(reajusteAutomatico.data_reajuste);

      const reajuste = (reajusteAutomatico.indice != null) ? reajusteAutomatico.indice : 1;
      valorBeneficio = this.convertCurrency(valorBeneficio, dataAnterior, dataCorrente);

      if (this.reajustesAdministrativos) {
        valorBeneficio = valorBeneficio * reajuste;
      }

      valorBeneficio = (Number(valorBeneficio) < Number(reajusteAutomatico.salario_minimo)) ?
        reajusteAutomatico.salario_minimo : valorBeneficio;
      valorBeneficio = (Number(valorBeneficio) > Number(reajusteAutomatico.teto)) ?
        reajusteAutomatico.teto : valorBeneficio;

    }
    return valorBeneficio;
  }

  verificarCarencia(redutorIdade, redutorProfessor, redutorSexo, errorArray) {
    if (this.tipoBeneficio === 3 || this.tipoBeneficio === 16) {
      let mesesCarencia = 180;
      if (moment(this.segurado.data_filiacao, 'DD/MM/YYYY') < this.dataLei8213) { // Verificar se a data de filia????o existe
        const anoNecessario = this.getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo)
        const carenciaProgressiva = this.CarenciaProgressiva.getCarencia(anoNecessario);
        if (carenciaProgressiva !== 0) {
          mesesCarencia = carenciaProgressiva;
        } else if (anoNecessario < 1991) {
          mesesCarencia = 60;
        }
      }

      if (this.calculo.carencia < mesesCarencia) {
        const erroCarencia = 'Falta(m) ' + (mesesCarencia - this.calculo.carencia) + ' m??s(es) para a car??ncia necess??ria.';
        errorArray.push(erroCarencia);
        return false;
      }
    }
    return true;
  }

  calcularExtra(tempoServico, redutorSexo) {
    let extra;
    if (this.tipoBeneficio === 6) {
      extra = this.calcularToll(tempoServico, 0.4, 5, redutorSexo) + this.calcularBonus(tempoServico) * (-1);
    } else {
      extra = this.calcularToll(tempoServico, 0.4, 5, redutorSexo) * (-1);
    }
    return extra;
  }

  calcularToll(tempoDeServico, porcentagem, proporcional, redutorSexo) {
    let toll = ((35 - proporcional - redutorSexo) - tempoDeServico) * porcentagem;
    toll = (toll < 0) ? 0 : toll;
    return toll;
  }

  verificarIdadeNecessaria(idade, redutorIdade, redutorProfessor, redutorSexo, errorArray) {

    const idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    const direito = idade > idadeNecessaria;
    if (!direito) {
      errorArray.push('Falta(m) ' + (idadeNecessaria - idade) + ' ano(s) para atingir a idade m??nima.');
    }
    return direito;
  }

  tratarTempoFracionado(time) {
    const year = Math.floor(time);
    const month = Math.round((time - year) * 12);

    let returnStr = '';
    if (year !== 0) {
      returnStr += year + ' ano(s)';
    }
    if (month !== 0 && year !== 0) {
      returnStr += ' e ';
    }
    if (month !== 0) {
      returnStr += month + ' mes(es)';
    }
    if (month === 0 && year === 0) {
      returnStr = ' 0 ano(s) ';
    }
    if (year < 0) {
      returnStr = '';
    }
    return returnStr;
  }

  calcularBonus(tempoServico) {
    let bonus;
    if (this.segurado.sexo === 'm') {
      bonus = 17 / 100;
    } else {
      bonus = 20 / 100;
    }
    bonus = bonus * tempoServico;
    return bonus;
  }

  calcularComINPC() {
    // window.location.href =
    // (this.reajustesAdministrativos) ? window.location.href.split('?')[0] + '?withINPC=true' : window.location.href.split('?')[0];

    const withINPC = (sessionStorage.withINPC !== 'false') ? 'false' : 'true';
    sessionStorage.setItem('withINPC', withINPC);

    window.location.reload();
  }

  limitarTetosEMinimos(valor, data) {
    const moeda = this.Moeda.getByDate(data);
    const salarioMinimo = moeda.salario_minimo;
    const tetoSalarial = moeda.teto;
    let avisoString = '';
    let valorRetorno = valor;

    if (valor < salarioMinimo) {
      valorRetorno = salarioMinimo;
      avisoString = 'LIMITADO AO M??NIMO'
    } else if (valor > tetoSalarial) {
      valorRetorno = tetoSalarial;
      avisoString = 'LIMITADO AO TETO'
    }
    return { valor: valorRetorno, aviso: avisoString };
  }

  mostrarReajustesAdministrativos(tableId) {
    // if (this.showReajustesAdministrativos) {
    //   document.getElementById(tableId).scrollIntoView();
    //   return;
    // }

    let dataInicio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
    let dataLimite = moment();

    if (this.tipoCalculo === '91_98') {

      if (this.dataInicioBeneficio > this.dataDib98) {
        dataInicio = this.dataDib98;
        dataLimite = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
      }

    } else if (this.tipoCalculo === '98_99') {

      if (this.dataInicioBeneficio > this.dataDib99) {
        dataInicio = this.dataDib99;
        dataLimite = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
      }

    }

    this.ReajusteAutomatico.getByDate(dataInicio, dataLimite)
      .then((reajustes: ReajusteAutomatico[]) => {

        const reajustesAutomaticos = reajustes;
        // let valorBeneficio = (this.calculo.valor_beneficio) ? parseFloat(this.calculo.valor_beneficio) : 0;

        let valorBeneficio = (this.valorBeneficio[this.tipoCalculo]) ? parseFloat(this.valorBeneficio[this.tipoCalculo]) : 0;
        let dataPrevia = moment(reajustesAutomaticos[0].data_reajuste);
        let dataCorrente = dataInicio;


        for (const reajusteAutomatico of reajustesAutomaticos) {
          dataCorrente = moment(reajusteAutomatico.data_reajuste);
          const siglaMoedaDataCorrente = this.loadCurrency(dataCorrente).acronimo;
          const teto = parseFloat(reajusteAutomatico.teto);
          let minimo = parseFloat(reajusteAutomatico.salario_minimo);
          if (this.tipoBeneficio === 17) {
            minimo *= 0.3;
          } else if (this.tipoBeneficio === 18) {
            minimo *= 0.4;
          } else if (this.tipoBeneficio === 7) {
            minimo *= 0.5;
          } else if (this.tipoBeneficio === 19) {
            minimo *= 0.6;
          }
          let reajuste = reajusteAutomatico.indice != null ? parseFloat(reajusteAutomatico.indice) : 1;

          if (dataCorrente.year() === 2006 && dataCorrente.month() === 7) {
            reajuste = 1.000096;
          }

          valorBeneficio *= reajuste;
          valorBeneficio = this.convertCurrency(valorBeneficio, dataPrevia, dataCorrente);

          let limit = '-';
          if (valorBeneficio < minimo) {
            valorBeneficio = minimo;
            limit = 'M'
          }
          if (valorBeneficio > teto) {
            valorBeneficio = teto;
            limit = 'T'
          }
          const line = {
            competencia: dataCorrente.format('MM/YYYY'),
            reajuste: this.formatDecimal(reajuste, 6),
            beneficio: this.formatMoney(valorBeneficio, siglaMoedaDataCorrente),
            limite: limit
          };
          this.reajustesAdministrativosTableData[this.tipoCalculo].push(line);
          dataPrevia = dataCorrente;
        }

        this.reajustesAdministrativosTableOptions[this.tipoCalculo] = {
          ...this.reajustesAdministrativosTableOptions[this.tipoCalculo],
          data: this.reajustesAdministrativosTableData[this.tipoCalculo],
        }

        this.showReajustesAdministrativos = true;
        document.getElementById(tableId).scrollIntoView();
      });
  }

}
