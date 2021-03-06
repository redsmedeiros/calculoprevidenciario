import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { MoedaService } from 'app/services/Moeda.service';
import { Moeda } from 'app/services/Moeda.model';
import * as moment from 'moment';
import { RgpsResultadosApos99Component } from '../rgps-resultados-apos99.component';
import { AnimationsPanelComponent } from '../../../../+forms/+image-cropping/animations-panel/animations-panel.component';
import { CarenciaProgressivaService } from '../../CarenciaProgressiva.service';
import { TimelineComponent } from '../../../../+app-views/+timeline/timeline.component';



@Component({
  selector: 'app-rgps-resultados-apos99-secundarios',
  templateUrl: './rgps-resultados-apos99-secundarios.component.html',
  styleUrls: ['./rgps-resultados-apos99-secundarios.component.css'],
  providers: [CarenciaProgressivaService]

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
  @Input() divisorConcomitante
  @Input() tipoBeneficio
  @Input() dataInicioBeneficio
  @Input() passarMesesCarencias
  @Input() moedaDibSec
  @Input() listaPeriodosCTSec
  @Input() tempoDeContribuicaoEspecial
  @Input() listaPeriodosCTRST
  @Input() carenciaProgressiva;



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
    "Soma dos Sal??rios de Contribui????o Considerados",
    "Divisor da M??dia dos Sal??rios de Contribui????o",
    "M??dia dos Sal??rios de Contribui????o",
    "Form??la do Fator Previdenci??rio (Secund??rio)",
    "Fator Previd??nci??rio (Secund??rio)",
    "Teto do Sal??rio de Contruibui????o",
    "Percentual do Sal??rio de Benef??cio",

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
  public numeroEspecie = 0
  public fatorResultadoSecundario = { fator: 0, fatorString: 0, formula_fator: '' };
  public tetoDeContribuicaoSecundaria
  public conclusoesParaFator = []
  public anulaFator = false
  private filtroGetTempo
  public resultadoTempoDeContrubuicao
  public divisorParaCarencia




  constructor(private carenciaProgressivaService: CarenciaProgressivaService) {

    super(null, null, null, null, null, null, null, null);

  }

  ngOnInit() {

    this.isUpdating = false;
    this.startCalculosSecundarios();


  }





  private startCalculosSecundarios() {


    //LISTA DE PER??ODOS: OBTEM A QUANTIDADE DE PERIODOS CONCOMITANTES
    for (const periodoSec of this.listaPeriodosCTSec) {


      if (this.isExits(periodoSec.concomitantes) && periodoSec.secundario === 1) {
        //CRIA ARRAY COM TODOS AS INFORMA????ES CONCOMITANTES
        this.rstFinalCalculosSecundarios.push(
          periodoSec
        )
      }


    }

    this.filtroGetTempo = this.rstFinalCalculosSecundarios;

  


    //CRIA ARRAY COM INFORMA????O DE CADA CONTRIBUI????O SECUND??RIA
    for (const row of this.rstFinalCalculosSecundarios) {

      row.sc.reverse();
      //this.tabelaSc.push(row.sc);

      this.tabelaSc.push({
        sc: row.sc,
        sc_mm_ajustar: row.sc_mm_ajustar
      });

    }
    //RECEBE DO ARRAY DE CALCULOS A INFORMA????O DE DATA PEDIDO BENEF??CIO
    let dataComparacao = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');

    if (dataComparacao.isSameOrAfter('2019-11-13')) {
      dataComparacao = moment('13/11/2019', 'DD/MM/YYYY');
    }

    dataComparacao = (dataComparacao.clone()).startOf('month');
    let moedaComparacao = (dataComparacao.isSameOrBefore(moment(), 'month')) ? this.getMoedaBydate(dataComparacao) : undefined;


    //ITERAR ARRAY COM AS INFORMA????E SECUNDARIAS PARA OBTER O C??LCULO FINAL
    for (const row of this.tabelaSc) {
   
      //OBTER AS INFORMA????ES DE CADA CONTRIBUI????O SECUND??RIA
      for (const item of row.sc) {




        const fatorCorrecao = this.getFatorCorrecao(moment(item.cp, 'MM/YYYY'), moedaComparacao)

        //console.log(item.sc)
        //console.log(fatorCorrecao);
        //console.log(this.formatDecimalValue(item.sc));

        //CHAMAR M??TODO DE LIMITES: PASSAR - SAL??RIO DE CONTRIBUI????O X FATOR DE CONTRIBUI????O E DATA DA CONTRIBUI????O

        const salarioContribuicaoAjustado = this.limitarTetosEMinimosSec(
          this.formatDecimalValue(item.sc),
          moment(item.cp, 'MM/YYYY'),
          (row.sc_mm_ajustar === 1 && item.msc === 1)
        );


        const slBeneficioMes = {
          valor: (salarioContribuicaoAjustado.valor * fatorCorrecao),
          aviso: salarioContribuicaoAjustado.aviso
        }
        
        // this.limitarTetosEMinimosSec(
        //   (this.formatDecimalValue(item.sc) * fatorCorrecao),
        //   moment(item.cp, 'MM/YYYY')
        // );



        if (slBeneficioMes.aviso == "LIMITADO AO TETO") {
          this.contadorSecundario++
        } else {
          this.indiceCasoNaoTenhaLimitado++
        }

        //SOMA DOS SAL??RIOS DE BENEF??CIO

        this.soma = this.soma + slBeneficioMes.valor

        //CRIA UM OJETO COM AS DEVIDAS INFORMA????ES
        let tabelaRow = {
          id: this.id++,
          competencia: item.cp,
          indice_corrigido: this.formatDecimal(fatorCorrecao, 6),
          contribuicao_secundaria: this.formatMoney(salarioContribuicaoAjustado.valor),
          contribuicao_secundaria_revisada: this.formatMoney(slBeneficioMes.valor),
          contribuicao_secundaria_revisada_n: slBeneficioMes.valor,
          limite: slBeneficioMes.aviso
        }
        //CRIA UMA ARRAY COM OS OBJETOS
        this.tabelaIterar.push(tabelaRow);
        //CRIA INDICE PARA ACHAR O DIVISOR DAS CONTRIBUI????ES SECUND??RIAS
        for (const row of this.tabelaIterar) {
          this.indiceParaDivisorSecundario = row.id
        }
      }



      //this.formatarDivisor(this.tabelaIterar) < 129 ? 129 :
      // const divisor = this.formatarDivisor(this.tabelaIterar)

      const divisorSecundario = this.formatarDivisor(this.tabelaIterar)
      const tempoContribuicao = this.getContribuicaoTempo(this.contribuicaoPrimaria)
      const dividendoTempo = this.getTempoContribuicaoExigido(tempoContribuicao, this.id)


      //const fatorC = this.getFatorContribuicaoSecundario( this.tabelaIterar.length,
      //this.expectativa,
      //this.idadeFracionadaF)





      let anulaFator = false ? this.anulaFator : true

      this.getValoresOitentaPorCento(this.tabelaIterar, divisorSecundario);

      this.mediaSalarioContribuicao = this.formatMoney(this.soma / divisorSecundario);
      this.beneficioAtividadesConcomitantes = this.getBeneficioDecorrenteAtividadeConcomitante(divisorSecundario, 196, dividendoTempo);


      let fatorC = this.conclusoesParaFator.filter(x => x.order === 4);



      //const index = fatorC.findIndex( (element) => element.value);


      this.arrayDeControleResutadoFinal = [
        this.formatMoney(this.soma),
        divisorSecundario,
        this.mediaSalarioContribuicao,
        this.fatorResultadoSecundario.formula_fator,
        fatorC[0].value,
        this.formatMoney(this.moedaDibSec.teto),
        this.beneficioAtividadesConcomitantes,

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

      //problema com receber mesesContribui??oes em array e usar o metodo de divisor

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

    this.resultadoTempoDeContrubuicao = this.getTempoDeContribuicao()

  }



  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != '' && value != null && value != 'null' &&
      value !== undefined && value !== [] && value !== '[]') ? true : false;
  }

  //PASSA COMO PAR??METRO AS CONTRIBUI????ES SECUND??RIAS PARA ENCONTRAR O DIVISOR SECUND??RIO
  public formatarDivisor(tabelaInsert) {


    // // ORDENA OS SAL??RIOS PELO VALOR USANDO O M??TODO SORT E RETORNA O PR??PRIO ARRAY - CALCULA A DIFEREN??A DE VALORES ENTRE OS MESES
    // const tabela = tabelaInsert.sort((x, y) => { return x.contribuicao_secundaria_revisada - y.contribuicao_secundaria_revisada })
    // //CRIA ARRAY COM AS DIFEREN??AS
    // this.arrayRevisadaOrdenada.push(tabela)
    // this.isDivisorMinimo = (!this.calculo.divisor_minimo) ? true : false;

    // let divisorSecundario = (this.contadorSecundario == 0) ? this.indiceCasoNaoTenhaLimitado : this.contadorSecundario

    // //let divisorSecundario = this.contadorSecundario;
    // if (divisorSecundario < this.mesesContribuicoes[this.controle] * 0.6) {
    //   divisorSecundario = Math.round(this.mesesContribuicoes[this.controle] * 0.6);
    // } else if (divisorSecundario < this.mesesContribuicoes[this.controle] * 0.8) {
    //   divisorSecundario = Math.round(this.mesesContribuicoes[this.controle] * 0.8);
    // }

    // tabelaInsert.sort((x, y) => { return x.id - y.id });

    //console.log(this.calculo.divisor_minimo)

    this.isDivisorMinimo = (!this.calculo.divisor_minimo) ? true : false;




    let divisorSecundarioAtual = tabelaInsert.length;

    if (this.isDivisorMinimo) {



      if (divisorSecundarioAtual < this.divisorConcomitante && (![1, 2].includes(this.tipoBeneficio))) {

        divisorSecundarioAtual = this.divisorConcomitante;

        return divisorSecundarioAtual

      } else if (divisorSecundarioAtual < tabelaInsert.length * 0.8 || [1, 2].includes(this.tipoBeneficio)) {

        divisorSecundarioAtual = Math.floor(tabelaInsert.length * 0.8);
        this.divisorParaCarencia = divisorSecundarioAtual

        return divisorSecundarioAtual;

      }

    }

  }


  //M??TODO PARA OBTER O FATOR DE CORRE????O
  private getFatorCorrecao(dataContribuicao, moedaComparacao) {

    const moedaContribuicao = (dataContribuicao.isSameOrBefore(moment(), 'month')) ? this.getMoedaBydate(dataContribuicao) : undefined;

    let fator = 1;
    let fatorLimite = 1;

    // defini????o de indices de corre????o
    if ((!this.pbcCompleto)) {

      fator = (moedaContribuicao) ? moedaContribuicao.fator : 1;
      fatorLimite = (moedaComparacao) ? moedaComparacao.fator : 1;

    } else {


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

  //M??TODO PARA RECEBER A REQUIS??O DA MOEDA DE ACORDO COM A DATA
  private getMoedaBydate(date) {
    return this.moeda.find(x => (date.isSame(x.data_moeda, 'month')));
  }

  //M??TODO PARA LIMITAR VALORES AO M??NIMO E AO TETO
  private limitarTetosEMinimosSec(valor, data, sc_mm_ajustar = true) {

    const moeda = data.isSameOrBefore(moment(), 'month') ? this.getMoedaBydate(data) : this.getMoedaBydate(moment());

    const salarioMinimo = parseFloat((moeda) ? moeda.salario_minimo : 0);
    const tetoSalarial = parseFloat((moeda) ? moeda.teto : 0);
    let avisoString = '';
    let valorRetorno = valor;

    //console.log((moeda && valor < salarioMinimo && sc_mm_ajustar))
    //console.log((valor < salarioMinimo))
    //console.log((sc_mm_ajustar))
    //console.log((valor))


    if (moeda && valor < salarioMinimo && sc_mm_ajustar) {
      valorRetorno = salarioMinimo;
      avisoString = 'LIMITADO AO M??NIMO'
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

  //M??TODO PARA TRANSFORMAR VALOR STRING EM FLOAT
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

  //M??TODO PARA OBTER O TEMPO DE CONTRIBUI????O EXIGIDO
  public getTempoContribuicaoExigido(contribuicao, mesesContribuicao) {

    let resultado = (Math.floor(mesesContribuicao / 12) / contribuicao) < 1 ? (mesesContribuicao / 12) / contribuicao : (Math.floor(mesesContribuicao / 12) / contribuicao)


    return resultado
  }

  //FUN????O PRINCIPAL: VALOR ?? IGUAL A M??DIA MULTIPLICADA PELO FATOR PREVIDENCIARIO, VEZES FRA????O DA CAR??NCIA
  public getBeneficioDecorrenteAtividadeConcomitante(divisorSecundario, totalContribuicoes, dividendoTempo) {

    let media = this.mediaSalarioContribuicao;




    //C??LCULO M??DIA: DIVIDIR M??DIA DE SAL??RIO PELO DIVISOR (ENTENDER COMO SER?? FEITO O DIVISOR)
    // let media = (this.getMediaSalarioConcomitante(this.mediaSalarioContribuicao) / (this.id - 1))


    let mediaFormatada = this.getMediaSalarioConcomitante(media)


    //RECEBE O FATOR DE CONTRIBUI????O
    let fatorFomatado = this.getFatorContribuicaoSecundario(
      this.tabelaIterar.length,
      this.expectativa,
      this.idadeFracionadaF);



    //let divisorFormatado = this.formatarDivisor(divisorSecundario)

    let divisor
    let divisorFormatado



    //VERIFICA O TIPO DE BENEF??CIO E O DIVISOR QUE SER?? UTILIZADO
    if ([1, 2, 3, 31, 16, 1900, 1901, 1903].includes(this.tipoBeneficio)) {

      //RECEBE DIVISOR COM CAR??NCIA

      divisor = this.getDivisorComCarencia(this.passarMesesCarencias, this.tabelaIterar.length)

      divisorFormatado = divisor

    } else {
      //DIVIDE POR 12 PARA ENCONTRAR O VALOR EM ANOS E VERIFICA
      let verificaDivisor = this.tabelaIterar.length / 12

      //SE INTEIRO MAIOR OU IGUAL A UM - OBTEM O TEMPO EXIGIDO E REALIZA A DIVIS??O
      if (Number.isInteger(verificaDivisor) && verificaDivisor >= 1) {


        if (this.anulaFator) {

          divisor = this.getCarenciaTempo()

          divisorFormatado = divisor

        } else {

          divisor = verificaDivisor / this.getContribuicaoTempo(this.contribuicaoPrimaria)
          divisorFormatado = divisor

        }



        //SE VALOR MENOR QUE UM RECEBER?? UM DIVISOR ZERADO 
      } else if (verificaDivisor < 1) {

        divisor = 0
        divisorFormatado = divisor
      }

    }

    //CALCULO PRINCIPAL - MEDIAS DOS SALARIOS X FATOR PREVIDENCI??RIO X DIVISOR OBTIDO



    let filtro = this.conclusoesParaFator.filter(x => x.order === 4)




    let valor = filtro[0].aplica === false ? (mediaFormatada * divisorFormatado) : (mediaFormatada * fatorFomatado * divisorFormatado)




    let beneficio = valor //+ this.getMediaSalarioConcomitante(this.mediaSalarioContribuicao) * dividendoTempo

    this.somaSalariosSecundarios += beneficio



    return this.formatMoney(Math.floor(beneficio * 100) / 100);


  }

  public replaceFormata(valor) {

    if (valor === "") {
      valor = 0;
    } else {

      valor = valor.replace(",", ".");
      valor = parseFloat(valor);

    }

    return valor;
    //0,9038581428571429
  }

  //FUN????O DE C??LCULO DO FATOR DE CONTRIBUI??AO
  public getFatorContribuicaoSecundario(id, expectativa, idadeFracionadaF) {

    const tempoContribuicaoMaisIdade = id + idadeFracionadaF;
    let tempoTotalContribuicaoF = id
    let tempoTotalDeContribuicaoEmAnos = (tempoTotalContribuicaoF / 12)
    const aliquota = 0.31

    this.fatorResultadoSecundario.fator = ((tempoTotalDeContribuicaoEmAnos * aliquota) / expectativa)
      * (1 + (idadeFracionadaF + (tempoTotalDeContribuicaoEmAnos * aliquota)) / 100);

    this.fatorResultadoSecundario.fatorString = this.formatDecimal(this.fatorResultadoSecundario.fator, 2);

    // Adicionar nas conclus??es a f??rmula com os valores, n??o os resutlados:
    this.fatorResultadoSecundario.formula_fator = '((' + this.formatDecimal(tempoTotalDeContribuicaoEmAnos, 4) + ' * '
      + this.formatDecimal(aliquota, 2) + ') / '
      + this.formatDecimal(expectativa, 2) + ') * (1 + ('
      + this.formatDecimal(idadeFracionadaF, 4) + ' + ('
      + this.formatDecimal(tempoTotalDeContribuicaoEmAnos, 4) + ' * '
      + this.formatDecimal(aliquota, 2) + ')) / ' + '100)';



    if (![0, 7, 17, 18, 19, 1903, 1905].includes(this.tipoBeneficio)) {
      this.aplicacaoRegraPontosSecundaria(tempoContribuicaoMaisIdade, id, this.conclusoesParaFator);


      if (this.anulaFator) {
        this.fatorResultadoSecundario.fator = 1
        this.fatorResultadoSecundario.formula_fator = "1"
      }
    }


    return this.fatorResultadoSecundario.fator;

  }

  
  public getCarenciaMinimaPorBeneficioSec() {

    let carenciaMinima = 0;
    switch (this.tipoBeneficio) {
      case 1: //Aux??lio Doen??a
      case 2: // Aposentadoria por Invalidez ou Pens??o por Morte
      case 17: // Aux??lio Acidente
      case 18: // Aux??lio Acidente
      case 19: // Aux??lio Acidente
        carenciaMinima = 12;
        break;
      case 3: //Aposentadoria por Idade
      case 16:
        carenciaMinima = (this.isExits(this.carenciaProgressiva)) ? this.carenciaProgressiva : 180;
        break;
    }

    return carenciaMinima;
    
  }
  


  //FUN????O QUE RETORNA O DIVISOR COM CAR??NCIA - RECEBE O DIVISOR DE CADA SECUND??RIO
  public getDivisorComCarencia(ano, divisor) {

    const carenciaMinimaEspecie = this.getCarenciaMinimaPorBeneficioSec();

    if ([1, 2, 3, 16, 17, 18, 19, 1900, 1901, 1903, 1905].includes(this.tipoBeneficio)) {

      return this.tabelaIterar.length / carenciaMinimaEspecie
    }

    let anos = ano

    //let carencia = this.carenciaProgressivaService.getCarencia(ano

    let DivisorComCarencia = Math.floor((divisor / anos) * 100000000) / 100000000


    return DivisorComCarencia
  }

  //SOMA DOS SAL??RIOS PRIM??RIOS COM SECUND??RIOS - PARA O RESULTADO GLOBAL
  public getSomaDosBeneficios(salarioBeneficioPrimario) {

    let soma = this.somaSalariosSecundarios + salarioBeneficioPrimario

    return this.formatMoney(soma)
  }

  public getRendaMensalInicial(somaDosSalariosDeBenefio) {

    let renda = somaDosSalariosDeBenefio * 0.85

    return this.formatMoney(renda)
  }



  public aplicacaoRegraPontosSecundaria(tempoContribuicaoMaisIdade, tempoTotalContribuicao, conclusoes) {

    const requitoPontos = this.getRequisitoPontos();

    if (requitoPontos.status && (this.tipoBeneficio === 4 || this.tipoBeneficio === 6)) {

      const pontosNecessarios = requitoPontos.requistos[this.segurado.sexo];
      const labelPontos = `${requitoPontos.requistos['f']}/${requitoPontos.requistos['m']}`

      let adicionalProf = 0; // se professor adiciona 5 anos aos pontos que o professor possue
      if ((this.tipoBeneficio === 6 || this.tipoBeneficio === '6')) {
        adicionalProf = 5;
      }

      if (tempoTotalContribuicao >= requitoPontos.tempoMinContribuicao[this.segurado.sexo]
        && (tempoContribuicaoMaisIdade + adicionalProf) >= pontosNecessarios
        && this.fatorResultadoSecundario.fator < 1
      ) {

        conclusoes.push({
          order: 4,
          tipo: 'fator',
          string: 'Fator Previdenci??rio',
          aplica: false,
          value: ''
            + ` (Afastado por ser menos vantajoso - Aplicada a regra ${labelPontos})`
        });

        this.fatorPrevidenciario = 1;

      } else {

        const textoFator = (this.fatorResultadoSecundario.fator > 1) ? '  (Aplicado por ser mais vantajoso)' : ''

        conclusoes.push({
          order: 4,
          tipo: 'fator',
          aplica: true,
          string: 'Fator Previdenci??rio', value: this.formatDecimal(this.fatorResultadoSecundario.fator, 4)
            + textoFator
        });

      }

    } else {


      let textComplementar = '';
      let fatorText = this.fatorResultadoSecundario.fator;




      if (this.tipoBeneficio === 16 || // Aposentadoria Travalhador Rural
        this.tipoBeneficio === 25 || // Deficiencia Grave
        this.tipoBeneficio === 26 || // Deficiencia Leve
        this.tipoBeneficio === 27 || // Deficiencia Moderada
        this.tipoBeneficio === 5 ||
        this.tipoBeneficio === 1 ||
        this.tipoBeneficio === 2 ||
        this.tipoBeneficio === 28) {  // Deficiencia Por Idade




        if (this.fatorResultadoSecundario.fator < 1) {


          textComplementar = '';
          fatorText = 1
          //this.fatorResultadoSecundario.fator = 1;
        } else {

          textComplementar = ' (Aplicado por ser mais vantajoso)';

        }

      } else if (this.tipoBeneficio === 3) {

        if (this.fatorResultadoSecundario.fator < 1) {

          textComplementar = ' (Afastado por ser menos vantajoso)';
          fatorText = this.formatDecimal(this.fatorResultadoSecundario.fator, 4)
          //this.fatorResultadoSecundario.fator = 1;
        } else {

          textComplementar = ' (Aplicado por ser mais vantajoso)';

        }


      }



      //fatorText = 1

      this.anulaFator = fatorText === 1 ? true : false



      conclusoes.push({
        order: 4,
        tipo: 'fator',
        aplica: false,
        string: 'Fator Previdenci??rio', value: fatorText + textComplementar
      });


    }

    conclusoes.push({
      order: 3,
      tipo: 'formula_fator',
      aplica: true,
      string: 'F??rmula do Fator Previdenci??rio',
      value: this.formula_fator
    });




  }

  private getCarenciaTempo() {

    let anos


    switch (this.tempoDeContribuicaoEspecial) {

      case 1925:

        anos = 25

        break;
      case 1920:

        anos = 20

        break;
      case 1915:

        anos = 15

        break;
      case 25:

        anos = this.segurado.sexo === 'f' ? 25 : 20

        break;
      case 26:

        anos = this.segurado.sexo === 'f' ? 24 : 29

        break;
      case 27:

        anos = this.segurado.sexo === 'f' ? 28 : 33

        break;
      default:
        break;
    }

    let tempoTotalDeContribuicaoEmAnos = (this.tabelaIterar.length / 12) / anos

    return tempoTotalDeContribuicaoEmAnos


  }



  private getTempoDeContribuicao() {

    let filtro = this.filtroGetTempo[0].id
    let filtroSec = this.listaPeriodosCTRST.filter(x => x.id === filtro)

    return filtroSec[0].totalComFator

  }

  private getValoresOitentaPorCento(tabelaIterar, divisorSecundario) {

    let totalContribuicaoSecundaria

    this.tabelaIterar.sort((entry1, entry2) => {

      if (entry1.contribuicao_secundaria_revisada_n > entry2.contribuicao_secundaria_revisada_n) {

        return 1;

      }
      if (entry1.contribuicao_secundaria_revisada_n < entry2.contribuicao_secundaria_revisada_n) {

        return -1;
      }

      return 0;
    });

    let totalContribuicaoPrimaria = 0;
    let checkDescart = false;


    if (this.tabelaIterar.length > divisorSecundario) {
      totalContribuicaoPrimaria = 0
      for (let i = 0; i < this.tabelaIterar.length; i++) {
        if (i >= this.tabelaIterar.length - divisorSecundario) {
          totalContribuicaoPrimaria += this.tabelaIterar[i].contribuicao_secundaria_revisada_n;
        } else {
          this.tabelaIterar[i].limite = 'DESCONSIDERADO';
          checkDescart = true;
        }
      }
    }

    this.tabelaIterar.sort((entry1, entry2) => {
      if (entry1.id > entry2.id) {
        return 1;
      }
      if (entry1.id < entry2.id) {
        return -1;
      }
      return 0;
    });

    if (totalContribuicaoPrimaria > 0 && checkDescart) {
      this.soma = totalContribuicaoPrimaria;
    }
    
  }



}
