
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BeneficiosCalculosFormComponent } from './../beneficios-calculos-form/beneficios-calculos-form.component';
import { ErrorService } from '../../../services/error.service';
import { Devidos } from './Devidos.model';
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-beneficios-calculos-form-devidos',
  templateUrl: './beneficios-calculos-form-devidos.component.html',
  styleUrls: ['./beneficios-calculos-form-devidos.component.css'],
  providers: [
    ErrorService
  ]
})
export class BeneficiosCalculosFormDevidosComponent extends BeneficiosCalculosFormComponent implements OnInit {


  @Input() formData;
  @Input() errors;
  @Input() isEdit;
  @Input() listDevidos;
  @Input() isUpdatingDevidos;

  @ViewChild('devidosModal') public devidosModal: ModalDirective;
  @Output() devidosAtributes = new EventEmitter();


  constructor() {
    super(null, null, null);
  }


  ngOnInit() {
    // console.log(this.errors);
    // console.log(this.formData);
    // console.log(this.type);
  }


  private validDevido() {

    let valid = true;
    this.errors.clear();







    return valid;

  }

  public addDevidosList() {

    const devidoMultiplo = new Devidos(
      this.listDevidos.length + 1,
      this.especieValoresDevidos,
      this.numeroBeneficioDevido,
      this.dibValoresDevidos,
      this.dipValoresDevidos,
      this.cessacaoValoresDevidos,
      this.dibAnteriorValoresDevidos,
      this.rmiValoresDevidos,
      this.rmiValoresDevidosBuracoNegro,
      this.taxaAjusteMaximaEsperada,
      this.naoAplicarSMBeneficioEsperado);


    if (this.validDevido()) {

      this.listDevidos.push(devidoMultiplo);
      this.devidosAtributes.emit(this.listDevidos)
    }

  }


  public updateDevidoList(event, rowDevidosEdit) {
    this.listDevidos = [];
    this.addDevidosList();
    this.hideChildModalDevidos();
  }


  public getupdatePeriodoDevidoList(id) {
    this.seTFormDevido(this.listDevidos[0]);
    this.showChildModalDevidos();
  }


  private seTFormDevido(rowEdit) {
    this.rowDevidosEdit = rowEdit.id;
    this.especieValoresDevidos = rowEdit.especie;
    this.numeroBeneficioDevido = rowEdit.numeroBeneficio;
    this.dibValoresDevidos = rowEdit.dib;
    this.dipValoresDevidos = rowEdit.dip;
    this.cessacaoValoresDevidos = rowEdit.cessacao;
    this.dibAnteriorValoresDevidos = rowEdit.dibAnterior;
    this.rmiValoresDevidos = rowEdit.rmi;
    this.rmiValoresDevidosBuracoNegro = rowEdit.rmiBuracoNegro;
    this.taxaAjusteMaximaEsperada = rowEdit.irt;
    this.naoAplicarSMBeneficioEsperado = rowEdit.reajusteMinimo;
  }

  public showChildModalDevidos(): void {
    this.devidosModal.show();
  }

  public hideChildModalDevidos(): void {
    this.devidosModal.hide();
  }



  public isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }


}
