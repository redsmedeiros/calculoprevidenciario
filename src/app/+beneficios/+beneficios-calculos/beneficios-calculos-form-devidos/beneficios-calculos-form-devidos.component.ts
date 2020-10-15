
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BeneficiosCalculosFormComponent } from './../beneficios-calculos-form/beneficios-calculos-form.component';
import { ErrorService } from '../../../services/error.service';
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

  constructor() {
    super(null, null, null);
  }



  ngOnInit() {
    console.log(this.errors);
    console.log(this.formData);
    console.log(this.type);
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
