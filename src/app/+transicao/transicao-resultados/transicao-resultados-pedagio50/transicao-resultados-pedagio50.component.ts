import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { ExpectativaVidaService } from 'app/+rgps/+rgps-resultados/ExpectativaVida.service';
import { ExpectativaVida } from 'app/+rgps/+rgps-resultados/ExpectativaVida.model';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-pedagio50',
  templateUrl: './transicao-resultados-pedagio50.component.html',
  styleUrls: ['./transicao-resultados-pedagio50.component.css']
})
export class TransicaoResultadosPedagio50Component extends TransicaoResultadosComponent implements OnInit {

  @Input() seguradoTransicao;
  public isUpdating;

  public requisitoPedagio50Regra3 = { m: 33, md: 12045, f: 28, fd: 10220 };


  public conclusoesRegra3 = {
    status: false,
    percentual: '',
    formula: '',
    requisitoDib: '',
    idadeDib: '',
    tempoDib: '',
    dataDib: '',
    formulaFator: '',
    fatorNaDib: '',
  };


  public diffEC1032019Anos = 0;
  public diffEC1032019Dias = 0;
  public contribuicaoFracionadoAnosAteEC103 = 0;
  public contribuicaoFracionadoDiasAteEC103 = 0;


  constructor(private ExpectativaVida: ExpectativaVidaService) {
    super();
  }

  ngOnInit() {
    this.isUpdating = true;

    this.ExpectativaVida.getByIdade(Math.floor(this.seguradoTransicao.idadeFracionada))
      .then(expectativas => {
        this.expectativasVida = expectativas;
        this.conclusaoRegra3pedagio50();

      });
    
    

  }


  conclusaoRegra3pedagio50() {

    try {


      this.verificarTempoContribuicaoAtesEc1032019(this.seguradoTransicao.contribuicaoFracionadoAnos,
        this.seguradoTransicao.contribuicaoFracionadoDias);



      if (this.contribuicaoFracionadoAnosAteEC103 >= this.requisitoPedagio50Regra3[this.seguradoTransicao.sexo]) {

        const rstRegra3pedagio50 = this.calcularRegra3();

        this.conclusoesRegra3 = {
          status: true,
          percentual: rstRegra3pedagio50.percentual,
          formula: `${rstRegra3pedagio50.formula} = ${rstRegra3pedagio50.percentual}%`,
          requisitoDib: rstRegra3pedagio50.requisitos,
          idadeDib: `${this.formateObjToStringAnosMesesDias(rstRegra3pedagio50.idadeDib)}`,
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
          tempoDib: '',
          dataDib: '',
          formulaFator: '',
          fatorNaDib: '',
        };

      }


      console.log(' -- Regra 3 ---');
      console.log(this.seguradoTransicao);
      console.log(this.conclusoesRegra3);

      // fim do processo
      this.isUpdating = false;

    } catch (error) {
      console.log(error);
    }


  }


  public verificarTempoContribuicaoAtesEc1032019(contribuicaoFracionadoAnos, contribuicaoFracionadoDias) {

    this.diffEC1032019Anos = this.dataAtual.diff(this.dataEC1032019, 'years', true);
    this.diffEC1032019Dias = this.dataAtual.diff(this.dataEC1032019, 'days');

    this.contribuicaoFracionadoAnosAteEC103 = contribuicaoFracionadoAnos - this.diffEC1032019Anos;
    this.contribuicaoFracionadoDiasAteEC103 = contribuicaoFracionadoDias - this.diffEC1032019Dias;

  }


  public calcularRegra3() {

    const contribuicao_min = {
      m: 35,
      f: 30,
    };

    let rstRegraPedagio50: any;
    let dataDib = this.dataAtual;
    let idadeDib = this.seguradoTransicao.idadeFracionada;
    let contribuicaoDiff = 0;
    let tempoDePedagio = 0;
    let tempoFinalContrib = 0;
    

    if (this.contribuicaoFracionadoAnosAteEC103 <= contribuicao_min[this.seguradoTransicao.sexo]) {

      contribuicaoDiff = (contribuicao_min[this.seguradoTransicao.sexo] - this.seguradoTransicao.contribuicaoFracionadoAnos);
      tempoDePedagio = ((contribuicao_min[this.seguradoTransicao.sexo] - this.contribuicaoFracionadoAnosAteEC103) * 0.5);
      tempoFinalContrib = contribuicao_min[this.seguradoTransicao.sexo] + tempoDePedagio;
      idadeDib = idadeDib + tempoDePedagio
      dataDib.add(tempoDePedagio, 'years');
    }


    console.log(contribuicaoDiff);
    console.log(this.converterTempoAnos(contribuicaoDiff));
    console.log(tempoDePedagio);
    console.log(this.converterTempoAnos(tempoDePedagio));
    console.log(tempoFinalContrib);
    console.log(this.converterTempoAnos(tempoFinalContrib));

    const fatorDib =  this.getFatorPrevidenciario(dataDib, 
                                              idadeDib,
                                              tempoFinalContrib)


     console.log(fatorDib);

    rstRegraPedagio50 = {
      dataDib: dataDib,
      idadeDib: this.converterTempoAnos(idadeDib),
      tempoContribuicaoDib: this.converterTempoAnos(tempoFinalContrib),
      DiffDataAtualDib: 0,
      requisitos: contribuicao_min[this.seguradoTransicao.sexo],
      pedagio: this.converterTempoAnos(tempoDePedagio),
      formulaFator: fatorDib.formula,
      fatorNaDib: fatorDib.fator,
    };

    return rstRegraPedagio50;

  }



  public contadorRegra3() {


    let auxiliarDate = this.dataAtual;
    let fimContador = { status: false, ano: 0, tempo_contribuicao: 0, requisitosTempo: 0 };
    let count = 1;
    let auxiliarDateClone;
    let idade = this.seguradoTransicao.idadeFracionadaDias;
    let tempoContribuicao = this.seguradoTransicao.contribuicaoFracionadoDias;
    const sexo = this.seguradoTransicao.sexo + 'd';

    // console.log(this.getRequisitosRegra1(
    //   pontos,
    //   auxiliarDate.year(),
    //   sexo,
    //   tempoContribuicao,
    //   this.seguradoTransicao.professor));


    // console.log(pontos);
    // console.log(auxiliarDate.year());
    // console.log(sexo);
    // console.log(tempoContribuicao);
    // console.log(this.seguradoTransicao.professor);

    do {


      fimContador = this.requisitosRegra3(
        auxiliarDate.year(),
        sexo,
        tempoContribuicao);


      // console.log('P - data - ' + auxiliarDate.format('DD/MM/YYYY')
      //   + '|' + 'idade -' + idade + '|'
      //   + '|' + 'Tempo - ' + tempoContribuicao + '|');

      if (fimContador.status) {

        // console.log(auxiliarDate);
        // console.log(idade);
        // console.log(tempoContribuicao);
        // console.log(pontos);
        // console.log(count);



        // console.log('F - data - ' + auxiliarDate.format('DD/MM/YYYY')
        //   + '|' + 'idade -' + idade + '|'
        //   + '|' + 'Tempo - ' + tempoContribuicao + '|'
        //   + '|');


      }

      count++;
      idade += 1;
      tempoContribuicao += 1;

      auxiliarDateClone = auxiliarDate.clone();
      auxiliarDate = moment(this.toDateString(auxiliarDateClone.add(1, 'days')), 'DD/MM/YYYY');


    } while (!fimContador.status && idade <= 54750);



    return {
      dataDib: auxiliarDate,
      idadeMoment: moment.duration(idade, 'days'),
      tempoContribuicaoDibMoment: moment.duration(tempoContribuicao, 'days'),
      idadeDib: this.converterTempoDias(idade),
      tempoContribuicaoDib: this.converterTempoDias(tempoContribuicao),
      DiffDataAtualDibMoment: moment.duration(count, 'days'),
      DiffDataAtualDib: this.converterTempoDias(count),
      requisitos: fimContador,
      formula: '',
      percentual: 0,
    };



  }




  public requisitosRegra3(ano, sexo, tempo_contribuicao) {

    const requisitoContribuicoesDias = {
      fd: 10950,
      md: 12775
    };

    const regra2 = this.requisitoPedagio50Regra3[sexo];


    return ((tempo_contribuicao >= regra2)) ?
      { status: true, ano: ano, tempo_contribuicao: tempo_contribuicao, requisitosTempo: regra2 } :
      { status: false, ano: 0, tempo_contribuicao: 0, requisitosTempo: regra2 };


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
      // Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e year == ano
    } else {
      expectativaVida = this.ExpectativaVida.getByProperties(dataInicio, dataFim);
    }
    return expectativaVida;
  }

  public projetarExpectativa(idadeFracionada, dib) {

    let expectativa = 0;
    const dataInicio = moment('2000-11-30');
    const dataFim = moment('2017-12-01');
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



  public getFatorPrevidenciario(dataInicioBeneficio, idadeFracionada, tempoTotalContribuicao) {

    let fatorSeguranca = 1;
    let formula_fator = '';

    this.expectativa = this.projetarExpectativa(idadeFracionada, dataInicioBeneficio);


    fatorSeguranca = ((tempoTotalContribuicao * this.aliquota) / this.expectativa) *
                     (1 + (idadeFracionada + (tempoTotalContribuicao * this.aliquota)) / 100);

    fatorSeguranca = parseFloat(fatorSeguranca.toFixed(4));


    formula_fator = '((' + this.formatDecimal(tempoTotalContribuicao, 4) + ' * '
     + this.formatDecimal(this.aliquota, 2) + ') / ' + this.formatDecimal(this.expectativa, 2) + ') * (1 + ('
      + this.formatDecimal(idadeFracionada, 2) + ' + (' + this.formatDecimal(tempoTotalContribuicao, 4) + ' * '
       + this.formatDecimal(this.aliquota, 2) + ')) / ' + '100)';

    return {fator: fatorSeguranca, formula: formula_fator};

  }



}
