import { Component, OnInit,Inject,Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { AuthResponse } from "../../services/Auth/AuthResponse.model";
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { CalculoRgpsService } from '../+rgps-calculos/CalculoRgps.service';
import { ErrorService } from '../../services/error.service';
import { environment } from '../../../environments/environment';
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { Auth } from "../../services/Auth/Auth.service";
import { DOCUMENT } from '@angular/platform-browser';
import { WINDOW } from '../+rgps-calculos/window.service';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { RgpsCalculosIndexComponent } from '../+rgps-calculos/rgps-calculos-index';

@Component({
  selector: 'app-rgps-planejamento-calculo',
  templateUrl: './rgps-planejamento-calculo.component.html',
  styleUrls: ['./rgps-planejamento-calculo.component.css'],
  providers: [
    ErrorService,
  ],
})
export class RgpsPlanejamentoCalculoComponent implements OnInit {

  @Input() list;
  @Input() datatableOptions;
  @Output() onSubmit = new EventEmitter();

  public form = { ...CalculoModel.form };
  public isUpdating = false;
  public calculosList = this.CalculoRgps.list;
  public checkboxIdList = [];
  public firstCalc = true;
  public idSegurado = '';
  public calculoTableOptions = {
    colReorder: true,
    data: this.calculosList,
    // order: [[6, 'desc']],
    columns: [
      { data: 'actions', width: '22rem', class: 'text-center', visible: false },
      { data: 'tipo_seguro' },
      { data: 'tipo_aposentadoria', visible: false },
      {
        data: (data, type, dataToSet) => {
         return this.getTempoDeContribuicao(data, type, dataToSet);
        }, visible: false
      },
      { data: 'data_pedido_beneficio' },
      {
        data: 'valor_beneficio',
        render: (valor) => {
         return this.formatMoeda(valor);
        }
      },
      {
        data: 'data_calculo',
        render: (data) => {
         return this.formatReceivedDate(data);
        }
      },
      {
        data: (data) => {
         return this.getCheckbox(data);
        }, visible: true
      },
    ],
    buttons: [
      {
        extend: 'colvis',
        text: 'Exibir e ocultar colunas',
      }
    ]
  };

  constructor(
    protected Segurado: SeguradoService,
    protected CalculoRgps: CalculoRgpsService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,

    private Auth: Auth
  ) { }

    //Planejamento
    public userCheck = false;

  ngOnInit() {
    this.getInfoCalculos();
  }

  private getInfoCalculos() {
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.isUpdating = true;

    this.CalculoRgps.getWithParameters(['id_segurado', this.idSegurado])
      .then((calculos) => {

        this.updateDatatable();
        this.isUpdating = false;

      });
  }

  updateDatatable() {
    this.calculoTableOptions = {
      ...this.calculoTableOptions,
      data: this.calculosList,
    }
  }

  getTempoDeContribuicao(data, type, dataToSet) {
    let str = '';

    if (data.contribuicao_primaria_98 !== 'undefined-undefined-undefined' && data.contribuicao_primaria_98 !== '--') {
      str = str + data.contribuicao_primaria_98.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_primaria_99 !== 'undefined-undefined-undefined' && data.contribuicao_primaria_99 !== '--') {
      str = str + data.contribuicao_primaria_99.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_primaria_atual !== 'undefined-undefined-undefined' && data.contribuicao_primaria_atual !== '--') {
      str = str + data.contribuicao_primaria_atual.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_primaria_19 !== 'undefined-undefined-undefined' && data.contribuicao_primaria_19 !== '--') {
      str = str + data.contribuicao_primaria_19.replace(/-/g, '/') + '<br>';
    }

    return str;

  }

  formatMoeda(valor) {
    return 'R$&nbsp;' + valor.toLocaleString('pt-BR');
  }

  formatReceivedDate(inputDate) {
    var date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return ('0' + (date.getDate())).slice(-2) + '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        date.getFullYear();
    }
    return '';
  }

  getCheckbox(data) {
    if (!this.checkboxIdList.includes(`${data.id}-checkbox`)) {
      this.checkboxIdList.push(`${data.id}-checkbox`);
    }

    if (this.firstCalc) {
      this.firstCalc = false;
      return `<div class="checkbox"><label><input type="checkbox" id='${data.id}-checkbox' class="checkbox {{styleTheme}}" checked><span> </span></label></div>`;
    }
    return `<div class="checkbox"><label><input type="checkbox" id='${data.id}-checkbox' class="checkbox {{styleTheme}}"><span> </span></label></div>`;
  }

  verificaPlano(){
    const basico = window.localStorage.getItem('product');
    if(basico === '9dwtctrm'){
      this.userCheck = false;
      swal('Ferramenta disponível somente para clientes Premium.',' ','error' ).then(function()
      {
        swal("Assine já!"," ", "success").then(function(){
        window.open("http://ieprevpremium.com.br/");
      })});
    }else{
      this.userCheck = true;
    }
    return this.userCheck;       
  }

  compararCalculos() {
    const idList = [];
    for (const checkboxId of this.checkboxIdList) {
      if ((<HTMLInputElement>document.getElementById(checkboxId)).checked) {
        idList.push(checkboxId.split('-')[0]);
      }
    }

    if (idList.length !== 2) {
      swal('Só é possível comparar 2 cálculos.', '', 'error');
    } else {
      window.location.href = '/#/rgps/rgps-elements/' +
        this.route.snapshot.params['id_segurado'] + '/' + idList[0] + '/' + idList[1];

    }
  }

}