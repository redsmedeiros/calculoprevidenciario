import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { CalculoRgpsService } from '../+rgps-calculos/CalculoRgps.service';
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
  public idCalculo = '';

  public currencyList = [
	{
		"startDate": "",
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

  public calculoList = [];
  public grupoCalculosTableOptions = {
    colReorder: false,
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

  constructor(protected router: Router,
    private route: ActivatedRoute,
    protected Segurado: SeguradoService,    
    protected CalculoRgps: CalculoRgpsService,) {}

  ngOnInit() {
  	this.idSegurado = this.route.snapshot.params['id_segurado'];
  	this.idCalculo = this.route.snapshot.params['id'];
    this.isUpdating = true;
    this.Segurado.find(this.idSegurado)
        .then(segurado => {
            this.segurado = segurado;
            this.CalculoRgps.find(this.idCalculo)
              .then(calculo => {
                this.calculo = calculo;
                this.preencheGrupoDeCalculos();
                this.isUpdating = false;
            });
    });
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
      	// já ultrapassou a data de converção, finalizar o calculo
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
      	if(sexo === 'Masculino'){
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


  editSegurado() {
    window.location.href='/#/rgps/rgps-segurados/'+ this.idSegurado+'/editar';
  }

  listaSegurados(){
    window.location.href='/#/rgps/rgps-segurados/';
  }

  infoCalculos(){
  	window.location.href='/#/rgps/rgps-calculos/' + this.idSegurado;
  }

  imprimirPagina(){
    let printContents = document.getElementById('content').innerHTML;
    let popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWin.document.close();
  }

}
