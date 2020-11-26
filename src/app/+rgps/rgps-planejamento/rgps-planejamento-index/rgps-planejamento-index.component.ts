import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  trigger,
  state,
  style,
  transition,
  animate,
  OnChanges,
  DoCheck,
} from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RgpsPlanejamentoService } from './../rgps-planejamento.service';
import { PlanejamentoRgps } from './../PlanejamentoRgps.model';
import { DOCUMENT } from '@angular/platform-browser';
import swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-rgps-planejamento-index',
  templateUrl: './rgps-planejamento-index.component.html',
  styleUrls: ['./rgps-planejamento-index.component.css'],
  providers: [ErrorService],
  // animations: [
  //   trigger('changePane', [
  //     state(
  //       'out',
  //       style({
  //         height: 0,
  //       })
  //     ),
  //     state(
  //       'in',
  //       style({
  //         height: '*',
  //       })
  //     ),
  //     transition('out => in', animate('250ms ease-out')),
  //     transition('in => out', animate('250ms 300ms ease-in ')),
  //   ]),
  // ]
})
export class RgpsPlanejamentoIndexComponent implements OnInit, DoCheck {
  @Output() onSubmit = new EventEmitter();
  @ViewChild('modalCreate') public modalCreate: ModalDirective;

  @Input() segurado;
  @Input() calculo;

  public form = { ...PlanejamentoRgps.form };
  public isEdit = false;
  public checkboxIdList = [];
  public dateMaskdiB = [
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  public firstCalc = true;
  public dataFutura;
  public idcalculo = '';
  public isUpdatePlan = false;
  public valorBeneficio;
  public aliquota;
  public id_calculo;
  public planejamentoList = [];


  public userCheck = false;

  public model = {
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

  constructor(
    private Errors: ErrorService,
    protected rgpsPlanejamentoService: RgpsPlanejamentoService,
    private route: ActivatedRoute,
    protected router: Router,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    // console.log(this.segurado);
    // console.log(this.calculo);

    // console.log(this.planejamentoTableOptions);

    this.id_calculo = this.calculo.id;

    this.isUpdatePlan = true;

    // this.rgpsPlanejamentoService
    //   .getWithParameter(['id_calculo', this.id_calculo])
    //   .then((planRow) => {
    //     console.log(planRow);
    //   });

    this.getInfoCalculos();
  }

  private getInfoCalculos() {

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


  getupdatePlananejamentoList(id) {

    const objPlan = this.planejamentoList.find(row => row.id = id);
    console.log(objPlan);

  }

  formatMoeda(value, sigla = 'R$') {

    value = parseFloat(value);
    const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return sigla + ' ' + numeroPadronizado;
  }


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

  // getCheckbox(data) {
  //   if (!this.checkboxIdList.includes(`${data.id}-checkbox`)) {
  //     this.checkboxIdList.push(`${data.id}-checkbox`);
  //   }

  //   if (this.firstCalc) {
  //     this.firstCalc = false;
  //     return `<div class="checkbox"><label><input type="checkbox" id='${data.id}-checkbox' class="checkbox {{styleTheme}}" checked><span> </span></label></div>`;
  //   }
  //   return `<div class="checkbox"><label><input type="checkbox" id='${data.id}-checkbox' class="checkbox {{styleTheme}}"><span> </span></label></div>`;
  // }

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

  validate() {
    console.log(this.dataFutura);
    if (this.dataFutura === undefined || this.dataFutura === '') {
    } else {
      var dateParts = this.dataFutura.split('/');
      let date = new Date(
        dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]
      );
    }
  }

  // public create() {
  //   this.form.id_calculo = this.id_calculo;
  //   this.form.data_futura = this.dataFutura;
  //   this.form.valor_beneficio = this.valorBeneficio;
  //   this.form.aliquota = this.aliquota;

  //   this.rgpsPlanejamentoService
  //     .save(this.form)
  //     .then((model) => {
  //       const teste = {
  //         position: 'top-end',
  //         icon: 'success',
  //         title: 'Dados salvo com sucesso.',
  //         button: false,
  //         timer: 1500,
  //       };

  //       swal(teste);
  //     })
  //     .catch((errors) => this.Errors.add(errors));
  //   this.resetForm();
  //   this.hideChildModal();
  // }



  private updatePlananejamentoList(id) {

    const objPlan = this.planejamentoList.find(row => row.id = id);
    console.log(objPlan);
   
  

  }


  private deletarPlananejamentoList(id) {

    const objPlan = this.planejamentoList.find(row => row.id = id);
    console.log(objPlan);

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

  public update(ObjPlan) {
    this.rgpsPlanejamentoService
      .update(ObjPlan)
      .then((model) => {

        swal({
          position: 'top-end',
          type: 'success',
          title: 'Dados salvo com sucesso.',
          showConfirmButton: false,
          timer: 1000
        });
      })
      .catch((errors) => {

        this.Errors.add(errors);

      });
  }

  public setForm() {

  }

  public showChildModal(): void {
    this.modalCreate.show();
  }

  public hideChildModal(): void {
    this.modalCreate.hide();
  }

  resetForm() {
    this.form = { ...PlanejamentoRgps.form };
    this.dataFutura = '';
    this.valorBeneficio = '';
    this.aliquota = '';
  }

  public activeStep = this.steps[0];

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
        idx = idx == this.steps.length - 1 ? 0 : idx + 1;
        if (!this.steps[idx].valid || !this.steps[idx].checked) {
          this.activeStep = this.steps[idx];
        }
      }
    }
  }

  onWizardComplete(data) {
    console.log('Dados completo', data);

    this.rgpsPlanejamentoService.save(data).then((model) => {

      this.hideChildModal();
      
      swal({
        position: 'top-end',
        type: 'success',
        title: 'Dados salvo com sucesso.',
        showConfirmButton: false,
        timer: 1000
      });
      location.reload();
    });
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
        this.steps.find(it=>it.key == 'step1').valid = this.activeStep.checked = true;
        this.steps.find(it=>it.key == 'step2').valid = this.activeStep.checked = true;
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

}
