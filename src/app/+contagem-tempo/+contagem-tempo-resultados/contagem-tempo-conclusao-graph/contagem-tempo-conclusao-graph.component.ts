import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contagem-tempo-conclusao-graph',
  templateUrl: './contagem-tempo-conclusao-graph.component.html',
  styleUrls: ['./contagem-tempo-conclusao-graph.component.css']
})
export class ContagemTempoConclusaoGraphComponent implements OnInit {


  public dataGraph: any;
  public optionsGraph: any;


  constructor() { }

  ngOnInit() {

    this.getGraphPeriodos();
  }



  
  getGraphPeriodos() {

    this.dataGraph = [
      {'period': '2012-10-01', 'licensed': 10},
      {'period': '2012-09-30', 'sorned': null},
      {'period': '2012-09-29', 'sorned': 5},
      {'period': '2012-09-20', 'licensed': 10, 'sorned': 5},
      {'period': '2012-09-19', 'licensed': null, 'sorned': null},
      {'period': '2012-09-18', 'licensed': null, 'other': 5},
      {'period': '2012-09-17', 'sorned': 5},
      {'period': '2012-09-16', 'sorned': 5},
      {'period': '2012-09-15', 'licensed': 10, 'sorned': 5},
      {'period': '2012-09-10', 'licensed': 10}
    ];

    this.optionsGraph = {
                xkey: 'period',
                ykeys: ['licensed', 'sorned', 'other'],
                labels: ['Licensed', 'SORN', 'Other']
            };
  }

  
  formatPostDataDate(inputDate) {

    let date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + (date.getDate())).slice(-2);
    }
    return '';

  }

}
