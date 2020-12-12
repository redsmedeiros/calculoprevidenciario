
import { ValorContribuido } from './../../+rgps-valores-contribuidos/ValorContribuido.model';
import { DefinicaoAliquotaEfetiva } from './../../../shared/functions/definicao-aliquota-efetiva';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../../+rgps-segurados/SeguradoRgps.model';
import { ExpectativaVida } from './../../+rgps-resultados/ExpectativaVida.model';
import { ExpectativaVidaService } from '../../+rgps-resultados/ExpectativaVida.service';
import { CalculoRgpsService } from '../../+rgps-calculos/CalculoRgps.service';
import { CalculoRgps as CalculoModel } from '../../+rgps-calculos/CalculoRgps.model';
import { RgpsPlanejamentoService } from './../rgps-planejamento.service';
import { PlanejamentoRgps } from './../PlanejamentoRgps.model';
import { RgpsResultadosComponent } from '../+rgps-resultados/rgps-resultados.component';
import * as moment from 'moment';
import { Moeda } from 'app/services/Moeda.model';
import { MoedaService } from 'app/services/Moeda.service';
import { DefinicaoMoeda } from 'app/+rgps/+rgps-resultados/rgps-resultados-apos-pec103/share-rmi/definicao-moeda';
import { validateConfig } from '@angular/router/src/config';
import { DefinicoesPlanejamento } from '../shared/definicoes-planejamento';


@Component({
  selector: 'app-rgps-planejamento-resultados',
  templateUrl: './rgps-planejamento-resultados.component.html',
  styleUrls: ['./rgps-planejamento-resultados.component.css']
})
export class RgpsPlanejamentoResultadosComponent implements OnInit {

  private isUpdatingRst = true;

  private idSegurado;
  private idCalculo;
  private idPlanejamento;

  private isSegurado = false;
  private isCalculo = false;
  private isPlanejamento = false;
  private isResultado = false;

  private segurado;
  private calculo;
  private planejamento;
  private moeda;

  private resultadosFacultativo = []
  private resultadosDescontadoSalario = [];
  private resultadosGeral = [];


  private sexoSegurado;
  private expectativaVidaList = [];
  private expectativaVidaR;
  // public expvida;
  private dataNascimentoSeguradoM;
  private idadeNaDiBPlanejamento;
  private idadeNaDiBRmi;

  public steps = [
    {
      key: 'step1',
      title: ' Dados do Segurado',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step2',
      title: 'RMI do Benefício Atual',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step3',
      title: 'Dados do Benefício Futuro',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step4',
      title: 'RMI do Benefício Futuro',
      valid: false,
      checked: false,
      submitted: false,
    },
    {
      key: 'step5',
      title: 'Relatório',
      valid: false,
      checked: false,
      submitted: false,
    },
  ];
  public activeStep = {
    key: 'step5',
    title: 'Relatório',
    valid: false,
    checked: false,
    submitted: false,
  };


  private definicaoMoeda = DefinicaoMoeda;


  constructor
    (
      protected SeguradoService: SeguradoService,
      protected CalculoRgps: CalculoRgpsService,
      protected planejamentoService: RgpsPlanejamentoService,
      private ExpectativaVidaService: ExpectativaVidaService,
      protected router: Router,
      private Moeda: MoedaService,
      protected route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.calculoInit();
    moment.locale('pt-br');
  }


  private getAliquotasLabel(value) {
    return DefinicoesPlanejamento.getAliquota(value).label;
  }

  private calculoInit() {


    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.idCalculo = this.route.snapshot.params['id_calculo'];
    this.idPlanejamento = this.route.snapshot.params['id_planejamento'];


    this.SeguradoService.find(this.idSegurado)
      .then((segurado: SeguradoModel) => {

        this.segurado = segurado;
        this.dataNascimentoSeguradoM = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
        this.sexoSegurado = this.segurado.sexo;


        this.CalculoRgps.find(this.idCalculo)
          .then((calculo: CalculoModel) => {

            this.calculo = calculo;



            this.planejamentoService.find(this.idPlanejamento)
              .then((planejamento: PlanejamentoRgps) => {

                //  console.log(planejamento);
                this.planejamento = planejamento;
                this.idadeNaDiBPlanejamento = Math.abs(
                  this.dataNascimentoSeguradoM.diff(
                    moment(this.planejamento.data_futura),
                    'years'));

                this.idadeNaDiBRmi = Math.abs(
                  this.dataNascimentoSeguradoM.diff(
                    moment(this.calculo.dib),
                    'years'));

                this.planejamento.dataDibFutura = moment(this.planejamento.data_futura).format('DD/MM/YYYY');


                const anoTabela = (moment().year() - 2);
                this.ExpectativaVidaService.getByAnoIdade(this.idadeNaDiBRmi, anoTabela)
                  .then((expvida: ExpectativaVida[]) => {
                    this.expectativaVidaList = [];
                    this.expectativaVidaList = expvida;

                    const inicial = moment((moment().year() - 1) + '-12-01').format('YYYY-MM-DD');
                    const expectativaObj = this.expectativaVidaList.find(row => moment(row.data_inicial).isSame(inicial));

                    if (expectativaObj[this.sexoSegurado]) {
                      this.expectativaVidaR = expectativaObj[this.sexoSegurado];
                    } else {
                      this.expectativaVidaR = 80;
                    }


                    this.Moeda.getByDateRangeMomentParam(moment().subtract(1, 'months'), moment())
                      .then((moeda: Moeda[]) => {

                        this.moeda = moeda;
                        console.log(moeda);

                        // this.calcularPlanejamento();

                        this.calcularPlanejamento().then(result => {

                          console.log(result);

                          setTimeout(() => {
                            this.isUpdatingRst = false;
                          }, 2000);
                          
                        }).catch((error) => {
                          console.log(error);
                        });
                      });

                  });


              }).catch(errors => console.log(errors));

          }).catch(errors => console.log(errors));

      }).catch(errors => console.log(errors));




  }

  private getAliquota(aliquotaP, rmi) {

    switch (aliquotaP) {

      case 51:
        return {
          aliquota: aliquotaP,
          valor: (rmi * Number(aliquotaP) / 100)
        };
      case 112:

        return {
          aliquota: aliquotaP,
          valor: (rmi * Number(aliquotaP) / 100)
        };
      case 201:

        return {
          aliquota: aliquotaP,
          valor: (rmi * Number(aliquotaP) / 100)
        };

      case 99:

        return DefinicaoAliquotaEfetiva.calcular(rmi);
      default:

        return {
          aliquota: aliquotaP,
          valor: (rmi * Number(aliquotaP) / 100)
        };
    }

  }


  public calcularPlanejamento() {


    return new Promise((resolve, reject) => {

      this.isUpdatingRst = true;


      const calculo1 = this.calculo;
      const calculo2 = this.planejamento;
      const inicial = moment((moment().year() - 1) + '-12-01').format('YYYY-MM-DD');
      const dataInicioBeneficio1 = moment(calculo1.data_pedido_beneficio, 'DD/MM/YYYY');
      const dataInicioBeneficio2 = moment(calculo2.dataDibFutura, 'DD/MM/YYYY');
      const valor = this.Moeda.getByDate(moment());
      const salMinimo = valor.salario_minimo * 0.05;
      const aliquotaRst = this.getAliquota(calculo2.aliquota, Number(calculo2.novo_rmi));

      let investimentoEntreDatas = Math.abs(calculo1.soma_contribuicao - calculo2.nova_soma_contribuicoes);
      let tempoMinimo1 = 0;
      let tempoMinimo2 = 0;
      let tempoMinimo2Mes = 0;
      let tempoMinimo2Ano = 0;


      const mesesEntreDatas = (this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2) / 12
        + this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2));

      const mesesEntreDatas2 = this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2);


      let totalPerdidoEntreData = mesesEntreDatas * calculo1.valor_beneficio;

      let diferencaRmi = Math.abs(calculo2.novo_rmi - calculo1.valor_beneficio);

      let investimentoContribuicaoINSS = ((this.planejamento.valor_beneficio * aliquotaRst.aliquota) / 100) * mesesEntreDatas2;

      //if (diferencaRmi != 0) {
      tempoMinimo1 = ((investimentoEntreDatas + totalPerdidoEntreData) / diferencaRmi) / 13;

      tempoMinimo2 = (((totalPerdidoEntreData) / diferencaRmi) / 11) * 12;
      tempoMinimo2Mes = (((investimentoContribuicaoINSS + totalPerdidoEntreData) / diferencaRmi) / 11) * 12;
      tempoMinimo2Ano = (((investimentoContribuicaoINSS + totalPerdidoEntreData) / diferencaRmi) / 11);

      //      }


      let idadeSegurado = Math.abs(this.dataNascimentoSeguradoM.diff(moment(), 'years'));

      let idadeSeguradoDIB = Math.abs(this.dataNascimentoSeguradoM.diff(dataInicioBeneficio2, 'years'));

      // console.log("--", this.expectativaVidaR)
      let expectativaIbgeSegurado = this.expectativaVidaR + idadeSegurado;

      let resultSubtracao = (moment.duration(expectativaIbgeSegurado, 'years'))
        .subtract(moment.duration(dataInicioBeneficio2.diff(this.dataNascimentoSeguradoM)));
      let resultConversao = resultSubtracao.years() + (resultSubtracao.months() / 12) + (resultSubtracao.days() * 365.25);

      let tempoMinimo2Meses2 = Math.floor((tempoMinimo2Mes - Math.floor(tempoMinimo2Mes)) * 12);


      let totalEsperado = 0;
      // se a aliquota é de empregado cumulativa tem abono, 13º
      if (this.planejamento.aliquota === 99) {
        totalEsperado = (resultConversao * 13) * this.planejamento.novo_rmi;
      } else {
        totalEsperado = (resultConversao * 12) * this.planejamento.novo_rmi;
      }
      // let totalEsperado = (resultConversao * 13) * this.planejamento.novo_rmi;


      const idadeDibFutura = this.diferencaDatas(moment(this.segurado.data_nascimento, 'DD/MM/YYYY'),
        moment(this.planejamento.data_futura));
      this.resultadosGeral.push({
        label: 'A) Valor Investido em Contribuições Futuras',
        value2: this.definicaoMoeda.formatMoney(investimentoContribuicaoINSS),
      });

      this.resultadosGeral.push({
        label: 'B) Valor que Deixou de Receber Caso Tivesse se Aposentado na Primeira Data ',
        value2: this.definicaoMoeda.formatMoney(totalPerdidoEntreData),
      });

      this.resultadosGeral.push({
        label: 'Total Investido (A + B) ',
        value2: this.definicaoMoeda.formatMoney((investimentoContribuicaoINSS + totalPerdidoEntreData)),
      });

      this.resultadosGeral.push({
        label: 'Valor da Diferença Entre os Benefícios ',
        value2: this.definicaoMoeda.formatMoney(diferencaRmi),
      });

      this.resultadosGeral.push({
        label: 'Tempo Mínimo para Recuperar os Valores Investidos ',
        // value2: Math.floor(tempoMinimo2) + ' ano(s) ' + tempoMinimo2Meses + ' mes(es)',
        value2: Math.floor(tempoMinimo2Mes) + ' mês(es)',
      });

      this.resultadosGeral.push({
        label: 'Idade do Segurado na DIB Futura',
        value2: idadeDibFutura.years() + ' ano(s) ' + idadeDibFutura.months() + ' mês(es)'
      });

      this.resultadosGeral.push({
        label: 'Idade do Segurado ao Recuperar os Valores Investidos ',
        // value2: Math.floor(idadeSeguradoDIB + Math.floor(tempoMinimo2Ano)) + ' ano(s) ' + tempoMinimo2Meses2 + ' mês(es)',
        value2: Math.floor(idadeSeguradoDIB + Math.floor(tempoMinimo2Ano)) + ' ano(s) ' + tempoMinimo2Meses2 + ' mês(es)',
      });

      this.resultadosGeral.push({
        label: 'Idade Máxima do Segurado de Acordo com a Expectativa de Sobrevida (IBGE) ',
        value2: Math.floor(expectativaIbgeSegurado) + ' ano(s) '
          + Math.floor((expectativaIbgeSegurado - Math.floor(expectativaIbgeSegurado)) * 12) + ' mês(es)',
      });

      // se a aliquota é de empregado cumulativa tem abono, 13º
      if (this.planejamento.aliquota === 99) {

        this.resultadosGeral.push({
          label: 'Valor Acumulado ao Atingir a Idade (incluindo 13º salário) ',
          value2: this.definicaoMoeda.formatMoney(totalEsperado),
        });

      } else {

        this.resultadosGeral.push({
          label: 'Valor Acumulado ao Atingir a Idade',
          value2: this.definicaoMoeda.formatMoney(totalEsperado),
        });

      }


      if (this.resultadosGeral.length >= 7) {
        resolve(true);
      } else {
        reject(false);
      }
    });


  }



  // private calcularPlanejamento2() {

  //   this.isUpdatingRst = true;

  //   const calculo1 = this.calculo;
  //   const calculo2 = this.planejamento;
  //   const inicial = moment((moment().year() - 1) + '-12-01').format('YYYY-MM-DD');
  //   const dataInicioBeneficio1 = moment(calculo1.data_pedido_beneficio, 'DD/MM/YYYY');
  //   const dataInicioBeneficio2 = moment(calculo2.dataDibFutura, 'DD/MM/YYYY');
  //   const valor = this.Moeda.getByDate(moment());
  //   const salMinimo = valor.salario_minimo * 0.05;
  //   const aliquotaRst = this.getAliquota(calculo2.aliquota, Number(calculo2.novo_rmi));

  //   let investimentoEntreDatas = Math.abs(calculo1.soma_contribuicao - calculo2.nova_soma_contribuicoes);

  //   // Não sei o motivo deste item
  //   // investimentoEntreDatas += this.contribEmAtraso;// contribuicao em atraso no forms na pŕópria página

  //   //  console.log("E", this.ExpectativaVida)

  //   let tempoMinimo1 = 0;
  //   let tempoMinimo2 = 0;
  //   let tempoMinimo2Mes = 0;
  //   let tempoMinimo2Ano = 0;

  //   investimentoEntreDatas *= aliquotaRst.aliquota;

  //   const mesesEntreDatas = (this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2) / 12
  //     + this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2));

  //   const mesesEntreDatas2 = this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2);


  //   let totalPerdidoEntreData = mesesEntreDatas * calculo1.valor_beneficio;

  //   let diferencaRmi = Math.abs(calculo2.novo_rmi - calculo1.valor_beneficio);

  //   let investimentoContribuicaoINSS = ((this.planejamento.valor_beneficio * aliquotaRst.aliquota) / 100) * mesesEntreDatas2;

  //   if (diferencaRmi != 0) {
  //     tempoMinimo1 = ((investimentoEntreDatas + totalPerdidoEntreData) / diferencaRmi) / 13;

  //     tempoMinimo2 = (((totalPerdidoEntreData) / diferencaRmi) / 11) * 12;
  //     tempoMinimo2Mes = (((investimentoContribuicaoINSS + totalPerdidoEntreData) / diferencaRmi) / 11) * 12;
  //     tempoMinimo2Ano = (((investimentoContribuicaoINSS + totalPerdidoEntreData) / diferencaRmi) / 11);

  //   }


  //   let idadeSegurado = Math.abs(this.dataNascimentoSeguradoM.diff(moment(), 'years'));

  //   let idadeSeguradoDIB = Math.abs(this.dataNascimentoSeguradoM.diff(dataInicioBeneficio2, 'years'));

  //   // console.log("--", this.expectativaVidaR)
  //   let expectativaIbgeSegurado = this.expectativaVidaR + idadeSegurado;

  //   let resultSubtracao = (moment.duration(expectativaIbgeSegurado, 'years'))
  //     .subtract(moment.duration(dataInicioBeneficio2.diff(this.dataNascimentoSeguradoM)));
  //   let resultConversao = resultSubtracao.years() + (resultSubtracao.months() / 12) + (resultSubtracao.days() * 365.25);

  //   let tempoMinimo2Meses2 = Math.floor((tempoMinimo2Mes - Math.floor(tempoMinimo2Mes)) * 12);


  //   let totalEsperado = 0;
  //   // se a aliquota é de empregado cumulativa tem abono, 13º
  //   if (this.planejamento.aliquota === 99) {
  //     totalEsperado = (resultConversao * 13) * this.planejamento.novo_rmi;
  //   } else {
  //     totalEsperado = (resultConversao * 12) * this.planejamento.novo_rmi;
  //   }
  //   // let totalEsperado = (resultConversao * 13) * this.planejamento.novo_rmi;

  //   setTimeout(() => {
  //     const idadeDibFutura = this.diferencaDatas(moment(this.segurado.data_nascimento, 'DD/MM/YYYY'),
  //       moment(this.planejamento.data_futura));
  //     this.resultadosGeral.push({
  //       label: 'A) Valor Investido em Contribuições Futuras',
  //       value2: this.definicaoMoeda.formatMoney(investimentoContribuicaoINSS),
  //     });

  //     this.resultadosGeral.push({
  //       label: 'B) Valor que Deixou de Receber Caso Tivesse se Aposentado na Primeira Data ',
  //       value2: this.definicaoMoeda.formatMoney(totalPerdidoEntreData),
  //     });

  //     this.resultadosGeral.push({
  //       label: 'Total Investido (A + B) ',
  //       value2: this.definicaoMoeda.formatMoney((investimentoContribuicaoINSS + totalPerdidoEntreData)),
  //     });

  //     this.resultadosGeral.push({
  //       label: 'Valor da Diferença Entre os Benefícios ',
  //       value2: this.definicaoMoeda.formatMoney(diferencaRmi),
  //     });

  //     this.resultadosGeral.push({
  //       label: 'Tempo Mínimo para Recuperar os Valores Investidos ',
  //       // value2: Math.floor(tempoMinimo2) + ' ano(s) ' + tempoMinimo2Meses + ' mes(es)',
  //       value2: Math.floor(tempoMinimo2Mes) + ' mês(es)',
  //     });

  //     this.resultadosGeral.push({
  //       label: 'Idade do Segurado na DIB Futura',
  //       value2: idadeDibFutura.years() + ' ano(s) ' + idadeDibFutura.months() + ' mês(es)'
  //     });

  //     this.resultadosGeral.push({
  //       label: 'Idade do Segurado ao Recuperar os Valores Investidos ',
  //       // value2: Math.floor(idadeSeguradoDIB + Math.floor(tempoMinimo2Ano)) + ' ano(s) ' + tempoMinimo2Meses2 + ' mês(es)',
  //       value2: Math.floor(idadeSeguradoDIB + Math.floor(tempoMinimo2Ano)) + ' ano(s) ' + tempoMinimo2Meses2 + ' mês(es)',
  //     });

  //     this.resultadosGeral.push({
  //       label: 'Idade Máxima do Segurado de Acordo com a Expectativa de Sobrevida (IBGE) ',
  //       value2: Math.floor(expectativaIbgeSegurado) + ' ano(s) '
  //         + Math.floor((expectativaIbgeSegurado - Math.floor(expectativaIbgeSegurado)) * 12) + ' mês(es)',
  //     });

  //     // se a aliquota é de empregado cumulativa tem abono, 13º
  //     if (this.planejamento.aliquota === 99) {

  //       this.resultadosGeral.push({
  //         label: 'Valor Acumulado ao Atingir a Idade (incluindo 13º salário) ',
  //         value2: this.definicaoMoeda.formatMoney(totalEsperado),
  //       });

  //     } else {

  //       this.resultadosGeral.push({
  //         label: 'Valor Acumulado ao Atingir a Idade',
  //         value2: this.definicaoMoeda.formatMoney(totalEsperado),
  //       });

  //     }




  //   }, 5000);
  // }


  private diferencaDatas(inicio, fim) {

    return moment.duration(fim.diff(inicio));

  }

  private getDifferenceInMonths(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.floor(difference);
  }


  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '')
      ? true : false;
  }


  retornarParaplanejamento() {
    this.router.navigate(['/rgps/rgps-planejamento']);
  }


  private navegarPlanejamento(type) {
    let urlpbcNew = '';

    switch (type) {
      case 'inicio':
        urlpbcNew = '/rgps/rgps-planejamento/1';
        break;
      case 'selectSegurado':
        urlpbcNew = '/rgps/rgps-planejamento/2/' + this.segurado.id;
        break;
      case 'selectCalc':
        urlpbcNew = '/rgps/rgps-planejamento/3/' + this.segurado.id + '/' + this.calculo.id;
        break;
      case 'selectCalcResult':
        urlpbcNew = '/rgps/rgps-resultados/' + this.segurado.id + '/' + this.calculo.id + '/plan/' + this.planejamento.id;
        break;
    }

    this.router.navigate([urlpbcNew]);

  }


  private setActiveStep(pane) {

    switch (pane.key) {
      case 'step1':
        this.navegarPlanejamento('inicio');
        break;
      case 'step2':
        this.navegarPlanejamento('selectSegurado');
        break;
      case 'step3':
        this.navegarPlanejamento('selectCalc');
        break;
      case 'step4':
        this.navegarPlanejamento('selectCalcResult');
        break;
    }

  }

  imprimirPagina() {

    let printContents = document.getElementById('box-dados-title').innerHTML;
    printContents = document.getElementById('box-dados-segurado').innerHTML;
    printContents += document.getElementById('box-dados-calculo').innerHTML;
    printContents += document.getElementById('box-dados-planejamento').innerHTML;
    printContents += document.getElementById('box-dados-resultados').innerHTML;

    const css = `
    <style>
          body{font-family: Arial, Helvetica, sans-serif;}
          h1, h2{font-size:0.9rem;}
          i.fa, .not-print{ display: none; }
          table{margin-top: 10px;}
          footer,div,p,td,th{font-size:10px !important;}
          .list-inline{ display:inline; }
          .table>tbody>tr>td, .table>tbody>tr>th,
           .table>tfoot>tr>td, .table>tfoot>tr>th,
           .table>thead>tr>td, .table>thead>tr>th {padding: 3.5px 10px;}
           footer{text-align: center; margin-top: 50px;}
           .list-inline-print{ display:inline !important;}
    </style>`;


    const popupWin = window.open('', '_blank', 'width=640,height=480');
    const rodape = `<img src='./assets/img/rodapesimulador.png' alt='Logo'>`;


    printContents = printContents.replace(/<table/g,
      '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');

    popupWin.document.open();
    popupWin.document.write(`<!doctype html>
                                <html>
                                  <head>${css}</head>
                                  <title>Planejamento futuro - ${this.segurado.nome}</title>
                                  <body onload="window.print()">
                                   <article>${printContents}</article>
                                   <footer class="mt-5">${rodape}</footer>
                                  </body>
                                </html>`);
    popupWin.document.close();
  }



}
