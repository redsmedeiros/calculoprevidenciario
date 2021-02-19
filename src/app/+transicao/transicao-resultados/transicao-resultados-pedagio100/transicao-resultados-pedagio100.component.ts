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



  // public contribuicaoIdadeMin = {
  //   m: 60,
  //   md: 21900,
  //   f: 57,
  //   fd: 20805,
  // };

  // public contribuicaoMin = {
  //   m: 35,
  //   md: 12775,
  //   f: 30,
  //   fd: 10950,
  // };



  public contribuicaoIdadeMin = {
    m: 60,
    md: 21915,
    f: 57,
    fd: 20819.25,
  };

  public contribuicaoMin = {
    m: 35,
    md: 12783.75,
    f: 30,
    fd: 10957.5,
  };



  // public contribuicaoIdadeMin = {
  //   m: 60,
  //   md: 21915,
  //   f: 57,
  //   fd: 20819,
  // };

  // public contribuicaoMin = {
  //   m: 35,
  //   md: 12783,
  //   f: 30,
  //   fd: 10957,
  // };

  public pedagioEmDias = 0;
  public pedagioEmAnos = 0;
  public pedagioEmAnosRequisito = 0;
  public pedagioEmDiasRequisito = 0;
  public tempoFinalContrib = 0;



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
    idadeDibMoment: '',
  };




  constructor() {
    super(null);
  }

  ngOnInit() {

    //  this.conclusaoRegra4pedagio100();

  }

  ngOnChanges() {

    this.conclusaoRegra4pedagio100();

  }


  public aplicarRedutorProfessor() {

    if (this.seguradoTransicao.professor) {
      this.contribuicaoIdadeMin = {
        m: (60 - this.seguradoTransicao.redutorProfessor),
        md: (21915 - this.seguradoTransicao.redutorProfessorDias),
        f: (57 - this.seguradoTransicao.redutorProfessor),
        fd: (20819.25 - this.seguradoTransicao.redutorProfessorDias),
      };

      this.contribuicaoMin = {
        m: (35 - this.seguradoTransicao.redutorProfessor),
        md: (12783.75 - this.seguradoTransicao.redutorProfessorDias),
        f: (30 - this.seguradoTransicao.redutorProfessor),
        fd: (10957.5 - this.seguradoTransicao.redutorProfessorDias),
      };
    }

  }


  /**
   * A projeção é baseada no dia atual e no tempo de contribuição após a EC103/2019
   */
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
        tempoDib: rstRegra4pedagio100.tempoContribuicaoDib,
        tempoCompedagio: `${this.formateObjToStringAnosMesesDias(rstRegra4pedagio100.tempoContribuicaoPedagio)}`,
        dataDib: rstRegra4pedagio100.dataDib.format('DD/MM/YYYY'),
        idadeDibMoment: this.formateStringAnosMesesDias(
          rstRegra4pedagio100.idadeMoment.years(),
          rstRegra4pedagio100.idadeMoment.months(),
          rstRegra4pedagio100.idadeMoment.days()
        ),
      };


      // console.log(' -- Regra 4 ---');
      // console.log(rstRegra4pedagio100);
      //  // console.log(this.conclusoesRegra4);
      //   console.log(this.conclusoesRegra4);

      // fim do processo
      this.isUpdating = false;

    } catch (error) {
      console.log(error);
    }


  }



  public calcularRegra4() {

    let rstRegraPedagio100: any;
    const dataDib = this.dataAtual.clone();
    const idadeDib = this.seguradoTransicao.idadeFracionada;

    let tempoDePedagio = 0;
    let tempoDePedagioDias = 0;
    let contribuicaoDiff = 0;
    let tempoFinalContrib = this.seguradoTransicao.contribuicaoFracionadoAnos;
    let diffEntreContribuicoes = this.seguradoTransicao.contribuicaoFracionadoAnos -
                                  this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103;

    let tempoDePedagioTotal = 0;
    const regra4TempoContrib = this.contribuicaoMin[this.seguradoTransicao.sexo];
    const regra4TempoContribDias = this.contribuicaoMin[this.seguradoTransicao.sexo + 'd'];
    let tempoFinalContribAteDib = regra4TempoContrib;

    if (this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103 < regra4TempoContrib) {
      // console.log(this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103);
      // console.log(regra4TempoContrib);

      tempoDePedagio = ((regra4TempoContrib - this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103));
    //  contribuicaoDiff = (regra4TempoContrib - this.seguradoTransicao.contribuicaoFracionadoAnos);
     // contribuicaoDiff = (regra4TempoContrib - this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103);
     
      this.pedagioEmAnos = tempoDePedagio;
      // this.pedagioEmAnos = tempoDePedagio - diffEntreContribuicoes;
      this.pedagioEmDias = this.converterTempoAnosParaDias(this.pedagioEmAnos);

      // console.log(this.pedagioEmAnos);
      // console.log(this.pedagioEmAnos);

      tempoFinalContrib = regra4TempoContrib + this.pedagioEmAnos;
    //  tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;
      tempoDePedagioTotal =  tempoDePedagio * 2;

      // tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;
      // idadeDib = idadeDib + tempoDePedagioTotal
      // dataDib.add(tempoDePedagioTotal, 'years');
    }

    // console.log(regra4TempoContrib);
    // console.log(regra4TempoContribDias);
    // console.log(this.seguradoTransicao.contribuicaoFracionadoAnosAteEC103);
    // console.log(this.seguradoTransicao.contribuicaoFracionadoDiasAteEC103);
    // console.log(this.seguradoTransicao.contribuicaoFracionadoAnos);
    // console.log(this.seguradoTransicao.contribuicaoFracionadoDias);
    // console.log(tempoDePedagio);
    // console.log(tempoDePedagioDias);
    // console.log(contribuicaoDiff);
    // console.log(this.pedagioEmDias);
    // console.log(tempoDePedagioTotal);
    //console.log(contribuicaoDiff + tempoDePedagio);


    const VeificarRequisitoHoje = this.requisitosRegra4(
                                            this.dataAtual.format('YYYY'),
                                            this.seguradoTransicao.sexo,
                                            this.seguradoTransicao.idadeFracionada,
                                            this.seguradoTransicao.contribuicaoFracionadoAnos
                                          );

    let rstContadorRegra4: any;
    if (VeificarRequisitoHoje.status) {

      rstRegraPedagio100 = {
        dataDib: moment(moment(), 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0),
        idadeMoment: this.calcularIdade(dataDib),
        idadeDib: this.converterTempoAnos(idadeDib),
        tempoContribuicaoPedagio: this.converterTempoAnos(tempoFinalContrib),
        DiffDataAtualDib: 0,
        requisitos: regra4TempoContrib,
        pedagio: this.converterTempoAnos(tempoDePedagio),
        tempoContribuicaoDib: `${this.formateObjToStringAnosMesesDias(this.converterTempoAnos(tempoFinalContribAteDib))}`,
      };

    } else {

      rstContadorRegra4 = this.contadorRegra4();
      //console.log(rstContadorRegra4);

      rstRegraPedagio100 = {
        dataDib: rstContadorRegra4.dataDib,
        idadeMoment: rstContadorRegra4.idadeMoment,
        idadeDib: this.converterTempoAnos(rstContadorRegra4.idadeDibAnos),
        tempoContribuicaoPedagio: this.converterTempoAnos(tempoFinalContrib),
        DiffDataAtualDib: 0,
        requisitos: regra4TempoContrib,
        pedagio: this.converterTempoAnos(tempoDePedagio),
        tempoContribuicaoDibMoment: rstContadorRegra4.tempoContribuicaoDibMoment,
        tempoContribuicaoDib: this.formateStringAnosMesesDias(
          rstContadorRegra4.tempoContribuicaoDibMoment.years(),
          rstContadorRegra4.tempoContribuicaoDibMoment.months(),
          rstContadorRegra4.tempoContribuicaoDibMoment.days()
        )
      };

    }

    return rstRegraPedagio100;

  }



  public requisitosRegra4(ano, sexo, idade, tempo_contribuicao) {

    const regra4Idade = this.contribuicaoIdadeMin[sexo];
    let regra4TempoContrib = this.contribuicaoMin[sexo];
    regra4TempoContrib += (sexo === 'md' || sexo === 'fd') ? this.pedagioEmDias : this.pedagioEmAnos;
    this.pedagioEmAnosRequisito = this.contribuicaoMin[this.seguradoTransicao.sexo] + this.pedagioEmAnos;


    // console.log(this.contribuicaoMin[sexo]);
    // console.log(this.pedagioEmDias);
    // console.log(regra4TempoContrib);
    // console.log(this.pedagioEmAnosRequisito);

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

    // let auxiliarDate = this.dataAtual.clone();
    let auxiliarDate = (this.dataAtual.clone()).add(1, 'day');
   // let auxiliarDate = (moment('2019-11-13')).add(1, 'day');
   // let auxiliarDate = moment('2019-11-13');

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
    let idadeDibMoment;
    let tempoContribuicao = this.seguradoTransicao.contribuicaoFracionadoDias;
    // tempoContribuicao += 1;

    // let tempoContribuicao = this.seguradoTransicao.contribuicaoFracionadoDiasAteEC103;
    // console.log(this.seguradoTransicao);

    const sexo = this.seguradoTransicao.sexo + 'd';

    do {

      // console.log('P ' + count + ' - data - ' + auxiliarDate.format('DD/MM/YYYY')
      //   + '|' + 'idade -' + idade + '|'
      //   + '|' + 'Tempo - ' + tempoContribuicao + '|');

      // if (fimContador.status) {

      // console.log('F -' + count + ' data - ' + auxiliarDate.format('DD/MM/YYYY')
      //   + '|' + 'idade -' + idade + '|'
      //   + '|' + 'Tempo - ' + tempoContribuicao + '|'
      //   + '|');

      // }


      fimContador = this.requisitosRegra4(
        auxiliarDate.year(),
        sexo,
        idade,
        tempoContribuicao);


        count++;
        idade += 1;
        tempoContribuicao += 1;

        auxiliarDateClone = auxiliarDate.clone();
        auxiliarDate = moment(this.toDateString(auxiliarDateClone.add(1, 'days')), 'DD/MM/YYYY');

    } while (!fimContador.status && idade <= 54750);


    // const correcaoAnoBissexto = this.contarBissextosEntre(
    //   this.seguradoTransicao.dataNascimento,
    //   auxiliarDate
    // );

    // console.log(auxiliarDate)

    // if (correcaoAnoBissexto > 0) {
    //   auxiliarDate.add(correcaoAnoBissexto, 'days');
    // }

    // tempoContribuicao = this.seguradoTransicao.contribuicaoFracionadoDias + count;

    // idade = this.seguradoTransicao.idadeFracionadaDias + count;


    const requisitoIdadeT = (this.contribuicaoIdadeMin[this.seguradoTransicao.sexo] - this.seguradoTransicao.idadeFracionada);
    const requisitoTempoContribT = (this.pedagioEmAnosRequisito - this.seguradoTransicao.contribuicaoFracionadoAnos);

    // if (this.seguradoTransicao.contribuicaoFracionadoAnos >= this.pedagioEmAnosRequisito) {
    if (requisitoIdadeT > requisitoTempoContribT) {

      auxiliarDate = moment({
        year: auxiliarDate.year(),
        month: this.seguradoTransicao.dataNascimento.month(),
        day: this.seguradoTransicao.dataNascimento.date()
      });

      idadeDibMoment = this.calcularIdade(auxiliarDate);

    } else {

      const dateInfo = this.dataAtual.clone().add(1, 'day');
      auxiliarDate = dateInfo.add(requisitoTempoContribT, 'year');
      idadeDibMoment = this.calcularIdade(auxiliarDate);

    }

   

    // idadeDibMoment = this.calcularIdade(auxiliarDate);

    // let testeAtual = moment(moment(), 'DD/MM/YYYY').hour(0).minute(0).second(0).millisecond(0);
    // let teste = moment.duration(auxiliarDate.diff(testeAtual));


    // let testeDiff = (this.seguradoTransicao.contribuicaoFracionadoDias - this.seguradoTransicao.contribuicaoFracionadoDiasAteEC103);
    // console.log(count  + (this.seguradoTransicao.contribuicaoFracionadoDias ));
    // // tempoContribuicao = count  + (this.seguradoTransicao.contribuicaoFracionadoDias );


    // console.log(teste.asDays());
    // console.log('---');
    // console.log((moment()).add(count, 'days'));
    // console.log(this.converterTempoDias(tempoContribuicao));
    // console.log(moment.duration(tempoContribuicao, 'days'));
    // console.log('---');
    
    // console.log(moment.duration(tempoContribuicao, 'days'));
    // console.log(tempoContribuicao);
    
    return {
      dataDib: auxiliarDate,
      idadeMoment: idadeDibMoment,
      tempoContribuicaoDibMoment: moment.duration(tempoContribuicao, 'days'),
      idadeDib: this.converterTempoDias(idade),
      tempoContribuicaoDib: tempoContribuicao,
      idadeDibAnos: this.converterTempoDiasParaAnos(idade),
      tempoContribuicaoDibAnos: this.converterTempoDiasParaAnos(tempoContribuicao),
      DiffDataAtualDibMoment: moment.duration(count, 'days'),
      DiffDataAtualDib: this.converterTempoDias(count),
      DiffDataAtualDibAnos: this.converterTempoDiasParaAnos(count),
      requisitos: fimContador,
    };



  }





}
