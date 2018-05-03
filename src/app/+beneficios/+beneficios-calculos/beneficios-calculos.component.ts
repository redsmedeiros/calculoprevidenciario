import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../+beneficios-segurados/Segurado.service';
import { Segurado as SeguradoModel } from '../+beneficios-segurados/Segurado.model';
import { CalculoAtrasadoService } from '../CalculoAtrasado.service';


@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './beneficios-calculos.component.html',
})
export class BeneficiosCalculosComponent implements OnInit {

  public styleTheme = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public isUpdating = false;

  public segurado:any = {};

  public calculosList = this.CalculoAtrasado.list;
  public calculoTableOptions = {
    colReorder: true,
    data: this.calculosList,
    columns: [
      {data: 'actions'},
      {data: 'data_calculo'},
      {data: 'data_citacao_reu'},
      {data: 'data_acao_judicial'},
      {data: 'data_pedido_beneficio'},
      {data: 'valor_beneficio_concedido'},
      {data: 'data_pedido_beneficio_esperado'},
      {data: 'valor_beneficio_esperado'},
    ] };

  constructor(protected Segurado: SeguradoService,
	          protected router: Router,
              private route: ActivatedRoute,
              private CalculoAtrasado: CalculoAtrasadoService) {}

  ngOnInit() {
    this.isUpdating = true;
    // retrive user info
    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
    });

    this.CalculoAtrasado.get()
        .then(() => {
           this.updateDatatable();
           this.isUpdating = false;
        })
  }

  updateDatatable() {
    this.calculoTableOptions = {
      ...this.calculoTableOptions,
      data: [...this.calculosList],
    }
  }


  createNewCalculo() {
  	window.location.href='/#/beneficios/novo-calculo/A/'+ + this.route.snapshot.params['id'];
  }

  createNewCalculoJudicial() {
    window.location.href='/#/beneficios/novo-calculo/AJ/'+this.route.snapshot.params['id'];
  }

  createNewCalculoIndices() {
    window.location.href='/#/beneficios/novo-calculo/AI/'+this.route.snapshot.params['id'];
  }

}
