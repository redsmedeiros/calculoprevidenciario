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
  public lineColorsList = [];


  @Input() public periodosList = [];

  constructor() { }

  ngOnInit() {

    this.getGraphPeriodos();
  }

  private getGraphPeriodos() {

    if (this.periodosList.length > 0) {

      this.defineInicioFim();

      this.createGrafData();

      this.createLabel();

      this.optionsGraph = {
        xkey: 'period',
        ykeys: this.objYkeys,
        labels: this.objLabels,
        smooth: false,
        ymin: 1,
        ymax: this.periodosList.length + 1,
        parseTime: false,
        resize: true,
        lineColors: this.lineColorsList,
        pointSize: '0px',
        lineWidth: '10px',
        // xLabelFormat: function (d) {
        //     return d.getFullYear();
        // },
        yLabelFormat: function (d) {

          return (d != undefined && d) ? Math.round(d) : ''; // Math.round(d);
        }, // (d > 0) ? 'Vinculo: ' + d : ''
        // xLabelFormat: function (d) {
        //   return (d.getMonth() + 1) + '/' + d.getFullYear();
        // },
        // xLabelFormat: function (d) {
        // return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(); },
        // xLabelFormat: function (d) { return this.formatReceivedDate(d); }
        hoverCallback: function (index, options, content, row) {

        
            // console.log(options.data[index]);
            const obj = options.data[index];
            let labelHover = '';
            let vinculos = '';
            let periodo = '';
            let text = '';

            Object.getOwnPropertyNames(obj).forEach(function (val, idx, array) {

              if (val === 'period') {
                periodo = obj[val];
              } else if (typeof obj[val] !== 'undefined' && obj[val] !== undefined && obj[val] != '') {
                vinculos += '&nbsp;' + obj[val] + ','
              }
              //    labelHover += (val === 'period') ? '<b class="label label-default fa-1-2x">' + obj[val] + '</b> Vínculo(s): &nbsp;' : '&nbsp;'+ obj[val] + ',';
            });

            labelHover = '<b class="label label-default fa-1-2x">' + periodo + '</b>'

            if (typeof vinculos != 'undefined' && vinculos != '') {
              if (vinculos.search(/\,&nbsp;/g)) {
                labelHover += ' &nbsp;Vínculos: &nbsp;' + vinculos;
              } else {
                labelHover += ' &nbsp;Vínculo: &nbsp;' + vinculos;
              }

            }
            return labelHover.slice(0, -1);
         
        }

      };


      // console.log(this.dataGraph);
      // console.log(this.objYkeys);
      // console.log(this.objLabels);

      // this.optionsGraph.data.forEach(function (label, i) {
      //   const legendItem = document.getElementsByTagName('<span>').text(label['label'] + ' 
      // ( ' + label['value'] + ' )').createElement('<br><span>&nbsp;</span>');
      //   legendItem.find('span')
      //     .css('backgroundColor', this.optionsGraph.colors[i])
      //     .css('width', '20px')
      //     .css('display', 'inline-block')
      //     .css('margin', '5px');
      //   $('#legend').append(legendItem)
      // });


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

    }
    this.isUpdateGraph = false;

  }


  public getColorLegend(index) {
    return this.lineColorsList[index];
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
    const obj = {};


    let inicioVinculo: any;
    let fimVinculo: any;


    obj['period'] = auxiliarDate.format('YYYY');
    for (const vinculo of this.periodosList) {

      inicioVinculo = this.toMoment(vinculo.data_inicio);
      fimVinculo = this.toMoment(vinculo.data_termino);

      if (auxiliarDate >= inicioVinculo && auxiliarDate <= fimVinculo) {
        // obj[vinculo.empresa + '' + vinculo.vinculo] = vinculo.vinculo;
        // obj[vinculo.vinculo] = vinculo.vinculo;
        obj[vinculo.vinculo + '-Vinculo'] = vinculo.vinculo;
        // obj['Vinculo'] = vinculo.vinculo;

      }

    }
    this.dataGraph.push(obj);

  }


  private createLabel() {

    function r() { return Math.floor(Math.random() * 255) }
    // function r() { return this.listColors[Math.floor(Math.random() * 145)] }

    for (const vinculo of this.periodosList) {

      // this.objYkeys.push(vinculo.empresa + '' + vinculo.vinculo);
      // this.objLabels.push(vinculo.empresa );

      // this.objYkeys.push(vinculo.vinculo);
      // this.objLabels.push(vinculo.vinculo);

      this.objYkeys.push(vinculo.vinculo + '-Vinculo');
      // this.objYkeys.push('Vinculo');
      this.objLabels.push(vinculo.vinculo + 'º Vinculo');

      // this.lineColorsList.push('#' + this.listColors[i]);
      // this.lineColorsList.push(r());
      this.lineColorsList.push('rgb(' + r() + ',' + r() + ',' + r() + ')');
    }
  }


  private createGrafData() {

    let auxiliarDate = this.limitGraph.inicio;
    const fimContador = moment(this.toDateString(this.limitGraph.fim), 'DD/MM/YYYY').add(1, 'd');

    do {

      this.createObjGraf(auxiliarDate);
      auxiliarDate = moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY').add(1, 'M');

    } while (auxiliarDate <= fimContador);

  }



  toMoment(dateString) {
    return moment(dateString, 'DD/MM/YYYY');
  }

  toDateString(date) {
    return date.format('DD/MM/YYYY');
  }

  formatReceivedDate(inputDate) {
    const date = moment(inputDate, 'YYYY-MM-DD');
    return date.format('DD/MM/YYYY');
  }

  formatPostDataDate(inputDate) {
    const date = moment(inputDate, 'DD/MM/YYYY');
    return date.format('YYYY-MM-DD');
  }




}
