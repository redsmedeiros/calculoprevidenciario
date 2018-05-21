import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { CalculoRgps as CalculoModel } from './CalculoRgps.model';
import { CalculoRgpsService } from './CalculoRgps.service';
import { ErrorService } from '../../services/error.service';

import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-calculos.component.html',
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
      {data: () => {
        return this.getCheckbox();
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

  getCheckbox() {
    return   '<div class="checkbox"><label><input type="checkbox"  class="checkbox {{styleTheme}}"><span> </span></label></div>';
  }

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id'];
    this.isUpdating = true;
    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
    });

    this.CalculoRgps.get()
        .then(() => {
        this.updateDatatable();
        this.isUpdating = false;
        })
  }

  updateDatatable() {
    this.calculosList = this.calculosList.filter(this.isSegurado, this);
    this.calculoTableOptions = {
      ...this.calculoTableOptions,
      data: this.calculosList,
    }
  }

  editSegurado() {
    window.location.href='/#/rgps/rgps-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

  formatReceivedDate(inputDate) {
      var date = new Date(inputDate);
      if (!isNaN(date.getTime())) {
          // Months use 0 index.
          return  ('0' + (date.getDate() +1)).slice(-2)+'/'+
                  ('0' + (date.getMonth()+1)).slice(-2)+'/'+
                         date.getFullYear();
      }
      return '';
  }


  isSegurado(element, index, array){
    return element['id_segurado'] == this.idSegurado;
  }
}
