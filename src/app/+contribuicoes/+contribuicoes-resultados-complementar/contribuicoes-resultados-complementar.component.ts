import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../Segurado.service';
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { ContribuicaoComplementarService } from '../+contribuicoes-complementar/ContribuicaoComplementar.service';
import { ContribuicaoComplementar as ContribuicaoModel } from '../+contribuicoes-complementar/ContribuicaoComplementar.model';
import { MatrixService } from '../MatrixService.service'
import * as moment from 'moment'
import swal from 'sweetalert2';

@FadeInTop()
@Component({
  selector: 'app-contribuicoes-resultados-complementar',
  templateUrl: './contribuicoes-resultados-complementar.component.html',
})
export class ContribuicoesResultadosComplementarComponent implements OnInit {
  public baseAliquota = 0;


  public calculoComplementar: any = {};
  public moeda: Moeda[];
  public moedaAtual;
  public isUpdating = false;
  private segurado;
  public competenciaInicial;
  public competenciaFinal;

  public hasDetalhe = false;
  public mostrarJuros;
  public resultadosList = [];
  public resultadosTableOptions = {
    paging: false,
    ordering: false,
    info: false,
    searching: false,
    data: this.resultadosList,
    columns: [
      { data: 'competencia' },
      { data: 'valor_contribuicao' },
      { data: 'juros' },
      { data: 'multa' },
      { data: 'total' },
    ],
    columnDefs: [
      { className: 'nowrapText notwrap text-center', targets: '_all' },
    ]
  }

  public detalhesList = [];
  public detalhesTableOptions = {
    paging: false,
    ordering: false,
    info: false,
    searching: false,
    data: this.detalhesList,
    columns: [
      { data: 'indice_num' },
      { data: 'mes' },
      { data: 'contrib_base' },
      { data: 'indice' },
      { data: 'valor_corrigido' },
      { data: 'observacao' },
    ],
    columnDefs: [
      { className: 'nowrapText notwrap text-center', targets: '_all' },
    ]
  }

  private idCalculo = '';
  private idSegurado = '';


  private total_contrib = 0.0;
  private total_juros = 0.0;
  private total_multa = 0.0;
  private total_total = 0.0;

  private quantcontribuicoes100 = 0;
  private quantContribuicoes80 = 0;
  private somaDosSalariosContribuicao = 0;
  private mediaDosSalariosContribuicao = 0;
  private contribuicoesMatriz;
  private anosConsiderados = [];
  private contribuicoesMatrizInicio;
  private contribuicoesMatrizAtualizarAte;


  constructor(
    protected Complementar: ContribuicaoComplementarService,
    protected router: Router,
    private route: ActivatedRoute,
    private Moeda: MoedaService,
    protected Segurado: SeguradoService,
    protected MatrixStore: MatrixService,
  ) { }

  ngOnInit() {

    this.isUpdating = true;

    this.idCalculo = this.route.snapshot.params['id_calculo'];
    this.idSegurado = this.route.snapshot.params['id']
    this.hasDetalhe = !((this.MatrixStore.getTabelaDetalhes()).length === 0);

    this.Segurado.find(this.idSegurado).then(segurado => {
      this.segurado = segurado;
      this.dataNascimento();
      if (localStorage.getItem('user_id') != this.segurado.user_id) {
        //redirecionar para pagina de segurados
        swal({
          type: 'error',
          title: 'Erro',
          text: 'Você não tem permissão para acessar esta página!',
          allowOutsideClick: false
        }).then(() => {
          this.listaSegurados();
        });
      } else {
        this.Complementar.find(this.idCalculo).then(calculo => {
          this.calculoComplementar = calculo;
          this.mostrarJuros = this.calculoComplementar.chk_juros;
          this.contribuicoesMatriz = this.calculoComplementar.chk_juros;

          if (!this.mostrarJuros) {
            this.resultadosTableOptions = {
              ...this.resultadosTableOptions,
              columns: [
                { data: 'competencia' },
                { data: 'valor_contribuicao' },
                { data: 'multa' },
                { data: 'total' },
              ],
            }
          }

          let refenciaMoedaInicio = moment().subtract(1, 'months')
          let refenciaMoedaFim = moment();


          if (this.calculoComplementar.atualizar_ate !== undefined &&
            this.calculoComplementar.atualizar_ate !== null &&
            this.calculoComplementar.atualizar_ate !== '') {

            console.log(this.calculoComplementar);

            refenciaMoedaInicio = moment(this.calculoComplementar.atualizar_ate).subtract(1, 'months')
            refenciaMoedaFim = moment(this.calculoComplementar.atualizar_ate);
          }

          this.getContribuicoesMatriz();

          // this.Moeda.getByDateRange('01/' + this.competenciaInicial, '01/' + this.competenciaFinal)
          this.Moeda.getByDateRangeMomentParam(this.contribuicoesMatrizInicio, this.contribuicoesMatrizAtualizarAte.subtract(1, 'm'))
            .then((moeda: Moeda[]) => {
              this.moeda = moeda;

              this.moedaAtual = moeda[0];
              if (moeda[0].salario_minimo == undefined) {
                this.moedaAtual = moeda[1];
              }

              this.inicializar();
              this.isUpdating = false;


              // this.Moeda.getByDateRangeMomentParam(moment().subtract(1, 'months'), moment())
              //   .then((moedaAtual: Moeda[]) => {

              //     this.moedaAtual = moedaAtual[1];
              //     if (moedaAtual[1].salario_minimo == undefined) {
              //       this.moedaAtual = moedaAtual[0];
              //     }

              //     this.inicializar();
              //     this.isUpdating = false;

              //   });

            });
        });
      }

    });


  }

  private inicializar() {

    this.generateTabelaDetalhes();

    let splited = this.calculoComplementar.inicio_atraso.split('-');
    this.competenciaInicial = splited[1] + '/' + splited[0];
    splited = this.calculoComplementar.final_atraso.split('-');
    this.competenciaFinal = splited[1] + '/' + splited[0];

    // this.calculoComplementar.media_salarial = this.verificarTeto(this.calculoComplementar.media_salarial);
    // this.baseAliquota = (this.calculoComplementar.media_salarial * 0.2);

    this.resultadosList = this.generateTabelaResultados();

    this.updateResultadosDatatable();
    this.hasDetalhe = true;
    // if (this.hasDetalhe) {

    //   this.detalhesList = this.MatrixStore.getTabelaDetalhes().filter(this.onlyUnique);
    //   this.updateDetalhesDatatable();

    // }

    this.updateInfCalculoComplementar()

  }



  updateInfCalculoComplementar() {

    this.calculoComplementar.salario = 555555.11;
    this.calculoComplementar.total_contribuicao = this.total_contrib;
    // this.calculoComplementar.numero_contribuicoes = Math.ceil(this.form.numero_contribuicoes);
    // this.calculoComplementar.media_salarial = this.form.media_salarial;
    this.calculoComplementar.contribuicao_calculada = this.total_total;

    this.Complementar.update(this.calculoComplementar).then((rst: ContribuicaoModel) => {
      this.Complementar.get().then(() => {
        swal({
          type: 'success',
          title: 'O Cálculo foi salvo com sucesso',
          text: '',
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1500
        }).then(() => {

        });
      });
    }).catch(error => {
      console.log(error);
    });

  }


  private verificarTeto(valor) {

    if (this.moedaAtual !== undefined
      && this.moedaAtual.teto !== undefined
      && this.moedaAtual.teto != '') {
      this.moedaAtual.teto = Number(this.moedaAtual.teto)

      if (valor > this.moedaAtual.teto) {
        return this.moedaAtual.teto;
      }
    }

    return valor;
  }



  dataNascimento() {
    this.segurado.data_nascimento;
    let idadeSegurado = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    this.segurado.idade = moment().diff(idadeSegurado, 'years');

  }


  generateTabelaResultados() {
    let competencias = this.monthAndYear(this.competenciaInicial, this.competenciaFinal);
    let dataTabelaResultados = [];

    //Variaveis para a linha de total
    let total_contrib = 0.0;
    let total_juros = 0.0;
    let total_multa = 0.0;
    let total_total = 0.0;

    //  console.log(competencias);

    const checkDataJuros = (competencia) => {
      return moment(competencia, 'MM/YYYYY').isAfter('1996-10-14', 'months')
    }


    for (let competencia of competencias) {
      let splited = competencia.split('-');

      competencia = splited[1] + '/' + splited[0];
      let valor_contribuicao = this.getValorContribuicao();
      let juros = (this.mostrarJuros && checkDataJuros(competencia)) ? this.getTaxaJuros(competencia) : 0;
      let multa = (checkDataJuros(competencia)) ? this.getMulta() : 0;
      let total = (this.getBaseAliquota() * 1.1) + juros;

      let line = {
        competencia: competencia,
        valor_contribuicao: this.formatMoney(valor_contribuicao),
        juros: this.formatMoney(juros),
        multa: this.formatMoney(multa),
        total: this.formatMoney(total)
      };

      dataTabelaResultados.push(line);

      //calculos dos totais
      total_contrib += valor_contribuicao;
      total_juros += juros;
      total_multa += multa;
      total_total += total;
    }

    this.total_contrib = total_contrib;
    this.total_juros = total_juros;
    this.total_multa = total_multa;
    this.total_total = total_total;

    let last_line = {
      competencia: '<b>Total</b>',
      valor_contribuicao: '<b>' + this.formatMoney(total_contrib) + '</b>',
      juros: '<b>' + this.formatMoney(total_juros) + '</b>',
      multa: '<b>' + this.formatMoney(total_multa) + '</b>',
      total: '<b>' + this.formatMoney(total_total) + '</b>'
    };
    dataTabelaResultados.push(last_line);
    return dataTabelaResultados;
  }

  //Retorna uma lista com os meses entre dateStart e dateEnd
  monthAndYear(dateStart, dateEnd) {
    dateStart = moment(dateStart, 'MM/YYYY');
    dateEnd = moment(dateEnd, 'MM/YYYY');
    let timeValues = [];
    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      timeValues.push(dateStart.format('YYYY-MM'));
      dateStart.add(1, 'month');
    }
    return timeValues;
  }

  getTaxaJuros(dataReferencia) {
    let taxaJuros = 0.0;
    let jurosMensais = 0.005;
    let jurosAnuais = 1.06;
    let numAnos = this.getDifferenceInYears(dataReferencia);
    let numMeses = this.getDifferenceInMonths(dataReferencia) - (numAnos * 12);
    taxaJuros = ((jurosAnuais ** numAnos) * ((jurosMensais * numMeses) + 1)) - 1;
    taxaJuros = Math.min(taxaJuros, 0.5);
    //console.log(dataReferencia, numAnos, numMeses, taxaJuros);
    let totalJuros = this.getBaseAliquota() * taxaJuros;

    return totalJuros;
  }



  private getContribuicoesMatriz() {

    this.contribuicoesMatriz = JSON.parse(this.calculoComplementar.contribuicoes);

    this.contribuicoesMatriz.sort(function (a, b) { return a.ano - b.ano });

    this.contribuicoesMatriz.map(row => {
      this.anosConsiderados.push(row.ano);
    });

    this.contribuicoesMatrizInicio = moment(this.anosConsiderados[0] + '-01-01');
    this.contribuicoesMatrizAtualizarAte = moment(this.calculoComplementar.atualizar_ate);

  }



  // getNumberFromTableEntry(tableEntry){
  //   if(tableEntry == ''){
  //     return 0.0;
  //   }
  //   return parseFloat((tableEntry.split(' ')[1]).replace(',','.'));
  // }


  getMatrixData() {
    const unique_anos = this.anosConsiderados.filter(this.onlyUnique);
    const data_dict = [];

    for (const rowAno of this.contribuicoesMatriz) {

      const ano = rowAno.ano;
      const valor = rowAno.valores

      for (let i = 0; i < 12; i++) {
        const mes = ('0' + (i + 1)).slice(-2);
        if (valor[i] !== 'R$ 0,00') {
          data_dict.push(mes + '/' + ano + '-' + valor[i]);
        }
      }

    }

    return data_dict;
  }


  //Tabela de detalhes gerada no momento no calculo
  generateTabelaDetalhes() {

    let data_array = this.getMatrixData();
    let indice_num = 0;
    let dataTabelaDetalhes = [];

    const dataComparacao = moment(this.calculoComplementar.atualizar_ate, 'DD/MM/YYYY');
    const moedaComparacao = (dataComparacao.isSameOrBefore(moment(), 'month')) ? this.Moeda.getByDate(dataComparacao) : undefined;

    for (let data of data_array) {
      const splitted = data.split('-');
      const mes = splitted[0];
      const contrib = this.formatDecimalValue(splitted[1]);

      if (contrib == 0 || contrib == undefined) {
        continue;
      }

      indice_num++;

      const dataContribuicao = moment(mes, 'MM/YYYY');
      const moedaContribuicao = (dataContribuicao.isSameOrBefore(moment(), 'month')) ?
        this.Moeda.getByDate(dataContribuicao) : undefined;

      const fatorObj = this.getFatorparaRMI(moedaContribuicao, moedaComparacao);
      const fatorCorrigido = (moedaContribuicao) ? (fatorObj.fator / fatorObj.fatorLimite) : 1;

      // let indice = this.getIndice(mes);
      const indice = fatorCorrigido;
      const contrib_base_limitada = this.limitarTetosEMinimos(contrib, dataContribuicao);

      // const contrib_base = this.getContribBase(mes, contrib);
      const contrib_base = contrib_base_limitada.valor;
      const valor_corrigido = contrib_base * indice;

      const line = {
        indice_num: indice_num,
        mes: mes,
        contrib_base: this.formatMoneyContribuicao(contrib_base),
        contrib_base_number: this.formatRoundMoeda(contrib_base),
        indice: this.formatDecimal(indice, 6),
        indice_number: indice,
        valor_corrigido: this.formatRoundMoeda(valor_corrigido)
      };
      dataTabelaDetalhes.push(line);
    }

    //Ordenação dos dados pelo valor corrigido
    dataTabelaDetalhes.sort((entry1, entry2) => {
      if (entry1.valor_corrigido > entry2.valor_corrigido) {
        return 1;
      }
      if (entry1.valor_corrigido < entry2.valor_corrigido) {
        return -1;
      }
      return 0;
    });

    this.calculoComplementar.numero_contribuicoes = dataTabelaDetalhes.length * 0.8;

    this.quantContribuicoes80 = Math.ceil(this.calculoComplementar.numero_contribuicoes);
    this.quantcontribuicoes100 = dataTabelaDetalhes.length;

    // Colore de vermelho os 20% menores valores. 
    // form.numero_contribuicoes contem o numero equivalente as 80% maiores contribuicoes, 
    // dividindo por 4 obtem-se os 20% restante
    let index = 0;
    const numero_contrib_desconsideradas = Math.floor((this.calculoComplementar.numero_contribuicoes) / 4);

    for (index = 0; index < numero_contrib_desconsideradas; index++) {
      dataTabelaDetalhes[index].indice_num = index + 1;
      dataTabelaDetalhes[index].mes = '<div>' + dataTabelaDetalhes[index].mes + '</div>'
      dataTabelaDetalhes[index].contrib_base = '<div>' + dataTabelaDetalhes[index].contrib_base + '</div>'
      dataTabelaDetalhes[index].indice = '<div>' + dataTabelaDetalhes[index].indice + '</div>'
      dataTabelaDetalhes[index].valor_corrigido = '<div>' + this.formatMoney(dataTabelaDetalhes[index].valor_corrigido) + '</div>'
      dataTabelaDetalhes[index].observacao = '<div>DESCONSIDERADO</div>'
    }

    // Ordena as contribuiçoes consideradas pela data e concatena com as desconsideradas
    dataTabelaDetalhes = dataTabelaDetalhes.slice(0, index)
      .concat(dataTabelaDetalhes.slice(index, dataTabelaDetalhes.length)
        .sort((entry1, entry2) => {

          const dataMesEntry1 = moment(entry1.mes, 'MM/YYYY');
          const dataMesEntry2 = moment(entry2.mes, 'MM/YYYY');

          if (dataMesEntry1 < dataMesEntry2) {
            return 1;
          }
          if (dataMesEntry1 > dataMesEntry2) {
            return -1;
          }
          return 0;
        }));

    for (index = index; index < dataTabelaDetalhes.length; index++) {

      this.somaDosSalariosContribuicao += dataTabelaDetalhes[index].valor_corrigido;
      dataTabelaDetalhes[index].valor_corrigido = this.formatMoney(dataTabelaDetalhes[index].valor_corrigido);
      dataTabelaDetalhes[index].indice_num = index + 1;
      dataTabelaDetalhes[index].observacao = '<div></div>'


    }

    this.mediaDosSalariosContribuicao = this.formatRoundMoeda(this.somaDosSalariosContribuicao
      / this.quantContribuicoes80);

    this.baseAliquota = this.mediaDosSalariosContribuicao * 0.2;

    // this.MatrixStore.setTabelaDetalhes(dataTabelaDetalhes);

    this.detalhesList = dataTabelaDetalhes;

    // console.log(dataTabelaDetalhes)
    // console.log(this.detalhesList)
    this.updateDetalhesDatatable();

  }


  public formatDecimalValue(value) {

    // typeof value === 'string' || 
    if (isNaN(value)) {

      return parseFloat(value.replace(/(\.)|(R\$)|(\s)/g, '').replace(',', '.'));

    } else {

      return parseFloat(value);

    }

  }

  formatRoundMoeda(value) {

    if (value !== undefined) {
      return Math.round(value * 100) / 100;
    }
    return 0.00;
  }



  formatDecimal(value, n_of_decimal_digits) {

    value = parseFloat(value);
    return (value.toFixed(parseInt(n_of_decimal_digits))).replace('.', ',');

  }


  //Valor da contribuição base para cada mês
  getContribBase(dataMes, contrib) {

    const teto = this.getTeto(dataMes);
    const salario_minimo = this.getSalarioMinimo(dataMes);

    // contrib = parseFloat(contrib);
    contrib = this.formatDecimalValue(contrib);

    if (contrib < salario_minimo) {
      return salario_minimo;
    }

    if (contrib > teto) {
      return teto;
    }

    return contrib;
  }


  getSalarioMinimo(dataString) {
    // let diff = this.getDifferenceInMonths('07/1994', dataString);
    // return parseFloat(this.moeda[diff].salario_minimo);

    let data = moment(dataString, 'MM/YYYY');
    if (data.format('YYYY-MM-DD') != this.Moeda.getByDate(data).data_moeda) {
      console.log(data.format('YYYY-MM-DD'), this.Moeda.getByDate(data).data_moeda)
      return parseFloat(this.Moeda.getByDate(data).salario_minimo);
    }

  }

  getTeto(dataString) {
    // let diff = this.getDifferenceInMonths('07/1994', dataString);
    // return parseFloat(this.moeda[diff].teto);
    let data = moment(dataString, 'MM/YYYY');
    if (data.format('YYYY-MM-DD') != this.Moeda.getByDate(data).data_moeda) {
      console.log(data.format('YYYY-MM-DD'), this.Moeda.getByDate(data).data_moeda)
      return parseFloat(this.Moeda.getByDate(data).teto);
    }

  }
  //Valor fixado para cada mês, carregado de uma tabela do banco de dados 
  getIndice(dataString) {

    console.log(dataString);
    // let diff = this.getDifferenceInMonths('07/1994', dataString);
    // return parseFloat(this.moeda[diff].fator);
    let data = moment(dataString, 'MM/YYYY');
    if (data.format('YYYY-MM-DD') != this.Moeda.getByDate(data).data_moeda) {
      console.log(data.format('YYYY-MM-DD'), this.Moeda.getByDate(data).data_moeda)
      return parseFloat(this.Moeda.getByDate(data).fator);
    }

  }


  getValorContribuicao() {
    return this.getBaseAliquota();
  }

  getMulta() {
    return this.getBaseAliquota() * 0.1;
  }

  getBaseAliquota() {
    return this.baseAliquota;
  }

  updateDetalhesDatatable() {
    this.detalhesTableOptions = {
      ...this.detalhesTableOptions,
      data: this.detalhesList,
    }
  }

  updateResultadosDatatable() {
    this.resultadosTableOptions = {
      ...this.resultadosTableOptions,
      data: this.resultadosList,
    }
  }

  //Retorna a diferença em anos completos entre a data passada como parametro e a data atual
  getDifferenceInYears(dateString) {
    let today = moment();
    let pastDate = moment(dateString, 'MM/YYYY');
    let differenceInYears = Math.abs(today.diff(pastDate, 'years'));
    return differenceInYears;
  }

  //Retorna a diferença em meses completos entre as datas passadas como parametro.
  //Caso só uma data seja passada, retorna a diferença entre ela e a data atual
  getDifferenceInMonths(dateString, dateString2 = '') {
    let splitted = dateString.split('/');
    let recent;
    if (dateString2 == '') {
      recent = moment();
    } else {
      recent = moment(dateString2, 'MM/YYYY');
    }
    let pastDate = moment(dateString, 'MM/YYYY');
    let differenceInMonths = Math.abs(recent.diff(pastDate, 'months'));
    return differenceInMonths;
  }


  limitarTetosEMinimos(valor, data) {

    // se a data estiver no futuro deve ser utilizado os dados no mês atual
    const moeda = data.isSameOrBefore(moment(), 'month') ? this.Moeda.getByDate(data) : this.Moeda.getByDate(moment());
    const salarioMinimo = (moeda) ? moeda.salario_minimo : 0;
    const tetoSalarial = (moeda) ? moeda.teto : 0;
    let avisoString = '';
    let valorRetorno = valor;

    if (moeda && valor < salarioMinimo) {
      valorRetorno = salarioMinimo;
      avisoString = 'LIMITADO AO MÍNIMO'
    } else if (moeda && valor > tetoSalarial) {
      valorRetorno = tetoSalarial;
      avisoString = 'LIMITADO AO TETO'
    }

    if (typeof valorRetorno !== 'number') {
      valorRetorno = parseFloat(valorRetorno);
    }

    return { valor: valorRetorno, aviso: avisoString };
  }



  // fator conforme data atualizar até:


  /**
   * Seleciona o fator adequado, porém como padrão retorna 1
   * @param  {} moedaContribuicao
   * @param  {} moedaComparacao
   */
  private getFatorparaRMI(moedaContribuicao, moedaComparacao) {

    let fator = 1
    let fatorLimite = 1;

    // definição de indices
    fator = (moedaContribuicao) ? moedaContribuicao.fator : 1;
    fatorLimite = (moedaComparacao) ? moedaComparacao.fator : 1;

    return { fator: fator, fatorLimite: fatorLimite }

  }



  formatMoneyContribuicao(data) {
    //data = parseFloat(data);
    if (data !== null && data !== '') {
      return 'R$ ' + data.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    }
    return 'R$ 0,00';
  }

  formatMoney(data) {
    data = parseFloat(data);
    return 'R$ ' + data.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }

  listaSegurados() {
    window.location.href = '/#/contribuicoes/contribuicoes-segurados/';
  }

  voltar() {
    window.location.href = '/#/contribuicoes/contribuicoes-calculos/' + this.route.snapshot.params['id'];
  }




  // imprimirPagina(){
  //   let seguradoBox = document.getElementById('printableSegurado').innerHTML
  //   let dadosCalculo = document.getElementById('printableDadosCalculo').innerHTML
  //   let detalhamentoCalculo = document.getElementById('detalhamentoCalculo').innerHTML
  //   let resultadosCalculo = document.getElementById('resultadosCalculo').innerHTML
  //   let printContents = seguradoBox + '<br>' + dadosCalculo + '<br>' + detalhamentoCalculo + '<br>' + resultadosCalculo + '<br>';
  //   printContents = printContents.replace(/<table/g, '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');

  //   const rodape = `<footer style="color: #c5c7c8!important;margin-top: 80px;">
  //   <img src="assets/img/logo-IEPREV.png" style="display:block; margin-left: auto; margin-right: auto;opacity: 0.4;">
  //   <p style="text-align: center;">Simulador de Cálculos do Instituto de Estudos Previdenciários - IEPREV.</p>
  // </footer>`;


  //   let popupWin = window.open('', '_blank', 'width=300,height=300');
  //   popupWin.document.open();
  //   popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + rodape + '</body></html>');
  //   popupWin.document.close();
  // }








  imprimirPagina() {

    const css = `<link rel="stylesheet" type="text/css"  href="assets/css/bootstrap.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/demo.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/your_style.css" media="print">
                <style>i.fa, .not-print{ display: none; }
                      div,p,td,th{font-size:11px !important;}
                      table{margin-top: 20px;}
                      .table-bordered, .table-bordered>tbody>tr>td,
                      .table-bordered>tbody>tr>th,
                      .table-bordered>tfoot>tr>td,
                      .table-bordered>tfoot>tr>th,
                      .table-bordered>thead>tr>td, .table-bordered>thead>tr>th {
                        border: 1px solid #000 !important;
                    }
                     .table>tbody>tr>td, .table>tbody>tr>th,
                     .table>tfoot>tr>td, .table>tfoot>tr>th,
                     .table>thead>tr>td, .table>thead>tr>th {
                       padding: 3.5px 8px;
                      border-color: #000 !important
                    }
                      footer{text-align: center; margin-top: 50px;}
                      .page-break { page-break-inside: avoid;}
                      </style>`;


    let seguradoBox = document.getElementById('printableSegurado').innerHTML
    let dadosCalculo = document.getElementById('printableDadosCalculo').innerHTML
    let detalhamentoCalculo = document.getElementById('detalhamentoCalculo').innerHTML
    let resultadosCalculo = document.getElementById('resultadosCalculo').innerHTML
    let printContents = seguradoBox + dadosCalculo + detalhamentoCalculo + resultadosCalculo;
    // printContents = printContents.replace(/<table/g, 
    //   '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');

    const rodape = `<img src='./assets/img/rodapesimulador.png' alt='Logo'>`;

    let popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    // popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' 
    //                           + printContents + rodape + '</body></html>');

    popupWin.document.write(`<!doctype html>
                              <html>
                                <head>${css}</head>
                                <title> Contribuições Atrasadas - Lei complementar 128_08 - ${this.segurado.nome}</title>
                                <body onload="window.print()">
                                 <article class="mt-5">${printContents}</article>
                                 <footer class="mt-5">${rodape}</footer>
                                </body>
                              </html>`);
    popupWin.document.close();
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
