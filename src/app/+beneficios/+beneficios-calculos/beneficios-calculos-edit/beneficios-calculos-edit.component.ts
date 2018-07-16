import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalculoAtrasadoService } from '../CalculoAtrasado.service';
import { ErrorService } from '../../../services/error.service';
import { CalculoAtrasado as CalculoModel } from '../CalculoAtrasado.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-beneficios-calculos-edit',
  templateUrl: './beneficios-calculos-edit.component.html',
  styleUrls: ['./beneficios-calculos-edit.component.css'],
  providers: [
    ErrorService
  ]
})
export class BeneficiosCalculosEditComponent implements OnInit, OnDestroy { 
  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...CalculoModel.form};
  public calculo;

  public isUpdating = false;
  constructor(
  	protected CalculoAtrasado: CalculoAtrasadoService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
  		this.isUpdating = true;
  	    this.CalculoAtrasado.find(this.route.snapshot.params['id_calculo'])
          .then(calculo => {
            this.calculo = calculo;
            this.form = this.calculo;
            this.isUpdating = false;
          });
  }


  submit(data) {
    	this.CalculoAtrasado
          .update(this.calculo)
          .then(model => {
            this.CalculoAtrasado.get()
                .then(() => this.router.navigate(['/beneficios/beneficios-calculos/'+this.route.snapshot.params['id']]));
          })
          .catch(errors => this.Errors.add(errors));
  }

  ngOnDestroy(){
  	this.resetForm();
    if (!this.Errors.empty()) {
      Object.keys(this.Errors.all()).forEach(field => {
        this.calculo[field] = this.calculo['_data'][field];
      });
      this.Errors.clear();
    }

  }

  resetForm() {
    this.form = {...CalculoModel.form};
  }

}
