import { Component, OnInit } from '@angular/core';
import { isObject } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-rgps-planejamento-segurados',
  templateUrl: './rgps-planejamento-segurados.component.html',
  styleUrls: ['./rgps-planejamento-segurados.component.css']
})
export class RgpsPlanejamentoSeguradosComponent implements OnInit {

  private seguradoSelecionado;
  private isSeguradoSelecionado;

  public steps = [
    {
      key: 'step1',
      title: 'Bem vindo ao Planejamento Previdenciário',
      valid: true,
      checked: false,
      submitted: false,
    },
    {
      key: 'step2',
      title: 'Selecione o Segurado',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step3',
      title: 'Selecione o Cálculo do segurado',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step4',
      title: 'Executar o cálculo e planejamento',
      valid: false,
      checked: false,
      submitted: false,
    },
  ];

  public activeStep = this.steps[0];



  constructor(
    protected router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

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

  public setSeguradoSelecionado(dataSegurado) {

    this.seguradoSelecionado = dataSegurado;
    const stepStatus = (this.isExits(this.seguradoSelecionado) && isObject(this.seguradoSelecionado));
    this.setStepValidate('step2', stepStatus);
    this.isSeguradoSelecionado = stepStatus;

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

  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }

}
