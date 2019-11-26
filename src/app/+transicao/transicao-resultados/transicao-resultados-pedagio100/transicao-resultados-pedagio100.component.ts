import { Component, OnInit, Input, OnChanges } from '@angular/core';

import * as moment from 'moment';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-pedagio100',
  templateUrl: './transicao-resultados-pedagio100.component.html',
  styleUrls: ['./transicao-resultados-pedagio100.component.css']
})
export class TransicaoResultadosPedagio100Component extends TransicaoResultadosComponent implements OnInit, OnChanges {


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

  public pedagioEmDias = 0;
  public pedagioEmAnos = 0;



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
    tempoCompedagio: '',
    dataDib: '',
  };




  constructor() {
    super();
  }

  ngOnInit() {

    this.conclusaoRegra4pedagio100();

  }

  ngOnChanges() {

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

      this.isUpdating = true;

      this.aplicarRedutorProfessor();


      const rstRegra4pedagio100 = this.calcularRegra4();

      this.conclusoesRegra4 = {
        status: true,
        percentual: rstRegra4pedagio100.percentual,
        formula: `${rstRegra4pedagio100.formula} = ${rstRegra4pedagio100.percentual}%`,
        requisitoDib: rstRegra4pedagio100.requisitos,
        idadeDib: `${this.formateObjToStringAnosMesesDias(rstRegra4pedagio100.idadeDib)}`,
        tempoDib: `${this.formateObjToStringAnosMesesDias(rstRegra4pedagio100.tempoContribuicaoDib)}`,
        tempoCompedagio: `${this.formateObjToStringAnosMesesDias(rstRegra4pedagio100.tempoContribuicaoPedagio)}`,
        dataDib: rstRegra4pedagio100.dataDib.format('DD/MM/YYYY'),
      };


      console.log(' -- Regra 4 ---');
      // console.log(this.seguradoTransicao);
      console.log(this.conclusoesRegra4);

      // fim do processo
      this.isUpdating = false;

    } catch (error) {
      console.log(error);
    }


  }



  public calcularRegra4() {

    let rstRegraPedagio100: any;
    let dataDib = this.dataAtual.clone();
    let idadeDib = this.seguradoTransicao.idadeFracionada;
    let tempoDePedagio = 0;
    let contribuicaoDiff = 0;
    let tempoFinalContrib = this.seguradoTransicao.contribuicaoFracionadoAnos;
    let diffEntreContribuicoes = this.seguradoTransicao.contribuicaoFracionadoAnos -
      this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103;

    let tempoDePedagioTotal = 0;
    const regra4TempoContrib = this.contribuicaoMin[this.seguradoTransicao.sexo];
    let tempoFinalContribAteDib = regra4TempoContrib;

    if (this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103 < regra4TempoContrib) {
      tempoDePedagio = ((regra4TempoContrib - this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103));
      contribuicaoDiff = (regra4TempoContrib - this.seguradoTransicao.contribuicaoFracionadoAnos);


      this.pedagioEmAnos = tempoDePedagio - diffEntreContribuicoes;
      this.pedagioEmDias = this.converterTempoAnosParaDias(this.pedagioEmAnos);

      tempoFinalContrib = regra4TempoContrib + this.pedagioEmAnos;
      tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;


      // tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;
      // idadeDib = idadeDib + tempoDePedagioTotal
      //  dataDib.add(tempoDePedagioTotal, 'years');
    }

    const rstContadorRegra4 = this.contadorRegra4();

    console.log('---- regra 4 ---- ');
    console.log(rstContadorRegra4);
    console.log('----');
    // console.log(diffEntreContribuicoes);
    // console.log(this.pedagioEmAnos);
    // console.log('--');


    tempoFinalContribAteDib = rstContadorRegra4.tempoContribuicaoDibAnos;
    idadeDib = rstContadorRegra4.idadeDibAnos;
    dataDib = rstContadorRegra4.dataDib;


    // console.log(contribuicaoDiff);
    // console.log(this.converterTempoAnos(contribuicaoDiff));
    // console.log(tempoDePedagio);
    // console.log(this.converterTempoAnos(tempoDePedagio));
    // console.log(tempoFinalContrib);
    // console.log(this.converterTempoAnos(tempoFinalContrib));



    rstRegraPedagio100 = {
      dataDib: dataDib,
      idadeDib: this.converterTempoAnos(idadeDib),
      tempoContribuicaoDib: this.converterTempoAnos(tempoFinalContribAteDib),
      tempoContribuicaoPedagio: this.converterTempoAnos(tempoFinalContrib),
      DiffDataAtualDib: 0,
      requisitos: regra4TempoContrib,
      pedagio: this.converterTempoAnos(tempoDePedagio),
    };

    return rstRegraPedagio100;

  }



  public requisitosRegra4(ano, sexo, idade, tempo_contribuicao) {

    const regra4Idade = this.contribuicaoIdadeMin[sexo];
    let regra4TempoContrib = this.contribuicaoMin[sexo];

    regra4TempoContrib += (sexo === 'md' || sexo === 'fd') ? this.pedagioEmDias : this.pedagioEmAnos;

    if ((tempo_contribuicao >= regra4TempoContrib) && (idade >= regra4Idade)) {
      return {
        status: true,
        ano: ano,
        idade: idade,
        tempo_contribuicao: tempo_contribuicao,
        requisitosTempo: regra4TempoContrib,
        requisitosIdade: regra4Idade
      };
    }

    return {
      status: false,
      ano: 0,
      tempo_contribuicao: 0,
      idade: 0,
      requisitosTempo: regra4TempoContrib,
      requisitosIdade: regra4Idade
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



    const correcaoAnoBissexto = this.contarBissextosEntre(
      this.seguradoTransicao.dataNascimento.format('YYYY'),
      auxiliarDate.format('YYYY')
    );

    if (correcaoAnoBissexto > 0) {
      auxiliarDate.add(correcaoAnoBissexto, 'days');
    }


    return {
      dataDib: auxiliarDate,
      idadeMoment: moment.duration(idade, 'days'),
      tempoContribuicaoDibMoment: moment.duration(tempoContribuicao, 'days'),
      idadeDib: this.converterTempoDias(idade),
      tempoContribuicaoDib: this.converterTempoDias(tempoContribuicao),
      idadeDibAnos: this.converterTempoDiasParaAnos(idade),
      tempoContribuicaoDibAnos: this.converterTempoDiasParaAnos(tempoContribuicao),
      DiffDataAtualDibMoment: moment.duration(count, 'days'),
      DiffDataAtualDib: this.converterTempoDias(count),
      DiffDataAtualDibAnos: this.converterTempoDiasParaAnos(count),
      requisitos: fimContador,
    };



  }





}
