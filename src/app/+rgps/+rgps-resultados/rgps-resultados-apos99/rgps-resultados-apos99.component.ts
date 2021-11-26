import { Component, OnInit, Input } from '@angular/core';
import { ExpectativaVida } from '../ExpectativaVida.model';
import { ExpectativaVidaService } from '../ExpectativaVida.service';
import { ReajusteAutomatico } from '../ReajusteAutomatico.model';
import { ReajusteAutomaticoService } from '../ReajusteAutomatico.service';
import { ValorContribuidoService } from '../../+rgps-valores-contribuidos/ValorContribuido.service'
import { CarenciaProgressiva } from '../CarenciaProgressiva.model';
import { CarenciaProgressivaService } from '../CarenciaProgressiva.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalculoRgpsService } from '../../+rgps-calculos/CalculoRgps.service';
import { SeguradoService } from '../../+rgps-segurados/SeguradoRgps.service';
import { Moeda } from '../../../services/Moeda.model';
import { MoedaService } from '../../../services/Moeda.service';
import { RgpsResultadosComponent } from '../rgps-resultados.component'
import * as moment from 'moment';
import { DefinicaoTempo } from 'app/shared/functions/definicao-tempo';

@Component({
  selector: 'app-rgps-resultados-apos99',
  templateUrl: `./rgps-resultados-apos99.component.html`,
  styleUrls: ['./rgps-resultados-apos99.component.css']
})
export class RgpsResultadosApos99Component extends RgpsResultadosComponent implements OnInit {

  @Input() calculo;
  @Input() segurado;
  @Input() dadosPassoaPasso;
  @Input() listaValoresContribuidosPeriodosCT;
  @Input() numResultado;

  public boxId;
  public dataFiliacao;
  public idadeSegurado;
  public idCalculo;
  public stringCabecalho;
  public contribuicaoTotal;
  public isUpdating = false;
  public limited;
  private fatorPrevidenciario;
  private fatorPrevidenciarioAntesDaVerificacao;
  private SMBFatorPrevidenciarioProgressivo = { formula: '', parcela1: 0, parcela2: 0, total: 0 };
  private isfatorPrevidenciarioProgressivo = false;
  private isfatorPrevidenciario = false;
  private salarioBeneficio;
  private rmi8090 = undefined;
  private rmi8595 = undefined;
  public isProportional = false;
  public nenhumaContrib = false;
  public dataInicioBeneficio;
  public dataInicioBeneficioExport;
  public dataInicioBeneficioString;
  public aplicarRejusteAposAposEC103 = false;
  public tipoBeneficio;
  public tipoBeneficioPosReforma;
  public listaValoresContribuidos;
  public valorExportacao;
  public moeda;
  public coeficiente;
  public idadeFracionada;
  public expectativasVida;
  public reajustesAutomaticos;
  public carenciasProgressivas;
  public tableData = [];
  public conclusoes = [];
  public contribuicaoPrimaria = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundaria = { anos: 0, meses: 0, dias: 0 };
  public iscontribuicaoSecundaria = false;
  public erros = [];
  public withMemo = false;
  public withIN45 = true;
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
      { data: 'indice_corrigido' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria', visible: this.iscontribuicaoSecundaria },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada', visible: this.iscontribuicaoSecundaria },
      { data: 'limite', class: '' },
    ],
    columnDefs: [
      { 'width': '15rem', 'targets': [7] },
      {
        'targets': [0, 1, 2, 3, 4, 5, 6],
        'className': 'text-center'
      }
    ]
  };

  public formula_expectativa_sobrevida = '';
  public formula_fator = '';
  public showReajustesAdministrativos = false;
  public reajustesAdministrativosTableData = [];
  public reajustesAdministrativosTableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.reajustesAdministrativosTableData,
    columns: [
      { data: 'competencia' },
      { data: 'reajuste' },
      { data: 'beneficio' },
      { data: 'limite' },
    ]
  };

  public isDivisorMinimo = true;
  public msgDivisorMinimo = '';
  // IN77
  public exibirIN77 = false;
  public naoAplicarIN77 = true;
  public irtRejusteAdministrativo = 0;
  public msgProporcionalAteEC1032019 = '';
  public msgIntegralAteEC1032019 = '';
  public isRegraPontos = false;
  public totalMedia12Contribuicoes = 0;


  constructor(private ExpectativaVida: ExpectativaVidaService,
    protected route: ActivatedRoute,
    private ReajusteAutomatico: ReajusteAutomaticoService,
    protected ValoresContribuidos: ValorContribuidoService,
    private CarenciaProgressiva: CarenciaProgressivaService,
    private CalculoRgpsService: CalculoRgpsService,
    private Moeda: MoedaService) {
    super(null, route, null, null, null, null, null, null);
  }

  ngOnInit() {

    this.tableData = [];
    this.conclusoes = [];
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
        { data: 'indice_corrigido' },
        { data: 'contribuicao_primaria' },
        { data: 'contribuicao_secundaria', visible: this.iscontribuicaoSecundaria },
        { data: 'contribuicao_primaria_revisada' },
        { data: 'contribuicao_secundaria_revisada', visible: this.iscontribuicaoSecundaria },
        { data: 'limite' },
      ],
      columnDefs: [
        { 'width': '15rem', 'targets': [7] },
        {
          'targets': [0, 1, 2, 3, 4, 5, 6],
          'className': 'text-center'
        }
      ]
    };


    this.boxId = this.generateBoxId(this.calculo.id, '99');
    this.isUpdating = true;
    this.dataFiliacao = this.getDataFiliacao();

    this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    this.dataInicioBeneficioExport = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');

    // direito adquirido após a EC103
    if (this.dataInicioBeneficio.isSameOrAfter(this.dataPec062019)) {

      this.dataInicioBeneficio = moment('13/11/2019', 'DD/MM/YYYY');
      this.dataInicioBeneficioExport = moment('13/11/2019', 'DD/MM/YYYY');
      this.aplicarRejusteAposAposEC103 = true;

    }

    this.dataInicioBeneficioString = this.dataInicioBeneficio.format('DD/MM/YYYY');

    this.idadeSegurado = this.getIdadeNaDIB(this.dataInicioBeneficio);
    this.idadeFracionada = this.getIdadeFracionada();
    this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_atual);
    this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_atual);
    this.idCalculo = this.calculo.id;
    this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);
    this.tipoBeneficioPosReforma = this.getEspecieBeneficio(this.calculo); // ajuste especial regra de acesso
    // Ajuste para novos tipos conforme reforma
    this.tipoBeneficio = this.getEspecieReforma(this.tipoBeneficio);
    // aplicação divisor mínimo
    //  this.isDivisorMinimo = (this.calculo.divisor_minimo !== 1) ? true : false;
    this.isDivisorMinimo = (!this.calculo.divisor_minimo) ? true : false;


    this.msgDivisorMinimo = '';
    // this.exibirIN77 = false;


    let dataInicio = (this.dataInicioBeneficio.clone()).startOf('month');
    this.stringCabecalho = 'Entre  29/11/1999 a 13/11/2019'

    if (this.dataInicioBeneficio >= this.dataPec062019) {
      dataInicio = this.dataPec062019.startOf('month'); // ate a PEC06/2019
    }

    // pbc da vida toda
    this.pbcCompleto = (this.route.snapshot.params['pbc'] === 'pbc')
      || (this.isExits(this.dadosPassoaPasso.pbcFull) && this.dadosPassoaPasso.pbcFull === 'pbc');


    const dataLimite = (this.pbcCompleto) ? moment('1930-01-01') : moment('1994-07-01');

    // indices de correção pbc da vida toda

    this.getValoresContribuicao(dataInicio, dataLimite)

  }

  private getValoresContribuicao(dataInicio, dataLimite) {


    if (this.isExits(this.dadosPassoaPasso)
      && this.dadosPassoaPasso.origem === 'passo-a-passo') {

      this.getSalariosContribuicoesContTempoCNIS().then((rst) => {

        this.listaValoresContribuidos = this.getlistaValoresContribuidosPeriodosCT(
          rst,
          dataLimite,
          dataInicio);

        // console.log(this.listaValoresContribuidos);

        if (this.listaValoresContribuidos.length === 0) {

          // Exibir MSG de erro e encerrar Cálculo.
          this.nenhumaContrib = true;
          this.isUpdating = false;

        } else {

          this.startCalculoApos99();

        }

      }).catch(error => {
        console.error(error);
      });


    } else {

      this.idSegurado = this.route.snapshot.params['id_segurado'];
      this.ValoresContribuidos.getByCalculoId(this.idCalculo, dataInicio, dataLimite, 0, this.idSegurado)
        .then(valorescontribuidos => {

          this.listaValoresContribuidos = valorescontribuidos;
          if (this.listaValoresContribuidos.length === 0) {

            // Exibir MSG de erro e encerrar Cálculo.
            this.nenhumaContrib = true;
            this.isUpdating = false;

          } else {

            this.startCalculoApos99();

          }

        });

    }

  }

  private startCalculoApos99() {

    const primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
    this.Moeda.getByDateRange(primeiraDataTabela, moment())
      .then((moeda: Moeda[]) => {
        this.moeda = moeda;
        const dataReajustesAutomaticos = this.dataInicioBeneficio;
        this.ReajusteAutomatico.getByDate(dataReajustesAutomaticos, this.dataInicioBeneficio)
          .then(reajustes => {
            this.reajustesAutomaticos = reajustes;
            this.ExpectativaVida.getByIdade(Math.floor(this.idadeFracionada))
              .then(expectativas => {
                this.expectativasVida = expectativas;
                this.CarenciaProgressiva.getCarencias()
                  .then(carencias => {
                    this.carenciasProgressivas = carencias;
                    this.calculo_apos_99(this.erros, this.conclusoes, this.contribuicaoPrimaria, this.contribuicaoSecundaria);
                    this.isUpdating = false;
                  });
              });
          });
      });

  }


  calculo_apos_99(errorArray, conclusoes, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria) {
    let dib = this.dataInicioBeneficio;
    let dibCurrency = this.loadCurrency(dib);
    let moedaDib = this.Moeda.getByDate(dib);
    let dataComparacao = (dib.clone()).startOf('month');
    let moedaComparacao = (dataComparacao.isSameOrBefore(moment(), 'month')) ? this.Moeda.getByDate(dataComparacao) : undefined;

    if (!this.direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria)) {
      return;
    }

    let totalContribuicaoPrimaria = 0;
    let totalContribuicaoSecundaria = 0;
    let totalContribuicaoPrimaria12 = 0;
    let totalContribuicaoSecundaria12 = 0;

    let contadorSecundario = 0;
    let contadorPrimario = 0;

    let primeirasContribuicoes = [];
    let tabelaIndex = 0;
    let tableData = [];
    let idString = 0;

    for (const contribuicao of this.listaValoresContribuidos) {
      let contribuicaoPrimaria = parseFloat(contribuicao.valor_primaria);
      let contribuicaoSecundaria = parseFloat(contribuicao.valor_secundaria);
      let dataContribuicao = moment(contribuicao.data);
      let currency = this.loadCurrency(dataContribuicao);
      let sc_mm_ajustar = true;

      if ((this.isExits(this.dadosPassoaPasso)
        && this.dadosPassoaPasso.origem === 'passo-a-passo')) {

        sc_mm_ajustar = (contribuicao.sc_mm_ajustar === 1);

        this.calculo.somar_contribuicao_secundaria = (this.isExits(this.dadosPassoaPasso.somarSecundaria)
          && this.dadosPassoaPasso.somarSecundaria === 'somar');

      }

      if (
        this.dataInicioBeneficioExport.isSameOrAfter('2019-06-18')
        || this.calculo.somar_contribuicao_secundaria
      ) {
        contribuicaoPrimaria += contribuicaoSecundaria;
        contribuicaoSecundaria = 0;
      }


      if (contribuicaoSecundaria > 0) {
        this.iscontribuicaoSecundaria = true;
      }

      idString += 1; // tabela['id'] = contadorPrimario;

      let dataContribuicaoString = dataContribuicao.format('MM/YYYY'); // tabela['dataContribuicao'] = contribuicao.dataContribuicao;
      // let contribuicaoPrimariaString = this.formatMoney(contribuicaoPrimaria, currency.acronimo); // tabela['Contribuicao Primaria'] = currency.acronimo + contribuicaoPrimaria;
      // let contribuicaoSecundariaString = this.formatMoney(contribuicaoSecundaria, currency.acronimo); // tabela['Contribuicao Secundaria'] = currency.acronimo + contribuicaoSecundaria;



      const moedaContribuicao = (dataContribuicao.isSameOrBefore(moment(), 'month')) ? this.Moeda.getByDate(dataContribuicao) : undefined;


      let fator = 1;
      let fatorLimite = 1;

      // definição de indices de correção
      if ((!this.pbcCompleto)) {

        fator = (moedaContribuicao) ? moedaContribuicao.fator : 1;
        fatorLimite = (moedaComparacao) ? moedaComparacao.fator : 1;

      } else {

        // this.pbcCompletoIndices = (this.isExits(this.route.snapshot.params['correcao_pbc'])) ?
        // this.route.snapshot.params['correcao_pbc'] : 'inpc1084';

        switch (this.getPbcCompletoIndices()) {
          case 'inpc1085':
            fator = (moedaContribuicao) ? moedaContribuicao.fator_pbc_inpc1085ortn : 1;
            fatorLimite = (moedaComparacao) ? moedaComparacao.fator_pbc_inpc1085ortn : 1;
            break;
          case 'inpc1088':
            fator = (moedaContribuicao) ? moedaContribuicao.fator_pbc_inpc1088ortn : 1;
            fatorLimite = (moedaComparacao) ? moedaComparacao.fator_pbc_inpc1088ortn : 1;
            break;
          default: // inpc1084 == fator_pbc
            fator = (moedaContribuicao) ? moedaContribuicao.fator_pbc : 1;
            fatorLimite = (moedaComparacao) ? moedaComparacao.fator_pbc : 1;
            break;
        }

      }



      let fatorCorrigido = (moedaContribuicao) ? (fator / fatorLimite) : 1;
      let fatorCorrigidoString = this.formatDecimal(fatorCorrigido, 6); // tabela['fatorCorrigido'] = fator/fatorLimite;

      let contribuicaoPrimariaRevisada = 0;
      let contribuicaoSecundariaRevisada = 0;

      // regra para contribuições secundarias e teto 06/08/2020
      let somaContribuicoesMaiorTeto = false;

      let limiteString = '';
      if (contribuicaoPrimaria != 0) {
        contadorPrimario++;
        const valorAjustadoObj = this.limitarTetosEMinimos(contribuicaoPrimaria, dataContribuicao, sc_mm_ajustar);
        contribuicaoPrimariaRevisada = valorAjustadoObj.valor;
        limiteString = valorAjustadoObj.aviso;
      }

      if (contribuicaoSecundaria != 0 && limiteString !== 'LIMITADO AO TETO') {
        contribuicaoSecundariaRevisada = (this.limitarTetosEMinimos(contribuicaoSecundaria, dataContribuicao)).valor;
        //Inserir texto 'Limitado ao teto' e 'limitado ao minimo' quando cabivel.
        contadorSecundario++;
      }

      if (contribuicaoSecundaria != 0 && ((contribuicaoPrimaria + contribuicaoSecundaria) > moedaContribuicao.teto)) {
        somaContribuicoesMaiorTeto = true;
        contribuicaoPrimaria = moedaContribuicao.teto;
        contribuicaoSecundaria = 0
      }

      const contribuicaoPrimariaString = this.formatMoney(contribuicaoPrimariaRevisada, currency.acronimo);
      const contribuicaoSecundariaString = this.formatMoney(contribuicaoSecundariaRevisada, currency.acronimo);

      contribuicaoPrimariaRevisada = contribuicaoPrimariaRevisada * fatorCorrigido;
      contribuicaoSecundariaRevisada = contribuicaoSecundariaRevisada * fatorCorrigido;

      contribuicaoPrimariaRevisada = this.convertCurrency(contribuicaoPrimariaRevisada, dataContribuicao, dib);
      contribuicaoSecundariaRevisada = this.convertCurrency(contribuicaoSecundariaRevisada, dataContribuicao, dib);

      totalContribuicaoPrimaria += contribuicaoPrimariaRevisada;
      totalContribuicaoSecundaria += contribuicaoSecundariaRevisada;


      const contribuicaoPrimariaRevisadaString = this.formatMoney(contribuicaoPrimariaRevisada, dibCurrency.acronimo);
      const contribuicaoSecundariaRevisadaString = this.formatMoney(contribuicaoSecundariaRevisada, dibCurrency.acronimo);
      //tabela['Contribuicao Primaria Corrigida'] = currency.Acronimo + contribuicaoPrimariaRevisada
      //tabela['Contribuicao Secundaria Corrigida'] = currency.Acronimo + contribuicaoSecundariaRevisada

      let line = {
        id: idString,
        competencia: dataContribuicaoString,
        contribuicao_primaria: contribuicaoPrimariaString,
        contribuicao_secundaria: contribuicaoSecundariaString,
        indice_corrigido: fatorCorrigidoString,
        contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
        contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString,
        limite: limiteString,
        valor_primario: contribuicaoPrimariaRevisada,
        valor_secundario: contribuicaoSecundariaRevisada
      };
      tableData.push(line);
      if (tabelaIndex < 12) {
        primeirasContribuicoes.push(line);
      }
      tabelaIndex++;
    }


    const getDifferenceInMonthsDef = (date1, date2 = moment(), floatRet = false) => {
      let difference = date1.diff(date2, 'months', true);
      difference = Math.abs(difference);
      if (floatRet) {
        return difference;
      }
      return Math.floor(difference);
    }


    moment().startOf('month').add()

    const dataInicioBeneficioDefDivisor = this.dataInicioBeneficio.clone();

    const mesesContribuicao = getDifferenceInMonthsDef(
      moment('1994-07-01'),
      dataInicioBeneficioDefDivisor.startOf('month').add(1, 'months')
    );



    // meses de contribuição pbc
    // if (this.getPbcDaVidatoda()) {
    //   // const dataInicioPBCRevisao = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
    //   const dataInicioPBCRevisao = moment(this.segurado.data_filiacao, 'DD/MM/YYYY');
    //   mesesContribuicao = this.getDifferenceInMonths(dataInicioPBCRevisao, this.dataInicioBeneficio);
    // }


    const mesesContribuicao80 = Math.trunc((mesesContribuicao * 0.8));
    const mesesContribuicao60 = Math.trunc((mesesContribuicao * 0.6));
    const divisorMinimo = Math.trunc(mesesContribuicao * 0.6);

    const numeroContribuicoes = contadorPrimario; // Numero de contribuicoes carregadas para o periodo;

    let divisorMediaPrimaria = numeroContribuicoes;
    let divisorSecundario = contadorSecundario;

    if (divisorSecundario < 24) {
      divisorSecundario = 24;
    }

    if (divisorSecundario < mesesContribuicao * 0.6) {
      divisorSecundario = Math.round(mesesContribuicao * 0.6);
    } else if (divisorSecundario < mesesContribuicao * 0.8) {
      divisorSecundario = Math.round(mesesContribuicao * 0.8);
    }

    if (!this.isDivisorMinimo) {
      divisorSecundario = Math.round(contadorSecundario * 0.8);
    }

    // Quando a filiação for a partir de 29/11/1999 o cálculo se dará sempre pela m.a.s dos 80% > SC. Não aplica divisor mínimo!
    if (numeroContribuicoes > 1) {
      divisorMediaPrimaria = Math.trunc((numeroContribuicoes * 0.8));
    }

    if (this.dataFiliacao < this.dataDib99 &&
      (this.tipoBeneficio == 3 || this.tipoBeneficio == 4 ||
        this.tipoBeneficio == 5 || this.tipoBeneficio == 1915 || this.tipoBeneficio == 1920 || this.tipoBeneficio == 1925
        || this.tipoBeneficio == 6 || this.tipoBeneficio == 16 || this.tipoBeneficio == 25 || this.tipoBeneficio == 27
        || this.tipoBeneficio == 26 || this.tipoBeneficio == 28)) {
      // Deficiencia Por Idade, Deficiencia Grave, Deficiencia Leve, Deficiencia Moderada, Aposentadoria Idade trabalhador Rural,
      // Aposentadoria Idade Urbano, Aposentadoria Tempo Contribuicao, Aposentadoria Especial, Aposentadoria Tempo Servico Professor
      // divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);

      divisorMediaPrimaria = Math.trunc((numeroContribuicoes * 0.8)); // alterado 08/04/2020
      // divisorMediaPrimaria = numeroContribuicoes;


      if (numeroContribuicoes < mesesContribuicao60 && this.isDivisorMinimo) {

        divisorMediaPrimaria = mesesContribuicao60;
        this.msgDivisorMinimo = '(Divisor Mínimo)';

      }

      if (numeroContribuicoes >= mesesContribuicao60 && numeroContribuicoes <= mesesContribuicao80) {

        this.exibirIN77 = true;

        if (this.withIN45 && this.isDivisorMinimo) {

          divisorMediaPrimaria = numeroContribuicoes;

        } else {

          divisorMediaPrimaria = Math.trunc((numeroContribuicoes * 0.8));

        }

        if (this.naoAplicarIN77 && this.isDivisorMinimo) {

          divisorMediaPrimaria = Math.trunc((numeroContribuicoes * 0.8));

          if (divisorMediaPrimaria < mesesContribuicao60) {

            divisorMediaPrimaria = mesesContribuicao60;
            this.msgDivisorMinimo = '(Divisor Mínimo)';

          }

        }

      }

      // divisor PBC
      if (this.getPbcDaVidatoda()) {
        this.exibirIN77 = false;
        divisorMediaPrimaria = Math.trunc((numeroContribuicoes * 0.8));
        this.msgDivisorMinimo = '';
      }

    }



    // console.log('teste1')

    // console.log((this.tipoBeneficio == 3 || this.tipoBeneficio == 4 ||
    //   this.tipoBeneficio == 5 || this.tipoBeneficio == 1915 || this.tipoBeneficio == 1920 || this.tipoBeneficio == 1925
    //   || this.tipoBeneficio == 6 || this.tipoBeneficio == 16 || this.tipoBeneficio == 25 || this.tipoBeneficio == 27
    //   || this.tipoBeneficio == 26 || this.tipoBeneficio == 28))

    // // adicionado 15/09/2021 - teste 14-09-2021
    // if ((this.tipoBeneficio == 3 || this.tipoBeneficio == 4 ||
    //   this.tipoBeneficio == 5 || this.tipoBeneficio == 1915 || this.tipoBeneficio == 1920 || this.tipoBeneficio == 1925
    //   || this.tipoBeneficio == 6 || this.tipoBeneficio == 16 || this.tipoBeneficio == 25 || this.tipoBeneficio == 27
    //   || this.tipoBeneficio == 26 || this.tipoBeneficio == 28)) {

    //   console.log(this.isDivisorMinimo);

    //   divisorMediaPrimaria = Math.trunc((numeroContribuicoes * 0.8)); // alterado 08/04/2020

    //   if (numeroContribuicoes < mesesContribuicao60 && this.isDivisorMinimo) {

    //     divisorMediaPrimaria = mesesContribuicao60;
    //     this.msgDivisorMinimo = '(Divisor Mínimo)';

    //   }

    //   // divisor PBC
    //   if (this.getPbcDaVidatoda()) {
    //     this.exibirIN77 = false;
    //     divisorMediaPrimaria = Math.trunc((numeroContribuicoes * 0.8));
    //     this.msgDivisorMinimo = '';
    //   }

    // }


    //  let totalMediaDozeContribuicoes = 0;

    let divisorContribuicoes;
    switch (this.tipoBeneficio) {
      case 1: // Auxilio Doenca Previdenciario
        if (this.dataInicioBeneficio >= this.dataMP664 && this.calculo.media_12_ultimos === 0) {

          let currency = this.loadCurrency(this.dataInicioBeneficio);

          // if (numeroContribuicoes >= 12) {

          let contribuicoesPrimarias12 = 0;
          let contribuicoesSecundarias12 = 0;

          for (let contribuicao of primeirasContribuicoes) {
            contribuicoesPrimarias12 += contribuicao.valor_primario;
            contribuicoesSecundarias12 += contribuicao.valor_secundario;
          }

          const divisorAuxilioDoenca = (numeroContribuicoes >= 12) ? 12 : numeroContribuicoes;

          // Carregar 1 linha da tabela moeda onde a data é menor ou igual que data_pedido_beneficio;
          let moeda = this.Moeda.getByDate(this.dataInicioBeneficio);
          let salarioMinimoRMI = moeda.salario_minimo;
          divisorContribuicoes = this.formatDecimal((contribuicoesPrimarias12 + contribuicoesSecundarias12) / divisorAuxilioDoenca, 1);

          if (parseFloat(divisorContribuicoes) < salarioMinimoRMI) {
            divisorContribuicoes = salarioMinimoRMI;
          }

          this.totalMedia12Contribuicoes = parseFloat(divisorContribuicoes);

          conclusoes.push({
            order: 21,
            string: 'Média dos 12 últimos salários de contribuição',
            value: this.formatMoney(divisorContribuicoes, currency.acronimo)
          });

          // totalMediaDozeContribuicoes = divisorContribuicoes;
          // Inserir nas conclusoes:
          // conclusoes.push({
          //   order: 0,
          //   string: 'Soma das 12 últimos salários de contribuição',
          //   value: this.formatMoney(contribuicoesPrimarias12, currency.acronimo)
          // });

        }

        // }
        break;
      case 2: //Aposentadoria por invalidez previdenciaria
        if (this.dataInicioBeneficio >= this.dataDecreto6939_2009 && Math.round(divisorMediaPrimaria) > 1) {
          divisorMediaPrimaria = Math.round(numeroContribuicoes * 0.8);
          //  divisorMediaPrimaria =  this.formatDecimal((numeroContribuicoes * 0.8)-0.5, 1);
        }
        break;
    }

    // 25-02-2020 media 80 secundaria
    tableData.sort((entry1, entry2) => {
      if (entry1.valor_secundario > entry2.valor_secundario) {
        return 1;
      }
      if (entry1.valor_secundario < entry2.valor_secundario) {
        return -1;
      }
      return 0;
    });

    totalContribuicaoSecundaria = 0
    for (let i = 0; i < tableData.length; i++) {
      if (i >= tableData.length - divisorSecundario) {
        totalContribuicaoSecundaria += tableData[i].valor_secundario;
      }
    }


    tableData.sort((entry1, entry2) => {
      if (entry1.valor_primario > entry2.valor_primario) {
        return 1;
      }
      if (entry1.valor_primario < entry2.valor_primario) {
        return -1;
      }
      return 0;
    });

    if (numeroContribuicoes > divisorMediaPrimaria) {
      totalContribuicaoPrimaria = 0
      for (let i = 0; i < tableData.length; i++) {
        if (i >= tableData.length - divisorMediaPrimaria) {
          totalContribuicaoPrimaria += tableData[i].valor_primario;
        } else {
          tableData[i].limite = 'DESCONSIDERADO';
        }
      }
    }

    tableData.sort((entry1, entry2) => {
      if (entry1.id > entry2.id) {
        return 1;
      }
      if (entry1.id < entry2.id) {
        return -1;
      }
      return 0;
    });

    // Calcular a quantidade de meses contida entre as duas datas.
    let numeroCompetencias = Math.ceil(this.getDifferenceInMonths(this.dataDib99, this.dataInicioBeneficio, true));

    if (numeroCompetencias > 60) {
      numeroCompetencias = 60;
    } else if (numeroCompetencias > 0 && numeroCompetencias < 1) {
      numeroCompetencias = 1;
    }

    const expectativa = this.projetarExpectativa(this.idadeFracionada, this.dataInicioBeneficio, conclusoes);


    const redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;
    const redutorSexo = (this.segurado.sexo == 'm') ? 0 : 5;

    const tempoTotalContribuicao = this.getTempoServico(redutorProfessor, redutorSexo, false);

    let fatorSeguranca = 1;
    const aliquota = 0.31;
    let naoFocado = false;

    switch (this.tipoBeneficio) {
      case 1: // Auxilio Doenca Previdenciario
      case 2:         // Aposentadoria Invalidez Previdenciaria;
      case 5:         // Aposentadoria Especial
      case 7:         // Auxiolio Acidente 50
        naoFocado = true;
        break;
      default:

        const arredFatorCalc = (vl) => {
          return Math.floor(vl * 10000) / 10000;
        };

        const tempo = this.contribuicaoPrimaria;
        let tempoTotalContribuicaoF = (tempo.anos) + (tempo.meses / 12) + (tempo.dias / 360);

        // Se mulher
        tempoTotalContribuicaoF += redutorSexo;

        // Se professor
        tempoTotalContribuicaoF += redutorProfessor;

        tempoTotalContribuicaoF = arredFatorCalc(tempoTotalContribuicaoF);

        let idadeFracionadaF = this.getIdadeFracionada(false);

        idadeFracionadaF = arredFatorCalc(idadeFracionadaF);


        fatorSeguranca = arredFatorCalc(arredFatorCalc(tempoTotalContribuicaoF * aliquota) / expectativa)
          * arredFatorCalc(1 + arredFatorCalc(idadeFracionadaF + arredFatorCalc(tempoTotalContribuicaoF * aliquota)) / 100);

        // fatorSeguranca = parseFloat(fatorSeguranca.toFixed(4));
        fatorSeguranca = arredFatorCalc(fatorSeguranca);

        this.fatorPrevidenciario = fatorSeguranca;
        this.fatorPrevidenciarioAntesDaVerificacao = fatorSeguranca;

        // Adicionar nas conclusões a fórmula com os valores, não os resutlados:
        this.formula_fator = '((' + this.formatDecimal(tempoTotalContribuicaoF, 4) + ' * '
          + this.formatDecimal(aliquota, 2) + ') / '
          + this.formatDecimal(expectativa, 2) + ') * (1 + ('
          + this.formatDecimal(idadeFracionadaF, 4) + ' + ('
          + this.formatDecimal(tempoTotalContribuicaoF, 4) + ' * '
          + this.formatDecimal(aliquota, 2) + ')) / ' + '100)';


        const tempoContribuicaoMaisIdade = this.contribuicaoTotal + this.idadeFracionada;

        if (![0, 2, 7, 17, 18, 19, 1903, 1905].includes(this.tipoBeneficio)) {
          this.aplicacaoRegraPontos(tempoContribuicaoMaisIdade, tempoTotalContribuicao, conclusoes);
        }

        // if (!this.isRegraPontos && (this.tipoBeneficio == 16 || // Aposentadoria Travalhador Rural
        //   this.tipoBeneficio == 3 || // Aposentadoria Trabalhador Urbano
        //   this.tipoBeneficio == 25 || // Deficiencia Grave
        //   this.tipoBeneficio == 26 || // Deficiencia Leve
        //   this.tipoBeneficio == 27 || // Deficiencia Moderada
        //   this.tipoBeneficio == 28) ||
        //   (!this.isRegraPontos && fatorSeguranca < 1 && this.tipoBeneficio === 4)) {

        //   conclusoes.push({
        //     order: 3,
        //     tipo: 'fator',
        //     string: 'Fator Previdenciário:', value: fatorSeguranca
        //   });

        // }


        break;
    }

    let tipoIdadeFator = false;

    if (this.tipoBeneficio == 16 || // Aposentadoria Travalhador Rural
      this.tipoBeneficio == 3 || // Aposentadoria Trabalhador Urbano
      this.tipoBeneficio == 25 || // Deficiencia Grave
      this.tipoBeneficio == 26 || // Deficiencia Leve
      this.tipoBeneficio == 27 || // Deficiencia Moderada
      this.tipoBeneficio == 28) {  // Deficiencia Por Idade


      if (fatorSeguranca < 1) {

        fatorSeguranca = 1;
        naoFocado = true;
        tipoIdadeFator = false;

      } else if (fatorSeguranca > 1) {

        naoFocado = true;
        tipoIdadeFator = true;

      }
    }


    //Índice de Reajuste no Teto.
    let irt = 1;
    let mediaContribuicoesPrimarias = totalContribuicaoPrimaria;
    if (divisorMediaPrimaria > 1) {
      mediaContribuicoesPrimarias /= divisorMediaPrimaria;

    }

    let mediaContribuicoesSecundarias = totalContribuicaoSecundaria;
    if (divisorSecundario > 1) {
      mediaContribuicoesSecundarias /= divisorSecundario;
    }

    if (moedaDib && mediaContribuicoesSecundarias > moedaDib.teto) {
      mediaContribuicoesSecundarias = moedaDib.teto;
    }

    this.limited = false;

    // old 17-07-2020
    // let rmi = fatorSeguranca * numeroCompetencias * mediaContribuicoesPrimarias / 60;
    // rmi += mediaContribuicoesPrimarias * ((60 - numeroCompetencias) / 60);

    let taxaSecundaria = 0;
    let taxaMediaSecundaria = 0;

    if (mediaContribuicoesSecundarias != 0) {
      taxaSecundaria = this.getTaxaSecundaria(redutorProfessor, redutorSexo, contadorSecundario);
      taxaMediaSecundaria = mediaContribuicoesSecundarias * taxaSecundaria;

      if (taxaMediaSecundaria > mediaContribuicoesSecundarias) {
        taxaMediaSecundaria = mediaContribuicoesSecundarias;
      }
    }
    this.coeficiente = Math.floor(this.coeficiente);
    const coeficiente = this.coeficiente;

    const somaMedias = mediaContribuicoesPrimarias + taxaMediaSecundaria;
    const somaMediasAux = this.corrigirBeneficio(somaMedias, coeficiente, moedaDib);

    if (this.limited) {

      // 16-07-2020 DR Sergio o fator deve ser aplicado na média antes de cálcular o IRT
      irt = ((somaMedias * (coeficiente / 100)) * fatorSeguranca) / somaMediasAux;

    }


    // RMI Renda mensal
    let rmi = 0;

    // passo 1
    rmi = somaMedias;
    if ((!this.isRegraPontos && (this.tipoBeneficio === 4 || this.tipoBeneficio === 6))
      || (tipoIdadeFator && fatorSeguranca > 1)) {


      rmi *= this.fatorPrevidenciario;

      if (this.checkFatorprogressivo()) {
        rmi = this.calcularFatorProgressivo(somaMedias, conclusoes);
      }

    }

    // teto e mínimo
    rmi = this.corrigirSalarioDeBeneficio(rmi, moedaDib);
    this.salarioBeneficio = rmi;

    // passo 1


    // passo 2
    rmi = this.corrigirBeneficio(rmi, coeficiente, moedaDib);

    // if (!this.limited) {  // Se não foi corrigido ao percentual do teto
    rmi *= (coeficiente / 100);
    // }


    rmi += (fatorSeguranca * numeroCompetencias * taxaMediaSecundaria) / 60;
    rmi += taxaMediaSecundaria * ((60 - numeroCompetencias) / 60)
    // rmi *= (coeficiente / 100);


    rmi = this.corrigirBeneficio(rmi, coeficiente, moedaDib);

    // passo 2

    this.limited = false;
    // old modificado 17/07/2020
    // let rmiAux = this.corrigirBeneficio(rmi, coeficiente, moedaDib);
    // rmi = rmiAux;

    // let objMoeda = this.moeda[this.getIndex(this.dataInicioBeneficio)];//carregar apenas uma TMoeda onde currency Date é menor ou igual a Calculo.data_pedido_beneficio
    // let objMoeda = this.Moeda.getByDate(this.dataInicioBeneficio);
    // // let salarioAcidente = objMoeda.salario_minimo;
    // if (objMoeda && mediaContribuicoesPrimarias > objMoeda.salario_minimo) {
    //   switch (this.tipoBeneficio) {
    //     case 17:// Auxilio Acidente 30
    //       rmi = mediaContribuicoesPrimarias * 0.3;
    //       break;
    //     case 18: // Auxilio Acidente 40
    //       rmi = mediaContribuicoesPrimarias * 0.4;
    //       break;
    //     case 1905: // Auxilio Acidente 50
    //     case 7: // Auxilio Acidente 50
    //       rmi = mediaContribuicoesPrimarias * 0.5;
    //       break;
    //     case 19: // Auxilio Acidente 60
    //       rmi = mediaContribuicoesPrimarias * 0.6;
    //       break;
    //   }
    // }

    let somaContribuicoes = totalContribuicaoPrimaria + totalContribuicaoSecundaria;
    let currency = this.loadCurrency(this.dataInicioBeneficio);

    //conclusoes.coeficiente_calculo = coeficiente;//resultados['Coeficiente do Cálculo'] = coeficiente //Arrendodar para duas casas decimais;
    //conclusoes.soma_contribuicoes_primarias = this.formatMoney(totalContribuicoesPrimarias, currency.acronimo);//resultados['Soma das Contribuições Primarias'] = currency.acrônimo + totalContribuicoesPrimarias;
    //conclusoes.divisor_calculo_media_primaria = divisorMediaPrimaria;//resultados['Divisor do Cálculo da média primária: '] = divisorMediaPrimaria;
    //conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaContribuicoesPrimarias, currency.acronimo);//resultados['Média das contribuições primárias'] = currency.acrônimo + mediaContribuicoesPrimarias;



    // conclusoes geral
    conclusoes.push({
      order: 0,
      tipo: 'soma',
      // string: 'Soma das Contribuições Primarias:',
      string: 'Soma dos Salários de Contribuição Considerados',
      value: this.formatMoney(totalContribuicaoPrimaria, currency.acronimo)
    });

    conclusoes.push({
      order: 1,
      tipo: 'divisor',
      // string: 'Divisor do Cálculo da Média Primária:',
      string: 'Divisor da Média dos Salários de Contribuição',
      value: divisorMediaPrimaria + ' ' + this.msgDivisorMinimo
    });

    conclusoes.push({
      order: 2,
      tipo: 'media',
      // string: 'Média das Contribuições Primárias',
      string: 'Média dos Salários de Contribuição',
      value: this.formatMoney(mediaContribuicoesPrimarias, currency.acronimo)
    });

    conclusoes.push({
      order: 5,
      tipo: 'teto',
      string: 'Teto do Salário de Contribuição',
      value: this.formatMoney(moedaDib.teto, currency.acronimo)
    });

    conclusoes.push({
      order: 6,
      tipo: 'sb',
      string: 'Salário de Benefício',
      value: this.formatMoney(this.salarioBeneficio)
    });


    conclusoes.push({
      order: 19,
      tipo: 'aliquota',
      string: 'Alíquota do Benefício',
      value: (coeficiente < 100) ? this.formatDecimal(coeficiente, 0) + '%' : this.formatDecimal(coeficiente, 0) + '%'
    });


    if (irt > 1) {

      this.irtRejusteAdministrativo = irt;
      conclusoes.push({
        order: 18,
        tipo: 'irt',
        string: 'Índice de reajuste no teto:', value: this.formatDecimal(irt, 4)
      }); // resultados['Índice de reajuste no teto: '] = irt; // Arredondar para 4 casas decimais;

    }



    if (totalContribuicaoSecundaria > 0) {


      // 26-04-2021 - ocultar valores secundários da conclusão.
      // conclusoes.push({
      //   order: 0,
      //   string: 'Soma das contribuições secundárias:', value: this.formatMoney(totalContribuicaoSecundaria, currency.acronimo)
      // }); // resultados['Soma das contribuições secundárias'] = currency.acrônumo + totalContribuicoesSecundarias;
      // conclusoes.push({
      //   order: 0,
      //   string: 'Divisor do Cálculo da média secundária:', value: divisorSecundario
      // }); // resultados['Divisor do Cálculo da média secundária: '] = divisorMediaPrimaria;
      // conclusoes.push({
      //   order: 0,
      //   string: 'Média das contribuições Secundárias:', value: this.formatMoney(mediaContribuicoesSecundarias, currency.acronimo)
      // }); // resultados['Média das contribuições Secundárias: '] =  currency.acrônumo + mediaContribuicoesSecundarias;
      // conclusoes.push({
      //   order: 0,
      //   string: 'Taxa:', value: this.formatDecimal(taxaSecundaria, 6)
      // }); // resultados['Taxa: '] =  taxaSecundaria;
      // conclusoes.push({
      //   order: 0,
      //   string: 'Média Secundária - Pós Taxa:', value: this.formatMoney(mediaContribuicoesSecundarias * taxaSecundaria, currency.acronimo)
      // }); // resultados['Média Secundárias - Pós Taxa: '] =  currency.acrônimo + taxaSecundaria;

      // conclusoes.push({
      //   order: 0,
      //   string: 'Média das contribuições:', value: this.formatMoney(somaMedias, currency.acronimo)
      // });//resultados['Média das contribuições'] = currency.acrônimo + somaMedias;

    }

    // conclusoes.push({
    //   order: 0,
    //   string: 'Idade em anos:', value: `${Math.trunc(this.idadeFracionada)} (${this.formatDecimal(this.idadeFracionada, 2)}) `
    // });// resultados['Idade em anos'] = truncate(idadeFracionada) (idadeFracionada); this.idadeFracionada.toLocaleString('pt-BR',{ style: 'decimal', maximumFractionDigits: 2}))


    // conclusoes.push({
    //   order: 0,
    //   string: 'CT - Número de competências transcorridas desde 29/11/1999:', value: numeroCompetencias
    // });//resultados['CT - Número de competências transcorridas desde 29/11/1999:'] = numeroCompetencias;


    // if (this.formula_expectativa_sobrevida != '') {
    //   conclusoes.push({
    //     order: 0,
    //     string: 'Fórmula Expectativa de Sobrevida:', value: this.formula_expectativa_sobrevida
    //   });
    // }

    // conclusoes.push({
    //   order: 0,
    //   string: 'Expectativa de Sobrevida:', value: this.formatDecimal(expectativa, 2)
    // });//resultados['Expectativa de Sobrevida: '] = expectativa; // Arredondar para 4 casas decimais;


    //???????
    // if (this.tipoBeneficio == 6 && redutorSexo == 5) {
    //   this.contribuicaoTotal -= this.contribuicaoTotal - 5;
    // }

    let tempo = this.contribuicaoTotal;
    if (this.tipoBeneficio == 6 && redutorProfessor == 5) {
      tempo -= 5;
    }


    // let textoValorPontos = '';
    // let pontosPorSexo = 0;
    // const contribuicao85_95 = tempo + this.idadeFracionada;
    // const contribuicao86_96 = tempo + this.idadeFracionada;
    // const contribuicao87_97 = tempo + this.idadeFracionada;
    // const contribuicao88_98 = tempo + this.idadeFracionada;
    // const contribuicao89_99 = tempo + this.idadeFracionada;
    // const contribuicao90_100 = tempo + this.idadeFracionada;

    // const dateFormat = 'DD/MM/YYYY';
    // const dataRegra85_95 = moment('17/06/2015', dateFormat);
    // const dataRegra86_96 = moment('31/12/2018', dateFormat);
    // const dataRegra87_97 = moment('31/12/2020', dateFormat);
    // const dataRegra88_98 = moment('31/12/2022', dateFormat);
    // const dataRegra89_99 = moment('31/12/2024', dateFormat);
    // const dataRegra90_100 = moment('31/12/2026', dateFormat);

    // const dataFimRegra85_95 = moment('30/12/2018', dateFormat);
    // const dataFimRegra86_96 = moment('30/12/2020', dateFormat);
    // const dataFimRegra87_97 = moment('30/12/2022', dateFormat);
    // const dataFimRegra88_98 = moment('30/12/2024', dateFormat);
    // const dataFimRegra89_99 = moment('30/12/2026', dateFormat);
    // const dataFimRegra90_100 = moment('30/12/2052', dateFormat);

    let dataBeneficio = this.dataInicioBeneficio; // correção data da dib e não o inicio do mes 21-01-2020
    //let dataBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');


    // let teto = moedaDib.teto;
    // let minimo = moedaDib.salario_minimo;

    let comparacaoContribuicao = 35 - redutorSexo;

    if (this.tipoBeneficio == 29) {
      rmi = somaMedias * (coeficiente / 100);
      if (rmi <= moedaDib.salario_minimo) {
        rmi = moedaDib.salario_minimo;
      }
    }




    // if (dataBeneficio >= this.dataMP664) {

    //   // if (this.tipoBeneficio == 1 && rmi > totalMediaDozeContribuicoes) {

    //   //   if (totalMediaDozeContribuicoes > 0)
    //   //     rmi = totalMediaDozeContribuicoes;

    //   // }

    //   if (this.tipoBeneficio == 1) {
    //     let rmi2 = 0;
    //     rmi2 = somaMedias * (coeficiente / 100);
    //     // conclusoes.push({
    //     //   order: 0,
    //     //   tipo: 'media',
    //     //   string: 'Média das contribuições x Coeficiente do Cálculo:', value: this.formatMoney(rmi2, currency.acronimo)
    //     // });//resultados['Média das contribuições x Coeficiente do Cálculo: '] = currency.acronimo + rmi2;



    //     if (parseFloat(divisorContribuicoes) < rmi) {
    //       rmi = divisorContribuicoes;
    //     }

    //     // conclusoes.push({
    //     //   order: 20,
    //     //   tipo: 'rmi',
    //     //   string: 'Renda Mensal Inicial', value: this.formatMoney(rmi, currency.acronimo)
    //     // });//resultados['Renda Mensal Inicial '] = currency.acronimo + rmi;

    //   }

    // }

    // if (naoFocado) {

    //   if (fatorSeguranca <= 1) {
    //     // conclusoes.push({
    //     //   order: 3,
    //     //tipo: 'fator',
    //     //   string: 'Fator Previdenciário:', value: fatorSeguranca
    //     // });//resultados['Fp - fator previdenciário'] = fatorSeguranca;

    //     let textComplementar = '';
    //     if (this.tipoBeneficio === 16 || this.tipoBeneficio === 3) {
    //       textComplementar = ' (Afastado por ser menos vantajoso - Utilizado Fator 1,0000)';
    //     }

    //     conclusoes.push({
    //       order: 3,
    //       tipo: 'fator',
    //       string: 'Fator Previdenciário:', value: this.fatorPrevidenciarioAntesDaVerificacao + textComplementar
    //     });//resultados['Fp - fator previdenciário'] = fatorSeguranca;

    //   } else {

    //     conclusoes.push({
    //       order: 3,
    //       tipo: 'fator',
    //       string: 'Fator Previdenciário:', value: fatorSeguranca + ' (Aplicado por ser mais vantajoso)'
    //     });//resultados['Fp - fator previdenciário'] = fatorSeguranca + '(Incide fator previdenciario)';
    //   }

    // } else {

    //   if ((dataBeneficio >= dataRegra85_95 && dataBeneficio <= dataFimRegra85_95)) { //&& (this.contribuicaoPrimaria.anos >= (comparacaoContribuicao - redutorSexo))

    //     const redutorSexo85_95 = (this.segurado.sexo == 'f') ? 85 : 95;
    //     const redutorProfessor85_95 = (this.tipoBeneficio == 6) ? 80 : 90;


    //     if (fatorSeguranca >= 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo && this.tipoBeneficio == 4) {

    //       somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
    //       conclusoes.push({
    //         order: 3,
    //         tipo: 'fator',
    //         string: 'Fator Previdenciário:', value: fatorSeguranca + ' (Aplicado por ser mais vantajoso)'
    //       }); // resultados['Fator Previdenciário: '] = fatorSeguranca + ' (Aplicado por ser mais vantajoso)';
    //       this.fatorPrevidenciario = fatorSeguranca;
    //       //let rmi85_95 = this.formatMoney(somaMedias, currency.acronimo);
    //       this.rmi8595 = this.formatMoney(somaMedias, currency.acronimo);
    //       // conclusoes.push({order:  0,string:"Renda Mensal Inicial com Regra 85/95:",value:rmi85_95});//resultados['Renda Mensal Inicial com Regra 85/95: '] = currency.acronimo + somaMedias

    //     } else if (fatorSeguranca >= 1 && contribuicao85_95 >= redutorProfessor85_95 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo && this.tipoBeneficio == 6) {

    //       somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
    //       conclusoes.push({
    //         order: 3,
    //         tipo: 'fator',
    //         string: 'Fator Previdenciário:', value: fatorSeguranca + ' (Aplicado por ser mais vantajoso)'
    //       }); // resultados['Fator Previdenciário: '] = fatorSeguranca + ' (Aplicado por ser mais vantajoso)';
    //       this.fatorPrevidenciario = fatorSeguranca;
    //       // let rmi80_90 = this.formatMoney(somaMedias, currency.acronimo);
    //       this.rmi8090 = this.formatMoney(somaMedias, currency.acronimo);
    //       //conclusoes.push({order:  0,string:"Renda Mensal Inicial com Regra 80/90:",value:rmi80_90});//resultados['Renda Mensal Inicial com Regra 80/90: '] = currency.acronimo + somaMedias

    //     } else if (fatorSeguranca < 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo && this.tipoBeneficio == 4) {
    //       somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
    //       conclusoes.push({
    //         order: 3,
    //         tipo: 'fator',
    //         string: 'Fator Previdenciário:', value: fatorSeguranca + ' (Afastado por ser menos vantajoso - Aplicada a regra 85/95)'
    //       });//resultados['Fator Previdenciário: '] = fatorSeguranca + '(Afastado por ser menos vantajoso - Aplicada a regra 85/95)';

    //       this.isRegraPontos = true;
    //       this.fatorPrevidenciario = fatorSeguranca;
    //       //let rmi85_95 = this.formatMoney(somaMedias, currency.acronimo);
    //       this.rmi8595 = this.formatMoney(somaMedias, currency.acronimo);
    //       //conclusoes.push({order:  0,string:"Renda Mensal Inicial com Regra 85/95:",value:rmi85_95});//resultados['Renda Mensal Inicial com Regra 85/95: '] = currency.acronimo + somaMedias;
    //     } else if (fatorSeguranca < 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo && this.tipoBeneficio == 6) {
    //       somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
    //       conclusoes.push({
    //         order: 3,
    //         tipo: 'fator',
    //         string: 'Fator Previdenciário:', value: fatorSeguranca + ' (Afastado por ser menos vantajoso - Aplicada a regra 85/95)'
    //       });//resultados['Fator Previdenciário: '] = fatorSeguranca + '(Afastado por ser menos vantajoso - Aplicada a regra 85/95)';
    //       this.isRegraPontos = true;
    //       this.fatorPrevidenciario = fatorSeguranca;
    //       //let rmi85_95 = this.formatMoney(somaMedias, currency.acronimo);
    //       this.rmi8090 = this.formatMoney(somaMedias, currency.acronimo);
    //       //conclusoes.push({order:  0,string:"Renda Mensal Inicial com Regra 85/95:",value:rmi85_95});//resultados['Renda Mensal Inicial com Regra 85/95: '] = currency.acronimo + somaMedias;
    //     } else if (fatorSeguranca < 1 && contribuicao85_95 < redutorSexo85_95 && tempoTotalContribuicao < comparacaoContribuicao) {

    //       if (this.tipoBeneficio == 6) {
    //         conclusoes.push({
    //           order: 3,
    //           tipo: 'fator',
    //           string: 'Fator Previdenciário:', value: fatorSeguranca + '- Não tem direito a Regra 80/90'
    //         });//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
    //         this.fatorPrevidenciario = fatorSeguranca;
    //       } else {
    //         conclusoes.push({
    //           order: 3,
    //           tipo: 'fator',
    //           string: 'Fator Previdenciário:', value: fatorSeguranca + '- Não tem direito a Regra 85/95'
    //         });//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
    //         this.fatorPrevidenciario = fatorSeguranca;
    //       }

    //     } else if (fatorSeguranca > 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao < comparacaoContribuicao) {

    //       if (this.tipoBeneficio == 6) {
    //         conclusoes.push({
    //           order: 3,
    //           tipo: 'fator',
    //           string: 'Fator Previdenciário:', value: fatorSeguranca + '- Não tem direito a Regra 80/90'
    //         });//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
    //         this.fatorPrevidenciario = fatorSeguranca;
    //       } else {
    //         conclusoes.push({
    //           order: 3,
    //           tipo: 'fator',
    //           string: 'Fator Previdenciário:', value: fatorSeguranca + '- Não tem direito a Regra 85/95'
    //         });//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
    //         this.fatorPrevidenciario = fatorSeguranca;
    //       }

    //     } else if (fatorSeguranca < 1 && contribuicao85_95 < redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao) {

    //       if (this.tipoBeneficio == 6) {
    //         conclusoes.push({
    //           order: 3,
    //           tipo: 'fator',
    //           string: 'Fator Previdenciário:', value: fatorSeguranca + '- Não tem direito a Regra 80/90'
    //         });//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
    //         this.fatorPrevidenciario = fatorSeguranca;
    //       } else {
    //         conclusoes.push({
    //           order: 3,
    //           tipo: 'fator',
    //           string: 'Fator Previdenciário:', value: fatorSeguranca + '- Não tem direito a Regra 85/95'
    //         });//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
    //         this.fatorPrevidenciario = fatorSeguranca;
    //       }

    //     }
    //     // else if (dataBeneficio < dataRegra85_95 || dataBeneficio > dataFimRegra85_95) {
    //     //   conclusoes.push({order:  0, string: "Fator Previdenciário:", value: fatorSeguranca });//resultados['Fp - fator Previdenciario: '] = fatorSeguranca;
    //     //   this.fatorPrevidenciario = fatorSeguranca;
    //     // }
    //   } else if (dataBeneficio >= dataRegra86_96 && dataBeneficio <= dataFimRegra86_96) { // 86/96
    //     textoValorPontos = (this.tipoBeneficio === 6) ? ' 81/91' : ' 86/96';
    //     pontosPorSexo = (this.segurado.sexo === 'f') ? 86 : 96;

    //     this.tratamentoDeRegras(dataRegra86_96,
    //       dataFimRegra86_96, contribuicao86_96,
    //       pontosPorSexo, tempoTotalContribuicao,
    //       fatorSeguranca, textoValorPontos, comparacaoContribuicao,
    //       conclusoes, somaMedias);

    //   } else if (dataBeneficio >= dataRegra87_97 && dataBeneficio <= dataFimRegra87_97) {
    //     textoValorPontos = (this.tipoBeneficio === 6) ? ' 82/92' : ' 87/97';
    //     pontosPorSexo = (this.segurado.sexo === 'f') ? 87 : 97;

    //     this.tratamentoDeRegras(dataRegra87_97,
    //       dataFimRegra87_97, contribuicao87_97,
    //       pontosPorSexo, tempoTotalContribuicao,
    //       fatorSeguranca, '87/97', comparacaoContribuicao,
    //       conclusoes, somaMedias)

    //   } else if (dataBeneficio >= dataRegra88_98 && dataBeneficio <= dataFimRegra88_98) {

    //     pontosPorSexo = (this.segurado.sexo === 'f') ? 88 : 98;

    //     this.tratamentoDeRegras(dataRegra88_98, dataFimRegra88_98,
    //       contribuicao88_98, pontosPorSexo,
    //       tempoTotalContribuicao, fatorSeguranca,
    //       '88/98', comparacaoContribuicao,
    //       conclusoes, somaMedias)

    //   } else if (dataBeneficio >= dataRegra89_99 && dataBeneficio <= dataFimRegra89_99) {
    //     pontosPorSexo = (this.segurado.sexo === 'f') ? 89 : 99;

    //     this.tratamentoDeRegras(dataRegra89_99, dataFimRegra89_99,
    //       contribuicao89_99, pontosPorSexo,
    //       tempoTotalContribuicao, fatorSeguranca, '89/99',
    //       comparacaoContribuicao, conclusoes, somaMedias);

    //   } else if (dataBeneficio >= dataRegra90_100 && dataBeneficio <= dataFimRegra90_100) {

    //     pontosPorSexo = (this.segurado.sexo === 'f') ? 90 : 100;
    //     this.tratamentoDeRegras(dataRegra90_100, dataFimRegra90_100,
    //       contribuicao90_100, pontosPorSexo,
    //       tempoTotalContribuicao, fatorSeguranca,
    //       '90/100', comparacaoContribuicao, conclusoes, somaMedias)

    //   } else {

    //     conclusoes.push({
    //       order: 3,
    //       tipo: 'fator',
    //       string: 'Fator Previdenciário:', value: fatorSeguranca
    //     });//resultados['Fator Previdenciário: '] = fatorSeguranca;
    //     this.fatorPrevidenciario = fatorSeguranca;
    //     //this.getRendaMensal(conclusoes, rmi, currency);
    //   }

    // }

    // if (this.rmi8595 && fatorSeguranca < 1 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo) {


    //   conclusoes.push({
    //     order: 20,
    //     //  string: 'Renda Mensal Inicial com Regra 85/95:', value: this.rmi8595
    //     string: 'Renda Mensal Inicial', value: this.rmi8595
    //   })
    //   this.isRegraPontos = true;
    //   //   rmi >= somaMedias ? conclusoes.push({
    //   //     order: 20,
    //   //   //  string: 'Renda Mensal Inicial com Regra 85/95:', value: this.rmi8595
    //   //     string: 'Renda Mensal Inicial', value: this.rmi8595
    //   //   }) : this.getRendaMensal(conclusoes, rmi, currency);
    //   //   rmi >= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : conclusoes.push({
    //   //     order: 20,
    //   //  //   string: 'Renda Mensal Inicial com Regra 85/95:', value: this.rmi8595
    //   //     string: 'Renda Mensal Inicial', value: this.rmi8595
    //   //   });



    // } else if (fatorSeguranca < 1 && this.rmi8090 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo) {

    //   conclusoes.push({
    //     order: 20,
    //     // string: 'Renda Mensal Inicial com Regra 80/90', value: this.rmi8090
    //     string: 'Renda Mensal Inicial', value: this.rmi8090
    //   })
    //   this.isRegraPontos = true;
    //   // // console.log (rmi, somaMedias, rmi >= somaMedias);
    //   // rmi >= somaMedias ? conclusoes.push({
    //   //   order: 20,
    //   //   // string: 'Renda Mensal Inicial com Regra 80/90', value: this.rmi8090
    //   //   string: 'Renda Mensal Inicial', value: this.rmi8090
    //   // }) : this.getRendaMensal(conclusoes, rmi, currency);
    //   // rmi >= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : conclusoes.push({
    //   //   order: 20,
    //   //   // string: 'Renda Mensal Inicial com Regra 80/90', value: this.rmi8090
    //   //   string: 'Renda Mensal Inicial', value: this.rmi8090
    //   // });



    // } else {

    //   if ((fatorSeguranca > 1 && (!this.isRegraPontos))
    //     || (!this.isRegraPontos && (this.tipoBeneficio !== 4 || this.tipoBeneficio !== 6))) {
    //     this.getRendaMensal(conclusoes, rmi, currency);
    //   }

    // }


    if ((fatorSeguranca > 1 && (!this.isRegraPontos))
      || (!this.isRegraPontos && (this.tipoBeneficio !== 4 || this.tipoBeneficio !== 6))) {
      this.getRendaMensal(conclusoes, rmi, currency);
    }


    // ULTIMA LINHA
    conclusoes[conclusoes.length - 1]['class'] = 'destaque';
    this.isUpdating = true;

    let rmi_fator = 0;
    let rmi_pontos = 0;
    let rmi_outras_especies = 0;

    for (let i = 0; i < conclusoes.length; i++) {
      if (conclusoes[i].string == undefined && conclusoes[i].value == undefined) {
        conclusoes.splice(i, 1)
      }

      if ((/Renda Mensal Inicial com Fator/gi).test(conclusoes[i].string)) {
        rmi_fator = conclusoes[i].value
      }

      if ((/Renda Mensal Inicial com Regra/gi).test(conclusoes[i].string)) {
        rmi_pontos = conclusoes[i].value
      }

      if ((/Renda Mensal Inicial/gi).test(conclusoes[i].string)) {
        rmi_outras_especies = conclusoes[i].value;
      }

    }

    // if (conclusoes[conclusoes.length - 1].string === conclusoes[conclusoes.length - 2].string) {
    //   conclusoes.splice(conclusoes.length - 2, 1)
    // }

    rmi_fator = this.convertDecimalValue(rmi_fator);
    rmi_pontos = this.convertDecimalValue(rmi_pontos);
    rmi_outras_especies = this.convertDecimalValue(rmi_outras_especies);

    // this.valorExportacao = this.formatDecimal(rmi, 2).replace(',', '.');
    this.valorExportacao = (rmi_fator > rmi_pontos) ? rmi_fator : rmi_pontos;

    if (this.valorExportacao === 0) {
      this.valorExportacao = rmi_outras_especies;
    }

    conclusoes.sort((entry1, entry2) => {
      if (entry1.order > entry2.order) {
        return 1;
      }
      if (entry1.order < entry2.order) {
        return -1;
      }
      return 0;
    });


    // intervalo do fator progressivo
    if (!this.isfatorPrevidenciario) {

      this.conclusoes = [];
      this.conclusoes = conclusoes.filter(rowObj => (rowObj.order !== 3 && rowObj.order !== 4));

    }

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
        { data: 'indice_corrigido' },
        { data: 'contribuicao_primaria' },
        { data: 'contribuicao_secundaria', visible: this.iscontribuicaoSecundaria },
        { data: 'contribuicao_primaria_revisada' },
        { data: 'contribuicao_secundaria_revisada', visible: this.iscontribuicaoSecundaria },
        { data: 'limite' },
      ],
      columnDefs: [
        { 'width': '15rem', 'targets': [7] },
        {
          'targets': [0, 1, 2, 3, 4, 5, 6],
          'className': 'text-center'
        }
      ]
    };


    this.isUpdating = false;

    if (this.aplicarRejusteAposAposEC103) {
      setTimeout(() => {
        this.mostrarReajustesAdministrativos(this.boxId);
      }, 2000);
    }

    // Salvar Valor do Beneficio no Banco de Dados (rmi, somaContribuicoes);
    // this.calculo.soma_contribuicao = somaContribuicoes;
    // this.calculo.valor_beneficio = this.valorExportacao;

    this.setObjConclusoesMelhor(rmi, somaContribuicoes, 'antes');


    this.CalculoRgpsService.update(this.calculo);
    this.isUpdating = false;

  }


  private getRequisitoPontos() {

    const dataBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');

    const requisitos = [
      { dataIni: '2015-06-18', dataFim: '2018-12-30', f: 85, m: 95 },
      { dataIni: '2018-12-31', dataFim: '2020-12-30', f: 86, m: 96 },
      { dataIni: '2020-12-31', dataFim: '2022-12-30', f: 87, m: 97 },
      { dataIni: '2022-12-31', dataFim: '2024-12-30', f: 88, m: 98 },
      { dataIni: '2024-12-31', dataFim: '2026-12-30', f: 89, m: 99 },
      { dataIni: '2026-12-31', dataFim: '2060-12-31', f: 90, m: 100 },
    ];

    const tempoMinContribuicao = { m: 35, f: 30 }
    const requisitoSegurado = requisitos.find(req => (dataBeneficio.isBetween(req.dataIni, req.dataFim, null, '()')));
    const status = (requisitoSegurado !== undefined);
    //let tempoAdicionalProfessor = 0;

    // Se professor
    if (status &&
      (this.tipoBeneficio === 6 || this.tipoBeneficio === '6')) {

      tempoMinContribuicao.m -= 5;
      tempoMinContribuicao.f -= 5;

      requisitoSegurado.m -= 5;
      requisitoSegurado.f -= 5;

    }

    return {
      status: status,
      requistos: requisitoSegurado,
      tempoMinContribuicao: tempoMinContribuicao
    }

  }


  private aplicacaoRegraPontos(tempoContribuicaoMaisIdade, tempoTotalContribuicao, conclusoes) {

    const requitoPontos = this.getRequisitoPontos();

    if (requitoPontos.status && (this.tipoBeneficio === 4 || this.tipoBeneficio === 6)) {

      const pontosNecessarios = requitoPontos.requistos[this.segurado.sexo];
      const labelPontos = `${requitoPontos.requistos['f']}/${requitoPontos.requistos['m']}`

      if (tempoTotalContribuicao >= requitoPontos.tempoMinContribuicao[this.segurado.sexo]
        && tempoContribuicaoMaisIdade >= pontosNecessarios
        && this.fatorPrevidenciario < 1
      ) {

        conclusoes.push({
          order: 4,
          tipo: 'fator',
          string: 'Fator Previdenciário', value: this.fatorPrevidenciarioAntesDaVerificacao
            + ` (Afastado por ser menos vantajoso - Aplicada a regra ${labelPontos})`
        });

        this.fatorPrevidenciario = 1;

      } else {

        const textoFator = (this.fatorPrevidenciario > 1) ? '  (Aplicado por ser mais vantajoso)' : ''

        conclusoes.push({
          order: 4,
          tipo: 'fator',
          string: 'Fator Previdenciário', value: this.fatorPrevidenciario
            + textoFator
        });

      }

    } else {


      let textComplementar = '';
      let fatorText = this.fatorPrevidenciario;
      if (this.tipoBeneficio === 16 || // Aposentadoria Travalhador Rural
        this.tipoBeneficio === 3 || // Aposentadoria Trabalhador Urbano
        this.tipoBeneficio === 25 || // Deficiencia Grave
        this.tipoBeneficio === 26 || // Deficiencia Leve
        this.tipoBeneficio === 27 || // Deficiencia Moderada
        this.tipoBeneficio === 28) {  // Deficiencia Por Idade

        if (this.fatorPrevidenciario < 1) {

          textComplementar = ' (Afastado por ser menos vantajoso - Utilizado Fator 1,0000)';
          fatorText = this.fatorPrevidenciarioAntesDaVerificacao
          this.fatorPrevidenciario = 1;

        } else {

          textComplementar = ' (Aplicado por ser mais vantajoso)';

        }

      }

      conclusoes.push({
        order: 4,
        tipo: 'fator',
        string: 'Fator Previdenciário', value: fatorText + textComplementar
      });


    }

    conclusoes.push({
      order: 3,
      tipo: 'formula_fator',
      string: 'Fórmula do Fator Previdenciário',
      value: this.formula_fator
    });


  }



  corrigirSalarioDeBeneficio(beneficio, moeda) {


    const minimo = parseFloat(moeda.salario_minimo);
    const teto = parseFloat(moeda.teto);

    if (moeda && beneficio > teto) {
      return teto;
    }

    if (moeda && beneficio < minimo) {
      return minimo;
    }

    return beneficio;
  }



  corrigirBeneficio(beneficio, coeficiente, moeda) {

    const minimo = parseFloat(moeda.salario_minimo);
    const teto = parseFloat(moeda.teto);

    let beneficioCorrigido = beneficio;
    if (moeda && beneficio > teto) {
      beneficioCorrigido = teto * coeficiente / 100;
      this.limited = true;
    }

    if (moeda && beneficio < minimo && (this.tipoBeneficio != 7 && this.tipoBeneficio != 1905)) {
      beneficioCorrigido = minimo
    }

    return beneficioCorrigido;
  }

  getTempoServico(redutorProfessor, redutorSexo, secundario) {
    let tempo;

    if (secundario) {
      tempo = this.contribuicaoSecundaria;
      // let contagemSecundaria = parseInt(tempo.anos) + (((parseInt(tempo.meses) * 30) + parseInt(tempo.dias)) / 365)
      let contagemSecundaria = (parseInt(tempo.anos) * 365) + (parseInt(tempo.meses) * 30) + parseInt(tempo.dias);
      //let contagemSecundaria = parseInt(tempo.anos) + ((parseInt(tempo.meses) + (parseInt(tempo.dias) /  30.4375)) / 12);
      return contagemSecundaria;
    }

    tempo = this.contribuicaoPrimaria;
    // let contagemPrimariaAnos = parseInt(tempo.anos) + (((parseInt(tempo.meses) * 30) + parseInt(tempo.dias)) / 365);
    let contagemPrimaria = (parseInt(tempo.anos) * 365) + (parseInt(tempo.meses) * 30) + (parseInt(tempo.dias));
    let contagemPrimariaAnos = contagemPrimaria / 365;
    //let contagemPrimariaAnos = parseInt(tempo.anos) + ((parseInt(tempo.meses) + (parseInt(tempo.dias) /  30.4375)) / 12);
    // if (this.tipoBeneficio == 6) { // Tempo de Serviço Professor
    //   contagemPrimariaAnos += redutorProfessor + redutorSexo;
    // }

    this.contribuicaoTotal = contagemPrimariaAnos;

    if (redutorSexo > 0) {
      if (this.tipoBeneficio == 16 || this.tipoBeneficio == 3 || this.tipoBeneficio == 4) {
        contagemPrimariaAnos += redutorSexo;
      }
    }
    return contagemPrimariaAnos;
  }

  getMesesCarencia() {
    let mesesCarencia = 180;
    if (this.dataFiliacao <= this.dataLei8213) {
      let progressiveLack = this.CarenciaProgressiva.getCarencia(this.dataInicioBeneficio.year());
      if (progressiveLack != 0) {
        mesesCarencia = progressiveLack;
      }
    }
    return mesesCarencia;
  }



  // case 1: //Auxilio Doença Previdenciario
  // case 2: //Aposentadoria por invalidez previdenciaria
  // case 5: // Aposentadoria Especial
  // case 7: // Auxilio Acidente Previdenciario 50%
  // case 3://Aposentadoria Idade Trabalhador Urbano
  // case 4://Aposentadoria Tempo de Contribuicao
  // case 16://Aposentadoria Idade Trabalhafor Rural
  // case 25://Deficiencia Grave
  // case 27://Deficiencia Leva
  // case 26://Deficiencia Moderado
  // case 28://Deficiencia PorSalvar Idade

  getTaxaSecundaria(redutorProfessor, redutorSexo, contadorSecundario) {
    let taxaSecundaria = 0;
    let tempoServicoSecundario = this.getTempoServico(0, 0, true);
    let quantidadePBCSecudaria = contadorSecundario;


    let specieKind;
    if (this.tipoBeneficio == 4 || this.tipoBeneficio == 5 || this.tipoBeneficio == 6 ||
      this.tipoBeneficio == 8 || this.tipoBeneficio == 9 || this.tipoBeneficio == 10 ||
      this.tipoBeneficio == 14 || this.tipoBeneficio == 15) {
      specieKind = 1;
    } else if (this.tipoBeneficio == 3 || this.tipoBeneficio == 16 || this.tipoBeneficio == 13) {
      specieKind = 2;
    } else if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2 || this.tipoBeneficio == 11
      || this.tipoBeneficio == 29) {
      specieKind = 3;
    } else if (this.tipoBeneficio == 25) {
      specieKind = 4;
    } else {
      specieKind = null;
    }

    let tempoServico = 0;
    switch (specieKind) {
      case 1:

        tempoServico = tempoServicoSecundario;// / 365.25;

        let redutorProporcional = 0;
        if (this.isProportional) {
          redutorProporcional = 5;
        }
        taxaSecundaria = tempoServico / (35 - redutorProfessor - redutorSexo - redutorProporcional);
        break;
      case 2:
        tempoServico = tempoServicoSecundario * 12;
        let carenciaMeses = this.getMesesCarencia();
        taxaSecundaria = tempoServico / carenciaMeses;
        break;
      case 3:
        const mesesSecundaria = (this.contribuicaoSecundaria.anos * 12) + (this.contribuicaoSecundaria.meses) + (this.contribuicaoSecundaria.dias / 30);
        taxaSecundaria = mesesSecundaria / 12;
        break;
      case 4:
        tempoServico = tempoServicoSecundario; // 365;
        if (redutorSexo == 5) {
          taxaSecundaria = tempoServico / 20;
        } else {
          taxaSecundaria = tempoServico / 25;
        }
        break;
      case 5:
        tempoServico = tempoServicoSecundario; // 365;
        if (redutorSexo == 5) {
          taxaSecundaria = tempoServico / 23;
        } else {
          taxaSecundaria = tempoServico / 28;
        }
        break;
      case 6:
        tempoServico = tempoServicoSecundario;// / 365;
        if (redutorSexo == 5) {
          taxaSecundaria = tempoServico / 28;
        } else {
          taxaSecundaria = tempoServico / 33;
        }
        break;
    }
    return (taxaSecundaria >= 1) ? 1 : taxaSecundaria;
  }

  // tratamentoDeRegras(dataRegra,
  //   dataFimRegra,
  //   valorRegra,
  //   valorComparacao,
  //   tempoTotalContribuicao,
  //   fatorSeguranca,
  //   resultString,
  //   comparacaoTempoContribuicao,
  //   conclusoes, somaMediasGeral) {

  //   const currency = this.loadCurrency(this.dataInicioBeneficio);
  //   let somaMedias = somaMediasGeral;
  //   let somaMediasString = '';

  //   if (fatorSeguranca >= 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao && this.tipoBeneficio == 4) {

  //     somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
  //     conclusoes.push({
  //       order: 3,
  //       tipo: 'fator',
  //       string: 'Fator Previdenciário:', value: fatorSeguranca + '  (Aplicado por ser mais vantajoso)'
  //     });//conclusoes.fator_previdenciario = fatorSeguranca + ' (Aplicado por ser mais vantajoso)';

  //     this.fatorPrevidenciario = fatorSeguranca;
  //     if (typeof somaMedias.valor === 'number') {
  //       somaMediasString = somaMedias.valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  //     }

  //   } else if (fatorSeguranca >= 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao) {


  //     if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
  //       somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
  //       conclusoes.push({
  //         order: 3,
  //         tipo: 'fator',
  //         string: 'Fator Previdenciário:', value: fatorSeguranca + '  (Aplicado por ser mais vantajoso)'
  //       });//conclusoes.fator_previdenciario = fatorSeguranca + ' (Aplicado por ser mais vantajoso)';

  //       this.fatorPrevidenciario = fatorSeguranca;
  //       if (typeof somaMedias.valor === 'number') {
  //         somaMediasString = somaMedias.valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  //       }


  //     }

  //   } else if (fatorSeguranca < 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao) {

  //     if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {

  //       somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
  //       conclusoes.push({
  //         order: 3,
  //         tipo: 'fator',
  //         string: 'Fator Previdenciário:', value: fatorSeguranca + ' (Afastado por ser menos vantajoso - Aplicada a regra ' + resultString + ')'
  //       });

  //       this.isRegraPontos = true;
  //       this.fatorPrevidenciario = fatorSeguranca;
  //       if (typeof somaMedias.valor === 'number') {
  //         somaMediasString = somaMedias.valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  //       }

  //       conclusoes.push({
  //         order: 20,
  //         tipo: 'rmi',
  //         // string: 'Renda Mensal Inicial' + resultString + ':', value: currency.acronimo + somaMediasString
  //         string: 'Renda Mensal Inicial', value: currency.acronimo + ' ' + somaMediasString
  //       });//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
  //       //resultados['specieKind = 4Renda Mensal Inicial com Regra'+ resultString + ': '] = currency.acronimo + somaMedias;
  //     }

  //   } else if (fatorSeguranca < 1 && valorRegra < valorComparacao && tempoTotalContribuicao < comparacaoTempoContribuicao) {

  //     if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
  //       conclusoes.push({
  //         order: 3,
  //         tipo: 'fator',
  //         string: 'Fator Previdenciário:', value: fatorSeguranca + ' (Não atingiu a pontuação mínima para aplicação da regra' + resultString + ')'
  //       });//conclusoes.fator_previdenciario = fatorSeguranca + '- Não tem direito a Regra' + resultString;
  //       this.fatorPrevidenciario = fatorSeguranca;
  //     }
  //   } else if (fatorSeguranca > 1 && valorRegra >= valorComparacao && tempoTotalContribuicao < comparacaoTempoContribuicao) {

  //     conclusoes.push({
  //       order: 3,
  //       tipo: 'fator',
  //       string: 'Fator Previdenciário:', value: fatorSeguranca + ' (Não atingiu a pontuação mínima para aplicação da regra ' + resultString + ' por não possuir 35 anos de contribuição )'
  //     });//conclusoes.fator_previdenciario =  fatorSeguranca + '- Tem direito a regra ' + resultString +' (Não possui 35 anos de contribuicao)';
  //     this.fatorPrevidenciario = fatorSeguranca;

  //   } else if (fatorSeguranca < 1 && valorRegra < valorComparacao && tempoTotalContribuicao > comparacaoTempoContribuicao) {

  //     conclusoes.push({
  //       order: 3,
  //       tipo: 'fator',
  //       string: 'Fator Previdenciário:', value: fatorSeguranca + ' (Não atingiu a pontuação mínima para aplicação da regra ' + resultString + ')'
  //     });//conclusoes.fator_previdenciario = fatorSeguranca + '- Não tem direito a Regra'+ resultString;
  //     this.fatorPrevidenciario = fatorSeguranca;

  //   } else if (this.dataInicioBeneficio < dataRegra || this.dataInicioBeneficio > dataFimRegra) {

  //     conclusoes.push({
  //       order: 3,
  //       tipo: 'fator',
  //       string: 'Fator Previdenciárioas:', value: fatorSeguranca
  //     });//conclusoes.fator_previdenciario = fatorSeguranca;
  //     this.fatorPrevidenciario = fatorSeguranca;

  //   }

  // }


  procurarExpectativa(idadeFracionada, ano, dataInicio, dataFim) {

    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    let dataAgora = moment();
    let expectativaVida;
    if (idadeFracionada > 80) {
      idadeFracionada = 80;
    }

    if (ano != null) {
      expectativaVida = this.ExpectativaVida.getByAno(ano);
      // Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e year == ano
    } else {
      expectativaVida = this.ExpectativaVida.getByProperties(dataInicio, dataFim);
    }
    return expectativaVida;
  }

  projetarExpectativa(idadeFracionada, dib, conclusoes) {
    let expectativa = 0;

    const dataInicio = moment('2000-11-30');
    const dataFim = moment('2019-12-01');
    const dataHoje = moment();



    if (dib > dataHoje) {
      let anos = Math.abs(dataHoje.diff(dib, 'years', true));
      if (anos < 1) {
        anos = Math.round(anos);
      } else {
        anos = Math.trunc(anos);
      }

      const tempo1 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-2, 'years')).year(), null, null);
      const tempo2 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-3, 'years')).year(), null, null);
      const tempo3 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-4, 'years')).year(), null, null);

      expectativa = (anos * Math.abs(((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1;

      this.formula_expectativa_sobrevida = `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - ${tempo1})) + ${tempo1}`;
      // conclusoes.push({order:  0,string:
      // 'Fórmula Expectativa de Sobrevida:' ,value: `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - 
      // ${tempo1})) + ${tempo1}`});//formula_expectativa_sobrevida = "(anos * (((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1";

    } else if (dib.isSameOrBefore(dataInicio)) {
      expectativa = this.procurarExpectativa(idadeFracionada, null, null, dataInicio);
    } else if (dib.isSameOrAfter(dataFim)) {
      expectativa = this.procurarExpectativa(idadeFracionada, null, dib, null);
    } else {
      expectativa = this.procurarExpectativa(idadeFracionada, null, dib, dib);
    }

    if (expectativa <= 0) {
      expectativa = 6;
    }

    return expectativa;
  }

  direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria) {
    let idadeDoSegurado = this.idadeFracionada;
    // let tempoContribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    let redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;
    let redutorSexo = (this.segurado.sexo == 'm') ? 0 : 5;
    // let anosSecundaria = (this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98)).anos;
    let anosSecundaria = tempoContribuicaoSecundaria.anos;
    let anosPrimaria = ((parseFloat(tempoContribuicaoPrimaria.anos) * 365) + (parseFloat(tempoContribuicaoPrimaria.meses) * 30) + parseFloat(tempoContribuicaoPrimaria.dias)) / 365;

    let anosContribuicao = anosPrimaria;
    this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, false, dib);

    let totalContribuicao98 = 0;
    let tempoContribuicaoPrimaria98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    if (tempoContribuicaoPrimaria98 != { anos: 0, meses: 0, dias: 0 }) {
      totalContribuicao98 = ((tempoContribuicaoPrimaria98.anos * 365) + (tempoContribuicaoPrimaria98.meses * 30) + tempoContribuicaoPrimaria98.dias) / 365;
    }

    let direito = true;
    let idadeMinima = true;
    let extra;
    let toll;

    let erroString = '';
    if (this.tipoBeneficio === 4 || this.tipoBeneficio === 6) {

      direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 0);


      if (!direito) {
        if (dib <= this.dataDib98) {

          direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 5);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, true, dib);

        } else if (this.tipoBeneficio != 6) {

          // totalContribuicao98 = ((tempoContribuicaoPrimaria98.anos * 365) + (tempoContribuicaoPrimaria98.meses * 30) + tempoContribuicaoPrimaria98.dias) / 365;

          totalContribuicao98 = tempoContribuicaoPrimaria98.anos +
            (tempoContribuicaoPrimaria98.meses / 12) + (tempoContribuicaoPrimaria98.dias) / 360;

          anosContribuicao = tempoContribuicaoPrimaria.anos +
            (tempoContribuicaoPrimaria.meses / 12) + (tempoContribuicaoPrimaria.dias) / 360;

          extra = this.calcularExtra(totalContribuicao98, redutorSexo);
          toll = this.calcularToll(totalContribuicao98, 0.4, 5, redutorSexo);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, true, dib);

          direito = this.verificarIdadeNecessaria(idadeDoSegurado, 7, 0, redutorSexo, errorArray);
          // direito = direito && this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra + 5);
          direito = direito && this.verificarTempoDeServicoProporcional(anosContribuicao, redutorProfessor, this.segurado.sexo, toll);

        }

        let contribuicao = 35 - redutorProfessor - redutorSexo - anosContribuicao;
        let tempoFracionado = this.tratarTempoFracionado(contribuicao); //Separar o tempo de contribuicao em anos, meses e dias

        if (direito) {
          // Exibir Mensagem de beneficio Proporcional, com o tempo faltante;
          // "POSSUI direito ao benefício proporcional."
          // "Falta(m) 'tempoFracionado' para possuir o direito ao benefício INTEGRAL."

          // errorArray.push('POSSUI direito ao benefício proporcional. Falta(m) '
          //     + tempoFracionado + ' para possuir o direito ao benefício INTEGRAL.');

          this.msgIntegralAteEC1032019 = 'Falta(m) ' + tempoFracionado + ' para adquirir direito à Aposentadoria Integral.';
          this.msgProporcionalAteEC1032019 = 'Possui direito à Aposentadoria Proporcional, conforme cálculo abaixo.';

        } else {
          // Exibir Mensagem de beneficio nao concedido.
          // Falta(m) 'tempoFracionado' para completar o tempo de serviço necessário para o benefício INTEGRAL.
          errorArray.push('Falta(m) ' + tempoFracionado + ' para completar o tempo de serviço necessário para o benefício INTEGRAL.');
          if (totalContribuicao98 > 0) {
            let tempo = 35 - redutorProfessor - redutorSexo - (extra + 5) - anosContribuicao;
            let tempoProporcional = this.tratarTempoFracionado(tempo);
            // Exibir Mensagem com o tempo faltante para o beneficio proporcioanl;
            // Falta(m) 'tempoProporcional' para completar o tempo de serviço necessário para o benefício PROPORCIONAL.

            errorArray.push('Falta(m) ' + tempoProporcional
              + ' para completar o tempo de serviço necessário para o benefício PROPORCIONAL.');
          }
        }
      }
    } else if (this.tipoBeneficio === 3) {

      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);

      if (!idadeMinima || !this.verificarCarencia(-5, redutorProfessor, redutorSexo, errorArray)) {
        errorArray.push('Não possui direito ao benefício.');
        return false;
      }
    } else if (this.tipoBeneficio == 5 || [1915, 1920, 1925].includes(this.tipoBeneficioPosReforma)) {

      const parametrosParaVerificarTempoDeServico = { 5: 20, 1915: 20, 1920: 15, 1925: 10 }
      const valorExtra = parametrosParaVerificarTempoDeServico[this.tipoBeneficioPosReforma];

      direito = this.verificarTempoDeServico(anosContribuicao, 0, 0, valorExtra);

      if (!direito) {
        errorArray.push('Não possui direito ao benefício de aposentadoria especial.');
      }
    } else if (this.tipoBeneficio === 16) {
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
      if (!idadeMinima) {
        errorArray.push('Não possui direito ao benefício.');
        return false;
      }
      if (!this.verificarCarencia(0, redutorProfessor, redutorSexo, errorArray)) {
        errorArray.push('Não possui direito ao benefício.');
        return false;
      }
    } else if (this.tipoBeneficio === 25) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 10);
      if (!direito) {
        errorArray.push('Não possui direito ao benefício.');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
    } else if (this.tipoBeneficio === 26) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 6);
      if (!direito) {
        errorArray.push('Não possui direito ao benefício.');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
    } else if (this.tipoBeneficio === 27) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 2);
      if (!direito) {
        errorArray.push('Não possui direito ao benefício.');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
    } else if (this.tipoBeneficio === 28) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 20);
      if (!direito) {
        errorArray.push('Não possui direito ao benefício.');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
      if (!this.verificarIdadeMinima(idadeDoSegurado, errorArray)) {
        errorArray.push('Não possui direito ao benefício.');
        return false; // Exibir Mensagem de erro com a idade faltando;
      }
    }

    return direito;
  }

  getIN45() {
    this.withIN45 = true;
    if (this.tipoBeneficio == 25 || this.tipoBeneficio == 26 || this.tipoBeneficio == 27 || this.tipoBeneficio == 28) {
      this.withIN45 = false;
    }
  }

  limitarTetosEMinimos(valor, data, sc_mm_ajustar = true) {
    // se a data estiver no futuro deve ser utilizado os dados no mês atual
    const moeda = data.isSameOrBefore(moment(), 'month') ? this.Moeda.getByDate(data) : this.Moeda.getByDate(moment());

    const salarioMinimo = (moeda) ? moeda.salario_minimo : 0;
    const tetoSalarial = (moeda) ? moeda.teto : 0;
    let avisoString = '';
    let valorRetorno = valor;

    if (moeda && valor < salarioMinimo && sc_mm_ajustar) {
      valorRetorno = salarioMinimo;
      avisoString = 'LIMITADO AO MÍNIMO'
    } else if (moeda && valor > tetoSalarial) {
      valorRetorno = tetoSalarial;
      avisoString = 'LIMITADO AO TETO'
    }

    if (typeof valorRetorno !== 'number') {
      valorRetorno = parseFloat(valorRetorno);
    }

    return { valor: valorRetorno, aviso: avisoString };
  }

  verificarCarencia(redutorIdade, redutorProfessor, redutorSexo, errorArray) {
    if (this.tipoBeneficio == 3 || this.tipoBeneficio == 16) {
      let mesesCarencia = 180;
      if (moment(this.segurado.data_filiacao, 'DD/MM/YYYY') < this.dataLei8213) { // Verificar se a data de filiação existe
        const anoNecessario = this.getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo)
        let carenciaProgressiva = this.CarenciaProgressiva.getCarencia(anoNecessario);
        if (carenciaProgressiva != 0) {
          mesesCarencia = carenciaProgressiva;
        } else if (anoNecessario < 1991) {
          mesesCarencia = 60;
        }
      }

      if (this.calculo.carencia < mesesCarencia) {
        const erroCarencia = 'Falta(m) ' + (mesesCarencia - this.calculo.carencia) + ' mês(es) para a carência necessária.';
        errorArray.push(erroCarencia);
        return false;
      }
    }
    return true;
  }

  getRendaMensal(conclusoes, rmi, currency) {

    if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6 || this.tipoBeneficio == 3 || this.tipoBeneficio == 16) {
      // conclusoes.push({order:  0,string:"Renda Mensal Inicial com Fator Previdenciario:",value:this.formatMoney(somaMedias * this.fatorPrevidenciario, currency.acronimo)});//resultados['Renda Mensal Inicial com Fator Previdenciario: '] = currency.acronimo + rmi;

      const moedaDib = this.dataInicioBeneficio.isSameOrBefore(moment(), 'month') ?
        this.Moeda.getByDate(this.dataInicioBeneficio) : this.Moeda.getByDate(moment());

      if (rmi <= moedaDib.salario_minimo) {
        rmi = moedaDib.salario_minimo;
      }

      //  if (this.fatorPrevidenciario > 1) {
      conclusoes.push({
        order: 20,
        tipo: 'rmi',
        //  string: 'Renda Mensal Inicial com Fator Previdenciario:', value: this.formatMoney(rmi, currency.acronimo)
        string: 'Renda Mensal Inicial', value: this.formatMoney(rmi, currency.acronimo)
      });
      // }

    } else if (this.tipoBeneficio != 1) {

      conclusoes.push({
        order: 20,
        tipo: 'rmi',
        string: 'Renda Mensal Inicial', value: this.formatMoney(rmi, currency.acronimo)
      });// resultados['Renda Mensal Inicial '] = currency.acronimo + rmi;

    } else if (this.tipoBeneficio == 1) {

      conclusoes.push({
        order: 20,
        tipo: 'rmi',
        string: 'Renda Mensal Inicial', value: this.formatMoney(rmi, currency.acronimo)
      });

      // se dib maior que 01-03-2015
      if (moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY') >= this.dataMP664 && this.calculo.media_12_ultimos === 0) {

        const rmiConsiderado = (rmi > this.totalMedia12Contribuicoes) ? this.totalMedia12Contribuicoes : rmi;
        // modificado 14/07/2021 
        // let rmiConsiderado = rmi;
        // if (this.calculo.media_12_ultimos === 0 && rmi > this.totalMedia12Contribuicoes) {
        //   rmiConsiderado = this.totalMedia12Contribuicoes;
        // }

        conclusoes.push({
          order: 22,
          tipo: 'rmi',
          string: 'Renda Mensal Inicial Considerada', value: this.formatMoney(rmiConsiderado, currency.acronimo)
        });

      }

    }


  }

  getIdadeFracionada(type = true) {

    const dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    let dataInicioBeneficioI = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');

    if (dataInicioBeneficioI >= moment('13/11/2019', 'DD/MM/YYYY')) {
      dataInicioBeneficioI = moment('13/11/2019', 'DD/MM/YYYY')
    }

    const idadeEmDias = dataInicioBeneficioI.diff(dataNascimento, 'days');

    if (type) {
      return idadeEmDias / 365;
    }

    const idade33 = DefinicaoTempo.calcularTempo360NotDayStart(moment(this.segurado.data_nascimento, 'DD/MM/YYYY'),
      dataInicioBeneficioI);

    return idade33.fullDays / 360;



    // if (this.dataInicioBeneficio >= this.dataPec062019) {
    //   return this.dataPec062019.diff(dataNascimento, 'years', true);
    // }

    // return this.dataInicioBeneficio.diff(dataNascimento, 'years', true);


  }


  testeDifdata(time1, time2) {

    const str1 = time1.split('/');
    const str2 = time2.split('/');
    // yyyy   , mm       , dd
    const dob = new Date(str1[2], str1[1] - 1, str1[0]).getTime();
    const dateToCompare = new Date(str2[2], str2[1] - 1, str2[0]).getTime();
    //    const age = (dateToCompare - dob) / (365 * 24 * 60 * 60 * 1000);
    return (dateToCompare - dob) / (365 * 24 * 60 * 60 * 1000);
  }

  mostrarReajustesAdministrativos(tableId) {

    if (this.showReajustesAdministrativos) {
      document.getElementById(tableId).scrollIntoView();
      return;
    }


    // let dataInicio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
    let dataInicio = this.dataInicioBeneficio;
    this.ReajusteAutomatico.getByDate(dataInicio, moment())
      .then((reajustes: ReajusteAutomatico[]) => {

        const reajustesAutomaticos = reajustes;
        let valorBeneficio = (this.valorExportacao) ? parseFloat(this.valorExportacao) : 0;
        let dataPrevia = moment(reajustesAutomaticos[0].data_reajuste);
        let dataCorrente = dataInicio;

        const reajuste02_2020 = new ReajusteAutomatico;
        reajuste02_2020.data_reajuste = '2020-02-01';
        //reajuste02_2020.indice = 1; //1,005774783445621
        reajuste02_2020.indice = 1.0057;
        reajuste02_2020.salario_minimo = '1045.00';
        reajuste02_2020.teto = '6101.06';


        const moeda = this.Moeda.getByDate(this.dataInicioBeneficio);


        if (valorBeneficio === parseFloat(moeda.salario_minimo)) {
          reajustesAutomaticos.push(reajuste02_2020);
        }

        reajustesAutomaticos.sort((entry1, entry2) => {
          if (moment(entry1.data_reajuste) > moment(entry2.data_reajuste)) {
            return 1;
          }
          if (moment(entry1.data_reajuste) < moment(entry2.data_reajuste)) {
            return -1;
          }
          return 0;
        });

        for (const reajusteAutomatico of reajustesAutomaticos) {
          dataCorrente = moment(reajusteAutomatico.data_reajuste);
          const siglaMoedaDataCorrente = this.loadCurrency(dataCorrente).acronimo;
          const teto = parseFloat(reajusteAutomatico.teto);
          let minimo = parseFloat(reajusteAutomatico.salario_minimo);

          if (this.tipoBeneficio === 17) {
            minimo *= 0.3;
          } else if (this.tipoBeneficio === 18) {
            minimo *= 0.4;
          } else if (this.tipoBeneficio === 7 || this.tipoBeneficio == 1905) {
            minimo *= 0.5;
          } else if (this.tipoBeneficio === 19) {
            minimo *= 0.6;
          }
          let reajuste = reajusteAutomatico.indice != null ? parseFloat(reajusteAutomatico.indice) : 1;

          if (dataCorrente.year() === 2006 && dataCorrente.month() === 7) {
            reajuste = 1.000096;
          }


          valorBeneficio *= reajuste;

          if (dataPrevia.isSame(dataCorrente) && this.irtRejusteAdministrativo > 1) {
            valorBeneficio *= this.irtRejusteAdministrativo;
          }

          const correcaoMinimo2017 = (dataCorrente.isSame(moment('2017-01-01'))
            && (valorBeneficio.toFixed(3) === (minimo + 0.904).toFixed(3)));
          const correcaoMinimo2018 = (dataCorrente.isSame(moment('2018-01-01'))
            && (valorBeneficio.toFixed(3) === (minimo + 2.396).toFixed(3)));

          let limit = '-';
          if (valorBeneficio < minimo || (correcaoMinimo2017 || correcaoMinimo2018)) {
            valorBeneficio = minimo;
            limit = 'M'
          }
          if (valorBeneficio > teto) {
            valorBeneficio = teto;
            limit = 'T'
          }

          valorBeneficio = this.convertCurrency(valorBeneficio, dataPrevia, dataCorrente);

          const line = {
            competencia: dataCorrente.format('MM/YYYY'),
            reajuste: reajuste,
            beneficio: this.formatMoney(valorBeneficio, siglaMoedaDataCorrente),
            limite: limit
          };


          if (dataCorrente.isSame('2021-01-01') && line.beneficio == 'R$ 1.101,95') {
            line.beneficio = 'R$ 1.100,00';
            line.limite = 'M';
          }

          this.reajustesAdministrativosTableData.push(line);
          dataPrevia = dataCorrente;

        }

        this.reajustesAdministrativosTableOptions = {
          ...this.reajustesAdministrativosTableOptions,
          data: this.reajustesAdministrativosTableData,
        }

        this.showReajustesAdministrativos = true;
        document.getElementById(tableId).scrollIntoView();

      });
  }


  private checkFatorprogressivo() {

    this.isfatorPrevidenciarioProgressivo = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY')
      .isBetween('1999-11-27', '2004-10-31', 'days', '[]');

    this.isfatorPrevidenciario = !(moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY')
      .isBetween('1999-11-27', '1999-11-30', 'days', '[]'));


    return this.isfatorPrevidenciarioProgressivo;
  }

  private getMesesApos1999FatorProgressivo(mes, ano) {

    const mesesApos1999 = {
      1999: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      2000: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      2001: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
      2002: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
      2003: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
      2004: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 0, 0],
    };

    const numMeses = mesesApos1999[ano][(mes - 1)];
    return (numMeses !== undefined) ? numMeses : 0;
  }


  private checkFatorprogressivoContMeses() {

    const splitF = this.calculo.data_pedido_beneficio.split('/');
    return this.getMesesApos1999FatorProgressivo(splitF[1], splitF[2]);
  }


  private calcularFatorProgressivo(somaMedias, conclusoes) {

    const nCompetencias = this.checkFatorprogressivoContMeses();
    let parcela1 = 0;
    let parcela2 = 0;
    let total = 0;


    if (this.checkFatorprogressivo() && nCompetencias > 0) {

      this.formula_fator = '';

      parcela1 = (this.fatorPrevidenciario * nCompetencias * somaMedias) / 60;
      parcela2 = (somaMedias * (60 - nCompetencias)) / 60;
      total = parcela1 + parcela2;

      const formula = `((${this.formatDecimal(this.fatorPrevidenciario, 4)} * ${nCompetencias} *
       ${this.formatDecimal(somaMedias, 2)} / 60)  +
      (${this.formatDecimal(somaMedias, 2)} * (60 - ${nCompetencias})) / 60`;

      this.formula_fator = formula;

      this.SMBFatorPrevidenciarioProgressivo = {
        formula: formula,
        parcela1: parcela1,
        parcela2: parcela2,
        total: total
      };

      conclusoes.push({
        order: 4.1,
        tipo: 'formula_sb',
        string: 'Fórmula do Salário de Benefício',
        value: this.formula_fator
      });

      return total;
    }

    return somaMedias;

  }



  public afastarIN77(AplicarIN77) {
    this.naoAplicarIN77 = (!AplicarIN77);
    this.ngOnInit();
  }

}
