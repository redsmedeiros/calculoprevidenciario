import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-idade',
  templateUrl: './transicao-resultados-idade.component.html',
  styleUrls: ['./transicao-resultados-idade.component.css']
})
export class TransicaoResultadosIdadeComponent extends TransicaoResultadosComponent implements OnInit, OnChanges {

  @Input() seguradoTransicao;

  private regraIdadeAtual;

  public conclusoesRegra5 = {
    status: false,
    percentual: '',
    formula: '',
    requisitoDib: '',
    idadeDib: '',
    idadeMoment: '',
    tempoDib: '',
    dataDib: ''
  };

  public isUpdating;

  constructor() {
    super(null);
  }

  ngOnInit() {
    // this.conclusaoRegra5Idade();
  }

  ngOnChanges() {
    this.conclusaoRegra5Idade();

  }

  /* 
    Regra 5 idade:
  */
  public getparametrosRegra5(ano, sexo) {

    // const regra5 = {
    //   2019: { m: 65, md: 23725, f: 60, fd: 21900 },
    //   2020: { m: 65, md: 23725, f: 60.5, fd: 22083 },
    //   2021: { m: 65, md: 23725, f: 61, fd: 22265 },
    //   2022: { m: 65, md: 23725, f: 61.5, fd: 22448 },
    //   2023: { m: 65, md: 23725, f: 62, fd: 22630 },
    // };

    // const regra5 = {
    //   2019: { m: 65, md: 23741, f: 60, fd: 21915 },
    //   2020: { m: 65, md: 23741, f: 60.5, fd: 22098 },
    //   2021: { m: 65, md: 23741, f: 61, fd: 22280 },
    //   2022: { m: 65, md: 23741, f: 61.5, fd: 22463 },
    //   2023: { m: 65, md: 23741, f: 62, fd: 22645 },
    // };

    const regra5 = {
      2019: { m: 65, md: 23741, f: 60, fd: 21915 },
      2020: { m: 65, md: 23741, f: 60.5, fd: 22097.625 },
      2021: { m: 65, md: 23741, f: 61, fd: 22280.25 },
      2022: { m: 65, md: 23741, f: 61.5, fd: 22462.875 },
      2023: { m: 65, md: 23741, f: 62, fd: 22645.5 },
    };

    if (ano <= 2019) {
      return regra5[2019][sexo];
    }

    if (ano > 2019 && ano <= 2023) {
      return regra5[ano][sexo];
    }

    if (ano > 2023) {
      return regra5[2023][sexo];
    }

  }


  /**
   * regra 5 - idade
   */
  public requisitosRegra5(ano, sexo, idade, tempo_contribuicao) {

    const contribuicao_min = (sexo === 'md' || sexo === 'fd') ? 5478.75 : 15;
    const regra5 = this.getparametrosRegra5(ano, sexo);

    // console.log(regra5);
    // console.log(contribuicao_min);

    return (idade >= regra5 && tempo_contribuicao >= contribuicao_min) ?
      { status: true, ano: ano, idade: idade, requisitosIdade: regra5, tempoContrib: contribuicao_min } :
      { status: false, ano: ano, idade: idade, requisitosIdade: regra5, tempoContrib: contribuicao_min };

  }





  /**
     * A projeção é baseada no dia atual e no tempo de contribuição após a EC103/2019
     */
  public conclusaoRegra5Idade() {

    this.isUpdating = true;

    try {

      const rstRegra2IdadeTempo = this.calcularRegra5();




      this.conclusoesRegra5 = {
        status: true,
        percentual: rstRegra2IdadeTempo.percentual,
        formula: `${rstRegra2IdadeTempo.formula} = ${rstRegra2IdadeTempo.percentual}%`,
        requisitoDib: rstRegra2IdadeTempo.requisitos,
        idadeDib: `${this.formateObjToStringAnosMesesDias(rstRegra2IdadeTempo.idadeDib)}`,
        idadeMoment: this.formateStringAnosMesesDias(rstRegra2IdadeTempo.idadeMoment.years(),
          rstRegra2IdadeTempo.idadeMoment.months(),
          rstRegra2IdadeTempo.idadeMoment.days()),
        tempoDib: `${this.formateObjToStringAnosMesesDias(rstRegra2IdadeTempo.tempoContribuicaoDib)}`,
        dataDib: rstRegra2IdadeTempo.dataDib.format('DD/MM/YYYY')
      };

      // console.log(' -- Regra 5 ---');
      // console.log(this.conclusoesRegra5);

      // fim do processo
      this.isUpdating = false;

    } catch (error) {
      console.log(error);
    }


  }




  public calcularRegra5() {


    const contribuicao_min = {
      m: (35 - this.seguradoTransicao.redutorProfessor),
      f: (30 - this.seguradoTransicao.redutorProfessor)
    };

    const tempoPercentualR1 = {
      m: 20,
      f: 15
    };


    const regraIdade = this.requisitosRegra5(this.dataAtual.year(),
      this.seguradoTransicao.sexo,
      this.seguradoTransicao.idadeFracionada,
      this.seguradoTransicao.contribuicaoFracionadoAnos);


    const idadeEm2019 = this.calcularIdadeFracionada('2019-12-31', 'y');

    const regraIdadeAnterior = this.requisitosRegra5(2019,
      this.seguradoTransicao.sexo,
      idadeEm2019,
      this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103);


    let rstRegraIdadeProgressiva: any;

    let percentualR1 = 60;

    // if (this.seguradoTransicao.idadeFracionada >= regraIdade &&
    //   this.seguradoTransicao.contribuicaoFracionadoAnos >= contribuicao_min[this.seguradoTransicao.sexo]) {


    // console.log(idadeEm2019);
    // console.log(regraIdadeAnterior);


    if (regraIdade.status || regraIdadeAnterior.status) {

      rstRegraIdadeProgressiva = {
        dataDib: moment(moment(), 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0),
        idadeMoment: this.calcularIdade(this.dataAtual),
        idadeDib: this.converterTempoDias(this.seguradoTransicao.idadeFracionadaDias),
        tempoContribuicaoDib: this.converterTempoAnosP(this.seguradoTransicao.contribuicaoFracionadoAnos),
        DiffDataAtualDib: 0,
        requisitos: regraIdade,
        formula: '',
        percentual: 0,
      };

    } else {

      rstRegraIdadeProgressiva = this.contadorRegra5();

    }

    // if (this.seguradoTransicao.contribuicaoFracionadoAnos >= 15) {

      rstRegraIdadeProgressiva.tempoContribuicaoDib = {
        days: parseInt(this.seguradoTransicao.contribuicaoDias, 10),
        fullDays: this.seguradoTransicao.contribuicaoFracionadoDias,
        months: parseInt(this.seguradoTransicao.contribuicaoMeses, 10),
        years: parseInt(this.seguradoTransicao.contribuicaoAnos, 10),
      }

    // }


    if (Math.trunc(rstRegraIdadeProgressiva.tempoContribuicaoDib.years) >= tempoPercentualR1[this.seguradoTransicao.sexo]) {
      percentualR1 += ((Math.trunc(rstRegraIdadeProgressiva.tempoContribuicaoDib.years)
        - tempoPercentualR1[this.seguradoTransicao.sexo]) * 2);
    }

    rstRegraIdadeProgressiva.percentual = percentualR1;

    rstRegraIdadeProgressiva.formula = `60 + ((${Math.trunc(rstRegraIdadeProgressiva.tempoContribuicaoDib.years)} -
                                      ${tempoPercentualR1[this.seguradoTransicao.sexo]}) * 2)`;


    return rstRegraIdadeProgressiva;

  }


  public contadorRegra5() {

    let auxiliarDate = this.dataAtual.clone();
    let fimContador = { status: false, ano: 0, idade: 0, requisitosIdade: 0 };
    let count = 0;
    let auxiliarDateClone;
    let idade = this.seguradoTransicao.idadeFracionadaDias;
    // let tempoContribuicao = this.seguradoTransicao.contribuicaoFracionadoDias;

    let tempoContribuicao = Math.floor(((parseInt(this.seguradoTransicao.contribuicaoAnos, 10) * 365.25) +
      (parseInt(this.seguradoTransicao.contribuicaoMeses, 10) * 30.436875) +
      parseInt(this.seguradoTransicao.contribuicaoDias, 10)));

    const sexo = this.seguradoTransicao.sexo + 'd';
    let idadeMoment;

    do {

      count++;
      idade += 1;
      tempoContribuicao += 1;

      fimContador = this.requisitosRegra5(
        auxiliarDate.year(),
        sexo,
        idade,
        tempoContribuicao
      );

      auxiliarDateClone = auxiliarDate.clone();
      auxiliarDate = moment(this.toDateString(auxiliarDateClone.add(1, 'days')), 'DD/MM/YYYY');


    } while (!fimContador.status && idade <= 54750);



    // const correcaoAnoBissexto = this.contarBissextosEntre(
    //   this.seguradoTransicao.dataNascimento,
    //   auxiliarDate
    // );

    // if (correcaoAnoBissexto > 0) {
    //   auxiliarDate.add(correcaoAnoBissexto, 'days');
    // }

    // console.log(this.seguradoTransicao.dataNascimento.date() - auxiliarDate.date())
    // if (this.seguradoTransicao.contribuicaoFracionadoAnos >= 15
    //   && (this.seguradoTransicao.dataNascimento.month() === auxiliarDate.month()
    //     && (Math.abs(this.seguradoTransicao.dataNascimento.date() - auxiliarDate.date()) < 2)
    //   )
    //   || (Math.abs(this.seguradoTransicao.dataNascimento.date() - auxiliarDate.date()) < 2)) {

    const testContrib = (15 - this.seguradoTransicao.contribuicaoFracionadoAnos);
    const testeIdade = (this.getparametrosRegra5(auxiliarDate.year(), this.seguradoTransicao.sexo) -
      this.seguradoTransicao.idadeFracionada);

      // console.log(testContrib)
      // console.log(testeIdade)

    // if (this.seguradoTransicao.contribuicaoFracionadoAnos >= 15) {
    if (this.seguradoTransicao.contribuicaoFracionadoAnos >= 15 || testContrib < testeIdade) {


      if (auxiliarDate.year() === 2020 || auxiliarDate.year() === 2022) {

        auxiliarDate = moment({
          year: auxiliarDate.year(),
          month: auxiliarDate.month(),
          day: this.seguradoTransicao.dataNascimento.date()
        });

      } else {

        auxiliarDate = moment({
          year: auxiliarDate.year(),
          month: this.seguradoTransicao.dataNascimento.month(),
          day: this.seguradoTransicao.dataNascimento.date()
        });

      }

      idadeMoment = this.calcularIdade(auxiliarDate);

      // console.log(idadeMoment);

      if (this.seguradoTransicao.sexo === 'm' &&
        idadeMoment.days() === 1) {
        idadeMoment.add(-1, 'day');
      }

      // idadeMoment.add(-1, 'day');
    } else {

      idadeMoment = this.calcularIdade(auxiliarDate);
      // idadeMoment.add(-1, 'day');
    }


    if (this.seguradoTransicao.dataNascimento.date() === auxiliarDate.date()) {


      if ((auxiliarDate.year() === 2020 || auxiliarDate.year() === 2022) && this.seguradoTransicao.sexo === 'f') {

        idadeMoment = moment.duration({
          days: 0,
          months: 6,
          years: idadeMoment.years(),
        });

      } else {

        idadeMoment = moment.duration({
          days: 0,
          months: idadeMoment.months(),
          years: idadeMoment.years(),
        });

      }

    }

    if (idadeMoment.days() === 30) {
      idadeMoment.add(1, 'day');
    }



    // console.log('-- regra 5');

    // console.log(correcaoAnoBissexto);
    // console.log(auxiliarDate);
    // console.log(idade);
    // console.log(tempoContribuicao);
    // console.log(count);
    // console.log(idadeMoment);
    //  tempoContribuicao += correcaoAnoBissexto;


    // console.log(tempoContribuicao);

    return {
      dataDib: auxiliarDate,
      idadeMoment: idadeMoment,
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




}
