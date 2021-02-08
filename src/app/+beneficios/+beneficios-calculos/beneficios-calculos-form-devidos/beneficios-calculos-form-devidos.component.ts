
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

    if (this.isEmptyInput(this.especieValoresDevidos)) {
      this.errors.add({ 'especieValoresDevidos': ['Selecione uma opção.'] });
      valid = false;
    }

    if (this.isEmptyInput(this.dibValoresDevidos)) {
      this.errors.add({ 'dibValoresDevidos': ['A DIB de Valores Devidos é Necessária.'] });
      valid = false;
    } else if (!this.isValidDate(this.dibValoresDevidos)) {
      this.errors.add({ 'dibValoresDevidos': ['Insira uma data Válida.'] });
      valid = false;
    } else if (moment(this.dibValoresDevidos, 'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({ 'dibValoresDevidos': ['A data deve ser maior que 01/1970'] });
      valid = false;
    }

    if (this.isEmptyInput(this.dipValoresDevidos)) {
      this.errors.add({ 'dipValoresDevidos': ['A DIP é obrigatoria.'] });
      valid = false;
    } else {

      if (!this.isValidDate(this.dipValoresDevidos)) {
        this.errors.add({ 'dipValoresDevidos': ['Insira uma data Válida.'] });
        valid = false;
      } else if (moment(this.dipValoresDevidos, 'DD/MM/YYYY') < moment(this.dibValoresDevidos, 'DD/MM/YYYY')) {
        this.errors.add({ 'dipValoresDevidos': ['A data deve ser maior que a dib'] });
        valid = false;
      }
    }

    if (this.isEmptyInput(this.rmiValoresDevidos)) {
      this.errors.add({ 'rmiValoresDevidos': ['A RMI de Valores Devidos é Necessária.'] });
      valid = false;
    } else if (this.rmiValoresDevidos == 0) {
      this.errors.add({ 'rmiValoresDevidos': ['A RMI de Valores Devidos deve ser maior que zero.'] });
      valid = false;
    }

    if (!this.isEmptyInput(this.dibAnteriorValoresDevidos)) {

      if (!this.isValidDate(this.dibAnteriorValoresDevidos)) {
        this.errors.add({ 'dibAnteriorValoresDevidos': ['Insira uma data válida.'] });
        valid = false;
      } else if (moment(this.dibAnteriorValoresDevidos, 'DD/MM/YYYY') < this.dataMinima) {
        this.errors.add({ 'dibAnteriorValoresDevidos': ['A data deve ser maior que 01/1970.'] });
        valid = false;
      }
    }

    if (this.isEmptyInput(this.cessacaoValoresDevidos)) {
      this.errors.add({ 'cessacaoValoresDevidos': ['A Data Final dos Atrasados é Necessária.'] });
      valid = false;
    } if (!this.isValidDate(this.cessacaoValoresDevidos)) {
      this.errors.add({ 'cessacaoValoresDevidos': ['Insira uma data válida.'] });
      valid = false;
    } else if (moment(this.cessacaoValoresDevidos, 'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({ 'cessacaoValoresDevidos': ['A data deve ser maior que 01/1970.'] });
      valid = false;
    }

    if (this.especieValoresDevidos === 22 && this.numDependentes >= 20) {
      this.errors.add({ 'numDependentes': ['O valor deve ser nenor que 20'] });
    }

    if (this.adicional25Devido) {
      if (!this.isValidDate(this.dataInicialadicional25Devido)) {
        this.errors.add({ 'dataInicialadicional25Devido': ['Insira uma data válida.'] });
        valid = false;
      }
    }

    return valid;

  }

  public addDevidosList() {

    if (!this.adicional25Devido) {
      this.dataInicialadicional25Devido = '';
    }

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
      this.naoAplicarSMBeneficioEsperado,
      this.dataInicialadicional25Devido
    );


    if (this.validDevido()) {

      this.listDevidos = [];
      this.listDevidos.push(devidoMultiplo);
      this.devidosAtributes.emit(this.listDevidos);
      this.hideChildModalDevidos();

    } else {

      swal({
        position: 'bottom-end',
        type: 'error',
        title: 'Verifique as informações do formulário',
        showConfirmButton: false,
        timer: 4000
      });

    }

  }


  public updateDevidoList(event, rowDevidosEdit) {
    this.addDevidosList();
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
    this.dataInicialadicional25Devido = rowEdit.dataAdicional25;

    if (rowEdit.dataAdicional25 !== undefined && rowEdit.dataAdicional25 !== '') {
      this.adicional25Devido = true;
    }
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
