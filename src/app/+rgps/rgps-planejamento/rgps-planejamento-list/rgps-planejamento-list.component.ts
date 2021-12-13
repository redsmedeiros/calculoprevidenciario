
import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild, DoCheck, SimpleChange, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ModalDirective } from 'ngx-bootstrap';
import { RgpsPlanejamentoService } from './../rgps-planejamento.service';
import { PlanejamentoRgps } from './../PlanejamentoRgps.model';
import { RgpsPlanejamentoListTableComponent } from './rgps-planejamento-list-table/rgps-planejamento-list-table.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ErrorService } from '../../../services/error.service';
import { DOCUMENT } from '@angular/platform-browser';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { DefinicoesPlanejamento } from '../shared/definicoes-planejamento';
import { MoedaService } from 'app/services/Moeda.service';
import { Moeda } from 'app/services/Moeda.model';

import { RgpsPlanejamentoContribuicoesComponent } from './rgps-planejamento-contribuicoes/rgps-planejamento-contribuicoes.component';


@Component({
  selector: 'app-rgps-planejamento-list',
  templateUrl: './rgps-planejamento-list.component.html',
  styleUrls: ['./rgps-planejamento-list.component.css'],
  providers: [
    ErrorService,
  ],
})
export class RgpsPlanejamentoListComponent implements OnInit, OnChanges {

  private planejamentoSelecionado;
  private isPlanejamentoSelecionado = false;


  @Input() segurado;
  @Input() calculo;
  @Input() isCalculoSelecionado;


  @Output() planejamentoSelecionadoEvent = new EventEmitter();

  public form = { ...PlanejamentoRgps.form };
  public planejamentoListData = [];
  public isEdit = false;
  public isCreate = false;
  public checkboxIdList = [];
  public dateMaskdiB = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  public isUpdatePlan = true;
  public userId;

  public userCheck = false;

  private baseUrl = window.location.origin;
  private url;
  private isResultRMIFutura;

  /// form
  private id;
  private id_calculo;
  private data_futura;
  private valor_beneficio = '0.00';
  private aliquota = '';
  private especie = '';

  // private sc = [];
  // private sc_count = 0;
  // private sc_mm_ajustar = 0;
  // private sc_mm_considerar_tempo = 0;
  // private sc_mm_considerar_carencia = 0;
  // private contribuicoes_pendentes = 0;
  // private contribuicoes_pendentes_mm = 0;
  /// form

  public plan = {
    id: '',
    id_calculo: '',
    data_futura: '',
    valor_beneficio: '0.00',
    aliquota: '',
    especie: '',
    contribuicoes_pendentes_mm: 0,
    contribuicoes_pendentes: 0,
    sc: []
  };

  private plan_index;
  private planejamentoContrib;
  private createplanejamentoContrib = true;

  private listAliquotas = [];
  private listEspecies = [];
  private lastModel;
  private moeda;
  private moedaList;

  @ViewChild(RgpsPlanejamentoContribuicoesComponent) ContribuicoesComponent: RgpsPlanejamentoContribuicoesComponent;
  // @ViewChild('contribuicoes_plan') public contribuicoes: ModalDirective;
  @ViewChild('modalPlan') public modalPlan: ModalDirective;

  // public activeStep = this.steps[0];

  public datatableOptionsPlan = {
    colReorder: true,
    data: this.planejamentoListData,
    order: [[0, 'desc']],
    columns: [
      { data: 'id', visible: false },
      {
        data: 'data_futura',
        render: (data) => {
          return this.formatData(data);
        }
      },
      { data: 'especie' },
      {
        data: 'valor_beneficio',
        render: (data) => {
          return this.formatMoeda(data);
        }
      },
      {
        data: 'aliquota',
        render: (data) => {
          return this.getAliquotasLabel(data);
        }
      },
      {
        data: 'actions',
        render: (data, type, row) => {
          return this.getAcoesPlanejamento(row.id);
        }, width: '6rem', class: 'p-0'
      },
      {
        data: 'selecionarPlanejamento',
        render: (data, type, row) => {
          return this.getBtnSelecionarPlanejamento(row.id);
        }, width: '6rem', class: 'p-0'
      },
    ]
  };

  constructor(
    private errors: ErrorService,
    protected rgpsPlanejamentoService: RgpsPlanejamentoService,
    private route: ActivatedRoute,
    protected Moeda: MoedaService,
    protected router: Router,
    private sanitizer: DomSanitizer,
    private detector: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.resetForm();
    this.verificacoesAcesso();
    this.getAliquotas();
    this.getEspecies();
  }

  verificacoesAcesso() {

    this.userId = localStorage.getItem('user_id') || this.route.snapshot.queryParams['user_id'];

    if (this.userId) {
      localStorage.setItem('user_id', this.userId);
    } else {
      window.location.href = environment.loginPageUrl;
    }

  }

  private getAliquotas() {
    this.listAliquotas = DefinicoesPlanejamento.aliquotasList;
  }

  private getAliquotasLabel(value) {
    return DefinicoesPlanejamento.getAliquota(Number(value)).label;
  }

  private getEspecies() {
    this.listEspecies = DefinicoesPlanejamento.especiesPlanejamento;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const changedCalculo = changes['calculo'];
    const changedSegurado = changes['segurado'];

    if (changedCalculo !== undefined && changedCalculo.currentValue) {
      this.getInfoCalculos();
    }

  }


  private updateDatatable() {

    this.datatableOptionsPlan = {
      ...this.datatableOptionsPlan,
      data: this.planejamentoListData,
    }
  }

  private getInfoCalculos() {

    this.id_calculo = this.calculo.id;

    this.isUpdatePlan = true;
    this.planejamentoListData = [];
    this.rgpsPlanejamentoService
      .getPlanejamentoByCalculoId(this.id_calculo)
      .then((planejamentoRst: PlanejamentoRgps[]) => {

        for (const plan of planejamentoRst) {
          this.planejamentoListData.push(plan);
        }
        this.updateDatatable();
        this.isUpdatePlan = false;
      });

    this.Moeda.moedaSalarioMinimoTeto().then((moedaList: Moeda[]) => {

      this.moedaList = moedaList
      this.getLastMoeda(this.moedaList);

    })
  }

  private getLastMoeda(moedaList) {

    const data1 = moment().subtract(1, 'months').format('YYYY-MM-01');
    const data2 = moment().format('YYYY-MM-01');
    const moeda = moedaList.filter((x) => x.data_moeda === data1 || x.data_moeda === data2)

    this.moeda = moeda[1];
    if (moeda[1].salario_minimo == undefined) {
      this.moeda = moeda[0];
    }

  }


  verificaPlano() {
    const basico = window.localStorage.getItem('product');

    if (basico === '9dwtctrm') {
      this.userCheck = false;
      swal(
        'Ferramenta disponível somente para clientes Premium.',
        '',
        'error'
      ).then(function () {
        swal('Assine já!', '', 'success').then(function () {
          window.open('http://ieprevpremium.com.br/');
        });
      });
    } else {
      this.userCheck = true;
    }
    return this.userCheck;
  }


  private setPlan() {

    if (this.isExits(this.id)) {
      this.plan.id = this.id;
    }

    this.plan.id_calculo = this.id_calculo;
    this.plan.data_futura = this.data_futura;
    this.plan.valor_beneficio = this.valor_beneficio;
    this.plan.aliquota = this.aliquota;
    this.plan.especie = this.especie;
    this.plan.sc = this.formatContribuicaoList(this.plan.sc, 's');

  }

  // private deletarPlananejamentoList(rowPlan) {
  private deletarPlananejamentoList(id) {

    const objPlan = this.planejamentoListData.find(row => row.id === id);

    if (objPlan && this.isExits(objPlan)) {
      this.rgpsPlanejamentoService
        .destroy(objPlan)
        .then(() => {

          swal({
            position: 'top-end',
            type: 'success',
            title: 'O planejamento foi removido.',
            showConfirmButton: false,
            timer: 1000
          });

          this.getInfoCalculos();
        })
        .catch((err) => {

          swal({
            position: 'top-end',
            type: 'error',
            title: 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.',
            showConfirmButton: false,
            timer: 1000
          });

        });
    }
  }


  // getupdatePlananejamentoList(rowPlan) {
  getupdatePlananejamentoList(id) {

    this.isEdit = true;
    this.plan = this.planejamentoListData.find(row => row.id === id);

    this.id = this.plan.id;
    // this.data_futura = this.plan.data_futura;
    this.valor_beneficio = this.plan.valor_beneficio;
    this.aliquota = this.plan.aliquota;
    this.especie = this.plan.especie;

    this.data_futura = this.formatReceivedDate(this.plan.data_futura);
    this.showQuadroContribuicoes();
    this.showChildModal();

  }


  resetForm() {

    this.id = '';
    this.data_futura = '';
    this.valor_beneficio = '0.00';
    this.aliquota = '';
    this.especie = '';

  }


  public updatePlan(event, type = null) {

    if (type === null && this.valid()) {

      this.isEdit = false;
      this.setPlan();

      this.updatePlanejamento(this.plan);
    }

    if (type === 'sc') {
      if (typeof this.planejamentoContrib !== 'undefined') {

        // this.isEdit = false;
        // const objPlanejamento = Object.assign({}, this.planejamentoContrib);
        // objPlanejamento.sc = this.formatContribuicaoList(objPlanejamento.sc);

        this.planejamentoContrib.sc = this.formatContribuicaoList(this.planejamentoContrib.sc, 's')
        this.updatePlanejamento(this.planejamentoContrib);

      }
    }
  }


  public updatePlanejamento(plan) {

    this.rgpsPlanejamentoService
      .update(plan)
      .then(model => {

        swal({
          position: 'top-end',
          type: 'success',
          title: 'Dados alterado com sucesso.',
          showConfirmButton: false,
          timer: 1000
        });

        this.getInfoCalculos();
        this.resetForm();
        this.modalPlan.hide();

      })
      .catch((errors) => {

        // this.errors.add(errors);

      });
  }




  salvarPlanejamento(event) {

    if (this.valid()) {

      this.setPlan();

      this.rgpsPlanejamentoService
        .save(this.plan)
        .then((model) => {

          this.getInfoCalculos();

          swal({
            position: 'top-end',
            type: 'success',
            title: 'Dados salvo com sucesso.',
            showConfirmButton: false,
            timer: 1000
          });

          this.resetForm();
          this.modalPlan.hide();

        }).catch((errors) => {

          // this.errors.add(errors);

        });
    }

  }


  // Novo quadro de contribuicoes semelhante ao RMI 
  private showQuadroContribuicoes() {

    this.createplanejamentoContrib = false;

    if (this.isEdit) {

      this.planejamentoContrib = this.setPlanRow(this.plan, this.data_futura);

    } else {

      this.plan_index = 0;
      this.planejamentoContrib = this.setPlanRow({ ...PlanejamentoRgps.form }, this.data_futura);

    }

    this.createplanejamentoContrib = true;

  }



  private changeDIB() {

    if (!(/_/gi).test(this.data_futura) &&
      moment(this.data_futura, 'DD/MM/YYYY').isValid()
      && moment(this.data_futura, 'DD/MM/YYYY').isAfter(moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY'), 'months')) {

      // console.log(moment(this.data_futura, 'DD/MM/YYYY').isValid())
      // console.log(typeof this.data_futura)
      // console.log(!(/_/gi).test(this.data_futura))
      // console.log(this.data_futura);


      this.showQuadroContribuicoes();
     
    }


  }


  // planejamentoSelecionadoEvent
  private planejar(id) {

    const objPlan = this.planejamentoListData.find(row => row.id === id);
    const objExport = JSON.stringify(objPlan);
    sessionStorage.setItem('exportPlanejamento', objExport);

    // window.location.href
    const urlpbcNew = '/rgps/rgps-resultados/' + this.segurado.id + '/' + this.calculo.id + '/plan/' + objPlan.id;
    this.router.navigate([urlpbcNew]);

  }


  private getRow(id) {

    if (this.isExits(id)) {

      const objPlan = this.planejamentoListData.find(row => row.id === id);
      this.planejamentoSelecionado = objPlan;

      const objExport = JSON.stringify(objPlan);
      sessionStorage.setItem('exportPlanejamento', objExport);

      this.isPlanejamentoSelecionado = true;
      this.planejamentoSelecionadoEvent.emit(this.planejamentoSelecionado);

    }
  }


  public getBtnSelecionarPlanejamento(id) {

    return `<div class="checkbox"><label>
                 <input type="checkbox" id='${id}-checkbox' class="select-btn checkbox checkboxCalculos" value="${id}"><span></span></label>
          </div>`;
  }

  private getAcoesPlanejamento(id) {
    return `
        <div class="btn-group">
          <button type="button" id='${id}-edit' class="btn btn-xs btn-warning update-btn" title='Editar'>
            <i class='fa fa-edit fa-1-7x'></i>
          </button>
          <button type="button" id='${id}-delete' class="btn btn-xs btn-danger delete-btn" title='Excluir'>
            <i class='fa fa-times fa-1-7x'></i>
          </button>
        </div>
     `;
  }

  formatMoeda(value, sigla = 'R$') {

    value = parseFloat(value);
    const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return sigla + ' ' + numeroPadronizado;
  }

  formatData(value) {
    return moment(value).format('DD/MM/YYYY');
    // return value;
  }


  formatAliquota(value) {

    return value + '%';
  }

  public showChildModal(): void {
    this.modalPlan.show();
  }

  public hideChildModal(): void {
    this.modalPlan.hide();
  }



  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }




  valid() {

    this.errors.clear();
    let valid = true;

    if (Number(this.valor_beneficio) != 0) {

      if (this.valor_beneficio == undefined || this.valor_beneficio == '') {
        this.errors.add({ 'valor_beneficio': ['O campo é obrigatório.'] });
        valid = false;

      } else if ((Number(this.valor_beneficio) < Number(this.moeda.salario_minimo))) {

        this.errors.add({ 'valor_beneficio': ['SC inferior ao limite mínimo'] });
        valid = false;

      } else if ((Number(this.valor_beneficio) > Number(this.moeda.teto))) {

        this.errors.add({ 'valor_beneficio': ['SC superior ao limite máximo.'] });
        valid = false;

      } else if (![8, 11, 20, 201, 99].includes(Number(this.aliquota))
        && (Number(this.valor_beneficio) > Number(this.moeda.salario_minimo))) {

        this.errors.add({
          'valor_beneficio':
            ['O SC não pode ser superior ao valor do salário mínimo na espécie de segurado selecionado.']
        });
        valid = false;

      }

    }


    if (this.aliquota == undefined || this.aliquota == '') {
      this.errors.add({ 'aliquota': ['O campo é obrigatório.'] });
      valid = false;
    }


    if (this.especie == undefined || this.especie == '') {
      this.errors.add({ 'especie': ['O campo é obrigatório.'] });
      valid = false;
    }

    valid = this.validDIB(valid);

    return valid;
  }



  private validDIB(valid) {
    const dataHoje = moment().add(-1, 'day');
    const datadibAtual = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    const dataFutura = this.data_futura;
    if (!this.isExits(this.data_futura)) {
      this.errors.add({ 'data_futura': ['O campo é obrigatório.'] });
      valid = false;
    } else if (moment(dataFutura, 'DD/MM/YYYY') < dataHoje) {
      this.errors.add({ 'data_futura': ['A DIB futura deve ser superior a DIB atual.'] });
      valid = false;
    } else if (moment(dataFutura, 'DD/MM/YYYY').isSameOrBefore(datadibAtual)) {
      this.errors.add({ 'data_futura': ['A data deve ser superior a data do cálculo atual.'] });
      valid = false;
    }

    return valid;
  }


  // contribuições



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


  public verificarContribuicoes(periodo_in, periodo_fi, contribuicoes) {

    const contribuicoesList = [];
    let result = contribuicoes;
    let chave = periodo_in;

    do {

      const ano = chave.substring(0, 4);
      const mes = chave.substring(4, 6);
      const pchave = mes + '/' + ano;

      result = contribuicoes.find((item) => {
        return item.cp === pchave;
      });

      if (result && result !== undefined) { /* se encontrou a contribuição no mes*/

        result.msc = this.getClassSalarioContribuicao(mes, ano, result.sc);

        contribuicoesList.push(result);

      } else { /* se não encontrou a contribuição no mes*/

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


    diferencas.forEach(diferenca => {
      contribuicoesList.filter(function (contribuicao, index, arr) {
        return contribuicao.cp === diferenca.cp;
      });

    });

    return contribuicoesList;

  }


  private setPlanRow(planRow, data = null) {

    planRow.inicio = this.calculo.data_pedido_beneficio;

    if (data === null) {
      planRow.dibString = moment(planRow.data_futura).format('DD/MM/YYYY');
    } else {
      planRow.dibString = data;
    }

    if (typeof planRow.sc === 'undefined' || planRow.sc === 'null' ||
      planRow.sc === [] || !planRow.sc) {

      const periodo_in = this.formataPeriodo(planRow.inicio);
      const periodo_fi = this.formataPeriodo(planRow.dibString);

      planRow.sc = this.verificarContribuicoes(periodo_in, periodo_fi, []);

    } else {

      planRow.sc = this.formatContribuicaoList(planRow.sc, 'j');

    }

    return planRow;

  }




  showContribuicoes(planRow, index, data = null) {

    this.createplanejamentoContrib = false;

    planRow = this.setPlanRow(planRow, data = null);

    console.log(planRow);

    this.plan_index = index;
    this.planejamentoContrib = planRow;

    ///this.ContribuicoesComponent.preencherMatrizPeriodos(planRow.sc);
    // this.contribuicoes.show();
  }




  private setCheckPlanContrib(value) {

    console.log(value);

    if (value.planejamento.id === this.planejamentoContrib.id) {

      this.planejamentoContrib.sc = value.planejamento.sc;
      this.planejamentoContrib.sc_mm_ajustar = value.sc_mm_ajustar;
      this.planejamentoContrib.sc_mm_considerar_tempo = value.sc_mm_considerar_tempo;
      this.planejamentoContrib.sc_mm_considerar_carencia = value.sc_mm_considerar_carencia;
      this.planejamentoContrib.contribuicoes_pendentes = value.result_sc ? value.result_sc : 0;
      this.planejamentoContrib.contribuicoes_pendentes_mm = value.result_sc_mm ? value.result_sc_mm : 0;
      this.planejamentoContrib.result_sc = value.result_sc ? value.result_sc : 0;
      this.planejamentoContrib.result_sc_mm = value.result_sc_mm ? value.result_sc_mm : 0;

    }
  }



  matrixToVinculoContribuicoes(eventRST) {

    const contribuicoesList = [];
    let mes = 0;
    let chave = '';
    let msc = 0;

    eventRST.matriz.forEach(periodo => {

      periodo.sc.forEach(contribuicao => {

        mes++;

        if (contribuicao !== '') {
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

    if (eventRST.planejamento.id === this.planejamentoContrib.id) {

      console.log(eventRST)

      this.planejamentoContrib.sc = contribuicoesList;
      this.planejamentoContrib.sc_count = contribuicoesList.length;
      this.planejamentoContrib.sc_mm_ajustar = eventRST.sc_mm_ajustar;
      this.planejamentoContrib.sc_mm_considerar_tempo = eventRST.sc_mm_considerar_tempo;
      this.planejamentoContrib.sc_mm_considerar_carencia = eventRST.sc_mm_considerar_carencia;
      this.planejamentoContrib.contribuicoes_pendentes = eventRST.result_sc ? eventRST.result_sc : 0;
      this.planejamentoContrib.contribuicoes_pendentes_mm = eventRST.result_sc_mm ? eventRST.result_sc_mm : 0;
      this.planejamentoContrib.result_sc = eventRST.result_sc ? eventRST.result_sc : 0;
      this.planejamentoContrib.result_sc_mm = eventRST.result_sc_mm ? eventRST.result_sc_mm : 0;


      console.log(this.planejamentoContrib);
    }

  }


  private novoPlanejamento() {

    this.planejamentoContrib = Object.assign({}, { ...PlanejamentoRgps.form });
    this.showChildModal();
  }


  // public updatePlanContribuicoes() {

  //   if (typeof this.planejamentoContrib !== 'undefined') {

  //     this.isEdit = false;

  //     // const objPlanejamento = Object.assign({}, this.planejamentoContrib);
  //     // objPlanejamento.sc = this.formatContribuicaoList(objPlanejamento.sc);



  //     this.rgpsPlanejamentoService
  //       .update(this.planejamentoContrib)
  //       .then(model => {

  //         swal({
  //           position: 'top-end',
  //           type: 'success',
  //           title: 'Dados alterados com sucesso.',
  //           showConfirmButton: false,
  //           timer: 1000
  //         });

  //         this.getInfoCalculos();
  //         this.resetForm();

  //       })
  //       .catch((errors) => {

  //         // this.errors.add(errors);

  //       });
  //   }

  //   console.log(this.planejamentoContrib)
  // }


  private formatContribuicaoList(ListSC, type = null) {

    if (typeof ListSC === 'undefined') {
      return ListSC;
    }

    if (typeof ListSC === 'string' && type === 'j') {
      return JSON.parse(ListSC);
    }

    if (typeof ListSC === 'object' && type === 's') {
      return JSON.stringify(ListSC);
    }

    return ListSC;
  }

  public eventContribuicoes(event) {

    console.log(event);

    switch (event.acao) {
      case 'sair':
        // this.contribuicoes.hide();
        break;
      case 'salvar-check':
        this.setCheckPlanContrib(event);
      //  this.updatePlan(null, 'sc');
        break;
      case 'salvar':
        this.setCheckPlanContrib(event);
        this.matrixToVinculoContribuicoes(event);
      //  this.updatePlan(null, 'sc');
      //  this.contribuicoes.hide();
        break;
    }

    console.log(event)
    console.log(this.planejamentoContrib);
  }


  // contribuições

  public leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, 0);
  }


  public formataPeriodo(inputData) {

    if (inputData !== undefined) {
      const data = inputData.split('/');
      const periodo = data[2] + this.leftFillNum(data[1], 2);
      return periodo;
    }

    return '00/0000';

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

  isEmpty(data) {
    if (data === undefined
      || data === ''
      || typeof data === 'undefined'
      || data === 'undefined') {
      return true;
    }
    return false;
  }



  private getMoedaCompetencia(mes, ano) {

    const anoAtual = moment().year();
    let data = ano + '-' + mes + '-01';

    if (ano > anoAtual) {

      data = anoAtual + '-' + mes + '-01';
      return this.moeda.find((md) => data === md.data_moeda);
    }


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

    if (isNaN(value)) {

      return parseFloat(value.replace(/\./g, '').replace(',', '.'));

    } else {

      return parseFloat(value);

    }

  }


  formatReceivedDate(inputDate) {

    const date = new Date(inputDate);
    date.setTime(date.getTime() + 5 * 60 * 60 * 1000);
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return (
        ('0' + date.getDate()).slice(-2) +
        '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '/' +
        date.getFullYear()
      );
    }
    return '';

  }

}
