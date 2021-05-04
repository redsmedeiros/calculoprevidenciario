
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, OnChanges } from '@angular/core';
import * as moment from 'moment';

import { Auth } from '../../services/Auth/Auth.service';
import { AuthResponse } from '../services/Auth/AuthResponse.model';


// import { TransicaoResultadosPontosComponent } from './transicao-resultados-pontos/transicao-resultados-pontos.component';
// import { TransicaoResultadosIdadeProgressivaComponent } from './transicao-resultados-idade-progressiva/transicao-resultados-idade-progressiva.component';
// import { TransicaoResultadosPedagio50Component } from './transicao-resultados-pedagio50/transicao-resultados-pedagio50.component';
// import { TransicaoResultadosPedagio100Component } from './transicao-resultados-pedagio100/transicao-resultados-pedagio100.component';
// import { TransicaoResultadosIdadeComponent } from './transicao-resultados-idade/transicao-resultados-idade.component';



import { ExpectativaVidaService } from 'app/+rgps/+rgps-resultados/ExpectativaVida.service';
import { ExpectativaVida } from 'app/+rgps/+rgps-resultados/ExpectativaVida.model';

@Component({
  selector: 'app-transicao-resultados',
  templateUrl: './transicao-resultados.component.html',
  styleUrls: ['./transicao-resultados.component.css']
})
export class TransicaoResultadosComponent implements OnInit, OnChanges {


  // @ViewChild(TransicaoResultadosPontosComponent) PontosComponent: TransicaoResultadosPontosComponent;
  // @ViewChild(TransicaoResultadosIdadeProgressivaComponent) IdadeProgressivaComponent: TransicaoResultadosIdadeProgressivaComponent;
  // @ViewChild(TransicaoResultadosPedagio50Component) Pedagio50Component: TransicaoResultadosPedagio50Component;
  // @ViewChild(TransicaoResultadosPedagio100Component) Pedagio100Component: TransicaoResultadosPedagio100Component;
  // @ViewChild(TransicaoResultadosIdadeComponent) IdadeComponent: TransicaoResultadosIdadeComponent;


  @Input() seguradoTransicao;

  public dataEC1032019 = moment('13/11/2019', 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0);
  public dataAtual = moment(moment(), 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0).subtract(1, 'day');
  // public dataEC1032019 = moment('13/11/2019', 'DD/MM/YYYY').startOf('day');
  // public dataAtual = moment(moment(), 'DD/MM/YYYY').startOf('day');

  public isRegraTransitoria = false;
  public seguradoInformacoes = [];
  public aliquota = 0.31;

  public ExpectativaVidaObj;
  public expectativasVida
  public expectativa;

  private hasResultTransicao = false;



  constructor(
    // public ExpectativaVida: ExpectativaVidaService,
    // private ref: ChangeDetectorRef,
    private Auth: Auth
  ) {
    moment.locale('pt-br');
  }

  ngOnInit() {

    // this.ref.markForCheck();
    // this.ref.detectChanges();

    // this.ExpectativaVida.getByIdade(Math.floor(this.seguradoTransicao.idadeFracionada))
    //   .then(expectativas => {
    //     this.expectativasVida = expectativas;

    //   });


    // console.log(this.seguradoTransicao);

    //  this.setConclusoes();

  }


  ngOnChanges() {

    this.setConclusoes();

  }

  public setConclusoes() {

    this.verificarTransitoria();
    this.setInformacoesRegrasTransicao();
    this.setSeguradoInformacoes();

    // this.PontosComponent.conclusaoRegra1Pontos();
    // this.IdadeProgressivaComponent.conclusaoRegra2IdadeProgressiva();
    // this.Pedagio50Component.calcularConclusaoRegra3pedagio50();
    // this.Pedagio100Component.conclusaoRegra4pedagio100();
    // this.IdadeComponent.conclusaoRegra5Idade();

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

    if (this.seguradoTransicao.contribuicaoFracionadoDias > 0) {

      const addBissextoTempoAtual = this.contarBissextosEntre(
        this.seguradoTransicao.dataFiliacao,
        this.dataAtual
      )

      this.seguradoTransicao.contribuicaoFracionadoDias += addBissextoTempoAtual;
    }


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

    if (this.seguradoTransicao.contribuicaoFracionadoDiasAteEC103 > 0) {

      const addBissextoTempoAteEC103 = this.contarBissextosEntre(
        this.seguradoTransicao.dataFiliacao,
        this.dataEC1032019
      )
      //this.seguradoTransicao.contribuicaoFracionadoDiasAteEC103 += addBissextoTempoAteEC103;
    }


  }



  public setSeguradoInformacoes() {

    const rstTemp = []
    this.seguradoInformacoes = [];

    rstTemp.push({ label: 'Nome', value: this.seguradoTransicao.nome });
    rstTemp.push({ label: 'Sexo', value: (this.seguradoTransicao.sexo === 'm') ? 'Masculino' : 'Feminino' });
    rstTemp.push({
      label: 'Data de Nascimento',
      value: this.isExits(this.seguradoTransicao.dataNascimento) ? this.seguradoTransicao.dataNascimento.format('DD/MM/YYYY') : null
    });
    rstTemp.push({
      label: 'Idade Atual',
      value: `${this.seguradoTransicao.idade.years()} anos`
    });

    rstTemp.push({
      label: 'Tempo de Contribuição até 13/11/2019 (EC103/2019)',
      value: this.formateStringAnosMesesDias(this.seguradoTransicao.contribuicaoAnosAteEC103,
        this.seguradoTransicao.contribuicaoMesesAteEC103,
        this.seguradoTransicao.contribuicaoDiasAteEC103)
    });

    rstTemp.push({
      label: 'Tempo Total de Contribuição até a Data Atual',
      value: this.formateStringAnosMesesDias(this.seguradoTransicao.contribuicaoAnos,
        this.seguradoTransicao.contribuicaoMeses,
        this.seguradoTransicao.contribuicaoDias)
    });

    rstTemp.push({ label: 'Espécie de Aposentadoria', value: (this.seguradoTransicao.professor) ? 'Professor' : null });


    if (this.isExits(this.seguradoTransicao.idDocumento) && this.isExits(this.seguradoTransicao.numeroDocumento)) {
      rstTemp.push({ label: this.getDocumentType(this.seguradoTransicao.idDocumento), value: this.seguradoTransicao.numeroDocumento });
    }

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
      moment(final).endOf('day') :
      moment().endOf('day');

    const idade = moment.duration(dataFinal.diff(moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY')));

    if (idade.days() === 30) {
      idade.add(1, 'day');
    }

    const d1 = moment(dataFinal.format('DD/MM/YYYY'), 'DD/MM/YYYY');
    const d2 = moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY');

    if (d1.date() === d2.date() && d1.month() === d2.month()) {

     return moment.duration({
            days: 0,
            months: idade.months(),
            years: idade.years(),
          });

    }else{

      return idade;

    }

  }


  public calcularIdadeFracionada(final, type) {

    const dataFinalFracionada = (final != null) ?
      moment(final).hour(0).minute(0).second(0).millisecond(0) :
      moment().hour(0).minute(0).second(0).millisecond(0);

    const dataDiffAtual = moment.duration(dataFinalFracionada.diff(moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY')));

    const contribuicaoTotal = (dataDiffAtual.years() * 365.25) +
      (dataDiffAtual.months() * 30)
      + dataDiffAtual.days();

    return (type === 'days' || type === 'd') ? Math.floor(dataDiffAtual.asDays()) : contribuicaoTotal / 365.25;

  }


  // public converterTempoContribuicao(anos, meses, dias, type) {

  //   anos = this.isFormatInt(anos);
  //   meses = this.isFormatInt(meses);
  //   dias = this.isFormatInt(dias);

  //   const contribuicaoTotal = (anos * 365.25) + (meses * 30) + dias;

  //   return (type === 'days' || type === 'd') ? Math.floor(contribuicaoTotal) : contribuicaoTotal / 365.25;
  // }



  public converterTempoContribuicao(anos, meses, dias, type) {

    anos = this.isFormatInt(anos);
    meses = this.isFormatInt(meses);
    dias = this.isFormatInt(dias);

    const contribuicaoTotal = (anos * 365.25) + (meses * 30.436875) + dias;
   // const contribuicaoTotal = (anos * 365) + (meses * 30) + dias;

    return (type === 'days' || type === 'd') ? Math.floor(contribuicaoTotal) : contribuicaoTotal / 365.25;
  }



  
  // public converterTempoContribuicao(anos, meses, dias, type) {

  //   anos = this.isFormatInt(anos);
  //   meses = this.isFormatInt(meses);
  //   dias = this.isFormatInt(dias);

  //   const contribuicaoTotal = (anos * 365.25) + (meses * 30.436875) + dias;
  //  // const contribuicaoTotal = (anos * 365) + (meses * 30) + dias;

  //   return (type === 'days' || type === 'd') ? Math.floor(contribuicaoTotal) : contribuicaoTotal / 365.25;
  // }



  // public converterTempoContribuicao(anos, meses, dias, type) {

  //   const contribuicaoTotal = moment.duration({
  //     years: anos,
  //     months: meses,
  //     days: dias
  //   });

  //   console.log(contribuicaoTotal);

  //   return (type === 'days' || type === 'd') ? contribuicaoTotal.asDays() : contribuicaoTotal.asDays() / 365;
  // }

  // public converterTempoContribuicao(anos, meses, dias, type) {



  //   console.log(anos + ' - ' + meses + ' - ' + dias);
  //   console.log(moment.duration({year: anos, months: meses, days: dias, hours: 0, minutes: 0, seconds: 0 }));
  //   console.log(moment.duration({year: anos, months: meses, days: dias, hours: 0, minutes: 0, seconds: 0 }).asDays());
  //   console.log(moment.duration({year: anos, months: meses, days: dias, hours: 0, minutes: 0, seconds: 0 }).asYears());

  //   anos = this.isFormatInt(anos);
  //   meses = this.isFormatInt(meses);
  //   dias = this.isFormatInt(dias);

  //   const contribuicaoTotal = (anos * 365.25) + (meses * 30.436875) + dias;

  //   console.log('anos ' + (anos * 365.25));
  //   console.log('meses ' + (meses * 30.436875));
  //   console.log('dias ' + dias);
  //   console.log(contribuicaoTotal);

  //   return (type === 'days' || type === 'd') ? Math.round(contribuicaoTotal) : contribuicaoTotal / 365.25;

  //   // return (type === 'days' || type === 'd') ? 
  //   //             moment.duration({year: anos, months: meses, days: dias, hours: 0, minutes: 0, seconds: 0 }).asDays() :
  //   //             moment.duration({year: anos, months: meses, days: dias, hours: 0, minutes: 0, seconds: 0 }).asYears();
  // }




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

    const xValor = (Math.ceil(fullDays) / 365.25);

    totalFator.years = Math.floor(xValor);
    const xVarMes = (xValor - totalFator.years) * 12;
    totalFator.months = Math.floor(xVarMes);
    const dttDias = (xVarMes - totalFator.months) * 30.436875;
    totalFator.days = Math.floor(dttDias);

    // console.log(totalFator.years + '/' + totalFator.months + '/' + totalFator.days);
    return totalFator;
  }

  public converterTempoDiasParaAnos(fullDays) {
    return ((fullDays) / 365.25);
  }

  public converterTempoDiasParaAnosFator(fullDays) {
    return fullDays / 365.25;
  }

  public converterTempoAnosParaDias(fullYears) {
    return Math.round(fullYears * 365.25);
  }

  public converterTempoAnos(fullYears) {

    const totalFator = { years: 0, months: 0, days: 0, fullYears: fullYears };

    const xValor = fullYears;

    totalFator.years = Math.floor(xValor);
    const xVarMes = (xValor - totalFator.years) * 12;
    totalFator.months = Math.floor(xVarMes);
    const dttDias = (xVarMes - totalFator.months) * 30;
    totalFator.days = Math.floor(dttDias);

    // console.log(totalFator.years + '/' + totalFator.months + '/' + totalFator.days);
    return totalFator;
  }


  public converterTempoAnosP(fullYears) {

    const totalFator = { years: 0, months: 0, days: 0, fullYears: fullYears };

    const xValor = fullYears;

    totalFator.years = Math.floor(xValor);
    const xVarMes = (xValor - totalFator.years) * 12;
    totalFator.months = Math.floor(xVarMes);
    const dttDias = (xVarMes - totalFator.months) * 30.436875;
    totalFator.days = Math.floor(dttDias);

    // console.log(totalFator.years + '/' + totalFator.months + '/' + totalFator.days);
    return totalFator;
  }

  // public converterTempoAnos(d) {


  //   let months = 0, years = 0, days = 0, weeks = 0;
  //   while (d) {
  //     if (d >= 365) {
  //       years++;
  //       d -= 365;
  //     } else if (d >= 30) {
  //       months++;
  //       d -= 30;
  //     } else if (d >= 7) {
  //       weeks++;
  //       d -= 7;
  //     } else {
  //       days++;
  //       d--;
  //     }
  //   };
  //   return { years: years, months: months, days: days, fullYears: d };
  // }




  public formateStringAnosMesesDias(anos, meses, dias, notDays = false) {

    if (notDays) {
      return ` ${anos} ano(s), ${meses} mes(es)`;
    }

    if (anos < 0) {
      return ` ${meses} mes(es) e ${Math.floor(dias)} dia(s)`;
    }

    return ` ${anos} ano(s), ${meses} mes(es) e ${Math.floor(dias)} dia(s)`;

  }


  public formateObjToStringAnosMesesDias(tempoObj, notDays = false) {

    if (notDays) {
      return ` ${tempoObj.years} ano(s), ${tempoObj.months} mes(es)`;
    }

    if (tempoObj.anos < 0) {
      return ` ${tempoObj.months} mes(es) e ${Math.floor(tempoObj.days)} dia(s)`;
    }

    return `${tempoObj.years} ano(s), ${tempoObj.months} mes(es) e ${Math.floor(tempoObj.days)} dia(s)`;

  }





  public addBissexto(data) {
    const anoInicioAno = moment([data.format('YYYY')]);
    const auxiliar29Fevereiro = moment('29/02' + data.format('YYYY'), 'DD/MM/YYYY');

    return (anoInicioAno.isLeapYear() && data.isSame(auxiliar29Fevereiro)) ? 1 : 0;
  }



  public contarBissextosEntre(anoInicio, anofim) {
    //  let contador = -1;
    let contador = 0;
    const anoInicioAno = moment([anoInicio.format('YYYY')]);
    const anofimAno = moment([anofim.format('YYYY')]);
    const auxiliar = anoInicioAno.clone();

    do {

      if (auxiliar.isLeapYear()) {
        contador++;
      }

      auxiliar.add(1, 'year');

    } while (auxiliar <= anofimAno);


    const inicioAuxiliar = moment('29/02/' + anoInicio.year(), 'DD/MM/YYYY');

    const FimAuxiliar = moment('29/02/' + anofimAno.year(), 'DD/MM/YYYY');

    // console.log(anoInicio.format('YYYY') + ' --- ' + anofim.format('YYYY') );

    // console.log(anoInicioAno.isLeapYear() && anoInicio.isBefore(inicioAuxiliar));
    // console.log(anofimAno.isLeapYear() && anofim.isAfter(FimAuxiliar));

    // if (anoInicioAno.isLeapYear() && anoInicio.isBefore(inicioAuxiliar)) {
    //   contador += 1;
    // }

    // if (anofimAno.isLeapYear() && anofim.isAfter(FimAuxiliar)) {
    //   contador += 1;
    // }


    // console.log(contador);
    // console.log(anoInicio);
    // console.log(inicioAuxiliar);
    // console.log(FimAuxiliar);


    // console.log( anoInicioAno.isLeapYear() && anoInicio.isAfter(inicioAuxiliar));

    if (anoInicioAno.isLeapYear() && anoInicio.isAfter(inicioAuxiliar)) {
      contador -= 1;
    }


    if (FimAuxiliar.isLeapYear() && FimAuxiliar.isAfter(anofim)) {
      contador -= 1;
    }

    // console.log(contador);

    return contador;
  }


  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== '' &&
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


  scroll(id) {

    if (this.isExits(id)) {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    }

  }



  imprimirPagina() {
    const conclusaoFinal = document.getElementById('article-conclusao').innerHTML;
    // const footerText = `IEPREV - Instituto de Estudos Previdenciários <br> Tel: (31) 3271-1701 BH/MG`;

    const printContents = conclusaoFinal;
    const css = `<link rel="stylesheet" type="text/css"  href="assets/css/bootstrap.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-production-plugins.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-production.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-rtl.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-angular-next.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/your_style.css" media="print">
                <style>
                      i.fa, .not-print{ display: none; }
                      footer,div,p,td,th{font-size:9px !important;}
                      .table>tbody>tr>td, .table>tbody>tr>th,
                       .table>tfoot>tr>td, .table>tfoot>tr>th,
                       .table>thead>tr>td, .table>thead>tr>th {padding: 3.5px 10px;}
                       title{ font-weight: bold;}
                       footer{}
                </style>`;

    const popupWin = window.open('', '_blank', 'width=640,height=480');
    const rodape = `<img src='./assets/img/rodapesimulador.png' alt='Logo'>`;

    popupWin.document.open();
    popupWin.document.write(`<!doctype html>
                                <html>
                                  <head>${css}</head>
                                  <title>Relatório de Análise das Regras de Transição - EC 103/2019 - ${this.seguradoTransicao.nome}</title>
                                  <body onload="window.print()">
                                   <article>${printContents}</article>
                                   <footer class="mt-5">${rodape}</footer>
                                  </body>
                                </html>`);
    popupWin.document.close();
  }


  public getDocumentType(id_documento) {
    switch (id_documento) {
      case '1':
        return 'PIS';
      case '2':
        return 'PASEP';
      case '3':
        return 'CPF';
      case '4':
        return 'NIT';
      case '5':
        return 'RG';
      default:
        return 'CPF'
    }
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
