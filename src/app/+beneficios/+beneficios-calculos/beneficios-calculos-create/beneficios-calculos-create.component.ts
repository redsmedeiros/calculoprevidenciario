import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoService } from '../../+beneficios-segurados/Segurado.service';
import { CalculoAtrasado as CalculoModel } from '../CalculoAtrasado.model';

@Component({
  selector: 'app-beneficios-calculos-create',
  templateUrl: './beneficios-calculos-create.component.html',
  styleUrls: ['./beneficios-calculos-create.component.css']
})
export class BeneficiosCalculosCreateComponent implements OnInit {
  
  public segurado:any ={};
  public calculoType;
  public form = {...CalculoModel.form};

  @Output() onSubmit = new EventEmitter();

  constructor(
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

  editSegurado() {
    window.location.href='/#/beneficios/beneficios-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

}
