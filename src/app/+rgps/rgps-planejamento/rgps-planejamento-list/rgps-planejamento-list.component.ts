
import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild, DoCheck, SimpleChange, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { RgpsPlanejamentoService } from './../rgps-planejamento.service';
import { PlanejamentoRgps } from './../PlanejamentoRgps.model';
import { ErrorService } from '../../../services/error.service';
import { DOCUMENT } from '@angular/platform-browser';
import swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap';
import { RgpsPlanejamentoListTableComponent } from './rgps-planejamento-list-table/rgps-planejamento-list-table.component';

import * as moment from 'moment';

@Component({
  selector: 'app-rgps-planejamento-list',
  templateUrl: './rgps-planejamento-list.component.html',
  styleUrls: ['./rgps-planejamento-list.component.css'],
  providers: [
    ErrorService,
  ],
})
export class RgpsPlanejamentoListComponent implements OnInit {

  private planejamentoSelecionado;
  private isPlanejamentoSelecionado = false;

  @ViewChild('modalCreatePlan') public modalCreatePlan: ModalDirective;
  @Input() segurado;
  @Input() calculo;
  @Input() isCalculoSelecionado;

  @Output() planejamentoSelecionadoEvent = new EventEmitter();

  public form = { ...PlanejamentoRgps.form };
  public planejamentoListData = [];
  public isEdit = false;
  public isCreate = false;
  public checkboxIdList = [];
  public dateMaskdiB = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  public isUpdatePlan = true;
  public userId;

  public userCheck = false;

  /// form

  private id;
  private id_calculo;
  private data_futura;
  private valor_beneficio;
  private aliquota;
  private especie;
  /// form

  public plan = {
    id: '',
    id_calculo: '',
    data_futura: '',
    valor_beneficio: '',
    aliquota: '',
    especie: '',
  };

  public steps = [
    {
      key: 'step1',
      title: 'Planejamento',
      valid: true,
      checked: false,
      submitted: false,
    },
    {
      key: 'step2',
      title: 'Informações',
      valid: true,
      checked: false,
      submitted: false,
    },
    {
      key: 'step3',
      title: 'Formulário',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step4',
      title: 'Finalizar',
      valid: true,
      checked: false,
      submitted: false,
    },
  ];

  private lastModel;

  public activeStep = this.steps[0];


  public datatableOptionsPlan = {
    colReorder: true,
    data: this.planejamentoListData,
    order: [[0, 'desc']],
    columns: [
      { data: 'id', visible: false },
      {
        data: 'data_futura',
        render: (data) => {
          return this.formatData(data);
        }
      },
      { data: 'especie' },
      {
        data: 'valor_beneficio',
        render: (data) => {
          return this.formatMoeda(data);
        }
      },
      {
        data: 'aliquota',
        render: (data) => {
          return this.formatAliquota(data);
        }
      },
      {
        data: 'actions',
        render: (data, type, row) => {
          return this.getAcoesPlanejamento(row.id);
        }, width: '6rem', class: 'p-0'
      },
      {
        data: 'selecionarPlanejamento',
        render: (data, type, row) => {
          return this.getBtnSelecionarPlanejamento(row.id);
        }, width: '6rem', class: 'p-0'
      },
    ]
  };

  constructor(
    private errors: ErrorService,
    protected rgpsPlanejamentoService: RgpsPlanejamentoService,
    private route: ActivatedRoute,
    protected router: Router,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {

    this.userId = localStorage.getItem('user_id') || this.route.snapshot.queryParams['user_id'];

    if (this.userId) {
      localStorage.setItem('user_id', this.userId);
    } else {
      window.location.href = environment.loginPageUrl;
    }

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const changedCalculo = changes['calculo'];
    const changedSegurado = changes['segurado'];

    if (changedCalculo.currentValue) {
      this.getInfoCalculos();
    }

  }


  private updateDatatable() {

    this.datatableOptionsPlan = {
      ...this.datatableOptionsPlan,
      data: this.planejamentoListData,
    }
  }

  private getInfoCalculos() {

    this.id_calculo = this.calculo.id;
    console.log(this.rgpsPlanejamentoService.list);

    this.isUpdatePlan = true;
    this.planejamentoListData = [];
    this.rgpsPlanejamentoService
      .getPlanejamentoByCalculoId(this.id_calculo)
      .then((planejamentoRst: PlanejamentoRgps[]) => {

        for (const plan of planejamentoRst) {
          this.planejamentoListData.push(plan);
        }
        console.log(this.planejamentoListData);
        this.updateDatatable();
        this.isUpdatePlan = false;
      });

  }




  changeAliquota() { }

  verificaPlano() {
    const basico = window.localStorage.getItem('product');

    if (basico === '9dwtctrm') {
      this.userCheck = false;
      swal(
        'Ferramenta disponível somente para clientes Premium.',
        '',
        'error'
      ).then(function () {
        swal('Assine já!', '', 'success').then(function () {
          window.open('http://ieprevpremium.com.br/');
        });
      });
    } else {
      this.userCheck = true;
    }
    return this.userCheck;
  }


  // novoPlanejamento() {
  //   this.verificaPlano();
  //   this.isEdit = false;
  //   this.resetForm();
  //   this.showChildModal();
  // }


  private setPlan() {

    if (this.isExits(this.id)) {
      this.plan.id = this.id;
    }

    this.plan.id_calculo = this.id_calculo;
    this.plan.data_futura = this.formatReceivedDate(this.data_futura);
    this.plan.valor_beneficio = this.valor_beneficio;
    this.plan.aliquota = this.aliquota;
    this.plan.especie = this.especie;

  }

  //private deletarPlananejamentoList(rowPlan) {
  private deletarPlananejamentoList(id) {

    const objPlan = this.planejamentoListData.find(row => row.id === id);

    if (objPlan && this.isExits(objPlan)) {
      this.rgpsPlanejamentoService
        .destroy(objPlan)
        .then(() => {

          swal({
            position: 'top-end',
            type: 'success',
            title: 'O planejamento foi removido.',
            showConfirmButton: false,
            timer: 1000
          });

          this.getInfoCalculos();
        })
        .catch((err) => {

          swal({
            position: 'top-end',
            type: 'error',
            title: 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.',
            showConfirmButton: false,
            timer: 1000
          });

        });
    }
  }


  // getupdatePlananejamentoList(rowPlan) {
  getupdatePlananejamentoList(id) {

    this.isEdit = true;
    this.plan = this.planejamentoListData.find(row => row.id === id);

    this.id = this.plan.id;
    this.data_futura = this.plan.data_futura;
    this.valor_beneficio = this.plan.valor_beneficio;
    this.aliquota = this.plan.aliquota;
    this.especie = this.plan.especie;

    this.data_futura = this.formatReceivedDate(this.plan.data_futura);

  }


  resetForm() {

    this.id = '';
    this.data_futura = '';
    this.valor_beneficio = '';
    this.aliquota = '';
    this.especie = '';

  }


  public updatePlan(event) {
    if (this.valid()) {

      this.setPlan();

      this.rgpsPlanejamentoService
        .update(this.plan)
        .then(model => {

          swal({
            position: 'top-end',
            type: 'success',
            title: 'Dados alterado com sucesso.',
            showConfirmButton: false,
            timer: 1000
          });

          this.getInfoCalculos();
          this.resetForm();

        })
        .catch((errors) => {

          // this.errors.add(errors);

        });
    }
  }




  salvarPlanejamento(event) {

    console.log(this.valid());

    if (this.valid()) {

      this.setPlan();

      // const planejamentoObj = new PlanejamentoRgps;
      // this.plan

      console.log(this.plan);

      this.rgpsPlanejamentoService
        .save(this.plan)
        .then((model) => {
          this.getInfoCalculos();
          swal({
            position: 'top-end',
            type: 'success',
            title: 'Dados salvo com sucesso.',
            showConfirmButton: false,
            timer: 1000
          });
          this.resetForm();
        }).catch((errors) => {

          // this.errors.add(errors);

        });
    }

  }



  //planejamentoSelecionadoEvent
  private planejar(id) {

    const objPlan = this.planejamentoListData.find(row => row.id === id);
    const objExport = JSON.stringify(objPlan);
    sessionStorage.setItem('exportPlanejamento', objExport);

    //window.location.href 
    const urlpbcNew = '/rgps/rgps-resultados/' + this.segurado.id + '/' + this.calculo.id + '/plan/' + objPlan.id;
    this.router.navigate([urlpbcNew]);

  }


  //private getRow(dataRow) {
  private getRow(id) {

    if (this.isExits(id)) {

      const objPlan = this.planejamentoListData.find(row => row.id === id);
      this.planejamentoSelecionado = objPlan;

      const objExport = JSON.stringify(objPlan);
      sessionStorage.setItem('exportPlanejamento', objExport);

      this.isPlanejamentoSelecionado = true;
      this.planejamentoSelecionadoEvent.emit(this.planejamentoSelecionado);

    }
  }



  public getBtnSelecionarPlanejamento(id) {

    // return `<button  type="button" class="btn btn-xs btn-info select-btn">
    //           Selecionar <i class="fa fa-arrow-circle-right"></i>
    //       </button>`;

    return `<div class="checkbox"><label>
                 <input type="checkbox" id='${id}-checkbox' class="select-btn checkbox checkboxCalculos" value="${id}"><span></span></label>
          </div>`;
  }

  private getAcoesPlanejamento(id) {
    return `
        <div class="btn-group">
          <button type="button" id='${id}-edit' class="btn btn-xs btn-warning update-btn" title='Editar'>
            <i class='fa fa-edit fa-1-7x'></i>
          </button>
          <button type="button" id='${id}-delete' class="btn btn-xs btn-danger delete-btn" title='Excluir'>
            <i class='fa fa-times fa-1-7x'></i>
          </button>
        </div>
     `;
  }

  formatMoeda(value, sigla = 'R$') {

    value = parseFloat(value);
    const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return sigla + ' ' + numeroPadronizado;
  }

  formatData(value) {
    return moment(value).format('DD/MM/YYYY');
    // return value;
  }


  formatAliquota(value) {

    return value + '%';
  }

  public showChildModal(): void {
    this.modalCreatePlan.show();
  }

  public hideChildModal(): void {
    this.modalCreatePlan.hide();
  }



  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }




  valid() {

    this.errors.clear();
    let valid = true;


    if (this.valor_beneficio == undefined || this.valor_beneficio == '') {
      this.errors.add({ 'valor_beneficio': ['O campo é obrigatório.'] });
      valid = false;
    }


    if (this.aliquota == undefined || this.aliquota == '') {
      this.errors.add({ 'sexo': ['O campo é obrigatório.'] });
      valid = false;
    }


    if (this.especie == undefined || this.especie == '') {
      this.errors.add({ 'sexo': ['O campo é obrigatório.'] });
      valid = false;

    }

    const dataHoje = moment();

    if (!this.isExits(this.data_futura)) {
      this.errors.add({ 'data_futura': ['Data do planejamento necessária'] });
      valid = false;

    } else if (moment(this.data_futura, 'DD/MM/YYYY') < dataHoje) {
      this.errors.add({ 'data_futura': ['A data deve ser superior a data do dia.'] });
      valid = false;
    }


    return valid;
  }



  formatReceivedDate(inputDate) {

    const date = new Date(inputDate);
    date.setTime(date.getTime() + 5 * 60 * 60 * 1000);
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return (
        ('0' + date.getDate()).slice(-2) +
        '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '/' +
        date.getFullYear()
      );
    }
    return '';

  }

}
