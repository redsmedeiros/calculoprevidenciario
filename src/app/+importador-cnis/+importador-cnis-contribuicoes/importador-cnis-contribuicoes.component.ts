import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';

@Component({
  selector: 'app-importador-cnis-contribuicoes',
  templateUrl: './importador-cnis-contribuicoes.component.html',
  styleUrls: ['./importador-cnis-contribuicoes.component.css']
})
export class ImportadorCnisContribuicoesComponent implements OnInit, OnChanges {

  @Input() vinculos;
  @Input() isUpdating;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    let changedvinculos = changes['vinculos'];
    let changedisUpdating = changes['isUpdating'];

     console.log(changedvinculos);
     console.log(changedisUpdating);


  }



}