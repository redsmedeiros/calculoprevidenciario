import {
  Component, OnInit, ViewChild, ElementRef,
  ChangeDetectorRef, Input, OnChanges, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import { PeriodosContagemTempo } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.model';
import { CalculoRgpsService } from 'app/+rgps/+rgps-calculos/CalculoRgps.service';
import { CalculoRgps } from 'app/+rgps/+rgps-calculos/CalculoRgps.model';
import { Auth } from 'app/services/Auth/Auth.service';

import { DefinicaoTempo } from 'app/shared/functions/definicao-tempo';
import { ModalDirective } from 'ngx-bootstrap';
import { ErrorService } from 'app/services/error.service';
import swal from 'sweetalert2';
import { SizeFunctions } from 'app/shared/functions/size-functions';



@Component({
  selector: 'app-importador-rgps-calculos-list',
  templateUrl: './importador-rgps-calculos-list.component.html',
  styleUrls: ['./importador-rgps-calculos-list.component.css'],
  providers: [
    ErrorService
  ]
})
export class ImportadorRgpsCalculosListComponent implements OnInit, OnChanges {


  @Input() dadosPassoaPasso;
  @Input() idSeguradoSelecionado;
  @Input() idCalculoSelecionadoCT;
  @Input() calculoRMIDefaulForm;


  @Input() seguradoSelecionado;
  @Input() calculoSelecionadoCT;
  @Output() calculoSelecionadoEvent = new EventEmitter();

  @ViewChild('modalCalculosRGPS') public modalCalculosRGPS: ModalDirective;

  public calculoSelecionado = {};

  public listRMICalculos = [];
  public calculosRMIList = [];
  public formCalculo;
  public isEditRGPS = false;
  public revisaoPBC = false;


  private lengthMenuTable = this.setNumberPages();
  public columnsConfig = [
    {
      data: 'actions2',
      render: (data, type, row) => {
        return this.getBtnAcoesCalculoRMI(row.id);
      }, width: '11rem', class: 'text-center'
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
  ];

  public calculoTableOptionsRMIList = {
    colReorder: true,
    data: this.calculosRMIList,
    // order: [[6, 'desc']],]
    columns: this.columnsConfig,
    lengthMenu: this.lengthMenuTable,
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
    protected Errors: ErrorService,
  ) { }

  ngOnInit() { }


  ngOnChanges(changes: SimpleChanges) {

    // this.ref.markForCheck();
    // this.ref.detectChanges();
    // this.setExibirForm(this.dadosPassoaPasso);

    this.getCalculosSeguradoSelecionado();
  }


  private getCalculosSeguradoSelecionado() {

    this.isUpdatingCalcRGPS = true;
    this.calculosRMIList = [];

    if (this.idSeguradoSelecionado !== undefined) {

      this.CalculoRgpsService.getCalculoBySeguradoId(this.idSeguradoSelecionado)
        .then((calculosRst: CalculoRgps[]) => {

          this.calculosRMIList = calculosRst.filter(c => c.id_contagem_tempo === this.idCalculoSelecionadoCT);
          this.updateDatatable();

          this.revisaoPBC = (this.isExits(this.dadosPassoaPasso.pbcFull) && this.dadosPassoaPasso.pbcFull === 'pbc');
        });

    }

  }

  updateDatatable() {

    this.calculoTableOptionsRMIList = {
      colReorder: true,
      data: this.calculosRMIList,
      // order: [[6, 'desc']],
      columns: this.columnsConfig,
      lengthMenu: this.lengthMenuTable,
      buttons: [
        {
          extend: 'colvis',
          text: 'Exibir e ocultar colunas',
        }
      ]
    };


    // this.calculoTableOptionsRMIList = {
    //   ...this.calculoTableOptionsRMIList,
    //   data: this.calculosRMIList,
    // }

    this.isUpdatingCalcRGPS = false;
  }


  setNumberPages() {

    if (!SizeFunctions.isWidthGreaterThan(1366)) {
      return [5, 10, 25, 50, 75, 'All'];
    }
    return [10, 25, 50, 75, 'All'];
  }

  private getRow(dataRow) {

    if (this.isExits(dataRow)) {

      this.calculosSelecionadoRMI = dataRow;
      this.isCalculosSelecionadoRMI = true;
      this.getPeriodosImportador(this.calculosSelecionadoRMI.id)

      this.calculoSelecionadoEvent.emit(this.calculosSelecionadoRMI);
      sessionStorage.setItem('calculosSelecionadoRMI', JSON.stringify(this.calculosSelecionadoRMI));

    }
  }


  private setNewFormRMIinfoContagemTempo() {
    this.isEditRGPS = false;
    this.showChildModal();
  }


  private setUpdateForm(dataRow) {

    this.showChildModal();
    this.isEditRGPS = true;
    this.formCalculo = dataRow;

  }

  private updateRow(dataRow) {

    if (this.isExits(dataRow)) {

      this.setUpdateForm(dataRow);

    }
  }

  private deleteRow(dataRow) {

    if (this.isExits(dataRow)) {
      this.deleteCalculoRGPS(dataRow)
    }

  }

  private copyRow(dataRow) {

    if (this.isExits(dataRow)) {

      this.copyCalculoRGPS(dataRow);

    }
  }


  public submit(dataForm) {

    dataForm.id_segurado = this.idSeguradoSelecionado;

    if (!this.isEditRGPS) {
      this.createCalculoRGPS(dataForm)
    } else {
      this.updateCalculoRGPS(dataForm)
    }

  }


  public copyCalculoRGPS(calculoRMI) {

    const calculorgps = Object.assign({}, calculoRMI);
    calculorgps.id = null;
    this.createCalculoRGPS(calculorgps);

  }

  private createCalculoRGPS(data) {

    data.id_contagem_tempo = this.idCalculoSelecionadoCT;
    this.CalculoRgpsService
      .save(data)
      .then(model => {

        this.getCalculosSeguradoSelecionado();
        this.hideChildModal();
        // this.resetForm();
        this.toastAlert('success', 'Cálculo salvo com sucesso.', null);

      })
      .catch(errors => this.Errors.add(errors));

  }

  private updateCalculoRGPS(data) {

    this.CalculoRgpsService
      .update(data)
      .then(model => {

        this.getCalculosSeguradoSelecionado();
        this.isEditRGPS = false;
        this.hideChildModal();
        this.toastAlert('success', 'Cálculo salvo com sucesso.', null);

      })
      .catch(errors => { this.Errors.add(errors); console.log(errors) });
  }


  private deleteCalculoRGPS(calculoRMI) {

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

        const calculorgps = this.calculosRMIList.find((calculo) => calculo.id === calculoRMI.id);

        this.CalculoRgpsService.destroy(calculorgps)
          .then((model) => {

            this.getCalculosSeguradoSelecionado();
            this.toastAlert('success', 'Cálculo salvo com sucesso.', null);

          }).catch((err) => {
            this.toastAlert('error', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', null);
          });


      } else if (result.dismiss === swal.DismissReason.cancel) {

      }

    });
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
          <input type="checkbox" id='${id}-checkbox-calculos-rmi'
          class="checked-row-one checkbox {{styleTheme}} checkboxCalculosRMI"
          value="${id}"><span> </span></label>
        </div>`;
  }



  public getBtnAcoesCalculoRMI(id) {

    return ` <div class="btn-group">
              <button class="btn btn-xs copy-btn txt-color-white bg-color-teal"
                  title="Duplicar" >&nbsp;<i class="fa fa-copy fa-1-7x"></i>&nbsp;</button>
              <button class="btn btn-warning btn-xs update-btn" 
                  title="Editar o cálculo">&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;</button>
              <button class="btn btn-danger btn-xs delete-btn" 
                  title="Deletar" >&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;</button>
        </div>`;
  }


  public showChildModal(): void {
    this.formCalculo = CalculoRgps.form;
    this.modalCalculosRGPS.show();
  }

  public hideChildModal(): void {
    this.formCalculo = CalculoRgps.form;
    this.modalCalculosRGPS.hide();
  }


  /**
   * setRevisaoPBC
   */
  public setRevisaoPBC() {

    this.revisaoPBC = !(this.revisaoPBC);
    this.dadosPassoaPasso.pbcFull = (this.revisaoPBC ? 'pbc' : '');
    sessionStorage.setItem('pbcFull', this.dadosPassoaPasso.pbcFull);

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
