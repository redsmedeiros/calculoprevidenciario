import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-contagem-tempo-conclusao-segurado',
  templateUrl: './contagem-tempo-conclusao-segurado.component.html',
  styleUrls: ['./contagem-tempo-conclusao-segurado.component.css']
})
export class ContagemTempoConclusaoSeguradoComponent implements OnInit {

  @Input() calculo;
  @Input() segurado;
  @Input() isUpdating;
  @Input() lastdateNascimento;

  public Math = Math;


  constructor() { }

  ngOnInit() { }

  editSegurado() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados/' +
      this.segurado.id + '/editar?last=resultados&calc=' + this.calculo.id;
  }

  returnListaSegurados() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados';
  }

  editCalculo() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-calculos/' +
    this.segurado.id + '/' +  this.calculo.id + '/editar?last=resultados';
  }

  returnListaCalculos() {
    window.location.href = '#/contagem-tempo/contagem-tempo-calculos/' +
    this.segurado.id;
  }

}
