import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

import { ExpectativaVidaService } from 'app/+rgps/+rgps-resultados/ExpectativaVida.service';
import { ExpectativaVida } from 'app/+rgps/+rgps-resultados/ExpectativaVida.model';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-pedagio50',
  templateUrl: './transicao-resultados-pedagio50.component.html',
  styleUrls: ['./transicao-resultados-pedagio50.component.css']
})
export class TransicaoResultadosPedagio50Component extends TransicaoResultadosComponent implements OnInit, OnChanges {

  @Input() seguradoTransicao;
  public isUpdating;

  // public requisitoPedagio50Regra3 = { m: 33, md: 12045, f: 28, fd: 10220 };
  // public tempoDeContribuicao50Regra3 = { m: 35, md: 12775, f: 30, fd: 10950 };

  public requisitoPedagio50Regra3 = { m: 33, md: 12053.25, f: 28, fd: 10227 };
  public tempoDeContribuicao50Regra3 = { m: 35, md: 12783.75, f: 30, fd: 10957.5 };


  public conclusoesRegra3 = {
    status: false,
    percentual: '',
    formula: '',
    requisitoDib: '',
    idadeDib: '',
    idadeDibMoment: '',
    tempoDib: '',
    dataDib: '',
    formulaFator: '',
    fatorNaDib: '',
  };



  constructor(
    private ExpectativaVida: ExpectativaVidaService
  ) {
    super(null);
  }

  ngOnInit() {

    // this.calcularConclusaoRegra3pedagio50();

  }

  ngOnChanges() {
    this.calcularConclusaoRegra3pedagio50();
  }


  public calcularConclusaoRegra3pedagio50() {
    this.isUpdating = true;

    this.conclusaoRegra3pedagio50();

    // this.ExpectativaVida.getByIdade(Math.floor(this.seguradoTransicao.idadeFracionada))
    //   .then(expectativas => {
    //     this.expectativasVida = expectativas;
    //     this.conclusaoRegra3pedagio50();

    //   });
  }

  /**
     * A projeção é baseada no dia atual e no tempo de contribuição após a EC103/2019
     */
  conclusaoRegra3pedagio50() {

    try {


      console.log(this.seguradoTransicao);

      if (this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103 >= this.requisitoPedagio50Regra3[this.seguradoTransicao.sexo]) {

        const rstRegra3pedagio50 = this.calcularRegra3();

        rstRegra3pedagio50.tempoContribuicaoDib = {
          days: parseInt(this.seguradoTransicao.contribuicaoDias, 10),
          fullDays: this.seguradoTransicao.contribuicaoFracionadoDias,
          months: parseInt(this.seguradoTransicao.contribuicaoMeses, 10),
          years: parseInt(this.seguradoTransicao.contribuicaoAnos, 10),
        }

        this.conclusoesRegra3 = {
          status: true,
          percentual: rstRegra3pedagio50.percentual,
          formula: `${rstRegra3pedagio50.formula} = ${rstRegra3pedagio50.percentual}%`,
          requisitoDib: rstRegra3pedagio50.requisitos,
          idadeDib: `${this.formateObjToStringAnosMesesDias(rstRegra3pedagio50.idadeDib)}`,
          idadeDibMoment: this.formateStringAnosMesesDias(
            rstRegra3pedagio50.idadeDibMoment.years(),
            rstRegra3pedagio50.idadeDibMoment.months(),
            rstRegra3pedagio50.idadeDibMoment.days()
          ),
          tempoDib: `${this.formateObjToStringAnosMesesDias(rstRegra3pedagio50.tempoContribuicaoDib)}`,
          dataDib: rstRegra3pedagio50.dataDib.format('DD/MM/YYYY'),
          formulaFator: rstRegra3pedagio50.formulaFator,
          fatorNaDib: rstRegra3pedagio50.fatorNaDib,
        };

       

      } else {

        this.conclusoesRegra3 = {
          status: false,
          percentual: '',
          formula: '',
          requisitoDib: this.requisitoPedagio50Regra3[this.seguradoTransicao.sexo],
          idadeDib: '',
          idadeDibMoment: '',
          tempoDib: '',
          dataDib: '',
          formulaFator: '',
          fatorNaDib: '',
        };

      }

      // console.log(' -- Regra 3 ---');
      // console.log(this.conclusoesRegra3);

      // fim do processo
      this.isUpdating = false;

    } catch (error) {
      console.log(error);
    }

  }


  public calcularRegra3() {


    const contribuicao_minRequisito = this.requisitoPedagio50Regra3[this.seguradoTransicao.sexo + 'd'];
    const contribuicao_min = this.tempoDeContribuicao50Regra3[this.seguradoTransicao.sexo + 'd'];
    const contribuicao_min_anos = this.tempoDeContribuicao50Regra3[this.seguradoTransicao.sexo];

    let rstRegraPedagio50: any;
    let dataDib = (this.dataAtual.clone()).startOf('day'); // .subtract(1, 'd')
    let idadeDib = this.seguradoTransicao.idadeFracionadaDias;
    let idadeDibMoment;

    // console.log(dataDib);

    const tempoFinalContribAnos = this.seguradoTransicao.contribuicaoFracionadoAnos;
    const tempoFinalContrib = this.seguradoTransicao.contribuicaoFracionadoDias;
    // const tempoFinalContrib = this.seguradoTransicao.contribuicaoFracionadoDiasAteEC103;

    const tempoFinalContribAteEC103 = this.seguradoTransicao.contribuicaoFracionadoDiasAteEC103;
    const tempoFinalContribAteEC103Anos = this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103;
    const contribuicaoDiffAteEC103EAtual = tempoFinalContrib - tempoFinalContribAteEC103;


    let contribuicaoDiff = 0;
    let tempoDePedagio = 0;
    let tempoDePedagioAnos = 0;
    let tempoDePedagioTotal = 0;
    let tempoFinalContribfinalComPedagio = 0;
    let tempoFinalContribfinalComPedagioAnos = 0;
    let tempoDePedagioTotalNecessario = 0;
    let tempoDePedagioTotalNecessarioAnos = 0;


    if (tempoFinalContribAteEC103 <= contribuicao_min) {


      if ((contribuicao_min > tempoFinalContrib)) {
        contribuicaoDiff = contribuicao_min - tempoFinalContrib;
      }

      if ((contribuicao_min > tempoFinalContribAteEC103)) {
        tempoDePedagio = ((contribuicao_min - tempoFinalContribAteEC103) * 0.5);
      }


      if ((contribuicao_min_anos > tempoFinalContribAteEC103Anos)) {
        tempoDePedagioAnos = ((contribuicao_min_anos - tempoFinalContribAteEC103Anos) * 0.5);
      }


      tempoFinalContribfinalComPedagio = contribuicao_min + tempoDePedagio;
      tempoFinalContribfinalComPedagioAnos = contribuicao_min_anos + tempoDePedagioAnos;

      ///  tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;

      tempoDePedagioTotalNecessario = Math.floor(tempoFinalContribfinalComPedagio - tempoFinalContrib);
      tempoDePedagioTotalNecessarioAnos = (tempoFinalContribfinalComPedagioAnos - tempoFinalContribAnos);

      // console.log(contribuicaoDiff);
      // console.log(contribuicao_min);
      // console.log(tempoFinalContrib);
      // console.log(tempoFinalContribAteEC103);
      // console.log(tempoDePedagio);
      // console.log(tempoDePedagioAnos);
      // console.log(tempoFinalContribfinalComPedagio);
      // console.log(tempoFinalContribfinalComPedagioAnos);
      // console.log(tempoDePedagioTotalNecessario);
      // console.log(tempoDePedagioTotalNecessarioAnos);
      // console.log(Math.floor(tempoDePedagioTotalNecessarioAnos * 365.25));
      // console.log(contribuicao_min_anos);
      // console.log(tempoFinalContribAnos);
      // dataDib.add(tempoDePedagioTotalNecessario, 'd');

      if (tempoDePedagioTotalNecessarioAnos > 0) {

        idadeDib = (idadeDib + tempoDePedagioTotalNecessario);
        dataDib.add(Math.floor(tempoDePedagioTotalNecessarioAnos * 365.25), 'd');

      } else {

        tempoFinalContribfinalComPedagio = this.seguradoTransicao.contribuicaoFracionadoDias;
        dataDib = moment(moment(), 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0);

      }





      // const correcaoAnoBissexto = this.contarBissextosEntre(
      //   this.dataAtual,
      //   dataDib
      // );

      // if (correcaoAnoBissexto > 0) {
      //   dataDib.add(correcaoAnoBissexto, 'days');
      // }

    } else {

      tempoFinalContribfinalComPedagio = this.seguradoTransicao.contribuicaoFracionadoDias;
      dataDib = moment(moment(), 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0);

    }


    idadeDibMoment = this.calcularIdade(dataDib);

    // console.log(tempoDePedagioTotalNecessario);


    // console.log('---- Regra 3 -----');
    // console.log(tempoDePedagioTotalNecessario);
    // console.log(tempoFinalContribfinalComPedagio);

    // console.log(idadeDibMoment);
    // console.log(idadeDib);
    // console.log(tempoFinalContrib);
    // console.log(contribuicao_min);
    // console.log(tempoFinalContribAteEC103);
    // console.log((tempoFinalContribAteEC103 <= contribuicao_min));
    // console.log(contribuicaoDiffAteEC103EAtual);
    // console.log(tempoDePedagioTotalNecessario);
    // console.log(contribuicaoDiff);
    // console.log(tempoDePedagio);
    // console.log(tempoFinalContribfinalComPedagio);
    // console.log('----');
    // console.log(contribuicaoDiff);
    // console.log(this.converterTempoDias(contribuicaoDiff));
    // console.log(tempoDePedagio);
    // console.log(this.converterTempoDias(tempoDePedagio));
    // console.log(tempoFinalContribfinalComPedagio);
    // console.log(this.converterTempoDias(tempoFinalContribfinalComPedagio));


    const fatorDib = this.getFatorPrevidenciario(
      dataDib,
      this.converterTempoDiasParaAnosFator(idadeDib),
      this.converterTempoDiasParaAnosFator(tempoFinalContribfinalComPedagio)
    );


    rstRegraPedagio50 = {
      dataDib: dataDib,
      idadeDibMoment: idadeDibMoment,
      idadeDib: this.converterTempoDias(idadeDib),
      tempoContribuicaoDib: this.converterTempoDias(tempoFinalContribfinalComPedagio),
      DiffDataAtualDib: 0,
      requisitos: contribuicao_min[this.seguradoTransicao.sexo],
      pedagio: this.converterTempoDias(tempoDePedagio),
      formulaFator: fatorDib.formula,
      fatorNaDib: fatorDib.fator,
    };


    return rstRegraPedagio50;

  }



  // public calcularRegra3() {

  //   const contribuicao_min = {
  //     m: 35,
  //     f: 30,
  //   };

  //   let rstRegraPedagio50: any;
  //   //const dataDib = this.dataAtual.clone();
  //   const dataDib = moment('01/06/2020');
  //   let idadeDib = this.seguradoTransicao.idadeFracionada;
  //   let contribuicaoDiff = 0;
  //   let tempoDePedagio = 0;
  //   let tempoFinalContrib = this.seguradoTransicao.contribuicaoFracionadoAnos;
  //   let tempoDePedagioTotal = 0;


  //   if (this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103 <= contribuicao_min[this.seguradoTransicao.sexo]) {

  //     contribuicaoDiff = (contribuicao_min[this.seguradoTransicao.sexo] - this.seguradoTransicao.contribuicaoFracionadoAnos);
  //     tempoDePedagio = ((contribuicao_min[this.seguradoTransicao.sexo] - this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103) * 0.5);
  //     tempoFinalContrib = contribuicao_min[this.seguradoTransicao.sexo] + tempoDePedagio;

  //     let teste = tempoFinalContrib - this.seguradoTransicao.contribuicaoFracionadoAnos;

  //     console.log(teste);
  //   console.log(this.converterTempoAnos(teste));




  //     tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;
  //     idadeDib = idadeDib + tempoDePedagioTotal
  //     dataDib.add(teste, 'years');
  //   }


  //   console.log(contribuicaoDiff);
  //   console.log(this.converterTempoAnos(contribuicaoDiff));
  //   console.log(tempoDePedagio);
  //   console.log(this.converterTempoAnos(tempoDePedagio));
  //   console.log(tempoFinalContrib);
  //   console.log(this.converterTempoAnos(tempoFinalContrib));


  //   const fatorDib = this.getFatorPrevidenciario(dataDib,
  //     idadeDib,
  //     tempoFinalContrib)


  //   rstRegraPedagio50 = {
  //     dataDib: dataDib,
  //     idadeDib: this.converterTempoAnos(idadeDib),
  //     tempoContribuicaoDib: this.converterTempoAnos(tempoFinalContrib),
  //     DiffDataAtualDib: 0,
  //     requisitos: contribuicao_min[this.seguradoTransicao.sexo],
  //     pedagio: this.converterTempoAnos(tempoDePedagio),
  //     formulaFator: fatorDib.formula,
  //     fatorNaDib: fatorDib.fator,
  //   };

  //   return rstRegraPedagio50;

  // }



  public requisitosRegra3(ano, sexo, tempo_contribuicao) {

    const requisitoContribuicoesDias = {
      fd: 10950,
      md: 12775
    };

    const regra3 = this.requisitoPedagio50Regra3[sexo];


    return ((tempo_contribuicao >= regra3)) ?
      { status: true, ano: ano, tempo_contribuicao: tempo_contribuicao, requisitosTempo: regra3 } :
      { status: false, ano: 0, tempo_contribuicao: 0, requisitosTempo: regra3 };


  }


  public procurarExpectativa(idadeFracionada, ano, dataInicio, dataFim) {
    const dataNascimento = moment(this.seguradoTransicao.dataNascimento, 'DD/MM/YYYY');
    const dataAgora = moment();
    let expectativaVida;
    if (idadeFracionada > 80) {
      idadeFracionada = 80;
    }

    if (ano != null) {
      expectativaVida = this.ExpectativaVida.getByAno(ano);
      // console.log(ano);
      // console.log(expectativaVida);

      // Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e year == ano
    } else {
      expectativaVida = this.ExpectativaVida.getByProperties(dataInicio, dataFim);
    }
    return expectativaVida;
  }

  public projetarExpectativa(idadeFracionada, dib) {

    let expectativa = 0;
    const dataInicio = moment('2000-11-30');
    let dataFim = moment('2019-12-01');
    const dataHoje = moment();
    let formula_expectativa_sobrevida = '';

    if (moment().isAfter(moment('01/12/' + dataHoje.year(), 'DD/MM/YYYY'))) {
      dataFim = moment('01/12/' + dataHoje.year(), 'DD/MM/YYYY');
    } else {
      dataFim = moment('01/12/' + (dataHoje.year() - 1), 'DD/MM/YYYY');
    }

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

      // console.log(expectativa);

      formula_expectativa_sobrevida = `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - ${tempo1})) + ${tempo1}`;
      //conclusoes.push({string:'Fórmula Expectativa de Sobrevida:' ,value: `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - ${tempo1})) + ${tempo1}`});//formula_expectativa_sobrevida = "(anos * (((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1";

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

    return expectativa;
  }



  private getExpectativaSobrevida() {
    const dataHoje = moment().subtract(2, 'y');
    const objEspect = this.expectativasVida.find(expec => expec.ano == dataHoje.year());

    return (objEspect !== undefined) ? objEspect : { valor: 6, ano: dataHoje.year() };
  }

  public getFatorPrevidenciario(dataInicioBeneficio, idadeFracionada, tempoTotalContribuicao) {

    let fatorSeguranca = 1;
    let formula_fator = '';

    this.ExpectativaVida.getByIdade(Math.floor(idadeFracionada))
      .then(expectativas => {
        this.isUpdating = true;
        this.expectativasVida = expectativas;
        // this.expectativa = this.projetarExpectativa(idadeFracionada, dataInicioBeneficio);
        this.expectativa = this.getExpectativaSobrevida().valor;
        this.isUpdating = false;

        tempoTotalContribuicao += this.seguradoTransicao.redutorProfessor;
        tempoTotalContribuicao += (this.seguradoTransicao.sexo === 'f') ? 5 : 0;

        fatorSeguranca = ((tempoTotalContribuicao * this.aliquota) / this.expectativa) *
          (1 + (idadeFracionada + (tempoTotalContribuicao * this.aliquota)) / 100);

        fatorSeguranca = parseFloat(fatorSeguranca.toFixed(4));

        formula_fator = '((' + this.formatDecimal(tempoTotalContribuicao, 4) + ' * '
          + this.formatDecimal(this.aliquota, 2) + ') / ' + this.formatDecimal(this.expectativa, 2) + ') * (1 + ('
          + this.formatDecimal(idadeFracionada, 2) + ' + (' + this.formatDecimal(tempoTotalContribuicao, 4) + ' * '
          + this.formatDecimal(this.aliquota, 2) + ')) / ' + '100)';

        this.conclusoesRegra3.formulaFator = formula_fator;
        this.conclusoesRegra3.fatorNaDib = ' ' + fatorSeguranca;

      });

    return { fator: fatorSeguranca, formula: formula_fator };

  }



}
