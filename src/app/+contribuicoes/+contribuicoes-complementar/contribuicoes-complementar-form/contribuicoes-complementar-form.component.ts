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
  public salarioContribuicao = 0;
  public chkJuros = true;
  public showMessage = false;
  public dataDecadente;
  public contribuicoes;
  public atualizarAte;

  public contribuicaoDeMatriz;
  public contribuicaoAteMatriz;

  public dataMinima = new Date(1970, 0, 1);
  public data94 = new Date(1994, 5, 31);

  public dataMinima94 = new Date(1994, 6, 30);

  public idCalculo = '';
  public calculo;

  public isFormContribuicoes = false;

  private inputFunctions = InputFunctions;
  private dadosPassoaPasso = { origem: 'passo-a-passo', type: '' };



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
          this.calculo = calculo;
          this.contribuicaoDe = this.formatDateDBToView(this.calculo.contribuicao_basica_inicial);
          this.contribuicaoAte = this.formatDateDBToView(this.calculo.contribuicao_basica_final);
          this.competenciaInicial = this.formatDateDBToView(this.calculo.inicio_atraso);
          this.competenciaFinal = this.formatDateDBToView(this.calculo.final_atraso);
          this.salarioContribuicao = this.calculo.salario;
          this.contribuicoes = this.calculo.contribuicoes;
          this.atualizarAte = this.formatDateDBToView(this.calculo.atualizar_ate);
          this.contribuicaoDeMatriz = this.contribuicaoDe;
          this.contribuicaoAteMatriz = this.contribuicaoAte;
          this.formData.id = this.idCalculo;
          this.isFormContribuicoes = true;
          this.submit();
        });
    }
  }

  submit() {
    this.errors.clear();
    this.validateInputs();
    this.validateInputs(2);

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
      this.setForm(false);
    }
  }


  private setForm(isImport = false) {


    // if (this.idCalculo != '' && this.idCalculo != undefined) {
    //   this.formData.id = this.idCalculo;
    // }

    this.formData.id_segurado = this.route.snapshot.params['id'];
    this.formData.inicio_atraso = this.competenciaInicial;
    this.formData.final_atraso = this.competenciaFinal;

    this.formData.salario = this.salarioContribuicao;
    this.formData.chk_juros = this.chkJuros;
    this.formData.contribuicoes = this.contribuicoes;
    this.formData.atualizar_ate = this.atualizarAte;

    // this.formData.contribuicao_basica_inicial = this.contribuicaoDe;
    // this.formData.contribuicao_basica_final = this.contribuicaoAte;

    this.formData.contribuicaoDeMatriz = this.contribuicaoDeMatriz;
    this.formData.contribuicaoAteMatriz = this.contribuicaoAteMatriz;

    if (!isImport) {

      this.formData.contribuicao_basica_inicial = this.contribuicaoDeMatriz;
      this.formData.contribuicao_basica_final = this.contribuicaoAteMatriz;
      this.onSubmit.emit(this.formData);

    }

    this.contribuicaoDeMatriz = ((moment(this.contribuicaoAteMatriz, 'MM/YYYY')).add(1, 'month')).format('MM/YYYY');
    this.contribuicaoAteMatriz = ((moment(this.contribuicaoAteMatriz, 'MM/YYYY')).add(1, 'month')).format('MM/YYYY');

  }

  validateInputs(
    passo = 1,
    name = null
  ) {

    if (passo === 1) {

      if (name === 'competenciaInicial' || name === null) {
        //competenciaInicial
        if (this.isEmpty(this.competenciaInicial) || !this.isValidDate('01/' + this.competenciaInicial)) {
          this.errors.add({ 'competenciaInicial': ['Insira uma data válida'] });
        } else {
          let pieces = this.competenciaInicial.split('/');
          let dateCompetenciaInicial = new Date(pieces[1], pieces[0] - 1, 1);
          // if (dateCompetenciaInicial <= this.dataMinima94) {
          //   this.errors.add({ 'competenciaInicial': ['Insira uma data após 07/1994'] });
          // }
          if (dateCompetenciaInicial >= this.dataDecadente) {
            this.errors.add({ 'competenciaInicial': ['Insira uma data anterior a ' + (this.dataDecadente.getMonth() + 1) + '/' + (this.dataDecadente.getFullYear())] });
          }
        }
      }

      if (name === 'competenciaFinal' || name === null) {
        //competenciaFinal
        if (this.isEmpty(this.competenciaFinal) || !this.isValidDate('01/' + this.competenciaFinal)) {
          this.errors.add({ 'competenciaFinal': ['Insira uma data válida'] });
        } else {
          let pieces = this.competenciaFinal.split('/');
          let dateCompetenciaFinal = new Date(pieces[1], pieces[0] - 1, 1);
          pieces = this.competenciaInicial.split('/');
          let dateCompetenciaInicial = new Date(pieces[1], pieces[0] - 1, 1);

          // if (dateCompetenciaFinal <= this.dataMinima94) {
          //   this.errors.add({ 'competenciaFinal': ['Insira uma data após 07/1994'] });
          // }
          if (dateCompetenciaFinal >= this.dataDecadente) {
            this.errors.add({ 'competenciaFinal': ['Insira uma data anterior a ' + (this.dataDecadente.getMonth() + 1) + '/' + (this.dataDecadente.getFullYear())] });
          }
          if (dateCompetenciaFinal < dateCompetenciaInicial) {
            this.errors.add({ 'competenciaFinal': ['Insira uma data posterior a data inicial'] });
          }
        }
      }

      if (name === 'atualizarAte' || name === null) {
        //competenciaFinal
        if (this.isEmpty(this.atualizarAte) || !this.isValidDate('01/' + this.atualizarAte)) {
          this.errors.add({ 'atualizarAte': ['Insira uma data válida'] });
        } else {
          let pieces = this.atualizarAte.split('/');
          let dateatualizarAte = new Date(pieces[1], pieces[0] - 1, 1);
          pieces = this.competenciaInicial.split('/');
          let dateCompetenciaInicial = new Date(pieces[1], pieces[0] - 1, 1);

          // if (dateatualizarAte <= this.dataMinima94) {
          //   this.errors.add({ 'atualizarAte': ['Insira uma data após 07/1994'] });
          // }

          if (dateatualizarAte < dateCompetenciaInicial) {
            this.errors.add({ 'atualizarAte': ['Insira uma data posterior a data inicial'] });
          }

        }
      }

    }

    if (passo === 2) {

      this.errors.clear('contribuicaoDeMatriz');
      this.errors.clear('contribuicaoAteMatriz');

      if (name === 'contribuicaoDeMatriz' || name === null) {
        //contribuicaoDe
        if (this.isEmpty(this.contribuicaoDeMatriz) || !this.isValidDate('01/' + this.contribuicaoDeMatriz)) {
          this.errors.add({ 'contribuicaoDeMatriz': ['Insira uma data válida'] });
        } else {
          let pieces = this.contribuicaoDeMatriz.split('/');
          let datecontribuicaoDeMatriz = new Date(pieces[1], pieces[0] - 1, 1);

          if (datecontribuicaoDeMatriz < this.data94) {
            this.errors.add({ 'contribuicaoDeMatriz': ['Insira uma data posterior a 06/1994'] });
          }
        }
      }

      if (name === 'contribuicaoAteMatriz' || name === null) {
        //contribuicaoAte
        if (this.isEmpty(this.contribuicaoAteMatriz) || !this.isValidDate('01/' + this.contribuicaoAteMatriz)) {
          this.errors.add({ 'contribuicaoAteMatriz': ['Insira uma data válida'] });
        } else {
          let pieces = this.contribuicaoAteMatriz.split('/');
          let dateContribuicaoAteMatriz = new Date(pieces[1], pieces[0] - 1, 1);

          pieces = this.contribuicaoDeMatriz.split('/');
          let dateContribuicaoDeMatriz = new Date(pieces[1], pieces[0] - 1, 1);

          if (dateContribuicaoAteMatriz < this.data94) {
            this.errors.add({ 'contribuicaoAteMatriz': ['Insira uma data posterior a 06/1994'] });
          }
          if (dateContribuicaoAteMatriz < dateContribuicaoDeMatriz) {
            this.errors.add({ 'contribuicaoAteMatriz': ['Insira uma data posterior a data inicial'] });
          }

          let hoje = new Date();
          hoje = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          //console.log(dateContribuicaoAteMatriz);
          //console.log(hoje);
          if (dateContribuicaoAteMatriz > hoje) {
            this.errors.add({ 'contribuicaoAteMatriz': ['Insira uma data anterior a data atual'] });
          }

          if (dateContribuicaoDeMatriz > hoje) {
            this.errors.add({ 'contribuicaoDeMatriz': ['Insira uma data anterior a data atual'] });
          }
        }
      }

      if (name === 'salarioContribuicao' || name === null) {
        //salarioContribuicao
        if (this.salarioContribuicao === null) {
          this.errors.add({ 'salarioContribuicao': ['Insira o salário'] });
        }
      }
    }

  }


  public setContribuicoesImport(contribuicoes) {
    this.importCnis.emit(contribuicoes);
    this.setForm(true);
  }


  public setIsFormContribuicoes() {

    if (!this.isEmpty(this.competenciaInicial)
      && !this.isEmpty(this.competenciaFinal)
      && !this.isEmpty(this.atualizarAte)
      && this.competenciaInicial.length  === 7
      && this.competenciaFinal.length  === 7
      && this.atualizarAte.length  === 7
      ) {
        this.setForm();
      this.isFormContribuicoes = true;
    }

  }

  moveNext(event, maxLength, nextElementId) {
    const value = event.srcElement.value;
    if (value.indexOf('_') < 0 && value != '') {
      const next = <HTMLInputElement>document.getElementById(nextElementId);
      //console.log(next)
      next.focus();
    }
  }

  /**
   * Set opção inicial do formulário.
   * @param ev
   * @param value
   */
  private setOptionEntradaDados(ev, value) {

    this.dadosPassoaPasso.type = value;

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

  formatDateDBToView(date) {
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
