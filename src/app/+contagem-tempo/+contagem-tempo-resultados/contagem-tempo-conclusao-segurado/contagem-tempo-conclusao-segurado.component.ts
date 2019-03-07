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
    sessionStorage.setItem('last_url', '/contagem-tempo/contagem-tempo-resultados/' + this.segurado.id + '/' + this.calculo.id);
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados/' + this.segurado.id + '/editar';
  }

  returnListaSegurados() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados';
  }

  editCalculo() {
    sessionStorage.setItem('last_url', '/contagem-tempo/contagem-tempo-resultados/' + this.segurado.id + '/' + this.calculo.id);
    window.location.href = '/#/contagem-tempo/contagem-tempo-calculos/' + this.segurado.id + '/' + this.calculo.id + '/editar';
  }

  returnListaCalculos() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-calculos/' + this.segurado.id;
  }

}
