import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { MoedaService } from 'app/services/Moeda.service';
import { Moeda } from 'app/services/Moeda.model';
import * as moment from 'moment';
import { RgpsResultadosApos99Component } from '../rgps-resultados-apos99.component';
import { AnimationsPanelComponent } from '../../../../+forms/+image-cropping/animations-panel/animations-panel.component';
import { CarenciaProgressivaService } from '../../CarenciaProgressiva.service';



@Component({
  selector: 'app-rgps-resultados-apos99-secundarios',
  templateUrl: './rgps-resultados-apos99-secundarios.component.html',
  styleUrls: ['./rgps-resultados-apos99-secundarios.component.css'],
  providers: [ CarenciaProgressivaService ]

})
export class RgpsResultadosApos99SecundariosComponent extends RgpsResultadosApos99Component implements OnInit {

  @Output() somaGlobalSalarioBeneficio = new EventEmitter()


  @Input() calculo;
  @Input() segurado;
  @Input() dadosPassoaPasso;
  @Input() listaValoresContribuidosPeriodosCT;
  @Input() numResultado;
  @Input() listaPeriodosCT;
  @Input() moeda;
  @Input() conclusoes;
  @Input() contribuicaoPrimaria
  @Input() fatorPrevidenciario
  @Input() expectativa 
  @Input() idadeFracionadaF

  public isUpdating = true;
  public tableData = [];
  public conclusoes22 = [];
  public rstFinalCalculosSecundarios = [];
  public id = 1
  public tabelaSc = []
  public indice = 0
  public tabelaDeCalculos = []
  public tabelaIterar = []
  public controle = 0
  public index = 0
  public conclusao = { isUpdating: 1, tableData: this.tableData, conclusoes: this.conclusoes22 }
  public concusoesSecundarias = [];
  public soma = 0
  public arrayResultadoParcial = []
  public arrayDeControleResutadoFinal = []
  public arrayDeControleTitulos = [
    "Soma dos Salários de Contribuição Considerados",
    "Divisor da Média dos Salários de Contribuição",
    "Média dos Salários de Contribuição",
    "Salário de Benefício"
  ]
  public resultadoFinal = [[]]
  public divisorMediaSecundario
  public mediaSalarioContribuicao
  public indexParaArrayRF = 0
  public beneficioAtividadesConcomitantes
  public idSoma = []
  public contadorSecundario = 0
  public arrayRevisadaOrdenada = []
  public mesesContribuicoes = []
  public divisorSecundario
  public isDivisorMinimo
  public arrayParaDivisorSecundario = []
  public indiceParaDivisorSecundario = 0
  public indiceCasoNaoTenhaLimitado = 0
  public somaSalariosSecundarios = 0

  public arrayParaResultadoFinal = []





  constructor(private carenciaProgressivaService: CarenciaProgressivaService) {

    super(null, null, null, null, null, null, null, null);

  }

  ngOnInit() {

    this.isUpdating = false;

    this.startCalculosSecundarios();

   



   


  }



  private startCalculosSecundarios() {





    for (const periodoSec of this.listaPeriodosCT) {



      if (this.isExits(periodoSec.concomitantes) && periodoSec.secundario === 1) {
        this.rstFinalCalculosSecundarios.push(
          periodoSec
        )
      }
    }



    for (const row of this.rstFinalCalculosSecundarios) {

      // row.sc.sort((a, b) => {

      //   const dib1 = moment(a.cp, '01/MM/YYYY');
      //   const dib2 = moment(b.cp, '01/MM/YYYY');

      //   if (dib1.isSame(dib2)) {
      //     return dib1 > dib2 ? -1 : 1
      //   } 

      // });

      row.sc.reverse();
      this.tabelaSc.push(row.sc);

    }

    let dataComparacao = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    if (dataComparacao.isSameOrAfter('2019-11-13')) {
      dataComparacao = moment('13/11/2019', 'DD/MM/YYYY');
    }

    dataComparacao = (dataComparacao.clone()).startOf('month');
    let moedaComparacao = (dataComparacao.isSameOrBefore(moment(), 'month')) ? this.getMoedaBydate(dataComparacao) : undefined;



    for (const row of this.tabelaSc) {



      for (const indice of row) {

        const fatorCorrecao = this.getFatorCorrecao(moment(indice.cp, 'MM/YYYY'), moedaComparacao)



        const slBeneficioMes = this.limitarTetosEMinimosSec(
          (indice.sc * fatorCorrecao),
          moment(indice.cp, 'MM/YYYY')
        );



        if (slBeneficioMes.aviso == "LIMITADO AO TETO") {
          this.contadorSecundario++
        } else {
          this.indiceCasoNaoTenhaLimitado++
        }

        this.soma = this.soma + slBeneficioMes.valor


        let tabelaRow = {
          id: this.id++,
          competencia: indice.cp,
          indice_corrigido: this.formatDecimal(fatorCorrecao, 6),
          contribuicao_secundaria: this.formatMoney(indice.sc),
          contribuicao_secundaria_revisada: this.formatMoney(slBeneficioMes.valor),
          contribuicao_secundaria_revisada_n: slBeneficioMes.valor,
          limite: slBeneficioMes.aviso
        }

        this.tabelaIterar.push(tabelaRow);
        for (const row of this.tabelaIterar) {
          this.indiceParaDivisorSecundario = row.id
        }
      }

      //this.formatarDivisor(this.tabelaIterar) < 129 ? 129 :
      const divisor = this.formatarDivisor(this.tabelaIterar)

      const divisorSecundario =  this.formatarDivisor(this.tabelaIterar)

      const tempoContribuicao = this.getContribuicaoTempo(this.contribuicaoPrimaria)
     
      const dividendoTempo = this.getTempoContribuicaoExigido(tempoContribuicao, this.id) 



      this.arrayDeControleResutadoFinal = [
        this.formatMoney(this.soma),
        divisorSecundario,
        this.mediaSalarioContribuicao = this.formatMoney(this.soma / divisorSecundario),
        this.beneficioAtividadesConcomitantes = this.getBeneficioDecorrenteAtividadeConcomitante(divisorSecundario, 196, dividendoTempo)


      ];


      for (let i = 0; i < this.arrayDeControleTitulos.length; i++) {

        let resultadoParcial = {
          titulo: this.arrayDeControleTitulos[i],
          resultado: this.arrayDeControleResutadoFinal[i]
        }

        this.arrayResultadoParcial.push(resultadoParcial)

        this.resultadoFinal[this.indexParaArrayRF] = this.arrayResultadoParcial

      }

      this.arrayResultadoParcial = []

      this.indexParaArrayRF++


      this.idSoma[row] = this.id
      this.mesesContribuicoes[this.controle] = this.idSoma[row]

      //problema com receber mesesContribuiçoes em array e usar o metodo de divisor



      this.soma = 0
      this.id = 1
      this.tabelaDeCalculos[this.controle] = this.tabelaIterar
      this.arrayParaDivisorSecundario[this.controle] = this.indiceParaDivisorSecundario
      this.controle++
      this.tabelaIterar = []

      this.indiceParaDivisorSecundario = 0
      this.concusoesSecundarias.push(this.conclusao);

      this.arrayParaResultadoFinal.push(this.arrayDeControleResutadoFinal)
      
      this.somaGlobalSalarioBeneficio.emit(this.arrayParaResultadoFinal)
    }

    this.tableData = this.tabelaDeCalculos
    






  }



  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != '' && value != null && value != 'null' &&
      value !== undefined && value !== [] && value !== '[]') ? true : false;
  }


  public formatarDivisor(tabelaInsert) {

    // Ordenar os salarios por valor


    const tabela = tabelaInsert.sort((x, y) => { return x.contribuicao_secundaria_revisada - y.contribuicao_secundaria_revisada })




    this.arrayRevisadaOrdenada.push(tabela)


    this.isDivisorMinimo = (!this.calculo.divisor_minimo) ? true : false;

    let divisorSecundario = (this.contadorSecundario == 0) ? this.indiceCasoNaoTenhaLimitado : this.contadorSecundario



    //let divisorSecundario = this.contadorSecundario;


    if (divisorSecundario < this.mesesContribuicoes[this.controle] * 0.6) {
      divisorSecundario = Math.round(this.mesesContribuicoes[this.controle] * 0.6);
    } else if (divisorSecundario < this.mesesContribuicoes[this.controle] * 0.8) {
      divisorSecundario = Math.round(this.mesesContribuicoes[this.controle] * 0.8);
    }




    tabelaInsert.sort((x, y) => { return x.id - y.id })

    return divisorSecundario

  }

  // define divisor para média











  // private formatMoney(value:number, sigla = 'R$', aplicarCor = false) {

  //   if (typeof value === 'number') {
  //     let numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  //     // let string = sigla + this.formatDecimal(value, 2);
  //     let string = sigla + ' ' + numeroPadronizado;
  //     if (aplicarCor && string.indexOf('-') != -1) {
  //       string = '<span style="color:red">' + string + '</span>';
  //     }
  //     return string;
  //   } else {
  //     return sigla + ' 0,00';
  //   }
  // }



  private getFatorCorrecao(dataContribuicao, moedaComparacao) {

    const moedaContribuicao = (dataContribuicao.isSameOrBefore(moment(), 'month')) ? this.getMoedaBydate(dataContribuicao) : undefined;

    let fator = 1;
    let fatorLimite = 1;

    // definição de indices de correção
    if ((!this.pbcCompleto)) {

      fator = (moedaContribuicao) ? moedaContribuicao.fator : 1;
      fatorLimite = (moedaComparacao) ? moedaComparacao.fator : 1;

    } else {

      // this.pbcCompletoIndices = (this.isExits(this.route.snapshot.params['correcao_pbc'])) ?
      // this.route.snapshot.params['correcao_pbc'] : 'inpc1084';

      switch (this.getPbcCompletoIndices()) {
        case 'inpc1085':
          fator = (moedaContribuicao) ? moedaContribuicao.fator_pbc_inpc1085ortn : 1;
          fatorLimite = (moedaComparacao) ? moedaComparacao.fator_pbc_inpc1085ortn : 1;
          break;
        case 'inpc1088':
          fator = (moedaContribuicao) ? moedaContribuicao.fator_pbc_inpc1088ortn : 1;
          fatorLimite = (moedaComparacao) ? moedaComparacao.fator_pbc_inpc1088ortn : 1;
          break;
        default: // inpc1084 == fator_pbc
          fator = (moedaContribuicao) ? moedaContribuicao.fator_pbc : 1;
          fatorLimite = (moedaComparacao) ? moedaComparacao.fator_pbc : 1;
          break;
      }

    }

    return (moedaContribuicao) ? (fator / fatorLimite) : 1;

  }


  private getMoedaBydate(date) {
    return this.moeda.find(x => (date.isSame(x.data_moeda, 'month')));
  }


  private limitarTetosEMinimosSec(valor, data, sc_mm_ajustar = true) {
    // se a data estiver no futuro deve ser utilizado os dados no mês atual


    const moeda = data.isSameOrBefore(moment(), 'month') ? this.getMoedaBydate(data) : this.getMoedaBydate(moment());

    const salarioMinimo = parseFloat((moeda) ? moeda.salario_minimo : 0);
    const tetoSalarial = parseFloat((moeda) ? moeda.teto : 0);
    let avisoString = '';
    let valorRetorno = valor;



    if (moeda && valor < salarioMinimo && sc_mm_ajustar) {
      valorRetorno = salarioMinimo;
      avisoString = 'LIMITADO AO MÍNIMO'
    } else if (moeda && valor > tetoSalarial) {
      valorRetorno = tetoSalarial;
      avisoString = 'LIMITADO AO TETO'
    }

    if (typeof valorRetorno !== 'number') {
      valorRetorno = parseFloat(valorRetorno);
    }

    return { valor: valorRetorno, aviso: avisoString };
  }

  public getSalarioBeneficio(conclusoes) {

    let valor = conclusoes[6].value

    if (valor === "") {
      valor = 0;
    } else {
      valor = valor.replace(".", "");
      valor = valor.replace(",", ".");
      valor = valor.replace("R", " ");
      valor = valor.replace("$", " ");
      valor = parseFloat(valor);
    }


    return valor;
  }

  public getMediaSalarioConcomitante(valor) {

    if (valor === "") {
      valor = 0;
    } else {
      valor = valor.replace(".", "");
      valor = valor.replace(",", ".");
      valor = valor.replace("R", " ");
      valor = valor.replace("$", " ");
      valor = parseFloat(valor);
    }

    return valor;

  }

  public getContribuicaoTempo(tempo) {

    let anos = tempo.anos

    return anos
  }

  public getTempoContribuicaoExigido(contribuicao, mesesContribuicao) {

   


    let resultado = (Math.floor(mesesContribuicao / 12) / contribuicao) < 1 ? (mesesContribuicao / 12) / contribuicao : (Math.floor(mesesContribuicao / 12) / contribuicao)

    return resultado
  }

  public getBeneficioDecorrenteAtividadeConcomitante(divisorSecundario, totalContribuicoes, dividendoTempo){

      let media = (this.getMediaSalarioConcomitante(this.mediaSalarioContribuicao)/(this.id - 1))
     
      let mediaFormatada = this.replaceFormata(this.formatDecimal(media,3))
   
      let fatorFomatado = this.getFatorContribuicaoSecundario(this.id, this.expectativa, this.idadeFracionadaF)
      
      let divisor = this.getDivisorComCarencia(1991, divisorSecundario)
      let divisorFormatado = this.replaceFormata(divisor)
     
      let valor = mediaFormatada * fatorFomatado * divisorFormatado
    
      
      let beneficio =  valor + this.getMediaSalarioConcomitante(this.mediaSalarioContribuicao) * dividendoTempo

      this.somaSalariosSecundarios += beneficio
   
    
      return this.formatMoney(beneficio);

    
  }

  public replaceFormata(valor) {

    if (valor === "") {
      valor = 0;
    } else {
     
      valor = valor.replace(",", ".");
      valor = parseFloat(valor);
     
    }

    return valor;

  }

  public getFatorContribuicaoSecundario(id, expectativa, idadeFracionadaF){

    let tempoTotalContribuicaoF = id - 1 

    let tempoTotalDeContribuicaoEmAnos = (tempoTotalContribuicaoF / 12)

    const aliquota = 0.31

    let fator = ((tempoTotalDeContribuicaoEmAnos * aliquota) / expectativa)
    * (1 + (idadeFracionadaF + ( tempoTotalDeContribuicaoEmAnos * aliquota)) / 100);

  

    //if(fator < 1){
       //fator = 1
    //}
   
  

    return fator

  }

  public getDivisorComCarencia(ano, divisor){

    let carencia = this.carenciaProgressivaService.getCarencia(ano)

    let DivisorComCarencia = (divisor / carencia)



    return this.formatDecimal(DivisorComCarencia, 3)



  }

  public getSomaDosBeneficios(salarioBeneficioPrimario){

      let soma = this.somaSalariosSecundarios + salarioBeneficioPrimario

      return this.formatMoney(soma)
  }

  public getRendaMensalInicial(somaDosSalariosDeBenefio){

    let renda = somaDosSalariosDeBenefio * 0.85

    return this.formatMoney(renda)
  }

  

  





}
