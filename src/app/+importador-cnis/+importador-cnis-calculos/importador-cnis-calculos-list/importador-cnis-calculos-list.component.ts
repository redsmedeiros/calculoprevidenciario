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
import { SizeFunctions } from 'app/shared/functions/size-functions';
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { InputFunctions } from 'app/shared/functions/input-functions';


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
  @Output() toStep6Event = new EventEmitter();
  @ViewChild('modalCalculosContagemTempo') public modalCalculosContagemTempo: ModalDirective;

  public calculoSelecionado = {};
  private calculoCTDuplicar = {};

  public referencia_calculo = '';
  public formCalculoCT;
  public isEditContagem = false;
  public isToStep6 = false;
  public listCalculos = [];
  public calculosList = [];
  // public calculosList = this.CalculoContagemService.list;


  private lengthMenuTable = this.setNumberPages();
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
    lengthMenu: this.lengthMenuTable,
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

    this.isToStep6 = false;

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


  setNumberPages() {

    if (!SizeFunctions.isWidthGreaterThan(1366)) {
      return [5, 10, 25, 50, 75, 'All'];
    }
    return [10, 25, 50, 75, 'All'];
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
      lengthMenu: this.lengthMenuTable,
    };

    this.isUpdatingCalc = false;
  }


  private getRow(dataRow) {

    this.isCalculosSelecionado = false;

    if (this.isExits(dataRow)) {

      this.calculosSelecionado = dataRow;
      this.isCalculosSelecionado = true;
      this.getPeriodosImportador(this.calculosSelecionado.id)


      this.calculoSelecionadoEvent.emit(this.calculosSelecionado);
      sessionStorage.setItem('calculosSelecionado', JSON.stringify(this.calculosSelecionado));

      if (InputFunctions.checkedUniqueCount(`${this.calculosSelecionado.id}-checkbox-calculos`, '.checkboxCalculos') === 0) {
        this.isCalculosSelecionado = false;
      }

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


  public setToStep6() {

    sessionStorage.setItem('isToStep6', '');

    if (!this.isCalculosSelecionado) {
      this.isToStep6 = false;
      sessionStorage.setItem('isToStep6', '');
    }

    if (this.isCalculosSelecionado
      && this.calculosSelecionado.total_carencia > 0
      && this.isToStep6) {

      sessionStorage.setItem('isToStep6', 'aStep4');

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

  validate() {
    this.errors.clear('referencia_calculo');

    if (this.referencia_calculo == undefined
      || this.referencia_calculo == '') {
      this.errors.add({
        'referencia_calculo':
          ['Insira uma referência para simulação.']
      });

      return false;
    }

    return true;

  }


  private createCalculoContagemTempo(data) {

    this.CalculoContagemService
      .save(data)
      .then(model => {

        this.getCalculosSeguradoSelecionado();
        this.hideChildModal();
        // this.resetForm();
        this.toastAlert('success', 'Cálculo salvo com sucesso.', null);

      })
      .catch(errors => this.errors.add(errors));

  }


  private updateCalculoContagemTempo(data) {

    if (this.validate) {
      this.formCalculoCT.referencia_calculo = this.referencia_calculo;

      this.formCalculoCT
        .update(data)
        .then(model => {

          this.getCalculosSeguradoSelecionado();
          this.isEditContagem = false;
          this.hideChildModal();
          this.toastAlert('success', 'Cálculo salvo com sucesso.', null);

        })
        .catch(errors => { this.errors.add(errors); console.log(errors) });
    }

  }


  private updateRow(dataRow) {

    this.formCalculoCT = {};

    this.showChildModal();
    this.isEditContagem = true;
    this.referencia_calculo = dataRow.referencia_calculo;
    this.formCalculoCT = dataRow;

  }

  setNewFormContagemTempoRef() {

    this.referencia_calculo = 'Impotação - ' + moment().format('DD/MM/YYYY')
    this.isEditContagem = false;
    this.showChildModal();

  }


  public submit(dataForm) {

    dataForm.id_segurado = this.seguradoSelecionado.id;
    dataForm.referencia_calculo = this.referencia_calculo;

    console.log(dataForm);

    if (this.validate()) {

      if (!this.isEditContagem) {

        this.createCalculoContagemTempo(dataForm);

      } else {

        this.updateCalculoContagemTempo(dataForm);

      }
    }

  }


  public showChildModal(): void {
    this.formCalculoCT = CalculoContagemTempoModel.form;
    this.modalCalculosContagemTempo.show();
  }

  public hideChildModal(): void {
    this.formCalculoCT = CalculoContagemTempoModel.form;
    this.modalCalculosContagemTempo.hide();
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
          <button class="btn btn-warning btn-xs update-btn" 
          title="Editar o cálculo">&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;</button>
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
