import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-pedagio100',
  templateUrl: './transicao-resultados-pedagio100.component.html',
  styleUrls: ['./transicao-resultados-pedagio100.component.css']
})
export class TransicaoResultadosPedagio100Component extends TransicaoResultadosComponent implements OnInit {


  @Input() seguradoTransicao;
  public isUpdating;



  public contribuicaoIdadeMin = {
    m: 60,
    md: 21900,
    f: 57,
    fd: 20805,
  };

  public contribuicaoMin = {
    m: 35,
    md: 12775,
    f: 30,
    fd: 10950,
  };



  // public diffEC1032019Anos = 0;
  // public diffEC1032019Dias = 0;
  // public contribuicaoFracionadoAnosAteEC103 = 0;
  // public contribuicaoFracionadoDiasAteEC103 = 0;


  public conclusoesRegra4 = {
    status: false,
    percentual: '',
    formula: '',
    requisitoDib: '',
    idadeDib: '',
    tempoDib: '',
    dataDib: '',
  };




  constructor() {
    super();
  }

  ngOnInit() {

    this.isUpdating = true;

    this.aplicarRedutorProfessor();
    this.conclusaoRegra4pedagio100();

  }


  public aplicarRedutorProfessor() {

    if (this.seguradoTransicao.professor) {
      this.contribuicaoIdadeMin = {
        m: (60 - this.seguradoTransicao.redutorProfessor),
        md: (21900 - this.seguradoTransicao.redutorProfessorDias),
        f: (57 - this.seguradoTransicao.redutorProfessor),
        fd: (20805 - this.seguradoTransicao.redutorProfessorDias),
      };

      this.contribuicaoMin = {
        m: (35 - this.seguradoTransicao.redutorProfessor),
        md: (12775 - this.seguradoTransicao.redutorProfessorDias),
        f: (30 - this.seguradoTransicao.redutorProfessor),
        fd: (10950 - this.seguradoTransicao.redutorProfessorDias),
      };
    }

  }



  conclusaoRegra4pedagio100() {

    try {


      const rstRegra3pedagio50 = this.calcularRegra4();

      this.conclusoesRegra4 = {
        status: true,
        percentual: rstRegra3pedagio50.percentual,
        formula: `${rstRegra3pedagio50.formula} = ${rstRegra3pedagio50.percentual}%`,
        requisitoDib: rstRegra3pedagio50.requisitos,
        idadeDib: `${this.formateObjToStringAnosMesesDias(rstRegra3pedagio50.idadeDib)}`,
        tempoDib: `${this.formateObjToStringAnosMesesDias(rstRegra3pedagio50.tempoContribuicaoDib)}`,
        dataDib: rstRegra3pedagio50.dataDib.format('DD/MM/YYYY'),
      };




      console.log(' -- Regra 4 ---');
      console.log(this.seguradoTransicao);
      console.log(this.conclusoesRegra4);

      // fim do processo
      this.isUpdating = false;

    } catch (error) {
      console.log(error);
    }


  }



  public calcularRegra4() {

    const regra3IdadeDias = this.contribuicaoIdadeMin[this.seguradoTransicao.sexo + 'd'];
    const regra3TempoContribDias = this.contribuicaoMin[this.seguradoTransicao.sexo + 'd'];
    const regra3Idade = this.contribuicaoIdadeMin[this.seguradoTransicao.sexo];
    const regra3TempoContrib = this.contribuicaoMin[this.seguradoTransicao.sexo];


    const rstContadorRegra4 = this.contadorRegra4();

    console.log(rstContadorRegra4);


    let rstRegraPedagio100: any;
    const dataDib = this.dataAtual.clone();
    let idadeDib = this.seguradoTransicao.idadeFracionada;
    let contribuicaoDiff = 0;
    let tempoDePedagio = 0;
    let tempoFinalContrib = this.seguradoTransicao.contribuicaoFracionadoAnos;
    let tempoDePedagioTotal = 0;

    if (this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103 < regra3TempoContrib) {

      contribuicaoDiff = (regra3TempoContrib - this.seguradoTransicao.contribuicaoFracionadoAnos);
      tempoDePedagio = ((regra3TempoContrib - this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103));
      tempoFinalContrib = regra3TempoContrib + tempoDePedagio;

      tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;
      idadeDib = idadeDib + tempoDePedagioTotal
      dataDib.add(tempoDePedagioTotal, 'years');
    }


    // console.log(contribuicaoDiff);
    // console.log(this.converterTempoAnos(contribuicaoDiff));
    // console.log(tempoDePedagio);
    // console.log(this.converterTempoAnos(tempoDePedagio));
    // console.log(tempoFinalContrib);
    // console.log(this.converterTempoAnos(tempoFinalContrib));



    rstRegraPedagio100 = {
      dataDib: dataDib,
      idadeDib: this.converterTempoAnos(idadeDib),
      tempoContribuicaoDib: this.converterTempoAnos(tempoFinalContrib),
      DiffDataAtualDib: 0,
      requisitos: regra3TempoContrib,
      pedagio: this.converterTempoAnos(tempoDePedagio),
    };

    return rstRegraPedagio100;

  }



  public requisitosRegra4(ano, sexo,  idade, tempo_contribuicao) {



    const regra3Idade = this.contribuicaoIdadeMin[sexo];
    const regra3TempoContrib = this.contribuicaoMin[sexo];

    if ((tempo_contribuicao >= regra3TempoContrib) && (idade >= regra3Idade)) {
      return {
        status: true,
        ano: ano,
        idade: idade,
        tempo_contribuicao: tempo_contribuicao,
        requisitosTempo: regra3TempoContrib,
        requisitosIdade: regra3Idade
      };
    }

    return {
      status: false,
      ano: 0,
      tempo_contribuicao: 0,
      idade: 0,
      requisitosTempo: regra3TempoContrib,
      requisitosIdade: regra3Idade
    }


  }




  public contadorRegra4() {

    let auxiliarDate = this.dataAtual;
    let fimContador = {
      status: false,
      ano: 0,
      tempo_contribuicao: 0,
      idade: 0,
      requisitosTempo: 0,
      requisitosIdade: 0
    };
    let count = 1;
    let auxiliarDateClone;
    let idade = this.seguradoTransicao.idadeFracionadaDias;
    let tempoContribuicao = this.seguradoTransicao.contribuicaoFracionadoDias;
    const sexo = this.seguradoTransicao.sexo + 'd';

    do {


      fimContador = this.requisitosRegra4(
        auxiliarDate.year(),
        sexo,
        idade,
        tempoContribuicao);


      // console.log('P - data - ' + auxiliarDate.format('DD/MM/YYYY')
      //   + '|' + 'idade -' + idade + '|'
      //   + '|' + 'Tempo - ' + tempoContribuicao + '|');

      if (fimContador.status) {

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
