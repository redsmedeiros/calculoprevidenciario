import {
  Component, OnInit, ViewChild, ElementRef,
  ChangeDetectorRef, Input, OnChanges, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import { PeriodosContagemTempo } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.model';
import { CalculoRgpsService } from 'app/+rgps/+rgps-calculos/CalculoRgps.service';
import { CalculoRgps } from 'app/+rgps/+rgps-calculos/CalculoRgps.model';
import { Auth } from 'app/services/Auth/Auth.service';

import { DefinicaoTempo } from 'app/shared/functions/definicao-tempo';



@Component({
  selector: 'app-importador-rgps-calculos-list',
  templateUrl: './importador-rgps-calculos-list.component.html',
  styleUrls: ['./importador-rgps-calculos-list.component.css']
})
export class ImportadorRgpsCalculosListComponent implements OnInit, OnChanges {


  @Input() dadosPassoaPasso;
  @Input() idSeguradoSelecionado;
  @Input() idCalculoSelecionadoCT;


  @Input() seguradoSelecionado;
  @Input() calculoSelecionadoCT;
  @Output() calculoSelecionadoEvent = new EventEmitter();

  public calculoSelecionado = {};

  public listRMICalculos = [];
  public calculosRMIList = [];


  public calculoTableOptionsRMIList = {
    colReorder: true,
    data: this.calculosRMIList,
    // order: [[6, 'desc']],
    columns: [
      {
        data: 'actions2',
        render: (data, type, row) => {
          return this.getBtnAcoesCalculoRMI(row.id);
        }, width: '10rem', class: 'text-center'
      },
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
        data: 'selecionarCalculo',
        render: (data, type, row) => {
          return this.getBtnSelecionarCalculo(row.id);
        }, width: '6rem', class: 'p-1'
      },
    ],
    buttons: [
      {
        extend: 'colvis',
        text: 'Exibir e ocultar colunas',
      }
    ]
  };

  public isUpdatingCalcRGPS = true;
  public calculosSelecionadoRMI;
  public isCalculosSelecionadoRMI = false;

  constructor(
    protected CalculoRgpsService: CalculoRgpsService,
  ) { }

  ngOnInit() {

  }


  ngOnChanges(changes: SimpleChanges) {

    // this.ref.markForCheck();
    // this.ref.detectChanges();
    // this.setExibirForm(this.dadosPassoaPasso);

    console.log(this.idSeguradoSelecionado)
    console.log(this.idCalculoSelecionadoCT)

    this.getCalculosSeguradoSelecionado();
  }


  private getCalculosSeguradoSelecionado() {

    this.isUpdatingCalcRGPS = true;
    this.calculosRMIList = [];

    if (this.idSeguradoSelecionado !== undefined) {

      this.CalculoRgpsService.getCalculoBySeguradoId(this.idSeguradoSelecionado)
        .then((calculosRst: CalculoRgps[]) => {
          console.log(calculosRst)

          this.calculosRMIList = calculosRst;
          this.updateDatatable();

        });

    }

  }

  updateDatatable() {

    console.log(this.calculosRMIList);

    this.calculoTableOptionsRMIList = {
      ...this.calculoTableOptionsRMIList,
      data: this.calculosRMIList,
    }

    this.isUpdatingCalcRGPS = false;
  }


  private getRow(dataRow) {

    if (this.isExits(dataRow)) {

      console.log(dataRow);

      this.calculosSelecionadoRMI = dataRow;
      this.isCalculosSelecionadoRMI = true;
      this.getPeriodosImportador(this.calculosSelecionadoRMI.id)


      this.calculoSelecionadoEvent.emit(this.calculosSelecionadoRMI);
      sessionStorage.setItem('calculosSelecionadoRMI', JSON.stringify(this.calculosSelecionadoRMI));

    }
  }

  private updateRow(dataRow) {

    if (this.isExits(dataRow)) {

      console.log(dataRow);


    }
  }

  private deleteRow(dataRow) {

    if (this.isExits(dataRow)) {

      console.log(dataRow);

    }
  }


  public getPeriodosImportador(calculoId) {

    if (calculoId !== undefined) {

      return new Promise((resolve, reject) => {

        // this.PeriodosContagemTempoService.getByPeriodosId(calculoId)
        //   .then((periodosContribuicao: PeriodosContagemTempo[]) => {

        //     sessionStorage.setItem('periodosSelecionado', JSON.stringify(periodosContribuicao));

        //     resolve(periodosContribuicao);
        //   }).catch(error => {
        //     console.error(error);
        //     reject(error);
        //   })
      });
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



  public getBtnSelecionarCalculo(id) {

    return `<div class="checkbox "><label>
          <input type="checkbox" id='${id}-checkbox-calculos'
          class="select-btn checkbox {{styleTheme}} checkboxCalculos"
          value="${id}"><span> </span></label>
   </div>`;
  }



  public getBtnAcoesCalculoRMI(id) {

    return ` <div class="btn-group">
      <button class="btn btn-warning btn-xs update-btn" title="Editar o cálculo">&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;</button>
      <button class="btn btn-danger btn-xs delete-btn" title="Deletar" >&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;</button>
    </div>
`;
  }



  formatAnosMesesDias(dias) {

    let totalFator = { years: 0, months: 0, days: 0 };
    totalFator = DefinicaoTempo.convertD360ToDMY(dias);
    return totalFator.years + ' anos ' + totalFator.months + ' meses ' + totalFator.days + ' dias';
  }


  formatReceivedDate(inputDate) {
    const date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return ('0' + (date.getDate())).slice(-2) + '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        date.getFullYear();
    }
    return '';
  }


  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '')
      ? true : false;
  }


}
