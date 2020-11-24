
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
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

  @Output() limitesTempoTotal = new EventEmitter();

  public fimContador88 = this.toMoment('05/10/1988');
  public fimContador91 = this.toMoment('04/04/1991');
  public fimContador98 = this.toMoment('16/12/1998');
  public fimContador99 = this.toMoment('29/11/1999');
  public fimContador03 = this.toMoment('31/12/2003');
  public fimContador19 = this.toMoment('13/11/2019'); // Data EC nº 103/2019

  // public fimContador88 = moment('1988-10-05');
  // public fimContador91 = moment('1991-04-04');
  // public fimContador98 = moment('1998-12-16');
  // public fimContador99 = moment('1999-11-29');
  // public fimContador03 = moment('2003-12-31');

  public tempoTotalConFator: any;
  public tempoTotalConFator88: any;
  public tempoTotalConFator91: any;
  public tempoTotalConFator98: any;
  public tempoTotalConFator99: any;
  public tempoTotalConFator19: any; // Data EC nº 103/2019

  public carencia = 0;
  public carencia88 = 0;
  public carencia91 = 0;
  public carencia98 = 0;
  public carencia99 = 0;
  public carencia03 = 0;
  public carencia19 = 0; // Data EC nº 103/2019

  public limitesDoVinculo: any;
  public isUpdateTotal = true;
  public Math = Math;

  public idadeFinal: any;

  public idadeMasculinaProporcional = 19357.853;
  public idadeLimiteDias = 10957.5; // dias
  public redutorSexoDias: any; // dias

  public isUpdateTotalTempoIdadeA = true;
  public isUpdateTotalTempoIdadeB = true;
  // parametros EC nº 103/2019




  // parametros EC nº 103/2019 END

  public tempoDePedApProp: any; // Tempo de Pedágio para Aposentadoria Proporcional
  public tempoDePedApPropComPedagio: any; // Tempo Mínimo para Aposentadoria Proporcional com Pedágio
  public tempoParaAposProp: any; // Tempo a cumprir para aposentadoria proporcional
  public idadeMinimaAposProp: any; // idadeMinimaExigidaParaAposentadoriaProporcional
  public tempoCumprirAposItentegal: any; // Tempo a cumprir para Aposentadoria Integral
  public somatoriaTempoContribIdade: any; // Somatória do tempo de contribuição e idade
  public somatoriaTempoContribIdadeAtual: any; // Somatória do tempo de contribuição e idade atual

  public dadosParaExportar: any; // dados para calcular RGPS

  private isCompleteCarencia = false;
  private isCompleteTempoTotal = false;




  constructor(
    protected CalculoContagemTempoService: CalculoContagemTempoService,
    protected Errors: ErrorService,
  ) { }

  ngOnInit() {

    this.redutorSexoDias = (this.segurado.sexo === 'm') ? 0 : 1826.25; // dias

    if (this.periodosList.length > 0) {
      this.createConclusaoFinal();
    }
  }


  ngOnChanges() {

  }


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


  private defineMelhorFator(auxiliarDate) {
    let fator = 0;
    let inicioVinculo: any;
    let fimVinculo: any;

    for (const vinculo of this.periodosList) {

      inicioVinculo = this.toMoment(vinculo.data_inicio);
      fimVinculo = this.toMoment(vinculo.data_termino);

      // if (auxiliarDate >= inicioVinculo && auxiliarDate <= fimVinculo) {
      //   fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
      // }

      // if (auxiliarDate > inicioVinculo && auxiliarDate <= fimVinculo) {
      //   fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
      // }

      // if (Number(fimVinculo.format('DD')) <= 30 && (Number(fimVinculo.format('DD')) < Number(inicioVinculo.format('DD')))) {
      if (
        (Number(fimVinculo.format('DD')) <= 30
        || (Number(inicioVinculo.format('DD')) < Number(fimVinculo.format('DD'))))
        || !(inicioVinculo.daysInMonth() === 31 && fimVinculo.daysInMonth() === 30)
        || !(inicioVinculo.daysInMonth() === 30 && fimVinculo.daysInMonth() === 30)
      ) {

        // if (auxiliarDate >= inicioVinculo && auxiliarDate <= fimVinculo) {
        //   fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
        // }

        if (moment(auxiliarDate).isBetween(
          moment(inicioVinculo),
         // moment(fimVinculo), undefined, '[]')) {
          moment(fimVinculo), undefined)) {
            fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
        }

      } else {

        // if (auxiliarDate > inicioVinculo && auxiliarDate <= fimVinculo) {
        //   fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
        // }

        if (moment(auxiliarDate).isBetween(
          moment(inicioVinculo),
          moment(fimVinculo), undefined, '[]')) {
            fator = (Number(vinculo.fator_condicao_especial) > fator) ? Number(vinculo.fator_condicao_especial) : fator;
        }

      }

    }
    return Number(fator);
  }


  private tempoTotal(limitesDoVinculo) {

    return new Promise((resolve, reject) => {

      let auxiliarDate = limitesDoVinculo.inicio;
      //const fimContador = moment(this.toDateString(limitesDoVinculo.fim), 'DD/MM/YYYY').add(1, 'd');


      const limitesDoVinculoClone = limitesDoVinculo.fim.clone();
      // const fimContador = moment(this.toDateString(limitesDoVinculoClone.add(1, 'days')), 'DD/MM/YYYY');
      const fimContador = moment(this.toDateString(limitesDoVinculoClone), 'DD/MM/YYYY');


      //  console.log(teste.add(1, 'days'));
      // console.log(this.toDateString(teste.add(1, 'days')))
      //   console.log(moment(this.toDateString(teste.add(1, 'days')), 'DD/MM/YYYY'));
      // console.log(limitesDoVinculo)
      // console.log(fimContador)

      let count = 1;
      let count88 = 1;
      let count91 = 1;
      let count98 = 1;
      let count99 = 1;
      let count03 = 1;
      let count19 = 1;
      let fator = 0;

      do {

        fator = this.defineMelhorFator(auxiliarDate);

        if (fator > 0) {

          count += fator;

          if (auxiliarDate <= this.fimContador88) {
            count88 += fator;
          };

          if (auxiliarDate <= this.fimContador91) {
            count91 += fator;
          };

          if (auxiliarDate <= this.fimContador98) {
            count98 += fator;
          };

          if (auxiliarDate <= this.fimContador99) {
            count99 += fator;
          };

          if (auxiliarDate <= this.fimContador03) {
            count03 += fator;
          };

          if (auxiliarDate <= this.fimContador19) {
            count19 += fator;
          };

        }

        // console.log(count + ' -- ' + auxiliarDate.format('DD/MM/YYYY'));
        //auxiliarDate = moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY').add(1, 'd');

        let teste = auxiliarDate.clone();
        auxiliarDate = moment(this.toDateString(teste.add(1, 'days')), 'DD/MM/YYYY');


        // } while (auxiliarDate < fimContador);
      } while (fimContador.isSameOrAfter(auxiliarDate));


      // console.log(auxiliarDate);
      // console.log(count);
      // console.log(this.yearMonthDaysToFormate(count));
      // console.log(moment.duration(count, 'days').humanize());
      // console.log(count88)
      // console.log(count91)
      // console.log(count98)
      // console.log(count99)
      // console.log(count19)


      this.tempoTotalConFator = moment.duration(Math.floor(count), 'days');
      this.tempoTotalConFator88 = moment.duration(Math.floor(count88), 'days');
      this.tempoTotalConFator91 = moment.duration(Math.floor(count91), 'days');
      this.tempoTotalConFator98 = moment.duration(Math.floor(count98), 'days');
      this.tempoTotalConFator99 = moment.duration(Math.floor(count99), 'days');
      this.tempoTotalConFator19 = moment.duration(Math.floor(count19), 'days');

      // console.log(count);
      // console.log(this.tempoTotalConFator);
      // console.log(moment.duration(9067, 'days'));

      this.ajusteHumanizadoDateINSS();


      this.subTotais();

      if (this.tempoTotalConFator) {
        resolve(true);
      } else {
        reject(false);
      }
    });

  }


  /**
   * Ajustar o periodo de 30 ou 31 para um mês completo
   */
  private ajusteHumanizadoDateINSS() {

    const correcaoPeriodos = ['', '88', '91', '98', '99', '19'];


    correcaoPeriodos.forEach(label => {

      if (this['tempoTotalConFator' + label].days() >= 30) {

        this['tempoTotalConFator' + label] = moment.duration(
          {
            years: this['tempoTotalConFator' + label].years(),
            months: (this['tempoTotalConFator' + label].months() + 1),
            days: 0,
            seconds: 0,
            hours: 0,
            milliseconds: 0,
            minutes: 0
          });

      }


      // if (this['tempoTotalConFator' + label].months() >= 12) {

      //   this['tempoTotalConFator' + label] = moment.duration(
      //     {
      //       years: this['tempoTotalConFator' + label].years() + 1,
      //       months: (this['tempoTotalConFator' + label].months() - 12),
      //       days: 0,
      //       seconds: 0,
      //       hours: 0,
      //       milliseconds: 0,
      //       minutes: 0
      //     });

      // }

    });

  }





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



  private yearMonthDaysToFormate(fullDays) {

    const totalFator = { years: 0, months: 0, days: 0, fullDays: fullDays };

    const xValor = (Math.ceil(fullDays) / 365.25);

    totalFator.years = Math.floor(xValor);
    let xVarMes = (xValor - totalFator.years) * 12;
    totalFator.months = Math.floor(xVarMes);
    let dttDias = (xVarMes - totalFator.months) * 30.436875;
    totalFator.days = Math.round(dttDias);

    // console.log(totalFator.years + '/' + totalFator.months + '/' + totalFator.days);
    return totalFator;
  }


  private defineCarenciaData(auxiliarDate) {
    let carencia = false;

    for (const vinculo of this.periodosList) {
      let inicioVinculo = this.toMomentCarencia(vinculo.data_inicio);
      let fimVinculo = this.toMomentCarencia(vinculo.data_termino);

      if ((vinculo.carencia === 'Sim' || vinculo.carencia === 1) && (auxiliarDate >= inicioVinculo && auxiliarDate <= fimVinculo)) {
        carencia = true;
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
      let count98 = 0;
      let count99 = 0;
      let count03 = 0;
      let count19 = 0;

      const fimContador88 = this.momentCarencia(this.fimContador88);
      const fimContador91 = this.momentCarencia(this.fimContador91);
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


        auxiliarDate = moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY').add(1, 'M');

      } while ( fimContador.isSameOrAfter(auxiliarDate));

      // auxiliarDate <= fimContador

      this.carencia = count;
      this.carencia88 = count88;
      this.carencia91 = count91;
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

    rstTemp = this.tempoTotalConFator98.asDays() - (this.idadeLimiteDias - this.redutorSexoDias);
    rstTemp = rstTemp * 0.4;
    rstTemp = (rstTemp < 0) ? rstTemp * -1 : rstTemp;

    this.tempoDePedApProp = moment.duration(rstTemp, 'days');
  }

  public tempoMinimoParaAposentadoriaProporcionalComPedagio() {

    let rstTemp = 0;

    rstTemp = this.tempoDePedApProp.asDays() + (this.idadeLimiteDias - this.redutorSexoDias);

    this.tempoDePedApPropComPedagio = moment.duration(rstTemp, 'days');
  }

  public tempoCumprirAposentadoriaProporcional() {

    let rstTemp = 0;

    rstTemp = this.tempoTotalConFator.asDays() - this.tempoDePedApPropComPedagio.asDays();
    rstTemp = (rstTemp < 0) ? rstTemp * -1 : 0;

    this.tempoParaAposProp = moment.duration(rstTemp, 'days');
  }


  public tempoCumprirAposentadoriaItentegal() {

    let rstTemp = 0;

    rstTemp = this.tempoTotalConFator.asDays() - (this.idadeLimiteDias + 1826.25 - this.redutorSexoDias);

    rstTemp = (rstTemp < 0) ? rstTemp * -1 : 0;

    this.tempoCumprirAposItentegal = moment.duration(rstTemp, 'days');
  }


  public idadeMinimaExigidaParaAposentadoriaProporcional() {

    let rstTemp = 'Idade Mínima Atingida';
    let exigeIdadeMinimaProporcional = false;

    if (this.tempoTotalConFator88.asDays() < (this.idadeLimiteDias - this.redutorSexoDias)) {
      exigeIdadeMinimaProporcional = true;
    }

    if (exigeIdadeMinimaProporcional && (this.idadeFinal.asDays() < (this.idadeMasculinaProporcional - this.redutorSexoDias))) {
      rstTemp = 'Idade Mínima não Atingida';
    }

    this.idadeMinimaAposProp = rstTemp;
  }

  // public somatoriaTempoContribuicaoIdade() {
  //   let rstTemp = 0;

  //   rstTemp = (this.tempoTotalConFator.asDays() + this.idadeFinal.asDays());

  //   this.somatoriaTempoContribIdade = moment.duration(Math.floor(rstTemp), 'days');
  // }

  // public somatoriaTempoContribuicaoIdadeAtual() {
  //   let rstTemp = 0;

  //   const idadeDias = moment.duration(moment().diff(moment(this.segurado.data_nascimento, 'DD/MM/YYYY')));

  //   rstTemp = (this.tempoTotalConFator.asDays() + idadeDias.asDays());

  //   if (moment().isBefore(this.limitesDoVinculo.fim)) {
  //     const diffTempoTotal = moment.duration(moment(this.limitesDoVinculo.fim, 'DD/MM/YYYY').diff(moment()));
  //     rstTemp -= diffTempoTotal.asDays();
  //   }

  //   this.somatoriaTempoContribIdadeAtual = moment.duration(Math.floor(rstTemp), 'days');
  // }




  public somatoriaTempoContribuicaoIdade() {

    return new Promise((resolve, reject) => {

      let rstTemp = 0;

      rstTemp = (this.tempoTotalConFator.asDays() + this.idadeFinal.asDays());

      this.somatoriaTempoContribIdade = moment.duration(Math.floor(rstTemp), 'days');

      if (this.somatoriaTempoContribIdade.asDays() > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }

  public somatoriaTempoContribuicaoIdadeAtual() {


    return new Promise((resolve, reject) => {

      let rstTemp = 0;

      const idadeDias = moment.duration(moment().diff(moment(this.segurado.data_nascimento, 'DD/MM/YYYY')));

      rstTemp = (this.tempoTotalConFator.asDays() + idadeDias.asDays());

      if (moment().isBefore(this.limitesDoVinculo.fim)) {
        const diffTempoTotal = moment.duration(moment(this.limitesDoVinculo.fim, 'DD/MM/YYYY').diff(moment()));
        rstTemp -= diffTempoTotal.asDays();
      }

      this.somatoriaTempoContribIdadeAtual = moment.duration(Math.floor(rstTemp), 'days');

      if (this.somatoriaTempoContribIdadeAtual.asDays() > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });


  }



  private defineIdadeFinal() {
    this.idadeFinal = moment.duration(this.limitesDoVinculo.fim.diff(moment(this.segurado.data_nascimento, 'DD/MM/YYYY')));
    this.limitesTempoTotal.emit(this.idadeFinal);
  }

  private subTotais() {

    this.tempoPedagioAposentadoriaProporcional();

    this.tempoMinimoParaAposentadoriaProporcionalComPedagio();

    this.tempoCumprirAposentadoriaProporcional();

    this.tempoCumprirAposentadoriaItentegal();

    this.idadeMinimaExigidaParaAposentadoriaProporcional();


    this.somatoriaTempoContribuicaoIdade().then(result => {
      // console.log(result);
      this.isUpdateTotalTempoIdadeA = false;
    }).catch((error) => {
      console.log(error);
    });

    this.somatoriaTempoContribuicaoIdadeAtual().then(result => {
      // console.log(result);
      this.isUpdateTotalTempoIdadeB = false;
    }).catch((error) => {
      console.log(error);
    });

  }


  private createConclusaoFinal() {

    this.limitesDoVinculo = this.defineInicioFim();

    this.defineIdadeFinal();

    this.tempoTotal(this.limitesDoVinculo).then(result => {
      // console.log('complete tempo total');
      this.isCompleteTempoTotal = true;
      this.updateCalculo();
    }).catch((error) => {
      console.log(error);
    });

    this.tempoCarencia(this.limitesDoVinculo).then(result => {
      // console.log('complete carencia');
      this.isCompleteCarencia = true;
      this.updateCalculo();
    }).catch((error) => {
      console.log(error);
    });


    // this.tempoTotal(this.limitesDoVinculo);

    // this.tempoCarencia(this.limitesDoVinculo);

    this.isUpdateTotal = false;

    // this.updateCalculo().then(result => {

    // }).catch((error) => {
    //   console.log(error);
    // });

    this.setExportRGPSList();

    // console.log(this.tempoTotalConFator);

  }



  private updateCalculo() {

    // console.log(this.tempoTotalConFator.asDays());
    // console.log(this.Math.round(this.tempoTotalConFator.asDays()));

    setTimeout(() => {
      if (
        (this.calculo.total_dias != this.tempoTotalConFator.asDays() ||
          this.calculo.total_88 != this.tempoTotalConFator88.asDays() ||
          this.calculo.total_91 != this.tempoTotalConFator91.asDays() ||
          this.calculo.total_98 != this.tempoTotalConFator98.asDays() ||
          this.calculo.total_99 != this.tempoTotalConFator99.asDays() ||
          this.calculo.total_19 != this.tempoTotalConFator19.asDays() ||
          this.calculo.total_carencia != this.carencia)
        &&
        (this.isCompleteCarencia && this.isCompleteTempoTotal)
      ) {
        this.calculo.total_dias = this.tempoTotalConFator.asDays();
        this.calculo.total_88 = this.tempoTotalConFator88.asDays();
        this.calculo.total_91 = this.tempoTotalConFator91.asDays();
        this.calculo.total_98 = this.tempoTotalConFator98.asDays();
        this.calculo.total_99 = this.tempoTotalConFator99.asDays();
        this.calculo.total_19 = this.tempoTotalConFator19.asDays();
        this.calculo.total_carencia = this.carencia;

        this.CalculoContagemTempoService
          .update(this.calculo)
          .then(model => {
            // console.log('update ok');
          })
          .catch(errors => this.Errors.add(errors));
      }
    }, 5000);

  }


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

  public setExportRGPSobj(tempo, carencia, label) {
    return {
      label: label,
      years: tempo.years(),
      months: tempo.months(),
      days: (tempo.days() < 0) ? this.Math.ceil(tempo.days()) * -1 : this.Math.ceil(tempo.days()),
      carencia: carencia,
      totalDias: tempo.asDays()
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
