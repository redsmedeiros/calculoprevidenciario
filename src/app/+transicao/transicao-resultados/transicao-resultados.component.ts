
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';

import { Auth } from '../services/Auth/Auth.service';
import { AuthResponse } from '../services/Auth/AuthResponse.model';

import { TransicaoResultadosPontosComponent } from './transicao-resultados-pontos/transicao-resultados-pontos.component';
import { TransicaoResultadosIdadeProgressivaComponent } from './transicao-resultados-idade-progressiva/transicao-resultados-idade-progressiva.component';
import { TransicaoResultadosPedagio50Component } from './transicao-resultados-pedagio50/transicao-resultados-pedagio50.component';
import { TransicaoResultadosPedagio100Component } from './transicao-resultados-pedagio100/transicao-resultados-pedagio100.component';
import { TransicaoResultadosIdadeComponent } from './transicao-resultados-idade/transicao-resultados-idade.component';

@Component({
  selector: 'app-transicao-resultados',
  templateUrl: './transicao-resultados.component.html',
  styleUrls: ['./transicao-resultados.component.css']
})
export class TransicaoResultadosComponent implements OnInit {


  // @ViewChild(TransicaoResultadosPontosComponent) PontosComponent: TransicaoResultadosPontosComponent;
  // @ViewChild(TransicaoResultadosIdadeProgressivaComponent) IdadeProgressivaComponent: TransicaoResultadosIdadeProgressivaComponent;
  // @ViewChild(TransicaoResultadosPedagio50Component) Pedagio50Component: TransicaoResultadosPedagio50Component;
  // @ViewChild(TransicaoResultadosPedagio100Component) Pedagio100Component: TransicaoResultadosPedagio50Component;
  // @ViewChild(TransicaoResultadosIdadeComponent) IdadeComponent: TransicaoResultadosPedagio50Component;


  @Input() seguradoTransicao;

  public dataEC1032019 = moment('13/11/2019', 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0);
  public dataAtual = moment(moment(), 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0);
  public isRegraTransitoria = false;
  public seguradoInformacoes = [];



  constructor(
    // private ref: ChangeDetectorRef,
  ) {

    moment.locale('pt-br');
  }

  ngOnInit() {

    // this.ref.markForCheck();
    // this.ref.detectChanges();


    this.verificarTransitoria();
    this.setInformacoesRegrasTransicao();
    this.setSeguradoInformacoes();

    // console.log(this.seguradoTransicao);

  }


  public setInformacoesRegrasTransicao() {
    this.seguradoTransicao.dataNascimento = moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY')
      .hour(0).minute(0).second(0).millisecond(0);
    if (typeof this.seguradoTransicao.dataFiliacao != 'undefined' && this.seguradoTransicao.dataFiliacao !== '') {
      this.seguradoTransicao.dataFiliacao = moment(this.seguradoTransicao.dataFiliacao, 'DD/MM/YYYY')
        .hour(0).minute(0).second(0).millisecond(0);
    }

    this.seguradoTransicao.idade = this.calcularIdade(null);
    this.seguradoTransicao.idadeFracionada = this.calcularIdadeFracionada(null, 'years');
    this.seguradoTransicao.idadeFracionadaDias = this.calcularIdadeFracionada(null, 'days');
    this.seguradoTransicao.redutorProfessor = (this.seguradoTransicao.professor) ? 5 : 0;
    this.seguradoTransicao.redutorProfessorDias = (this.seguradoTransicao.professor) ? 1825 : 0;
    this.seguradoTransicao.contribuicaoFracionadoAnos = this.converterTempoContribuicao('years');
    this.seguradoTransicao.contribuicaoFracionadoDias = this.converterTempoContribuicao('days');

  }



  public setSeguradoInformacoes() {

    const rstTemp = []

    rstTemp.push({ label: 'Nome', value: this.seguradoTransicao.nome });
    rstTemp.push({ label: 'Sexo', value: (this.seguradoTransicao.sexo === 'm') ? 'Masculino' : 'Feminino' });
    rstTemp.push({
      label: 'Data Nascimento',
      value: this.isExits(this.seguradoTransicao.dataNascimento) ? this.seguradoTransicao.dataNascimento.format('DD/MM/YYYY') : null
    });
    // rstTemp.push({
    //   label: 'Data Nascimento',
    //   value: this.isExits(this.seguradoTransicao.dataFiliacao) ? this.seguradoTransicao.dataFiliacao.format('DD/MM/YYYY') : null
    // });
    rstTemp.push({
      label: 'Idade atual',
      value: `${this.seguradoTransicao.idade.years()} anos`
    });
    rstTemp.push({
      label: 'Tempo de Contribuição',
      value: this.formateStringAnosMesesDias(this.seguradoTransicao.contribuicaoAnos,
        this.seguradoTransicao.contribuicaoMeses,
        this.seguradoTransicao.contribuicaoDias)
    });

    rstTemp.push({ label: 'Profissão', value: (this.seguradoTransicao.professor) ? 'Professor' : null });

    for (const itemRst of rstTemp) {

      if (this.isExits(itemRst.value)) {
        this.seguradoInformacoes.push(itemRst);
      }
    }

  }



  // public calcularIdadeFracionada(final, type) {

  //   const dataFinalFracionada = (final != null) ?
  //     moment(final).hour(0).minute(0).second(0).millisecond(0) :
  //     moment().hour(0).minute(0).second(0).millisecond(0);

  //   return dataFinalFracionada.diff(moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY'), 'years' , true);
  // }



  public calcularIdade(final) {

    const dataFinal = (final != null) ?
      moment(final).hour(0).minute(0).second(0).millisecond(0) :
      moment().hour(0).minute(0).second(0).millisecond(0);
    return moment.duration(dataFinal.diff(moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY'))).add(1, 'days');

  }


  public calcularIdadeFracionada(final, type) {

    const dataFinalFracionada = (final != null) ?
      moment(final).hour(0).minute(0).second(0).millisecond(0) :
      moment().hour(0).minute(0).second(0).millisecond(0);

    const dataDiffAtual = moment.duration(dataFinalFracionada.diff(moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY')));

    const contribuicaoTotal = (dataDiffAtual.years() * 365) +
      (dataDiffAtual.months() * 30)
      + dataDiffAtual.days();

    return (type === 'days' || type === 'd') ? Math.floor(contribuicaoTotal) : contribuicaoTotal / 365;

  }

  public converterTempoContribuicao(type) {

    this.seguradoTransicao.contribuicaoAnos = this.isFormatInt(this.seguradoTransicao.contribuicaoAnos);
    this.seguradoTransicao.contribuicaoMeses = this.isFormatInt(this.seguradoTransicao.contribuicaoMeses);
    this.seguradoTransicao.contribuicaoDias = this.isFormatInt(this.seguradoTransicao.contribuicaoDias);

    const contribuicaoTotal = (this.seguradoTransicao.contribuicaoAnos * 365) +
      (this.seguradoTransicao.contribuicaoMeses * 30)
      + this.seguradoTransicao.contribuicaoDias;

    return (type === 'days' || type === 'd') ? Math.floor(contribuicaoTotal) : contribuicaoTotal / 365;
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


  public converterTempoDias(fullDays) {

    const totalFator = { years: 0, months: 0, days: 0, fullDays: fullDays };

    const xValor = (Math.ceil(fullDays) / 365);

    totalFator.years = Math.floor(xValor);
    const xVarMes = (xValor - totalFator.years) * 12;
    totalFator.months = Math.floor(xVarMes);
    const dttDias = (xVarMes - totalFator.months) * 30;
    totalFator.days = Math.round(dttDias);

    // console.log(totalFator.years + '/' + totalFator.months + '/' + totalFator.days);
    return totalFator;
  }


  public formateStringAnosMesesDias(anos, meses, dias) {

    if (anos < 0) {
      return ` ${meses} mes(es) e ${dias} dia(s)`;
    }

    return `${anos} ano(s), ${meses} mes(es) e ${dias} dia(s)`;

  }


  public formateObjToStringAnosMesesDias(tempoObj) {

    if (tempoObj.anos < 0) {
      return ` ${tempoObj.months} mes(es) e ${tempoObj.days} dia(s)`;
    }

    return `${tempoObj.years} ano(s), ${tempoObj.months} mes(es) e ${tempoObj.days} dia(s)`;

  }


  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined) ? true : false;
  }

  isFormatInt(value) {
    return (typeof value === 'string') ? parseInt(value) : value;
  }

  formatDurationMoment(durationObj) {

    return ` ${durationObj.years()} ano(s), ${durationObj.months()} mes(es) e ${Math.round(durationObj.days())} dia(s) `;
  }


  toMoment(dateString) {
    return moment(dateString, 'DD/MM/YYYY');
  }

  toMomentTempo(dateString) {
    // return moment(this.toDateString(dateString.add(1, 'd').hour(1).minute(1).second(1).millisecond(1)), 'DD/MM/YYYY');

    return moment(this.toDateString(dateString.add(1, 'd')), 'DD/MM/YYYY');
  }

  momentCarencia(dateString) {
    return moment(this.toDateString(dateString.date(1).hour(1).minute(1).second(1).millisecond(1)), 'DD/MM/YYYY');
  }

  toMomentCarencia(dateString) {
    return moment(dateString, 'DD/MM/YYYY').date(1);
  }

  toDateString(date) {
    return date.format('DD/MM/YYYY');
  }

  formatReceivedDate(inputDate) {
    return moment(inputDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  formatPostDataDate(inputDate) {
    return moment(inputDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }


}
