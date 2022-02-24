import {
  Component, OnInit, Input, SimpleChange, OnChanges, ChangeDetectorRef,
  ViewChild, ElementRef, Output, EventEmitter
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';

import { ModalDirective } from 'ngx-bootstrap';
import { MoedaService } from 'app/services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { ErrorService } from 'app/services/error.service';

import * as moment from 'moment';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-rgps-planejamento-contribuicoes',
  templateUrl: './rgps-planejamento-contribuicoes.component.html',
  styleUrls: ['./rgps-planejamento-contribuicoes.component.css'],
  providers: [
    ErrorService
  ]
})
export class RgpsPlanejamentoContribuicoesComponent implements OnInit, OnChanges {


  @Input() vinculo;
  @Input() planejamentoContrib;
  @Input() calculo;
  @Input() moeda;
  @Input() isEdit;
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
  public sc_mm_ajustar = null;

  public result_sc = 0
  public result_sc_mm = 0;
  public planejamentoContribTemp;

  public matrixTableOptions = {
    paging: false,
    ordering: false,
    info: false,
    searching: false
  }

  private isDataLoad = false;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected errors: ErrorService,
    private detector: ChangeDetectorRef,
    private MoedaService: MoedaService,
  ) { }

  ngOnInit() {
    /// this.detector.detectChanges();
  }



  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const changedPlanejamentoContrib = changes['planejamentoContrib'];
    const changedisUpdating = changes['isUpdating'];

    this.inicializarValores();

  }


  public inicializarValores() {

    this.isDataLoad = false;

    if (typeof this.planejamentoContrib !== 'undefined'
      && typeof this.planejamentoContrib.data_futura !== 'undefined') {

      this.planejamentoContribTemp = Object.assign({}, this.planejamentoContrib);

      this.preencherCheckContribuicoes(this.planejamentoContrib);
      this.preencherMatrizPeriodos(this.planejamentoContrib.sc);
      this.preencherSeHouverSalarioFixo();

      this.isDataLoad = true;
    }

  }


  private preencherSeHouverSalarioFixo() {

    if (this.isEdit && this.isEmpty(this.planejamentoContrib.sc)) {
      const list = this.planejamentoContrib.sc;
      const count = list.filter(x => x.sc !== '0,00').length;

      if (count === 0
        && !this.isEmpty(this.planejamentoContrib.valor_beneficio)
        && this.planejamentoContrib.valor_beneficio > 0) {

        this.inicioPeriodo = moment(this.planejamentoContrib.inicio, 'DD/MM/YYYY').format('MM/YYYY');
        this.finalPeriodo = moment(this.planejamentoContrib.data_futura).format('MM/YYYY');
        this.salarioContribuicao = this.planejamentoContrib.valor_beneficio;
        this.preencherComValor();

      }
    }

  }




  preencherMatrizPeriodos(contribuicoes) {

    this.matriz = [{ 'ano': 0, 'sc': [], 'msc': [] }];

    if (typeof contribuicoes !== 'string' && contribuicoes.length > 0) {

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

    }
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

    let sc = [];
    let msc = [];

    if (result) {

      sc = result.sc;
      msc = result.msc;

    } else {

      sc = ['', '', '', '', '', '', '', '', '', '', '', ''];
      msc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    }

    sc[+splitPeriodo[0] - 1] = periodo.sc;
    msc[+splitPeriodo[0] - 1] = this.getClassSalarioContribuicao(mes, ano, periodo.sc, null, true);

    const obj = {
      ano: ano,
      sc: sc,
      msc: msc,
    }

    const index = _.findIndex(this.matriz, ['ano', obj.ano]);
    this.matriz[index >= 0 ? index : this.matriz.length] = obj;

  }

  isValid() {

    this.errors.clear();

    // if (this.calculo !== undefined && (typeof this.vinculo === 'undefined' || typeof this.vinculo.data_inicio === 'undefined')) {
    //   this.vinculo = {};
    //   this.vinculo['data_inicio'] =  this.calculo.data_pedido_beneficio;
    // }


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

      if (dateInicioPeriodo.isBefore(moment(this.planejamentoContrib.inicio, 'DD/MM/YYYY'), 'month')) {
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

      if (dateFinalPeriodo.isAfter(moment(this.planejamentoContrib.data_futura, 'DD/MM/YYYY'), 'month')) {
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

  copiarPeriodo(ano) {

    const result = _.filter(this.planejamentoContrib.sc, (item) => {
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

      this.sc_mm_considerar_carencia = null;
      this.sc_mm_considerar_tempo = null;
      this.sc_mm_ajustar = null;

      const anoinicio = this.inicioPeriodo.split('/')[1];
      const mesinicio = this.inicioPeriodo.split('/')[0];
      const anofinal = this.finalPeriodo.split('/')[1];
      const mesfinal = this.finalPeriodo.split('/')[0];
      this.isSC_mm_ajustar_btn = false;

      const iniM = moment(this.inicioPeriodo, 'MM/YYYY');
      const FimM = moment(this.finalPeriodo, 'MM/YYYY');

      this.matriz.map(ano => {

        if (ano.ano >= anoinicio && ano.ano <= anofinal) {
          ano.sc.map((mes, index) => {

            const dateMTeste = moment(('0' + (index + 1)).slice(-2) + '/' + ano.ano, 'MM/YYYY');
            // console.log(((index + 1) >= parseInt(mesinicio, 10) && ano.ano >= anoinicio)
            // && ((index + 1) <= parseInt(mesfinal, 10) && ano.ano <= anofinal));

            if (dateMTeste.isBetween(iniM, FimM, 'month', '[]')) {

              ano.sc[index] = this.formatMoney(this.salarioContribuicao);
              ano.msc[index] = this.getClassSalarioContribuicao((index + 1), ano.ano, this.salarioContribuicao, null, true);

            }

          });

        }
      });


      //  this.salvarContribuicoes();

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
      ano.sc.map(mes => {
        if (mes === '0,00') {
          if (typeof salariominimo[ano.ano] === 'undefined') {
            salariominimo[ano.ano] = [];
          }
          salariominimo[ano.ano][mesi - 1] = mes;
        }
        mesi++;
      });


      // mesiC = 1;
      // ano.sc.map(mes => {
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

      ano.sc.map(valor => {
        if (valor === '0,00') {

          const mesF = ('0' + mesi).slice(-2);
          const moeda = this.getMoedaCompetencia(mesF, ano.ano);
          const valorSC = (type === 'm') ? moeda.salario_minimo : moeda.teto;
          ano.sc[mesi - 1] = this.formatMoney(valorSC);

        }
        mesi++;
      });

      mesiC = 1;
      ano.msc.map(checkMM => {
        if (checkMM === 1) {

          const mesF = ('0' + mesiC).slice(-2);
          const moeda = this.getMoedaCompetencia(mesF, ano.ano);
          const valorSC = (type === 'm') ? moeda.salario_minimo : moeda.teto;
          ano.sc[mesiC - 1] = this.formatMoney(valorSC);
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
    //       ano.sc.map(mes => {
    //         if (mes == '0,00') {
    //           ano.sc[mesi - 1] = salariominimo[ano.ano][mesi - 1];
    //         }
    //         mesi++;
    //       });
    //     });
    //   });
    // }

  }


  desfazerMatrizSC() {

    this.planejamentoContrib.sc = this.planejamentoContribTemp.sc;
    this.preencherMatrizPeriodos(this.planejamentoContrib.sc);

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
        row.sc[indice] = valor;
      }
    });

    // this.salvarContribuicoes();
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
        result_sc_mm: this.result_sc_mm,
        planejamento: this.planejamentoContrib,
        sc_pendentes: this.result_sc,
        sc_pendentes_mm: this.result_sc_mm
      };

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

    if (isNaN(value)) {

      return parseFloat(value.replace(/\./g, '').replace(',', '.'));

    } else {

      return parseFloat(value);

    }

  }


  private setCheckInformacoes() {

    this.planejamentoContrib.sc_mm_ajustar = this.sc_mm_ajustar;
    this.planejamentoContrib.sc_mm_considerar_tempo = this.sc_mm_considerar_tempo
    this.planejamentoContrib.sc_mm_considerar_carencia = this.sc_mm_considerar_carencia

    const saida = {
      acao: 'salvar-check',
      planejamento: this.planejamentoContrib
    }

    // this.eventContribuicoes.emit(saida);
    this.hideContribuicoesCheck();
    // this.salvarContribuicoes();

  }


  private isValidPeriodoContribuicoes(matriz) {

    let checkContrib = false;

    const contribuicoesList = [];
    let mes = 0;
    let chave = '';
    let msc = 0;

    matriz.forEach(periodo => {

      periodo.sc.forEach(contribuicao => {

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

    const checkNumContricuicoes = !(this.result_sc_mm > 0);
    // const checkNumContricuicoes = !(this.result_sc > 0 || this.result_sc_mm > 0);

    const checkNumStatusContribuicoes = (
      this.sc_mm_considerar_carencia !== null &&
      (this.sc_mm_considerar_tempo === 0 || (this.sc_mm_considerar_tempo === 1 && (this.sc_mm_ajustar === 0 || this.sc_mm_ajustar === 1)))
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



  // preencherComValor() {

  //   if (this.isValid()) {

  //     const anoinicio = this.inicioPeriodo.split('/')[1];
  //     const mesinicio = this.inicioPeriodo.split('/')[0];
  //     const anofinal = this.finalPeriodo.split('/')[1];
  //     const mesfinal = this.finalPeriodo.split('/')[0];
  //     let mesi = 0;
  //     this.isSC_mm_ajustar_btn = false;

  //     this.matriz.map(ano => {
  //       console.log((ano.ano >= anoinicio && ano.ano <= anofinal))

  //       if (ano.ano >= anoinicio && ano.ano <= anofinal) {
  //         mesi = 1;
  //         ano.sc.map(mes => {
  //           if (mesi >= parseInt(mesinicio, 10) && mesi <= parseInt(mesfinal, 10)) {

  //             const mesIndex = (mesi - 1);

  //             ano.sc[mesIndex] = this.formatMoney(this.salarioContribuicao);
  //             ano.msc[mesIndex] = this.getClassSalarioContribuicao(mesi, ano.ano, this.salarioContribuicao, null, true);
  //           }
  //           mesi++;
  //         });

  //       }
  //     });


  //     console.log(this.salarioContribuicao)
  //     console.log(this.matriz)

  //     this.isDataLoad = true;
  //     this.matrizHasValues = true;

  //   } else {

  //     swal({
  //       position: 'top-end',
  //       type: 'error',
  //       title: 'Confira os dados digitados',
  //       showConfirmButton: false,
  //       timer: 1000
  //     });

  //   }
  // }


}
