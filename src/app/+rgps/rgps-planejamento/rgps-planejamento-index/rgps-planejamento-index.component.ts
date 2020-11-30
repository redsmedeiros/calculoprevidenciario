import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild, DoCheck, } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RgpsPlanejamentoService } from './../rgps-planejamento.service';
import { PlanejamentoRgps } from './../PlanejamentoRgps.model';
import { DOCUMENT } from '@angular/platform-browser';
import swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap';

import * as moment from 'moment';

@Component({
  selector: 'app-rgps-planejamento-index',
  templateUrl: './rgps-planejamento-index.component.html',
  styleUrls: ['./rgps-planejamento-index.component.css'],
  providers: [
    ErrorService
  ],
})
export class RgpsPlanejamentoIndexComponent implements OnInit, DoCheck {
  @Output() onSubmit = new EventEmitter();
  @ViewChild('modalCreatePlan') public modalCreatePlan: ModalDirective;
  //@Input() errors: ErrorService;
  @Input() segurado;
  @Input() calculo;
  

  public form = { ...PlanejamentoRgps.form };
  public isEdit = false;
  public isCreate = false;
  public checkboxIdList = [];
  public dateMaskdiB = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  public dataFutura;
  public dataHoje = moment();
  public isUpdatePlan = false;
  public valorBeneficio;
  public aliquota;
  public id_calculo;
  public planejamentoList = [];
  public userCheck = false;

  public model = {
    id: '',
    id_calculo: '',
    data_futura: '',
    valor_beneficio: '',
    aliquota: '',
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
    this.isUpdatePlan = true;

    // console.log(this.route.snapshot.params['correcao_pbc'])
    // console.log(this.route.snapshot.params['pbc'])


    this.getInfoCalculos();
  }

  private getInfoCalculos() {

    this.isUpdatePlan = true;
    this.rgpsPlanejamentoService
      .getPlanejamentoByCalculoId(this.id_calculo)
      .then((planejamentoRst: PlanejamentoRgps[]) => {
        this.planejamentoList = [];
        for (const plan of planejamentoRst) {
          this.planejamentoList.push(plan);
        }
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


  private deletarPlananejamentoList(id) {

    const objPlan = this.planejamentoList.find(row => row.id === id);

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



  getupdatePlananejamentoList(id) {

    this.isEdit = true;
    this.model = this.planejamentoList.find(row => row.id === id);

    this.steps.find(it => it.key === 'step1').checked = true;
    this.steps.find(it => it.key === 'step2').checked = true;
    this.steps.find(it => it.key === 'step4').checked = true;
    this.activeStep = this.steps[2];
    this.model.data_futura = this.formatReceivedDate(this.model.data_futura);
    console.log(this.model);

    this.showChildModal();
  }


  public updatePlan(id) {
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
        this.hideChildModal();
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
    this.validate();
    this.rgpsPlanejamentoService.save(data).then((model) => {
      this.hideChildModal();
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




  private planejar(id){

    const objPlan = this.planejamentoList.find(row => row.id === id);
    const objExport = JSON.stringify(objPlan);
    sessionStorage.setItem('exportPlanejamento', objExport);

    //window.location.href 
    const urlpbcNew = '/rgps/rgps-resultados/' + this.segurado.id + '/' + this.calculo.id + '/plan/' + objPlan.id;
    this.router.navigate([urlpbcNew]);

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



  formatMoeda(value, sigla = 'R$') {

    value = parseFloat(value);
    const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return sigla + ' ' + numeroPadronizado;
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
  }

  validate() {

    this.errors.clear();

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
    if (dataFutura < this.dataHoje) {
      this.model.data_futura = '';
      swal({
        position: 'top-end',
        type: 'error',
        title: 'Data não pode ser menor que ' + this.formatReceivedDate(moment()) + '.',
        showConfirmButton: false,
        timer: 3000
      });
      this.activeStep = this.steps[2];
    }
    this.errors.clear();
  }

}

