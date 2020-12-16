
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpectativaVida } from '../ExpectativaVida.model';
import { ExpectativaVidaService } from '../ExpectativaVida.service';
import { ReajusteAutomatico } from '../ReajusteAutomatico.model';
import { ReajusteAutomaticoService } from '../ReajusteAutomatico.service';
import { ValorContribuidoService } from '../../+rgps-valores-contribuidos/ValorContribuido.service'
import { CarenciaProgressiva } from '../CarenciaProgressiva.model';
import { CarenciaProgressivaService } from '../CarenciaProgressiva.service';
import { CalculoRgpsService } from '../../+rgps-calculos/CalculoRgps.service';
import { Moeda } from '../../../services/Moeda.model';
import { MoedaService } from '../../../services/Moeda.service';
import { RgpsResultadosComponent } from '../rgps-resultados.component';
import * as moment from 'moment';

import { RegrasAcesso } from './regrasAcesso/regras-acesso';
import { CalcularListaContribuicoes } from './calculoMedia/calcular-lista-contribuicoes';
import { conclusoesFinais } from './conclusoes/conclusoes-finais';

import { RgpsPlanejamentoService } from './../../rgps-planejamento/rgps-planejamento.service';
import { PlanejamentoRgps } from 'app/+rgps/rgps-planejamento/PlanejamentoRgps.model';
import swal from 'sweetalert2';


@Component({
  selector: 'app-rgps-resultados-apos-pec103',
  templateUrl: './rgps-resultados-apos-pec103.component.html',
  styleUrls: ['./rgps-resultados-apos-pec103.component.css'],
  providers: [
    RegrasAcesso,
    CalcularListaContribuicoes,
    conclusoesFinais
  ]
})
export class RgpsResultadosAposPec103Component extends RgpsResultadosComponent implements OnInit {

  @Input() calculo;
  @Input() segurado;
  @Input() isPlanejamento;
  @Input() planejamento;
  @Input() planejamentoContribuicoesAdicionais;

  @Output() planejamentoResultEvent = new EventEmitter();


  public boxId;
  public dataFiliacao;
  public idadeSegurado;
  public idCalculo;
  public contribuicaoTotal;
  public contribuicaoPrimariaAtePec;
  public isUpdating = false;
  public nenhumaContrib = false;
  public contribuicaoPrimaria = { anos: 0, meses: 0, dias: 0 };
  public isRegraTransitoria = true;
  public isRegrasTransicao = false;
  public primeiraDataTabela;
  public carenciaConformDataFiliacao;
  public intervaloDeContribuicoes = 0;
  public valorExportacao = 0;

  public moedaDib;
  public expectativaSobrevida = { expectativa: 0, formula_expectativa_sobrevida: '' };
  public fatorPrevidenciario = { value: 0, formula: '' };
  public fatorPrevidenciarioParametros = { value: 0, formula: '' };

  private melhorValorRMI = 0;
  private melhorSoma = 0;

  public errosArray = [];
  private divisorMinimo = { value: 0, valueString: '', aplicar: false };

  // transição INICIO
  public dataPromulgacao2019 = moment('13/11/2019', 'DD/MM/YYYY');
  public isRegrasPensaoObitoInstituidorAposentado = false;
  public conclusoesInstituidorAposentadoPensaoObitoInstituidorAposentado = {};
  public rmiFinalCustom;

  private numeroDeContribuicoesAux = 0;




  public listaConclusaoAcesso = [];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected ValoresContribuidos: ValorContribuidoService,
    protected Moeda: MoedaService,
    protected ExpectativaVida: ExpectativaVidaService,
    protected ReajusteAutomatico: ReajusteAutomaticoService,
    protected CarenciaProgressiva: CarenciaProgressivaService,
    protected CalculoRgpsService: CalculoRgpsService,
    protected RgpsPlanejamentoService: RgpsPlanejamentoService,
    private regrasAcesso: RegrasAcesso,
    private calcularListaContribuicoes: CalcularListaContribuicoes,
    private conclusoesFinais: conclusoesFinais,
  ) {
    super(null, route, null, null, null, null, null);
  }


  ngOnInit() {

    this.inicializarCalculoRMI();

  }



  public inicializarCalculoRMI() {

    this.boxId = this.generateBoxId(this.calculo.id, '20');
    this.isUpdating = true;
    this.dataFiliacao = this.getDataFiliacao();
    this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    this.idadeSegurado = this.getIdadeNaDIB(this.dataInicioBeneficio);
    this.idadeFracionada = this.getIdadeFracionada();
    this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_19);
    this.contribuicaoPrimariaAtePec = this.getContribuicaoObj(this.calculo.contribuicao_primaria_atual);
    this.idCalculo = this.calculo.id;
    this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);
    this.isRegrasPensaoObitoInstituidorAposentado = (this.tipoBeneficio === 1900) ? true : false;
    this.isRegrasTransicao = (this.tipoBeneficio === 4) ? true : false;

    const dataInicio = (this.dataInicioBeneficio.clone()).startOf('month');

    // pbc da vida toda
    // this.pbcCompleto = (this.route.snapshot.params['pbc'] === 'pbc');
    // const dataLimite = (this.pbcCompleto) ? moment('1930-01-01') : moment('1994-07-01');

    const dataLimite = moment('1994-07-01');
    this.idSegurado = this.route.snapshot.params['id_segurado'];

    // indices de correção pbc da vida toda
    this.ValoresContribuidos.getByCalculoId(this.idCalculo, dataInicio, dataLimite, 0, this.idSegurado)
      .then(valorescontribuidos => {

        this.listaValoresContribuidos = valorescontribuidos;

        if (this.isPlanejamento && this.listaValoresContribuidos.length > 0) {


          this.getContribuicoesAdicionais();


          this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);

        }

        if (this.listaValoresContribuidos.length === 0 && !this.isRegrasPensaoObitoInstituidorAposentado) {

          // Exibir MSG de erro e encerrar Cálculo.
          this.nenhumaContrib = true;
          this.isUpdating = false;

        } else if (this.isRegrasPensaoObitoInstituidorAposentado) {
          // pensão por morte instituidor aposentador
          // this.regrasDaReforma();

          const dib = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
          this.Moeda.getByDateRange(dib, moment())
            .then((moeda: Moeda[]) => {
              this.regrasPensaoObitoInstituidorAposentado();
            });

        } else {

          this.primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
          this.Moeda.getByDateRange(this.primeiraDataTabela, moment())
            .then((moeda: Moeda[]) => {
              this.moeda = moeda;
              const dataReajustesAutomaticos = this.dataInicioBeneficio;

              this.ReajusteAutomatico.getByDate(dataReajustesAutomaticos, this.dataInicioBeneficio)
                .then(reajustes => {
                  this.reajustesAutomaticos = reajustes;

                  this.ExpectativaVida.getByIdade(Math.floor(this.idadeFracionada))
                    .then(expectativas => {

                      this.expectativasVida = expectativas;
                      this.CarenciaProgressiva.getCarencias()
                        .then(carencias => {

                          this.carenciasProgressivas = carencias;

                          // Quando o instituidor já está aposentado não é necessário relizar o calculo
                          if (!this.isRegrasPensaoObitoInstituidorAposentado) {

                            this.getVerificarOpcoesDeRegra();

                            // console.log(this.contribuicaoPrimariaAtePec);
                            // console.log(this.contribuicaoPrimaria);
                          }

                          // this.regrasDaReforma();

                          this.isUpdating = false;
                        });
                    });
                });
            });

        }
      });
  }

  /**
   * Verificar a aplição das regras conforme especie
   */
  public getVerificarOpcoesDeRegra() {

    if (this.dataFiliacao && this.dataFiliacao != null && moment(this.dataFiliacao).isValid()) {
      this.isRegraTransitoria = (this.dataFiliacao.isSameOrAfter(this.dataPromulgacao2019));
    }

    const tempo = this.contribuicaoPrimaria;
    const tempoContribuicaoTotal = {
      dias: (tempo.anos * 365.25) + (tempo.meses * 30.4375) + tempo.dias,
      anos: ((tempo.anos * 365.25) + (tempo.meses * 30.4375) + tempo.dias) / 365.25
    };
    const tempoContribuicaoTotalMoment = moment.duration({
      years: tempo.anos,
      months: tempo.meses,
      days: tempo.dias
    });

    const tempoAtePec = this.contribuicaoPrimariaAtePec;
    const tempoContribuicaoTotalAtePec = {
      dias: (tempoAtePec.anos * 365.25) + (tempoAtePec.meses * 30.4375) + tempoAtePec.dias,
      anos: ((tempoAtePec.anos * 365.25) + (tempoAtePec.meses * 30.4375) + tempoAtePec.dias) / 365.25
    };

    const tempoContribuicaoTotalAtePecMoment = moment.duration({
      years: tempoAtePec.anos,
      months: tempoAtePec.meses,
      days: tempoAtePec.dias
    });
    const redutorProfessor = (this.tipoBeneficio === 6) ? 5 : 0;
    const redutorSexo = (this.segurado.sexo === 'm') ? 0 : 5;

    this.calculo.redutorProfessor = redutorProfessor;
    this.calculo.redutorSexo = redutorSexo;
    this.calculo.tipoBeneficio = this.tipoBeneficio;

    const numeroDeContribuicoes = this.getMesesDeContribuicao();
    this.numeroDeContribuicoesAux = numeroDeContribuicoes;


    this.expectativaSobrevida = this.projetarExpectativa(this.idadeFracionada, this.dataInicioBeneficio);
    this.fatorPrevidenciario = this.calcularFatorPrevidenciario(tempoContribuicaoTotal.anos,
      this.expectativaSobrevida.expectativa);
    this.divisorMinimo = this.calcularDivisorMinimo(numeroDeContribuicoes, this.tipoBeneficio);
    // const numeroDeCarencias = this.calculo.carencia;

    this.moedaDib = this.getMoedaDib();

    if (this.verificarRegrasIniciais()) {

      this.listaConclusaoAcesso = this.regrasAcesso.getVerificacaoRegras(
        this.dataInicioBeneficio,
        this.dataFiliacao,
        this.tipoBeneficio,
        this.isRegraTransitoria,
        this.contribuicaoPrimaria,
        tempoContribuicaoTotal,
        tempoContribuicaoTotalAtePec,
        tempoContribuicaoTotalMoment,
        tempoContribuicaoTotalAtePecMoment,
        this.idadeSegurado,
        this.idadeFracionada,
        this.segurado.sexo,
        redutorProfessor,
        redutorSexo,
        this.expectativaSobrevida,
        this.fatorPrevidenciario,
        this.moedaDib,
        numeroDeContribuicoes,
      );

      this.listaConclusaoAcesso = this.regrasAcesso.calCularTempoMaximoExcluido(
        this.listaConclusaoAcesso,
        numeroDeContribuicoes,
        this.carenciaConformDataFiliacao,
        this.calculo
      );

      this.listaConclusaoAcesso = this.calcularListaContribuicoes.criarListasCompetenciasParaPossibilidades(
        this.Moeda,
        this.listaValoresContribuidos,
        this.listaConclusaoAcesso,
        this.calculo,
        this.pbcCompleto,
        this.getPbcCompletoIndices(),
        this.divisorMinimo);

      this.listaConclusaoAcesso = this.conclusoesFinais.createConclusoesFinais(
        this.moedaDib,
        this.listaConclusaoAcesso,
        this.segurado,
        this.calculo,
        this.pbcCompleto,
        this.divisorMinimo);

    } else {

      //   this.listaConclusaoAcesso.push({
      //     regra: regra,
      //     label: label,
      //     status: false,
      //     pontos: pontosTotal,
      //     idade: idade,
      //     tempoTotalAteEC103: tempoTotalAteEC103,
      //     tempoTotalAposEC103: tempoTotalAposEC103,
      //     requisitos:  {
      //     tempo: contribuicao_min[sexo],
      //     idade: (regra2[ano][sexo] - redutorProfessor),
      //     pedagio: 0,
      //     pontos: 0,
      //     ano: ano
      // },
      //     requisitosNaoAtendidos: [],
      //     calculosPossiveis: [],
      //     expectativaSobrevida: 0,
      //     moedaDib: {}
      // });

    }

    console.log(this.listaConclusaoAcesso);

    this.isUpdating = false;

    this.updateResultadoCalculo();
  }




  private verificarRegrasIniciais() {

    let status = false;
    status = this.verificarCarencia();
    return status;

  }



  private getMoedaDib() {
    const dib = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    const moedadib = dib.isSameOrBefore(moment(), 'month') ? this.Moeda.getByDate(dib) : this.Moeda.getByDate(moment());

    return {
      teto: moedadib.teto,
      tetoString: this.formatMoney(moedadib.teto, moedadib.sigla),
      salario_minimo: moedadib.salario_minimo,
      salario_minimoString: this.formatMoney(moedadib.salario_minimo, moedadib.sigla),
      sigla: moedadib.sigla,
    }
  }

  /**
   * Contar o número de competencias onde existe contribuições
   */
  private getMesesDeContribuicao() {

    if (this.listaValoresContribuidos.length <= 0) {
      return 0;
    }

    if (this.pbcCompleto) {
      return this.listaValoresContribuidos.length;
    }

    let numeroContribuicoes = 0;
    this.listaValoresContribuidos.forEach(contribuicao => {

      if (this.primeiraDataTabela.isSameOrBefore(contribuicao.data, 'month') && contribuicao.valor_primaria) {
        numeroContribuicoes += 1;
      }

    });

    // Set numero total de meses entre o inicio e fim das contribuições
    this.intervaloDeContribuicoes = (this.dataInicioBeneficio.clone()).startOf('month').diff(this.primeiraDataTabela, 'month');

    return numeroContribuicoes;

  }


  public regrasPensaoObitoInstituidorAposentado() {

    this.moedaDib = this.getMoedaDib();

    this.conclusoesInstituidorAposentadoPensaoObitoInstituidorAposentado =
      this.conclusoesFinais.calcularPensaoObito(this.calculo, this.moedaDib, this.tipoBeneficio, null);

    this.isUpdating = false;

  }




  private setMelhorValorRMI() {


    let melhorValorRMI = 0;
    let melhorSoma = 0;
    let melhorCalculo;

    if (this.listaConclusaoAcesso.length > 1) {

      for (const elementEspecie of this.listaConclusaoAcesso) {

        melhorCalculo = elementEspecie.calculosPossiveis.find((element) => (element.destaqueMelhorValorRMI))

        if (elementEspecie.status &&
          (this.isExits(melhorCalculo) && this.isExits(melhorCalculo.rmi) && this.isExits(melhorCalculo.rmi.value))) {
          melhorValorRMI = melhorCalculo.rmi.value;
          melhorSoma = melhorCalculo.somaContribuicoes.value;
        }

      }

    } else {

      if (this.listaConclusaoAcesso[0].calculosPossiveis.length > 1) {
        melhorCalculo = this.listaConclusaoAcesso[0].calculosPossiveis.find((element) => (element.destaqueMelhorValorRMI));
      } else {
        melhorCalculo = this.listaConclusaoAcesso[0].calculosPossiveis[0];
      }

      if (this.isExits(melhorCalculo) && this.isExits(melhorCalculo.rmi) && this.isExits(melhorCalculo.rmi.value)) {
        melhorValorRMI = melhorCalculo.rmi.value;
        melhorSoma = melhorCalculo.somaContribuicoes.value;
      }

    }

    this.melhorValorRMI = melhorValorRMI;
    this.valorExportacao = melhorValorRMI;
    this.melhorSoma = melhorSoma;

  }


  /**
   * Updade valor do RMI
   * @param  {} valorRMI
   * @param  {} somaContribuicoes
   */
  private updateResultadoCalculo() {

    if (this.errosArray.length === 0 && !this.isPlanejamento) {

      this.setMelhorValorRMI();

      setTimeout(() => {

        // Salvar Valor do Beneficio no Banco de Dados (rmi, somaContribuicoes);
        this.calculo.soma_contribuicao = this.melhorSoma;
        this.calculo.valor_beneficio = this.melhorValorRMI;
        this.CalculoRgpsService.update(this.calculo);

      }, 1500);

    } else if (this.isPlanejamento) {

      this.setMelhorValorRMI();

      setTimeout(() => {
        this.updateResultPlanejamento();
      }, 200);

    }

  }


  private updateResultPlanejamento() {

    sessionStorage.removeItem('exportPlanejamentoRSTRMI');

    this.planejamento.novo_rmi = Math.round(this.melhorValorRMI * 100) / 100;
    this.planejamento.nova_soma_contribuicoes = Math.round(this.melhorSoma * 100) / 100;
    
    const planejamentoContribuicoesAdicionaisInicio =
      this.planejamentoContribuicoesAdicionais[this.planejamentoContribuicoesAdicionais.length - 1];
      const planejamentoContribuicoesAdicionaisFim = this.planejamentoContribuicoesAdicionais[0];

    this.planejamento.resultado_rmi_novo = JSON.stringify({
      numero_contribuicoes_adicionais: this.planejamentoContribuicoesAdicionais.length,
      numero_contribuicoes_total: this.listaValoresContribuidos.length,
      planejamentoContribuicoesAdicionaisInicio: planejamentoContribuicoesAdicionaisInicio.data,
      planejamentoContribuicoesAdicionaisFim: planejamentoContribuicoesAdicionaisFim.data,
    });

    const objExport = JSON.stringify(this.planejamento);
    sessionStorage.setItem('exportPlanejamentoRSTRMI', objExport);


    this.RgpsPlanejamentoService
      .update(this.planejamento)
      .then(model => {
        // console.log(model);
        this.planejamentoResultEvent.emit(true);
        // this.navegarParaResultados();
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  /**
   * 
   */
  private getContribuicoesAdicionais() {

    this.listaValoresContribuidos = this.listaValoresContribuidos.filter(contrib => (moment().isSameOrAfter(contrib.data)));
    this.listaValoresContribuidos = this.planejamentoContribuicoesAdicionais.concat(this.listaValoresContribuidos);

    // console.log(this.listaValoresContribuidos);
    // console.log(this.planejamentoContribuicoesAdicionais);

  }


  getIdadeFracionada() {
    // return this.dataInicioBeneficio.diff(moment(this.segurado.data_nascimento, 'DD/MM/YYYY'), 'days') / 365.25;
    return this.dataInicioBeneficio.diff(moment(this.segurado.data_nascimento, 'DD/MM/YYYY'), 'years', true)
  }

  limitarTetosEMinimos(valor, data) {
    // se a data estiver no futuro deve ser utilizado os dados no mês atual
    const moeda = data.isSameOrBefore(moment(), 'month') ?
      this.Moeda.getByDate(data) :
      this.Moeda.getByDate(moment());

    const salarioMinimo = (moeda) ? moeda.salario_minimo : 0;
    const tetoSalarial = (moeda) ? moeda.teto : 0;
    let avisoString = '';
    let valorRetorno = valor;

    if (moeda && valor < salarioMinimo) {
      valorRetorno = salarioMinimo;
      avisoString = 'LIMITADO AO MÍNIMO'
    } else if (moeda && valor > tetoSalarial) {
      valorRetorno = tetoSalarial;
      avisoString = 'LIMITADO AO TETO'
    }
    return { valor: valorRetorno, aviso: avisoString };
  }


  private calcularDivisorMinimo(numeroDeContribuicoes, especie) {

    if ([25, 26, 27, 28].includes(especie)
      && !this.calculo.calcular_descarte_deficiente_ec103
      && !this.calculo.divisor_minimo) {

      let perc60Competencias = this.getDifferenceInMonths(moment('1994-07-01'), this.dataInicioBeneficio);

      perc60Competencias = Math.trunc(perc60Competencias * 0.6);
      let aplicarDivisor = (!this.calculo.divisor_minimo) ? true : false;

      const perc80Contribuicoes = numeroDeContribuicoes * 0.8;

      aplicarDivisor = (perc80Contribuicoes < perc60Competencias);

      return {
        value: perc60Competencias,
        valueString: perc60Competencias + ' - (Divisor Mínimo)',
        aplicar: aplicarDivisor
      };
    }

    return {
      value: 0,
      valueString: '',
      aplicar: false
    };

  }


  private calcularFatorPrevidenciario(tempoTotalContribuicao, expectativa) {

    let fatorPrevidenciario = 1;
    let fatorPrevidenciarioFormula = '';
    const aliquota = 0.31;

    fatorPrevidenciario = ((tempoTotalContribuicao * aliquota) / expectativa) *
      (1 + (this.idadeFracionada + (tempoTotalContribuicao * aliquota)) / 100);
    fatorPrevidenciario = parseFloat(fatorPrevidenciario.toFixed(4));

    // Adicionar nas conclusões a fórmula com os valores, não os resutlados:
    fatorPrevidenciarioFormula = '((' + this.formatDecimal(tempoTotalContribuicao, 4) +
      ' * ' + this.formatDecimal(aliquota, 2) + ') / ' +
      this.formatDecimal(expectativa, 2) + ') * (1 + (' +
      this.formatDecimal(this.idadeFracionada, 2) + ' + (' +
      this.formatDecimal(tempoTotalContribuicao, 4) + ' * ' +
      this.formatDecimal(aliquota, 2) + ')) / ' + '100)';

    const valueString = this.formatDecimal(fatorPrevidenciario, 4);
    const valueMelhorString = this.formatDecimal(fatorPrevidenciario, 4);
    // const valueMelhorString = (fatorPrevidenciario > 1) ? this.formatDecimal(fatorPrevidenciario, 4) : this.formatDecimal(1, 4);

    return {
      value: fatorPrevidenciario,
      formula: fatorPrevidenciarioFormula,
      valueString: valueString,
      valueMelhorString: valueMelhorString
    };
  }




  private procurarExpectativa(idadeFracionada, ano, dataInicio, dataFim) {
    // let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    // let dataAgora = moment();
    let expectativaVida;
    if (idadeFracionada > 80) {
      idadeFracionada = 80;
    }

    if (ano != null) {
      expectativaVida = this.ExpectativaVida.getByAno(ano);
      //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e year == ano
    } else {
      expectativaVida = this.ExpectativaVida.getByProperties(dataInicio, dataFim);
    }
    return expectativaVida;
  }

  private projetarExpectativa(idadeFracionada, dib) {

    let expectativa = 0;
    const dataInicio = moment('2000-11-30');
    const dataFim = moment((moment().year() - 1) + '-12-01');
    const dataHoje = moment();
    let formula_expectativa_sobrevida = '';

    if (dib > dataHoje) {
      let anos = Math.abs(dataHoje.diff(dib, 'years', true));

      if (anos < 1) {
        anos = Math.round(anos);
      } else {
        anos = Math.trunc(anos);
      }

      const tempo1 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-2, 'years')).year(), null, null);
      const tempo2 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-3, 'years')).year(), null, null);
      const tempo3 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-4, 'years')).year(), null, null);

      expectativa = (anos * Math.abs(((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1;

      formula_expectativa_sobrevida = `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - ${tempo1})) + ${tempo1}`;

    } else if (dib.isSameOrBefore(dataInicio)) {
      expectativa = this.procurarExpectativa(idadeFracionada, null, null, dataInicio);
    } else if (dib.isSameOrAfter(dataFim)) {
      expectativa = this.procurarExpectativa(idadeFracionada, null, dib, null);
    } else {
      expectativa = this.procurarExpectativa(idadeFracionada, null, dib, dib);
    }

    if (expectativa <= 0) {
      expectativa = 6;
    }

    return {
      expectativa: expectativa,
      formula_expectativa_sobrevida: formula_expectativa_sobrevida
    };
  }




  /**
   * Na especie idade verifica se o segurado possui carrencia mínima para acesso a regra
   * @param  {} errorArray
   */
  private verificarCarencia() {

    if (this.tipoBeneficio === 3 || this.tipoBeneficio === 16 || this.tipoBeneficio === 31) {

      const redutorIdade = (this.tipoBeneficio === 3) ? -5 : 0;

      const mesesCarencia = 180;
      this.carenciaConformDataFiliacao = this.calculo.carencia_apos_ec103;

      // console.log(this.calculo.carencia_apos_ec103);

      if (this.isPlanejamento && this.listaValoresContribuidos.length > 0) {

        if (this.calculo.carencia <= 0 || this.calculo.carencia_apos_ec103 <= 0) {
          // criar carencia auxiliar
          this.calculo.carencia = this.numeroDeContribuicoesAux;
          this.calculo.carencia_apos_ec103 = this.numeroDeContribuicoesAux;
          this.carenciaConformDataFiliacao = this.numeroDeContribuicoesAux;

        }

        if (this.planejamentoContribuicoesAdicionais.length > 0) {

          this.calculo.carencia += this.planejamentoContribuicoesAdicionais.length;
          this.calculo.carencia_apos_ec103 += this.planejamentoContribuicoesAdicionais.length;
          this.carenciaConformDataFiliacao += this.planejamentoContribuicoesAdicionais.length;

        }

        //console.log(this.calculo.carencia_apos_ec103);
      }

      if (this.calculo.carencia_apos_ec103 < mesesCarencia) {
        //  const erroCarencia = 'Falta(m) ' + (mesesCarencia - this.calculo.carencia) + ' mês(es) para a carência necessária.';
        const erroCarencia = 'Falta(m) ' + (mesesCarencia - this.calculo.carencia_apos_ec103) + ' mês(es) para a carência necessária.';
        this.errosArray.push(erroCarencia);
        // this.erroCarenciaMinima = true;
        return false;
      }

    }

    return true;
  }

  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '')
      ? true : false;
  }

  isEmpty(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '')
      ? true : false;
  }

  // mostrarReajustesAdministrativos(tableId) {
  //   if (this.showReajustesAdministrativos) {
  //     document.getElementById(tableId).scrollIntoView();
  //     return;
  //   }
  //   let dataInicio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
  //   this.ReajusteAutomatico.getByDate(dataInicio, moment())
  //     .then((reajustes: ReajusteAutomatico[]) => {
  //       let reajustesAutomaticos = reajustes;
  //       let valorBeneficio = (this.calculo.valor_beneficio) ? parseFloat(this.calculo.valor_beneficio) : 0;
  //       let dataPrevia = moment(reajustesAutomaticos[0].data_reajuste);
  //       let dataCorrente = dataInicio;
  //       for (let reajusteAutomatico of reajustesAutomaticos) {
  //         dataCorrente = moment(reajusteAutomatico.data_reajuste);
  //         let siglaMoedaDataCorrente = this.loadCurrency(dataCorrente).acronimo;
  //         let teto = parseFloat(reajusteAutomatico.teto);
  //         let minimo = parseFloat(reajusteAutomatico.salario_minimo);
  //         if (this.tipoBeneficio == 17) {
  //           minimo *= 0.3;
  //         } else if (this.tipoBeneficio == 18) {
  //           minimo *= 0.4;
  //         } else if (this.tipoBeneficio == 7) {
  //           minimo *= 0.5;
  //         } else if (this.tipoBeneficio == 19) {
  //           minimo *= 0.6;
  //         }
  //         let reajuste = reajusteAutomatico.indice != null ? parseFloat(reajusteAutomatico.indice) : 1;

  //         if (dataCorrente.year() == 2006 && dataCorrente.month() == 7) {
  //           reajuste = 1.000096;
  //         }

  //         valorBeneficio *= reajuste;
  //         valorBeneficio = this.convertCurrency(valorBeneficio, dataPrevia, dataCorrente);

  //         let limit = '-';
  //         if (valorBeneficio < minimo) {
  //           valorBeneficio = minimo;
  //           limit = 'M'
  //         }
  //         if (valorBeneficio > teto) {
  //           valorBeneficio = teto;
  //           limit = 'T'
  //         }
  //         let line = {
  //           competencia: dataCorrente.format('MM/YYYY'),
  //           reajuste: reajuste,
  //           beneficio: this.formatMoney(valorBeneficio, siglaMoedaDataCorrente),
  //           limite: limit
  //         };
  //         this.reajustesAdministrativosTableData.push(line);
  //         dataPrevia = dataCorrente;
  //       }
  //       this.reajustesAdministrativosTableOptions = {
  //         ...this.reajustesAdministrativosTableOptions,
  //         data: this.reajustesAdministrativosTableData,
  //       }
  //       this.showReajustesAdministrativos = true;
  //       document.getElementById(tableId).scrollIntoView();
  //     });
  // }




}
