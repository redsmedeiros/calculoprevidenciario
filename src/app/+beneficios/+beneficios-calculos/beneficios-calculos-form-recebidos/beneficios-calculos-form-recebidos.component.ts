import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { BeneficiosCalculosFormComponent } from './../beneficios-calculos-form/beneficios-calculos-form.component';
import { ErrorService } from '../../../services/error.service';
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
export class BeneficiosCalculosFormRecebidosComponent extends BeneficiosCalculosFormComponent implements OnInit  {


  @Input() formData;
  @Input() errors;
  @Input() isEdit;
  @Input() listRecebidos;
  @Input() isUpdatingRecebido;

  @ViewChild('recebidosModal') public recebidosModal: ModalDirective;



  // constructor(
  //  // protected errors: ErrorService,
  // ) { }

  constructor(  ) {
    super( null, null, null);
  }

  ngOnInit() {
    console.log( this.errors);
    console.log( this.formData);
    console.log( this.type);
  }



  validateInputs() {

    this.errors.clear();

    let valid = true;
    

    return valid;
  }

  public showChildModal(): void {
    this.recebidosModal.show();
  }

  public hideChildModal(): void {
    this.recebidosModal.hide();
  }



 public isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }



}
