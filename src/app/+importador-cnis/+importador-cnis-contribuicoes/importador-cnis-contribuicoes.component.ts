import {
  Component, OnInit, Input, SimpleChange, OnChanges, ChangeDetectorRef,
  ViewChild, ElementRef, Output, EventEmitter
} from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap';
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';

@Component({
  selector: 'app-importador-cnis-contribuicoes',
  templateUrl: './importador-cnis-contribuicoes.component.html',
  styleUrls: ['./importador-cnis-contribuicoes.component.css'],
  providers: [
    ErrorService
  ]
})
export class ImportadorCnisContribuicoesComponent implements OnInit, OnChanges {

  @Input() vinculo;
  @Input() moeda;
  @Input() isUpdating;
  @Output() eventContribuicoes = new EventEmitter();

  @ViewChild('contribuicoesCheck') public contribuicoesCheck: ModalDirective;

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public inicioPeriodo = '';
  public finalPeriodo = '';
  public salarioContribuicao = undefined;

  public anosConsiderados = [];
  public matriz: any = [];
  public matrizHasValues = false;
  public contribuicao = [];
  private hashKey;

  private isSC_mm_ajustar_btn = false;
  public sc_mm_considerar_carencia = null;
  public sc_mm_considerar_tempo = null;
  public sc_mm_ajustar = 0;

  public result_sc = 0
  public result_sc_mm = 0;

  private vinculoTemp;

  public matrixTableOptions = {
    paging: false,
    ordering: false,
    info: false,
    searching: false
  }

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected errors: ErrorService,
    private detector: ChangeDetectorRef,
    private MoedaService: MoedaService,
  ) { }

  ngOnInit() {

    this.matrizHasValues = false;
    this.detector.detectChanges();

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const changedvinculo = changes['vinculo'];
    const changedisUpdating = changes['isUpdating'];

    if (typeof this.vinculo.contribuicoes !== 'undefined'
      && this.vinculo.contribuicoes.length > 0) {
      // const vinculo = changedvinculo.currentValue;
      // if (typeof vinculo.contribuicoes !== 'undefined'
      //   && vinculo.contribuicoes.length > 0) {

      this.matrizHasValues = false;
      // this.preencherCheckContribuicoes(vinculo);
      // this.preencherMatrizPeriodos(vinculo.contribuicoes);
      this.vinculoTemp =  Object.assign({}, this.vinculo);
      this.preencherCheckContribuicoes(this.vinculo);
      this.preencherMatrizPeriodos(this.vinculo.contribuicoes);

    }
  }

  preencherMatrizPeriodos(contribuicoes) {


    this.matriz = [{ 'ano': 0, 'valores': [], 'msc': [] }];

    contribuicoes.forEach(periodo => {
      this.preencherMatriz(periodo);
    });

    _.remove(this.matriz, function (item) {
      return item.ano === 0;
    });

    this.matriz.sort(function (a, b) { return a.ano - b.ano });
    this.errors.clear('inicioPeriodo');
    this.errors.clear('finalPeriodo');
    this.errors.clear('salarioContribuicao');

    this.matrizHasValues = true;
    this.detector.detectChanges();
  }

  private preencherCheckContribuicoes(vinculo) {

    this.isSC_mm_ajustar_btn = false

    if (!this.isEmpty(vinculo.sc_mm_considerar_carencia)) {
      this.sc_mm_considerar_carencia = vinculo.sc_mm_considerar_carencia;
    }

    if (!this.isEmpty(vinculo.sc_mm_considerar_tempo)) {
      this.sc_mm_considerar_tempo = vinculo.sc_mm_considerar_tempo;
    }

    if (!this.isEmpty(vinculo.sc_mm_ajustar)) {
      this.sc_mm_ajustar = vinculo.sc_mm_ajustar;
    }


  }


  preencherMatriz(periodo) {

    const splitPeriodo = periodo.cp.split('/');
    const mes = splitPeriodo[0];
    const ano = splitPeriodo[1];

    const result = _.find(this.matriz, (item) => {
      return item.ano === ano;
    });

    let valores = [];
    let msc = [];

    if (result) {

      valores = result.valores;
      msc = result.msc;

    } else {

      valores = ['', '', '', '', '', '', '', '', '', '', '', ''];
      msc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    }

    valores[+splitPeriodo[0] - 1] = periodo.sc;
    msc[+splitPeriodo[0] - 1] = this.getClassSalarioContribuicao(mes, ano, periodo.sc, null, true);

    const obj = {
      ano: ano,
      valores: valores,
      msc: msc,
    }

    const index = _.findIndex(this.matriz, ['ano', obj.ano]);
    this.matriz[index >= 0 ? index : this.matriz.length] = obj;

  }

  isValid() {

    this.errors.clear();

    let dateInicioPeriodo;
    let dateFinalPeriodo;

    if (!this.isEmpty(this.inicioPeriodo) && !this.isEmpty(this.finalPeriodo)) {
      dateInicioPeriodo = moment(this.inicioPeriodo.split('/')[1] + '-' + this.inicioPeriodo.split('/')[0] + '-01');
      dateFinalPeriodo = moment(this.finalPeriodo.split('/')[1] + '-' + this.finalPeriodo.split('/')[0] + '-01');
    }

    const dataLimite = moment('1970-01-01');

    // inicioPeriodo
    if (this.isEmpty(this.inicioPeriodo) || !dateInicioPeriodo.isValid()) {

      this.errors.add({ 'inicioPeriodo': ['Insira uma data válida'] });

    } else {

      // if (dateFinalPeriodo >= dataLimite) {
      //   this.errors.add({ "inicioPeriodo": ["Insira uma data posterior ou igual 01/1970"] });
      // }

      if (dateInicioPeriodo.isBefore(moment(this.vinculo.data_inicio, 'DD/MM/YYYY'), 'month')) {
        this.errors.add({ 'inicioPeriodo': ['Insira uma competência posterior ou igual ao inicio do período'] });
      }
    }

    // finalPeriodo
    if (this.isEmpty(this.finalPeriodo) || !dateFinalPeriodo.isValid()) {

      this.errors.add({ 'finalPeriodo': ['Insira uma data válida'] });

    } else {

      if (dateFinalPeriodo < dateInicioPeriodo) {
        this.errors.add({ 'finalPeriodo': ['Insira uma data posterior a data inicial'] });
      }

      if (dateFinalPeriodo.isAfter(moment(this.vinculo.data_termino, 'DD/MM/YYYY'), 'month')) {
        this.errors.add({ 'finalPeriodo': ['Insira uma competência anterior ou igual ao final do período'] });
      }

    }

    // salarioContribuicao
    if (this.isEmpty(this.salarioContribuicao)) {
      this.errors.add({ 'salarioContribuicao': ['Insira o salário'] });
    } else {
      this.errors.clear('salarioContribuicao');
    }

    return this.errors.empty();
  }

  isEmpty(data) {

    if (data === undefined
      || data === ''
      || typeof data === 'undefined'
      || data === 'undefined') {
      return true;
    }
    return false;
  }

  desfazerMatrizSC(){

      console.log(this.vinculoTemp);
      this.vinculo.contribuicoes = this.vinculoTemp.contribuicoes;
      this.preencherMatrizPeriodos(this.vinculo.contribuicoes);

  }

  copiarPeriodo(ano) {

    const result = _.filter(this.vinculo.contribuicoes, (item) => {
      return item.cp.indexOf(ano) > -1;
    });

    if (result) {
      this.inicioPeriodo = result[0].cp;
      this.finalPeriodo = result[result.length - 1].cp;
    }

  }

  moveNext(event, maxLength, nextElementId) {
    const value = event.srcElement.value;
    if (value.indexOf('_') < 0 && value !== '') {
      const next = <HTMLInputElement>document.getElementById(nextElementId);
      next.focus();
    }
  }

  preencherComValor() {

    if (this.isValid()) {

      const anoinicio = this.inicioPeriodo.split('/')[1];
      const mesinicio = this.inicioPeriodo.split('/')[0];
      const anofinal = this.finalPeriodo.split('/')[1];
      const mesfinal = this.finalPeriodo.split('/')[0];
      let mesi = 0;
      this.isSC_mm_ajustar_btn = false;

      this.matriz.map(ano => {

        if (ano.ano >= anoinicio && ano.ano <= anofinal) {
          mesi = 1;
          ano.valores.map(mes => {
            if (mesi >= parseInt(mesinicio, 10) && mesi <= parseInt(mesfinal, 10)) {

              const mesIndex = (mesi - 1);
              ano.valores[mesIndex] = this.formatMoney(this.salarioContribuicao);
              ano.msc[mesIndex] = this.getClassSalarioContribuicao(mesi, ano.ano, this.salarioContribuicao, null, true);

            }
            mesi++;
          });

        }
      });

    } else {

      swal({
        position: 'top-end',
        type: 'error',
        title: 'Confira os dados digitados',
        showConfirmButton: false,
        timer: 1000
      });

    }
  }

  public preencherComSalario(type = 'm') {

    let mesi = 0;
    let mesiC = 0;
    const salariominimo: any[][] = [];

    this.matriz.map(ano => {
      mesi = 1;
      ano.valores.map(mes => {
        if (mes === '0,00') {
          if (typeof salariominimo[ano.ano] === 'undefined') {
            salariominimo[ano.ano] = [];
          }
          salariominimo[ano.ano][mesi - 1] = mes;
        }
        mesi++;
      });


      // mesiC = 1;
      // ano.valores.map(mes => {
      //   if (mes === '0,00') {
      //     if (typeof salariominimo[ano.ano] === 'undefined') {
      //       salariominimo[ano.ano] = [];
      //     }
      //     salariominimo[ano.ano][mesiC - 1] = mes;
      //   }
      //   mesiC++;
      // });



    });

    this.matriz.map(ano => {
      mesi = 1;

      ano.valores.map(valor => {
        if (valor === '0,00') {

          const mesF = ('0' + mesi).slice(-2);
          const moeda = this.getMoedaCompetencia(mesF, ano.ano);
          const valorSC = (type === 'm') ? moeda.salario_minimo : moeda.teto;
          ano.valores[mesi - 1] = this.formatMoney(valorSC);

        }
        mesi++;
      });

      mesiC = 1;
      ano.msc.map(checkMM => {
        if (checkMM === 1) {

          const mesF = ('0' + mesiC).slice(-2);
          const moeda = this.getMoedaCompetencia(mesF, ano.ano);
          const valorSC = (type === 'm') ? moeda.salario_minimo : moeda.teto;
          ano.valores[mesiC - 1] = this.formatMoney(valorSC);
          ano.msc[mesiC - 1] = 0;

        }
        mesiC++;
      });
    });

    // if (salariominimo.length > 0) {
    //   var matriz = { ...salariominimo };

    //   swal({
    //     type: 'info',
    //     title: 'Obtendo Salário Mínimo, aguarde por favor...',
    //   });

    //   swal.showLoading();

    //   this.obterMoedaSalarioMatriz(matriz).then(salariominimo => {

    //     swal.close();

    //     this.matriz.map(ano => {
    //       mesi = 1;
    //       ano.valores.map(mes => {
    //         if (mes == '0,00') {
    //           ano.valores[mesi - 1] = salariominimo[ano.ano][mesi - 1];
    //         }
    //         mesi++;
    //       });
    //     });
    //   });
    // }
    
    this.detector.detectChanges();
  }

  private insertSCEnter(ev) {

    if (ev.keyCode === 13) {
      this.preencherComValor();
    }
  }


  public obterMoedaSalarioMatriz(salariominimo) {

    return this.MoedaService.moedaSalarioMatriz(salariominimo)
      .then(response => { return response; }).catch(errors => this.errors.add(errors));
  }

  hideContribuicoes() {
    const saida = {
      acao: 'sair'
    }
    this.eventContribuicoes.emit(saida);
  }


  changedGridContribuicoes(ano, event, indice) {

    const valor = event.target.value;

    this.matriz.map(row => {
      if (row.ano === ano) {
        row.valores[indice] = valor;
      }
    });


  }

  public onModelChange() { }

  salvarContribuicoes() {

    if (this.isValidPeriodoContribuicoes(this.matriz)) {

      const saida = {
        acao: 'salvar',
        matriz: this.matriz,
        sc_mm_ajustar: this.sc_mm_ajustar,
        sc_mm_considerar_tempo: this.sc_mm_considerar_tempo,
        sc_mm_considerar_carencia: this.sc_mm_considerar_carencia,
        result_sc: this.result_sc,
        result_sc_mm: this.result_sc_mm
      }
      this.eventContribuicoes.emit(saida);
    } else {
      this.toastAlert('error', 'Verifique a Data Início e a Data Fim do período', null);
      this.showContribuicoesCheck()
    }
  }


  private getMoedaCompetencia(mes, ano) {

    // const data = moment(ano + '-' + mes + '-01');
    // return this.moeda.find((md) => data.isSame(md.data_moeda, 'month'));
    let data = ano + '-' + mes + '-01';
    if (moment().isSameOrBefore(data)) {
      data = moment().format('YYYY-MM-01');
    }

    if (moment(data).isBefore(this.moeda[0].data_moeda)) {
      return {
        salario_minimo: 0,
        teto: 0
      };
    }

    return this.moeda.find((md) => data === md.data_moeda);
  }


  private getClassSalarioContribuicao(mes, ano, valor, index, rst = false) {

    valor = this.formatDecimalValue(valor);
    mes = (rst) ? ('0' + mes).slice(-2) : mes;

    const moedaCompetencia = this.getMoedaCompetencia(mes, ano);

    let ClassRst = 0;
    if (valor > 0.00 && valor < parseFloat(moedaCompetencia.salario_minimo)) {
      ClassRst = 1
    }

    // habilitar as opções de correcao e descarte
    if ((!this.isSC_mm_ajustar_btn && ClassRst) || (valor <= 0.00)) {
      this.isSC_mm_ajustar_btn = true;
    }

    if (rst) {

      return ClassRst;

    } else {

      const indexMes = parseInt(mes, 10) - 1;
      this.matriz[index].msc[indexMes] = ClassRst;

    }

  }

  /**
    * Formatar para moeda
    * @param  {} value
    */
  public formatMoney(value) {

    value = parseFloat(value);
    const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return numeroPadronizado;
  }

  public formatDecimalValue(value) {

    // typeof value === 'string' ||
    if (isNaN(value)) {

      return parseFloat(value.replace(/\./g, '').replace(',', '.'));

    } else {

      return parseFloat(value);

    }

  }



  private setCheckInformacoes() {

    const saida = {
      acao: 'salvar-check',
      sc_mm_ajustar: this.sc_mm_ajustar,
      sc_mm_considerar_tempo: this.sc_mm_considerar_tempo,
      sc_mm_considerar_carencia: this.sc_mm_considerar_carencia,
    }

    this.eventContribuicoes.emit(saida);
    this.hideContribuicoesCheck();

  }


  private isValidPeriodoContribuicoes(matriz) {

    let checkContrib = false;

    const contribuicoesList = [];
    let mes = 0;
    let chave = '';
    let msc = 0;

    matriz.forEach(periodo => {

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

    this.result_sc = this.countPendenciasSC(contribuicoesList, '0,00');
    this.result_sc_mm = this.countPendenciasSC(contribuicoesList, 'mm');

    const checkNumContricuicoes = !(this.result_sc > 0 || this.result_sc_mm > 0);

    const checkNumStatusContribuicoes = (
      this.sc_mm_considerar_carencia !== null &&
      (this.sc_mm_considerar_tempo === 0 ||
        (this.sc_mm_considerar_tempo === 1  && (this.sc_mm_ajustar === 0 || this.sc_mm_ajustar === 1)
         ))
    );

    if (checkNumContricuicoes || (!checkNumContricuicoes && checkNumStatusContribuicoes)) {
      checkContrib = true;
    }

    return checkContrib;

  }


  private countPendenciasSC(contribuicoes: Array<any>, type = 'mm') {

    if (type === 'mm') {
      return contribuicoes.filter(function (item) { if (item.msc === 1) { return item } }).length;
    }

    return contribuicoes.filter(function (item) { if (item.sc === '0,00') { return item } }).length;


    // if (type === 'mm') {
    //   return contribuicoes.filter(function (item) {
    //     if (item.msc === 1
    //       && moment(item.cp, 'MM/YYYY').isSameOrAfter('2019-11-14')) { return item }
    //   }).length;
    // }

    // return contribuicoes.filter(function (item) {
    //   if (item.sc === '0,00'
    //     && moment(item.cp, 'MM/YYYY').isSameOrAfter('2019-11-14')) { return item }
    // }).length;

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



  public leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, 0);
  }


  showContribuicoesCheck() {
    this.contribuicoesCheck.show();
  }

  hideContribuicoesCheck() {
    this.contribuicoesCheck.hide();
  }


}
