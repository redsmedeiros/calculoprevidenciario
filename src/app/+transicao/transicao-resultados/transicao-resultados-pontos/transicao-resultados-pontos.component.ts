
import { Component, OnInit, Input, OnChanges } from '@angular/core';
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

  public requisitoPontosRegra1Prof = {
    2019: { m: 91, md: 33215, f: 81, fd: 29565 },
    2020: { m: 92, md: 33580, f: 82, fd: 29930 },
    2021: { m: 93, md: 33945, f: 83, fd: 30295 },
    2022: { m: 94, md: 34310, f: 84, fd: 30660 },
    2023: { m: 95, md: 34675, f: 85, fd: 31025 },
    2024: { m: 96, md: 35040, f: 86, fd: 31390 },
    2025: { m: 97, md: 35405, f: 87, fd: 31755 },
    2026: { m: 98, md: 35770, f: 88, fd: 32120 },
    2027: { m: 99, md: 36135, f: 89, fd: 32485 },
    2028: { m: 100, md: 36500, f: 90, fd: 32850 },
    2029: { m: 100, md: 36500, f: 91, fd: 33215 },
    2030: { m: 100, md: 36500, f: 92, fd: 33580 },
  };


  public requisitoPontosRegra1 = {
    2019: { m: 96, md: 35040, f: 86, fd: 31390 },
    2020: { m: 97, md: 35405, f: 87, fd: 31755 },
    2021: { m: 98, md: 35770, f: 88, fd: 32120 },
    2022: { m: 99, md: 36135, f: 89, fd: 32485 },
    2023: { m: 100, md: 36500, f: 90, fd: 32850 },
    2024: { m: 101, md: 36865, f: 91, fd: 33215 },
    2025: { m: 102, md: 37230, f: 92, fd: 33580 },
    2026: { m: 103, md: 37595, f: 93, fd: 33945 },
    2027: { m: 104, md: 37960, f: 94, fd: 34310 },
    2028: { m: 105, md: 38325, f: 95, fd: 34675 },
    2029: { m: 105, md: 38325, f: 96, fd: 35040 },
    2030: { m: 105, md: 38325, f: 97, fd: 35405 },
    2031: { m: 105, md: 38325, f: 98, fd: 35770 },
    2032: { m: 105, md: 38325, f: 99, fd: 36135 },
    2033: { m: 105, md: 38325, f: 100, fd: 36500 },

  }


  public conclusoesRegra1 = {
    status: false,
    percentual: '',
    formula: '',
    requisitoDib: '',
    dataDib: '',
    idadeDib: '',
    tempoDib: '',
  };


  constructor() {
    super();
  }

  ngOnInit() {


    this.conclusaoRegra1Pontos();

  }


  ngOnChanges() {

    console.log(this.seguradoTransicao);
    console.log(this.seguradoInformacoes);

    this.conclusaoRegra1Pontos();
  }


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
        dataDib: rstRegra1Pontos.dataDib.format('DD/MM/YYYY')
      };

      console.log(' -- Regra 1 ---');
      console.log(this.conclusoesRegra1);

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
      this.seguradoTransicao.contribuicaoFracionadoAnos >= contribuicao_min) {


      rstRegraPontos = {
        dataDib: this.dataAtual,
        idade: this.seguradoTransicao.idade,
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

    let auxiliarDate = this.dataAtual;
    let fimContador = { status: false, ano: 0, pontos: 0 };
    let count = 1;
    let pontos = pontosAtuaisDias;
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


      fimContador = this.getRequisitosRegra1(
        pontos,
        auxiliarDate.year(),
        sexo,
        tempoContribuicao,
        this.seguradoTransicao.professor);


      // console.log('P - data - ' + auxiliarDate.format('DD/MM/YYYY')
      //   + '|' + 'idade -' + idade + '|'
      //   + '|' + 'Tempo - ' + tempoContribuicao + '|'
      //   + '|' + 'pontos - ' + pontos);

      if (fimContador.status) {

        // console.log(auxiliarDate);
        // console.log(idade);
        // console.log(tempoContribuicao);
        // console.log(pontos);
        // console.log(count);



        // console.log('F - data - ' + auxiliarDate.format('DD/MM/YYYY')
        //   + '|' + 'idade -' + idade + '|'
        //   + '|' + 'Tempo - ' + tempoContribuicao + '|'
        //   + '|' + 'pontos - ' + pontos + '|'
        //   + '|');


        // console.log(auxiliarDate);
        // console.log(moment.duration(idade, 'days'));
        // console.log(moment.duration(idade, 'days').humanize());
        // console.log(moment.duration(tempoContribuicao, 'days'));
        // console.log(moment.duration(tempoContribuicao, 'days').humanize());
        // console.log(moment.duration(count, 'days'));
        // console.log(moment.duration(count, 'days').humanize());
        // console.log(pontos);

      }

      count++;
      idade += 1;
      tempoContribuicao += 1;
      pontos = idade + tempoContribuicao;

      auxiliarDateClone = auxiliarDate.clone();
      auxiliarDate = moment(this.toDateString(auxiliarDateClone.add(1, 'days')), 'DD/MM/YYYY');


    } while (!fimContador.status && pontos <= 76650);



    return {
      dataDib: auxiliarDate,
      idadeMoment: moment.duration(idade, 'days'),
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



    // console.log(pontos);
    // console.log(ano);
    // console.log(sexo);
    // console.log(tempo_contribuicao);


    const requisitoContribuicoes = {
      f: 30,
      m: 35
    };

    const requisitoContribuicoesDias = {
      fd: 10950,
      md: 12775
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

    const requisitoContribuicoesDias = {
      fd: 9125,
      md: 10950
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