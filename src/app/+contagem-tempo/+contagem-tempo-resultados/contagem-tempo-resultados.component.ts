import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { SeguradoContagemTempo as SeguradoModel } from './../+contagem-tempo-segurados/SeguradoContagemTempo.model';
import { CalculoContagemTempo as CalculoModel } from './../+contagem-tempo-calculos/CalculoContagemTempo.model';
import { PeriodosContagemTempo } from './../+contagem-tempo-periodos/PeriodosContagemTempo.model';
import { SeguradoService } from '../+contagem-tempo-segurados/SeguradoContagemTempo.service';
import { CalculoContagemTempoService } from '../+contagem-tempo-calculos/CalculoContagemTempo.service';
import { PeriodosContagemTempoService } from './../+contagem-tempo-periodos/PeriodosContagemTempo.service';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contagem-tempo-resultados.component.html',
  styleUrls: ['./contagem-tempo-resultados.component.css'],
  providers: [
    ErrorService
  ]
})
export class ContagemTempoResultadosComponent implements OnInit {

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public isUpdating = false;
  public mostrarBotaoRealizarCalculos = true;
  public idSegurado = '';
  public idsCalculos = '';

  public segurado: any = {};
  public calculo: any = {};
  public periodo: any = {};
  public periodosList = [];


  public data_inicio = '';
  public data_termino = '';
  public empresa = undefined;
  public fator_condicao_especial = 1.00;
  public condicao_especial = 0;
  public carencia = 1;
  public id;
  public atualizarPeriodo = 0;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected Segurado: SeguradoService,
    protected CalculoContagemTempoService: CalculoContagemTempoService,
    protected PeriodosContagemTempoService: PeriodosContagemTempoService,
    protected errors: ErrorService
  ) {
  }

  ngOnInit() {
    this.periodosList = [];
    this.isUpdating = true;
    this.updateTabelasView();
   // this.updateTabelaPeriodosView();
  }

  updateTabelasView() {
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.idsCalculos = this.route.snapshot.params['id'].split(',');

    this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.seguradoView(segurado);
      });

      this.CalculoContagemTempoService.find(this.idsCalculos[0])
      .then(calculo => {
        this.calculoSetView(calculo);
        this.isUpdating = false;
      });
  }

  // updateTabelaPeriodosView() {

  //   this.idsCalculos = this.route.snapshot.params['id'].split(',');

  //   this.PeriodosContagemTempoService.getByPeriodosId(this.idsCalculos[0])
  //     .then((periodosContribuicao: PeriodosContagemTempo[]) => {
  //       this.periodosList = [];
  //       for (const periodo of periodosContribuicao) {
  //         this.updateDatatablePeriodos(periodo);
  //       }

  //       this.isUpdating = false;
  //     });
  // }

  calculoSetView(calculo) {
    calculo.created_at = this.formatReceivedDate(calculo.created_at);
    this.calculo = calculo;
  }

  seguradoView(segurado) {
    segurado.id_documento = segurado.getDocumentType(segurado.id_documento);
    segurado.idade = segurado.getIdadeAtual(segurado.data_nascimento, 1);
    this.segurado = segurado;
  }


  // updateDatatablePeriodos(periodo) {

  //   if (typeof periodo === 'object' && this.idsCalculos[0] == periodo.id_contagem_tempo) {

  //     let line = {
  //       vinculo: this.periodosList.length + 1,
  //       data_inicio: this.formatReceivedDate(periodo.data_inicio),
  //       data_termino: this.formatReceivedDate(periodo.data_termino),
  //       empresa: periodo.empresa,
  //       fator_condicao_especial: periodo.fator_condicao_especial,
  //       condicao_especial: (periodo.condicao_especial) ? 'Sim' : 'Não',
  //       carencia: (periodo.carencia) ? 'Sim' : 'Não',
  //       actions: periodo.actions,
  //       created_at: this.formatReceivedDate(periodo.created_at),
  //       id: periodo.id
  //     }
  //     this.periodosList.push(line);
  //   }

  // }



  toastAlert(type, title, position) {

    position = (!position) ? 'top-end' : position;

    swal({
      position: position,
      type: type,
      title: title,
      showConfirmButton: false,
      timer: 1500
    });

  }

  boolToLiteral(value) {
    if (typeof value === 'number') {
      value = (value) ? 'Sim' : 'Não';
    } else {
      value = (value === 'Sim') ? 1 : 0;
    }

    return value;
  }

  isEmpty(data) {
    if (data == undefined || data == '') {
      return true;
    }
    return false;
  }

  formatFatorPost(fator) {
    return (fator === 0 || (typeof fator === 'undefined')) ? 1 : fator;
  }

  removeFatorDefault() {
    this.fator_condicao_especial = 0;
  }

  checkFator() {
    this.fator_condicao_especial = this.formatFatorPost(this.fator_condicao_especial);
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

  formatPostDataDate(inputDate) {

    let date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + (date.getDate())).slice(-2);
    }
    return '';

  }


  editSegurado() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados/' +
      this.route.snapshot.params['id_segurado'] + '/editar?last=resultados&calc=' + this.idsCalculos[0];
  }

  returnListaSegurados() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados';
  }


  editCalculo() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-calculos/' +
      this.route.snapshot.params['id_segurado'] + '/' + this.idsCalculos[0] + '/editar?last=resultados';
  }

  returnListaCalculos() {

    window.location.href = '#/contagem-tempo/contagem-tempo-calculos/' +
      this.route.snapshot.params['id_segurado'];
  }

  returnListaPeriodos() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-periodos/' +
      this.route.snapshot.params['id_segurado'] + '/' + this.idsCalculos[0];
  }


}
