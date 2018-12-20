import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FadeInTop} from "../../../shared/animations/fade-in-top.decorator";
import * as moment from 'moment';

@FadeInTop()
@Component({
  //selector: 'sa-datatables-showcase',
  selector: 'app-rgps-valores-contribuidos-matriz',
  templateUrl: './rgps-valores-contribuidos-matriz.component.html',
  styleUrls: ['./rgps-valores-contribuidos-matriz.component.css'],
})


export class RgpsMatrizComponent implements OnInit {

  public anosConsiderados = [];
  public matrizHasValues = false;
  private hashKey;
  public matrixTableOptions = {
      paging: false, 
      ordering: false, 
      info: false, 
      searching: false
  }

  matriz = [{
      "ano": 0,
      "valores": []
    }
  ];

  constructor() {}

  ngOnInit() {
    //O campo hashKey é necessario pois a funçao getMatrixData recolhe os dados dos inputs do html.
    //No caso de mais de uma instancia do componente, poderá haver casos de campos com o mesmo id.
    this.hashKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  preencher(periodo){
    let monthList = this.monthAndYear(periodo.inicioPeriodo, periodo.finalPeriodo);

    let ano = monthList[0].split('-')[0];
    let valores = ['0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00'];
    this.anosConsiderados.push(ano);
    for (let entry of monthList){
      if(ano == entry.split('-')[0]){
        valores[+entry.split('-')[1]-1] =  this.formatMoney(periodo.salarioContribuicao);
      }else{
        this.updateMatrix(+ano, valores);
        ano = entry.split('-')[0];
        valores = ['0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00'];
        valores[+entry.split('-')[1]-1] = this.formatMoney(periodo.salarioContribuicao);
        this.anosConsiderados.push(ano);
      }
    }
    this.updateMatrix(+ano, valores);
  }

  getMatrixData(){
    let unique_anos = this.anosConsiderados.filter(this.onlyUnique);
    let data_dict = [];
    for(let ano of unique_anos){
      let valor_jan = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("01-"+ano+'-'+this.hashKey)).value);
      data_dict.push("01/"+ano+'-'+valor_jan);
      let valor_fev = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("02-"+ano+'-'+this.hashKey)).value);
      data_dict.push("02/"+ano+'-'+valor_fev);
      let valor_mar = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("03-"+ano+'-'+this.hashKey)).value);
      data_dict.push("03/"+ano+'-'+valor_mar);
      let valor_abr = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("04-"+ano+'-'+this.hashKey)).value);
      data_dict.push("04/"+ano+'-'+valor_abr);
      let valor_mai = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("05-"+ano+'-'+this.hashKey)).value);
      data_dict.push("05/"+ano+'-'+valor_mai);
      let valor_jun = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("06-"+ano+'-'+this.hashKey)).value);
      data_dict.push("06/"+ano+'-'+valor_jun);
      let valor_jul = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("07-"+ano+'-'+this.hashKey)).value);
      data_dict.push("07/"+ano+'-'+valor_jul);
      let valor_ago = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("08-"+ano+'-'+this.hashKey)).value);
      data_dict.push("08/"+ano+'-'+valor_ago);
      let valor_set = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("09-"+ano+'-'+this.hashKey)).value);
      data_dict.push("09/"+ano+'-'+valor_set);
      let valor_out = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("10-"+ano+'-'+this.hashKey)).value);
      data_dict.push("10/"+ano+'-'+valor_out);
      let valor_nov = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("11-"+ano+'-'+this.hashKey)).value);
      data_dict.push("11/"+ano+'-'+valor_nov);
      let valor_dez = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("12-"+ano+'-'+this.hashKey)).value);
      data_dict.push("12/"+ano+'-'+valor_dez);
    }
    return data_dict;
  }

  updateMatrix(ano, valores){
    if(!this.matrizHasValues){
      this.matriz.splice(0,1);
    }
    for(let entry of this.matriz){
      if(entry.ano == ano){
        let index = 0;
        for (index = 0; index < 12; ++index) {
          if(entry.valores[index] != valores[index] && valores[index] != '0,00'){
            entry.valores[index] = valores[index];
          }
        }
        return;
      }
    }
    this.matriz.push({ "ano": ano, "valores": valores });
    this.matrizHasValues = true;
  }

  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }

  getNumberFromTableEntry(tableEntry){
    if(tableEntry == ''){
      return 0.0;
    }
    return parseFloat((tableEntry).replace(',','.'));
  }

  //Retorna uma lista com os meses entre dateStart e dateEnd
  monthAndYear(dateStart, dateEnd){
    dateStart = '01/'+dateStart;
    dateEnd = '01/'+dateEnd;

    let startSplit = dateStart.split('/');
    let endSplit = dateEnd.split('/');

    dateStart = moment(startSplit[2]+'-'+startSplit[1]+'-'+startSplit[0]);
    dateEnd = moment(endSplit[2]+'-'+endSplit[1]+'-'+endSplit[0]);
    let timeValues = [];

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
       timeValues.push(dateStart.format('YYYY-MM'));
       dateStart.add(1,'month');
    }
    return timeValues;
  }

  //Recebe um valor float e retorna com duas casas decimais, virgula como separador
  formatMoney(data){
    data = parseFloat(data);
    //return 'R$ ' + (data.toFixed(2)).replace('.',',');
    return (data.toFixed(2)).replace('.',',');
  }
}
