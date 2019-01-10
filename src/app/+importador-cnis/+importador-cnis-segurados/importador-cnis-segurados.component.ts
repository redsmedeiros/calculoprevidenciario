
import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from 'app/services/error.service';

import swal from 'sweetalert';
import { environment } from '../../../../environments/environment';

import { SeguradoContagemTempo as SeguradoModel } from 'app/+contagem-tempo/+contagem-tempo-segurados/SeguradoContagemTempo.model';
import { SeguradoService } from 'app/+contagem-tempo/+contagem-tempo-segurados/SeguradoContagemTempo.service';


@Component({
  selector: 'app-importador-cnis-segurados',
  templateUrl: './importador-cnis-segurados.component.html',
  styleUrls: ['./importador-cnis-segurados.component.css'],
  providers: [
    ErrorService,
  ],
})
export class ImportadorCnisSeguradosComponent implements OnInit, OnChanges {

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public docMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  @Input() segurado;
  @Input() isUpdating;

  public formData = { ...SeguradoModel.form };


  constructor(
    protected Segurado: SeguradoService,
    protected errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {

    setTimeout(() => {
      this.changeDocumentMask();
    }, 200);

  }




  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    let changedsegurado = changes['segurado'];
    let changedisUpdating = changes['isUpdating'];

    console.log(changedsegurado);
    console.log(changedisUpdating);
    
    if (!changedisUpdating.currentValue) {
      this.setSegurado(this.segurado)
    }

  }


  private setSegurado(segurado) {
    this.formData.nome = segurado.nome;
    this.formData.id_documento = '3';
    this.formData.numero_documento = segurado.cpf;
    this.formData.data_nascimento = segurado.dataNasc;

  }


  validate() {
    if (this.formData.nome == undefined || this.formData.nome == '') {
      this.errors.add({ 'nome': ['O Nome é obrigatório.'] });
    }

    if (this.formData.id_documento == undefined || this.formData.id_documento == '') {
      this.errors.add({ 'id_documento': ['O Tipo de Documento é obrigatório.'] });
    }

    if (this.formData.numero_documento == undefined || this.formData.id_documento == '') {
      this.errors.add({ 'numero_documento': ['O Número do Documento é obrigatório.'] });
    } else {
      let documentNumber = this.formData.numero_documento.replace(/[^\w]/gi, '').replace(/\_/gi, '');
      let id = this.formData.id_documento.toString();
    }

    if (this.formData.data_nascimento == undefined || this.formData.data_nascimento == '') {
      this.errors.add({ 'data_nascimento': ['A data de nascimento é obrigatória.'] });
    } else {
      var dateParts = this.formData.data_nascimento.split('/');
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      if (isNaN(date.getTime()))
        this.errors.add({ 'data_nascimento': ['Insira uma data válida.'] });
    }

    if (this.formData.data_filiacao == undefined || this.formData.data_filiacao == '') {
      // this.errors.add({ 'data_filiacao': ['A data de filiação é obrigatória.'] });
    } else {
      var dateParts = this.formData.data_filiacao.split('/');
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      if (isNaN(date.getTime()))
        this.errors.add({ 'data_filiacao': ['Insira uma data válida.'] });
    }

    if (this.formData.sexo == undefined || this.formData.sexo == '') {
      this.errors.add({ 'sexo': ['O campo sexo é obrigatório.'] });
    }

  }


  changeDocumentMask() {
    this.errors.clear('id_documento');
    this.errors.clear('numero_documento');
    let id = this.formData.id_documento.toString();
  }

  getDocumentType(id_documento) {
    switch (id_documento) {
      case 1:
        return 'PIS';
      case 2:
        return 'PASEP';
      case 3:
        return 'CPF';
      case 4:
        return 'NIT';
      case 5:
        return 'RG';
      default:
        return ''
    }
  }

}
