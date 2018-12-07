import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-contagem-tempo-conclusao-graph',
  templateUrl: './contagem-tempo-conclusao-graph.component.html',
  styleUrls: ['./contagem-tempo-conclusao-graph.component.css']
})
export class ContagemTempoConclusaoGraphComponent implements OnInit {

  public dataGraph = [];
  public optionsGraph: any;
  public isUpdateGraph = true;
  public limitGraph: any;

  public objYkeys = [];
  public objLabels = [];

  @Input() public periodosList: any;

  constructor() { }

  ngOnInit() {
    this.getGraphPeriodos();
  }

  private getGraphPeriodos() {

    // this.createGrafData();
    this.defineInicioFim();

    // console.log(this.limitGraph);

    this.createGrafData();

    this.createLabel();


    this.optionsGraph = {
      xkey: 'period',
      ykeys: this.objYkeys,
      labels: this.objLabels,
      smooth: false,
      ymin: 1,
      xLabelFormat: function (d) { return  d.getFullYear(); },
      yLabelFormat: function (d) { return ' '; }, // (d > 0) ? 'Vinculo: ' + d : ''
     // xLabelFormat: function (d) { return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(); },
      // xLabelFormat: function (d) { return this.formatReceivedDate(d); }
    };


    // this.dataGraph = [
    //   { 'period': '2012-10-01', 'licensed': 10 },
    //   { 'period': '2012-09-30', 'sorned': null },
    //   { 'period': '2012-09-29', 'sorned': 5 },
    //   { 'period': '2012-09-20', 'licensed': 10, 'sorned': 5 },
    //   { 'period': '2012-09-19', 'licensed': null, 'sorned': null },
    //   { 'period': '2012-09-18', 'licensed': null, 'other': 5 },
    //   { 'period': '2012-09-17', 'sorned': 5 },
    //   { 'period': '2012-09-16', 'sorned': 5 },
    //   { 'period': '2012-09-15', 'licensed': 10, 'sorned': 5 },
    //   { 'period': '2012-09-10', 'licensed': 10 }
    // ];

    // this.optionsGraph = {
    //   xkey: 'period',
    //   ykeys: ['licensed', 'sorned', 'other'],
    //   labels: ['Licensed', 'SORN', 'Other'],
    //   xLabelFormat: function (d) { return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(); },
    //   // xLabelFormat: function (d) { return this.formatReceivedDate(d); }
    // };


    this.isUpdateGraph = false;
  }

  private defineInicioFim() {
    let inicio = moment('2050-01-01');
    let fim = moment('1900-01-01');

    let inicioVinculo: any;
    let fimVinculo: any;

    for (const vinculo of this.periodosList) {

      inicioVinculo = this.toMoment(vinculo.data_inicio)
      fimVinculo = this.toMoment(vinculo.data_termino)

      if (inicioVinculo < inicio) {
        inicio = inicioVinculo;
      }

      if (fimVinculo > fim) {
        fim = fimVinculo;
      }
    }

    this.limitGraph = { inicio: inicio, fim: fim };

  }




  private createObjGraf(auxiliarDate) {
    let obj = {};


    let inicioVinculo: any;
    let fimVinculo: any;


    obj['period'] = auxiliarDate.format('YYYY');
    for (const vinculo of this.periodosList) {

      inicioVinculo = this.toMoment(vinculo.data_inicio);
      fimVinculo = this.toMoment(vinculo.data_termino);

      // console.log(inicioVinculo);
      // console.log(fimVinculo);
      // console.log((auxiliarDate >= inicioVinculo && auxiliarDate <= fimVinculo));


      if (auxiliarDate >= inicioVinculo && auxiliarDate <= fimVinculo) {
        //  fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
        obj[vinculo.empresa] = vinculo.vinculo;
      }

    }
    this.dataGraph.push(obj);

  }


  private createLabel() {

    for (const vinculo of this.periodosList) {

      this.objYkeys.push(vinculo.empresa);
      this.objLabels.push(vinculo.empresa);
    }
  }


  private createGrafData() {

    let auxiliarDate = this.limitGraph.inicio;
    const fimContador = moment(this.toDateString(this.limitGraph.fim), 'DD/MM/YYYY').add(1, 'd');

    do {

      this.createObjGraf(auxiliarDate);
      auxiliarDate = moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY').add(1, 'M');

    } while (auxiliarDate <= fimContador);



    // console.log(this.dataGraph);
    // console.log(this.objYkeys);
    // console.log(this.objLabels);

  }


  // private defineObjLineGraph(){

  // }


  // private createDataGraph(graphArea) {

  //   let auxiliarDate = graphArea.inicio;
  //   let count = moment.duration();

  //   console.log(graphArea);
  //   console.log(count);


  //   let vinculos = [];
  //   do {

  //     // console.log(auxiliarDate)

  //     // console.log(moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY' ).add(1, 'M'));

  //     auxiliarDate = moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY' ).add(1, 'd');

  //     // console.log(moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY' ).add(1, 'y'));

  //    // console.log(auxiliarDate.add(1, 'days'));
  //    // auxiliarDate =  auxiliarDate.add(1, 'days');
  //     // console.log(moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY' ).add(1, 'M'));
  //     // period = moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY' ).add(1, 'M');

  //     count.add(moment.duration(1, 'd')).days();

  //     vinculos.push(auxiliarDate);

  //   } while (auxiliarDate <= graphArea.fim);

  //   // console.log(vinculos);
  //   // console.log(count);

  // }



  // private createGrafData() {

  //   // let graphData = [];

  //   let graphArea = this.defineInicioFim();

  //   this.dataGraph = this.createDataGraph(graphArea);
  //   this.isUpdateGraph = false;
  //   // console.log(graphArea);



  // }



  toMoment(dateString) {
    return moment(dateString, 'DD/MM/YYYY');
  }

  toDateString(date) {
    return date.format('DD/MM/YYYY');
  }

  formatReceivedDate(inputDate) {
    let date = moment(inputDate, 'YYYY-MM-DD');
    return date.format('DD/MM/YYYY');
  }

  formatPostDataDate(inputDate) {
    let date = moment(inputDate, 'DD/MM/YYYY');
    return date.format('YYYY-MM-DD');
  }




}
