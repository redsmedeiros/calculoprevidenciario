import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../../services/error.service';
import { SeguradoService } from '../../+beneficios-segurados/Segurado.service';
import { CalculoAtrasado as CalculoModel } from '../CalculoAtrasado.model';
import { CalculoAtrasadoService } from '../CalculoAtrasado.service';
import swal from 'sweetalert2';

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
  private mostrarTabelaTaxaSelic = false;

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
          .then((data: CalculoModel) => {
            this.resetForm();
            this.onSubmit.emit();
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Cálculo salvo com sucesso',
              showConfirmButton: false,
              timer: 2000
            }).then((result) => {
                if(result)
                  {
                    window.location.href = '#/beneficios/beneficios-resultados/' + data.id_segurado + '/' + data.id;
                   }
            });

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
