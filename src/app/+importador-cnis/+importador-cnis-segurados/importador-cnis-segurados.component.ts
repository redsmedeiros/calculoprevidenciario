
import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
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

  public countSeguradoErros = 0;

  @Input() segurado;
  @Input() isUpdating;
  @Input() dadosPassoaPasso;
  @Output() eventCountSeguradoErros = new EventEmitter();


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

    const changedsegurado = changes['segurado'];
    const changedisUpdating = changes['isUpdating'];

    if (!changedisUpdating.currentValue) {

      this.setFormSegurado(this.segurado);

      if (this.dadosPassoaPasso !== undefined
        && this.dadosPassoaPasso.origem === 'passo-a-passo'
        && this.dadosPassoaPasso.type === 'seguradoExistente'
      ) {

        this.getSegurado(this.segurado)

      } else {

        this.formData.id_documento = '3';

      }

    }

    console.log(changedsegurado);
    console.log(this.segurado);
    // console.log(changedisUpdating);

  }


  private setFormSegurado(segurado) {

    this.formData.nome = segurado.nome;
    this.formData.id_documento = (segurado.id_documento !== 'undefined') ? segurado.id_documento : '';
    this.formData.numero_documento = (segurado.numero_documento !== 'undefined') ? segurado.numero_documento : '';
    this.formData.data_nascimento = segurado.data_nascimento;
    this.formData.sexo = (segurado.sexo !== undefined) ? segurado.sexo : '';
    this.formData.data_filiacao = (segurado.data_filiacao !== undefined) ? segurado.data_filiacao : '';
    this.formData.funcao = segurado.funcao;
    this.formData.user_id = (segurado.userId !== 'undefined') ? segurado.userId : segurado.user_id;

    if (typeof segurado.id !== 'undefined') {
      this.formData.id = segurado.id;
    }

  }

  private getSegurado(seguradoSelecionado) {

    this.Segurado.find(seguradoSelecionado.id)
      .then(segurado => {
        this.segurado = segurado;
        this.formData = this.segurado;
      });

  }






  public updateSeguradoImportador(userId) {

    this.formData.user_id = userId;
    return this.Segurado
      .update(this.segurado)
      .then((modelSeg: SeguradoModel) => {
        console.log(modelSeg);
        return modelSeg.id
      })
      .catch(errors => this.errors.add(errors));

  }



  public createSeguradoImportador(userId) {

    // this.formData.user_id = this.userId;

    return this.Segurado.save(this.formData)
      .then((model: SeguradoModel) => {
        return model.id;
      })
      .catch(errors => this.errors.add(errors));

  }


  validate() {

    this.countSeguradoErros = 0;
    this.errors.clear();

    if (this.formData.nome == undefined || this.formData.nome == '') {
      this.errors.add({ 'nome': ['O Nome é obrigatório.'] });
      this.countSeguradoErros++;
    }



    if (this.formData.data_nascimento == undefined || this.formData.data_nascimento == '') {
      this.errors.add({ 'data_nascimento': ['A data de nascimento é obrigatória.'] });
      this.countSeguradoErros++;
    } else {

      let dateParts = this.formData.data_nascimento.split('/');
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);

      if (isNaN(date.getTime())) {
        this.errors.add({ 'data_nascimento': ['Insira uma data válida.'] });
        this.countSeguradoErros++;
      }
    }


    if (this.formData.data_filiacao == undefined || this.formData.data_filiacao == '') {
      this.errors.add({ 'data_filiacao': ['A data de filiação é obrigatória.'] });
      this.countSeguradoErros++;
    } else {
      let dateParts = this.formData.data_filiacao.split('/');
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);

      if (isNaN(date.getTime())) {
        this.errors.add({ 'data_filiacao': ['Insira uma data válida.'] });
        this.countSeguradoErros++;
      }
    }

    if (this.formData.sexo == undefined || this.formData.sexo == '') {
      this.errors.add({ 'sexo': ['O campo sexo é obrigatório.'] });
      this.countSeguradoErros++;
    }

    // if (this.formData.id_documento == undefined || this.formData.id_documento == '') {
    //   this.errors.add({ 'id_documento': ['O Tipo de Documento é obrigatório.'] });
    //   this.countSeguradoErros++;
    // }

    // if (this.formData.numero_documento == undefined || this.formData.id_documento == ''
    //   || !this.formData.numero_documento || this.formData.numero_documento == '') {
    //   this.errors.add({ 'numero_documento': ['O Número do Documento é obrigatório.'] });
    //   this.countSeguradoErros++;
    // } else {
    //   let documentNumber = this.formData.numero_documento.replace(/[^\w]/gi, '').replace(/\_/gi, '');
    //   let id = this.formData.id_documento.toString();
    // }

    this.eventCountSeguradoErros.emit(this.countSeguradoErros);
    return { count: this.countSeguradoErros, erros: this.errors };
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
