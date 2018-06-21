import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { Segurado as SeguradoModel } from "../+beneficios-segurados/Segurado.model";
import { SeguradoService } from "../+beneficios-segurados/Segurado.service";
import { CalculoAtrasado as CalculoModel } from "../+beneficios-calculos/CalculoAtrasado.model";
import { CalculoAtrasadoService as CalculoService } from "../+beneficios-calculos/CalculoAtrasado.service";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
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
  public moeda;
  public isUpdating = false;

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
      {data: 'diferenca_juros'}
    ]
  }

  //Datas Importantes
  private dataSimplificada = moment('1991-12-01');
  private dataInicioBuracoNegro = moment('1998-10-05');
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

  private dataInicioRecebidos;
  private dataInicioDevidos;

  //Variaveis para aplicação do reajuste
  private aplicarReajusteUltimoDevido = false;
  private ultimoSalarioMinimoDevido = 0.0;
  private beneficioDevidoAnterior = 0.0;
  private aplicarReajusteUltimoRecebido = false;
  private ultimoSalarioMinimoRecebido = 0.0;
  private beneficioRecebidoAnterior = 0.0;

  //Variaveis para condicionais de primeiro reajuste
  private primeiroReajusteRecebidos = -1;
  private primeiroReajusteDevidos = -1;

  //Data da primeira linha da tabela
  private dataInicioCalculo;
  //Data da ultima linha da tabela
  private dataFinal;

  //Taxas de Juros
  private jurosAntes2003 = 0.5;
  private jurosDepois2003 = 1.0;
  private jurosDepois2009 = 1.5;
  constructor(protected router: Router,
              private route: ActivatedRoute,
              protected Segurado: SeguradoService,
              protected CalculoAtrasado: CalculoService,
              private Moeda: MoedaService,
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

        this.Moeda.getByDateRange(this.dataInicioCalculo, this.dataFinal)
        .then((moeda: Moeda[]) => {
          this.moeda = moeda;
          this.isUpdating = false;
        })
    });

  }

  generateTabelaResultados(){
    let competencias = this.monthsBetween(this.dataInicioCalculo, this.dataFinal);
    let tableData = [];
    for (let dataCorrente of competencias){
      let stringCompetencia = (dataCorrente.month()+1) + '/' + dataCorrente.year();
      //Quando a dataCorrente for menor que a ‘dataInicioRecebidos’, definido na secão 1.1
      if(dataCorrente < this.dataInicioRecebidos){
        let indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
        let beneficioDevido = this.getBeneficioDevido(dataCorrente);
        let indiceReajuseValoresRecebidos = 0;
        let beneficioRecebido = 0;
        let diferencaMensal = beneficioDevido;
        let correcaoMonetaria = this.getCorrecaoMonetaria(dataCorrente);
        let diferencaCorrigida = diferencaMensal * correcaoMonetaria;
        let juros = this.getJuros(dataCorrente);
        let valorJuros = diferencaCorrigida * juros;
        let diferencaCorrigidaJuros = diferencaCorrigida + valorJuros;

        let line = {competencia: stringCompetencia,
                    indice_devidos: indiceReajusteValoresDevidos,
                    beneficio_devido: this.formatMoney(beneficioDevido),
                    indice_recebidos: indiceReajuseValoresRecebidos,
                    diferenca_mensal: this.formatMoney(diferencaMensal),
                    correcao_monetaria: correcaoMonetaria,
                    diferenca_corrigida: this.formatMoney(diferencaCorrigida),
                    juros: this.formatPercent(juros),
                    valor_juros: this.formatMoney(valorJuros),
                    diferenca_juros: this.formatMoney(diferencaCorrigidaJuros)}
        tableData.push(line);
        continue;
      }

      //Quando a dataCorrente for menor que a ‘dataInicioDevidos, definido na seção 1.2
      if(dataCorrente < this.dataInicioDevidos){
        let indiceReajusteValoresDevidos = 0;
        let beneficioDevido = 0;
        let indiceReajuseValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente);
        let beneficioRecebido = this.getBeneficioRecebido(dataCorrente);
        let diferencaMensal = beneficioDevido - beneficioRecebido;
        let correcaoMonetaria = this.getCorrecaoMonetaria(dataCorrente);
        let diferencaCorrigida = diferencaMensal * correcaoMonetaria;
        let juros = this.getJuros(dataCorrente);
        let valorJuros = diferencaCorrigida * juros;
        let diferencaCorrigidaJuros = diferencaCorrigida + valorJuros;

        let line = {competencia: stringCompetencia,
                    indice_devidos: indiceReajusteValoresDevidos,
                    beneficio_devido: this.formatMoney(beneficioDevido),
                    indice_recebidos: indiceReajuseValoresRecebidos,
                    diferenca_mensal: this.formatMoney(diferencaMensal),
                    correcao_monetaria: correcaoMonetaria,
                    diferenca_corrigida: this.formatMoney(diferencaCorrigida),
                    juros: this.formatPercent(juros),
                    valor_juros: this.formatMoney(valorJuros),
                    diferenca_juros: this.formatMoney(diferencaCorrigidaJuros)}
        tableData.push(line);
        continue;
      }

      //Quando a dataCorrente for maior que ambas, definido na seção 1.3.
      if(dataCorrente >= this.dataInicioRecebidos && dataCorrente >= this.dataInicioDevidos){
        let indiceReajusteValoresDevidos = this.getIndiceReajusteValoresDevidos(dataCorrente);
        let beneficioDevido = this.getBeneficioDevido(dataCorrente);
        let indiceReajuseValoresRecebidos = this.getIndiceReajusteValoresRecebidos(dataCorrente);
        let beneficioRecebido = this.getBeneficioRecebido(dataCorrente);
        let diferencaMensal = beneficioDevido - beneficioRecebido;
        let correcaoMonetaria = this.getCorrecaoMonetaria(dataCorrente);
        let diferencaCorrigida = diferencaMensal * correcaoMonetaria;
        let juros = this.getJuros(dataCorrente);
        let valorJuros = diferencaCorrigida * juros;
        let diferencaCorrigidaJuros =  this.getDiferencaCorrigidaJuros(dataCorrente, valorJuros, diferencaCorrigida);

        let line = {competencia: stringCompetencia,
                    indice_devidos: indiceReajusteValoresDevidos,
                    beneficio_devido: this.formatMoney(beneficioDevido),
                    indice_recebidos: indiceReajuseValoresRecebidos,
                    diferenca_mensal: this.formatMoney(diferencaMensal),
                    correcao_monetaria: correcaoMonetaria,
                    diferenca_corrigida: this.formatMoney(diferencaCorrigida),
                    juros: this.formatPercent(juros),
                    valor_juros: this.formatMoney(valorJuros),
                    diferenca_juros: this.formatMoney(diferencaCorrigidaJuros)}
        tableData.push(line);
        continue;
      }
    }
    return tableData;
  }

  getDiferencaCorrigidaJuros(dataCorrente, juros, diferenca_corrigida){
    return juros + diferenca_corrigida;
    //Está coluna será definida pela soma da coluna diferença corrigida + o valor do Juros. 
    //O subíndice ‘(prescrita)’ deve ser adicionado quando houver prescrição.  
    //A prescrição é ocorre quando a data corrente tem mais de cinco anos de diferença da data_acao_judicial.
  }

  //Seção 3.3
  getBeneficioDevido(dataCorrente, reajusteObj, resultsObj){
    let rmiDevidos = parseFloat(this.calculo.valor_beneficio_esperado);
    let beneficioDevido = rmiDevidos;
    
    //aplicarReajusteUltimo = 1 somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor devido
    if(!(dataCorrente <= this.dataSimplificada && moment(this.calculo.data_pedido_beneficio_esperado) < this.dataInicioBuracoNegro)
       && this.aplicarReajusteUltimoDevido ){
      beneficioDevido = this.beneficioDevidoAnterior; // = beneficioDevido do mes anterior antes do ajuste;
    }
    
    // Nas próximas 5 condições devem ser aplicados os beneficios devidos dos meses especificados entre os colchetes;
    if (dataCorrente.isSame('2006-08-01')) { //08/2006
      //beneficioDevido = beneficioDevido[04/2006];
      return this.getBeneficioDevido(moment('2006-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2000-06-01')) { //06/2000
      //beneficioDevido = beneficioDevido[04/2000];
      return this.getBeneficioDevido(moment('2000-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2001-06-01')) { //06/2001
      //beneficioDevido = beneficioDevido[04/2001];
      return this.getBeneficioDevido(moment('2001-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2002-06-01')) { //06/2002
      //beneficioDevido = beneficioDevido[04/2002];
      return this.getBeneficioDevido(moment('2002-04-01'), reajusteObj, resultsObj);
    }
    if (dataCorrente.isSame('2003-06-01')) { //06/2003
      //beneficioDevido = beneficioDevido[04/2003];
      return this.getBeneficioDevido(moment('2003-04-01'), reajusteObj, resultsObj);
    }

    if (this.calculo.tipo_aposentadoria == '11') { //11 = 'LOAS - beneficio salario minimo'
      let moedaIndexDataCorrente = this.getDifferenceInMonths(this.dataInicioCalculo, dataCorrente);
      beneficioDevido = this.moeda[moedaIndexDataCorrente].salario_minimo;
    } else {
      beneficioDevido *= reajusteObj.reajuste; //Reajuse de devidos, calculado na seção 2.1
    }

    let indiceSuperior = false;
    // algortimo buracoNegro definida na seção de algortimos úteis.
    if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio_esperado))) {
      if (dataCorrente == this.dataEfeitoFinanceiro) {
        //Inserir indice superior *
        indiceSuperior = true;
        beneficioDevido = this.calculo.valor_beneficio_esperado_apos_revisao * reajusteObj.reajusteOs;
      } else if (dataCorrente < this.dataEfeitoFinanceiro) {
        beneficioDevido = rmiDevidos * reajusteObj.reajuste;
      }
    }

    // taxa_ajuste_maxima_esperada definida no CRUD         
    if (this.calculo.taxa_ajuste_maxima_esperada != 0 &&
      this.calculo.taxa_ajuste_maxima_esperada != undefined) {
      if (this.dataComecoLei8870 <= moment(this.calculo.data_pedido_beneficio_esperado) &&
        moment(this.calculo.data_pedido_beneficio_esperado) <= this.dataFimLei8870 &&
        dataCorrente == this.dataAplicacao8870) {
        beneficioDevido *= this.calculo.taxa_ajuste_maxima_esperada;
      }

      if (moment(this.calculo.data_pedido_beneficio_esperado) >= this.dataLei8880 && this.primeiroReajusteDevidos == 1) {
        beneficioDevido *= parseFloat(this.calculo.taxa_ajuste_maxima_esperada);
        this.primeiroReajusteDevidos = 0;
      }
    }

    // AplicarTetosEMinimos Definido na seção de algoritmos úteis.
    let beneficioDevidoAjustado = this.aplicarTetosEMinimos(beneficioDevido, moment(this.calculo.data_pedido_beneficio_esperado), 'Devido');
    // Caso diasProporcionais for diferente de 1, inserir subindice ‘p’. O algoritmo está definido na seção de algoritmos úteis.
    let diasProporcionais = this.calcularDiasProporcionais(dataCorrente, moment(this.calculo.data_pedido_beneficio_esperado));
    let beneficioDevidoFinal = beneficioDevidoAjustado * diasProporcionais;

    let beneficioDevidoString = this.formatMoney(beneficioDevidoFinal);
    if(indiceSuperior){
      beneficioDevidoString += '*'
    }

    let minimoAplicado = false;
    if(beneficioDevidoAjustado <= beneficioDevido){
      // Ajustado para o teto. Adicionar subindice ‘T’ no valor do beneficio
      beneficioDevidoString += ' -<br>  T';
    }else if(beneficioDevidoAjustado >= beneficioDevido){
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
        this.ultimoSalarioMinimoDevido = beneficioDevidoAjustado;
        this.aplicarReajusteUltimoDevido = true;
      }
    }

    resultsObj.resultString = beneficioDevidoString;
    this.beneficioDevidoAnterior = beneficioDevidoFinal;
    return beneficioDevidoFinal;
  }

  //Seção 3.4
  getBeneficioRecebido(dataCorrente){
    //QUESTION: o que é rmiRecebidos?
    // let beneficioRecebido = rmiRecebidos;
    //QUESTION: no mes anterior da dataCorrente?
    // // aplicarReajusteUltimo = 1 somente quando, no mes anterior, houve troca de salario minimo e o valor minimo foi aplicado pro valor recebido
    // if (!(dataCorrente <= this.dataSimplificada && moment(this.calculo.data_pedido_beneficio) < this.dataInicioBuracoNegro) && aplicarReajusteUltimo) {
    //   beneficioRecebido = beneficioRecebidoAnterior; // = beneficioDevido do mes anterior antes do ajuste;
    // }

    // if (dataCorrente == 08/2006) {
    //   beneficioRecebido = beneficioRecebido[04/2006];
    // }
    // if (dataCorrente == 06/2000) {
    //   beneficioRecebido = beneficioRecebido[04/2000];
    // }
    // if (dataCorrente == 06/2001) {
    //   beneficioRecebido = beneficioRecebido[04/2001];
    // }
    // if (dataCorrente == 06/2002) {
    //   beneficioRecebido = beneficioRecebido[04/2002];
    // }
    // if (dataCorrente == 06/2003) {
    //   beneficioRecebido = beneficioRecebido[04/2003];
    // }

    // if (this.calculo.tipo_aposentadoria_recebida == 'LOAS = beneficio salario minimo') {
      //QUESTION: minimoSalarial é o salario minimo da dataCorrente?
    //    beneficioRecebido = minimoSalarial;
    // }else{
      //QUESTION: reajuste é o indice de reajuste?
    //  beneficioRecebido *= reajuste;
    // }

    // if (this.isBuracoNegro(moment(this.calculo.data_pedido_beneficio))) {
      //QUESTION: o que é efeitoFInanceiro?
    //   if(dataCorrente == efeitoFinanceiro) {
    //     beneficio = parseFloat(this.calculo.valor_beneficio_concedido_apos_revisao) * reajusteOS
    //   }else if(dataCorrente < efeitoFinanceiro){
    //        beneficioRecebido = rmiRecebidos * reajuste;
    //   }
    // }

    // if (this.calculo.taxa_ajuste_maxima_esperada != 0 && 
    //     this.calculo.taxa_ajuste_maxima_esperada != undefined) 
    // {
    //   if(this.dataComecoLei8870 <= moment(this.calculo.data_pedido_beneficio) && 
    //      moment(this.calculo.data_pedido_beneficio) <= this.dataFimLei8870 && 
    //      dataCorrente == this.dataAplicacao8870) {
    //     beneficioRecebido *= this.calculo.taxa_ajuste_maxima_concedida;
    //   }
    //   if(moment(this.calculo.data_pedido_beneficio_esperado) >= this.dataLei8880 && primeiroReajuste) {
    //     beneficioRecebido *= this.calculo.taxa_ajuste_maxima_concedida;
    //   }
    // }
    //QUESTION: qual checkbox é chkBeneficioNaoConcedido??
    // if (chkBeneficioNaoConcedido == 0) {
    //   beneficioRecebido = 0;
    // }

    // beneficioRecebido = aplicarTetosEMinimos(beneficioRecebido);

    // // Caso diasProporcionais for diferente de 1, inserir subindice ‘p’. O algoritmo está definido na seção de algoritmos úteis.
    // let diasProporcionais = calcularDiasProporcionais(dataCorrente, moment(this.calculo.data_pedido_beneficio))
    // beneficioRecebido = beneficioRecebido * diasProporcionais

    // return beneficioRecebido;
    return 0.0;
  }

  //Seção 3.1
  getIndiceReajusteValoresDevidos(dataCorrente){
    //TODO: recuperar o indice tabelado na variavel 'reajuste'.

    //let reajuste = indiceTabelado; //Recuperado da tabela IntervaloReajustes, coluna índice
    // if (dataCorrente <= this.dataSimplificada && 
    //     moment(this.calculo.data_pedido_beneficio_esperado) < this.dataInicioBuracoNegro) 
    // {
    //     reajuste = 1;
    // }
    // else if(moment(this.calculo.data_pedido_beneficio_esperado) <= this.dataInicioBuracoNegro && 
    //         dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado))
    // {
    //     reajuste = 2.198234;
    // }
    // if (dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado) && 
    //     moment(this.calculo.data_pedido_beneficio_esperado) == this.dataInicioCalculo) 
    // {
    //     reajuste = 1;
    // }
    // if (dataCorrente == moment('1994-03-01')) {
    //         reajuste = 1 / 661.0052;
    //         if (dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado))
    //                 reajuste = 1;
    // }
    // return reajuste;
    return 0.0;
  }

  //Seção 3.2
  getIndiceReajusteValoresRecebidos(dataCorrente){
    //let reajuste = indiceTabelado;
    let reajuste = 0.0;
    // chkIndice é o checkbox “calcular aplicando os índices de 2,28% em 06/1999 e 1,75% em 05/2004”
    let chkIndice = this.calculo.usar_indice_99_04;
    //QUESTION: o que é 'recebido'?
    // if (chkIndice && recebido) {
    //   if (dataCorrente == moment("1999-06-01")){
    //     reajuste = reajuste * 1.0228;
    //   }
    //   if (dataCorrente == moment("2004-05-01")){
    //     reajuste = reajuste * 1.0175;
    //   }
    // }

    if (dataCorrente <= this.dataSimplificada && 
        moment(this.calculo.data_pedido_beneficio) < this.dataInicioBuracoNegro) 
    {
      reajuste = 1;
    }
    else if(moment(this.calculo.data_pedido_beneficio) <= this.dataInicioBuracoNegro && 
            dataCorrente == moment(this.calculo.data_pedido_beneficio_esperado))
    {
      reajuste = 2.198234;
    }

    if (dataCorrente == moment(this.calculo.data_pedido_beneficio) && moment(this.calculo.data_pedido_beneficio) == this.dataInicioCalculo) {
      reajuste = 1;
    }
    if (dataCorrente == '03/1994') {
      reajuste = 1 / 661.0052;
      if (dataCorrente == moment(this.calculo.data_pedido_beneficio)){
        reajuste = 1;
      }
    }

    return reajuste;
  }

  //Seção 3.7
  getCorrecaoMonetaria(dataCorrente){
    let tipo_correcao = this.calculo.tipo_correcao;
    let moedaIndexDataCorrente = this.getDifferenceInMonths(this.dataInicioCalculo, dataCorrente);
    let moedaIndexDataAtual = this.getDifferenceInMonths(this.dataInicioCalculo);
    let moedaIndexDataCalculo = this.getDifferenceInMonths(this.dataInicioCalculo, moment(this.calculo.data_calculo));

    let desindexador = 0.0;
    let correcaoMonetaria = 0.0
    if(tipo_correcao == 'ipca'){
      desindexador = this.moeda[moedaIndexDataAtual].ipca / this.moeda[moedaIndexDataCalculo].ipca
      correcaoMonetaria = this.moeda[moedaIndexDataCorrente].ipca * desindexador;
    }else if(tipo_correcao == 'cam'){
      desindexador = this.moeda[moedaIndexDataAtual].cam / this.moeda[moedaIndexDataCalculo].cam
      correcaoMonetaria = this.moeda[moedaIndexDataCorrente].cam * desindexador;
    }else if(tipo_correcao == 'tr'){
      desindexador = this.moeda[moedaIndexDataAtual].tr / this.moeda[moedaIndexDataCalculo].tr
      correcaoMonetaria = this.moeda[moedaIndexDataCorrente].tr * desindexador;
    }
    let usar_deflacao = !this.calculo.nao_usar_deflacao;
    if (!usar_deflacao) {
     if (correcaoMonetaria < 1.0 && dataCorrente > moment('1994-06-01')) {
          correcaoMonetaria = 1;
      }
    }
    return correcaoMonetaria;
  }

  setInicioRecebidosEDevidos(){
    this.dataInicioRecebidos = moment(this.calculo.data_pedido_beneficio);
    this.dataInicioDevidos = moment(this.calculo.data_pedido_beneficio_esperado);

    if(this.dataInicioRecebidos < this.dataInicioBuracoNegro) {
                this.dataInicioRecebidos = this.dataEquivalenciaMinimo89;
    }

    if(this.dataInicioDevidos < this.dataInicioBuracoNegro) {
                this.dataInicioDevidos = this.dataEquivalenciaMinimo89;
    }
    //dataInicioCalculo é o menor valor entre dataInicioDevidos e dataInicioRecebidos
    this.dataInicioCalculo = (this.dataInicioDevidos < this.dataInicioRecebidos) ? this.dataInicioDevidos:this.dataInicioRecebidos;
    //dataFinal é a data_calculo_pedido acrescido de um mês
    this.dataFinal = (moment(this.calculo.data_calculo_pedido)).add(1,'month');
  }

  isBuracoNegro(date){
    if(date >= this.dataInicioBuracoNegro && date <= this.dataFimBuracoNegro){
      return true;
    }
    return false;
  }

  //Retorna uma lista com os meses entre dateStart e dateEnd
  monthsBetween(dateStart, dateEnd){
    // dateStart = '01/'+dateStart;
    // dateEnd = '01/'+dateEnd;

    // let startSplit = dateStart.split('/');
    // let endSplit = dateEnd.split('/');

    // dateStart = moment(startSplit[2]+'-'+startSplit[1]+'-'+startSplit[0]);
    // dateEnd = moment(endSplit[2]+'-'+endSplit[1]+'-'+endSplit[0]);
    let timeValues = [];

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
       timeValues.push(dateStart.format('YYYY-MM'));
       dateStart.add(1,'month');
    }
    return timeValues;
  }


  //Seção 3.8
  getJuros(dataCorrente){
  //   let data_citacao_reu = moment(this.calculo.data_citacao_reu);
  //   let data = data_citacao_reu;
  //   let juros = 0.0;

  //   if (this.dataInicioCalculo > data) {
  //     data = this.dataInicioCalculo;
  //   }

  //   if (data < moment('2003-01-15')){
  //     //juros = Calcular o juros com a taxa anterior a 2003 * numero de meses (arredondado) entre data e '15/01/2003';
  //     //juros += calcular taxa entre 2003 e 2009 * numero de meses entre '15/01/2003' e '01/07/2009' 
    //QUESTION: chkBoxTaxaSelic é 'Desmarque para não aplicar os juros da poupança'??
  //     if (!chkBoxTaxaSelic) {
    //QUESTION: o que é dataDoCalculo
  //       //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
  //     }else {
  //       //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
  //       //juros += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
  //     }

  //   }else if(data < moment('2009-07-01')){
  //     //juros = calcular taxa entre 2003 e 2009 * numero de meses entre data e '01/07/2009' 
  //     if (!chkBoxTaxaSelic) {
  //       //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
  //     }else{
  //       //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
  //       //juros += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo;
  //     }
  //   }else{
  //     if (!chkBoxTaxaSelic){
  //       //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e dataDoCalculo;
  //     }else{
  //       //juros += taxa apos 2009 * numero de meses entre '01/07/2009' e a dataSelic70 ('01/05/2012')
  //       //juros += taxaTabelada de cada mes entre ('01/05/2012') e a data do calculo / 100;
  //     }
  //   }
        //QUESTION: é pra passar a data_citacao_reu para o primeiro dia do mes correspondente?
  //   let dataCitacao = data_citacao_reu;//dataCitacaoReu no dia 1
  //   if (dataCorrente > dataCitacao){

  //     if (dataCorrente < this.dataJuros2003) {
  //       juros -= this.jurosAntes2003;
  //     }

  //     if(this.dataJuros2003 < dataCorrente && dataCorrente < this.dataJuros2009){
  //       juros -= this.jurosDepois2003;
  //     }

  //     if (dataCorrente > this.dataJuros2009) {
  //       if (!chkBoxTaxaSelic) {
  //         juros -= this.jurosDepois2009;
  //       }else{
  //         if (dataCorrente < this.dataSelic70){
  //           juros -= this.jurosDepois2009;
  //         }else{
    //QUESTION: o que é jurosSelic70?
  //           juros -= jurosSelic70/100; //Carregado do BD na coluna da data corrente;
  //         }
  //       }
  //     }
  //   }

  //   if (juros < 0) {
  //     juros = 0;
  //   }
  //   return juros;
    return 0.0;
  }

  //Retorna a diferença em meses completos entre a data passada como parametro e a data atual
  getDifferenceInMonths(date1, date2=moment()){
    // let splitted = dateString.split('/');
    // let recent;
    // if(dateString2 == ''){
    //   recent = moment();
    // }else{
    //   let splitted = dateString2.split('/');
    //   recent = moment(splitted[0]+'-01-'+splitted[1], "MM-DD-YYYY");
    // }
    // let pastDate = moment(splitted[0]+'-01-'+splitted[1], "MM-DD-YYYY");
    // let duration = moment.duration(recent.diff(pastDate));
    // let months = duration.asMonths();
    // return Math.floor(months);
    let difference = (moment.duration(date2.diff(date1))).asMonths();
    return Math.floor(difference);

  }

  formatDatetimeToDate(dataString){
  	let date = dataString.split(' ')[0];
  	let splited_date = date.split('-');
  	return splited_date[2] + '/' +splited_date[1] + '/' + splited_date[0];
  }

  formatDate(dataString){
  	if(dataString != '0000-00-00'){
  	  	let splited_date = dataString.split('-');
  	  	return splited_date[2] + '/' +splited_date[1] + '/' + splited_date[0];
  	}
  	return '--'
  }

  formatPercent(value){
  	value = parseFloat(value) * 100;
  	return this.formatDecimal(value, 0) + '%';
  }

  formatMoney(value){
  	return 'R$' + this.formatDecimal(value, 2);
  }

  formatDecimal(value, n_of_decimal_digits){
  	value = parseFloat(value);
  	return (value.toFixed(parseInt(n_of_decimal_digits))).replace('.', ',');
  }
  getTipoAposentadoria(value){
  	console.log(value);
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
