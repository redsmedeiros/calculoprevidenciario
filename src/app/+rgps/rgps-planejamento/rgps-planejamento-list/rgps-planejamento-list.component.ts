
import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild, DoCheck, } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RgpsPlanejamentoService } from './../rgps-planejamento.service';
import { PlanejamentoRgps } from './../PlanejamentoRgps.model';
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

  @Output() planejamentoSelecionadoEvent = new EventEmitter();

  public form = { ...PlanejamentoRgps.form };
  public planejamentoListData = [];
  public isEdit = false;
  public isCreate = false;
  public checkboxIdList = [];
  public dateMaskdiB = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  public dataFutura;
  public dataHoje = moment();
  public isUpdatePlan = true;
  public valorBeneficio;
  public aliquota;
  public id_calculo;
  
  public userCheck = false;

  public model = {
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
      {data: 'especie'},
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
      { data: 'actions',
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
    // console.log(this.segurado);
    // console.log(this.calculo);

    // console.log(this.planejamentoTableOptions);
    // console.log(this.calculo);

    this.id_calculo = this.calculo.id;
    this.model.id_calculo = this.calculo.id;

    // console.log(this.route.snapshot.params['correcao_pbc'])
    // console.log(this.route.snapshot.params['pbc'])

    this.getInfoCalculos();
  }


  private updateDatatable() {

    this.datatableOptionsPlan = {
      ...this.datatableOptionsPlan,
      data: this.planejamentoListData,
    }
  }

  private getInfoCalculos() {
    
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



  // private setForm(
  //   dataFutura,
  //   valorBeneficio,
  //   aliquota,
  // ) {
  //   this.model.data_futura = this.formatReceivedDate(dataFutura);
  //   this.model.valor_beneficio = valorBeneficio;
  //   this.model.aliquota = aliquota;
  //   this.model.aliquota = aliquota;

  // }


  formatReceivedDate(inputDate) {

    var date = new Date(inputDate);
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


  novoPlanejamento() {
    this.verificaPlano();
    this.isEdit = false;
    this.resetForm();
    this.showChildModal();
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
    this.model = this.planejamentoListData.find(row => row.id === id);

    console.log(this.model);


    this.model.data_futura = this.formatReceivedDate(this.model.data_futura);

  }


  public updatePlan() {
    this.validate();
    this.rgpsPlanejamentoService
      .update(this.model)
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

        this.errors.add(errors);

      });
  }


  setActiveStep(steo) {
    this.activeStep = steo;

  }

  prevStep() {
    let idx = this.steps.indexOf(this.activeStep);
    if (idx > 0) {
      this.activeStep = this.steps[idx - 1];
    }
  }

  nextStep() {
    this.activeStep.submitted = true;
    if (!this.activeStep.valid) {
      return;
    }
    this.activeStep.checked = true;
    if (this.steps.every((it) => it.valid && it.checked)) {
      this.onWizardComplete(this.model);
    } else {
      let idx = this.steps.indexOf(this.activeStep);
      this.activeStep = null;

      while (!this.activeStep) {
        idx = idx === this.steps.length - 1 ? 0 : idx + 1;
        if (!this.steps[idx].valid || !this.steps[idx].checked) {
          this.activeStep = this.steps[idx];
        }
      }
    }
  }

  onWizardComplete(data) {
    console.log('Dados completo', data);

    // this.rgpsPlanejamentoService.save(data).then((model) => {
    //   this.validateInputs();
    //   this.hideChildModal();
    //   this.getInfoCalculos();
    //   swal({
    //     position: 'top-end',
    //     type: 'success',
    //     title: 'Dados salvo com sucesso.',
    //     showConfirmButton: false,
    //     timer: 1000
    //   });
    //   this.resetForm();
    // });
  }


  salvarPlanejamento() {

    this.rgpsPlanejamentoService.save(this.model).then((model) => {
      this.validateInputs();
      //  this.hideChildModal();
      this.getInfoCalculos();
      swal({
        position: 'top-end',
        type: 'success',
        title: 'Dados salvo com sucesso.',
        showConfirmButton: false,
        timer: 1000
      });
      this.resetForm();
    });
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


  // custom change detection
  ngDoCheck() {

    this.model.id_calculo = this.id_calculo;
    if (!this.lastModel) {
      // backup model to compare further with
      this.lastModel = Object.assign({}, this.model);
    } else {
      if (
        Object.keys(this.model).some(
          (it) => this.model[it] != this.lastModel[it]
        )
      ) {
        // change detected
        this.steps.find(it => it.key == 'step1').valid = this.activeStep.checked = true;
        this.steps.find(it => it.key == 'step2').valid = this.activeStep.checked = true;
        this.steps.find((it) => it.key == 'step3').valid = !!(
          this.model.data_futura &&
          this.model.valor_beneficio &&
          this.model.aliquota
        );

        this.lastModel = Object.assign({}, this.model);
      }
    }

  }

  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }




  public getBtnSelecionarPlanejamento(id) {

    // return `<button  type="button" class="btn btn-xs btn-info select-btn">
    //           Selecionar <i class="fa fa-arrow-circle-right"></i>
    //       </button>`;

    return `<input type="checkbox" id='${id}-checkbox'
                 class="checked-row-one checkbox m-0"
                 value="${id}">`;
  }

  private getAcoesPlanejamento(id){
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

  resetForm() {
    this.model.data_futura = '';
    this.model.valor_beneficio = '';
    this.model.aliquota = '';
    this.model.especie = '';
  }

  validate() {

    this.errors.clear();

    let dataHoje = moment();
    const dataFutura = moment(this.model.data_futura, 'DD/MM/YYYY');

    if (this.model.data_futura === undefined || this.model.data_futura === '') {
      swal({
        position: 'top-end',
        type: 'error',
        title: 'Data inválida.',
        showConfirmButton: false,
        timer: 1000
      });
    }
    if (dataFutura < dataHoje) {
      this.model.data_futura = '';
      swal({
        position: 'top-end',
        type: 'error',
        title: 'Data não pode ser menor que ' + this.formatReceivedDate(moment()) + '.',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  validateInputs() {


    let valid = true;

    if (this.isEmptyInput(this.model.data_futura)) {
      this.errors.add({ 'dataFutura': ['Data do planejamento necessária'] });
      valid = false;
    } else if (!moment(this.model.data_futura, 'MM/YYYY').isValid()) {
      this.errors.add({ 'dataFutura': ['Insira uma data válida'] });
      valid = false;
    } else if (moment(this.model.data_futura, 'DD/MM/YYYY') < this.dataHoje) {
      this.errors.add({ 'dataFutura': ['A data deve ser superior a data do dia.'] });
      valid = false;
    }
  }

  isEmptyInput(input) {
    if (input === '' || input === undefined || input === null) {
      return true;
    }
    return false;
  }


}
