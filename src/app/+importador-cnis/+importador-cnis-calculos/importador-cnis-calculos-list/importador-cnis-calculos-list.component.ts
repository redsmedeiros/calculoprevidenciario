import {
  Component, OnInit, ViewChild, ElementRef,
  ChangeDetectorRef, Input, OnChanges, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import { Auth } from 'app/services/Auth/Auth.service';

import { CalculoContagemTempoService } from 'app/+contagem-tempo/+contagem-tempo-calculos/CalculoContagemTempo.service';
import { CalculoContagemTempo as CalculoContagemTempoModel } from 'app/+contagem-tempo/+contagem-tempo-calculos/CalculoContagemTempo.model';
import { DefinicaoTempo } from 'app/shared/functions/definicao-tempo';

import { PeriodosContagemTempoService } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.service';
import { PeriodosContagemTempo } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.model';

import { ErrorService } from 'app/services/error.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-importador-cnis-calculos-list',
  templateUrl: './importador-cnis-calculos-list.component.html',
  styleUrls: ['./importador-cnis-calculos-list.component.css'],
  providers: [
    ErrorService,
  ],
})
export class ImportadorCnisCalculosListComponent implements OnInit, OnChanges {



  @Input() seguradoSelecionado;
  @Output() calculoSelecionadoEvent = new EventEmitter();

  public calculoSelecionado = {};
  private calculoCTDuplicar = {};

  public listCalculos = [];
  public calculosList = [];
  // public calculosList = this.CalculoContagemService.list;



  private columnsConfig = [
    {
      data: 'actions2',
      render: (data, type, row) => {
        return this.getBtnAcoesCalculoCT(row.id);
      }, width: '11rem', class: 'text-center'
    },
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
  ];

  public calculoTableOptions = {
    autoWidth: true,
    colReorder: true,
    data: this.calculosList,
    columns: this.columnsConfig,
  };

  public isUpdatingCalc = true;
  public calculosSelecionado;
  public isCalculosSelecionado = false;

  constructor(
    protected CalculoContagemService: CalculoContagemTempoService,
    protected PeriodosContagemTempoService: PeriodosContagemTempoService,
    private ref: ChangeDetectorRef,
    protected errors: ErrorService,
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

      this.getListCalculos(idSegurado);
    }

  }


  private getListCalculos(idSegurado) {
    this.isUpdatingCalc = true;

    this.CalculoContagemService.getCalculoBySeguradoId(idSegurado)
      .then((calculosRst: CalculoContagemTempoModel[]) => {

        this.calculosList = calculosRst;
        this.updateDatatable();

      });

  }


  updateDatatable() {

    // const idSegurado = this.seguradoSelecionado.id;
    // this.calculosList = this.calculosList.filter(idSegurado, this);

    this.calculoTableOptions = {
      autoWidth: true,
      colReorder: true,
      data: this.calculosList,
      columns: this.columnsConfig,
    };

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



  private copyRow(dataRow) {


    if (this.isExits(dataRow)) {

      this.getPeriodosImportador(dataRow.id).then((periodos) => {

        this.copyCalculoCT(periodos, dataRow);

      });

    }
  }


  private deleteRow(dataRow) {

    if (this.isExits(dataRow)) {

      this.deleteCalculoCT(dataRow);

    }

  }


  /**
   * Ajusta a lista de periodos para gravar
   * @param idCalculoCopy novo id da cópia do cálculo.
   */
  private createListPostPeriodos(periodos, idCalculoCopy) {

    periodos.map((periodo) => {
      delete periodo['id'];
      periodo.id_contagem_tempo = idCalculoCopy
    });

  }


  /**
  * Remove alguns atributos do calculo para criar a cópia.
  * @param calculo calculo a ser copiado
  */
  private setCalculo(calculo) {
    delete calculo['id'];
    delete calculo['actions'];
    delete calculo['created_at'];
    delete calculo['updated_at'];
    delete calculo['url'];
    delete calculo['form'];
    delete calculo['_data'];
    calculo.referencia_calculo = 'Cópia de: ' + calculo.referencia_calculo;

    return calculo;
  }


  private copyCalculoCT(periodos, calculoCT) {

    const calculoCTDuplicar = Object.assign({}, calculoCT);
    calculoCTDuplicar.id = null;

    calculoCT = this.setCalculo(calculoCTDuplicar)

    this.CalculoContagemService
      .save(calculoCT)
      .then((model: CalculoContagemTempoModel) => {
        this.getListCalculos(this.seguradoSelecionado.id);
        if (periodos.length > 0) {
          this.createListPostPeriodos(periodos, model.id)
          this.PeriodosContagemTempoService
            .save(periodos)
            .then((modelRST) => {
              console.log(modelRST);
              this.toastAlert('success', 'Cálculo excluído com sucesso', null);

            })
            .catch(errors => this.errors.add(errors));

        } else {
          // loadingAlert.close();
        }


      })
      .catch(errors => this.errors.add(errors));

  }






  private deleteCalculoCT(calculoCT) {

    swal({
      title: 'Tem certeza?',
      text: 'Essa ação é irreversível!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Deletar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.value) {

        this.CalculoContagemService.destroy(calculoCT)
          .then((rst) => {

            this.getListCalculos(this.seguradoSelecionado.id);
            this.toastAlert('success', 'Cálculo excluído com sucesso', null)

          }).catch((err) => {

            this.toastAlert('error', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', null)

          });


      } else if (result.dismiss === swal.DismissReason.cancel) {

      }

    });
  }








  public getBtnSelecionarCalculo(id) {

    return `<div class="checkbox "><label>
          <input type="checkbox" id='${id}-checkbox-calculos'
            class="checked-row-one checkbox {{styleTheme}} checkboxCalculos"
            value="${id}"><span> </span></label>
   </div>`;
  }


  public getBtnAcoesCalculoCT(id) {

    return ` <div class="btn-group">
      <button class="btn txt-color-white bg-color-teal btn-xs copy-btn"
          title="Duplicar" >&nbsp;<i class="fa fa-copy fa-1-7x"></i>&nbsp;</button>
      <button class="btn btn-danger btn-xs delete-btn"
          title="Deletar" >&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;</button>
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




  toastAlert(type, title, position) {

    position = (!position) ? 'top-end' : position;

    swal({
      position: position,
      type: type,
      title: title,
      showConfirmButton: false,
      timer: 1500
    });

  }


}
