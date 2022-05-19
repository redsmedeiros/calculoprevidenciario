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
    "Formúla do Fator Previdenciário (Secundário)",
    "Fator Previdênciário (Secundário)",
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
  public numeroEspecie = 0
  public fatorResultadoSecundario = { fator: 0, fatorString: 0, formula_fator: '' };





  constructor(private carenciaProgressivaService: CarenciaProgressivaService) {

    super(null, null, null, null, null, null, null, null);

  }

  ngOnInit() {

    this.isUpdating = false;
    this.startCalculosSecundarios();
    console.log(this.conclusoes)
  }



  private startCalculosSecundarios() {

    //LISTA DE PERÍODOS: OBTEM A QUANTIDADE DE PERIODOS CONCOMITANTES
    for (const periodoSec of this.listaPeriodosCT) {

      if (this.isExits(periodoSec.concomitantes) && periodoSec.secundario === 1) {
        //CRIA ARRAY COM TODOS AS INFORMAÇÕES CONCOMITANTES
        this.rstFinalCalculosSecundarios.push(
          periodoSec
        )
      }
    }

    //CRIA ARRAY COM INFORMAÇÃO DE CADA CONTRIBUIÇÃO SECUNDÁRIA
    for (const row of this.rstFinalCalculosSecundarios) {

      row.sc.reverse();
      this.tabelaSc.push(row.sc);

    }
    //RECEBE DO ARRAY DE CALCULOS A INFORMAÇÃO DE DATA PEDIDO BENEFÍCIO
    let dataComparacao = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');

    if (dataComparacao.isSameOrAfter('2019-11-13')) {
      dataComparacao = moment('13/11/2019', 'DD/MM/YYYY');
    }

    dataComparacao = (dataComparacao.clone()).startOf('month');
    let moedaComparacao = (dataComparacao.isSameOrBefore(moment(), 'month')) ? this.getMoedaBydate(dataComparacao) : undefined;


    //ITERAR ARRAY COM AS INFORMAÇÕE SECUNDARIAS PARA OBTER O CÁLCULO FINAL
    for (const row of this.tabelaSc) {
      //OBTER AS INFORMAÇÕES DE CADA CONTRIBUIÇÃO SECUNDÁRIA
      for (const indice of row) {

        const fatorCorrecao = this.getFatorCorrecao(moment(indice.cp, 'MM/YYYY'), moedaComparacao)
        //CHAMAR MÉTODO DE LIMITES: PASSAR - SALÁRIO DE CONTRIBUIÇÃO X FATOR DE CONTRIBUIÇÃO E DATA DA CONTRIBUIÇÃO
        const slBeneficioMes = this.limitarTetosEMinimosSec(
          (indice.sc * fatorCorrecao),
          moment(indice.cp, 'MM/YYYY')
        );



        if (slBeneficioMes.aviso == "LIMITADO AO TETO") {
          this.contadorSecundario++
        } else {
          this.indiceCasoNaoTenhaLimitado++
        }

        //SOMA DOS SALÁRIOS DE BENEFÍCIO
        this.soma = this.soma + slBeneficioMes.valor

        //CRIA UM OJETO COM AS DEVIDAS INFORMAÇÕES
        let tabelaRow = {
          id: this.id++,
          competencia: indice.cp,
          indice_corrigido: this.formatDecimal(fatorCorrecao, 6),
          contribuicao_secundaria: this.formatMoney(indice.sc),
          contribuicao_secundaria_revisada: this.formatMoney(slBeneficioMes.valor),
          contribuicao_secundaria_revisada_n: slBeneficioMes.valor,
          limite: slBeneficioMes.aviso
        }
        //CRIA UMA ARRAY COM OS OBJETOS
        this.tabelaIterar.push(tabelaRow);
        //CRIA INDICE PARA ACHAR O DIVISOR DAS CONTRIBUIÇÕES SECUNDÁRIAS
        for (const row of this.tabelaIterar) {
          this.indiceParaDivisorSecundario = row.id
        }
      }

      //this.formatarDivisor(this.tabelaIterar) < 129 ? 129 :
      // const divisor = this.formatarDivisor(this.tabelaIterar)

      const divisorSecundario = this.formatarDivisor(this.tabelaIterar)

      const tempoContribuicao = this.getContribuicaoTempo(this.contribuicaoPrimaria)

      const dividendoTempo = this.getTempoContribuicaoExigido(tempoContribuicao, this.id)

      const fatorC = this.getFatorContribuicaoSecundario( this.tabelaIterar.length,
        this.expectativa,
        this.idadeFracionadaF)

      this.arrayDeControleResutadoFinal = [
        this.formatMoney(this.soma),
        divisorSecundario,
        this.fatorResultadoSecundario.formula_fator,
        this.formatDecimal(fatorC,3),
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

  //PASSA COMO PARÂMETRO AS CONTRIBUIÇÕES SECUNDÁRIAS PARA ENCONTRAR O DIVISOR SECUNDÁRIO
  public formatarDivisor(tabelaInsert) {


    // // ORDENA OS SALÁRIOS PELO VALOR USANDO O MÉTODO SORT E RETORNA O PRÓPRIO ARRAY - CALCULA A DIFERENÇA DE VALORES ENTRE OS MESES
    // const tabela = tabelaInsert.sort((x, y) => { return x.contribuicao_secundaria_revisada - y.contribuicao_secundaria_revisada })
    // //CRIA ARRAY COM AS DIFERENÇAS
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

    this.isDivisorMinimo = (!this.calculo.divisor_minimo) ? true : false;
    let divisorSecundarioAtual = tabelaInsert.length;

    if (this.isDivisorMinimo) {

      if (divisorSecundarioAtual < this.divisorConcomitante) {
        divisorSecundarioAtual = this.divisorConcomitante;
      } else if (divisorSecundarioAtual < tabelaInsert.length * 0.8) {
        divisorSecundarioAtual = Math.round(tabelaInsert.length * 0.8);
      }

    }
    return divisorSecundarioAtual;
  }


  //MÉTODO PARA OBTER O FATOR DE CORREÇÃO
  private getFatorCorrecao(dataContribuicao, moedaComparacao) {

    const moedaContribuicao = (dataContribuicao.isSameOrBefore(moment(), 'month')) ? this.getMoedaBydate(dataContribuicao) : undefined;

    let fator = 1;
    let fatorLimite = 1;

    // definição de indices de correção
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

  //MÉTODO PARA RECEBER A REQUISÃO DA MOEDA DE ACORDO COM A DATA
  private getMoedaBydate(date) {
    return this.moeda.find(x => (date.isSame(x.data_moeda, 'month')));
  }

  //MÉTODO PARA LIMITAR VALORES AO MÍNIMO E AO TETO
  private limitarTetosEMinimosSec(valor, data, sc_mm_ajustar = true) {

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

  //MÉTODO PARA TRANSFORMAR VALOR STRING EM FLOAT
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

  //MÉTODO PARA OBTER O TEMPO DE CONTRIBUIÇÃO EXIGIDO
  public getTempoContribuicaoExigido(contribuicao, mesesContribuicao) {

    let resultado = (Math.floor(mesesContribuicao / 12) / contribuicao) < 1 ? (mesesContribuicao / 12) / contribuicao : (Math.floor(mesesContribuicao / 12) / contribuicao)

    return resultado
  }

  //FUNÇÃO PRINCIPAL: VALOR É IGUAL A MÉDIA MULTIPLICADA PELO FATOR PREVIDENCIARIO, VEZES FRAÇÃO DA CARÊNCIA
  public getBeneficioDecorrenteAtividadeConcomitante(divisorSecundario, totalContribuicoes, dividendoTempo) {




    //CÁLCULO MÉDIA: DIVIDIR MÉDIA DE SALÁRIO PELO DIVISOR (ENTENDER COMO SERÁ FEITO O DIVISOR)
    let media = (this.getMediaSalarioConcomitante(this.mediaSalarioContribuicao) / (this.id - 1))
    

    let mediaFormatada = this.replaceFormata(this.formatDecimal(media, 3))



    //RECEBE O FATOR DE CONTRIBUIÇÃO
    let fatorFomatado = this.getFatorContribuicaoSecundario(
      this.tabelaIterar.length,
      this.expectativa,
      this.idadeFracionadaF);

    //let divisorFormatado = this.formatarDivisor(divisorSecundario)


    //VERIFICA O TIPO DE BENEFÍCIO E O DIVISOR QUE SERÁ UTILIZADO
    //if ([1, 2, 3, 31, 16, 1900, 1901, 1903].includes(this.tipoBeneficio)) {

    //RECEBE DIVISOR COM CARÊNCIA
    //divisor = this.getDivisorComCarencia(this.passarMesesCarencias, divisorSecundario)


    //divisorFormatado = this.replaceFormata(divisor)

    //} else {
    //DIVIDE POR 12 PARA ENCONTRAR O VALOR EM ANOS E VERIFICA
    //let verificaDivisor = divisorSecundario / 12
    //SE INTEIRO MAIOR OU IGUAL A UM - OBTEM O TEMPO EXIGIDO E REALIZA A DIVISÃO
    //if (Number.isInteger(verificaDivisor) && verificaDivisor >= 1) {

    //divisor = verificaDivisor / this.getTempoExigido()
    //divisorFormatado = divisor
    //SE VALOR MENOR QUE UM RECEBERÁ UM DIVISOR ZERADO 
    //}else if(verificaDivisor < 1){
    //divisor = 0
    //}

    //}

    //CALCULO PRINCIPAL - MEDIAS DOS SALARIOS X FATOR PREVIDENCIÁRIO X DIVISOR OBTIDO
    let valor = mediaFormatada * fatorFomatado

    let beneficio = valor //+ this.getMediaSalarioConcomitante(this.mediaSalarioContribuicao) * dividendoTempo

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
    //0,9038581428571429
  }

  //FUNÇÃO DE CÁLCULO DO FATOR DE CONTRIBUIÇAO
  public getFatorContribuicaoSecundario(id, expectativa, idadeFracionadaF) {

    let tempoTotalContribuicaoF = id

    

    let tempoTotalDeContribuicaoEmAnos = (tempoTotalContribuicaoF / 12)

    const aliquota = 0.31

    this.fatorResultadoSecundario.fator = ((tempoTotalDeContribuicaoEmAnos * aliquota) / expectativa)
      * (1 + (idadeFracionadaF + (tempoTotalDeContribuicaoEmAnos * aliquota)) / 100);

    this.fatorResultadoSecundario.fatorString = this.formatDecimal(this.fatorResultadoSecundario.fator, 2);

    // Adicionar nas conclusões a fórmula com os valores, não os resutlados:
    this.fatorResultadoSecundario.formula_fator = '((' + this.formatDecimal(tempoTotalDeContribuicaoEmAnos, 4) + ' * '
      + this.formatDecimal(aliquota, 2) + ') / '
      + this.formatDecimal(expectativa, 2) + ') * (1 + ('
      + this.formatDecimal(idadeFracionadaF, 4) + ' + ('
      + this.formatDecimal(tempoTotalDeContribuicaoEmAnos, 4) + ' * '
      + this.formatDecimal(aliquota, 2) + ')) / ' + '100)';

      console.log(tempoTotalContribuicaoF)
      console.log(tempoTotalContribuicaoF / 12)

    return this.fatorResultadoSecundario.fator;

  }


  //FUNÇÃO QUE RETORNA O DIVISOR COM CARÊNCIA - RECEBE O DIVISOR DE CADA SECUNDÁRIO
  public getDivisorComCarencia(ano, divisor) {

    //let carencia = this.carenciaProgressivaService.getCarencia(1994)


    let DivisorComCarencia = (divisor / ano)



    return this.formatDecimal(DivisorComCarencia, 3)



  }

  //SOMA DOS SALÁRIOS PRIMÁRIOS COM SECUNDÁRIOS - PARA O RESULTADO GLOBAL
  public getSomaDosBeneficios(salarioBeneficioPrimario) {

    let soma = this.somaSalariosSecundarios + salarioBeneficioPrimario

    return this.formatMoney(soma)
  }

  public getRendaMensalInicial(somaDosSalariosDeBenefio) {

    let renda = somaDosSalariosDeBenefio * 0.85

    return this.formatMoney(renda)
  }

  public getTempoExigido() {

    let tipo
    let anos

    switch (this.tipoBeneficio) {
      case 6:
        tipo = 'Aposentadoria por tempo de serviço de professor'
        anos = 25
        break;

      case 1915:
        tipo = 'Aposentadoria Especial - 15 anos'
        anos = 15
        break;

      case 1920:
        tipo = 'Aposentadoria Especial - 25 anos'
        anos = 25
        break;

      case 1900:
        tipo = 'Pensão por Morte - Instituidor Aposentado na Data do Óbito'
        anos = 0
        break;

      case 1901:
        tipo = 'Pensão por Morte - Instituidor não Aposentado na Data do Óbito'
        anos = 0
        break;

      case 1903:
        tipo = 'Aposentadoria por Incapacidade Permanente'
        anos = 0
        break;

      case 1:
        tipo = 'Auxílio Doença ou Auxílio por Incapacidade Temporária'
        anos = 0
        break;

      case 2:
        tipo = 'Aposentadoria por invalidez Previdenciária ou Pensão por Morte'
        anos = 0
        break;

      case 3:
        tipo = 'Aposentadoria por Idade - Trabalhador Urbano ou Aposentadoria Programada'
        anos = 15
        break;

      case 31:
        tipo = 'Aposentadoria Programada - Professor'
        anos = 0
        break;

      case 4:
        tipo = 'Aposentadoria por Tempo de Contribuição'
        anos = 0
        break;

      case 5:
        tipo = 'Aposentadoria Especial'
        anos = 0
        break;

      case 6:
        tipo = 'Aposentadoria por Tempo de Contribuição do(a) Professor(a)'
        anos = 0
        break;

      case 7:
        tipo = 'Auxílio Acidente previdenciário - 50%'
        anos = 0
        break;

      case 16:
        tipo = 'Aposentadoria por Idade - Trabalhador Rural'
        anos = 0
        break;

      case 17:
        tipo = 'Auxílio Acidente - 30%'
        anos = 0
        break;

      case 18:
        tipo = 'Auxílio Acidente - 40%'
        anos = 0
        break;

      case 19:
        tipo = 'Auxílio Acidente - 60%'
        anos = 0
        break;

      case 20:
        tipo = 'Abono de Permanência em Serviço'
        anos = 0
        break;

      case 25:
        tipo = 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Grave)'
        anos = 0
        break;

      case 26:
        tipo = 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Moderada)'
        anos = 0
        break;

      case 27:
        tipo = 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Leve)'
        anos = 0
        break;

      case 28:
        tipo = 'Aposentadoria especial por Idade da Pessoa com Deficiência'
        anos = 0
        break;

      case 1915:
        tipo = 'Aposentadoria especial - 15 anos de exposição'
        anos = 15
        break;

      case 1920:
        tipo = 'Aposentadoria especial - 20 anos de exposição'
        anos = 20
        break;

      case 1925:
        tipo = 'Aposentadoria especial - 25 anos de exposição'
        anos = 25
        break;

      case 1925:
        tipo = 'Aposentadoria especial - 25 anos de exposição'
        anos = 25
        break;

      case 1905:
        tipo = 'Auxílio Acidente - 50%'
        anos = 0
        break;

      default:
        break


    }
    return anos
  }


}
