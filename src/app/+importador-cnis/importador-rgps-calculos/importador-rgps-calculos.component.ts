import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';

@Component({
  selector: 'app-importador-rgps-calculos',
  templateUrl: './importador-rgps-calculos.component.html',
  styleUrls: ['./importador-rgps-calculos.component.css']
})
export class ImportadorRgpsCalculosComponent implements OnInit, OnChanges {

  @Input() dadosPassoaPasso;
  @Input() idSeguradoSelecionado;
  @Input() idCalculoSelecionadoCT;


  constructor() { }

  ngOnInit() {
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const changedisUpdating = changes['isUpdating'];
    const calculo = changes['calculo'];



  }


  
}
