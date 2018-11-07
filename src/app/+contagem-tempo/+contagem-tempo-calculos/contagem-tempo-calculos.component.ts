import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { CalculoContagemTempo as CalculoModel } from './CalculoContagemTempo.model';
import { CalculoContagemTempoService } from './CalculoContagemTempo.service';
import { ErrorService } from '../../services/error.service';
import { SeguradoService } from '../+contagem-tempo-segurados/SeguradoContagemTempo.service';
import { SeguradoContagemTempo as SeguradoModel } from '../+contagem-tempo-segurados/SeguradoContagemTempo.model';
import swal from 'sweetalert';

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

  public calculoTableOptions = {
    autoWidth: true,
    colReorder: true,
    data: this.calculosList,
    columns: [
      { data: 'actions', width: '10%' },
      { data: 'referencia_calculo' },
      { data: 'total_dias' },
      {
        data: 'created_at',
        render: (data) => {
          return this.formatReceivedDate(data);
        }
      },
      {
        data: (data) => {
          return this.getCheckbox(data);
        }
      },
    ]
  };

  constructor(
    protected Segurado: SeguradoService,
    protected CalculoContagemTempo: CalculoContagemTempoService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
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
      });

    this.CalculoContagemTempo.get()
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

  onCreate(e) {
    this.isUpdating = true;
    this.CalculoContagemTempo.get()
      .then(() => {
        console.log(this.CalculoContagemTempo.list);
        this.calculosList = this.CalculoContagemTempo.list;
        this.updateDatatable();
        this.isUpdating = false;
      })
  }


  editSegurado() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados/' + this.route.snapshot.params['id'] + '/editar';
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
      window.location.href = '/#/contagem-tempo/contagem-tempo-periodos/' +
        this.route.snapshot.params['id'] + '/' + stringArr;
    }
  }

  realizarCalculos() {
    let idList = this.getSelectedCalcs();
    if (idList.length > 3) {
      swal('Erro', 'Selecione até 3 cálculos', 'error');
    } else if (idList.length == 0) {
      swal('Erro', 'Selecione pelo menos 1 cálculo', 'error');
    } else {
      let stringArr = idList.join(',');
      window.location.href = '/#/contagem-tempo/contagem-tempo-resultados/' +
        this.route.snapshot.params['id'] + '/' + stringArr;
    }
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
}
