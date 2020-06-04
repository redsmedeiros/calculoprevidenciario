
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
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
export class BeneficiosCalculosFormRecebidosComponent  implements OnInit  {


  @Input() formData;
  @Input() type;

  @ViewChild('recebidosModal') public recebidosModal: ModalDirective;



  public especieValoresRecebidosChild = null;

  
  public especieValoresOptionsChild = [
    {
      name: '- Selecione uma opção -',
      value: ''
    }, {
      name: 'Auxílio Doença',
      value: 0
    }, {
      name: 'Aposentadoria por Invalidez ',
      value: 1
    }, {
      name: 'Pensão por Morte',
      value: 22
    }, {
      name: 'Aposentadoria por Idade - Trabalhador Urbano',
      value: 2
    }, {
      name: 'Aposentadoria por Idade - Trabalhador Rural',
      value: 7
    }, {
      name: 'Aposentadoria por Tempo de Contribuição',
      value: 3
    }, {
      name: 'Aposentadoria Especial',
      value: 4
    }, {
      name: 'Aposentadoria por Tempo de Contribuição Professor',
      value: 5
    }, {
      name: 'Auxílio Acidente - 30%',
      value: 8
    }, {
      name: 'Auxílio Acidente - 40%',
      value: 9
    }, {
      name: 'Auxílio Acidente - 50%',
      value: 6
    }, {
      name: 'Auxílio Acidente - 60%',
      value: 10
    }, {
      name: 'Abono de Permanência em Serviço',
      value: 11
    }, {
      name: 'Benefício de Prestação Continuada - BPC ', // (salário mínimo)
      value: 12
    }, {
      name: 'Aposentadoria Pessoa com Deficiência',
      value: 13
    }, {
      name: 'Aposentadoria por Idade da Pessoa com Deficiência',
      value: 16
    }
  ];


  constructor(
    protected errors: ErrorService,
  ) { }

  ngOnInit() {
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
