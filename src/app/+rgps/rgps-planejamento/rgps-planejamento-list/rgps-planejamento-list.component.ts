
import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild, DoCheck, SimpleChange, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ModalDirective } from 'ngx-bootstrap';
import { RgpsPlanejamentoService } from './../rgps-planejamento.service';
import { PlanejamentoRgps } from './../PlanejamentoRgps.model';
import { RgpsPlanejamentoListTableComponent } from './rgps-planejamento-list-table/rgps-planejamento-list-table.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ErrorService } from '../../../services/error.service';
import { DOCUMENT } from '@angular/platform-browser';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { DefinicoesPlanejamento } from '../shared/definicoes-planejamento';
import { MoedaService } from 'app/services/Moeda.service';
import { Moeda } from 'app/services/Moeda.model';

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

  private baseUrl = window.location.origin;
  private url;
  private isResultRMIFutura;

  /// form

  private id;
  private id_calculo;
  private data_futura;
  private valor_beneficio = '0.00';
  private aliquota = '';
  private especie = '';
  /// form

  public plan = {
    id: '',
    id_calculo: '',
    data_futura: '',
    valor_beneficio: '0.00',
    aliquota: '',
    especie: '',
  };

  private listAliquotas = [];
  private listEspecies = [];

  private lastModel;
  private moeda;


  //public activeStep = this.steps[0];


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
          return this.getAliquotasLabel(data);
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
    protected Moeda: MoedaService,
    protected router: Router,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.resetForm();
    this.verificacoesAcesso();
    this.getAliquotas();
    this.getEspecies();
  }

  verificacoesAcesso() {

    this.userId = localStorage.getItem('user_id') || this.route.snapshot.queryParams['user_id'];

    if (this.userId) {
      localStorage.setItem('user_id', this.userId);
    } else {
      window.location.href = environment.loginPageUrl;
    }

  }

  private getAliquotas() {
    this.listAliquotas = DefinicoesPlanejamento.aliquotasList;
  }

  private getAliquotasLabel(value) {
    return DefinicoesPlanejamento.getAliquota(Number(value)).label;
  }

  private getEspecies() {
    this.listEspecies = DefinicoesPlanejamento.especiesPlanejamento;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const changedCalculo = changes['calculo'];
    const changedSegurado = changes['segurado'];

    if (changedCalculo !== undefined && changedCalculo.currentValue) {
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
    //console.log(this.rgpsPlanejamentoService.list);

    this.isUpdatePlan = true;
    this.planejamentoListData = [];
    this.rgpsPlanejamentoService
      .getPlanejamentoByCalculoId(this.id_calculo)
      .then((planejamentoRst: PlanejamentoRgps[]) => {

        for (const plan of planejamentoRst) {
          this.planejamentoListData.push(plan);
        }
        //console.log(this.planejamentoListData);
        this.updateDatatable();
        this.isUpdatePlan = false;
      });


    this.Moeda.getByDateRangeMomentParam(moment().subtract(1, 'months'), moment())
      .then((moeda: Moeda[]) => {

        this.moeda = moeda[1];
        if (moeda[1].salario_minimo == undefined) {
          this.moeda = moeda[0];
        }

      });

  }

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


  private setPlan() {

    if (this.isExits(this.id)) {
      this.plan.id = this.id;
    }

    this.plan.id_calculo = this.id_calculo;
    this.plan.data_futura = this.data_futura;
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
    //this.data_futura = this.plan.data_futura;
    this.valor_beneficio = this.plan.valor_beneficio;
    this.aliquota = this.plan.aliquota;
    this.especie = this.plan.especie;

    this.data_futura = this.formatReceivedDate(this.plan.data_futura);

  }


  resetForm() {

    this.id = '';
    this.data_futura = '';
    this.valor_beneficio = '0.00';
    this.aliquota = '';
    this.especie = '';

  }


  public updatePlan(event) {

    if (this.valid()) {

      this.isEdit = false;
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

    if (this.valid()) {

      this.setPlan();

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

    if (Number(this.valor_beneficio) != 0) {

      if (this.valor_beneficio == undefined || this.valor_beneficio == '') {
        this.errors.add({ 'valor_beneficio': ['O campo é obrigatório.'] });
        valid = false;

      } else if ((Number(this.valor_beneficio) < Number(this.moeda.salario_minimo))) {

        this.errors.add({ 'valor_beneficio': ['SC inferior ao limite mínimo'] });
        valid = false;

      } else if ((Number(this.valor_beneficio) > Number(this.moeda.teto))) {

        this.errors.add({ 'valor_beneficio': ['SC superior ao limite máximo.'] });
        valid = false;

      } else if (![8, 11, 20, 201, 99].includes(Number(this.aliquota))
        && (Number(this.valor_beneficio) > Number(this.moeda.salario_minimo))) {

        this.errors.add({
          'valor_beneficio':
            ['O SC não pode ser superior ao valor do salário mínimo na espécie de segurado selecionado.']
        });
        valid = false;

      }

    }


    // console.log((![8, 20, 201, 99].includes(Number(this.aliquota))
    // && (Number(this.valor_beneficio) >= Number(this.moeda.minimo))))

    // console.log((![8, 20, 201, 99].includes(Number(this.aliquota))))
    // console.log((Number(this.valor_beneficio) >= Number(this.moeda.salario_minimo)))
    // console.log(this.aliquota)
    // console.log(this.valor_beneficio)
    // console.log(this.moeda.salario_minimo)
    // console.log(this.moeda)

    if (this.aliquota == undefined || this.aliquota == '') {
      this.errors.add({ 'aliquota': ['O campo é obrigatório.'] });
      valid = false;
    }


    if (this.especie == undefined || this.especie == '') {
      this.errors.add({ 'especie': ['O campo é obrigatório.'] });
      valid = false;
    }

    const dataHoje = moment().add(-1, 'day');
    const datadibAtual = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    const dataFutura = this.data_futura;
    if (!this.isExits(this.data_futura)) {
      this.errors.add({ 'data_futura': ['O campo é obrigatório.'] });
      valid = false;

    } else if (moment(dataFutura, 'DD/MM/YYYY') < dataHoje) {
      this.errors.add({ 'data_futura': ['A DIB futura deve ser superior a DIB atual.'] });
      valid = false;
    } else if (moment(dataFutura, 'DD/MM/YYYY').isSameOrBefore(datadibAtual)) {
      this.errors.add({ 'data_futura': ['A data deve ser superior a data do cálculo atual.'] });
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
