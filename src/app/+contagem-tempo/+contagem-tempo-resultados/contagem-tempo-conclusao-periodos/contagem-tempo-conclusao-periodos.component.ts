import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import swal from 'sweetalert2';


import { PeriodosContagemTempo } from './../../+contagem-tempo-periodos/PeriodosContagemTempo.model';
import { PeriodosContagemTempoService } from './../../+contagem-tempo-periodos/PeriodosContagemTempo.service';
import { DefinicaoTempo } from 'app/shared/functions/definicao-tempo';

@Component({
  selector: 'app-contagem-tempo-conclusao-periodos',
  templateUrl: './contagem-tempo-conclusao-periodos.component.html',
  styleUrls: ['./contagem-tempo-conclusao-periodos.component.css']
})
export class ContagemTempoConclusaoPeriodosComponent implements OnInit {

  @Input() idCalculoSelecionado;

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
    this.updateTabelaPeriodosView();
  }

  updateTabelaPeriodosView() {

    this.idsCalculos = this.idCalculoSelecionado;

    this.PeriodosContagemTempoService.getByPeriodosId(this.idsCalculos)
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

    if (typeof periodo === 'object' && this.idsCalculos == periodo.id_contagem_tempo) {

      const ajusteFator = (periodo.condicao_especial !== 0) ? Number(periodo.fator_condicao_especial) : 1;
      const totalTempo = this.dateDiffPeriodos(periodo.data_inicio, periodo.data_termino, periodo.fator_condicao_especial);

      const line = {
        vinculo: this.periodosListInicial.length + 1,
        data_inicio: this.formatReceivedDate(periodo.data_inicio),
        data_termino: this.formatReceivedDate(periodo.data_termino),
        empresa: periodo.empresa,
        fator_condicao_especial: periodo.fator_condicao_especial,
        fator_condicao_especialN: ajusteFator,
        condicao_especial: (periodo.condicao_especial) ? 'Sim' : 'Não',
        carencia: (periodo.carencia) ? 'Sim' : 'Não',
        actions: periodo.actions,
        created_at: this.formatReceivedDate(periodo.created_at),
        id: periodo.id,
        totalSemFator: totalTempo.semFator,
        totalComFator: totalTempo.comFator,
        totalCarencia: totalTempo.carencia,
        concomitantes: ''
      }
      this.periodosListInicial.push(line);
    }

  }


  public dataDiffDateToDate(date1, date2, fator) {

    const totalDay360 = DefinicaoTempo.dataDiffDateToDateCustom(
      moment(date1).format('YYYY-MM-DD'),
      moment(date2).format('YYYY-MM-DD')
    );

    const totalFatorDay360 = DefinicaoTempo.aplicarFator(totalDay360.dias, fator);
    const totalDMY = DefinicaoTempo.convertD360ToDMY(totalDay360.dias);
    const totalFatorDMY = DefinicaoTempo.convertD360ToDMY(totalFatorDay360);

    return { semFator: totalDMY, comFator: totalFatorDMY, carencia: totalDay360.meses };
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

    if (inicio < inicioAux && fim >= inicioAux && fim <= fimAux) {
      checkConcomitante = true;
    }

    if (inicio > inicioAux && inicio <= fimAux && fim >= fimAux) {
      checkConcomitante = true;
    }

    return checkConcomitante;
  }

  public periodosConcomitantes(periodo) {

    const concomitantes: any = {
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
      this.route.snapshot.params['id_segurado'] + '/' + this.idsCalculos;
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

  isEmpty(data) {
    if (data == undefined || data == '' || typeof data === 'undefined') {
      return true;
    }
    return false;
  }
}
