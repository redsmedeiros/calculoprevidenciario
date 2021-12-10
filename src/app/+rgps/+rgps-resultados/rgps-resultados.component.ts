
import { Component, OnInit, HostListener, Inject, Input, SimpleChange, OnChanges } from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { CalculoRgpsService } from '../+rgps-calculos/CalculoRgps.service';
import { ValorContribuidoService } from '../+rgps-valores-contribuidos/ValorContribuido.service';
import { ValorContribuido } from '../+rgps-valores-contribuidos/ValorContribuido.model';
import { RgpsPlanejamentoService } from 'app/+rgps/rgps-planejamento/rgps-planejamento.service';
import { PlanejamentoRgps } from 'app/+rgps/rgps-planejamento/PlanejamentoRgps.model';
import { PeriodosContagemTempoService } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.service';
import { PeriodosContagemTempo } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.model';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { DOCUMENT } from '@angular/platform-browser';
import { WINDOW } from '../+rgps-calculos/window.service';
import { DefinicaoMoeda } from 'app/shared/functions/definicao-moeda';
import { DefinicaoSalariosContribuicao } from 'app/+rgps/+rgps-resultados/shared/definicao-salarios-contribuicao'


@FadeInTop()
@Component({
  selector: 'app-rgps-resultados-component',
  templateUrl: './rgps-resultados.component.html',
  styleUrls: ['./rgps-resultados.component.css']
})
export class RgpsResultadosComponent implements OnInit, OnChanges {


  @Input() dadosPassoaPasso;
  @Input() idSeguradoSelecionado;
  @Input() idCalculoSelecionadoCT;
  @Input() exportResultContagemTempo;
  @Input() idCalculoSelecionadoRMI;

  public styleTheme = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];
  private caixaOpcoes;
  private navIsFixed = false;

  public isUpdating = false;
  public checkboxIdList = [];
  public idSegurado = '';
  public idadeSegurado = 0;
  public idsCalculo;
  public calculosList = [];
  public erroAnterior88;
  public currencyList = DefinicaoMoeda.currencyList;

  public segurado: any = {};
  public calculo: any = {};
  public moeda: any = {};
  public isBlackHole = false;
  public salarioMinimoMaximo;
  public primeiraDataTabela;
  public dataInicioBeneficio;
  public dataInicioBeneficioOld;
  public dataFiliacao;
  public contribuicaoPrimariaTotal;
  public listaValoresContribuidos;
  public listaPeriodosCT = [];
  public listaValoresContribuidosPeriodosCT = [];
  public tipoBeneficio;

  // Variaveis de controle do template
  public mostrarCalculoAnterior88 = false;
  public mostrarCalculo91_98 = false;
  public mostrarCalculo98_99 = false;
  public mostrarCalculoApos99 = false;
  public mostrarCalculoApos19 = false;

  public calculoList = [];
  public grupoCalculosTableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculoList,
    columns: [
      { data: 'especie' },
      // { data: 'periodoInicioBeneficio' },
      // { data: 'contribuicaoPrimaria' },
      // { data: 'contribuicaoSecundaria' },
      { data: 'dib' },
      // { data: 'dataCriacao' },
      { data: 'checkbox', class: 'not-print', visible: (this.mostrarCalculoApos19) },
    ]
  };

  public inpsList;
  public conclusoesAnterior88 = {};
  public calculoAnterior88TableData = [];
  public contribuicaoPrimariaAnterior88 = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundariaAnterior88 = { anos: 0, meses: 0, dias: 0 };
  public calculoAnterior88TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculoAnterior88TableData,
    columns: [
      { data: 'competencia' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria' },
      { data: 'inps' },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada' },
    ]
  };

  public conclusoes91_98 = {};
  public calculo91_98TableData = [];
  public carenciasProgressivas;
  public reajustesAutomaticos;
  public contribuicaoPrimaria91_98 = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundaria91_98 = { anos: 0, meses: 0, dias: 0 };
  public coeficiente;
  public errosCalculo91_98 = [];
  public calculo91_98TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculo91_98TableData,
    columns: [
      { data: 'competencia' },
      { data: 'fator' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria' },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada' },
      { data: 'limite' },
    ]
  };

  public conclusoes98_99 = [];
  public calculo98_99TableData = [];
  public errosCalculo98_99 = [];
  public calculo98_99TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculo98_99TableData,
    columns: [
      { data: 'competencia' },
      { data: 'fator' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria' },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada' },
      { data: 'limite' },
    ]
  };


  public contribuicaoTotal;
  public conclusoesApos99 = [];
  public limited;
  public isProportional = false;
  public idadeFracionada;
  public expectativasVida;
  public calculoApos99TableData = [];
  public contribuicaoPrimaria99 = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundaria99 = { anos: 0, meses: 0, dias: 0 };
  public errosCalculoApos99 = [];
  public withMemo = false;
  public withIN45 = true;
  public calculoApos99TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculoApos99TableData,
    columns: [
      { data: 'id' },
      { data: 'competencia' },
      { data: 'indice_corrigido' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria' },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada' },
      { data: 'limite' },
    ]
  };

  public contribuicaoPrimariaAtual = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundariaAtual = { anos: 0, meses: 0, dias: 0 };
  public numResultados = {
    'mostrarCalculoAnterior88': 0,
    'mostrarCalculo91_98': 0,
    'mostrarCalculo98_99': 0,
    'mostrarCalculoApos99': 0,
    'mostrarCalculoApos19': 0
  };

  // Datas
  public dataLei9032 = moment('1995-04-28');
  public dataLei8213 = moment('1991-07-24');
  public dataReal = moment('1994-06-01');
  public dataDib98 = moment('1998-12-16');
  public dataDib99 = moment('1999-11-29');
  public dataMP664 = moment('2015-03-01');
  public dataDecreto6939_2009 = moment('2009-08-18');
  public dataPec062019 = moment('2019-11-13');

  public planejamento;
  public isPlanejamento = false;
  public isPassoaPasso = false;
  public planejamentoContribuicoesAdicionais = [];
  // public objConclusoes = {
  //   aposEc103: { rmi: 0, soma: 0 },
  //   antesEc103: { rmi: 0, soma: 0 },
  // };

  // pbc parametro get
  public pbcCompleto = false;

  // pbc indices de correção
  public pbcCompletoIndices = 'inpc1084';

  public steps = [];
  public activeStep = {
    key: 'step4',
    title: 'RMI do Benefício Futuro',
    valid: false,
    checked: false,
    submitted: false,
  };

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected Segurado: SeguradoService,
    protected CalculoRgps: CalculoRgpsService,
    protected PeriodosContagemTempoService: PeriodosContagemTempoService,
    protected planejamentoService: RgpsPlanejamentoService,
    // protected definicaoSalariosContribuicao: DefinicaoSalariosContribuicao,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) { }


  ngOnInit() {

    this.setAtributosIniciais();

  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    // this.setAtributosIniciais();

  }


  private setAtributosIniciais() {

    this.calculoList = [];

    if (this.dadosPassoaPasso === undefined
      || typeof this.dadosPassoaPasso === 'undefined') {
      this.dadosPassoaPasso = {
        origem: 'rmi',
        type: 'auto'
      };
    }


    if (this.isExits(this.route.snapshot.params['id_segurado'])
      && this.isExits(this.route.snapshot.params['id'])
      && this.dadosPassoaPasso.origem === 'rmi') {

      this.isPassoaPasso = false;
      this.idSegurado = this.route.snapshot.params['id_segurado'];
      this.idsCalculo = this.route.snapshot.params['id'].split(',');
      this.pbcCompleto = (this.route.snapshot.params['pbc'] === 'pbc');

    } else if (this.isExits(this.idSeguradoSelecionado)
      && this.isExits(this.idCalculoSelecionadoRMI)
      && this.isExits(this.dadosPassoaPasso)
      && this.isExits(this.dadosPassoaPasso.origem)
      && this.dadosPassoaPasso.origem === 'passo-a-passo'
    ) {

      this.idsCalculo = []
      this.isPassoaPasso = true;
      this.idSegurado = this.idSeguradoSelecionado;
      this.idsCalculo[0] = this.idCalculoSelecionadoRMI;
      this.pbcCompleto = (this.route.snapshot.params['pbc'] === 'pbc');

    }

    if (this.isExits(this.idSegurado)
      && this.isExits(this.idsCalculo)
    ) {

      this.isPlanejamento = this.getIsPlanejamento();
      this.iniciarCalculoRMI();

    }

  }



  private iniciarCalculoRMI() {


    this.isUpdating = true;

    this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.segurado = segurado;

        if (localStorage.getItem('user_id') !== this.segurado.user_id) {
          // redirecionar para pagina de segurados
          swal({
            type: 'error',
            title: 'Erro',
            text: 'Você não tem permissão para acessar esta página!',
            allowOutsideClick: false
          }).then(() => {
            this.listaSegurados();
          });

        } else {

          this.idadeSegurado = this.getIdadeSegurado();
          this.dataFiliacao = this.getDataFiliacao();
          let counter = 0;
          for (const idCalculo of this.idsCalculo) {
            this.CalculoRgps.find(idCalculo)
              .then((calculo: CalculoModel) => {

                this.getPlanejamento(calculo);
                this.controleExibicao(calculo);
                this.calculosList.push(calculo);
                const checkBox = `<div class="checkbox not-print"><label>
            <input type="checkbox" id='${calculo.id}-checkbox' class="checkbox {{styleTheme}}">
            <span> </span></label></div>`;
                this.checkboxIdList.push(`${calculo.id}-checkbox`);

                calculo.tipo_seguro = this.translateNovosNomesEspecie(calculo.tipo_seguro)

                const line = {
                  especie: calculo.tipo_seguro,
                  periodoInicioBeneficio: calculo.tipo_aposentadoria,
                  contribuicaoPrimaria: this.getTempoDeContribuicaoPrimaria(calculo),
                  contribuicaoSecundaria: this.getTempoDeContribuicaoSecundaria(calculo),
                  dib: calculo.data_pedido_beneficio,
                  dataCriacao: this.formatReceivedDate(calculo.data_calculo),
                  checkbox: checkBox
                }

                this.calculoList.push(line);
                this.grupoCalculosTableOptions = {
                  ...this.grupoCalculosTableOptions,
                  data: this.calculoList,
                }

                if ((counter + 1) === this.idsCalculo.length) {
                  this.isUpdating = false;
                }
                counter++;

              });
          }

        }
      });
  }


  loadCurrency(data) {
    for (const currency of this.currencyList) {
      const startDate = moment(currency.startDate);
      const endDate = moment(currency.endDate);
      if (startDate <= data && data <= endDate) {
        return currency;
      }
    }
  }

  // private setSalariosContribuicoesContTempoCNIS(calculo) {

  //   if (this.idCalculoSelecionadoCT !== undefined
  //     && this.dadosPassoaPasso.origem === 'passo-a-passo') {

  //     this.getSalariosContribuicoesContTempoCNIS().then((rst) => {

  //       console.log(rst);
  //     }).catch(error => {
  //       console.error(error);
  //     });

  //   }

  // }

  /**
   * @param inicio inicio 07/1994
   * @param fim Dib
   * @returns array salários de contribuição
   */
  public getlistaValoresContribuidosPeriodosCT(listaValoresContribuidosPeriodosCT, inicio, fim) {

    // const listCT = this.listaValoresContribuidosPeriodosCT;
    return listaValoresContribuidosPeriodosCT.filter((row) => moment(row.data).isBetween(inicio, fim, 'month', '[)'));

  }

  public getSalariosContribuicoesContTempoCNIS() {

    return new Promise((resolve, reject) => {

      if (this.isExits(JSON.parse(sessionStorage.getItem('periodosSelecionado')))) {

        this.listaPeriodosCT = JSON.parse(sessionStorage.getItem('periodosSelecionado'));
        this.listaValoresContribuidosPeriodosCT = DefinicaoSalariosContribuicao.setValoresCotribuicaoRMICT(this.listaPeriodosCT);
        resolve(this.listaValoresContribuidosPeriodosCT);

      } else {

        this.PeriodosContagemTempoService.getByPeriodosId(this.idCalculoSelecionadoCT)
          .then((periodosContribuicao: PeriodosContagemTempo[]) => {


            sessionStorage.setItem('periodosSelecionado', JSON.stringify(periodosContribuicao));
            this.listaPeriodosCT = periodosContribuicao;
            this.listaValoresContribuidosPeriodosCT = DefinicaoSalariosContribuicao.setValoresCotribuicaoRMICT(this.listaPeriodosCT);
            resolve(this.listaValoresContribuidosPeriodosCT);

          }).catch(error => {
            console.error(error);
            reject(error);
          });
      }
    });
  }


  calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, proporcional, dib) {
    let coeficienteAux = 0;
    let porcentagem = 0.06;
    let coeficienteAux2 = 100;

    if (dib > this.dataDib98) {
      porcentagem = 0.05;
    }
    if (proporcional) {
      const extra = this.tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, 5);
      coeficienteAux2 = 100 * this.coeficienteProporcional(extra, porcentagem, toll);
    }

    switch (this.tipoBeneficio) {
      // Auxílio Doença Previdenciário
      case 1:
        if (dib >= this.dataLei9032) {
          coeficienteAux = 91;
        } else if (dib >= this.dataLei8213) {
          coeficienteAux = 80 + anosContribuicao;
          if (coeficienteAux > 92) {
            coeficienteAux = 92;
          }
        } else {
          coeficienteAux = 80 + anosContribuicao;
        }
        break;
      // Aposentadoria por invalidez previdênciária
      case 2:
        if (dib >= this.dataLei9032) {
          coeficienteAux = 100;
        } else {
          coeficienteAux = 80 + anosContribuicao;
        }
        break;
      // Aponsentadoria por idade trabalhador Urbano ou Rural
      case 3:
        coeficienteAux = 70 + anosContribuicao;
        break;
      // Aposentadoria por tempo de contribuição
      case 4:
        coeficienteAux = coeficienteAux2;
        break;
      // Aposentadoria Especial
      case 5:
        if (dib >= this.dataLei9032) {
          coeficienteAux = 100;
        } else {
          coeficienteAux = 85 + anosContribuicao;
        }
        break;
      // Aposentadoria por tempo de serviço de professor
      case 6:
        coeficienteAux = coeficienteAux2;
        break;
      // Auxílio Acidente Previdenciário 50%
      case 7:
      case 1905:
        coeficienteAux = 50;
        break;
      // Aponsentadoria por idade trabalhador Rural
      case 16:
        coeficienteAux = 70 + anosContribuicao;
        break;
      // Auxílio Acidente Previdenciário 30%
      case 17:
        coeficienteAux = 30;
        break;
      // Auxílio Acidente Previdenciário 40%
      case 18:
        coeficienteAux = 40;
        break;
      // Auxílio Acidente Previdenciário 60%
      case 19:
        coeficienteAux = 60;
        break;
      // Pessoa com deficiencia Grave 100%
      case 25:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia Moderada 100%
      case 26:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia Leve 100%
      case 27:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia por Idade 70%
      case 28:
        coeficienteAux = 70 + anosContribuicao;
        break;
    }
    coeficienteAux = (coeficienteAux > 100) ? 100 : coeficienteAux;
    return coeficienteAux;
  }

  tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, extra) {
    const retVal = anosContribuicao - (35 - redutorProfessor - redutorSexo - extra);
    return retVal;
  }

  verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra) {
    const tempoNecessario = 35 - redutorProfessor - redutorSexo - extra;
    if (Math.trunc(anosContribuicao) < Math.trunc(tempoNecessario)) {
      return false;
    }
    return true;
  }

  verificarTempoDeServicoProporcional(anosContribuicao, redutorProfessor, sexoSegurado, toll) {


    const tempoNecessarioPropSexo = { 'm': 30, 'f': 25 }
    const tempoNecessarioProporcional = (tempoNecessarioPropSexo[sexoSegurado] + toll) - redutorProfessor;

    if (anosContribuicao < tempoNecessarioProporcional
      && (tempoNecessarioProporcional - anosContribuicao) > 0.0033333333333303017) {
      return false;
    }

    return true;
  }


  coeficienteProporcional(extra, porcentagem, toll) {
    let coeficienteProporcional = 0.7 + (Math.trunc(extra - toll) * porcentagem);
    coeficienteProporcional = (coeficienteProporcional > 1) ? 1 : coeficienteProporcional;
    coeficienteProporcional = (coeficienteProporcional < 0.7) ? 0.7 : coeficienteProporcional;
    return coeficienteProporcional;
  }

  verificarIdadeMinima(idade, errorArray) {
    let temIdadeMinima = true;
    let idadeMinima;

    idade = (idade != undefined) ? idade : this.idadeSegurado;

    if (this.tipoBeneficio === 3) {
      if (this.segurado.sexo === 'm' && idade < 65) {
        idadeMinima = 65;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo === 'f' && idade < 60) {
        idadeMinima = 60;
        temIdadeMinima = false;
      }
    } else if (this.tipoBeneficio === 16 || this.tipoBeneficio === 28) {
      if (this.segurado.sexo === 'm' && idade < 60) {
        idadeMinima = 60;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo === 'f' && idade < 55) {
        idadeMinima = 55;
        temIdadeMinima = false;
      }
    }

    if (!temIdadeMinima) {
      // const tempoAteIdade = moment.duration({years: (idadeMinima - this.idadeFracionada)});
      let stringTempo = '';
      const tempoAteIdade = this.testeconvert((idadeMinima - this.idadeFracionada))
      // console.log(this.testeconvert((idadeMinima - this.idadeFracionada)));
      // console.log(tempoAteIdade);

      if (tempoAteIdade.years > 0) {
        stringTempo += tempoAteIdade.years + ' ano(s)';
      }

      if (tempoAteIdade.months > 0) {
        stringTempo += tempoAteIdade.months + ' mês(es) ';
      }

      if (tempoAteIdade.days > 0) {
        stringTempo += tempoAteIdade.days + ' dia(s)';
      }

      errorArray.push('O segurado não tem a idade mínima (' + idadeMinima + ' anos) para se aposentar por idade. Falta(m) '
        + stringTempo + ' para atingir a idade mínima.');
    }
    return temIdadeMinima;
  }


  testeconvert(fullYears) {

    const totalFator = { years: 0, months: 0, days: 0, fullYears: fullYears };
    const xValor = fullYears;

    totalFator.years = Math.floor(xValor);
    const xVarMes = (xValor - totalFator.years) * 12;
    totalFator.months = Math.floor(xVarMes);
    const dttDias = (xVarMes - totalFator.months) * 30.436875;
    totalFator.days = Math.round(dttDias);

    // console.log(totalFator.years + '/' + totalFator.months + '/' + totalFator.days);
    return totalFator;

  }

  getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo) {
    const idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    const anoNecessario = (moment(this.segurado.data_nascimento, 'DD/MM/YYYY')).add(idadeNecessaria, 'years');
    return anoNecessario.year();
  }

  getValoresAdministrativos(rmi) {
    const reajustesAdministrativos = true;
    let valorBeneficio = rmi;
    let dataAnterior = null;
    let dataCorrente = null;
    for (const reajusteAutomatico of this.reajustesAutomaticos) {
      if (dataAnterior == null) {
        dataAnterior = reajusteAutomatico.data_reajuste;
      } else {
        dataAnterior = dataCorrente;
      }
      dataCorrente = reajusteAutomatico.data_reajuste;
      const reajuste = (reajusteAutomatico.indice != null) ? reajusteAutomatico.indice : 1;
      valorBeneficio = this.convertCurrency(valorBeneficio, dataAnterior, dataCorrente);
      if (reajustesAdministrativos) {
        valorBeneficio = valorBeneficio * reajuste;
      }
      valorBeneficio = (valorBeneficio < reajusteAutomatico.salario_minimo) ? reajusteAutomatico.salario_minimo : valorBeneficio;
      valorBeneficio = (valorBeneficio > reajusteAutomatico.teto) ? reajusteAutomatico.teto : valorBeneficio;
    }
    return valorBeneficio;
  }


  calcularExtra(tempoServico, redutorSexo) {
    let extra;
    if (this.tipoBeneficio === 6) {
      extra = this.calcularToll(tempoServico, 0.4, 5, redutorSexo) + this.calcularBonus(tempoServico) * (-1);
    } else {
      extra = this.calcularToll(tempoServico, 0.4, 5, redutorSexo) * (-1);
    }
    return extra;
  }

  // Pedagio
  calcularToll(tempoDeServico, porcentagem, proporcional, redutorSexo) {

    let toll = ((35 - proporcional - redutorSexo) - tempoDeServico) * porcentagem;
    toll = (toll < 0 || tempoDeServico == 'NaN') ? 0 : toll;
    // return 0;
    return toll;
  }

  verificarIdadeNecessaria(idade, redutorIdade, redutorProfessor, redutorSexo, errorArray) {
    const idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    const direito = idade >= idadeNecessaria;
    if (!direito) {
      errorArray.push('Falta(m) ' + (idadeNecessaria - idade) + 'ano(s)');
    }
    return direito;
  }

  tratarTempoFracionado(time) {
    const year = Math.floor(time);
    const month = Math.round((time - year) * 12);

    let returnStr = '';
    if (year !== 0) {
      returnStr += year + ' ano(s)';
    }
    if (month !== 0 && year !== 0) {
      returnStr += ' e ';
    }
    if (month !== 0) {
      returnStr += month + ' mês(es)';
    }
    if (month === 0 && year === 0) {
      returnStr = ' 0 ano(s) ';
    }
    if (year < 0) {
      returnStr = '';
    }
    return returnStr;
  }


  public tratarTempoFracionadoMoment(anos, meses, dias, notDays = false) {

    if (notDays) {
      return ` ${anos} ano(s), ${meses} mês(es)`;
    }

    if (anos < 0) {
      return ` ${meses} mês(es) e ${Math.floor(dias)} dia(s)`;
    }

    return ` ${anos} ano(s), ${meses} mês(es) e ${Math.floor(dias)} dia(s)`;

  }

  tratarAnosFracionado(fullDays) {

    const totalFator = { years: 0, months: 0, days: 0, fullDays: fullDays };

    // let xValor = (Math.floor(fullDays) / 365);

    const xValor = fullDays;
    totalFator.years = Math.floor(xValor);
    const xVarMes = (xValor - totalFator.years) * 12;
    totalFator.months = Math.floor(xVarMes);
    const dttDias = (xVarMes - totalFator.months) * 30;
    totalFator.days = Math.floor(dttDias);

    return totalFator.years + 'ano(s) e ' + totalFator.months + 'mês(es) e ' + totalFator.days + 'dia(s)';
  }



  calcularBonus(tempoServico) {
    let bonus;
    if (this.segurado.sexo === 'm') {
      bonus = 17 / 100;
    } else {
      bonus = 20 / 100;
    }
    bonus = bonus * tempoServico;
    return bonus;
  }


  getEspecieReforma(novoNumeroEspecie) {
    const arrayEspecial = [1915, 1920, 1925];
    const arrayPensao = [1900, 1901];

    if (arrayEspecial.includes(novoNumeroEspecie)) {

      // Especial
      return 5;

    }

    if (arrayPensao.includes(novoNumeroEspecie)) {

      // pensão
      return 2;

    }

    return novoNumeroEspecie;
  }


  getEspecieBeneficio(calculo) {
    let numeroEspecie = 0;
    switch (calculo.tipo_seguro) {
      case 'Auxílio Doença':
      case 'Auxílio por Incapacidade Temporária':
        numeroEspecie = 1;
        break;
      case 'Aposentadoria por invalidez Previdenciária ou Pensão por Morte':
      case 'Aposentadoria por Invalidez ou Pensão por Morte':
        numeroEspecie = 2;
        break;
      case 'Aposentadoria por Idade - Trabalhador Urbano':
      case 'Aposentadoria por idade - Trabalhador Urbano':
      case 'Aposentadoria Programada':
        numeroEspecie = 3;
        break;
      case 'Aposentadoria Programada - Professor':
        numeroEspecie = 31;
        break;
      case 'Aposentadoria por Tempo de Contribuição':
      case 'Aposentadoria por tempo de contribuição':
      case 'Aposentadoria por tempo de serviço':
        numeroEspecie = 4;
        break;
      case 'Aposentadoria especial':
        numeroEspecie = 5;
        break;
      case 'Aposentadoria por Tempo de Contribuição do(a) Professor(a)':
      case 'Aposentadoria por tempo de serviço de professor':
        numeroEspecie = 6;
        break;
      case 'Auxílio Acidente previdenciário - 50%':
        numeroEspecie = 7;
        break;
      case 'Aposentadoria por Idade - Trabalhador Rural':
      case 'Aposentadoria por idade - Trabalhador Rural':
        numeroEspecie = 16;
        break;
      case 'Auxílio Acidente - 30%':
        numeroEspecie = 17;
        break;
      case 'Auxílio Acidente - 40%':
        numeroEspecie = 18;
        break;
      case 'Auxílio Acidente - 60%':
        numeroEspecie = 19;
        break;
      case 'Abono de Permanência em Serviço':
        numeroEspecie = 20;
        break;
      case 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Grave)':
      case 'Aposentadoria especial da Pessoa com Deficiência Grave':
        numeroEspecie = 25;
        break;
      case 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Moderada)':
      case 'Aposentadoria especial da Pessoa com Deficiência Moderada':
        numeroEspecie = 26;
        break;
      case 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Leve)':
      case 'Aposentadoria especial da Pessoa com Deficiência Leve':
        numeroEspecie = 27;
        break;
      case 'Aposentadoria por Idade da PcD':
      case 'Aposentadoria especial por Idade da Pessoa com Deficiência':
        numeroEspecie = 28;
        break;
      // Reforma  inicio 2019
      case 'Aposentadoria Especial - 15 anos':
      case 'Aposentadoria especial - 15 anos de exposição':
        numeroEspecie = 1915;
        break;
      case 'Aposentadoria Especial - 20 anos':
      case 'Aposentadoria especial - 20 anos de exposição':
        numeroEspecie = 1920;
        break;
      case 'Aposentadoria Especial - 25 anos':
      case 'Aposentadoria especial - 25 anos de exposição':
        numeroEspecie = 1925;
        break;
      case 'Pensão por Morte - Instituidor Aposentado na Data do Óbito':
      case 'Pensão por Morte instituidor aposentado na data óbito':
        numeroEspecie = 1900;
        break;
      case 'Pensão por Morte - Instituidor não Aposentado na Data do Óbito':
      case 'Pensão por Morte instituidor não é aposentado na data óbito':
        numeroEspecie = 1901;
        break;
      case 'Aposentadoria por Incapacidade Permanente':
      case 'Aposentadoria por incapacidade permanente':
        numeroEspecie = 1903;
        break;
      case 'Auxílio Acidente':
      case 'Auxílio Acidente - 50%':
        numeroEspecie = 1905;
        break;
      default:
        break;
    }
    return numeroEspecie;
  }


  /**
   * Regras anteriores a 29/11/1999 não devem ser calculadas para os tipo 1,2,3,16
   * @param especieBeneficio
   */
  verificaEspecieDeBeneficioIvalidezIdade(especieBeneficio) {
    // 25, 26, 27,

    const arrayTypeNum = [1, 16, 28, 1900, 1901, 1903, 1905]; // 2, 3,
    const arrayTypeText = [
      'Aposentadoria por invalidez Previdenciária ou Pensão por Morte',
      // 'Aposentadoria por idade - Trabalhador Urbano',
      // 'Aposentadoria por idade - Trabalhador Rural',
      'Auxílio Doença',
      'Pensão por Morte instituidor aposentado na data óbito',
      'Pensão por Morte - Instituidor não Aposentado na Data do Óbito',
      'Pensão por Morte - Instituidor Aposentado na Data do Óbito',
      'Pensão por Morte instituidor não é aposentado na data óbito',
      'Aposentadoria por incapacidade permanente',
      'Aposentadoria por Incapacidade Permanente',
      'Auxílio Acidente - 50%',
      'Aposentadoria especial por Idade da Pessoa com Deficiência',
      // 'Aposentadoria especial da Pessoa com Deficiência Grave',
      // 'Aposentadoria especial da Pessoa com Deficiência Moderada',
      // 'Aposentadoria especial da Pessoa com Deficiência Leve',
      'Auxílio por Incapacidade Temporária',
      'Auxílio Acidente',
      'Aposentadoria por Idade da PcD',
    ];

    if (arrayTypeNum.includes(especieBeneficio) || arrayTypeText.includes(especieBeneficio)) {
      return true;
    }
    return false;

  }


  /**
 * Regras anteriores a 29/11/1999 não devem ser calculadas para os tipo 2,3
 * @param especieBeneficio
 */
  verificaEspecieDeBeneficioIdade(especieBeneficio) {
    const arrayTypeNum = [3, 16, 31];
    const arrayTypeText = [
      'Aposentadoria por idade - Trabalhador Urbano',
      'Aposentadoria por idade - Trabalhador Rural',
      'Aposentadoria por Idade - Trabalhador Urbano',
      'Aposentadoria por Idade - Trabalhador Rural',
      'Aposentadoria Programada',
      'Aposentadoria Programada - Professor'
    ];

    if (arrayTypeNum.includes(especieBeneficio) || arrayTypeText.includes(especieBeneficio)) {
      return true;
    }
    return false;

  }


  formatMoney(value, sigla = 'R$') {

    value = parseFloat(value);
    const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    return sigla + ' ' + numeroPadronizado;

  }

  formatDecimal(value, n_of_decimal_digits) {

    value = parseFloat(value);
    return (value.toFixed(parseInt(n_of_decimal_digits, 10))).replace('.', ',');

  }

  public convertDecimalValue(valor) {

    if (!isNaN(valor)) {
      return valor;
    }

    if ((/\,/).test(valor)) {
      valor = valor.replace('R$', '').replace(/\./g, '').replace(',', '.');
    } else {
      valor = valor.replace('R$', '');
    }

    return isNaN(valor) ? 0 : parseFloat(valor);

  }

  formatDecimalIdade(value, n_of_decimal_digits) {
    return ((Math.floor(value * 100) / 100).toFixed(parseInt(n_of_decimal_digits, 10))).replace('.', ',');
  }

  formatReceivedDate(inputDate) {
    const date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return ('0' + (date.getDate())).slice(-2) + '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        date.getFullYear();
    }
    return '';
  }

  getDifferenceInMonths(date1, date2 = moment(), floatRet = false) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    if (floatRet) {
      return difference;
    }
    return Math.floor(difference);
  }

  getTempoDeContribuicaoPrimaria(data) {
    let str = '';
    if (data.contribuicao_primaria_98 !== 'undefined-undefined-undefined') {
      str += '<tr><td class="no-padding">Até EC 20/98</td><td class="no-padding">'
        + data.contribuicao_primaria_98.replace(/-/g, '/') + '</td></tr>';
    }
    if (data.contribuicao_primaria_99 !== 'undefined-undefined-undefined') {
      str += '<tr><td class="no-padding">Até EC 9.876/99</td><td class="no-padding">'
        + data.contribuicao_primaria_99.replace(/-/g, '/') + '</td></tr>';
    }
    if (data.contribuicao_primaria_atual !== 'undefined-undefined-undefined') {
      str += '<tr><td class="no-padding">Até EC 103/2019</td><td class="no-padding">'
        + data.contribuicao_primaria_atual.replace(/-/g, '/') + '</td></tr>';
    }
    if (data.contribuicao_primaria_19 !== 'undefined-undefined-undefined') {
      str += '<tr><td class="no-padding">Após 103/2019</td><td class="no-padding">'
        + data.contribuicao_primaria_19.replace(/-/g, '/') + '</td></tr>';
    }

    return '<table class="table  no-padding no-margin">' + str + '</table>';
  }

  getTempoDeContribuicaoSecundaria(data) {
    let str = '';
    if (data.contribuicao_secundaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_98.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_secundaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_99.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_secundaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_atual.replace(/-/g, '/') + '<br>';
    }

    return str;
  }

  convertCurrency(valor, dataCorrente, dataConversao) {
    let valorConvertido = parseFloat(valor);
    for (const currency of this.currencyList) {
      const startDate = moment(currency.startDate);
      const endDate = moment(currency.endDate);
      if (dataCorrente > endDate) {
        // já esta em uma data maior que a data que a moeda termina, procurar na proxima
        continue;
      } else if (startDate > dataConversao) {
        // já ultrapassou a data de conversão, finalizar o calculo
        break;
      } else if (dataCorrente < endDate && dataCorrente >= startDate) {
        // Propria Moeda, não há corte.
        continue;
      } else if (dataCorrente <= endDate) {
        // Estamos na moeda seguinte, converter divindindo pelo indiceDeCorreção;
        valorConvertido /= currency.indiceCorrecaoAnterior;
      }
    }
    return valorConvertido;
  }

  getContribuicaoObj(stringContrib) {
    let returnObj = { anos: 0, meses: 0, dias: 0 };
    if (stringContrib && stringContrib !== undefined) {
      const anos = (stringContrib.split('-')[0] !== 'undefined') ? stringContrib.split('-')[0] : 0;
      const meses = (stringContrib.split('-')[1] !== 'undefined') ? stringContrib.split('-')[1] : 0;
      const dias = (stringContrib.split('-')[2] !== 'undefined') ? stringContrib.split('-')[2] : 0;
      returnObj = { anos: parseFloat(anos), meses: parseFloat(meses), dias: parseFloat(dias) };
    }
    return returnObj;
  }

  controleExibicao(calculo) {

    const data88 = moment('1988-10-05');
    const data91 = moment('1991-04-04');
    const data91_98 = moment('1991-04-05');
    const data98_99 = moment('1998-12-15');
    const data99 = moment('1999-11-29');
    const data19 = moment('2019-11-13');
    const dataInicioBeneficio = moment(calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    calculo.isBlackHole = false;

    // verificar e setar os parametros para novo calculo;


    const verificaInvalidezObito = this.verificaEspecieDeBeneficioIvalidezIdade(calculo.tipo_seguro);
    const verificaIdade = this.verificaEspecieDeBeneficioIdade(calculo.tipo_seguro);

    if (dataInicioBeneficio < data88) {
      // * Periodo = Anterior a 05/10/88
      // Cálculos realizados: anterior a 88
      calculo.mostrarCalculoAnterior88 = true;
    } else if (dataInicioBeneficio >= data88 && dataInicioBeneficio <= data91) {
      if (calculo.tipo_aposentadoria === 'Anterior a 05/10/1988') {
        // Cálculos: Anterior a 88
        calculo.mostrarCalculoAnterior88 = true;
      } else if (calculo.tipo_aposentadoria === 'Entre 05/10/1988 e 04/04/1991') {
        // Cálculos: anterior a 88 + entre 91 e 98 (realizar contas no mesmo box)
        // calculo.mostrarCalculoAnterior88 = true;
        // calculo.mostrarCalculo91_98 = true;
        calculo.mostrarCalculo88_91 = true;
        calculo.isBlackHole = true;
      }
    } else if (dataInicioBeneficio > data91_98 && dataInicioBeneficio <= data98_99) {
      // Cálculos: entre 91 e 98
      calculo.mostrarCalculo91_98 = true;
    } else if (dataInicioBeneficio > data98_99 && dataInicioBeneficio <= data99) {
      // if(calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998'){
      // Cálculos: entre 91 e 98 (tempo de contribuicao até a ementa (98)
      // calculo.mostrarCalculo91_98 = true;
      // }else if(calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999'){
      // Cálculos = entre 91 e 98) (tempo de contribuicao até a lei 99)(cálculos realizados em box separados)
      calculo.mostrarCalculo91_98 = true;
      calculo.mostrarCalculo98_99 = true;
      // }
    } else if (dataInicioBeneficio > data99 && dataInicioBeneficio <= data19) {
      /*Todos os periodos de contribuicao (entre 91 e 98, entre 98 e 99, após 99)
      Cálculos: entre 91 e 98 (tempo de contribuicao até ementa 98)
                entre 98 e 99 (tempo de contribuicao até lei 99)
                após 99     (tempo de contribuicao após a lei 99)
                (cálculos em box separados)*/

      if (!verificaInvalidezObito) {
        calculo.mostrarCalculo91_98 = true;
        calculo.mostrarCalculo98_99 = true;
      }

      if (verificaIdade) {
        calculo.mostrarCalculo91_98 = false;
        calculo.mostrarCalculo98_99 = false;
      }

      calculo.mostrarCalculoApos99 = true;

    } else if (dataInicioBeneficio > data19) {
      /*Todos os periodos de contribuicao (entre 91 e 98, entre 98 e 99, após 99)
      Cálculos: entre 91 e 98 (tempo de contribuicao até ementa 98)
                entre 98 e 99 (tempo de contribuicao até lei 99)
                entre 99 e 19 (tempo de contribuicao até 103/2019)
                após 19     (tempo de contribuicao após 103/2019)
                (cálculos em box separados)*/
      if (!verificaInvalidezObito) {
        calculo.mostrarCalculo91_98 = true;
        calculo.mostrarCalculo98_99 = true;
        calculo.mostrarCalculoApos99 = true;
      }

      // idade deve calcular de 1999 ate 11/2019 para direito adquirido
      if (verificaIdade) {
        calculo.mostrarCalculo91_98 = false;
        calculo.mostrarCalculo98_99 = false;
        calculo.mostrarCalculoApos99 = true;
      }

      if (this.getEspecieBeneficio(calculo) === 31) {
        calculo.mostrarCalculo91_98 = false;
        calculo.mostrarCalculo98_99 = false;
        calculo.mostrarCalculoApos99 = false;
      }


      calculo.mostrarCalculoApos19 = true;
    }


    if (this.isPlanejamento) {
      this.getStepRGPSPlanejamento();
      calculo.mostrarCalculo91_98 = false;
      calculo.mostrarCalculo98_99 = false;
      calculo.mostrarCalculoApos99 = false;
      calculo.mostrarCalculoApos19 = true;
    }

    this.mostrarCalculoAnterior88 = calculo.mostrarCalculoAnterior88;
    this.mostrarCalculo91_98 = calculo.mostrarCalculo91_98;
    this.mostrarCalculo98_99 = calculo.mostrarCalculo98_99;
    this.mostrarCalculoApos99 = calculo.mostrarCalculoApos99;
    this.mostrarCalculoApos19 = calculo.mostrarCalculoApos19;

    this.definirNumeroDeResultados();
  }

  private definirNumeroDeResultados() {

    this.numResultados = {
      'mostrarCalculoAnterior88': 0,
      'mostrarCalculo91_98': 0,
      'mostrarCalculo98_99': 0,
      'mostrarCalculoApos99': 0,
      'mostrarCalculoApos19': 0
    };

    let count = 0;

    [
      'mostrarCalculoAnterior88',
      'mostrarCalculo91_98',
      'mostrarCalculo98_99',
      'mostrarCalculoApos99',
      'mostrarCalculoApos19'
    ].forEach(element => {

      if (this[element]) {
        this.numResultados[element] = count;
        count++;
      }

    });

  }



  preencheGrupoDeCalculos() {
    for (const calculo of this.calculosList) {
      const especie = calculo.tipo_seguro;
      const periodoInicioBeneficio = calculo.tipo_aposentadoria;
      const contribuicaoPrimaria = this.getTempoDeContribuicaoPrimaria(calculo);
      const contribuicaoSecundaria = this.getTempoDeContribuicaoSecundaria(calculo);
      const dib = calculo.data_pedido_beneficio;
      const dataCriacao = this.formatReceivedDate(calculo.data_calculo);
      const checkBox = `<div class="checkbox"><label><input type="checkbox" 
      id='${calculo.id}-checkbox' class="checkbox {{styleTheme}}"><span> </span></label></div>`;
      this.checkboxIdList.push(`${calculo.id}-checkbox`);
      const line = {
        especie: especie,
        periodoInicioBeneficio: periodoInicioBeneficio,
        contribuicaoPrimaria: contribuicaoPrimaria,
        contribuicaoSecundaria: contribuicaoSecundaria,
        dib: dib,
        dataCriacao: dataCriacao,
        checkbox: checkBox,
      }
      this.calculoList.push(line);
    }

    this.grupoCalculosTableOptions = {
      ...this.grupoCalculosTableOptions,
      data: this.calculoList,
    }
  }

  getIdadeSegurado() {
    const dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    return moment().diff(dataNascimento, 'years');
  }

  getIdadeNaDIB(dib) {
    const dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    return dib.diff(dataNascimento, 'years');
  }

  exportarParaBeneficios(data, valor, tipoCalculo) {

    const objExport = JSON.stringify({
      seguradoId: this.segurado.id,
      dib: data,
      valor: valor,
      tipoCalculo: tipoCalculo,
    });

    sessionStorage.setItem('exportBeneficioAtrasado', objExport);
    window.location.href = '/#/beneficios/beneficios-calculos/' + tipoCalculo + '/' + this.segurado.id;

  }

  generateBoxId(id, anoRegra) {
    // return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return id + '' + anoRegra;
  }

  editSegurado() {
    window.location.href = '/#/rgps/rgps-segurados/' + this.idSegurado + '/editar';
  }

  listaSegurados() {
    window.location.href = '/#/rgps/rgps-segurados/';
  }

  infoCalculos() {
    window.location.href = '/#/rgps/rgps-calculos/' + this.idSegurado + '/' + this.idsCalculo[0] + '/edit';
  }

  listaCalculos() {
    window.location.href = '/#/rgps/rgps-calculos/' + this.idSegurado;
  }

  valoresContribuidos() {
    const idList = [];
    for (const checkboxId of this.checkboxIdList) {
      idList.push(checkboxId.split('-')[0]);
    }
    const stringArr = idList.join(',');
    window.location.href = '/#/rgps/rgps-valores-contribuidos/' + this.idSegurado + '/' + stringArr;
  }

  imprimirPagina() {
    const seguradoBox = document.getElementById('printableSegurado').innerHTML
    const grupoCalculos = document.getElementById('boxGrupoCalculos').innerHTML + '<br>';
    const allCalcBoxHtml = document.getElementsByClassName('boxCalculo');
    let allCalcBoxText = '';
    for (let index = 0; index < allCalcBoxHtml.length; index++) {
      allCalcBoxText += allCalcBoxHtml[index].innerHTML + '<br><br>';
    }


    const css = `
    <style>
    body{font-family: Arial, Helvetica, sans-serif;}
    h1, h2{font-size:0.9rem; padding-bottom: 2px; margin-bottom: 2px;}
    i.fa, .not-print{ display: none; }
    table{margin-top: 10px;padding-top: 10px;}
    footer,div,p,td,th{font-size:11px !important;}
    .list-inline{ display:inline; }
    .table>tbody>tr>td, .table>tbody>tr>th,
    .table>tfoot>tr>td, .table>tfoot>tr>th,
    .table>thead>tr>td, .table>thead>tr>th {padding: 3.5px 10px;}
    footer{text-align: center; margin-top: 50px;}
    </style>`;

    // let printContents = document.getElementById('content').innerHTML;
    let printContents = seguradoBox + grupoCalculos + allCalcBoxText;
    printContents = printContents.replace(/<table/g,
      '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');
    const rodape = `<img src='./assets/img/rodapesimulador.png' alt='Logo'>`;
    const popupWin = window.open('', '_blank', 'width=300,height=300');

    popupWin.document.open();
    popupWin.document.write('<html><head>' + css + '<style>#tituloCalculo{font-size:0.9rem;}</style><title> RMI do RGPS - '
      + this.segurado.nome + '</title></head><body onload="window.print()">'
      + printContents + '<br><br><br>' + rodape + '</body></html>');
    popupWin.document.close();
  }

  imprimirBox(event, boxId) {
    event.stopPropagation();
    const css = `
    <style>
    body{font-family: Arial, Helvetica, sans-serif;}
    h1, h2{font-size:0.9rem;}
    i.fa, .not-print{ display: none; }
    table{margin-top: 10px;}
    footer,div,p,td,th{font-size:10px !important;}
    .list-inline{ display:inline; }
    .table>tbody>tr>td, .table>tbody>tr>th,
    .table>tfoot>tr>td, .table>tfoot>tr>th,
    .table>thead>tr>td, .table>thead>tr>th {padding: 3.5px 10px;}
    footer{text-align: center; margin-top: 50px;}
    .list-inline-print{ display:inline !important;}
    </style>`;

    const seguradoBox = document.getElementById('printableSegurado').innerHTML
    const boxContent = document.getElementById(boxId).innerHTML;


    const rodape = document.getElementById('printableRodapeControle').innerHTML;
    // const rodape = `<img src='./assets/img/rodapesimulador.png' alt='Logo'>`;
    let printableString = '<html><head>' + css + '<style>#tituloCalculo{font-size:0.9rem;}</style><title> RMI do RGPS - '
      + this.segurado.nome + '</title></head><body onload="window.print()">' + seguradoBox + ' <br> '
      + boxContent + '<br><br><br>' + rodape + '</body></html>';
    printableString = printableString.replace(/<table/g,
      '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');
    const popupWin = window.open('', '_blank', 'width=300,height=300');




    popupWin.document.open();
    popupWin.document.write(printableString);
    popupWin.document.close();
  }

  getDataFiliacao() {
    if (this.segurado.data_filiacao) {
      return moment(this.segurado.data_filiacao, 'DD/MM/YYYY');
    }
    return null;
  }

  compararCalculos() {
    const idList = [];
    for (const checkboxId of this.checkboxIdList) {
      if ((<HTMLInputElement>document.getElementById(checkboxId)).checked) {
        idList.push(checkboxId.split('-')[0]);
      }
    }

    if (idList.length !== 2) {
      swal('Erro', 'Só é possível comparar 2 cálculos', 'error');
    } else {
      window.location.href = '/#/rgps/rgps-elements/' +
        this.route.snapshot.params['id_segurado'] + '/' + idList[0] + '/' + idList[1];

    }
  }

  public getPbcDaVidatoda() {
    return (this.route.snapshot.params['pbc'] === 'pbc');
  }


  public getPbcCompletoIndices() {
    return (this.isExits(this.route.snapshot.params['correcao_pbc'])) ? this.route.snapshot.params['correcao_pbc'] : 'inpc1084';;
  }

  // planejamento adicionais RMI

  public getIsPlanejamento() {
    return (this.route.snapshot.params['pbc'] === 'plan');
  }


  private calcDiffContribuicao(a, b) {

    const total = {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalMonths: 0,
      totalYears: 0,
      duration: {}
    };

    let diff: any;

    b.startOf('day').add(-1, 'd');
    a.endOf('day')

    total.totalYears = a.diff(b, 'years', true);
    total.totalMonths = a.diff(b, 'months', true);
    total.totalDays = Math.floor(a.diff(b, 'days', true));
    total.duration = moment.duration(a.diff(b));

    diff = a.diff(b, 'years');
    b.add(diff, 'years');
    total.years = diff;

    diff = a.diff(b, 'months');
    b.add(diff, 'months');
    total.months = diff;

    diff = a.diff(b, 'days');
    b.add(diff, 'days');
    total.days = diff;

    return total;
  }


  private addTempoContribuicao(calculo, diffTempo) {

    const testeobjTempo = this.getContribuicaoObj(calculo.contribuicao_primaria_19);

    const tempoAtual = moment.duration({
      year: testeobjTempo.anos,
      month: testeobjTempo.meses,
      days: testeobjTempo.dias
    })

    const tempoAtualMaisAdicional = tempoAtual.add(diffTempo.totalDays, 'days');

    calculo.contribuicao_primaria_19 = `${tempoAtualMaisAdicional.years()}
                                       -${tempoAtualMaisAdicional.months()}
                                       -${tempoAtualMaisAdicional.days()}`;

    // const objTempo = this.getContribuicaoObj(calculo.contribuicao_primaria_19);
    // objTempo.anos += diffTempo.years;
    // objTempo.meses += diffTempo.months;
    // objTempo.dias += diffTempo.days;

    // if (objTempo.dias >= 30) {
    //   objTempo.dias -= 30;
    //   objTempo.meses += 1;
    // }

    // if (objTempo.dias >= 11) {
    //   objTempo.meses = 1;
    //   objTempo.anos += 1;
    // }

    // calculo.contribuicao_primaria_19 = `${objTempo.anos}-${objTempo.meses}-${objTempo.dias}`

  }

  private addCarencia(calculo, tempoDiff) {

    calculo.carencia_apos_ec103 += tempoDiff.totalMonths;

  }

  
  public formatDecimalValue(value) {

    if (isNaN(value)) {

      return parseFloat(value.replace(/\./g, '').replace(',', '.'));

    } else {

      return parseFloat(value);

    }

  }

  private createListPlanContribuicoesAdicionais() {

    this.planejamentoContribuicoesAdicionais = []
    let auxiliarDate = this.dataInicioBeneficio.clone();
    // const fimContador = this.dataInicioBeneficioOld.clone();
    const fimContador = moment();
    let count = 0;
    const valorSalContrib = Number();
    let ObjValContribuicao;
    // auxiliarDate = moment(auxiliarDate.format('DD/MM/YYYY'), 'DD/MM/YYYY').add(1, 'month');

    let isSCPlan = false;
    if (typeof this.planejamento['sc'] !== 'undefined' && typeof this.planejamento['sc'] === 'string') {
      this.planejamento.scJSON = JSON.parse(this.planejamento.sc);
      isSCPlan = true;
    }

    console.log(typeof this.planejamento.sc);
    console.log(this.planejamento.sc);

    if (!isSCPlan && Number(this.planejamento.valor_beneficio) > 0) {

      while (fimContador.isBefore(auxiliarDate, 'month')) {
        count++;
        auxiliarDate = (auxiliarDate.clone()).add(-1, 'month');

        ObjValContribuicao = new ValorContribuido({
          data: auxiliarDate.format('YYYY-MM-DD'),
          valor_primaria: this.planejamento.valor_beneficio,
          valor_secundaria: 0,
        });

        this.planejamentoContribuicoesAdicionais.push(ObjValContribuicao);
      };

    } else {

      for (const scObj of this.planejamento.scJSON) {

        const data = moment(scObj.cp, 'MM/YYYY').format('YYYY-MM-01');

        ObjValContribuicao = new ValorContribuido({
          data: data,
          valor_primaria: this.formatDecimalValue(scObj.sc),
          valor_secundaria: 0,
        });

        this.planejamentoContribuicoesAdicionais.push(ObjValContribuicao);
      }

    }

  }

  private setTempoContribuicao(calculo, calcClone, dataAtual, dataFutura) {

    if (calculo.contribuicao_primaria_19 !== undefined && calculo.contribuicao_primaria_19 !== '--'
      && calculo.contribuicao_primaria_19 !== 'undefined-undefined-undefined') {

      calculo.contribuicao_primaria_19_old = Object.assign({}, calculo).contribuicao_primaria_19;
      calculo.carencia_apos_ec103_old = Object.assign({}, calculo).carencia_apos_ec103;

    } else {

      calculo.contribuicao_primaria_19 = calculo.contribuicao_primaria_atual;
      calculo.carencia_apos_ec103 = calculo.carencia;
      calculo.contribuicao_primaria_19_old = Object.assign({}, calculo).contribuicao_primaria_19;
      calculo.carencia_apos_ec103_old = Object.assign({}, calculo).carencia_apos_ec103;
    }

    const diffTempo = this.calcDiffContribuicao(dataFutura, dataAtual);

    this.addTempoContribuicao(calculo, diffTempo);
    // this.addCarencia(calculo, diffTempo);
    this.createListPlanContribuicoesAdicionais();
  }


  private setInfoPLanejamentoTempoDib(calculo, calcClone) {
    if (this.isExits(this.planejamento) && calculo.id === this.planejamento.id_calculo) {

      // set valores originais para atrib old
      calculo.data_pedido_beneficio_old = calcClone.data_pedido_beneficio;
      calculo.especie_old = calcClone.especie;
      this.dataInicioBeneficioOld = moment(calculo.data_pedido_beneficio_old, 'DD/MM/YYYY');

      // set atrib conformeplanejamento
      calculo.data_pedido_beneficio = moment(this.planejamento.data_futura).format('DD/MM/YYYY');
      this.dataInicioBeneficio = moment(calculo.data_pedido_beneficio, 'DD/MM/YYYY');
      calculo.tipo_seguro = this.planejamento.especie;

      this.setTempoContribuicao(
        calculo,
        calcClone,
        this.dataInicioBeneficioOld.clone(),
        this.dataInicioBeneficio.clone()
      );

    }
  }

  

  public getPlanejamento(calculo) {

    const idPlanejamento = this.route.snapshot.params['correcao_pbc'];

    if (this.isPlanejamento) {

      if (sessionStorage.exportPlanejamento) {

        const exportObjPlanejamento = JSON.parse(sessionStorage.exportPlanejamento);
        this.planejamento = new PlanejamentoRgps(exportObjPlanejamento);
        const calcClone = Object.assign({}, calculo);
        this.setInfoPLanejamentoTempoDib(calculo, calcClone);


      } else {
        this.isUpdating = true;
        const planejamentoP = this.planejamentoService.find(idPlanejamento)
          .then((planejamento: PlanejamentoRgps) => {


            this.planejamento = planejamento;

            const calcClone = Object.assign({}, calculo);
            this.setInfoPLanejamentoTempoDib(calculo, calcClone);

            this.isUpdating = false;
          }).catch(errors => console.log(errors));

      }

      // this.dataInicioBeneficio = exportDados.dib;
      // this.changePeriodoOptions();
      // const dib = moment(exportDados.dib, 'DD/MM/YYYY');
      // PlanejamentoRgps
    }

  }

  private navegarPlanejamento(type) {
    let urlpbcNew = '';

    switch (type) {
      case 'inicio':
        urlpbcNew = '/rgps/rgps-planejamento/1';
        break;
      case 'selectSegurado':
        urlpbcNew = '/rgps/rgps-planejamento/2/' + this.segurado.id;
        break;
      case 'selectCalc':
        urlpbcNew = '/rgps/rgps-planejamento/3/' + this.segurado.id + '/' + this.idsCalculo[0];
        break;
      case 'resultado':
        urlpbcNew = '/rgps/rgps-planejamento/resultados/' + this.segurado.id + '/' + this.idsCalculo[0] + '/' + this.planejamento.id;
        break;

    }

    this.router.navigate([urlpbcNew]);

  }

  public setStepPlanejamento(status) {
    this.activeStep.valid = true;
  }

  private setActiveStep(pane) {

    switch (pane.key) {
      case 'step1':
        this.navegarPlanejamento('inicio');
        break;
      case 'step2':
        this.navegarPlanejamento('selectSegurado');
        break;
      case 'step3':
        this.navegarPlanejamento('selectCalc');
        break;
      case 'step5':
        this.navegarPlanejamento('resultado');
        break;
    }

  }

  private getStepRGPSPlanejamento() {

    this.steps = [
      {
        key: 'step1',
        title: ' Dados do Segurado',
        valid: false,
        checked: false,
        submitted: false,
      },
      {
        key: 'step2',
        title: 'RMI do Benefício Atual',
        valid: false,
        checked: false,
        submitted: false,
      },
      {
        key: 'step3',
        title: 'Dados do Benefício Futuro',
        valid: false,
        checked: false,
        submitted: false,
      },
      {
        key: 'step4',
        title: 'RMI do Benefício Futuro',
        valid: false,
        checked: false,
        submitted: false,
      },
      {
        key: 'step5',
        title: 'Relatório',
        valid: false,
        checked: false,
        submitted: false,
      },
    ];

  }

  // planejamento adicionais RMI
  public calcularPBCIndices(indice) {

    if (!this.isExits(indice)) {

      const urlpbcAtual = '/rgps/rgps-calculos/' + this.idSegurado;
      const urlpbcNew = '/#/rgps/rgps-resultados/' + this.idSegurado + '/' + this.idsCalculo[0];
      this.router.navigateByUrl(urlpbcAtual, { skipLocationChange: true }).then(() =>
        this.router.navigate([urlpbcNew])
      );
    }

    if (this.isExits(indice) && indice != this.getPbcCompletoIndices()) {
      const urlpbcAtual = '/rgps/rgps-calculos/' + this.idSegurado;
      const urlpbcNew = '/rgps/rgps-resultados/' + this.idSegurado + '/' + this.idsCalculo[0] + '/pbc/' + indice;
      this.router.navigateByUrl(urlpbcAtual, { skipLocationChange: true }).then(() =>
        this.router.navigate([urlpbcNew])
      );

    }

  }

  public setObjConclusoesMelhor(rmi, somaconstribuicoes, typeEC103) {

    // if (typeEC103 === 'antes') {
    //   this.objConclusoes.antesEc103.soma = somaconstribuicoes;
    //   this.objConclusoes.antesEc103.rmi = rmi;
    // } else {
    //   this.objConclusoes.aposEc103.soma = somaconstribuicoes;
    //   this.objConclusoes.aposEc103.rmi = rmi;
    // }

    if (this.calculo.valor_beneficio < rmi) {

      this.calculo.soma_contribuicao = somaconstribuicoes;
      this.calculo.valor_beneficio = rmi;
    }

    return true;
  }

  private translateNovosNomesEspecie(especie) {

    if (this.mostrarCalculoApos19 &&
      [
        'Auxílio Doença',
        'Auxílio Acidente - 50%',
        'Aposentadoria Especial da Pessoa com Deficiência grave',
        'Aposentadoria Especial da Pessoa com Deficiência Moderada',
        'Aposentadoria Especial da Pessoa com Deficiência Leve',
        'Aposentadoria por Idade da Pessoa com Deficiência',
        'Aposentadoria por tempo de serviço de professor'
      ].includes(especie)) {

      const novasEspecies = [
        {
          antigo: 'Auxílio Doença',
          novo: 'Auxílio por Incapacidade Temporária'
        },
        {
          antigo: 'Auxílio Acidente - 50%',
          novo: 'Auxílio Acidente'
        },
        {
          antigo: 'Aposentadoria Especial da Pessoa com Deficiência grave',
          novo: 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Grave)'
        },
        {
          antigo: 'Aposentadoria Especial da Pessoa com Deficiência Moderada',
          novo: 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Moderada)'
        },
        {
          antigo: 'Aposentadoria Especial da Pessoa com Deficiência Leve',
          novo: 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Leve)'
        },
        {
          antigo: 'Aposentadoria por Idade da Pessoa com Deficiência',
          novo: 'Aposentadoria por Idade da PcD'
        },
        {
          antigo: 'Aposentadoria por tempo de serviço de professor',
          novo: 'Aposentadoria por Tempo de Contribuição do(a) Professor(a)'
        }
      ];

      return (novasEspecies.find((element) => element.antigo === especie)).novo;

    }

    return especie;
  }

  private formatDataHora(value = null) {

    if (value === null) {
      return moment().format('DD/MM/YYYY HH:mm')
    }

    if (typeof value !== 'undefined') {
      return moment(value).format('DD/MM/YYYY HH:mm')
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.caixaOpcoes = document.getElementById('containerOpcoes');
    const navbar = document.getElementById('navbar');
    const offset = 0;

    if ((this.window !== undefined && this.window !== null && this.window.pageYOffset && this.window.pageYOffset !== undefined) ||
      (this.document !== undefined && this.document !== null
        && this.document.documentElement.scrollTop && this.document.documentElement.scrollTop !== undefined)
      || (this.document !== undefined && this.document !== null
        && this.document.body.scrollTop && this.document.body.scrollTop !== undefined)
    ) {

      const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

      if (offset > this.offset(this.caixaOpcoes)) {
        this.navIsFixed = true;
        //  navbar.classList.add("sticky")
      } else if (this.navIsFixed) {
        this.navIsFixed = false;
        //  navbar.classList.remove("sticky");
      }
    }
  }

  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined) ? true : false;
  }

  offset(el = undefined) {
    if (this.isExits(el) && this.isExits(el.getBoundingClientRect())) {
      const rect = el.getBoundingClientRect(),
        scrollTop = this.window.pageYOffset || this.document.documentElement.scrollTop;
      return rect.top + scrollTop;
    }
  }

}



// case 'Auxílio Doença':
//         numeroEspecie = 1;
//         break;
//       case 'Aposentadoria por invalidez Previdenciária ou Pensão por Morte':
//         numeroEspecie = 2;
//         break;
//       case 'Aposentadoria por idade - Trabalhador Urbano':
//         numeroEspecie = 3;
//         break;
//       case 'Aposentadoria por tempo de contribuição':
//         numeroEspecie = 4;
//         break;
//       case 'Aposentadoria por tempo de serviço':
//         numeroEspecie = 4;
//         break;
//       case 'Aposentadoria especial':
//         numeroEspecie = 5;
//         break;
//       case 'Aposentadoria por tempo de serviço de professor':
//         numeroEspecie = 6;
//         break;
//       case 'Auxílio Acidente previdenciário - 50%':
//         numeroEspecie = 7;
//         break;
//       case 'Aposentadoria por idade - Trabalhador Rural':
//         numeroEspecie = 16;
//         break;
//       case 'Auxílio Acidente - 30%':
//         numeroEspecie = 17;
//         break;
//       case 'Auxílio Acidente - 40%':
//         numeroEspecie = 18;
//         break;
//       case 'Auxílio Acidente - 60%':
//         numeroEspecie = 19;
//         break;
//       case 'Abono de Permanência em Serviço':
//         numeroEspecie = 20;
//         break;
//       case 'Aposentadoria especial da Pessoa com Deficiência Grave':
//         numeroEspecie = 25;
//         break;
//       case 'Aposentadoria especial da Pessoa com Deficiência Moderada':
//         numeroEspecie = 26;
//         break;
//       case 'Aposentadoria especial da Pessoa com Deficiência Leve':
//         numeroEspecie = 27;
//         break;
//       case 'Aposentadoria especial por Idade da Pessoa com Deficiência':
//         numeroEspecie = 28;
//         break;
//       // Reforma  inicio 2019
//       case 'Aposentadoria especial - 15 anos de exposição':
//         numeroEspecie = 1915;
//         break;
//       case 'Aposentadoria especial - 20 anos de exposição':
//         numeroEspecie = 1920;
//         break;
//       case 'Aposentadoria especial - 25 anos de exposição':
//         numeroEspecie = 1925;
//         break;
//       case 'Pensão por Morte instituidor aposentado na data óbito':
//         numeroEspecie = 1900;
//         break;
//       case 'Pensão por Morte instituidor não é aposentado na data óbito':
//         numeroEspecie = 1901;
//         break;
//       case 'Aposentadoria por incapacidade permanente':
//         numeroEspecie = 1903;
//         break;
//       case 'Auxílio Acidente - 50%':
//         numeroEspecie = 1905;
//         break;
//       // Reforma  fim 2019
//       // Reforma  inicio alterações 2020
//       case 'Auxílio por Incapacidade Temporária':
//         numeroEspecie = 1;
//         break;
//       case 'Auxílio Acidente':
//         numeroEspecie = 1905;
//         break;
//       case 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Grave)':
//         numeroEspecie = 25
//         break;
//       case 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Moderada)':
//         numeroEspecie = 26
//         break;
//       case 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Leve)':
//         numeroEspecie = 27
//         break;
//       case 'Aposentadoria por Idade da PcD':
//         numeroEspecie = 28
//         break;
//         case 'Aposentadoria por Tempo de Contribuição':
//         numeroEspecie = 4;
//         break;
//       case 'Aposentadoria por Tempo de Contribuição do(a) Professor(a)':
//         numeroEspecie = 6;
//         break;
//       case 'Aposentadoria Especial - 15 anos':
//         numeroEspecie = 1915;
//         break;
//       case 'Aposentadoria Especial - 20 anos':
//         numeroEspecie = 1920;
//         break;
//       case 'Aposentadoria Especial - 25 anos':
//         numeroEspecie = 1925;
//         break;
//       case 'Aposentadoria por Idade - Trabalhador Rural':
//         numeroEspecie = 16;
//         break;
//       case 'Aposentadoria por Idade - Trabalhador Urbano':
//         numeroEspecie = 3;
//         break;
//       case 'Aposentadoria por Incapacidade Permanente':
//         numeroEspecie = 1903;
//         break;
//       case 'Pensão por Morte - Instituidor Aposentado na Data do Óbito':
//         numeroEspecie = 1900;
//         break;
//       case 'Pensão por Morte - Instituidor não Aposentado na Data do Óbito':
//         numeroEspecie = 1901;
//         break;
//       // Reforma  fim alterações 2020

//       default:
//         break;