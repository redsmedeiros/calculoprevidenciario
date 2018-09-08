import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { Segurado as SeguradoModel } from "../+beneficios-segurados/Segurado.model";
import { SeguradoService } from "../+beneficios-segurados/Segurado.service";
import { CalculoAtrasado as CalculoModel } from "../+beneficios-calculos/CalculoAtrasado.model";
import { CalculoAtrasadoService as CalculoService } from "../+beneficios-calculos/CalculoAtrasado.service";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { IntervaloReajusteService } from '../../services/IntervaloReajuste.service';
import { IntervaloReajuste } from '../../services/IntervaloReajuste.model';

import { IndicesService } from '../../services/Indices.service';
import { Indices } from '../../services/Indices.model';
import * as moment from 'moment';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './beneficios-resultados.component.html',
})
export class BeneficiosResultadosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public segurado:any = {};
  public calculo:any = {};
  public isTetos = false;
  public moeda;
  public indices;
  public isUpdating = false;
  public soma = 0 ;

  public resultadosList;
  public resultadosDatatableOptions = {
    paging: false,
    ordering: false,
    info: false,
    searching: false,
    data: this.resultadosList,
    columns: [
      {data: 'competencia'},
      {data: 'indice_devidos'},
      {data: 'beneficio_devido'},
      {data: 'indice_recebidos'},
      {data: 'beneficio_recebido'},
      {data: 'diferenca_mensal'},
      {data: 'correcao_monetaria'},
      {data: 'diferenca_corrigida'},
      {data: 'juros'},
      {data: 'valor_juros'},
      {data: 'diferenca_juros'},
      {data: 'honorarios'}
    ]
  }
  private aplicaProporcionalDevidos = false;
  //Datas Importantes
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
  private dataSegundoTetoJudicial = moment('2003-12-01');
  private dataCorteCruzado = moment('1988-01-01');
  private dataCorteCruzadoNovo = moment('1989-01-01');
  private dataCorteCruzeiroReal = moment('1993-08-01');

  private proporcionalidadeUltimaLinha = false;

  private dataInicioRecebidos;
  private dataInicioDevidos;
  private primeiraDataArrayMoeda;
  private beneficioDevidoAposRevisao;
  private beneficioRecebidoAposRevisao;

  //Variaveis para aplicação do reajuste
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
  //Variaveis para aplicação do reajuste tetos
  private aplicarReajusteUltimoDevidoTeto = false;
  private ultimoSalarioMinimoDevidoTeto = 0.0;
  private beneficioDevidoAnteriorTeto = 0.0;
  private aplicarReajusteUltimoRecebidoTeto = false;
  private ultimoSalarioMinimoRecebidoTeto = 0.0;
  private beneficioRecebidoAnteriorTeto = 0.0;

  //Variaveis para condicionais de primeiro reajuste
  private primeiroReajusteRecebidos = -1;
  private primeiroReajusteDevidos = -1;

  //Data da primeira linha da tabela
  private dataInicioCalculo = null;
  //Data da ultima linha da tabela
  private dataFinal = null;
  //
  private dataCessacaoDevido = null;
  private dataCessacaoRecebido = null;

  //Taxas de Juros
  private jurosAntes2003 = 0.005;
  private jurosDepois2003 = 0.01;
  private jurosDepois2009 = 0.005;

  private jurosCorrente = 0.0;

  //Variaveis para tabela de conclusões
  public somaHonorarios = 0.0;
  public descontoAcordo = 0.0;
  public valorAcordo = 0.0;

  public ultimaRenda = 0.0;
  public somaDiferencaMensal = 0.0;
  public somaCorrecaoMonetaria = 0.0;
  public somaDiferencaCorrigida = 0.0;
  public somaJuros = 0.0;
  public somaDevidaJudicialmente = 0.0;
  public somaVincendas = 0.0;
  public somaTotalSegurado = 0.0;

  //Variaveis para tabela de conclusões tetos
  public somaVincendosTetos = 0.0;
  public ultimaRendaTetos = 0.0;
  public somaDevidaTetos = 0.0;
  public honorariosTetos = 0.0;
  public subtotalTetos = 0.0;
  public acordoJudicialTetos = 0.0;
  public devidosComDescontoTetos = 0.0;
  public somaTotalTetos = 0.0;

  private ultimoBeneficioDevidoAntesProporcionalidade = 0.0;
  private ultimoBeneficioRecebidoAntesProporcionalidade = 0.0;
  private ultimaCorrecaoMonetaria = 0.0;
  private ultimaDiferencaMensal = 0.0;
  //Variaveis para tabela de conclusões tetos
  public diferencaMensalTetos = 0.0;
  constructor(protected router: Router,
              private route: ActivatedRoute,
              protected Segurado: SeguradoService,
              protected CalculoAtrasado: CalculoService,
              private Moeda: MoedaService,
              private IntervaloReajuste: IntervaloReajusteService,
              private Indice: IndicesService,
              ) {}

  ngOnInit() {
    this.isUpdating = true;

    this.Segurado.find(this.route.snapshot.params['id'])
      .then(segurado => {
        this.segurado = segurado;
      });

    this.CalculoAtrasado.find(this.route.snapshot.params['id_calculo'])
      .then(calculo => {
        this.calculo = calculo;
        this.setInicioRecebidosEDevidos();

        if(this.calculo.aplicar_ajuste_maximo_98_2003 == '1'){
          this.isTetos = true;
        }

        this.Moeda.getByDateRange(this.primeiraDataArrayMoeda.clone().subtract(1, 'months'), moment())
          .then((moeda: Moeda[]) => {
            this.moeda = moeda;
            this.Indice.getByDateRange(this.primeiraDataArrayMoeda.format('YYYY-MM-DD'),this.dataFinal.format('YYYY-MM-DD'))
              .then(indices => {
                this.indices = indices;
                this.jurosCorrente = this.calcularJurosCorrente();
                this.resultadosList = this.generateTabelaResultados();
                this.updateResultadosDatatable();
                this.isUpdating = false;
              });
          })
      });

  }

  generateTabelaResultados(){
    let competencias = this.monthsBetween(this.dataInicioCalculo, this.dataFinal);
    let tableData = [];
    let dataPedidoBeneficioEsperado = moment(this.calculo.data_pedido_beneficio_esperado);
    //Escolha de quais funçoes de beneficios devidos e recebidos serao utilizadas
    let func_beneficioDevido = (this.isTetos) ? this.getBeneficioDevidoTetos : this.getBeneficioDevido;
    let func_beneficioRecebido = (this.isTetos) ? this.getBeneficioRecebidoTetos :  this.getBeneficioRecebido;
    let abonoProporcionalDevidos =  0;
    if(this.calculo.previa_data_pedido_beneficio_esperado != '0000-00-00'){
      let previaDataPedidoBeneficioEsperado = moment(this.calculo.previa_data_pedido_beneficio_esperado);
      if(previaDataPedidoBeneficioEsperado.isSame(dataPedidoBeneficioEsperado, 'year')){
        abonoProporcionalDevidos = this.verificaAbonoProporcional(previaDataPedidoBeneficioEsperado);
      }else{
        abonoProporcionalDevidos = 1;
      }
    }else{
      abonoProporcionalDevidos = this.verificaAbonoProporcional(dataPedidoBeneficioEsperado);
    }
    
    for (let dataCorrenteString of competencias) {
      let dataCorrente = moment(dataCorrenteString);
      if(this.dataCessacaoDevido && dataCorrente > this.dataCessacaoDevido){
        break;
      }
      let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);

      let siglaDataCorrente = moedaDataCorrente.sigla;

      let stringCompetencia = (dataCorrente.month() + 1) + '/' + dataCorrente.year();
      
      let indiceReajusteValoresDevidos = {reajuste:0.0, reajusteOs:0.0};
      let beneficioDevido = 0.0;
      let indiceReajusteValoresRecebidos = {reajuste:0.0, reajusteOs:0.0};
      let beneficioRecebido = 0.0;
      let diferencaMensal = 0.0;
      let correcaoMonetaria = this.getCorrecaoMonetaria(dataCorrente);
      let diferencaCorrigida = 0.0;
      let juros = this.getJuros(dataCorrente);
      let valorJuros = 0.0; //diferencaCorrigida * juros;
      let diferencaCorrigidaJuros = ''; //this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida);
      let honorarios = 0.0;

      let beneficioDevidoString = {resultString:this.formatMoney(beneficioDevido, siglaDataCorrente)};
      let beneficioRecebidoString = {resultString:this.formatMoney(beneficioRecebido, siglaDataCorrente)};

      let isPrescricao = false;
      //Quando a dataCorrente for menor que a ‘dataInicioRecebidos’, definido na secão 1.1
      if (dataCorrente < this.dataInicioRecebidos) {
        indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
        beneficioDevido = func_beneficioDevido.call(this, dataCorrente, indiceReajusteValoresDevidos, beneficioDevidoString);
        diferencaMensal = beneficioDevido;

      }else if (dataCorrente < this.dataInicioDevidos) {
        //Quando a dataCorrente for menor que a ‘dataInicioDevidos, definido na seção 1.2
        indiceReajusteValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente);
        beneficioRecebido = func_beneficioRecebido.call(this, dataCorrente, indiceReajusteValoresRecebidos, beneficioRecebidoString);
        diferencaMensal = beneficioDevido - beneficioRecebido;

      }else if (dataCorrente >= this.dataInicioRecebidos && dataCorrente >= this.dataInicioDevidos) {
        //Quando a dataCorrente for maior que ambas, definido na seção 1.3.
        indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
        beneficioDevido = func_beneficioDevido.call(this, dataCorrente, indiceReajusteValoresDevidos, beneficioDevidoString);
        indiceReajusteValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente);
        beneficioRecebido = func_beneficioRecebido.call(this, dataCorrente, indiceReajusteValoresRecebidos, beneficioRecebidoString);
        diferencaMensal = beneficioDevido - beneficioRecebido;
      }

      diferencaCorrigida = diferencaMensal * correcaoMonetaria;
      valorJuros = diferencaCorrigida * juros;
      diferencaCorrigidaJuros = this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida);
      honorarios = this.calculoHonorarios(dataCorrente, valorJuros, diferencaCorrigida);

      if (diferencaCorrigidaJuros.indexOf('prescrita') != -1){
        //Se houver o marcador, a data é prescrita
        isPrescricao = true;
      }

      let line = {
        competencia: stringCompetencia,
        indice_devidos: this.formatIndicesReajustes(indiceReajusteValoresDevidos, dataCorrente, 'Devido'),
        beneficio_devido: beneficioDevidoString.resultString,
        indice_recebidos: this.formatIndicesReajustes(indiceReajusteValoresRecebidos, dataCorrente, 'Recebido'),
        beneficio_recebido: beneficioRecebidoString.resultString,
        diferenca_mensal: this.formatMoney(diferencaMensal, siglaDataCorrente),
        correcao_monetaria: correcaoMonetaria,
        diferenca_corrigida: this.formatMoney(diferencaCorrigida),
        juros: this.formatPercent(juros, 4),
        valor_juros: this.formatMoney(valorJuros),
        diferenca_juros: diferencaCorrigidaJuros,
        honorarios: this.formatMoney(honorarios)
      }
      tableData.push(line);

      if(!isPrescricao){
        //Se a dataCorrente nao estiver prescrita, soma os valores para as variaveis da Tabela de Conclusões
        this.somaDiferencaMensal += diferencaMensal;
        this.somaCorrecaoMonetaria += correcaoMonetaria;
        this.somaDiferencaCorrigida += diferencaCorrigida;
        this.somaHonorarios += honorarios;
      }

      this.somaJuros += valorJuros;
      if(!this.proporcionalidadeUltimaLinha){
        this.ultimaDiferencaMensal = diferencaMensal;
      }
      this.ultimaCorrecaoMonetaria = correcaoMonetaria;

      if(dataCorrente.month() == 11 && this.calculo.tipo_aposentadoria_recebida != 11){
        //Adicionar linha de abono
        line = {
              ...line,
              competencia: 'abono - ' + stringCompetencia,
              beneficio_devido: this.formatMoney(this.ultimoBeneficioDevidoAntesProporcionalidade * abonoProporcionalDevidos),
        }
        tableData.push(line);
        if(this.aplicaProporcionalDevidos){
          this.aplicaProporcionalDevidos = false;
          abonoProporcionalDevidos = 1;
        }
        if(!isPrescricao){
          //Se a dataCorrente nao estiver prescrita, soma os valores para as variaveis da Tabela de Conclusões
          this.somaDiferencaMensal += diferencaMensal;
          this.somaCorrecaoMonetaria += correcaoMonetaria;
          this.somaDiferencaCorrigida += diferencaCorrigida;
          this.somaHonorarios += honorarios;
        }
        
        this.somaJuros += valorJuros;
      }
    }

    this.ultimaRenda = this.ultimoBeneficioDevidoAntesProporcionalidade;
    this.somaVincendas = this.calcularVincendas();
    this.somaDevidaJudicialmente = this.somaDiferencaCorrigida + this.somaJuros;
    this.somaTotalSegurado = this.somaDevidaJudicialmente + this.somaVincendas;
    this.calcularAcordoJudicial();

    return tableData;
  }

  //Seção 3.1
  getIndiceReajusteValoresDevidos(dataCorrente){
    if(this.dataCessacaoDevido != null && dataCorrente > this.dataCessacaoDevido)
      return {reajuste: 1.0, reajusteOs: 0.0};

    let reajuste = 0.0;
    let indiceObjCorrente = this.Indice.getByDate(dataCorrente);

    let indiceReajuste = 0;
    let indiceReajusteOs = 0;

    if(indiceObjCorrente == undefined){
      reajuste = 0;
    }else{
      indiceReajuste = indiceObjCorrente.indice == null  ? 1 : indiceObjCorrente.indice;
      indiceReajusteOs = indiceObjCorrente.indice_os == null ? 1 : indiceObjCorrente.indice_os;

      reajuste = indiceReajuste;
    }
    
    if (dataCorrente <= this.dataSimplificada  &&
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
    if (dataCorrente.isSame('1994-03-01','month')) {
      reajuste = 1 / 661.0052;
      if (dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado)){
        reajuste = 1;
      }
    }

    let reajusteOS = 0.0;
    let dataPedidoBeneficioEsperado = moment(this.calculo.data_pedido_beneficio_esperado);
    if(this.isBuracoNegro(dataPedidoBeneficioEsperado) && dataCorrente < this.dataEfeitoFinanceiro){
      if(dataCorrente < moment('1991-09-01')){
        if(indiceObjCorrente == undefined){
          reajusteOS = 0;
        }else{
          reajusteOS = indiceReajusteOs;
        }
      }
      else if(indiceObjCorrente.indice){
        if(indiceObjCorrente == undefined){
          reajusteOS = 0;
        }else{
          reajusteOS = indiceReajuste;
        }
      }
      else{
        reajusteOS = 1;
      }
    }
    return  {reajuste: reajuste, reajusteOs: reajusteOS};
  }

  //Seção 3.2
  getIndiceReajusteValoresRecebidos(dataCorrente){
    if(this.dataCessacaoRecebido != null && dataCorrente > this.dataCessacaoRecebido)
      return {reajuste: 1.0, reajusteOs: 0.0};
    let reajuste = 0.0;
    let indiceObjCorrente = this.Indice.getByDate(dataCorrente);


    let indiceReajuste = 0;
    let indiceReajusteOs = 0;
    if(indiceObjCorrente == undefined){
      reajuste = 0;
    }else{
      indiceReajuste = indiceObjCorrente.indice == null  ? 1 : indiceObjCorrente.indice;
      indiceReajusteOs = indiceObjCorrente.indice_os == null ? 1 : indiceObjCorrente.indice_os;

      reajuste = indiceReajuste;
    }

    // chkIndice é o checkbox “calcular aplicando os índices de 2,28% em 06/1999 e 1,75% em 05/2004”
    let chkIndice = this.calculo.usar_indice_99_04;
    if (chkIndice) {
      if (dataCorrente == moment("1999-06-01")) {
        reajuste = reajuste * 1.0228;
      }
      if (dataCorrente == moment("2004-05-01")) {
        reajuste = reajuste * 1.0175;
      }
    }

    if (dataCorrente <= this.dataSimplificada &&
      moment(this.calculo.data_pedido_beneficio) < this.dataInicioBuracoNegro) {
      reajuste = 1;
    }
    else if (moment(this.calculo.data_pedido_beneficio) <= this.dataInicioBuracoNegro &&
      dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado)) {
      reajuste = 2.198234;
    }

    if (this.primeiroReajusteRecebidos == -1 && reajuste != 1) {
       this.primeiroReajusteRecebidos = 1;
    }

    if (dataCorrente == moment(this.calculo.data_pedido_beneficio) && moment(this.calculo.data_pedido_beneficio) == this.dataInicioCalculo) {
      reajuste = 1;
    }
    if (dataCorrente.isSame('1994-03-01', 'month')) {
      reajuste = 1 / 661.0052;
      if (dataCorrente == moment(this.calculo.data_pedido_beneficio)) {
        reajuste = 1;
      }
    }

    let reajusteOS = 0.0;
    let dataPedidoBeneficio = moment(this.calculo.data_pedido_beneficio);
    if(this.isBuracoNegro(dataPedidoBeneficio) && dataCorrente < this.dataEfeitoFinanceiro){
      if(dataCorrente < moment('1991-09-01')){
        if(indiceObjCorrente == undefined){
          reajusteOS = 0;
        }else{
          reajusteOS = indiceReajusteOs;
        }
      }
      else if(indiceObjCorrente.indice){
        if(indiceObjCorrente == undefined){
          reajusteOS = 0;
        }else{
          reajusteOS = indiceReajuste;
        }
      }
      else{
        reajusteOS = 1;
      }
    }
    return  {reajuste: reajuste, reajusteOs: reajusteOS};
  }

  //Seção 3.3
  getBeneficioDevido(dataCorrente, reajusteObj, resultsObj){
    let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    let siglaDataCorrente = moedaDataCorrente.sigla;
    let irtDevidoSimplificado89 = 1;

    let rmiDevidos = parseFloat(this.calculo.valor_beneficio_esperado);
    let beneficioDevido = 0.0;
    let dib = moment(this.calculo.data_pedido_beneficio_esperado);
    let dibMoeda = this.Moeda.getByDate(dib);
    let equivalencia89Moeda = this.Moeda.getByDate(this.dataEquivalenciaMinimo89);

    if(dib < this.dataInicioBuracoNegro){
      irtDevidoSimplificado89 =  rmiDevidos / dibMoeda.salario_minimo;
      rmiDevidos = irtDevidoSimplificado89 * equivalencia89Moeda.salario_minimo;
    }

    if(dataCorrente > this.dataInicioCalculo){
      beneficioDevido = this.ultimoBeneficioDevidoAntesProporcionalidade;
    }else{
      beneficioDevido = rmiDevidos;
      this.beneficioDevidoOs = beneficioDevido;
    }

    //aplicarReajusteUltimo = 1 somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
    if(dataCorrente <= this.dataSimplificada && dib < this.dataInicioBuracoNegro){
      beneficioDevido = irtDevidoSimplificado89 * moedaDataCorrente.salario_minimo;
      if(this.aplicarReajusteUltimoDevido){
        beneficioDevido = this.beneficioDevidoAnterior;
      }
    }

    // Nas próximas 5 condições devem ser aplicados os beneficios devidos dos meses especificados entre os colchetes;
    if ((dataCorrente.isSame('2006-08-01')||
        dataCorrente.isSame('2000-06-01')||
        dataCorrente.isSame('2001-06-01')||
        dataCorrente.isSame('2002-06-01')||
        dataCorrente.isSame('2003-06-01')) && this.beneficioDevidoSalvo != undefined) {
      beneficioDevido = this.beneficioDevidoSalvo;
    }

    if (this.calculo.tipo_aposentadoria == '11') { //11 = 'LOAS - beneficio salario minimo'
      beneficioDevido = moedaDataCorrente.salario_minimo;
    } else {
      beneficioDevido *= reajusteObj.reajuste; //Reajuse de devidos, calculado na seção 2.1
    }

    this.beneficioDevidoOs = this.beneficioDevidoOs * reajusteObj.reajuste;
    let indiceSuperior = false;
    // algortimo buracoNegro definida na seção de algortimos úteis.
    if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
      if (dataCorrente.isSame(this.dataEfeitoFinanceiro, 'month')) {
        //Inserir indice superior *
        indiceSuperior = true;
        this.beneficioDevidoAposRevisao *= reajusteObj.reajuste;
        beneficioDevido = this.beneficioDevidoAposRevisao;
      } else if (dataCorrente < this.dataEfeitoFinanceiro) {
        beneficioDevido = this.beneficioDevidoOs;
        this.beneficioDevidoAposRevisao *= reajusteObj.reajusteOs;
      }else{
        this.beneficioDevidoAposRevisao *= reajusteObj.reajuste;
      }
    }else{
      this.beneficioDevidoAposRevisao *= reajusteObj.reajuste;
    }

    if (dataCorrente.isSame(this.dataCorteCruzado, "month") || dataCorrente.isSame(this.dataCorteCruzadoNovo, "month") || dataCorrente.isSame(this.dataCorteCruzeiroReal, "month")){
      beneficioDevido /= 1000;
      this.beneficioDevidoOs /= 1000;
      this.beneficioDevidoAposRevisao /= 1000;
    }

    let dataPedidoBeneficioEsperado = moment(this.calculo.data_pedido_beneficio_esperado);
    // taxa_ajuste_maxima_esperada definida no CRUD         
    if (this.calculo.taxa_ajuste_maxima_esperada != undefined &&
      this.calculo.taxa_ajuste_maxima_esperada > 1) {
      if (this.dataComecoLei8870 <= dataPedidoBeneficioEsperado &&
        dataPedidoBeneficioEsperado <= this.dataFimLei8870 &&
        dataCorrente == this.dataAplicacao8870) {
        beneficioDevido *= parseFloat(this.calculo.taxa_ajuste_maxima_esperada);
      }

      if (dataPedidoBeneficioEsperado >= this.dataLei8880 && this.primeiroReajusteDevidos == 1) {
        beneficioDevido *= parseFloat(this.calculo.taxa_ajuste_maxima_esperada);
        this.primeiroReajusteDevidos = 0;
      }
    }

    // AplicarTetosEMinimos Definido na seção de algoritmos úteis.
    let beneficioDevidoAjustado = this.aplicarTetosEMinimos(beneficioDevido, dataCorrente, dataPedidoBeneficioEsperado, 'Devido');
    this.beneficioDevidoAposRevisao = this.aplicarTetosEMinimos(this.beneficioDevidoAposRevisao, dataCorrente, dataPedidoBeneficioEsperado, 'Devido');
    this.ultimoBeneficioDevidoAntesProporcionalidade = beneficioDevidoAjustado;

    // Caso diasProporcionais for diferente de 1, inserir subindice ‘p’. O algoritmo está definido na seção de algoritmos úteis.
    let diasProporcionais = this.calcularDiasProporcionais(dataCorrente, dataPedidoBeneficioEsperado);
    let beneficioDevidoFinal = beneficioDevidoAjustado * diasProporcionais;

    if(dataCorrente.isSame(moment('2017-01-01'), 'year')){
      if(parseFloat(beneficioDevidoFinal.toFixed(3)) ===  parseFloat(moedaDataCorrente.salario_minimo) + 0.904){
        beneficioDevidoFinal = parseFloat(moedaDataCorrente.salario_minimo);
        this.ultimoBeneficioDevidoAntesProporcionalidade = parseFloat(moedaDataCorrente.salario_minimo);
      }
    }

    if(dataCorrente.isSame(moment('2018-01-01'), 'year')){
      if(parseFloat(beneficioDevidoFinal.toFixed(3)) ===  parseFloat(moedaDataCorrente.salario_minimo) + 2.396){
        beneficioDevidoFinal = parseFloat(moedaDataCorrente.salario_minimo);
        this.ultimoBeneficioDevidoAntesProporcionalidade = parseFloat(moedaDataCorrente.salario_minimo);
      }
    }

    if(dataCorrente.isSame(this.dataFinal, 'month')){
      let proporcionalidade = this.dataFinal.date() / this.dataFinal.daysInMonth();
      beneficioDevidoFinal *= proporcionalidade;
      this.proporcionalidadeUltimaLinha = true;
    }else if(this.dataCessacaoDevido != null && dataCorrente.isSame(this.dataCessacaoDevido, 'month')){
      let proporcionalidade = this.dataCessacaoDevido.date() / this.dataCessacaoDevido.daysInMonth();
      beneficioDevidoFinal *= proporcionalidade;
      this.proporcionalidadeUltimaLinha = true;
    }

    let beneficioDevidoString = this.formatMoney(beneficioDevidoFinal, siglaDataCorrente);
    if(indiceSuperior){
      beneficioDevidoString += '*'
    }

    let minimoAplicado = false;
    if(beneficioDevidoAjustado == moedaDataCorrente.teto){
      // Ajustado para o teto. Adicionar subindice ‘T’ no valor do beneficio
      beneficioDevidoString += ' -<br>  T';
    }else if(beneficioDevidoAjustado ==  moedaDataCorrente.salario_minimo){
      // Ajustado para o salario minimo. Adicionar subindice ‘M’ no valor do beneficio
      beneficioDevidoString += ' -<br> M';
      minimoAplicado = true;
    } 

    if(diasProporcionais != 1){
      beneficioDevidoString += ' <br>p';
    }

    this.aplicarReajusteUltimoDevido = false;
    //a condição abaixo só é executada quando o valor aplicado é o salario minimo
    if(minimoAplicado){
      //aplicarReajusteUltimoDevido somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
      //esse valor sera usado na proxima chamada da função
      if(this.ultimoSalarioMinimoDevido != beneficioDevidoAjustado){
        this.aplicarReajusteUltimoDevido = true;
      }
      this.ultimoSalarioMinimoDevido = beneficioDevidoAjustado;
    }

    if (dataCorrente.isSame('2006-03-01') ||
        dataCorrente.isSame('2000-04-01') ||
        dataCorrente.isSame('2001-04-01') ||
        dataCorrente.isSame('2002-04-01') ||
        dataCorrente.isSame('2003-04-01')) {
      this.beneficioDevidoSalvo = beneficioDevidoFinal;
    }

    resultsObj.resultString = beneficioDevidoString;
    this.beneficioDevidoAnterior = beneficioDevidoFinal;
    return beneficioDevidoFinal;
  }

  //Seção 3.4
  getBeneficioRecebido(dataCorrente, reajusteObj, resultsObj){
    let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    let siglaDataCorrente = moedaDataCorrente.sigla;
    let irtRecebidoSimplificado89 = 1;

    if(this.dataCessacaoRecebido != null && dataCorrente > this.dataCessacaoRecebido){
      resultsObj.resultString = this.formatMoney(0.0, siglaDataCorrente);
      return 0.0;
    }

    let rmiRecebidos = parseFloat(this.calculo.valor_beneficio_concedido);
    let beneficioRecebido = 0.0;
    let dib = moment(this.calculo.data_pedido_beneficio);
    let dibMoeda = this.Moeda.getByDate(dib);
    let equivalencia89Moeda = this.Moeda.getByDate(this.dataEquivalenciaMinimo89);

    if(dib < this.dataInicioBuracoNegro){
      irtRecebidoSimplificado89 =  rmiRecebidos / dibMoeda.salario_minimo;
      rmiRecebidos = irtRecebidoSimplificado89 * equivalencia89Moeda.salario_minimo;
    }

    if(dataCorrente > this.dataInicioCalculo){
      beneficioRecebido = this.ultimoBeneficioRecebidoAntesProporcionalidade;
    }else{
      beneficioRecebido = rmiRecebidos;
      this.beneficioRecebidoOs = beneficioRecebido;
    }

    if(dataCorrente <= this.dataSimplificada && dib < this.dataInicioBuracoNegro){
      beneficioRecebido = irtRecebidoSimplificado89 * moedaDataCorrente.salario_minimo;
      if(this.aplicarReajusteUltimoRecebido){
        beneficioRecebido = this.beneficioRecebidoAnterior;
      }
    }

    // Nas próximas 5 condições devem ser aplicados os beneficios devidos dos meses especificados entre os colchetes
    if ((dataCorrente.isSame('2006-08-01')||
        dataCorrente.isSame('2000-06-01')||
        dataCorrente.isSame('2001-06-01')||
        dataCorrente.isSame('2002-06-01')||
        dataCorrente.isSame('2003-06-01')) && this.beneficioRecebidoSalvo != undefined) {
      beneficioRecebido = this.beneficioRecebidoSalvo;
    }

    if (this.calculo.tipo_aposentadoria_recebida == '11') { //11: LOAS - beneficio salario minimo'
      beneficioRecebido = moedaDataCorrente.salario_minimo;
    } else {
      beneficioRecebido *= reajusteObj.reajuste;
    }

    this.beneficioRecebidoOs = this.beneficioRecebidoOs * reajusteObj.reajuste;
    let indiceSuperior = false;
    if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio))) {
      if (dataCorrente.isSame(this.dataEfeitoFinanceiro, 'month')) {
        // INSERIR ÍNDICE SUPERIOR ‘*’
        indiceSuperior = true;
        this.beneficioRecebidoAposRevisao *= reajusteObj.reajuste;
        beneficioRecebido = this.beneficioRecebidoAposRevisao;
        //beneficioRecebido = parseFloat(this.calculo.valor_beneficio_concedido_apos_revisao) * reajusteObj.reajuste;
      } else if (dataCorrente < this.dataEfeitoFinanceiro) {
        beneficioRecebido = this.beneficioRecebidoOs;
        this.beneficioRecebidoAposRevisao *= reajusteObj.reajusteOs;
        //beneficioRecebido = rmiRecebidos * reajusteObj.reajuste;
      }else{
        this.beneficioRecebidoAposRevisao *= reajusteObj.reajuste;
      }
    }else{
      this.beneficioRecebidoAposRevisao *= reajusteObj.reajuste;
    }

    if (dataCorrente.isSame(this.dataCorteCruzado, "month") || dataCorrente.isSame(this.dataCorteCruzadoNovo, "month") || dataCorrente.isSame(this.dataCorteCruzeiroReal, "month")){
      beneficioRecebido /= 1000;
      this.beneficioRecebidoOs /= 1000;
      this.beneficioRecebidoAposRevisao /= 1000;
    }

    let dataPedidoBeneficio = moment(this.calculo.data_pedido_beneficio);

    if (this.calculo.taxa_ajuste_maxima_concedida != undefined && this.calculo.taxa_ajuste_maxima_concedida > 1) {
      if(this.dataComecoLei8870 <= dataPedidoBeneficio && 
         dataPedidoBeneficio <= this.dataFimLei8870 && 
         dataCorrente == this.dataAplicacao8870) {
        beneficioRecebido *= parseFloat(this.calculo.taxa_ajuste_maxima_concedida);
      }

      if(dataPedidoBeneficio >= this.dataLei8880 && this.primeiroReajusteRecebidos == 1) {
        beneficioRecebido *= parseFloat(this.calculo.taxa_ajuste_maxima_concedida);
        this.primeiroReajusteRecebidos = 0;
      }
    }

    let chkBeneficioNaoConcedido = this.calculo.beneficio_nao_concedido;
    if (chkBeneficioNaoConcedido) {
      beneficioRecebido = 0;
    }

    // AplicarTetosEMinimos Definido na seção de algoritmos úteis.
    let beneficioRecebidoAjustado = this.aplicarTetosEMinimos(beneficioRecebido, dataCorrente, dataPedidoBeneficio, 'Recebido');
    this.beneficioRecebidoAposRevisao = this.aplicarTetosEMinimos(this.beneficioRecebidoAposRevisao, dataCorrente, dataPedidoBeneficio, 'Recebido');
    this.ultimoBeneficioRecebidoAntesProporcionalidade = beneficioRecebidoAjustado;

    // Caso diasProporcionais for diferente de 1, inserir subindice ‘p’. O algoritmo está definido na seção de algoritmos úteis.
    let diasProporcionais = this.calcularDiasProporcionais(dataCorrente, dataPedidoBeneficio);
    let beneficioRecebidoFinal = beneficioRecebidoAjustado * diasProporcionais;

    if(dataCorrente.isSame(this.dataFinal, 'month')){
      let proporcionalidade = this.dataFinal.date() / this.dataFinal.daysInMonth();
      beneficioRecebidoFinal *= proporcionalidade;
      this.proporcionalidadeUltimaLinha = true;
    }else if(this.dataCessacaoRecebido != null && dataCorrente.isSame(this.dataCessacaoRecebido, 'month')){
      let proporcionalidade = this.dataCessacaoRecebido.date() / this.dataCessacaoRecebido.daysInMonth();
      beneficioRecebidoFinal *= proporcionalidade;
      //this.proporcionalidadeUltimaLinha = true;
    }

    // if(dataCorrente.isSame(moment('2017-01-01'), 'year')){
    //   if(parseFloat(beneficioRecebidoFinal.toFixed(3)) ===  parseFloat(moedaDataCorrente.salario_minimo) + 0.904){
    //     beneficioRecebidoFinal = parseFloat(moedaDataCorrente.salario_minimo);
    //     this.ultimoBeneficioRecebidoAntesProporcionalidade = parseFloat(moedaDataCorrente.salario_minimo);
    //   }
    // }

    let beneficioRecebidoString = this.formatMoney(beneficioRecebidoFinal, siglaDataCorrente);
    if(indiceSuperior){
      beneficioRecebidoString += '*'
    }

    let minimoAplicado = false;
    if(beneficioRecebidoAjustado == moedaDataCorrente.teto){
      // Ajustado para o teto. Adicionar subindice ‘T’ no valor do beneficio
      beneficioRecebidoString += ' -<br>  T';
    }else if(beneficioRecebidoAjustado ==  moedaDataCorrente.salario_minimo){
      // Ajustado para o salario minimo. Adicionar subindice ‘M’ no valor do beneficio
      beneficioRecebidoString += ' -<br> M';
      minimoAplicado = true;
    }  

    if(diasProporcionais != 1){
      beneficioRecebidoString += ' <br>p';
    }

    this.aplicarReajusteUltimoRecebido = false;
    //a condição abaixo só é executada quando o valor aplicado é o salario minimo
    if(minimoAplicado){
      //aplicarReajusteUltimoRecebido somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
      //esse valor sera usado na proxima chamada da função
      if(this.ultimoSalarioMinimoRecebido != beneficioRecebidoAjustado){
        this.aplicarReajusteUltimoRecebido = true;
      }
      this.ultimoSalarioMinimoRecebido = beneficioRecebidoAjustado;
    }

    if (dataCorrente.isSame('2006-03-01') ||
        dataCorrente.isSame('2000-04-01') ||
        dataCorrente.isSame('2001-04-01') ||
        dataCorrente.isSame('2002-04-01') ||
        dataCorrente.isSame('2003-04-01')) {
      this.beneficioRecebidoSalvo = beneficioRecebidoFinal;
    }

    resultsObj.resultString = beneficioRecebidoString;
    this.beneficioRecebidoAnterior = beneficioRecebidoFinal;
    return beneficioRecebidoFinal;
  }

  //Seção 3.5
  getBeneficioDevidoTetos(dataCorrente, reajusteObj, resultsObj){
    let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    let siglaDataCorrente = moedaDataCorrente.sigla;
    if(this.dataCessacaoDevido != null && dataCorrente > this.dataCessacaoDevido){
      resultsObj.resultString = this.formatMoney(0.0, siglaDataCorrente);
      return 0.0;
    }

    let rmiDevidosTetos = parseFloat(this.calculo.valor_beneficio_esperado);
    let beneficioDevidoTetos = rmiDevidosTetos;
    let beneficioDevidoTetosSemLimite = rmiDevidosTetos;
    // aplicarReajusteUltimo = 1 somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
    if(!(dataCorrente <= this.dataSimplificada && moment(this.calculo.data_pedido_beneficio_esperado) < this.dataInicioBuracoNegro)
       && this.aplicarReajusteUltimoDevidoTeto ){
      beneficioDevidoTetos = this.beneficioDevidoAnteriorTeto; // = beneficioDevido do mes anterior antes do ajuste;
    }

    // Nas próximas 5 condições devem ser aplicados os beneficios devidos dos meses especificados entre os colchetes
    if (dataCorrente.isSame('2006-08-01')) {// 08/2006
      //beneficioDevidoTetos = beneficioDevidoTeto[04/2006];
      return this.getBeneficioDevidoTetos(moment('2006-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2000-06-01')) {//06/2000
      //beneficioDevidoTetos = beneficioDevidoTeto[04/2000];
      return this.getBeneficioDevidoTetos(moment('2000-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2001-06-01')) {//06/2001
      //beneficioDevidoTetos = beneficioDevidoTeto[04/2001];
      return this.getBeneficioDevidoTetos(moment('2001-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2002-06-01')) {//06/2002
      //beneficioDevidoTetos = beneficioDevidoTeto[04/2002];
      return this.getBeneficioDevidoTetos(moment('2002-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2003-06-01')) {//06/2003
      //beneficioDevidoTetos = beneficioDevidoTeto[04/2003];
      return this.getBeneficioDevidoTetos(moment('2003-04-01'), reajusteObj, resultsObj);
    }

    // algortimo buracoNegro definida na seção de algortimos úteis.
    let indiceSuperior = false;
    if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
      if (dataCorrente == this.dataEfeitoFinanceiro) {
        // INSERIR ÍNDICE SUPERIOR ‘*’
        indiceSuperior = true;
        beneficioDevidoTetos = parseFloat(this.calculo.valor_beneficio_esperado_apos_revisao) *  reajusteObj.reajusteOs;
      }else if (dataCorrente < this.dataEfeitoFinanceiro) {
        beneficioDevidoTetos = rmiDevidosTetos * reajusteObj.reajuste;
      }
    }

    if (dataCorrente == this.dataCorteCruzado || dataCorrente == this.dataCorteCruzadoNovo || dataCorrente == this.dataCorteCruzeiroReal){
      beneficioDevidoTetos /= 1000;
    }

    // taxa_ajuste_maxima_esperada definida no CRUD         
    if (this.calculo.taxa_ajuste_maxima_esperada > 1) {
      if(this.dataComecoLei8870 <= moment(this.calculo.data_pedido_beneficio_esperado) && 
         moment(this.calculo.data_pedido_beneficio_esperado) <= this.dataFimLei8870 && 
         dataCorrente == this.dataAplicacao8870) {
        beneficioDevidoTetos *= parseFloat(this.calculo.taxa_ajuste_maxima_esperada);
      }
      if(moment(this.calculo.data_pedido_beneficio_esperado) >= this.dataLei8880 && this.primeiroReajusteDevidos == 1) {
        beneficioDevidoTetos *= parseFloat(this.calculo.taxa_ajuste_maxima_esperada);
        this.primeiroReajusteDevidos = 0;
      }
    }

    let tetoDevidos = parseFloat(moedaDataCorrente.teto);

    if (dataCorrente == this.dataPrimeiroTetoJudicial) { // Comparação de mês e ano, ignorar dia
      tetoDevidos = 1200.0;
      if(this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
        let beneficioDevidoPosRevisao = 0;
        if (this.calculo.valor_beneficio_esperado_revisao){
          beneficioDevidoPosRevisao = parseFloat(this.calculo.valor_beneficio_esperado_revisao);
        }
        if (dataCorrente < this.dataEfeitoFinanceiro) {
          beneficioDevidoPosRevisao *= reajusteObj.reajusteOs;
        } else {
          beneficioDevidoPosRevisao *= reajusteObj.reajuste;
        }
          beneficioDevidoTetos = beneficioDevidoPosRevisao;
        }
    }

    if (dataCorrente == this.dataSegundoTetoJudicial) { // Comparação de mês e ano, ignorar dia
      tetoDevidos = 2400.0;
      if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
        let beneficioDevidoPosRevisao = 0;
        if(this.calculo.valor_beneficio_concedido_revisao){
          beneficioDevidoPosRevisao = parseFloat(this.calculo.valor_beneficio_concedido_revisao);
        }
        if (dataCorrente < this.dataEfeitoFinanceiro) {
          beneficioDevidoPosRevisao *= reajusteObj.reajusteOs;
        } else {
          beneficioDevidoPosRevisao *= reajusteObj.reajuste;
        }
        beneficioDevidoTetos = beneficioDevidoPosRevisao;
      }else{
        beneficioDevidoTetos = beneficioDevidoTetosSemLimite;
      }
    }

    let beneficioDevidoTetosAjustado = this.aplicarTetosEMinimosTetos(beneficioDevidoTetos, dataCorrente,moment(this.calculo.data_pedido_beneficio_esperado), 'Devido', tetoDevidos);
    let beneficioDevidoTetosString = this.formatMoney(beneficioDevidoTetosAjustado, siglaDataCorrente);

    if(indiceSuperior){
      beneficioDevidoTetosString += '*'
    }

    let minimoAplicado = false;
    if(beneficioDevidoTetosAjustado < beneficioDevidoTetos){
      // Ajustado para o teto. Adicionar subindice ‘T’ no valor do beneficio
      beneficioDevidoTetosString += ' -<br> T';
    }else if(beneficioDevidoTetosAjustado > beneficioDevidoTetos){
      // Ajustado para o salario minimo. Adicionar subindice ‘M’ no valor do beneficio
      beneficioDevidoTetosString += ' -<br> M';
      minimoAplicado = true;
    }

    this.aplicarReajusteUltimoDevidoTeto = false;
    //a condição abaixo só é executada quando o valor aplicado é o salario minimo
    if(minimoAplicado){
      //aplicarReajusteUltimoDevido somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
      //esse valor sera usado na proxima chamada da função
      if(this.ultimoSalarioMinimoDevidoTeto != beneficioDevidoTetosAjustado){
        this.ultimoSalarioMinimoDevidoTeto = beneficioDevidoTetosAjustado;
        this.aplicarReajusteUltimoDevidoTeto = true;
      }
    }

    resultsObj.resultString = beneficioDevidoTetosString;
    this.beneficioDevidoAnteriorTeto = beneficioDevidoTetosAjustado;
    return beneficioDevidoTetosAjustado;
  }

  //Seção 3.6
  getBeneficioRecebidoTetos(dataCorrente, reajusteObj, resultsObj){
    let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    let siglaDataCorrente = moedaDataCorrente.sigla;
    if(this.dataCessacaoRecebido != null && dataCorrente > this.dataCessacaoRecebido){
      resultsObj.resultString = this.formatMoney(0.0, siglaDataCorrente);
      return 0.0;
    }

    let rmiRecebidosTetos = parseFloat(this.calculo.valor_beneficio_concedido);
    let beneficioRecebidoTetos = rmiRecebidosTetos;

    // aplicarReajusteUltimo = 1 somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor recebido
    if (!(dataCorrente <= this.dataSimplificada && moment(this.calculo.data_pedido_beneficio) < this.dataInicioBuracoNegro) 
        && this.aplicarReajusteUltimoRecebidoTeto) {
      beneficioRecebidoTetos = this.beneficioRecebidoAnteriorTeto; // = beneficioDevido do mes anterior antes do ajuste;
    }

    // Nas próximas 5 condições devem ser aplicados os beneficios devidos dos meses especificados entre os colchetes
    if (dataCorrente.isSame('2006-08-01')) {// 08/2006
      //beneficioRecebidoTetos = beneficioRecebido[04/2006];
      return this.getBeneficioRecebidoTetos(moment('2006-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2000-06-01')) {//06/2000
      //beneficioRecebidoTetos = beneficioRecebido[04/2000];
      return this.getBeneficioRecebidoTetos(moment('2000-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2001-06-01')) {//06/2001
      //beneficioRecebidoTetos = beneficioRecebido[04/2001];
      return this.getBeneficioRecebidoTetos(moment('2001-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2002-06-01')) {//06/2002
      //beneficioRecebidoTetos = beneficioRecebido[04/2002];
      return this.getBeneficioRecebidoTetos(moment('2002-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2003-06-01')) {//06/2003
      //beneficioRecebidoTetos = beneficioRecebido[04/2003];
      return this.getBeneficioRecebidoTetos(moment('2003-04-01'), reajusteObj, resultsObj);
    }

    if (this.calculo.tipo_aposentadoria_recebida != 11) { //11: LOAS - beneficio salario minimo'
      beneficioRecebidoTetos *= reajusteObj.reajuste;
    }

    let indiceSuperior = false;
    if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio))) {
      if (dataCorrente == this.dataEfeitoFinanceiro) {
        // INSERIR ÍNDICE SUPERIOR ‘*’
        indiceSuperior = true;
        beneficioRecebidoTetos = parseFloat(this.calculo.valor_beneficio_concedido_apos_revisao) * reajusteObj.reajusteOs;
      } else if (dataCorrente < this.dataEfeitoFinanceiro) {
        beneficioRecebidoTetos = rmiRecebidosTetos * reajusteObj.reajuste;
      }
    }

    if (dataCorrente == this.dataCorteCruzado || dataCorrente == this.dataCorteCruzadoNovo || dataCorrente == this.dataCorteCruzeiroReal){
      beneficioRecebidoTetos /= 1000;
    }

    if (this.calculo.taxa_ajuste_maxima_concedida > 1) {
      if(this.dataComecoLei8870 <= moment(this.calculo.data_pedido_beneficio) && 
         moment(this.calculo.data_pedido_beneficio) <= this.dataFimLei8870 && 
         dataCorrente == this.dataAplicacao8870) {
        beneficioRecebidoTetos *= parseFloat(this.calculo.taxa_ajuste_maxima_concedida);
      }

      if(this.calculo.data_pedido_beneficio_esperado >= this.dataLei8880 && this.primeiroReajusteRecebidos == 1) {
        beneficioRecebidoTetos *= parseFloat(this.calculo.taxa_ajuste_maxima_concedida);
        this.primeiroReajusteRecebidos = 0;
      }
    }
 
    let tetoRecebidos = moedaDataCorrente.teto;

    if (dataCorrente == this.dataPrimeiroTetoJudicial) { // Comparação de mês e ano, ignorar dia
      tetoRecebidos = 1081.50;
      if(this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
        let beneficioRecebidoPosRevisao = 0;
        if (this.calculo.valor_beneficio_concedido_revisao){
          beneficioRecebidoPosRevisao = parseFloat(this.calculo.valor_beneficio_concedido_revisao);
        }
        if (dataCorrente < this.dataEfeitoFinanceiro) {
          beneficioRecebidoPosRevisao *= reajusteObj.reajusteOs;
        } else {
          beneficioRecebidoPosRevisao *= reajusteObj.reajuste;
        }
          beneficioRecebidoTetos = beneficioRecebidoPosRevisao;
        }
    }

    if (dataCorrente == this.dataSegundoTetoJudicial) { // Comparação de mês e ano, ignorar dia
      if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
        let beneficioRecebidoPosRevisao = 0;
        if(this.calculo.valor_beneficio_concedido_revisao){
          beneficioRecebidoPosRevisao = parseFloat(this.calculo.valor_beneficio_concedido_revisao);
        }
        if (dataCorrente < this.dataEfeitoFinanceiro) {
          beneficioRecebidoPosRevisao *= reajusteObj.reajusteOs;
        } else {
          beneficioRecebidoPosRevisao *= reajusteObj.reajuste;
        }
          beneficioRecebidoTetos = beneficioRecebidoPosRevisao;
      }
    }
    let beneficioRecebidoTetosAjustado = this.aplicarTetosEMinimosTetos(beneficioRecebidoTetos, dataCorrente, moment(this.calculo.data_pedido_beneficio), 'Recebido', tetoRecebidos);
    let beneficioRecebidoTetosString = this.formatMoney(beneficioRecebidoTetosAjustado, siglaDataCorrente);

    if(indiceSuperior){
      beneficioRecebidoTetosString += '*'
    }
    let minimoAplicado = false;
    if(beneficioRecebidoTetosAjustado <= beneficioRecebidoTetos){
      // Ajustado para o teto. Adicionar subindice ‘T’ no valor do beneficio
      beneficioRecebidoTetosString += ' -<br> T';
    }else if(beneficioRecebidoTetosAjustado >= beneficioRecebidoTetos){
      // Ajustado para o salario minimo. Adicionar subindice ‘M’ no valor do beneficio
      beneficioRecebidoTetosString += ' -<br> M';
      minimoAplicado = true;
    }

    this.aplicarReajusteUltimoRecebidoTeto = false;
    //a condição abaixo só é executada quando o valor aplicado é o salario minimo
    if(minimoAplicado){
      //aplicarReajusteUltimoDevido somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
      //esse valor sera usado na proxima chamada da função
      if(this.ultimoSalarioMinimoRecebidoTeto != beneficioRecebidoTetosAjustado){
        this.ultimoSalarioMinimoRecebidoTeto = beneficioRecebidoTetosAjustado;
        this.aplicarReajusteUltimoRecebidoTeto = true;
      }
    }

    resultsObj.resultString = beneficioRecebidoTetosString;
    this.beneficioRecebidoAnteriorTeto = beneficioRecebidoTetosAjustado;
    return beneficioRecebidoTetosAjustado;
  }

  //Seção 3.7
  getCorrecaoMonetaria(dataCorrente) {
    let tipo_correcao = this.calculo.tipo_correcao;
    let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
    let moedaDataAtual = this.Moeda.getByDate(moment());
    let moedaDataCalculo = this.Moeda.getByDate(moment(this.calculo.data_calculo));

    let desindexador = 0.0;
    let correcaoMonetaria = 0.0;
    if (tipo_correcao == 'ipca') {
      desindexador = moedaDataAtual.ipca / moedaDataCalculo.ipca;
      correcaoMonetaria = moedaDataCorrente.ipca * desindexador;
    } else if (tipo_correcao == 'cam') {
      desindexador = moedaDataAtual.cam / moedaDataCalculo.cam;
      correcaoMonetaria = moedaDataCorrente.cam * desindexador;
    } else if (tipo_correcao == 'tr') {
      desindexador = moedaDataAtual.tr / moedaDataCalculo.tr;
      correcaoMonetaria = moedaDataCorrente.tr * desindexador;
    }
    let usar_deflacao = !this.calculo.nao_usar_deflacao;
    if (!usar_deflacao) {
      if (correcaoMonetaria < 1.0 && dataCorrente > moment('1994-06-01')) {
        correcaoMonetaria = 1;
      }
    }
    return correcaoMonetaria;
  }

  //Seção 3.8
  getJuros(dataCorrente) {
    let dataCitacaoReu = moment(this.calculo.data_citacao_reu);
    let chkBoxTaxaSelic = this.calculo.aplicar_juros_poupanca;
    let chkJurosMora = this.calculo.previo_interesse;
    let jurosAplicado = 0.0;
    let dataMesCitacaoReu = dataCitacaoReu.startOf('month').subtract(1, 'days');;//dataCitacaoReu no dia 1
    if (dataCorrente > dataMesCitacaoReu) {

      if (dataCorrente < this.dataJuros2003) {
        this.jurosCorrente -= this.jurosAntes2003;
      }

      if (this.dataJuros2003 <= dataCorrente && dataCorrente < this.dataJuros2009) {
        this.jurosCorrente -= this.jurosDepois2003;
      }

      if (dataCorrente >= this.dataJuros2009) {
        if (!chkBoxTaxaSelic) {
          if(this.soma == 1){
            this.jurosCorrente -= this.jurosDepois2009;
          }else{
            this.soma = 1;
          }
          
        } else {
          if (dataCorrente < this.dataSelic70) {
            this.jurosCorrente -= this.jurosDepois2009;
          } else {
            if(this.soma == 1){
              let moedaDataCorrente = this.Moeda.getByDate(dataCorrente);
              this.jurosCorrente -= parseFloat(moedaDataCorrente.juros_selic_70) / 100; //Carregado do BD na coluna da data corrente;
            }
          }
        }
      }
      jurosAplicado = this.jurosCorrente;
    }else{
      if(!chkJurosMora){
        if(dataCorrente != dataMesCitacaoReu){
          jurosAplicado = 0;
        }else{
          jurosAplicado = this.jurosCorrente;
        }
      }else{
        jurosAplicado = this.jurosCorrente;
      }
    }

    if (jurosAplicado < 0) {
      jurosAplicado = 0;
    }
    return jurosAplicado;
  }

  calcularJurosCorrente(){
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
        juros+= this.jurosDepois2009 * this.getDifferenceInMonthsRounded(this.dataJuros2009, this.dataSelic70.clone().subtract(1, 'days'));
        //juros += taxaTabelada de cada mes entre ('01/05/2012') e a this.calculo.data_calculo_pedido (data do calculo);
        let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
        for(let mes in mesesEntreSelicDataCalculo){
          let dateMes = moment(mes);
          let mesMoeda = this.Moeda.getByDate(dateMes);
          juros += parseFloat(mesMoeda.juros_selic_70) / 100;
        }
      }

    }else if (data < this.dataJuros2009) {
      //juros = calcular taxa entre 2003 e 2009 * numero de meses entre data e '01/07/2009' 
      juros = this.jurosDepois2003 * this.getDifferenceInMonths(this.dataJuros2009, data);

      if (!chkBoxTaxaSelic) {
        //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        juros += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
      } else {
        //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
        juros+= this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);

        //juros += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
        let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
        for(let mes in mesesEntreSelicDataCalculo){
          let dateMes = moment(mes);
          let mesMoeda = this.Moeda.getByDate(dateMes);
          juros += parseFloat(mesMoeda.juros_selic_70) / 100;
        }
      }
    }else {

      if (!chkBoxTaxaSelic) {
        //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        juros += this.jurosDepois2009 * this.getDifferenceInMonths(data, dataDoCalculo);
      } else {
        if(data >= this.dataSelic70){
          //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
          juros+= this.jurosDepois2009 * this.getDifferenceInMonths(data, dataDoCalculo);
        }else{
          juros += this.jurosDepois2009 * this.getDifferenceInMonths(data, this.dataSelic70);
          //juros += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo / 100;
          let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
          for(let mes in mesesEntreSelicDataCalculo){
            let dateMes = moment(mes);
            let mesMoeda = this.Moeda.getByDate(dateMes);
            juros += parseFloat(mesMoeda.juros_selic_70)/100;
          }
        }
      }
    }
    return juros;
  }

  //Seção 3.9
  getDiferencaCorrigidaJuros(dataCorrente, juros, diferencaCorrigida) {
    //Está coluna será definida pela soma da coluna diferença corrigida + o valor do Juros. 
    //O subíndice ‘(prescrita)’ deve ser adicionado quando houver prescrição.  
    //A prescrição é ocorre quando a data corrente tem mais de cinco anos de diferença da data_acao_judicial.

    let dataAcaoJudicial = moment(this.calculo.data_acao_judicial);
    let diferencaEmAnos = Math.abs(dataCorrente.diff(dataAcaoJudicial, 'years'));
    let diferencaCorrigidaJuros = juros + diferencaCorrigida;

    //Seção 3.10
    if(this.isTetos){
      diferencaCorrigidaJuros *= this.calcularDiasProporcionais(dataCorrente, moment(this.calculo.data_pedido_beneficio_esperado));
    }

    let diferencaCorrigidaJurosString = this.formatMoney(diferencaCorrigidaJuros);

    if(diferencaEmAnos >= 5){
      diferencaCorrigidaJurosString += '<br>(prescrita)';
    }
    return diferencaCorrigidaJurosString;
  }

  //Seção 4.2
  calcularVincendas(){
    let somaVincendos = this.ultimaDiferencaMensal;
    let data = moment(this.calculo.data_citacao_reu);
    let dataDoCalculo = moment(this.calculo.data_calculo_pedido);
    let maturidade = this.calculo.maturidade;
    let jurosVincendos = 0.0;

    let chkBoxTaxaSelic = this.calculo.aplicar_juros_poupanca;
    let chkboxBenefitNotGranted = this.calculo.beneficio_nao_concedido;

    if (this.dataInicioCalculo > data) {
      data = this.dataInicioCalculo;
    }

    if (data < this.dataJuros2003) {
      //jurosVincendos = Calcular o juros com a taxa anterior a 2003 * numero de meses (arredondado) entre data e '15/01/2003';
      jurosVincendos = this.jurosAntes2003 * this.getDifferenceInMonths(data, this.dataJuros2003);
      //jurosVincendos += calcular taxa entre 2003 e 2009 * numero de meses entre '15/01/2003' e '01/07/2009' 
      jurosVincendos += this.jurosDepois2003 * this.getDifferenceInMonths(this.dataJuros2003, this.dataJuros2009);
      if (!chkBoxTaxaSelic) {
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
      }else{
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);
        //jurosVincendos += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
        let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
        for(let mes of mesesEntreSelicDataCalculo){
          let dateMes = moment(mes);
          jurosVincendos += parseFloat(this.Moeda.getByDate(dateMes).juros_selic_70);
        }
      }
    }else if(data < this.dataJuros2009){
      //jurosVincendos = calcular taxa entre 2003 e 2009 * numero de meses entre data e '01/07/2009' 
      jurosVincendos = this.jurosDepois2003 * this.getDifferenceInMonths(data, this.dataJuros2009);
      if(!chkBoxTaxaSelic){
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
      }else{
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);
        //jurosVincendos += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
        let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
        for(let mes of mesesEntreSelicDataCalculo){
          let dateMes = moment(mes);
          jurosVincendos += parseFloat(this.Moeda.getByDate(dateMes).juros_selic_70);
        }
      }
    }else{
      if(!chkBoxTaxaSelic){
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo); 
      }else{
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);
        //jurosVincendos += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo / 100;
        let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
        for(let mes of mesesEntreSelicDataCalculo){
          let dateMes = moment(mes);
          jurosVincendos += parseFloat(this.Moeda.getByDate(dateMes).juros_selic_70) / 100;
        }
      }
    }

    if(chkboxBenefitNotGranted){
      somaVincendos = (somaVincendos * this.ultimaCorrecaoMonetaria) + (jurosVincendos * somaVincendos);
    }

    if (maturidade != 0) {
      if (this.calculo.data_cessacao != '0000-00-00') { // verifica se o calculo possui data de cessacao
        somaVincendos = this.ultimoBeneficioDevidoAntesProporcionalidade * maturidade; //Beneficio Devido da ultima linha antes da aplicação da proporcionalidade.
      }else{
        if (somaVincendos < 0) {
          somaVincendos = this.ultimaDiferencaMensal * maturidade;
        }else{
          somaVincendos = somaVincendos * maturidade;
        }
      }
    }else{
      somaVincendos = 0;
    }

    return somaVincendos;
  }

  //Seção 4.3
  calculoHonorarios(dataCorrente, juros, diferencaCorrigida){
    //Calcular Honorários para cada linha da tabela
    let honorarios = 0.0;
    let taxaAdvogadoInicio = null;
    let taxaAdvogadoFinal = null;
    let diferecaCorrigidaJuros = juros + diferencaCorrigida;
    if(this.calculo.taxa_advogado_inicio != ''){
      taxaAdvogadoInicio = moment(this.calculo.taxa_advogado_inicio);
    }
    if(this.calculo.taxa_advogado_final != ''){
      taxaAdvogadoFinal = moment(this.calculo.taxa_advogado_final);
    }

    if (this.calculo.percentual_taxa_advogado == '') {// Verificar se há valor para o percentual do advogado.
      honorarios = 0;
      // Aplicar a porcentagem quando a data corrente estiver no intervalo definido ou quando nenhuma data for definida
    }else if((taxaAdvogadoInicio <= dataCorrente && dataCorrente <= taxaAdvogadoFinal) || 
            (taxaAdvogadoInicio == null && taxaAdvogadoFinal == null)){
      honorarios = diferecaCorrigidaJuros * parseFloat(this.calculo.percentual_taxa_advogado);
    }else{
      honorarios = 0;
    }
    // Somar o valor dos honorários de cada linha da tabela, menos da ultima linha.
    return honorarios;
  }

  //Seção 4.4
  calcularAcordoJudicial() {
    let totalDevido = this.somaDiferencaCorrigida;
    let percentualAcordo = parseFloat(this.calculo.acordo_pedido);
    // Acordo percentual máximo 0.9;
    if (percentualAcordo > 0.9){
      percentualAcordo = 0.9;
    }

    this.valorAcordo = totalDevido * percentualAcordo;
    this.descontoAcordo = totalDevido -  this.valorAcordo;
  }

  //Seção 4.6
  calcularVincendosTetos() {
    let somaVincendosTetos = this.diferencaMensalTetos;
    let data = moment(this.calculo.data_citacao_reu);
    let dataDoCalculo = moment(this.calculo.data_calculo_pedido);
    let maturidade = this.calculo.maturidade;
    let jurosVincendos = 0.0;

    let chkBoxTaxaSelic = this.calculo.aplicar_juros_poupanca;
    let chkboxBenefitNotGranted = this.calculo.beneficio_nao_concedido;

    if (this.dataInicioCalculo > data) {
        data = this.dataInicioCalculo;
    }

    if (data < this.dataJuros2003) {
      //jurosVincendos = Calcular o juros com a taxa anterior a 2003 * numero de meses (arredondado) entre data e '15/01/2003';
      jurosVincendos = this.jurosAntes2003 * this.getDifferenceInMonths(data, this.dataJuros2003);
      //jurosVincendos += calcular taxa entre 2003 e 2009 * numero de meses entre '15/01/2003' e '01/07/2009' 
      jurosVincendos += this.jurosDepois2003 * this.getDifferenceInMonths(this.dataJuros2003, this.dataJuros2009);
      if (!chkBoxTaxaSelic) {
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
      }else{
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);
        //jurosVincendos += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
        let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
        for(let mes in mesesEntreSelicDataCalculo){
          let dateMes = moment(mes);
          let mesMoeda = this.Moeda.getByDate(dateMes);
          jurosVincendos += parseFloat(mesMoeda.juros_selic_70);
        }
      }
    }else if(data < this.dataJuros2009){
      //jurosVincendos = calcular taxa entre 2003 e 2009 * numero de meses entre data e '01/07/2009' 
      jurosVincendos = this.jurosDepois2003 * this.getDifferenceInMonths(data, this.dataJuros2009);
      if(!chkBoxTaxaSelic){
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo);
      }else{
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);
        //jurosVincendos += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
        let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
        for(let mes in mesesEntreSelicDataCalculo){
          let dateMes = moment(mes);
          let mesMoeda = this.Moeda.getByDate(dateMes);
          jurosVincendos += parseFloat(mesMoeda.juros_selic_70);
        }
      }
    }else{
      if(!chkBoxTaxaSelic){
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, dataDoCalculo); 
      }else{
        //jurosVincendos += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
        jurosVincendos += this.jurosDepois2009 * this.getDifferenceInMonths(this.dataJuros2009, this.dataSelic70);
        //jurosVincendos += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo / 100;
        let mesesEntreSelicDataCalculo = this.monthsBetween(this.dataSelic70, dataDoCalculo);
        for(let mes in mesesEntreSelicDataCalculo){
          let dateMes = moment(mes);
          let mesMoeda = this.Moeda.getByDate(dateMes);
          jurosVincendos += parseFloat(mesMoeda.juros_selic_70) / 100;
        }
      }
    }

    if(chkboxBenefitNotGranted){
      somaVincendosTetos = (somaVincendosTetos * this.ultimaCorrecaoMonetaria) + (jurosVincendos * somaVincendosTetos);
    }

    if (maturidade != 0) {
      somaVincendosTetos = somaVincendosTetos * maturidade;
    }else{
      somaVincendosTetos = 0;
    }

    return somaVincendosTetos;
  }
  
  //Seção 1
  setInicioRecebidosEDevidos() {
    this.dataInicioRecebidos = moment(this.calculo.data_pedido_beneficio);
    this.dataInicioDevidos = moment(this.calculo.data_pedido_beneficio_esperado);
    this.primeiraDataArrayMoeda = (this.dataInicioDevidos < this.dataInicioRecebidos) ? this.dataInicioDevidos : this.dataInicioRecebidos;
    this.beneficioDevidoAposRevisao = (this.calculo.valor_beneficio_esperado_revisao) ? this.calculo.valor_beneficio_esperado_revisao : 0;
    this.beneficioRecebidoAposRevisao = (this.calculo.valor_beneficio_concedido_revisao) ? this.calculo.valor_beneficio_concedido_revisao : 0;
    if (this.dataInicioRecebidos < this.dataInicioBuracoNegro) {
      this.dataInicioRecebidos = this.dataEquivalenciaMinimo89;
    }

    if (this.dataInicioDevidos < this.dataInicioBuracoNegro) {
      this.dataInicioDevidos = this.dataEquivalenciaMinimo89;
    }
    //dataInicioCalculo é o menor valor entre dataInicioDevidos e dataInicioRecebidos
    this.dataInicioCalculo = (this.dataInicioDevidos < this.dataInicioRecebidos) ? this.dataInicioDevidos : this.dataInicioRecebidos;
    //dataFinal é a data_calculo_pedido acrescido de um mês

    //this.dataFinal = (moment(this.calculo.data_calculo_pedido)).add(1, 'month');
    this.dataFinal = (moment(this.calculo.data_calculo_pedido));

    if(this.calculo.data_prevista_cessacao != '0000-00-00')
      this.dataCessacaoDevido = moment(this.calculo.data_prevista_cessacao);
    if(this.calculo.data_cessacao != '0000-00-00')
      this.dataCessacaoRecebido = moment(this.calculo.data_cessacao);

    this.jurosAntes2003 = this.calculo.previo_interesse_2003 / 100;
    this.jurosDepois2003 = this.calculo.pos_interesse_2003 / 100;
    this.jurosDepois2009 = this.calculo.pos_interesse_2009 / 100;
  }

  //Verifica se uma data esta no periodo do buraco negro
  isBuracoNegro(date){
    if(date >= this.dataInicioBuracoNegro && date <= this.dataFimBuracoNegro){
      return true;
    }
    return false;
  }

  //Retorna uma lista com os meses em formato string YYYY-MM-DD  entre dateStart e dateEnd
  monthsBetween(dateStart, dateEnd) {
    let startClone = dateStart.clone();
    let timeValues = [];
    while (dateEnd > startClone || startClone.format('M') === dateEnd.format('M')) {
      timeValues.push(startClone.format('YYYY-MM-DD'));
      startClone.add(1, 'month');
    }
    return timeValues;
  }

  //Seção 5.1
  calcularDiasProporcionais(dataCorrente, dib) {
    if (dataCorrente.isSame(dib, 'month')) //comparação de mês e ano
      //dib.date() é o dia do mês da dib
      return (31 - dib.date())/30;
    return 1;
  }

  //Seção 5.3
  aplicarTetosEMinimos(valorBeneficio, dataCorrente, dib, tipo) {
    let dataCorrenteMoeda = this.Moeda.getByDate(dataCorrente);
    let salMinimo = dataCorrenteMoeda.salario_minimo;
    let tetoSalarial = dataCorrenteMoeda.teto;
    let tipoAposentadoria = '';
    if (tipo == 'Recebido') {
      tipoAposentadoria = this.calculo.tipo_aposentadoria_recebida;
    }else{
      tipoAposentadoria = this.calculo.tipo_aposentadoria;
    }

    if (tipoAposentadoria == '7'){ //’Auxilio Acidente - 30%’
      salMinimo *= 0.3;
    }else if (tipoAposentadoria == '8') {//‘Auxilio Acidente - 40%’
      salMinimo *= 0.4;
    }else if (tipoAposentadoria == '5'){ //‘Auxilio Acidente Previdenciario- 50%’
      salMinimo *= 0.5;
    }else if (tipoAposentadoria == '9') {//‘Auxilio Acidente - 60%’
      salMinimo *= 0.6;
    }

    if (valorBeneficio <= salMinimo ){
      // Adicionar subindice ‘M’ no valor do beneficio
      return salMinimo;
    }
    if (valorBeneficio >= tetoSalarial && dib >= this.dataInicioBuracoNegro && !this.calculo.nao_aplicar_ajuste_maximo_98_2003) {
      // Adicionar subindice ‘T’ no valor do beneficio.
      return tetoSalarial;
    }
    return valorBeneficio;
  }

  //Seção 5.4
  aplicarTetosEMinimosTetos(valorBeneficio, dataCorrente, dib, tipo, tetoSalarial) {
    let dataCorrenteMoeda = this.Moeda.getByDate(dataCorrente);
    let salMinimo = dataCorrenteMoeda.salario_minimo;
    let tipoAposentadoria = '';
    if (tipo == 'Recebido') {
      tipoAposentadoria = this.calculo.tipo_aposentadoria_recebida;
    }else{
      tipoAposentadoria = this.calculo.tipo_aposentadoria;
    }

    if (tipoAposentadoria == '7'){ //’Auxilio Acidente - 30%’
      salMinimo *= 0.3;
    }else if (tipoAposentadoria == '8') {//‘Auxilio Acidente - 40%’
      salMinimo *= 0.4;
    }else if (tipoAposentadoria == '5'){ //‘Auxilio Acidente Previdenciario- 50%’
      salMinimo *= 0.5;
    }else if (tipoAposentadoria == '9') {//‘Auxilio Acidente - 60%’
      salMinimo *= 0.6;
    }

    if (valorBeneficio <= salMinimo ){
      // Adicionar subindice ‘M’ no valor do beneficio
      return salMinimo;
    }
    if (valorBeneficio >= tetoSalarial && dib >= this.dataInicioBuracoNegro && !this.calculo.nao_aplicar_ajuste_maximo_98_2003) {
      // Adicionar subindice ‘T’ no valor do beneficio.
      return tetoSalarial;
    }
    return valorBeneficio;
  }

  verificaAbonoProporcional(dib){
    let dibMonth = dib.month() + 1;
    if(dib.date() <= 16){
      dibMonth -= 1;
    }
    let proporcional = 1 - dibMonth/12;
    if(proporcional < 1){
      this.aplicaProporcionalDevidos = true;
    }else{
      this.aplicaProporcionalDevidos = false;
    }
    return proporcional;
  }

  //Retorna a diferença em meses completos entre as datas passadas como parametro. Se nao passar dois argumentos, compara a data passada com a atual
  getDifferenceInMonths(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.floor(difference);
  }

  //Retorna a diferença em meses completos entre as datas passadas como parametro. Se nao passar dois argumentos, compara a data passada com a atual
  getDifferenceInMonthsRounded(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.round(difference);
  }

  formatDatetimeToDate(dataString){
    let date = dataString.split(' ')[0];
    let splited_date = date.split('-');
    let ret = splited_date[2] + '/' +splited_date[1] + '/' + splited_date[0];
    if(ret == '00/00/0000'){
      return '--';
    }
    return ret;
  }

  formatDate(dataString){
    if(dataString != '0000-00-00'){
        let splited_date = dataString.split('-');
        return splited_date[2] + '/' +splited_date[1] + '/' + splited_date[0];
    }
    return '--'
  }

  formatPercent(value, n_of_decimal = 0){
    value = parseFloat(value) * 100;
    return this.formatDecimal(value, n_of_decimal) + '%';
  }

  formatMoney(value, sigla='R$'){
    return sigla + this.formatDecimal(value, 2);
  }

  formatRMI(value, type){
    let sigla = '';
    let moeda;
    if(type == 'Devidos'){
      moeda = this.Moeda.getByDate(moment(this.calculo.data_pedido_beneficio_esperado));
    }else if(type == 'Recebidos'){
      moeda = this.Moeda.getByDate(moment(this.calculo.data_pedido_beneficio));
    }
    sigla = moeda.sigla;
    return this.formatMoney(value, sigla);
  }

  formatDecimal(value, n_of_decimal_digits){
    value = parseFloat(value);
    return (value.toFixed(parseInt(n_of_decimal_digits))).replace('.', ',');
  }

  formatIndicesReajustes(reajusteObj, dataCorrente, tipo){
    let stringIndice = '';
    let dib;
    if(tipo == 'Recebido'){
      dib = moment(this.calculo.data_pedido_beneficio);
    }else if (tipo == 'Devido') {
      dib = moment(this.calculo.data_pedido_beneficio_esperado);
    }

    if(dataCorrente <= this.dataSimplificada && dib < this.dataInicioBuracoNegro){
      return 'Art. 58 <br> (ADCT)';
    }
    

    if(reajusteObj.reajusteOs == 0.0){
      //Não tem reajuste OS
      stringIndice = this.formatDecimal(reajusteObj.reajuste, 6);
    }else{
      stringIndice = '' + this.formatDecimal(reajusteObj.reajuste, 6) + '<br>' + this.formatDecimal(reajusteObj.reajusteOs,6) + 'OS'
    }
    return stringIndice;
  }

  updateResultadosDatatable(){
    if(this.calculo.percentual_taxa_advogado != 0){
      this.resultadosDatatableOptions = {
        ...this.resultadosDatatableOptions,
        data: this.resultadosList,
        columns: [
          {data: 'competencia'},
          {data: 'indice_devidos'},
          {data: 'beneficio_devido'},
          {data: 'indice_recebidos'},
          {data: 'beneficio_recebido'},
          {data: 'diferenca_mensal'},
          {data: 'correcao_monetaria'},
          {data: 'diferenca_corrigida'},
          {data: 'juros'},
          {data: 'valor_juros'},
          {data: 'diferenca_juros'},
          {data: 'honorarios'}
        ]
      }
    }else{
      this.resultadosDatatableOptions = {
        ...this.resultadosDatatableOptions,
        data: this.resultadosList,
        columns: [
          {data: 'competencia'},
          {data: 'indice_devidos'},
          {data: 'beneficio_devido'},
          {data: 'indice_recebidos'},
          {data: 'beneficio_recebido'},
          {data: 'diferenca_mensal'},
          {data: 'correcao_monetaria'},
          {data: 'diferenca_corrigida'},
          {data: 'juros'},
          {data: 'valor_juros'},
          {data: 'diferenca_juros'},
        ]
      }
    }
  }

  getIndice(data){
    return this.getDifferenceInMonths(this.primeiraDataArrayMoeda, data);
  }

  getTipoAposentadoria(value){
    let tipos_aposentadoria = [{
                name: "Auxílio Doença",
          value: 0
        },{
          name: "Aposentadoria por invalidez Previdenciária ou Pensão por Morte",
          value: 1
        },{
          name: "Aposentadoria por idade - Trabalhador Urbano",
          value: 2
        },{
          name: "Aposentadoria por tempo de contribuição",
          value: 3
        },{
          name: "Aposentadoria por tempo de serviço de professor",
          value: 4
        },{
          name: "Auxílio Acidente previdenciário - 50%",
          value: 5
        },{
          name: "Aposentadoria por idade - Trabalhador Rural",
          value: 6
        },{
          name: "Auxílio Acidente  - 30%",
          value: 7
        },{
          name: "Auxílio Acidente - 40%",
          value: 8
        },{
          name: "Auxílio Acidente - 60%",
          value: 9
        },{
          name: "Abono de Permanência em Serviço",
          value: 10
        },{
          name: "LOAS - Benefício no valor de um salário mínimo",
          value: 11
        },{
          name: "Aposentadoria especial da Pessoa com Deficiência Grave",
          value: 12
        },{
          name: "Aposentadoria especial da Pessoa com Deficiência Moderada",
          value: 13
        },{
          name: "Aposentadoria especial da Pessoa com Deficiência Leve",
          value: 14
        },{
          name: "Aposentadoria especial por Idade da Pessoa com Deficiência",
          value: 15
        },{
          name: "LOAS",
          value: 16
        }
    ]
    return tipos_aposentadoria[value].name;
  }

  editSegurado() {
    window.location.href='/#/beneficios/beneficios-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

}
