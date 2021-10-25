
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DefinicaoTempo } from 'app/shared/functions/definicao-tempo';
import * as moment from 'moment';
import { ErrorService } from '../../../services/error.service';
import { CalculoContagemTempo as CalculoModel } from './../+contagem-tempo-calculos/CalculoContagemTempo.model';
import { CalculoContagemTempoService } from './../../+contagem-tempo-calculos/CalculoContagemTempo.service';



@Component({
  selector: 'app-contagem-tempo-conclusao',
  templateUrl: './contagem-tempo-conclusao.component.html',
  styleUrls: ['./contagem-tempo-conclusao.component.css']
})
export class ContagemTempoConclusaoComponent implements OnInit, OnChanges {


  @Input() segurado;
  @Input() calculo;
  @Input() public periodosList = [];

  @Input() dadosPassoaPasso;
  @Output() limitesTempoTotal = new EventEmitter();
  @Output() contagemTempoConclusaoSave = new EventEmitter();


  public fimContador88 = this.toMoment('05/10/1988');
  public fimContador91 = this.toMoment('04/04/1991');
  public fimContador94 = this.toMoment('01/07/1994');
  public fimContador98 = this.toMoment('16/12/1998');
  public fimContador99 = this.toMoment('29/11/1999');
  public fimContador03 = this.toMoment('31/12/2003');
  public fimContador15 = this.toMoment('05/11/2015');
  public fimContador19 = this.toMoment('13/11/2019'); // Data EC nº 103/2019

  public tempoTotalConFator: any;
  public tempoTotalConFator88: any;
  public tempoTotalConFator91: any;
  public tempoTotalConFator94: any;
  public tempoTotalConFator98: any;
  public tempoTotalConFator99: any;
  public tempoTotalConFator15: any;
  public tempoTotalConFator19: any; // Data EC nº 103/2019
  public tempoTotalConFatorUltimoVinculo: any; // Data EC nº 103/2019

  public carencia = 0;
  public carencia88 = 0;
  public carencia91 = 0;
  public carencia94 = 0;
  public carencia98 = 0;
  public carencia99 = 0;
  public carencia03 = 0;
  public carencia19 = 0; // Data EC nº 103/2019

  public limitesDoVinculo: any;
  public isUpdateTotal = true;
  public Math = Math;

  public idadeFinal: any;
  public idade360Final: any;
  public idade360Atual: any;
  public idade360EC103: any;
  public idade360AteEC20: any;
  public idade360Ate94: any;
  public idade360AteUltimoVinculo: any;



  public idadeMasculinaProporcional = 19080;
  public tempoMinimoProporcionalEmenda20 = 10800; // dias 30 anos
  public tempoMinimoIntegralEmenda20 = 12600; // dias 30 anos

  public redutorSexoDias: any; // dias

  public isUpdateTotalTempoIdadeA = true;
  public isUpdateTotalTempoIdadeB = true;
  public isUpdateTotalTempoIdade94 = true;
  public isUpdateTotalTempoIdadeEC103 = true;
  public isUpdateTotalTempoIdadeUltimoVinculo = true;

  // parametros EC nº 103/2019
  public isPeridoAposReforma = false;
  // parametros EC nº 103/2019 END

  public tempoDePedApProp: any; // Tempo de Pedágio para Aposentadoria Proporcional
  public tempoDePedApPropComPedagio: any; // Tempo Mínimo para Aposentadoria Proporcional com Pedágio
  public tempoParaAposProp: any; // Tempo a cumprir para aposentadoria proporcional
  public idadeMinimaAposProp: any; // idadeMinimaExigidaParaAposentadoriaProporcional
  public tempoCumprirAposItentegal: any; // Tempo a cumprir para Aposentadoria Integral
  public somatoriaTempoContribIdade94: any; // Somatória do tempo de contribuição e idade
  public somatoriaTempoContribIdade: any; // Somatória do tempo de contribuição e idade
  public somatoriaTempoContribIdadeAtual: any; // Somatória do tempo de contribuição e idade atual
  public somatoriaTempoContribIdadeEC103: any; // Somatória do tempo de contribuição e idade ate EC103
  public somatoriaTempoContribIdadeUltimoVinculo: any; // Somatória do tempo de contribuição e idade Ate o ultimo Vinculo

  public dadosParaExportar: any; // dados para calcular RGPS

  private isCompleteCarencia = false;
  private isCompleteTempoTotal = false;

  // public idadeMasculinaProporcional = 19357.853;
  // public idadeLimiteDias = 10957.5; // dias
  // public idadeLimiteDias = 10800; // dias 30 anos
  // public idadeLimiteDias = 10957.5; // dias

  constructor(
    protected CalculoContagemTempoService: CalculoContagemTempoService,
    protected Errors: ErrorService,
  ) { }

  ngOnInit() {

    // this.redutorSexoDias = (this.segurado.sexo === 'm') ? 0 : 1826.25; // dias
    this.redutorSexoDias = (this.segurado.sexo === 'm') ? 0 : 1800; // dias

    if (this.periodosList.length > 0) {
      this.createConclusaoFinal();
    }
  }

  ngOnChanges() { }

  private defineInicioFim() {
    let inicio = moment('2050-01-01');
    let fim = moment('1900-01-01');

    let inicioVinculo: any;
    let fimVinculo: any;

    for (const vinculo of this.periodosList) {

      inicioVinculo = this.toMoment(vinculo.data_inicio)
      fimVinculo = this.toMoment(vinculo.data_termino)

      if (inicioVinculo < inicio) {
        inicio = inicioVinculo;
      }

      if (fimVinculo > fim) {
        fim = fimVinculo;
      }

    }

    return { inicio: inicio, fim: fim }

  }



  private aplicarFator(daysY360, fator) {

    if (daysY360 > 0 && fator !== 1 && fator > 0) {
      return (daysY360 * fator);
    }

    return daysY360;


    // if (daysY360 > 0 && fator !== 1 && fator > 0) {
    //   let rstFator = (daysY360 * fator);
    //   const testDecimal99 = rstFator - Math.floor(rstFator);

    //   if ((Math.floor(testDecimal99 * 100) / 100) === 0.99) {
    //     rstFator = Math.round(rstFator);
    //   }

    //   return Math.floor(rstFator);
    // }

    // return daysY360;


    // if (daysY360 > 0 && fator !== 1 && fator > 0) {
    //   let rstFator = (daysY360 * fator);
    //   return rstFator;

    //   const testDecimal99 = rstFator - Math.floor(rstFator);
    //   if ((Math.floor(testDecimal99 * 100) / 100) === 0.99) {
    //     rstFator = Math.round(rstFator);
    //   }
    //    return Math.floor(rstFator);
    // }

    // return daysY360;



    //   if (daysY360 > 0 && fator !== 1 && fator > 0) {
    //     let rstFator = (daysY360 * fator);
    //     const testDecimal99 = rstFator - Math.floor(rstFator);

    //     if ((Math.floor(testDecimal99 * 100) / 100) === 0.99) {
    //         rstFator =  Math.round(rstFator);
    //     }

    //     return Math.floor(rstFator);
    // }

    // return daysY360;
  }

  private checkScCompetenciaFull(salariosC, auxiliarDate) {

    const data = auxiliarDate.format('MM/YYYY');
    const salC = salariosC.find((x) => x.cp === data)

    if (this.isExist(salC) &&
      (salC.msc === 0 && salC.sc !== '0,00')) {
      return true;
    }

    return false;
  }


  private defineMelhorTempo(auxiliarDate) {

    let melhorTempo = 0;
    let melhorTempoLast = 0;
    let dataFull = false;
    let lastFim;
    let lastIni;
    let lastFator = 0;
    let finalVinculo = false;
    const auxiliarDatePosEC103 = (auxiliarDate.isSameOrAfter('2019-11-13', 'month'));

    for (const vinculo of this.periodosList) {

      const inicioVinculo = this.toMoment(vinculo.data_inicio);
      const fimVinculo = this.toMoment(vinculo.data_termino);
      const fator = vinculo.fator_condicao_especialN;

      if (auxiliarDate.isBetween('2020-01-01', '2019-02-01', 'month', '[]')) {
        console.log('L =' + melhorTempoLast + '| A =' + melhorTempo)
      }

      // é o fim do vinculo
      if (moment(auxiliarDate).isSame(fimVinculo, 'month')) {
        finalVinculo = true;
      }

      // se entre as datas 30 dias
      if (moment(auxiliarDate).isBetween(
        moment(inicioVinculo),
        moment(fimVinculo), 'month')) {
        melhorTempo = this.aplicarFator(30, fator);
        dataFull = true;
      }

      if (auxiliarDatePosEC103 && this.checkPeriodoPosReforma(vinculo)) {

        dataFull = this.checkScCompetenciaFull(vinculo.sc, auxiliarDate);
        melhorTempo = (dataFull) ? 30 : 0;

        if (melhorTempo === 0
          && !dataFull
          && auxiliarDate.isSame('2019-11-13', 'month')
          && moment('2019-11-13').isBetween(
            moment(inicioVinculo),
            moment(fimVinculo), 'month', '[]')
        ) {

          melhorTempo = 13
        }


      } else {

        // Se igual ao inicio
        if (moment(auxiliarDate).isSame(inicioVinculo, 'month') && !dataFull) {

          melhorTempo = ((30 - inicioVinculo.date()) + 1);
          melhorTempo = this.aplicarFator(melhorTempo, fator)

        }

        // Se igual ao fim
        if (moment(auxiliarDate).isSame(fimVinculo, 'month') && !dataFull) {

          let tempo = fimVinculo.date();
          if (((fimVinculo.month() + 1) === 2 && (fimVinculo.date() === 28 || fimVinculo.date() === 29))
            || fimVinculo.date() === 31) {
            tempo = 30;
          }
          tempo = (tempo > 30) ? 30 : tempo;
          melhorTempo = this.aplicarFator(tempo, fator);
        }

        // se igual ao inicio, fim e não é mês cheio
        if (
          (moment(auxiliarDate).isSame(inicioVinculo, 'month')
            && moment(auxiliarDate).isSame(fimVinculo, 'month'))
          && !dataFull
        ) {

          let diffIgualIF = 0;

          if (moment(inicioVinculo).isSame(fimVinculo, 'month')) {
            diffIgualIF = (fimVinculo.date() - inicioVinculo.date()) + 1;
            diffIgualIF = (diffIgualIF > 0) ? (diffIgualIF * fator) : 0;
          }

          melhorTempo = this.aplicarFator(diffIgualIF, fator);
        }

        if (
          (moment(auxiliarDate).isSame(inicioVinculo, 'month')
            && moment(auxiliarDate).isSame(lastFim, 'month'))
          && (inicioVinculo.isSameOrAfter(lastFim)
            && inicioVinculo.isSame(lastFim, 'month'))
          && !dataFull
        ) {

          melhorTempo = 0;

          let diffAnterior = 0;
          let tempoIni = ((30 - inicioVinculo.date()) + 1);
          tempoIni = this.aplicarFator(tempoIni, fator);

          let tempoFim = lastFim.date();
          // if (((lastFim.month() + 1) === 2 && (lastFim.date() === 28 || lastFim.date() === 29))
          //   || lastFim.date() === 31) {
          //   tempoFim = 30;
          // }

          tempoFim = (tempoFim > 30) ? 30 : tempoFim;
          tempoFim = this.aplicarFator(tempoFim, lastFator);
          melhorTempo = (tempoFim + tempoIni);

          if (inicioVinculo.isSame(lastFim)) {
            melhorTempo -= 1;
          }

          // se inicio e fim do ultimo periodo da listado são iguais
          if ((moment(lastIni).isSame(lastFim, 'month'))) {

            diffAnterior = (lastFim.date() - lastIni.date()) + 1;
            diffAnterior = (diffAnterior > 0) ? diffAnterior : 0;
            diffAnterior = this.aplicarFator(diffAnterior, lastFator);
            melhorTempo -= diffAnterior;

          }

        }


        // if ((moment(inicioVinculo).isSame(lastFim, 'month'))) {
        //   console.log('ok')
        // }
        // melhorTempo *= fator;

        // console.log(diffAnterior);
        // console.log(melhorTempoLast);
        // console.log('F----');

      }

      lastIni = this.toMoment(vinculo.data_inicio);
      lastFim = this.toMoment(vinculo.data_termino);
      lastFator = vinculo.fator_condicao_especialN;
      melhorTempoLast = (melhorTempo > melhorTempoLast) ? melhorTempo : melhorTempoLast;
      melhorTempo = (melhorTempo > melhorTempoLast) ? melhorTempo : melhorTempoLast;


    }

    // if (auxiliarDatePosEC103) {
    //   console.log(dataFull);
    //   console.log(melhorTempo);
    // }


    // melhorTempo = Math.floor(melhorTempo);

    // console.log('FT----');
    //  console.log('Ta-' + auxiliarDate.format('DD/MM/YYYY') +
    //  ' atual = ' + melhorTempo + ' | last =  ' + melhorTempoLast + ' | f1 = ' + lastFator);
    // console.log('Tb-' + auxiliarDate.format('DD/MM/YYYY') + ' | ' + melhorTempo);
    // console.log('FT----');

    return { melhorTempo: melhorTempo, finalVinculo: finalVinculo };
  }


  private checkPeriodoIntervaloReforma(periodo) {


    if (moment(periodo.data_termino).isSameOrBefore('2019-11-13')) {

      return 'anterior';
    }

    if (moment(periodo.data_inicio).isSameOrAfter('2019-11-14')) {

      return 'apos';
    }

    if (moment('2019-11-13').isBetween(periodo.data_inicio, periodo.data_termino, null, '[]')) {

      return 'entre';
    }

  }



  private getSomaPeridos() {

    let somaF = 0
    let somaSF = 0
    let concomitanteP = false;
    for (const iterator of this.periodosList) {

      if (iterator.concomitantes.check) {
        concomitanteP = true;
      }

      somaF += Number(iterator.totalComFator.fullDays);
      somaSF += Number(iterator.totalSemFator.fullDays);
      /// console.log('P - ' + (iTeste2++) + '|' + iterator.totalComFator.fullDays + ' -- ' + somatesteF);
    }


    return { soma: somaF, concomitante: concomitanteP };
  }


  private tempoTotal360(limitesDoVinculo) {

    return new Promise((resolve, reject) => {

      let auxiliarDate = moment(this.toDateString(limitesDoVinculo.inicio), 'DD/MM/YYYY');
      const fimContador = moment(this.toDateString(limitesDoVinculo.fim), 'DD/MM/YYYY');
      const fimContadorDias = moment(this.toDateString(limitesDoVinculo.fim), 'DD/MM/YYYY');

      auxiliarDate.startOf('month');
      fimContador.endOf('month')

      let count = 0;
      let count88 = 0;
      let count91 = 0;
      let count94 = 0;
      let count98 = 0;
      let count99 = 0;
      let count15 = 0;
      let count19 = 0;
      let countUltimoVinculo = 0;

      const fimContador88 = this.momentEndFaixaContador(this.fimContador88);
      const fimContador91 = this.momentEndFaixaContador(this.fimContador91);
      const fimContador94 = this.momentEndFaixaContador(this.fimContador94);
      const fimContador98 = this.momentEndFaixaContador(this.fimContador98);
      const fimContador99 = this.momentEndFaixaContador(this.fimContador99);
      const fimContador15 = this.momentEndFaixaContador(this.fimContador15);
      const fimContador19 = this.momentEndFaixaContador(this.fimContador19);
      const fimUltimoVinculo = this.momentEndFaixaContador(this.limitesDoVinculo.fim);

      let rstMelhorTempo = { melhorTempo: 0, finalVinculo: false };

      do {

        rstMelhorTempo = this.defineMelhorTempo(auxiliarDate.clone());

        if (rstMelhorTempo.melhorTempo > 0) {

          count += rstMelhorTempo.melhorTempo;

          if (rstMelhorTempo.finalVinculo) {
            count = Math.floor(count);
          }

          if (auxiliarDate.isSameOrBefore(fimContador88, 'month')) {
            count88 += (auxiliarDate.isSame(fimContador88, 'month')) ? fimContador88.date() : rstMelhorTempo.melhorTempo;
          };

          if (auxiliarDate.isSameOrBefore(fimContador91, 'month')) {
            count91 += (auxiliarDate.isSame(fimContador91, 'month')) ? fimContador91.date() : rstMelhorTempo.melhorTempo;
          };
          if (auxiliarDate.isSameOrBefore(fimContador94, 'month')) {
            count94 += (auxiliarDate.isSame(fimContador94, 'month')) ? fimContador94.date() : rstMelhorTempo.melhorTempo;
          };

          if (auxiliarDate.isSameOrBefore(fimContador98, 'month')) {
            count98 += (auxiliarDate.isSame(fimContador98, 'month')) ? fimContador98.date() : rstMelhorTempo.melhorTempo;
          };

          if (auxiliarDate.isSameOrBefore(fimContador99, 'month')) {
            count99 += (auxiliarDate.isSame(fimContador99, 'month')) ? fimContador99.date() : rstMelhorTempo.melhorTempo;
          };

          if (auxiliarDate.isSameOrBefore(fimContador15, 'month')) {
            count15 += (auxiliarDate.isSame(fimContador15, 'month')) ? fimContador15.date() : rstMelhorTempo.melhorTempo;
          };

          if (auxiliarDate.isSameOrBefore(fimContador19, 'month')) {
            count19 += (auxiliarDate.isSame(fimContador19, 'month')) ? fimContador19.date() : rstMelhorTempo.melhorTempo;
          };


          if (auxiliarDate.isSameOrBefore(fimUltimoVinculo, 'month')) {
            countUltimoVinculo += (auxiliarDate.isSame(fimUltimoVinculo, 'month')) ? fimUltimoVinculo.date() : rstMelhorTempo.melhorTempo;
          };

        }

        console.log(auxiliarDate.format('DD/MM/YYYY') + ' | ' + (rstMelhorTempo.melhorTempo > 0) + ' | ' + countUltimoVinculo);
        auxiliarDate = moment(this.toDateString(auxiliarDate.clone()), 'DD/MM/YYYY').add(1, 'M');

      } while (fimContador.isSameOrAfter(auxiliarDate, 'month'));

      const objSomaPeriodos = this.getSomaPeridos();
      if (!objSomaPeriodos.concomitante && objSomaPeriodos.soma > 0) {
        count = objSomaPeriodos.soma;
      }

      countUltimoVinculo = this.checkFimPeriodoApliacarAjuste(countUltimoVinculo, count, fimUltimoVinculo, fimContadorDias);
      count19 = this.checkFimPeriodoApliacarAjuste(count19, count, fimContador19, fimContadorDias);
      count15 = this.checkFimPeriodoApliacarAjuste(count15, count, fimContador15, fimContadorDias);
      count99 = this.checkFimPeriodoApliacarAjuste(count99, count, fimContador99, fimContadorDias);
      count98 = this.checkFimPeriodoApliacarAjuste(count98, count, fimContador98, fimContadorDias);
      count91 = this.checkFimPeriodoApliacarAjuste(count91, count, fimContador91, fimContadorDias);
      count94 = this.checkFimPeriodoApliacarAjuste(count94, count, fimContador94, fimContadorDias);
      count88 = this.checkFimPeriodoApliacarAjuste(count88, count, fimContador88, fimContadorDias);


      this.tempoTotalConFator = DefinicaoTempo.convertD360ToDMY(count);
      this.tempoTotalConFator88 = DefinicaoTempo.convertD360ToDMY(count88);
      this.tempoTotalConFator91 = DefinicaoTempo.convertD360ToDMY(count91);
      this.tempoTotalConFator94 = DefinicaoTempo.convertD360ToDMY(count94);
      this.tempoTotalConFator98 = DefinicaoTempo.convertD360ToDMY(count98);
      this.tempoTotalConFator99 = DefinicaoTempo.convertD360ToDMY(count99);
      this.tempoTotalConFator15 = DefinicaoTempo.convertD360ToDMY(count15);
      this.tempoTotalConFator19 = DefinicaoTempo.convertD360ToDMY(count19);
      this.tempoTotalConFatorUltimoVinculo = DefinicaoTempo.convertD360ToDMY(countUltimoVinculo);


      console.log('--------------//------------');
      console.log(countUltimoVinculo);
      console.log(count19);
      console.log(count);
      console.log(this.tempoTotalConFatorUltimoVinculo);
      console.log(this.tempoTotalConFator);

      // console.log(this.periodosList);
      // console.log(somateste);
      // console.log(somatesteF);
      // console.log(this.tempoTotalConFator);

      if (this.tempoTotalConFator) {

        // this.verificaPeriodoAposReforma();
        resolve(true);
      } else {
        reject(false);
      }
    });

  }

  private checkFimPeriodoApliacarAjuste(tempoAteLegislacao, tempoFinal, fimContadorleg, fimContadorDias) {

    if (fimContadorDias.isSameOrBefore(fimContadorleg)) {
      tempoAteLegislacao = tempoFinal;
    }

    return tempoAteLegislacao;
  }



  private verificaPeriodoAposReforma() {

    // const dataReforma = this.fimContador19.clone();

    // for (const vinculo of this.periodosList) {

    //   const inicioVinculo = this.toMoment(vinculo.data_inicio);
    //   const fimVinculo = this.toMoment(vinculo.data_termino);

    //   if ((moment(inicioVinculo).isSameOrAfter(dataReforma)
    //     ||
    //     moment(fimVinculo).isSameOrAfter(dataReforma)) && !this.isPeridoAposReforma) {
    //     this.isPeridoAposReforma = true;
    //   }

    // }
  }


  private leapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }


  /**
   * Ajustar o periodo de 30 ou 31 para um mês completo
   */
  // private ajusteHumanizadoDateINSS() {

  //   const correcaoPeriodos = ['', '88', '91', '98', '99', '19'];


  //   correcaoPeriodos.forEach(label => {

  //     if (this['tempoTotalConFator' + label].days() >= 30) {

  //       this['tempoTotalConFator' + label] = moment.duration(
  //         {
  //           years: this['tempoTotalConFator' + label].years(),
  //           months: (this['tempoTotalConFator' + label].months() + 1),
  //           days: 0,
  //           seconds: 0,
  //           hours: 0,
  //           milliseconds: 0,
  //           minutes: 0
  //         });

  //     }


  //     // if (this['tempoTotalConFator' + label].months() >= 12) {

  //     //   this['tempoTotalConFator' + label] = moment.duration(
  //     //     {
  //     //       years: this['tempoTotalConFator' + label].years() + 1,
  //     //       months: (this['tempoTotalConFator' + label].months() - 12),
  //     //       days: 0,
  //     //       seconds: 0,
  //     //       hours: 0,
  //     //       milliseconds: 0,
  //     //       minutes: 0
  //     //     });

  //     // }

  //   });

  // }



  private checkPeriodoPosReforma(periodo) {

    if (moment(periodo.data_inicioDb).isSameOrAfter('2019-11-13')
      || moment('2019-11-13').isBetween(periodo.data_inicioDb, periodo.data_terminoDb, null, '[]')) {
      return true;
    }
    return false;
  }


  private checkScIntegral(salariosC, auxiliarDate) {

    if (auxiliarDate.isBefore('2019-11-13')) {
      return true;
    }

    const data = auxiliarDate.format('MM/YYYY');
    const salC = salariosC.find((x) => x.cp === data)

    if ((salC.msc === 0 && salC.sc !== '0,00')) {
      return true;
    }

    return false;
  }


  private defineCarenciaData(auxiliarDate) {
    let carencia = false;

    for (const vinculo of this.periodosList) {

      const inicioVinculo = this.toMomentCarencia(vinculo.data_inicio);
      const fimVinculo = this.toMomentCarencia(vinculo.data_termino);

      if ((vinculo.carenciaP === 1)
        && (auxiliarDate >= inicioVinculo && auxiliarDate <= fimVinculo)
      ) {


        if ((vinculo.carencia === 'Sim' || vinculo.carencia === 'Integral')) {
          return true;
        }

        if (vinculo.carencia === 'Parcial'
          && this.checkPeriodoPosReforma(vinculo)
        ) {

          if (this.checkScIntegral(vinculo.sc, auxiliarDate)
            || (this.isExist(vinculo.sc_mm_considerar_carencia)
              && vinculo.sc_mm_considerar_carencia === 1)
          ) {

            return true;

          }

        }

      }
      // if ((vinculo.carencia === 'Sim' || vinculo.carencia === 1) && (moment(auxiliarDate).isBetween(
      //   moment(inicioVinculo),
      //   moment(fimVinculo), undefined, '[]'))) {
      //     carencia = true;
      // }

    }

    return carencia;
  }


  private tempoCarencia(limitesDoVinculo) {

    return new Promise((resolve, reject) => {

      let auxiliarDate = moment(this.toDateString(limitesDoVinculo.inicio), 'DD/MM/YYYY');
      const fimContador = moment(this.toDateString(limitesDoVinculo.fim), 'DD/MM/YYYY');

      auxiliarDate.date(1).hour(1).minute(1).second(1).millisecond(1);
      fimContador.date(1).hour(1).minute(1).second(1).millisecond(1).add(1, 'M');

      let count = 0;
      let count88 = 0;
      let count91 = 0;
      let count94 = 0;
      let count98 = 0;
      let count99 = 0;
      let count03 = 0;
      let count19 = 0;

      const fimContador88 = this.momentCarencia(this.fimContador88);
      const fimContador91 = this.momentCarencia(this.fimContador91);
      const fimContador94 = this.momentCarencia(this.fimContador94);
      const fimContador98 = this.momentCarencia(this.fimContador98);
      const fimContador99 = this.momentCarencia(this.fimContador99);
      const fimContador03 = this.momentCarencia(this.fimContador03);
      const fimContador19 = this.momentCarencia(this.fimContador19);


      do {

        if (this.defineCarenciaData(auxiliarDate)) {
          count++;

          if (auxiliarDate <= fimContador88) {
            count88++;
          };

          if (auxiliarDate <= fimContador91) {
            count91++;
          };

          if (auxiliarDate <= fimContador94) {
            count94++;
          };

          if (auxiliarDate <= fimContador98) {
            count98++;
          };

          if (auxiliarDate <= fimContador99) {
            count99++;
          };

          if (auxiliarDate <= fimContador03) {
            count03++;
          };

          if (auxiliarDate <= fimContador19) {
            count19++;
          };
        }

        //   console.log(auxiliarDate.format('MM/YYYY') + '|' + this.defineCarenciaData(auxiliarDate) + '|' + count)

        auxiliarDate = moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY').add(1, 'M');

      } while (fimContador.isSameOrAfter(auxiliarDate));

      // auxiliarDate <= fimContador

      this.carencia = count;
      this.carencia88 = count88;
      this.carencia91 = count91;
      this.carencia94 = count94;
      this.carencia98 = count98;
      this.carencia99 = count99;
      this.carencia03 = count03;
      this.carencia19 = count19;

      if (this.carencia > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });

  }


  public tempoPedagioAposentadoriaProporcional() {

    let rstTemp = 0;
    rstTemp = (this.tempoMinimoProporcionalEmenda20 - this.redutorSexoDias) - this.tempoTotalConFator98.fullDays;

    rstTemp = rstTemp * 0.4;
    rstTemp = (rstTemp < 0) ? 0 : rstTemp;

    this.tempoDePedApProp = DefinicaoTempo.convertD360ToDMY(rstTemp);

  }

  public tempoMinimoParaAposentadoriaProporcionalComPedagio() {

    let rstTemp = 0;
    rstTemp = this.tempoDePedApProp.fullDays + (this.tempoMinimoProporcionalEmenda20 - this.redutorSexoDias);

    this.tempoDePedApPropComPedagio = DefinicaoTempo.convertD360ToDMY(rstTemp);

  }

  public tempoCumprirAposentadoriaProporcional() {

    let rstTemp = 0;
    rstTemp = this.tempoTotalConFator.fullDays - this.tempoDePedApPropComPedagio.fullDays;
    rstTemp = (rstTemp < 0) ? rstTemp * -1 : 0;

    this.tempoParaAposProp = DefinicaoTempo.convertD360ToDMY(rstTemp);
  }


  public tempoCumprirAposentadoriaItentegal() {

    let rstTemp = 0;
    rstTemp = this.tempoTotalConFator19.fullDays - (this.tempoMinimoIntegralEmenda20 - this.redutorSexoDias);

    rstTemp = (rstTemp < 0) ? rstTemp * -1 : 0;

    this.tempoCumprirAposItentegal = DefinicaoTempo.convertD360ToDMY(rstTemp);
  }


  public idadeMinimaExigidaParaAposentadoriaProporcional() {

    let rstTemp = 'Idade Mínima Atingida';
    let exigeIdadeMinimaProporcional = false;

    if (this.tempoTotalConFator88.fullDays < (this.tempoMinimoIntegralEmenda20 - this.redutorSexoDias)) {
      exigeIdadeMinimaProporcional = true;
    }

    if (exigeIdadeMinimaProporcional && (this.idade360Final.fullDays < (this.idadeMasculinaProporcional - this.redutorSexoDias))) {
      rstTemp = 'Idade Mínima não Atingida';
    }

    this.idadeMinimaAposProp = rstTemp;
  }


  public somatoriaTempoContribuicaoIdadeP() {

    return new Promise((resolve, reject) => {

      let rstTemp = 0;
      rstTemp = (this.tempoTotalConFator15.fullDays + this.idade360AteEC20.fullDays);

      this.somatoriaTempoContribIdade = DefinicaoTempo.convertD360ToDMY(rstTemp);

      if (this.somatoriaTempoContribIdade.fullDays > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }


  public somatoriaTempoContribuicaoIdade94() {

    return new Promise((resolve, reject) => {

      let rstTemp = 0;
      rstTemp = (this.tempoTotalConFator94.fullDays + this.idade360Ate94.fullDays);
      this.somatoriaTempoContribIdade94 = DefinicaoTempo.convertD360ToDMY(rstTemp);

      if (this.somatoriaTempoContribIdade94.fullDays > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }



  public somatoriaTempoContribuicaoIdadeAteEC103() {


    return new Promise((resolve, reject) => {
      let rstTemp = 0;

      rstTemp = (this.tempoTotalConFator19.fullDays + this.idade360EC103.fullDays);
      this.somatoriaTempoContribIdadeEC103 = DefinicaoTempo.convertD360ToDMY(rstTemp);

      if (this.somatoriaTempoContribIdadeEC103.fullDays > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });


  }


  public somatoriaTempoContribuicaoIdadeAtualP() {


    return new Promise((resolve, reject) => {
      let rstTemp = 0;

      rstTemp = (this.tempoTotalConFator.fullDays + this.idade360Atual.fullDays);
      this.somatoriaTempoContribIdadeAtual = DefinicaoTempo.convertD360ToDMY(rstTemp);

      if (this.somatoriaTempoContribIdadeAtual.fullDays > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });


  }


  public somatoriaTempoContribuicaoIdadeUltimoVinculo() {


    return new Promise((resolve, reject) => {
      let rstTemp = 0;

      rstTemp = (this.tempoTotalConFatorUltimoVinculo.fullDays + this.idade360AteUltimoVinculo.fullDays);
      this.somatoriaTempoContribIdadeUltimoVinculo = DefinicaoTempo.convertD360ToDMY(rstTemp);

      if (this.somatoriaTempoContribIdadeUltimoVinculo.fullDays > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });


  }




  private calculaIdades360Mes30() {

    const dataNasc = moment(this.segurado.data_nascimento, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const ultimoVinculo = this.limitesDoVinculo.fim.format('YYYY-MM-DD');
    this.idade360Final = DefinicaoTempo.calcularTempo360(dataNasc, ultimoVinculo);
    this.limitesTempoTotal.emit(this.idade360Final);
    this.idade360Atual = DefinicaoTempo.calcularTempo360(dataNasc, null);
    this.idade360Ate94 = DefinicaoTempo.calcularTempo360(dataNasc, '1994-07-01');
    this.idade360AteEC20 = DefinicaoTempo.calcularTempo360(dataNasc, '2015-11-05');
    this.idade360EC103 = DefinicaoTempo.calcularTempo360(dataNasc, '2019-11-13');
    this.idade360AteUltimoVinculo = DefinicaoTempo.calcularTempo360(dataNasc, this.limitesDoVinculo.fim.format('YYYY-MM-DD'));

  }


  private subTotais() {

    if (!this.isPeridoAposReforma) {

      this.tempoPedagioAposentadoriaProporcional();
      this.tempoMinimoParaAposentadoriaProporcionalComPedagio();
      this.tempoCumprirAposentadoriaProporcional();
      this.tempoCumprirAposentadoriaItentegal();
      this.idadeMinimaExigidaParaAposentadoriaProporcional();

    }

    this.somatoriaTempoContribuicaoIdadeP().then(result => {
      // console.log(result);
      this.isUpdateTotalTempoIdadeA = false;
    }).catch((error) => {
      console.log(error);
    });

    this.somatoriaTempoContribuicaoIdade94().then(result => {
      // console.log(result);
      this.isUpdateTotalTempoIdade94 = false;
    }).catch((error) => {
      console.log(error);
    });

    this.somatoriaTempoContribuicaoIdadeAtualP().then(result => {
      // console.log(result);
      this.isUpdateTotalTempoIdadeB = false;
    }).catch((error) => {
      console.log(error);
    });

    this.somatoriaTempoContribuicaoIdadeAteEC103().then(result => {
      // console.log(result);
      this.isUpdateTotalTempoIdadeEC103 = false;
    }).catch((error) => {
      console.log(error);
    });

    this.somatoriaTempoContribuicaoIdadeUltimoVinculo().then(result => {
      // console.log(result);
      this.isUpdateTotalTempoIdadeUltimoVinculo = false;
    }).catch((error) => {
      console.log(error);
    });

  }


  private createConclusaoFinal() {

    this.limitesDoVinculo = this.defineInicioFim();
    this.calculaIdades360Mes30();

    const p1 = this.tempoTotal360(this.limitesDoVinculo).then(result => {

      this.isCompleteTempoTotal = true;
      this.updateCalculo();


    }).catch((error) => {
      console.log(error);
    });



    const p2 = this.tempoCarencia(this.limitesDoVinculo).then(result => {
      // console.log('complete carencia');
      this.isCompleteCarencia = true;
      this.updateCalculo();
    }).catch((error) => {
      console.log(error);
    });

    // this.isUpdateTotal = false;

    this.isUpdateTotal = true;
    Promise.all([p1, p2]).then((values) => {

      // this.verificaPeriodoAposReforma();
      this.subTotais();
      this.isUpdateTotal = false;

      // console.log(values);
    });





    // this.tempoTotal(this.limitesDoVinculo).then(result => {
    //   // console.log('complete tempo total');
    //   this.isCompleteTempoTotal = true;
    //   this.updateCalculo();
    // }).catch((error) => {
    //   console.log(error);
    // });

    // this.updateCalculo().then(result => {

    // }).catch((error) => {
    //   console.log(error);
    // });

    this.setExportRGPSList();

    // console.log(this.tempoTotalConFator);

  }



  private updateCalculo() {

    setTimeout(() => {
      if (
        ((this.calculo.total_dias !== this.tempoTotalConFator.fullDays ||
          this.calculo.total_88 !== this.tempoTotalConFator88.fullDays ||
          this.calculo.total_91 !== this.tempoTotalConFator91.fullDays ||
          this.calculo.total_98 !== this.tempoTotalConFator98.fullDays ||
          this.calculo.total_99 !== this.tempoTotalConFator99.fullDays ||
          this.calculo.total_19 !== this.tempoTotalConFator19.fullDays ||
          this.calculo.total_carencia !== this.carencia)
          &&
          (this.isCompleteCarencia && this.isCompleteTempoTotal))
        ||
        this.dadosPassoaPasso.origem !== 'contagem'
      ) {
        this.calculo.total_dias = this.tempoTotalConFator.fullDays;
        this.calculo.total_88 = this.tempoTotalConFator88.fullDays;
        this.calculo.total_91 = this.tempoTotalConFator91.fullDays;
        this.calculo.total_98 = this.tempoTotalConFator98.fullDays;
        this.calculo.total_99 = this.tempoTotalConFator99.fullDays;
        this.calculo.total_19 = this.tempoTotalConFator19.fullDays;
        this.calculo.total_carencia = this.carencia;

        this.CalculoContagemTempoService
          .update(this.calculo)
          .then(model => {

            this.contagemTempoConclusaoSaveRST();

          })
          .catch(errors => this.Errors.add(errors));
      }
    }, 1000);

  }



  public setExportRGPSobj(tempo, carencia, label) {
    // return {
    //   label: label,
    //   years: tempo.years(),
    //   months: tempo.months(),
    //   days: (tempo.days() < 0) ? this.Math.ceil(tempo.days()) * -1 : this.Math.ceil(tempo.days()),
    //   carencia: carencia,
    //   totalDias: tempo.asDays()
    // };

    return {
      label: label,
      years: tempo.years,
      months: tempo.months,
      days: tempo.days,
      carencia: carencia,
      totalDias: tempo.fullDays
    };
  }


  public setExportRGPSList() {
    this.dadosParaExportar = {};

    const itensExport = ['', '88', '91', '98', '99', '19'];

    itensExport.forEach(label => {
      const objExport = this.setExportRGPSobj(this['tempoTotalConFator' + label], this['carencia' + label], label);
      this.dadosParaExportar['total' + label] = objExport;
      // this.dadosParaExportar.push(objExport);
    });

  }

  public contagemTempoConclusaoSaveRST() {

    const limitesDoVinculo = {
      inicio: this.limitesDoVinculo.inicio.format('DD/MM/YYYY'),
      fim: this.limitesDoVinculo.fim.format('DD/MM/YYYY')
    }

    this.contagemTempoConclusaoSave.emit({
      export_result: this.dadosParaExportar,
      limitesDoVinculo: limitesDoVinculo,
      resultComplete: true
    });

  }


  isExist(data) {
    if (data === undefined
      || typeof data === 'undefined'
      || data === 'undefined'
      || data === null) {
      return false;
    }
    return true;
  }



  private momentEndFaixaContador(dataref,) {
    return moment(this.toDateString(dataref), 'DD/MM/YYYY');
  }

  private momentEndFaixaContadorRegrafinal(dataref, dateFim) {

    // .endOf('month');
    if (dataref.isAfter(dateFim)) {
      return moment(this.toDateString(dateFim), 'DD/MM/YYYY');
    }

    return moment(this.toDateString(dataref), 'DD/MM/YYYY');
  }

  toMoment(dateString) {
    return moment(dateString, 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0);
  }

  toMomentTempo(dateString) {
    // return moment(this.toDateString(dateString.add(1, 'd').hour(1).minute(1).second(1).millisecond(1)), 'DD/MM/YYYY');

    return moment(this.toDateString(dateString.add(1, 'd')), 'DD/MM/YYYY');
  }


  momentCarenciaEnd(dateString) {
    return moment(this.toDateString(dateString), 'DD/MM/YYYY').endOf('month');
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



  // private defineMelhorFator(auxiliarDate) {
  //   let fator = 0;
  //   let inicioVinculo: any;
  //   let fimVinculo: any;


  //   for (const vinculo of this.periodosList) {

  //     inicioVinculo = this.toMoment(vinculo.data_inicio);
  //     fimVinculo = this.toMoment(vinculo.data_termino);

  //     fimVinculo = this.ajusteFimPeriodo28dias(fimVinculo);

  //     // if (auxiliarDate >= inicioVinculo && auxiliarDate <= fimVinculo) {
  //     //   fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
  //     // }



  //     if (moment(auxiliarDate).isBetween(
  //       moment(inicioVinculo),
  //       moment(fimVinculo), undefined, '[]')) {
  //       fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
  //     }


  //   }
  //   return Number(fator);
  // }






  // private yearMonthDaysToFormate(fullDays) {

  //   const totalFator = { years: 0, months: 0, days: 0, fullDays: fullDays };

  //   const xValor = (Math.ceil(fullDays) / 365.25);

  //   totalFator.years = Math.floor(xValor);
  //   let xVarMes = (xValor - totalFator.years) * 12;
  //   totalFator.months = Math.floor(xVarMes);
  //   let dttDias = (xVarMes - totalFator.months) * 30.436875;
  //   totalFator.days = Math.round(dttDias);

  //   // console.log(totalFator.years + '/' + totalFator.months + '/' + totalFator.days);
  //   return totalFator;
  // }

  // private ajusteFimPeriodo28dias(calculoDataFim) {

  //   if ((calculoDataFim.date() === 28 || calculoDataFim.date() === 29) && (calculoDataFim.month() + 1) === 2) {
  //     const adicional = (calculoDataFim.date() === 28) ? 3 : 2
  //     return calculoDataFim.add(adicional, 'd');
  //   }

  //   return calculoDataFim;
  // }

  // private updateCalculo() {

  //   let updateCalculo = false;
  //   return new Promise((resolve, reject) => {
  //     if (
  //       this.calculo.total_dias != this.Math.round(this.tempoTotalConFator.asDays()) ||
  //       this.calculo.total_88 != this.Math.round(this.tempoTotalConFator88.asDays()) ||
  //       this.calculo.total_91 != this.Math.round(this.tempoTotalConFator91.asDays()) ||
  //       this.calculo.total_98 != this.Math.round(this.tempoTotalConFator98.asDays()) ||
  //       this.calculo.total_99 != this.Math.round(this.tempoTotalConFator99.asDays()) ||
  //       this.calculo.total_carencia != this.carencia
  //     ) {
  //       this.calculo.total_dias = this.Math.round(this.tempoTotalConFator.asDays());
  //       this.calculo.total_88 = this.Math.round(this.tempoTotalConFator88.asDays());
  //       this.calculo.total_91 = this.Math.round(this.tempoTotalConFator91.asDays());
  //       this.calculo.total_98 = this.Math.round(this.tempoTotalConFator98.asDays());
  //       this.calculo.total_99 = this.Math.round(this.tempoTotalConFator99.asDays());
  //       this.calculo.total_carencia = this.carencia;

  //       console.log(this.calculo);

  //       this.CalculoContagemTempoService
  //         .update(this.calculo)
  //         .then(model => {
  //           console.log('update ok');
  //           updateCalculo = true;
  //         })
  //         .catch(errors => this.Errors.add(errors));
  //     }

  //     if (updateCalculo) {
  //       resolve(true);
  //     } else {
  //       reject(false);
  //     }
  //   });

  // }


  // private tempoTotal(limitesDoVinculo) {

  //   return new Promise((resolve, reject) => {

  //     let auxiliarDate = limitesDoVinculo.inicio;
  //     //const fimContador = moment(this.toDateString(limitesDoVinculo.fim), 'DD/MM/YYYY').add(1, 'd');


  //     const limitesDoVinculoClone = limitesDoVinculo.fim.clone();
  //     this.ajusteFimPeriodo28dias(limitesDoVinculoClone)
  //     //  const limitesDoVinculoClone = this.ajusteFimPeriodo28dias(limitesDoVinculo.fim.clone());

  //     // console.log(this.ajusteFimPeriodo28dias(limitesDoVinculoClone));
  //     // const fimContador = moment(this.toDateString(limitesDoVinculoClone.add(1, 'days')), 'DD/MM/YYYY');
  //     const fimContador = moment(this.toDateString(limitesDoVinculoClone), 'DD/MM/YYYY');

  //     //  console.log(teste.add(1, 'days'));
  //     // console.log(this.toDateString(teste.add(1, 'days')))
  //     //   console.log(moment(this.toDateString(teste.add(1, 'days')), 'DD/MM/YYYY'));
  //     // console.log(limitesDoVinculo)
  //     // console.log(fimContador)

  //     let count = 1;
  //     let count88 = 1;
  //     let count91 = 1;
  //     let count98 = 1;
  //     let count99 = 1;
  //     let count03 = 1;
  //     let count19 = 1;
  //     let fator = 0;

  //     do {

  //       fator = this.defineMelhorFator(auxiliarDate);

  //       if (fator > 0) {

  //         count += fator;

  //         if (auxiliarDate <= this.fimContador88) {
  //           count88 += fator;
  //         };

  //         if (auxiliarDate <= this.fimContador91) {
  //           count91 += fator;
  //         };

  //         if (auxiliarDate <= this.fimContador98) {
  //           count98 += fator;
  //         };

  //         if (auxiliarDate <= this.fimContador99) {
  //           count99 += fator;
  //         };

  //         if (auxiliarDate <= this.fimContador03) {
  //           count03 += fator;
  //         };

  //         if (auxiliarDate <= this.fimContador19) {
  //           count19 += fator;
  //         };

  //       }

  //       // console.log(count + ' -- ' + auxiliarDate.format('DD/MM/YYYY'));
  //       //auxiliarDate = moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY').add(1, 'd');

  //       // let teste = auxiliarDate.clone().hour(0).minute(0).second(0).millisecond(0);
  //       // auxiliarDate = moment(this.toDateString(teste.add(1, 'days')), 'DD/MM/YYYY');

  //       auxiliarDate = auxiliarDate.clone().add(1, 'days').hour(0).minute(0).second(0).millisecond(0);


  //       // } while (auxiliarDate < fimContador);
  //     } while (fimContador.isSameOrAfter(auxiliarDate));

  //     // console.log('---------------------------------------------------------------------');
  //     // console.log(limitesDoVinculo.inicio)
  //     // console.log(limitesDoVinculo.fim)
  //     // console.log(auxiliarDate)
  //     // console.log(fimContador)
  //     // console.log('--Tempo Final---');
  //     // console.log(auxiliarDate);
  //     // console.log(count);
  //     // console.log(this.yearMonthDaysToFormate(count));
  //     // console.log(moment.duration(count, 'days').humanize());
  //     // console.log(count88)
  //     // console.log(count91)
  //     // console.log(count98)
  //     // console.log(count99)
  //     // console.log(count19)
  //     // console.log('------');


  //     this.tempoTotalConFator = moment.duration(Math.floor(count), 'days');
  //     this.tempoTotalConFator88 = moment.duration(Math.floor(count88), 'days');
  //     this.tempoTotalConFator91 = moment.duration(Math.floor(count91), 'days');
  //     this.tempoTotalConFator98 = moment.duration(Math.floor(count98), 'days');
  //     this.tempoTotalConFator99 = moment.duration(Math.floor(count99), 'days');
  //     this.tempoTotalConFator19 = moment.duration(Math.floor(count19), 'days');




  //     // console.log(count);
  //     // console.log(this.tempoTotalConFator);
  //     // console.log(moment.duration(9067, 'days'));

  //     this.ajusteHumanizadoDateINSS();


  //     this.subTotais();

  //     if (this.tempoTotalConFator) {
  //       resolve(true);
  //     } else {
  //       reject(false);
  //     }
  //   });

  // }





  // private nextDate(Data, vinculo, limiteLegislacao) {

  //   const list = [];
  //   for (const row of this.periodosList) {

  //     const inicio = moment(row.data_inicio, 'DD/MM/YYYY');
  //     const fim = moment(row.data_inicio, 'DD/MM/YYYY');




  //     list.push()
  //     list.push(row.data_termino)

  //   }

  //   return list;

  // }


  // private inicioFimPeriodoTolist() {
  //   const list = [];
  //   const listP = [];
  //   for (const row of this.periodosList) {


  //     list.push({
  //       data: moment(row.data_inicio, 'DD/MM/YYYY'),
  //       fator: row.fator_condicao_especialN
  //     });
  //     list.push({
  //       data: moment(row.data_termino, 'DD/MM/YYYY'),
  //       fator: row.fator_condicao_especialN
  //     });

  //   }

  //   const sortedArray = list.sort((a, b) => a.valueOf() - b.valueOf());

  //   for (let i = 0; i < sortedArray.length; i++) {
  //     const element = sortedArray[i];

  //     let fator = element[i].fator;
  //     if (element[i + 1].fator > fator) {
  //       fator = element[i + 1].fator;
  //     }

  //     let periodoF = {
  //       inicio: moment(),
  //       fim: moment(),
  //       fator: ''
  //     }

  //     listP.push()

  //   }


  //   console.log(sortedArray);


  //   return list;
  // }


  // private defineMelhorTempo(auxiliarDate) {
  //   let diasMes = 0;
  //   let inicioVinculo: any;
  //   let fimVinculo: any;


  //   for (const vinculo of this.periodosList) {

  //     inicioVinculo = this.toMoment(vinculo.data_inicio);
  //     fimVinculo = this.toMoment(vinculo.data_termino);
  //     fimVinculo = this.ajusteFimPeriodo28dias(fimVinculo);



  //     // if (moment(auxiliarDate).isBetween(
  //     //   moment(inicioVinculo),
  //     //   moment(fimVinculo), undefined, '[]')) {
  //     //   fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
  //     // }


  //     if (moment(auxiliarDate).isBetween(
  //       moment(inicioVinculo),
  //       moment(fimVinculo), 'month', '[]')) {
  //       diasMes = 30;
  //     }




  //   }
  //   return Number(diasMes);
  // }





  // private calcularInicio(dataInicio, fator) {
  //   return ((30 - dataInicio.date()) + 1) * fator;
  // }

  // private calcularFim(dataFim, fator) {
  //   return (dataFim.date() * fator);
  // }




  // private yearMonthDaysToFormate(dias) {
  //   let anos_rst: any;
  //   let meses_rst: any;
  //   let dias_rst: any;



  //   anos_rst = this.Math.floor(dias / 365.25);

  //   if (dias > 30.4375) {
  //     meses_rst = this.Math.floor((dias % 365.25) / 30.4375); // I choose 30.5 for Month (30,31) ;)
  //   } else {
  //     meses_rst = this.Math.floor((dias % 365.25) / 30); // I choose 30.5 for Month (30,31) ;)
  //   }

  //   dias_rst = this.Math.floor((dias % 365.25) % 30.4375);

  //   let dias_rec: any;
  //   let meses_rec: any;



  //   if (dias_rst >= 30) {
  //     if (dias_rst % 30 == 0) {
  //       meses_rst = meses_rst + dias_rst / 30;
  //       dias_rec = 0;
  //     }
  //     else {
  //       dias_rec = dias_rst % 30;
  //       meses_rst = meses_rst + dias_rst / 30;
  //     }

  //   }
  //   else {
  //     dias_rec = dias_rst;
  //   }


  //   if (meses_rst >= 12) {

  //     if (meses_rst % 12 == 0) {
  //       anos_rst = anos_rst + meses_rst / 12;
  //       meses_rec = 0;
  //     }
  //     else {
  //       meses_rec = meses_rst % 12;
  //       anos_rst = anos_rst + meses_rst / 12;
  //     }

  //   }
  //   else {
  //     meses_rec = meses_rst;
  //   }

  //   let totalFator = { years: anos_rst, months: meses_rec, days: dias_rec, fullDays: dias };

  //   // console.log(totalFator);

  //   //    return rst;
  // }


}
