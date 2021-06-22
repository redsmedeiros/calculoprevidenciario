import { Component, OnInit, Input, SimpleChange, OnChanges, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import swal from 'sweetalert2';
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

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public inicioPeriodo = '';
  public finalPeriodo = '';
  public salarioContribuicao = undefined;

  public anosConsiderados = [];
  public matriz: any = [];
  public matrizHasValues = false;
  public contribuicao = [];
  private hashKey;

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
    this.detector.detectChanges();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const changedvinculo = changes['vinculo'];
    const changedisUpdating = changes['isUpdating'];

    if (typeof this.vinculo.contribuicoes !== 'undefined'
      && this.vinculo.contribuicoes.length > 0) {
      this.preencherMatrizPeriodos(this.vinculo.contribuicoes);
    }

    console.log(this.moeda);
  }

  preencherMatrizPeriodos(contribuicoes) {

    this.matriz = [{ 'ano': 0, 'valores': [], 'class': [] }];

    contribuicoes.forEach(periodo => {
      this.preencherMatriz(periodo);
    });

    _.remove(this.matriz, function (item) {
      return item.ano == 0;
    });

    this.matriz.sort(function (a, b) { return a.ano - b.ano });
    this.errors.clear('inicioPeriodo');
    this.errors.clear('finalPeriodo');
    this.errors.clear('salarioContribuicao');
    this.matrizHasValues = true;
  }

  preencherMatriz(periodo) {

    let ano = periodo.cp.split('/')[1];
    let result = _.find(this.matriz, (item) => {
      return item.ano === ano;
    });

    let valores = [];

    if (result) {
      valores = result.valores;
    } else {
      valores = ['', '', '', '', '', '', '', '', '', '', '', ''];
    }

    valores[+periodo.cp.split('/')[0] - 1] = periodo.sc;

    var obj = {
      ano: ano,
      valores: valores,
      class: ['', '', '', '', '', '', '', '', '', '', '', ''],
    }

    var index = _.findIndex(this.matriz, ['ano', obj.ano]);
    this.matriz[index >= 0 ? index : this.matriz.length] = obj;

  }

  isValid() {
    let dateInicioPeriodo = moment(this.inicioPeriodo.split('/')[1] + '-' + this.inicioPeriodo.split('/')[0] + '-01');
    let dateFinalPeriodo = moment(this.finalPeriodo.split('/')[1] + '-' + this.finalPeriodo.split('/')[0] + '-01');
    let dataLimite = moment('1970-01-01');

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

    //finalPeriodo
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

    //salarioContribuicao
    if (this.isEmpty(this.salarioContribuicao)) {
      this.errors.add({ 'salarioContribuicao': ['Insira o salário'] });
    } else {
      this.errors.clear('salarioContribuicao');
    }

    return this.errors.empty();
  }

  isEmpty(data) {

    if (data == undefined || data === '') {
      return true;
    }
    return false;
  }

  copiarPeriodo(ano) {

    var result = _.filter(this.vinculo.contribuicoes, (item) => {
      return item.cp.indexOf(ano) > -1;
    });

    if (result) {
      this.inicioPeriodo = result[0].cp;
      this.finalPeriodo = result[result.length - 1].cp;
    }

  }

  moveNext(event, maxLength, nextElementId) {
    let value = event.srcElement.value;
    if (value.indexOf('_') < 0 && value != '') {
      let next = <HTMLInputElement>document.getElementById(nextElementId);
      next.focus();
    }
  }

  preencherComValor() {

    if (this.isValid()) {

      let anoinicio = this.inicioPeriodo.split('/')[1];
      let mesinicio = this.inicioPeriodo.split('/')[0];
      let anofinal = this.finalPeriodo.split('/')[1];
      let mesfinal = this.finalPeriodo.split('/')[0];
      let mesi = 0;

      this.matriz.map(ano => {

        if (ano.ano >= anoinicio && ano.ano <= anofinal) {
          mesi = 1;
          ano.valores.map(mes => {
            if (mesi >= parseInt(mesinicio) && mesi <= parseInt(mesfinal)) {
              ano.valores[mesi - 1] = this.salarioContribuicao;
            }
            mesi++;
          });

        }
      });

    } else {
      swal('Erro', 'Confira os dados digitados', 'error');
    }
  }

  preencherComSalarioMinimo() {

    let mesi = 0;
    let salariominimo: any[][] = [];

    this.matriz.map(ano => {
      mesi = 1;
      ano.valores.map(mes => {
        if (mes == '0,00') {
          if (typeof salariominimo[ano.ano] === 'undefined') {
            salariominimo[ano.ano] = [];
          }
          salariominimo[ano.ano][mesi - 1] = mes;
        }
        mesi++;
      });

    });

    if (salariominimo.length > 0) {
      var matriz = { ...salariominimo };

      swal({
        type: 'info',
        title: 'Obtendo Salário Mínimo, aguarde por favor...',
      });

      swal.showLoading();

      this.obterMoedaSalarioMatriz(matriz).then(salariominimo => {

        swal.close();

        this.matriz.map(ano => {
          mesi = 1;
          ano.valores.map(mes => {
            if (mes == '0,00') {
              ano.valores[mesi - 1] = salariominimo[ano.ano][mesi - 1];
            }
            mesi++;
          });
        });
      });
    }

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

    let valor = event.target.value;

    this.matriz.map(row => {
      if (row.ano === ano) {
        row.valores[indice] = valor;
      }
    });


  }

  private onModelChange(ev) { }

  salvarContribuicoes() {

    console.log(this.matriz);

    const saida = {
      acao: 'salvar',
      matriz: this.matriz
    }
    this.eventContribuicoes.emit(saida);

  }


  private getMoedaCompetencia(mes, ano) {

    //const data = moment(ano + '-' + mes + '-01');
    const data = ano + '-' + mes + '-01';
    //return this.moeda.find((md) => data.isSame(md.data_moeda, 'month'));
    return this.moeda.find((md) => data === md.data_moeda);

  }

  private getClassSalarioContribuicao(mes, ano, valor) {

    // console.log(valor);


    //   valor = this.formatDecimalValue(valor);

    // const moedaCompetencia = this.getMoedaCompetencia(mes, ano);

    // console.log(valor);
    // console.log( moedaCompetencia.salario_minimo);

    // if ( valor > 0.00 && valor < parseFloat(moedaCompetencia.salario_minimo)) {
    //   return true;
    // }

    return false;

  }

  public formatDecimalValue(value) {

    // typeof value === 'string' || 
    if (isNaN(value)) {

      return parseFloat(value.replace(/\./g, '').replace(',', '.'));

    } else {

      return parseFloat(value);

    }

  }

}
