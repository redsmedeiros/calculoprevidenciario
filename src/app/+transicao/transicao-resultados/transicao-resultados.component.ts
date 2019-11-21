
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';

import { Auth } from '../services/Auth/Auth.service';
import { AuthResponse } from '../services/Auth/AuthResponse.model';

import { TransicaoResultadosPontosComponent } from './transicao-resultados-pontos/transicao-resultados-pontos.component';
import { TransicaoResultadosIdadeProgressivaComponent } from './transicao-resultados-idade-progressiva/transicao-resultados-idade-progressiva.component';
import { TransicaoResultadosPedagio50Component } from './transicao-resultados-pedagio50/transicao-resultados-pedagio50.component';
import { TransicaoResultadosPedagio100Component } from './transicao-resultados-pedagio100/transicao-resultados-pedagio100.component';
import { TransicaoResultadosIdadeComponent } from './transicao-resultados-idade/transicao-resultados-idade.component';

// import { ExpectativaVidaService } from 'app/+rgps/+rgps-resultados/ExpectativaVida.service';
// import { ExpectativaVida } from 'app/+rgps/+rgps-resultados/ExpectativaVida.model';

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
  public expectativasVida
  public expectativa;
  public aliquota = 0.31;
  public ExpectativaVidaObj;



  constructor(
    //  private ExpectativaVida: ExpectativaVidaService,
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


    // this.ExpectativaVida.getByIdade(Math.floor(this.seguradoTransicao.idadeFracionada))
    //   .then(expectativas => {
    //     this.expectativasVida = expectativas;

    //   });


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


    this.seguradoTransicao.contribuicaoFracionadoAnos = this.converterTempoContribuicao(
      this.seguradoTransicao.contribuicaoAnos,
      this.seguradoTransicao.contribuicaoMeses,
      this.seguradoTransicao.contribuicaoDias,
      'years');

    this.seguradoTransicao.contribuicaoFracionadoDias = this.converterTempoContribuicao(
      this.seguradoTransicao.contribuicaoAnos,
      this.seguradoTransicao.contribuicaoMeses,
      this.seguradoTransicao.contribuicaoDias,
      'days');


    this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103 = this.converterTempoContribuicao(
      this.seguradoTransicao.contribuicaoAnosAteEC103,
      this.seguradoTransicao.contribuicaoMesesAteEC103,
      this.seguradoTransicao.contribuicaoDiasAteEC103,
      'years');

    this.seguradoTransicao.contribuicaoFracionadoDiasAteEC103 = this.converterTempoContribuicao(
      this.seguradoTransicao.contribuicaoAnosAteEC103,
      this.seguradoTransicao.contribuicaoMesesAteEC103,
      this.seguradoTransicao.contribuicaoDiasAteEC103,
      'days');

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





  public formatDecimal(value, n_of_decimal_digits) {
    value = parseFloat(value);
    return (value.toFixed(parseInt(n_of_decimal_digits))).replace('.', ',');
  }


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


  public converterTempoContribuicao(anos, meses, dias, type) {

    anos = this.isFormatInt(anos);
    meses = this.isFormatInt(meses);
    dias = this.isFormatInt(dias);

    const contribuicaoTotal = (anos * 365) + (meses * 30) + dias;

    return (type === 'days' || type === 'd') ? Math.floor(contribuicaoTotal) : contribuicaoTotal / 365;
  }


  public verificarTransitoria() {

    if (this.seguradoTransicao.dataFiliacao != undefined
      && this.seguradoTransicao.dataFiliacao != null) {

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
  
  public converterTempoDiasParaAnos(fullDays) {
    return (Math.ceil(fullDays) / 365);
  }

  public converterTempoAnosParaDias(fullYears) {

    return Math.ceil(fullYears * 365);

  }


  public converterTempoAnos(fullYears) {

    const totalFator = { years: 0, months: 0, days: 0, fullYears: fullYears };

    const xValor = fullYears;

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




  // public procurarExpectativa(idadeFracionada, ano, dataInicio, dataFim) {
  //   const dataNascimento = moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY');
  //   const dataAgora = moment();
  //   let expectativaVida;
  //   if (idadeFracionada > 80) {
  //     idadeFracionada = 80;
  //   }

  //   if (ano != null) {
  //     expectativaVida = this.ExpectativaVida.getByAno(2020);
  //     // Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e year == ano
  //   } else {
  //     expectativaVida = this.ExpectativaVida.getByProperties(dataInicio, dataFim);
  //   }
  //   return expectativaVida;
  // }

  // public projetarExpectativa(idadeFracionada, dib) {

  //   let expectativa = 0;
  //   const dataInicio = moment('2000-11-30');
  //   const dataFim = moment('2017-12-01');
  //   const dataHoje = moment();
  //   let formula_expectativa_sobrevida = '';



  //   if (dib > dataHoje) {
  //     let anos = Math.abs(dataHoje.diff(dib, 'years', true));

  //     if (anos < 1) {
  //       anos = Math.round(anos);
  //     } else {
  //       anos = Math.trunc(anos);
  //     }

  //     const tempo1 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-2, 'years')).year(), null, null);
  //     const tempo2 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-3, 'years')).year(), null, null);
  //     const tempo3 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-4, 'years')).year(), null, null);

  //     expectativa = (anos * Math.abs(((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1;

  //     formula_expectativa_sobrevida = `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - ${tempo1})) + ${tempo1}`;
  //     //conclusoes.push({string:'Fórmula Expectativa de Sobrevida:' ,value: `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - ${tempo1})) + ${tempo1}`});//formula_expectativa_sobrevida = "(anos * (((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1";

  //   } else if (dib.isSameOrBefore(dataInicio)) {

  //     expectativa = this.procurarExpectativa(idadeFracionada, null, null, dataInicio);

  //   } else if (dib.isSameOrAfter(dataFim)) {

  //     expectativa = this.procurarExpectativa(idadeFracionada, null, dib, null);

  //   } else {

  //     expectativa = this.procurarExpectativa(idadeFracionada, null, dib, dib);

  //   }

  //   if (expectativa <= 0) {
  //     expectativa = 6;
  //   }

  //   return expectativa;
  // }



  // public getFatorPrevidenciario(dataInicioBeneficio, idadeFracionada, tempoTotalContribuicao) {

  //   let fatorSeguranca = 1;
  //   let formula_fator = '';

  //   this.expectativa = this.projetarExpectativa(idadeFracionada, dataInicioBeneficio);


  //   fatorSeguranca = ((tempoTotalContribuicao * this.aliquota) / this.expectativa) *
  //                    (1 + (idadeFracionada + (tempoTotalContribuicao * this.aliquota)) / 100);

  //   fatorSeguranca = parseFloat(fatorSeguranca.toFixed(4));


  //   formula_fator = '((' + this.formatDecimal(tempoTotalContribuicao, 4) + ' * '
  //    + this.formatDecimal(this.aliquota, 2) + ') / ' + this.formatDecimal(this.expectativa, 2) + ') * (1 + ('
  //     + this.formatDecimal(idadeFracionada, 2) + ' + (' + this.formatDecimal(tempoTotalContribuicao, 4) + ' * '
  //      + this.formatDecimal(this.aliquota, 2) + ')) / ' + '100)';

  //   return {fator: fatorSeguranca, formula: formula_fator};

  // }



  // public calcularIdadeFracionada(final, type) {

  //   const dataFinalFracionada = (final != null) ?
  //     moment(final).hour(0).minute(0).second(0).millisecond(0) :
  //     moment().hour(0).minute(0).second(0).millisecond(0);

  //   return dataFinalFracionada.diff(moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY'), 'years' , true);
  // }


}
