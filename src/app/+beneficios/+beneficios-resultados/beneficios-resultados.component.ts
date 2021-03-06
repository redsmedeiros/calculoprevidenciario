
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { Segurado as SeguradoModel, Segurado } from '../+beneficios-segurados/Segurado.model';
import { SeguradoService } from '../+beneficios-segurados/Segurado.service';
import { CalculoAtrasado as CalculoModel } from '../+beneficios-calculos/CalculoAtrasado.model';
import { CalculoAtrasadoService as CalculoService } from '../+beneficios-calculos/CalculoAtrasado.service';
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { IntervaloReajusteService } from '../../services/IntervaloReajuste.service';
import { IntervaloReajuste } from '../../services/IntervaloReajuste.model';
import { IndicesService } from '../../services/Indices.service';
import { Indices } from '../../services/Indices.model';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { DefinicaoMoeda } from 'app/shared/functions/definicao-moeda';
import { IndiceBuracoNegro } from 'app/shared/functions/indice-buraco-negro';
import { Recebidos } from './../+beneficios-calculos/beneficios-calculos-form-recebidos/Recebidos.model';
import { listenToElementOutputs } from '@angular/core/src/view/element';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  styleUrls: ['./beneficios-resultados.component.css'],
  templateUrl: './beneficios-resultados.component.html',
})
export class BeneficiosResultadosComponent implements OnInit {


  public definicaoMoeda = DefinicaoMoeda;
  public getIndiceBuracoNegro = IndiceBuracoNegro;
  public styleTheme = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];
  public stringTabelaCorrecaoMonetaria = '';
  public segurado: any = {};
  private seguradoId = '';
  public calculo: any = {};
  private calculoId = '';
  private calculoType = 'A';
  public isTetos = false;
  public moeda;
  public indices;
  public indiceRecebido = [];
  public indiceDevido = [];
  public isUpdating = false;
  public soma = 0;
  private debugMode = false;
  public resultadosList = [];
  public resultadosDatatableOptions = {
    paging: false,
    ordering: false,
    info: false,
    searching: false,
    data: this.resultadosList,
    columns: [
      { data: 'competencia', width: '9rem' },
      { data: 'indice_devidos', width: '13rem' },
      { data: 'beneficio_devido', width: '15rem' },
      { data: 'beneficio_devido_quota_dependente', width: '10rem' },
      { data: 'indice_recebidos', width: '15rem' },
      { data: 'beneficio_recebido' },
      { data: 'diferenca_mensal' },
      { data: 'correcao_monetaria' },
      { data: 'diferenca_corrigida' },
      { data: 'juros' },
      { data: 'valor_juros' },
      { data: 'diferenca_juros' },
      { data: 'honorarios' },
      { data: 'diferenca_corrigida_juros' },
    ],
    columnDefs: [
      { className: 'nowrapText notwrap text-center', targets: '_all' },
    ]
  }
  private aplicaProporcionalDevidos = false;
  private aplicaProporcionalRecebidos = false;
  // Datas Importantes
  private dataSimplificada = moment('1991-12-01');
  private dataInicioBuracoNegro = moment('1988-10-05');
  private dataFimBuracoNegro = moment('1991-04-05');
  private dataEfeitoFinanceiro = moment('1992-06-01');
  private dataComecoLei8870 = moment('1991-04-05');
  private dataFimLei8870 = moment('1993-12-31');
  private dataAplicacao8870 = moment('1994-04-01');
  private dataLei8880 = moment('1994-01-01');
  private dataSelic70 = moment('2012-05-01');
  private dataJuros2003 = moment('2003-01-15');
  private dataJuros2009 = moment('2009-07-01');
  private dataEquivalenciaMinimo89 = moment('1989-04-01');
  private dataPrimeiroTetoJudicial = moment('1998-12-01');
  // private dataSegundoTetoJudicial = moment('2003-12-01');
  private dataSegundoTetoJudicial = moment('2004-01-01');
  private dataCorteCruzado = moment('1988-01-01');
  private dataCorteCruzadoNovo = moment('1989-01-01');
  private dataCorteCruzeiroReal = moment('1993-08-01');

  private proporcionalidadeUltimaLinha = false;

  private dataInicioRecebidos;
  private dataInicioDevidos;

  private dataInicioRecebidosDip;
  private dataInicioDevidosDip;

  private primeiraDataArrayMoeda;
  private beneficioDevidoAposRevisao;
  private beneficioRecebidoAposRevisao;

  private beneficioDevidoAposRevisaoTetos;
  private beneficioRecebidoAposRevisaoTetos;
  private beneficioDevidoTetosSemLimite;
  private beneficioDevidoTetosSemLimiteSalvo;

  // Variaveis para aplica????o do reajuste
  private aplicarReajusteUltimoDevido = false;
  private ultimoSalarioMinimoDevido = 0.0;
  private beneficioDevidoAnterior = 0.0;
  private aplicarReajusteUltimoRecebido = false;
  private ultimoSalarioMinimoRecebido = 0.0;
  private beneficioRecebidoAnterior = 0.0;

  private beneficioDevidoSalvo = undefined;
  private beneficioDevidoOs = 0;

  private beneficioRecebidoSalvo = undefined;
  private beneficioRecebidoOs = 0;
  // Variaveis para aplica????o do reajuste tetos
  private aplicarReajusteUltimoDevidoTeto = false;
  private ultimoSalarioMinimoDevidoTeto = 0.0;
  private beneficioDevidoAnteriorTeto = 0.0;
  private aplicarReajusteUltimoRecebidoTeto = false;
  private ultimoSalarioMinimoRecebidoTeto = 0.0;
  private beneficioRecebidoAnteriorTeto = 0.0;

  // Variaveis para condicionais de primeiro reajuste
  private primeiroReajusteRecebidos = -1;
  private primeiroReajusteDevidos = -1;

  // Data da primeira linha da tabela
  private dataInicioCalculo = null;
  // Data da ultima linha da tabela
  private dataFinal = null;
  private dataFinalAtual = null;
  //
  private dataCessacaoDevido = null;
  private dataCessacaoRecebido = null;

  // Taxas de Juros
  private jurosAntes2003 = 0.005;
  private jurosDepois2003 = 0.01;
  private jurosDepois2009 = 0.005;

  private jurosCorrente = 0.0;
  private jurosCorrenteList = [];

  // Variaveis para tabela de conclus??es
  public somaHonorarios = 0.0;
  public descontoAcordo = 0.0;
  public valorAcordo = 0.0;

  public ultimaRenda = 0.0;
  public somaDiferencaMensal = 0.0;
  public somaCorrecaoMonetaria = 0.0;
  public somaDiferencaCorrigida = 0.0;
  public somaDiferencaCorrigidaJuros = 0.0;
  public somaJuros = 0.0;
  public somaDevidaJudicialmente = 0.0;
  public somaVincendas = 0.0;
  public somaTotalSegurado = 0.0;

  // Variaveis para tabela de conclus??es tetos
  public somaVincendosTetos = 0.0;
  public ultimaRendaTetos = 0.0;
  public somaDevidaTetos = 0.0;
  public honorariosTetos = 0.0;
  public subtotalTetos = 0.0;
  public acordoJudicialTetos = 0.0;
  public devidosComDescontoTetos = 0.0;
  public somaTotalTetos = 0.0;

  private ultimaCompretencia = '';
  private dataCalculo = '';
  private considerarPrescricao = true;

  private ultimoBeneficioDevidoAntesProporcionalidade = 0.0;
  private ultimoBeneficioRecebidoAntesProporcionalidade = 0.0;
  private ultimaCorrecaoMonetaria = 0.0;
  private ultimaDiferencaMensal = 0.0;

  private dibAnteriorRecebidos = null;
  private dibAnteriorDevidos = null;

  // juros formato anual
  public jurosEmFormatoAnual = '';

  // Variaveis para tabela de conclus??es tetos
  public diferencaMensalTetos = 0.0;

  // aplicar o hon??rario sobre
  public taxaAdvogadoAplicacaoSobre = ''; // dev - devido / dif - diferen??a entre devido e recebido

  // honorarios tutela antecipada -  sucumbencia
  public isUpdatingTutela = false;
  public exibirSucumbencia = false;
  public indicesTutela = [];
  public dataInicialTutelaAntecipada;
  public dataFinalTutelaAntecipada;
  public percentualTaxaAdvogado;
  public somaHonorariosTutelaAntecipada = 0;
  public somaHonorariosTutelaAntecipadaString = '';
  public somaTotalHonorariosString = '';

  public somaDevidosCorrigido = 0;
  public somaRecebidosCorrigido = 0;
  public somaDiferencaCorrigidaAtual = 0;
  public somaDiferencaCorrigidaAnterior = 0;

  public somaNumeroCompetenciasAtual = 0;
  public somaNumeroCompetenciasAnterior = 0;

  public somaDevidosreajustadosAtefinalHonorario = 0;
  public somaDiferencaReajustadosAtefinalHonorario = 0;

  // Honorarios CPC 85
  public exibirHonorarioscpc85 = false;
  public somaHonorarioscpc85 = 0;
  public percentualHonorarioscpc85 = 0;
  public faixaSalminimoHonorarioscpc85 = '';
  public faixaSalminimoHonorarioscpc85List = [];
  public dataSalMinHonorarioscpc85 = '';
  public somaHonorarioscpc85String = '';
  public salarioMinimoHonorarioscpc85String = '';

  // Honorarios Fixo
  public exibirHonorariosValorFixo = false;
  public somaHonorariosValorFixo = 0;
  public somaHonorariosFixoString = '';
  public resultadosFixoAntecipadaList = [];
  public indicesFixo = [];
  private dataFinalPrescricao;

  // Honorarios Valor da Causa
  public exibirHonorariosValorDaCausa = false;
  public honorariosalorDaCausa = 0;
  public honorariosalorDaCausaString = '';
  public honorariosalorDaCausaHonorario = '';

  //
  private allPromissesCalc = [];
  // listas de periodos
  private listDevidos = [];
  private listRecebidos = [];
  private listAcrescimosDeducoes = [];

  private recebidosListInicio;
  private recebidosListInicioDIP;
  private recebidosListInicioAnterior;
  private recebidosListFim;

  private adicional25Devido;
  private adicional25Recebido;
  private dataInicialadicional25Devido;
  private dataInicialadicional25Recebido;
  private dataInicialadicional25DevidoString;

  private somaAcrescimosDeducoes = {
    valor: '0',
    valorJuros: '0',
    valorMaisJuros: '0',
    valorMaisJurosN: 0,
    valorSubTotal: '',
    valorSubTotalN: 0
  };

  // public resultadosTutelaAntecipadaList = [];
  // public resultadosTutelaAntecipadaDatatableOptions = {
  //   paging: false,
  //   ordering: false,
  //   info: false,
  //   searching: false,
  //   data: this.resultadosTutelaAntecipadaList,
  //   columns: [
  //     { data: 'competencia', width: '12rem' },
  //     { data: 'indice_tutela', width: '13rem' },
  //     { data: 'ganho_economico' },
  //     { data: 'correcao_monetaria' },
  //     { data: 'ganho_economico_corrigido' },
  //     { data: 'honorarios_sucumbencia' }
  //   ]
  // }

  private isMinimoInicialDevido = false;
  private isMinimoInicialRecebido = false;
  private isMinimoInicialRecebidoLastId;

  private isTetoInicialDevido = false;
  private isTetoInicialRecebido = false;

  private dataCriacao;
  private dataUltimaAtualizacao;
  private dataImpressao;

  // limmitado
  private islimit60SC = false;
  private limit60SCPercDescartado = {
    valor: 0,
    valorString: '0',
    percentual: 0,
    percentualString: '0'
  };
  private limit60SCValor = { valor: 0, valorString: '0' };
  private RRASemJuros = false;

  private isBuracoNegroLeg = false;

  private recebidosBuracoNegro = false;
  private devidoBuracoNegro = false;
  private devidoIndiceBuracoNegro;
  private recebidosIndiceBuracoNegro;
  private reajusteLabel = 'reajuste1';
  private reajusteLabelR = 'reajuste1';

  private parcelaRecuperacaoDataDevido;
  private parcelaRecuperacaoDataDevidoStatus = false;
  private dataParcelaRecuperacaoDevido = null;
  private parcelaRecuperacaoDataRecebido;
  private listRedutorDevido = [];
  private listRedutorrecebido = [];

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected Segurado: SeguradoService,
    protected CalculoAtrasado: CalculoService,
    private Moeda: MoedaService,
    private IntervaloReajuste: IntervaloReajusteService,
    private Indice: IndicesService,
    private IndiceRecebido: IndicesService,
    private IndiceDevido: IndicesService,
  ) { }

  ngOnInit() {

    this.startCalculo();

  }


  private startCalculo() {

    this.isUpdating = true;

    if (this.route.snapshot.params['debug'] === 'true' || this.route.snapshot.params['debug'] === '1') {
      this.debugMode = true;
    }

    this.seguradoId = this.route.snapshot.params['id'];
    this.Segurado.find(this.seguradoId)
      .then(segurado => {
        this.segurado = segurado;
        this.dataNascimento();
        if (localStorage.getItem('user_id') !== this.segurado.user_id) {

          // redirecionar para pagina de segurados
          swal({
            type: 'error',
            title: 'Erro',
            text: 'Voc?? n??o tem permiss??o para acessar esta p??gina!',
            allowOutsideClick: false
          }).then(() => {
            window.location.href = '/#/beneficios/beneficios-segurados/'
          });

        } else {

          this.calculoId = this.route.snapshot.params['id_calculo'];
          this.CalculoAtrasado.find(this.calculoId)
            .then(calculo => {

              this.calculo = calculo;
              this.calculo.data = moment().format();
              this.setListas();
              this.setInicioRecebidosEDevidos();
              //  this.setInicioRecebidosEDevidosIndices();
              // console.log(this.calculo);
              this.getIndicesIniciais(calculo);
              this.getIndicesReajusteListRecebidos();


              if (this.calculo.aplicar_ajuste_maximo_98_2003 == '1') {
                this.isTetos = true;
                this.calculoType = 'AJ'
              }

              const rstMoeda = this.Moeda.getByDateRange(this.primeiraDataArrayMoeda.clone().subtract(1, 'months'), moment())
                .then((moeda: Moeda[]) => {
                  this.moeda = moeda;
                  //  return true;
                });

              this.allPromissesCalc.push(rstMoeda);

              Promise.all(this.allPromissesCalc).then((values) => {

                this.jurosCorrente = this.calcularJurosCorrente();
                this.resultadosList = this.generateTabelaResultados();
                this.getNameSelectJurosAnualParaMensal();
                this.calcularHonorariosCPC85();
                this.calcularHonorariosFixo();
                this.calcularHonorariosValorDaCausa();

                this.calcularCustosProcesso();
                this.updateResultadosDatatable();
                this.isUpdating = false;
                // this.calcularTutelaAntecipada();
              });


            });
        }
      });

  }


  private getIndicesIniciais(calculo) {


    const refreshIfInvalidDate = (date) => {

      if (!this.checkvalidDate(date)) {
        throw new Error('dateInvalid');
      }

    };

    try {


      let date_inicio_devido = moment(this.calculo.data_pedido_beneficio_esperado);

      if (this.calculo.previa_data_pedido_beneficio_esperado &&
        moment(this.calculo.previa_data_pedido_beneficio_esperado).isValid()) {
        date_inicio_devido = moment(this.calculo.previa_data_pedido_beneficio_esperado);
      }

      refreshIfInvalidDate(date_inicio_devido);

      // se ouver dib anterior considerar como a primeira data para o indice de corre????o
      let date_inicio_recebido = (this.calculo.data_anterior_pedido_beneficio !== '0000-00-00'
        && moment(this.calculo.data_anterior_pedido_beneficio).isValid()) ?
        this.calculo.data_anterior_pedido_beneficio : this.calculo.data_pedido_beneficio;


      date_inicio_recebido = (moment(date_inicio_recebido).isValid()) ? date_inicio_recebido : date_inicio_devido;

      refreshIfInvalidDate(date_inicio_recebido);

      if (!(moment(this.calculo.data_calculo_pedido).isValid())) {
        this.dataFinal = (moment(this.calculo.data_calculo_pedido));
      }

      refreshIfInvalidDate(this.dataFinal);

      const indiceDevidoRST = this.IndiceDevido.getByDateRange(
        moment(date_inicio_devido).clone().startOf('month').format('YYYY-MM-DD'),
        this.dataFinal.format('YYYY-MM-DD'))
        .then((indicesDevido: Indices) => {

          for (const i_devido of this.IndiceDevido.list) {
            this.indiceDevido.push(i_devido);
          }
          return true;
        });

      const indiceRecebidoRST = this.IndiceRecebido.getByDateRange(
        moment(date_inicio_recebido).clone().startOf('month').format('YYYY-MM-DD'),
        this.dataFinal.format('YYYY-MM-DD'))
        .then((indicesRecebido: Indices) => {

          for (const i_recebido of this.IndiceRecebido.list) {
            this.indiceRecebido.push(i_recebido);
          }
          return true;
        });

      this.devidoBuracoNegro = this.getIndiceBuracoNegro.checkDIB(moment(this.calculo.data_pedido_beneficio_esperado));
      this.recebidosBuracoNegro = this.getIndiceBuracoNegro.checkDIB(moment(this.calculo.data_pedido_beneficio));

      if (this.devidoBuracoNegro) {
        this.devidoIndiceBuracoNegro = this.getIndiceBuracoNegro.get(moment(this.calculo.data_pedido_beneficio_esperado).startOf('month'));
      }

      if (this.recebidosBuracoNegro) {
        this.recebidosIndiceBuracoNegro = this.getIndiceBuracoNegro.get(moment(this.calculo.data_pedido_beneficio).startOf('month'));
      }

      this.allPromissesCalc.push(indiceDevidoRST);
      this.allPromissesCalc.push(indiceRecebidoRST);

    } catch (error) {

      if (error.message === 'dateInvalid' && !sessionStorage.dateInvalid) {

        setTimeout(() => {

          window.location.href = '/#/beneficios/beneficios-resultados/'
            + this.route.snapshot.params['id'] + '/' + this.route.snapshot.params['id_calculo']
        }, 1000);

        localStorage.setItem('dateInvalid', 'true');
      }

    }

  }



  /**
   * converter as listas de String JSON para JSON
   */
  private setListas() {

    if (this.calculo.list_devidos) {
      this.listDevidos = JSON.parse(this.calculo.list_devidos);
    }

    if (this.calculo.list_recebidos) {

      this.listRecebidos = JSON.parse(this.calculo.list_recebidos);
      this.ordenarListaRecebidos();

    }

    if (this.calculo.list_acrescimos_deducoes) {
      this.listAcrescimosDeducoes = JSON.parse(this.calculo.list_acrescimos_deducoes);
    }

    this.defineInicioFimRecebidosMultiplos();
  }


  private defineInicioFimRecebidosMultiplos() {

    if (this.listRecebidos.length > 0) {

      const list = this.listRecebidos;
      this.recebidosListInicio = moment(this.listRecebidos[0].dib, 'DD/MM/YYYY');
      this.recebidosListInicioDIP = moment(this.listRecebidos[0].dip, 'DD/MM/YYYY');
      this.recebidosListInicioAnterior = moment(this.listRecebidos[0].dibAnterior, 'DD/MM/YYYY');
      this.recebidosListFim = moment(this.listRecebidos[0].cessacao, 'DD/MM/YYYY');
      let di;
      let dip;
      let dibAnterior;
      let df;

      for (const row of list) {

        di = moment(row.dib, 'DD/MM/YYYY');
        dip = moment(row.dip, 'DD/MM/YYYY');
        dibAnterior = moment(row.dibAnterior, 'DD/MM/YYYY');
        df = moment(row.cessacao, 'DD/MM/YYYY');

        if (di.isBefore(this.recebidosListInicio)) {
          this.recebidosListInicio = di;
        }

        if (dip.isBefore(this.recebidosListInicioDIP)) {
          this.recebidosListInicioDIP = dip;
        }

        if (df.isAfter(this.recebidosListFim)) {
          this.recebidosListFim = df;
        }

        if (dibAnterior.isAfter(this.recebidosListInicioAnterior)) {
          this.recebidosListInicioAnterior = dibAnterior;
        }

      }

    }

  }



  // private setInicioRecebidosEDevidosIndices() {

  //   let date_inicio_devido = this.dataInicioDevidos;

  //   if (date_inicio_devido.isAfter(this.dibAnteriorDevidos)) {
  //     date_inicio_devido = this.dibAnteriorDevidos;
  //   }

  //   const date_fim_devido = this.dataFinal;


  //   let date_inicio_recebido = this.dataInicioRecebidos;

  //   if (date_inicio_recebido.isAfter(this.dibAnteriorRecebidos)) {
  //     date_inicio_recebido = this.dibAnteriorRecebidos;
  //   }

  //   if (this.listRecebidos.length > 0 && date_inicio_recebido.isAfter(this.recebidosListInicioAnterior)) {
  //     date_inicio_recebido = this.recebidosListInicioAnterior;
  //   }

  //   let date_fim_recebido = date_fim_devido;

  //   if (date_fim_recebido.isAfter(this.dataCessacaoRecebido)) {
  //     date_fim_recebido = moment(this.dataCessacaoRecebido);
  //   }

  //   if (this.listRecebidos.length > 0 && date_fim_recebido.isAfter(this.recebidosListInicioAnterior)) {
  //     date_fim_recebido = this.recebidosListInicioAnterior;
  //   }

  //   // console.log({
  //   //   date_inicio_devido: (date_inicio_devido),
  //   //   date_fim_devido: (date_fim_devido),
  //   //   date_inicio_recebido: (date_inicio_recebido),
  //   //   date_fim_recebido: (date_fim_recebido)
  //   // });

  //   return {
  //     date_inicio_devido: (date_inicio_devido),
  //     date_fim_devido: (date_fim_devido),
  //     date_inicio_recebido: (date_inicio_recebido),
  //     date_fim_recebido: (date_fim_recebido)
  //   };

  // }


  private getIndicesReajusteListRecebidos() {

    let promRecebidoRow;
    const indicesrecebidosMPromisses = [];

    const formatDateIsnotNull = (data) => {
      if (this.isExits(data) && moment(data, 'DD/MM/YYYY').isValid()) {
        return moment(data, 'DD/MM/YYYY');
      } else {
        return null;
      }
    }

    if (this.listRecebidos != null && this.listRecebidos.length > 0) {

      let count = 1;
      for (const recebidoRow of this.listRecebidos) {

        recebidoRow.dib = formatDateIsnotNull(recebidoRow.dib);
        recebidoRow.dip = formatDateIsnotNull(recebidoRow.dip);
        recebidoRow.cessacao = formatDateIsnotNull(recebidoRow.cessacao);
        recebidoRow.dibAnterior = formatDateIsnotNull(recebidoRow.dibAnterior);
        recebidoRow.dataAdicional25 = formatDateIsnotNull(recebidoRow.dataAdicional25);
        recebidoRow.dataParcRecConcedido = formatDateIsnotNull(recebidoRow.dataParcRecConcedido);
        recebidoRow.indiceInps = [];
        recebidoRow.indiceInpsValores = [];
        recebidoRow.listRedutorrecebido = [];
        recebidoRow.rmiString = this.formatRMIMoedaData(recebidoRow.rmi, recebidoRow.dib);

        if (this.checkParcelaRecuperacao('r', recebidoRow)) {

          recebidoRow.listRedutorrecebido = this.setAdicionalParcelaRecuperacao('r', recebidoRow);

        }

        let inicioRecebido = recebidoRow.dib;
        if (recebidoRow.dibAnterior && recebidoRow.dib.isAfter(recebidoRow.dibAnterior)) {
          inicioRecebido = recebidoRow.dibAnterior;
        }

        promRecebidoRow = this.IndiceRecebido.getByDateRangeDirectResult(
          inicioRecebido.clone().startOf('month').format('YYYY-MM-DD'),
          recebidoRow.cessacao.format('YYYY-MM-DD'))
          .then((indicesRecebido: Indices[]) => {

            for (const i_recebido of indicesRecebido) {
              recebidoRow.indiceInps.push(i_recebido);
            }

            recebidoRow.indiceInpsValores = recebidoRow.indiceInps.filter(item => item.indice !== null);

            // return true;
          });

        this.allPromissesCalc.push(promRecebidoRow);
        count++;
      }

    }

    return indicesrecebidosMPromisses;

  }


  private getByDateToType(date, type) {

    const listType = (type === 'D') ? this.indiceDevido : this.indiceRecebido;

    const firstMonth = listType[0].data_moeda;

    date = date.startOf('month');
    let difference = date.diff(firstMonth, 'months', true);
    difference = Math.abs(difference);
    difference = Math.floor(difference);
    return listType[difference];
  }


  dataNascimento() {

    const idadeSegurado = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    this.segurado.idade = moment().diff(idadeSegurado, 'years');

  }

  esmaecerLinhas(dataCorrente, line) {
    let dataComparacao;
    let data = null;
    if (this.dibAnteriorRecebidos) {
      data = this.dibAnteriorRecebidos;
    } else if (this.dibAnteriorDevidos) {
      data = this.dibAnteriorDevidos;
    } else {
      return;
    }

    if (data.isAfter(moment('1998-12-01'))) {
      dataComparacao = moment('2003-11-01');
    } else {
      dataComparacao = moment('1998-11-01');
    }

    for (let index in line) {
      if (dataCorrente <= dataComparacao) {
        line[index] = '<div style="opacity:0.7;">' + line[index] + '</div>';
      }
    }
  }



  private checkAdicionl25Recebido(recebidoRow) {

    this.adicional25Recebido = false;
    this.dataInicialadicional25Recebido = null;
    if (this.listRecebidos.length > 0
      && recebidoRow.value.dataAdicional25 !== undefined
      && recebidoRow.value.dataAdicional25 != ''
      && ['4', '7', '2', '16', '1', '3', '5', '13', '18', '19'].includes(recebidoRow.value.especie)) {

      this.adicional25Recebido = true;
      this.dataInicialadicional25Recebido = moment(recebidoRow.value.dataAdicional25, 'DD/MM/YYYY');

    }

  }


  private checkAdicionl25Devido() {

    this.adicional25Devido = false;
    if (this.listDevidos.length > 0
      && this.listDevidos[0].dataAdicional25 !== undefined
      && this.listDevidos[0].dataAdicional25 != ''
      && ['4', '7', '2', '16', '1', '3', '5', '13', '18', '19'].includes(this.listDevidos[0].especie)) {

      this.adicional25Devido = true;
      this.dataInicialadicional25Devido = moment(this.listDevidos[0].dataAdicional25, 'DD/MM/YYYY');
      this.dataInicialadicional25DevidoString = this.listDevidos[0].dataAdicional25;

    }
  }


  private setLimit60SC() {

    if (this.calculo.limit_60_sc) {

      const moedaDataAjuizamento = this.Moeda.getByDate(moment(this.calculo.data_acao_judicial));
      this.limit60SCValor.valor = Math.round((moedaDataAjuizamento.salario_minimo * 60) * 100) / 100;
      this.limit60SCValor.valorString = this.formatMoney(this.limit60SCValor.valor);

    }

  }



  private checkLimit60SC(dataCorrente, valorSomaDataAjuizamento) {

    if (dataCorrente.isSame(this.calculo.data_acao_judicial, 'month')
      && this.calculo.limit_60_sc
      && this.limit60SCValor.valor < valorSomaDataAjuizamento
      && !this.islimit60SC
    ) {
      this.islimit60SC = true;
    }

  }


  private setDatasDeControle() {

    this.dataImpressao = moment().format('DD/MM/YYYY - HH:mm');

    if (this.calculo.updated_at !== undefined && moment(this.calculo.updated_at).isValid()) {
      this.dataUltimaAtualizacao = moment(this.calculo.updated_at).format('DD/MM/YYYY - HH:mm');
    }

    if (this.calculo.created_at !== undefined && moment(this.calculo.created_at).isValid()) {
      this.dataCriacao = moment(this.calculo.created_at).format('DD/MM/YYYY - HH:mm');
    }

  }


  // op????o 2
  generateTabelaResultados() {

    this.jurosCorrente = 0.00000;
    let competencias = this.monthsBetween(this.dataInicioCalculo, this.dataFinal);
    // let competencias = this.monthsBetween(this.dataInicioDevidos, this.dataFinal);
    const tableData = [];
    const dataPedidoBeneficioEsperado = moment(this.calculo.data_pedido_beneficio_esperado);
    let dataPagamentoBeneficioDevido = dataPedidoBeneficioEsperado.clone();
    this.setDatasDeControle();

    if (this.calculo.dip_valores_devidos !== undefined && moment(this.calculo.dip_valores_devidos).isValid()) {
      dataPagamentoBeneficioDevido = moment(this.calculo.dip_valores_devidos);
    }

    let dataPedidoBeneficio = moment(this.calculo.data_pedido_beneficio);
    this.dataFinalPrescricao = (moment(this.calculo.data_acao_judicial).startOf('month')).subtract(5, 'years').subtract(1, 'month');
    // if (this.calculo.data_citacao_reu) {
    //   this.dataFinalPrescricao = (moment(this.calculo.data_citacao_reu).startOf('month')).subtract(5, 'years').subtract(1, 'month');
    // }

    // Escolha de quais fun??oes de beneficios devidos e recebidos serao utilizadas
    const func_beneficioDevido = this.getBeneficioDevido;
    const func_beneficioRecebido = this.getBeneficioRecebido;
    let abonoProporcionalDevidos = 1;
    let abonoProporcionalRecebidos = 1;

    this.checkAdicionl25Devido();
    this.setLimit60SC();

    // if (this.calculo.previa_data_pedido_beneficio_esperado != '0000-00-00') {
    //   let previaDataPedidoBeneficioEsperado = moment(this.calculo.previa_data_pedido_beneficio_esperado);
    //   if (previaDataPedidoBeneficioEsperado.isSame(dataPedidoBeneficioEsperado, 'year')) {
    //     abonoProporcionalDevidos = this.verificaAbonoProporcionalDevidos(previaDataPedidoBeneficioEsperado);
    //   } else {
    //     abonoProporcionalDevidos = 1;
    //   }
    // } else {
    abonoProporcionalDevidos = this.verificaAbonoProporcionalDevidos(dataPedidoBeneficioEsperado);
    // }

    if (this.devidoBuracoNegro && dataPedidoBeneficioEsperado.isBefore('1992-01-01', 'year')) {
      abonoProporcionalDevidos = 1;
    }

    // if (this.calculo.data_anterior_pedido_beneficio != '0000-00-00') {
    //   let previaDataPedidoBeneficio = moment(this.calculo.data_anterior_pedido_beneficio);
    //   if (previaDataPedidoBeneficio.isSame(dataPedidoBeneficio, 'year')) {
    //     abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(previaDataPedidoBeneficio);
    //   } else {
    //     abonoProporcionalRecebidos = 1;
    //   }
    // } else {
    abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(dataPedidoBeneficio);
    // }

    let chkNotGranted = this.calculo;


    // calcular juros progressivamente acumulando os valores;
    this.jurosCorrenteList = this.createJurosCorrenteList(competencias);
    // this.getJurosPorConpetencia((moment("2015-01-01")));

    // console.log(this.jurosCorrenteList);

    // define o final do devido para calcular a soma;
    const dataFinalParaHonorarioDevido = (this.isExits(this.calculo.taxa_advogado_final)) ?
      this.calculo.taxa_advogado_final : this.calculo.calculo.data_calculo_pedido;

    const isPensaoPorMorte = (this.calculo.tipo_aposentadoria === 22);
    const defineBeneficioDevidoQuotaDependente = (beneficioDevido) => {

      if (isPensaoPorMorte) {
        const numDependentes = (this.calculo.num_dependentes === 0) ? 1 : this.calculo.num_dependentes;
        return beneficioDevido / numDependentes;
      }

      return beneficioDevido;
    };

    if (this.devidoBuracoNegro) {
      competencias = this.monthsBetween(this.dataEfeitoFinanceiro, this.dataFinal);
      competencias.unshift(this.dataEfeitoFinanceiro);
    }


    for (const dataCorrenteString of competencias) {

      let line: any = {};
      const dataCorrente = moment(dataCorrenteString);
      if (this.dataCessacaoDevido && dataCorrente > this.dataCessacaoDevido) {
        break;
      }

      const moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
      const siglaDataCorrente = moedaDataCorrente.sigla;

      const stringCompetencia = (dataCorrente.month() + 1) + '/' + dataCorrente.year();
      this.ultimaCompretencia = stringCompetencia;
      this.dataCalculo = moment(dataCorrenteString).format();
      let indiceReajusteValoresDevidos = { reajuste: 0.0, reajusteOs: 0.0 };
      let beneficioDevido = 0.0;
      let indiceReajusteValoresRecebidos = { reajuste: 0.0, reajusteOs: 0.0 };
      let beneficioRecebido = 0.0;
      let diferencaMensal = 0.0;
      const correcaoMonetaria = this.getCorrecaoMonetaria(dataCorrente);
      let diferencaCorrigida = 0.0;
      // let juros = this.getJuros(dataCorrente);
      let juros = this.getJurosPorCompetencia(dataCorrente);
      let valorJuros = 0.0; // diferencaCorrigida * juros;
      let diferencaCorrigidaJuros = { string: '', value: 0 };
      // this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida);
      let honorarios = 0.0;
      let isPrescricao = false;
      let valorDevidohonorario = 0;

      // console.log(juros);
      let beneficioDevidoAntesRateio = beneficioDevido;
      let beneficio_devido_quota_dependente = 0;

      const beneficioDevidoString = { resultString: this.formatMoney(beneficioDevidoAntesRateio, siglaDataCorrente) };
      const beneficioRecebidoString = { resultString: this.formatMoney(beneficioRecebido, siglaDataCorrente) };

      const recebidoRow = this.getPeriodoRecebidoList(dataCorrente);
      let dataPagamentoBeneficioRecebido = dataPedidoBeneficio.clone();
      const cessaBeneficioRecebido = dataPedidoBeneficio.clone();
      let abono13UltimoRecebido = false;
      let datacessacaoBeneficioRecebido = this.dataCessacaoRecebido;
      let tipo_aposentadoria_recebida = this.calculo.tipo_aposentadoria_recebida;

      if (recebidoRow.status) {

        dataPedidoBeneficio = moment(recebidoRow.value.dib);
        abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(dataPedidoBeneficio.clone());
        dataPagamentoBeneficioRecebido = moment(recebidoRow.value.dip);
        datacessacaoBeneficioRecebido = recebidoRow.value.cessacao.clone();
        abono13UltimoRecebido = recebidoRow.value.abono13Ultimo;
        tipo_aposentadoria_recebida = recebidoRow.value.especie;
        this.checkAdicionl25Recebido(recebidoRow);
        this.calculo.tipo_aposentadoria_recebida = recebidoRow.value.especie;
        this.calculo.nao_aplicar_sm_beneficio_concedido = recebidoRow.value.reajusteMinimo;

        this.recebidosBuracoNegro = this.getIndiceBuracoNegro.checkDIB(dataPedidoBeneficio.clone());

        if (this.recebidosBuracoNegro) {

          this.recebidosIndiceBuracoNegro = this.getIndiceBuracoNegro.get(dataPedidoBeneficio.clone().startOf('month'));

          if (this.beneficioRecebidoAposRevisao == 0) {

            this.beneficioRecebidoAposRevisao = parseFloat(recebidoRow.value.rmiBuracoNegro);
            this.beneficioRecebidoAposRevisaoTetos = parseFloat(recebidoRow.value.rmiBuracoNegro);

          }

        } else {

          this.recebidosIndiceBuracoNegro = {};
          this.beneficioRecebidoAposRevisao = 0;
          this.beneficioRecebidoAposRevisaoTetos = 0;

        }

      }

      // Quando a dataCorrente for menor que a ???dataInicioRecebidos???, definido na sec??o 1.1
      if (dataCorrente.isBefore(this.dataInicioRecebidos, 'month')) {

        indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
        beneficioDevido = func_beneficioDevido.call(this, dataCorrente, indiceReajusteValoresDevidos, beneficioDevidoString, line);
        beneficioDevidoAntesRateio = beneficioDevido;
        beneficio_devido_quota_dependente = defineBeneficioDevidoQuotaDependente(beneficioDevido);
        beneficioDevido = beneficio_devido_quota_dependente;
        // diferencaMensal = beneficioDevido;

      } else if (dataCorrente.isBefore(this.dataInicioDevidos, 'month')) {

        // Quando a dataCorrente for menor que a ???dataInicioDevidos, definido na se????o 1.2
        indiceReajusteValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente, recebidoRow);
        beneficioRecebido = func_beneficioRecebido.call(this,
          dataCorrente,
          indiceReajusteValoresRecebidos,
          beneficioRecebidoString,
          line,
          recebidoRow);
        // diferencaMensal = beneficioDevido - beneficioRecebido;

      } else if (dataCorrente.isSameOrAfter(this.dataInicioRecebidos, 'month')
        && dataCorrente.isSameOrAfter(this.dataInicioDevidos, 'month')) {

        // Quando a dataCorrente for maior que ambas, definido na se????o 1.3.
        indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
        // teste 02/06
        // console.log(dataCorrente);
        beneficioDevido = func_beneficioDevido.call(this, dataCorrente, indiceReajusteValoresDevidos, beneficioDevidoString, line);
        indiceReajusteValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente, recebidoRow);

        const chkboxBenefitNotGranted = this.calculo.beneficio_nao_concedido;
        if (chkboxBenefitNotGranted) {
          beneficioRecebido = 0;
          // func_beneficioRecebido.call(this, dataCorrente, indiceReajusteValoresRecebidos, beneficioRecebidoString, line);

          beneficioDevidoAntesRateio = beneficioDevido;
          beneficio_devido_quota_dependente = defineBeneficioDevidoQuotaDependente(beneficioDevido);
          beneficioDevido = beneficio_devido_quota_dependente;

          // diferencaMensal = beneficioDevido - beneficioRecebido;

        } else {

          beneficioRecebido = func_beneficioRecebido.call(this, dataCorrente,
            indiceReajusteValoresRecebidos,
            beneficioRecebidoString, line,
            recebidoRow);

          if (isPensaoPorMorte) {

            beneficioDevidoAntesRateio = beneficioDevido;
            beneficio_devido_quota_dependente = defineBeneficioDevidoQuotaDependente(beneficioDevido);
            beneficioDevido = beneficio_devido_quota_dependente;

          }


          // diferencaMensal = beneficioDevido - beneficioRecebido;
        }

      }

      if (dataPagamentoBeneficioDevido.isValid() && dataCorrente.isBefore(dataPagamentoBeneficioDevido, 'month')) {
        beneficioDevido = 0;
        beneficioDevidoString.resultString = this.formatMoney(0.0, siglaDataCorrente);
      }

      if ((!recebidoRow.status && this.listRecebidos.length > 0) ||
        (dataPagamentoBeneficioRecebido.isValid() && dataCorrente.isBefore(dataPagamentoBeneficioRecebido, 'month'))) {
        beneficioRecebido = 0;
        beneficioRecebidoString.resultString = this.formatMoney(0.0, siglaDataCorrente);
      }

      diferencaMensal = this.roundMoeda(beneficioDevido - beneficioRecebido);
      diferencaCorrigida = (correcaoMonetaria === 0) ? diferencaMensal : this.roundMoeda(diferencaMensal * correcaoMonetaria);

      if (dataCorrente.isBefore(this.dataInicioDevidos, 'month')) {
        diferencaMensal = 0;
        diferencaCorrigida = 0;
      }

      if (juros > 0) {
        valorJuros = diferencaCorrigida * juros;
      }

      // N??o aplicar juros em valor negativo
      if (diferencaCorrigida < 0 && this.calculo.nao_aplicar_juros_sobre_negativo) {
        juros = 0.000;
        valorJuros = 0.00;
      }

      const valorNumericoDiferencaCorrigidaJurosObj: any = {};

      diferencaCorrigidaJuros = this.getDiferencaCorrigidaJuros(dataCorrente,
        valorJuros,
        diferencaCorrigida,
        valorNumericoDiferencaCorrigidaJurosObj);


      valorDevidohonorario = this.roundMoeda((beneficioDevido * correcaoMonetaria) + (beneficioDevido * correcaoMonetaria * juros));
      honorarios = this.calculoHonorarios(dataCorrente, valorJuros, diferencaCorrigida, valorDevidohonorario);

      if (diferencaCorrigidaJuros.string.indexOf('Prescrita') != -1 && this.considerarPrescricao) {
        // Se houver o marcador, a data ?? prescrita
        isPrescricao = true;
      }

      line.competencia = stringCompetencia;
      line.competenciaD = stringCompetencia;
      line.indice_devidos = this.formatIndicesReajustes(indiceReajusteValoresDevidos, dataCorrente, 'Devido');
      line.beneficio_devido = beneficioDevidoString.resultString;
      line.beneficio_devido_quota_dependente = this.formatMoney(beneficio_devido_quota_dependente, siglaDataCorrente, true);
      line.indice_recebidos = this.formatIndicesReajustes(indiceReajusteValoresRecebidos, dataCorrente, 'Recebido');
      line.beneficio_recebido = beneficioRecebidoString.resultString;
      line.diferenca_mensal = this.formatMoney(diferencaMensal, siglaDataCorrente, true);

      line.correcao_monetaria = this.formatDecimal(correcaoMonetaria, 8);
      line.diferenca_corrigida = this.formatMoney(diferencaCorrigida, 'R$', true);
      line.juros = this.formatPercent(juros, 4);
      line.valor_juros = this.formatMoney(valorJuros, 'R$', true);
      line.diferenca_juros = diferencaCorrigidaJuros.string;
      line.diferenca_corrigida_juros = diferencaCorrigidaJuros.string;
      line.diferenca_corrigida_jurosN = (diferencaCorrigidaJuros.string != 'Prescrita') ? diferencaCorrigidaJuros.value : 0;

      line.honorarios = (diferencaCorrigidaJuros.string != 'Prescrita') ? this.formatMoney(honorarios, 'R$', true) : '';
      line.honorariosN = (diferencaCorrigidaJuros.string != 'Prescrita') ? honorarios : 0;
      line.beneficio_devidoH = valorDevidohonorario;

      line.correcao_monetariaN = correcaoMonetaria;
      line.jurosN = juros;
      line.diferenca_mensalN = diferencaMensal;
      line.diferenca_corrigidaN = diferencaCorrigida;


      if (stringCompetencia === '6/1992' && this.devidoBuracoNegro) {
        line.indice_devidos += '<br> OS 121/92';
        line.indice_recebidos += '<br> OS 121/92';
      }

      if (isPrescricao) {
        line.diferenca_mensal = 'Prescrita';
        line.correcao_monetaria = '-';
        line.diferenca_corrigida = '-';
        line.juros = '-';
        line.valor_juros = '-';
        line.diferenca_juros = '-';
        line.honorarios = '-';
      }

      if (this.isTetos) {
        this.esmaecerLinhas(dataCorrente, line);
      }



      const checkPrescricao = (!isPrescricao
        || ((['1/2004', '12/1998', '3/1994', '4/1994', '5/1994', '6/1994'].includes(stringCompetencia))
          || (indiceReajusteValoresDevidos.reajuste > 1
            || indiceReajusteValoresRecebidos.reajuste > 1))
        && ((['1/2004', '12/1998', '3/1994', '4/1994', '5/1994', '6/1994'].includes(stringCompetencia))
          || (indiceReajusteValoresDevidos.reajuste > 1
            || indiceReajusteValoresRecebidos.reajuste > 1)));

      // exibir recebido antes do devido
      if (dataCorrente.isSameOrAfter(dataPagamentoBeneficioDevido, 'month') && checkPrescricao) {
        // if (checkPrescricao) {
        tableData.push(line);
      }

      this.somaDevidosCorrigido += this.roundMoeda(beneficioDevido);
      this.somaRecebidosCorrigido += this.roundMoeda(beneficioRecebido);

      if (!isPrescricao) {
        // Se a dataCorrente nao estiver prescrita, soma os valores para as variaveis da Tabela de Conclus??es
        this.somaDiferencaMensal += this.roundMoeda(diferencaMensal);
        this.somaCorrecaoMonetaria += this.roundMoeda(correcaoMonetaria);
        this.somaDiferencaCorrigida += this.roundMoeda(diferencaCorrigida);
        this.somaDiferencaCorrigidaJuros += this.roundMoeda(valorNumericoDiferencaCorrigidaJurosObj.numeric);
        this.somaHonorarios += this.roundMoeda(honorarios);
        this.somaJuros += this.roundMoeda(valorJuros);

        // para calcular o homorario sobre a soma do devido

        if (dataCorrente.isSameOrBefore(dataFinalParaHonorarioDevido)) {

          this.somaDevidosreajustadosAtefinalHonorario += (beneficioDevido * correcaoMonetaria) +
            (beneficioDevido * correcaoMonetaria * juros);

          this.somaDiferencaReajustadosAtefinalHonorario += valorNumericoDiferencaCorrigidaJurosObj.numeric;

        }

        // soma tutela antecipada
        if ((moment(this.calculo.data_cessacao).isValid() && moment(this.calculo.taxa_advogado_final).isValid()) &&
          (dataCorrente.isSameOrAfter(this.calculo.data_cessacao, 'month')
            && dataCorrente.isSameOrBefore(this.calculo.taxa_advogado_final))) {
          this.somaHonorariosTutelaAntecipada += Math.round(beneficioDevido * 100) / 100;
        }

        // 
        this.calcularSomaCompetenciasMes(dataCorrente, diferencaCorrigida, (valorJuros + diferencaCorrigida));
        this.checkLimit60SC(dataCorrente, this.somaDiferencaCorrigida);

      }

      if (!this.proporcionalidadeUltimaLinha) {
        this.ultimaDiferencaMensal = diferencaMensal;
      }
      this.ultimaCorrecaoMonetaria = correcaoMonetaria;



      // Calcular Abono
      const especiesSemAbono = ['12', '17', '24', '2021'];
      const verificacaoEspecieAbono = !(especiesSemAbono.includes(tipo_aposentadoria_recebida)
        || especiesSemAbono.includes(this.calculo.tipo_aposentadoria));

      if ((dataCorrente.month() === 11)
        || (this.calculo.calcular_abono_13_ultimo_mes && dataCorrente.isSame(this.calculo.data_prevista_cessacao, 'month')
          && (verificacaoEspecieAbono)
          || (abono13UltimoRecebido && dataCorrente.isSame(datacessacaoBeneficioRecebido, 'month')
            && (verificacaoEspecieAbono))
        )
      ) {

        let beneficioRecebidoAbono = this.ultimoBeneficioRecebidoAntesProporcionalidade;
        let beneficioDevidoAbono = this.ultimoBeneficioDevidoAntesProporcionalidade;

        beneficioDevidoAbono = this.aplicarAdicional25(dataCorrente, beneficioDevidoAbono);
        beneficioDevidoAbono = this.roundMoeda(beneficioDevidoAbono * abonoProporcionalDevidos);
        beneficioDevidoAbono = this.aplicarRedutorParcelasRecuperacao(beneficioDevidoAbono, dataCorrente, 'd');

        if (beneficioRecebido <= 0 || (datacessacaoBeneficioRecebido != null && dataCorrente > datacessacaoBeneficioRecebido)) {
          beneficioRecebidoAbono = 0.0;
        } else {

          // if (abono13UltimoRecebido && abonoProporcionalRecebidos == 0
          //   && dataPedidoBeneficio.isBefore(datacessacaoBeneficioRecebido, 'year')) {
          //   abonoProporcionalRecebidos = 1;
          // }


          abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(dataPedidoBeneficio.clone());
          // abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(datacessacaoBeneficioRecebido.clone());

          if (dataPedidoBeneficio.isBefore(dataCorrente, 'year')) {
            abonoProporcionalRecebidos = 1;
          }

          beneficioRecebidoAbono = this.aplicarAdicional25Recebido(dataCorrente, beneficioRecebidoAbono);
          beneficioRecebidoAbono = this.roundMoeda(beneficioRecebidoAbono * abonoProporcionalRecebidos);
          beneficioRecebidoAbono = this.aplicarRedutorParcelasRecuperacao(beneficioRecebidoAbono, dataCorrente, 'r', recebidoRow.value);

        }

        //  // Adicionar linha de abono
        if (this.calculo.calcular_abono_13_ultimo_mes) {

          if (beneficioDevidoAbono > 0
            && dataCorrente.isSame(this.calculo.data_prevista_cessacao, 'month')) {

            beneficioDevidoAbono = this.ultimoBeneficioDevidoAntesProporcionalidade;
            beneficioDevidoAbono = this.aplicarAdicional25(dataCorrente, beneficioDevidoAbono);
            // abonoProporcionalDevidos = this.verificaAbonoProporcionalDevidos(moment(this.calculo.data_prevista_cessacao));
            abonoProporcionalDevidos = this.verificaAbonoProporcionalDevidoInicioFim(
              moment(this.calculo.data_pedido_beneficio_esperado),
              moment(this.calculo.data_prevista_cessacao));
            beneficioDevidoAbono = this.roundMoeda(beneficioDevidoAbono - beneficioDevidoAbono * abonoProporcionalDevidos);
            beneficioDevidoAbono = this.aplicarRedutorParcelasRecuperacao(beneficioDevidoAbono, dataCorrente, 'd');

          }

        }

        if (abono13UltimoRecebido) {

          if (
            this.isExits(datacessacaoBeneficioRecebido) &&
            dataCorrente.isSame(datacessacaoBeneficioRecebido, 'month')
          ) { // datacessacaoBeneficioRecebido
            // abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(datacessacaoBeneficioRecebido.clone());

            beneficioRecebidoAbono = this.ultimoBeneficioRecebidoAntesProporcionalidade;
            beneficioRecebidoAbono = this.aplicarAdicional25Recebido(dataCorrente, beneficioRecebidoAbono);
            //  abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(datacessacaoBeneficioRecebido.clone());

            abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidosInicioFim(
              dataPedidoBeneficio.clone(),
              datacessacaoBeneficioRecebido.clone()
            );

            beneficioRecebidoAbono = this.roundMoeda(beneficioRecebidoAbono - beneficioRecebidoAbono * abonoProporcionalRecebidos);
            beneficioRecebidoAbono = this.aplicarRedutorParcelasRecuperacao(beneficioRecebidoAbono, dataCorrente, 'r', recebidoRow.value);

          }
        }

        if (especiesSemAbono.includes(this.calculo.tipo_aposentadoria) || [12, 17, 24, 2021].includes(this.calculo.tipo_aposentadoria)) {
          beneficioDevidoAbono = 0.0;
        }

        if (especiesSemAbono.includes(tipo_aposentadoria_recebida)) {
          beneficioRecebidoAbono = 0.0;
        }


        if (dataPagamentoBeneficioDevido.isValid() && dataCorrente.isBefore(dataPagamentoBeneficioDevido, 'month')) {
          beneficioDevidoAbono = 0;
        }

        if (dataPagamentoBeneficioRecebido.isValid() && dataCorrente.isBefore(dataPagamentoBeneficioRecebido, 'month')) {
          beneficioRecebidoAbono = 0;
        }


        if ((abono13UltimoRecebido && dataCorrente.isSame(datacessacaoBeneficioRecebido, 'month')) &&
          (!this.calculo.calcular_abono_13_ultimo_mes)) {
          beneficioDevidoAbono = 0;
        }

        const beneficioDevidoAbonoAntesRateio = beneficioDevidoAbono;
        let beneficio_devido_quota_dependente_abono = 0;
        // Rateio de pens??o por morte
        if (isPensaoPorMorte) {
          beneficio_devido_quota_dependente_abono = defineBeneficioDevidoQuotaDependente(beneficioDevidoAbono);
          beneficioDevidoAbono = beneficio_devido_quota_dependente_abono;
        }

        if (dataCorrente.isBefore(this.dataInicioRecebidos, 'month')) {
          diferencaMensal = this.roundMoeda(beneficioDevidoAbono);
        } else if (dataCorrente.isBefore(this.dataInicioDevidos, 'month')) {
          diferencaMensal = this.roundMoeda(beneficioDevidoAbono - beneficioRecebidoAbono);
        } else if (dataCorrente.isSameOrAfter(this.dataInicioRecebidos, 'month')
          && dataCorrente.isSameOrAfter(this.dataInicioDevidos, 'month')) {
          diferencaMensal = this.roundMoeda(beneficioDevidoAbono - beneficioRecebidoAbono);
        }

        diferencaCorrigida = (correcaoMonetaria === 0) ? diferencaMensal : this.roundMoeda(diferencaMensal * correcaoMonetaria);
        // diferencaCorrigida = diferencaMensal * correcaoMonetaria;

        if (dataCorrente.isBefore(this.dataInicioDevidos, 'month')) {
          diferencaMensal = 0;
          diferencaCorrigida = 0;
        }

        valorJuros = this.roundMoeda(diferencaCorrigida * juros);

        diferencaCorrigidaJuros = this.getDiferencaCorrigidaJuros(dataCorrente,
          valorJuros,
          diferencaCorrigida,
          valorNumericoDiferencaCorrigidaJurosObj);

        // valorDevidohonorario = this.roundMoeda((beneficioDevidoAbono * correcaoMonetaria) 
        // + ((beneficioDevido * correcaoMonetaria) * juros));

        valorDevidohonorario = this.roundMoeda((beneficioDevidoAbono * correcaoMonetaria) + valorJuros);

        honorarios = this.calculoHonorarios(dataCorrente, valorJuros, diferencaCorrigida, valorDevidohonorario);

        // N??o aplicar juros em valor negativo
        if (diferencaCorrigida < 0 && this.calculo.nao_aplicar_juros_sobre_negativo) {
          juros = 0.000;
          valorJuros = 0.00;
        }

        if (!isPrescricao) {
          //   line = {
          //     ...line,
          //     competencia: '<strong>' + dataCorrente.year() + '-abono <strong>',
          //     beneficio_devido: this.formatMoney(beneficioDevidoAbonoAntesRateio, siglaDataCorrente, true),
          //     beneficio_devido_quota_dependente: this.formatMoney(beneficio_devido_quota_dependente_abono, siglaDataCorrente, true),
          //     beneficio_recebido: this.formatMoney(beneficioRecebidoAbono, siglaDataCorrente, true),
          //     diferenca_corrigida: '0',
          //     diferenca_mensal: 'Prescrita',
          //     juros: '0',
          //     valor_juros: '0',
          //     diferenca_juros: '0',
          //     honorarios: '0'
          //   }
          // } else {
          line = {
            ...line,
            competencia: '<strong>' + dataCorrente.year() + '-abono <strong>',
            competenciaD: stringCompetencia,
            beneficio_devido: this.formatMoney(beneficioDevidoAbonoAntesRateio, siglaDataCorrente, true),
            beneficio_devidoH: valorDevidohonorario,
            beneficio_devido_quota_dependente: this.formatMoney(beneficio_devido_quota_dependente_abono, siglaDataCorrente, true),
            beneficio_recebido: this.formatMoney(beneficioRecebidoAbono, siglaDataCorrente, true),
            diferenca_corrigida: this.formatMoney(diferencaCorrigida, 'R$', true),
            diferenca_mensal: this.formatMoney(diferencaMensal, siglaDataCorrente, true),
            juros: this.formatPercent(juros, 4),
            valor_juros: this.formatMoney(valorJuros, 'R$', true),
            diferenca_juros: diferencaCorrigidaJuros.string,
            diferenca_corrigida_juros: diferencaCorrigidaJuros.string,
            diferenca_corrigida_jurosN: (diferencaCorrigidaJuros.string != 'prescrita') ? diferencaCorrigidaJuros.value : 0,
            honorarios: (diferencaCorrigidaJuros.string != 'prescrita') ? this.formatMoney(honorarios, 'R$', true) : '',
            honorariosN: (diferencaCorrigidaJuros.string != 'prescrita') ? honorarios : 0,
            correcao_monetariaN: correcaoMonetaria,
            jurosN: juros,
            diferenca_mensalN: diferencaMensal,
            diferenca_corrigidaN: diferencaCorrigida,

          }
        }

        if (this.isTetos) {
          this.esmaecerLinhas(dataCorrente, line);
        }

        if (!isPrescricao && dataCorrente.isAfter(dataPagamentoBeneficioDevido, 'month')) {
          // if (!isPrescricao) {
          tableData.push(line);
        }

        if (this.aplicaProporcionalDevidos) {
          this.aplicaProporcionalDevidos = false;
          abonoProporcionalDevidos = 1;
        }

        if (this.aplicaProporcionalRecebidos) {
          this.aplicaProporcionalRecebidos = false;
          abonoProporcionalRecebidos = 1;
        }


        this.somaDevidosCorrigido += this.roundMoeda(beneficioDevidoAbono);
        this.somaRecebidosCorrigido += this.roundMoeda(beneficioRecebidoAbono);


        if (!isPrescricao) {
          // Se a dataCorrente nao estiver prescrita, soma os valores para as variaveis da Tabela de Conclus??es
          this.somaDiferencaMensal += this.roundMoeda(diferencaMensal);
          this.somaCorrecaoMonetaria += this.roundMoeda(correcaoMonetaria);
          this.somaDiferencaCorrigida += this.roundMoeda(diferencaCorrigida);
          this.somaHonorarios += this.roundMoeda(honorarios);
          this.somaJuros += this.roundMoeda(valorJuros);
          this.somaDiferencaCorrigidaJuros += this.roundMoeda(valorNumericoDiferencaCorrigidaJurosObj.numeric);

          // para calcular o homorario sobre a soma do devido 
          if (dataCorrente.isSameOrBefore(dataFinalParaHonorarioDevido)) {

            this.somaDevidosreajustadosAtefinalHonorario += this.roundMoeda(beneficioDevidoAbono * correcaoMonetaria) +
              (beneficioDevidoAbono * correcaoMonetaria * juros);

            this.somaDiferencaReajustadosAtefinalHonorario += this.roundMoeda(valorNumericoDiferencaCorrigidaJurosObj.numeric);

          }

          // soma tutela antecipada
          // if ((moment(this.calculo.data_cessacao).isValid() && moment(this.calculo.taxa_advogado_final).isValid()) &&
          //   (dataCorrente.isSameOrAfter(this.calculo.data_cessacao, 'month')
          //     && dataCorrente.isSameOrBefore(this.calculo.taxa_advogado_final))) {
          //   this.somaHonorariosTutelaAntecipada += Math.round(beneficioDevido * 100) / 100;
          // }

          this.calcularSomaCompetenciasMes(dataCorrente, diferencaCorrigida, (valorJuros + diferencaCorrigida));
          this.checkLimit60SC(dataCorrente, this.somaDiferencaCorrigida);
        }

      }

    }

    this.ultimaRenda = this.ultimoBeneficioDevidoAntesProporcionalidade - this.ultimoBeneficioRecebidoAntesProporcionalidade;
    this.somaVincendas = (this.isTetos) ? this.calcularVincendosTetos() : this.calcularVincendas();
    this.somaDevidaJudicialmente = this.somaDiferencaCorrigida + this.somaJuros;
    this.somaTotalSegurado = this.somaDevidaJudicialmente + this.somaVincendas;

    if (this.calculo.acordo_pedido != 0) {
      this.calcularAcordoJudicial();
    }


    if (this.islimit60SC) {

      this.aplicarLimit60SC(tableData);

    }

    return tableData;

  }


  private aplicarLimit60SC(tableData) {

    if (this.islimit60SC) {

      let diferencaMensal = 0;
      let diferencaCorrigida = 0;
      let valorJuros = 0;
      let diferencaCorrigidaJuros = 0;
      let honorarios = 0;


      this.somaNumeroCompetenciasAtual = 0;
      this.somaDiferencaCorrigidaAtual = 0;
      this.somaNumeroCompetenciasAnterior = 0;
      this.somaDiferencaCorrigidaAnterior = 0;

      const somaDiferencaMensalValorAnterior = this.somaDiferencaMensal;

      for (const rowRST of tableData) {

        let competencia = moment(rowRST.competencia, 'MM/YYYY');

        if (!competencia.isValid()) {
          competencia = moment(rowRST.competenciaD, 'MM/YYYY');
        }

        if (moment(this.calculo.data_acao_judicial).isAfter(competencia, 'month')) {

          rowRST.diferenca_mensal = 'Limitado';
          rowRST.correcao_monetaria = this.formatDecimal(0, 8);
          rowRST.diferenca_corrigida = this.formatMoney(0, 'R$', true);
          // rowRST.juros = this.formatPercent(juros, 4);
          rowRST.valor_juros = this.formatMoney(0, 'R$', true);
          rowRST.diferenca_juros = this.formatMoney(0, 'R$', true);
          rowRST.honorarios = this.formatMoney(0, 'R$', true);
          rowRST.diferenca_corrigida_jurosN = 0;
          rowRST.diferenca_corrigida_juros = this.formatMoney(0, 'R$', true);

          this.calcularSomaCompetenciasMes(competencia, 0, 0);

        } else if (moment(this.calculo.data_acao_judicial).isSame(competencia, 'month')) {

          diferencaMensal = this.limit60SCValor.valor;
          rowRST.diferenca_mensal = this.limit60SCValor.valorString;

          diferencaCorrigida = this.roundMoeda(this.limit60SCValor.valor * rowRST.correcao_monetariaN);
          rowRST.diferenca_corrigida = this.formatMoney(diferencaCorrigida, 'R$', true);

          valorJuros = this.roundMoeda(diferencaCorrigida * rowRST.jurosN);
          rowRST.valor_juros = this.formatMoney(valorJuros, 'R$', true);

          diferencaCorrigidaJuros = this.roundMoeda(diferencaCorrigida + valorJuros);
          rowRST.diferenca_juros = diferencaCorrigidaJuros;

          rowRST.diferenca_corrigida_juros = this.formatMoney(diferencaCorrigidaJuros, 'R$', true);
          rowRST.diferenca_corrigida_jurosN = diferencaCorrigidaJuros;

          const devidoLimitado = (this.limit60SCValor.valor * rowRST.correcao_monetariaN)
            + ((this.limit60SCValor.valor * rowRST.correcao_monetariaN) * rowRST.jurosN);

          // honorarios = this.calculoHonorarios(competencia, valorJuros, diferencaCorrigida, rowRST.beneficio_devidoH);
          honorarios = this.calculoHonorarios(competencia, valorJuros, diferencaCorrigida, devidoLimitado);

          this.calcularSomaCompetenciasMes(competencia, diferencaCorrigida, diferencaCorrigidaJuros);

        } else if (moment(this.calculo.data_acao_judicial).isBefore(competencia, 'month')) {

          diferencaMensal += rowRST.diferenca_mensalN;
          diferencaCorrigida += rowRST.diferenca_corrigidaN;
          valorJuros += (rowRST.diferenca_corrigidaN * rowRST.jurosN);
          diferencaCorrigidaJuros += rowRST.diferenca_corrigidaN + (rowRST.diferenca_corrigidaN * rowRST.jurosN);
          honorarios = (honorarios + rowRST.honorariosN);

          this.calcularSomaCompetenciasMes(competencia,
            rowRST.diferenca_corrigidaN,
            (rowRST.diferenca_corrigidaN + (rowRST.diferenca_corrigidaN * rowRST.jurosN)));

        }

      }

      this.somaDiferencaMensal = this.roundMoeda(diferencaMensal);
      this.somaJuros = this.roundMoeda(valorJuros);
      this.somaDiferencaCorrigida = this.roundMoeda(diferencaCorrigida);
      this.somaDiferencaCorrigidaJuros = this.roundMoeda(diferencaCorrigidaJuros);
      this.somaTotalSegurado = diferencaCorrigidaJuros + this.somaVincendas;

      this.somaHonorarios = this.roundMoeda(honorarios);

      if (somaDiferencaMensalValorAnterior > this.somaDiferencaMensal) {

        this.limit60SCPercDescartado.valor = (somaDiferencaMensalValorAnterior - this.somaDiferencaMensal);
        this.limit60SCPercDescartado.valorString = this.formatMoney(this.limit60SCPercDescartado.valor, 'R$', true);

        this.limit60SCPercDescartado.percentual = (this.limit60SCPercDescartado.valor / this.somaDiferencaMensal);
        this.limit60SCPercDescartado.percentualString = this.formatPercent(this.limit60SCPercDescartado.percentual, 2);

      }

    }

  }


  public calcularSomaCompetenciasMes(dataCorrente, diferencaCorrigida, diferencaCorrigidaComJuros) {

    this.RRASemJuros = this.calculo.rra_sem_juros;

    const valor = (this.RRASemJuros) ? diferencaCorrigidaComJuros : diferencaCorrigida;

    if (dataCorrente.isBetween(this.dataInicioDevidosDip, this.dataFinalAtual, 'month', '[]') && valor > 0) {

      if (dataCorrente.isSame(this.dataFinalAtual, 'year')) {

        this.somaNumeroCompetenciasAtual += 1;
        this.somaDiferencaCorrigidaAtual += valor;

      } else {

        this.somaNumeroCompetenciasAnterior += 1;
        this.somaDiferencaCorrigidaAnterior += valor;

      }

    }

  }


  // Se????o 3.1
  getIndiceReajusteValoresDevidos(dataCorrente) {

    if (this.dataCessacaoDevido != null && dataCorrente > this.dataCessacaoDevido) {
      return { reajuste: 1.0, reajusteOs: 0.0 };
    }

    if (dataCorrente.isSameOrBefore(this.calculo.data_pedido_beneficio_esperado, 'month')) {
      return { reajuste: 1.0, reajusteOs: 0.0 };
    }


    let reajuste = 0.0;
    // let indiceObjCorrente = this.Indice.getByDate(dataCorrente);
    const indiceObjCorrente = this.getByDateToType(dataCorrente, 'D');

    let indiceReajuste = 0;
    let indiceReajusteOs = 0;


    if (indiceObjCorrente == undefined) {
      reajuste = 0;
    } else {
      indiceReajuste = indiceObjCorrente.indice == null ? 1 : indiceObjCorrente.indice;
      indiceReajusteOs = indiceObjCorrente.indice_os == null ? 1 : indiceObjCorrente.indice_os;

      reajuste = indiceReajuste;

    }

    // chkIndice ?? o checkbox ???calcular aplicando os ??ndices de 2,28% em 06/1999 e 1,75% em 05/2004???
    let chkIndice = this.calculo.usar_indice_99_04;
    if (chkIndice) {
      if (dataCorrente.isSame(moment('1999-06-01'), 'month')) {
        reajuste = reajuste * 1.0228;
      }
      if (dataCorrente.isSame(moment('2004-05-01'), 'month')) {
        reajuste = reajuste * 1.0175;
      }
    }

    if (dataCorrente <= this.dataSimplificada &&
      moment(this.calculo.data_pedido_beneficio_esperado) < this.dataInicioBuracoNegro) {
      reajuste = 1;
    }
    else if (moment(this.calculo.data_pedido_beneficio_esperado) <= this.dataInicioBuracoNegro &&
      dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado)) {
      reajuste = 2.198234;

    }

    if (this.primeiroReajusteDevidos == -1 && reajuste != 1) {
      this.primeiroReajusteDevidos = 1;
    }

    if (dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado) &&
      moment(this.calculo.data_pedido_beneficio_esperado) == this.dataInicioCalculo) {
      reajuste = 1;
    }

    if (dataCorrente.isSame('1994-03-01', 'month')) {
      reajuste = 1 / 661.0052;
      if (dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado)) {
        reajuste = 1;
      }
    }

    let reajusteOS = 0.0;
    let dataPedidoBeneficioEsperado = moment(this.calculo.data_pedido_beneficio_esperado);
    if (this.isBuracoNegro(dataPedidoBeneficioEsperado) && dataCorrente < this.dataEfeitoFinanceiro) {
      if (dataCorrente < moment('1991-09-01')) {
        if (indiceObjCorrente == undefined) {
          reajusteOS = 0;
        } else {
          reajusteOS = indiceReajusteOs;
        }
      }
      else if (indiceObjCorrente.indice) {
        if (indiceObjCorrente == undefined) {
          reajusteOS = 0;
        } else {
          reajusteOS = indiceReajuste;
        }
      }
      else {
        reajusteOS = 1;
      }
    }
    if (reajusteOS == 0) {
      reajusteOS = 1;
    }

    // if (dataCorrente.isSame(this.calculo.data_pedido_beneficio_esperado, 'year')
    //   && this.dataInicioCalculo.isSame(this.calculo.data_pedido_beneficio_esperado, 'year')) {

    //   reajuste = 1;

    // }

    if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
      if (dataCorrente.isSame(this.dataEfeitoFinanceiro, 'month')) {

        reajuste = this.devidoIndiceBuracoNegro[this.reajusteLabel];
        // reajusteOS = this.devidoIndiceBuracoNegro[this.reajusteLabel];
        this.reajusteLabel = 'reajuste2';

      } else if (dataCorrente.isBefore(this.dataEfeitoFinanceiro, 'month')) {

        reajuste = 1.0;
        reajusteOS = 1.0;

      }
    }


    return { reajuste: reajuste, reajusteOs: reajusteOS };
  }

  private getByDateToTypeRecebidosList(date, recebidoRow) {

    const listTypeReceb = recebidoRow.value.indiceInps;
    const firstMonth = listTypeReceb[0].data_moeda;

    date = date.startOf('month');
    let difference = date.diff(firstMonth, 'months', true);
    difference = Math.abs(difference);
    difference = Math.floor(difference);

    return listTypeReceb[difference];
  }

  // Se????o 3.2
  getIndiceReajusteValoresRecebidos(dataCorrente, recebidoRow) {

    let dataPedidoBeneficioInd = moment(this.calculo.data_pedido_beneficio);
    let dataCessacaoRecebidoInd = this.dataCessacaoRecebido;
    let reajuste = 0.0;
    let indiceObjCorrente = this.Indice.getByDate(dataCorrente);
    let indiceReajuste = 0;
    let indiceReajusteOs = 0;
    let reajusteOS = 0.0;

    if (recebidoRow.status) {

      dataPedidoBeneficioInd = recebidoRow.value.dib.clone();
      dataCessacaoRecebidoInd = recebidoRow.value.cessacao.clone();
    }

    if (dataCessacaoRecebidoInd == null
      || (dataCessacaoRecebidoInd != null && dataCorrente > dataCessacaoRecebidoInd)
      || (recebidoRow.status && (recebidoRow.value.especie === 24 || recebidoRow.value.especie === 2021 ||
        recebidoRow.value.especie === '24' || recebidoRow.value.especie === '2021'))
    ) {
      return { reajuste: 1.0, reajusteOs: 0.0 };
    }


    if (recebidoRow.status) {
      indiceObjCorrente = this.getByDateToTypeRecebidosList(dataCorrente, recebidoRow)
    }

    if (indiceObjCorrente == undefined) {
      reajuste = 0;
    } else {

      indiceReajuste = indiceObjCorrente.indice == null ? 1 : indiceObjCorrente.indice;
      indiceReajusteOs = indiceObjCorrente.indice_os == null ? 1 : indiceObjCorrente.indice_os;

      reajuste = indiceReajuste;
    }

    if (dataCorrente <= this.dataSimplificada &&
      dataPedidoBeneficioInd < this.dataInicioBuracoNegro) {
      reajuste = 1;
    }
    else if (dataPedidoBeneficioInd <= this.dataInicioBuracoNegro &&
      dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado)) {
      reajuste = 2.198234;
    }

    if (this.primeiroReajusteRecebidos == -1 && reajuste != 1) {
      this.primeiroReajusteRecebidos = 1;
    }

    if (dataCorrente == dataPedidoBeneficioInd
      && dataPedidoBeneficioInd == this.dataInicioCalculo) {
      reajuste = 1;
    }

    if (dataCorrente.isSame('1994-03-01', 'month')) {
      reajuste = 1 / 661.0052;
      if (dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado)) {
        reajuste = 1;
      }
    }

    if (dataCorrente.isSame('1994-03-01', 'month')) {
       reajuste = 1 / 661.0052;
      if (dataCorrente.isSame(dataPedidoBeneficioInd, 'month')) {
        reajuste = 1;
      }
    }

    if (this.isBuracoNegro(dataPedidoBeneficioInd) && dataCorrente < this.dataEfeitoFinanceiro) {
      if (dataCorrente < moment('1991-09-01')) {
        if (indiceObjCorrente == undefined) {
          reajusteOS = 0;
        } else {
          reajusteOS = indiceReajusteOs;
        }
      } else if (indiceObjCorrente.indice) {
        if (indiceObjCorrente == undefined) {
          reajusteOS = 0;
        } else {
          reajusteOS = indiceReajuste;
        }
      } else {
        reajusteOS = 1;
      }
    }
    if (reajusteOS == 0) {
      reajusteOS = 1;
    }

    // if (dataCorrente.isSame(this.calculo.data_pedido_beneficio, 'year')
    //   && this.dataInicioCalculo.isSame(this.calculo.data_pedido_beneficio, 'year')) {

    //   reajuste = 1;

    // }


    if (this.isBuracoNegro(dataPedidoBeneficioInd)) {
      if (dataCorrente.isSame(this.dataEfeitoFinanceiro, 'month')) {

        reajuste = this.recebidosIndiceBuracoNegro[this.reajusteLabelR];
        // reajusteOS = this.recebidosIndiceBuracoNegro[this.reajusteLabel];
        this.reajusteLabelR = 'reajuste2';

      } else if (dataCorrente.isBefore(this.dataEfeitoFinanceiro, 'month')) {

        reajuste = 1.0;
        reajusteOS = 1.0;

      }
    }

    return { reajuste: reajuste, reajusteOs: reajusteOS };
  }

  /**
   * Aplicar o adicional de 25%
   * @param dataCorrente 
   * @param beneficioRecebido 
   */
  private aplicarAdicional25Recebido(dataCorrente, beneficioRecebido) {

    if (beneficioRecebido > 0
      && this.adicional25Recebido
      // && dataCorrente.isSame(this.dataInicialadicional25Recebido)
      && dataCorrente.isSameOrAfter(this.dataInicialadicional25Recebido, 'month')
    ) {
      return (Math.round((beneficioRecebido + (beneficioRecebido * 0.25)) * 100) / 100);
    }

    return beneficioRecebido;
  }


  /**
   * Aplicar o adicional de 25%
   * @param dataCorrente 
   * @param beneficioDevido 
   */
  private aplicarAdicional25(dataCorrente, beneficioDevido) {

    if (beneficioDevido > 0
      && this.adicional25Devido
      //  && dataCorrente.isSame(this.dataInicialadicional25Devido, 'month')
      && dataCorrente.isSameOrAfter(this.dataInicialadicional25Devido, 'month')
    ) {
      return (Math.round((beneficioDevido + (beneficioDevido * 0.25)) * 100) / 100);
    }

    return beneficioDevido;
  }


  private getPeriodoDevidoList() {
    let status = false;

    if (this.listDevidos.length > 0 && this.listDevidos[0] != undefined && this.listDevidos[0]['id'] !== undefined) {
      status = true;
    }

    return { status: status, value: this.listDevidos[0] };
  }

  // Se????o 3.3
  getBeneficioDevido(dataCorrente, reajusteObj, resultsObj, line) {

    const moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    const siglaDataCorrente = moedaDataCorrente.sigla;
    let irtDevidoSimplificado89 = 1;


    let rmiDevidos = this.roundMoeda(parseFloat(this.calculo.valor_beneficio_esperado));
    let beneficioDevido = 0.0;
    const dib = moment(this.calculo.data_pedido_beneficio_esperado);
    const dibMoeda = this.Moeda.getByDate(dib);
    const equivalencia89Moeda = this.Moeda.getByDate(this.dataEquivalenciaMinimo89);

    if (dib < this.dataInicioBuracoNegro) {
      irtDevidoSimplificado89 = rmiDevidos / dibMoeda.salario_minimo;
      rmiDevidos = this.roundMoeda(irtDevidoSimplificado89 * equivalencia89Moeda.salario_minimo);
    }

    if (dataCorrente > this.dataInicioDevidos) {
      beneficioDevido = this.ultimoBeneficioDevidoAntesProporcionalidade;
    } else {
      beneficioDevido = rmiDevidos;
      this.beneficioDevidoOs = beneficioDevido;
    }

    // if (
    //   moment(this.calculo.data_pedido_beneficio_esperado).isBefore('2006-03-31') &&
    //   (dataCorrente.isSame('2006-04-01') || dataCorrente.isSame('2006-08-01'))
    //   ) {
    //   beneficioDevido = rmiDevidos;
    //   this.beneficioDevidoOs = beneficioDevido;
    // }


    // aplicarReajusteUltimo = 1 somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
    if (dataCorrente <= this.dataSimplificada && dib < this.dataInicioBuracoNegro) {
      beneficioDevido = irtDevidoSimplificado89 * moedaDataCorrente.salario_minimo;
      if (this.aplicarReajusteUltimoDevido) {
        beneficioDevido = this.beneficioDevidoAnterior;
      }
    }


    // Nas pr??ximas 5 condi????es devem ser aplicados os beneficios devidos dos meses especificados entre os colchetes;
    // if ((
    //   // dataCorrente.isSame('2006-08-01', 'month') ||
    //   //dataCorrente.isSame('2000-06-01', 'month') || /// corre????o 25/09/2020 DR sergio / Jos??
    //   // dataCorrente.isSame('2001-06-01', 'month') ||
    //   dataCorrente.isSame('2002-06-01', 'month') ||
    //   dataCorrente.isSame('2003-06-01', 'month')) && this.beneficioDevidoSalvo != undefined) {
    //   beneficioDevido = this.beneficioDevidoSalvo;
    //   this.beneficioDevidoTetosSemLimite = this.beneficioDevidoTetosSemLimiteSalvo;
    // }



    if ((this.calculo.tipo_aposentadoria == '12' || this.calculo.tipo_aposentadoria == '17') && !this.isTetos) { // 11 = 'LOAS - beneficio salario minimo'
      beneficioDevido = moedaDataCorrente.salario_minimo;
    } else if (this.calculo.tipo_aposentadoria != '12' && this.calculo.tipo_aposentadoria != '17') {


      if (!dataCorrente.isSame(this.calculo.data_pedido_beneficio_esperado)) {

        if (this.beneficioDevidoTetosSemLimite < beneficioDevido) {
          this.beneficioDevidoTetosSemLimite = this.roundMoeda(beneficioDevido);
        }

        beneficioDevido *= reajusteObj.reajuste; // Reajuse de devidos, calculado na se????o 2.1

        //        this.beneficioDevidoTetosSemLimite *= reajusteObj.reajuste;
        this.beneficioDevidoTetosSemLimite = this.roundMoeda(this.beneficioDevidoTetosSemLimite *= reajusteObj.reajuste);;

      } else {

        reajusteObj.reajuste = 1.0;

      }

      // regra proporcional 08/2006
      if (
        moment(this.calculo.data_pedido_beneficio_esperado).isBefore('2006-03-31') &&
        dataCorrente.isSame('2006-08-01')
      ) {

        beneficioDevido = this.ultimoBeneficioDevidoAntesProporcionalidade *= 1.000095;
        this.beneficioDevidoOs = beneficioDevido;

      }
    }


    this.beneficioDevidoOs = this.roundMoeda(this.beneficioDevidoOs * reajusteObj.reajuste);
    let indiceSuperior = false;





    // algortimo buracoNegro definida na se????o de algortimos ??teis.
    if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
      if (dataCorrente.isSame(this.dataEfeitoFinanceiro, 'month')) {

        // Inserir indice superior *
        indiceSuperior = true;
        this.beneficioDevidoAposRevisao *= reajusteObj.reajuste;
        this.beneficioDevidoAposRevisaoTetos *= reajusteObj.reajuste;
        beneficioDevido = this.beneficioDevidoAposRevisao;

      } else if (dataCorrente < this.dataEfeitoFinanceiro) {

        beneficioDevido = this.beneficioDevidoOs;
        this.beneficioDevidoAposRevisao *= reajusteObj.reajusteOs;
        this.beneficioDevidoAposRevisaoTetos *= reajusteObj.reajusteOs;

      } else {

        this.beneficioDevidoAposRevisao *= reajusteObj.reajuste;
        this.beneficioDevidoAposRevisaoTetos *= reajusteObj.reajuste;

      }

    } else {
      this.beneficioDevidoAposRevisao *= reajusteObj.reajuste;
      this.beneficioDevidoAposRevisaoTetos *= reajusteObj.reajuste;
    }

    // somente 08/1993 - 31/01/2022
    if (
      // dataCorrente.isSame(this.dataCorteCruzado, 'month')
      // || dataCorrente.isSame(this.dataCorteCruzadoNovo, 'month')
      dataCorrente.isSame(this.dataCorteCruzeiroReal, 'month')
    ) {
      beneficioDevido /= 1000;
      this.beneficioDevidoOs /= 1000;
      this.beneficioDevidoAposRevisao /= 1000;
      this.beneficioDevidoAposRevisaoTetos /= 1000;
      this.beneficioDevidoTetosSemLimite /= 1000;
    }

    line.beneficio_devido_apos_revisao_sem_limites = this.formatMoney(this.beneficioDevidoAposRevisao);


    const dataPedidoBeneficioEsperado = moment(this.calculo.data_pedido_beneficio_esperado);
    const dataPagamentoBeneficioEsperado = moment(this.calculo.dip_valores_devidos);

    // taxa_ajuste_maxima_esperada definida no CRUD
    if (this.calculo.taxa_ajuste_maxima_esperada != undefined &&
      this.calculo.taxa_ajuste_maxima_esperada > 1) {
      if (this.dataComecoLei8870 <= dataPedidoBeneficioEsperado &&
        dataPedidoBeneficioEsperado <= this.dataFimLei8870 &&
        dataCorrente.isSame(this.dataAplicacao8870, 'month')) {
        beneficioDevido *= parseFloat(this.calculo.taxa_ajuste_maxima_esperada);
        this.beneficioDevidoTetosSemLimite *= parseFloat(this.calculo.taxa_ajuste_maxima_esperada);
      }

      if (dataPedidoBeneficioEsperado >= this.dataLei8880 && this.primeiroReajusteDevidos == 1) {
        beneficioDevido *= parseFloat(this.calculo.taxa_ajuste_maxima_esperada);
        this.beneficioDevidoTetosSemLimite *= parseFloat(this.calculo.taxa_ajuste_maxima_esperada);
        this.primeiroReajusteDevidos = 0;
      }
    }

    let tetoDevidos = parseFloat(moedaDataCorrente.teto);


    // alterado 09/09/2020 erro de rejuste em 1998
    if (this.isTetos) {
      if (dataCorrente.isSame(this.dataPrimeiroTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia
        tetoDevidos = 1200.00;
        if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
          beneficioDevido = this.beneficioDevidoAposRevisaoTetos;
        } else {
          beneficioDevido = this.beneficioDevidoTetosSemLimite;
        }
      }

      if (dataCorrente.isSame(this.dataSegundoTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia
        tetoDevidos = 2400.00;
        if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
          beneficioDevido = this.beneficioDevidoAposRevisaoTetos;
        } else {
          beneficioDevido = this.beneficioDevidoTetosSemLimite;
        }
      }
    }

    line.beneficio_devido_sem_limites = this.formatMoney(this.beneficioDevidoTetosSemLimite);
    // line.beneficio_devido_sem_limites = this.formatMoney(beneficioDevido);

    if (this.isTetos) { // qaundo o tipo ?? AJ 28/07/2020
      //  this.beneficioDevidoTetosSemLimite = beneficioDevido;
    }

    // AplicarTetosEMinimos Definido na se????o de algoritmos ??teis.
    let beneficioDevidoAjustado = 0;

    // beneficioDevido = this.aplicarAdicional25(dataCorrente, beneficioDevido);


    if (this.isTetos) {

      beneficioDevidoAjustado = this.aplicarTetosEMinimosTetos(beneficioDevido,
        dataCorrente,
        dataPedidoBeneficioEsperado,
        'Devido',
        tetoDevidos);

    } else {

      beneficioDevidoAjustado = this.aplicarTetosEMinimos(beneficioDevido, dataCorrente, dataPedidoBeneficioEsperado, 'Devido');

    }


    if (this.devidoBuracoNegro && (this.calculo.nao_aplicar_ajuste_maximo_98_2003 == 1)) {


      if (dataCorrente.isSame(this.dataPrimeiroTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia

        tetoDevidos = 1200.00;

        if (this.devidoBuracoNegro && this.beneficioDevidoAposRevisao > tetoDevidos) {

          beneficioDevidoAjustado = tetoDevidos;
        } else {

          beneficioDevidoAjustado = this.beneficioDevidoAposRevisao;

        }

      }

      if (dataCorrente.isSame(this.dataSegundoTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia

        tetoDevidos = 2400.00;

        if (this.devidoBuracoNegro && this.beneficioDevidoAposRevisao > tetoDevidos) {

          beneficioDevidoAjustado = tetoDevidos;

        } else {

          beneficioDevidoAjustado = this.beneficioDevidoAposRevisao;

        }

      }

    } else if ((this.calculo.nao_aplicar_ajuste_maximo_98_2003 == 1) &&
      (dataCorrente.isSame(this.dataPrimeiroTetoJudicial, 'month')
        || dataCorrente.isSame(this.dataSegundoTetoJudicial, 'month'))
    ) {

      const defineValorComparacao2041 = this.beneficioDevidoTetosSemLimite;

      if (dataCorrente.isSame(this.dataPrimeiroTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia
        tetoDevidos = 1200.00;
        if (defineValorComparacao2041 > tetoDevidos) {
          beneficioDevidoAjustado = tetoDevidos;
        } else {
          beneficioDevidoAjustado = defineValorComparacao2041;
        }

      }

      if (dataCorrente.isSame(this.dataSegundoTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia
        tetoDevidos = 2400.00;
        if (defineValorComparacao2041 > tetoDevidos) {
          beneficioDevidoAjustado = tetoDevidos;
        } else {
          beneficioDevidoAjustado = defineValorComparacao2041;
        }
      }

    }



    // if ((this.calculo.nao_aplicar_ajuste_maximo_98_2003 == 1) &&
    //   (dataCorrente.isSame(this.dataPrimeiroTetoJudicial, 'month')
    //     || dataCorrente.isSame(this.dataSegundoTetoJudicial, 'month'))
    // ) {

    //   console.log(beneficioDevidoAjustado);
    //   console.log(this.beneficioDevidoAposRevisao);
    //   console.log(this.beneficioDevidoTetosSemLimite);


    //   const defineValorComparacao2041 = (this.devidoBuracoNegro) ? this.beneficioDevidoAposRevisao : this.beneficioDevidoTetosSemLimite;

    //   if (dataCorrente.isSame(this.dataPrimeiroTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia
    //     tetoDevidos = 1200.00;
    //     if (this.devidoBuracoNegro || defineValorComparacao2041 > tetoDevidos) {
    //       beneficioDevidoAjustado = tetoDevidos;
    //     } else {
    //       beneficioDevidoAjustado = defineValorComparacao2041;
    //     }

    //   }

    //   if (dataCorrente.isSame(this.dataSegundoTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia
    //     tetoDevidos = 2400.00;
    //     if (this.devidoBuracoNegro || defineValorComparacao2041 > tetoDevidos) {
    //       beneficioDevidoAjustado = tetoDevidos;
    //     } else {
    //       beneficioDevidoAjustado = defineValorComparacao2041;
    //     }
    //   }

    // }



    // this.beneficioDevidoAposRevisao =
    // this.aplicarTetosEMinimos(this.beneficioDevidoAposRevisao, dataCorrente, dataPedidoBeneficioEsperado, 'Devido');
    this.beneficioDevidoAposRevisao = this.aplicarMinimos(
      this.beneficioDevidoAposRevisao,
      dataCorrente,
      dataPedidoBeneficioEsperado,
      'Devido');

    line.beneficio_devido_apos_revisao = this.formatMoney(this.beneficioDevidoAposRevisao);

    // beneficioDevidoAjustado = this.roundMoeda(beneficioDevidoAjustado);
    this.ultimoBeneficioDevidoAntesProporcionalidade = this.roundMoeda(beneficioDevidoAjustado);

    // Caso diasProporcionais for diferente de 1, inserir subindice ???p???. O algoritmo est?? definido na se????o de algoritmos ??teis.
    let diasProporcionais = this.calcularDiasProporcionais(dataCorrente, dataPagamentoBeneficioEsperado);

    // Final Prescri????o
    if (dataCorrente.isSame(this.dataFinalPrescricao, 'month') && this.considerarPrescricao) {
      diasProporcionais = this.calcularDiasProporcionais(dataCorrente, this.dataFinalPrescricao.clone());
    }

    if (!line.dias_proporcionais) {
      line.dias_proporcionais = diasProporcionais;
    }

    let beneficioDevidoFinal = beneficioDevidoAjustado * diasProporcionais;

    if (dataCorrente.isSame(moment('2017-01-01'), 'year')) {
      if (parseFloat(beneficioDevidoFinal.toFixed(3)) === parseFloat(moedaDataCorrente.salario_minimo) + 0.904) {
        beneficioDevidoFinal = parseFloat(moedaDataCorrente.salario_minimo);
        this.ultimoBeneficioDevidoAntesProporcionalidade = parseFloat(moedaDataCorrente.salario_minimo);
      }
    }

    if (dataCorrente.isSame(moment('2018-01-01'), 'year') && !this.isTetos) {
      if (parseFloat(beneficioDevidoFinal.toFixed(3)) === parseFloat(moedaDataCorrente.salario_minimo) + 2.396) {
        beneficioDevidoFinal = parseFloat(moedaDataCorrente.salario_minimo);
        this.ultimoBeneficioDevidoAntesProporcionalidade = parseFloat(moedaDataCorrente.salario_minimo);
      }
    }

    this.proporcionalidadeUltimaLinha = false;
    // Calcular proporcional no final devido
    if (dataCorrente.isSame(this.dataFinal, 'month')
      && (this.dataCessacaoDevido == null || this.dataFinal.isSame(this.dataCessacaoDevido))) {

      let diasConsiderados = this.dataFinal.date();
      if ((this.dataFinal.month() + 1) === 2 && (diasConsiderados === 28 || diasConsiderados === 29)) {
        diasConsiderados = 30;
      }

      // let proporcionalidade = this.dataFinal.date() / this.dataFinal.daysInMonth();
      let proporcionalidade = ((diasConsiderados >= 30) ? 30 : diasConsiderados) / 30;
      beneficioDevidoFinal *= proporcionalidade;
      // this.proporcionalidadeUltimaLinha = true;

      if (proporcionalidade != 1) {
        this.proporcionalidadeUltimaLinha = true;
      }

    } else if (this.dataCessacaoDevido != null && dataCorrente.isSame(this.dataCessacaoDevido, 'month')) {

      let diasConsiderados = this.dataCessacaoDevido.date();
      if ((this.dataCessacaoDevido.month() + 1) === 2 && (diasConsiderados === 28 || diasConsiderados === 29)) {
        diasConsiderados = 30;
      }
      // let proporcionalidade = this.dataCessacaoDevido.date() / this.dataCessacaoDevido.daysInMonth();
      const proporcionalidade = ((diasConsiderados >= 30) ? 30 : diasConsiderados) / 30;
      beneficioDevidoFinal *= proporcionalidade;
      // this.proporcionalidadeUltimaLinha = true;

      if (proporcionalidade != 1) {
        this.proporcionalidadeUltimaLinha = true;
      }

    }



    let minimoAplicado = false;


    if (beneficioDevidoAjustado == parseFloat(moedaDataCorrente.teto)) {
      // Ajustado para o teto. Adicionar subindice ???T??? no valor do beneficio
      // beneficioDevidoString += '/T';

      if (reajusteObj.reajuste > 1 && !this.isTetoInicialDevido) { //
        this.isTetoInicialDevido = true;
      }

    } else if (beneficioDevidoAjustado == moedaDataCorrente.salario_minimo) {
      // Ajustado para o salario minimo. Adicionar subindice ???M??? no valor do beneficio
      // beneficioDevidoString += '/M';
      minimoAplicado = true;

      this.isMinimoInicialDevido = true;

      // if (dataPagamentoBeneficioDevido.isValid() && dataCorrente.isSame(dataPagamentoBeneficioDevido, 'month')) {
      //   this.isMinimoInicialDevido = true;
      // }
    }


    // if (diasProporcionais != 1 || this.proporcionalidadeUltimaLinha) {
    //   beneficioDevidoString += '/p';
    // }

    this.aplicarReajusteUltimoDevido = false;
    // a condi????o abaixo s?? ?? executada quando o valor aplicado ?? o salario minimo
    if (minimoAplicado) {
      // aplicarReajusteUltimoDevido somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
      // esse valor sera usado na proxima chamada da fun????o
      if (this.ultimoSalarioMinimoDevido != beneficioDevidoAjustado) {
        this.aplicarReajusteUltimoDevido = true;
      }
      this.ultimoSalarioMinimoDevido = beneficioDevidoAjustado;
    }

    if (
      dataCorrente.isSame('2006-03-01', 'month') ||
      dataCorrente.isSame('2000-03-01', 'month') ||
      dataCorrente.isSame('2001-03-01', 'month') ||
      dataCorrente.isSame('2002-03-01', 'month') ||
      dataCorrente.isSame('2003-03-01', 'month')) {
      this.beneficioDevidoSalvo = beneficioDevidoFinal;
      this.beneficioDevidoTetosSemLimiteSalvo = this.beneficioDevidoTetosSemLimite;
    }

    beneficioDevidoFinal = this.aplicarRedutorParcelasRecuperacao(beneficioDevidoFinal, dataCorrente, 'd');

    this.beneficioDevidoAnterior = beneficioDevidoFinal;
    beneficioDevidoFinal = this.aplicarAdicional25(dataCorrente, beneficioDevidoFinal);

    let beneficioDevidoString = this.formatMoney(beneficioDevidoFinal, siglaDataCorrente);
    if (indiceSuperior) {
      beneficioDevidoString += '*'
    }

    resultsObj.resultString = beneficioDevidoString;
    // this.beneficioDevidoAnterior = beneficioDevidoFinal;




    return beneficioDevidoFinal;
  }

  private getPeriodoRecebidoList(dataCorrente) {

    let recebidoRow: Recebidos;
    let status = false;

    recebidoRow = this.listRecebidos.find(row => (dataCorrente.isBetween(row.dib, row.cessacao, 'month', '[]')));

    if (recebidoRow != undefined && recebidoRow['id'] !== undefined) {
      status = true;
    }

    return { status: status, value: recebidoRow };
  }



  aplicarReajustesDibAnteriorRecebidosMultiplos(recebidoRow, dataCorrente, rmiRecebidos) {

    if (this.listRecebidos.length > 1
      && (
        recebidoRow.value.id > 1
        && recebidoRow.value.dip.isSame(dataCorrente)
        && recebidoRow.value.dip.isAfter(recebidoRow.value.dib))) {

      for (const rowIND of recebidoRow.value.indiceInpsValores) {
        if (recebidoRow.value.dip.isSameOrAfter(moment(rowIND.data_moeda))) {
          rmiRecebidos = this.roundMoeda(rmiRecebidos * rowIND.indice);
        }
      }

      this.ultimoBeneficioRecebidoAntesProporcionalidade = rmiRecebidos;
      return rmiRecebidos;

    }

    return rmiRecebidos;

  }



  // Se????o 3.4
  getBeneficioRecebido(dataCorrente, reajusteObj, resultsObj, line, recebidoRow) {


    if (this.listRecebidos.length === 0) {
      return 0;
    }

    const moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    const siglaDataCorrente = moedaDataCorrente.sigla;
    let irtRecebidoSimplificado89 = 1;

    let rmiBuracoNegro = 0.0;
    let beneficioRecebido = 0.0;
    let dib = moment(this.calculo.data_pedido_beneficio);
    let tipo_aposentadoria_recebida = this.calculo.tipo_aposentadoria_recebida;
    let taxa_ajuste_maxima_concedida = this.calculo.taxa_ajuste_maxima_concedida;
    let dataPedidoBeneficio = moment(this.calculo.data_pedido_beneficio);
    let dataPagamentoBeneficio = moment(this.calculo.data_pedido_beneficio);
    let dataCessacaoRecebido = this.dataCessacaoRecebido;
    let rmiRecebidos = parseFloat(this.calculo.valor_beneficio_concedido);


    if (recebidoRow.status) {


      rmiRecebidos = parseFloat(recebidoRow.value.rmi);
      rmiBuracoNegro = parseFloat(recebidoRow.value.rmiBuracoNegro);

      rmiRecebidos = this.aplicarReajustesDibAnteriorRecebidosMultiplos(recebidoRow, dataCorrente, rmiRecebidos);

      beneficioRecebido = 0.0;
      dataPedidoBeneficio = recebidoRow.value.dib.clone();
      dataPagamentoBeneficio = (recebidoRow.value.dip) ? recebidoRow.value.dip.clone() : dataPedidoBeneficio.clone();
      dataCessacaoRecebido = recebidoRow.value.cessacao.clone();
      dib = dataPedidoBeneficio.clone();
      tipo_aposentadoria_recebida = recebidoRow.value.especie;
      taxa_ajuste_maxima_concedida = this.parseStringFloatIRT(recebidoRow.value.irt);
      this.calculo.tipo_aposentadoria_recebida = recebidoRow.value.especie;
      this.calculo.nao_aplicar_sm_beneficio_concedido = recebidoRow.value.reajusteMinimo;
      this.calculo.manterPercentualSMConcedido = recebidoRow.value.manterPercentualSMConcedido;
      this.dataCessacaoRecebido = dataCessacaoRecebido;
      this.listRedutorrecebido = recebidoRow.value.listRedutorrecebido;

      if (this.isMinimoInicialRecebidoLastId === undefined) {
        this.isMinimoInicialRecebidoLastId = recebidoRow.value.id;
      }


    } else {

    }

    // if (dataCorrente.isSame('2017-08-01')) {
    //   console.log(rmiRecebidos);
    //   console.log(beneficioRecebido);
    // }

    if ((this.dataCessacaoRecebido != null && dataCorrente > this.dataCessacaoRecebido)) {
      resultsObj.resultString = this.formatMoney(0.0, siglaDataCorrente);
      return 0.0;
    }

    const dibMoeda = this.Moeda.getByDate(dib);
    const equivalencia89Moeda = this.Moeda.getByDate(this.dataEquivalenciaMinimo89);

    if (dib < this.dataInicioBuracoNegro) {
      irtRecebidoSimplificado89 = rmiRecebidos / dibMoeda.salario_minimo;
      rmiRecebidos = irtRecebidoSimplificado89 * equivalencia89Moeda.salario_minimo;
    }

    // ultimo valor antes da proporcionalidade?
    if (dataCorrente > dataPedidoBeneficio && this.ultimoBeneficioRecebidoAntesProporcionalidade > 0) {
      // if (dataCorrente > this.dataInicioRecebidos) {
      beneficioRecebido = (this.ultimoBeneficioRecebidoAntesProporcionalidade);
    } else {
      beneficioRecebido = (rmiRecebidos);
      this.beneficioRecebidoOs = (beneficioRecebido);
    }


    // removido DR. Sergio 30/07/2020 (&& !this.isTetos)
    if (dataCorrente <= this.dataSimplificada && dib < this.dataInicioBuracoNegro) {
      beneficioRecebido = irtRecebidoSimplificado89 * moedaDataCorrente.salario_minimo;
      if (this.aplicarReajusteUltimoRecebido) {
        beneficioRecebido = this.beneficioRecebidoAnterior;
      }
    }

    // Nas pr??ximas 5 condi????es devem ser aplicados os beneficios devidos dos meses especificados entre os colchetes
    // if ((
    //   //dataCorrente.isSame('2006-08-01', 'month') ||
    //   // dataCorrente.isSame('2000-06-01', 'month') || /// corre????o 25/09/2020 DR sergio / Jos??
    //   // dataCorrente.isSame('2001-06-01', 'month') ||
    //   dataCorrente.isSame('2002-06-01', 'month') ||
    //   dataCorrente.isSame('2003-06-01', 'month')) 
    //   && this.beneficioRecebidoSalvo != undefined) {
    //   beneficioRecebido = this.beneficioRecebidoSalvo;
    // }


    if ((tipo_aposentadoria_recebida == '12'
      || tipo_aposentadoria_recebida == '17') && !this.isTetos) { // 12 , 17 : LOAS - beneficio salario minimo'

      beneficioRecebido = moedaDataCorrente.salario_minimo;

    } else if (tipo_aposentadoria_recebida != '12' && tipo_aposentadoria_recebida != '17') {

      ///if (!dataCorrente.isSame(this.dataInicioRecebidos)) {
      if (!dataCorrente.isSame(dataPedidoBeneficio)) {
        beneficioRecebido *= reajusteObj.reajuste; // Reajuse de devidos, calculado na se????o 2.1
      } else {
        reajusteObj.reajuste = 1.0;
      }

      //  regra proporcional 08/2006
      if (
        moment(this.dataInicioRecebidos).isBefore('2006-03-31') &&
        dataCorrente.isSame('2006-08-01')
      ) {
        beneficioRecebido = this.beneficioRecebidoAnterior *= 1.000095;
      }
    }



    this.beneficioRecebidoOs = this.beneficioRecebidoOs * reajusteObj.reajuste;
    let indiceSuperior = false;

    if (this.isBuracoNegro(dataPedidoBeneficio)) {
      if (dataCorrente.isSame(this.dataEfeitoFinanceiro, 'month')) {


        // INSERIR ??NDICE SUPERIOR ???*???
        indiceSuperior = true;
        this.beneficioRecebidoAposRevisao *= reajusteObj.reajuste;
        this.beneficioRecebidoAposRevisaoTetos *= reajusteObj.reajuste;
        beneficioRecebido = this.beneficioRecebidoAposRevisao;

        // beneficioRecebido = parseFloat(this.calculo.valor_beneficio_concedido_apos_revisao) * reajusteObj.reajuste;
      } else if (dataCorrente < this.dataEfeitoFinanceiro) {

        beneficioRecebido = this.beneficioRecebidoOs;
        this.beneficioRecebidoAposRevisao *= reajusteObj.reajusteOs;
        this.beneficioRecebidoAposRevisaoTetos *= reajusteObj.reajusteOs;
        // beneficioRecebido = rmiRecebidos * reajusteObj.reajuste;

      } else {

        this.beneficioRecebidoAposRevisao *= reajusteObj.reajuste;
        this.beneficioRecebidoAposRevisaoTetos *= reajusteObj.reajuste;

      }
    } else {
      this.beneficioRecebidoAposRevisao *= reajusteObj.reajuste;
      this.beneficioRecebidoAposRevisaoTetos *= reajusteObj.reajuste;
    }



    // somente 08/1993 - 31/01/2022
    if (
      // dataCorrente.isSame(this.dataCorteCruzado, 'month')
      // || dataCorrente.isSame(this.dataCorteCruzadoNovo, 'month') ||
      dataCorrente.isSame(this.dataCorteCruzeiroReal, 'month')) {
      beneficioRecebido /= 1000;
      this.beneficioRecebidoOs /= 1000;
      this.beneficioRecebidoAposRevisao /= 1000;
      this.beneficioRecebidoAposRevisaoTetos /= 1000;
    }

    line.beneficio_recebido_apos_revisao_sem_limites = this.formatMoney(this.beneficioRecebidoAposRevisaoTetos);

    if (taxa_ajuste_maxima_concedida != undefined && taxa_ajuste_maxima_concedida > 1) {

      if (this.dataComecoLei8870 <= dataPedidoBeneficio &&
        dataPedidoBeneficio <= this.dataFimLei8870 &&
        dataCorrente.isSame(this.dataAplicacao8870, 'month')) {
        beneficioRecebido *= parseFloat(taxa_ajuste_maxima_concedida);
      }

      if (dataPedidoBeneficio >= this.dataLei8880 && this.primeiroReajusteRecebidos == 1) {
        beneficioRecebido *= parseFloat(taxa_ajuste_maxima_concedida);
        this.primeiroReajusteRecebidos = 0;

      }

    }


    const chkBeneficioNaoConcedido = this.calculo.beneficio_nao_concedido;
    if (chkBeneficioNaoConcedido) {
      beneficioRecebido = 0;
    }

    let tetoRecebidos = moedaDataCorrente.teto;

    // alterado 09/09/2020 erro de rejuste em 1998
    if (this.isTetos) {
      if (dataCorrente.isSame(this.dataPrimeiroTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia
        tetoRecebidos = 1081.50;
        if (this.isBuracoNegro(dataPedidoBeneficio)) {
          beneficioRecebido = this.beneficioRecebidoAposRevisaoTetos;
        }
      }
      // if (dataCorrente.isSame(this.dataSegundoTetoJudicial, 'month')) { // Compara????o de m??s e ano, ignorar dia
      //   if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
      //     beneficioRecebido = this.beneficioRecebidoAposRevisaoTetos;
      //   }
      // }
    }


    line.beneficio_recebido_sem_limites = this.formatMoney(beneficioRecebido);

    // AplicarTetosEMinimos Definido na se????o de algoritmos ??teis.
    let beneficioRecebidoAjustado = 0;

    // Aplicar adicional 25 Recebido
    //beneficioRecebido = this.aplicarAdicional25Recebido(dataCorrente, beneficioRecebido);


    if ((recebidoRow.status) && this.isMinimoInicialRecebidoLastId !== recebidoRow.value.id) {
      this.isMinimoInicialRecebido = false;
      this.isMinimoInicialRecebidoLastId = recebidoRow.value.id;
    }


    if (this.isTetos) {
      beneficioRecebidoAjustado = this.aplicarTetosEMinimosTetos(beneficioRecebido,
        dataCorrente,
        dataPedidoBeneficio,
        'Recebido',
        tetoRecebidos);
    } else {


      beneficioRecebidoAjustado = this.aplicarTetosEMinimos(beneficioRecebido,
        dataCorrente,
        dataPedidoBeneficio,
        'Recebido');

    }


    beneficioRecebidoAjustado = this.roundMoeda(beneficioRecebidoAjustado);


    this.beneficioRecebidoAposRevisao = this.aplicarTetosEMinimos(this.beneficioRecebidoAposRevisao,
      dataCorrente,
      dataPedidoBeneficio,
      'Recebido');

    // if (dataCorrente.isBetween('2019-10-01', '2019-11-01', 'month', '[]')) {
    //   console.log(dataCorrente.format('DD/MM/YYYY') + ' - ' + rmiRecebidos + ' - ' + beneficioRecebidoAjustado);
    //   console.log( ' - ' + this.isMinimoInicialRecebidoLastId + ' - ' + recebidoRow.value.id);
    //   console.log(this.isMinimoInicialRecebidoLastId);
    //   console.log(recebidoRow.value.id);
    // }

    line.beneficio_recebido_apos_revisao = this.formatMoney(this.beneficioRecebidoAposRevisao);
    this.ultimoBeneficioRecebidoAntesProporcionalidade = beneficioRecebidoAjustado;

    // Caso diasProporcionais for diferente de 1, inserir subindice ???p???. O algoritmo est?? definido na se????o de algoritmos ??teis.
    let diasProporcionais = this.calcularDiasProporcionais(dataCorrente, dataPagamentoBeneficio);

    // Final Prescri????o
    if (dataCorrente.isSame(this.dataFinalPrescricao, 'month') && this.considerarPrescricao) {
      diasProporcionais = this.calcularDiasProporcionais(dataCorrente, this.dataFinalPrescricao.clone());
    }

    if (this.calculo.tipo_aposentadoria_recebida === '2021') {
      diasProporcionais = 1;
    }

    if (!line.dias_proporcionais) {
      line.dias_proporcionais = diasProporcionais;
    }

    let beneficioRecebidoFinal = beneficioRecebidoAjustado * diasProporcionais;


    // Calcular proporcional no final recebido
    if (dataCorrente.isSame(this.dataFinal, 'month') && dataCessacaoRecebido == null) {
      // 03/07/2020 || this.dataFinal.isSame(this.dataCessacaoRecebido)

      let diasConsiderados = this.dataFinal.date();
      if ((this.dataFinal.month() + 1) === 2 && (diasConsiderados === 28 || diasConsiderados === 29)) {
        diasConsiderados = 30;
      }

      // let proporcionalidade = this.dataFinal.date() / this.dataFinal.daysInMonth();
      let proporcionalidade = ((diasConsiderados >= 30) ? 30 : diasConsiderados) / 30;
      beneficioRecebidoFinal *= proporcionalidade;

      if (proporcionalidade != 1) {
        this.proporcionalidadeUltimaLinha = true;
      }

    } else if (dataCessacaoRecebido != null && dataCorrente.isSame(dataCessacaoRecebido, 'month')) {

      let diasConsiderados = dataCessacaoRecebido.date();
      if ((dataCessacaoRecebido.month() + 1) === 2 && (diasConsiderados === 28 || diasConsiderados === 29)) {
        diasConsiderados = 30;
      }

      // let proporcionalidade = dataCessacaoRecebido.date() / dataCessacaoRecebido.daysInMonth();
      let proporcionalidade = ((diasConsiderados >= 30) ? 30 : diasConsiderados) / 30;
      beneficioRecebidoFinal *= proporcionalidade;

      if (proporcionalidade != 1) {
        this.proporcionalidadeUltimaLinha = true;
      }

    }

    if (dataCorrente.isSame(moment('2017-01-01'), 'year')) {
      if (parseFloat(beneficioRecebidoFinal.toFixed(3)) === parseFloat(moedaDataCorrente.salario_minimo) + 0.904) {
        beneficioRecebidoFinal = parseFloat(moedaDataCorrente.salario_minimo);
        this.ultimoBeneficioRecebidoAntesProporcionalidade = parseFloat(moedaDataCorrente.salario_minimo);
      }
    }

    if (dataCorrente.isSame(moment('2018-01-01'), 'year') && !this.isTetos) {
      if (parseFloat(beneficioRecebidoFinal.toFixed(3)) === parseFloat(moedaDataCorrente.salario_minimo) + 2.396) {
        beneficioRecebidoFinal = parseFloat(moedaDataCorrente.salario_minimo);
        this.ultimoBeneficioRecebidoAntesProporcionalidade = parseFloat(moedaDataCorrente.salario_minimo);
      }
    }


    // let rmiDevidos = parseFloat(this.calculo.valor_beneficio_esperado);
    // rmiDevidos = this.aplicarTetosEMinimosDIB(rmiDevidos, moment(this.calculo.data_pedido_beneficio_esperado).startOf('month'));

    // let beneficioDevido = 0.0;
    // let dib = moment(this.calculo.data_pedido_beneficio_esperado);
    // let dibMoeda = this.Moeda.getByDate(dib);
    // let equivalencia89Moeda = this.Moeda.getByDate(this.dataEquivalenciaMinimo89);


    let minimoAplicado = false;

    if (beneficioRecebidoAjustado == moedaDataCorrente.teto) {
      // Ajustado para o teto. Adicionar subindice ???T??? no valor do beneficio
      // beneficioRecebidoString += '/T';

      // if (reajusteObj.reajuste > 1 && !this.isTetoInicialRecebido) {
      //   this.isTetoInicialRecebido = true;
      // }

    } else if (beneficioRecebidoAjustado == moedaDataCorrente.salario_minimo) {
      // Ajustado para o salario minimo. Adicionar subindice ???M??? no valor do beneficio
      // beneficioRecebidoString += '/M';
      minimoAplicado = true;

      // if (dataCorrente.isSame(this.calculo.data_pedido_beneficio, 'month')) {
      // if (dataPagamentoBeneficio.isValid() && dataCorrente.isSame(dataPagamentoBeneficio, 'month')) {
      this.isMinimoInicialRecebido = true;
      // }

    }

    if (diasProporcionais != 1 || this.proporcionalidadeUltimaLinha) {
      // beneficioRecebidoString += '/p';
    }

    this.aplicarReajusteUltimoRecebido = false;
    // a condi????o abaixo s?? ?? executada quando o valor aplicado ?? o salario minimo
    if (minimoAplicado) {
      // aplicarReajusteUltimoRecebido somente quando, no mes anterior, 
      // houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
      // esse valor sera usado na proxima chamada da fun????o
      if (this.ultimoSalarioMinimoRecebido != beneficioRecebidoAjustado) {
        this.aplicarReajusteUltimoRecebido = true;
      }
      this.ultimoSalarioMinimoRecebido = beneficioRecebidoAjustado;
    }

    if (dataCorrente.isSame('2006-03-01', 'month') ||
      dataCorrente.isSame('2000-03-01', 'month') ||
      dataCorrente.isSame('2001-03-01', 'month') ||
      dataCorrente.isSame('2002-03-01', 'month') ||
      dataCorrente.isSame('2003-03-01', 'month')) {
      this.beneficioRecebidoSalvo = beneficioRecebidoFinal;
    }

    beneficioRecebidoFinal = this.aplicarRedutorParcelasRecuperacao(beneficioRecebidoFinal,
      dataCorrente,
      'r',
      recebidoRow.value);

    this.beneficioRecebidoAnterior = beneficioRecebidoFinal;
    beneficioRecebidoFinal = this.aplicarAdicional25Recebido(dataCorrente, beneficioRecebidoFinal);

    let beneficioRecebidoString = this.formatMoney(beneficioRecebidoFinal, siglaDataCorrente);
    if (indiceSuperior) {
      beneficioRecebidoString += '*'
    }
    resultsObj.resultString = beneficioRecebidoString;

    return beneficioRecebidoFinal;
  }


  // Se????o 3.7
  getCorrecaoMonetaria(dataCorrente) {

    const tipo_correcao = this.calculo.tipo_correcao;

    if (this.checkAcessoEC113(dataCorrente)) {
      return 1;
    }


    if (dataCorrente.isBetween('1994-03-01', '1994-06-01', 'month', '[]')) {
      dataCorrente = moment('01/07/1994', 'DD/MM/YYYY');
    }

    if (dataCorrente.isAfter(this.calculo.data_calculo_pedido, 'month')) {
      return 1.00000;
    }

    const moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    const moedaDataAtual = this.Moeda.getByDate(moment());
    const moedaDataCalculo = this.Moeda.getByDate(moment(this.calculo.data_calculo_pedido));
    const usar_deflacao = !this.calculo.nao_usar_deflacao;

    let desindexador = 0.0;
    let correcaoMonetaria = 0.0;

    /*
    if (tipo_correcao == 'ipca') {

      desindexador = moedaDataAtual.ipca / moedaDataCalculo.ipca;
      correcaoMonetaria = moedaDataCorrente.ipca * desindexador;

    } else if (tipo_correcao == 'cam') {

      desindexador = moedaDataAtual.cam / moedaDataCalculo.cam;
      correcaoMonetaria = moedaDataCorrente.cam * desindexador;

    } else if (tipo_correcao == 'tr') {

      desindexador = moedaDataAtual.tr / moedaDataCalculo.tr;
      correcaoMonetaria = moedaDataCorrente.tr * desindexador;

    } else if (tipo_correcao == 'tr032015_ipcae') {

      desindexador = moedaDataAtual.tr032015_ipcae / moedaDataCalculo.tr032015_ipcae;
      correcaoMonetaria = moedaDataCorrente.tr032015_ipcae * desindexador;

    } 
    */

    if (this.isExits(tipo_correcao) && tipo_correcao !== 'sem_correcao') {
      desindexador = moedaDataAtual[tipo_correcao] / moedaDataCalculo[tipo_correcao];
      correcaoMonetaria = moedaDataCorrente[tipo_correcao] * desindexador;
    }

    // em an??lise 08/06/2020
    // if (!usar_deflacao) {

    //   if (correcaoMonetaria < 1.0 && dataCorrente > moment('1994-06-01')) {
    //     correcaoMonetaria = 1;
    //   }
    // }



    return correcaoMonetaria;
  }



  getJurosPorCompetencia(data) {

    return this.jurosCorrenteList.find(obj => data.isSame(obj.data)).juros;
    // return this.jurosCorrenteList.find(obj => moment(data).startOf('day').diff(moment(obj.data).startOf('day'), 'days')).juros;
  }



  createJurosCorrenteList(competencias) {

    const competenciasReverse = [];
    competencias.map((row) => {
      competenciasReverse.push(row);
    });

    competenciasReverse.reverse()
    const jurosList = [];
    let jurosCompetencia;
    let dataCorrente;
    let indexComp = 0;

    for (const competencia of competenciasReverse) {

      dataCorrente = moment(competencia);

      const jurosC = (dataCorrente.isSameOrAfter(this.calculo.data_calculo_pedido, 'month')) ?
        0 : this.getJuros(dataCorrente);

      jurosCompetencia = {
        data: dataCorrente,
        juros: jurosC
      }

      jurosList.push(jurosCompetencia);
      indexComp++;

    }

    return jurosList.reverse();
  }




  getJuros(dataCorrente) {

    const dataCitacaoReu = moment(this.calculo.data_citacao_reu);
    const chkBoxTaxaSelic = this.calculo.aplicar_juros_poupanca;
    const chkJurosMora = this.calculo.previo_interesse;
    let jurosAplicado = 0.0;

    let dataMesCitacaoReu = dataCitacaoReu.startOf('month'); // dataCitacaoReu no dia 1

    if (this.isExits(this.calculo.competencia_inicio_juros)) { // Inicio dos juros
      dataMesCitacaoReu = moment(this.calculo.competencia_inicio_juros);
    }

    if (dataCorrente >= dataMesCitacaoReu) {
      if (dataCorrente < this.dataJuros2003) {
        this.jurosCorrente += this.jurosAntes2003;
      }

      if (this.dataJuros2003 <= dataCorrente && dataCorrente < this.dataJuros2009) {
        this.jurosCorrente += this.jurosDepois2003;
      }


      if (dataCorrente >= this.dataJuros2009 && !this.checkAcessoEC113(dataCorrente)) {

        if (!chkBoxTaxaSelic) {
          if (this.soma === 1) {
            this.jurosCorrente += this.jurosDepois2009;
          } else {
            this.soma = 1;
          }

        } else {

          if (dataCorrente < this.dataSelic70) {

            this.jurosCorrente += this.jurosDepois2009;

          } else {

            const moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
            this.jurosCorrente += parseFloat(moedaDataCorrente.juros_selic_70) / 100; // Carregado do BD na coluna da data corrente;

          }

        }

      }

      if (this.checkAcessoEC113(dataCorrente)) {

        this.jurosCorrente += this.getJurosConformeEC113(dataCorrente); // Carregado do BD na coluna da data corrente;

      }


      jurosAplicado = this.jurosCorrente;

    } else {
      if (!chkJurosMora) {
        if (dataCorrente !== dataMesCitacaoReu) {
          jurosAplicado = 0;
        } else {
          jurosAplicado = this.jurosCorrente;
        }
      } else {
        jurosAplicado = this.jurosCorrente;
      }
    }

    if (jurosAplicado < 0) {
      jurosAplicado = 0;
    }

    return jurosAplicado;
  }

  private checkAcessoEC113(dataCorrente) {
    return (this.calculo.cam_ec113 === 1 && dataCorrente.isSameOrAfter('2021-12-01', 'month'));
  }


  private getJurosConformeEC113(dataCorrente) {
    const moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    return parseFloat(moedaDataCorrente['cam_ec103_2021']) / 100;
  }


  calcularJurosCorrente() {
    const dataDoCalculo = moment(this.calculo.data_calculo_pedido).startOf('month');
    const dataCitacaoReu = moment(this.calculo.data_citacao_reu);
    let data = (this.dataInicioCalculo > dataCitacaoReu) ? this.dataInicioCalculo : dataCitacaoReu;

    if (this.isExits(this.calculo.competencia_inicio_juros)) { // Inicio dos juros
      data = moment(this.calculo.competencia_inicio_juros);
    }

    data = data.startOf('month');
    const chkBoxTaxaSelic = this.calculo.aplicar_juros_poupanca;
    let juros = 0.0;

    if (data < this.dataJuros2003) {
      // juros = Calcular o juros com a taxa anterior a 2003 * numero de meses (arredondado) entre data e '15/01/2003';
      juros = this.jurosAntes2003 * this.getDifferenceInMonths(data, this.dataJuros2003.clone().subtract(1, 'days'));
      // juros += calcular taxa entre 2003 e 2009 * numero de meses entre '15/01/2003' e '01/07/2009'
      juros += this.jurosDepois2003 * this.getDifferenceInMonthsRounded(this.dataJuros2009, this.dataJuros2003);
      if (!chkBoxTaxaSelic) {
        // juros += taxa apos 2009 * numero de meses entre '01/07/2009' e this.calculo.data_calculo_pedido (dataDoCalculo)
        juros += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
      } else {
        // juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
        juros += this.jurosDepois2009 * this.getDifferenceInMonthsRounded(this.dataJuros2009, this.dataSelic70.clone().subtract(1, 'days'));
        // juros += taxaTabelada de cada mes entre ('01/05/2012') e a this.calculo.data_calculo_pedido (data do calculo);
        const mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
        for (const mes of mesesEntreSelicDataCalculo) {
          const dateMes = moment(mes);
          const mesMoeda = this.Moeda.getByDate(dateMes);
          juros += parseFloat(mesMoeda.juros_selic_70) / 100;
        }
      }

    } else if (data < this.dataJuros2009) {
      // juros = calcular taxa entre 2003 e 2009 * numero de meses entre data e '01/07/2009'
      juros = this.jurosDepois2003 * this.getDifferenceInMonths(this.dataJuros2009, data);

      if (!chkBoxTaxaSelic) {
        // juros += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        juros += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
      } else {
        // juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
        juros += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);

        // juros += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
        const mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);

        for (const mes of mesesEntreSelicDataCalculo) {
          const dateMes = moment(mes);
          const mesMoeda = this.Moeda.getByDate(dateMes);
          juros += parseFloat(mesMoeda.juros_selic_70) / 100;
        }
      }
    } else {

      if (!chkBoxTaxaSelic) {
        // juros += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        juros += this.jurosDepois2009 * this.getDifferenceInMonths(data, dataDoCalculo);
      } else {
        if (data >= this.dataSelic70) {
          // juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
          juros += this.jurosDepois2009 * this.getDifferenceInMonths(data, dataDoCalculo);
        } else {
          juros += this.jurosDepois2009 * this.getDifferenceInMonths(data, this.dataSelic70);
          // juros += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo / 100;
          const mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
          for (const mes of mesesEntreSelicDataCalculo) {
            const dateMes = moment(mes);
            const mesMoeda = this.Moeda.getByDate(dateMes);
            juros += parseFloat(mesMoeda.juros_selic_70) / 100;
          }
        }
      }
    }
    return juros;
  }

  // Se????o 3.9
  getDiferencaCorrigidaJuros(dataCorrente, juros, diferencaCorrigida, resultObj) {
    // Est?? coluna ser?? definida pela soma da coluna diferen??a corrigida + o valor do Juros.
    // O sub??ndice ???(prescrita)??? deve ser adicionado quando houver prescri????o.
    // A prescri????o ?? ocorre quando a data corrente tem mais de cinco anos de diferen??a da data_acao_judicial.

    // let dataAcaoJudicial = (moment(this.calculo.data_acao_judicial)).startOf('month');
    let dataAcaoJudicial = moment(this.calculo.data_acao_judicial);
    let diferencaEmAnos = Math.abs(dataCorrente.diff(dataAcaoJudicial, 'years', true));
    let diferencaCorrigidaJuros = juros + diferencaCorrigida;

    const dataFinalPrescricao = this.dataFinalPrescricao.clone();
    let diasProporcionais = 1;
    if (dataCorrente.isSame(dataFinalPrescricao, 'month')) {
      diasProporcionais = this.calcularDiasProporcionais(dataCorrente, dataFinalPrescricao);
    }

    // N??o aplicar juros em valor negativo
    if (diferencaCorrigida < 0 && this.calculo.nao_aplicar_juros_sobre_negativo) {
      diferencaCorrigidaJuros = diferencaCorrigida;
    }

    // Se????o 3.10
    if (this.isTetos) {
      diferencaCorrigidaJuros *= this.calcularDiasProporcionais(dataCorrente, moment(this.calculo.data_pedido_beneficio_esperado));
    }

    resultObj.numeric = diferencaCorrigidaJuros;
    // let diferencaCorrigidaJurosString = this.formatMoney(diferencaCorrigidaJuros);
    let diferencaCorrigidaJurosString = this.formatMoney(diferencaCorrigidaJuros, 'R$', true);

    if (dataCorrente.isSameOrBefore(dataFinalPrescricao, 'month')
      && dataAcaoJudicial > dataCorrente
      && this.considerarPrescricao) {

      if (this.considerarPrescricao && diasProporcionais === 1) {
        diferencaCorrigidaJurosString = 'Prescrita';
        // diferencaCorrigidaJurosString = 'R$ 0,00';
      } else {
        //  diferencaCorrigidaJurosString += '<br>(prescrita)';
      }

    }

    // n??o deve prescrever per??odo posterior a data da cessa????o
    // if (diferencaEmAnos >= 5 && dataAcaoJudicial > dataCorrente && this.considerarPrescricao) {
    //   if (this.considerarPrescricao) {
    //     diferencaCorrigidaJurosString = 'prescrita';
    //   } else {
    //     diferencaCorrigidaJurosString += '<br>(prescrita)';
    //   }
    //   // diferencaCorrigidaJurosString += '<br>(prescrita)';
    // }


    return { string: diferencaCorrigidaJurosString, value: diferencaCorrigidaJuros };
  }

  // Se????o 4.2
  calcularVincendas() {

    //  const somaVincendas = this.ultimaDiferencaMensal;

    const maturidade = this.calculo.maturidade;
    let valorVincendas = 0;
    let somaVincendas = this.ultimoBeneficioDevidoAntesProporcionalidade;

    if (this.ultimoBeneficioRecebidoAntesProporcionalidade > 0) {
      somaVincendas = this.ultimaDiferencaMensal;
    }

    if (maturidade != 0) {

      valorVincendas = (Math.round(somaVincendas * 100) / 100) * 12;

    }

    return valorVincendas;
  }

  // Se????o 4.3
  calculoHonorarios(dataCorrente, juros, diferencaCorrigida, beneficioDevido) {

    if (this.calculo.taxa_advogado_aplicacao_sobre === 'nao_calc') {
      return 0;
    }

    // Calcular Honor??rios para cada linha da tabela
    let honorarios = 0.0;
    let taxaAdvogadoInicio = null;
    let taxaAdvogadoFinal = null;
    let diferecaCorrigidaJuros = (this.calculo.taxa_advogado_aplicacao_sobre !== 'dev') ? juros + diferencaCorrigida : beneficioDevido;
    // let diferecaCorrigidaJuros = juros + diferencaCorrigida ;

    if (this.calculo.taxa_advogado_inicio != '') {
      taxaAdvogadoInicio = moment(this.calculo.taxa_advogado_inicio);
    }

    if (this.calculo.taxa_advogado_aplicacao_sobre !== 'fixo'
      && this.calculo.taxa_advogado_aplicacao_sobre !== 'condenacao') {

      this.calculo.taxa_advogado_inicio = this.calculo.data_pedido_beneficio_esperado;
      taxaAdvogadoInicio = moment(this.calculo.data_pedido_beneficio_esperado);

    }

    if (this.calculo.taxa_advogado_final != '') {
      taxaAdvogadoFinal = moment(this.calculo.taxa_advogado_final);
    }

    if (this.calculo.percentual_taxa_advogado == '') {// Verificar se h?? valor para o percentual do advogado.
      honorarios = 0;
      // Aplicar a porcentagem quando a data corrente estiver no intervalo definido ou quando nenhuma data for definida
    } else if ((taxaAdvogadoInicio.isSame(dataCorrente, 'month')) ||
      (taxaAdvogadoInicio == null && taxaAdvogadoFinal == null)) {

      // inicio proporcional
      // Tempo inicio calculo
      const dataInicioCalculo = moment(this.calculo.data_pedido_beneficio, 'YYYY-MM-DD')
      let diasInicioCalculo = dataInicioCalculo.get('date');
      diasInicioCalculo = (dataInicioCalculo.daysInMonth() - diasInicioCalculo) + 1;

      // inicio tempo honorario
      let diasInicio = taxaAdvogadoInicio.get('date');
      const diasMesInicio = taxaAdvogadoInicio.daysInMonth();
      diasInicio = (diasMesInicio - diasInicio) + 1;

      // honorarios = (diferecaCorrigidaJuros * parseFloat(this.calculo.percentual_taxa_advogado)) * diasInicio / diasInicioCalculo;
      honorarios = this.roundMoeda(diferecaCorrigidaJuros * parseFloat(this.calculo.percentual_taxa_advogado));

    } else if ((dataCorrente.isSame(taxaAdvogadoFinal, 'month')) ||
      (taxaAdvogadoInicio == null && taxaAdvogadoFinal == null)) {

      const dataFimCalculo = moment(this.calculo.data_prevista_cessacao, 'YYYY-MM-DD');
      const diasFimCalculo = dataFimCalculo.get('date');

      // Fim tempo honorario
      const diasFinal = taxaAdvogadoFinal.get('date');
      const diasMesFinal = taxaAdvogadoFinal.daysInMonth();


      if (dataFimCalculo.isSame(taxaAdvogadoFinal, 'month')) {

        honorarios = ((diferecaCorrigidaJuros
          * parseFloat(this.calculo.percentual_taxa_advogado)) * diasFinal / diasFimCalculo);

      } else {

        honorarios = ((diferecaCorrigidaJuros
          * parseFloat(this.calculo.percentual_taxa_advogado)) * diasFinal / diasMesFinal);

      }

    } else if ((taxaAdvogadoInicio <= dataCorrente && dataCorrente <= taxaAdvogadoFinal) ||
      (taxaAdvogadoInicio == null && taxaAdvogadoFinal == null)) {

      // calcula o intevalo entre datas
      honorarios = diferecaCorrigidaJuros * parseFloat(this.calculo.percentual_taxa_advogado);

    } else {
      honorarios = 0;
    }

    // Somar o valor dos honor??rios de cada linha da tabela, menos da ultima linha.
    return this.roundMoeda(honorarios);
  }


  // Se????o 4.3b FIXO 
  public calcularHonorariosFixo() {

    if (this.calculo.taxa_advogado_aplicacao_sobre === 'fixo') {
      this.exibirSucumbencia = false;
      this.exibirHonorarioscpc85 = false;
      this.exibirHonorariosValorFixo = true;

      const tutelaInicio = moment(this.calculo.taxa_advogado_inicio)
      const fixoFim = moment(this.calculo.taxa_advogado_final)
      const dataInicioDosIndices = moment(this.calculo.taxa_advogado_inicio);

      // this.Indice.getByDateRange(
      //   dataInicioDosIndices.clone().startOf('month').format('YYYY-MM-DD'),
      //   fixoFim.format('YYYY-MM-DD'))
      //   .then(indices => {

      //     for (const indice of this.Indice.list) {
      //       this.indicesFixo.push(indice);
      //     }

      //     this.getCalculoHonorariosFixo();

      //   });

      this.getCalculoHonorariosFixo();

    }

  }


  // Se????o 4.3c Valor Da Causa
  public calcularHonorariosValorDaCausa() {


    if (this.calculo.taxa_advogado_aplicacao_sobre === 'condenacao') {
      this.exibirSucumbencia = false;
      this.exibirHonorarioscpc85 = false;
      this.exibirHonorariosValorFixo = false;
      this.exibirHonorariosValorDaCausa = true;

      this.getCalculoHonorariosValorDaCausa();

    }

  }


  public getCalculoHonorariosValorDaCausa() {

    this.honorariosalorDaCausa = parseFloat(this.calculo.taxa_advogado_valor_fixo);
    this.honorariosalorDaCausaString = this.formatMoney(this.honorariosalorDaCausa);

    const percentualHValorCausa = this.calculo.percentual_taxa_advogado;
    const fixoInicio = moment(this.calculo.taxa_advogado_inicio);
    //    const fixoFim = moment(this.calculo.data_calculo_pedido);
    const correcaoMonetaria = this.getCorrecaoMonetaria(fixoInicio);

    let honorariosValorDaCausa = this.honorariosalorDaCausa * percentualHValorCausa;

    this.honorariosalorDaCausaHonorario = this.formatMoney(honorariosValorDaCausa);

    if (correcaoMonetaria > 0) {
      honorariosValorDaCausa *= correcaoMonetaria;
    }

    this.somaHonorarios = this.roundMoeda(honorariosValorDaCausa);

  }



  public calcularCustosProcesso() {

    const getJurosCustos = (aplicar, data, valor) => {

      let jurosD = 0;
      let correcao = 0;
      let valorC = 0;
      let valorMaisJuros = valor;
      let valorJuros = 0;

      correcao = this.getCorrecaoMonetaria(moment(data, 'DD/MM/YYYY'))
      valorC = (valor * correcao);
      valorMaisJuros = valorC;

      if (aplicar && valor !== 0) {

        jurosD = this.getJuros(moment(data, 'DD/MM/YYYY'));
        valorJuros = (valorC * jurosD);
        valorMaisJuros += valorJuros;

      }

      return {
        valor: valor,
        valorC: valorC,
        juros: jurosD,
        valorJuros: valorJuros,
        valorMaisJuros: valorMaisJuros
      };

    };


    let soma = 0;
    let somaJuros = 0;
    let somaMaisJuros = 0;
    let valorSubTotal = 0;
    let valorMaisJurosD = {
      valor: 0,
      valorC: 0,
      juros: 0,
      valorJuros: 0,
      valorMaisJuros: 0
    };

    if (this.listAcrescimosDeducoes.length > 0) {

      for (const rowDeducoes of this.listAcrescimosDeducoes) {

        valorMaisJurosD = getJurosCustos(rowDeducoes.aplicarJuros, rowDeducoes.data, rowDeducoes.valor);

        rowDeducoes.rstValores = this.roundMoeda(valorMaisJurosD);
        rowDeducoes.valorC = this.roundMoeda(valorMaisJurosD.valorC);
        rowDeducoes.valorJuros = this.roundMoeda(valorMaisJurosD.valorJuros);
        rowDeducoes.valorMaisJuros = this.roundMoeda(valorMaisJurosD.valorMaisJuros);

        soma += this.roundMoeda(rowDeducoes.valorC);
        somaJuros += this.roundMoeda(rowDeducoes.valorJuros);
        somaMaisJuros += this.roundMoeda(valorMaisJurosD.valorMaisJuros);

      }

      valorSubTotal = this.roundMoeda((this.somaTotalSegurado) + this.roundMoeda(somaMaisJuros))

    }

    this.somaAcrescimosDeducoes = {
      valor: this.formatMoney(soma),
      valorJuros: this.formatMoney(somaJuros),
      valorMaisJuros: this.formatMoney(somaMaisJuros),
      valorMaisJurosN: this.roundMoeda(somaMaisJuros),
      valorSubTotalN: valorSubTotal,
      valorSubTotal: this.formatMoney(valorSubTotal)
    };

  }

  public getCalculoHonorariosFixo() {

    this.somaHonorariosValorFixo = parseFloat(this.calculo.taxa_advogado_valor_fixo);
    this.somaHonorariosFixoString = this.formatMoney(this.somaHonorariosValorFixo);


    const fixoInicio = moment(this.calculo.taxa_advogado_inicio)
    const fixoFim = moment(this.calculo.taxa_advogado_final)
    const competenciasFixo = this.monthsBetween(fixoInicio, fixoFim);

    // let beneficioFixoComIndice = this.somaHonorariosValorFixo;
    // let moedaDataFixoCorrente;
    // let indiceReajusteValoresFixo = { reajuste: 0.0, reajusteOs: 0.0 };
    const correcaoMonetaria = this.getCorrecaoMonetaria(fixoInicio);
    let somaHonorariosFixo = this.somaHonorariosValorFixo;
    if (correcaoMonetaria > 0) {
      somaHonorariosFixo *= correcaoMonetaria;
    }

    // for (const dataCorrenteFixoString of competenciasFixo) {
    //   let lineFixo: any = {};

    //   const dataFixoCorrente = moment(dataCorrenteFixoString);

    //   moedaDataFixoCorrente = this.Moeda.getByDate(dataFixoCorrente);
    //   const stringCompetencia = (dataFixoCorrente.month() + 1) + '/' + dataFixoCorrente.year();

    //   indiceReajusteValoresFixo = this.getIndiceReajusteValoresHonorario(dataFixoCorrente, fixoFim.clone(), 'fixo');

    //   const correcaoMonetaria = this.getCorrecaoMonetariaHonorarios(dataFixoCorrente, fixoFim.clone());

    //   // inicio proprorcional
    //   if (dataFixoCorrente.isSame(fixoInicio, 'month')) {
    //     const diasProporcionaisFixo = this.calcularDiasProporcionais(dataFixoCorrente,
    //       fixoFim.clone());
    //     beneficioFixoComIndice = beneficioFixoComIndice * diasProporcionaisFixo;
    //   }

    //   // Fim proporcional
    //   if (dataFixoCorrente.isSame(fixoFim, 'month')) {
    //     const diasProporcionaisFixo = this.calcularDiasProporcionais(dataFixoCorrente,
    //       fixoFim.clone());
    //     beneficioFixoComIndice = beneficioFixoComIndice * diasProporcionaisFixo;
    //   }


    //   beneficioFixoComIndice *= indiceReajusteValoresFixo.reajuste;

    //   const ganhoEconomicoCorrigido = beneficioFixoComIndice * correcaoMonetaria;
    //   const honorariosFixo = ganhoEconomicoCorrigido * this.calculo.percentual_taxa_advogado;

    //   somaHonorariosFixo += honorariosFixo;

    //   lineFixo = {
    //     competencia: stringCompetencia,
    //     indice_fixo: this.formatIndicesReajustes(indiceReajusteValoresFixo, dataFixoCorrente, 'Devido'),
    //     ganho_economico: this.formatMoney(beneficioFixoComIndice, moedaDataFixoCorrente.sigla),
    //     correcao_monetaria: correcaoMonetaria,
    //     ganho_economico_corrigido: this.formatMoney(ganhoEconomicoCorrigido, moedaDataFixoCorrente.sigla),
    //     honorarios_sucumbencia: this.formatMoney(honorariosFixo, moedaDataFixoCorrente.sigla),
    //   };

    //   this.resultadosFixoAntecipadaList.push(lineFixo);

    //   // abono Fixo

    //   if (dataFixoCorrente.month() == 11) {

    //     let beneficioFixoAbono = beneficioFixoComIndice;
    //     let honorariosFixoAbono = honorariosFixo;
    //     let ganhoEconomicoCorrigidoAbono = ganhoEconomicoCorrigido;
    //     const abonoProporcionalFixo = this.verificaAbonoProporcionalTutela(fixoInicio.clone());

    //     // abono proporcional
    //     if (dataFixoCorrente.isSame(fixoInicio, 'year') && abonoProporcionalFixo < 1) {

    //       beneficioFixoAbono *= abonoProporcionalFixo;
    //       ganhoEconomicoCorrigidoAbono *= abonoProporcionalFixo;
    //       honorariosFixoAbono = ganhoEconomicoCorrigidoAbono * this.calculo.percentual_taxa_advogado;
    //     }

    //     this.resultadosFixoAntecipadaList.push(
    //       {
    //         competencia: '<strong>' + stringCompetencia + ' - abono <strong>',
    //         indice_fixo: this.formatIndicesReajustes(indiceReajusteValoresFixo, dataFixoCorrente, 'Devido'),
    //         ganho_economico: this.formatMoney(beneficioFixoAbono, moedaDataFixoCorrente.sigla),
    //         correcao_monetaria: correcaoMonetaria,
    //         ganho_economico_corrigido: this.formatMoney(ganhoEconomicoCorrigidoAbono, moedaDataFixoCorrente.sigla),
    //         honorarios_sucumbencia: this.formatMoney(honorariosFixoAbono, moedaDataFixoCorrente.sigla),
    //       }
    //     );

    //     somaHonorariosFixo += honorariosFixoAbono;

    //   }
    // }


    this.somaHonorarios = this.roundMoeda(somaHonorariosFixo);

  }



  // Se????o 4.3b CPC art85
  public calcularHonorariosCPC85() {

    // this.calculo.taxa_advogado_aplicar_CPCArt85
    if (this.calculo.taxa_advogado_aplicacao_sobre === 'CPC85') {
      this.exibirSucumbencia = false;
      this.exibirHonorarioscpc85 = true;
      this.getCalculoHonorariosCPC85();
    }

  }

  public getCalculoHonorariosCPC85() {

    const moedaAtualCPC = this.Moeda.getByDate(moment(this.calculo.data_calculo_pedido));
    const salariosMinimos200 = this.roundMoeda(moedaAtualCPC.salario_minimo * 200);
    const salariosMinimos2000 = this.roundMoeda(moedaAtualCPC.salario_minimo * 2000);
    const salariosMinimos20000 = this.roundMoeda(moedaAtualCPC.salario_minimo * 20000);
    const salariosMinimos100000 = this.roundMoeda(moedaAtualCPC.salario_minimo * 100000);

    const parametrosoHonorariosCPC85 = [
      {
        label: 'at?? 200 sal??rios m??nimos', faixa: 'taxa_advogado_perc_ate_200_SM',
        valorMin: salariosMinimos200, valorMax: salariosMinimos200,
        percentual: 0,
        resultado: 0,
        resultadoString: '',
        status: false,
        moeda: moedaAtualCPC.sigla
      },
      {
        label: '200 a 2000 sal??rios m??nimos', faixa: 'taxa_advogado_perc_200_2000_SM',
        valorMin: salariosMinimos200, valorMax: salariosMinimos2000,
        percentual: 0,
        resultado: 0,
        resultadoString: '',
        status: false,
        moeda: moedaAtualCPC.sigla
      },
      {
        label: '2000 a 20000 sal??rios m??nimos', faixa: 'taxa_advogado_perc_2000_20000_SM',
        valorMin: salariosMinimos2000, valorMax: salariosMinimos20000,
        percentual: 0,
        resultado: 0,
        resultadoString: '',
        status: false,
        moeda: moedaAtualCPC.sigla
      },
      {
        label: '20000 a 100000 sal??rios m??nimos', faixa: 'taxa_advogado_perc_20000_100000_SM',
        valorMin: salariosMinimos20000, valorMax: salariosMinimos100000,
        percentual: 0,
        resultado: 0,
        resultadoString: '',
        status: false,
        moeda: moedaAtualCPC.sigla
      },
      {
        label: 'acima 100000 sal??rios m??nimos', faixa: 'taxa_advogado_perc_100000_SM',
        valorMin: salariosMinimos100000, valorMax: salariosMinimos100000,
        percentual: 0,
        resultado: 0,
        resultadoString: '',
        status: false,
        moeda: moedaAtualCPC.sigla
      }
    ];

    const valorBaseestatico = 0;
    let valorBaseParaCalculoAuxiliar = 0;

    if (this.calculo.taxa_advogado_aplicar_CPCArt85) {

      valorBaseParaCalculoAuxiliar = this.roundMoeda(this.somaDevidosreajustadosAtefinalHonorario);

    } else {

      valorBaseParaCalculoAuxiliar = this.roundMoeda(this.somaDiferencaReajustadosAtefinalHonorario);

    }

    let faixaDeprecentual = '';
    let continuaRegras = true;

    this.somaHonorarioscpc85 = 0;

    for (const linhaCPC85 of parametrosoHonorariosCPC85) {

      if (continuaRegras) {

        linhaCPC85.status = true;
        linhaCPC85.percentual = this.calculo[linhaCPC85.faixa];

        if (valorBaseParaCalculoAuxiliar > linhaCPC85.valorMax) {

          linhaCPC85.resultado = linhaCPC85.valorMax * (linhaCPC85.percentual / 100);
          continuaRegras = true;
          valorBaseParaCalculoAuxiliar -= linhaCPC85.valorMax;

        } else {

          linhaCPC85.resultado = valorBaseParaCalculoAuxiliar * (linhaCPC85.percentual / 100);
          continuaRegras = false;

        }

        linhaCPC85.resultadoString = this.formatMoney(linhaCPC85.resultado, moedaAtualCPC.sigla);
        this.faixaSalminimoHonorarioscpc85List.push(linhaCPC85);
        this.somaHonorarioscpc85 += this.roundMoeda(linhaCPC85.resultado);
      }

    }

    this.dataSalMinHonorarioscpc85 = moment(this.calculo.data_calculo_pedido).format('MM/YYYY');
    this.somaHonorarioscpc85String = this.formatMoney(this.somaHonorarioscpc85, moedaAtualCPC.sigla);
    this.salarioMinimoHonorarioscpc85String = this.formatMoney(parseFloat(moedaAtualCPC.salario_minimo), moedaAtualCPC.sigla);

    this.somaHonorarios = this.somaHonorarioscpc85;

  }


  // Se????o 4.3b sucumbencia / Tutela antecipada

  public getCorrecaoMonetariaHonorarios(dataCorrente, dataFimCalculo) {
    const tipo_correcao = this.calculo.tipo_correcao;
    const moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    const moedaDataAtual = this.Moeda.getByDate(moment());
    const moedaDataCalculo = this.Moeda.getByDate(dataFimCalculo.clone());

    let desindexador = 0.0;
    let correcaoMonetaria = 0.0;

    // adi????o de novas tabelas 
    desindexador = moedaDataAtual[tipo_correcao] / moedaDataCalculo[tipo_correcao];
    correcaoMonetaria = moedaDataCorrente[tipo_correcao] * desindexador;

    return correcaoMonetaria;
  }


  private getByDateToTypeHonorario(date, type) {

    let listTypeT = this.indicesTutela;
    if (type === 'fixo') {
      listTypeT = this.indicesFixo;
      return 1;
    }

    const firstMonth = listTypeT[0].data_moeda;

    date = date.startOf('month');
    let difference = date.diff(firstMonth, 'months', true);
    difference = Math.abs(difference);
    difference = Math.floor(difference);
    return listTypeT[difference];
  }



  public getIndiceReajusteValoresHonorario(dataCorrente, dataFimCalculo, type) {

    if (dataFimCalculo != null && dataCorrente > dataFimCalculo) {
      return { reajuste: 1.0, reajusteOs: 0.0 };
    }

    let reajuste = 0.0;
    // let indiceObjCorrente = this.Indice.getByDate(dataCorrente);
    let indiceObjCorrente = this.getByDateToTypeHonorario(dataCorrente, type);


    let indiceReajuste = 0;
    let indiceReajusteOs = 0;


    if (indiceObjCorrente == undefined) {
      reajuste = 0;
    } else {
      indiceReajuste = indiceObjCorrente.indice == null ? 1 : indiceObjCorrente.indice;
      indiceReajusteOs = indiceObjCorrente.indice_os == null ? 1 : indiceObjCorrente.indice_os;

      reajuste = indiceReajuste;

    }

    // chkIndice ?? o checkbox ???calcular aplicando os ??ndices de 2,28% em 06/1999 e 1,75% em 05/2004???
    let chkIndice = this.calculo.usar_indice_99_04;
    if (chkIndice) {
      if (dataCorrente.isSame(moment('1999-06-01'), 'month')) {
        reajuste = reajuste * 1.0228;
      }
      if (dataCorrente.isSame(moment('2004-05-01'), 'month')) {
        reajuste = reajuste * 1.0175;
      }
    }


    if (dataCorrente <= this.dataSimplificada &&
      moment(this.calculo.data_pedido_beneficio_esperado) < this.dataInicioBuracoNegro) {
      reajuste = 1;
    }
    else if (moment(this.calculo.data_pedido_beneficio_esperado) <= this.dataInicioBuracoNegro &&
      dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado)) {
      reajuste = 2.198234;

    }

    if (this.primeiroReajusteDevidos == -1 && reajuste != 1) {
      this.primeiroReajusteDevidos = 1;
    }

    if (dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado) &&
      moment(this.calculo.data_pedido_beneficio_esperado) == this.dataInicioCalculo) {
      reajuste = 1;
    }
    if (dataCorrente.isSame('1994-03-01', 'month')) {
      reajuste = 1 / 661.0052;
      if (dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado)) {
        reajuste = 1;
      }
    }

    let reajusteOS = 0.0;
    // let dataPedidoBeneficioEsperado = moment(this.calculo.data_pedido_beneficio_esperado);
    // if (this.isBuracoNegro(dataPedidoBeneficioEsperado) && dataCorrente < this.dataEfeitoFinanceiro) {
    //   if (dataCorrente < moment('1991-09-01')) {
    //     if (indiceObjCorrente == undefined) {
    //       reajusteOS = 0;
    //     } else {
    //       reajusteOS = indiceReajusteOs;
    //     }
    //   }
    //   else if (indiceObjCorrente.indice) {
    //     if (indiceObjCorrente == undefined) {
    //       reajusteOS = 0;
    //     } else {
    //       reajusteOS = indiceReajuste;
    //     }
    //   }
    //   else {
    //     reajusteOS = 1;
    //   }
    // }
    // if (reajusteOS == 0) {
    //   reajusteOS = 1;
    // }
    return { reajuste: reajuste, reajusteOs: reajusteOS };
  }



  verificaAbonoProporcionalTutela(dib) {
    let dibMonth = dib.month() + 1;

    if (dib.date() < 15) {
      dibMonth -= 1;
    }

    let proporcional = 1 - dibMonth / 12;


    return proporcional;
  }


  public getTabelaAntecipada() {

    // this.dataInicialTutelaAntecipada = moment(this.calculo.taxa_advogado_inicio_sucumbencia).format('DD/MM/YYYY');
    // this.dataFinalTutelaAntecipada = moment(this.calculo.taxa_advogado_final_sucumbencia).format('DD/MM/YYYY');

    // const tutelaInicio = moment(this.calculo.taxa_advogado_inicio_sucumbencia)
    // const tutelaFim = moment(this.calculo.taxa_advogado_final_sucumbencia)

    // this.dataInicialTutelaAntecipada = moment(this.calculo.cessacaoValoresRecebidos).format('DD/MM/YYYY');
    // this.dataFinalTutelaAntecipada = moment(this.calculo.data_calculo_pedido).format('DD/MM/YYYY');

    // const tutelaInicio = moment(this.calculo.cessacaoValoresRecebidos)
    // const tutelaFim = moment(this.calculo.data_calculo_pedido)

    // const competenciasTutela = this.monthsBetween(tutelaInicio, tutelaFim);

    // this.percentualTaxaAdvogado = this.calculo.percentual_taxa_advogado * 100;
    // let beneficioTutelaComIndice = this.ultimoBeneficioDevidoAntesProporcionalidade;
    // let moedaDataTutelaCorrente;

    // for (const dataCorrenteTutelaString of competenciasTutela) {
    //   let lineTutela: any = {};

    //   let dataTutelaCorrente = moment(dataCorrenteTutelaString);

    //   moedaDataTutelaCorrente = this.Moeda.getByDate(dataTutelaCorrente);
    //   const stringCompetencia = (dataTutelaCorrente.month() + 1) + '/' + dataTutelaCorrente.year();

    //   let indiceReajusteValoresTutela = { reajuste: 0.0, reajusteOs: 0.0 };
    //   indiceReajusteValoresTutela = this.getIndiceReajusteValoresHonorario(dataTutelaCorrente, tutelaFim.clone(), 'Tutela');

    //   const correcaoMonetaria = this.getCorrecaoMonetariaHonorarios(dataTutelaCorrente, tutelaFim.clone());

    //   // inicio proprorcional
    //   if (dataTutelaCorrente.isSame(tutelaInicio, 'month')) {
    //     const diasProporcionaisTutela = this.calcularDiasProporcionais(dataTutelaCorrente,
    //       tutelaFim.clone());
    //     beneficioTutelaComIndice = beneficioTutelaComIndice * diasProporcionaisTutela;
    //   }

    //   // Fim proporcional
    //   if (dataTutelaCorrente.isSame(tutelaFim, 'month')) {
    //     const diasProporcionaisTutela = this.calcularDiasProporcionais(dataTutelaCorrente,
    //       tutelaFim.clone());
    //     beneficioTutelaComIndice = beneficioTutelaComIndice * diasProporcionaisTutela;
    //   }


    //   beneficioTutelaComIndice *= indiceReajusteValoresTutela.reajuste;

    //   const ganhoEconomicoCorrigido = beneficioTutelaComIndice * correcaoMonetaria;
    //   const honorariosSucumbencia = ganhoEconomicoCorrigido * this.calculo.percentual_taxa_advogado;

    //   this.somaHonorariosTutelaAntecipada += honorariosSucumbencia;

    //   lineTutela = {
    //     competencia: stringCompetencia,
    //     indice_tutela: this.formatIndicesReajustes(indiceReajusteValoresTutela, dataTutelaCorrente, 'Devido'),
    //     ganho_economico: this.formatMoney(beneficioTutelaComIndice, moedaDataTutelaCorrente.sigla),
    //     correcao_monetaria: correcaoMonetaria,
    //     ganho_economico_corrigido: this.formatMoney(ganhoEconomicoCorrigido, moedaDataTutelaCorrente.sigla),
    //     honorarios_sucumbencia: this.formatMoney(honorariosSucumbencia, moedaDataTutelaCorrente.sigla),
    //   };

    //   this.resultadosTutelaAntecipadaList.push(lineTutela);

    //   // abono tutela

    //   if (dataTutelaCorrente.month() == 11) {

    //     let beneficioTutelaAbono = beneficioTutelaComIndice;
    //     let honorariosSucumbenciaAbono = honorariosSucumbencia;
    //     let ganhoEconomicoCorrigidoAbono = ganhoEconomicoCorrigido;
    //     const abonoProporcionalTutela = this.verificaAbonoProporcionalTutela(tutelaInicio.clone());

    //     // abono proporcional
    //     if (dataTutelaCorrente.isSame(tutelaInicio, 'year') && abonoProporcionalTutela < 1) {

    //       beneficioTutelaAbono *= abonoProporcionalTutela;
    //       ganhoEconomicoCorrigidoAbono *= abonoProporcionalTutela;
    //       honorariosSucumbenciaAbono = ganhoEconomicoCorrigidoAbono * this.calculo.percentual_taxa_advogado;
    //     }

    //     this.resultadosTutelaAntecipadaList.push(
    //       {
    //         competencia: '<strong>' + stringCompetencia + ' - abono <strong>',
    //         indice_tutela: this.formatIndicesReajustes(indiceReajusteValoresTutela, dataTutelaCorrente, 'Devido'),
    //         ganho_economico: this.formatMoney(beneficioTutelaAbono, moedaDataTutelaCorrente.sigla),
    //         correcao_monetaria: correcaoMonetaria,
    //         ganho_economico_corrigido: this.formatMoney(ganhoEconomicoCorrigidoAbono, moedaDataTutelaCorrente.sigla),
    //         honorarios_sucumbencia: this.formatMoney(honorariosSucumbenciaAbono, moedaDataTutelaCorrente.sigla),
    //       }
    //     );

    //     this.somaHonorariosTutelaAntecipada += honorariosSucumbenciaAbono;

    //   }

    // }
    // this.resultadosTutelaAntecipadaList.push(
    //   {
    //     competencia: '',
    //     indice_tutela: '',
    //     ganho_economico: '',
    //     correcao_monetaria: '',
    //     ganho_economico_corrigido: '<strong>Total</strong>',
    //     honorarios_sucumbencia: this.formatMoney(this.somaHonorariosTutelaAntecipada, moedaDataTutelaCorrente.sigla),
    // }
    // );

    // this.somaHonorariosTutelaAntecipadaString = this.formatMoney(this.somaHonorariosTutelaAntecipada, moedaDataTutelaCorrente.sigla);

    // this.somaTotalHonorariosString = 
    // this.formatMoney(this.somaHonorarios + this.somaHonorariosTutelaAntecipada, moedaDataTutelaCorrente.sigla);
    // this.isUpdatingTutela = false;
  }


  // public calcularTutelaAntecipada() {

  //   this.isUpdatingTutela = false;
  //   // if (this.isExits(this.calculo.taxa_advogado_inicio_sucumbencia) && this.isExits(this.calculo.taxa_advogado_final_sucumbencia)) {
  //   if (this.isExits(this.calculo.data_cessacao) && moment(this.calculo.data_cessacao).isValid()) {


  //     const tutelaInicio = moment(this.calculo.data_cessacao)
  //     const tutelaFim = moment(this.calculo.data_calculo_pedido)
  //     const dataInicioDosIndices = moment(this.calculo.data_calculo_pedido);

  //     // this.Indice.getByDateRange(
  //     //   dataInicioDosIndices.clone().startOf('month').format('YYYY-MM-DD'),
  //     //   tutelaFim.format('YYYY-MM-DD'))
  //     //   .then(indices => {

  //     //     for (const indice of this.Indice.list) {
  //     //       this.indicesTutela.push(indice);
  //     //     }

  //     //     //this.getTabelaAntecipada();

  //     //     this.isUpdatingTutela = false;
  //     //   });

  //   }

  // }


  // Se????o 4.4
  calcularAcordoJudicial() {
    // let totalDevido = this.somaDiferencaCorrigida;
    const totalDevido = this.somaDiferencaCorrigidaJuros;
    let percentualAcordo = parseFloat(this.calculo.acordo_pedido);
    // Acordo percentual m??ximo 0.9;
    if (percentualAcordo > 0.9) {
      percentualAcordo = 0.9;
    }

    this.valorAcordo = this.roundMoeda(totalDevido * percentualAcordo);
    this.descontoAcordo = this.roundMoeda(totalDevido - this.valorAcordo);
  }

  // Se????o 4.6
  calcularVincendosTetos() {
    let somaVincendosTetos = this.ultimaRenda;
    const data = moment(this.calculo.data_citacao_reu);
    const dataDoCalculo = moment(this.calculo.data_calculo_pedido);
    const maturidade = this.calculo.maturidade;
    const jurosVincendos = 0.0;

    const chkBoxTaxaSelic = this.calculo.aplicar_juros_poupanca;
    const chkboxBenefitNotGranted = this.calculo.beneficio_nao_concedido;

    // if (this.dataInicioCalculo > data) {
    //   data = this.dataInicioCalculo;
    // }

    // if (data < this.dataJuros2003) {
    //   //jurosVincendos = Calcular o juros com a taxa anterior a 2003 * numero de meses (arredondado) entre data e '15/01/2003';
    //   jurosVincendos = this.jurosAntes2003 * this.getDifferenceInMonths(data, this.dataJuros2003);
    //   //jurosVincendos += calcular taxa entre 2003 e 2009 * numero de meses entre '15/01/2003' e '01/07/2009'
    //   jurosVincendos += this.jurosDepois2003 * this.getDifferenceInMonths(this.dataJuros2003, this.dataJuros2009);
    //   if (!chkBoxTaxaSelic) {
    //     //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
    //     jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
    //   } else {
    //     //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
    //     jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);
    //     //jurosVincendos += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
    //     let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
    //     for (let mes of mesesEntreSelicDataCalculo) {
    //       let dateMes = moment(mes);
    //       jurosVincendos += parseFloat(this.Moeda.getByDate(dateMes).juros_selic_70);
    //     }
    //   }
    // } else if (data < this.dataJuros2009) {
    //   //jurosVincendos = calcular taxa entre 2003 e 2009 * numero de meses entre data e '01/07/2009'
    //   jurosVincendos = this.jurosDepois2003 * this.getDifferenceInMonths(data, this.dataJuros2009);
    //   if (!chkBoxTaxaSelic) {
    //     //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
    //     jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
    //   } else {
    //     //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
    //     jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);
    //     //jurosVincendos += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
    //     let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
    //     for (let mes of mesesEntreSelicDataCalculo) {
    //       let dateMes = moment(mes);
    //       jurosVincendos += parseFloat(this.Moeda.getByDate(dateMes).juros_selic_70);
    //     }
    //   }
    // } else {
    //   if (!chkBoxTaxaSelic) {
    //     //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
    //     jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
    //   } else {
    //     //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
    //     jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);
    //     //jurosVincendos += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo / 100;
    //     let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
    //     for (let mes of mesesEntreSelicDataCalculo) {
    //       let dateMes = moment(mes);
    //       jurosVincendos += parseFloat(this.Moeda.getByDate(dateMes).juros_selic_70) / 100;
    //     }
    //   }
    // }
    // if (chkboxBenefitNotGranted) {
    //   somaVincendosTetos = (somaVincendosTetos * this.ultimaCorrecaoMonetaria) + (jurosVincendos * somaVincendosTetos);
    // }

    if (maturidade != 0) {
      somaVincendosTetos = parseFloat(somaVincendosTetos.toFixed(2)) * maturidade;
    } else {
      somaVincendosTetos = 0;
    }

    return somaVincendosTetos;
  }


  private checkParcelaRecuperacao(type: string, recebidoRow) {

    if (type === 'd') {
      return (typeof this.listDevidos[0].parcRecEsperado !== 'undefined'
        && typeof this.listDevidos[0].dataParcRecEsperado !== 'undefined'
        && (this.listDevidos[0].especie === '1'
          || this.listDevidos[0].especie === '19')
        && this.listDevidos[0].parcRecEsperado);
    }

    if (type === 'r') {
      return (this.isExits(recebidoRow) &&
        typeof recebidoRow.parcRecConcedido !== 'undefined'
        && typeof recebidoRow.dataParcRecConcedido !== 'undefined'
        && (recebidoRow.especie === '1' || recebidoRow.especie === '19')
        && recebidoRow.parcRecConcedido);
    }

  }


  private setAdicionalParcelaRecuperacao(type, recebidoRow) {

    const dateSub18Meses = (oldDate) => {
      return moment(moment(oldDate, 'DD/MM/YYYY').startOf('d').add(-17, 'months').format('YYYY-MM-DD'));
    };

    if (type === 'd' && this.checkParcelaRecuperacao('d', {})) {

      this.parcelaRecuperacaoDataDevidoStatus = true;

      this.parcelaRecuperacaoDataDevido = dateSub18Meses(this.listDevidos[0].dataParcRecEsperado);

      if (moment(this.parcelaRecuperacaoDataDevido).isAfter(moment())) {
        this.parcelaRecuperacaoDataDevido = moment();
      }

      this.setDataFinalParcelaRecuperacao();

    }

    if (type === 'r' && this.checkParcelaRecuperacao('r', recebidoRow)) {

      let dataParcRecConcedido = dateSub18Meses(recebidoRow.dataParcRecConcedido);

      if (moment(dataParcRecConcedido).isAfter(moment())) {
        dataParcRecConcedido = moment();
      }

      return this.setDataFinalParcelaRecuperacaoRecebido(dataParcRecConcedido, recebidoRow);

    }

  }


  private setDataFinalParcelaRecuperacaoRecebido(dataParcRecConcedido, recebidoRow) {

    const parcelaRecuperacaoDataRecebido = moment(recebidoRow.dataParcRecConcedido, 'DD/MM/YYYY');

    return this.setListParcelasRecuperacao(
      dataParcRecConcedido,
      parcelaRecuperacaoDataRecebido);

  }

  private setDataFinalParcelaRecuperacao() {

    this.dataParcelaRecuperacaoDevido = moment(this.listDevidos[0].dataParcRecEsperado, 'DD/MM/YYYY');

    this.listRedutorDevido = this.setListParcelasRecuperacao(
      this.parcelaRecuperacaoDataDevido,
      this.dataParcelaRecuperacaoDevido);

  }

  private setListParcelasRecuperacao(datainicial, dataFinal) {

    const listNewParcelas = [];
    const modeloRedutor = [1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25];
    const listCompetenciasRedutor = this.monthsBetween(datainicial, dataFinal);

    for (let i = 0; i < listCompetenciasRedutor.length; i++) {

      listNewParcelas.push({
        cp: listCompetenciasRedutor[i],
        redutor: modeloRedutor[i]
      })

    }

    return listNewParcelas;
  }

  private aplicarRedutorParcelasRecuperacao(valor, dataCorrente, type: string, rowRecebido = {}) {

    if (!this.checkParcelaRecuperacao(type, rowRecebido)) {
      return valor;
    }

    const list = (type === 'd') ? this.listRedutorDevido : this.listRedutorrecebido;
    const redutorAtual = list.find((x) => dataCorrente.isSame(x.cp));

    if (typeof redutorAtual !== 'undefined') {
      return this.roundMoeda(valor * redutorAtual.redutor);
    }

    return this.roundMoeda(valor);
  }




  // Se????o 1
  setInicioRecebidosEDevidos() {

    this.stringTabelaCorrecaoMonetaria = this.getStringTabelaCorrecaoMonetaria();

    // verificar se existe recebido
    this.calculo.beneficio_nao_concedido = (this.listRecebidos.length == 0 &&
      (this.calculo.data_pedido_beneficio == null || this.calculo.valor_beneficio_concedido <= 0));


    this.dataInicioRecebidos = moment(this.calculo.data_pedido_beneficio);
    if (this.isExits(this.recebidosListInicio)
      && this.recebidosListInicio <= this.dataInicioRecebidos) {
      this.dataInicioRecebidos = this.recebidosListInicio;
    }

    this.dataInicioDevidos = moment(this.calculo.data_pedido_beneficio_esperado);

    if (!this.calculo.dip_valores_devidos) {
      this.calculo.dip_valores_devidos = this.calculo.data_pedido_beneficio_esperado;
    }

    this.dataInicioDevidosDip = moment(this.calculo.dip_valores_devidos);

    this.primeiraDataArrayMoeda = (this.dataInicioDevidos < this.dataInicioRecebidos) ? this.dataInicioDevidos : this.dataInicioRecebidos;
    // this.primeiraDataArrayMoeda = this.dataInicioDevidos;

    // this.dataFinal = (moment(this.calculo.data_calculo_pedido)).add(1, 'month');
    this.dataFinal = (moment(this.calculo.data_calculo_pedido));
    this.dataFinalAtual = moment();

    if (this.dataFinal.isBefore(this.calculo.data_prevista_cessacao)) {
      this.dataFinal = moment(this.calculo.data_prevista_cessacao);
    }


    // Prescri????o
    if (this.calculo.afastar_prescricao) {
      this.considerarPrescricao = false;
    } else {
      this.considerarPrescricao = true;
    }

    // if (this.route.snapshot.queryParams['considerarPrescricao'] == 'false') {
    //   this.considerarPrescricao = false;
    // }

    // if (sessionStorage.considerarPrescricao === 'false') {
    //   this.considerarPrescricao = false;
    // } else {
    //   this.considerarPrescricao = true;
    // }

    // console.log(this.calculo.data_anterior_pedido_beneficio);
    // console.log(this.calculo.previa_data_pedido_beneficio_esperado);


    // if (this.calculo.data_anterior_pedido_beneficio != '0000-00-00') {
    //   this.dibAnteriorRecebidos = moment(this.calculo.data_anterior_pedido_beneficio);  //recebidos
    //   this.primeiraDataArrayMoeda = (this.primeiraDataArrayMoeda < this.dibAnteriorRecebidos) ? 
    // this.primeiraDataArrayMoeda : this.dibAnteriorRecebidos;
    // }

    if (this.calculo.previa_data_pedido_beneficio_esperado != '0000-00-00') {

      this.dibAnteriorDevidos = moment(this.calculo.previa_data_pedido_beneficio_esperado); // devidos
      this.primeiraDataArrayMoeda = (this.primeiraDataArrayMoeda < this.dibAnteriorDevidos) ?
        this.primeiraDataArrayMoeda : this.dibAnteriorDevidos;

    }

    this.beneficioDevidoAposRevisao = (this.calculo.valor_beneficio_esperado_revisao) ?
      this.calculo.valor_beneficio_esperado_revisao : 0;

    this.beneficioRecebidoAposRevisao = (this.calculo.valor_beneficio_concedido_revisao) ?
      this.calculo.valor_beneficio_concedido_revisao : 0;

    this.beneficioDevidoAposRevisaoTetos = (this.calculo.valor_beneficio_esperado_revisao) ?
      this.calculo.valor_beneficio_esperado_revisao : 0;

    this.beneficioRecebidoAposRevisaoTetos = (this.calculo.valor_beneficio_concedido_revisao) ?
      this.calculo.valor_beneficio_concedido_revisao : 0;

    this.beneficioDevidoTetosSemLimite = parseFloat(this.calculo.valor_beneficio_esperado);

    if (this.dataInicioRecebidos < this.dataInicioBuracoNegro) {
      this.dataInicioRecebidos = this.dataEquivalenciaMinimo89;
    }

    if (this.dataInicioDevidos < this.dataInicioBuracoNegro) {
      this.dataInicioDevidos = this.dataEquivalenciaMinimo89;
    }
    // dataInicioCalculo ?? o menor valor entre dataInicioDevidos e dataInicioRecebidos
    this.dataInicioCalculo = (this.dataInicioDevidos < this.dataInicioRecebidos) ? this.dataInicioDevidos : this.dataInicioRecebidos;
    // dataFinal ?? a data_calculo_pedido acrescido de um m??s

    if (this.calculo.data_prevista_cessacao != '0000-00-00') {
      this.dataCessacaoDevido = moment(this.calculo.data_prevista_cessacao);
    }
    if (this.calculo.data_cessacao != '0000-00-00' && this.listRecebidos.length == 0) {
      this.dataCessacaoRecebido = moment(this.calculo.data_cessacao);
    }

    this.setAdicionalParcelaRecuperacao('d', null);


    this.jurosAntes2003 = this.calculo.previo_interesse_2003 / 100;
    this.jurosDepois2003 = this.calculo.pos_interesse_2003 / 100;
    this.jurosDepois2009 = this.calculo.pos_interesse_2009 / 100;
  }


  // Verifica se uma data esta no periodo do buraco negro
  isBuracoNegro(date) {
    if (date >= this.dataInicioBuracoNegro && date <= this.dataFimBuracoNegro) {
      this.isBuracoNegroLeg = true;
      return true;
    }
    return false;
  }

  // Retorna uma lista com os meses em formato string YYYY-MM-DD  entre dateStart e dateEnd
  monthsBetween(dateStart, dateEnd) {
    const startClone = dateStart.clone();
    const timeValues = [];
    while (dateEnd > startClone || startClone.format('M') === dateEnd.format('M')) {
      timeValues.push(startClone.startOf('month').format('YYYY-MM-DD'));
      startClone.add(1, 'month');
    }
    return timeValues;
  }

  // Se????o 5.1
  calcularDiasProporcionais(dataCorrente, dib) {

    // compara????o de m??s e ano
    if (dataCorrente.isSame(dib, 'month')) {
      // dib.date() ?? o dia do m??s da dib

      let diffDateMes = (31 - dib.date());

      diffDateMes = (diffDateMes <= 0) ? 1 : diffDateMes;

      return diffDateMes / 30;
    }

    return 1;
  }

  // corre????o inicial do valor devido
  // public aplicarTetosEMinimosDIB(valorBeneficio, dib) {
  //   const dataCorrenteMoedaDib = this.Moeda.getByDate(dib);
  //   const salMinimoDib = dataCorrenteMoedaDib.salario_minimo;
  //   const tetoSalarialDib = dataCorrenteMoedaDib.teto;



  //   if (valorBeneficio <= salMinimoDib && !this.calculo.nao_aplicar_sm_beneficio_esperado) {
  //     // Adicionar subindice ???M??? no valor do beneficio
  //     // console.log((!this.calculo.nao_aplicar_sm_beneficio_esperado))
  //     this.isMinimoInicialDevido = true;
  //     return salMinimoDib;
  //   }
  //   if (valorBeneficio >= tetoSalarialDib && !this.calculo.nao_aplicar_ajuste_maximo_98_2003) {
  //     // Adicionar subindice ???T??? no valor do beneficio.
  //     return tetoSalarialDib;
  //   }
  //   return valorBeneficio;
  // }


  private aplicarPercentualSM(tipoAposentadoria, salMinimo) {

    if (['6', '8', '9', '10'].includes(tipoAposentadoria.toString())) {

      if (tipoAposentadoria.toString() === '8') { // ???Auxilio Acidente - 30%???
        salMinimo *= 0.3;
      } else if (tipoAposentadoria.toString() === '9') {// ???Auxilio Acidente - 40%???
        salMinimo *= 0.4;
      } else if (tipoAposentadoria.toString() === '6') { // ???Auxilio Acidente Previdenciario- 50%???
        salMinimo *= 0.5;
      } else if (tipoAposentadoria.toString() === '10') {// ???Auxilio Acidente - 60%???
        salMinimo *= 0.6;
      }

    }

    return salMinimo;
  }



  // Se????o 5.3
  aplicarTetosEMinimos(valorBeneficio, dataCorrente, dib, tipo, recebidoRowid = null) {

    const dataCorrenteMoeda = this.Moeda.getByDate(dataCorrente);
    let salMinimo = parseFloat(dataCorrenteMoeda.salario_minimo);
    const tetoSalarial = parseFloat(dataCorrenteMoeda.teto);
    let tipoAposentadoria = '';
    let naoAplicarMinimo = false;
    let manterProporcaoAplicarMinimo = false;

    if (tipo === 'Recebido') {

      tipoAposentadoria = this.calculo.tipo_aposentadoria_recebida;
      naoAplicarMinimo = this.calculo.nao_aplicar_sm_beneficio_concedido;
      manterProporcaoAplicarMinimo = (this.isExits(this.calculo.manterPercentualSMConcedido)
        && this.calculo.manterPercentualSMConcedido) ? true : false;

    } else {

      tipoAposentadoria = this.calculo.tipo_aposentadoria;
      naoAplicarMinimo = this.calculo.nao_aplicar_sm_beneficio_esperado;
      manterProporcaoAplicarMinimo = (this.isExits(this.listDevidos[0].manterPercentualSMEsperado)
        && this.listDevidos[0].manterPercentualSMEsperado) ? true : false;

    }



    if (!naoAplicarMinimo && tipoAposentadoria !== '2021') {

      salMinimo = this.aplicarPercentualSM(tipoAposentadoria, salMinimo);

      if (valorBeneficio <= salMinimo ||
        (this.isMinimoInicialDevido && tipo === 'Devido')
        || (this.isMinimoInicialRecebido && tipo === 'Recebido')) {
        // Adicionar subindice ???M??? no valor do beneficio
        return this.roundMoeda(salMinimo);
      }

    }
    if (manterProporcaoAplicarMinimo) {

      salMinimo = this.aplicarPercentualSM(tipoAposentadoria, salMinimo);

      return this.roundMoeda(salMinimo);
    }

    if ((valorBeneficio >= tetoSalarial)
      || (valorBeneficio >= tetoSalarial) && tipo === 'Recebido'
    ) {
      // Adicionar subindice ???T??? no valor do beneficio.
      return this.roundMoeda(tetoSalarial);
    }


    return this.roundMoeda(valorBeneficio);
  }

  // Se????o 5.4
  aplicarTetosEMinimosTetos(valorBeneficio, dataCorrente, dib, tipo, tetoSalarial) {

    // if ((tipo === 'Devido' || tipo === 'Recebido') && valorBeneficio <= 0) {
    //   return valorBeneficio;
    // }

    const dataCorrenteMoeda = this.Moeda.getByDate(dataCorrente);
    let salMinimo = dataCorrenteMoeda.salario_minimo;
    let tipoAposentadoria = '';
    let naoAplicarMinimo = false;
    let manterProporcaoAplicarMinimo = false;

    if (tipo == 'Recebido') {

      tipoAposentadoria = this.calculo.tipo_aposentadoria_recebida;
      naoAplicarMinimo = this.calculo.nao_aplicar_sm_beneficio_concedido;
      manterProporcaoAplicarMinimo = (this.isExits(this.calculo.manterPercentualSMConcedido)
        && this.calculo.manterPercentualSMConcedido) ? true : false;

    } else {

      tipoAposentadoria = this.calculo.tipo_aposentadoria;
      naoAplicarMinimo = this.calculo.nao_aplicar_sm_beneficio_esperado;
      manterProporcaoAplicarMinimo = (this.isExits(this.listDevidos[0].manterPercentualSMEsperado)
        && this.listDevidos[0].manterPercentualSMEsperado) ? true : false;

    }

    if (!naoAplicarMinimo) {

      salMinimo = this.aplicarPercentualSM(tipoAposentadoria, salMinimo);

      if (valorBeneficio <= salMinimo ||
        (this.isMinimoInicialDevido && tipo === 'Devido')
        || (this.isMinimoInicialRecebido && tipo === 'Recebido')) {
        // Adicionar subindice ???M??? no valor do beneficio
        return this.roundMoeda(salMinimo);
      }

    }

    if (manterProporcaoAplicarMinimo) {

      salMinimo = this.aplicarPercentualSM(tipoAposentadoria, salMinimo);

      return this.roundMoeda(salMinimo);
    }

    // removido && dib >= this.dataInicioBuracoNegro  removido 28/07/2020 - DR. Sergio
    if (valorBeneficio >= tetoSalarial && !this.calculo.nao_aplicar_ajuste_maximo_98_2003) {
      // Adicionar subindice ???T??? no valor do beneficio.
      return this.roundMoeda(tetoSalarial);
    }

    return this.roundMoeda(valorBeneficio);
  }

  private aplicarMinimos(valorBeneficio, dataCorrente, dib, tipo) {

    const dataCorrenteMoeda = this.Moeda.getByDate(dataCorrente);
    let salMinimo = dataCorrenteMoeda.salario_minimo;
    let tipoAposentadoria = '';
    let naoAplicarMinimo = false;
    let manterProporcaoAplicarMinimo = false;

    if (tipo === 'Recebido') {

      tipoAposentadoria = this.calculo.tipo_aposentadoria_recebida;
      naoAplicarMinimo = this.calculo.nao_aplicar_sm_beneficio_concedido;
      manterProporcaoAplicarMinimo = (this.isExits(this.calculo.manterPercentualSMConcedido)
        && this.calculo.manterPercentualSMConcedido) ? true : false;

    } else {

      tipoAposentadoria = this.calculo.tipo_aposentadoria;
      naoAplicarMinimo = this.calculo.nao_aplicar_sm_beneficio_esperado;
      manterProporcaoAplicarMinimo = (this.isExits(this.listDevidos[0].manterPercentualSMEsperado)
        && this.listDevidos[0].manterPercentualSMEsperado) ? true : false;

    }


    if (!naoAplicarMinimo) {

      salMinimo = this.aplicarPercentualSM(tipoAposentadoria, salMinimo);

      if (valorBeneficio <= salMinimo ||
        (this.isMinimoInicialDevido && tipo === 'Devido')
        || (this.isMinimoInicialRecebido && tipo === 'Recebido')) {
        // Adicionar subindice ???M??? no valor do beneficio
        return this.roundMoeda(salMinimo);
      }

    }


    if (manterProporcaoAplicarMinimo) {

      salMinimo = this.aplicarPercentualSM(tipoAposentadoria, salMinimo);

      return this.roundMoeda(salMinimo);
    }


    return this.roundMoeda(valorBeneficio);
  }


  verificaAbonoProporcionalDevidos(dib) {
    let dibMonth = dib.month() + 1;

    if (dib.date() < 15) {
      dibMonth -= 1;
    }

    let proporcional = 1 - dibMonth / 12;

    if (proporcional < 1) {
      this.aplicaProporcionalDevidos = true;
    } else {
      this.aplicaProporcionalDevidos = false;
    }

    return proporcional;
  }

  verificaAbonoProporcionalRecebidos(dib) {
    let dibMonth = dib.month() + 1;
    if (dib.date() < 15) {
      dibMonth -= 1;
    }

    let proporcional = 1 - dibMonth / 12;

    if (proporcional < 1) {
      this.aplicaProporcionalRecebidos = true;
    } else {
      this.aplicaProporcionalRecebidos = false;
    }

    return proporcional;
  }


  monthsDiff(d1, d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const years = date2.getFullYear() - date1.getFullYear();
    const months = (years * 12) + (date2.getMonth() - date1.getMonth());
    return months;
  }


  verificaAbonoProporcionalDevidoInicioFim(inicio, fim) {

    if (inicio.isBefore(fim, 'year')) {
      return this.verificaAbonoProporcionalDevidos(fim.clone())
    }

    let dibMonthINI = inicio.month() + 1;
    if (inicio.date() > 15) {
      dibMonthINI -= 1;
    }

    let dibMonthFIM = fim.month() + 1;
    if (fim.date() < 15) {
      dibMonthFIM -= 1;
    }

    let diffTotal = this.monthsDiff(
      (inicio.clone()).startOf('month').format('YYYY-MM-DD'),
      (fim.clone()).endOf('month').format('YYYY-MM-DD'));


    if (inicio.date() > 15) {
      diffTotal -= 1
    }


    if (fim.date() < 15) {
      diffTotal -= 1
    }

    let proporcional = 1 - diffTotal / 12;

    if (proporcional < 1) {
      this.aplicaProporcionalDevidos = true;
    } else {
      this.aplicaProporcionalDevidos = false;
    }

    return proporcional;
  }


  verificaAbonoProporcionalRecebidosInicioFim(inicio, fim) {

    if (inicio.isBefore(fim, 'year')) {
      return this.verificaAbonoProporcionalRecebidos(fim.clone())
    }

    let dibMonthINI = inicio.month() + 1;
    if (inicio.date() > 15) {
      dibMonthINI -= 1;
    }

    let dibMonthFIM = fim.month() + 1;
    if (fim.date() < 15) {
      dibMonthFIM -= 1;
    }

    let diffTotal = this.monthsDiff(
      (inicio.clone()).startOf('month').format('YYYY-MM-DD'),
      (fim.clone()).endOf('month').format('YYYY-MM-DD'));


    if (inicio.date() > 15) {
      diffTotal -= 1
    }


    if (fim.date() < 15) {
      diffTotal -= 1
    }

    let proporcional = 1 - diffTotal / 12;

    if (proporcional < 1) {
      this.aplicaProporcionalRecebidos = true;
    } else {
      this.aplicaProporcionalRecebidos = false;
    }

    return proporcional;
  }


  // Retorna a diferen??a em meses completos entre as datas passadas como parametro. 
  // Se nao passar dois argumentos, compara a data passada com a atual
  getDifferenceInMonths(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.floor(difference);
  }

  // Retorna a diferen??a em meses completos entre as datas passadas como parametro. 
  // Se nao passar dois argumentos, compara a data passada com a atual
  getDifferenceInMonthsRounded(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.round(difference);
  }

  private formatDateIsnotNullMoment(data) {
    if (this.isExits(data) && data.isValid()) {
      return data.format('DD/MM/YYYY');
    } else {
      return '';
    }
  }


  formatDatetimeToDate(dataString) {
    let date = dataString.split(' ')[0];
    let splited_date = date.split('-');
    let ret = splited_date[2] + '/' + splited_date[1] + '/' + splited_date[0];
    if (ret == '00/00/0000') {
      return '--';
    }
    return ret;
  }

  formatDate(dataString) {
    if (dataString != '0000-00-00') {
      let splited_date = dataString.split('-');
      return splited_date[2] + '/' + splited_date[1] + '/' + splited_date[0];
    }
    return '--'
  }

  formatDateCompetencia(dataString) {

    if (dataString != '0000-00-00') {
      let splited_date = dataString.split('-');
      return splited_date[1] + '/' + splited_date[0];
    }

    return '--'

  }

  formatPercent(value, n_of_decimal = 0) {

    value = parseFloat(value) * 100;
    return this.formatDecimal(value, n_of_decimal) + '%';

  }

  formatMoney(value, sigla = 'R$', aplicarCor = false) {

    if (typeof value === 'number') {
      let numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      // let string = sigla + this.formatDecimal(value, 2);
      let string = sigla + ' ' + numeroPadronizado;
      if (aplicarCor && string.indexOf('-') != -1) {
        string = '<span style="color:red">' + string + '</span>';
      }
      return string;
    } else {
      return sigla + ' 0,00';
    }


  }

  roundMoeda(value) {
    return (Math.round(value * 100) / 100);
  }

  // roundMoeda(value, dataCorrente, tipo = 'devido') {
  //   // let dib = moment(this.calculo.data_pedido_beneficio_esperado);

  //   // if (tipo === 'recebido') {
  //   //   dib = moment(this.calculo.data_pedido_beneficio);
  //   // }
  //   const dib = dataCorrente;

  //   if (dib.isAfter(moment('1994-07-01'))) {
  //     // return (Math.floor(value * 100) / 100);
  //     return (Math.round(value * 100) / 100);
  //   } else {
  //     return (Math.round(value * 100) / 100);
  //   }

  // }

  formatRMI(value, type) {
    let sigla = '';
    let moeda;
    if (type == 'Devidos') {
      moeda = this.Moeda.getByDate(moment(this.calculo.data_pedido_beneficio_esperado));
    } else if (type == 'Recebidos') {
      moeda = this.Moeda.getByDate(moment(this.calculo.data_pedido_beneficio));
    }
    sigla = moeda.sigla;
    return this.formatMoney(value, sigla);
  }


  formatRMIMoedaData(value, data) {

    const moeda = DefinicaoMoeda.loadCurrency(data);
    return this.formatMoney(value, moeda.acronimo);
  }

  formatDecimal(value, n_of_decimal_digits) {

    value = parseFloat(value);
    return (value.toFixed(parseInt(n_of_decimal_digits, 10))).replace('.', ',');

  }

  formatIndicesReajustes(reajusteObj, dataCorrente, tipo) {
    let stringIndice = '';
    let dib;
    if (tipo == 'Recebido') {
      dib = moment(this.calculo.data_pedido_beneficio);
    } else if (tipo == 'Devido') {
      dib = moment(this.calculo.data_pedido_beneficio_esperado);
    }

    if (dataCorrente <= this.dataSimplificada && dib < this.dataInicioBuracoNegro) {
      return 'Art. 58 <br> (ADCT)';
    }


    if (reajusteObj.reajusteOs == 0.0 || dataCorrente >= this.dataEfeitoFinanceiro) {
      // N??o tem reajuste OS
      stringIndice = this.formatDecimal(reajusteObj.reajuste, 6);
    } else {
      stringIndice = '' + this.formatDecimal(reajusteObj.reajuste, 6) + '<br>' + this.formatDecimal(reajusteObj.reajusteOs, 6) + 'OS'
    }
    return stringIndice;
  }

  updateResultadosDatatable() {

    let columns = [];
    columns.push({ data: 'competencia', width: '9rem' });
    columns.push({ data: 'indice_devidos', width: '7rem' });
    columns.push({ data: 'beneficio_devido', width: '14rem' });
    // teste regras buraco negro
    // columns.push({ data: 'beneficio_devido_apos_revisao_sem_limites', width: '14rem' });
    // columns.push({ data: 'beneficio_devido_sem_limites', width: '14rem' });


    if (this.calculo.tipo_aposentadoria === 22) {
      columns.push({ data: 'beneficio_devido_quota_dependente', width: '10rem' });
    }

    columns.push({ data: 'indice_recebidos', width: '7rem' });
    columns.push({ data: 'beneficio_recebido', width: '14rem' });
    columns.push({ data: 'diferenca_mensal', width: '14rem' });
    columns.push({ data: 'correcao_monetaria' });
    columns.push({ data: 'diferenca_corrigida' });
    columns.push({ data: 'juros' });
    columns.push({ data: 'valor_juros', width: '9rem' });
    columns.push({ data: 'diferenca_corrigida_juros', width: '9rem' });
    // columns.push({ data: 'honorarios', width: '10rem' }); // teste

    if (this.debugMode) {
      columns = [
        { data: 'competencia', width: '12rem' },
        { data: 'indice_devidos', width: '10rem' },
        { data: 'beneficio_devido', width: '14rem' },
        { data: 'beneficio_devido_sem_limites' },
        { data: 'beneficio_devido_apos_revisao_sem_limites' },
        { data: 'beneficio_devido_apos_revisao' },
        { data: 'indice_recebidos', width: '10rem' },
        { data: 'beneficio_recebido', width: '14rem' },
        { data: 'beneficio_recebido_sem_limites' },
        { data: 'beneficio_recebido_apos_revisao_sem_limites' },
        { data: 'beneficio_recebido_apos_revisao' },
        { data: 'diferenca_mensal' },
        { data: 'correcao_monetaria' },
        { data: 'diferenca_corrigida' },
        { data: 'juros' },
        { data: 'valor_juros' },
        { data: 'diferenca_juros' },
        { data: 'dias_proporcionais' },
      ];
    }

    this.resultadosDatatableOptions = {
      ...this.resultadosDatatableOptions,
      data: this.resultadosList,
      columns: columns,
      columnDefs: [
        { className: 'nowrapText notwrap text-center td-condensed-fit', targets: '_all' },
      ]
    }


  }


  public ordenarListaRecebidos() {

    this.listRecebidos.sort((a, b) => {

      const dib1 = moment(a.dib, 'DD/MM/YYYY');
      const dib2 = moment(b.dib, 'DD/MM/YYYY');

      const dip1 = moment(a.dip, 'DD/MM/YYYY');
      const dip2 = moment(b.dip, 'DD/MM/YYYY');

      if (dib1.isSame(dib2)) {
        return dip1 < dip2 ? -1 : 1
      } else {
        return dib1 > dib2 ? -1 : 1
      }

    });
  }

  private parseStringFloatIRT(value) {

    if (value != undefined && typeof value !== 'undefined' && value != '') {

      if (typeof value === 'number') {
        return value;
      }

      return parseFloat(value.replace(',', '.'));
    }

  }


  tratarConclusao(value) {
    if (value < 0) {
      return 'negativeValue';
    } else {
      return '';
    }
  }

  getIndice(data) {
    return this.getDifferenceInMonths(this.primeiraDataArrayMoeda, data);
  }

  calcularSemPrescricao() {
    // window.location.href = (this.considerarPrescricao) ? window.location.href.split('?')[0] + '? 
    // considerarPrescricao=false' : window.location.href.split('?')[0];

    // let is_prescricao = 'true';
    // if (sessionStorage.considerarPrescricao === 'true') {
    //   is_prescricao = 'false';
    // }

    // sessionStorage.setItem('considerarPrescricao', is_prescricao);
    // window.location.reload();
  }

  getTipoAposentadoria(value) {

    value = Number(value);
    const tipos_aposentadoria = [
      { name: '', value: '' },
      { name: 'Abono de Perman??ncia em Servi??o', value: 11 },
      { name: 'Aposentadoria Especial', value: 4 },
      { name: 'Aposentadoria por Incapacidade Permanente', value: 19 },
      { name: 'Aposentadoria por Idade - Trabalhador Rural', value: 7 },
      { name: 'Aposentadoria por Idade - Trabalhador Urbano', value: 2 },
      { name: 'Aposentadoria por Idade da Pessoa com Defici??ncia', value: 16 },
      { name: 'Aposentadoria por Invalidez ', value: 1 },
      { name: 'Aposentadoria por Tempo de Contribui????o', value: 3 },
      { name: 'Aposentadoria por Tempo de Contribui????o Professor', value: 5 },
      { name: 'Aposentadoria por Tempo de Contribui????o da Pessoa com Defici??ncia', value: 13 },
      { name: 'Aposentadoria por Tempo de Servi??o', value: 18 },
      { name: 'Aux??lio Acidente - 30%', value: 8 },
      { name: 'Aux??lio Acidente - 40%', value: 9 },
      { name: 'Aux??lio Acidente - 50%', value: 6 },
      { name: 'Aux??lio Acidente - 60%', value: 10 },
      { name: 'Aux??lio Doen??a', value: 0 },
      { name: 'Aux??lio Emergencial', value: 2021 },
      { name: 'Aux??lio por Incapacidade Tempor??ria', value: 20 },
      { name: 'Aux??lio Reclus??o', value: 23 },
      { name: 'Benef??cio de Presta????o Continuada - BPC ', value: 12 },
      { name: 'Pens??o por Morte', value: 22 },
      { name: 'Seguro Desemprego', value: 24 }
    ];

    // return tipos_aposentadoria[value].name;
    return (tipos_aposentadoria.filter(item => value === item.value))[0].name;

  }

  getTipoHonorario(value) {

    const tipoHonorariosOptions = [
      { text: '', value: '' },
      { text: 'N??o Calcular Honor??rios', value: 'nao_calc' },
      { text: 'Percentual Sobre o Valor da Diferen??a entre os Benef??cios Devido e Recebido', value: 'dif' },
      { text: 'Percentual sobre o Valor Total do Benef??cio Devido', value: 'dev' },
      { text: 'Calcular Valor Conforme ?? 3??, art. 85, do CPC/2015', value: 'CPC85' },
      { text: 'Calcular Sobre o Valor da Causa', value: 'condenacao' },
      { text: 'Fixo', value: 'fixo' },
    ];

    return (tipoHonorariosOptions.filter(item => value === item.value))[0].text;

  }


  imprimirPagina() {

    const css = `
      <style>
      body {
            -webkit-print-color-adjust: exact;}
            body{font-family: Arial, Helvetica, sans-serif;}
            h1, h2{font-size:0.9rem; padding-bottom: 2px; margin-bottom: 2px;}
            i.fa, .not-print{ display: none; }
            .td-width-30{ width: 38% !important;}
            .table{margin-top: 30px;}
            .table-print-no-margin { margin-top: 2px !important;}
            footer,div,p,th{font-size:10px;}
            .table-row-group>thead, table-row-group>tbody {display: table-row-group;}
            .table>thead>tr>th{ background-color: #e6e6e6 !important;}
             .table>tbody>tr>td, .table>tbody>tr>th,
             .table>tfoot>tr>td, .table>tfoot>tr>th,
             .table>thead>tr>td, .table>thead>tr>th {padding: 3px 3px;}
             .table>tbody>tr>td,.table>tfoot>tr>td, .table>tfoot>tr>th { white-space: nowrap !important; font-size:12px;}
             .td-condensed-fit{ font-size:9px !important; }

            //  table, .table { page-break-after:auto }
              tr, .table>tbody>tr, .table>thead>tr    { page-break-inside:avoid; page-break-after:auto }
            //  td, .table>tbody>tr>td, .table>thead>tr>th   { page-break-inside:avoid; page-break-after:auto }
            //  thead,.table>thead>tr, { display:table-header-group; }
            //  tfoot { display:table-footer-group }

            // table { page-break-after:auto !important}
            // tr    { page-break-inside:avoid; page-break-after:auto }
            // td    { page-break-inside:avoid; page-break-after:auto }
            // thead { display: table-row-group; }
            // tfoot { display:table-footer-group }


            footer{text-align: center;}
            .text-center{ text-align: center; }
            .text-right{ text-align: right; }
            h1{ text-align: center; }
            footer{text-align: center; margin-top: 50px;}
            title{color: #ffffff !important; background-color:White !important;}
            .well {background-color: #fbfbfb; border: 1px solid #ddd; box-shadow: 0 1px 1px #ececec;
              -webkit-box-shadow: 0 1px 1px #ececec; -moz-box-shadow: 0 1px 1px #ececec;position: relative;
          }
          .well {
              min-height: 20px; padding: 19px; margin-top: 40px; background-color: #f5f5f5;
              border: 1px solid #e3e3e3; border-radius: 2px; -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 5%);
              box-shadow: inset 0 1px 1px rgb(0 0 0 / 5%);
          }

      </style>`;

    const seguradoBox = document.getElementById('printableSegurado').innerHTML;
    const dadosCalculo = document.getElementById('printableDatasCalculo').innerHTML;
    const valoresDevidos = document.getElementById('printableValoresDevidos').innerHTML;

    let valoresRecebidos = '';
    if (typeof (document.getElementById('printableValoresRecebidos')) != 'undefined'
      && document.getElementById('printableValoresRecebidos') != null) {
      valoresRecebidos = document.getElementById('printableValoresRecebidos').innerHTML;
    }

    if (this.listRecebidos.length > 0) {
      valoresRecebidos = document.getElementById('printableValoresRecebidosList').innerHTML;
    }

    const recebidosTable = `<table class="table table-bordered table-hover no-padding no-margin">
    <thead >
      <tr>
        <th colspan="2">
          <h2>Benef??cios Recebidos</h2>
        </th>
      </tr>
    </thead>
    <tbody>
    <tr>
    <td colspan="2">${valoresRecebidos}</td>
    </tr>
    </tbody>
  </table>`;

    const honorarios = document.getElementById('printableHonorarios').innerHTML;
    const juros = document.getElementById('printableJuros').innerHTML;
    const correcao = document.getElementById('printableCorrecao').innerHTML;
    const conclusoes = document.getElementById('printableConclusoes').innerHTML;
    const resultadoCalculo = document.getElementById('resultadoCalculo').innerHTML;
    const printableRRA = document.getElementById('printableRRA').innerHTML;
    const printableCustosAdicionais = document.getElementById('printableCustosAdicionais').innerHTML;
    const observacoesprint = document.getElementById('observacoesprint').innerHTML;

    let printContents = seguradoBox + dadosCalculo +
      valoresDevidos + valoresRecebidos
      + correcao + juros + honorarios
      + resultadoCalculo + printableCustosAdicionais
      + printableRRA + conclusoes + observacoesprint;

    if (this.listRecebidos.length > 0) {
      printContents = seguradoBox + dadosCalculo +
        valoresDevidos + recebidosTable
        + correcao + juros + honorarios
        + resultadoCalculo + printableCustosAdicionais
        + printableRRA + conclusoes + observacoesprint;
    }

    printContents = printContents.replace(/<table/g,
      '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');

    const rodape = `<img src='./assets/img/rodape/TIMBRADO_SIMULADORES1080.jpg' alt='Logo' style="width: 100%;">`;
    // const title = `<title> Liquida????o de Senten??a - ${this.segurado.nome}</title>`;
    const title = ``;

    const popupWin = window.open('', '_blank', 'width=700,height=500');
    popupWin.document.open();
    popupWin.document.write('<html><head>' + css + title + '</head><body onload="window.print()">'
      + printContents + '<footer >' + rodape + '</footer></body></html>');
    popupWin.document.close();
  }

  getStringTabelaCorrecaoMonetaria() {
    const correcaoOptions = [
      { text: 'N??o Aplicar', value: '' },
      { text: 'IGPDI at?? 01/2004 - INPC at?? 06/2009 - IPCA-E a partir de 07/2009 ', value: 'ipca' },
      { text: 'IGPDI at?? 01/2004 - INPC (Manual de C??lculos da Justi??a Federal) ', value: 'cam' },
      { text: 'IGPDI at?? 01/2004 - INPC at?? 06/2009 - TR at?? 03/2015 - INPC a partir de 04/2015', value: 'igpdi_012004_inpc062009_tr032015_inpc' },
      { text: 'IGPDI at?? 2006 - INPC at?? 06/2009 - TR at?? 03/2015 - IPCA-E a partir de 04/2015', value: 'igpdi_2006_inpc062009_tr032015_ipcae' },
      { text: 'IGPDI at?? 01/2004 - INPC at?? 06/2009 - TR at?? 09/2017 - INPC a partir de 10/2017', value: 'igpdi_012004_inpc062009_tr092017_inpc' },
      { text: 'IGPDI at?? 01/2004 - INPC at?? 06/2009 - TR at?? 09/2017 - IPCA-E a partir de 10/2017', value: 'igpdi_012004_inpc062009_tr092017_ipcae' },
      { text: 'IGPDI at?? 01/2004 - INPC at?? 06/2009 - TR at?? 03/2015 - IPCA-E a partir de 04/2015 ', value: 'tr032015_ipcae' },
      { text: 'IGPDI at?? 01/2004 - INPC at?? 06/2009 - TR a partir de 07/2009', value: 'tr' },
      { text: '??ndices Administrativos - INSS (Art.175 do Decreto n. 3.048/99)', value: 'cam_art_175_3048' },
      { text: 'IPCA-E em todo per??odo', value: 'ipca_todo_periodo' },
      { text: 'TR em todo per??odo', value: 'tr_todo_periodo' },
    ];


    return (correcaoOptions.filter(item => this.calculo.tipo_correcao === item.value))[0].text;

  }

  editSegurado() {
    window.location.href = '/#/beneficios/beneficios-segurados/' +
      this.route.snapshot.params['id'] + '/editar';
  }


  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }


  private checkvalidDate(date) {
    return (typeof date !== 'undefined' &&
      date != null && date != 'null' &&
      date !== undefined && date != '' &&
      date !== '0000-00-00' &&
      (moment(date).isValid() || moment(date, 'DD/MM/YYYY').isValid()))
      ? true : false;
  }


  public getNameSelectJurosAnualParaMensal() {

    this.jurosEmFormatoAnual = ''; // Manual

    const opcoesMensalParaAnual = [
      // {
      //   jurosAntes2003: 1, jurosDepois2003: 1, jurosDepois2009: 0.5,
      //   value: '12_6', name: '12% ao ano (at?? 06/2009) / 6% ao ano (Poupan??a)'
      // },
      {
        jurosAntes2003: 0.5, jurosDepois2003: 1, jurosDepois2009: 0.5, aplicar_juros_poupanca: 1,
        value: '12_6', name: '12% ao ano (at?? 06/2009) / 6% ao ano (Poupan??a)'
      },
      // {
      //   jurosAntes2003: 0.5, jurosDepois2003: 0.5, jurosDepois2009: 0.5,
      //   value: '6_selic', name: '6% ao ano (observando a SELIC - Poupan??a)'
      // },
      {
        jurosAntes2003: 1, jurosDepois2003: 1, jurosDepois2009: 1, aplicar_juros_poupanca: 0,
        value: '12_ano', name: '12% ao ano'
      },
      {
        jurosAntes2003: 0.5, jurosDepois2003: 1, jurosDepois2009: 1, aplicar_juros_poupanca: 0,
        value: '6_12', name: '6% ao ano (at?? 01/2003) / 12% ao ano'
      },
      {
        jurosAntes2003: 0.5, jurosDepois2003: 1, jurosDepois2009: 0.5, aplicar_juros_poupanca: 0,
        value: '6_12_6', name: '6% ao ano (at?? 01/2003) / 12% ao ano (at?? 06/2009) / 6% ao ano'
      },
      {
        jurosAntes2003: 0.5, jurosDepois2003: 0.5, jurosDepois2009: 0.5, aplicar_juros_poupanca: 0,
        value: '6_fixo', name: '6% ao ano (fixo)'
      },
      {
        jurosAntes2003: null, jurosDepois2003: null, jurosDepois2009: null, aplicar_juros_poupanca: 0,
        value: 'sem_juros', name: 'Sem Juros'
      },
    ];


    for (const confJuros of opcoesMensalParaAnual) {

      if (
        confJuros.jurosAntes2003 === this.calculo.previo_interesse_2003 &&
        confJuros.jurosDepois2003 === this.calculo.pos_interesse_2003 &&
        confJuros.jurosDepois2009 === this.calculo.pos_interesse_2009 &&
        confJuros.aplicar_juros_poupanca === this.calculo.aplicar_juros_poupanca
      ) {
        this.jurosEmFormatoAnual = confJuros.name;
      }

    }

    if (this.isExits(this.jurosEmFormatoAnual)) {
      this.jurosEmFormatoAnual = 'manual';
    }



  }


  /*
    generateTabelaResultados() {
      let competencias = this.monthsBetween(this.dataInicioCalculo, this.dataFinal);
      let tableData = [];
      let dataPedidoBeneficioEsperado = moment(this.calculo.data_pedido_beneficio_esperado);
      let dataPedidoBeneficio = moment(this.calculo.data_pedido_beneficio);
      //Escolha de quais fun??oes de beneficios devidos e recebidos serao utilizadas
      let func_beneficioDevido = this.getBeneficioDevido;
      let func_beneficioRecebido = this.getBeneficioRecebido;
      let abonoProporcionalDevidos = 0;
      let abonoProporcionalRecebidos = 0;

      if (this.calculo.previa_data_pedido_beneficio_esperado != '0000-00-00') {
        let previaDataPedidoBeneficioEsperado = moment(this.calculo.previa_data_pedido_beneficio_esperado);
        if (previaDataPedidoBeneficioEsperado.isSame(dataPedidoBeneficioEsperado, 'year')) {
          abonoProporcionalDevidos = this.verificaAbonoProporcionalDevidos(previaDataPedidoBeneficioEsperado);
        } else {
          abonoProporcionalDevidos = 1;
        }
      } else {
        abonoProporcionalDevidos = this.verificaAbonoProporcionalDevidos(dataPedidoBeneficioEsperado);
      }

      if (this.calculo.data_anterior_pedido_beneficio != '0000-00-00') {
        let previaDataPedidoBeneficio = moment(this.calculo.data_anterior_pedido_beneficio);
        if (previaDataPedidoBeneficio.isSame(dataPedidoBeneficio, 'year')) {
          abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(previaDataPedidoBeneficio);
        } else {
          abonoProporcionalRecebidos = 1;
        }
      } else {
        abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(dataPedidoBeneficio);
      }
      let chkNotGranted = this.calculo;
      //console.log(competencias);

      for (let dataCorrenteString of competencias) {
        let line: any = {};
        let dataCorrente = moment(dataCorrenteString);
        if (this.dataCessacaoDevido && dataCorrente > this.dataCessacaoDevido) {
          break;
        }
        let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
        let siglaDataCorrente = moedaDataCorrente.sigla;

        let stringCompetencia = (dataCorrente.month() + 1) + '/' + dataCorrente.year();
        this.ultimaCompretencia = stringCompetencia;
        let indiceReajusteValoresDevidos = { reajuste: 0.0, reajusteOs: 0.0 };
        let beneficioDevido = 0.0;
        let indiceReajusteValoresRecebidos = { reajuste: 0.0, reajusteOs: 0.0 };
        let beneficioRecebido = 0.0;
        let diferencaMensal = 0.0;
        let correcaoMonetaria = this.getCorrecaoMonetaria(dataCorrente);
        let diferencaCorrigida = 0.0;
        let juros = this.getJuros(dataCorrente);
        let valorJuros = 0.0; //diferencaCorrigida * juros;
        let diferencaCorrigidaJuros = ''; //this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida);
        let honorarios = 0.0;


        // console.log(juros);


        let beneficioDevidoString = { resultString: this.formatMoney(beneficioDevido, siglaDataCorrente) };
        let beneficioRecebidoString = { resultString: this.formatMoney(beneficioRecebido, siglaDataCorrente) };

        let isPrescricao = false;
        //Quando a dataCorrente for menor que a ???dataInicioRecebidos???, definido na sec??o 1.1
        if (dataCorrente.isBefore(this.dataInicioRecebidos, 'month')) {
          indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
          beneficioDevido = func_beneficioDevido.call(this, dataCorrente, indiceReajusteValoresDevidos, beneficioDevidoString, line);
          diferencaMensal = beneficioDevido;

        } else if (dataCorrente.isBefore(this.dataInicioDevidos, 'month')) {
          //Quando a dataCorrente for menor que a ???dataInicioDevidos, definido na se????o 1.2
          indiceReajusteValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente);
          beneficioRecebido = func_beneficioRecebido.call(this, dataCorrente, indiceReajusteValoresRecebidos, beneficioRecebidoString, line);
          diferencaMensal = beneficioDevido - beneficioRecebido;

        } else if (dataCorrente.isSameOrAfter(this.dataInicioRecebidos, 'month') && dataCorrente.isSameOrAfter(this.dataInicioDevidos, 'month')) {
          //Quando a dataCorrente for maior que ambas, definido na se????o 1.3.
          indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
          beneficioDevido = func_beneficioDevido.call(this, dataCorrente, indiceReajusteValoresDevidos, beneficioDevidoString, line);
          indiceReajusteValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente);

          let chkboxBenefitNotGranted = this.calculo.beneficio_nao_concedido;
          if (chkboxBenefitNotGranted == 1) {
            beneficioRecebido = 0;//func_beneficioRecebido.call(this, dataCorrente, indiceReajusteValoresRecebidos, beneficioRecebidoString, line);
            diferencaMensal = beneficioDevido - beneficioRecebido;
          } else {
            beneficioRecebido = func_beneficioRecebido.call(this, dataCorrente, indiceReajusteValoresRecebidos, beneficioRecebidoString, line);
            diferencaMensal = beneficioDevido - beneficioRecebido;
          }

        }

        diferencaCorrigida = diferencaMensal * correcaoMonetaria;
        valorJuros = diferencaCorrigida * juros;
        let valorNumericoDiferencaCorrigidaJurosObj: any = {};
        diferencaCorrigidaJuros = this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida, valorNumericoDiferencaCorrigidaJurosObj);
        honorarios = this.calculoHonorarios(dataCorrente, valorJuros, diferencaCorrigida);

        if (diferencaCorrigidaJuros.indexOf('prescrita') != -1 && this.considerarPrescricao) {
          //Se houver o marcador, a data ?? prescrita
          isPrescricao = true;
        }

        line.competencia = stringCompetencia;
        line.indice_devidos = this.formatIndicesReajustes(indiceReajusteValoresDevidos, dataCorrente, 'Devido');
        line.beneficio_devido = beneficioDevidoString.resultString;
        line.indice_recebidos = this.formatIndicesReajustes(indiceReajusteValoresRecebidos, dataCorrente, 'Recebido');
        line.beneficio_recebido = beneficioRecebidoString.resultString;
        line.diferenca_mensal = this.formatMoney(diferencaMensal, siglaDataCorrente, true);
        line.correcao_monetaria = this.formatDecimal(correcaoMonetaria, 8);
        line.diferenca_corrigida = this.formatMoney(diferencaCorrigida, 'R$', true);
        line.juros = this.formatPercent(juros, 4);
        line.valor_juros = this.formatMoney(valorJuros, 'R$', true);
        line.diferenca_juros = diferencaCorrigidaJuros;
        line.honorarios = this.formatMoney(honorarios, 'R$', true);

        if (this.isTetos) {
          this.esmaecerLinhas(dataCorrente, line);
        }
        tableData.push(line);

        if (!isPrescricao) {
          //Se a dataCorrente nao estiver prescrita, soma os valores para as variaveis da Tabela de Conclus??es
          this.somaDiferencaMensal += diferencaMensal;
          this.somaCorrecaoMonetaria += correcaoMonetaria;
          this.somaDiferencaCorrigida += diferencaCorrigida;
          this.somaDiferencaCorrigidaJuros += valorNumericoDiferencaCorrigidaJurosObj.numeric;
          this.somaHonorarios += honorarios;
          this.somaJuros += valorJuros;
        }


        if (!this.proporcionalidadeUltimaLinha) {
          this.ultimaDiferencaMensal = diferencaMensal;
        }
        this.ultimaCorrecaoMonetaria = correcaoMonetaria;

        if (dataCorrente.month() == 11 && this.calculo.tipo_aposentadoria_recebida != 11) {
          //Adicionar linha de abono

          let beneficioRecebidoAbono;
          let beneficioDevidoAbono = this.ultimoBeneficioDevidoAntesProporcionalidade * abonoProporcionalDevidos;
          if (this.dataCessacaoRecebido != null && dataCorrente > this.dataCessacaoRecebido) {
            beneficioRecebidoAbono = 0.0;
          } else {
            beneficioRecebidoAbono = this.ultimoBeneficioRecebidoAntesProporcionalidade * abonoProporcionalRecebidos;
          }


          if (this.calculo.tipo_aposentadoria_recebida == 12 || this.calculo.tipo_aposentadoria_recebida == 17) {
            beneficioRecebidoAbono = 0.0;
          }


          if (dataCorrente.isBefore(this.dataInicioRecebidos, 'month')) {
            diferencaMensal = beneficioDevidoAbono;
          } else if (dataCorrente.isBefore(this.dataInicioDevidos, 'month')) {
            diferencaMensal = beneficioDevidoAbono - beneficioRecebidoAbono;
          } else if (dataCorrente.isSameOrAfter(this.dataInicioRecebidos, 'month') && dataCorrente.isSameOrAfter(this.dataInicioDevidos, 'month')) {
            diferencaMensal = beneficioDevidoAbono - beneficioRecebidoAbono;
          }

          diferencaCorrigida = diferencaMensal * correcaoMonetaria;
          valorJuros = diferencaCorrigida * juros;
          diferencaCorrigidaJuros = this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida, valorNumericoDiferencaCorrigidaJurosObj);
          honorarios = this.calculoHonorarios(dataCorrente, valorJuros, diferencaCorrigida);


          line = {
            ...line,
            competencia: 'abono - ' + stringCompetencia,
            beneficio_devido: this.formatMoney(beneficioDevidoAbono),
            beneficio_recebido: this.formatMoney(beneficioRecebidoAbono),
            diferenca_corrigida: this.formatMoney(diferencaCorrigida, 'R$', true),
            diferenca_mensal: this.formatMoney(diferencaMensal, siglaDataCorrente, true),
            juros: this.formatPercent(juros, 4),
            valor_juros: this.formatMoney(valorJuros, 'R$', true),
            diferenca_juros: diferencaCorrigidaJuros,
            honorarios: this.formatMoney(honorarios, 'R$', true)
          }

          if (this.isTetos) {
            this.esmaecerLinhas(dataCorrente, line);
          }

          tableData.push(line);

          if (this.aplicaProporcionalDevidos) {
            this.aplicaProporcionalDevidos = false;
            abonoProporcionalDevidos = 1;
          }

          if (this.aplicaProporcionalRecebidos) {
            this.aplicaProporcionalRecebidos = false;
            abonoProporcionalRecebidos = 1;
          }

          if (!isPrescricao) {
            //Se a dataCorrente nao estiver prescrita, soma os valores para as variaveis da Tabela de Conclus??es
            this.somaDiferencaMensal += diferencaMensal;
            this.somaCorrecaoMonetaria += correcaoMonetaria;
            this.somaDiferencaCorrigida += diferencaCorrigida;
            this.somaHonorarios += honorarios;
            this.somaJuros += valorJuros;
            this.somaDiferencaCorrigidaJuros += valorNumericoDiferencaCorrigidaJurosObj.numeric;
          }

        }
      }

      this.ultimaRenda = this.ultimoBeneficioDevidoAntesProporcionalidade - this.ultimoBeneficioRecebidoAntesProporcionalidade;
      this.somaVincendas = (this.isTetos) ? this.calcularVincendosTetos() : this.calcularVincendas();
      this.somaDevidaJudicialmente = this.somaDiferencaCorrigida + this.somaJuros;
      this.somaTotalSegurado = this.somaDevidaJudicialmente + this.somaVincendas;
      if (this.calculo.acordo_pedido != 0) {
        this.calcularAcordoJudicial();
      }

      return tableData;
    }


  /*
  // op????o 1
    generateTabelaResultados() {
      this.jurosCorrente = 0.00000;
      let competencias = this.monthsBetween(this.dataInicioCalculo, this.dataFinal);
      let tableData = [];
      let dataPedidoBeneficioEsperado = moment(this.calculo.data_pedido_beneficio_esperado);
      let dataPedidoBeneficio = moment(this.calculo.data_pedido_beneficio);
      //Escolha de quais fun??oes de beneficios devidos e recebidos serao utilizadas
      let func_beneficioDevido = this.getBeneficioDevido;
      let func_beneficioRecebido = this.getBeneficioRecebido;
      let abonoProporcionalDevidos = 0;
      let abonoProporcionalRecebidos = 0;

      if (this.calculo.previa_data_pedido_beneficio_esperado != '0000-00-00') {
        let previaDataPedidoBeneficioEsperado = moment(this.calculo.previa_data_pedido_beneficio_esperado);
        if (previaDataPedidoBeneficioEsperado.isSame(dataPedidoBeneficioEsperado, 'year')) {
          abonoProporcionalDevidos = this.verificaAbonoProporcionalDevidos(previaDataPedidoBeneficioEsperado);
        } else {
          abonoProporcionalDevidos = 1;
        }
      } else {
        abonoProporcionalDevidos = this.verificaAbonoProporcionalDevidos(dataPedidoBeneficioEsperado);
      }

      if (this.calculo.data_anterior_pedido_beneficio != '0000-00-00') {
        let previaDataPedidoBeneficio = moment(this.calculo.data_anterior_pedido_beneficio);
        if (previaDataPedidoBeneficio.isSame(dataPedidoBeneficio, 'year')) {
          abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(previaDataPedidoBeneficio);
        } else {
          abonoProporcionalRecebidos = 1;
        }
      } else {
        abonoProporcionalRecebidos = this.verificaAbonoProporcionalRecebidos(dataPedidoBeneficio);
      }
      let chkNotGranted = this.calculo;


       //inverter inicia na data mais recente
      competencias.reverse();

      console.log(this.dataCessacaoDevido);



     let indexComp = 0;
     for (let dataCorrenteString of competencias) {

      //  for (let [index, dataCorrenteString]  of competencias.entries()) {
        let line: any = {};
        let dataCorrente = moment(dataCorrenteString);
        if (this.dataCessacaoDevido && dataCorrente > this.dataCessacaoDevido) {
          break;
        }
        let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
        let siglaDataCorrente = moedaDataCorrente.sigla;

        let stringCompetencia = (dataCorrente.month() + 1) + '/' + dataCorrente.year();
        this.ultimaCompretencia = stringCompetencia;
        let indiceReajusteValoresDevidos = { reajuste: 0.0, reajusteOs: 0.0 };
        let beneficioDevido = 0.0;
        let indiceReajusteValoresRecebidos = { reajuste: 0.0, reajusteOs: 0.0 };
        let beneficioRecebido = 0.0;
        let diferencaMensal = 0.0;
        let correcaoMonetaria = this.getCorrecaoMonetaria(dataCorrente);
        let diferencaCorrigida = 0.0;
        let juros = (indexComp === 0)? 0 : this.getJuros(dataCorrente) ;
        let valorJuros = 0.0; //diferencaCorrigida * juros;
        let diferencaCorrigidaJuros = ''; //this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida);
        let honorarios = 0.0;


        // console.log(juros);


        let beneficioDevidoString = { resultString: this.formatMoney(beneficioDevido, siglaDataCorrente) };
        let beneficioRecebidoString = { resultString: this.formatMoney(beneficioRecebido, siglaDataCorrente) };

        let isPrescricao = false;
        //Quando a dataCorrente for menor que a ???dataInicioRecebidos???, definido na sec??o 1.1
        if (dataCorrente.isBefore(this.dataInicioRecebidos, 'month')) {
          indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
          beneficioDevido = func_beneficioDevido.call(this, dataCorrente, indiceReajusteValoresDevidos, beneficioDevidoString, line);
          diferencaMensal = beneficioDevido;

        } else if (dataCorrente.isBefore(this.dataInicioDevidos, 'month')) {
          //Quando a dataCorrente for menor que a ???dataInicioDevidos, definido na se????o 1.2
          indiceReajusteValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente);
          beneficioRecebido = func_beneficioRecebido.call(this, dataCorrente, indiceReajusteValoresRecebidos, beneficioRecebidoString, line);
          diferencaMensal = beneficioDevido - beneficioRecebido;

        } else if (dataCorrente.isSameOrAfter(this.dataInicioRecebidos, 'month') && dataCorrente.isSameOrAfter(this.dataInicioDevidos, 'month')) {
          //Quando a dataCorrente for maior que ambas, definido na se????o 1.3.
          indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
          beneficioDevido = func_beneficioDevido.call(this, dataCorrente, indiceReajusteValoresDevidos, beneficioDevidoString, line);
          indiceReajusteValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente);

          let chkboxBenefitNotGranted = this.calculo.beneficio_nao_concedido;
          if (chkboxBenefitNotGranted == 1) {
            beneficioRecebido = 0;//func_beneficioRecebido.call(this, dataCorrente, indiceReajusteValoresRecebidos, beneficioRecebidoString, line);
            diferencaMensal = beneficioDevido - beneficioRecebido;
          } else {
            beneficioRecebido = func_beneficioRecebido.call(this, dataCorrente, indiceReajusteValoresRecebidos, beneficioRecebidoString, line);
            diferencaMensal = beneficioDevido - beneficioRecebido;
          }

        }

        diferencaCorrigida = diferencaMensal * correcaoMonetaria;
        valorJuros = diferencaCorrigida * juros;
        let valorNumericoDiferencaCorrigidaJurosObj: any = {};
        diferencaCorrigidaJuros = this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida, valorNumericoDiferencaCorrigidaJurosObj);
        honorarios = this.calculoHonorarios(dataCorrente, valorJuros, diferencaCorrigida);

        if (diferencaCorrigidaJuros.indexOf('prescrita') != -1 && this.considerarPrescricao) {
          //Se houver o marcador, a data ?? prescrita
          isPrescricao = true;
        }

        line.competencia = stringCompetencia;
        line.indice_devidos = this.formatIndicesReajustes(indiceReajusteValoresDevidos, dataCorrente, 'Devido');
        line.beneficio_devido = beneficioDevidoString.resultString;
        line.indice_recebidos = this.formatIndicesReajustes(indiceReajusteValoresRecebidos, dataCorrente, 'Recebido');
        line.beneficio_recebido = beneficioRecebidoString.resultString;
        line.diferenca_mensal = this.formatMoney(diferencaMensal, siglaDataCorrente, true);
        line.correcao_monetaria = this.formatDecimal(correcaoMonetaria, 8);
        line.diferenca_corrigida = this.formatMoney(diferencaCorrigida, 'R$', true);
        line.juros = this.formatPercent(juros, 4);
        line.valor_juros = this.formatMoney(valorJuros, 'R$', true);
        line.diferenca_juros = diferencaCorrigidaJuros;
        line.honorarios = this.formatMoney(honorarios, 'R$', true);

        if (this.isTetos) {
          this.esmaecerLinhas(dataCorrente, line);
        }
        indexComp ++;
        tableData.push(line);

        if (!isPrescricao) {
          //Se a dataCorrente nao estiver prescrita, soma os valores para as variaveis da Tabela de Conclus??es
          this.somaDiferencaMensal += diferencaMensal;
          this.somaCorrecaoMonetaria += correcaoMonetaria;
          this.somaDiferencaCorrigida += diferencaCorrigida;
          this.somaDiferencaCorrigidaJuros += valorNumericoDiferencaCorrigidaJurosObj.numeric;
          this.somaHonorarios += honorarios;
          this.somaJuros += valorJuros;
        }


        if (!this.proporcionalidadeUltimaLinha) {
          this.ultimaDiferencaMensal = diferencaMensal;
        }
        this.ultimaCorrecaoMonetaria = correcaoMonetaria;

        if (dataCorrente.month() == 11 && this.calculo.tipo_aposentadoria_recebida != 11) {
          //Adicionar linha de abono

          let beneficioRecebidoAbono;
          let beneficioDevidoAbono = this.ultimoBeneficioDevidoAntesProporcionalidade * abonoProporcionalDevidos;
          if (this.dataCessacaoRecebido != null && dataCorrente > this.dataCessacaoRecebido) {
            beneficioRecebidoAbono = 0.0;
          } else {
            beneficioRecebidoAbono = this.ultimoBeneficioRecebidoAntesProporcionalidade * abonoProporcionalRecebidos;
          }


          if (this.calculo.tipo_aposentadoria_recebida == 12 || this.calculo.tipo_aposentadoria_recebida == 17) {
            beneficioRecebidoAbono = 0.0;
          }


          if (dataCorrente.isBefore(this.dataInicioRecebidos, 'month')) {
            diferencaMensal = beneficioDevidoAbono;
          } else if (dataCorrente.isBefore(this.dataInicioDevidos, 'month')) {
            diferencaMensal = beneficioDevidoAbono - beneficioRecebidoAbono;
          } else if (dataCorrente.isSameOrAfter(this.dataInicioRecebidos, 'month')
          && dataCorrente.isSameOrAfter(this.dataInicioDevidos, 'month')) {
            diferencaMensal = beneficioDevidoAbono - beneficioRecebidoAbono;
          }

          diferencaCorrigida = diferencaMensal * correcaoMonetaria;
          valorJuros = diferencaCorrigida * juros;
          diferencaCorrigidaJuros =
          this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida, valorNumericoDiferencaCorrigidaJurosObj);
          honorarios = this.calculoHonorarios(dataCorrente, valorJuros, diferencaCorrigida);


          line = {
            ...line,
            competencia: 'abono - ' + stringCompetencia,
            beneficio_devido: this.formatMoney(beneficioDevidoAbono),
            beneficio_recebido: this.formatMoney(beneficioRecebidoAbono),
            diferenca_corrigida: this.formatMoney(diferencaCorrigida, 'R$', true),
            diferenca_mensal: this.formatMoney(diferencaMensal, siglaDataCorrente, true),
            juros: this.formatPercent(juros, 4),
            valor_juros: this.formatMoney(valorJuros, 'R$', true),
            diferenca_juros: diferencaCorrigidaJuros,
            honorarios: this.formatMoney(honorarios, 'R$', true)
          }

          if (this.isTetos) {
            this.esmaecerLinhas(dataCorrente, line);
          }

          tableData.push(line);

          if (this.aplicaProporcionalDevidos) {
            this.aplicaProporcionalDevidos = false;
            abonoProporcionalDevidos = 1;
          }

          if (this.aplicaProporcionalRecebidos) {
            this.aplicaProporcionalRecebidos = false;
            abonoProporcionalRecebidos = 1;
          }

          if (!isPrescricao) {
            //Se a dataCorrente nao estiver prescrita, soma os valores para as variaveis da Tabela de Conclus??es
            this.somaDiferencaMensal += diferencaMensal;
            this.somaCorrecaoMonetaria += correcaoMonetaria;
            this.somaDiferencaCorrigida += diferencaCorrigida;
            this.somaHonorarios += honorarios;
            this.somaJuros += valorJuros;
            this.somaDiferencaCorrigidaJuros += valorNumericoDiferencaCorrigidaJurosObj.numeric;
          }

        }
      }

      this.ultimaRenda = this.ultimoBeneficioDevidoAntesProporcionalidade - this.ultimoBeneficioRecebidoAntesProporcionalidade;
      this.somaVincendas = (this.isTetos) ? this.calcularVincendosTetos() : this.calcularVincendas();
      this.somaDevidaJudicialmente = this.somaDiferencaCorrigida + this.somaJuros;
      this.somaTotalSegurado = this.somaDevidaJudicialmente + this.somaVincendas;
      if (this.calculo.acordo_pedido != 0) {
        this.calcularAcordoJudicial();
      }
      tableData.reverse();
      return tableData;
    }
  */



  /*

    //Se????o 3.8
    getJuros(dataCorrente) {
      // console.log( this.jurosCorrente);

      let dataCitacaoReu = moment(this.calculo.data_citacao_reu);
      let chkBoxTaxaSelic = this.calculo.aplicar_juros_poupanca;
      let chkJurosMora = this.calculo.previo_interesse;
      let jurosAplicado = 0.0;
      let dataMesCitacaoReu = dataCitacaoReu.startOf('month');//dataCitacaoReu no dia 1


      if (dataCorrente > dataMesCitacaoReu) {
        if (dataCorrente < this.dataJuros2003) {
          this.jurosCorrente -= this.jurosAntes2003;
        }

        if (this.dataJuros2003 <= dataCorrente && dataCorrente < this.dataJuros2009) {
          this.jurosCorrente -= this.jurosDepois2003;
        }

        if (dataCorrente >= this.dataJuros2009) {
          if (!chkBoxTaxaSelic) {
            if (this.soma == 1) {
              this.jurosCorrente -= this.jurosDepois2009;
            } else {
              this.soma = 1;
            }

          } else {
            if (dataCorrente < this.dataSelic70) {
              this.jurosCorrente -= this.jurosDepois2009;
            } else {
              let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
              this.jurosCorrente -= parseFloat(moedaDataCorrente.juros_selic_70) / 100; //Carregado do BD na coluna da data corrente;
            }
          }
        }
        jurosAplicado = this.jurosCorrente;
      } else {
        if (!chkJurosMora) {
          if (dataCorrente != dataMesCitacaoReu) {
            jurosAplicado = 0;
          } else {
            jurosAplicado = this.jurosCorrente;
          }
        } else {
          jurosAplicado = this.jurosCorrente;
        }
      }

      if (jurosAplicado < 0) {
        jurosAplicado = 0;
      }
      return jurosAplicado;
    }

    calcularJurosCorrente() {
      let dataDoCalculo = moment(this.calculo.data_calculo_pedido).startOf('month');
      let dataCitacaoReu = moment(this.calculo.data_citacao_reu);
      let data = (this.dataInicioCalculo > dataCitacaoReu) ? this.dataInicioCalculo : dataCitacaoReu;
      data = data.startOf('month');
      let chkBoxTaxaSelic = this.calculo.aplicar_juros_poupanca;
      let juros = 0.0;
      if (data < this.dataJuros2003) {
        //juros = Calcular o juros com a taxa anterior a 2003 * numero de meses (arredondado) entre data e '15/01/2003';
        juros = this.jurosAntes2003 * this.getDifferenceInMonths(data, this.dataJuros2003.clone().subtract(1, 'days'));
        //juros += calcular taxa entre 2003 e 2009 * numero de meses entre '15/01/2003' e '01/07/2009'
        juros += this.jurosDepois2003 * this.getDifferenceInMonthsRounded(this.dataJuros2009, this.dataJuros2003);
        if (!chkBoxTaxaSelic) {
          //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e this.calculo.data_calculo_pedido (dataDoCalculo)
          juros += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
        } else {
          //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
          juros += this.jurosDepois2009 * this.getDifferenceInMonthsRounded(this.dataJuros2009, this.dataSelic70.clone().subtract(1, 'days'));
          //juros += taxaTabelada de cada mes entre ('01/05/2012') e a this.calculo.data_calculo_pedido (data do calculo);
          let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
          for (let mes of mesesEntreSelicDataCalculo) {
            let dateMes = moment(mes);
            let mesMoeda = this.Moeda.getByDate(dateMes);
            juros += parseFloat(mesMoeda.juros_selic_70) / 100;
          }
        }

      } else if (data < this.dataJuros2009) {
        //juros = calcular taxa entre 2003 e 2009 * numero de meses entre data e '01/07/2009'
        juros = this.jurosDepois2003 * this.getDifferenceInMonths(this.dataJuros2009, data);

        if (!chkBoxTaxaSelic) {
          //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
          juros += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
        } else {
          //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
          juros += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);

          //juros += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
          let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);

          for (let mes of mesesEntreSelicDataCalculo) {
            let dateMes = moment(mes);
            let mesMoeda = this.Moeda.getByDate(dateMes);
            juros += parseFloat(mesMoeda.juros_selic_70) / 100;
          }
        }
      } else {

        if (!chkBoxTaxaSelic) {
          //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
          juros += this.jurosDepois2009 * this.getDifferenceInMonths(data, dataDoCalculo);
        } else {
          if (data >= this.dataSelic70) {
            //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
            juros += this.jurosDepois2009 * this.getDifferenceInMonths(data, dataDoCalculo);
          } else {
            juros += this.jurosDepois2009 * this.getDifferenceInMonths(data, this.dataSelic70);
            //juros += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo / 100;
            let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
            for (let mes of mesesEntreSelicDataCalculo) {
              let dateMes = moment(mes);
              let mesMoeda = this.Moeda.getByDate(dateMes);
              juros += parseFloat(mesMoeda.juros_selic_70) / 100;
            }
          }
        }
      }
      console.log(juros);

      return juros;
    }
    */

  /*
  //Se????o 3.8 op????o 1
  getJuros(dataCorrente) {


    let dataCitacaoReu = moment(this.calculo.data_citacao_reu);
    let chkBoxTaxaSelic = this.calculo.aplicar_juros_poupanca;
    let chkJurosMora = this.calculo.previo_interesse;
    let jurosAplicado = 0.0;
    let dataMesCitacaoReu = dataCitacaoReu.startOf('month');//dataCitacaoReu no dia 1


    if (dataCorrente >= dataMesCitacaoReu) {
      if (dataCorrente < this.dataJuros2003) {
        this.jurosCorrente += this.jurosAntes2003;
      }

      if (this.dataJuros2003 <= dataCorrente && dataCorrente < this.dataJuros2009) {
        this.jurosCorrente += this.jurosDepois2003;
      }

      if (dataCorrente >= this.dataJuros2009) {
        if (!chkBoxTaxaSelic) {
          if (this.soma == 1) {
            this.jurosCorrente += this.jurosDepois2009;
          } else {
            this.soma = 1;
          }

        } else {
          if (dataCorrente < this.dataSelic70) {
            this.jurosCorrente += this.jurosDepois2009;
          } else {
            let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
            this.jurosCorrente += parseFloat(moedaDataCorrente.juros_selic_70) / 100; //Carregado do BD na coluna da data corrente;
          }
        }
      }
      jurosAplicado = this.jurosCorrente;
    } else {
      if (!chkJurosMora) {
        if (dataCorrente != dataMesCitacaoReu) {
          jurosAplicado = 0;
        } else {
          jurosAplicado = this.jurosCorrente;
        }
      } else {
        jurosAplicado = this.jurosCorrente;
      }
    }

    if (jurosAplicado < 0) {
      jurosAplicado = 0;
    }

    console.log( this.dataSelic70);
    console.log( dataCorrente);
    console.log( this.jurosCorrente);
    console.log( jurosAplicado);
    return jurosAplicado;
  }

  */


}








              // this.Moeda.getByDateRange(this.primeiraDataArrayMoeda.clone().subtract(1, 'months'), moment())
              //   .then((moeda: Moeda[]) => {
              //     this.moeda = moeda;

              //     // se ouver dib anterior considerar como a primeira data para o indice de corre????o
              //     const date_inicio_devido = (this.calculo.previa_data_pedido_beneficio_esperado !== '0000-00-00') ?
              //       this.calculo.previa_data_pedido_beneficio_esperado : this.calculo.data_pedido_beneficio_esperado;

              //     // Indice devido
              //     this.IndiceDevido.getByDateRange(moment(date_inicio_devido).clone().startOf('month').format('YYYY-MM-DD'),
              //       this.dataFinal.format('YYYY-MM-DD'))
              //       .then((indicesDevido: Indices) => {

              //         for (const i_devido of this.IndiceDevido.list) {
              //           this.indiceDevido.push(i_devido);
              //         }

              //         // se ouver dib anterior considerar como a primeira data para o indice de corre????o
              //         let date_inicio_recebido = (this.calculo.data_anterior_pedido_beneficio !== '0000-00-00') ?
              //           this.calculo.data_anterior_pedido_beneficio : this.calculo.data_pedido_beneficio;

              //         date_inicio_recebido = (moment(date_inicio_recebido).isValid()) ? date_inicio_recebido : date_inicio_devido;
              //         if (!(moment(this.calculo.data_calculo_pedido).isValid())) {
              //           this.dataFinal = (moment(this.calculo.data_calculo_pedido));
              //         }
              //         // indice recebido
              //         this.IndiceRecebido.getByDateRange(moment(date_inicio_recebido).clone().startOf('month').format('YYYY-MM-DD'),
              //           this.dataFinal.format('YYYY-MM-DD'))
              //           .then(indicesRecebido => {

              //             for (const i_recebido of this.IndiceDevido.list) {
              //               this.indiceRecebido.push(i_recebido);
              //             }

              //             this.jurosCorrente = this.calcularJurosCorrente();
              //             this.resultadosList = this.generateTabelaResultados();
              //             this.getNameSelectJurosAnualParaMensal();
              //             this.calcularHonorariosCPC85();
              //             this.calcularHonorariosFixo();
              //             this.calcularTutelaAntecipada();
              //             this.updateResultadosDatatable();
              //             this.isUpdating = false;

              //           });
              //       });

              //   });