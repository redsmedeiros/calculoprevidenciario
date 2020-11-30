import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../../+rgps-segurados/SeguradoRgps.model';
import { ExpectativaVida } from '../+rgps-resultados/ExpectativaVida.model';
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
  private expectativaVida;
  private dataNascimentoSeguradoM;
  private idadeNaDiBPlanejamento;

  private idadeUltimaDib;


  private definicaoMoeda = DefinicaoMoeda;


  constructor
    (
      protected SeguradoService: SeguradoService,
      protected CalculoRgps: CalculoRgpsService,
      protected planejamentoService: RgpsPlanejamentoService,
      private ExpectativaVida: ExpectativaVidaService,
      protected router: Router,
      private Moeda: MoedaService,
      protected route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.calculoInit();
  }

  private calculoInit() {


    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.idCalculo = this.route.snapshot.params['id_calculo'];
    this.idPlanejamento = this.route.snapshot.params['id_planejamento'];

    const seguradoP = this.SeguradoService.find(this.idSegurado)
      .then((segurado: SeguradoModel) => {

        this.segurado = segurado;
        this.dataNascimentoSeguradoM = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
        this.sexoSegurado = this.segurado.sexo;
        this.isSegurado = true;

      }).catch(errors => console.log(errors));

    const calculoP = this.CalculoRgps.find(this.idCalculo)
      .then((calculo: CalculoModel) => {

        this.calculo = calculo;
        this.isCalculo = true;

      }).catch(errors => console.log(errors));


    const planejamentoP = this.planejamentoService.find(this.idPlanejamento)
      .then((planejamento: PlanejamentoRgps) => {

        console.log(planejamento);
        this.planejamento = planejamento;
        this.idadeNaDiBPlanejamento = Math.abs(
          this.dataNascimentoSeguradoM.diff(
            moment(this.planejamento.data_futura),
            'years'));

        this.planejamento.dataDibFutura = moment(this.planejamento.data_futura).format('DD/MM/YYYY');
        this.isPlanejamento = true;

      }).catch(errors => console.log(errors));

    const MoedaP = this.Moeda.getByDateRange(moment().subtract(1, 'months'), moment())
      .then((moeda: Moeda[]) => {

        this.moeda = moeda;

      });

    const expectativaVidaP = this.ExpectativaVida.getByIdade(this.idadeNaDiBPlanejamento)
      .then(expvida => {

        this.expectativaVida = expvida;

      });

    Promise.all([seguradoP, calculoP, planejamentoP, expectativaVidaP]).then((values) => {

      // const dataInicioBeneficio
      // const dataInicioBeneficioPlan


      console.log(this.segurado)
      console.log(this.calculo)
      console.log(this.planejamento)
      //console.log(this.expectativaVida)

      this.calcularPlanejamento();
      this.isUpdatingRst = false;

    });


  }

  private getAliquota() {

    if (this.planejamento.aliquota !== 99) {
      return Number(this.planejamento.aliquota) / 100;
    }

    if (
      this.planejamento.aliquota === 99
    ) {
      return this.calcularAliquotaCumulativa();
    }
  }



  private calcularPlanejamento() {

    const calculo1 = this.calculo;
    const calculo2 = this.planejamento;

    const dataInicioBeneficio1 = moment(calculo1.data_pedido_beneficio, 'DD/MM/YYYY');
    const dataInicioBeneficio2 = moment(calculo2.dataDibFutura, 'DD/MM/YYYY');
    const valor = this.Moeda.getByDate(moment());
    const salMinimo = valor.salario_minimo * 0.05;
    const aliquota = this.getAliquota();

    let investimentoEntreDatas = Math.abs(calculo1.soma_contribuicao - calculo2.nova_soma_contribuicoes);


    // Não sei o motivo deste item
    // investimentoEntreDatas += this.contribEmAtraso;// contribuicao em atraso no forms na pŕópria página


    let totalEntreDatas = 0;
    let tempoMinimo1 = 0;
    let tempoMinimo2 = 0;


    investimentoEntreDatas *= aliquota;

    const mesesEntreDatas = this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2);

    let totalPerdidoEntreData = mesesEntreDatas * calculo1.valor_beneficio;
    let diferencaRmi = Math.abs(calculo2.novo_rmi - calculo1.valor_beneficio);

    if (diferencaRmi != 0) {
      tempoMinimo1 = ((investimentoEntreDatas + totalPerdidoEntreData) / diferencaRmi) / 13;
      tempoMinimo2 = (totalPerdidoEntreData / diferencaRmi) / 13;
    }


    let tempoMinimo1Meses = Math.floor((tempoMinimo1 - Math.floor(tempoMinimo1)) * 12);

    let idadeSegurado = Math.abs(this.dataNascimentoSeguradoM.diff(moment(), 'years'));

    let idadeSeguradoDIB = Math.abs(this.dataNascimentoSeguradoM.diff(dataInicioBeneficio2, 'years'));

    let expectativaDIB = this.projetarExpectativa(idadeSeguradoDIB, dataInicioBeneficio2);

    let expectativaSegurado = expectativaDIB.expectativa + idadeSeguradoDIB;


    let expectativaTotalMeses = Math.floor((expectativaSegurado - (idadeSeguradoDIB + tempoMinimo1)) * 13);
    if (expectativaTotalMeses < 0) {
      expectativaTotalMeses = 0;
    }
    expectativaTotalMeses *= diferencaRmi;

    let currency = this.definicaoMoeda.loadCurrency(dataInicioBeneficio2);

    this.idadeUltimaDib = idadeSeguradoDIB;


    let expectativaTotalMeses2 = Math.floor((expectativaSegurado - (idadeSeguradoDIB + tempoMinimo2)) * 13);

    if (expectativaTotalMeses2 < 0) {
      expectativaTotalMeses2 = 0;
    }

    expectativaTotalMeses2 *= diferencaRmi;

    let tempoMinimo2Meses = Math.floor((tempoMinimo2 - Math.floor(tempoMinimo2)) * 12);



    // this.resultadosGeral.push({string: 'Espécie:',  value:calculo1.tipo_seguro });

    this.resultadosGeral.push({
      label: 'Data inicial do Benefício:',
      value1: calculo1.data_pedido_beneficio,
      value2: calculo2.dataDibFutura
    });

    this.resultadosGeral.push({
      label: 'Benefício:',
      value1: this.definicaoMoeda.formatMoney(calculo1.valor_beneficio, currency.acronimo),
      value2: this.definicaoMoeda.formatMoney(calculo2.novo_rmi, currency.acronimo),
    });

    this.resultadosGeral.push({
      label: 'Total investido em contribuições ao INSS entre as duas datas:',
      value1: this.definicaoMoeda.formatMoney(investimentoEntreDatas, currency.acronimo),
      value2: '',
    });

    this.resultadosGeral.push({
      label: 'Total que deixou de receber caso tivesse se aposentado na primeira data: ',
      value1: this.definicaoMoeda.formatMoney(totalPerdidoEntreData, currency.acronimo),
      value2: this.definicaoMoeda.formatMoney(totalPerdidoEntreData, currency.acronimo),
    });

    this.resultadosGeral.push({
      label: 'Total perdido: ',
      value1: this.definicaoMoeda.formatMoney((investimentoEntreDatas + totalPerdidoEntreData), currency.acronimo),
      value2: this.definicaoMoeda.formatMoney(totalPerdidoEntreData, currency.acronimo),
    });

    this.resultadosGeral.push({
      label: 'Diferença entre os dois benefícios: ',
      value1: this.definicaoMoeda.formatMoney(diferencaRmi, currency.acronimo),
      value2: this.definicaoMoeda.formatMoney(diferencaRmi, currency.acronimo),
    });

    this.resultadosGeral.push({
      label: 'Tempo mínimo necessário para recuperar as perdas:  ',
      value1: Math.floor(tempoMinimo1) + ' ano(s) e ' + tempoMinimo1Meses + ' mes(es)',
      value2: Math.floor(tempoMinimo2) + ' ano(s) ' + tempoMinimo2Meses + ' mes(es)',
    });

    this.resultadosGeral.push({
      label: 'Idade do segurado quando recuperar as perdas: ',
      value1: Math.floor(idadeSeguradoDIB + tempoMinimo1) + ' ano(s) ' + tempoMinimo1Meses + ' mes(es)',
      value2: Math.floor(idadeSeguradoDIB + Math.floor(tempoMinimo2)) + ' ano(s) ' + tempoMinimo2Meses + ' mes(es)',
    });

    this.resultadosGeral.push({
      label: 'Idade do segurado de acordo com a expectativa de sobrevida (IBGE): ',
      value1: Math.floor(expectativaSegurado) + ' anos ' + Math.floor((expectativaSegurado - Math.floor(expectativaSegurado)) * 12) + ' mes(es)',
      value2: Math.floor(expectativaSegurado) + ' ano(s) ' + Math.floor((expectativaSegurado - Math.floor(expectativaSegurado)) * 12) + ' mes(es)',
    });

    this.resultadosGeral.push({
      label: 'Total de ganhos até atingir a idade esperada (incluindo 13º salário): ',
      value1: this.definicaoMoeda.formatMoney(expectativaTotalMeses, currency.acronimo),
      value2: this.definicaoMoeda.formatMoney(expectativaTotalMeses, currency.acronimo),
    });





    console.log(totalPerdidoEntreData);
    console.log(diferencaRmi);
    console.log(investimentoEntreDatas);
    console.log(mesesEntreDatas);
    console.log(this.resultadosGeral);


    this.isResultado = true;
  }


  private calcularAliquotaCumulativa() {

    return 0.075;
  }




  private getDifferenceInMonths(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.floor(difference);
  }

  private procurarExpectativa(idadeFracionada, ano, dataInicio, dataFim) {
    // let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    // let dataAgora = moment();
    let expectativaVida;
    if (idadeFracionada > 80) {
      idadeFracionada = 80;
    }

    if (ano != null) {
      expectativaVida = this.ExpectativaVida.getByAno(ano);
      //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e year == ano
    } else {
      expectativaVida = this.ExpectativaVida.getByProperties(dataInicio, dataFim);
    }
    return expectativaVida;
  }

  private projetarExpectativa(idadeFracionada, dib) {

    let expectativa = 0;
    const dataInicio = moment('2000-11-30');
    const dataFim = moment((moment().year() - 1) + '-12-01');
    const dataHoje = moment();
    let formula_expectativa_sobrevida = '';

    if (dib > dataHoje) {
      let anos = Math.abs(dataHoje.diff(dib, 'years', true));

      if (anos < 1) {
        anos = Math.round(anos);
      } else {
        anos = Math.trunc(anos);
      }

      const tempo1 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-2, 'years')).year(), null, null);
      const tempo2 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-3, 'years')).year(), null, null);
      const tempo3 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-4, 'years')).year(), null, null);

      expectativa = (anos * Math.abs(((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1;

      formula_expectativa_sobrevida = `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - ${tempo1})) + ${tempo1}`;

    } else if (dib.isSameOrBefore(dataInicio)) {
      expectativa = this.procurarExpectativa(idadeFracionada, null, null, dataInicio);
    } else if (dib.isSameOrAfter(dataFim)) {
      expectativa = this.procurarExpectativa(idadeFracionada, null, dib, null);
    } else {
      expectativa = this.procurarExpectativa(idadeFracionada, null, dib, dib);
    }

    if (expectativa <= 0) {
      expectativa = 6;
    }

    return {
      expectativa: expectativa,
      formula_expectativa_sobrevida: formula_expectativa_sobrevida
    };
  }


  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }


}
