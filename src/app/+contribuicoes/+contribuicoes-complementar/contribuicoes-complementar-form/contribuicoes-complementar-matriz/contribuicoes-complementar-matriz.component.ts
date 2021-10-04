import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contribuicoes-complementar-matriz',
  templateUrl: './contribuicoes-complementar-matriz.component.html',
  styleUrls: ['./contribuicoes-complementar-matriz.component.css']
})
export class ContribuicoesComplementarMatrizComponent implements OnInit {

  @Input() matriz;
  @Input() matrizHasValues;

  public matrixTableOptions = {
    paging: false,
    ordering: false,
    info: false,
    searching: false
  };

  constructor() { }

  ngOnInit() {
  }

}
