import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { CalculoRgps as CalculoModel } from './CalculoRgps.model';
import { CalculoRgpsService } from './CalculoRgps.service';
import { ErrorService } from '../../services/error.service';
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { DOCUMENT } from '@angular/platform-browser';
import { WINDOW } from "./window.service";
import { environment } from '../../../environments/environment';
import { Auth } from "../../services/Auth/Auth.service";
import { AuthResponse } from "../../services/Auth/AuthResponse.model";
import swal from 'sweetalert2';
import * as moment from 'moment';

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

  public form = { ...CalculoModel.form };

  public calculosList = this.CalculoRgps.list;

  public isUpdating = false;

  public idSegurado = '';

  public segurado: any = {};

  private navIsFixed = false;

  public checkboxIdList = [];

  public firstCalc = true;

  private caixaOpcoes;

  public calculoTableOptions = {
    colReorder: true,
    data: this.calculosList,
    // order: [[6, 'desc']],
    columns: [
      { data: 'actions', width: '22rem', class: 'text-center' },
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
      // {data: (data) => {
      //   return this.getCheckbox(data);
      // }, visible: false},
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

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id'];
    this.isUpdating = true;

    this.Segurado.find(this.route.snapshot.params['id'])
      .then(segurado => {
        this.segurado = segurado;
        if (localStorage.getItem('user_id') != this.segurado.user_id) {
          //redirecionar para pagina de segurados
          swal({
            type: 'error',
            title: 'Erro',
            text: 'Você não tem permissão para acessar esta página!',
            allowOutsideClick: false
          }).then(() => {
            this.voltar();
          });
        } else {
          this.CalculoRgps.getWithParameters(['id_segurado', this.idSegurado])
            .then((calculos) => {

              this.updateDatatable();
              this.isUpdating = false;

            });
        }
      });

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

  updateDatatable() {
    this.calculoTableOptions = {
      ...this.calculoTableOptions,
      data: this.calculosList,
    }
  }

  onCreate(e) {
    this.isUpdating = true;
    this.CalculoRgps.getWithParameters(['id_segurado', this.idSegurado])
      .then(() => {
        this.isUpdating = false;
      })
  }


  editSegurado() {
    window.location.href = '/#/rgps/rgps-segurados/' +
      this.route.snapshot.params['id'] + '/editar';
  }
  voltar() {
    window.location.href = '/#/rgps/rgps-segurados/'
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

  valoresContribuicao() {
    let idList = this.getSelectedCalcs();
    if (idList.length > 3) {
      swal('Erro', 'Selecione até 3 cálculos', 'error');
    } else if (idList.length == 0) {
      swal('Erro', 'Selecione pelo menos 1 cálculo', 'error');
    } else {
      let stringArr = idList.join(',');
      window.location.href = '/#/rgps/rgps-valores-contribuidos/' +
        this.route.snapshot.params['id'] + '/' + stringArr;
    }
  }

  realizarCalculos(pbc_completo = false) {
    let idList = this.getSelectedCalcs();
    let pbc = (pbc_completo) ? '/pbc' : ''

    if (idList.length > 3) {

      swal('Erro', 'Selecione até 3 cálculos', 'error');

    } else if (idList.length == 0) {

      swal('Erro', 'Selecione pelo menos 1 cálculo', 'error');

    } else if ((this.checkDibPBCCompleto(idList) && pbc_completo)) {

      swal('Erro', 'A data de início do benefício deve ser maior que 29/11/1999', 'error');

    } else {

      let stringArr = idList.join(',');
      window.location.href = '/#/rgps/rgps-resultados/' +
        this.route.snapshot.params['id'] + '/' + stringArr + '' + pbc;

    }
  }

  checkDibPBCCompleto(idList) {

    idList = idList.map(Number);

    for (const calculo of this.calculosList) {

      if (idList.includes(calculo.id) && moment(calculo.data_pedido_beneficio, 'DD/MM/YYYY').isBefore(moment('29/11/1999', 'DD/MM/YYYY'))) {
        return true;
      }

    }

    return false;
  }

  getSelectedCalcs() {
    let idList = [];
    for (let checkboxId of this.checkboxIdList) {
      if ((<HTMLInputElement>document.getElementById(checkboxId)).checked) {
        idList.push(checkboxId.split('-')[0]);
      }
    }
    return idList;
  }

  isSegurado(element, index, array) {
    return element['id_segurado'] == this.idSegurado;
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.caixaOpcoes = document.getElementById('containerOpcoes');
    const navbar = document.getElementById('navbar');
    // const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const offset = 0;


    if ((this.window !== undefined && this.window !== null && this.window.pageYOffset && this.window.pageYOffset !== undefined) ||
      (this.document !== undefined && this.document !== null && this.document.documentElement.scrollTop && this.document.documentElement.scrollTop !== undefined)
      || (this.document !== undefined && this.document !== null && this.document.body.scrollTop && this.document.body.scrollTop !== undefined)
    ) {
      const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

      if (offset > this.offset(this.caixaOpcoes)) {
        this.navIsFixed = true;
        //  navbar.classList.add("sticky")
      } else if (this.navIsFixed) {
        this.navIsFixed = false;
        //  navbar.classList.remove("sticky");
      }
    }
  }

  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined) ? true : false;
  }

  offset(el = undefined) {
    if (this.isExits(el) && this.isExits(el.getBoundingClientRect())) {
      const rect = el.getBoundingClientRect(),
        scrollTop = this.window.pageYOffset || this.document.documentElement.scrollTop;
      return rect.top + scrollTop;
    }
  }

}
