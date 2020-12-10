import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import swal from 'sweetalert';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-rgps-segurados-form',
  templateUrl: './rgps-segurados-form.component.html',
  styleUrls: ['./rgps-segurados-form.component.css']
})
export class RgpsSeguradosFormComponent {

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public docMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  @Input() isEditForm;
  @Input() formData;
  @Input() errors: ErrorService;
  @Output() onSubmit = new EventEmitter;

  public submit(type, e) {
    e.preventDefault();

    if (!localStorage.getItem('user_id')) {
      swal('Erro', 'Falha de login!', 'error').then(() => { window.location.href = environment.loginPageUrl; });
    }

    this.validate();

    if (this.errors.empty()) {

      const swalSuccess = {
        position: 'top-end',
        icon: 'success',
        title: 'Confira os dados digitados',
        button: false,
        timer: 1500
      };

      swal(swalSuccess);

      //swal('Sucesso', 'Segurado salvo com sucesso','success');
      this.formData.funcao = "rgps";
      this.formData.user_id = localStorage.getItem('user_id');
      this.onSubmit.emit(this.formData);
    } else {

      const swalErrorConf = {
        position: 'top-end',
        icon: 'error',
        title: 'Confira os dados digitados',
        button: false,
        timer: 1500
      };

      swal(swalErrorConf);
      //swal('Erro', 'Confira os dados digitados','error');
    }
  }

  ngAfterContentInit() {
   
  }

  validate() {
    if (this.formData.nome == undefined || this.formData.nome == '') {
      this.errors.add({ "nome": ["O Nome é obrigatório."] });
    }

    if (this.formData.data_nascimento == undefined || this.formData.data_nascimento == "") {
      this.errors.add({ "data_nascimento": ["A data de Nascimento é obrigatória."] });
    } else {
      var dateParts = this.formData.data_nascimento.split("/");
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      if (isNaN(date.getTime()))
        this.errors.add({ "data_nascimento": ["Insira uma data válida."] });
    }

    if (this.formData.data_filiacao == undefined || this.formData.data_filiacao == "") {
      this.errors.add({ "data_filiacao": ["A data de filiação é obrigatória."] });
    } else {
      var dateParts = this.formData.data_filiacao.split("/");
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      if (isNaN(date.getTime()))
        this.errors.add({ "data_filiacao": ["Insira uma data válida ou deixe em branco."] });
    }

    if (this.formData.sexo == undefined || this.formData.sexo == '') {
      this.errors.add({ "sexo": ["O campo sexo é obrigatório."] });
    }



  }

}
