import { Component, OnInit } from '@angular/core';
import { isObject } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-importador-home',
  templateUrl: './importador-home.component.html',
  styleUrls: ['./importador-home.component.css']
})
export class ImportadorHomeComponent implements OnInit {

  private dadosPassoaPasso = { origem: 'passo-a-passo', type: '' };
  private isTypeEntradaDados = false;

  private seguradoSelecionado;
  private isSeguradoSelecionado = false;

  private calculoSelecionado;
  private isCalculoSelecionado = false;
  private isUpdatingCalculo = true;

  private iscontagemTempo = false;

  private planejamentoSelecionado;
  private isPlanejamentoSelecionado = false;
  private isUpdatingPlan = true;

  private isPaginaInicial = true;

  public idSeguradoSelecionado;
  public idCalculoSelecionado;

  public steps = [
    {
      key: 'step1',
      title: 'Dados do Cálculo',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step2',
      title: 'Contagem de Tempo de Contribuição e Relação de Salários de Contribuição',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step3',
      title: 'Relatório da Contagem do Tempo de Contribuição',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step4',
      title: 'Renda Mensal Inicial',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step5',
      title: 'Relatório',
      valid: false,
      checked: false,
      submitted: false,
    },
  ];

  public activeStep = this.steps[0];

  private stepUrl = null;
  private stepUrlSegurado = null;
  private stepUrlCalculo = null;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.setPaginaInicial();
  }


  private setPaginaInicial() {


    // sessionStorage.removeItem('inicialPassoaPasso');

    // console.log(sessionStorage.getItem('inicialPassoaPasso'));

    this.isPaginaInicial = (sessionStorage.getItem('inicialPassoaPasso') == ''
      || sessionStorage.getItem('inicialPassoaPasso') == undefined);
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

    //  console.log(steo);
    //  console.log(this.activeStep);
    //this.setStepDefaultRetorno(stepNumber)


    if (steo.key === 'step1' || steo.key === 'step2' || steo.key === 'step3') {
      this.isUpdatingPlan = false;
    }


  }

  private clearDataSelected(step) {

    // this.setStepValidate(step.key, false);
    this.setStepValidateClear(false);
    switch (step.key) {
      case 'step1':
        this.isTypeEntradaDados = false;
        this.dadosPassoaPasso = { origem: 'passo-a-passo', type: '' };

        this.isCalculoSelecionado = false;
        this.calculoSelecionado = {}
        this.unCheckedAll('.checkboxSegurados');

        this.isCalculoSelecionado = false;
        this.calculoSelecionado = {}
        this.unCheckedAll('.checkboxCalculos');

        break;
      case 'step2':

        // this.isPlanejamentoSelecionado = false;
        // this.planejamentoSelecionado = {}
        // this.unCheckedAll('.checkboxPlanejamento');

        break;
      case 'step3':
        // this.isPlanejamentoSelecionado = false;
        // this.planejamentoSelecionado = {}
        // this.unCheckedAll('.checkboxPlanejamento');

        break;
      // case 'step4':
      // this.setStepValidate('step4', false);
      //   break;
    }
  }



  prevStep() {
    let idx = this.steps.indexOf(this.activeStep);
    if (idx > 0) {
      this.activeStep = this.steps[idx - 1];
    }

    this.clearDataSelected(this.activeStep);
  }

  nextStep() {

    // console.log(this.activeStep.valid);

    this.activeStep.submitted = true;

    if (!this.activeStep.valid) {
      return;
    }

    this.activeStep.checked = true;
    if (this.steps.every((it) => it.valid && it.checked)) {

      //   this.onWizardComplete(this.model);

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



  private setStepValidateClear(status) {
    this.steps.map((step) => {
      step.valid = status;
      step.checked = status;
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

    if (this.dadosPassoaPasso.type !== 'seguradoExistente') {

      this.setStepValidate('step1', (this.dadosPassoaPasso.type !== ''));

    } else {

      this.seguradoSelecionado = {};
      this.calculoSelecionado = {};

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

  //   this.isUpdatingPlan = false;

  // }


  public setSeguradoSelecionado(dataSegurado) {

    let stepStatus = false;
    this.seguradoSelecionado = {};

    this.seguradoSelecionado = dataSegurado;
    this.checkedUnique(`${dataSegurado.id}-checkbox-segurado`, '.checkboxSegurado');
    stepStatus = (this.isExits(this.seguradoSelecionado) && isObject(this.seguradoSelecionado));
    //stepStatus = (this.isSeguradoSelecionado && dataSegurado.id === this.seguradoSelecionado.id) ? false : true;

    if (this.checkedUniqueCount(`${dataSegurado.id}-checkbox-segurado`, '.checkboxSegurado') === 0) {
      stepStatus = false;
      this.seguradoSelecionado = {};
    }

    this.setStepValidate('step1', stepStatus);
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

    // this.setStepValidate('step2', stepStatus);
    // this.isCalculoSelecionado = stepStatus;
    // this.isUpdatingPlan = !stepStatus;
  }


  public eventCalcularContagem(dataRSTImportForm){

    console.log(dataRSTImportForm);

    if (this.isExits(dataRSTImportForm.seguradoId)
      && this.isExits(dataRSTImportForm.calculoId)) {


        console.log(dataRSTImportForm);

        this.idSeguradoSelecionado = dataRSTImportForm.seguradoId;
        this.idCalculoSelecionado = dataRSTImportForm.calculoId;
        this.setStepValidate('step2', true);
        this.nextStep();

    }

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
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }


}
