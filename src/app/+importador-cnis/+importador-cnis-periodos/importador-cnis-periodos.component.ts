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
  @Input() moeda;
  @Input() isUpdating;
  @Input() dadosPassoaPasso;


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

  public sc_mm_considerar_carencia = null;
  public sc_mm_considerar_tempo = null;
  public sc_mm_ajustar = null;


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

    this.vinculosList = [];
    this.vinculosListPost = [];

    const changedvinculos = changes['vinculos'];
    const changedisUpdating = changes['isUpdating'];
    const changeEmpresa = changes['empresa'];

    if (!this.isUpdating && this.vinculos.length > 0 && typeof this.vinculos !== 'undefined') {
      this.setPeriodos(this.vinculos);
    }

  }


  private setPeriodos(vinculos) {

    this.countVinculosErros = 0;
    for (const vinculo of vinculos) {

      if (this.dadosPassoaPasso !== undefined
        && this.dadosPassoaPasso.origem === 'passo-a-passo'
        && this.dadosPassoaPasso.type === 'seguradoExistente'
      ) {
        this.updateDatatablePeriodosSelecionados(vinculo);
      } else {
        this.updateDatatablePeriodos(vinculo);
      }
      console.log(this.vinculosList);
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

    let ano = inputChave.substring(0, 4);
    let mes = inputChave.substring(4, 6);

    if ((parseInt(mes, 10) + 1) > 12) {
      mes = '01';
      ano = parseInt(ano, 10) + 1;
    } else {
      mes = parseInt(mes, 10) + 1;
    }

    const chave = ano + this.leftFillNum(mes, 2);

    return chave;

  }

  private countPendenciasSC(contribuicoes: Array<any>, type = 'mm') {

    if (type === 'mm') {
      return contribuicoes.filter(function (item) { if (item.msc === 1) { return item } }).length;
    }

    return contribuicoes.filter(function (item) { if (item.sc === '0,00') { return item } }).length;

  }


  public verificarContribuicoes(periodo_in, periodo_fi, contribuicoes) {

    const contribuicoesList = [];
    let result = contribuicoes;
    let chave = periodo_in;

    do {

      const pchave = chave.substring(4, 6) + '/' + chave.substring(0, 4);

      result = contribuicoes.find((item) => {
        return item.cp === pchave;
      });

      if (result && result !== undefined) {     /* se encontrou a contribuição no mes*/

        result.msc = 0;

        contribuicoesList.push(result);
      } else {        /* se não encontrou a contribuição no mes*/

        contribuicoesList.push({
          cp: pchave,
          sc: '0,00',
          msc: 0
        });

      }

      chave = this.adicionarPeriodoChave(chave);

    } while (chave <= periodo_fi);



    /* diferença que deve ser removida do periodo de contribuições */

    const diferencas = contribuicoes.filter(c1 => contribuicoesList.filter(c2 => c2.cp === c1.cp).length === 0);


    // diferencas.forEach(diferenca => {

    //   // _.remove(contribuicoesList, function (contribuicao) {
    //   //   return contribuicao.cp == diferenca.cp;
    //   // });

    // });

    // diferencas.forEach(diferenca => {
    // _.remove(contribuicoesList, function (contribuicao) {
    //   //   return contribuicao.cp == diferenca.cp;
    //   // });
    // });

    diferencas.forEach(diferenca => {

      // _.remove(contribuicoesList, function (contribuicao) {
      //   return contribuicao.cp == diferenca.cp;
      // });

      contribuicoesList.filter(function (contribuicao, index, arr) {
        return contribuicao.cp == diferenca.cp;
      });

    });

    return contribuicoesList;

  }



  public updateDatatablePeriodosSelecionados(vinculo) {


    if (typeof vinculo === 'object') {

      const periodo_in = this.formataPeriodo(this.formatReceivedDate(vinculo.data_inicio));
      const periodo_fi = this.formataPeriodo(this.formatReceivedDate(vinculo.data_termino));

      const datainicio = this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', this.formatReceivedDate(vinculo.data_inicio));
      const datatermino = this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', this.formatReceivedDate(vinculo.data_termino));
      vinculo.contribuicoes = [];

      if (typeof vinculo.sc !== 'undefined' && vinculo.sc) {
        vinculo.contribuicoes = JSON.parse(vinculo.sc);
      }

      const contribuicoes = this.verificarContribuicoes(periodo_in, periodo_fi, vinculo.contribuicoes);
      const result = this.countPendenciasSC(contribuicoes, '0,00');
      const result_mm = this.countPendenciasSC(contribuicoes, 'mm');

      const line = {
        id: vinculo.id,
        nit: '',
        cnpj: '',
        tipo_vinculo: vinculo.tipoVinculo,
        datainicio: datainicio,
        datatermino: datatermino,
        data_inicio: this.formatReceivedDate(vinculo.data_inicio),
        data_termino: this.formatReceivedDate(vinculo.data_termino),
        empresa: vinculo.empresa,
        fator_condicao_especial: vinculo.fator_condicao_especial,
        condicao_especial: (vinculo.condicao_especial === 0) ? 'Não' : 'Sim',
        carencia: (vinculo.carencia === 1) ? 'Sim' : 'Não',
        contribuicoes_pendentes: result ? result : 0,
        contribuicoes_pendentes_mm: result_mm ? result_mm : 0,
        // sc_mm_considerar_carencia: this.isExist(vinculo.sc_mm_considerar_carencia) ? null : vinculo.sc_mm_considerar_carencia,
        // sc_mm_considerar_tempo: this.isExist(vinculo.sc_mm_considerar_tempo) ? null : vinculo.sc_mm_considerar_tempo,
        // sc_mm_ajustar: this.isExist(vinculo.sc_mm_ajustar) ? null : vinculo.sc_mm_ajustar,
        sc_mm_considerar_carencia: vinculo.sc_mm_considerar_carencia,
        sc_mm_considerar_tempo: vinculo.sc_mm_considerar_tempo,
        sc_mm_ajustar: vinculo.sc_mm_ajustar,
        contribuicoes_count: contribuicoes.length,
        contribuicoes: contribuicoes,
        index: (this.vinculosList.length) + 1
      }

      this.vinculosList.push(line);
      this.isValidVinculo(line);
    }

  }


  public updateDatatablePeriodos(vinculo) {

    if (typeof vinculo === 'object') {

      const periodo_in = this.formataPeriodo(vinculo.periodo[0]);
      const periodo_fi = this.formataPeriodo(vinculo.periodo[1]);
      const contribuicoes = this.verificarContribuicoes(periodo_in, periodo_fi, vinculo.contribuicoes);
      const datainicio = this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', vinculo.periodo[0]);
      const datatermino = (vinculo.periodo[1] === undefined) ? this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', vinculo.periodo[1]) :
        this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', vinculo.periodo[0]);
      const result = this.countPendenciasSC(contribuicoes, '0,00');
      const result_mm = this.countPendenciasSC(contribuicoes, 'mm');

      console.log(contribuicoes);

      const line = {
        id: null,
        nit: vinculo.nitEmpregador,
        cnpj: vinculo.cnpj,
        tipo_vinculo: vinculo.tipoVinculo,
        datainicio: datainicio,
        datatermino: datatermino,
        data_inicio: vinculo.periodo[0],
        data_termino: vinculo.periodo[1],
        empresa: vinculo.origemVinculo,
        fator_condicao_especial: 1,
        condicao_especial: 'Não',
        carencia: 'Sim',
        contribuicoes_pendentes: result ? result : 0,
        contribuicoes_pendentes_mm: result_mm ? result_mm : 0,
        // sc_mm_considerar_carencia: this.isExist(vinculo.sc_mm_considerar_carencia) ? null : vinculo.sc_mm_considerar_carencia,
        // sc_mm_considerar_tempo: this.isExist(vinculo.sc_mm_considerar_tempo) ? null : vinculo.sc_mm_considerar_tempo,
        // sc_mm_ajustar: this.isExist(vinculo.sc_mm_ajustar) ? null : vinculo.sc_mm_ajustar,
        sc_mm_considerar_carencia: vinculo.sc_mm_considerar_carencia,
        sc_mm_considerar_tempo: vinculo.sc_mm_considerar_tempo,
        sc_mm_ajustar: vinculo.sc_mm_ajustar,
        contribuicoes_count: contribuicoes.length,
        contribuicoes: contribuicoes,
        index: vinculo.index
      }

      this.vinculosList.push(line);
      this.isValidVinculo(line);
    }


  }




  private ajusteListVinculos(calculoId) {

    console.log(this.vinculosList);

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
          id_contagem_tempo: calculoId,
          sc: JSON.stringify(vinculo.contribuicoes),
          sc_mm_considerar_carencia: vinculo.sc_mm_considerar_carencia,
          sc_mm_considerar_tempo: vinculo.sc_mm_considerar_tempo,
          sc_mm_ajustar: vinculo.sc_mm_ajustar,
          sc_pendentes: vinculo.contribuicoes_pendentes,
          sc_pendentes_mm: vinculo.contribuicoes_pendentes_mm,
          sc_count: vinculo.contribuicoes_count,
        }
      );
    }
  }


  private ajusteListVinculosUpdate(calculoId) {

    console.log(this.vinculosList);

    this.vinculosListPost = [];
    for (const vinculo of this.vinculosList) {
      this.vinculosListPost.push(new PeriodosContagemTempo(
        {
          id: (vinculo.id != null && vinculo.id !== undefined) ? vinculo.id : null,
          data_inicio: this.formatPostDataDate(vinculo.data_inicio),
          data_termino: this.formatPostDataDate(vinculo.data_termino),
          empresa: vinculo.empresa,
          fator_condicao_especial: this.formatFatorPost(vinculo.fator_condicao_especial),
          condicao_especial: this.boolToLiteral(vinculo.condicao_especial),
          carencia: this.boolToLiteral(vinculo.carencia),
          licenca_premio_nao_usufruida: 0,
          id_contagem_tempo: calculoId,
          sc: JSON.stringify(vinculo.contribuicoes),
          sc_mm_considerar_carencia: vinculo.sc_mm_considerar_carencia,
          sc_mm_considerar_tempo: vinculo.sc_mm_considerar_tempo,
          sc_mm_ajustar: vinculo.sc_mm_ajustar,
          sc_pendentes: vinculo.contribuicoes_pendentes,
          sc_pendentes_mm: vinculo.contribuicoes_pendentes_mm,
          sc_count: vinculo.contribuicoes_count,
          action: null
        })
      );
    }

    console.log(this.vinculosList);
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




  public crudPeriodosImportador(calculoId) {

    if (calculoId && this.vinculosList.length >= 1) {

      this.ajusteListVinculosUpdate(calculoId);
      console.log(this.vinculosListPost)
      return this.PeriodosContagemTempoService
        .updateListPeriodos(calculoId, this.vinculosListPost)
        .then(model => {
          return true;
        })
        .catch(errors => this.errors.add(errors));
    }

  }


  public copiarVinculo(index) {

     const vinculo = this.vinculosList.find(x => x.index === index);

    if (this.isEmpty(vinculo.data_inicio) || this.isEmpty(vinculo.data_termino)) {

      this.toastAlert('error', 'Verifique a Data Início e a Data Fim do período', null);

    } else {

      const vinculoCopy = Object.assign({}, vinculo);
      vinculoCopy.index = (this.vinculosList.length + 2);
      vinculoCopy.id = null;

      this.vinculosList.push(vinculoCopy);
      this.detector.detectChanges();
      this.toastAlert('success', 'Cópia efetuada', null);

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

          const periodo_in = this.formataPeriodo(this.data_inicio);
          const periodo_fi = this.formataPeriodo(this.data_termino);
          const contribuicoes = this.verificarContribuicoes(periodo_in, periodo_fi, vinculo.contribuicoes);

          const datainicio = this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', this.data_inicio);
          const datatermino = (this.data_termino === undefined) ? this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', this.data_inicio) :
            this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', this.data_termino);
          const result = this.countPendenciasSC(contribuicoes, '0,00');
          const result_mm = this.countPendenciasSC(contribuicoes, 'mm');

          vinculo.datainicio = datainicio;
          vinculo.datatermino = datatermino;
          vinculo.data_inicio = this.data_inicio;
          vinculo.data_termino = this.data_termino;
          vinculo.empresa = this.empresa;
          vinculo.fator_condicao_especial = this.fator_condicao_especial;
          vinculo.condicao_especial = this.boolToLiteral(this.condicao_especial);
          vinculo.carencia = this.boolToLiteral(this.carencia);
          vinculo.condicao_especial = this.boolToLiteral(this.condicao_especial);
          vinculo.carencia = this.boolToLiteral(this.carencia);
          vinculo.contribuicoes_pendentes = result ? result : 0;
          vinculo.contribuicoes_pendentes_mm = result_mm ? result_mm : 0;
          vinculo.contribuicoes_count = contribuicoes.length;
          vinculo.contribuicoes = contribuicoes;

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

      const periodo_in = this.formataPeriodo(this.data_inicio);
      const periodo_fi = this.formataPeriodo(this.data_termino);
      const contribuicoes = this.verificarContribuicoes(periodo_in, periodo_fi, []);

      const datainicio = this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', this.data_inicio);
      const datatermino = (this.data_termino === undefined) ? this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', this.data_termino) :
        this.formataDataTo('DD/MM/YYYY', 'YYYY/MM/DD', this.data_inicio);
      const result = this.countPendenciasSC(contribuicoes, '0,00');
      const result_mm = this.countPendenciasSC(contribuicoes, 'mm');

      const line = {
        data_inicio: this.data_inicio,
        data_termino: this.data_termino,
        empresa: this.empresa,
        fator_condicao_especial: this.fator_condicao_especial,
        condicao_especial: this.boolToLiteral(this.condicao_especial),
        carencia: this.boolToLiteral(this.carencia),
        index: (this.vinculosList.length + 2),
        datainicio: datainicio,
        datatermino: datatermino,
        contribuicoes_pendentes: result ? result : 0,
        contribuicoes_pendentes_mm: result_mm ? result_mm : 0,
        sc_mm_ajustar: null,
        sc_mm_considerar_tempo: null,
        sc_mm_considerar_carencia: null,
        contribuicoes_count: 0,
        contribuicoes: contribuicoes,
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

    const vinculoARemover = this.vinculosList.filter(vinculo => vinculo.index === index)[0];

    if (!this.isEmpty(vinculoARemover.id)) {

      this.PeriodosContagemTempoService.find(vinculoARemover.id)
        .then(periodo => {
          this.PeriodosContagemTempoService.destroy(periodo)
            .then(() => {

            }).catch((err) => {
              // this.toastAlert('error', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', null);
            });
        })

    }


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

    if (this.isEmpty(vinculo.data_inicio) || this.isEmpty(vinculo.data_termino)) {

      this.toastAlert('error', 'Verifique a Data Início e a Data Fim do período', null);

    } else {

      this.vinculo_index = index;
      this.vinculo = vinculo;
      this.ContribuicoesComponent.preencherMatrizPeriodos(this.vinculo.contribuicoes);
      this.contribuicoes.show();

    }

    console.log(index)
    console.log(this.vinculo_index)
    console.log(vinculo)

  }

  hideContribuicoes() {
    this.contribuicoes.hide();
  }



  eventContribuicoes(event) {

    console.log(event);

    switch (event.acao) {
      case 'sair':
        this.contribuicoes.hide();
        break;
      case 'salvar-check':
        this.setCheckVinculo(event);
        break;
      case 'salvar':
        this.setCheckVinculo(event);
        this.matrixToVinculoContribuicoes(event);
        this.contribuicoes.hide();
        break;
    }
  }


  private setCheckVinculo(value) {

    this.vinculosList.map(vinculo => {

      if (this.vinculo_index === vinculo.index) {
        vinculo.sc_mm_ajustar = value.sc_mm_ajustar;
        vinculo.sc_mm_considerar_tempo = value.sc_mm_considerar_tempo;
        vinculo.sc_mm_considerar_carencia = value.sc_mm_considerar_carencia;
        vinculo.contribuicoes_pendentes = value.result_sc ? value.result_sc : 0;
        vinculo.contribuicoes_pendentes_mm = value.result_sc_mm ? value.result_sc_mm : 0;
      }

    });

  }

  matrixToVinculoContribuicoes(eventRST) {

    const contribuicoesList = [];
    let mes = 0;
    let chave = '';
    let msc = 0;

    eventRST.matriz.forEach(periodo => {

      periodo.valores.forEach(contribuicao => {

        mes++;

        if (contribuicao != '') {
          chave = this.leftFillNum(mes, 2) + '/' + periodo.ano;
          msc = periodo.msc[mes - 1];

          contribuicoesList.push({
            cp: chave,
            sc: contribuicao,
            msc: msc
          });
        }

      });

      mes = 0;
    });

    this.vinculosList.map(vinculo => {

      if (this.vinculo_index === vinculo.index) {

        vinculo.contribuicoes = contribuicoesList;
        vinculo.contribuicoes_count = contribuicoesList.length;
        vinculo.sc_mm_ajustar = eventRST.sc_mm_ajustar;
        vinculo.sc_mm_considerar_tempo = eventRST.sc_mm_considerar_tempo;
        vinculo.sc_mm_considerar_carencia = eventRST.sc_mm_considerar_carencia;
        vinculo.contribuicoes_pendentes = eventRST.result_sc ? eventRST.result_sc : 0;
        vinculo.contribuicoes_pendentes_mm = eventRST.result_sc_mm ? eventRST.result_sc_mm : 0;

      }

    });

  }



  // private isValidPeriodoContribuicoes(vinculo) {

  //  // this.contribuicoes.hide();

  //   // let checkContrib = false;

  //   // console.log(vinculo);

  //   // const checkNumContricuicoes = !(vinculo.contribuicoes_pendentes > 0
  //   //   || vinculo.contribuicoes_pendentes_mm > 0);

  //   // const checkNumStatusContribuicoes = (vinculo.sc_mm_ajustar !== null
  //   //   && vinculo.sc_mm_considerar_carencia !== null
  //   //   && vinculo.sc_mm_considerar_tempo !== null);


  //   //   console.log(checkNumContricuicoes);
  //   //   console.log(checkNumStatusContribuicoes);


  //   // if (checkNumContricuicoes ||  (checkNumContricuicoes && checkNumStatusContribuicoes)) {
  //   //   checkContrib = true;
  //   // }

  //   // console.log(checkContrib);

  //   // if (checkContrib) {
  //   //   this.contribuicoes.hide();
  //   // }

  // }


  private getMoedaCompetencia(mes, ano) {
    const data = ano + '-' + mes + '-01';
    return this.moeda.find((md) => data === md.data_moeda);
  }


  private getClassSalarioContribuicao(mes, ano, valor) {

    valor = this.formatDecimalValue(valor);
    // mes = (rst) ? ('0' + mes).slice(-2) : mes;
    const moedaCompetencia = this.getMoedaCompetencia(mes, ano);

    let ClassRst = 0;
    if (valor > 0.00 && valor < parseFloat(moedaCompetencia.salario_minimo)) {
      ClassRst = 1
    }

    return ClassRst;


  }

  public formatDecimalValue(value) {

    // typeof value === 'string' || 
    if (isNaN(value)) {

      return parseFloat(value.replace(/\./g, '').replace(',', '.'));

    } else {

      return parseFloat(value);

    }

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
    if (data == undefined
      || data == ''
      || typeof data === 'undefined'
      || data === 'undefined') {
      return true;
    }
    return false;
  }

  isExist(data) {
    if (data == undefined
      || typeof data === 'undefined'
      || data === 'undefined') {
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




  public formataDataInicioFim(data) {

    if (data !== undefined
      && data !== ''
      && moment(data, 'DD/MM/YYYY').isValid()
    ) {

      const dataArray = data.split('/')
      return dataArray[2] + dataArray[1] + dataArray[0];

    }

    return '';

  }

  public formataDataTo(formatIN, FormatOuT, data) {

    if (data !== undefined
      && data !== ''
      && moment(data, formatIN).isValid()
    ) {

      return moment(data, formatIN).format(FormatOuT);

    }

    return '';

  }

  public formataPeriodo(inputData) {

    if (inputData !== undefined) {
      const data = inputData.split('/');
      const periodo = data[2] + this.leftFillNum(data[1], 2);
      return periodo;
    }

    return '00/0000';

  }

  moveNext(event, maxLength, nextElementId) {
    let value = event.srcElement.value;
    if (value.indexOf('_') < 0 && value != '') {
      let next = <HTMLInputElement>document.getElementById(nextElementId);
      next.focus();
    }
  }


}
