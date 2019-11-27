import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-idade-progressiva',
  templateUrl: './transicao-resultados-idade-progressiva.component.html',
  styleUrls: ['./transicao-resultados-idade-progressiva.component.css']
})
export class TransicaoResultadosIdadeProgressivaComponent extends TransicaoResultadosComponent implements OnInit, OnChanges {

  @Input() seguradoTransicao;


  public requisitoIdadeProgressivaRegra2 = {
    2019: { m: 61, md: 22265, f: 56, fd: 20440 },
    2020: { m: 61.5, md: 22448, f: 56.5, fd: 20623 },
    2021: { m: 62, md: 22630, f: 57, fd: 20805 },
    2022: { m: 62.5, md: 22813, f: 57.5, fd: 20988 },
    2023: { m: 63, md: 22995, f: 58, fd: 21170 },
    2024: { m: 63.5, md: 23178, f: 58.5, fd: 21353 },
    2025: { m: 64, md: 23360, f: 59, fd: 21535 },
    2026: { m: 64.5, md: 23543, f: 59.5, fd: 21718 },
    2027: { m: 65, md: 23725, f: 60, fd: 21900 },
    2028: { m: 65, md: 23725, f: 60.5, fd: 22083 },
    2029: { m: 65, md: 23725, f: 61, fd: 22265 },
    2030: { m: 65, md: 23725, f: 61.5, fd: 22448 },
    2031: { m: 65, md: 23725, f: 62, fd: 22630 },
  }


  public conclusoesRegra2 = {
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

   // this.conclusaoRegra2IdadeProgressiva();

  }

  ngOnChanges() {

    this.conclusaoRegra2IdadeProgressiva();

  }

  conclusaoRegra2IdadeProgressiva() {

    try {

      this.isUpdating = true;

      const rstRegra2IdadeTempo = this.calcularRegra2();

      this.conclusoesRegra2 = {
        status: true,
        percentual: rstRegra2IdadeTempo.percentual,
        formula: `${rstRegra2IdadeTempo.formula} = ${rstRegra2IdadeTempo.percentual}%`,
        requisitoDib: rstRegra2IdadeTempo.requisitos,
        idadeDib: `${this.formateObjToStringAnosMesesDias(rstRegra2IdadeTempo.idadeDib)}`,
        tempoDib: `${this.formateObjToStringAnosMesesDias(rstRegra2IdadeTempo.tempoContribuicaoDib)}`,
        dataDib: rstRegra2IdadeTempo.dataDib.format('DD/MM/YYYY')
      };

      // console.log(' -- Regra 2 ---');
      // console.log(this.conclusoesRegra2);
      // console.log(this.seguradoTransicao);

      // fim do processo
      this.isUpdating = false;

    } catch (error) {
      console.log(error);
    }


  }




  public calcularRegra2() {


    const contribuicao_min = {
      m: (35 - this.seguradoTransicao.redutorProfessor),
      f: (30 - this.seguradoTransicao.redutorProfessor)
    };

    const tempoPercentualR1 = {
      m: 20,
      f: 15
    };

    const regraIdade = this.getRequisitoRegra2(this.dataAtual.year(),
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

      rstRegraIdadeProgressiva = this.contadorRegra2();

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

  public getRequisitoRegra2(ano, sexo, professor, redutorProfessorDias) {

    return (!professor) ? this.requisitoIdadeProgressivaRegra2[ano][sexo]
      : this.requisitoIdadeProgressivaRegra2[ano][sexo] - redutorProfessorDias;

  }

  public contadorRegra2() {


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


      fimContador = this.requisitosRegra2(
        auxiliarDate.year(),
        sexo,
        idade,
        tempoContribuicao,
        this.seguradoTransicao.redutorProfessorDias);


      // console.log('P - ' + count + ' - data =' + auxiliarDate.format('DD/MM/YYYY')
      //   + '|' + 'idade =' + idade + '|'
      //   + '|' + 'Tempo = ' + tempoContribuicao + '|');

      if (fimContador.status) {

        // console.log(auxiliarDate);
        // console.log(idade);
        // console.log(tempoContribuicao);
        // console.log(pontos);
        // console.log(count);



        // console.log('F - ' + count + ' - data - ' + auxiliarDate.format('DD/MM/YYYY')
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




    const correcaoAnoBissexto = this.contarBissextosEntre(
                                        this.seguradoTransicao.dataNascimento.format('YYYY'),
                                        auxiliarDate.format('YYYY')
                                        );

    if (correcaoAnoBissexto > 0) {
      ;
      auxiliarDate.add(correcaoAnoBissexto, 'days');
    }




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




  public requisitosRegra2(ano, sexo, idade, tempo_contribuicao, redutorProfessorDias) {

    const requisitoContribuicoes = {
      f: 30,
      m: 35
    };

    const requisitoContribuicoesDias = {
      fd: 10950,
      md: 12775
    };

    const regra2 = this.requisitoIdadeProgressivaRegra2;

    if ((sexo === 'md' && ano >= 2027 && idade >= regra2[2027][sexo]) &&
      tempo_contribuicao >= requisitoContribuicoesDias[sexo]) {
      return { status: true, ano: ano, idade: idade, requisitosIdade: regra2[2027][sexo] };
    }

    if ((sexo === 'fd' && ano >= 2031 && idade >= regra2[2031][sexo]) &&
      tempo_contribuicao >= requisitoContribuicoesDias[sexo]) {
      return { status: true, ano: ano, idade: idade, requisitosIdade: regra2[2031][sexo] };
    }

    return (((ano >= 2019 && ano <= 2031) && idade >= regra2[ano][sexo]) &&
      tempo_contribuicao >= requisitoContribuicoesDias[sexo]) ?
      { status: true, ano: ano, idade: idade, requisitosIdade: regra2[ano][sexo] } :
      { status: false, ano: 0, idade: 0, requisitosIdade: 0 };


  }


}
