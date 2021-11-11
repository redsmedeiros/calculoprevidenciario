import { Component, OnInit, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { isObject } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { Auth } from 'app/services/Auth/Auth.service';
import { MoedaService } from 'app/services/Moeda.service';
import { Moeda } from 'app/services/Moeda.model';

@Component({
  selector: 'app-importador-home',
  templateUrl: './importador-home.component.html',
  styleUrls: ['./importador-home.component.css']
})
export class ImportadorHomeComponent implements OnInit, OnChanges {

  private dadosPassoaPasso = { origem: 'passo-a-passo', type: '' };
  private isTypeEntradaDados = false;

  public moeda;

  public idSeguradoSelecionado;
  private seguradoSelecionado;
  private isSeguradoSelecionado = false;

  public idCalculoSelecionado;
  private calculoSelecionado;
  private isCalculoSelecionado = false;
  private isUpdatingCalculo = true;

  public idCalculoSelecionadoRMI;
  private calculoSelecionadoRMI;
  private isCalculoSelecionadoRMI = false;
  private isUpdatingCalculoRMI = true;

  private periodosSelecionado;

  private iscontagemTempo = false;

  private planejamentoSelecionado;
  private isPlanejamentoSelecionado = false;
  private isUpdatingPlan = true;

  private isPaginaInicial = true;


  public exportResultContagemTempo;
  public isCompleteResultContagemTempo = false;

  public steps = [
    {
      key: 'step1',
      title: 'Opção de Cálculo',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step2',
      title: 'Segurados Cadastrados',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step3',
      title: 'Cálculos Cadastrados',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step4',
      title: 'Períodos de Contribuição e <br>Salários de Contribuição',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step5',
      title: 'Relatório da Contagem do  <br>Tempo de Contribuição',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step6',
      title: 'Cálculo da Renda Mensal Inicial',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step7',
      title: 'Relatório da Renda Mensal Inicial',
      valid: false,
      checked: false,
      submitted: false,
    },
  ];

  public activeStep = this.steps[0];

  private stepUrl = null;
  private stepUrlSegurado = null;
  private stepUrlCalculo = null;
  private isImportCNIS = false;

  constructor(
    private Auth: Auth,
    protected router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private Moeda: MoedaService,
  ) { }

  ngOnInit() {
    this.setPaginaInicial();
    this.clearTempSessionStorageStart();
    this.getTabelaMoeda();
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const steps = changes['steps'];
    const changedisUpdating = changes['isUpdating'];

  }

  
  private getTabelaMoeda() {

    this.Moeda.moedaSalarioMinimoTeto()
      .then((moeda: Moeda[]) => {
        this.moeda = moeda;
        sessionStorage.setItem(
          'moedaSalarioMinimoTeto',
          JSON.stringify(moeda));

      });

  }

  private setPaginaInicial() {

    sessionStorage.removeItem('inicialPassoaPasso');

    this.isPaginaInicial = (
      sessionStorage.getItem('inicialPassoaPasso') === null
      || sessionStorage.getItem('inicialPassoaPasso') === ''
      || sessionStorage.getItem('inicialPassoaPasso') === undefined
      || typeof sessionStorage.getItem('inicialPassoaPasso') === 'undefined');
  }


  public checkStepURL() {

    this.stepUrl = this.route.snapshot.params['step'];
    this.stepUrlSegurado = this.route.snapshot.params['id_segurado'];
    this.stepUrlCalculo = this.route.snapshot.params['id_calculo'];

    if (this.stepUrl !== undefined) {
      this.isPaginaInicial = false;
      this.isUpdatingPlan = false;
    }

    if (this.stepUrl !== undefined
      && this.stepUrlSegurado !== undefined) {

      this.isPaginaInicial = false;

      const keyStepUrl = `step${this.stepUrl}`;
      const step = this.steps.find((item) => keyStepUrl === item.key);
      this.activeStep = step;

      // this.getSeguradoCalculoURL();
    }

  }



  getSeguradoCalculoURL() {

    // const seguradoP = this.seguradoService.getByIdSegurado(this.stepUrlSegurado)
    //   .then((segurado: SeguradoPlan) => {

    //     this.seguradoSelecionado = segurado;
    //     this.isSeguradoSelecionado = true;

    //     const calculoP = this.calculoRgpsService.getCalculoById(this.stepUrlCalculo)
    //       .then((calculo: CalculoRgps) => {

    //         this.calculoSelecionado = calculo;
    //         this.isCalculoSelecionado = true;
    //         this.isUpdatingPlan = false;


    //       }).catch(errors => console.log(errors));

    //   }).catch(errors => console.log(errors));


  }




  setIsPaginaInicial() {

    this.isPaginaInicial = false;
    sessionStorage.setItem('inicialPassoaPasso', '1');
  }




  setActiveStep(steo) {

    const step = this.steps.find((item) => steo.key === item.key);

    if (step.valid || this.stepUrl !== undefined) {
      this.activeStep = steo;
      this.clearDataSelected(this.activeStep);
    }

    if (steo.key === 'step1' || steo.key === 'step2' || steo.key === 'step3') {
      this.isUpdatingPlan = false;
    }


  }

  private clearTempSessionStorageStart() {
    sessionStorage.removeItem('calculoSelecionado');
    sessionStorage.removeItem('calculosSelecionado');
    sessionStorage.removeItem('seguradoSelecionado');
    sessionStorage.removeItem('periodosSelecionado');
    sessionStorage.removeItem('calculosSelecionadoRMI');
    sessionStorage.removeItem('exportResultContagemTempo');
    sessionStorage.removeItem('seguradoSelecionado');

  }

  private clearDataSelected(step) {

    // this.setStepValidate(step.key, false);
    this.setStepValidateClear(false, step);
    switch (step.key) {
      case 'step1':

        this.isTypeEntradaDados = false;
        this.dadosPassoaPasso = { origem: 'passo-a-passo', type: '' };

        this.isSeguradoSelecionado = false;
        this.seguradoSelecionado = {}
        this.unCheckedAll('.checkboxSegurados');

        this.isCalculoSelecionado = false;
        this.calculoSelecionado = {}
        this.unCheckedAll('.checkboxCalculos');

        break;
      case 'step2':

        this.isCalculoSelecionado = false;
        this.calculoSelecionado = {}
        this.unCheckedAll('.checkboxCalculos');

        break;
      case 'step3':

        this.isCalculoSelecionado = false;
        this.calculoSelecionado = {}
        this.unCheckedAll('.checkboxCalculos');

        break;
      case 'step4':
        this.isImportCNIS = false;


        break;
      case 'step5':

        this.isCompleteResultContagemTempo = false;
        this.dadosPassoaPasso = { origem: 'passo-a-passo', type: 'seguradoExistente' }

        break;
      case 'step6':

        this.isCalculoSelecionadoRMI = false;
        this.calculoSelecionadoRMI = {}
        this.unCheckedAll('.checkboxCalculosRMI');
        this.setStepValidate('step6', false);

        break;
    }
  }



  prevStep() {

    console.log(this.seguradoSelecionado);

    if (this.prevManualCNIS()) {

      const idx = this.steps.indexOf(this.activeStep);
      if (idx > 0) {
        this.activeStep = this.steps[idx - 1];
      }

      this.clearDataSelected(this.activeStep);

    }
  }

  nextStep() {

    // console.log(this.activeStep.valid);

    this.activeStep.submitted = true;

    if (!this.activeStep.valid) {
      return;
    }

    if (this.nextManualCNIS()) {

      this.activeStep.checked = true;
      if (this.steps.every((it) => it.valid && it.checked)) {

        //   this.onWizardComplete(this.model);

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

  }

  nextManualCNIS() {

    if (this.activeStep.key === 'step1' && this.dadosPassoaPasso.type !== 'seguradoExistente') {

      const keyStepUrl = 'step4';
      const step = this.steps.find((item) => keyStepUrl === item.key);
      this.activeStep = step;
      this.setStepValidateClear(true, step)

      return false;
    }

    return true;
  }


  prevManualCNIS() {

    if (this.activeStep.key === 'step4' && this.dadosPassoaPasso.type === 'seguradoExistente') {

      const keyStepUrl = 'step1';
      const step = this.steps.find((item) => keyStepUrl === item.key);
      this.activeStep = step;
      this.clearDataSelected(this.activeStep);

      return false;
    }

    return true;
  }


  onWizardComplete(data) {
    // console.log('Dados completo', data);

    // this.rgpsPlanejamentoService.save(data).then((model) => {

    //   this.hideChildModal();

    //   swal({
    //     position: 'top-end',
    //     type: 'success',
    //     title: 'Dados salvo com sucesso.',
    //     showConfirmButton: false,
    //     timer: 1000
    //   });
    //   location.reload();
    // });
  }



  private setStepValidateClear(status, stepA) {

    const index = this.steps.indexOf(stepA);
    this.steps.map((step, indiceA) => {

      if (indiceA >= index && !status) {
        step.valid = status;
        step.checked = status;
      } else if (indiceA < index && status) {
        step.valid = status;
        step.checked = status;
      }

    });

  }

  private setStepValidate(stepKey, status) {
    this.steps.map((step) => {

      if (stepKey === step.key) {
        step.valid = status;
      }

    });
  }


  /**
   * Set opção inicial do formulário.
   * @param ev
   * @param value
   */
  private setOptionEntradaDados(ev, value) {

    this.dadosPassoaPasso.type = '';
    this.isTypeEntradaDados = false;

    this.dadosPassoaPasso.type = value;
    this.isTypeEntradaDados = (this.dadosPassoaPasso.type !== '');

    if (this.dadosPassoaPasso.type === 'seguradoExistente') {

      this.setStepValidate('step1', (this.isExits(this.dadosPassoaPasso.type)));
      this.setStepValidate('step3', (this.isExits(this.dadosPassoaPasso.type)));
      // this.seguradoSelecionado = {};
      // this.calculoSelecionado = {};

    } else {

      this.setStepValidate('step3', (this.isExits(this.dadosPassoaPasso.type)));
      this.setStepValidate('step2', (this.isExits(this.dadosPassoaPasso.type)));
      this.setStepValidate('step1', (this.isExits(this.dadosPassoaPasso.type)));

      // this.seguradoSelecionado = {};
      // this.calculoSelecionado = {};

    }

  }


  /**
  * Selecionar somente umm checkBox De acordo com a Classe e Id
  * @param idRow id do elemeto unico
  * @param className classe de todos os checkbox
  */
  public unCheckedAll(className) {

    const listCheckBox = Array.from(document.querySelectorAll(className));
    listCheckBox.forEach((rowCheck) => {
      (<HTMLInputElement>rowCheck).checked = false;
    });

  }

  /**
   * Selecionar somente umm checkBox De acordo com a Classe e Id
   * @param idRow id do elemeto unico
   * @param className classe de todos os checkbox
   */
  public checkedUnique(idRow: string, className: string) {

    // const teste2 = <HTMLInputElement>document.getElementById(idRow);
    // const teste2 = <HTMLInputElement>document.querySelector('.checkboxSegurado:checked');
    const listCheckBox = Array.from(document.querySelectorAll(className));
    listCheckBox.forEach((rowCheck) => {

      // if ((<HTMLInputElement>rowCheck).value !== teste2.value) {
      if ((<HTMLInputElement>rowCheck).id !== idRow) {
        (<HTMLInputElement>rowCheck).checked = false;
      }

    });

  }

  /**
   * Selecionar somente umm checkBox De acordo com a Classe e Id
   * @param idRow id do elemeto unico
   * @param className classe de todos os checkbox
   */
  public checkedUniqueCount(idRow: string, className: string) {

    // const teste2 = <HTMLInputElement>document.getElementById(idRow);
    // const teste2 = <HTMLInputElement>document.querySelector('.checkboxSegurado:checked');
    let count = 0
    const listCheckBox = Array.from(document.querySelectorAll(className));
    listCheckBox.forEach((rowCheck) => {

      if ((<HTMLInputElement>rowCheck).id === idRow && (<HTMLInputElement>rowCheck).checked) {
        count++;
      }

    });

    return count;
  }


  // private setStepDefaultRetorno(stepNumber) {

  //   for (let i = 1; i <= stepNumber; i++) {

  //     let step = 'step' + i;
  //     this.setStepValidate(step, false);
  //   }

  // //  this.isUpdatingPlan = false;

  // }


  public setSeguradoSelecionado(dataSegurado) {

    let stepStatus = false;
    this.seguradoSelecionado = {};

    this.seguradoSelecionado = dataSegurado;
    this.checkedUnique(`${dataSegurado.id}-checkbox-segurado`, '.checkboxSegurado');
    stepStatus = (this.isExits(this.seguradoSelecionado) && isObject(this.seguradoSelecionado));
    // stepStatus = (this.isSeguradoSelecionado && dataSegurado.id === this.seguradoSelecionado.id) ? false : true;

    if (this.checkedUniqueCount(`${dataSegurado.id}-checkbox-segurado`, '.checkboxSegurado') === 0) {
      stepStatus = false;
      this.seguradoSelecionado = {};
    }

    this.setStepValidate('step2', stepStatus);
    this.isSeguradoSelecionado = stepStatus;

  }


  public setCalculoSelecionado(dataCalculo) {

    let stepStatus = false;
    this.calculoSelecionado = {};

    this.calculoSelecionado = dataCalculo;
    this.checkedUnique(`${dataCalculo.id}-checkbox-calculos`, '.checkboxCalculos');
    stepStatus = (this.isExits(this.calculoSelecionado) && isObject(this.calculoSelecionado));
    // // stepStatus = (this.isCalculoSelecionado && dataCalculo.id === this.calculoSelecionado.id) ? false : true;

    if (this.checkedUniqueCount(`${dataCalculo.id}-checkbox-calculos`, '.checkboxCalculos') === 0) {
      stepStatus = false;
      this.calculoSelecionado = {};
    }

    this.setStepValidate('step3', stepStatus);

  }


  public eventCalcularContagem(dataRSTImportForm) {



    if (this.isExits(dataRSTImportForm.seguradoId)
      && this.isExits(dataRSTImportForm.calculoId)) {

      this.idSeguradoSelecionado = dataRSTImportForm.seguradoId;
      this.idCalculoSelecionado = dataRSTImportForm.calculoId;
      this.setStepValidate('step4', true);
      this.nextStep();

    }

  }

  public eventStatusImport(dataStatus) {

    if (this.isExits(dataStatus) && this.isExits(dataStatus.status)) {
      this.isImportCNIS = dataStatus.status;
    }

  }


  public eventCalcularContagemResult(data) {

    if (this.isExits(data) && data.resultComplete) {

      this.exportResultContagemTempo = data;
      this.isCompleteResultContagemTempo = data.resultComplete;
      this.setStepValidate('step5', data.resultComplete);

      sessionStorage.setItem(
        'exportResultContagemTempo',
        JSON.stringify(this.exportResultContagemTempo));

    }

  }


  public setCalculoSelecionadoEventRMI(dataCalculoRMI) {

    let stepStatus = false;
    this.calculoSelecionadoRMI = {};

    this.calculoSelecionadoRMI = dataCalculoRMI;
    this.idCalculoSelecionadoRMI = dataCalculoRMI.id;

    this.checkedUnique(`${dataCalculoRMI.id}-checkbox-calculos-rmi`, '.checkboxCalculosRMI');
    stepStatus = (this.isExits(this.calculoSelecionadoRMI) && isObject(this.calculoSelecionadoRMI));
    // // stepStatus = (this.isCalculoSelecionado && dataCalculo.id === this.calculoSelecionado.id) ? false : true;

    if (this.checkedUniqueCount(`${dataCalculoRMI.id}-checkbox-calculos-rmi`, '.checkboxCalculosRMI') === 0) {
      stepStatus = false;
      this.calculoSelecionado = {};
    }

    this.setStepValidate('step6', stepStatus);

  }

  public eventPrevStepPassoaPasso(data) {

    this.setStepValidate(data.activeStep, false);
    const stepRetun = this.steps.filter((step) => data.activeStep === step.key);

    this.clearDataSelected(stepRetun[0])
    this.activeStep = stepRetun[0];

  }


  public setPlanejamentoSelecionado(dataplanejamento) {

    // let stepStatus = false;
    // this.planejamentoSelecionado = {};

    // this.planejamentoSelecionado = dataplanejamento;
    // this.checkedUnique(`${dataplanejamento.id}-checkbox-planejamento`, '.checkboxPlanejamento');
    // stepStatus = (this.isExits(this.planejamentoSelecionado) && isObject(this.planejamentoSelecionado));
    // // stepStatus = (this.isPlanejamentoSelecionado && dataplanejamento.id === this.planejamentoSelecionado.id) ? false : true;

    // if (this.checkedUniqueCount(`${dataplanejamento.id}-checkbox-planejamento`, '.checkboxPlanejamento') === 0) {
    //   stepStatus = false;
    //   this.planejamentoSelecionado = {};
    // }

    // this.isPlanejamentoSelecionado = stepStatus;
    // this.setStepValidate('step3', stepStatus);
    // sessionStorage.removeItem('exportPlanejamentoRSTRMI');
  }


  redirecionarSeguradoRMI() {

    // swal({
    //   position: 'top-end',
    //   type: 'success',
    //   title: 'Crie o segurado e execute um cálculo de RMI em que o segurado atenda os requisitos.',
    //   showConfirmButton: false,
    //   timer: 3000
    // });


    // // this.router.navigate(['/rgps/rgps-segurados']);
    // this.router.navigate(['/contagem-tempo/contagem-tempo-segurados']);
  }

  redirecionarSeguradoCalculosRMI() {

    // swal({
    //   position: 'top-end',
    //   type: 'success',
    //   title: 'Crie o segurado e execute um cálculo de RMI em que o segurado atenda os requisitos.',
    //   showConfirmButton: false,
    //   timer: 3000
    // });

    // //this.router.navigate([`/rgps/rgps-calculos/${this.seguradoSelecionado.id}`]);
    // this.router.navigate([`/contagem-tempo/contagem-tempo-calculos/${this.seguradoSelecionado.id}`]);

  }

  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '')
      ? true : false;
  }


}
