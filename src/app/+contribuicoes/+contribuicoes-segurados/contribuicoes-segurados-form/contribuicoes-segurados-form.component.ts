import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-contribuicoes-segurados-form',
  templateUrl: './contribuicoes-segurados-form.component.html',
  styleUrls: ['./contribuicoes-segurados-form.component.css']
})
export class ContribuicoesSeguradosFormComponent {

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public docMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  @Input() formData;
  @Input() errors: ErrorService;
  @Output() onSubmit = new EventEmitter;

  public submit(e) {
    e.preventDefault();

    if (!localStorage.getItem('user_id')) {
      swal('Erro', 'Falha de login!', 'error').then(() => { window.location.href = environment.loginPageUrl; });
    }

    this.validate();

    if (this.errors.empty()) {
      //  swal('Sucesso', 'Segurado salvo com sucesso', 'success');
      swal({
        type: 'success',
        title: 'Segurado salvo com sucesso',
        text: '',
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 1500
      });
      
      this.formData.funcao = 'contribuicao';
      this.formData.user_id = localStorage.getItem('user_id');
      this.onSubmit.emit(this.formData);
    }
    else {
      //  swal('Erro', 'Confira os dados digitados', 'error');
      swal({
        type: 'error',
        title: 'Confira os dados digitados',
        text: '',
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 1500
      });
    }
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    // setTimeout(() => {
    //   this.changeDocumentMask();
    // },200)
  }

  validate() {
    if (this.formData.nome == undefined || this.formData.nome == '') {
      this.errors.add({ 'nome': ['O Nome é obrigatório.'] });
    }

    if (this.formData.data_nascimento == undefined || this.formData.data_nascimento == '') {
      this.errors.add({ 'data_nascimento': ['A data de nascimento é obrigatória.'] });
    } else {
      var dateParts = this.formData.data_nascimento.split('/');
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      if (isNaN(date.getTime()))
        this.errors.add({ 'data_nascimento': ['Insira uma data válida.'] });
    }

    if (this.formData.sexo == undefined || this.formData.sexo == '') {
      this.errors.add({ 'sexo': ['O campo sexo é obrigatório.'] });
    }


    // if(this.formData.id_documento == undefined || this.formData.id_documento == '') {
    //   this.errors.add({"id_documento":["O Tipo de Documento é obrigatório."]});
    // }

    // if(this.formData.numero_documento == undefined || this.formData.id_documento == '') {
    //   this.errors.add({"numero_documento":["O Número do Documento é obrigatório."]});
    // } else {
    //   let documentNumber = this.formData.numero_documento.replace(/[^\w]/gi, '').replace(/\_/gi,'');
    //   let id = this.formData.id_documento.toString();
    // switch (id) {
    //   case '1': //PIS
    //     if (!this.validatePIS(parseInt(documentNumber)))
    //       this.errors.add({"numero_documento":["PIS inválido."]});
    //     break;

    //   case '2': //PASEP
    //     if (!this.validatePIS(parseInt(documentNumber)))
    //       this.errors.add({"numero_documento":["PASEP inválido."]});
    //     break;

    //   case '3': //CPF
    //     if (!this.validateCPF(documentNumber))
    //       this.errors.add({"numero_documento":["CPF inválido."]});
    //     break;

    //   case '4': //NIT
    //     if (!this.validatePIS(parseInt(documentNumber)))
    //       this.errors.add({"numero_documento":["NIT inválido."]});
    //     break;

    //   case '5': //RG
    //     if (!this.validateRG(documentNumber))
    //       this.errors.add({"numero_documento":["RG inválido."]});
    //     break;

    //   default:
    //     break;
    // }
    //}


  }

  /*
  // changeDocumentMask() {
  //   this.errors.clear('id_documento');
  //   this.errors.clear('numero_documento');
  //   let id = this.formData.id_documento.toString();
    // switch (id) {
    //   case '1': // PIS
    //     this.docMask = [/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,/\d/,/\d/,'.',/\d/,/\d/,'-',/\d/];
    //     break;

    //   case '2': // PASEP
    //     this.docMask = [/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,/\d/,/\d/,'.',/\d/,/\d/,'-',/\d/];
    //     break;

    //   case '3': // CPF
    //     this.docMask = [/\d/, /\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/];
    //     break;

    //   case '4': // NIT
    //     this.docMask = [/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,/\d/,/\d/,'.',/\d/,/\d/,'-',/\d/];
    //     break;

    //   case '5': // RG
    //     this.docMask = [/\d/, /\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/];
    //     break;

    //   default:
    //     this.docMask = [/\d/, /\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/];
    //     break;
    // }
  // }

  validatePIS(pis: number) {

    var ftap="3298765432";
    var total=0;
    var resto=0;
    var strResto="";
 
    var numPIS=pis.toString();
      
    var resultado;
    for(let i=0;i<=9;i++)
    {
      resultado = parseInt((numPIS.slice(i,i+1)))*parseInt(ftap.slice(i,i+1));
      total=total+resultado;
    }
  
    resto = (total % 11)
  
    if (resto != 0)
    {
      resto=11-resto;
    }
  
    if (resto==10 || resto==11)
    {
      strResto=resto+"";
      resto = parseInt(strResto.slice(1,2));
    }
  
    if (resto!=parseInt(numPIS.slice(10,11)))
    {
      return false;
    }
  
    return true;
  }

  validateCPF(cpf) {

    cpf =cpf.replace(/[^0-9]/g,'');

    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11)
          return false;

    for (i = 0; i < cpf.length - 1; i++)
      if (cpf.charAt(i) != cpf.charAt(i + 1)) {
        digitos_iguais = 0;
        break;
      }

    if (!digitos_iguais) {

      numeros = cpf.substring(0,9);
      digitos = cpf.substring(9);
      soma = 0;
      for (i = 10; i > 1; i--)
        soma += numeros.charAt(10 - i) * i;

      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

      if (resultado != digitos.charAt(0))
        return false;

      numeros = cpf.substring(0,10);
      soma = 0;

      for (i = 11; i > 1; i--)
        soma += numeros.charAt(11 - i) * i;

      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

      if (resultado != digitos.charAt(1))
        return false;

    return true;

    } else
    return false;
  }

  validateRG(rg) {
    if (rg.length != 9)
      return false;
    return true;
  }
*/
}
