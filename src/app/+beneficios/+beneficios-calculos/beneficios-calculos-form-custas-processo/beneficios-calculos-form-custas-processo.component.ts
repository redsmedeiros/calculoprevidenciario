
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BeneficiosCalculosFormComponent } from './../beneficios-calculos-form/beneficios-calculos-form.component';
import { CustasProcesso } from './CustasProcesso.model'
import { ErrorService } from '../../../services/error.service';
import swal from 'sweetalert2';
import * as moment from 'moment';


@Component({
  selector: 'app-beneficios-calculos-form-custas-processo',
  templateUrl: './beneficios-calculos-form-custas-processo.component.html',
  styleUrls: ['./beneficios-calculos-form-custas-processo.component.css']
})
export class BeneficiosCalculosFormCustasProcessoComponent extends BeneficiosCalculosFormComponent implements OnInit {


  private custasFormId: number;
  private custasFormDescricao: any;
  private custasFormData: any;
  private custasFormValor: any;
  private custasFormAplicarJuros = false;

  @Input() errors;
  @Input() isEdit;
  @Input() listAcrescimosDeducoes;
  @Input() isUpdating;


  @ViewChild('custasProcessoModal') public custasProcessoModal: ModalDirective;
  @Output() custasProcessolistOut = new EventEmitter();


  constructor() {
    super(null, null, null);
  }

  ngOnInit() {
  }

  private validCustasProcesso() {

    let valid = true;
    this.errors.clear();

    if (this.isEmptyInput(this.custasFormDescricao)) {
      this.errors.add({ 'custasFormDescricao': ['Campo Obrigatório.'] });
      valid = false;
    }

    if (this.isEmptyInput(this.custasFormData)) {
      this.errors.add({ 'custasFormData': ['Campo Obrigatório.'] });
      valid = false;
    }

    if (this.isEmptyInput(this.custasFormValor)) {
      this.errors.add({ 'custasFormValor': ['Campo Obrigatório.'] });
      valid = false;
    }


    return valid;

  }


  private updateCustasProcessoList(event, custasFormId) {

    this.listAcrescimosDeducoes = this.listAcrescimosDeducoes.filter(row => row.id !== custasFormId);
    this.inserirAcrescimosDeducoesList();
    this.custasFormId = null;

  }

  private inserirAcrescimosDeducoesList(event = null) {

    const acrescimoDeducaoMultiplo = new CustasProcesso(
      ((this.isExits(this.custasFormId)) ? this.custasFormId : this.listAcrescimosDeducoes.length + 1),
      this.custasFormDescricao,
      this.custasFormData,
      this.custasFormValor,
      this.custasFormAplicarJuros);

    let statusInput = true;

    if (!this.validCustasProcesso()) {

      statusInput = false;

      swal({
        position: 'bottom-end',
        type: 'error',
        title: 'Verifique as informações.',
        showConfirmButton: false,
        timer: 1000
      });

    }

    if (statusInput) {

      this.updateDatatableCustasProcesso(acrescimoDeducaoMultiplo);
      this.clearFormCustasProcesso();
      this.hideChildModalCustasProcesso();

      swal({
        position: 'bottom-end',
        type: 'success',
        title: 'Lista Atualizada',
        showConfirmButton: false,
        timer: 1000
      });

    }

  }


  private updateDatatableCustasProcesso(acrescimoDeducao) {

    if (typeof acrescimoDeducao === 'object') {
      this.listAcrescimosDeducoes.push(acrescimoDeducao);
      this.listAcrescimosDeducoes.sort((a, b) => {
        if (moment(a.data, 'DD/MM/YYYY') < moment(b.data, 'DD/MM/YYYY')) {
          return -1;
        }
      });

      this.custasProcessolistOut.emit(this.listAcrescimosDeducoes);
    }
  }

  private clearFormCustasProcesso() {
    this.custasFormDescricao = '';
    this.custasFormData = '';
    this.custasFormValor = '';
    this.custasFormAplicarJuros = false;
  }


  private seTFormAcrescimoDeducao(rowEdit) {
    this.custasFormId = rowEdit.id;
    this.custasFormDescricao = rowEdit.descricao;
    this.custasFormData = rowEdit.data;
    this.custasFormValor = rowEdit.valor;
    this.custasFormAplicarJuros = rowEdit.aplicarJuros;
  }

  public getupdateAcrescimoDeducaoList(custasFormId) {
    const rowEdit = (this.listAcrescimosDeducoes.filter(row => row.id === custasFormId))[0];
    this.seTFormAcrescimoDeducao(rowEdit);
    this.showChildModalCustasProcesso();
  }

  public deleteAcrescimoDeducaoList(custasFormId) {
    this.listAcrescimosDeducoes = this.listAcrescimosDeducoes.filter(row => row.id !== custasFormId);
    this.custasProcessolistOut.emit(this.listAcrescimosDeducoes);

    swal({
      position: 'bottom-end',
      type: 'success',
      title: 'Lista Atualizada',
      showConfirmButton: false,
      timer: 1000
    });

  }

  public addCustasProcessoList() {

    this.inserirAcrescimosDeducoesList();

  }


  public showChildModalCustasProcesso(): void {
    this.custasProcessoModal.show();
  }

  public hideChildModalCustasProcesso(): void {
    this.custasProcessoModal.hide();
  }


}
