import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../../services/error.service';
import { SeguradoService } from '../../+beneficios-segurados/Segurado.service';
import { CalculoAtrasado as CalculoModel } from '../CalculoAtrasado.model';
import { CalculoAtrasadoService } from '../CalculoAtrasado.service';

@Component({
  selector: 'app-beneficios-calculos-create',
  templateUrl: './beneficios-calculos-create.component.html',
  styleUrls: ['./beneficios-calculos-create.component.css'],
  providers: [
    ErrorService
  ]
})
export class BeneficiosCalculosCreateComponent implements OnInit, OnDestroy {
  
  public segurado:any ={};
  public calculoType;
  public form = {...CalculoModel.form};

  @Output() onSubmit = new EventEmitter();

  constructor(
    protected Calculo: CalculoAtrasadoService,
    protected Errors: ErrorService,
  	protected router: Router,
	  private route: ActivatedRoute,
	  protected Segurado: SeguradoService
	) { }

  ngOnInit() {
  	this.calculoType = this.route.snapshot.params['type'];

  	this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
    });
  }

  submit(data) {
    this.Calculo
          .save(data)
          .then(model => {
            this.resetForm();
            this.onSubmit.emit();
            window.location.href='#/beneficios/beneficios-calculos/'+this.route.snapshot.params['id'];
          })
          .catch(errors => this.Errors.add(errors));
  }

  editSegurado() {
    window.location.href='/#/beneficios/beneficios-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

  ngOnDestroy() {
    this.resetForm();
  }

  resetForm() {
    this.form = {...CalculoModel.form};
  }


}
