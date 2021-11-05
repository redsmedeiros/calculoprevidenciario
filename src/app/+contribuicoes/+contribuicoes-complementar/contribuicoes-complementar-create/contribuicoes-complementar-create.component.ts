import { ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContribuicaoComplementarService } from '../ContribuicaoComplementar.service';
import { ErrorService } from '../../../services/error.service';
import { ContribuicaoComplementar as ContribuicaoModel } from '../ContribuicaoComplementar.model';
import { MatrixService } from '../../MatrixService.service'
import { MoedaService } from '../../../services/Moeda.service';
import { Moeda } from '../../../services/Moeda.model';
import * as moment from 'moment';
import swal from 'sweetalert2';


@Component({
  selector: 'app-contribuicoes-complementar-create',
  templateUrl: './contribuicoes-complementar-create.component.html',
  styleUrls: ['./contribuicoes-complementar-create.component.css'],
  providers: [
    ErrorService
  ]
})
export class ContribuicoesComplementarCreateComponent implements OnInit, OnChanges {
  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];


  public idSegurado;

  public NumMeses = 0;
  public listaGeralMeses = '';
  public contribuicao_basica_inicial_temp;
  public contribuicao_basica_final_temp;

  public baseAliquota = 0;

  public form = { ...ContribuicaoModel.form };

  private isUpdate = true;


  matriz = [{
    'ano': 0,
    'valores': []
  }];

  public anosConsiderados = [];
  public moeda: Moeda[];
  public matrizHasValues = false;
  public matrixTableOptions = {
    paging: false,
    ordering: false,
    info: false,
    searching: false
  };

  private contribuicoesImport = [];

  constructor(
    protected Calculo: ContribuicaoComplementarService,
    protected MatrixStore: MatrixService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
    private Moeda: MoedaService,
    private detector: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.isUpdate = true;
    this.getInformacoesIniciais();

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

  }


  getInformacoesIniciais() {

    this.idSegurado = this.route.snapshot.params['id'];
    // this.Moeda.getByDateRangeMomentParam(moment('1994-06-01'), moment().subtract(1, 'm'))
    //   .then((moeda: Moeda[]) => {
    //     this.moeda = moeda;
    //     this.isUpdate = false;
    //   });

    this.isUpdate = false;
  }


  preencher(data) {

    this.idSegurado = this.route.snapshot.params['id'];
    const monthList = this.monthAndYear(data.contribuicao_basica_inicial, data.contribuicao_basica_final);

    // this.NumMeses += monthList.length;
    // this.form.numero_contribuicoes = this.NumMeses*0.8;

    if (this.form.id != undefined && this.contribuicao_basica_inicial_temp == undefined) {
      this.contribuicao_basica_inicial_temp = this.form.contribuicao_basica_inicial;
      this.contribuicao_basica_final_temp = this.form.contribuicao_basica_final;
    }

    if (this.contribuicao_basica_inicial_temp == undefined || this.contribuicao_basica_inicial_temp == '') {
      this.contribuicao_basica_inicial_temp = data.contribuicao_basica_inicial;
    }
    if (this.contribuicao_basica_final_temp == undefined || this.contribuicao_basica_final_temp == '') {
      this.contribuicao_basica_final_temp = data.contribuicao_basica_final;
    }

    this.contribuicao_basica_inicial_temp = (moment(data.contribuicao_basica_inicial, 'MM/YYYY') < moment(this.contribuicao_basica_inicial_temp, 'MM/YYYY')) ? data.contribuicao_basica_inicial : this.contribuicao_basica_inicial_temp;
    this.contribuicao_basica_final_temp = (moment(data.contribuicao_basica_final, 'MM/YYYY') > moment(this.contribuicao_basica_final_temp, 'MM/YYYY')) ? data.contribuicao_basica_final : this.contribuicao_basica_final_temp;


    // this.NumMeses = this.monthAndYear(this.contribuicao_basica_inicial_temp, this.contribuicao_basica_final_temp).length;
    // this.form.numero_contribuicoes = this.NumMeses*0.8;

    if (this.form.id != '' && this.form.id != undefined && !this.matrizHasValues) {

      this.matriz = JSON.parse(this.form.contribuicoes);
      this.matriz.sort(function (a, b) { return a.ano - b.ano });

      this.matrizHasValues = true;

      this.matriz.map(row => {
        this.anosConsiderados.push(row.ano);
      });

    } else {

      let ano = monthList[0].split('-')[0];

      let valores = ['R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00'];
      let updateValores = this.getAnoValores(ano);

      if (updateValores !== undefined) {
        valores = updateValores.valores;
      }

      this.anosConsiderados.push(ano);
      for (let entry of monthList) {

        if (ano == entry.split('-')[0]) {
          valores[+entry.split('-')[1] - 1] = this.formatMoneyContribuicao(data.salario);
        } else {
          this.updateMatrix(+ano, valores);
          ano = entry.split('-')[0];
          valores = ['R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00'];
          updateValores = this.getAnoValores(ano);
          if (updateValores !== undefined) {
            valores = updateValores.valores;
          }
          valores[+entry.split('-')[1] - 1] = this.formatMoneyContribuicao(data.salario);
          this.anosConsiderados.push(ano);

        }
      }
      this.updateMatrix(+ano, valores);
    }
    this.detector.detectChanges();
  }


  getAnosConsiderados() {
    this.anosConsiderados = [];
    this.matriz.map(row => {
      this.anosConsiderados.push(row.ano);
    });
  }

  preencherComCnis(contribuicoes) {

    this.matrizHasValues = false;
    this.matriz = [];
    this.anosConsiderados = [];
    this.contribuicoesImport = contribuicoes;
    const contribuicoesFormat = this.formatMatrizContribuicoes(contribuicoes);

    const clickFix = document.getElementById('clickFix');
    clickFix.click();

    // const matrizElement = document.getElementById('matrizValues');
    // matrizElement.click();

    setTimeout(() => {

      clickFix.click();
      // matrizElement.click();


      swal.close();
    }, 2000);
    this.detector.detectChanges();
  }



  private formatMatrizContribuicoes(contribuicoes) {

    const monthList = this.getInicioFimValoresContribuicao(contribuicoes);

    let ano = monthList[0].split('-')[0];

    let valores = ['R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00'];
    let updateValores = this.getAnoValores(ano);

    if (updateValores !== undefined) {
      valores = updateValores.valores;
    }

    this.anosConsiderados.push(ano);
    for (let entry of monthList) {

      const salarioContribuicao = this.getValoresContribuicao(entry);

      if (ano == entry.split('-')[0]) {
        valores[+entry.split('-')[1] - 1] = this.formatMoneyContribuicao(salarioContribuicao);
      } else {
        this.updateMatrixCnis(+ano, valores);
        ano = entry.split('-')[0];
        valores = ['R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00'];
        updateValores = this.getAnoValores(ano);
        if (updateValores !== undefined) {
          valores = updateValores.valores;
        }
        valores[+entry.split('-')[1] - 1] = this.formatMoneyContribuicao(salarioContribuicao);
        this.anosConsiderados.push(ano);

      }
    }
    this.updateMatrixCnis(+ano, valores);
    this.detector.detectChanges();
  }



  updateMatrixCnis(ano, valores) {
    if (!this.matrizHasValues) {
      this.matriz.splice(0, 1);
    }
    for (let entry of this.matriz) {
      if (entry.ano == ano) {
        let index = 0;
        for (index = 0; index < 12; ++index) {
          // permitir o valor zero
          if (entry.valores[index] != valores[index]) {
            entry.valores[index] = valores[index];
          }
        }
        return;
      }
    }

    let valoresCompare = valores

    if (valoresCompare.filter(x => x === 'R$ 0,00').length < 11) {
      this.matriz.push({ 'ano': ano, 'valores': valores });
    }

    this.matriz.sort(function (a, b) { return a.ano - b.ano });
    this.matrizHasValues = true;
  }



  private getInicioFimValoresContribuicao(contribuicoes) {

    this.form.contribuicao_basica_inicial = contribuicoes[0].data;
    this.form.contribuicao_basica_final = contribuicoes[(contribuicoes.length - 1)].data;
    this.contribuicao_basica_inicial_temp = contribuicoes[0].data;
    this.contribuicao_basica_final_temp = contribuicoes[(contribuicoes.length - 1)].data;
    this.form.salario = '0';

    return this.monthAndYear(contribuicoes[0].data, contribuicoes[(contribuicoes.length - 1)].data);
  }

  private getValoresContribuicao(competenciaDate) {

    const formatCompetencia = (data) => {
      const splitted = data.split('/');
      return splitted[1] + '-' + splitted[0];
    }

    const sc = this.contribuicoesImport.find(row => formatCompetencia(row.data) === competenciaDate)
    return (typeof sc === 'undefined' || typeof sc.valor === 'undefined') ? 0 : sc.valor;
  }


  getAnoValores(ano) {
    return this.matriz.find(row => row.ano == ano);
  }


  changedGridContribuicoes(ano, event, indice) {
    const valor = event.target.value;

    this.matriz.map(row => {
      if (row.ano === ano) {
        row.valores[indice] = valor;
      }
    });

    this.detector.detectChanges();
  }


  createCalculo(e) {
    e.preventDefault();


    //this.generateTabelaDetalhes();
    this.form.contribuicao_calculada = this.calculateContribuicao();

    const novoCalculo = new ContribuicaoModel();
    novoCalculo.id_segurado = this.form.id_segurado;
    novoCalculo.inicio_atraso = '01/' + this.form.inicio_atraso;
    novoCalculo.final_atraso = '01/' + this.form.final_atraso
    novoCalculo.contribuicao_basica_inicial = '01/' + this.contribuicao_basica_inicial_temp
    novoCalculo.contribuicao_basica_final = '01/' + this.contribuicao_basica_final_temp
    novoCalculo.salario = 0;
    novoCalculo.total_contribuicao = this.form.total_contribuicao;
    novoCalculo.numero_contribuicoes = Math.ceil(this.form.numero_contribuicoes);
    novoCalculo.media_salarial = this.form.media_salarial;
    novoCalculo.contribuicao_calculada = this.form.contribuicao_calculada;
    novoCalculo.chk_juros = this.form.chk_juros;
    novoCalculo.contribuicoes = JSON.stringify(this.matriz);
    novoCalculo.atualizar_ate = '01/' + this.form.atualizar_ate;

    if (this.form.id == undefined || this.form.id == '') {

      this.Calculo.save(novoCalculo).then((data: ContribuicaoModel) => {

        swal({
          type: 'success',
          title: 'O Cálculo foi salvo com sucesso',
          text: '',
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1500
        }).then(() => {
          window.location.href = '/#/contribuicoes/' + this.idSegurado + '/contribuicoes-resultados-complementar/' + data.id;
        });

      }).catch(error => {
        console.log(error);
      });

    } else {

      novoCalculo.id = this.form.id;
      this.Calculo.update(novoCalculo).then((data: ContribuicaoModel) => {

        swal({
          type: 'success',
          title: 'O Cálculo foi salvo com sucesso',
          text: '',
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 1500
        }).then(() => {
          window.location.href = '/#/contribuicoes/' + this.idSegurado + '/contribuicoes-resultados-complementar/' + data.id;
        });


      }).catch(error => {
        console.log(error);
      });
    }
  }

  getMatrixData() {
    this.getAnosConsiderados();
    const unique_anos = this.anosConsiderados.filter(this.onlyUnique);

    const data_dict = [];
    for (let ano of unique_anos) {
      let valor_jan = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('01-' + ano)).value);
      data_dict.push('01/' + ano + '-' + valor_jan);
      let valor_fev = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('02-' + ano)).value);
      data_dict.push('02/' + ano + '-' + valor_fev);
      let valor_mar = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('03-' + ano)).value);
      data_dict.push('03/' + ano + '-' + valor_mar);
      let valor_abr = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('04-' + ano)).value);
      data_dict.push('04/' + ano + '-' + valor_abr);
      let valor_mai = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('05-' + ano)).value);
      data_dict.push('05/' + ano + '-' + valor_mai);
      let valor_jun = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('06-' + ano)).value);
      data_dict.push('06/' + ano + '-' + valor_jun);
      let valor_jul = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('07-' + ano)).value);
      data_dict.push('07/' + ano + '-' + valor_jul);
      let valor_ago = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('08-' + ano)).value);
      data_dict.push('08/' + ano + '-' + valor_ago);
      let valor_set = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('09-' + ano)).value);
      data_dict.push('09/' + ano + '-' + valor_set);
      let valor_out = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('10-' + ano)).value);
      data_dict.push('10/' + ano + '-' + valor_out);
      let valor_nov = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('11-' + ano)).value);
      data_dict.push('11/' + ano + '-' + valor_nov);
      let valor_dez = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById('12-' + ano)).value);
      data_dict.push('12/' + ano + '-' + valor_dez);
    }
    return data_dict;
  }


  //Tabela de detalhes gerada no momento no calculo
  generateTabelaDetalhes() {

    this.getMatrixData()
    let data_array = this.getMatrixData().filter(this.onlyUnique);


    let indice_num = 0;
    let dataTabelaDetalhes = [];

    for (let data of data_array) {
      let splitted = data.split('-');
      let mes = splitted[0];
      let contrib = splitted[1];

      if (contrib == 0 || contrib == '') {
        continue;
      }

      indice_num++;
      let indice = this.getIndice(mes);
      let contrib_base = this.getContribBase(mes, contrib);
      let valor_corrigido = contrib_base * indice;

      let line = {
        indice_num: indice_num,
        mes: mes,
        contrib_base: this.formatMoneyContribuicao(contrib_base),
        indice: this.formatDecimal(indice, 6),
        valor_corrigido: valor_corrigido
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

    this.form.numero_contribuicoes = dataTabelaDetalhes.length * 0.8;


    //Colore de vermelho os 20% menores valores. 
    //form.numero_contribuicoes contem o numero equivalente as 80% maiores contribuicoes, 
    //dividindo por 4 obtem-se os 20% restante
    let index = 0;
    let numero_contrib_desconsideradas = Math.floor((this.form.numero_contribuicoes) / 4);


    for (index = 0; index < numero_contrib_desconsideradas; index++) {
      dataTabelaDetalhes[index].indice_num = index + 1;
      dataTabelaDetalhes[index].mes = '<div>' + dataTabelaDetalhes[index].mes + '</div>'
      dataTabelaDetalhes[index].contrib_base = '<div>' + dataTabelaDetalhes[index].contrib_base + '</div>'
      dataTabelaDetalhes[index].indice = '<div>' + dataTabelaDetalhes[index].indice + '</div>'
      dataTabelaDetalhes[index].valor_corrigido = '<div>' + this.formatMoney(dataTabelaDetalhes[index].valor_corrigido) + '</div>'
      dataTabelaDetalhes[index].observacao = '<div>DESCONSIDERADO</div>'
    }

    //Ordena as contribuiçoes consideradas pela data e concatena com as desconsideradas
    dataTabelaDetalhes = dataTabelaDetalhes.slice(0, index).concat(dataTabelaDetalhes.slice(index, dataTabelaDetalhes.length).sort((entry1, entry2) => {
      let dataMesEntry1 = moment(entry1.mes, 'MM/YYYY');
      let dataMesEntry2 = moment(entry2.mes, 'MM/YYYY');
      if (dataMesEntry1 < dataMesEntry2) {
        return 1;
      }
      if (dataMesEntry1 > dataMesEntry2) {
        return -1;
      }
      return 0;
    }));

    for (index = index; index < dataTabelaDetalhes.length; index++) {

      dataTabelaDetalhes[index].valor_corrigido = this.formatMoney(dataTabelaDetalhes[index].valor_corrigido);
      dataTabelaDetalhes[index].indice_num = index + 1;
      dataTabelaDetalhes[index].observacao = ''
      this.form.total_contribuicao += parseFloat((dataTabelaDetalhes[index].valor_corrigido).split(' ')[1].replace(',', '.'));

    }

    this.form.media_salarial = this.form.total_contribuicao / Math.ceil(this.form.numero_contribuicoes);
    this.baseAliquota = this.form.media_salarial * 0.2;


    this.MatrixStore.setTabelaDetalhes(dataTabelaDetalhes);

  }

  // //Valor da contribuição base para cada mês
  // getContribBase(dataMes, contrib){
  //   let teto = this.getTeto(dataMes);
  //   let salario_minimo = this.getSalarioMinimo(dataMes);
  //   contrib = parseFloat(contrib);
  //   if(contrib < salario_minimo){
  //     return salario_minimo;
  //   }
  //   if(contrib > teto){
  //     return teto;
  //   }
  //   return contrib;
  // }

  public formatDecimalValue(value) {

    // typeof value === 'string' || 
    if (isNaN(value)) {

      return parseFloat(value.replace(/\./g, '').replace(',', '.'));

    } else {

      return parseFloat(value);

    }

  }


  formatDecimal(value, n_of_decimal_digits) {

    value = parseFloat(value);
    return (value.toFixed(parseInt(n_of_decimal_digits, 10))).replace('.', ',');

  }


  // Valor da contribuição base para cada mês
  getContribBase(dataMes, contrib) {
    let teto = this.getTeto(dataMes);
    let salario_minimo = this.getSalarioMinimo(dataMes);

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
    if (data.format('YYYY-MM-DD') != this.Moeda.getByDate(data).data_moeda)
      console.log(data.format('YYYY-MM-DD'), this.Moeda.getByDate(data).data_moeda)
    return parseFloat(this.Moeda.getByDate(data).salario_minimo);
  }

  getTeto(dataString) {
    // let diff = this.getDifferenceInMonths('07/1994', dataString);
    // return parseFloat(this.moeda[diff].teto);
    let data = moment(dataString, 'MM/YYYY');
    if (data.format('YYYY-MM-DD') != this.Moeda.getByDate(data).data_moeda)
      console.log(data.format('YYYY-MM-DD'), this.Moeda.getByDate(data).data_moeda)
    return parseFloat(this.Moeda.getByDate(data).teto);
  }
  //Valor fixado para cada mês, carregado de uma tabela do banco de dados 
  getIndice(dataString) {
    // let diff = this.getDifferenceInMonths('07/1994', dataString);
    // return parseFloat(this.moeda[diff].fator);
    let data = moment(dataString, 'MM/YYYY');
    if (data.format('YYYY-MM-DD') != this.Moeda.getByDate(data).data_moeda)
      console.log(data.format('YYYY-MM-DD'), this.Moeda.getByDate(data).data_moeda)
    return parseFloat(this.Moeda.getByDate(data).fator);
  }

  calculateContribuicao() {
    let competencias = this.monthAndYear(this.form.inicio_atraso, this.form.final_atraso);
    let contrib_calculada = 0.0;

    for (let competencia of competencias) {
      let splited = competencia.split('-');

      competencia = splited[1] + '/' + splited[0];
      let juros = this.getTaxaJuros(competencia);
      let total = (this.getBaseAliquota() * 1.1) + juros;

      contrib_calculada += total;
    }
    return contrib_calculada;
  }

  getBaseAliquota() {
    return this.baseAliquota;
  }

  getTaxaJuros(dataReferencia) {
    let taxaJuros = 0.0;
    let jurosMensais = 0.005;
    let jurosAnuais = 1.06;
    let numAnos = this.getDifferenceInYears(dataReferencia);
    let numMeses = this.getDifferenceInMonths(dataReferencia) - (numAnos * 12);
    taxaJuros = ((jurosAnuais ** numAnos) * ((jurosMensais * numMeses) + 1)) - 1;
    taxaJuros = Math.min(taxaJuros, 0.5);
    let totalJuros = this.getBaseAliquota() * taxaJuros;

    return totalJuros;
  }

  getNumberFromTableEntry(tableEntry) {
    if (tableEntry == '') {
      return 0.0;
    }
    // return parseFloat((tableEntry.split(' ')[1]).replace(',','.'));

    const value = tableEntry.split(' ')[1];
    if (typeof value === 'string') {

      return parseFloat(value.replace(/\./g, '').replace(',', '.'));

    } else {

      return parseFloat(value);

    }
  }

  updateMatrix(ano, valores) {

    if (!this.matrizHasValues) {
      this.matriz.splice(0, 1);
    }
    for (let entry of this.matriz) {
      if (entry.ano == ano) {
        let index = 0;
        for (index = 0; index < 12; ++index) {
          // if(entry.valores[index] != valores[index] && valores[index] != 'R$ 0,00'){
          //   entry.valores[index] = valores[index];
          // }
          // permitir o valor zero
          if (entry.valores[index] != valores[index]) {
            entry.valores[index] = valores[index];
          }
        }
        return;
      }
    }

    let valoresCompare = valores

    // if (valoresCompare.filter(x => x === 'R$ 0,00').length < 11) {
    this.matriz.push({ 'ano': ano, 'valores': valores });
    // }

    this.matriz.sort(function (a, b) { return a.ano - b.ano });

    this.matrizHasValues = true;

    // swal({
    //   type: 'success',
    //   title: 'A lista foi atualizada',
    //   text: '',
    //   showConfirmButton: false,
    //   allowOutsideClick: false,
    //   timer: 1000
    // });
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

  //Retorna a diferença em anos completos entre a data passada como parametro e a data atual
  getDifferenceInYears(dateString) {
    let today = moment();
    let pastDate = moment(dateString, 'MM/YYYY');
    let duration = moment.duration(today.diff(pastDate));
    let years = duration.asYears();
    return Math.floor(years);
  }

  //Retorna a diferença em meses completos entre a data passada como parametro e a data atual
  getDifferenceInMonths(dateString, dateString2 = '') {
    let recent;
    if (dateString2 == '') {
      recent = moment();
    } else {
      recent = moment(dateString2, 'MM/YYYY');
    }
    let pastDate = moment(dateString, 'MM/YYYY');
    let duration = moment.duration(recent.diff(pastDate));
    let months = duration.asMonths();
    return Math.floor(months);
  }

  //Recebe um valor float e retorna com duas casas decimais, virgula como separador e prefixo R$
  formatMoney(data) {
    if (data !== null && data !== '') {
      data = parseFloat(data);
      return 'R$ ' + (data.toFixed(2)).replace('.', ',');
    }
    return 'R$ 0,00';
  }

  formatMoneyContribuicao(data) {
    //data = parseFloat(data);
    if (data !== null && data !== '') {
      return 'R$ ' + data.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    }
    return 'R$ 0,00';
  }

  voltar() {
    window.location.href = '/#/contribuicoes/contribuicoes-calculos/' + this.idSegurado;
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

}
