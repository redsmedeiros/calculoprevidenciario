import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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
import { PeriodosContagemTempoService } from './../+contagem-tempo-periodos/PeriodosContagemTempo.service';

import { SeguradoService } from '../+contagem-tempo-segurados/SeguradoContagemTempo.service';
import { CalculoContagemTempoService } from '../+contagem-tempo-calculos/CalculoContagemTempo.service';

import { Auth } from '../../services/Auth/Auth.service';
import { AuthResponse } from '../../services/Auth/AuthResponse.model';

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

  public lastdateNascimento = moment.duration();

  public getPeriodosList = false;

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
    //  protected PeriodosContagemTempoService: PeriodosContagemTempoService,
    protected errors: ErrorService,
    private Auth: Auth
  ) {
  }

  ngOnInit() {
    this.periodosList = [];
    this.isUpdating = true;
    this.getPeriodosList = true;
    this.updateTabelasView();
    // this.updateTabelaPeriodosView();
  }

  updateTabelasView() {
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.idsCalculos = this.route.snapshot.params['id'].split(',');

    this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.seguradoView(segurado);
        if (localStorage.getItem('user_id') != this.segurado.user_id) {
          this.segurado = {};
          // redirecionar para pagina de segurados
          swal({
            type: 'error',
            title: 'Erro - Você não tem permissão para acessar esta página!',
            text: '',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 1500
          }).then(() => {});
          this.voltar();
        }
        this.CalculoContagemTempoService.find(this.idsCalculos[0])
        .then(calculo => {
          this.calculoSetView(calculo);
          this.isUpdating = false;
        });
      });

  }

  // updateTabelaPeriodosView() {

  //   this.idsCalculos = this.route.snapshot.params['id'].split(',');

  //   this.PeriodosContagemTempoService.getByPeriodosId(this.idsCalculos[0])
  //     .then((periodosContribuicao: PeriodosContagemTempo[]) => {
  //       this.periodosList = periodosContribuicao;
  //     });
  // }

  reciverFeedback(rstPeriodos) {
    this.periodosList = rstPeriodos;
    this.getPeriodosList = false;
  }


  reciverFeedbackLastdate(lastdate) {
    this.lastdateNascimento.add(lastdate.asDays(), 'days');
  }

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



  imprimirPagina() {
    const segurado = document.getElementById('article-segurado').innerHTML;
    const periodos = document.getElementById('article-periodos').innerHTML;
    const conclusaoFinal = document.getElementById('article-conclusao').innerHTML;
    const footerText = `IEPREV - Instituto de Estudos Previdenciários -
                        Rua Timbiras, 1940 Sala 807 | Tel: (31) 3271-1701 
                        | CEP: 30140-061 Lourdes - Belo Horizonte - MG`;

    const printContents = segurado + periodos + conclusaoFinal;

    const css = `<link rel="stylesheet" type="text/css"  href="assets/css/bootstrap.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-production-plugins.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-production.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-skins.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-rtl.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-angular-next.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/demo.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/your_style.css">
                <style>i.fa, .not-print{ display: none; } div,p,td{font-size:12px !important;}</style>`;

    const popupWin = window.open('', '_blank', 'width=640,height=480');

    popupWin.document.open();
    popupWin.document.write(`<!doctype html>
                                <html>
                                  <head>${css}</head>
                                  <body onload="window.print()">
                                   <article>${printContents}</article>
                                   <footer>${footerText}</footer>
                                  </body>
                                </html>`);
    popupWin.document.close();
  }

  // savePDF() {


  //   const segurado = document.getElementById('article-segurado').innerHTML;
  //   const periodos = document.getElementById('article-periodos').innerHTML;
  //   const conclusaoFinal = document.getElementById('article-conclusao').innerHTML;


  //   const printContents = segurado.trim() + periodos.trim() + conclusaoFinal.trim();

  //   const css = `<link rel="stylesheet" type="text/css"  href="assets/css/bootstrap.min.css">
  //               <link rel="stylesheet" type="text/css"  href="assets/css/font-awesome.min.css">
  //               <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-production-plugins.min.css">
  //               <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-production.min.css">
  //               <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-skins.min.css">
  //               <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-rtl.min.css">
  //               <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-angular-next.css">
  //               <link rel="stylesheet" type="text/css"  href="assets/css/demo.min.css">
  //               <link rel="stylesheet" type="text/css"  href="assets/css/your_style.css">
  //               <style>i.fa, .not-print{ display: none; }</style>`;

  //  const page = '<html><head>' + css + '</head><body >' + printContents + '</body></html>';



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
    let date = moment(inputDate, 'YYYY-MM-DD');
    return date.format('DD/MM/YYYY');
  }

  formatPostDataDate(inputDate) {
    let date = moment(inputDate, 'DD/MM/YYYY');
    return date.format('YYYY-MM-DD');
  }

  returnListaPeriodos() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-periodos/' +
      this.route.snapshot.params['id_segurado'] + '/' + this.idsCalculos[0];
  }

  voltar() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados/'
  }

}
