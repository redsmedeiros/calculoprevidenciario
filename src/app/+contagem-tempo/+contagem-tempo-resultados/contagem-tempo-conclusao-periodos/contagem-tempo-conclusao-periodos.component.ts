import { Component, OnInit } from '@angular/core';

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
  public periodosList = [];


  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected PeriodosContagemTempoService: PeriodosContagemTempoService,
  ) { }

  ngOnInit() {
    this.periodosList = [];
    this.isUpdating = true;
    this.idsCalculos = this.route.snapshot.params['id'].split(',');
    this.updateTabelaPeriodosView();
  }


  updateTabelaPeriodosView() {

    this.idsCalculos = this.route.snapshot.params['id'].split(',');

    this.PeriodosContagemTempoService.getByPeriodosId(this.idsCalculos[0])
      .then((periodosContribuicao: PeriodosContagemTempo[]) => {
        this.periodosList = [];
        for (const periodo of periodosContribuicao) {
          this.updateDatatablePeriodos(periodo);
        }

        this.isUpdating = false;
      });
  }

  updateDatatablePeriodos(periodo) {

    if (typeof periodo === 'object' && this.idsCalculos[0] == periodo.id_contagem_tempo) {

      let line = {
        vinculo: this.periodosList.length + 1,
        data_inicio: this.formatReceivedDate(periodo.data_inicio),
        data_termino: this.formatReceivedDate(periodo.data_termino),
        empresa: periodo.empresa,
        fator_condicao_especial: periodo.fator_condicao_especial,
        condicao_especial: (periodo.condicao_especial) ? 'Sim' : 'Não',
        carencia: (periodo.carencia) ? 'Sim' : 'Não',
        actions: periodo.actions,
        created_at: this.formatReceivedDate(periodo.created_at),
        id: periodo.id
      }
      this.periodosList.push(line);
    }

  }

  formatReceivedDate(inputDate) {

    let date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return ('0' + (date.getDate())).slice(-2) + '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        date.getFullYear();
    }
    return '';

  }


}
