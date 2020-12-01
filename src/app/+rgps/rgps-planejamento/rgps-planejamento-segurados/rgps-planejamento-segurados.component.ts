import { Component, OnInit } from '@angular/core';
import { isObject } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

import { DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-rgps-planejamento-segurados',
  templateUrl: './rgps-planejamento-segurados.component.html',
  styleUrls: ['./rgps-planejamento-segurados.component.css']
})
export class RgpsPlanejamentoSeguradosComponent implements OnInit {

  private seguradoSelecionado;
  private isSeguradoSelecionado = false;


  private calculoSelecionado;
  private isCalculoSelecionado;
  private isUpdatingCalculo = true;

  private planejamentoSelecionado;
  private isPlanejamentoSelecionado;
  private isUpdatingPlan = true;

  private isPaginaInicial = true;


  private url;

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
      valid: true,
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

    console.log(stepStatus);

    this.setStepValidate('step1', stepStatus);
    this.isSeguradoSelecionado = stepStatus;

  }


  public setCalculoSelecionado(dataCalculo) {

    console.log('teste');
    console.log(dataCalculo);

    this.calculoSelecionado = dataCalculo;

    const stepStatus = (this.isExits(this.calculoSelecionado) && isObject(this.calculoSelecionado));

    console.log(stepStatus);

    this.setStepValidate('step2', stepStatus);
    this.isCalculoSelecionado = true;
    this.isUpdatingPlan = false;

    this.getURL();
  }


  public setPlanejamentoSelecionado(dataplanejamento) {

    this.planejamentoSelecionado = dataplanejamento;

    const stepStatus = (this.isExits(this.planejamentoSelecionado) && isObject(this.planejamentoSelecionado));

    console.log(stepStatus);

    this.setStepValidate('step3', stepStatus);

    

  }

  getURL(){

    let value = `http://localhost:4200/#/rgps/rgps-resultados/${this.seguradoSelecionado.id}/${this.calculoSelecionado.id}/plan/4`;

    console.log(value);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(value);


   
    console.log(this.url);

    return this.url;
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
