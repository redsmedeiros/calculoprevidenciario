// import { Component, OnInit, ViewChild } from '@angular/core';
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { SeguradoService } from '../+contagem-tempo-segurados/SeguradoContagemTempo.service';
import { SeguradoContagemTempo as SeguradoModel } from '../+contagem-tempo-segurados/SeguradoContagemTempo.model';
import { CalculoContagemTempo as CalculoModel } from '../+contagem-tempo-calculos/CalculoContagemTempo.model';
import { CalculoContagemTempoService } from '../+contagem-tempo-calculos/CalculoContagemTempo.service';
import { PeriodosContagemTempo } from './PeriodosContagemTempo.model';
import { PeriodosContagemTempoService } from './PeriodosContagemTempo.service';


@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contagem-tempo-periodos.component.html',
  providers: [
    ErrorService
  ]
})


export class ContagemTempoPeriodosComponent implements OnInit {

  public isUpdating = false;
  public mostrarBotaoRealizarCalculos = true;
  public idSegurado = '';
  public idsCalculos = '';

  public segurado: any = {};
  public calculo: any = {};
  public periodo: any = {};
  public periodosList = [];
  public form = {...PeriodosContagemTempo.form};

  @Output() onSubmit = new EventEmitter();
  @ViewChild('periodoFormheader') periodoFormheader: ElementRef;


  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];


  // public grupoPeriodosTableOptions = {
  //   colReorder: false,
  //   paging: false,
  //   ordering: false,
  //   info: false,
  //   searching: false,
  //   data: this.periodosList,
  //   columns: [
  //     { data: 'empresa' },
  //     { data: 'data_inicio', width: '15%' },
  //     { data: 'data_termino', width: '15%' },
  //     { data: 'condicao_especial', width: '8%' },
  //     { data: 'fator_condicao_especial', width: '8%' },
  //     { data: 'carencia', width: '8%' },
  //     { data: 'actions', width: '5%' }
  //   ],
  //   columnDefs: [
  //     { className: 'text-center', targets: [3, 4, 5, 6] },
  //   ]
  // };


  // mRender:  (data: any, type: any, row: any, meta) => {
  //   return `
  //     <div class="btn-group">
  //         <button type="button" class="btn btn-xs btn-warning" (click)='updatePeriodo(${row.id})'  title='Editar Referência'>
  //                 <i class='fa fa-edit fa-1-7x'></i>
  //         </button>
  //         <button type="button" class="btn btn-xs btn-danger"  (click)='deletarPeriodo(${row.id})'  title='Excluir'>
  //                 <i class='fa fa-times fa-1-7x'></i>
  //         </button>
  //     </div>
  //   `;
  // }

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
    this.updateTabelaPeriodosView();
  }

  updateTabelasView() {
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.idsCalculos = this.route.snapshot.params['id'].split(',');
    this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.segurado = segurado;
        this.CalculoContagemTempoService.find(this.idsCalculos[0])
          .then(calculo => {
            this.calculo = this.calculoSetView(calculo);
          });
      });

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

    // let parameters = ['id_contagem_tempo', this.idsCalculos[0]];
    // this.PeriodosContagemTempoService.getByPeriodosId(parameters)
    //   .then(periodosContribuicao => {
    //     this.periodosList = [];
    //     // for (let objPeriodo of Object.getOwnPropertyDescriptor(periodosContribuicao, 'data').value) {
    //     //   console.log(objPeriodo);
    //     //   this.updateDatatablePeriodos(objPeriodo);
    //     // }
    //     this.isUpdating = false;
    //   });
  }

  calculoSetView(calculo) {
    calculo.created_at = this.formatReceivedDate(calculo.created_at);
    return calculo;
  }


  updateDatatablePeriodos(periodo) {

    if (typeof periodo === 'object' && this.idsCalculos[0] == periodo.id_contagem_tempo) {

      let line = {
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

    // this.grupoPeriodosTableOptions = {
    //   ...this.grupoPeriodosTableOptions,
    //   data: this.periodosList,
    // }

  }

  deletarPeriodo(id) {
    this.PeriodosContagemTempoService.find(id)
      .then(periodo => {
        this.PeriodosContagemTempoService.destroy(periodo)
          .then(() => {
            this.toastAlert('success', 'Período excluído com sucesso.', null);
            this.updateTabelaPeriodosView();
          }).catch((err) => {
            this.toastAlert('error', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', null);
          });
      })
  }

  getupdatePeriodo(id) {
    const periodo = this.periodosList.find(x => x.id === id);

    this.form = periodo;

    this.data_inicio = periodo.data_inicio;
    this.data_termino = periodo.data_termino;
    this.empresa = periodo.empresa;
    this.fator_condicao_especial = periodo.fator_condicao_especial;
    this.condicao_especial = this.boolToLiteral(periodo.condicao_especial);
    this.carencia = this.boolToLiteral(periodo.carencia);
    this.id = periodo.id;


    this.atualizarPeriodo = periodo.id; // exibir o botao de atualizar e ocultar o insert

    this.topForm();
  }


  setupdatePeriodo() {
    if (this.isValid()) {
      
      let periodoObj = new PeriodosContagemTempo ({
              data_inicio: this.formatPostDataDate(this.data_inicio),
              data_termino: this.formatPostDataDate(this.data_termino),
              empresa: this.empresa,
              fator_condicao_especial: this.formatFatorPost(this.fator_condicao_especial),
              condicao_especial: this.condicao_especial,
              carencia: this.carencia,
              licenca_premio_nao_usufruida: 0,
              id_contagem_tempo: this.idsCalculos[0],
              id: this.id,
        });

      console.log(periodoObj);

      this.PeriodosContagemTempoService
          .update(periodoObj)
          .then(model => {
            this.updateTabelaPeriodosView();
            this.toastAlert('success', 'Período adicionado com sucesso.', null);
            this.resetForm();
        }).catch((err) => {
                console.log(err);
                this.toastAlert('error', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', null);
              });

    // this.PeriodosContagemTempoService
    //       .update(periodoObj)
    //       .then(model => {

    //           this.PeriodosContagemTempoService.get();
    //       })
    //       // .catch(errors => this.Errors.add(errors));
    //       .catch((err) => {
    //         console.log(err);
    //         this.toastAlert('error', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', null);
    //       });


    } else {
      this.toastAlert('error', 'Confira os dados digitados', null);
    }

  }

  insertPeriodo(periodoObj) {

    this.isUpdating = true;

    this.PeriodosContagemTempoService
      .save(periodoObj)
      .then(model => {
        this.onSubmit.emit();
        this.updateTabelaPeriodosView();
        this.toastAlert('success', 'Período adicionado com sucesso.', null);
        this.resetForm();
      })
      .catch(errors => this.errors.add(errors));
  }



  resetForm() {
    this.data_inicio = '';
    this.data_termino = '';
    this.empresa = undefined;
    this.fator_condicao_especial = 1.00;
    this.condicao_especial = 0;
    this.carencia = 1;
    this.id = null;
  }



  submit() {

    if (this.isValid()) {

      let periodoObj = {
        data_inicio: this.formatPostDataDate(this.data_inicio),
        data_termino: this.formatPostDataDate(this.data_termino),
        empresa: this.empresa,
        fator_condicao_especial: this.formatFatorPost(this.fator_condicao_especial),
        condicao_especial: this.condicao_especial,
        carencia: this.carencia,
        licenca_premio_nao_usufruida: 0,
        id_contagem_tempo: this.idsCalculos[0]
      };

      this.insertPeriodo(periodoObj);

    } else {
      this.toastAlert('error', 'Confira os dados digitados', null);
    }

  }

  isValid() {

    if (this.isEmpty(this.data_inicio)) {
      this.errors.add({ 'data_inicio': ['Insira uma data'] });
    }

    if (this.isEmpty(this.data_termino)) {
      this.errors.add({ 'data_termino': ['Insira uma data'] });
    }

    if (!this.isEmpty(this.data_inicio) && !this.isEmpty(this.data_termino)) {

      let dateInicioPeriodo = moment(this.data_inicio.split('/')[2]
        + '-' + this.data_inicio.split('/')[1]
        + '-' + this.data_inicio.split('/')[0]);
      let dateFinalPeriodo = moment(this.data_termino.split('/')[2]
        + '-' + this.data_termino.split('/')[1]
        + '-' + this.data_termino.split('/')[1]);

      // inicioPeriodo
      if (this.isEmpty(this.data_inicio) || !dateInicioPeriodo.isValid()) {
        this.errors.add({ 'data_inicio': ['Insira uma data válida'] });
      }

      // finalPeriodo
      if (this.isEmpty(this.data_termino) || !dateFinalPeriodo.isValid()) {
        this.errors.add({ 'data_termino': ['Insira uma data válida'] });
      } else {
        if (dateFinalPeriodo <= dateInicioPeriodo) {
          this.errors.add({ 'data_termino': ['Insira uma data posterior a data inicial'] });
        }
      }

    }

    // empresa
    if (this.isEmpty(this.empresa)) {
      this.errors.add({ 'empresa': ['Insira o nome da empresa'] });
    } else {
      this.errors.clear('empresa');
    }

    // fator_condicao_especial
    if (this.isEmpty(this.fator_condicao_especial)) {
      this.errors.add({ 'fator_condicao_especial': ['Insira um fator válido.'] });
    } else {
      this.errors.clear('fator_condicao_especial');
    }

    // condição esepecial
    if (this.condicao_especial === undefined) {
      this.errors.add({ 'sexo': ['O campo condição esepecial é obrigatório.'] });
    }

    // carencia
    if (this.carencia === undefined) {
      this.errors.add({ 'carencia': ['O campo carência é obrigatório.'] });
    }

    return this.errors.empty();
  }



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
    this.fator_condicao_especial = this.formatFatorPost( this.fator_condicao_especial );
  }

  formatReceivedDate(inputDate) {

    var date = new Date(inputDate);
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

    var date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + (date.getDate())).slice(-2);
    }
    return '';

  }

  topForm() {
     document.body.scrollTop = this.periodoFormheader.nativeElement.offsetLeft  + 500; // For Safari
     document.documentElement.scrollTop = this.periodoFormheader.nativeElement.offsetLeft + 500; // For Chrome, Firefox, IE and Opera
 }

  editSegurado() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados/' +
      this.route.snapshot.params['id_segurado'] + '/editar';
  }

  returnListaSegurados() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados';
  }


  editCalculo() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-calculos/' +
      this.route.snapshot.params['id_segurado'] + '/' + this.idsCalculos[0] + '/editar';
  }

  returnListaCalculos() {

    window.location.href = '#/contagem-tempo/contagem-tempo-calculos/' +
      this.route.snapshot.params['id_segurado'];
  }


  realizarCalculoContagemTempo(){
    window.location.href = '/#/contagem-tempo/contagem-tempo-resultado/' +
    this.route.snapshot.params['id_segurado'] + '/' + this.idsCalculos[0] + '/editar';
  }
}
