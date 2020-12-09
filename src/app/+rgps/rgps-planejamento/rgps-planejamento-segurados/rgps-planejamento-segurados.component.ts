
import { Component, OnInit } from '@angular/core';
import { isObject } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-rgps-planejamento-segurados',
  templateUrl: './rgps-planejamento-segurados.component.html',
  styleUrls: ['./rgps-planejamento-segurados.component.css']
})
export class RgpsPlanejamentoSeguradosComponent implements OnInit {

  private seguradoSelecionado;
  private isSeguradoSelecionado = false;

  private calculoSelecionado;
  private isCalculoSelecionado = false;
  private isUpdatingCalculo = true;

  private planejamentoSelecionado;
  private isPlanejamentoSelecionado = false;
  private isUpdatingPlan = true;

  private isPaginaInicial = true;

  public steps = [
    {
      key: 'step1',
      title: 'Selecione o Segurado',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step2',
      title: 'Selecione o Cálculo',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step3',
      title: 'Benefícios Futuros',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step4',
      title: 'Executar o cálculo e planejamento',
      valid: true,
      checked: false,
      submitted: false,
    },
  ];

  public activeStep = this.steps[0];



  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    this.isSeguradoSelecionado = false;
    this.isPaginaInicial = true;

  }

  setIsPaginaInicial() {

    this.isPaginaInicial = false;

  }

  setActiveStep(steo) {

    this.activeStep = steo;

  }

  private clearDataSelected(step) {

    this.setStepValidate(step.key, false);
    switch (step.key) {
      case 'step1':
        this.unCheckedAll('.checkboxSegurado')
        break;
      case 'step2':
        this.unCheckedAll('.checkboxCalculos')
        break;
      case 'step3':
        this.unCheckedAll('.checkboxPlanejamento')
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
    console.log('Dados completo', data);

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


  private setStepValidate(stepKey, status) {
    this.steps.map((step) => {

      if (stepKey === step.key) {
        step.valid = status;
      }

    });
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

  public setSeguradoSelecionado(dataSegurado) {

    this.seguradoSelecionado = dataSegurado;

    this.checkedUnique(`${dataSegurado.id}-checkbox-segurado`, '.checkboxSegurado');
    const stepStatus = (this.isExits(this.seguradoSelecionado) && isObject(this.seguradoSelecionado));

    // console.log(stepStatus);

    this.setStepValidate('step1', stepStatus);
    this.isSeguradoSelecionado = stepStatus;

  }


  public setCalculoSelecionado(dataCalculo) {

    this.calculoSelecionado = dataCalculo;

    this.checkedUnique(`${dataCalculo.id}-checkbox-calculos`, '.checkboxCalculos');
    const stepStatus = (this.isExits(this.calculoSelecionado) && isObject(this.calculoSelecionado));

    this.setStepValidate('step2', stepStatus);
    this.isCalculoSelecionado = stepStatus;
    this.isUpdatingPlan = false;
  }


  public setPlanejamentoSelecionado(dataplanejamento) {

    this.planejamentoSelecionado = dataplanejamento;

    this.checkedUnique(`${dataplanejamento.id}-checkbox-planejamento`, '.checkboxPlanejamento');
    const stepStatus = (this.isExits(this.planejamentoSelecionado) && isObject(this.planejamentoSelecionado));

    this.isPlanejamentoSelecionado = stepStatus;
    this.setStepValidate('step3', stepStatus);
    sessionStorage.removeItem('exportPlanejamentoRSTRMI');
  }


  redirecionarSeguradoRMI() {

    swal({
      position: 'top-end',
      type: 'success',
      title: 'Crie o segurado e execute um cálculo de RMI em que o segurado atenda os requisitos.',
      showConfirmButton: false,
      timer: 3000
    });


    this.router.navigate(['/rgps/rgps-segurados']);
  }

  redirecionarSeguradoCalculosRMI() {

    swal({
      position: 'top-end',
      type: 'success',
      title: 'Crie o segurado e execute um cálculo de RMI em que o segurado atenda os requisitos.',
      showConfirmButton: false,
      timer: 3000
    });

    this.router.navigate([`/rgps/rgps-calculos/${this.seguradoSelecionado.id}`]);

  }

  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }

}
