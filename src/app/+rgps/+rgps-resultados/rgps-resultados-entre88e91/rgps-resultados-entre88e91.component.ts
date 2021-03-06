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
import { IndiceInps } from '../IndiceInps.model';
import { IndiceInpsService } from '../IndiceInps.service';
import { SalarioMinimoMaximo } from '../SalarioMinimoMaximo.model';
import { SalarioMinimoMaximoService } from '../SalarioMinimoMaximo.service';
import * as moment from 'moment';

@Component({
  selector: 'app-rgps-resultados-entre88e91',
  templateUrl: './rgps-resultados-entre88e91.component.html',
  styleUrls: ['./rgps-resultados-entre88e91.component.css']
})
export class RgpsResultadosEntre88e91Component extends RgpsResultadosComponent implements OnInit {
  @Input() calculo;
  @Input() segurado;
  @Input() tipoCalculo;
  @Input() isBlackHole;
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

  public conclusoes91_98 = {};
  public tableData91_98 = [];
  public listaValoresContribuidos;
  public carenciasProgressivas;
  public reajustesAutomaticos;
  public valorExportacao;
  public contribuicaoPrimaria91_98 = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundaria = { anos: 0, meses: 0, dias: 0 };
  public coeficiente;
  public erros = [];
  public direito = false;
  public tableOptions91_98 = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.tableData91_98,
    columns: [
      { data: 'id' },
      { data: 'competencia' },
      { data: 'contribuicao_primaria' },
      { data: 'fator' },
      { data: 'contribuicao_primaria_revisada' },
    ],
    columnDefs: [
      {
        'targets': [0, 1, 2, 3, 4],
        'className': 'text-center'
      }
    ]
  };
  public reajustesAdministrativos = true;
  public Math = Math;


  public contribuicaoPrimaria88 = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundaria88 = { anos: 0, meses: 0, dias: 0 };
  public listaValoresContribuidos88;
  public tableData88 = [];
  public conclusoes88 = {};
  public erro = '';
  public nenhumaContrib = false;
  public tableOptions88 = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.tableData88,
    columns: [
      { data: 'indice_competencia' },
      { data: 'competencia' },
      { data: 'contribuicao_primaria' },
      { data: 'inps' },
      { data: 'contribuicao_primaria_revisada' },
    ],
    columnDefs: [
      {
        'targets': [0, 1, 2, 3, 4],
        'className': 'text-center'
      }
    ]
  };



  constructor(private CarenciaProgressiva: CarenciaProgressivaService,
    protected route: ActivatedRoute,
    private ReajusteAutomatico: ReajusteAutomaticoService,
    protected ValoresContribuidos: ValorContribuidoService,
    private Moeda: MoedaService,
    private CalculoRgpsService: CalculoRgpsService,
    protected rt: ActivatedRoute,
    private IndiceInps: IndiceInpsService,
    private SalarioMinimoMaximo: SalarioMinimoMaximoService,) {
    super(null, route, null, null, null, null, null, null);
  }

  ngOnInit() {
    this.boxId = this.generateBoxId(this.calculo.id, '8891');
    this.isUpdating = true;
    this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    this.idadeSegurado = this.getIdadeNaDIB(this.dataInicioBeneficio);
    this.stringCabecalho = 'Entre 05/04/1991 e 15/12/1998'
    this.contribuicaoPrimaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    this.contribuicaoSecundaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);
    this.contribuicaoPrimaria88 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    this.contribuicaoSecundaria88 = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);

    this.idCalculo = this.calculo.id;
    this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);
    // Ajuste para novos tipos conforme reforma
    // this.tipoBeneficio = this.getEspecieReforma(this.tipoBeneficio);


    let dataInicio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');

    if (this.dataInicioBeneficio > this.dataDib98) {
      dataInicio = this.dataDib98;
    }

    dataInicio = moment(dataInicio.clone().add(-1, 'months').endOf('month').format('YYYY-MM-DD'));

    let mesesLimite = 0;
    let mesesLimiteTotal = 0;

    let mesesLimite_79 = 0;
    let mesesLimiteTotal_79 = 0;

    if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {

      mesesLimite_79 = 18;
      mesesLimiteTotal_79 = 12;

      mesesLimite = 48;
      mesesLimiteTotal = 36;

    } else {

      mesesLimite = 48;
      mesesLimiteTotal = 36;

    }

    let dataLimite;
    if (mesesLimite > 0) {
      dataLimite = (dataInicio.clone()).add(-mesesLimite, 'months');
    } else {
      dataLimite = moment('1994-07-01');
    }

    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.ValoresContribuidos.getByCalculoId(this.idCalculo, dataInicio, dataLimite, mesesLimiteTotal, this.idSegurado)
      .then(valorescontribuidos => {

        this.listaValoresContribuidos = valorescontribuidos;

        if (this.listaValoresContribuidos.length == 0) {
          // Exibir MSG de erro e encerrar C??lculo.
          this.nenhumaContrib = true;
          this.isUpdating = false;

        } else {

          const primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
          this.Moeda.getByDateRange(primeiraDataTabela, moment())
            .then((moeda: Moeda[]) => {

              this.moeda = moeda;
              let dataReajustesAutomaticos = this.dataInicioBeneficio;
              if (this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998') {
                dataReajustesAutomaticos = this.dataDib98;
              } else if (this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999') {
                dataReajustesAutomaticos = this.dataDib99;
              }

              this.ReajusteAutomatico.getByDate(dataReajustesAutomaticos, this.dataInicioBeneficio)
                .then(reajustes => {
                  this.reajustesAutomaticos = reajustes;
                  this.CarenciaProgressiva.getCarencias()
                    .then(carencias => {

                      this.carenciasProgressivas = carencias;
                      this.calculo91_98(this.erros, this.conclusoes91_98, this.contribuicaoPrimaria91_98, this.contribuicaoSecundaria91_98);
                      this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
                      this.anterior88();

                    });
                });
            });
        }

      });
  }

  calculo91_98(errorArray, conclusoes, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria) {
    let dib = this.dataInicioBeneficio;
    let dibCurrency = this.loadCurrency(dib);

    if (this.tipoCalculo == '91_98') {
      if (this.dataInicioBeneficio > this.dataDib98) {
        dib = this.dataDib98;
      }
    } else if (this.tipoCalculo == '98_99') {
      if (this.dataInicioBeneficio > this.dataDib99) {
        dib = this.dataDib99;
      }
    }

    let dataComparacao = (dib.clone()).startOf('month');
    if (!this.reajustesAdministrativos) {
      dataComparacao = (this.dataInicioBeneficio.clone()).startOf('month');
    }

    let dibPrimeiro = (dib.clone()).startOf('month');

    let moedaComparacao = this.Moeda.getByDate(dataComparacao);
    let moedaDIB = this.Moeda.getByDate(dib);

    this.direito = this.direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria);
    if (!this.direito) {
      return;
    }
    let totalPrimaria = 0;
    let totalSecundaria = 0;

    let contagemSecundaria = 0;
    let contagemPrimaria = 0;
    let tableData91_98 = [];
    let index = 0;


    for (const contribuicao of this.listaValoresContribuidos) {
      contagemPrimaria++;

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
      if (contribuicaoPrimaria != 0) {

        const valorAjustadoObj = this.limitarTetosEMinimos(contribuicaoPrimaria, dataContribuicao);
        contribuicaoPrimaria = valorAjustadoObj.valor;
        limiteString = valorAjustadoObj.aviso;
      }

      if (contribuicaoSecundaria != 0) {
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
      
      tableData91_98.push(line);
      index++;
    }


    if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6
      || [5, 1915, 1920, 1925].includes(this.tipoBeneficio)
      || this.tipoBeneficio == 3 || this.tipoBeneficio == 16
    ) {
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

    let rmiValoresAdministrativos = rmi;

    if (this.reajustesAdministrativos &&
      ((this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999' && this.dataInicioBeneficio >= this.dataDib99) ||
        (this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998' && this.dataInicioBeneficio >= this.dataDib98))) {
      rmiValoresAdministrativos = this.getValoresAdministrativos(rmiValoresAdministrativos);
    }

    if (this.tipoBeneficio == 17 || // AuxilioAcidente30
      this.tipoBeneficio == 18 || // AuxilioAcidente40
      this.tipoBeneficio == 7 || // AuxilioAcidente50
      this.tipoBeneficio == 19) {  // AuxilioAcidente60
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

      if (contribuicaoMedia > rmiValoresAdministrativos) {
        rmiValoresAdministrativos = contribuicaoMedia * fatorAuxilio;
      } else {
        rmiValoresAdministrativos = salMinimo * fatorAuxilio;
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
      this.CalculoRgpsService.update(this.calculo)
    }

    const currency = this.loadCurrency(dib);

    // Conclus??es abaixo da tabela:
    conclusoes.total_contribuicoes_primarias = this.formatMoney(totalPrimaria, currency.acronimo);
    conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaPrimaria, currency.acronimo);
    conclusoes.divisor_calculo_media = contagemPrimaria;

    if (totalSecundaria > 0)
      conclusoes.total_contribuicoes_secundarias = this.formatMoney(totalSecundaria, currency.acronimo);;
    if (mediaSecundaria > 0) {
      conclusoes.media_contribuicoes_secundarias = this.formatMoney(mediaSecundaria, currency.acronimo);
      conclusoes.divisor_calculo_media_secundaria = contagemSecundaria;
    }

    conclusoes.media_contribuicoes = this.formatMoney(contribuicaoMedia, currency.acronimo);
    conclusoes.coeficiente = this.coeficiente;
    conclusoes.indice_reajuste_teto = indiceReajuste;
    conclusoes.salario_minimo = this.formatMoney(moedaComparacao.salario_minimo, currency.acronimo);
    conclusoes.teto = this.formatMoney(moedaComparacao.teto, currency.acronimo);
    conclusoes.renda_mensal_inicial = this.formatMoney(rmi, currency.acronimo);
    conclusoes.renda_mensal_inicial_data_dib = this.formatMoney(rmiValoresAdministrativos, currency.acronimo);
    this.valorExportacao = this.formatDecimal(rmiValoresAdministrativos, 2).replace(',', '.');
    this.tableData91_98 = tableData91_98;
    this.tableOptions91_98 = {
      ...this.tableOptions91_98,
      data: this.tableData91_98,
    }
  }

  direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria) {

    const idadeDoSegurado = this.idadeSegurado;
    const redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;
    const redutorSexo = (this.segurado.sexo == 'm') ? 0 : 5;
    const anosSecundaria = parseFloat(tempoContribuicaoSecundaria.anos);
    const anosPrimaria = ((parseFloat(tempoContribuicaoPrimaria.anos) * 365)
      + (parseFloat(tempoContribuicaoPrimaria.meses) * 30)
      + parseFloat(tempoContribuicaoPrimaria.dias)) / 365;

    const anosContribuicao = anosPrimaria;
    this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, false, dib);

    let totalContribuicao98 = 0;
    const tempoContribuicaoPrimaria98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    if (tempoContribuicaoPrimaria98 != { anos: 0, meses: 0, dias: 0 }) {
      totalContribuicao98 = ((tempoContribuicaoPrimaria98.anos * 365)
        + (tempoContribuicaoPrimaria98.meses * 30)
        + tempoContribuicaoPrimaria98.dias) / 365;
    }

    let direito = true;
    let direitop = true;
    let idadeMinima = true;
    let extra;
    let toll;

    const erroString = '';
    if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {

      direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 0);

      if (!direito) {

        if (dib <= this.dataDib98) {

          direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 5);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, true, dib);

        } else {

          extra = this.calcularExtra(totalContribuicao98, redutorSexo);
          toll = this.calcularToll(totalContribuicao98, 0.4, 5, redutorSexo);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, true, dib);
          direito = this.verificarIdadeNecessaria(idadeDoSegurado, 7, 0, redutorSexo, errorArray);
          direitop = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra + 5);

          direito = (direito && direitop);

        }
        const contribuicao = 35 - redutorProfessor - redutorSexo - anosContribuicao;
        const tempoFracionado = this.tratarTempoFracionado(contribuicao); // Separar o tempo de contribuicao em anos, meses e dias

        if (direito) {
          // Exibir Mensagem de beneficio Proporcional, com o tempo faltante;
          // "POSSUI direito ao benef??cio proporcional."
          // "Falta(m) 'tempoFracionado' para possuir o direito ao benef??cio INTEGRAL."
          errorArray.push('POSSUI direito ao benef??cio proporcional. Falta(m) '
            + tempoFracionado + ' para possuir o direito ao benef??cio INTEGRAL.');

        } else {
          // Exibir Mensagem de beneficio nao concedido.
          // Falta(m) 'tempoFracionado' para completar o tempo de servi??o necess??rio para o benef??cio INTEGRAL.
          errorArray.push('Falta(m) '
            + tempoFracionado + ' para completar o tempo de servi??o necess??rio para o benef??cio INTEGRAL.');

          if (totalContribuicao98 > 0 && errorArray.length == 0) {

            //   direito = true;
            const tempo = 35 - redutorProfessor - (extra + 5) - anosContribuicao;
            const tempoProporcional = this.tratarTempoFracionado(tempo);

            // Exibir Mensagem com o tempo faltante para o beneficio proporcioanl;
            // Falta(m) 'tempoProporcional' para completar o tempo de servi??o necess??rio para o benef??cio PROPORCIONAL.
            errorArray.push('Falta(m) '
              + tempoProporcional + ' para completar o tempo de servi??o necess??rio para o benef??cio PROPORCIONAL.');
          }
        }

      }
    } else if (this.tipoBeneficio == 3) {
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
    } else if (this.tipoBeneficio == 16) {
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
      if (!idadeMinima) {
        return false;
      }
      if (!this.verificarCarencia(0, redutorProfessor, redutorSexo, errorArray)) {
        return false;
      }
    } else if (this.tipoBeneficio == 25) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 10);
      if (!direito) {
        errorArray.push('');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
      }
    } else if (this.tipoBeneficio == 26) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 6);
      if (!direito) {
        errorArray.push('');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
      }
    } else if (this.tipoBeneficio == 27) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 2);
      if (!direito) {
        errorArray.push('');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.   
      }
    } else if (this.tipoBeneficio == 28) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 20);
      if (!direito) {
        errorArray.push('');
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
      if (!this.verificarIdadeMinima(idadeDoSegurado, errorArray)) {
        errorArray.push('');
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

    switch (this.tipoBeneficio) {
      // Aux??lio Doen??a Previdenci??rio
      case 1:
        if (dib >= this.dataLei9032)
          coeficienteAux = 91;
        else if (dib >= this.dataLei8213) {
          coeficienteAux = 80 + anosContribuicao;
          if (coeficienteAux > 92)
            coeficienteAux = 92;
        } else {
          coeficienteAux = 80 + anosContribuicao;
        }
        break;
      // Aposentadoria por invalidez previd??nci??ria
      case 2:
        if (dib >= this.dataLei9032)
          coeficienteAux = 100;
        else
          coeficienteAux = 80 + anosContribuicao;
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
        if (dib >= this.dataLei9032)
          coeficienteAux = 100;
        else
          coeficienteAux = 85 + anosContribuicao;
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
    if (Math.trunc(anosContribuicao) < Math.trunc(tempoNecessario))
      return false;
    return true;
  }

  coeficienteProporcional(extra, porcentagem, toll) {
    let coeficienteProporcional = 0.7 * Math.trunc(extra - toll) * porcentagem;
    coeficienteProporcional = (coeficienteProporcional > 1) ? 1 : coeficienteProporcional;
    coeficienteProporcional = (coeficienteProporcional < 0.7) ? 0.7 : coeficienteProporcional;
    return coeficienteProporcional;
  }

  verificarIdadeMinima(idade, errorArray) {
    let temIdadeMinima = true;
    let idadeMinima;
    if (this.tipoBeneficio == 3) {
      if (this.segurado.sexo == 'm' && this.idadeSegurado < 65) {
        idadeMinima = 65;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo == 'f' && this.idadeSegurado < 60) {
        idadeMinima = 60;
        temIdadeMinima = false;
      }
    } else if (this.tipoBeneficio == 16 || this.tipoBeneficio == 28) {
      if (this.segurado.sexo == 'm' && this.idadeSegurado < 60) {
        idadeMinima = 60;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo == 'f' && this.idadeSegurado < 55) {
        idadeMinima = 55;
        temIdadeMinima = false;
      }
    }

    if (!temIdadeMinima) {
      errorArray.push('O segurado n??o tem a idade m??nima (' + idadeMinima + ' anos) para se aposentar por idade. Falta(m) ' + (idadeMinima - this.idadeSegurado) + ' ano(s) para atingir a idade m??nima.');
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
        dataAnterior = reajusteAutomatico.data_reajuste;
      } else {
        dataAnterior = dataCorrente;
      }
      dataCorrente = reajusteAutomatico.data_reajuste;
      const reajuste = (reajusteAutomatico.indice != null) ? reajusteAutomatico.indice : 1;
      valorBeneficio = this.convertCurrency(valorBeneficio, dataAnterior, dataCorrente);
      if (this.reajustesAdministrativos) {
        valorBeneficio = valorBeneficio * reajuste;
      }
      valorBeneficio = (valorBeneficio < reajusteAutomatico.salario_minimo) ? reajusteAutomatico.salario_minimo : valorBeneficio;
      valorBeneficio = (valorBeneficio > reajusteAutomatico.teto) ? reajusteAutomatico.teto : valorBeneficio;
    }
    return valorBeneficio;
  }

  verificarCarencia(redutorIdade, redutorProfessor, redutorSexo, errorArray) {
    if (this.tipoBeneficio == 3 || this.tipoBeneficio == 16) {
      let mesesCarencia = 180;
      if (moment(this.segurado.data_filiacao, 'DD/MM/YYYY') < this.dataLei8213) { // Verificar se a data de filia????o existe
        const anoNecessario = this.getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo)
        const carenciaProgressiva = this.CarenciaProgressiva.getCarencia(anoNecessario);
        if (carenciaProgressiva != 0) {
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
    if (this.tipoBeneficio == 6) {
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
    if (year != 0) {
      returnStr += year + ' ano(s)';
    }
    if (month != 0 && year != 0) {
      returnStr += ' e ';
    }
    if (month != 0) {
      returnStr += month + ' mes(es)';
    }
    if (month == 0 && year == 0) {
      returnStr = ' 0 ano(s) ';
    }
    if (year < 0) {
      returnStr = '';
    }
    return returnStr;
  }

  calcularBonus(tempoServico) {
    let bonus;
    if (this.segurado.sexo == 'm') {
      bonus = 17 / 100;
    } else {
      bonus = 20 / 100;
    }
    bonus = bonus * tempoServico;
    return bonus;
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

  getInps(year) {
    if (this.inpsList) {
      for (const inps of this.inpsList) {
        if (inps.ano == year) {
          return inps.valor;
        }
      }
      return null;
    }
    return null;
  }

  getLimitesSalariais(data) {
    const ret = { minimo: this.salarioMinimoMaximo.minimum_salary_ammount, maximo: this.salarioMinimoMaximo.maximum_salary_ammount };
    return ret;
  }

  getIndiceSalarioMinimo(especie, anoContribuicao) {
    let index = 0.0;
    if (especie === 1) {
      index = 0.75;
    } else if ((especie > 1 && especie <= 5) || especie === 16) {
      index = 0.9;
    } else if (especie === 20) {
      index = 0.25;
      if (anoContribuicao >= 30 && anoContribuicao < 35) {
        index = 0.2;
      }
    }
    return index;
  }

  getIndiceEspecie(especie, sexo, anoContribuicao) {
    let indiceAno = 0.0
    if (anoContribuicao != 0) {
      indiceAno = anoContribuicao / 100;
    }

    let index = 0.0;
    switch (especie) {
      case 1: {// Aux??lio Doen??a
        index = 0.7;
        if (indiceAno > 0.2) {
          indiceAno = 0.2;
        }
        index += indiceAno;
        break;
      }
      case 2: {// Aposentadoria por invalidez
        index = 0.7;
        if (indiceAno > 0.3) {
          indiceAno = 0.3;
        }
        index += indiceAno;
        break;
      }
      case 3: { // Idade - trabalhador Rural
        index = 0.7;
        if (indiceAno > 0.25) {
          indiceAno = 0.25;
        }
        index += indiceAno;
        break;
      }
      case 5: { // Idade - trabalhador Urbano
        index = 0.7;
        if (indiceAno > 0.25) {
          indiceAno = 0.25;
        }
        index += indiceAno;
        break;
      }
      case 16: {// Aposentadoria Especial.
        index = 0.7;
        if (indiceAno > 0.25) {
          indiceAno = 0.25;
        }
        index += indiceAno;
        break;
      }
      case 4: {  // Aposentadoria por tempo de contribui????o
        if (sexo === 'm') {
          index = 0.8;
          let indiceAnoAux = anoContribuicao - 30;
          if (indiceAnoAux > 5) {
            indiceAnoAux = 5;
          }
          if (indiceAnoAux < 0) {
            indiceAnoAux = 0;
          }
          index += (0.03 * indiceAnoAux);
        } else {
          index = 0.95;
        }
        break;
      }
      case 20: {
        index = 0.2;
        break;
      }
      default: {
        index = 0;
        break;
      }
    }
    return index;
  }

  verificaErros() {
    let erro = '';
    const anoContribuicaoPrimariaAnterior88 = this.contribuicaoPrimaria88.anos;
    if ((this.calculo.tipo_seguro == 'Aposentadoria por Idade - Trabalhador Rural' ||
      this.calculo.tipo_seguro == 'Aposentadoria por Idade - Trabalhador Urbano' ||
      this.calculo.tipo_seguro == 'Aposentadoria por idade - Trabalhador Rural' ||
      this.calculo.tipo_seguro == 'Aposentadoria por idade - Trabalhador Urbano') && this.calculo.carencia < 60) {
      erro = 'Falta(m) ' + (60 - this.calculo.carencia) + ' m??s(es) para a carencia necess??ria.';
    } else if (this.segurado.sexo == 'm' && this.idadeSegurado < 65 && (this.tipoBeneficio == 3 || this.tipoBeneficio == 16)) {
      erro = 'O segurado n??o tem a idade m??nima (65 anos) para se aposentar por idade. Falta(m) ' + (65 - this.idadeSegurado) + ' ano(s) para atingir a idade m??nima.'
    } else if (this.segurado.sexo == 'f' && this.idadeSegurado < 60 && (this.tipoBeneficio == 3 || this.tipoBeneficio == 16)) {
      erro = 'O segurado n??o tem a idade m??nima (60 anos) para se aposentar por idade. Falta(m) ' + (60 - this.idadeSegurado) + ' ano(s) para atingir a idade m??nima.'
    } else if ((this.calculo.tipo_seguro == 'Aposentadoria por tempo de servi??o' || this.calculo.tipo_seguro == 'Aposentadoria por tempo de contribui????o') &&
      anoContribuicaoPrimariaAnterior88 < 30) {
      let qtde_anos = 30 - this.contribuicaoPrimaria88.anos;
      let qtde_meses = 12 - this.contribuicaoPrimaria88.meses;
      let qtde_dias = 31 - this.contribuicaoPrimaria88.dias;
      if (this.contribuicaoPrimaria88.meses == 0)
        qtde_meses--;
      if (this.contribuicaoPrimaria88.dias == 0)
        qtde_dias--;
      if (qtde_meses != 0)
        qtde_anos--;
      erro = 'Falta(m) ' + qtde_anos + ' ano(s), ' + qtde_meses + ' m??s(es) e ' + qtde_dias + ' dia(s) para completar o tempo de servi??o necess??rio.';
    }
    return erro;
  }

  anterior88() {

    let mesesLimite = 0;
    let mesesLimiteTotal = 0;
    if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
      mesesLimite = 18;
      mesesLimiteTotal = 12;
    } else {
      mesesLimite = 48;
      mesesLimiteTotal = 36;
    }

    let dataLimite =  moment(this.dataInicioBeneficio.clone().add(-1, 'months').endOf('month').format('YYYY-MM-DD'));
    if (mesesLimite > 0) {
      dataLimite = (dataLimite.clone()).add(-mesesLimite, 'months');
    } else {
      dataLimite = moment('1994-07-01');
    }

    this.ValoresContribuidos.getByCalculoId(this.idCalculo, this.dataInicioBeneficio, dataLimite, mesesLimiteTotal)
      .then(valorescontribuidos => {

        this.listaValoresContribuidos88 = valorescontribuidos;
        if (this.listaValoresContribuidos88.length == 0) {
          // Exibir MSG de erro e encerrar C??lculo.
          this.erro = `Nenhuma contribui????o encontrada em at?? 48 meses para este c??lculo <a href="#"
                                      target="_blank">Art. 37 da Decreto n?? 83.080, de 24/01/1979</a>`;
          this.nenhumaContrib = true;
          this.isUpdating = false;

        } else {

          const primeiraDataTabela = moment(this.listaValoresContribuidos88[this.listaValoresContribuidos88.length - 1].data);
          this.Moeda.getByDateRange(primeiraDataTabela, moment())
            .then((moeda: Moeda[]) => {
              this.moeda = moeda;
              this.IndiceInps.getByDate(this.dataInicioBeneficio.clone().startOf('month'))
                .then(indices => {
                  this.inpsList = indices;
                  this.SalarioMinimoMaximo.getByDate((this.dataInicioBeneficio.clone()).startOf('month'))
                    .then(salario => {
                      this.salarioMinimoMaximo = salario[0];
                      this.erro = this.verificaErros();
                      if (!this.erro) {
                        this.calculoAnterior88(this.conclusoes88);
                      }
                      this.isUpdating = false;
                    });
                });
            });

        }
      });
  }

  calculoAnterior88(conclusoes) {

    let index = 0;
    const mesPrimario = 0;
    let mesSecundario = 0;
    const tableData = [];
    const currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
    let totalPrimario = 0;
    let totalSecundario = 0;
    const anoPrimario = this.contribuicaoPrimaria88.anos;
    const anoSecundario = this.contribuicaoSecundaria88.anos;


    for (const contribuicao of this.listaValoresContribuidos88) {

      let valorPrimario = parseFloat(contribuicao.valor_primaria);
      let valorSecundario = parseFloat(contribuicao.valor_secundaria);
      const dataContribuicao = moment(contribuicao.data);
      const currency = this.loadCurrency(dataContribuicao);

      if (valorSecundario) {
        mesSecundario++;
      } else {
        valorSecundario = 0;
      }

      const contribuicaoPrimariaString = this.formatMoney(valorPrimario, currency.acronimo);
      const contribuicaoSecundariaString = (!this.isBlackHole) ? this.formatMoney(valorSecundario, currency.acronimo) : '';
      const inps = this.getInps(dataContribuicao.year());

      const valorAjustadoObj = this.limitarTetosEMinimos(valorPrimario, dataContribuicao);
      valorPrimario = valorAjustadoObj.valor;
      const limiteString = valorAjustadoObj.aviso;

      if (index > 11 && inps != null) {
        valorPrimario *= inps;
      }
      valorPrimario = this.convertCurrency(valorPrimario, dataContribuicao, this.dataInicioBeneficio);
      if (valorSecundario > 0) {
        valorSecundario = (this.limitarTetosEMinimos(valorSecundario, dataContribuicao)).valor;
      }

      if (index > 11 && inps != null) {
        valorSecundario *= inps;
      }

      valorSecundario = this.convertCurrency(valorSecundario, dataContribuicao, this.dataInicioBeneficio);
      totalPrimario += valorPrimario;
      totalSecundario += valorSecundario;
      let inpsString = '';

      if (index > 11 && inps != null) {
        inpsString = inps;
      } else {
        inpsString = '1.00';
      }

      const contribuicaoPrimariaRevisadaString = this.formatMoney(valorPrimario, currencyDataInicioBeneficio.acronimo);
      const contribuicaoSecundariaRevisadaString = (!this.isBlackHole) ?
        this.formatMoney(valorSecundario, currencyDataInicioBeneficio.acronimo) : '';

      const line = {
        indice_competencia: index + 1,
        competencia: dataContribuicao.format('MM/YYYY'),
        contribuicao_primaria: contribuicaoPrimariaString,
        inps: this.formatDecimal(inpsString, 2),
        contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString
      };

      tableData.push(line);
      index++;


    }
    const somaContribuicoes = totalPrimario + totalSecundario;
    const mediaContribuicoesPrimaria = totalPrimario / index;
    let mediaContribuicoesSecundaria = 0;
    if (totalSecundario > 0) {
      if ((this.tipoBeneficio == 4 || this.tipoBeneficio == 6) && anoSecundario != 0 && mesSecundario != 0) {
        mediaContribuicoesSecundaria = totalSecundario / (mesSecundario) * (anoSecundario / 30.0);
      } else if (anoSecundario != 0 && mesSecundario != 0) {
        let lackAux = 0;
        if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
          lackAux = 12;
        } else {
          lackAux = 60;
        }
        mediaContribuicoesSecundaria = totalSecundario * (mesSecundario / lackAux);
      }
    }

    const mediaTotal = mediaContribuicoesPrimaria + mediaContribuicoesSecundaria;
    const rmi = this.calculateRMI(mediaTotal, somaContribuicoes, conclusoes);
    // Exibir as conclus??es:
    conclusoes.total_contribuicoes_primarias = this.formatMoney(totalPrimario, currencyDataInicioBeneficio.acronimo);
    conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaContribuicoesPrimaria, currencyDataInicioBeneficio.acronimo);

    if (totalSecundario > 0) {
      conclusoes.total_contribuicoes_secundarias = this.formatMoney(totalSecundario, currencyDataInicioBeneficio.acronimo);
      conclusoes.media_contribuicoes_secundarias = this.formatMoney(mediaContribuicoesSecundaria, currencyDataInicioBeneficio.acronimo);
      conclusoes.divisor_calculo_media_secundaria = mesSecundario;
    }

    conclusoes.divisor_calculo_media = index;
    conclusoes.media_contribuicoes = this.formatMoney(mediaTotal, currencyDataInicioBeneficio.acronimo);
    conclusoes.renda_mensal_inicial = this.formatMoney(rmi, currencyDataInicioBeneficio.acronimo);

    this.valorExportacao = this.formatDecimal(rmi, 2).replace(',', '.');
    this.tableData88 = tableData;
    this.tableOptions88 = {
      ...this.tableOptions88,
      data: this.tableData88,
    }

  }

  calculateRMI(mediaTotal, somaContribuicoes, conclusoes) {

    const currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
    const dataSalario = (this.dataInicioBeneficio.clone()).startOf('month');
    const limitesSalariais = this.getLimitesSalariais(dataSalario);
    const grupoDos12 = this.calculo.grupo_dos_12;

    conclusoes.maior_valor_teto = this.formatMoney(limitesSalariais.maximo, currencyDataInicioBeneficio.acronimo);
    conclusoes.menor_valor_teto = this.formatMoney(limitesSalariais.minimo, currencyDataInicioBeneficio.acronimo);

    const anoContribuicao = this.calculo.contribuicao_primaria_98.split('-')[0];

    const indiceEspecie = this.getIndiceEspecie(this.tipoBeneficio, this.segurado.sexo, anoContribuicao); // Se????o 1.1.4

    let rmi = 0;
    if (mediaTotal >= limitesSalariais.minimo) {

      const primeiraParcela = indiceEspecie * limitesSalariais.minimo;

      if (limitesSalariais.maximo <= mediaTotal) {
        mediaTotal = limitesSalariais.maximo;
      }
      // Calculo do valor do excedente
      const excedente = mediaTotal - limitesSalariais.minimo;
      let segundaParcela = (grupoDos12 / 30) * excedente;
      if (segundaParcela > (0.8 * excedente)) {
        segundaParcela = 0.8 * excedente;
      }
      const somaParcelas = primeiraParcela + segundaParcela;
      if (somaParcelas > (0.9 * limitesSalariais.maximo)) {
        rmi = (0.9 * limitesSalariais.maximo);
      } else {
        rmi = somaParcelas;
      }

      // Inserir nas conclus??es
      conclusoes.primeira_parcela_rmi = this.formatMoney(primeiraParcela, currencyDataInicioBeneficio.acronimo);
      conclusoes.grupo_dos_12 = grupoDos12;
      conclusoes.valor_excedente = this.formatMoney(excedente, currencyDataInicioBeneficio.acronimo);
      conclusoes.segunda_parcela_rmi = this.formatMoney(segundaParcela, currencyDataInicioBeneficio.acronimo);
      conclusoes.oitenta_porcento_valor_excedente = this.formatMoney(
        (0.8 * excedente),
        currencyDataInicioBeneficio.acronimo);
      conclusoes.noventa_porcento_maior_valor_teto = this.formatMoney(
        (0.9 * limitesSalariais.maximo),
        currencyDataInicioBeneficio.acronimo);

    } else {

      rmi = indiceEspecie * mediaTotal;

    }

    const indiceSalarioMinimo = this.getIndiceSalarioMinimo(this.tipoBeneficio, anoContribuicao);
    const valorSalarioMinimo = indiceSalarioMinimo * (this.Moeda.getByDate(dataSalario)).salario_minimo;
    if (rmi > (0.95 * mediaTotal)) {
      rmi = 0.95 * mediaTotal;
    } else if (rmi < valorSalarioMinimo) {
      rmi = valorSalarioMinimo;
    }

    conclusoes.porcentagem_calculo_beneficio = Math.round(indiceEspecie * 100);
    conclusoes.beneficio_minimo_com_indice = this.formatMoney(valorSalarioMinimo, currencyDataInicioBeneficio.acronimo);
    conclusoes.noventaecinco_porcento_valor_da_media = this.formatMoney((0.95 * mediaTotal), currencyDataInicioBeneficio.acronimo);

    // Nesse momento Salva o valor da RMI e da somaContribui????es no BD do calculo.
    this.calculo.soma_contribuicao = somaContribuicoes;
    this.calculo.valor_beneficio = rmi;
    this.CalculoRgpsService.update(this.calculo);
    return rmi;
  }
}
