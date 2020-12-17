
import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from 'app/services/shared/animations/fade-in-top.decorator';
import { environment } from '../../../../../environments/environment';
import { ErrorService } from 'app/services/error.service';
// import { SeguradoService } from 'app/+rgps/+rgps-segurados/SeguradoRgps.service';
import { SeguradoPlanService } from './../SeguradoPlan.service';
import { SeguradoPlan as SeguradoModelPlan } from '../SeguradoPlan.model';
import { Auth } from './../../../../services/Auth/Auth.service';
import { AuthResponse } from "app/services/services/Auth/AuthResponse.model";
import { DOCUMENT } from '@angular/platform-browser';
//import { WINDOW } from '../../../+rgps-calculos/window.service';

@Component({
  selector: 'app-rgps-planejamento-segurados-list',
  templateUrl: './rgps-planejamento-segurados-list.component.html',
  styleUrls: ['./rgps-planejamento-segurados-list.component.css'],
  providers: [
    ErrorService,
  ],
})
export class RgpsPlanejamentoSeguradosListComponent implements OnInit {


  public styleTheme = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];
  public isUpdatingListSeg = true;
  public userId;
  public list = this.SeguradoService.list;
  public seguradoSelecionado;
  public isSeguradoSelecionado = false;

  public form = {...SeguradoModelPlan.form};
  public segurado;
  public isEditForm = false;

  @Output() seguradoSelecionadoEvent = new EventEmitter();

  public datatableOptions = {
    colReorder: true,
    data: this.list,
    order: [[0, 'desc']],
    columns: [
      { data: 'id', visible: false },
      { data: 'nome' },
      {
        data: 'id_documento',
        render: (data, type, row) => {
          return this.getDocumentType(row.id_documento) + ' ' + row.documento;
        }
      },
      { data: 'data_nascimento' },
      { data: 'data_filiacao' },
      {
        data: 'selecionarSergurado',
        render: (data, type, row) => {
          return this.getBtnSelecionarSegurado(row.id);
        }, width: '6rem', class: 'p-1'
      },

      // { data: 'actions', width: '12rem', class: 'p-1' },
    ]
  };


  constructor(
    protected SeguradoService: SeguradoPlanService,
    protected Errors: ErrorService,
    private Auth: Auth,
    protected router: Router,
    private route: ActivatedRoute,
    // @Inject(DOCUMENT) private document: Document,
    // @Inject(WINDOW) private window: Window,
  ) { }

  ngOnInit() {

    this.verificacoesAcesso();
    this.getUserSegurados();
    
  }


  verificacoesAcesso(){

    this.userId = localStorage.getItem('user_id') || this.route.snapshot.queryParams['user_id'];

    if (this.userId) {
      localStorage.setItem('user_id', this.userId);
    } else {
      window.location.href = environment.loginPageUrl;
    }

  }


  getDocumentType(id_documento) {
    switch (id_documento) {
      case 1:
        return 'PIS';
      case 2:
        return 'PASEP';
      case 3:
        return 'CPF';
      case 4:
        return 'NIT';
      case 5:
        return 'RG';
      default:
        return ''
    }
  }


  private getUserSegurados() {

    this.isUpdatingListSeg = true;
    this.SeguradoService.getByUserId(this.userId)
      .then(() => {
        localStorage.setItem('user_id', this.userId);
        this.updateDatatable();
      });
  }

  updateDatatable() {
    this.datatableOptions = {
      ...this.datatableOptions,
      data: this.list,
    }
    this.isUpdatingListSeg = false;
  }



  selectSegurado(idSelecionado) {

    this.seguradoSelecionado = {};
    this.seguradoSelecionado = this.list.find(row => row.id === Number(idSelecionado));

    // console.log(idSelecionado);
    // console.log(this.seguradoSelecionado);

    if (this.isExits(this.seguradoSelecionado)) {

      this.seguradoSelecionadoEvent.emit(this.seguradoSelecionado);

    } else {

    }

  }


  private setSeguradoSelecionado() {

  }



  submit(type, data) {


    if (type === 'create') {
      this.create(data);
    } else {
      this.update(data);
    }
  }



  create(data) {
    this.SeguradoService
      .save(data)
      .then((model: SeguradoModelPlan) => {
        // this.resetForm();
        // this.onSubmit.emit();
        //window.location.href='#/rgps/rgps-calculos/'+ model.id;
      })
      .catch(errors => this.Errors.add(errors));
  }

  update(data) {
    this.SeguradoService
      .update(data)
      .then(model => {
        // this.onSubmit.emit();
        // window.location.href='#/rgps/rgps-segurados/'
        // this.Segurado.get()
        //     .then(() => this.router.navigate(['/rgps/rgps-segurados']));
      })
      .catch(errors => this.Errors.add(errors));
  }






  private getRow(dataRow) {

    if (this.isExits(dataRow)) {
      this.seguradoSelecionado = dataRow;
      this.seguradoSelecionadoEvent.emit(this.seguradoSelecionado);
      this.isSeguradoSelecionado = true;
    }
  }




  public getBtnSelecionarSegurado(id) {

    // return `<button  type="button" class="btn btn-xs btn-info select-btn">
    //           Selecionar <i class="fa fa-arrow-circle-right"></i>
    //       </button>`;

    //   <span class="onoffswitch">
    //   <input  class="onoffswitch-checkbox checked-row-one" name="empresaAtiva" type="checkbox">
    //   <label class="onoffswitch-label" for="st3">
    //     <span class="onoffswitch-inner" data-swchoff-text="NÃO" data-swchon-text="SIM"></span>
    //     <span class="onoffswitch-switch"></span>
    //   </label>
    // </span>

    return `<div class="checkbox "><label>
                 <input type="checkbox" id='${id}-checkbox-segurado'
                 class="checked-row-one checkbox {{styleTheme}} checkboxSegurado"
                 value="${id}"><span> </span></label>
          </div>
          `;
  }

  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }



}
