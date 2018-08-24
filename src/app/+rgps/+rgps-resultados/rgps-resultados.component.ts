import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { MoedaService } from '../../services/Moeda.service';
import { IndiceInps } from './IndiceInps.model';
import { IndiceInpsService } from './IndiceInps.service';
import { SalarioMinimoMaximo } from './SalarioMinimoMaximo.model';
import { SalarioMinimoMaximoService } from './SalarioMinimoMaximo.service';
import { CarenciaProgressiva } from './CarenciaProgressiva.model';
import { CarenciaProgressivaService } from './CarenciaProgressiva.service';
import { ReajusteAutomatico } from './ReajusteAutomatico.model';
import { ReajusteAutomaticoService } from './ReajusteAutomatico.service';
import { ExpectativaVida } from './ExpectativaVida.model';
import { ExpectativaVidaService } from './ExpectativaVida.service';
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
  public erroAnterior88;
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
		"startDate": "1990-03-16",
		"endDate": "1993-07-31",
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
  public moeda:any = {};
  public isBlackHole = false;
  public salarioMinimoMaximo;
  public primeiraDataTabela;
  public dataInicioBeneficio;
  public dataFiliacao;
  public contribuicaoPrimariaTotal;
  public listaValoresContribuidos;
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

  public inpsList;
  public conclusoesAnterior88 = {};
  public calculoAnterior88TableData = [];
  public contribuicaoPrimariaAnterior88 = {anos:0,meses:0,dias:0};
  public contribuicaoSecundariaAnterior88 = {anos:0,meses:0,dias:0};
  public calculoAnterior88TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculoAnterior88TableData,
    columns: [
      {data: 'competencia'},
      {data: 'contribuicao_primaria'},
      {data: 'contribuicao_secundaria'},
      {data: 'inps'},
      {data: 'contribuicao_primaria_revisada'},
      {data: 'contribuicao_secundaria_revisada'},
    ] 
  };

  public conclusoes91_98 = {};
  public calculo91_98TableData = [];
  public carenciasProgressivas;
  public reajustesAutomaticos;
  public contribuicaoPrimaria91_98 = {anos:0,meses:0,dias:0};
  public contribuicaoSecundaria91_98 = {anos:0,meses:0,dias:0};
  public coeficiente;
  public errosCalculo91_98 = [];
  public calculo91_98TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculo91_98TableData,
    columns: [
      {data: 'competencia'},
      {data: 'fator'},
      {data: 'contribuicao_primaria'},
      {data: 'contribuicao_secundaria'},
      {data: 'contribuicao_primaria_revisada'},
      {data: 'contribuicao_secundaria_revisada'},
      {data: 'limite'},
    ] 
  };

  public conclusoes98_99 = [];
  public calculo98_99TableData = [];
  public errosCalculo98_99 = [];
  public calculo98_99TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculo98_99TableData,
    columns: [
      {data: 'competencia'},
      {data: 'fator'},
      {data: 'contribuicao_primaria'},
      {data: 'contribuicao_secundaria'},
      {data: 'contribuicao_primaria_revisada'},
      {data: 'contribuicao_secundaria_revisada'},
      {data: 'limite'},
    ] 
  };


  public contribuicaoTotal;
  public conclusoesApos99 = [];
  public limited;
  public isProportional = false;
  public idadeFracionada;
  public expectativasVida;
  public calculoApos99TableData = [];
  public contribuicaoPrimaria99 = {anos:0,meses:0,dias:0};
  public contribuicaoSecundaria99 = {anos:0,meses:0,dias:0};
  public errosCalculoApos99 = [];
  public withMemo = false;
  public withIN45 = true;
  public calculoApos99TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculoApos99TableData,
    columns: [
      {data: 'id'},
      {data: 'competencia'},
      {data: 'indice_corrigido'},
      {data: 'contribuicao_primaria'},
      {data: 'contribuicao_secundaria'},
      {data: 'contribuicao_primaria_revisada'},
      {data: 'contribuicao_secundaria_revisada'},
      {data: 'limite'},
    ] 
  };

  public contribuicaoPrimariaAtual = {anos:0,meses:0,dias:0};
  public contribuicaoSecundariaAtual = {anos:0,meses:0,dias:0};
  
  //Datas
  public dataLei9032 = moment('1995-04-28');
  public dataLei8213 = moment('1991-07-24');
  public dataReal = moment('1994-06-01');
  public dataDib98 = moment('1998-12-16');
  public dataDib99 = moment('1999-11-29');
  public dataMP664 = moment('2015-03-01');
  public dataDecreto6939_2009 = moment('2009-08-18');

  //Variaveis de controle do template
  public mostrarCalculoAnterior88 = false;
  public mostrarCalculo91_98 = false;
  public mostrarCalculo98_99 = false;
  public mostrarCalculoApos99 = false;

  constructor(protected router: Router,
    private route: ActivatedRoute,
    protected Segurado: SeguradoService,    
    protected CalculoRgps: CalculoRgpsService,
  ) {}

  ngOnInit() {
  	this.idSegurado = this.route.snapshot.params['id_segurado'];
  	this.idCalculo = this.route.snapshot.params['id'];
    this.isUpdating = true;

    this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.segurado = segurado;
        this.idadeSegurado = this.getIdadeSegurado();
        this.dataFiliacao = this.getDataFiliacao();

        this.CalculoRgps.find(this.idCalculo)
          .then(calculo => {
            this.calculo = calculo;

            this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);
            this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
            this.preencheGrupoDeCalculos();
            this.controleExibicao()
            this.isUpdating = false;
        });
    });
  }

 //  verificaErrosAnterior88(){
 //    let erro = "";
 //    let anoContribuicaoPrimariaAnterior88 = this.contribuicaoPrimariaAnterior88.anos;
 //    if ((this.calculo.tipo_seguro == "Aposentadoria por Idade (Rural)" ||
 //         this.calculo.tipo_seguro == "Aposentadoria por idade (Urbano)") && this.calculo.carencia < 60){
 //      erro = "Falta(m) "+ (60 - this.calculo.carencia) + " mês(es) para a carencia necessária.";
 //    }else if(this.segurado.sexo == 'h' && this.idadeSegurado < 65 && (this.tipoBeneficio == 3 || this.tipoBeneficio == 16)){
 //      erro = "O segurado não tem a idade mínima (65 anos) para se aposentar por idade. Falta(m) " + (65 - this.idadeSegurado) + " ano(s) para atingir a idade mínima."
 //    }else if(this.segurado.sexo == 'm' && this.idadeSegurado < 60 && (this.tipoBeneficio == 3 || this.tipoBeneficio == 16)){
 //      erro = "O segurado não tem a idade mínima (60 anos) para se aposentar por idade. Falta(m) " + (60 - this.idadeSegurado) + " ano(s) para atingir a idade mínima."
 //    }else if(this.calculo.tipo_seguro == "Aposentadoria por tempo de serviço" && 
 //             anoContribuicaoPrimariaAnterior88 < 30){
 //      //TODO: Colocar mensagem completa :
 //      //Falta(m) "quantidade de anos que faltam" ano(s), "Quantidade de meses que faltam" mês(es) e quantidade de dia(s) para completar o tempo de serviço necessário.
 //      erro = "Erro no tempo de contibuição";
 //    }else if (this.listaValoresContribuidos.length == 0){
 //      erro = "Nenhuma contribuição encontrada em até 48 meses para este cálculo <a href='http://www.ieprev.com.br/legislacao/4506/decreto-no-83.080,-de-24-1-1979' target='_blank'>Art. 37 da Decreto nº 83.080, de 24/01/1979</a>"
 //    }
 //    return erro;
 //  }

 //  calculoAnterior88(conclusoes){
 //    let index = 0;
 //    let mesPrimario = 0;
 //    let mesSecundario = 0;
 //    let tableData = [];
 //    let currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
 //    let totalPrimario = 0;
 //    let totalSecundario = 0;
 //    let anoPrimario = this.contribuicaoPrimariaAnterior88.anos;
 //    let anoSecundario = this.contribuicaoSecundariaAnterior88.anos;

 //    for(let contribuicao of this.listaValoresContribuidos){
 //      let valorPrimario = parseFloat(contribuicao.valor_primaria);
 //      let valorSecundario = parseFloat(contribuicao.valor_secundaria);
 //      let dataContribuicao = moment(contribuicao.data);
 //      let currency = this.loadCurrency(dataContribuicao);

 //      if(valorSecundario){
 //        mesSecundario++;
 //      }else{
 //        valorSecundario = 0;
 //      }
      
 //      let contribuicaoPrimariaString = this.formatMoney(valorPrimario, currency.acronimo);
 //      let contribuicaoSecundariaString = (!this.isBlackHole) ? this.formatMoney(valorSecundario, currency.acronimo) : "";
 //      let inps = this.getInps(dataContribuicao.year());

 //      let valorAjustadoObj = this.limitarTetosEMinimos(valorPrimario, dataContribuicao);
 //      valorPrimario = valorAjustadoObj.valor;
 //      let limiteString = valorAjustadoObj.aviso;

 //      if (index > 11 && inps != null) {
 //        valorPrimario *= inps;
 //      }
 //      valorPrimario = this.convertCurrency(valorPrimario, dataContribuicao, this.dataInicioBeneficio);
 //        if (valorSecundario > 0){
 //        valorSecundario = (this.limitarTetosEMinimos(valorSecundario, dataContribuicao)).valor;
 //      }

 //      if (index > 11 && inps != null) {
 //        valorSecundario *= inps;
 //      }
 //      valorSecundario = this.convertCurrency(valorSecundario, dataContribuicao, this.dataInicioBeneficio);
 //      totalPrimario += valorPrimario;
 //      totalSecundario += valorSecundario;
 //      let inpsString = '';
 //      if(index > 11 && inps != null){
 //        inpsString = inps;
 //      }else{
 //        inpsString  = '1.00';
 //      }
 //      let contribuicaoPrimariaRevisadaString = this.formatMoney(valorPrimario, currencyDataInicioBeneficio.acronimo);
 //      let contribuicaoSecundariaRevisadaString = (!this.isBlackHole) ? this.formatMoney(valorSecundario, currencyDataInicioBeneficio.acronimo) : '';
 //      let line = {competencia: dataContribuicao.format('MM/YYYY'),
 //              contribuicao_primaria: contribuicaoPrimariaString,
 //              contribuicao_secundaria: contribuicaoSecundariaString,
 //              inps: this.formatDecimal(inpsString,2),
 //              contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
 //              contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString,
 //              limite: limiteString};
 //      tableData.push(line);
 //      index++;
 //    }
 //    let somaContribuicoes = totalPrimario + totalSecundario;
 //    let mediaContribuicoesPrimaria = totalPrimario / index;
 //    let mediaContribuicoesSecundaria = 0;
 //    if(totalSecundario > 0){
 //      if((this.tipoBeneficio == 4 || this.tipoBeneficio == 6) && anoSecundario != 0 && mesSecundario != 0){
 //        mediaContribuicoesSecundaria = totalSecundario / (mesSecundario) * (anoSecundario / 30.0);
 //      }else if(anoSecundario != 0 && mesSecundario != 0){
 //        let lackAux = 0;
 //        if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
 //          lackAux = 12;
 //        } else {
 //          lackAux = 60;
 //        }
 //        mediaContribuicoesSecundaria = totalSecundario * (mesSecundario / lackAux); 
 //      }
 //    }

 //    let mediaTotal = mediaContribuicoesPrimaria + mediaContribuicoesSecundaria;
 //    let rmi = this.calculateRMI(mediaTotal,somaContribuicoes, conclusoes);

 //    // Exibir as conclusões:
 //    conclusoes.total_contribuicoes_primarias = this.formatMoney(totalPrimario, currencyDataInicioBeneficio.acronimo);
 //    conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaContribuicoesPrimaria, currencyDataInicioBeneficio.acronimo);
 //    if(totalSecundario > 0){
 //      conclusoes.total_contribuicoes_secundarias = this.formatMoney(totalSecundario, currencyDataInicioBeneficio.acronimo);
 //      conclusoes.media_contribuicoes_secundarias = this.formatMoney(mediaContribuicoesSecundaria, currencyDataInicioBeneficio.acronimo);
 //      conclusoes.divisor_calculo_media_secundaria = mesSecundario;
 //    }
 //    conclusoes.divisor_calculo_media = index;
 //    conclusoes.media_contribuicoes = this.formatMoney(mediaTotal,currencyDataInicioBeneficio.acronimo);
 //    conclusoes.renda_mensal_inicial = this.formatMoney(rmi, currencyDataInicioBeneficio.acronimo);

 //    this.calculoAnterior88TableData = tableData;
 //    this.calculoAnterior88TableOptions = {
 //      ...this.calculoAnterior88TableOptions,
 //      data: this.calculoAnterior88TableData,
 //    }
 //  }

 //  calculateRMI(mediaTotal, somaContribuicoes, conclusoes){
 //    let currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
 //    let dataSalario = (this.dataInicioBeneficio.clone()).startOf('month');
 //    //let dataSalarioMoedaIndex = this.getIndex(dataSalario);
 //    let limitesSalariais = this.getLimitesSalariais(dataSalario);
 //    let grupoDos12 = this.calculo.grupo_dos_12;

 //    conclusoes.maior_valor_teto = this.formatMoney(limitesSalariais.maximo, currencyDataInicioBeneficio.acronimo);
 //    conclusoes.menor_valor_teto = this.formatMoney(limitesSalariais.minimo, currencyDataInicioBeneficio.acronimo);
    
 //    let anoContribuicao = this.calculo.contribuicao_primaria_98.split('-')[0];

 //    let indiceEspecie = this.getIndiceEspecie(this.tipoBeneficio, this.segurado.sexo, anoContribuicao); // Seção 1.1.4
 //    let rmi = 0;
 //    if(mediaTotal >= limitesSalariais.minimo) {
 //      let primeiraParcela = indiceEspecie * limitesSalariais.minimo;
 //      if(limitesSalariais.maximo <= mediaTotal){
 //        mediaTotal = limitesSalariais.maximo;
 //      }
 //      // Calculo do valor do excedente
 //      let excedente = mediaTotal - limitesSalariais.minimo;
 //      let segundaParcela = (grupoDos12 / 30) * excedente;
 //      if(segundaParcela > (0.8 * excedente)){
 //        segundaParcela = 0.8 * excedente;
 //      }
 //      let somaParcelas = primeiraParcela + segundaParcela;
 //      if(somaParcelas > (0.9 * limitesSalariais.maximo)){
 //        rmi = (0.9 * limitesSalariais.maximo);
 //      }else{
 //        rmi = somaParcelas;
 //      }
 //      //Inserir nas conclusões
 //      conclusoes.primeira_parcela_rmi = this.formatMoney(primeiraParcela, currencyDataInicioBeneficio.acronimo);
 //      conclusoes.grupo_dos_12 =  grupoDos12;
 //      conclusoes.valor_excedente = this.formatMoney(excedente, currencyDataInicioBeneficio.acronimo);
 //      conclusoes.segunda_parcela_rmi = this.formatMoney(segundaParcela, currencyDataInicioBeneficio.acronimo);
 //      conclusoes.oitenta_porcento_valor_excedente = this.formatMoney((0.8 * excedente), currencyDataInicioBeneficio.acronimo);
 //      conclusoes.noventa_porcento_maior_valor_teto = this.formatMoney((0.9 * limitesSalariais.maximo),currencyDataInicioBeneficio.acronimo) ;
 //    } else {
 //      rmi = indiceEspecie * mediaTotal;
 //    }

 //    let indiceSalarioMinimo = this.getIndiceSalarioMinimo(this.tipoBeneficio, anoContribuicao);
 //    let valorSalarioMinimo = indiceSalarioMinimo * (this.Moeda.getByDate(dataSalario)).salario_minimo;
 //    if (rmi > (0.95 * mediaTotal)) {
 //        rmi = 0.95 * mediaTotal;
 //    } else if (rmi < valorSalarioMinimo) {
 //        rmi = valorSalarioMinimo;
 //    }
 //    conclusoes.porcentagem_calculo_beneficio = indiceEspecie * 100;
 //    conclusoes.beneficio_minimo_com_indice =  this.formatMoney(valorSalarioMinimo, currencyDataInicioBeneficio.acronimo);
 //    conclusoes.noventaecinco_porcento_valor_da_media = this.formatMoney((0.95*mediaTotal), currencyDataInicioBeneficio.acronimo);

 //    // TODO: Nesse momento Salvar o valor da RMI e da somaContribuições no BD do calculo.
 //    return rmi;
 //  }

 //  getInps(year){
 //    if(this.inpsList){
 //      for(let inps of this.inpsList){
 //        if(inps.ano == year){
 //          return inps.valor;
 //        }
 //      }
 //      return null;
 //    }
 //    return null;
 //  }

 //  getLimitesSalariais(data){
 //    let ret = {minimo: this.salarioMinimoMaximo.minimum_salary_ammount, maximo: this.salarioMinimoMaximo.maximum_salary_ammount};
 //    return ret;
 //  }

 //  getIndiceSalarioMinimo(especie, anoContribuicao){
 //  	let index = 0.0;
 //  	if (especie === 1){
 //  		index = 0.75;
 //  	} else if ((especie > 1 && especie <= 5) || especie === 16){
 //  		index = 0.9;
 //  	} else if (especie === 20){
 //  		index = 0.25;
 //  		if (anoContribuicao >= 30 && anoContribuicao < 35){
 //        index = 0.2;
 //      }
 //  	}
 //    return index;
	// }

  loadCurrency(data){
    for(let currency of this.currencyList){
      let startDate = moment(currency.startDate);
      let endDate = moment(currency.endDate);
      if(startDate <= data && data <= endDate){
        return currency;
      }
    }
  }

  // calculo91_98(errorArray, conclusoes, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria, periodo){
  //   let dib = this.dataInicioBeneficio;
  //   let dibCurrency = this.loadCurrency(dib);

  //   if (this.calculo.tipoAposentadoria == 'Entre 16/12/1998 e 28/11/1999' && 
  //       this.dataInicioBeneficio > this.dataDib99) {
  //       dib = this.dataDib99;
  //   }
  //   if (this.calculo.tipoAposentadoria == 'Entre 05/04/1991 e 15/12/1998' &&
  //       this.dataInicioBeneficio > this.dataDib98) {
  //       dib = this.dataDib98;
  //   }

  //   let dataComparacao = (dib.clone()).startOf('month');
  //   let reajustesAdministrativos = true;
  //   if (reajustesAdministrativos) { // Definir tal booleano, a principio sempre true
  //     dataComparacao = (this.dataInicioBeneficio.clone()).startOf('month');
  //   }

  //   let dibPrimeiro = (dib.clone()).startOf('month');

  //   let moedaComparacao = this.Moeda.getByDate(dataComparacao);
  //   let moedaDIB = this.Moeda.getByDate(dib);

  //   if(this.listaValoresContribuidos.length == 0) {
  //     // Exibir MSG de erro e encerrar Cálculo.
  //     errorArray.push("Nenhuma contribuição encontrada em 48 meses anteriores a DIB conforme" + "http://www.ieprev.com.br/legislacao/10634/lei-no-8.213,-de-24-7-1991---atualizada-ate-dezembro-2008#art29' target='_blank'>Art. 29 da Lei nº 8.213, de 24/7/1991");
  //     return;
  //   }

  //   if (!this.direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria)){
  //     return;
  //   }
  //   let totalPrimaria = 0;
  //   let totalSecundaria = 0;

  //   let contagemSecundaria = 0;
  //   let contagemPrimaria = 0;
  //   let tableData = [];

  //   for(let contribuicao of this.listaValoresContribuidos) {
  //     contagemPrimaria++;
      
  //     let valorPrimario = parseFloat(contribuicao.valor_primaria);
  //     let valorSecundario = parseFloat(contribuicao.valor_secundaria);
  //     let dataContribuicao = moment(contribuicao.data);
        
  //     let contribuicaoPrimaria = 0;
        
  //     if (valorPrimario != null){
  //       contribuicaoPrimaria = valorPrimario;
  //     }

  //     let contribuicaoSecundaria = 0;
  //     if (valorSecundario != null){
  //       contribuicaoSecundaria = valorSecundario;
  //     }

  //     let currency = this.loadCurrency(dataContribuicao); //Definido na seção de algortimos uteis
      
  //     let dataContribuicaoString = dataContribuicao.format('MM/YYYY');
  //     let contribuicaoPrimariaString = this.formatMoney(valorPrimario, currency.acronimo);
  //     let contribuicaoSecundariaString = '';

  //     if (!this.isBlackHole){
  //       contribuicaoSecundariaString = this.formatMoney(valorSecundario, currency.acronimo);
  //     }

  //     let moeda = this.Moeda.getByDate(dataContribuicao);
  //     let fator = moeda.fator;
  //     let fatorLimite = moedaComparacao.fator;
  //     let fatorCorrigido = fator / fatorLimite;
  //     let fatorCorrigidoString = this.formatDecimal(fatorCorrigido, 4);

  //     let valorPrimarioCorrigido = 0;
  //     let valorSecundarioCorrigido = 0;

  //     let limiteString = '';
  //     if (contribuicaoPrimaria != 0) {

  //       let valorAjustadoObj = this.limitarTetosEMinimos(contribuicaoPrimaria, dataContribuicao);
  //       contribuicaoPrimaria =  valorAjustadoObj.valor;
  //       limiteString = valorAjustadoObj.aviso;
  //     }

  //     if (contribuicaoSecundaria != 0) {
  //       contribuicaoSecundaria = (this.limitarTetosEMinimos(contribuicaoSecundaria, dataContribuicao)).valor;
  //       contagemSecundaria ++;
  //     }

  //     valorPrimarioCorrigido = contribuicaoPrimaria * fatorCorrigido;
  //     valorSecundarioCorrigido = contribuicaoSecundaria * fatorCorrigido;

  //     let valorPrimarioRevisado   = this.convertCurrency(valorPrimarioCorrigido  , dataContribuicao, dib);
  //     let valorSecundarioRevisado = this.convertCurrency(valorSecundarioCorrigido, dataContribuicao, dib);

  //     totalPrimaria += valorPrimarioRevisado;
  //     totalSecundaria += valorSecundarioRevisado;

  //     let contribuicaoPrimariaRevisadaString = this.formatMoney(valorPrimarioRevisado, dibCurrency.acronimo);
  //     let contribuicaoSecundariaRevisadaString = "";
  //     if (!this.isBlackHole){
  //       contribuicaoSecundariaRevisadaString = this.formatMoney(valorSecundarioRevisado, dibCurrency.acronimo); // Acronimo da moeda após a conversão.
  //     }
  //     let line = {competencia: dataContribuicaoString,
  //                 contribuicao_primaria: contribuicaoPrimariaString,
  //                 contribuicao_secundaria: contribuicaoSecundariaString,
  //                 fator: fatorCorrigidoString,
  //                 contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
  //                 contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString,
  //                 limite: limiteString};
  //     tableData.push(line);

  //   }


  //   if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6 || this.tipoBeneficio == 5 || this.tipoBeneficio == 3 || this.tipoBeneficio == 16){
  //     if(contagemPrimaria < 24){
  //       contagemPrimaria = 24;
  //     }
  //     if(contagemSecundaria < 24){
  //       contagemSecundaria = 24;
  //     }
  //   }
    

  //   let mediaPrimaria = totalPrimaria / contagemPrimaria;
  //   let mediaSecundaria = 0;
  //   if(totalSecundaria > 0) {
  //     mediaSecundaria = totalSecundaria / contagemSecundaria;
  //   }

  //   let contribuicaoMedia = mediaPrimaria + mediaSecundaria;

  //   let rmi = (this.limitarTetosEMinimos(contribuicaoMedia, dataComparacao)).valor;

  //   let indiceReajuste = contribuicaoMedia / rmi;

  //   // Coeficiente Calculado na função direitoAposentadoria
  //   rmi = rmi * (this.coeficiente / 100);

  //   rmi = (this.limitarTetosEMinimos(rmi, dataComparacao)).valor;

  //   let rmiValoresAdministrativos = rmi;

  //   if(reajustesAdministrativos && 
  //     ((this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999' && this.dataInicioBeneficio >= this.dataDib99) ||
  //      (this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998' && this.dataInicioBeneficio >= this.dataDib98))){
  //          rmiValoresAdministrativos = this.getValoresAdministrativos(rmiValoresAdministrativos);
  //   }

  //   if (this.tipoBeneficio == 17 || //AuxilioAcidente30
  //       this.tipoBeneficio == 18 || //AuxilioAcidente40
  //       this.tipoBeneficio == 7  || //AuxilioAcidente50
  //       this.tipoBeneficio == 19){  //AuxilioAcidente60
  //       let fatorAuxilio;
  //       switch(this.tipoBeneficio){
  //         case 17:
  //           fatorAuxilio = 0.3;
  //           break;
  //         case 18:
  //           fatorAuxilio = 0.4;
  //           break;
  //         case 7:
  //           fatorAuxilio = 0.5;
  //           break;
  //         case 19:
  //           fatorAuxilio = 0.6;
  //           break;
  //       }
  //       let moedaAuxilio = this.Moeda.getByDate(this.dataInicioBeneficio);
  //       let salMinimo = moedaAuxilio.salario_minimo;

  //       if(contribuicaoMedia > rmiValoresAdministrativos){
  //         rmiValoresAdministrativos = contribuicaoMedia * fatorAuxilio;
  //       }else{
  //         rmiValoresAdministrativos = salMinimo * fatorAuxilio;
  //       }

  //       if (contribuicaoMedia > rmi){
  //         rmi = contribuicaoMedia * fatorAuxilio;
  //       }else{
  //         rmi = rmi * fatorAuxilio;
  //       }
  //   }

  //   let somaContribuicoes = totalPrimaria + totalSecundaria;

  //   if (reajustesAdministrativos) {
  //      //TODO: salvarBeneficiosNoBD;
  //   }

  //   let currency = this.loadCurrency(dib);

  //   //Conclusões abaixo da tabela:
  //   conclusoes.total_contribuicoes_primarias = this.formatMoney(totalPrimaria, currency.acronimo);
  //   conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaPrimaria, currency.acronimo);
  //   conclusoes.divisor_calculo_media = contagemPrimaria;

  //   if (totalSecundaria > 0)
  //     conclusoes.total_contribuicoes_secundarias = this.formatMoney(totalSecundaria, currency.acronimo);;
  //   if (mediaSecundaria > 0) {
  //     conclusoes.media_contribuicoes_secundarias = this.formatMoney(mediaSecundaria, currency.acronimo); 
  //     conclusoes.divisor_calculo_media_secundaria = contagemSecundaria;
  //   }

  //   conclusoes.media_contribuicoes = this.formatMoney(contribuicaoMedia, currency.acronimo);
  //   conclusoes.coeficiente = this.coeficiente;
  //   conclusoes.indice_reajuste_teto = indiceReajuste;
  //   conclusoes.salario_minimo = this.formatMoney(moedaComparacao.salario_minimo, currency.acronimo);
  //   conclusoes.teto = this.formatMoney(moedaComparacao.teto, currency.acronimo);
  //   conclusoes.renda_mensal_inicial = this.formatMoney(rmi, currency.acronimo);
  //   conclusoes.renda_mensal_inicial_data_dib = this.formatMoney(rmiValoresAdministrativos, currency.acronimo);
    
  //   if(periodo == '91_98'){
  //     this.calculo91_98TableData = tableData;
  //     this.calculo91_98TableOptions = {
  //       ...this.calculo91_98TableOptions,
  //       data: this.calculo91_98TableData,
  //     }
  //   }else if(periodo == '98_99'){
  //     this.calculo98_99TableData = tableData;
  //     this.calculo98_99TableOptions = {
  //       ...this.calculo98_99TableOptions,
  //       data: this.calculo98_99TableData,
  //     }
  //   }

  // }

  // direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria){
  //   let idadeDoSegurado = this.idadeSegurado;
  //   //let tempoContribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
  //   let redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;
  //   let redutorSexo = (this.segurado.sexo == 'm') ? 0 : 5;
  //   //let anosSecundaria = (this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98)).anos;
  //   let anosSecundaria = tempoContribuicaoSecundaria.anos;
  //   let anosPrimaria = ((tempoContribuicaoPrimaria.anos * 365) + (tempoContribuicaoPrimaria.meses * 30) + tempoContribuicaoPrimaria.dias)/365;

  //   let anosContribuicao = anosPrimaria;
  //   this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, false, dib); 

  //   let totalContribuicao98 = 0;
  //   let tempoContribuicaoPrimaria98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
  //   if(tempoContribuicaoPrimaria98 != {anos:0, meses:0, dias:0}) {
  //     totalContribuicao98 = ((tempoContribuicaoPrimaria98.anos * 365) + (tempoContribuicaoPrimaria98.meses * 30) + tempoContribuicaoPrimaria98.dias) /365;
  //   }

  //   let direito = true;
  //   let idadeMinima = true;
  //   let extra;
  //   let toll;

  //   let erroString = '';
  //   if(this.tipoBeneficio == 4 || this.tipoBeneficio == 6){
  //     direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 0);
  //     if (!direito){
  //       if (dib <= this.dataDib98) {
  //         direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 5);
  //         this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, true, dib); 
  //       }else{
  //         extra = this.calcularExtra(totalContribuicao98, redutorSexo);
  //         toll = this.calcularToll(totalContribuicao98, 0.4, 5, redutorSexo);
  //         this.coeficiente = this.calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, true, dib); 
  //         direito = this.verificarIdadeNecessaria(idadeDoSegurado, 7, 0, redutorSexo, errorArray);
  //         direito = direito && this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra + 5);
  //       }
  //       let contribuicao = 35 - redutorProfessor - redutorSexo - anosContribuicao;
  //       let tempoFracionado = this.tratarTempoFracionado(contribuicao); //Separar o tempo de contribuicao em anos, meses e dias
  //       if (direito) {
  //         // Exibir Mensagem de beneficio Proporcional, com o tempo faltante;
  //         //"POSSUI direito ao benefício proporcional."
  //         //"Falta(m) 'tempoFracionado' para possuir o direito ao benefício INTEGRAL."
  //         errorArray.push("POSSUI direito ao benefício proporcional. Falta(m) " + tempoFracionado + " para possuir o direito ao benefício INTEGRAL."); 
  //       }else{
  //         // Exibir Mensagem de beneficio nao concedido.
  //         // Falta(m) 'tempoFracionado' para completar o tempo de serviço necessário para o benefício INTEGRAL.
  //         errorArray.push("Falta(m) "+ tempoFracionado + " para completar o tempo de serviço necessário para o benefício INTEGRAL.");
  //         if (totalContribuicao98 > 0) {
  //           let tempo = 35 - redutorProfessor - (extra + 5) - anosContribuicao;
  //           let tempoProporcional = this.tratarTempoFracionado(tempo);
  //           // Exibir Mensagem com o tempo faltante para o beneficio proporcioanl;
  //           // Falta(m) 'tempoProporcional' para completar o tempo de serviço necessário para o benefício PROPORCIONAL.
  //            errorArray.push("Falta(m) "+ tempoProporcional + " para completar o tempo de serviço necessário para o benefício PROPORCIONAL.");
  //         }
  //       }    
  //     }
  //   }else if(this.tipoBeneficio == 3){
  //     idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
  //     if (!idadeMinima){ 
  //       return false;
  //     }
  //     if(!this.verificarCarencia(-5, redutorProfessor, redutorSexo, errorArray)){
  //       return false;
  //     }
  //   }else if(this.tipoBeneficio == 5){
  //     direito = this.verificarTempoDeServico(anosContribuicao, 0, 0, 20);
  //     if(!direito) {
  //       errorArray.push("Não possui direito ao benefício de aposentadoria especial.");
  //     }
  //   }else if(this.tipoBeneficio == 16){
  //     idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
  //     if (!idadeMinima){
  //       return false;
  //     }
  //     if (!this.verificarCarencia(0, redutorProfessor, redutorSexo, errorArray)){
  //       return false;
  //     }
  //   }else if(this.tipoBeneficio == 25){
  //     direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 10);
  //     if (!direito){
  //       errorArray.push("");
  //       return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
  //     }
  //   }else if (this.tipoBeneficio == 26){
  //     direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 6);
  //     if (!direito){
  //       errorArray.push("");
  //       return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
  //     }
  //   }else if(this.tipoBeneficio == 27){
  //     direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 2);
  //     if (!direito){
  //       errorArray.push("");
  //       return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.   
  //     }
  //   }else if(this.tipoBeneficio == 28){
  //     direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 20);
  //     if (!direito){
  //       errorArray.push("");
  //       return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
  //     }
  //     if (!this.verificarIdadeMinima(idadeDoSegurado, errorArray)){
  //       errorArray.push("");
  //       return false; // Exibir Mensagem de erro com a idade faltando;
  //     }
  //   }
  //   return direito;
  // }

  calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, proporcional, dib) {
    let coeficienteAux = 0;
    let porcentagem = 0.06;
    let coeficienteAux2 = 100;

    if(dib > this.dataDib98){
      porcentagem = 0.05;
    }
    if(proporcional) {
      let extra = this.tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, 5);
      coeficienteAux2 = 100 * this.coeficienteProporcional(extra, porcentagem, toll);
    }

    switch(this.tipoBeneficio) {
      // Auxílio Doença Previdenciário
      case 1:
        if (dib >= this.dataLei9032)
          coeficienteAux = 91;
        else if(dib >= this.dataLei8213) {
          coeficienteAux = 80 + anosContribuicao;
          if (coeficienteAux > 92) 
            coeficienteAux = 92;
        }else{  
          coeficienteAux = 80 + anosContribuicao;
        }
        break;
      // Aposentadoria por invalidez previdênciária
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
      // Aposentadoria por tempo de contribuição
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
      //Aposentadoria por tempo de serviço de professor
      case 6:
        coeficienteAux = coeficienteAux2;
        break;
      // Auxílio Acidente Previdenciário 50%
      case 7:
        coeficienteAux = 50;
        break;
      // Aponsentadoria por idade trabalhador Rural
      case 16:
        coeficienteAux = 70 + anosContribuicao;
        break;
      // Auxílio Acidente Previdenciário 30%
      case 17:
        coeficienteAux = 30;
        break;
      // Auxílio Acidente Previdenciário 40%
      case 18:
        coeficienteAux = 40;
        break;
      // Auxílio Acidente Previdenciário 60%
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
      //Pessoa com deficiencia Leve 100%
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

  tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, extra){
    let retVal = anosContribuicao - (35 - redutorProfessor - redutorSexo - extra);
    return retVal;
  }

  verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra){
    let tempoNecessario = 35 - redutorProfessor - redutorSexo - extra;
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
    if(this.tipoBeneficio == 3) {
      if (this.segurado.sexo == 'm' && this.idadeSegurado < 65){
        idadeMinima = 65;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo == 'f' && this.idadeSegurado < 60){
        idadeMinima = 60;
        temIdadeMinima = false;
      }
    }else if(this.tipoBeneficio == 16 || this.tipoBeneficio == 28) {
      if (this.segurado.sexo == 'm' && this.idadeSegurado < 60){
        idadeMinima = 60;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo == 'f' && this.idadeSegurado < 55){
        idadeMinima = 55;
        temIdadeMinima = false;
      }
    }

    if(!temIdadeMinima){
      errorArray.push("O segurado não tem a idade mínima (" + idadeMinima + " anos) para se aposentar por idade. Falta(m) " + (idadeMinima - this.idadeSegurado) + " ano(s) para atingir a idade mínima.");
    }
    return temIdadeMinima;
  }

  getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo){
    let idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    let anoNecessario = (moment(this.segurado.data_nascimento, 'DD/MM/YYYY')).add(idadeNecessaria, 'years');
    return anoNecessario.year();
  }

  getValoresAdministrativos(rmi) {
    let reajustesAdministrativos = true;   
    let valorBeneficio = rmi;
    let dataAnterior = null;
    let dataCorrente = null;
    for(let reajusteAutomatico of this.reajustesAutomaticos) {
      if (dataAnterior == null){
        dataAnterior = reajusteAutomatico.data_reajuste;
      }else{
        dataAnterior = dataCorrente;
      }
      dataCorrente = reajusteAutomatico.data_reajuste;
      let reajuste = (reajusteAutomatico.indice != null) ? reajusteAutomatico.indice : 1;
      valorBeneficio = this.convertCurrency(valorBeneficio, dataAnterior, dataCorrente);
      if (reajustesAdministrativos) {
        valorBeneficio = valorBeneficio * reajuste;
      }
      valorBeneficio = (valorBeneficio < reajusteAutomatico.salario_minimo) ? reajusteAutomatico.salario_minimo : valorBeneficio;
      valorBeneficio = (valorBeneficio > reajusteAutomatico.teto) ? reajusteAutomatico.teto : valorBeneficio;
    }
    return valorBeneficio;
  }

  // verificarCarencia(redutorIdade, redutorProfessor, redutorSexo, errorArray) {
  //   if (this.tipoBeneficio == 3 || this.tipoBeneficio == 16) {
  //     let mesesCarencia = 180;
  //     if (moment(this.segurado.data_filiacao, 'DD/MM/YYYY') < this.dataLei8213) { // Verificar se a data de filiação existe
  //       let anoNecessario = this.getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo)
  //       let carenciaProgressiva = this.CarenciaProgressiva.getCarencia(anoNecessario);
  //       if (carenciaProgressiva != 0) {
  //           mesesCarencia = carenciaProgressiva;
  //       } else if (anoNecessario < 1991) {
  //           mesesCarencia = 60;
  //       }
  //     }

  //     if (this.calculo.carencia < mesesCarencia) {
  //       let erroCarencia = "Falta(m) " + (mesesCarencia - this.calculo.carencia) + " mês(es) para a carência necessária.";
  //       errorArray.push(erroCarencia);
  //       return false;
  //     }
  //   }
  //   return true;
  // }

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
    let idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    let direito = idade > idadeNecessaria;
    if(!direito){
      errorArray.push("Falta(m) "+ (idadeNecessaria - idade) + "ano(s)");
    }
    return direito;
  }

  tratarTempoFracionado(time){
    let year = Math.floor(time);
    let month = Math.round((time - year) * 12);

    let returnStr = "";
    if(year != 0){
      returnStr += year + " ano(s)";
    }
    if(month != 0 && year != 0){ 
      returnStr += " e ";
    }
    if(month != 0){
      returnStr += month + " mes(es)";
    }
    if(month == 0 && year == 0){
      returnStr = " 0 ano(s) ";
    }
    if (year < 0){
      returnStr = "";
    }
    return returnStr;
  }

  calcularBonus(tempoServico){
    let bonus;
    if (this.segurado.sexo == 'm') {
      bonus = 17 / 100;
    }else{
      bonus = 20 / 100;
    }
    bonus = bonus * tempoServico;
    return bonus;
  }

  //FIM DAS FUNÇOES DO CALCULO 91-98

  //INICIO Cálculo após 99

  // calculo_apos_99(errorArray, conclusoes, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria){
  //   let dib = this.dataInicioBeneficio;
  //   let dibCurrency = this.loadCurrency(dib);
  //   let moedaDib = this.Moeda.getByDate(dib);
  //   let dataComparacao = (dib.clone()).startOf('month');
  //   let moedaComparacao = this.Moeda.getByDate(dataComparacao);

  //   if(this.listaValoresContribuidos.length == 0) {
  //     // Exibir MSG de erro e encerrar Cálculo.
  //     errorArray.push("Nenhuma contribuição encontrada posterior a 07/1994 conforme " + "http://www.ieprev.com.br//legislacao/2754/lei-no-9.876,-de-26-11-1999' target='_blank'>Art. 02 da Lei nº 9.876, de 29/11/1999");
  //     return;
  //   }

  //   if (!this.direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria)){
  //     return;
  //   }

  //   let totalContribuicaoPrimaria = 0;
  //   let totalContribuicaoSecundaria = 0;
  //   let totalContribuicaoPrimaria12 = 0;
  //   let totalContribuicaoSecundaria12 = 0;

  //   let contadorSecundario = 0;
  //   let contadorPrimario = 0;

  //   let primeirasContribuicoes = [];
  //   let tabelaIndex = 0;
  //   let tableData = []
  //   for(let contribuicao of this.listaValoresContribuidos) {
  //     let contribuicaoPrimaria = parseFloat(contribuicao.valor_primaria);
  //     let contribuicaoSecundaria = parseFloat(contribuicao.valor_secundaria);
  //     let dataContribuicao = moment(contribuicao.data);
  //     let currency = this.loadCurrency(dataContribuicao);

  //     let idString = contadorPrimario + 1; //tabela['id'] = contadorPrimario;
  //     contadorPrimario++;
  //     let dataContribuicaoString = dataContribuicao.format('MM/YYYY');//tabela['dataContribuicao'] = contribuicao.dataContribuicao;
  //     let contribuicaoPrimariaString = this.formatMoney(contribuicaoPrimaria, currency.acronimo); //tabela['Contribuicao Primaria'] = currency.acronimo + contribuicaoPrimaria;
  //     let contribuicaoSecundariaString = this.formatMoney(contribuicaoSecundaria, currency.acronimo); //tabela['Contribuicao Secundaria'] = currency.acronimo + contribuicaoSecundaria;
      
  //     let moeda = this.Moeda.getByDate(dataContribuicao);
  //     let fator = moeda.fator;
  //     let fatorLimite = moedaComparacao.fator;
  //     let fatorCorrigido = fator / fatorLimite;
  //     let fatorCorrigidoString = this.formatDecimal(fatorCorrigido, 4); // tabela['fatorCorrigido'] = fator/fatorLimite;
       
  //     let contribuicaoPrimariaRevisada = 0;
  //     let contribuicaoSecundariaRevisada = 0;

  //     let limiteString = '';
  //     if(contribuicaoPrimaria != 0){
  //       let valorAjustadoObj = this.limitarTetosEMinimos(contribuicaoPrimaria, dataContribuicao);
  //       contribuicaoPrimariaRevisada = valorAjustadoObj.valor;
  //       limiteString = valorAjustadoObj.aviso;
  //     }
  //     if (contribuicaoSecundaria != 0) {
  //       contribuicaoSecundariaRevisada = (this.limitarTetosEMinimos(contribuicaoSecundaria, dataContribuicao)).valor; //Inserir texto 'Limitado ao teto' e 'limitado ao minimo' quando cabivel.
  //       contadorSecundario++;
  //     }

  //     contribuicaoPrimariaRevisada = contribuicaoPrimariaRevisada * fatorCorrigido;
  //     contribuicaoSecundariaRevisada = contribuicaoSecundariaRevisada * fatorCorrigido;

  //     contribuicaoPrimariaRevisada   = this.convertCurrency(contribuicaoPrimariaRevisada  , dataContribuicao, dib);
  //     contribuicaoSecundariaRevisada   = this.convertCurrency(contribuicaoSecundariaRevisada  , dataContribuicao, dib);

  //     totalContribuicaoPrimaria += contribuicaoPrimariaRevisada;
  //     totalContribuicaoSecundaria += contribuicaoSecundariaRevisada;


  //     let contribuicaoPrimariaRevisadaString = this.formatMoney(contribuicaoPrimariaRevisada, dibCurrency.acronimo);
  //     let contribuicaoSecundariaRevisadaString = this.formatMoney(contribuicaoSecundariaRevisada, dibCurrency.acronimo);
  //     //tabela['Contribuicao Primaria Corrigida'] = currency.Acronimo + contribuicaoPrimariaRevisada
  //     //tabela['Contribuicao Secundaria Corrigida'] = currency.Acronimo + contribuicaoSecundariaRevisada

  //     let line = {id:idString,
  //                 competencia: dataContribuicaoString,
  //                 contribuicao_primaria: contribuicaoPrimariaString,
  //                 contribuicao_secundaria: contribuicaoSecundariaString,
  //                 indice_corrigido: fatorCorrigidoString,
  //                 contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
  //                 contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString,
  //                 limite: limiteString,
  //                 valor_primario:contribuicaoPrimariaRevisada,
  //                 valor_secundario:contribuicaoSecundariaRevisada};
  //     tableData.push(line);
  //     if(tabelaIndex < 12){
  //       primeirasContribuicoes.push(line);
  //     }
  //     tabelaIndex++;
  //   }

  //   if (contadorSecundario < 24){
  //     contadorSecundario = 24;
  //   }

  //   let mesesContribuicao = this.getDifferenceInMonths(moment('1994-07-01'), this.dataInicioBeneficio);
  //   let mesesContribuicao80 = Math.trunc((mesesContribuicao * 0.8) - 0.5);
  //   let mesesContribuicao60 = Math.trunc((mesesContribuicao * 0.6) - 0.5);
  //   let divisorMinimo = Math.trunc(mesesContribuicao * 0.6);

  //   if (contadorSecundario < mesesContribuicao * 0.6) {
  //     contadorSecundario = Math.trunc(mesesContribuicao * 0.6);
  //   }else if(contadorSecundario < mesesContribuicao * 0.6){
  //     contadorSecundario = Math.trunc(mesesContribuicao * 0.8);
  //   }

  //   let numeroContribuicoes = tableData.length;//Numero de contribuicoes carregadas para o periodo;
  //   let divisorMediaPrimaria = numeroContribuicoes;
  //   let divisorSecundario = contadorSecundario;
  //   if(divisorSecundario < mesesContribuicao * 0.6){
  //     divisorSecundario = Math.round(mesesContribuicao * 0.6);
  //   }else if(divisorSecundario < mesesContribuicao * 0.8){
  //     divisorSecundario = Math.round(mesesContribuicao * 0.8);
  //   }
  //   let label;
  //   switch(this.tipoBeneficio) {
  //     case 1: // Auxilio Doença Previdenciario
  //       divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.6)-0.5);
  //       divisorSecundario = Math.trunc((contadorSecundario * 0.8) - 0.5);
  //       if (this.withMemo) {
  //         // Exibir Label contendo o texto
  //         label = "Este calculo foi realizado com base no <a href='#' onclick='javascript:alert(\"Em breve a descrição do Memorando.\");'>Memorando n.º21,28/10</a> descarte dos 20% menores salários .";
  //       }
  //       break;
  //     case 2: // Aposentadoria Por Invalidez previdenciaria
  //       if (divisorMediaPrimaria >= divisorMinimo || this.withMemo) {
  //         divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
  //         if (this.withMemo) {
  //           // Exibir Label contendo o texto
  //           label = "Este calculo foi realizado com base no <a href='#' onclick='javascript:alert(\"Em breve a descrição do Memorando.\");'>Memorando n.º21,28/10</a> descarte dos 20% menores salários.";
  //         }
  //       }
  //       break;
  //     case 7: // Auxilio Doença Previdenciario 50%
  //       divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
  //       break;
  //   }

  //   if (this.dataFiliacao >= this.dataDib99){
  //     switch(this.tipoBeneficio){
  //       case 1: //Auxilio Doença Previdenciario
  //       case 2: //Aposentadoria por invalidez previdenciaria
  //         if (numeroContribuicoes >= 144 || this.withMemo) {
  //           divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
  //         }else{
  //           divisorMediaPrimaria = numeroContribuicoes;
  //         }
  //         break;
  //       case 5: // Aposentadoria Especial
  //       case 7: // Auxilio Acidente Previdenciario 50%
  //         if (numeroContribuicoes < 144 || this.withMemo) {
  //           divisorMediaPrimaria = numeroContribuicoes;
  //         }else{                
  //           divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
  //         }
  //         break;
  //       case 3 ://Aposentadoria Idade Trabalhador Urbano
  //       case 4 ://Aposentadoria Tempo de Contribuicao
  //       case 16://Aposentadoria Idade Trabalhafor Rural
  //       case 25://Deficiencia Grave
  //       case 27://Deficiencia Leva
  //       case 26://Deficiencia Moderado
  //       case 28://Deficiencia PorSalvar Idade
  //         divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
  //         break;
  //     }
  //   }else if(this.dataFiliacao < this.dataDib99){
  //     if(this.tipoBeneficio == 3 || this.tipoBeneficio == 4 || this.tipoBeneficio == 5 || this.tipoBeneficio == 6 ||    
  //     this.tipoBeneficio == 16 || this.tipoBeneficio == 25 || this.tipoBeneficio == 27 || this.tipoBeneficio == 26 ||              
  //     this.tipoBeneficio == 28){
  //          // Deficiencia Por Idade, Deficiencia Grave, Deficiencia Leve, Deficiencia Moderada, Aposentadoria Idade trabalhador Rural,
  //          // Aposentadoria Idade Urbano, Aposentadoria Tempo Contribuicao, Aposentadoria Especial, Aposentadoria Tempo Servico Professor
  //       divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
  //       if (numeroContribuicoes < mesesContribuicao60) {
  //         divisorMediaPrimaria = mesesContribuicao60
  //       }
  //       if (numeroContribuicoes >= mesesContribuicao60 && numeroContribuicoes <= mesesContribuicao80) {
  //         if (this.withIN45) {
  //           divisorMediaPrimaria = numeroContribuicoes;
  //         }else{
  //           divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
  //         }
  //       }
  //       if(divisorMediaPrimaria < divisorMinimo){
  //         divisorMediaPrimaria = divisorMinimo;
  //       }
  //     }
  //   }

  //   let totalMediaDozeContribuicoes = 0;
  //   switch(this.tipoBeneficio){
  //     case 1: // Auxilio Doenca Previdenciario
  //       if (this.dataInicioBeneficio >= this.dataMP664) {
  //         let currency = this.loadCurrency(this.dataInicioBeneficio);
  //         if (numeroContribuicoes >= 12) {
  //           let contribuicoesPrimarias12 = 0;
  //           let contribuicoesSecundarias12 = 0;
  //           for (let contribuicao of primeirasContribuicoes) {
  //             contribuicoesPrimarias12 += contribuicao.valor_primario;
  //             contribuicoesSecundarias12 += contribuicao.valor_secundario;
  //           }
  //           let moeda = this.Moeda.getByDate(this.dataInicioBeneficio);// Carregar 1 linha da tabela moeda onde a data é menor ou igual que data_pedido_beneficio;
  //           let salarioMinimoRMI = moeda.salario_minimo;
  //           let divisorContribuicoes = this.formatDecimal((contribuicoesPrimarias12 + contribuicoesSecundarias12) /12 , 1);
  //           if (divisorContribuicoes < salarioMinimoRMI) {
  //             divisorContribuicoes = salarioMinimoRMI;
  //           }
  //           totalMediaDozeContribuicoes = divisorContribuicoes;
  //           // Inserir nas conclusoes:
  //           //conclusoes.soma_doze_ultimas_contribuicoes = this.formatMoney(contribuicoesPrimarias12, currency.acronimo);
  //           conclusoes.push({string:"Soma das 12 últimas contribuções", value:this.formatMoney(contribuicoesPrimarias12, currency.acronimo)});  
  //           //conclusoes.media_doze_ultimas_contribuicoes = this.formatMoney(divisorContribuicoes, currency.acronimo);
  //           conclusoes.push({string:"Média das 12 últimas contribuções", value:this.formatMoney(divisorContribuicoes, currency.acronimo)}); 
  //         }
  //       }
  //       break;
  //     case 2: //Aposentadoria por invalidez previdenciaria
  //       if (this.dataInicioBeneficio >= this.dataDecreto6939_2009 && divisorMediaPrimaria > 1) {
  //         divisorMediaPrimaria = this.formatDecimal((numeroContribuicoes * 0.8)-0.5, 1);
  //       }
  //       break;
  //   }


  //   tableData.sort((entry1, entry2) => {
  //     if(entry1.valor_primario > entry2.valor_primario){
  //       return 1;
  //     }
  //     if(entry1.valor_primario < entry2.valor_primario){
  //       return -1;
  //     }
  //     return 0;
  //   });
  //   if (numeroContribuicoes > divisorMediaPrimaria){
  //     totalContribuicaoPrimaria = 0
  //     for(let i=0; i < tableData.length; i++){
  //       if (i >= tableData.length-divisorMediaPrimaria) {
  //         totalContribuicaoPrimaria += tableData[i].valor_primario;
  //       }else{
  //         tableData[i].limite = "DESCONSIDERADO";
  //       }
  //     }
  //   }
  //   tableData.sort((entry1, entry2) => {
  //     if(entry1.id > entry2.id){
  //       return 1;
  //     }
  //     if(entry1.id < entry2.id){
  //       return -1;
  //     }
  //     return 0;
  //   });
  //   let numeroCompetencias = this.getDifferenceInMonths(this.dataDib99, this.dataInicioBeneficio); // Calcular a quantidade de meses contida entre as duas datas.

  //   if (numeroCompetencias > 60) {
  //       numeroCompetencias = 60;
  //   }

  //   let expectativa = this.projetarExpectativa(this.idadeFracionada, this.dataInicioBeneficio,conclusoes);

  //   let redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;
  //   let redutorSexo = (this.segurado.sexo == 'm') ? 0 : 5;
 
  //   let tempoTotalContribuicao = this.getTempoServico(redutorProfessor, redutorSexo, false);

  //   let fatorSeguranca = 1;
  //   let aliquota = 0.31;
  //   let naoFocado = false;

  //   switch(this.tipoBeneficio) {
  //     case 1: // Auxilio Doenca Previdenciario
  //     case 2:         // Aposentadoria Invalidez Previdenciaria;
  //     case 5:         // Aposentadoria Especial
  //     case 7:         // Auxiolio Acidente 50
  //       naoFocado = true;
  //       break;
  //     default:
  //       fatorSeguranca = ((tempoTotalContribuicao * aliquota) / expectativa) * (1 + this.idadeFracionada + (tempoTotalContribuicao * aliquota) / 100);
  //       // Adicionar nas conclusões a fórmula com os valores, não os resutlados:
  //      //conclusoes.formula_fator = "(("+tempoTotalContribuicao +'*'+ aliquota+") / "+expectativa+") * (1 + ("+idadeFracionada+" + ("+tempoTotalContribuicao+" * "+aliquota+")) / "+"100)";
  //       conclusoes.push({string:"Fórmula Fator:",value: "(("+tempoTotalContribuicao +'*'+ aliquota+") / "+expectativa+") * (1 + ("+this.idadeFracionada+" + ("+tempoTotalContribuicao+" * "+aliquota+")) / "+"100)"});
  //       break;
  //   }

  //   if (this.tipoBeneficio == 16|| // Aposentadoria Travalhador Rural
  //       this.tipoBeneficio ==  3|| // Aposentadoria Trabalhador Urbano
  //       this.tipoBeneficio == 25|| // Deficiencia Grave
  //       this.tipoBeneficio == 26|| // Deficiencia Leve
  //       this.tipoBeneficio == 27|| // Deficiencia Moderada
  //       this.tipoBeneficio == 28){  // Deficiencia Por Idade
  //       if (fatorSeguranca < 1) {
  //         fatorSeguranca = 1;
  //         naoFocado = true;
  //       }else if(fatorSeguranca > 1) {
  //         naoFocado = true;
  //       }
  //   }

  //   //Índice de Reajuste no Teto.
  //   let irt = 1;

  //   let mediaContribuicoesPrimarias = totalContribuicaoPrimaria;
  //   if (divisorMediaPrimaria > 1) {
  //       mediaContribuicoesPrimarias /= divisorMediaPrimaria;
  //   }

  //   let mediaContribuicoesSecundarias = totalContribuicaoSecundaria;
  //   if (divisorSecundario > 1) {
  //       mediaContribuicoesSecundarias /= divisorSecundario;    
  //   }

  //   if (mediaContribuicoesSecundarias > moedaDib.teto) {
  //       mediaContribuicoesSecundarias = moedaDib.teto;
  //   }

  //   this.limited = false;

  //   let rmi = fatorSeguranca * numeroCompetencias * mediaContribuicoesPrimarias / 60;

  //   rmi += mediaContribuicoesPrimarias * ((60 - numeroCompetencias) / 60);

  //   let taxaSecundaria = 0;
  //   let taxaMediaSecundaria = 0;

  //   if (mediaContribuicoesSecundarias != 0) {
  //     taxaSecundaria = this.getTaxaSecundaria(redutorProfessor, redutorSexo, contadorSecundario);
  //     taxaMediaSecundaria = mediaContribuicoesSecundarias * taxaSecundaria;
  //     if (taxaMediaSecundaria > mediaContribuicoesSecundarias) {
  //       taxaMediaSecundaria = mediaContribuicoesSecundarias;
  //     }
  //   }

  //   let coeficiente = this.coeficiente;

  //   let somaMedias = mediaContribuicoesPrimarias + taxaMediaSecundaria;
  //   let somaMediasAux = this.corrigirBeneficio(somaMedias, coeficiente, moedaDib);

  //   if (this.limited){
  //     irt = (somaMedias * (coeficiente / 100))/somaMediasAux;
  //   }

  //   rmi += (fatorSeguranca * numeroCompetencias) / 60;
  //   rmi += taxaMediaSecundaria * ((60 - numeroCompetencias) / 60)
  //   rmi *= (coeficiente / 100);

  //   this.limited = false;

  //   let rmiAux = this.corrigirBeneficio(rmi, coeficiente, moedaDib);
  //   rmi = rmiAux;

  //   //let objMoeda = this.moeda[this.getIndex(this.dataInicioBeneficio)];//carregar apenas uma TMoeda onde currency Date é menor ou igual a Calculo.data_pedido_beneficio
  //   let objMoeda = this.Moeda.getByDate(this.dataInicioBeneficio);
  //   let salarioAcidente = objMoeda.salario_minimo;
  //   if (mediaContribuicoesPrimarias > salarioAcidente) {
  //     switch(this.tipoBeneficio){
  //       case 17:// Auxilio Acidente 30
  //         rmi = mediaContribuicoesPrimarias * 0.3;
  //         break;
  //       case 18: // Auxilio Acidente 40
  //         rmi = mediaContribuicoesPrimarias * 0.4;
  //         break;
  //       case 7: // Auxilio Acidente 50
  //         rmi = mediaContribuicoesPrimarias * 0.5;
  //         break;
  //       case 19: // Auxilio Acidente 60
  //         rmi = mediaContribuicoesPrimarias * 0.6;
  //         break;
  //       }
  //   }

  //   let somaContribuicoes = totalContribuicaoPrimaria + totalContribuicaoSecundaria;

  //   let currency = this.loadCurrency(this.dataInicioBeneficio);

  //   //conclusoes.coeficiente_calculo = coeficiente;//resultados['Coeficiente do Cálculo'] = coeficiente //Arrendodar para duas casas decimais;
  //   //conclusoes.soma_contribuicoes_primarias = this.formatMoney(totalContribuicoesPrimarias, currency.acronimo);//resultados['Soma das Contribuições Primarias'] = currency.acrônimo + totalContribuicoesPrimarias;
  //   //conclusoes.divisor_calculo_media_primaria = divisorMediaPrimaria;//resultados['Divisor do Cálculo da média primária: '] = divisorMediaPrimaria;
  //   //conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaContribuicoesPrimarias, currency.acronimo);//resultados['Média das contribuições primárias'] = currency.acrônimo + mediaContribuicoesPrimarias;
  //   conclusoes.push({string:"Coeficiente do Cálculo:",value:coeficiente+'%'});
  //   conclusoes.push({string:"Soma das Contribuições Primarias:",value:this.formatMoney(totalContribuicaoPrimaria, currency.acronimo)});
  //   conclusoes.push({string:"Divisor do Cálculo da média primária:",value:divisorMediaPrimaria});
  //   conclusoes.push({string:"Média das contribuições primárias",value:this.formatMoney(mediaContribuicoesPrimarias, currency.acronimo)});

  //   if (totalContribuicaoSecundaria > 0) {
  //     conclusoes.push({string:"Soma das contribuições secundárias:",value:this.formatMoney(totalContribuicaoSecundaria, currency.acronimo)});//resultados['Soma das contribuições secundárias'] = currency.acrônumo + totalContribuicoesSecundarias;
  //     conclusoes.push({string:"Divisor do Cálculo da média secundária:",value:divisorSecundario});//resultados['Divisor do Cálculo da média secundária: '] = divisorMediaPrimaria;
  //     conclusoes.push({string:"Média das contribuições Secundárias:",value:this.formatMoney(mediaContribuicoesSecundarias, currency.acronimo)});//resultados['Média das contribuições Secundárias: '] =  currency.acrônumo + mediaContribuicoesSecundarias;
  //     conclusoes.push({string:"Taxa:",value:taxaSecundaria});//resultados['Taxa: '] =  taxaSecundaria;
  //     conclusoes.push({string:"Média Secundárias - Pós Taxa:",value:this.formatMoney(taxaSecundaria, currency.acronimo)});//resultados['Média Secundárias - Pós Taxa: '] =  currency.acrônimo + taxaSecundaria;
  //   }

  //   conclusoes.push({string:"Idade em anos:",value:Math.trunc(this.idadeFracionada)});//resultados['Idade em anos'] = truncate(idadeFracionada) (idadeFracionada);
  //   conclusoes.push({string:"Média das contribuições:",value:this.formatMoney(somaMedias, currency.acronimo)});//resultados['Média das contribuições'] = currency.acrônimo + somaMedias;
  //   conclusoes.push({string:"CT - Número de competências transcorridas desde 29/11/1999:",value:numeroCompetencias});//resultados['CT - Número de competências transcorridas desde 29/11/1999:'] = numeroCompetencias;

  //   if (this.tipoBeneficio == 6 && redutorSexo == 5){
  //     this.contribuicaoTotal -= this.contribuicaoTotal - 5;
  //   }

  //   let contribuicao85_95 = this.contribuicaoTotal + this.idadeFracionada;
  //   let contribuicao86_96 = this.contribuicaoTotal + this.idadeFracionada;
  //   let contribuicao87_97 = this.contribuicaoTotal + this.idadeFracionada;
  //   let contribuicao88_98 = this.contribuicaoTotal + this.idadeFracionada;
  //   let contribuicao89_99 = this.contribuicaoTotal + this.idadeFracionada;
  //   let contribuicao90_100 = this.contribuicaoTotal + this.idadeFracionada;

  //   let dateFormat = "DD/MM/YYYY";
  //   let dataRegra85_95 = moment('17/06/2016', dateFormat);
  //   let dataRegra86_96 = moment('31/12/2018', dateFormat);
  //   let dataRegra87_97 = moment('31/12/2020', dateFormat);
  //   let dataRegra88_98 = moment('31/12/2022', dateFormat);
  //   let dataRegra89_99 = moment('31/12/2024', dateFormat);
  //   let dataRegra90_100 = moment('31/12/2026', dateFormat);

  //   let dataFimRegra85_95 = moment('30/12/2018', dateFormat);
  //   let dataFimRegra86_96 = moment('30/12/2020', dateFormat);
  //   let dataFimRegra87_97 = moment('30/12/2022', dateFormat);
  //   let dataFimRegra88_98 = moment('30/12/2024', dateFormat);
  //   let dataFimRegra89_99 = moment('30/12/2026', dateFormat);
  //   let dataFimRegra90_100 = moment('30/12/2052', dateFormat);

  //   let dataBeneficio = this.dataInicioBeneficio;
  //   let teto = moedaDib.teto;
  //   let minimo = moedaDib.salario_minimo;

  //   let comparacaoContribuicao = 35 - redutorSexo;
  //   if(naoFocado){
  //     if(fatorSeguranca <= 1){
  //       conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca});//resultados['Fp - fator previdenciário'] = fatorSeguranca;
  //     }else{
  //       conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '(Incide fator previdenciario)'});//resultados['Fp - fator previdenciário'] = fatorSeguranca + '(Incide fator previdenciario)';
  //     }
  //   }else{
  //     if (dataBeneficio >= dataRegra85_95) {
  //       if (dataBeneficio <= dataFimRegra85_95) {
  //         if (fatorSeguranca >= 1 && contribuicao85_95 >= 95 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo && this.tipoBeneficio == 4) {
  //           somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
  //           conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Fator Previdenciário favorável'});//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca + '- Fator Previdenciário favorável';
  //           conclusoes.push({string:"Renda Mensal Inicial com Regra 85/95:",value:currency.acronimo + somaMedias});//resultados['Renda Mensal Inicial com Regra 85/95: '] = currency.acronimo + somaMedias
  //         }else if(fatorSeguranca >= 1 && contribuicao85_95 >= 95 && tempoTotalContribuicao >= comparacaoContribuicao && this.tipoBeneficio == 6) {     
  //           somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
  //           conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Fator Previdenciário favorável'});//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca + '- Fator Previdenciário favorável';
  //           conclusoes.push({string:"Renda Mensal Inicial com Regra 80/90:",value:currency.acronimo + somaMedias});//resultados['Renda Mensal Inicial com Regra 80/90: '] = currency.acronimo + somaMedias
  //         }else if(fatorSeguranca < 1 && contribuicao85_95 >= 95 && tempoTotalContribuicao >= comparacaoContribuicao && this.tipoBeneficio == 4) {
  //           somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
  //           conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- FP desfavorável (Aplica-se a regra 85/95)'});//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca + '- FP desfavorável (Aplica-se a regra 85/95)';
  //           conclusoes.contribuicao89_99push({string:"Renda Mensal Inicial com Regra 85/95:",value:currency.acronimo + somaMedias});//resultados['Renda Mensal Inicial com Regra 85/95: '] = currency.acronimo + somaMedias;
  //         }else if(fatorSeguranca < 1 && contribuicao85_95 < 95 && tempoTotalContribuicao < comparacaoContribuicao) {
  //           if (this.tipoBeneficio == 6) {
  //             conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Não tem direito a Regra 80/90'});//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
  //           }else{
  //             conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Não tem direito a Regra 85/95'});//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
  //           }
  //         }else if(fatorSeguranca > 1 && contribuicao85_95 >= 95 && tempoTotalContribuicao < comparacaoContribuicao) {
  //           if (this.tipoBeneficio == 6) {
  //             conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Não tem direito a Regra 80/90'});//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
  //           }else{
  //             conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Não tem direito a Regra 85/95'});//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
  //           }
  //         }else if(fatorSeguranca < 1 && contribuicao85_95 < 95 && tempoTotalContribuicao >= comparacaoContribuicao) {
  //           if (this.tipoBeneficio == 6) {
  //             conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Não tem direito a Regra 80/90'});//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
  //           }else{
  //             conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Não tem direito a Regra 85/95'});//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
  //           }
  //         }else if(dataBeneficio < dataRegra85_95 || dataBeneficio > dataFimRegra85_95){
  //           conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca});//resultados['Fp - fator Previdenciario: '] = fatorSeguranca;
  //         }
  //       }else if(dataBeneficio >= dataRegra86_96 && dataBeneficio <= dataFimRegra86_96){
  //         this.tratamentoDeRegras(dataRegra86_96, dataFimRegra86_96, contribuicao86_96, 96, tempoTotalContribuicao, fatorSeguranca, '86/96', comparacaoContribuicao, conclusoes);
  //       }else if(dataBeneficio >= dataRegra87_97  && dataBeneficio <= dataFimRegra87_97) {
  //         this.tratamentoDeRegras(dataRegra87_97, dataFimRegra87_97, contribuicao87_97, 97, tempoTotalContribuicao, fatorSeguranca, '87/97', comparacaoContribuicao, conclusoes);
  //       }else if(dataBeneficio >= dataRegra88_98  && dataBeneficio <= dataFimRegra88_98) {
  //         this.tratamentoDeRegras(dataRegra88_98, dataFimRegra88_98, contribuicao88_98, 98, tempoTotalContribuicao, fatorSeguranca, '88/98', comparacaoContribuicao, conclusoes);
  //       }else if(dataBeneficio >= dataRegra89_99  && dataBeneficio <= dataFimRegra89_99) {
  //         this.tratamentoDeRegras(dataRegra89_99, dataFimRegra89_99, contribuicao89_99, 99, tempoTotalContribuicao, fatorSeguranca, '89/99', comparacaoContribuicao, conclusoes);
  //       }else if(dataBeneficio >= dataRegra90_100  && dataBeneficio <= dataFimRegra90_100) {
  //         this.tratamentoDeRegras(dataRegra90_100, dataFimRegra90_100, contribuicao90_100, 100, tempoTotalContribuicao, fatorSeguranca, '90/100', comparacaoContribuicao, conclusoes);
  //       }
  //       }else{
  //         conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca});//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca;
  //       }
  //     }
  //       if (irt >= 1) {
  //         conclusoes.push({string:"Índice de reajuste no teto:",value:this.formatDecimal(irt, 4)});//resultados['Índice de reajuste no teto: '] = irt; // Arredondar para 4 casas decimais;
  //       }

  //       conclusoes.push({string:"Expectativa de Sobrevida:",value:this.formatDecimal(expectativa, 4)});//resultados['Expectativa de Sobrevida: '] = expectativa; // Arredondar para 4 casas decimais;

  //       if (this.tipoBeneficio == 29) {
  //         rmi = somaMedias * (coeficiente / 100);
  //         if (rmi <= moedaDib.salario_minimo) {
  //           rmi = moedaDib.salario_minimo;
  //         }
  //       }

  //       if (dataBeneficio >= this.dataMP664) {
  //         if (this.tipoBeneficio == 1 && rmi > totalMediaDozeContribuicoes) {
  //           if (totalMediaDozeContribuicoes > 0) 
  //             rmi = totalMediaDozeContribuicoes;
  //         }
  //         if (this.tipoBeneficio == 1) {
  //           let rmi2 = 0;
  //           rmi2 = somaMedias * (coeficiente / 100);
  //           conclusoes.push({string:"Média das contribuições x Coeficiente do Cálculo:",value:this.formatMoney(rmi2, currency.acronimo)});//resultados['Média das contribuições x Coeficiente do Cálculo: '] = currency.acronimo + rmi2;
  //         }
  //       }

  //       if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6 || this.tipoBeneficio == 3 || this.tipoBeneficio == 16) {
  //         conclusoes.push({string:"Renda Mensal Inicial com Fator Previdenciario:",value:this.formatMoney(rmi, currency.acronimo)});//resultados['Renda Mensal Inicial com Fator Previdenciario: '] = currency.acronimo + rmi;
  //       }else{
  //         conclusoes.push({string:"Renda Mensal Inicial:",value:this.formatMoney(rmi, currency.acronimo)});//resultados['Renda Mensal Inicial: '] = currency.acronimo + rmi;
  //       }
  //       this.calculoApos99TableData = tableData;
  //       this.calculoApos99TableOptions = {
  //           ...this.calculoApos99TableOptions,
  //           data: this.calculoApos99TableData,
  //       }
  //       // TODO: Salvar Valor do Beneficio no Banco de Dados (rmi, somaContribuicoes);
  // }

  // corrigirBeneficio(beneficio, coeficiente, moeda) {
  //   let beneficioCorrigido = beneficio;
  //   if (beneficio > moeda.teto){
  //     beneficioCorrigido = moeda.teto * coeficiente /100;
  //     this.limited = true;
  //   }
  //   if (beneficio < moeda.salario_minimo && this.tipoBeneficio != 7) {
  //     beneficioCorrigido = moeda.salario_minimo
  //   }
  //   return beneficioCorrigido;
  // }

  // projetarExpectativa(idadeFracionada, dib, conclusoes) {
  //   let expectativa = 0;

  //   let dataInicio = moment('2000-11-30');
  //   let dataFim = moment('2016-12-01');
  //   let dataHoje = moment();

  //   if (dib > dataHoje) {
  //     let anos = dataHoje.diff(dib, 'years');

  //     let tempo1 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-2, 'years')).year(), null, null);
  //     let tempo2 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-3, 'years')).year(), null, null);
  //     let tempo3 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-4, 'years')).year(), null, null);
  //     expectativa = (anos * Math.abs((tempo1 + tempo2 + tempo3) / 3) - tempo1) + tempo1;
  //     conclusoes.push({string:'Fórmula Expectativa de Sobrevida:' ,value: "("+anos+ " * (((" + tempo1 + " + " + tempo2 + "+" + tempo3 + ") / 3) -" + tempo1 + "))" + "+" + tempo1});//formula_expectativa_sobrevida = "(anos * (((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1";
  //   } else if (dib <= dataInicio) {
  //     expectativa = this.procurarExpectativa(idadeFracionada, null, null, dataInicio);
  //   } else if (dib >= dataFim) {
  //     expectativa = this.procurarExpectativa(idadeFracionada, null, dib, null);
  //   } else {
  //     expectativa = this.procurarExpectativa(idadeFracionada, null, dib, dib);
  //   }

  //   if (expectativa <= 0) {
  //     expectativa = 6;
  //   }

  //   return expectativa;
  // }

  // procurarExpectativa(idadeFracionada, ano, dataInicio, dataFim) {
  //   let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
  //   let dataAgora = moment();
  //   let expectativaVida;
  //   if (idadeFracionada > 80){
  //     idadeFracionada = 80;
  //   }    
  //   if (ano != null) {
  //     expectativaVida = this.ExpectativaVida.getByAno(ano);//Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e year == ano
  //   }else{
  //     expectativaVida = this.ExpectativaVida.getByDates(dataInicio, dataFim);
  //   }
  //   return expectativaVida;
  // }

  // tratamentoDeRegras(dataRegra, dataFimRegra, valorRegra, valorComparacao, tempoTotalContribuicao, fatorSeguranca, resultString, comparacaoTempoContribuicao, conclusoes) {
  //   let currency = this.loadCurrency(this.dataInicioBeneficio);
  //   let somaMedias;
  //   if (fatorSeguranca >= 1 && valorRegra >=  valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao && this.tipoBeneficio == 4) {
  //     somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
  //     conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Fator Previdenciário favorável'});//conclusoes.fator_previdenciario = fatorSeguranca + '- Fator Previdenciário favorável';
  //     conclusoes.push({string:'Renda Mensal Inicial com Regra ' + resultString + ':',value:currency.acronimo + somaMedias});//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
  //     //resultados['Renda Mensal Inicial com Regra ' + resultString + ': '] = currency.acronimo + somaMedias;
  //   }else if(fatorSeguranca >= 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao){
  //     if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
  //       somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
  //       conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Fator Previdenciário favorável'});//conclusoes.fator_previdenciario = fatorSeguranca + '- Fator Previdenciário favorável';
  //       conclusoes.push({string:'Renda Mensal Inicial com Regra ' + resultString + ':',value:currency.acronimo + somaMedias});//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
  //       //resultados['Renda Mensal Inicial com Regra'+ resultString + ' : '] = currency.acronimo + somaMedias
  //     }
  //   }else if(fatorSeguranca < 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao) {
  //     if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
  //       somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
  //       conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- FP desfavorável (Aplica-se a regra ' + resultString + ')'});//conclusoes.fator_previdenciario = fatorSeguranca + '- FP desfavorável (Aplica-se a regra ' + resultString+ ')';
  //       conclusoes.push({string:'Renda Mensal Inicial com Regra ' + resultString + ':',value:currency.acronimo + somaMedias});//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
  //       //resultados['specieKind = 4Renda Mensal Inicial com Regra'+ resultString + ': '] = currency.acronimo + somaMedias;
  //     }
  //   }else if(fatorSeguranca < 1 && valorRegra < valorComparacao && tempoTotalContribuicao < comparacaoTempoContribuicao){
  //     if (this.tipoBeneficio == 6 || this.tipoBeneficio == 4) {
  //       conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Não tem direito a Regra' + resultString});//conclusoes.fator_previdenciario = fatorSeguranca + '- Não tem direito a Regra' + resultString;
  //     }
  //   }else if (fatorSeguranca > 1 && valorRegra >= valorComparacao && tempoTotalContribuicao < comparacaoTempoContribuicao) {
  //     conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Tem direito a regra ' + resultString +' (Não possui 35 anos de contribuicao)'});//conclusoes.fator_previdenciario =  fatorSeguranca + '- Tem direito a regra ' + resultString +' (Não possui 35 anos de contribuicao)';
  //   }else if (fatorSeguranca < 1 && valorRegra < valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao) {
  //     conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca + '- Não tem direito a Regra '+ resultString});//conclusoes.fator_previdenciario = fatorSeguranca + '- Não tem direito a Regra'+ resultString;
  //   }else if (this.dataInicioBeneficio < dataRegra || this.dataInicioBeneficio > dataFimRegra){
  //     conclusoes.push({string:"Fp - Fator Previdenciário:",value:fatorSeguranca});//conclusoes.fator_previdenciario = fatorSeguranca;
  //   }
  // }

  // getTaxaSecundaria(redutorProfessor, redutorSexo, contadorSecundario) {
  //   let taxaSecundaria = 0;
  //   let tempoServicoSecundario = this.getTempoServico(0,0,true);
  //   let quantidadePBCSecudaria = contadorSecundario;

  //   let specieKind;
  //   if(this.tipoBeneficio == 4 || this.tipoBeneficio ==  5 || this.tipoBeneficio ==  6 ||
  //     this.tipoBeneficio == 8 || this.tipoBeneficio ==  9 || this.tipoBeneficio ==  10 ||
  //     this.tipoBeneficio == 14 || this.tipoBeneficio ==  15){
  //     specieKind = 1;
  //   }else if(this.tipoBeneficio == 3 || this.tipoBeneficio == 16|| this.tipoBeneficio == 13){
  //     specieKind = 2;
  //   }else if(this.tipoBeneficio == 1 || this.tipoBeneficio == 2 || this.tipoBeneficio == 11
  //            || this.tipoBeneficio == 29){
  //     specieKind = 3;
  //   }else if(this.tipoBeneficio == 25){
  //     specieKind = 4;
  //   }else{
  //     specieKind = null;
  //   }

  //   let tempoServico = 0;
  //   switch(specieKind){
  //     case 1:
  //       tempoServico = tempoServicoSecundario / 365;   
  //       let redutorProporcional = 0;
  //       if(this.isProportional){
  //           redutorProporcional = 5;
  //       }
  //       taxaSecundaria = tempoServico / (35 - redutorProfessor - redutorSexo - redutorProporcional);
  //       break;
  //     case 2:
  //       tempoServico = tempoServicoSecundario / 30;
  //       let carenciaMeses = this.getMesesCarencia();
  //       taxaSecundaria = tempoServico / carenciaMeses;
  //       break;
  //     case 3:
  //         taxaSecundaria = quantidadePBCSecudaria / 12;
  //         break;
  //     case 4:
  //       tempoServico = tempoServicoSecundario / 365;
  //       if(redutorSexo == 5){
  //         taxaSecundaria = tempoServico / 20;
  //       }else{
  //         taxaSecundaria = tempoServico / 25;
  //       }
  //       break;
  //     case 5:
  //       tempoServico = tempoServicoSecundario / 365;
  //       if(redutorSexo == 5){
  //         taxaSecundaria = tempoServico / 23;
  //       }else{
  //         taxaSecundaria = tempoServico / 28;
  //       }
  //       break;
  //     case 6:
  //       tempoServico = tempoServicoSecundario / 365;
  //       if(redutorSexo == 5){
  //         taxaSecundaria = tempoServico / 28;
  //       }else{
  //         taxaSecundaria = tempoServico / 33;
  //       }
  //       break;
  //   }
  //   return taxaSecundaria;
  // }

  // getMesesCarencia(){
  //   let mesesCarencia = 180;
  //   if (this.dataFiliacao <= this.dataLei8213) {
  //     let progressiveLack = this.CarenciaProgressiva.getCarencia(this.dataInicioBeneficio.year());
  //     if(progressiveLack != 0){
  //       mesesCarencia = progressiveLack;
  //     }
  //   }
  //   return mesesCarencia;
  // }

  // getTempoServico(redutorProfessor, redutorSexo, secundario) {
  //   let tempo;

  //   if(secundario){
  //     tempo = this.contribuicaoSecundaria99;
  //     let contagemSecundaria = (tempo.anos * 365.25) + (tempo.meses * 30) + (tempo.dias);
  //     return contagemSecundaria;
  //   }

  //   tempo = this.contribuicaoPrimaria99;
  //   let contagemPrimaria = (tempo.anos * 365.25) + (tempo.meses * 30) + (tempo.dias);
  //   let contagemPrimariaAnos = contagemPrimaria / 365;
  //   if (this.tipoBeneficio == 6) { // Tempo de Serviço Professor
  //     contagemPrimariaAnos += redutorProfessor + redutorSexo;
  //   }

  //   this.contribuicaoTotal = contagemPrimariaAnos; 

  //   if (redutorSexo > 0) {
  //     if (this.tipoBeneficio == 16 || this.tipoBeneficio == 3 || this.tipoBeneficio == 4) {
  //       contagemPrimariaAnos += redutorSexo;
  //     }
  //   }
  //   return contagemPrimariaAnos;
  // }

  // getIndiceEspecie(especie, sexo, anoContribuicao){
		// let indiceAno = 0.0
  //   if (anoContribuicao != 0 ) {
  //       indiceAno = anoContribuicao / 100;
  //   }

  //   let index = 0.0;
  //   switch (especie){
  //     case 1: {// Auxílio Doença
  //     	index = 0.7;
  //       if (indiceAno > 0.2){
  //       	indiceAno = 0.2;
  //       }
  //       index += indiceAno;
  //       break;
  //     }
  //     case 2: {// Aposentadoria por invalidez
  //     	index = 0.7;
  //     	if (indiceAno > 0.3){
  //     	    indiceAno = 0.3;
  //     	}
  //     	index += indiceAno;
  //     	break;
  //     }
  //     case 3: { // Idade - trabalhador Rural
  //       index = 0.7;
  //       if (indiceAno > 0.25) {
  //       	indiceAno = 0.25;
  //       }
  //       index += indiceAno;
  //       break;
  //     }
  //     case 5: { // Idade - trabalhador Urbano
  //       index = 0.7;
  //       if (indiceAno > 0.25){
		// 			indiceAno = 0.25;
		// 		}
  //       index += indiceAno;
  //     	break;
  //     }
  //     case 16: {//Aposentadoria Especial.
  //     	index = 0.7;
  //       if (indiceAno > 0.25){
  //       	indiceAno = 0.25;
  //       }
  //       index += indiceAno;
  //       break;
  //     }
  //     case 4: {  // Aposentadoria por tempo de contribuição
  //     	if(sexo === 'm'){
  //     	  index = 0.8;
  //     	  let indiceAnoAux = anoContribuicao - 30;
  //     	  if(indiceAnoAux > 5){
  //     	  	indiceAnoAux = 5;
  //     	  }
  //     	  if(indiceAnoAux < 0){
  //     	  	indiceAnoAux = 0;
  //     	  }
  //     	  index += (0.03 * indiceAnoAux);
  //     	}else{
  //     	    index = 0.95;
  //     	}
  //     	break;
  //     }
  //     case 20: { 
  //       index = 0.2;
  //       break;
  //     }
  //     default:{
  //     	index = 0;
  //     	break;
  //     }
  //   }
  //   return index;
  // }

  getEspecieBeneficio(calculo){
    let numeroEspecie = 0;
    switch (calculo.tipo_seguro) {
      case "Auxílio Doença":
        numeroEspecie = 1;
        break;
      case "Aposentadoria por invalidez Previdenciária ou Pensão por Morte":
        numeroEspecie = 2;
        break;
      case "Aposentadoria por idade - Trabalhador Urbano":
        numeroEspecie = 3;
        break;
      case "Aposentadoria por tempo de contribuição":
        numeroEspecie = 4;
        break;
      case "Aposentadoria especial":
        numeroEspecie = 5;
        break;
      case "Aposentadoria por tempo de serviço de professor":
        numeroEspecie = 6;
        break;
      case "Auxílio Acidente previdenciário - 50%":
        numeroEspecie = 7;
        break;
      case "Aposentadoria por idade - Trabalhador Rural":
        numeroEspecie = 16;
        break;
      case "Auxílio Acidente - 30%":
        numeroEspecie = 17;
        break;
      case "Auxílio Acidente - 40%":
        numeroEspecie = 18;
        break;
      case "Auxílio Acidente - 60%":
        numeroEspecie = 19;
        break;
      case "Aposentadoria especial da Pessoa com Deficiência Grave":
        numeroEspecie = 25;
        break;
      case "Aposentadoria especial da Pessoa com Deficiência Moderada":
        numeroEspecie = 26;
        break;
      case "Aposentadoria especial da Pessoa com Deficiência Leve":
        numeroEspecie = 27;
        break;
      case "Aposentadoria especial por Idade da Pessoa com Deficiência":
        numeroEspecie = 28;
        break;
      default:
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

  // limitarTetosEMinimos(valor, data){
  //   let moeda = this.Moeda.getByDate(data);
  //   let salarioMinimo = moeda.salario_minimo;
  //   let tetoSalarial = moeda.teto;
  //   let avisoString = '';
  //   let valorRetorno = valor;

  //   if(valor < salarioMinimo){
  //     valorRetorno = salarioMinimo;
  //     avisoString = 'LIMITADO AO MÍNIMO'
  //   }else if(valor > tetoSalarial){
  //     valorRetorno = tetoSalarial;
  //     avisoString = 'LIMITADO AO TETO'
  //   }
  //   return {valor:valorRetorno, aviso:avisoString};
  // }

  getIndex(data){
    return this.getDifferenceInMonths(this.primeiraDataTabela,data);
  }

  getDifferenceInMonths(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.floor(difference);
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

  convertCurrency(valor, dataCorrente, dataConversao) {
    let valorConvertido = parseFloat(valor);
    for (let currency of this.currencyList) {
      let startDate = moment(currency.startDate);
      let endDate = moment(currency.endDate);
      if (dataCorrente > endDate) {
        // já esta em uma data maior que a data que a moeda termina, procurar na proxima
        continue;
      }else if (startDate > dataConversao) {
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

  getContribuicaoObj(stringContrib){
    let returnObj = {anos:0, meses:0, dias:0};
    if(stringContrib){
      let anos = (stringContrib.split('-')[0] != 'undefined') ? stringContrib.split('-')[0] : 0;
      let meses = (stringContrib.split('-')[1] != 'undefined') ? stringContrib.split('-')[1] : 0;
      let dias = (stringContrib.split('-')[2] != 'undefined') ? stringContrib.split('-')[2] : 0;
      returnObj = {anos: anos, meses:meses, dias:dias};
    }
    return returnObj;
  }

  // getDataInicio(){
  //   let dataInicio;
  //   if(this.calculo.tipo_aposentadoria == 'Anterior a 05/10/1988'){
  //     dataInicio = this.dataInicioBeneficio;
  //   }else{
  //     let dib = this.dataInicioBeneficio;
  //     if (this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999' && 
  //       this.dataInicioBeneficio > this.dataDib99) {
  //       dib = this.dataDib99;
  //     }
  //     if (this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998' &&
  //       this.dataInicioBeneficio > this.dataDib98) {
  //       dib = this.dataDib98;
  //     }

  //     dataInicio = (dib.clone()).startOf('month');
  //   }
  //   return dataInicio;
  // }

  controleExibicao(){
    let data88 = moment('1988-10-05');
    let data91 = moment('1991-04-04');
    let data91_98 = moment('1991-04-05');
    let data98_99 = moment('1998-12-15');
    let data99 = moment('1999-11-29');

    if(this.dataInicioBeneficio < data88){
      //* Periodo = Anterior a 05/10/88
      // Cálculos realizados: anterior a 88
      this.mostrarCalculoAnterior88 = true;
    }else if(this.dataInicioBeneficio >= data88 && this.dataInicioBeneficio <= data91){
      if(this.calculo.tipo_aposentadoria == 'Anterior a 05/10/1988'){
        //Cálculos: Anterior a 88
        this.mostrarCalculoAnterior88 = true;
      }else if(this.calculo.tipo_aposentadoria == 'Entre 05/10/1988 e 04/04/1991'){
        //Cálculos: anterior a 88 + entre 91 e 98 (realizar contas no mesmo box)
        this.contribuicaoPrimaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
        this.contribuicaoSecundaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);
        this.mostrarCalculoAnterior88 = true;
        this.mostrarCalculo91_98 = true;
        this.isBlackHole = true;
      }
    }else if(this.dataInicioBeneficio > data91_98 && this.dataInicioBeneficio <= data98_99){
      //Cálculos: entre 91 e 98
      this.mostrarCalculo91_98 = true;
    }else if(this.dataInicioBeneficio > data98_99 && this.dataInicioBeneficio <= data99){
      if(this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998'){
        //Cálculos: entre 91 e 98 (tempo de contribuicao até a ementa (98)
        this.mostrarCalculo91_98 = true;
        this.contribuicaoPrimaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
        this.contribuicaoSecundaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);
      }else if(this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999'){
        //Cálculos = entre 91 e 98) (tempo de contribuicao até a lei 99)(cálculos realizados em box separados)
        this.mostrarCalculo91_98 = true;
        this.contribuicaoPrimaria99 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_99);
        this.contribuicaoSecundaria99 = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_99);
      }
    }else if(this.dataInicioBeneficio > data99){
      /*Todos os periodos de contribuicao (entre 91 e 98, entre 98 e 99, após 99)
      Cálculos: entre 91 e 98 (tempo de contribuicao até ementa 98)
                entre 98 e 99 (tempo de contribuicao até lei 99)
                após 99     (tempo de contribuicao após a lei 99)
      (cálculos em box separados)*/
      this.mostrarCalculo91_98 = true;
      this.mostrarCalculo98_99 = true;
      this.mostrarCalculoApos99 = true;
      this.contribuicaoPrimaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
      this.contribuicaoSecundaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);
      this.contribuicaoPrimaria99 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_99);
      this.contribuicaoSecundaria99 = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_99);
      this.contribuicaoPrimariaAtual = this.getContribuicaoObj(this.calculo.contribuicao_primaria_atual);
      this.contribuicaoSecundariaAtual = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_atual);
    }
  }

  // getDataLimite(dataInicio){
  //   let mesesLimite = 0;
  //   let mesesLimiteTotal = 0;
  //   if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
  //     mesesLimite = 18;
  //     mesesLimiteTotal = 12;
  //   } else {
  //     mesesLimite = 48;
  //     mesesLimiteTotal = 36;
  //   }

  //   if(this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998'){
  //     mesesLimite = 36;
  //     mesesLimiteTotal = 48;
  //   }

  //   if(this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998'){
  //     mesesLimite = 36;
  //     mesesLimiteTotal = 48;
  //   }

  //   if(this.calculo.tipo_aposentadoria == 'A partir de 29/11/1999'){
  //     mesesLimite = 0;
  //     mesesLimiteTotal = 0;
  //   }

  //   let dataLimite;
  //   if(mesesLimite > 0){
  //     dataLimite = (dataInicio.clone()).add(-mesesLimite,'months');
  //   }else{
  //     dataLimite = moment('1994-07-01');
  //   }
  //   return dataLimite;
  // }

  // getIdadeFracionada(){
  //   let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
  //   let idadeEmDias = this.dataInicioBeneficio.diff(dataNascimento, 'days');
  //   return idadeEmDias/365.25;
  // }

  // getIN45(){
  //   this.withIN45 = true;
  //   if(this.tipoBeneficio == 25 || this.tipoBeneficio == 26 || this.tipoBeneficio == 27 || this.tipoBeneficio == 28){
  //     this.withIN45 = false;
  //   }
  // }

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

  getIdadeSegurado(){
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    return moment().diff(dataNascimento, 'years');
  }

  exportarParaBeneficios(data, valor, tipoCalculo){
    window.location.href='/#/beneficios/beneficios-calculos/'+ 
                          tipoCalculo + '/' +
                          this.segurado.id+
                          '?dib='+data+'&'+
                          'valor='+valor;
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

  getDataFiliacao(){
    if(this.segurado.data_filiacao){
      return moment(this.segurado.data_filiacao);
    }
    return null;
  }
}
