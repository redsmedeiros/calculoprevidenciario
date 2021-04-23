import { Component, OnInit, Input, SimpleChange, OnChanges, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { PeriodosContagemTempoService } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.service';
import { PeriodosContagemTempo } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.model';


import { ImportadorCnisContribuicoesComponent } from '../+importador-cnis-contribuicoes/importador-cnis-contribuicoes.component';
import { ImportadorCnisContribuicoesService } from '../+importador-cnis-contribuicoes/importador-cnis-contribuicoes.service';

import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-importador-cnis-periodos',
  templateUrl: './importador-cnis-periodos.component.html',
  styleUrls: ['./importador-cnis-periodos.component.css'],
  providers: [
    ErrorService
  ]
})
export class ImportadorCnisPeriodosComponent implements OnInit, OnChanges {


  @Input() vinculos;
  @Input() isUpdating;


  public periodo: any = {};
  public vinculosList = [];
  public vinculosListPost = [];
  public form = { ...PeriodosContagemTempo.form };


  public data_inicio = '';
  public data_termino = '';
  public empresa = undefined;
  public fator_condicao_especial = 1.00;
  public condicao_especial = 0;
  public carencia = 1;
  public id;
  public atualizarPeriodo = 0;
  public index: any;


  public vinculo: any = {};
  public tipo_contribuicao = 0;
  public periodo_completo = false;
  public vinculo_index = 0;

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public countVinculosErros = 0;

  @Output() eventCountVinculosErros = new EventEmitter();
  @ViewChild('periodoFormheader') periodoFormheader: ElementRef;
  @ViewChild(ImportadorCnisContribuicoesComponent) ContribuicoesComponent: ImportadorCnisContribuicoesComponent;
  @ViewChild('contribuicoes') public contribuicoes: ModalDirective;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected PeriodosContagemTempoService: PeriodosContagemTempoService,
    protected ImportadorCnisContribuicoesService: ImportadorCnisContribuicoesService,
    protected errors: ErrorService,
    private detector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.detector.detectChanges();
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    let changedvinculos = changes['vinculos'];
    let changedisUpdating = changes['isUpdating'];
    let changeEmpresa = changes['empresa'];

    if (!this.isUpdating && this.vinculos.length > 0 && typeof this.vinculos !== 'undefined') {
      this.setPeriodos(this.vinculos);
    }

  }



  private setPeriodos(vinculos) {
    this.countVinculosErros = 0;
    for (const vinculo of vinculos) {
      this.updateDatatablePeriodos(vinculo);
    }
    this.detector.detectChanges();
  }



  // public updateDatatablePeriodos(vinculo) {
  //   // && !(/(Benefício)/i).test(vinculo.origemVinculo) adicionados os benefícios (luis 06-02-2018)

  //   if (typeof vinculo === 'object') {

  //     const line = {
  //       data_inicio: vinculo.periodo[0],
  //       data_termino: vinculo.periodo[1],
  //       empresa: vinculo.origemVinculo,
  //       fator_condicao_especial: 1,
  //       condicao_especial: 'Não',
  //       carencia: 'Sim',
  //       index: vinculo.index
  //     }
  //     this.vinculosList.push(line);
  //     this.isValidVinculo(line);
  //   }

  // }



  public adicionarPeriodoChave(inputChave) {
    var ano = inputChave.substring(0, 4);
    var mes = inputChave.substring(4, 6);

    if ((parseInt(mes) + 1) > 12) {
      mes = '01';
      ano = parseInt(ano) + 1;
    } else {
      mes = parseInt(mes) + 1;
    }

    var chave = ano + this.leftFillNum(mes, 2);

    return chave;

  }


  public verificarContribuicoes(periodo_in, periodo_fi, contribuicoes) {

    var contribuicoesList = [];
    let result = contribuicoes;
    let chave = periodo_in;

    do {

      const pchave = chave.substring(4, 6) + '/' + chave.substring(0, 4);

      // result = _.find(contribuicoes, (item) => {
      //   return item.competencia === pchave;
      // });

      result = contribuicoes.find((item) => {
        return item.competencia === pchave;
      })

      if (result)     /* se encontrou a contribuição no mes*/ {
        contribuicoesList.push(result);
      } else {        /* se não encontrou a contribuição no mes*/
        contribuicoesList.push({
          competencia: pchave,
          contrib: '0,00',
        });
      }

      chave = this.adicionarPeriodoChave(chave);

    } while (chave <= periodo_fi);

    /* diferença que deve ser removida do periodo de contribuições */

    let diferencas = contribuicoes.filter(c1 => contribuicoesList.filter(c2 => c2.competencia === c1.competencia).length === 0);

    // diferencas.forEach(diferenca => {

    //   // _.remove(contribuicoesList, function (contribuicao) {
    //   //   return contribuicao.competencia == diferenca.competencia;
    //   // });

    // });


    diferencas.forEach(diferenca => {

      // _.remove(contribuicoesList, function (contribuicao) {
      //   return contribuicao.competencia == diferenca.competencia;
      // });

      contribuicoesList.filter(function (contribuicao, index, arr) {
        return contribuicao.competencia == diferenca.competencia;
      });

    });

    return contribuicoesList;

  }

  public updateDatatablePeriodos(vinculo) {
    // && !(/(Benefício)/i).test(vinculo.origemVinculo) adicionados os benefícios (luis 06-02-2018)

    console.log(vinculo);

    if (typeof vinculo === 'object') {

      let periodo_in = this.formataPeriodo(vinculo.periodo[0]);
      let periodo_fi = this.formataPeriodo(vinculo.periodo[1]);
      let contribuicoes = this.verificarContribuicoes(periodo_in, periodo_fi, vinculo.contribuicoes);

      console.log(periodo_in);
      console.log(periodo_fi);

      // let result = _.filter(contribuicoes, function (item) { if (item.contrib == '0,00') return item }).length;
      let result = contribuicoes.filter(function (item) { if (item.contrib == '0,00') return item }).length;

      const line = {
        nit: vinculo.nitEmpregador,
        cnpj: vinculo.cnpj,
        tipo_vinculo: vinculo.tipoVinculo,
        datainicio: vinculo.periodo[0].split('/')[2] + vinculo.periodo[0].split('/')[1] + vinculo.periodo[0].split('/')[0],
        datatermino: vinculo.periodo[1] === undefined ? vinculo.periodo[0].split('/')[2] + vinculo.periodo[0].split('/')[1] + vinculo.periodo[0].split('/')[0] : vinculo.periodo[1].split('/')[2] + vinculo.periodo[1].split('/')[1] + vinculo.periodo[1].split('/')[0],
        data_inicio: vinculo.periodo[0],
        data_termino: vinculo.periodo[1],
        empresa: vinculo.origemVinculo,
        fator_condicao_especial: 1,
        condicao_especial: 'Não',
        carencia: 'Sim',
        contribuicoes_pendentes: result ? result : 0,
        contribuicoes_count: contribuicoes.length,
        contribuicoes: contribuicoes,
        index: vinculo.index
      }
      this.vinculosList.push(line);
      this.isValidVinculo(line);
    }

  }




  private ajusteListVinculos(calculoId) {

    this.vinculosListPost = [];
    for (const vinculo of this.vinculosList) {
      this.vinculosListPost.push(
        {
          data_inicio: this.formatPostDataDate(vinculo.data_inicio),
          data_termino: this.formatPostDataDate(vinculo.data_termino),
          empresa: vinculo.empresa,
          fator_condicao_especial: this.formatFatorPost(vinculo.fator_condicao_especial),
          condicao_especial: this.boolToLiteral(vinculo.condicao_especial),
          carencia: this.boolToLiteral(vinculo.carencia),
          licenca_premio_nao_usufruida: 0,
          id_contagem_tempo: calculoId
        }
      );
    }
  }


  public createPeriodosImportador(calculoId) {

    if (calculoId && this.vinculosList.length >= 1) {

      this.ajusteListVinculos(calculoId);

      return this.PeriodosContagemTempoService
        .save(this.vinculosListPost)
        .then(model => {
          return true;
        })
        .catch(errors => this.errors.add(errors));
    }

  }



  public getupdateVinculo(index) {

    const vinculo = this.vinculosList.find(x => x.index === index);

    this.data_inicio = vinculo.data_inicio;
    this.data_termino = vinculo.data_termino;
    this.empresa = vinculo.empresa;
    this.fator_condicao_especial = vinculo.fator_condicao_especial;
    this.condicao_especial = this.boolToLiteral(vinculo.condicao_especial);
    this.carencia = this.boolToLiteral(vinculo.carencia);
    this.index = vinculo.index;

    this.atualizarPeriodo = vinculo.index; // exibir o botao de atualizar e ocultar o insert
    this.topForm();
    this.detector.detectChanges();

  }



  public setupdatePeriodo() {
    if (this.isValid()) {

      this.countVinculosErros = 0;

      this.vinculosList.map(vinculo => {
        if (vinculo.index === this.index) {

          vinculo.data_inicio = this.data_inicio;
          vinculo.data_termino = this.data_termino;
          vinculo.empresa = this.empresa;
          vinculo.fator_condicao_especial = this.fator_condicao_especial;
          vinculo.condicao_especial = this.boolToLiteral(this.condicao_especial);
          vinculo.carencia = this.boolToLiteral(this.carencia);
          vinculo.condicao_especial = this.boolToLiteral(this.condicao_especial);
          vinculo.carencia = this.boolToLiteral(this.carencia);
        }
        this.isValidVinculo(vinculo);

      });

      this.resetForm();
      this.atualizarPeriodo = 0;
      this.detector.detectChanges();
      this.toastAlert('success', 'Relação Previdenciária atualizada', null);

    } else {
      this.toastAlert('error', 'Verifique os dados do formulário', null);
    }


  }

  public insertPeriodo() {
    if (this.isValid()) {

      const line = {
        data_inicio: this.data_inicio,
        data_termino: this.data_termino,
        empresa: this.empresa,
        fator_condicao_especial: this.fator_condicao_especial,
        condicao_especial: this.boolToLiteral(this.condicao_especial),
        carencia: this.boolToLiteral(this.carencia),
        index: (this.vinculosList.length + 2)
      }

      this.vinculosList.push(line);

      this.resetForm();
      this.detector.detectChanges();
      this.toastAlert('success', 'Relação Previdenciária inserida', null);
    } else {
      this.toastAlert('error', 'Verifique os dados do formulário', null);
    }



  }

  public deletarVinculo(index) {
    this.vinculosList = this.vinculosList.filter(vinculo => vinculo.index !== index);

    this.countVinculosErros = 0;

    this.vinculosList.map(vinculo => {
      this.isValidVinculo(vinculo);
    });

    this.detector.detectChanges();

  }

  public verificarVinculos() {

    this.countVinculosErros = 0;

    this.vinculosList.map(vinculo => {
      this.isValidVinculo(vinculo);
    });

    this.detector.detectChanges();

    return this.countVinculosErros;
  }

  resetForm() {
    this.data_inicio = '';
    this.data_termino = '';
    this.empresa = '';
    this.fator_condicao_especial = 1.00;
    this.condicao_especial = 0;
    this.carencia = 1;
    this.index = null;
  }


  isValidVinculo(vinculo) {
    this.countVinculosErros += (this.testeVinculo(vinculo)) ? 1 : 0;
    this.eventCountVinculosErros.emit(this.countVinculosErros);
  }


  private testeVinculo(vinculo) {

    if (this.isEmpty(vinculo.data_inicio)) {
      return true;
    }

    if (this.isEmpty(vinculo.data_termino)) {
      return true;
    }
    // empresa
    if (this.isEmpty(vinculo.empresa)) {
      return true;
    }

    // fator_condicao_especial
    if (this.isEmpty(vinculo.fator_condicao_especial)) {
      return true;
    }

    // condição esepecial
    if (this.isEmpty(vinculo.condicao_especial)) {
      return true;
    }

    // carencia
    if (this.isEmpty(vinculo.carencia)) {
      return true;
    }

    return false;
  }


  isValid() {

    if (this.isEmpty(this.data_inicio)) {
      this.errors.add({ 'data_inicio': ['Insira uma data'] });
    }

    if (this.isEmpty(this.data_termino)) {
      this.errors.add({ 'data_termino': ['Insira uma data'] });
    }

    if (!this.isEmpty(this.data_inicio) && !this.isEmpty(this.data_termino)) {

      const dateInicioPeriodo = moment(this.data_inicio, 'DD/MM/YYYY');
      const dateFinalPeriodo = moment(this.data_termino, 'DD/MM/YYYY');

      // inicioPeriodo
      if (this.isEmpty(this.data_inicio) || !dateInicioPeriodo.isValid()) {
        this.errors.add({ 'data_inicio': ['Insira uma data válida'] });
      }

      // finalPeriodo
      if (this.isEmpty(this.data_termino) || !dateFinalPeriodo.isValid()) {
        this.errors.add({ 'data_termino': ['Insira uma data válida'] });
      } else {

        if (dateFinalPeriodo < dateInicioPeriodo) {
          this.errors.add({ 'data_termino': ['Insira uma data posterior ou igual a data inicial'] });
        }

        if (Math.abs(dateInicioPeriodo.diff(dateFinalPeriodo, 'years')) >= 50) {
          this.errors.add({ 'data_termino': ['O intervalo não deve ser maior que 65 anos'] });
        }

      }

    }

    // empresa
    if (this.isEmpty(this.empresa)) {
      this.errors.add({ 'empresa': ['Insira o nome da empresa'] });
    } else {
      this.errors.clear('empresa');
    }

    // fator_condicao_especial
    if (this.isEmpty(this.fator_condicao_especial)) {
      this.errors.add({ 'fator_condicao_especial': ['Insira um fator válido.'] });
    } else {
      this.errors.clear('fator_condicao_especial');
    }

    // condição esepecial
    if (this.condicao_especial === undefined) {
      this.errors.add({ 'sexo': ['O campo condição esepecial é obrigatório.'] });
    }

    // carencia
    if (this.carencia === undefined) {
      this.errors.add({ 'carencia': ['O campo carência é obrigatório.'] });
    }

    this.detector.detectChanges();
    return this.errors.empty();
  }


  showContribuicoes(vinculo, index) {
    this.vinculo_index = index;
    this.vinculo = vinculo;
    this.ContribuicoesComponent.preencherMatrizPeriodos(this.vinculo.contribuicoes);
    this.contribuicoes.show();
  }

  hideContribuicoes() {
    this.contribuicoes.hide();
  }


  toastAlert(type, title, position) {

    position = (!position) ? 'top-end' : position;

    swal({
      position: position,
      type: type,
      title: title,
      showConfirmButton: false,
      timer: 1500
    });

  }

  boolToLiteral(value) {
    if (typeof value === 'number') {
      value = (value) ? 'Sim' : 'Não';
    } else {
      value = (value === 'Sim') ? 1 : 0;
    }

    return value;
  }

  isEmpty(data) {
    if (data == undefined || data == '' || !data) {
      return true;
    }
    return false;
  }

  formatFatorPost(fator) {
    return (fator === 0 || (typeof fator === 'undefined')) ? 1 : fator;
  }

  removeFatorDefault() {
    this.fator_condicao_especial = 0;
  }

  checkFator() {
    this.fator_condicao_especial = this.formatFatorPost(this.fator_condicao_especial);
  }

  formatReceivedDate(inputDate) {
    let date = moment(inputDate, 'YYYY-MM-DD');
    return date.format('DD/MM/YYYY');
  }

  formatPostDataDate(inputDate) {

    let date = moment(inputDate, 'DD/MM/YYYY');
    return date.format('YYYY-MM-DD');

  }

  topForm() {
    document.body.scrollTop = this.periodoFormheader.nativeElement.offsetLeft + 500; // For Safari
    document.documentElement.scrollTop = this.periodoFormheader.nativeElement.offsetLeft + 500; // For Chrome, Firefox, IE and Opera
  }

  public leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, 0);
  }

  public formataPeriodo(inputData) {

    if (inputData !== undefined) {
      const data = inputData.split('/');
      const periodo = data[2] + this.leftFillNum(data[1], 2);
      return periodo;
    }

    return '00/0000'

  }


}
