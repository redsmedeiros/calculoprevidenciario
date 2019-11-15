import { TransicaoResultadosComponent } from './../transicao-resultados/transicao-resultados.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { Auth } from '../../services/Auth/Auth.service';
import { AuthResponse } from '../../services/Auth/AuthResponse.model';
import { ErrorService } from '../../services/error.service';
import { environment } from '../../../environments/environment';
import swal from 'sweetalert';


@Component({
  selector: 'app-transicao-form',
  templateUrl: './transicao-form.component.html',
  styleUrls: ['./transicao-form.component.css'],
  providers: [
    ErrorService,
  ],
})
export class TransicaoFormComponent implements OnInit {

  public styleTheme = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];


  // segurado
  public nome;
  public idDocumento;
  public numeroDocumento;
  public dataNascimento;
  public dataFiliacao;
  public sexo;
  public professor;
  // Tempo de contribuição
  public contribuicaoAnos;
  public contribuicaoMeses;
  public contribuicaoDias;

  public seguradoTransicao: any;

  public hasResult = false;

  constructor(
    protected errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
    private Auth: Auth,
  ) { }

  ngOnInit() {

    if (!localStorage.getItem('user_id')) {
      swal('Erro', 'Falha de login!', 'error').then(() => { window.location.href = environment.loginPageUrl; });
    }

    this.nome = 'Segurado teste teste ';
    this.idDocumento = '';
    this.numeroDocumento = '';
    this.dataNascimento = '01/01/1956';
    this.sexo = 'm';
    this.professor = false;
    this.contribuicaoAnos = '33';
    this.contribuicaoMeses = '10';
    this.contribuicaoDias = '25';

  }


  ngAfterContentInit() {
    // setTimeout(() => {
    //   this.changeDocumentMask();
    // }, 200)
  }



  validate() {

    // if (this.nome == undefined || this.nome == '') {
    //   this.errors.add({ 'nome': ["O Nome é obrigatório."] });
    // }

    if (this.dataNascimento === undefined || this.dataNascimento === '') {
      this.errors.add({ 'dataNascimento': ['A data de nascimento é obrigatória.'] });
    } else {
      var dateParts = this.dataNascimento.split('/');
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      if (isNaN(date.getTime()))
        this.errors.add({ 'dataNascimento': ['Insira uma data válida.'] });
    }

    if (this.dataFiliacao === undefined || this.dataFiliacao === '') {
      // this.errors.add({ 'dataFiliacao': ['A data de filiação é obrigatória.'] });
    } else {
      var dateParts = this.dataFiliacao.split('/');
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      if (isNaN(date.getTime()))
        this.errors.add({ 'dataFiliacao': ['Insira uma data válida.'] });
    }

    if (this.sexo === undefined || this.sexo === '') {
      this.errors.add({ 'sexo': ['O campo sexo é obrigatório.'] });
    }


    if (this.contribuicaoAnos === undefined || this.contribuicaoAnos === '') {
      this.errors.add({ 'contribuicaoAnos': ['Campo obrigatório.'] });
    } else {
      if (this.contribuicaoAnos > 100 || !this.isNumber(this.contribuicaoAnos)) {
        this.errors.add({ 'contribuicaoAnos': ['Insira um valor entre 1 e 100'] });
      }
    }

    if (this.contribuicaoMeses === undefined || this.contribuicaoMeses === '') {
      this.errors.add({ 'contribuicaoMeses': ['Campo obrigatório.'] });
    } else {
      if (this.contribuicaoMeses > 11 || !this.isNumber(this.contribuicaoMeses)) {
        this.errors.add({ 'contribuicaoMeses': ['Insira um valor entre 1 e 11'] });
      }
    }

    if (this.contribuicaoDias === undefined || this.contribuicaoDias === '') {
      this.errors.add({ 'contribuicaoDias': ['Campo obrigatório.'] });
    } else {
      if (this.contribuicaoDias > 29 || !this.isNumber(this.contribuicaoDias)) {
        this.errors.add({ 'contribuicaoDias': ['Insira um valor entre 0 e 29'] });
      }
    }



  }




  public submit(e) {
    e.preventDefault();

    if (!localStorage.getItem('user_id')) {
      swal('Erro', 'Falha de login!', 'error').then(() => { window.location.href = environment.loginPageUrl; });
    }

    this.validate();

    this.setSegurado();

    console.log(this.seguradoTransicao)

    this.hasResult = false
    if (this.errors.empty()) {
      const alertSucesso = {
        //  position: 'top-end',
        icon: 'success',
        title: 'Sucesso a seguir o resultado',
        button: false,
        timer: 1500
      };
      swal(alertSucesso);

      this.hasResult = true

    } else {
      const alertSucesso = {
        // position: 'top-end',
        icon: 'error',
        title: 'Confira os dados digitados',
        button: false,
        timer: 1500
      };
      swal(alertSucesso);
      // swal('Erro', 'Confira os dados digitados', 'error');
    }
  }



  isNumber(value) {
    if (!isNaN(value) && Number.isInteger(+value)) {
      return true;
    }
    return false;
  }


  setSegurado() {

    this.seguradoTransicao = {
      nome: this.nome,
      idDocumento: this.idDocumento,
      numeroDocumento: this.numeroDocumento,
      dataNascimento: this.dataNascimento,
      dataFiliacao: this.dataFiliacao,
      sexo: this.sexo,
      professor: this.professor,
      redutorProfessor: 0,
      contribuicaoAnos: this.contribuicaoAnos,
      contribuicaoMeses: this.contribuicaoMeses,
      contribuicaoDias: this.contribuicaoDias,
      idade: '',
      idadeString: '',
      idadeFracionada: '',
      isRegraTransitoria: '',
    }

  }


  resetForm() {
    this.seguradoTransicao = {};
    this.nome = '';
    this.idDocumento = '';
    this.numeroDocumento = '';
    this.dataNascimento = '';
    this.sexo = '';
    this.professor = '';
    this.contribuicaoAnos = '';
    this.contribuicaoMeses = '';
    this.contribuicaoDias = '';
}





}
