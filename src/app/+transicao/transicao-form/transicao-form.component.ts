
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { Auth } from '../../services/Auth/Auth.service';
import { AuthResponse } from '../../services/Auth/AuthResponse.model';
import { ErrorService } from '../../services/error.service';
import { environment } from '../../../environments/environment';
import swal from 'sweetalert';
import * as moment from 'moment';
import { TransicaoResultadosComponent } from '../transicao-resultados/transicao-resultados.component';


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


  @ViewChild(TransicaoResultadosComponent) transicaoResultadosComponent: TransicaoResultadosComponent;


  // segurado
  public nome;
  public idDocumento;
  public numeroDocumento;
  public dataNascimento;
  public dataFiliacao;
  public sexo;
  public professor;


  // Tempo de contribuiçãoAteEC103
  public contribuicaoAnosAteEC103;
  public contribuicaoMesesAteEC103;
  public contribuicaoDiasAteEC103;


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


    // this.nome = 'Segurado teste teste ';
    // this.idDocumento = '';
    // this.numeroDocumento = '';
    // // this.dataNascimento = '09/12/1959';
    // this.dataNascimento = '01/01/1960';
    // this.dataFiliacao = '01/01/1991';
    // this.sexo = 'f';
    // this.professor = false;

    // this.contribuicaoAnosAteEC103 = '16';
    // this.contribuicaoMesesAteEC103 = '3';
    // this.contribuicaoDiasAteEC103 = '0';

    // this.contribuicaoAnos = '16';
    // this.contribuicaoMeses = '3';
    // this.contribuicaoDias = '0';



    // this.nome = 'Segurado teste teste ';
    // this.idDocumento = '';
    // this.numeroDocumento = '';
    // this.dataNascimento = '10/07/1957';
    // this.dataFiliacao = '01/01/1980';
    // this.sexo = 'm';
    // this.professor = false;

    // this.contribuicaoAnosAteEC103 = '35';
    // this.contribuicaoMesesAteEC103 = '0';
    // this.contribuicaoDiasAteEC103 = '0';

    // this.contribuicaoAnos = '36';
    // this.contribuicaoMeses = '6';
    // this.contribuicaoDias = '3';


    // this.nome = 'Segurado teste teste';
    // this.idDocumento = '';
    // this.numeroDocumento = '';
    // this.dataNascimento = '12/12/1968';
    // this.dataFiliacao = '01/01/1980';
    // this.sexo = 'f';
    // this.professor = true;

    // this.contribuicaoAnosAteEC103 = '28';
    // this.contribuicaoMesesAteEC103 = '4';
    // this.contribuicaoDiasAteEC103 = '2';

    // this.contribuicaoAnos = '28';
    // this.contribuicaoMeses = '6';
    // this.contribuicaoDias = '12';

  }


  // ngAfterContentInit() {
  //   // setTimeout(() => {
  //   //   this.changeDocumentMask();
  //   // }, 200)
  // }



  validate() {
    this.errors.clear();


    const datanascimentoMoment = moment(this.dataNascimento, 'DD/MM/YYYY');
    const dataFiliacaoMoment = moment(this.dataFiliacao, 'DD/MM/YYYY');

    if (this.nome == undefined || this.nome == '') {
      this.errors.add({ 'nome': ["O Nome é obrigatório."] });
    }

    if (this.dataNascimento === undefined || this.dataNascimento === '') {
      this.errors.add({ 'dataNascimento': ['A data de nascimento é obrigatória.'] });
    } else {
      let dateParts = this.dataNascimento.split('/');
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      if (isNaN(date.getTime()))
        this.errors.add({ 'dataNascimento': ['Insira uma data válida.'] });
    }


    if (this.dataFiliacao === undefined || this.dataFiliacao === '') {
      this.errors.add({ 'dataFiliacao': ['A data de filiação é obrigatória.'] });
    } else {

      const dateParts = this.dataFiliacao.split('/');
      const date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);

      if (isNaN(date.getTime())) {
        this.errors.add({ 'dataFiliacao': ['Insira uma data válida.'] });
      }

      if (dataFiliacaoMoment.isBefore(datanascimentoMoment)) {
        this.errors.add({ 'dataFiliacao': ['Data filiação deve ser posterior a data de nascimento.'] });
      }

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



    if (this.contribuicaoAnosAteEC103 === undefined || this.contribuicaoAnosAteEC103 === '') {
      this.errors.add({ 'contribuicaoAnosAteEC103': ['Campo obrigatório.'] });
    } else {
      if (this.contribuicaoAnosAteEC103 > 100 || !this.isNumber(this.contribuicaoAnosAteEC103)) {
        this.errors.add({ 'contribuicaoAnosAteEC103': ['Insira um valor entre 1 e 100'] });
      }
    }

    if (this.contribuicaoMesesAteEC103 === undefined || this.contribuicaoMesesAteEC103 === '') {
      this.errors.add({ 'contribuicaoMesesAteEC103': ['Campo obrigatório.'] });
    } else {
      if (this.contribuicaoMesesAteEC103 > 11 || !this.isNumber(this.contribuicaoMesesAteEC103)) {
        this.errors.add({ 'contribuicaoMesesAteEC103': ['Insira um valor entre 1 e 11'] });
      }
    }

    if (this.contribuicaoDiasAteEC103 === undefined || this.contribuicaoDiasAteEC103 === '') {
      this.errors.add({ 'contribuicaoDiasAteEC103': ['Campo obrigatório.'] });
    } else {
      if (this.contribuicaoDiasAteEC103 > 29 || !this.isNumber(this.contribuicaoDiasAteEC103)) {
        this.errors.add({ 'contribuicaoDiasAteEC103': ['Insira um valor entre 0 e 29'] });
      }
    }

    const tempoTotal = this.converterTempoContribuicao(
      this.contribuicaoAnos,
      this.contribuicaoMeses,
      this.contribuicaoDias,
      'years');

    const tempoTotalAteEC103 = this.converterTempoContribuicao(
      this.contribuicaoAnosAteEC103,
      this.contribuicaoMesesAteEC103,
      this.contribuicaoDiasAteEC103,
      'years');

    if (tempoTotalAteEC103 > tempoTotal) {
      this.errors.add({ 'contribuicaoAnosAteEC103': ['O tempo até da EC103 não deve ser maior que o total.'] });
    }

  }


  public isFormatInt(value) {
    return (typeof value === 'string') ? parseInt(value) : value;
  }

  public converterTempoContribuicao(anos, meses, dias, type) {

    anos = this.isFormatInt(anos);
    meses = this.isFormatInt(meses);
    dias = this.isFormatInt(dias);

    const contribuicaoTotal = (anos * 365) + (meses * 30) + dias;

    return (type === 'days' || type === 'd') ? Math.floor(contribuicaoTotal) : contribuicaoTotal / 365;
  }




  public submit(e) {

    e.preventDefault();
    this.hasResult = false
    if (!localStorage.getItem('user_id')) {
      swal('Erro', 'Falha de login!', 'error').then(() => { window.location.href = environment.loginPageUrl; });
    }

    this.validate();

    this.setSegurado();

    // console.log(this.seguradoTransicao)

    if (this.errors.empty()) {

      this.hasResult = true

      const alertSucesso = {
        //  position: 'top-end',
        icon: 'success',
        title: 'Sucesso!',
        button: false,
        timer: 2000
      };

      swal(alertSucesso).then(() => {
        if (this.hasResult) {
          this.transicaoResultadosComponent.setConclusoes();

          this.scroll('resultado');
        }
      });


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


  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined) ? true : false;
  }

  scroll(id) {
    if (this.isExits(id)) {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
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
      contribuicaoAnosAteEC103: this.contribuicaoAnosAteEC103,
      contribuicaoMesesAteEC103: this.contribuicaoMesesAteEC103,
      contribuicaoDiasAteEC103: this.contribuicaoDiasAteEC103,
      contribuicaoAnos: this.contribuicaoAnos,
      contribuicaoMeses: this.contribuicaoMeses,
      contribuicaoDias: this.contribuicaoDias,
      contribuicaoFracionadoAnos: '',
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
    this.contribuicaoAnosAteEC103 = '';
    this.contribuicaoMesesAteEC103 = '';
    this.contribuicaoDiasAteEC103 = '';
    this.contribuicaoAnos = '';
    this.contribuicaoMeses = '';
    this.contribuicaoDias = '';
  }







}
