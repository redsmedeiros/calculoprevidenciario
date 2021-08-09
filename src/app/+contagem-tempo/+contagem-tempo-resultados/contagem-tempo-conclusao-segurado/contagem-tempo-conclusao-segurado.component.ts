import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';


@Component({
  selector: 'app-contagem-tempo-conclusao-segurado',
  templateUrl: './contagem-tempo-conclusao-segurado.component.html',
  styleUrls: ['./contagem-tempo-conclusao-segurado.component.css']
})
export class ContagemTempoConclusaoSeguradoComponent implements OnInit, OnChanges {

  @Input() calculo;
  @Input() segurado;
  @Input() isUpdating;
  @Input() lastdateNascimento;
  private islastdateNascimento = false;

  public Math = Math;


  constructor() { }

  ngOnInit() { }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    let lastdateNascimento = changes['lastdateNascimento'];
    this.setIslastdateNascimento(this.lastdateNascimento)
  }

  private setIslastdateNascimento(lastdateNascimento) {
    this.islastdateNascimento = false;

    if (this.isExits(lastdateNascimento)
      && this.isExits(lastdateNascimento.fullDays)
      && lastdateNascimento.fullDays > 0) {
      this.islastdateNascimento = true;
    }

  }


  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '')
      ? true : false;
  }


  private formateStringAnosMesesDias(anos, meses, dias, notDays = false) {

    if (notDays) {
      return ` ${anos} ano(s), ${meses} mes(es)`;
    }

    if (anos < 0) {
      return ` ${meses} mes(es) e ${Math.floor(dias)} dia(s)`;
    }

    return ` ${anos} ano(s), ${meses} mes(es) e ${Math.floor(dias)} dia(s)`;

  }

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
