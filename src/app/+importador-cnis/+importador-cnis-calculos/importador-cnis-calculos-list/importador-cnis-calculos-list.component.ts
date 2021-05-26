import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Auth } from 'app/services/Auth/Auth.service';

import { CalculoContagemTempoService } from 'app/+contagem-tempo/+contagem-tempo-calculos/CalculoContagemTempo.service';
import { CalculoContagemTempo as CalculoContagemTempoModel } from 'app/+contagem-tempo/+contagem-tempo-calculos/CalculoContagemTempo.model';
import { DefinicaoTempo } from 'app/shared/functions/definicao-tempo';

import { PeriodosContagemTempoService } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.service';
import { PeriodosContagemTempo } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.model';

@Component({
  selector: 'app-importador-cnis-calculos-list',
  templateUrl: './importador-cnis-calculos-list.component.html',
  styleUrls: ['./importador-cnis-calculos-list.component.css']
})
export class ImportadorCnisCalculosListComponent implements OnInit {



  @Input() seguradoSelecionado;
  @Output() calculoSelecionadoEvent = new EventEmitter();

  public calculoSelecionado = {};

  public listCalculos = [];
  public calculosList = [];
  // public calculosList = this.CalculoContagemService.list;
  public calculoTableOptions = {
    autoWidth: true,
    colReorder: true,
    data: this.calculosList,
    columns: [
      // { data: 'actions', width: '20rem' },
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
      },
      {
        data: 'selecionarCalculo',
        render: (data, type, row) => {
          return this.getBtnSelecionarCalculo(row.id);
        }, width: '6rem', class: 'p-1'
      },
    ]
  };

  public isUpdatingCalc = true;
  public calculosSelecionado;
  public isCalculosSelecionado = false;

  constructor(
    protected CalculoContagemService: CalculoContagemTempoService,
    protected PeriodosContagemTempoService: PeriodosContagemTempoService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {

  }


  ngOnChanges(changes: SimpleChanges) {

    this.ref.markForCheck();
    this.ref.detectChanges();
    // this.setExibirForm(this.dadosPassoaPasso);

    this.getCalculosSeguradoSelecionado();
  }


  private getCalculosSeguradoSelecionado() {

    this.isUpdatingCalc = true;
    this.calculosList = [];

    if (this.seguradoSelecionado !== undefined
      && this.seguradoSelecionado.id !== undefined) {

      const idSegurado = this.seguradoSelecionado.id;
      // this.CalculoContagemService.getWithParameters(['id_segurado', idSegurado])
      // .then((calculos) => {
      //     this.updateDatatable();
      //   });

        this.CalculoContagemService.getCalculoBySeguradoId(idSegurado)
        .then((calculosRst: CalculoContagemTempoModel[]) => {
          this.calculosList = calculosRst;
          this.updateDatatable();
        });
    }

  }

  updateDatatable() {
    // const idSegurado = this.seguradoSelecionado.id;
    // this.calculosList = this.calculosList.filter(idSegurado, this);
    this.calculoTableOptions = {
      ...this.calculoTableOptions,
      data: this.calculosList,
    }

    this.isUpdatingCalc = false;
  }


  private getRow(dataRow) {

    if (this.isExits(dataRow)) {

      this.calculosSelecionado = dataRow;
      this.isCalculosSelecionado = true;
      this.getPeriodosImportador(this.calculosSelecionado.id)


      this.calculoSelecionadoEvent.emit(this.calculosSelecionado);
      sessionStorage.setItem('calculosSelecionado', JSON.stringify(this.calculosSelecionado));

    }
  }

  
  public getPeriodosImportador(calculoId) {

    if (calculoId !== undefined) {

      return new Promise((resolve, reject) => {

        this.PeriodosContagemTempoService.getByPeriodosId(calculoId)
          .then((periodosContribuicao: PeriodosContagemTempo[]) => {

            sessionStorage.setItem('periodosSelecionado', JSON.stringify(periodosContribuicao));

            resolve(periodosContribuicao);
          }).catch(error => {
            console.error(error);
            reject(error);
          })
      });
    }
  }




  public getBtnSelecionarCalculo(id) {

    return `<div class="checkbox "><label>
          <input type="checkbox" id='${id}-checkbox-calculos'
          class="select-btn checkbox {{styleTheme}} checkboxCalculos"
          value="${id}"><span> </span></label>
   </div>`;
  }


  formatAnosMesesDias(dias) {

    let totalFator = { years: 0, months: 0, days: 0 };
    totalFator = DefinicaoTempo.convertD360ToDMY(dias);
    return totalFator.years + ' anos ' + totalFator.months + ' meses ' + totalFator.days + ' dias';
  }


  formatReceivedDate(inputDate) {
    let date = new Date(inputDate);
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
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }


}
