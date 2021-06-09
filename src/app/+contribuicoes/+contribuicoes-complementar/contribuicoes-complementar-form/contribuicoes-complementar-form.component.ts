import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../../services/error.service';
import { ContribuicaoComplementarService } from '../ContribuicaoComplementar.service';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { InputFunctions } from 'app/shared/functions/input-functions';


@Component({
  selector: 'app-contribuicoes-complementar-form',
  templateUrl: './contribuicoes-complementar-form.component.html',
  styleUrls: ['./contribuicoes-complementar-form.component.css']
})
export class ContribuicoesComplementarFormComponent implements OnInit {

  public competenciaInicial;
  public competenciaFinal;
  public contribuicaoDe;
  public contribuicaoAte;
  public salarioContribuicao;
  public chkJuros = true;
  public showMessage = false;
  public dataDecadente;
  public contribuicoes;
  public atualizarAte;

  public contribuicaoDeMatriz;
  public contribuicaoAteMatriz;

  public dataMinima = new Date(1970, 0, 1);
  public data94 = new Date(1994, 5, 31);

  public idCalculo = '';
  public calculo;

  private inputFunctions = InputFunctions;

  @Input() formData;
  @Input() errors: ErrorService;
  @Output() onSubmit = new EventEmitter;
  @Output() importCnis = new EventEmitter;

  constructor(
    protected Calculo: ContribuicaoComplementarService,
    protected router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    let today = new Date();
    this.dataDecadente = new Date(today.getFullYear() - 5, today.getMonth(), 1);

    this.idCalculo = this.route.snapshot.params['id_calculo'];
    if (this.idCalculo != undefined) {
      this.Calculo.find(this.idCalculo)
        .then(calculo => {

          console.log(calculo);

          this.calculo = calculo;
          this.contribuicaoDe = this.formatDateDBToView(this.calculo.contribuicao_basica_inicial);
          this.contribuicaoAte = this.formatDateDBToView(this.calculo.contribuicao_basica_final);
          this.competenciaInicial = this.formatDateDBToView(this.calculo.inicio_atraso);
          this.competenciaFinal = this.formatDateDBToView(this.calculo.final_atraso);
          this.salarioContribuicao = this.calculo.salario;
          this.contribuicoes = this.calculo.contribuicoes;
          this.atualizarAte = this.formatDateDBToView(this.calculo.atualizar_ate);
          this.submit();
        });
    }
  }
  submit() {
    this.errors.clear();
    this.validateInputs();
    if (!this.errors.empty()) {
      swal({
        type: 'error',
        title: 'Confira os dados digitados',
        text: '',
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 1500
      });
    } else {
      if (this.idCalculo != '') {
        this.formData.id = this.idCalculo;
      }
      this.formData.id_segurado = this.route.snapshot.params['id'];
      this.formData.inicio_atraso = this.competenciaInicial;
      this.formData.final_atraso = this.competenciaFinal;
      this.formData.contribuicao_basica_inicial = this.contribuicaoDe;
      this.formData.contribuicao_basica_final = this.contribuicaoAte;
      this.formData.salario = this.salarioContribuicao;
      this.formData.chk_juros = this.chkJuros;
      this.formData.contribuicoes = this.contribuicoes;
      this.formData.atualizar_ate = this.atualizarAte;
      // this.formData.contribuicaoDeMatriz = this.contribuicaoDeMatriz;
      // this.formData.contribuicaoAteMatriz = this.contribuicaoAteMatriz;
      this.onSubmit.emit(this.formData);

      this.contribuicaoDe = ((moment(this.contribuicaoAte, 'MM/YYYY')).add(1, 'month')).format('MM/YYYY');
      this.contribuicaoAte = ((moment(this.contribuicaoAte, 'MM/YYYY')).add(1, 'month')).format('MM/YYYY');
    }
  }

  validateInputs() {
    //competenciaInicial
    if (this.isEmpty(this.competenciaInicial) || !this.isValidDate('01/' + this.competenciaInicial)) {
      this.errors.add({ 'competenciaInicial': ['Insira uma data válida'] });
    } else {
      let pieces = this.competenciaInicial.split('/');
      let dateCompetenciaInicial = new Date(pieces[1], pieces[0] - 1, 1);
      if (dateCompetenciaInicial <= this.dataMinima) {
        this.errors.add({ 'competenciaInicial': ['Insira uma data após 01/1970'] });
      }
      if (dateCompetenciaInicial >= this.dataDecadente) {
        this.errors.add({ 'competenciaInicial': ['Insira uma data anterior a ' + (this.dataDecadente.getMonth() + 1) + '/' + (this.dataDecadente.getFullYear())] });
      }
    }

    //competenciaFinal
    if (this.isEmpty(this.competenciaFinal) || !this.isValidDate('01/' + this.competenciaFinal)) {
      this.errors.add({ 'competenciaFinal': ['Insira uma data válida'] });
    } else {
      let pieces = this.competenciaFinal.split('/');
      let dateCompetenciaFinal = new Date(pieces[1], pieces[0] - 1, 1);
      pieces = this.competenciaInicial.split('/');
      let dateCompetenciaInicial = new Date(pieces[1], pieces[0] - 1, 1);

      if (dateCompetenciaFinal <= this.dataMinima) {
        this.errors.add({ 'competenciaFinal': ['Insira uma data após 01/1970'] });
      }
      if (dateCompetenciaFinal >= this.dataDecadente) {
        this.errors.add({ 'competenciaFinal': ['Insira uma data anterior a ' + (this.dataDecadente.getMonth() + 1) + '/' + (this.dataDecadente.getFullYear())] });
      }
      if (dateCompetenciaFinal < dateCompetenciaInicial) {
        this.errors.add({ 'competenciaFinal': ['Insira uma data posterior a data inicial'] });
      }
    }

    //contribuicaoDe
    if (this.isEmpty(this.contribuicaoDe) || !this.isValidDate('01/' + this.contribuicaoDe)) {
      this.errors.add({ 'contribuicaoDe': ['Insira uma data válida'] });
    } else {
      let pieces = this.contribuicaoDe.split('/');
      let dateContribuicaoDe = new Date(pieces[1], pieces[0] - 1, 1);

      if (dateContribuicaoDe < this.data94) {
        this.errors.add({ 'contribuicaoDe': ['Insira uma data posterior a 06/1994'] });
      }
    }

    //contribuicaoAte
    if (this.isEmpty(this.contribuicaoAte) || !this.isValidDate('01/' + this.contribuicaoAte)) {
      this.errors.add({ 'contribuicaoAte': ['Insira uma data válida'] });
    } else {
      let pieces = this.contribuicaoAte.split('/');
      let dateContribuicaoAte = new Date(pieces[1], pieces[0] - 1, 1);

      pieces = this.contribuicaoDe.split('/');
      let dateContribuicaoDe = new Date(pieces[1], pieces[0] - 1, 1);

      if (dateContribuicaoAte < this.data94) {
        this.errors.add({ 'contribuicaoAte': ['Insira uma data posterior a 06/1994'] });
      }
      if (dateContribuicaoAte < dateContribuicaoDe) {
        this.errors.add({ 'contribuicaoAte': ['Insira uma data posterior a data inicial'] });
      }

      let hoje = new Date();
      hoje = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      //console.log(dateContribuicaoAte);
      //console.log(hoje);
      if (dateContribuicaoAte > hoje) {
        this.errors.add({ 'contribuicaoAte': ['Insira uma data anterior a data atual'] });
      }

      if (dateContribuicaoDe > hoje) {
        this.errors.add({ 'contribuicaoDe': ['Insira uma data anterior a data atual'] });
      }
    }




    //salarioContribuicao
    // if(this.isEmpty(this.salarioContribuicao)){
    // 	this.errors.add({"salarioContribuicao":["Insira o salário"]});
    // }
  }
  

  public setContribuicoesImport(contribuicoes){

    this.importCnis.emit(contribuicoes)

  }


  moveNext(event, maxLength, nextElementId) {
    let value = event.srcElement.value;
    if (value.indexOf('_') < 0 && value != '') {
      let next = <HTMLInputElement>document.getElementById(nextElementId);
      //console.log(next)
      next.focus();
    }
  }


  voltar() {
    window.location.href = '/#/contribuicoes/contribuicoes-calculos/' + this.route.snapshot.params['id'];
  }

  isEmpty(data) {
    //if((data === undefined || data === '' || data === null)) {
    if (data == undefined || data == '') {
      return true;
    }
    return false;
  }

  isValidDate(date) {
    var bits = date.split('/');
    var d = new Date(bits[2], bits[1] - 1, bits[0]);
    return d && (d.getMonth() + 1) == bits[1];
  }

  formatDateDBToView(date){
    const splited = date.split('-');
    return splited[1] + '/' + splited[0];
  }

  dateMask(rawValue) {
    if (rawValue == '') {
      return [/[0-1]/, /\d/, '/', /[1-2]/, /[0|9]/, /\d/, /\d/];
    }
    let mask = [];
    mask.push(/[0-1]/);

    if (rawValue[0] == 1) {
      mask.push(/[0-2]/);
    } else if (rawValue[0] == 0) {
      mask.push(/[1-9]/);
    }

    mask.push('/');
    mask.push(/[1-2]/);

    if (rawValue[3] == 1) {
      mask.push(/[9]/);
    } else if (rawValue[3] == 2) {
      mask.push(/[0]/);
    }
    mask.push(/\d/);
    mask.push(/\d/);
    return mask;
  }
}
