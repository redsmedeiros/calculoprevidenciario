import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BeneficiosCalculosFormComponent } from './../beneficios-calculos-form/beneficios-calculos-form.component';
import { ErrorService } from '../../../services/error.service';
import { Recebidos } from './Recebidos.model';
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-beneficios-calculos-form-recebidos',
  templateUrl: './beneficios-calculos-form-recebidos.component.html',
  styleUrls: ['./beneficios-calculos-form-recebidos.component.css'],
  providers: [
    ErrorService
  ]
})
export class BeneficiosCalculosFormRecebidosComponent extends BeneficiosCalculosFormComponent implements OnInit {


  @Input() formData;
  @Input() errors;
  @Input() isEdit;
  @Input() listRecebidos;
  @Input() isUpdatingRecebido;

  @ViewChild('recebidosModal') public recebidosModal: ModalDirective;
  @Output() recebidosAtributes = new EventEmitter();



  // constructor(
  //  // protected errors: ErrorService,
  // ) { }

  constructor() {
    super(null, null, null);
  }

  ngOnInit() {
    // console.log( this.errors);
    // console.log( this.formData);
    // console.log( this.type);
  }



  ngAfterViewInit() {
    this.checkImportBeneficioAtrasadoRecebidos();
  }

  checkImportBeneficioAtrasadoRecebidos() {


    let rst = null;
    if (sessionStorage.exportBeneficioAtrasado && sessionStorage.exportBeneficioAtrasado != undefined) {
      // this.resetForm();
      rst = this.importRGPS();

      if (rst.tipoCalculo === 'AJ') {
        setTimeout(() => {
          this.dibValoresRecebidos = rst.dib;
          this.dipValoresRecebidos = rst.dib;
          this.rmiValoresRecebidos = rst.valorRgps;
          this.showChildModalRecebidos();

          sessionStorage.removeItem('exportBeneficioAtrasado');
        }, 2000)


      }


    }

  }


  // inicio

  private validatePeriodoRecebidos(recebidoMultiplo) {

    if (this.listRecebidos.length === 0) {
      return true;
    }

    // &&
    //     (moment(recebidoMultiplo.dip, 'DD/MM/YYYY')).isBetween(
    //       moment(Obj.dip, 'DD/MM/YYYY'),
    //       moment(Obj.cessacao, 'DD/MM/YYYY'), undefined, '[]')

    const isExistConcomitante = this.listRecebidos.find(Obj => (
      ((moment(recebidoMultiplo.dip, 'DD/MM/YYYY')).isBetween(
        moment(Obj.dip, 'DD/MM/YYYY'),
        moment(Obj.cessacao, 'DD/MM/YYYY'), undefined, '[]'))
      ||
      (moment(recebidoMultiplo.cessacao, 'DD/MM/YYYY')).isBetween(
        moment(Obj.dip, 'DD/MM/YYYY'),
        moment(Obj.cessacao, 'DD/MM/YYYY'), undefined, '[]')
    ));

    return (isExistConcomitante === undefined);
  }

  private inserirRecebidoList(event = null) {


    if (this.recebidosBuracoNegro) {
      this.rmiValoresRecebidosBuracoNegro = this.rmiValoresRecebidos;
    }

    const recebidoMultiplo = new Recebidos(
      ((this.isExits(this.rowRecebidosEdit)) ? this.rowRecebidosEdit : this.listRecebidos.length + 1),
      this.especieValoresRecebidos,
      this.numeroBeneficioRecebido,
      this.dibValoresRecebidos,
      this.dipValoresRecebidos,
      this.cessacaoValoresRecebidos,
      this.dibAnteriorValoresRecebidos,
      this.rmiValoresRecebidos,
      this.rmiValoresRecebidosBuracoNegro,
      this.taxaAjusteMaximaConcedida,
      this.naoAplicarSMBeneficioConcedido,
      this.dataInicialadicional2Recebido,
      this.calcularAbono13UltimoMesRecebidos,
      this.manterPercentualSMConcedido,
      this.parcRecConcedido,
      this.dataParcRecConcedido,
      );

    let statusInput = true;

    if (!this.validRecebidos()) {

      statusInput = false;

      swal({
        position: 'bottom-end',
        type: 'error',
        title: 'Verifique as informa????es do per??odo recebido.',
        showConfirmButton: false,
        timer: 1000
      });
    }

    if (statusInput && !this.validatePeriodoRecebidos(recebidoMultiplo)) {

      statusInput = false;

      swal({
        position: 'bottom-end',
        type: 'error',
        title: 'O per??do de Benef??cio Recebido n??o deve ser concomitante.',
        showConfirmButton: false,
        timer: 4000
      });

    }


    if (statusInput) {

      this.updateDatatableRecebidos(recebidoMultiplo);
      this.clearFormRecebido();
      this.hideChildModalRecebidos();

      swal({
        position: 'bottom-end',
        type: 'success',
        title: 'Lista de Per??odos Atualizada',
        showConfirmButton: false,
        timer: 1000
      });

    }

  }

  private deletePeriodoRecebidoList(id) {

    this.listRecebidos = this.listRecebidos.filter(row => row.id !== id);
    this.recebidosAtributes.emit(this.listRecebidos);

    swal({
      position: 'bottom-end',
      type: 'success',
      title: 'Lista de Per??odos Atualizada',
      showConfirmButton: false,
      timer: 1000
    });
  }


  private updateRecebidoList(event, rowRecebidosEdit) {
    this.listRecebidos = this.listRecebidos.filter(row => row.id !== rowRecebidosEdit);
    this.inserirRecebidoList();
    this.rowRecebidosEdit = null;
  }

  private getupdatePeriodoRecebidoList(id) {
    const rowEdit = (this.listRecebidos.filter(row => row.id === id))[0];
    this.seTFormRecebido(rowEdit);
    this.showChildModalRecebidos();
  }

  private seTFormRecebido(rowEdit) {

    this.rowRecebidosEdit = rowEdit.id;
    this.especieValoresRecebidos = rowEdit.especie;
    this.numeroBeneficioRecebido = rowEdit.numeroBeneficio;
    this.dibValoresRecebidos = rowEdit.dib;
    this.dipValoresRecebidos = rowEdit.dip;
    this.cessacaoValoresRecebidos = rowEdit.cessacao;
    this.dibAnteriorValoresRecebidos = rowEdit.dibAnterior;
    this.rmiValoresRecebidos = rowEdit.rmi;
    this.rmiValoresRecebidosBuracoNegro = rowEdit.rmiBuracoNegro;
    this.taxaAjusteMaximaConcedida = rowEdit.irt;
    this.naoAplicarSMBeneficioConcedido = rowEdit.reajusteMinimo;
    this.dataInicialadicional2Recebido = rowEdit.dataAdicional25;
    this.calcularAbono13UltimoMesRecebidos = rowEdit.abono13Ultimo;
    this.manterPercentualSMConcedido = rowEdit.manterPercentualSMConcedido;
    this.parcRecConcedido = rowEdit.parcRecConcedido;
    this.dataParcRecConcedido = rowEdit.dataParcRecConcedido;

    if (rowEdit.dataAdicional25 != undefined && rowEdit.dataAdicional25 != '') {
      this.adicional25Recebido = true;
    }

    this.checkRecebidosBuracoNegro();
  }


  private clearFormRecebido() {

    this.especieValoresRecebidos = '';
    this.numeroBeneficioRecebido = '';
    this.dibValoresRecebidos = '';
    this.dipValoresRecebidos = '';
    this.cessacaoValoresRecebidos = '';
    this.dibAnteriorValoresRecebidos = '';
    this.rmiValoresRecebidos = '';
    this.rmiValoresRecebidosBuracoNegro = '';
    this.taxaAjusteMaximaConcedida = '';
    this.naoAplicarSMBeneficioConcedido = false;
    this.dataInicialadicional2Recebido = '';
    this.calcularAbono13UltimoMesRecebidos = false;
    this.manterPercentualSMConcedido = false;
    this.parcRecConcedido = false;
    this.dataParcRecConcedido = '';
  }


  private updateDatatableRecebidos(recebidos) {

    if (typeof recebidos === 'object') {

      this.listRecebidos.push(recebidos);
      this.listRecebidos = this.ordenarLista(this.listRecebidos);

      this.recebidosAtributes.emit(this.listRecebidos);
    }
  }

  // private ordenarLista(){

  //   this.listRecebidos.sort((a, b) => {

  //     const dib1 = moment(a.dib, 'DD/MM/YYYY');
  //     const dib2 = moment(b.dib, 'DD/MM/YYYY');

  //     const dip1 = moment(a.dip, 'DD/MM/YYYY');
  //     const dip2 = moment(b.dip, 'DD/MM/YYYY');

  //     console.log(a.dib)
  //     console.log(a.dip)

  //     if (dib1.isSame(dib2)) {
  //       return dip1 < dip2 ? -1 : 1
  //     } else {
  //       return dib1 > dib2 ? -1 : 1
  //     }

  //   });
  // }


  validRecebidos() {

    let valid = true;
    this.errors.clear();

    // Check if its necessary to validate the box of 'Valores Recebidos'
    // if (!this.isEmptyInput(this.especieValoresRecebidos) ||
    //   !this.isEmptyInput(this.dibValoresRecebidos) ||
    //   !this.isEmptyInput(this.cessacaoValoresRecebidos) ||
    //   !this.isEmptyInput(this.rmiValoresRecebidos) ||
    //   !this.isEmptyInput(this.dibAnteriorValoresRecebidos)) {

    if (this.isEmptyInput(this.especieValoresRecebidos) && this.especieValoresRecebidos !== 0) {
      this.errors.add({ 'especieValoresRecebidos': ['Selecione uma op????o.'] });
      valid = false;
    } else if (this.especieValoresRecebidos === '2021' || this.especieValoresRecebidos === 2021) {


      if (moment(this.dibValoresRecebidos, 'DD/MM/YYYY').isBefore('2020-01-01')) {
        this.errors.add({ 'dibValoresRecebidos': ['A data deve ser maior que 01/01/2020'] });
        valid = false;
      }

      if (moment(this.dipValoresRecebidos, 'DD/MM/YYYY').isBefore('2020-01-01')) {
        this.errors.add({ 'dipValoresRecebidos': ['A data deve ser maior que 01/01/2020'] });
        valid = false;
      }

      if (moment(this.cessacaoValoresRecebidos, 'DD/MM/YYYY').isBefore('2020-01-01')) {
        this.errors.add({ 'cessacaoValoresRecebidos': ['A data deve ser maior que 01/01/2020'] });
        valid = false;
      }

    }

    if (this.isEmptyInput(this.dibValoresRecebidos)) {
      this.errors.add({ 'dibValoresRecebidos': ['A DIB ?? obrigatoria.'] });
      valid = false;
    } else {

      if (!this.isValidDate(this.dibValoresRecebidos)) {
        this.errors.add({ 'dibValoresRecebidos': ['Insira uma data V??lida.'] });
        valid = false;
      } else if (moment(this.dibValoresRecebidos, 'DD/MM/YYYY') < this.dataMinima) {
        this.errors.add({ 'dibValoresRecebidos': ['A data deve ser maior que 01/1970'] });
        valid = false;
      } else if (moment(this.dibValoresRecebidos, 'DD/MM/YYYY') > moment()) {
        this.errors.add({ 'dibValoresRecebidos': ['A data n??o deve ser maior data atual'] });
        valid = false;
      }

    }

    if (this.isEmptyInput(this.dipValoresRecebidos)) {
      this.errors.add({ 'dipValoresRecebidos': ['A DIP ?? obrigatoria.'] });
      valid = false;
    } else {

      if (!this.isValidDate(this.dipValoresRecebidos)) {
        this.errors.add({ 'dipValoresRecebidos': ['Insira uma data V??lida.'] });
        valid = false;
      } else if (moment(this.dipValoresRecebidos, 'DD/MM/YYYY') < this.dataMinima) {
        this.errors.add({ 'dipValoresRecebidos': ['A data deve ser maior que 01/1970'] });
        valid = false;
      } else if (moment(this.dipValoresRecebidos, 'DD/MM/YYYY') < moment(this.dibValoresRecebidos, 'DD/MM/YYYY')) {
        this.errors.add({ 'dipValoresRecebidos': ['A data deve ser maior que a DIB'] });
        valid = false;
      } else if (moment(this.dipValoresRecebidos, 'DD/MM/YYYY') > moment(this.cessacaoValoresRecebidos, 'DD/MM/YYYY')) {
        this.errors.add({ 'dipValoresRecebidos': ['A data n??o deve ser maior que a Cessa????o'] });
        valid = false;
      }


    }

    if (!this.isEmptyInput(this.cessacaoValoresRecebidos) &&
      !this.isValidDate(this.cessacaoValoresRecebidos) &&
      !this.isEmptyInput(this.dibValoresDevidos) &&
      !this.isValidDate(this.dibValoresDevidos) &&
      !this.compareDates(this.dibValoresDevidos, this.cessacaoValoresRecebidos)) {

      this.errors.add({ 'cessacaoValoresRecebidos': ['A Cessa????o de valores recebidos deve ser maior que a DIB de valores devidos.'] });
      valid = false;
    }

    if (this.isEmptyInput(this.rmiValoresRecebidos)) {
      this.errors.add({ 'rmiValoresRecebidos': ['A RMI de Valores Recebidos ?? Necess??ria.'] });
      valid = false;
    } else if (this.rmiValoresRecebidos == 0) {
      this.errors.add({ 'rmiValoresRecebidos': ['A RMI de Valores Recebidos deve ser maior que zero.'] });
      valid = false;
    }

    if (!this.isEmptyInput(this.dibAnteriorValoresRecebidos)) {

      if (!this.isValidDate(this.dibAnteriorValoresRecebidos)) {
        this.errors.add({ 'dibAnteriorValoresRecebidos': ['Insira uma data v??lida.'] });
        valid = false;
      } else if (moment(this.dibAnteriorValoresRecebidos, 'DD/MM/YYYY') < this.dataMinima) {
        this.errors.add({ 'dibAnteriorValoresRecebidos': ['A data deve ser maior que 01/1970'] });
        valid = false;
      }else if (moment(this.dibAnteriorValoresRecebidos, 'DD/MM/YYYY') > moment(this.dibValoresRecebidos, 'DD/MM/YYYY')) {
        this.errors.add({ 'dibAnteriorValoresRecebidos': ['A data deve ser menor que a DIB.'] });
        valid = false;
      }
    }


    if (this.isEmptyInput(this.cessacaoValoresRecebidos)) {
      this.errors.add({ 'cessacaoValoresRecebidos': ['A Data Final ?? obrigatoria.'] });
      valid = false;
    } else if (!this.isValidDate(this.cessacaoValoresRecebidos)) {
      this.errors.add({ 'cessacaoValoresRecebidos': ['Insira uma data v??lida.'] });
      valid = false;
    } else if (moment(this.cessacaoValoresRecebidos, 'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({ 'cessacaoValoresRecebidos': ['A data deve ser maior que 01/1970'] });
      valid = false;
    } else if (moment(this.cessacaoValoresRecebidos, 'DD/MM/YYYY') > moment()) {
      this.errors.add({ 'cessacaoValoresRecebidos': ['A data n??o deve ser maior que a data atual'] });
      valid = false;
    }

    if (this.adicional25Recebido) {
      if (!this.isValidDate(this.dataInicialadicional2Recebido)) {
        this.errors.add({ 'dataInicialadicional2Recebido': ['Insira uma data v??lida.'] });
        valid = false;
      } else if (moment(this.dataInicialadicional2Recebido, 'DD/MM/YYYY') < moment(this.dibValoresRecebidos, 'DD/MM/YYYY')) {
        this.errors.add({ 'dataInicialadicional2Recebido': ['A data deve ser maior ou igual que DIB.'] });
        valid = false;
      }
    }


    return valid;
  }


  dibValoresRecebidosChanged() {

    //  if (!this.dipValoresRecebidos && (this.dibValoresRecebidos !== undefined && this.dibValoresRecebidos !== '')) {
    this.dipValoresRecebidos = this.dibValoresRecebidos;
    // this.validRecebidos();
    //}

    if (this.chkUseSameDib) {
      if (this.dibValoresRecebidos !== undefined && this.dibValoresDevidos !== null) {
        this.updateDIBValoresDevidos();
      }
    }
    this.checkRecebidosBuracoNegro();
  }

  // fim



  validateInputs() {

    this.errors.clear();
    let valid = true;

    return valid;
  }

  public showChildModalRecebidos(): void {
    this.recebidosModal.show();
  }

  public hideChildModalRecebidos(): void {
    this.recebidosModal.hide();
  }



  public isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }



}
