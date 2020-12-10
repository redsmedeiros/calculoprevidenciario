


import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from 'app/services/shared/animations/fade-in-top.decorator';
import { environment } from '../../../../environments/environment';
import { ErrorService } from 'app/services/error.service';
import { Auth } from '../../../services/Auth/Auth.service';
import { CalculoRgpsService } from './../../+rgps-calculos/CalculoRgps.service';
import { CalculoRgps } from './CalculoRgpsPlan.model';
import { RgpsPlanejamentoService } from './../rgps-planejamento.service';
import { PlanejamentoRgps } from '../PlanejamentoRgps.model'


@Component({
  selector: 'app-rgps-planejamento-calculos-planejados',
  templateUrl: './rgps-planejamento-calculos-planejados.component.html',
  styleUrls: ['./rgps-planejamento-calculos-planejados.component.css'],
  providers: [
    ErrorService,
  ],
})
export class RgpsPlanejamentoCalculosPlanejadosComponent implements OnInit {


  @Input() seguradoSelecionado;
  @Input() isSeguradoSelecionado;

  @Output() calculoSelecionadoEvent = new EventEmitter();


  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];


  private isUpdatingCalc = true;
  private isUpdatingPlan = true;
  private userId;
  private idSegurado;
  private idCalculo;
  public calculosSelecionado;
  public isCalculosSelecionado;
  public calculosList = [];
  // public planejamentoList = [];

  public calculo: any = {};


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
        data: 'selecionarSergurado',
        render: (data, type, row) => {
          return this.getBtnSelecionarCalculo(row.id);
        }, width: '6rem', class: 'p-1'
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
    protected calculoRgps: CalculoRgpsService,
    protected rgpsPlanejamentoService: RgpsPlanejamentoService,
    protected Errors: ErrorService,
    private Auth: Auth,
    protected router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.userId = localStorage.getItem('user_id') || this.route.snapshot.queryParams['user_id'];

    if (this.userId) {
      localStorage.setItem('user_id', this.userId);
    } else {
      window.location.href = environment.loginPageUrl;
    }

  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const changedsegurado = changes['seguradoSelecionado'];
    // let changedCalculo = changes['calculo'];
    // let changedisUpdating = changes['isUpdatingPlanCalc'];

    // console.log(changedsegurado);
    // console.log(changedisUpdating);

    if (changedsegurado.currentValue) {
      this.getCalculosSegurado();
    }

  }



  private updateDatatable() {
    this.calculoTableOptions = {
      ...this.calculoTableOptions,
      data: this.calculosList,
    }

    // console.log(this.calculoTableOptions);
  }

  private getCalculosSegurado() {
    this.isUpdatingCalc = true;
    this.idSegurado = this.seguradoSelecionado.id

    this.calculoRgps.getPlanejamentoBySeguradoId(this.idSegurado)
      .then((calculosRst: CalculoRgps[]) => {
        this.calculosList = calculosRst;
        this.isUpdatingCalc = false;
        this.updateDatatable();
      });
  }



  // private getPlanejamentosCalculo(idCalculo) {
  //   this.planejamentoList = [];
  //   this.idCalculo = idCalculo;
  //   this.isUpdatingPlan = true;
  //   this.rgpsPlanejamentoService
  //     .getPlanejamentoByCalculoId(this.idCalculo)
  //     .then((planejamentoRst: PlanejamentoRgps[]) => {

  //       console.log(planejamentoRst);
  //       for (const plan of planejamentoRst) {
  //         this.planejamentoList.push(plan);
  //       }
  //       this.isUpdatingPlan = false;
  //     });

  // }



  private getRow(dataRow) {

    //console.log(dataRow);

    if (this.isExits(dataRow)) {
      this.calculosSelecionado = dataRow;
      this.isCalculosSelecionado = true;

      this.calculoSelecionadoEvent.emit(this.calculosSelecionado);
      // this.getPlanejamentosCalculo(this.calculosSelecionado.id);
    }
  }


  public getBtnSelecionarCalculo(id) {

    // return `<button  type="button" class="btn btn-xs btn-info select-btn">
    //           Selecionar <i class="fa fa-arrow-circle-right"></i>
    //       </button>`;

    return `<div class="checkbox "><label>
          <input type="checkbox" id='${id}-checkbox-calculos'
          class="select-btn checkbox {{styleTheme}} checkboxCalculos"
          value="${id}"><span> </span></label>
   </div>`;
  }



  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }

  formatMoeda(value, sigla = 'R$') {

    value = parseFloat(value);
    const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return sigla + ' ' + numeroPadronizado;
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


  formatReceivedDate(inputDate) {
    var date = new Date(inputDate);
    date.setTime(date.getTime() + 5 * 60 * 60 * 1000);
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return (
        ('0' + date.getDate()).slice(-2) +
        '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '/' +
        date.getFullYear()
      );
    }
    return '';
  }
}
