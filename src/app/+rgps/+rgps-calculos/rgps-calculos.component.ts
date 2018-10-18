import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { CalculoRgps as CalculoModel } from './CalculoRgps.model';
import { CalculoRgpsService } from './CalculoRgps.service';
import { ErrorService } from '../../services/error.service';
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-calculos.component.html',
  styleUrls: ['./rgps-calculos-component.css'],
  providers: [
    ErrorService,
  ],
})
export class RgpsCalculosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...CalculoModel.form};

  public calculosList = this.CalculoRgps.list;

  public isUpdating = false;

  public idSegurado = '';

  public segurado:any = {};

  public checkboxIdList = [];

  public firstCalc = true;

  public calculoTableOptions = {
    colReorder: true,
    data: this.calculosList,
    columns: [
      {data: 'actions'},
      {data: 'tipo_seguro'},
      {data: 'tipo_aposentadoria'},
      {data: (data, type, dataToSet) => {
        return this.getTempoDeContribuicao(data,type, dataToSet);
      }},
      {data: 'data_pedido_beneficio'},
      {data: 'valor_beneficio'},
      {data: 'data_calculo',
       render: (data) => {
          return this.formatReceivedDate(data);
       }},
      {data: (data) => {
        return this.getCheckbox(data);
      }},
    ] };

  constructor(
    protected Segurado: SeguradoService,    
  	protected CalculoRgps: CalculoRgpsService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
  ) {}

  getTempoDeContribuicao(data, type, dataToSet) {
    let str = '';
    if (data.contribuicao_primaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_98.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_primaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_99.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_primaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_atual.replace(/-/g,'/') +'<br>';
    }

    return str;

  }

  getCheckbox(data) {
    if(!this.checkboxIdList.includes(`${data.id}-checkbox`)){
      this.checkboxIdList.push(`${data.id}-checkbox`);
    }

    if(this.firstCalc){
      this.firstCalc = false;
      return `<div class="checkbox"><label><input type="checkbox" id='${data.id}-checkbox' class="checkbox {{styleTheme}}" checked><span> </span></label></div>`;
    }
    return `<div class="checkbox"><label><input type="checkbox" id='${data.id}-checkbox' class="checkbox {{styleTheme}}"><span> </span></label></div>`;
  }

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id'];
    this.isUpdating = true;
    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
    });

    this.CalculoRgps.getWithPair('id_segurado', this.idSegurado)
        .then(() => {
        this.updateDatatable();
        this.isUpdating = false;
        })
  }

  updateDatatable() {
    this.calculoTableOptions = {
      ...this.calculoTableOptions,
      data: this.calculosList,
    }
  }

  onCreate(e) {
      this.isUpdating = true;
      this.CalculoRgps.getWithPair('id_segurado', this.idSegurado)
        .then(() => {
           this.isUpdating = false;
        })
  }


  editSegurado() {
    window.location.href='/#/rgps/rgps-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }
  voltar(){
    window.location.href='/#/rgps/rgps-segurados/'
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

  valoresContribuicao(){
    let idList = this.getSelectedCalcs();
    if(idList.length > 3){
      swal('Erro', 'Selecione até 3 cálculos', 'error');
    }else if(idList.length == 0){
      swal('Erro', 'Selecione pelo menos 1 cálculo', 'error');
    }else{
      let stringArr = idList.join(',');
      window.location.href='/#/rgps/rgps-valores-contribuidos/'+ 
                            this.route.snapshot.params['id']+'/'+stringArr;
    }
  }

  realizarCalculos(){
    let idList = this.getSelectedCalcs();
    if(idList.length > 3){
      swal('Erro', 'Selecione até 3 cálculos', 'error');
    }else if(idList.length == 0){
      swal('Erro', 'Selecione pelo menos 1 cálculo', 'error');
    }else{
      let stringArr = idList.join(',');
      window.location.href='/#/rgps/rgps-resultados/'+ 
                            this.route.snapshot.params['id']+'/'+stringArr;
    }
  }

  getSelectedCalcs(){
    let idList = [];
    for(let checkboxId of this.checkboxIdList){
      if((<HTMLInputElement>document.getElementById(checkboxId)).checked){
        idList.push(checkboxId.split('-')[0]);
      }
    }
    return idList;
  }

  isSegurado(element, index, array){
    return element['id_segurado'] == this.idSegurado;
  }
}
