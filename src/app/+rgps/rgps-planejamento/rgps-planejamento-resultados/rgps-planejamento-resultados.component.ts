
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
import { ReajusteAutomaticoService } from 'app/+rgps/+rgps-resultados/ReajusteAutomatico.service';


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
  private aliquotaRst;
  private isDiffAeBNegativa = false;
  private numeroContribuicoesAdicionais = 0;
  private numeroContribuicoesTotal = 0;


  private resultadosFacultativo = []
  private resultadosDescontadoSalario = [];
  private resultadosGeral = [];
  private reajustesAutomaticos;



  private sexoSegurado;
  private expectativaVidaList = [];
  private expectativaVidaR;

  private dataNascimentoSeguradoM;
  private idadeNaDiBPlanejamento;
  private idadeNaDiBRmi;


  private idadeAtual;
  private idadeDibAtual;
  private idadeDibFutura;
  private idadeDibFuturaExpectativaIBGE;
  private idadeDibFuturaExpectativaIBGEDiffDibFutura;


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
  //private definicaoAliquotaEfetiva = DefinicaoAliquotaEfetiva;


  constructor
    (
      protected SeguradoService: SeguradoService,
      protected CalculoRgps: CalculoRgpsService,
      protected planejamentoService: RgpsPlanejamentoService,
      private ExpectativaVidaService: ExpectativaVidaService,
      private ReajusteAutomatico: ReajusteAutomaticoService,
      protected router: Router,
      protected Moeda: MoedaService,
      protected route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.calculoInit();
    moment.locale('pt-br');
  }


  private getAliquotasLabel(value) {
    if (value > 0) {
      return DefinicoesPlanejamento.getAliquota(value).label;
    }
  }

  private calculoInit() {


    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.idCalculo = this.route.snapshot.params['id_calculo'];
    this.idPlanejamento = this.route.snapshot.params['id_planejamento'];


    this.SeguradoService.getByIdSegurado(this.idSegurado) //getByIdSegurado
      .then((segurado: SeguradoModel) => {

        this.segurado = segurado;
        this.dataNascimentoSeguradoM = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
        this.sexoSegurado = this.segurado.sexo;


        this.CalculoRgps.getCalculoById(this.idCalculo)
          .then((calculo: CalculoModel) => {

            this.calculo = calculo;

            this.planejamentoService.getPlanejamentoByPlanId(this.idPlanejamento)
              .then((planejamento: PlanejamentoRgps) => {

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


                        this.moeda = moeda[1];
                        if (moeda[1].salario_minimo == undefined) {
                          this.moeda = moeda[0];
                        }

                        const dataReajustesAutomaticosI = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
                        const dataReajustesAutomaticosF = moment(this.planejamento.data_futura);
                        this.ReajusteAutomatico.getByDate(dataReajustesAutomaticosI.clone(), dataReajustesAutomaticosF)
                          .then(reajustes => {
                            this.reajustesAutomaticos = reajustes;

                            this.calcularPlanejamento().then(result => {

                              setTimeout(() => {
                                this.isUpdatingRst = false;
                              }, 2000);

                            }).catch((error) => {
                              console.log(error);
                            });
                          });

                      });

                  });


              }).catch(errors => console.log(errors));

          }).catch(errors => console.log(errors));

      }).catch(errors => console.log(errors));




  }

  private getAliquota(aliquotaP, contribuicao) {


    switch (Number(aliquotaP)) {

      case 5:
      case 51:
        return {
          aliquota: 5,
          valor: (contribuicao * (5 / 100))
        };
      case 8:
        return {
          aliquota: 8,
          valor: (contribuicao * (8 / 100))
        };

      case 11:
      case 113:
      case 112:
        return {
          aliquota: 11,
          valor: (contribuicao * (11 / 100))
        };

      case 20:
      case 201:
        return {
          aliquota: 20,
          valor: (contribuicao * (20 / 100))
        };

      case 99:
        return DefinicaoAliquotaEfetiva.calcular(contribuicao);

      // default:
      //   return {
      //     aliquota: aliquotaP,
      //     valor: (contribuicao * (aliquotaP / 100))
      //   };
    }

  }





  public calcularPlanejamento() {


    return new Promise((resolve, reject) => {

      this.isUpdatingRst = true;


      const calculo1 = this.calculo;
      const calculo2 = this.planejamento;

      console.log(calculo1);
      console.log(calculo2);

      this.calcularIdades();

      const inicial = moment((moment().year() - 1) + '-12-01').format('YYYY-MM-DD');
      const dataInicioBeneficio1 = moment(calculo1.data_pedido_beneficio, 'DD/MM/YYYY');
      const dataInicioBeneficio2 = moment(calculo2.dataDibFutura, 'DD/MM/YYYY');
      const valor = this.moeda;
      const salMinimo = valor.salario_minimo * 0.05;
      this.aliquotaRst = this.getAliquota(Number(calculo2.aliquota), Number(calculo2.valor_beneficio));

      const resultadoRmiNovo = JSON.parse(calculo2.resultado_rmi_novo);
      this.numeroContribuicoesAdicionais = resultadoRmiNovo.numero_contribuicoes_adicionais;
      this.numeroContribuicoesTotal = resultadoRmiNovo.numero_contribuicoes_adicionais;


      const dataContribuicoesAdicionaisInicial = moment(resultadoRmiNovo.planejamentoContribuicoesAdicionaisInicio);
      const dataContribuicoesAdicionaisfim = moment(resultadoRmiNovo.planejamentoContribuicoesAdicionaisFim);

      console.log(resultadoRmiNovo);
      console.log(this.numeroContribuicoesAdicionais);
      console.log(this.numeroContribuicoesTotal);

      let investimentoEntreDatas = Math.abs(calculo1.soma_contribuicao - calculo2.nova_soma_contribuicoes);
      let tempoMinimo1 = 0;
      let tempoMinimo2 = 0;
      let tempoMinimo2Mes = 0;
      let tempoMinimo2Ano = 0;


      const mesesEntreDatas = (this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2) / 12
        + this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2));

      const mesesEntreDatas2 = this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2);

      // const dataInicioBeneficio1Start = (dataInicioBeneficio1.clone()).startOf('month')
      // const dataInicioBeneficio2Start = (dataInicioBeneficio2.clone()).startOf('month')

      // console.log(moment.duration(dataInicioBeneficio2Start.diff(dataInicioBeneficio1Start)));
      // console.log(moment.duration(dataInicioBeneficio2Start.diff(dataInicioBeneficio1Start)).asMonths());
      // console.log(mesesEntreDatas);




      // A) Valor Investido em Contribuições Futuras
      //const investimentoContribuicaoINSS2 = ((this.planejamento.valor_beneficio * this.aliquotaRst.aliquota) / 100) * mesesEntreDatas2;
      let mesesEntreDib = 0;
      let investimentoContribuicaoINSS = 0;
      if (Number(calculo2.aliquota) === 99) {

        //  investimentoContribuicaoINSS = this.createListPlanContribuicoesEntreDibs(this.aliquotaRst.valor);
        // const investimentoContribuicaoINSSRST = this.createListPlanContribuicoesEntreDibs(
        //   this.calculo.data_pedido_beneficio,
        //   this.planejamento.dataDibFutura,
        //   this.aliquotaRst.valor);

        console.log(dataContribuicoesAdicionaisInicial)
        console.log(dataContribuicoesAdicionaisfim)

        const investimentoContribuicaoINSSRST = this.createListPlanContribuicoesEntreDibs(
          dataContribuicoesAdicionaisInicial.format('DD/MM/YYYY'),
          dataContribuicoesAdicionaisfim.add(1, 'month').format('DD/MM/YYYY'),
          this.aliquotaRst.valor,
          false);

        investimentoContribuicaoINSS = investimentoContribuicaoINSSRST.value;

      } else {

        investimentoContribuicaoINSS = (this.aliquotaRst.valor * this.numeroContribuicoesAdicionais);
        mesesEntreDib = this.numeroContribuicoesAdicionais;

      }


      // console.log(mesesEntreDatas)
      // console.log(mesesEntreDatas2)
      // console.log(investimentoContribuicaoINSS)
      // console.log(mesesEntreDatas2)



      // B) Valor que Deixou de Receber Caso Tivesse se Aposentado na Primeira Data
      // let totalPerdidoEntreData = mesesEntreDatas * calculo1.valor_beneficio;

      let totalPerdidoEntreData = 0;
      //  if (Number(calculo2.aliquota) === 99) {

      //totalPerdidoEntreData = this.createListPlanContribuicoesEntreDibs(calculo1.valor_beneficio);
      const totalPerdidoEntreDataRST = this.createListPlanContribuicoesEntreDibs(
        this.calculo.data_pedido_beneficio,
        this.planejamento.dataDibFutura,
        calculo1.valor_beneficio,
        true);

      totalPerdidoEntreData = totalPerdidoEntreDataRST.value
      // } else {

      //   totalPerdidoEntreData = this.numeroContribuicoesAdicionais * calculo1.valor_beneficio;

      // }


      const diferencaRmi = calculo2.novo_rmi - calculo1.valor_beneficio;

      if (diferencaRmi > 0) {

        if (this.planejamento.aliquota === 99) {
          tempoMinimo1 = ((investimentoEntreDatas + totalPerdidoEntreData) / diferencaRmi) / 13;
        } else {
          tempoMinimo1 = ((investimentoEntreDatas + totalPerdidoEntreData) / diferencaRmi) / 12;
        }

        tempoMinimo2 = (((totalPerdidoEntreData) / diferencaRmi) / 11) * 12;
        tempoMinimo2Mes = (((investimentoContribuicaoINSS + totalPerdidoEntreData) / diferencaRmi) / 11) * 12;
        tempoMinimo2Ano = (((investimentoContribuicaoINSS + totalPerdidoEntreData) / diferencaRmi) / 11);

      } else {

        this.isDiffAeBNegativa = true;

      }


      let idadeSegurado = Math.abs(this.dataNascimentoSeguradoM.diff(moment(), 'years'));

      let idadeSeguradoDIB = Math.abs(this.dataNascimentoSeguradoM.diff(dataInicioBeneficio2, 'years'));

      // console.log("--", this.expectativaVidaR)
      let expectativaIbgeSegurado = this.expectativaVidaR + idadeSegurado;

      let resultSubtracao = (moment.duration(expectativaIbgeSegurado, 'years'))
        .subtract(moment.duration(dataInicioBeneficio2.diff(this.dataNascimentoSeguradoM)));
      let resultConversao = resultSubtracao.years() + (resultSubtracao.months() / 12) + (resultSubtracao.days() * 365.25);

      let tempoMinimo2Meses2 = Math.floor((tempoMinimo2Mes - Math.floor(tempoMinimo2Mes)) * 12);


      // const TempoMinimoRecuperarValoresInvestidos = (investimentoContribuicaoINSS + totalPerdidoEntreData) / diferencaRmi;

      // console.log((investimentoContribuicaoINSS + totalPerdidoEntreData));
      // console.log(TempoMinimoRecuperarValoresInvestidos);

      // let totalEsperado = 0;
      // se a aliquota é de empregado cumulativa tem abono, 13º
      // if (this.planejamento.aliquota === 99) {
      //   totalEsperado = (resultConversao * 13) * this.planejamento.novo_rmi;
      // } else {
      //   totalEsperado = (resultConversao * 12) * this.planejamento.novo_rmi;
      // }
      // let totalEsperado = (resultConversao * 13) * this.planejamento.novo_rmi;

      const totalEsperado = this.calcularValorAcumulado();

      const tempoMínimoRecuperarValoresInvestidosRST = this.tempoMínimoRecuperarValoresInvestidos(
        (investimentoContribuicaoINSS + totalPerdidoEntreData),
        Number(this.planejamento.novo_rmi)
      );


      const idadeDibFutura = this.diferencaDatas(moment(this.segurado.data_nascimento, 'DD/MM/YYYY'),
        moment(this.planejamento.data_futura));
      this.resultadosGeral.push({
        label: 'A) Valor Investido em Contribuições Futuras',
        value: this.definicaoMoeda.formatMoney(investimentoContribuicaoINSS),
      });

      this.resultadosGeral.push({
        label: 'B) Valor que Deixou de Receber Caso Tivesse se Aposentado na Primeira Data (incluindo 13º salário)',
        value: this.definicaoMoeda.formatMoney(totalPerdidoEntreData),
      });

      this.resultadosGeral.push({
        label: 'Total Investido (A + B) ',
        value: this.definicaoMoeda.formatMoney((investimentoContribuicaoINSS + totalPerdidoEntreData)),
      });


      if (!this.isDiffAeBNegativa) {

        this.resultadosGeral.push({
          label: 'Valor da Diferença Entre os Benefícios ',
          value: this.definicaoMoeda.formatMoney(diferencaRmi),
        });

        this.resultadosGeral.push({
          label: 'Tempo Mínimo para Recuperar os Valores Investidos',
          // value: Math.floor(tempoMinimo2) + ' ano(s) ' + tempoMinimo2Meses + ' mes(es)',
          // value: Math.floor(tempoMinimo2Mes) + ' mês(es)' ,
          value: tempoMínimoRecuperarValoresInvestidosRST + ' mês(es)',
        });

        this.resultadosGeral.push({
          label: 'Idade do Segurado na DIB Futura',
          // value: idadeDibFutura.years() + ' ano(s) ' + idadeDibFutura.months() + ' mês(es)'
          value: this.formateObjToStringAnosMesesDias(this.idadeDibFutura)
        });

        this.resultadosGeral.push({
          label: 'Idade do Segurado ao Recuperar os Valores Investidos ',
          // value: Math.floor(idadeSeguradoDIB + Math.floor(tempoMinimo2Ano)) + ' ano(s) ' + tempoMinimo2Meses2 + ' mês(es)',
          value: Math.floor(idadeSeguradoDIB + Math.floor(tempoMinimo2Ano)) + ' ano(s) ' + tempoMinimo2Meses2 + ' mês(es)',
        });

        this.resultadosGeral.push({
          label: 'Idade Máxima do Segurado de Acordo com a Expectativa de Sobrevida - IBGE',
          // value: Math.floor(expectativaIbgeSegurado) + ' ano(s) '
          //   + Math.floor((expectativaIbgeSegurado - Math.floor(expectativaIbgeSegurado)) * 12) + ' mês(es)',
          value: this.formateObjToStringAnosMesesDias(this.idadeDibFuturaExpectativaIBGE)
        });

        // se a aliquota é de empregado cumulativa tem abono, 13º
        // if (this.planejamento.aliquota === 99) {

        //   this.resultadosGeral.push({
        //     label: 'Valor Acumulado ao Atingir a Idade (incluindo 13º salário) ',
        //     value: this.definicaoMoeda.formatMoney(totalEsperado),
        //   });

        // } else {

        //   this.resultadosGeral.push({
        //     // label: 'Valor Acumulado ao Atingir a Idade Acordo com a Expectativa de Sobrevida (IBGE)',
        //     label: 'Valor Acumulado ao Atingir a Idade de Acordo com a Expectativa de Sobrevida (IBGE) (incluindo 13º salário)',
        //     value: this.definicaoMoeda.formatMoney(totalEsperado),
        //   });

        // }

        this.resultadosGeral.push({
          // label: 'Valor Acumulado ao Atingir a Idade Acordo com a Expectativa de Sobrevida (IBGE)',
          label: 'Valor Acumulado ao Atingir a Idade de Acordo com a Expectativa de Sobrevida - IBGE (incluindo 13º salário)',
          value: this.definicaoMoeda.formatMoney(totalEsperado),
        });


      }



      if (this.resultadosGeral.length >= 7
        || (this.resultadosGeral.length >= 3 && this.isDiffAeBNegativa)) {
        resolve(true);
      } else {
        reject(false);
      }
    });


  }


  public formateObjToStringAnosMesesDias(tempoObj, notDays = true) {

    if (notDays) {
      return ` ${tempoObj.years()} ano(s), ${Math.floor(tempoObj.months())} mes(es)`;
    }

    // if (tempoObj.anos < 0) {
    //   return ` ${tempoObj.months()} mes(es) e ${Math.floor(tempoObj.days)} dia(s)`;
    // }

    return `${tempoObj.years()} ano(s), ${tempoObj.months()} mes(es) e ${Math.floor(tempoObj.days())} dia(s)`;

  }



  private getDiffDate(dataI, dataF) {
    return moment.duration(dataF.diff(moment(dataI)));
  }


  private calcularIdades() {

    this.idadeAtual = this.getDiffDate(
      moment(this.segurado.data_nascimento, 'DD/MM/YYYY'),
      moment()
    );

    this.idadeDibAtual = this.getDiffDate(
      moment(this.segurado.data_nascimento, 'DD/MM/YYYY'),
      moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY')
    );

    this.idadeDibFutura = this.getDiffDate(
      moment(this.segurado.data_nascimento, 'DD/MM/YYYY'),
      moment(this.planejamento.data_futura)
    );

    console.log(this.expectativaVidaR);

    this.idadeDibFuturaExpectativaIBGE = this.getDiffDate(
      moment(this.segurado.data_nascimento, 'DD/MM/YYYY'),
      moment()
    ).add(this.expectativaVidaR, 'years');

    this.idadeDibFuturaExpectativaIBGEDiffDibFutura = this.getDiffDate(
      moment(this.segurado.data_nascimento, 'DD/MM/YYYY'),
      moment()
    ).add(this.expectativaVidaR, 'years')
      .subtract(this.idadeDibFutura);
  }


  private calcularValorAcumulado() {

    console.log('valor esperado')
    console.log('idade atual')
    console.log(this.idadeAtual)
    console.log('idade dib atual')
    console.log(this.idadeDibAtual)
    console.log('idade futura atual')
    console.log(this.idadeDibFutura)
    console.log('idade idade atual + IBGE atual')
    console.log(this.idadeDibFuturaExpectativaIBGE)
    console.log('idade idade futura atual - IBGE atual')
    console.log(this.idadeDibFuturaExpectativaIBGEDiffDibFutura);

    const diffTempoIBGESubIDFutura = this.idadeDibFuturaExpectativaIBGEDiffDibFutura.asYears();

    let finalvalorComAbono = 0;

    // const valueDataAtual = moment();
    // const valueDataExpectativaFutura = moment().add(diffTempoIBGESubIDFutura, 'years');

    const valueDataAtual = moment(this.planejamento.data_futura);
    const valueDataExpectativaFutura = moment(this.planejamento.data_futura).add(diffTempoIBGESubIDFutura, 'years');

    const valorComAbono = this.createListPlanContribuicoesEntreDibs(
      valueDataAtual.format('DD/MM/YYYY'),
      valueDataExpectativaFutura.format('DD/MM/YYYY')
      , this.planejamento.novo_rmi,
      true)

    finalvalorComAbono = valorComAbono.value;

    return valorComAbono.value;
  }


  private tempoMínimoRecuperarValoresInvestidos(totaAB, Diferenca) {
    const rst = totaAB / Diferenca;
    return Math.ceil(rst);
  }


  private calcularSomaEntreContribuicoes() {


    // this.createListPlanContribuicoesEntreDibs(this.calculo.data_pedido_beneficio,
    //   this.planejamento.dataDibFutura,
    //   this.aliquotaRst.valor);
    // this.createListPlanContribuicoesEntreDibs(this.calculo.data_pedido_beneficio,
    //   this.planejamento.dataDibFutura,
    //   this.planejamento.valor_beneficio);

  }


  private createListPlanContribuicoesEntreDibs(inicioPeriodo, fimPeriodo, valor, aplicarReajuste) {

    valor = Number(valor);
    let UltimoValorReajustado = 0;
    const planejamentoContribuicoesEntreDibs = []
    let somaContribuicoes = 0;
    const inicio = moment(inicioPeriodo, 'DD/MM/YYYY').clone();
    let auxiliarDate = moment(inicioPeriodo, 'DD/MM/YYYY').clone().startOf('month').subtract(1, 'month');
    const fimContador = moment(fimPeriodo, 'DD/MM/YYYY').clone().subtract(1, 'day');


    let count = 0;
    let ObjValContribuicao = {};

    while (fimContador.isAfter(auxiliarDate, 'month')) {
      count++;
      auxiliarDate = (auxiliarDate.clone()).add(1, 'month');

      let valorContribM = valor;

      // if (UltimoValorReajustado > 0) {
      //   valorContribM = UltimoValorReajustado;
      // }


      if (inicio.isSame(auxiliarDate, 'month')) {

        valorContribM = this.verificaProporcional(inicio.clone(), valorContribM, 'Inicio');

      }

      if (fimContador.isSame(auxiliarDate, 'month')) {

        valorContribM = this.verificaProporcional(fimContador.clone(), valorContribM, 'Fim');

      }

      // if (aplicarReajuste) {
      //   valorContribM = this.aplicarAjusteAdministrativo(auxiliarDate.clone(), valorContribM);
      //   UltimoValorReajustado = valorContribM;
      // }

      ObjValContribuicao = {
        data: auxiliarDate.format('YYYY-MM-DD'),
        valor_contribuicao: valorContribM,
        tipo: 'M'
      };

      somaContribuicoes += valorContribM;
      planejamentoContribuicoesEntreDibs.push(ObjValContribuicao);

      if (auxiliarDate.month() === 11 || fimContador.isSame(auxiliarDate, 'month')) {

        count++;
        let valorContrib = valor;

        // if (UltimoValorReajustado > 0) {
        //   valorContrib = UltimoValorReajustado;
        // }

        if (inicio.isSame(auxiliarDate, 'year') && inicio.month() !== 0) {

          valorContrib = this.verificaAbonoProporcional(inicio.clone(), valorContrib, valor, 'I');

        }

        if (fimContador.isSame(auxiliarDate, 'month')) {

          valorContrib = this.verificaAbonoProporcional(fimContador.clone(), valorContrib, valor, 'F');

        }

        ObjValContribuicao = {
          data: auxiliarDate.format('YYYY-MM-DD'),
          valor_contribuicao: valorContrib,
          tipo: 'A'
        };

        somaContribuicoes += valorContrib;
        planejamentoContribuicoesEntreDibs.push(ObjValContribuicao);
      }


    };


    console.log('-- inicio -- contador com abono')
    console.log('inicio = ' + inicioPeriodo)
    console.log('fim = ' + fimPeriodo)
    console.log('num-contrib = ' + count)
    console.log('soma-contrib = ' + somaContribuicoes)
    console.log(this.reajustesAutomaticos);
    console.log(planejamentoContribuicoesEntreDibs)
    console.log('-- fim -- contador com abono')

    return { value: somaContribuicoes, count: count };

  }


  public aplicarAjusteAdministrativo(dataCorrente, valor) {

    const rowReajuste = this.reajustesAutomaticos.find(itemReajuste => (dataCorrente.isSame(itemReajuste.data_reajuste, 'month')))

    if (dataCorrente.year() === 2006 && dataCorrente.month() === 7) {
      rowReajuste.indice = 1.000096;
    }

    if (rowReajuste !== undefined && rowReajuste['indice'] > 1) {
      valor *= rowReajuste.indice;
    }

    return Math.round(valor * 100) / 100;
  }

  verificaProporcional(data, valorContrib, type) {

    console.log('----dias1----')
    console.log(data)
    console.log(data.date())
    console.log(data.date() < 30)
    console.log('----dias2----')

    if (data.date() < 30) {

      const diffdays = (type === 'Fim') ? (data.date()) : 31 - (data.date());
      const valorProp = (valorContrib / 30) * diffdays

      console.log(valorContrib);
      console.log(valorProp);
      return Math.round(valorProp * 100) / 100;

    } else {

      return valorContrib;

    }


    // if (type === 'fim') {
    //   return valorContrib * (30 - data.date()) / 30;
    // }


    // if (type === 'fim') {
    //   return valorContrib * (30 - data.date()) / 30;
    // }

  }

  /**
   *
   * @param dataProp dataProp
   * @param valorContrib valor
   * @param type inicio / final do periodo
   */
  verificaAbonoProporcional(dataProp, valorContrib, valorFull, type) {

    // console.log('---------inicio--------')
    // console.log((dataProp));
    // console.log((dataProp.month() + 1) === 12 && (dataProp.date() === 1 || dataProp.date() === 31));
    // console.log('-----------fim----------')

    if (((dataProp.month() + 1) === 12 && (dataProp.date() === 1 || dataProp.date() === 31))) {
      return Math.round(valorFull * 100) / 100;
    }

    let diffMes = (type === 'I') ? 12 - (dataProp.month() + 1) : (dataProp.month() + 1);

    if ((dataProp.date() > 15 && type === 'F') || (dataProp.date() <= 15 && type === 'I') ||
    ((dataProp.month() + 1) === 12 && dataProp.date() === 1)) {
      diffMes += 1;
    }

    const valorProp = (valorContrib / 12) * diffMes
    return Math.round(valorProp * 100) / 100;
  }



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
    printContents += document.getElementById('box-dados-segurado').innerHTML;
    printContents += document.getElementById('box-dados-calculo').innerHTML;
    printContents += document.getElementById('box-dados-planejamento').innerHTML;
    printContents += document.getElementById('box-dados-resultados').innerHTML;
    printContents += document.getElementById('texto-inicial').innerHTML;

    const css = `
    <style>
          body{-webkit-print-color-adjust: exact;
            font-family: Arial, Helvetica, sans-serif;}
          h1, h2{font-size:0.8rem; margin: 6px !important;}
          h3{margin: 5px !important;}
          i.fa, .not-print{ display: none; }
          table{margin-top: 25px; !important}
          thead{background-color: #f1f1f1;}
          footer,div,p,td,th{font-size:10px !important;}
          .list-inline{ display:inline; }
          .table>tbody>tr>td, .table>tbody>tr>th,
           .table>tfoot>tr>td, .table>tfoot>tr>th,
           .table>thead>tr>td, .table>thead>tr>th {padding: 3.5px 10px;}
           footer{text-align: center; margin-top: 50px;}
           .list-inline-print{ display:inline !important;}
           #texto-inicial-text{
            font-size: 12px !important;
            line-height: 1.2 !important;}
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
