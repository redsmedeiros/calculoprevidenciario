
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DefinicaoTempo } from 'app/shared/functions/definicao-tempo';
import * as moment from 'moment';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';


@Component({
  selector: 'app-transicao-resultados-pontos',
  templateUrl: './transicao-resultados-pontos.component.html',
  styleUrls: ['./transicao-resultados-pontos.component.css']
})
export class TransicaoResultadosPontosComponent extends TransicaoResultadosComponent implements OnInit, OnChanges {


  @Input() seguradoTransicao;


  public isUpdating;

  public tempoPercentual = {
    m: 20,
    f: 15
  };


  public requisitoPontosRegra360Prof = {
    2019: { m: 91, md: 32760, f: 81, fd: 29160 },
    2020: { m: 92, md: 33120, f: 82, fd: 29520 },
    2021: { m: 93, md: 33480, f: 83, fd: 29880 },
    2022: { m: 94, md: 33840, f: 84, fd: 30240 },
    2023: { m: 95, md: 34200, f: 85, fd: 30600 },
    2024: { m: 96, md: 34560, f: 86, fd: 30960 },
    2025: { m: 97, md: 34920, f: 87, fd: 31320 },
    2026: { m: 98, md: 35280, f: 88, fd: 31680 },
    2027: { m: 99, md: 35640, f: 89, fd: 32040 },
    2028: { m: 100, md: 36000, f: 90, fd: 32400 },
    2029: { m: 100, md: 36000, f: 91, fd: 32760 },
    2030: { m: 100, md: 36000, f: 92, fd: 33120 },
  };



  public requisitoPontosRegra360 = {
    2019: { m: 96, md: 34560, f: 86, fd: 30960 },
    2020: { m: 97, md: 34920, f: 87, fd: 31320 },
    2021: { m: 98, md: 35280, f: 88, fd: 31680 },
    2022: { m: 99, md: 35640, f: 89, fd: 32040 },
    2023: { m: 100, md: 36000, f: 90, fd: 32400 },
    2024: { m: 101, md: 36360, f: 91, fd: 32760 },
    2025: { m: 102, md: 36720, f: 92, fd: 33120 },
    2026: { m: 103, md: 37080, f: 93, fd: 33480 },
    2027: { m: 104, md: 37440, f: 94, fd: 33840 },
    2028: { m: 105, md: 37800, f: 95, fd: 34200 },
    2029: { m: 105, md: 37800, f: 96, fd: 34560 },
    2030: { m: 105, md: 37800, f: 97, fd: 34920 },
    2031: { m: 105, md: 37800, f: 98, fd: 35280 },
    2032: { m: 105, md: 37800, f: 99, fd: 35640 },
    2033: { m: 105, md: 37800, f: 100, fd: 36000 },
  };



  public requisitoPontosRegra360ProfList = [
    { ano: 2019, m: 91, md: 32760, f: 81, fd: 29160 },
    { ano: 2020, m: 92, md: 33120, f: 82, fd: 29520 },
    { ano: 2021, m: 93, md: 33480, f: 83, fd: 29880 },
    { ano: 2022, m: 94, md: 33840, f: 84, fd: 30240 },
    { ano: 2023, m: 95, md: 34200, f: 85, fd: 30600 },
    { ano: 2024, m: 96, md: 34560, f: 86, fd: 30960 },
    { ano: 2025, m: 97, md: 34920, f: 87, fd: 31320 },
    { ano: 2026, m: 98, md: 35280, f: 88, fd: 31680 },
    { ano: 2027, m: 99, md: 35640, f: 89, fd: 32040 },
    { ano: 2028, m: 100, md: 36000, f: 90, fd: 32400 },
    { ano: 2029, m: 100, md: 36000, f: 91, fd: 32760 },
    { ano: 2030, m: 100, md: 36000, f: 92, fd: 33120 },
  ];



  public requisitoPontosRegra360List = [
    { ano: 2019, m: 96, md: 34560, f: 86, fd: 30960 },
    { ano: 2020, m: 97, md: 34920, f: 87, fd: 31320 },
    { ano: 2021, m: 98, md: 35280, f: 88, fd: 31680 },
    { ano: 2022, m: 99, md: 35640, f: 89, fd: 32040 },
    { ano: 2023, m: 100, md: 36000, f: 90, fd: 32400 },
    { ano: 2024, m: 101, md: 36360, f: 91, fd: 32760 },
    { ano: 2025, m: 102, md: 36720, f: 92, fd: 33120 },
    { ano: 2026, m: 103, md: 37080, f: 93, fd: 33480 },
    { ano: 2027, m: 104, md: 37440, f: 94, fd: 33840 },
    { ano: 2028, m: 105, md: 37800, f: 95, fd: 34200 },
    { ano: 2029, m: 105, md: 37800, f: 96, fd: 34560 },
    { ano: 2030, m: 105, md: 37800, f: 97, fd: 34920 },
    { ano: 2031, m: 105, md: 37800, f: 98, fd: 35280 },
    { ano: 2032, m: 105, md: 37800, f: 99, fd: 35640 },
    { ano: 2033, m: 105, md: 37800, f: 100, fd: 36000 },
  ];




  public requisitoPontosRegra1Prof = {
    2019: { m: 91, md: 33237.75, f: 81, fd: 29585.25 },
    2020: { m: 92, md: 33603, f: 82, fd: 29950.5 },
    2021: { m: 93, md: 33968.25, f: 83, fd: 30315.75 },
    2022: { m: 94, md: 34333.5, f: 84, fd: 30681 },
    2023: { m: 95, md: 34698.75, f: 85, fd: 31046.25 },
    2024: { m: 96, md: 35064, f: 86, fd: 31411.5 },
    2025: { m: 97, md: 35429.25, f: 87, fd: 31776.75 },
    2026: { m: 98, md: 35794.5, f: 88, fd: 32142 },
    2027: { m: 99, md: 36159.75, f: 89, fd: 32507.25 },
    2028: { m: 100, md: 36525, f: 90, fd: 32872.5 },
    2029: { m: 100, md: 36525, f: 91, fd: 33237.75 },
    2030: { m: 100, md: 36525, f: 92, fd: 33603 },

  };


  public requisitoPontosRegra1 = {
    2019: { m: 96, md: 35064, f: 86, fd: 31411.5 },
    2020: { m: 97, md: 35429.25, f: 87, fd: 31776.75 },
    2021: { m: 98, md: 35794.5, f: 88, fd: 32142 },
    2022: { m: 99, md: 36159.75, f: 89, fd: 32507.25 },
    2023: { m: 100, md: 36525, f: 90, fd: 32872.5 },
    2024: { m: 101, md: 36890.25, f: 91, fd: 33237.75 },
    2025: { m: 102, md: 37255.5, f: 92, fd: 33603 },
    2026: { m: 103, md: 37620.75, f: 93, fd: 33968.25 },
    2027: { m: 104, md: 37986, f: 94, fd: 34333.5 },
    2028: { m: 105, md: 38351.25, f: 95, fd: 34698.75 },
    2029: { m: 105, md: 38351.25, f: 96, fd: 35064 },
    2030: { m: 105, md: 38351.25, f: 97, fd: 35429.25 },
    2031: { m: 105, md: 38351.25, f: 98, fd: 35794.5 },
    2032: { m: 105, md: 38351.25, f: 99, fd: 36159.75 },
    2033: { m: 105, md: 38351.25, f: 100, fd: 36525 },


  }


  public conclusoesRegra1 = {
    status: false,
    percentual: '',
    formula: '',
    requisitoDib: '',
    dataDib: '',
    idadeDib: '',
    tempoDib: '',
    idadeDibMoment: ''
  };


  constructor() {
    super(null);
  }

  ngOnInit() {

    // this.conclusaoRegra1Pontos();

  }


  ngOnChanges() {

    this.conclusaoRegra1Pontos();

  }

  /**
     * A proje????o ?? baseada no dia atual e no tempo de contribui????o ap??s a EC103/2019
     */
  public conclusaoRegra1Pontos() {
    this.isUpdating = true;


    try {

      const rstRegra1Pontos = this.calcularRegra1();

      this.conclusoesRegra1 = {
        status: true,
        percentual: rstRegra1Pontos.percentual,
        formula: `${rstRegra1Pontos.formula} = ${rstRegra1Pontos.percentual}%`,
        requisitoDib: rstRegra1Pontos.requisitos,
        idadeDib: `${this.formateObjToStringAnosMesesDias(rstRegra1Pontos.idadeDib)}`,
        tempoDib: `${this.formateObjToStringAnosMesesDias(rstRegra1Pontos.tempoContribuicaoDib)}`,
        dataDib: rstRegra1Pontos.dataDib.format('DD/MM/YYYY'),
        idadeDibMoment: this.formateStringAnosMesesDias(
          rstRegra1Pontos.idadeMoment.years(),
          rstRegra1Pontos.idadeMoment.months(),
          rstRegra1Pontos.idadeMoment.days()
        ),
      };

      //  console.log(' -- Regra 1 ---');
      //  console.log(this.seguradoTransicao);
      //  console.log(rstRegra1Pontos);
      //  console.log(this.conclusoesRegra1);

      this.isUpdating = false;

    } catch (error) {
      console.log(error);
    }



  }


  public calcularRegra1() {

    const contribuicao_min = {
      m: (35 - this.seguradoTransicao.redutorProfessor),
      f: (30 - this.seguradoTransicao.redutorProfessor)
    };

    const tempoPercentualR1 = {
      m: 20,
      f: 15
    };

    const regra_pontos_i = this.getRequisitoRegra1(this.dataAtual.year(), this.seguradoTransicao.sexo, this.seguradoTransicao.professor);
    const regra_pontos_f = (!this.seguradoTransicao.professor) ? { y: 2033, m: 105, f: 100 } : { y: 2030, m: 100, f: 92 };

    const pontosAtuais = this.seguradoTransicao.contribuicaoFracionadoAnos + this.seguradoTransicao.idadeFracionada;
    const pontosAtuaisDias = this.seguradoTransicao.contribuicaoFracionadoDias + this.seguradoTransicao.idadeFracionadaDias;

    let rstRegraPontos: any;

    let percentualR1 = 60;


    if (pontosAtuais >= regra_pontos_i &&
      this.seguradoTransicao.contribuicaoFracionadoAnos >= contribuicao_min[this.seguradoTransicao.sexo]) {


      rstRegraPontos = {
        dataDib: moment(moment(), 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0),
        idadeMoment: this.calcularIdade(this.dataAtual),
        idade: this.seguradoTransicao.idade,
        idadeDib: this.converterTempoDias(this.seguradoTransicao.idadeFracionadaDias),
        tempoContribuicaoDib: this.converterTempoDias(this.seguradoTransicao.contribuicaoFracionadoDias),
        DiffDataAtualDib: 0,
        pontosDib: pontosAtuais,
        requisitos: regra_pontos_i,
        formula: '',
        percentual: 0,
      };

    } else {

      rstRegraPontos = this.contadorRegra1(pontosAtuais, pontosAtuaisDias);

    }

    if (Math.trunc(rstRegraPontos.tempoContribuicaoDib.years) >= tempoPercentualR1[this.seguradoTransicao.sexo]) {
      percentualR1 += ((Math.trunc(rstRegraPontos.tempoContribuicaoDib.years) - tempoPercentualR1[this.seguradoTransicao.sexo]) * 2);
    }


    rstRegraPontos.percentual = percentualR1;

    rstRegraPontos.formula = `60 + ((${Math.trunc(rstRegraPontos.tempoContribuicaoDib.years)} -
                                      ${tempoPercentualR1[this.seguradoTransicao.sexo]}) * 2)`;


    return rstRegraPontos;

  }



  public getRequisitoRegra1(ano, sexo, professor) {

    return (!professor) ? this.requisitoPontosRegra1[ano][sexo] : this.requisitoPontosRegra1Prof[ano][sexo];

  }




  public contadorRegra1(pontosAtuais, pontosAtuaisDias) {

    //  console.log(this.dataAtual);

    // let auxiliarDate = this.dataAtual;
    let auxiliarDate = moment().clone().startOf('day');
    let idadeDibMoment;
    let fimContador = { status: false, ano: 0, pontos: 0 };
    let count = 1;
    let pontos = pontosAtuaisDias;
    let auxiliarDateClone;
    let idade = this.seguradoTransicao.idadeFracionadaDias;
    // let tempoContribuicao = this.seguradoTransicao.contribuicaoFracionadoDias;
    let tempoContribuicao = this.converterTempoContribuicao(this.seguradoTransicao.contribuicaoAnos,
      this.seguradoTransicao.contribuicaoMeses,
      this.seguradoTransicao.contribuicaoDias, 'd');
    const sexo = this.seguradoTransicao.sexo + 'd';

    // console.log(this.seguradoTransicao);
    // console.log(pontos);
    // console.log(tempoContribuicao);


    do {


      fimContador = this.getRequisitosRegra1(
        pontos,
        auxiliarDate.year(),
        sexo,
        tempoContribuicao,
        this.seguradoTransicao.professor);

      count++;
      idade += 1;
      tempoContribuicao += 1;

      pontos = idade + tempoContribuicao;
      auxiliarDateClone = auxiliarDate.clone();
      auxiliarDate = moment(this.toDateString(auxiliarDateClone.add(1, 'days')), 'DD/MM/YYYY');

      // console.log('P ' + count + '- data - '
      //   + auxiliarDate.format('DD/MM/YYYY')
      //   + '|' + 'idade -' + idade + '|'
      //   + '|' + 'Tempo - ' + tempoContribuicao + '|'
      //   + '|' + 'pontos - ' + pontos);

    } while (!fimContador.status && pontos <= 76650);


    tempoContribuicao = (count + this.seguradoTransicao.contribuicaoFracionadoDias);

    // const correcaoAnoBissexto = this.contarBissextosEntre(
    //   this.seguradoTransicao.dataNascimento,
    //   auxiliarDate
    // );

    // if (correcaoAnoBissexto > 0) {
    //   auxiliarDate.add(correcaoAnoBissexto, 'days');
    // }

    idadeDibMoment = this.calcularIdade(auxiliarDate);
    if (idadeDibMoment.days() === 30) {
      idadeDibMoment.add(1, 'day');
    }

    // console.log(idadeDibMoment.days())

    const dibCorigida = this.dataAtual.clone();
    // dibCorigida.add(1, 'day');
    dibCorigida.add(count, 'days');



    // console.log(fimContador);
    // console.log('-- fim --');
    // console.log(pontos);
    // console.log(count);
    // console.log(this.seguradoTransicao.contribuicaoFracionadoDias);
    // console.log(this.seguradoTransicao.idadeFracionadaDias);
    // console.log(this.seguradoTransicao.idadeFracionadaDias + this.seguradoTransicao.contribuicaoFracionadoDias);
    // console.log(this.seguradoTransicao.idadeFracionadaDias + this.seguradoTransicao.contribuicaoFracionadoDias + count);
    // console.log(pontos);


    return {
      // dataDib: auxiliarDate,
      dataDib: dibCorigida,
      idadeMoment: idadeDibMoment,
      tempoContribuicaoDibMoment: moment.duration(tempoContribuicao, 'days'),
      idadeDib: this.converterTempoDias(idade),
      tempoContribuicaoDib: this.converterTempoDias(tempoContribuicao),
      DiffDataAtualDibMoment: moment.duration(count, 'days'),
      DiffDataAtualDib: this.converterTempoDias(count),
      pontosDib: pontos,
      requisitos: fimContador,
      formula: '',
      percentual: 0,
    };


  }



  public getRequisitosRegra1(pontos, ano, sexo, tempo_contribuicao, professor) {


    if (professor) {

      return this.requisitosRegra1Prof(pontos, ano, sexo, tempo_contribuicao);

    }

    return this.requisitosRegra1(pontos, ano, sexo, tempo_contribuicao);

  }



  public requisitosRegra1(pontos, ano, sexo, tempo_contribuicao) {

    const requisitoContribuicoes = {
      f: 30,
      m: 35
    };

    // const requisitoContribuicoesDias = {
    //   fd: 10950,
    //   md: 12775
    // };

    const requisitoContribuicoesDias = {
      fd: 10957.5,
      md: 12783.75
    };

    const regra1 = this.requisitoPontosRegra1;

    if ((sexo === 'md' && ano > 2028 && pontos >= regra1['2028']['md'])
      && tempo_contribuicao >= requisitoContribuicoesDias[sexo]) {
      return { status: true, ano: ano, pontos: pontos, requisitosPosntos: regra1['2028']['md'] };
    }

    if ((sexo === 'fd' && ano > 2033 && pontos >= regra1['2033']['fd'])
      && tempo_contribuicao >= requisitoContribuicoesDias[sexo]) {
      return { status: true, ano: ano, pontos: pontos, requisitosPosntos: regra1['2033']['fd'] };
    }

    return (((ano >= 2019 && ano <= 2033) && pontos >= regra1[ano][sexo])
      && tempo_contribuicao >= requisitoContribuicoesDias[sexo]) ?
      { status: true, ano: ano, pontos: pontos, requisitosPosntos: regra1[ano][sexo] } :
      { status: false, ano: 0, pontos: 0, requisitosPosntos: 0 };

  }

  public requisitosRegra1Prof(pontos, ano, sexo, tempo_contribuicao) {

    const requisitoContribuicoes = {
      f: 25,
      m: 30
    };

    // const requisitoContribuicoesDias = {
    //   fd: 9125,
    //   md: 10950
    // };

    const requisitoContribuicoesDias = {
      fd: 9131.25,
      md: 10957.5
    };

    const regra1 = this.requisitoPontosRegra1Prof

    if ((sexo === 'md' && ano > 2028 && pontos >= regra1['2028']['md'])
      && tempo_contribuicao >= requisitoContribuicoesDias[sexo]) {
      return { status: true, ano: ano, pontos: pontos, requisitosPosntos: regra1['2030']['fd'] };
    }

    if ((sexo === 'fd' && ano > 2030 && pontos >= regra1['2030']['fd'])
      && tempo_contribuicao >= requisitoContribuicoesDias[sexo]) {
      return { status: true, ano: ano, pontos: pontos, requisitosPosntos: regra1['2030']['fd'] };
    }

    return (((ano >= 2019 && ano <= 2030) && pontos >= regra1[ano][sexo])
      && tempo_contribuicao >= requisitoContribuicoesDias[sexo]) ?
      { status: true, ano: ano, pontos: pontos, requisitosPosntos: regra1[ano][sexo] } :
      { status: false, ano: 0, pontos: 0, requisitosPosntos: 0 };

  }



  //   public requisitosRegra1(pontos, ano, sexo, tempo_contribuicao) {

  //   const requisitoContribuicoes = {
  //     f: 30,
  //     m: 35
  //   };

  //   const regra1 = {
  //     2019: { m: 96, f: 86 },
  //     2020: { m: 97, f: 87 },
  //     2021: { m: 98, f: 88 },
  //     2022: { m: 99, f: 89 },
  //     2023: { m: 100, f: 90 },
  //     2024: { m: 101, f: 91 },
  //     2025: { m: 102, f: 92 },
  //     2026: { m: 103, f: 93 },
  //     2027: { m: 104, f: 94 },
  //     2028: { m: 105, f: 95 },
  //     2029: { m: 105, f: 96 },
  //     2030: { m: 105, f: 97 },
  //     2031: { m: 105, f: 98 },
  //     2032: { m: 105, f: 99 },
  //     2033: { m: 105, f: 100 }
  //   };

  //   if ((sexo === 'm' && ano > 2028 && pontos >= 105)
  //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
  //     return {status: true, ano: ano, pontos: pontos};
  //   }

  //   if ((sexo === 'f' && ano > 2033 && pontos >= 100)
  //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
  //     return {status: true, ano: ano, pontos: pontos};
  //   }

  //   return (((ano >= 2019 && ano <= 2033) && pontos >= regra1[ano][sexo])
  //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) ?
  //     {status: true, ano: ano, pontos: regra1[ano][sexo]} :
  //      {status: false, ano: 0, pontos: 0};

  // }

  //   public requisitosRegra1Prof(pontos, ano, sexo, tempo_contribuicao) {

  //   const requisitoContribuicoes = {
  //     f: 25,
  //     m: 30
  //   };

  //   const regra1 = {
  //     2019: { m: 91, f: 81 },
  //     2020: { m: 92, f: 82 },
  //     2021: { m: 93, f: 83 },
  //     2022: { m: 94, f: 84 },
  //     2023: { m: 95, f: 85 },
  //     2024: { m: 96, f: 86 },
  //     2025: { m: 97, f: 87 },
  //     2026: { m: 98, f: 88 },
  //     2027: { m: 99, f: 89 },
  //     2028: { m: 100, f: 90 },
  //     2029: { m: 100, f: 91 },
  //     2030: { m: 100, f: 92 }
  //   };

  //   if ((sexo === 'm' && ano > 2028 && pontos >= 100)
  //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
  //     return {status: true, ano: ano, pontos: pontos};
  //   }

  //   if ((sexo === 'f' && ano > 2030 && pontos >= 92)
  //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
  //     return {status: true, ano: ano, pontos: pontos};
  //   }

  //   return (((ano >= 2019 && ano <= 2030) && pontos >= regra1[ano][sexo])
  //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) ?
  //     {status: true, ano: ano, pontos: regra1[ano][sexo]} :
  //     {status: false, ano: 0, pontos: 0};

  // }

  // public contadorRegra1(pontosAtuais) {

  //   console.log(this.dataAtual);

  //   let auxiliarDate = this.dataAtual;
  //   let fimContador = { status: false, ano: 0, pontos: 0 };
  //   let count = 0;
  //   let pontos = pontosAtuais;
  //   let auxiliarDateClone;
  //   let idade = this.seguradoTransicao.idadeFracionada;
  //   let tempoContribuicao = this.seguradoTransicao.contribuicaoFracionadoAnos;

  //   do {


  //     fimContador = this.getRequisitosRegra1(
  //       pontos,
  //       auxiliarDate.year(),
  //       this.seguradoTransicao.sexo,
  //       tempoContribuicao,
  //       this.seguradoTransicao.professor);


  //     console.log('data - ' + auxiliarDate.format('DD/MM/YYYY')
  //       + '|' + 'idade -' + idade + '|'
  //       + '|' + 'Tempo - ' + tempoContribuicao + '|'
  //       + '|' + 'pontos - ' + pontos);

  //     if (fimContador.status) {

  //       console.log(auxiliarDate);
  //       console.log(idade);
  //       console.log(tempoContribuicao);
  //       console.log(pontos);



  //       console.log('data - ' + auxiliarDate.format('DD/MM/YYYY')
  //         + '|' + 'idade -' + idade + '|'
  //         + '|' + 'Tempo - ' + tempoContribuicao + '|'
  //         + '|' + 'pontos - ' + pontos + '|'
  //         + '|');

  //       let testepontos = auxiliarDate.clone();

  //       console.log((pontos));
  //       console.log((fimContador.pontos));

  //       // let teste = (pontos - fimContador.pontos);

  //       // console.log(teste*365);

  //       // console.log(moment.duration(teste*365, 'days'));

  //       // console.log(testepontos.subtract((pontos - fimContador.pontos), 'years'))


  //     }

  //     count++;
  //     //  pontos += 0.002737909263;

  //     idade += 1;
  //     tempoContribuicao += 1;
  //     pontos = idade + tempoContribuicao;

  //     auxiliarDateClone = auxiliarDate.clone();
  //     // auxiliarDate = moment(this.toDateString(auxiliarDateClone.add(1, 'days')), 'DD/MM/YYYY');
  //     auxiliarDate = moment(this.toDateString(auxiliarDateClone.add(1, 'years')), 'DD/MM/YYYY');



  //   } while (!fimContador.status || (!fimContador.status && count <= 105));


  // }


}
