import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import swal from 'sweetalert2';


import { PeriodosContagemTempo } from './../../+contagem-tempo-periodos/PeriodosContagemTempo.model';
import { PeriodosContagemTempoService } from './../../+contagem-tempo-periodos/PeriodosContagemTempo.service';

@Component({
  selector: 'app-contagem-tempo-conclusao-periodos',
  templateUrl: './contagem-tempo-conclusao-periodos.component.html',
  styleUrls: ['./contagem-tempo-conclusao-periodos.component.css']
})
export class ContagemTempoConclusaoPeriodosComponent implements OnInit {

  public idsCalculos = '';
  public isUpdating = false;
  public periodo: any = {};
  public periodosListInicial = [];
  public periodosList = [];
  public Math = Math;
  // public tableOptionsPeriodos = {
  //   colReorder: false,
  //   paging: false,
  //   searching: false,
  //   ordering: false,
  //   bInfo: false,
  //   data: this.periodosList,
  //   columns: [
  //     { data: 'vinculo' },
  //     { data: 'empresa' },
  //     { data: 'data_inicio' },
  //     { data: 'data_termino' },
  //     { data: 'fator_condicao_especial' },
  //     { data: 'carencia' },
  //     { data: 'concomitantes.text' },
  //     { data: 'totalSemFator.years' },
  //     { data: 'totalSemFator.months' },
  //     { data: 'totalSemFator.days' },
  //     { data: 'totalComFator.years' },
  //     { data: 'totalComFator.months' },
  //     { data: 'totalComFator.days' },
  //     { data: 'concomitantes.vinculosList' }
  //   ]
  // };



  @Output() periodosListRst = new EventEmitter();

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected PeriodosContagemTempoService: PeriodosContagemTempoService,
  ) { }

  ngOnInit() {
    this.periodosListInicial = [];
    this.isUpdating = true;
    this.idsCalculos = this.route.snapshot.params['id'].split(',');
    this.updateTabelaPeriodosView();
  }

  updateTabelaPeriodosView() {

    this.idsCalculos = this.route.snapshot.params['id'].split(',');

    this.PeriodosContagemTempoService.getByPeriodosId(this.idsCalculos[0])
      .then((periodosContribuicao: PeriodosContagemTempo[]) => {
        this.periodosListInicial = [];
        if (periodosContribuicao.length > 0) {

          for (const periodo of periodosContribuicao) {
            this.updateDatatablePeriodos(periodo);
          }

          for (const periodo of this.periodosListInicial) {
            this.periodosConcomitantes(periodo);
          }

          this.periodosList = this.periodosListInicial;
          this.periodosListRst.emit(this.periodosList);
        }

        // this.tableOptionsPeriodos = {
        //   ...this.tableOptionsPeriodos,
        //   data: this.periodosList,
        // }

        this.isUpdating = false;
      });
  }

  updateDatatablePeriodos(periodo) {

    if (typeof periodo === 'object' && this.idsCalculos[0] == periodo.id_contagem_tempo) {

      const totalTempo = this.dateDiffPeriodos(periodo.data_inicio, periodo.data_termino, periodo.fator_condicao_especial);

      const line = {
        vinculo: this.periodosListInicial.length + 1,
        data_inicio: this.formatReceivedDate(periodo.data_inicio),
        data_termino: this.formatReceivedDate(periodo.data_termino),
        empresa: periodo.empresa,
        fator_condicao_especial: periodo.fator_condicao_especial,
        condicao_especial: (periodo.condicao_especial) ? 'Sim' : 'Não',
        carencia: (periodo.carencia) ? 'Sim' : 'Não',
        actions: periodo.actions,
        created_at: this.formatReceivedDate(periodo.created_at),
        id: periodo.id,
        totalSemFator: totalTempo.semFator,
        totalComFator: totalTempo.comFator,
        concomitantes: ''
      }
      this.periodosListInicial.push(line);
    }

  }


  private yearMonthDaysToFormate(dias) {
    let anos_rst: any;
    let meses_rst: any;
    let dias_rst: any;

    anos_rst = this.Math.floor(dias / 365.25);

    if (dias > 30.4375) {
      meses_rst = this.Math.floor((dias % 365.25) / 30.4375); // I choose 30.5 for Month (30,31) ;)
    } else {
      meses_rst = this.Math.floor((dias % 365.25) / 30); // I choose 30.5 for Month (30,31) ;)
    }

    dias_rst = this.Math.floor((dias % 365.25) % 30.4375);

    let dias_rec: any;
    let meses_rec: any;

    if (dias_rst >= 30) {
      if (dias_rst % 30 == 0) {
        meses_rst = meses_rst + dias_rst / 30;
        dias_rec = 0;
      }
      else {
        dias_rec = dias_rst % 30;
        meses_rst = meses_rst + dias_rst / 30;
      }

    }
    else {
      dias_rec = dias_rst;
    }

    if (meses_rst >= 12) {

      if (meses_rst % 12 == 0) {
        anos_rst = anos_rst + meses_rst / 12;
        meses_rec = 0;
      }
      else {
        meses_rec = meses_rst % 12;
        anos_rst = anos_rst + meses_rst / 12;
      }

    }
    else {
      meses_rec = meses_rst;
    }



    console.log('Y ' + anos_rst);
    console.log('M ' + meses_rec);
    console.log('d ' + dias_rec);

    //    return rst;
  }

  // public dataDiff(inicio, fim, fator) {

  //   //  console.log(fator);

  //   let auxiliarDate = moment(inicio, 'YYYY-MM-DD').hour(1).minute(1).second(1).millisecond(1);

  //   ///  console.log(auxiliarDate);
  //   let fimContador = moment(fim, 'YYYY-MM-DD').hour(1).minute(1).second(1).millisecond(1);

  //   //  console.log(fimContador);

  //   let count = moment.duration();
  //   let countSemFator = moment.duration();

  //   do {

  //     count.add(moment.duration(fator, 'd'));

  //     countSemFator.add(moment.duration(1, 'd'));

  //     // console.log(count.asDays() + ' --> ' + auxiliarDate.format('DD-MM-YYYY') + ' -- ' + fator);
  //     // console.log(auxiliarDate.format('DD-MM-YYYY'));
  //     auxiliarDate = moment(auxiliarDate, 'YYYY-MM-DD').add(1, 'd');

  //   } while (auxiliarDate <= fimContador);


  //   // console.log(count);

  //   // this.yearMonthDaysToFormate(count.asDays());

  //   return { semFator: countSemFator, comFator: count };
  // }



  private yearMonthDaysToFormate2(out) {
    // let xDias = ((out.days / 30.0) / 12);
    //   let xMeses = (out.months / 12.0);
    //   let xValor = ((out.years + xDias + xMeses) * fator);

    //  // console.log(xValor);


    //   let dttAno = this.Math.floor(xValor);
    //   let xVarAno = xValor - dttAno;
    //   let xVarMes = xVarAno * 12;
    //   let dttMes = this.Math.floor(xVarMes);
    //   let xVarDias = xVarMes - dttMes;
    //   let dttDias = xVarDias * 30;
    //   let dttTotalDias = dttDias;


    let xValor = out;

    //  console.log(xValor);

    let dttAno = this.Math.floor(xValor);
    let xVarMes = (xValor - dttAno) * 12;
    let dttMes = this.Math.floor(xVarMes);
    let dttDias = (xVarMes - dttMes) * 30;
    let dttTotalDias = dttDias;

    console.log(dttAno);
    console.log(dttMes);
    console.log(dttTotalDias);
  }



  // public dataDiff(inicio, fim, fator) {
  //   // let auxiliarDate = moment(inicio, 'YYYY-MM-DD').hour(0).minute(0).second(0).millisecond(0);
  //   const auxiliarDate = moment(inicio, 'YYYY-MM-DD').startOf('day');

  //   ///  console.log(auxiliarDate);
  //   // let fimContador = moment(fim, 'YYYY-MM-DD').hour(0).minute(0).second(0).millisecond(0).add(1, 'd');
  //   const fimContador = moment(fim, 'YYYY-MM-DD').startOf('day').add(1, 'd');

  //   // console.log(auxiliarDate);
  //   // console.log(fimContador);

  //   const count = moment.duration((fimContador.diff(auxiliarDate, 'days', true) * fator), 'days');
  //   const countSemFator = moment.duration(fimContador.diff(auxiliarDate, 'days', true), 'days');

  //   console.log(count.asDays());
  //   console.log(countSemFator.asDays());


  //   // this.yearMonthDaysToFormate(count.asDays());
  //   // this.yearMonthDaysToFormate(countSemFator.asDays());

  //   //  console.log(fimContador.diff(auxiliarDate, 'years', true));
  //   //  console.log((fimContador.diff(auxiliarDate, 'years', true) * fator));


  //   // this.yearMonthDaysToFormate2(fimContador.diff(auxiliarDate, 'years', true));
  //   // this.yearMonthDaysToFormate2(fimContador.diff(auxiliarDate, 'years', true));

  //   return { semFator: countSemFator, comFator: count };
  // }

  public dataDiffDateToDate(date1, date2, fator) {
    let b = moment(date1);
   // let a = moment(date2).add(1, 'd');
    let a = moment(date2);

    // console.log(a);
    // console.log(b);
    //console.log(Number(a.format('DD')))
    if ( 
        Number(a.format('DD')) <= 30 
        || (Number(b.format('DD')) < Number(a.format('DD')))
        || ((Number(a.format('DD')) === 31 && (Number(b.format('DD')) === 31))
        )
    ) {
      a = a.add(1, 'd');
    }

    let total = { years: 0, months: 0, days: 0 };
    let totalFator = { years: 0, months: 0, days: 0 };
    let totalGeralEmDias = 0;
    let diff: any;
    let totalGeraldiff;

    totalGeraldiff = moment.duration(a.diff(b));
    totalGeralEmDias = moment.duration(a.diff(b)).asDays();

    // console.log(totalGeralEmDias);
    // console.log(totalGeraldiff);

    diff = a.diff(b, 'years');
    b.add(diff, 'years');
    total.years = diff;

    diff = a.diff(b, 'months');
    b.add(diff, 'months');
    total.months = diff;

    diff = a.diff(b, 'days');
    b.add(diff, 'days');
    total.days = diff;

    if (a.isSame(b) && totalGeralEmDias <= 0) {
      total.days = 1;
    }

    let xValor = (this.Math.floor(totalGeralEmDias) / 365.25); // 365.25
    // console.log(totalGeralEmDias * fator);

    totalFator.years = this.Math.floor(xValor);
    let xVarMes = (xValor - totalFator.years) * 12;
    totalFator.months = this.Math.floor(xVarMes);
    let dttDias = (xVarMes - totalFator.months) * 30.4375; // 30.4375
    totalFator.days = this.Math.floor(dttDias);

    //   console.log(totalFator);


    if (fator !== 1 && fator > 0) {
      // let xDias = ((total.days / 30) / 12);
      // let xMeses = (total.months / 12);
      // let xValor = ((total.years + xDias + xMeses) * fator);

      let xValor = (this.Math.floor(totalGeralEmDias) * fator / 365.25); //  365.25

      // console.log(totalGeralEmDias * fator);
      // console.log(xValor);


      totalFator.years = this.Math.floor(xValor);
      let xVarMes = (xValor - totalFator.years) * 12;
      totalFator.months = this.Math.floor(xVarMes);
      let dttDias = (xVarMes - totalFator.months) * 30.4375; // 30.4375
      totalFator.days = this.Math.floor(dttDias);

      //  console.log(totalFator);

    } else {
      totalFator = total;
    }

    total = this.ajusteHumanizadoDateINSS(total);
    totalFator = this.ajusteHumanizadoDateINSS(totalFator);
    // console.log(total);

    return { semFator: total, comFator: totalFator };
  };


  /**
   * Ajustar o periodo de 30 ou 31 para um mês completo
   */
  private ajusteHumanizadoDateINSS(tempoObj) {

      if (tempoObj.days >= 30) {
        tempoObj.months += 1;
        tempoObj.days = 0;
      }


      if (tempoObj.months >= 12) {
        tempoObj.months = (tempoObj.months - 12);
        tempoObj.years += 1;
      }

      return tempoObj;
  }

  public dateDiffPeriodos(inicio, fim, fator) {

    // const tempoTotal = this.dataDiff(inicio, fim, Number(fator));

    const tempoTotal = this.dataDiffDateToDate(inicio, fim, Number(fator));

    return tempoTotal;
  }


  private checkDatasConcomitantes(inicio, fim, inicioAux, fimAux) {
    let checkConcomitante = false;

    inicio = moment(inicio, 'DD/MM/YYYY').hour(1).minute(1).second(1).millisecond(1);
    fim = moment(fim, 'DD/MM/YYYY').hour(1).minute(1).second(1).millisecond(1);

    inicioAux = moment(inicioAux, 'DD/MM/YYYY').hour(1).minute(1).second(1).millisecond(1);
    fimAux = moment(fimAux, 'DD/MM/YYYY').hour(1).minute(1).second(1).millisecond(1);


    if (inicio === inicioAux && fim === fimAux) {
      checkConcomitante = true;
    } else {
      if (inicio >= inicioAux && fim <= fimAux) {
        checkConcomitante = true;
      }

      if (inicio <= inicioAux && fim >= fimAux) {
        checkConcomitante = true;
      }
    }

    if (inicio < inicioAux && fim > inicioAux && fim < fimAux) {
      checkConcomitante = true;
    }

    if (inicio > inicioAux && inicio < fimAux && fim > fimAux) {
      checkConcomitante = true;
    }

    return checkConcomitante;
  }

  public periodosConcomitantes(periodo) {

    let concomitantes: any = {
      'vinculosList': '',
      'check': false,
      'text': 'Não'
    };

    let checkConcomitante = false;

    for (const periodoCom of this.periodosListInicial) {

      checkConcomitante = this.checkDatasConcomitantes(periodo.data_inicio, periodo.data_termino,
        periodoCom.data_inicio, periodoCom.data_termino);
      if (periodo.vinculo !== periodoCom.vinculo && checkConcomitante) {
        concomitantes.check = true;
        concomitantes.text = 'Sim';
        concomitantes.vinculosList += (concomitantes.vinculosList === '') ? periodoCom.vinculo : ', ' + periodoCom.vinculo;
      }

    }

    periodo.concomitantes = concomitantes;

    return periodo;
  }

  returnListaPeriodos() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-periodos/' +
      this.route.snapshot.params['id_segurado'] + '/' + this.idsCalculos[0];
  }


  toMoment(dateString) {
    return moment(dateString, 'DD/MM/YYYY');
  }

  toMomentTempo(dateString) {
    return moment(this.toDateString(dateString.add(1, 'd').hour(1).minute(1).second(1).millisecond(1)), 'DD/MM/YYYY');
  }

  toDateString(date) {
    return date.format('DD/MM/YYYY');
  }


  toDateStringYYYY(date) {
    return moment(date).format('YYYY-MM-DD');
  }


  formatReceivedDate(inputDate) {
    let date = moment(inputDate, 'YYYY-MM-DD');
    return date.format('DD/MM/YYYY');
  }

  formatPostDataDate(inputDate) {
    let date = moment(inputDate, 'DD/MM/YYYY');
    return date.format('YYYY-MM-DD');
  }
}
