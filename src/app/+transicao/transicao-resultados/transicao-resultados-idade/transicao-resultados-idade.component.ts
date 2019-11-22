import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-idade',
  templateUrl: './transicao-resultados-idade.component.html',
  styleUrls: ['./transicao-resultados-idade.component.css']
})
export class TransicaoResultadosIdadeComponent extends TransicaoResultadosComponent implements OnInit {

  @Input() seguradoTransicao;



  public conclusoesRegra5 = {
    status: false,
    percentual: '',
    formula: '',
    requisitoDib: '',
    idadeDib: '',
    tempoDib: '',
    dataDib: ''
  };

  public isUpdating;

  constructor() {
    super();
  }

  ngOnInit() {

  
    this.conclusaoRegra5Idade();
  }



  /* 
    Regra 5 idade:
  */
  public getparametrosRegra5(ano, sexo) {

    const regra5 = {
      2019: { m: 65, md: 23725, f: 60, fd: 21900 },
      2020: { m: 65, md: 23725, f: 60.5, fd: 22083 },
      2021: { m: 65, md: 23725, f: 61, fd: 22265 },
      2022: { m: 65, md: 23725, f: 61.5, fd: 22448 },
      2023: { m: 65, md: 23725, f: 62, fd: 22630 },
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

    const contribuicao_min = (sexo === 'md' || sexo === 'fd') ? 5475 : 15;
    const regra5 = this.getparametrosRegra5(ano, sexo);

    return (idade >= regra5 && tempo_contribuicao >= contribuicao_min) ?
      { status: true, ano: ano, idade: idade, requisitosIdade: regra5 } :
      { status: false, ano: 0, idade: 0, requisitosIdade: 0 };

  }






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
        tempoDib: `${this.formateObjToStringAnosMesesDias(rstRegra2IdadeTempo.tempoContribuicaoDib)}`,
        dataDib: rstRegra2IdadeTempo.dataDib.format('DD/MM/YYYY')
      };

      console.log(' -- Regra 5 ---');
      console.log(this.conclusoesRegra5);

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
      this.seguradoTransicao.professor,
      this.seguradoTransicao.redutorProfessor);

    let rstRegraIdadeProgressiva: any;

    let percentualR1 = 60;

    // console.log(regraIdade);
    // console.log(this.seguradoTransicao.idadeFracionada);
    // console.log(this.seguradoTransicao.redutorProfessor);
    // console.log(contribuicao_min[this.seguradoTransicao.sexo]);


    if (this.seguradoTransicao.idadeFracionada >= regraIdade &&
      this.seguradoTransicao.contribuicaoFracionadoAnos >= contribuicao_min[this.seguradoTransicao.sexo]) {


      rstRegraIdadeProgressiva = {
        dataDib: this.dataAtual,
        idadeDib: this.converterTempoDias(this.seguradoTransicao.idadeFracionadaDias),
        tempoContribuicaoDib: this.converterTempoDias(this.seguradoTransicao.contribuicaoFracionadoDias),
        DiffDataAtualDib: 0,
        requisitos: regraIdade,
        formula: '',
        percentual: 0,
      };

    } else {

      rstRegraIdadeProgressiva = this.contadorRegra5();

    }

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


    let auxiliarDate = this.dataAtual;
    let fimContador = { status: false, ano: 0, idade: 0, requisitosIdade: 0 };
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


      fimContador = this.requisitosRegra5(
        auxiliarDate.year(),
        sexo,
        idade,
        tempoContribuicao
      );


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




}
