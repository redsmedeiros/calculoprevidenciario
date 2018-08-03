import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { MoedaService } from '../../services/Moeda.service';
import { IndiceInps } from './IndiceInps.model';
import { IndiceInpsService } from './IndiceInps.service';
import { Moeda } from '../../services/Moeda.model';
import { CalculoRgpsService } from '../+rgps-calculos/CalculoRgps.service';
import { ValorContribuidoService } from '../+rgps-valores-contribuidos/ValorContribuido.service'
import * as moment from 'moment';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-resultados.component.html',
})
export class RgpsResultadosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public isUpdating = false;

  public idSegurado = '';
  public idadeSegurado = 0;
  public idCalculo = '';
  public erro;
  public currencyList = [
	{
		"startDate": "1000-01-01",
		"endDate": "1942-10-31",
		"acronimo": "MR$",
		"nome": "Mil-Réis",
		"indiceCorrecaoAnterior": 1
	},
	{
		"startDate": "1942-11-01",
		"endDate": "1967-02-12",
		"acronimo": "Cr$",
		"nome": "Cruzeiro",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "1967-02-13",
		"endDate": "1970-05-15",
		"acronimo": "NCR$",
		"nome": "Cruzeiro Novo",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "1970-05-15",
		"endDate": "1986-02-28",
		"acronimo": "Cr$",
		"nome": "Cruzeiro",
		"indiceCorrecaoAnterior": 1
	},
	{
		"startDate": "1986-03-01",
		"endDate": "1988-12-31",
		"acronimo": "CZ$",
		"nome": "Cruzado",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "1989-01-01",
		"endDate": "1990-03-15",
		"acronimo": "NCZ$",
		"nome": "Cruzado Novo",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "16/03/1990",
		"endDate": "31/07/1993",
		"acronimo": "Cr$",
		"nome": "Cruzeiro",
		"indiceCorrecaoAnterior": 1
	},
	{
		"startDate": "1993-08-01",
		"endDate": "1994-02-28",
		"acronimo": "CR$",
		"nome": "Cruzeiro Real",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "1994-03-01",
		"endDate": "1994-06-30",
		"acronimo": "URV",
		"nome": "Unidade Real de Valor",
		"indiceCorrecaoAnterior": 637.639978027344
	},
	{
		"startDate": "1994-07-01",
		"endDate": "9999-12-31",
		"acronimo": "R$",
		"nome": "Real",
		"indiceCorrecaoAnterior": 1
	}
  ];

  public segurado:any = {};
  public calculo:any = {};
  public moeda;
  public primeiraDataTabela;
  public dataInicioBeneficio;
  public contribuicaoPrimariaTotal;
  public listaValoresContribuidos;
  public inpsList;
  public tipoBeneficio;
  public calculoList = [];
  public grupoCalculosTableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculoList,
    columns: [
      {data: 'especie'},
      {data: 'periodoInicioBeneficio'},
      {data: 'contribuicaoPrimaria'},
      {data: 'contribuicaoSecundaria'},
      {data: 'dib'},
      {data: 'dataCriacao'},
    ] 
  };
  public conclusoes98 = {};
  public calculo98TableData;
  public calculo98TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculo98TableData,
    columns: [
      {data: 'competencia'},
      {data: 'contribuicao_primaria'},
      {data: 'contribuicao_secundaria'},
      {data: 'inps'},
      {data: 'contribuicao_primaria_revisada'},
      {data: 'contribuicao_secundaria_revisada'},
    ] 
  };

  constructor(protected router: Router,
    private route: ActivatedRoute,
    protected Segurado: SeguradoService,    
    protected CalculoRgps: CalculoRgpsService,
    protected ValoresContribuidos: ValorContribuidoService,
    private Moeda: MoedaService,
    private IndiceInps: IndiceInpsService,) {}

  ngOnInit() {
  	this.idSegurado = this.route.snapshot.params['id_segurado'];
  	this.idCalculo = this.route.snapshot.params['id'];
    this.isUpdating = true;

    this.Segurado.find(this.idSegurado)
        .then(segurado => {
            this.segurado = segurado;
            this.idadeSegurado = this.getIdadeSegurado();

            this.CalculoRgps.find(this.idCalculo)
              .then(calculo => {
                this.calculo = calculo;
                this.tipoBeneficio = this.getEspecieBeneficio();
                this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
                let dataLimite = this.getDataLimite();
                this.preencheGrupoDeCalculos();
                
                this.ValoresContribuidos.getByCalculoId(this.idCalculo, this.dataInicioBeneficio, dataLimite)
                  .then(valorescontribuidos => {
                    this.listaValoresContribuidos = valorescontribuidos;
                    this.erro = this.verificaErrosAnterior98();
                    if(!this.erro){
                      this.primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
                      this.Moeda.getByDateRange((this.primeiraDataTabela.clone()).add(-1, 'month'), moment())
                        .then((moeda: Moeda[]) => {
                          this.moeda = moeda;
                          this.IndiceInps.getByDate(this.dataInicioBeneficio.clone().startOf('month'))
                            .then(indices => {
                              this.inpsList = indices;
                              this.generateTabela98(this.conclusoes98);
                              console.log(this.conclusoes98);
                              this.isUpdating = false;    
                          });
                      });
                  }else{
                    this.isUpdating = false;
                  }
                });
            });
    });
  }

  verificaErrosAnterior98(){
    let erro = "";
    let anoContribuicaoPrimaria98 = (this.calculo.contribuicao_primaria_98).split('-')[0];
    if ((this.calculo.tipo_seguro == "Aposentadoria por Idade (Rural)" ||
         this.calculo.tipo_seguro == "Aposentadoria por idade (Urbano)") && this.calculo.carencia < 60){
      erro = "Falta(m) "+ (60 - this.calculo.carencia) + " mês(es) para a carencia necessária.";
    }else if(this.segurado.sexo == 'h' && this.idadeSegurado < 65 && (this.tipoBeneficio == 3 || this.tipoBeneficio == 16)){
      erro = "O segurado não tem a idade mínima (65 anos) para se aposentar por idade. Falta(m) " + (65 - this.idadeSegurado) + " ano(s) para atingir a idade mínima."
    }else if(this.segurado.sexo == 'm' && this.idadeSegurado < 60 && (this.tipoBeneficio == 3 || this.tipoBeneficio == 16)){
      erro = "O segurado não tem a idade mínima (60 anos) para se aposentar por idade. Falta(m) " + (60 - this.idadeSegurado) + " ano(s) para atingir a idade mínima."
    }else if(this.calculo.tipo_seguro == "Aposentadoria por tempo de serviço" && 
             anoContribuicaoPrimaria98 < 30){
      //todo: Colocar mensagem completa :
      //Falta(m) "quantidade de anos que faltam" ano(s), "Quantidade de meses que faltam" mês(es) e quantidade de dia(s) para completar o tempo de serviço necessário.
      erro = "Erro no tempo de contib";
    }else if (this.listaValoresContribuidos.length == 0){
      erro = "Nenhuma contribuição encontrada em até 48 meses para este cálculo <a href='http://www.ieprev.com.br/legislacao/4506/decreto-no-83.080,-de-24-1-1979' target='_blank'>Art. 37 da Decreto nº 83.080, de 24/01/1979</a>"
    }
    return erro;
  }

  getDataLimite(){
    let mesesLimite = 0;
    let mesesLimiteTotal = 0;
    if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
      mesesLimite = 18;
      mesesLimiteTotal = 12;
    } else {
      mesesLimite = 48;
      mesesLimiteTotal = 36;
    }
    let dataLimite;
    if(mesesLimiteTotal > 0){
      dataLimite = (this.dataInicioBeneficio.clone()).add(-mesesLimiteTotal,'months');
    }else{
      dataLimite = moment('1964-10-01');
    }
    return dataLimite;
  }

  getIdadeSegurado(){
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    return moment().diff(dataNascimento, 'years');
  }

  generateTabela98(conclusoes){
    let index = 0;
    let mesPrimario = 0;
    let mesSecundario = 0;
    let tableData = [];
    let isBlackHole = false;
    let currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
    let totalPrimario = 0;
    let totalSecundario = 0;
    let anoPrimario = (this.calculo.contribuicao_primaria_98).split('-')[0];
    let anoSecundario = (this.calculo.contribuicao_secundaria_98).split('-')[0];

    for(let contribuicao of this.listaValoresContribuidos){
      let valorPrimario = parseFloat(contribuicao.valor_primaria);
      let valorSecundario = parseFloat(contribuicao.valor_secundaria);
      let dataContribuicao = moment(contribuicao.data);
      let currency = this.loadCurrency(dataContribuicao);

      if(valorSecundario){
        mesSecundario++;
      }else{
        valorSecundario = 0;
      }
      
      let contribuicaoPrimariaString = this.formatMoney(valorPrimario, currency.acronimo);
      let contribuicaoSecundariaString = (!isBlackHole) ? this.formatMoney(valorSecundario, currency.acronimo) : "";
      let inps = this.getInps(dataContribuicao.year());
      valorPrimario = this.limitarTetosEMinimos(valorPrimario, dataContribuicao);
      //TODO: Inserir texto 'Limitado ao teto' e 'limitado ao mínimo' quando cabível.
      if (index > 11 && inps != null) {
        valorPrimario *= inps;
      }
      valorPrimario = this.convertCurrency(valorPrimario, dataContribuicao, this.dataInicioBeneficio);
      if (valorSecundario > 0){
        valorSecundario = this.limitarTetosEMinimos(valorSecundario, dataContribuicao);
      }

      //TODO:Inserir texto 'Limitado ao teto' e 'limitado ao minimo' quando cabivel.
      if (index > 11 && inps != null) {
        valorSecundario *= inps;
      }
      valorSecundario = this.convertCurrency(valorSecundario, dataContribuicao, this.dataInicioBeneficio);
      totalPrimario += valorPrimario;
      totalSecundario += valorSecundario;
      let inpsString = '';
      if(index > 11 && inps != null){
        inpsString = inps;
      }else{
        inpsString  = '1.000';
      }
      let contribuicaoPrimariaRevisadaString = this.formatMoney(valorPrimario, currencyDataInicioBeneficio.acronimo);
      let contribuicaoSecundariaRevisadaString = (!isBlackHole) ? this.formatMoney(valorSecundario, currencyDataInicioBeneficio.acronimo) : '';
      let line = {competencia: dataContribuicao.format('MM/YYYY'),
              contribuicao_primaria: contribuicaoPrimariaString,
              contribuicao_secundaria: contribuicaoSecundariaString,
              inps: this.formatDecimal(inpsString,2),
              contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
              contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString};
      tableData.push(line);
      index++;
    }
    let somaContribuicoes = totalPrimario + totalSecundario;
    let mediaContribuicoesPrimaria = totalPrimario / index;
    let mediaContribuicoesSecundaria = 0;
    if(totalSecundario > 0){
      if((this.tipoBeneficio == 4 || this.tipoBeneficio == 6) && anoSecundario != 0 && mesSecundario != 0){
        mediaContribuicoesSecundaria = totalSecundario / (mesSecundario) * (anoSecundario / 30.0);
      }else if(anoSecundario != 0 && mesSecundario != 0){
        let lackAux = 0;
        if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
          lackAux = 12;
        } else {
          lackAux = 60;
        }
        mediaContribuicoesSecundaria = totalSecundario * (mesSecundario / lackAux); 
      }
    }

    let mediaTotal = mediaContribuicoesPrimaria + mediaContribuicoesSecundaria;
    let rmi = this.calculateRMI(mediaTotal,somaContribuicoes, conclusoes);

    // Exibir as conclusões:
    conclusoes.total_contribuicoes_primarias = this.formatMoney(totalPrimario, currencyDataInicioBeneficio.acronimo);
    conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaContribuicoesPrimaria, currencyDataInicioBeneficio.acronimo);
    if(totalSecundario > 0){
      conclusoes.total_contribuicoes_secundarias = this.formatMoney(totalSecundario, currencyDataInicioBeneficio.acronimo);
      conclusoes.media_contribuicoes_secundarias = this.formatMoney(mediaContribuicoesSecundaria, currencyDataInicioBeneficio.acronimo);
      conclusoes.divisor_calculo_media_secundaria = mesSecundario;
    }
    conclusoes.divisor_calculo_media = index;
    conclusoes.media_contribuicoes = this.formatMoney(mediaTotal,currencyDataInicioBeneficio.acronimo);
    conclusoes.renda_mensal_inicial = this.formatMoney(rmi, currencyDataInicioBeneficio.acronimo);

    this.calculo98TableData = tableData;
    this.calculo98TableOptions = {
      ...this.calculo98TableOptions,
      data: this.calculo98TableData,
    }
  }

  calculateRMI(mediaTotal, somaContribuicoes, conclusoes){
    let currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
    let dataSalario = (this.dataInicioBeneficio.clone()).startOf('month');
    let dataSalarioMoedaIndex = this.getIndex(dataSalario);
    let limitesSalariais = this.getLimitesSalariais(dataSalario);
    let grupoDos12 = this.calculo.grupo_dos_12;

    conclusoes.maior_valor_teto = this.formatMoney(limitesSalariais.maximo, currencyDataInicioBeneficio.acronimo);
    conclusoes.menor_valor_teto = this.formatMoney(limitesSalariais.minimo, currencyDataInicioBeneficio.acronimo);
    
    //TODO:anoContribuicao
    let anoContribuicao = this.calculo.contribuicao_primaria_98.split('-')[0];

    let indiceEspecie = this.getIndiceEspecie(this.tipoBeneficio, this.segurado.sexo, anoContribuicao); // Seção 1.1.4
    let rmi = 0;
    if(mediaTotal >= limitesSalariais.minimo) {
      let primeiraParcela = indiceEspecie * limitesSalariais.minimo;
      if(limitesSalariais.maximo <= mediaTotal){
        mediaTotal = limitesSalariais.maximo;
      }
      // Calculo do valor do excedente
      let excedente = mediaTotal - limitesSalariais.minimo;
      let segundaParcela = (grupoDos12 / 30) * excedente;
      if(segundaParcela > (0.8 * excedente)){
        segundaParcela = 0.8 * excedente;
      }
      let somaParcelas = primeiraParcela + segundaParcela;
      if(somaParcelas > (0.9 * limitesSalariais.maximo)){
        rmi = (0.9 * limitesSalariais.maximo);
      }else{
        rmi = somaParcelas;
      }
      //Inserir nas conclusões
      conclusoes.primeira_parcela_rmi = this.formatMoney(primeiraParcela, currencyDataInicioBeneficio.acronimo);
      conclusoes.grupo_dos_12 =  grupoDos12;
      conclusoes.valor_excedente = this.formatMoney(excedente, currencyDataInicioBeneficio.acronimo);
      conclusoes.segunda_parcela_rmi = this.formatMoney(segundaParcela, currencyDataInicioBeneficio.acronimo);
      conclusoes.oitenta_porcento_valor_excedente = this.formatMoney((0.8 * excedente), currencyDataInicioBeneficio.acronimo);
      conclusoes.noventa_porcento_maior_valor_teto = this.formatMoney((0.9 * limitesSalariais.maximo),currencyDataInicioBeneficio.acronimo) ;
    } else {
      rmi = indiceEspecie * mediaTotal;
    }

    let indiceSalarioMinimo = this.getIndiceSalarioMinimo(this.tipoBeneficio, anoContribuicao);
    let valorSalarioMinimo = indiceSalarioMinimo * this.moeda[dataSalarioMoedaIndex].salario_minimo;
    if (rmi > (0.95 * mediaTotal)) {
        rmi = 0.95 * mediaTotal;
    } else if (rmi < valorSalarioMinimo) {
        rmi = valorSalarioMinimo;
    }
    // Inserir nas conclusõesanoContribuicao
    conclusoes.porcentagem_calculo_beneficio = indiceEspecie * 100;
    conclusoes.beneficio_minimo_com_indice =  this.formatMoney(valorSalarioMinimo, currencyDataInicioBeneficio.acronimo);
    conclusoes.noventaecinco_porcento_valor_da_media = this.formatMoney((0.95*mediaTotal), currencyDataInicioBeneficio.acronimo);

    // TODO: Nesse momento Salvar o valor da RMI e da somaContribuições no BD do calculo.
    return rmi;
  }

  getInps(year){
    if(this.inpsList){
      for(let inps of this.inpsList){
        if(inps.ano == year){
          return inps.valor;
        }
      }
      return null;
    }
    return null;
  }

  getLimitesSalariais(data){
    let dataIndex = this.getIndex(data);
    let ret = {minimo: this.moeda[dataIndex].salario_minimo, maximo: this.moeda[dataIndex].teto};
    console.log(ret);
    return ret;
  }

  preencheGrupoDeCalculos(){
    let especie = this.calculo.tipo_seguro;
    let periodoInicioBeneficio = this.calculo.tipo_aposentadoria;
    let contribuicaoPrimaria = this.getTempoDeContribuicaoPrimaria(this.calculo);
    let contribuicaoSecundaria = this.getTempoDeContribuicaoSecundaria(this.calculo);
    let dib = this.calculo.data_pedido_beneficio;
    let dataCriacao = this.formatReceivedDate(this.calculo.data_calculo);

    let line = {
      especie: especie,
      periodoInicioBeneficio:periodoInicioBeneficio,
      contribuicaoPrimaria:contribuicaoPrimaria,
      contribuicaoSecundaria:contribuicaoSecundaria,
      dib:dib,
      dataCriacao:dataCriacao
    }

    this.calculoList.push(line);
    this.grupoCalculosTableOptions = {
      ...this.grupoCalculosTableOptions,
      data: this.calculoList,
    }
  }

  formatReceivedDate(inputDate) {
      var date = new Date(inputDate);
      date.setTime(date.getTime() + (5*60*60*1000))
      if (!isNaN(date.getTime())) {
          // Months use 0 index.
          return  ('0' + (date.getDate())).slice(-2)+'/'+
                  ('0' + (date.getMonth()+1)).slice(-2)+'/'+
                         date.getFullYear();
      }
      return '';
  }

  getTempoDeContribuicaoPrimaria(data) {
    let str = '';
    if (data.contribuicao_primaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_98.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_primaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_99.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_primaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_atual.replace(/-/g,'/') +'<br>';
    }

    return str;
  }

  limitarTetosEMinimos(valor, data){
    let moedaIndex = this.getIndex(data);
    let salarioMinimo = this.moeda[moedaIndex].salario_minimo;
    let tetoSalarial = this.moeda[moedaIndex].teto;

    if(valor < salarioMinimo){
      return salarioMinimo;
    }else if(valor > tetoSalarial){
      return tetoSalarial;
    }
    return valor;
  }

  getIndex(data){
    return this.getDifferenceInMonths(this.primeiraDataTabela,data);
  }

  getDifferenceInMonths(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.floor(difference);
  }

  getTempoDeContribuicaoSecundaria(data) {
    let str = '';
    if (data.contribuicao_secundaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_98.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_secundaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_99.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_secundaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_atual.replace(/-/g,'/') +'<br>';
    }

    return str;
  }

	convertCurrency(valor, dataCorrente, dataConvercao) {
    let valorConvertido = parseFloat(valor);
    for (let currency of this.currencyList) {
    	let startDate = moment(currency.startDate);
    	let endDate = moment(currency.endDate);
      if (dataCorrente > endDate) {
      	// já esta em uma data maior que a data que a moeda termina, procurar na proxima
        continue;
      }else if (startDate > dataConvercao) {
      	// já ultrapassou a data de conversão, finalizar o calculo
        break;
      } else if (dataCorrente < endDate && dataCorrente >= startDate) {
        // Propria Moeda, não há corte.
        continue;
      }else if (dataCorrente <= endDate) {
        // Estamos na moeda seguinte, converter divindindo pelo indiceDeCorreção;
        valorConvertido /= currency.indiceCorrecaoAnterior;
      }
    }
    return valorConvertido;
  }

  getIndiceSalarioMinimo(especie, anoContribuicao){
  	let index = 0.0;
  	if (especie === 1){
  		index = 0.75;
  	} else if ((especie > 1 && especie <= 5) || especie === 16){
  		index = 0.9;
  	} else if (especie === 20){
  		index = 0.25;
  		if (anoContribuicao >= 30 && anoContribuicao < 35){
        index = 0.2;
      }
  	}
    return index;
	}

  loadCurrency(data){
    for(let currency of this.currencyList){
      let startDate = moment(currency.startDate);
      let endDate = moment(currency.endDate);
      if(startDate <= data && data <= endDate){
        return currency;
      }
    }
  }

	getIndiceEspecie(especie, sexo, anoContribuicao) {
		let indiceAno = 0.0
    if (anoContribuicao != 0 ) {
        indiceAno = anoContribuicao / 100;
    }

    let index = 0.0;
    switch (especie){
      case 1: {// Auxílio Doença
      	index = 0.7;
        if (indiceAno > 0.2){
        	indiceAno = 0.2;
        }
        index += indiceAno;
        break;
      }
      case 2: {// Aposentadoria por invalidez
      	index = 0.7;
      	if (indiceAno > 0.3){
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
        if (indiceAno > 0.25){
					indiceAno = 0.25;
				}
        index += indiceAno;
      	break;
      }
      case 16: {//Aposentadoria Especial.
      	index = 0.7;
        if (indiceAno > 0.25){
        	indiceAno = 0.25;
        }
        index += indiceAno;
        break;
      }
      case 4: {  // Aposentadoria por tempo de contribuição
      	if(sexo === 'm'){
      	  index = 0.8;
      	  let indiceAnoAux = anoContribuicao - 30;
      	  if(indiceAnoAux > 5){
      	  	indiceAnoAux = 5;
      	  }
      	  if(indiceAnoAux < 0){
      	  	indiceAnoAux = 0;
      	  }
      	  index += (0.03 * indiceAnoAux);
      	}else{
      	    index = 0.95;
      	}
      	break;
      }
      case 20: { 
        index = 0.2;
        break;
      }
      default:{
      	index = 0;
      	break;
      }
    }
    return index;
}

  getEspecieBeneficio(){
    let numeroEspecie = 0;
    switch (this.calculo.tipo_seguro) {
      case "Auxílio Doença Previdenciário":
        numeroEspecie = 1;
        break;
      case "Aposentadoria por invalidez previdênciária":
        numeroEspecie = 2;
        break;
      case "Aponsentadoria por idade trabalhador Urbano":
        numeroEspecie = 3;
        break;
      case "Aposentadoria por tempo de contribuição":
        numeroEspecie = 4;
        break;
      case "Aposentadoria especial":
        numeroEspecie = 5;
        break;
      case "Aposentadoria por tempo de  serviço de professor":
        numeroEspecie = 6;
        break;
      case "Auxílio Acidente Previdenciário 50%":
        numeroEspecie = 7;
        break;
      case "Aponsentadoria por idade trabalhador Rural":
        numeroEspecie = 16;
        break;
      case "Auxílio Acidente Previdenciário 30%":
        numeroEspecie = 17;
        break;
      case "Auxílio Acidente Previdenciário 40%":
        numeroEspecie = 18;
        break;
      case "Auxílio Acidente Previdenciário 60%":
        numeroEspecie = 19;
        break;
      case "Pessoa com deficiencia Grave 100%":
        numeroEspecie = 25;
        break;
      case "Pessoa com deficiencia Moderada 100%":
        numeroEspecie = 26;
        break;
      case "Pessoa com deficiencia Leve 100%":
        numeroEspecie = 27;
        break;
      case "Pessoa com deficiencia por Idade 70%":
        numeroEspecie = 28;
        break;
      default:
        // code...
        break;
    }
    return numeroEspecie;
  }

  formatMoney(value, sigla='R$'){
    return sigla + this.formatDecimal(value, 2);
  }

  formatDecimal(value, n_of_decimal_digits){
    value = parseFloat(value);
    return (value.toFixed(parseInt(n_of_decimal_digits))).replace('.', ',');
  }

  editSegurado() {
    window.location.href='/#/rgps/rgps-segurados/'+ this.idSegurado+'/editar';
  }

  listaSegurados(){
    window.location.href='/#/rgps/rgps-segurados/';
  }

  infoCalculos(){
  	window.location.href='/#/rgps/rgps-calculos/' + this.idSegurado;
  }

  valoresContribuidos(){
    window.location.href='/#/rgps/rgps-valores-contribuidos/' + this.idSegurado 
    + '/' + this.idCalculo; 
  }

  imprimirPagina(){
    let printContents = document.getElementById('content').innerHTML;
    let popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWin.document.close();
  }

}
