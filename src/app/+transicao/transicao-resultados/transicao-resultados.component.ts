import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Auth } from '../services/Auth/Auth.service';
import { AuthResponse } from '../services/Auth/AuthResponse.model';

@Component({
  selector: 'app-transicao-resultados',
  templateUrl: './transicao-resultados.component.html',
  styleUrls: ['./transicao-resultados.component.css']
})
export class TransicaoResultadosComponent implements OnInit {

  @Input() seguradoTransicao;

  public dataEC1032019 = moment('13/11/2019', 'DD/MM/YYYY');
  public isRegraTransitoria = false;


  constructor() {
  }

  ngOnInit() {

    this.verificarTransitoria();
    this.seguradoTransicao.dataNascimento = moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY')
      .hour(1).minute(1).second(1).millisecond(1);
    this.seguradoTransicao.idade = this.calcularIdade(null);
    this.seguradoTransicao.idadeFracionada = this.calcularIdadeFracionada(null);
    this.seguradoTransicao.redutorProfessor = (this.seguradoTransicao.professor)? 5 : 0;

    console.log(this.seguradoTransicao);

  }


  public calcularIdadeFracionada(final) {

    const dataFinal = (final != null) ?
      moment(final).hour(1).minute(1).second(1).millisecond(1) :
      moment().hour(1).minute(1).second(1).millisecond(1);
    return dataFinal.diff(moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY'), 'years', true);

  }


  public calcularIdade(final) {

    const dataFinal = (final != null) ?
      moment(final).hour(1).minute(1).second(1).millisecond(1) :
      moment().hour(1).minute(1).second(1).millisecond(1);
    return moment.duration(dataFinal.diff(moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY')));

  }


  public verificarTransitoria() {

    if (this.seguradoTransicao.dataFiliacao != undefined
      && this.seguradoTransicao.dataFiliacao != null
      && moment(this.seguradoTransicao.dataFiliacao).isValid()) {

      this.seguradoTransicao.dataFiliacao = moment(this.seguradoTransicao.dataFiliacao, 'DD/MM/YYYY');
      this.seguradoTransicao.isRegraTransitoria = (this.seguradoTransicao.dataFiliacao.isSameOrAfter(this.dataEC1032019));

    }

  }



  public dataDiffDateToDate(date1, date2) {
    const b = moment(date1);
    const a = moment(date2).add(1, 'd');
    const total = { years: 0, months: 0, days: 0 };
    let totalGeralEmDias = 0;
    let diff: any;

    totalGeralEmDias = moment.duration(a.diff(b)).asDays();

    diff = a.diff(b, 'years');
    b.add(diff, 'years');
    total.years = diff;

    diff = a.diff(b, 'months');
    b.add(diff, 'months');
    total.months = diff;

    diff = a.diff(b, 'days');
    b.add(diff, 'days');
    total.days = diff;


    return total;
  };


}
