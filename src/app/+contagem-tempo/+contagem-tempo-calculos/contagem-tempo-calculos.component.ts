import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { CalculoContagemTempo as CalculoModel } from './CalculoContagemTempo.model';
import { CalculoContagemTempoService } from './CalculoContagemTempo.service';
import { ErrorService } from '../../services/error.service';
import { SeguradoService } from '../+contagem-tempo-segurados/SeguradoContagemTempo.service';
import { SeguradoContagemTempo as SeguradoModel } from '../+contagem-tempo-segurados/SeguradoContagemTempo.model';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { Auth } from '../../services/Auth/Auth.service';
import { AuthResponse } from '../../services/Auth/AuthResponse.model';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contagem-tempo-calculos.component.html',
  providers: [
    ErrorService,
  ],
})
export class ContagemTempoCalculosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = { ...CalculoModel.form };

  public calculosList = this.CalculoContagemTempo.list;

  public isUpdating = false;

  public idSegurado = '';

  public segurado: any = {};

  public checkboxIdList = [];

  public Math = Math;

  public calculoTableOptions = {
    autoWidth: true,
    colReorder: true,
    data: this.calculosList,
    columns: [
      { data: 'actions', width: '20rem' },
      { data: 'referencia_calculo' },
      {
        data: 'total_dias',
        render: (data) => {
          return this.formatAnosMesesDias(data)
        }
      },
      {
        data: 'created_at',
        render: (data) => {
          return this.formatReceivedDate(data);
        }
      }
      // {
      //   data: (data) => {
      //     return this.getCheckbox(data);
      //   }
      // },
    ]
  };

  constructor(
    protected Segurado: SeguradoService,
    protected CalculoContagemTempo: CalculoContagemTempoService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
    private Auth: Auth
  ) { }

  // getTempoDeContribuicao(data, type, dataToSet) {
  //   let str = '';
  //   if (data.contribuicao_primaria_98 !== 'undefined-undefined-undefined') {
  //     str = str + data.contribuicao_primaria_98.replace(/-/g, '/') + '<br>';
  //   }
  //   if (data.contribuicao_primaria_99 !== 'undefined-undefined-undefined') {
  //     str = str + data.contribuicao_primaria_99.replace(/-/g, '/') + '<br>';
  //   }
  //   if (data.contribuicao_primaria_atual !== 'undefined-undefined-undefined') {
  //     str = str + data.contribuicao_primaria_atual.replace(/-/g, '/') + '<br>';
  //   }

  //   return str;

  // }

  getCheckbox(data) {
    if (!this.checkboxIdList.includes(`${data.id}-checkbox`)) {
      this.checkboxIdList.push(`${data.id}-checkbox`);
    }
    return `<div class="checkbox"><label>
            <input type="checkbox" id='${data.id}-checkbox' class="checkbox {{styleTheme}}"><span> </span>
            </label></div>`;
  }

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id'];
    this.isUpdating = true;
    this.Segurado.find(this.route.snapshot.params['id'])
      .then(segurado => {
        this.segurado = segurado;
        if (localStorage.getItem('user_id') != this.segurado.user_id) {
          this.segurado = {};
          //redirecionar para pagina de segurados
          swal({
            type: 'error',
            title: 'Erro - Você não tem permissão para acessar esta página!',
            text: '',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1500
          }).then(() => {
            this.voltar();
          });
        } else {
          this.seguradoView(segurado);
          this.CalculoContagemTempo.getWithParameters(['id_segurado', this.idSegurado])
            .then((calculos) => {
              this.updateDatatable();
              this.isUpdating = false;
            });
        }
      });
  }

  updateDatatable() {
    this.calculosList = this.calculosList.filter(this.isSegurado, this);
    this.calculoTableOptions = {
      ...this.calculoTableOptions,
      data: this.calculosList,
    }
  }

  onCreate(e) {
    this.isUpdating = true;
    // this.CalculoContagemTempo.get()
    //   .then(() => {
    //     // console.log(this.CalculoContagemTempo.list);
    //     this.calculosList = this.CalculoContagemTempo.list;
    //     this.updateDatatable();
    //     this.isUpdating = false;
    //   });

      this.CalculoContagemTempo.getWithParameters(['id_segurado', this.idSegurado])
      .then(() => {
        this.calculosList = this.CalculoContagemTempo.list;
        this.updateDatatable();
        this.isUpdating = false;
      });
  }


  editSegurado() {
    sessionStorage.setItem('last_url', '/contagem-tempo/contagem-tempo-calculos/' + this.route.snapshot.params['id']);
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados/' + this.route.snapshot.params['id'] + '/editar';
  }

  returnListaSegurados() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados';
  }

  seguradoView(segurado) {
    segurado.id_documento = segurado.getDocumentType(segurado.id_documento);
    segurado.idade = segurado.getIdadeAtual(segurado.data_nascimento, 1);
    this.segurado = segurado;
  }


  formatAnosMesesDias(dias) {
     console.log(parseFloat(dias));

    let totalFator = { years: 0, months: 0, days: 0 };

    // let xValor = (this.Math.floor(dias) / 365.25);

    // totalFator.years = this.Math.floor(xValor);
    // let xVarMes = (xValor - totalFator.years) * 12;
    // totalFator.months = this.Math.floor(xVarMes);
    // let dttDias = (xVarMes - totalFator.months) * 30.4375;
    // totalFator.days = this.Math.round(dttDias);

    // console.log(moment.duration(dias, 'days'));
    let conversao_tempo = moment.duration(parseFloat(dias), 'days');

    console.log(conversao_tempo);
    console.log(moment.duration(12053.200000000000,'days'));
    console.log(moment.duration(12053.199999999788,'days'));
    

    totalFator = { years: conversao_tempo.years(), months: conversao_tempo.months(), days: Math.ceil(conversao_tempo.days()) };

    return totalFator.years + ' anos ' + totalFator.months + ' meses ' + totalFator.days + ' dias';
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

  }

  realizarCalculos() {

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



  voltar() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados/'
  }
}
