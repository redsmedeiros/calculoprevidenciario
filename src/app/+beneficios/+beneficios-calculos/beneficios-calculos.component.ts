import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../+beneficios-segurados/Segurado.service';
import { Segurado as SeguradoModel } from '../+beneficios-segurados/Segurado.model';
import { CalculoAtrasadoService } from './CalculoAtrasado.service';
import { environment } from '../../../environments/environment';
import { Auth } from "../../services/Auth/Auth.service";
import { AuthResponse } from "../../services/Auth/AuthResponse.model";

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

  public idSegurado = '';

  public calculoTableOptions = {
    colReorder: true,
    data: this.calculosList,
    columns: [
      {data: 'actions'},
      {data: 'data_calculo',
       render: (data) => {
          return this.formatReceivedDateTime(data);
       }},
      {data: 'data_citacao_reu',
       render: (data) => {
          return this.formatReceivedDate(data);
       }},
      {data: 'data_acao_judicial',
             render: (data) => {
          return this.formatReceivedDate(data);
       }},
      {data: 'data_pedido_beneficio',
             render: (data) => {
          return this.formatReceivedDate(data);
       }},
      {data: 'valor_beneficio_concedido',
       render: (data) => {
          return this.formatMoneyValue(data);
       }},
      {data: 'data_pedido_beneficio_esperado',
             render: (data) => {
          return this.formatReceivedDate(data);
       }},
      {data: 'valor_beneficio_esperado',
        render: (data) => {
          return this.formatMoneyValue(data);
       }},
    ] };

  constructor(protected Segurado: SeguradoService,
	          protected router: Router,
              private route: ActivatedRoute,
              private CalculoAtrasado: CalculoAtrasadoService,
              private Auth: Auth) {}

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id'];

    this.isUpdating = true;
    // retrive user info
    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
    });


    let userId = localStorage.getItem('user_id') || this.route.snapshot.queryParams['user_id'];
    let token = localStorage.getItem('user_token') || this.route.snapshot.queryParams['user_token'];

    this.Auth.authenticate(userId, token).then((response:AuthResponse) => {
      if(response.status){
        localStorage.setItem('user_id', userId);
        localStorage.setItem('user_token', token);

        this.CalculoAtrasado.get()
        .then(() => {
           this.updateDatatable();
           this.isUpdating = false;
        })
      }else{
        //redirecionar para pagina de login
        swal('Erro', 'Você não esta logado ou não tem permissão para acessar esta pagina', 'error').then(()=> {
          window.location.href = environment.loginPageUrl;
        });
      }
    }).catch(err => {
      if(err.response.status == 401){
        //redirecionar para pagina de login
        swal('Erro', 'É necessário estar logado para acessar esta página.', 'error').then(()=> {
          window.location.href = environment.loginPageUrl;
        });
      }
    });
  }

  updateDatatable() {
    this.calculosList = this.calculosList.filter(this.isSegurado, this);
    this.calculoTableOptions = {
      ...this.calculoTableOptions,
      data: [...this.calculosList],
    }
  }

  formatReceivedDate(inputDate) {
      var date = new Date(inputDate);
      date.setTime(date.getTime() + (5*60*60*1000))
      if (!isNaN(date.getTime())) {
          // Months use 0 index.
          return  ('0' + (date.getDate())).slice(-2)+'/'+
                  ('0' + (date.getMonth()+1)).slice(-2)+'/'+
                         date.getFullYear();
      }
      return '';
  }

  formatReceivedDateTime(inputDateTime) {
    return inputDateTime.substring(11, 19) + ' ' + 
           this.formatReceivedDate(inputDateTime.substring(0, 10));
  }

  formatMoneyValue(inputValue) {
    if (inputValue !== null)
      return inputValue.toFixed(2).replace('.',',');
    return '-';
  }

  editSegurado() {
    window.location.href='/#/beneficios/beneficios-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

  createNewCalculo() {
  	window.location.href='/#/beneficios/beneficios-calculos/A/'+ this.route.snapshot.params['id'];
  }

  createNewCalculoJudicial() {
    window.location.href='/#/beneficios/beneficios-calculos/AJ/'+this.route.snapshot.params['id'];
  }

  createNewCalculoIndices() {
    window.location.href='/#/beneficios/beneficios-calculos/AI/'+this.route.snapshot.params['id'];
  }

  isSegurado(element, index, array){
    return element['id_segurado'] == this.idSegurado;
  }
}
