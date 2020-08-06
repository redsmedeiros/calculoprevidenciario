import { Component, OnInit, Input } from '@angular/core';
import { ExpectativaVida } from '../ExpectativaVida.model';
import { ExpectativaVidaService } from '../ExpectativaVida.service';
import { ReajusteAutomatico } from '../ReajusteAutomatico.model';
import { ReajusteAutomaticoService } from '../ReajusteAutomatico.service';
import { ValorContribuidoService } from '../../+rgps-valores-contribuidos/ValorContribuido.service'
import { CarenciaProgressiva } from '../CarenciaProgressiva.model';
import { CarenciaProgressivaService } from '../CarenciaProgressiva.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalculoRgpsService } from '../../+rgps-calculos/CalculoRgps.service';
import { SeguradoService } from '../../+rgps-segurados/SeguradoRgps.service';
import { Moeda } from '../../../services/Moeda.model';
import { MoedaService } from '../../../services/Moeda.service';
import { RgpsResultadosComponent } from '../rgps-resultados.component'
import * as moment from 'moment';

@Component({
  selector: 'app-rgps-resultados-apos-pec062019',
  templateUrl: './rgps-resultados-apos-pec062019.component.html',
  styleUrls: ['./rgps-resultados-apos-pec062019.component.css']
})
export class RgpsResultadosAposPec062019Component extends RgpsResultadosComponent implements OnInit {
  @Input() calculo;
  @Input() segurado;

  public boxId;
  public dataFiliacao;
  public idadeSegurado;
  public idCalculo;
  public contribuicaoTotal;
  public isUpdating = false;
  public limited;
  private fatorPrevidenciario;
  private rmi8090 = undefined;
  private rmi8595 = undefined;
  public isProportional = false;
  public nenhumaContrib = false;
  public dataInicioBeneficio;
  public tipoBeneficio;
  public listaValoresContribuidos;
  public valorExportacao;
  public moeda;
  public coeficiente;
  public idadeFracionada;
  public expectativasVida;
  public reajustesAutomaticos;
  public carenciasProgressivas;
  public tableData = [];
  public conclusoes = [];
  public contribuicaoPrimaria = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundaria = { anos: 0, meses: 0, dias: 0 };
  public erros = [];
  public withMemo = false;
  public withIN45 = true;
  public tableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.tableData,
    columns: [
      { data: 'id' },
      { data: 'competencia' },
      { data: 'indice_corrigido' },
      { data: 'contribuicao_primaria' },
      // { data: 'contribuicao_secundaria' },
      { data: 'contribuicao_primaria_revisada' },
      // { data: 'contribuicao_secundaria_revisada' },
      { data: 'limite' },
      // { data: 'checkbox' },
    ],
    columnDefs: [
      // { 'width': '2rem', 'targets': [0, 6] },
      { 'width': '2rem', 'targets': [0] },
      {
        'targets': [0, 1, 2, 3, 4, 5],
        'className': 'text-center'
      }
    ]
  };

  public formula_expectativa_sobrevida = '';
  public formula_fator = '';
  public showReajustesAdministrativos = false;
  public reajustesAdministrativosTableData = [];
  public reajustesAdministrativosTableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.reajustesAdministrativosTableData,
    columns: [
      { data: 'competencia' },
      { data: 'reajuste' },
      { data: 'beneficio' },
      { data: 'limite' },
    ]
  };

  // transição INICIO

  public dataPromulgacao2019 = moment('13/11/2019', 'DD/MM/YYYY');
  public valorTotalContribuicoes;
  public numeroDeContribuicoes;
  public numeroDeCompetenciasAposDescarte20 = 0;
  public valorTotalContribuicoesComDescarte20 = 0;
  public isRegraTransitoria = true;

  public conclusoesRegra1: any;
  public conclusoesRegra2: any;
  public conclusoesRegra3: any;
  public conclusoesRegra4: any;
  public conclusoesRegra5: any;
  public isRegrasTransicao = false;

  public isRegrasAposentadoriaEspecial = false;
  public conclusoesRegraAposentadoriaEspecial: any;

  public isRegrasPensaoObito = false;
  public isRegrasPensaoObitoInstituidorAposentado = false;
  public conclusoesRegraPensaoObito: any;

  public isRegrasIncapacidade = false;
  public conclusoesRegraIncapacidade: any;

  public isRegrasAuxilioDoenca = false;
  public conclusoesRegrasAuxilioDoenca: any;
  public contribuicoesPrimarias12 = 0;
  public contribuicoesPrimarias12Media = 0;

  public isRegrasAuxilioAcidente = false;
  public conclusoesRegrasAuxilioAcidente;

  public isRegrasIdade = false;
  public conclusoesRegrasIdadeFinal: any;
  public erroCarenciaMinima = false;
  public isStatusTransicaoIdade = true;

  public isRegraEspecialDeficiente = false;
  public conclusoesRegrasEspecialDeficiente: any;

  public isRegraTransitoriaProfessor = false;
  public conclusoesRegrasTransitoriaProfessor: any;

  public mesesContribuicaoEntre94EDib = 0;
  public percentual60ContribuicaoEntre94EDib = 0;
  public divisorMinimo = 0;
  public isDivisorMinimo = true;
  public msgDivisorMinimo = '';
  public in77 = false;



  public errorRegrasTransicao = {
    msg: '',
    status: false
  };
  public checkboxIdDescarteArray = [];

  // transição FIM

  constructor(private ExpectativaVida: ExpectativaVidaService,
    protected route: ActivatedRoute,
    private ReajusteAutomatico: ReajusteAutomaticoService,
    protected ValoresContribuidos: ValorContribuidoService,
    private CarenciaProgressiva: CarenciaProgressivaService,
    private CalculoRgpsService: CalculoRgpsService,
    private Moeda: MoedaService) {
    super(null, route, null, null, null, null);
  }

  ngOnInit() {
    this.boxId = this.generateBoxId(this.calculo.id, '19');
    this.isUpdating = true;
    this.dataFiliacao = this.getDataFiliacao();
    this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    this.idadeSegurado = this.getIdadeNaDIB(this.dataInicioBeneficio);
    this.idadeFracionada = this.getIdadeFracionada();
    this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_19);
    this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_19);
    this.idCalculo = this.calculo.id;
    this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);
    this.isRegrasPensaoObitoInstituidorAposentado = (this.tipoBeneficio === 1900) ? true : false;
    this.msgDivisorMinimo = '';
    this.isDivisorMinimo = (!this.calculo.divisor_minimo) ? true : false;

    let dataInicio = (this.dataInicioBeneficio.clone()).startOf('month');

    // pbc da vida toda
    this.pbcCompleto = (this.route.snapshot.params['pbc'] === 'pbc');
    let dataLimite = (this.pbcCompleto) ? moment('1930-01-01') : moment('1994-07-01');
    this.idSegurado = this.route.snapshot.params['id_segurado'];

    // indices de correção pbc da vida toda


    this.ValoresContribuidos.getByCalculoId(this.idCalculo, dataInicio, dataLimite, 0, this.idSegurado)
      .then(valorescontribuidos => {
        this.listaValoresContribuidos = valorescontribuidos;
        if (this.listaValoresContribuidos.length == 0 && !this.isRegrasPensaoObitoInstituidorAposentado) {

          // Exibir MSG de erro e encerrar Cálculo.
          this.nenhumaContrib = true;
          this.isUpdating = false;

        } else if (this.isRegrasPensaoObitoInstituidorAposentado) {
          // pensão por morte instituidor aposentador
          this.regrasDaReforma();

        } else {

          let primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
          this.Moeda.getByDateRange(primeiraDataTabela, moment())
            .then((moeda: Moeda[]) => {
              this.moeda = moeda;
              let dataReajustesAutomaticos = this.dataInicioBeneficio;
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

                            this.calculo_apos_pec_2019(this.erros, this.conclusoes, this.contribuicaoPrimaria, this.contribuicaoSecundaria);

                          }
                          this.regrasDaReforma();

                          this.isUpdating = false;
                        });
                    });
                });
            });

        }
      });
  }

  calculo_apos_pec_2019(errorArray, conclusoes, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria) {
    let dib = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    let dibCurrency = this.loadCurrency(dib);
    let moedaDib = this.Moeda.getByDate(dib);
    let dataComparacao = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
    let moedaComparacao = (dataComparacao.isSameOrBefore(moment(), 'month')) ? this.Moeda.getByDate(dataComparacao) : undefined;

    if (!this.direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria)) {
      return;
    }

    let totalContribuicaoPrimaria = 0;
    let totalContribuicaoSecundaria = 0;
    let totalContribuicaoPrimaria12 = 0;
    let totalContribuicaoSecundaria12 = 0;

    let contadorSecundario = 0;
    let contadorPrimario = 0;

    let primeirasContribuicoes = [];
    let tabelaIndex = 0;
    let tableData = []
    for (let contribuicao of this.listaValoresContribuidos) {
      let contribuicaoPrimaria = parseFloat(contribuicao.valor_primaria);
      let contribuicaoSecundaria = parseFloat(contribuicao.valor_secundaria);
      let dataContribuicao = moment(contribuicao.data);
      let currency = this.loadCurrency(dataContribuicao);

      contribuicaoPrimaria += contribuicaoSecundaria;
      contribuicaoSecundaria = 0;

      let idString = contadorPrimario + 1; //tabela['id'] = contadorPrimario;
      contadorPrimario++;
      let dataContribuicaoString = dataContribuicao.format('MM/YYYY');//tabela['dataContribuicao'] = contribuicao.dataContribuicao;
      let contribuicaoPrimariaString = this.formatMoney(contribuicaoPrimaria, currency.acronimo); //tabela['Contribuicao Primaria'] = currency.acronimo + contribuicaoPrimaria;
      let contribuicaoSecundariaString = this.formatMoney(contribuicaoSecundaria, currency.acronimo); //tabela['Contribuicao Secundaria'] = currency.acronimo + contribuicaoSecundaria;

      let moedaContribuicao = (dataContribuicao.isSameOrBefore(moment(), 'month')) ? this.Moeda.getByDate(dataContribuicao) : undefined;

      let fator = 1;
      let fatorLimite = 1;

      // definição de indices
      if ((!this.pbcCompleto)) {

        fator = (moedaContribuicao) ? moedaContribuicao.fator : 1;
        fatorLimite = (moedaComparacao) ? moedaComparacao.fator : 1;

      } else {

        // this.pbcCompletoIndices = (this.isExits(this.route.snapshot.params['correcao_pbc'])) ?
        //                           this.route.snapshot.params['correcao_pbc'] : 'inpc1084';

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

      let fatorCorrigido = (moedaContribuicao) ? (fator / fatorLimite) : 1;
      let fatorCorrigidoString = this.formatDecimal(fatorCorrigido, 6); // tabela['fatorCorrigido'] = fator/fatorLimite;

      let contribuicaoPrimariaRevisada = 0;
      let contribuicaoSecundariaRevisada = 0;

      let limiteString = '';
      if (contribuicaoPrimaria != 0) {
        let valorAjustadoObj = this.limitarTetosEMinimos(contribuicaoPrimaria, dataContribuicao);
        contribuicaoPrimariaRevisada = valorAjustadoObj.valor;
        limiteString = valorAjustadoObj.aviso;
      }
      // if (contribuicaoSecundaria != 0) {
      //   contribuicaoSecundariaRevisada = (this.limitarTetosEMinimos(contribuicaoSecundaria, dataContribuicao)).valor; //Inserir texto 'Limitado ao teto' e 'limitado ao minimo' quando cabivel.
      //   contadorSecundario++;
      // }

      contribuicaoPrimariaRevisada = contribuicaoPrimariaRevisada * fatorCorrigido;
      //  contribuicaoSecundariaRevisada = contribuicaoSecundariaRevisada * fatorCorrigido;

      contribuicaoPrimariaRevisada = this.convertCurrency(contribuicaoPrimariaRevisada, dataContribuicao, dib);
      //   contribuicaoSecundariaRevisada = this.convertCurrency(contribuicaoSecundariaRevisada, dataContribuicao, dib);

      totalContribuicaoPrimaria += contribuicaoPrimariaRevisada;
      //   totalContribuicaoSecundaria += contribuicaoSecundariaRevisada;


      let contribuicaoPrimariaRevisadaString = this.formatMoney(contribuicaoPrimariaRevisada, dibCurrency.acronimo);
      //let contribuicaoSecundariaRevisadaString = this.formatMoney(contribuicaoSecundariaRevisada, dibCurrency.acronimo);
      //tabela['Contribuicao Primaria Corrigida'] = currency.Acronimo + contribuicaoPrimariaRevisada
      //tabela['Contribuicao Secundaria Corrigida'] = currency.Acronimo + contribuicaoSecundariaRevisada


      const checkBox = `<label><input type="checkbox" id='${idString}-checkbox' class="checkbox check-descarte" value="${dataContribuicaoString}"><span> </span></label>`;
      this.checkboxIdDescarteArray.push(`${idString}-checkbox`);

      let line = {
        id: idString,
        competencia: dataContribuicaoString,
        contribuicao_primaria: contribuicaoPrimariaString,
        contribuicao_secundaria: contribuicaoSecundariaString,
        indice_corrigido: fatorCorrigidoString,
        contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
        //contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString,
        limite: limiteString,
        valor_primario: contribuicaoPrimariaRevisada,
        // valor_secundario: contribuicaoSecundariaRevisada,
        checkbox: checkBox
      };
      tableData.push(line);
      if (tabelaIndex < 12) {
        primeirasContribuicoes.push(line);
      }
      tabelaIndex++;
    }

    this.valorTotalContribuicoes = totalContribuicaoPrimaria;
    this.mesesContribuicaoEntre94EDib = this.getDifferenceInMonths(moment('1994-07-01'), this.dataInicioBeneficio);

    // meses de contribuição pbc
    if (this.getPbcDaVidatoda()) {

      const dataInicioPBCRevisao = this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data;
      this.mesesContribuicaoEntre94EDib = this.getDifferenceInMonths(moment(dataInicioPBCRevisao), this.dataInicioBeneficio);

    }


    this.percentual60ContribuicaoEntre94EDib = Math.trunc(this.mesesContribuicaoEntre94EDib * 0.6);
    this.numeroDeContribuicoes = tableData.length; // Numero de contribuicoes carregadas para o periodo;


    const aplicarDivisorEspecies = [3, 4, 5, 6, 16, 1915, 1920, 1925];
    if (this.isDivisorMinimo &&
      aplicarDivisorEspecies.includes(this.tipoBeneficio) &&
      (this.numeroDeContribuicoes < this.percentual60ContribuicaoEntre94EDib)) {

      this.divisorMinimo = this.percentual60ContribuicaoEntre94EDib;
      this.msgDivisorMinimo = '(Divisor Mínimo)';

    } else {

      this.divisorMinimo = this.numeroDeContribuicoes;
      this.msgDivisorMinimo = '';

    }

    const divisorMediaPrimaria = this.divisorMinimo;

    // console.log(this.isDivisorMinimo);
    // console.log(this.mesesContribuicaoEntre94EDib);
    // console.log(this.percentual60ContribuicaoEntre94EDib);
    // console.log(this.numeroDeContribuicoes);
    // console.log(this.divisorMinimo);


    // if (divisorSecundario < 24) {
    //   divisorSecundario = 24;
    // }

    // if (divisorSecundario < mesesContribuicao * 0.6) {
    //   divisorSecundario = Math.round(mesesContribuicao * 0.6);
    // } else if (divisorSecundario < mesesContribuicao * 0.8) {
    //   divisorSecundario = Math.round(mesesContribuicao * 0.8);
    // }


    let label;
    // switch (this.tipoBeneficio) {
    //   case 1: // Auxilio Doença Previdenciario

    //     // divisorMediaPrimaria = Math.round((divisorMediaPrimaria * 0.8) - 0.5);
    //     // //modificado dia 04-06-2019
    //     // divisorSecundario = contadorSecundario;
    //     // divisorSecundario = Math.round((divisorSecundario * 0.8) - 0.5);


    //     if (this.withMemo) {
    //       // Exibir Label contendo o texto
    //       label = "Este calculo foi realizado com base no <a href='#' onclick='javascript:alert(\"Em breve a descrição do Memorando.\");'>Memorando n.º21,28/10</a> descarte dos 20% menores salários .";
    //     }
    //     break;
    //   case 2: // Aposentadoria Por Invalidez previdenciaria
    //     if (divisorMediaPrimaria >= divisorMinimo || this.withMemo) {
    //       //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
    //       divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
    //       if (this.withMemo) {
    //         // Exibir Label contendo o texto
    //         label = "Este calculo foi realizado com base no <a href='#' onclick='javascript:alert(\"Em breve a descrição do Memorando.\");'>Memorando n.º21,28/10</a> descarte dos 20% menores salários.";
    //       }
    //     }
    //     break;
    //   case 7: // Auxilio Doença Previdenciario 50%
    //     //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
    //     divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
    //     break;
    // }

    // if (this.dataFiliacao >= this.dataDib99) {
    //   switch (this.tipoBeneficio) {
    //     case 1: //Auxilio Doença Previdenciario
    //     case 2: //Aposentadoria por invalidez previdenciaria
    //       if (numeroContribuicoes >= 144 || this.withMemo) {
    //         //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
    //         // divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
    //       } else {
    //         divisorMediaPrimaria = numeroContribuicoes;
    //       }
    //       break;
    //     case 5: // Aposentadoria Especial
    //     case 7: // Auxilio Acidente Previdenciario 50%
    //       if (numeroContribuicoes < 144 || this.withMemo) {
    //         divisorMediaPrimaria = numeroContribuicoes;
    //       } else {
    //         //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
    //         divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
    //       }
    //       break;
    //     case 3://Aposentadoria Idade Trabalhador Urbano
    //     case 4://Aposentadoria Tempo de Contribuicao
    //     case 16://Aposentadoria Idade Trabalhafor Rural
    //     case 25://Deficiencia Grave
    //     case 27://Deficiencia Leva
    //     case 26://Deficiencia Moderado
    //     case 28://Deficiencia PorSalvar Idade
    //       //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
    //       divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
    //       break;
    //   }
    // } else if (this.dataFiliacao < this.dataDib99) {
    //   if (this.tipoBeneficio == 3 || this.tipoBeneficio == 4 || this.tipoBeneficio == 5 || this.tipoBeneficio == 6 ||
    //     this.tipoBeneficio == 16 || this.tipoBeneficio == 25 || this.tipoBeneficio == 27 || this.tipoBeneficio == 26 ||
    //     this.tipoBeneficio == 28) {
    //     // Deficiencia Por Idade, Deficiencia Grave, Deficiencia Leve, Deficiencia Moderada, Aposentadoria Idade trabalhador Rural,
    //     // Aposentadoria Idade Urbano, Aposentadoria Tempo Contribuicao, Aposentadoria Especial, Aposentadoria Tempo Servico Professor
    //     //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
    //     // divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
    //     if (numeroContribuicoes < mesesContribuicao60) {
    //       divisorMediaPrimaria = mesesContribuicao60
    //     }
    //     if (numeroContribuicoes >= mesesContribuicao60 && numeroContribuicoes <= mesesContribuicao80) {
    //       if (this.withIN45) {
    //         divisorMediaPrimaria = numeroContribuicoes;
    //       } else {
    //         //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
    //         //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
    //       }
    //     }
    //     if (divisorMediaPrimaria < divisorMinimo) {
    //       // divisorMediaPrimaria = divisorMinimo;
    //     }
    //   }
    // }

    let totalMediaDozeContribuicoes = 0;
    let divisorContribuicoes;
    switch (this.tipoBeneficio) {
      case 1: // Auxilio Doenca Previdenciario
        if (this.dataInicioBeneficio >= this.dataMP664) {
          const currency = this.loadCurrency(this.dataInicioBeneficio);

          // if (numeroContribuicoes >= 12) {
          let contribuicoesPrimarias12 = 0;
          let contribuicoesSecundarias12 = 0;

          for (const contribuicao of primeirasContribuicoes) {
            contribuicoesPrimarias12 += contribuicao.valor_primario;
            contribuicoesSecundarias12 += contribuicao.valor_secundario;
          }

          // Carregar 1 linha da tabela moeda onde a data é menor ou igual que data_pedido_beneficio;
          const moeda = this.dataInicioBeneficio.isSameOrBefore(moment(), 'month') ?
            this.Moeda.getByDate(this.dataInicioBeneficio) :
            this.Moeda.getByDate(moment());

          let salarioMinimoRMI = moeda.salario_minimo;

          divisorContribuicoes = ((contribuicoesPrimarias12) / 12);

          // console.log(divisorContribuicoes);

          if (parseFloat(divisorContribuicoes) < salarioMinimoRMI) {
            divisorContribuicoes = salarioMinimoRMI;
          }
          totalMediaDozeContribuicoes = divisorContribuicoes;

          this.contribuicoesPrimarias12 = contribuicoesPrimarias12;
          this.contribuicoesPrimarias12Media = divisorContribuicoes;

          //console.log(divisorContribuicoes);
          // console.log(contribuicoesPrimarias12);
          // Inserir nas conclusoes:
          //conclusoes.soma_doze_ultimas_contribuicoes = this.formatMoney(contribuicoesPrimarias12, currency.acronimo);
          conclusoes.push({ string: "Soma das 12 últimas contribuções", value: this.formatMoney(contribuicoesPrimarias12, currency.acronimo) });
          //conclusoes.media_doze_ultimas_contribuicoes = this.formatMoney(divisorContribuicoes, currency.acronimo);
          conclusoes.push({ string: "Média das 12 últimas contribuções", value: this.formatMoney(divisorContribuicoes, currency.acronimo) });
          // }
        }
        break;
      case 2: //Aposentadoria por invalidez previdenciaria
        if (this.dataInicioBeneficio >= this.dataDecreto6939_2009 && Math.round(divisorMediaPrimaria) > 1) {
          // divisorMediaPrimaria = Math.round(numeroContribuicoes * 0.8);
          //  divisorMediaPrimaria =  this.formatDecimal((numeroContribuicoes * 0.8)-0.5, 1);
        }
        break;
    }


    // ordenar por valor para descarte
    tableData.sort((entry1, entry2) => {
      if (entry1.valor_primario > entry2.valor_primario) {
        return 1;
      }
      if (entry1.valor_primario < entry2.valor_primario) {
        return -1;
      }
      return 0;
    });

    // desconsiderar 20% das menores contribuições (descarte de 20%)
    this.numeroDeCompetenciasAposDescarte20 = Math.round(this.numeroDeContribuicoes * 0.8);
    this.valorTotalContribuicoesComDescarte20 = 0;
    // let teste = 0;
    if (this.numeroDeContribuicoes > this.numeroDeCompetenciasAposDescarte20) {
      for (let i = 0; i < tableData.length; i++) {
        if (i >= tableData.length - this.numeroDeCompetenciasAposDescarte20) {
          this.valorTotalContribuicoesComDescarte20 += tableData[i].valor_primario;
        }
        //else {
        //   tableData[i].limite = "DESCONSIDERADO";
        // }
        // else{
        //   teste += tableData[i].valor_primario
        // }
      }
    }


    // desconsiderar (descarte)
    // if (numeroContribuicoes > divisorMediaPrimaria) {
    //   totalContribuicaoPrimaria = 0
    //   for (let i = 0; i < tableData.length; i++) {
    //     if (i >= tableData.length - divisorMediaPrimaria) {
    //       totalContribuicaoPrimaria += tableData[i].valor_primario;
    //     } 
    //     else {
    //       tableData[i].limite = "DESCONSIDERADO";
    //     }
    //   }
    // }

    // ordenar pelo id da linha id+1
    tableData.sort((entry1, entry2) => {
      if (entry1.id > entry2.id) {
        return 1;
      }
      if (entry1.id < entry2.id) {
        return -1;
      }
      return 0;
    });

    // Calcular a quantidade de meses contida entre as duas datas.
    let numeroCompetencias = Math.ceil(this.getDifferenceInMonths(this.dataDib99, this.dataInicioBeneficio, true));
    if (numeroCompetencias > 60) {
      numeroCompetencias = 60;
    } else if (numeroCompetencias > 0 && numeroCompetencias < 1) {
      numeroCompetencias = 1;
    }

    let expectativa = this.projetarExpectativa(this.idadeFracionada, this.dataInicioBeneficio, conclusoes);


    let redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;
    let redutorSexo = (this.segurado.sexo == 'm') ? 0 : 5;

    let tempoTotalContribuicao = this.getTempoServico(redutorProfessor, redutorSexo, false);

    let fatorSeguranca = 1;
    let aliquota = 0.31;
    let naoFocado = false;

    switch (this.tipoBeneficio) {
      case 1: // Auxilio Doenca Previdenciario
      case 2:         // Aposentadoria Invalidez Previdenciaria;
      case 5:         // Aposentadoria Especial
      case 7:         // Auxiolio Acidente 50
        naoFocado = true;
        break;
      default:
        fatorSeguranca = ((tempoTotalContribuicao * aliquota) / expectativa) * (1 + (this.idadeFracionada + (tempoTotalContribuicao * aliquota)) / 100);
        fatorSeguranca = parseFloat(fatorSeguranca.toFixed(4));
        this.fatorPrevidenciario = fatorSeguranca;
        // Adicionar nas conclusões a fórmula com os valores, não os resutlados:
        //conclusoes.formula_fator = "(("+tempoTotalContribuicao +'*'+ aliquota+") / "+expectativa+") * (1 + ("+idadeFracionada+" + ("+tempoTotalContribuicao+" * "+aliquota+")) / "+"100)";
        this.formula_fator = "((" + this.formatDecimal(tempoTotalContribuicao, 4) + ' * ' + this.formatDecimal(aliquota, 2) + ") / " + this.formatDecimal(expectativa, 2) + ") * (1 + (" + this.formatDecimal(this.idadeFracionada, 2) + " + (" + this.formatDecimal(tempoTotalContribuicao, 4) + " * " + this.formatDecimal(aliquota, 2) + ")) / " + "100)";
        //conclusoes.push({string:"Fórmula Fator:",value: "(("+this.formatDecimal(tempoTotalContribuicao,4) +' * '+ this.formatDecimal(aliquota,2)+") / "+this.formatDecimal(expectativa, 2)+") * (1 + ("+this.formatDecimal(this.idadeFracionada,2)+" + ("+this.formatDecimal(tempoTotalContribuicao,4)+" * "+this.formatDecimal(aliquota,2)+")) / "+"100)"});
        break;
    }
    // console.log(fatorSeguranca);

    if (this.tipoBeneficio == 16 || // Aposentadoria Travalhador Rural
      this.tipoBeneficio == 3 || // Aposentadoria Trabalhador Urbano
      this.tipoBeneficio == 25 || // Deficiencia Grave
      this.tipoBeneficio == 26 || // Deficiencia Leve
      this.tipoBeneficio == 27 || // Deficiencia Moderada
      this.tipoBeneficio == 28) {  // Deficiencia Por Idade
      if (fatorSeguranca < 1) {
        fatorSeguranca = 1;
        naoFocado = true;
      } else if (fatorSeguranca > 1) {
        naoFocado = true;
      }
    }


    //Índice de Reajuste no Teto.
    let irt = 1;
    let mediaContribuicoesPrimarias = totalContribuicaoPrimaria;

    if (divisorMediaPrimaria > 1) {
      mediaContribuicoesPrimarias /= divisorMediaPrimaria;

    }

    // let mediaContribuicoesSecundarias = totalContribuicaoSecundaria;
    // if (divisorSecundario > 1) {
    //   mediaContribuicoesSecundarias /= divisorSecundario;
    // }

    // if (moedaDib && mediaContribuicoesSecundarias > moedaDib.teto) {
    //   mediaContribuicoesSecundarias = moedaDib.teto;
    // }

    this.limited = false;

    let rmi = fatorSeguranca * numeroCompetencias * mediaContribuicoesPrimarias / 60;

    rmi += mediaContribuicoesPrimarias * ((60 - numeroCompetencias) / 60);

    let taxaSecundaria = 0;
    let taxaMediaSecundaria = 0;

    // if (mediaContribuicoesSecundarias != 0) {
    //   taxaSecundaria = this.getTaxaSecundaria(redutorProfessor, redutorSexo, contadorSecundario);
    //   taxaMediaSecundaria = mediaContribuicoesSecundarias * taxaSecundaria;

    //   if (taxaMediaSecundaria > mediaContribuicoesSecundarias) {
    //     taxaMediaSecundaria = mediaContribuicoesSecundarias;
    //   }
    // }


    this.coeficiente = Math.floor(this.coeficiente);
    let coeficiente = this.coeficiente;

    let somaMedias = mediaContribuicoesPrimarias + taxaMediaSecundaria;
    let somaMediasAux = this.corrigirBeneficio(somaMedias, coeficiente, moedaDib);

    if (this.limited) {
      irt = (somaMedias * (coeficiente / 100)) / somaMediasAux;
    }

    // rmi += (fatorSeguranca * numeroCompetencias) / 60;
    rmi += (fatorSeguranca * numeroCompetencias * taxaMediaSecundaria) / 60;
    rmi += taxaMediaSecundaria * ((60 - numeroCompetencias) / 60)
    rmi *= (coeficiente / 100);

    this.limited = false;

    let rmiAux = this.corrigirBeneficio(rmi, coeficiente, moedaDib);
    rmi = rmiAux;
    //let objMoeda = this.moeda[this.getIndex(this.dataInicioBeneficio)];//carregar apenas uma TMoeda onde currency Date é menor ou igual a Calculo.data_pedido_beneficio
    let objMoeda = this.Moeda.getByDate(this.dataInicioBeneficio.clone());
    //let salarioAcidente = objMoeda.salario_minimo;
    // if (objMoeda && mediaContribuicoesPrimarias > objMoeda.salario_minimo) {
    //   switch (this.tipoBeneficio) {
    //     case 17:// Auxilio Acidente 30
    //       rmi = mediaContribuicoesPrimarias * 0.3;
    //       break;
    //     case 18: // Auxilio Acidente 40
    //       rmi = mediaContribuicoesPrimarias * 0.4;
    //       break;
    //     case 7: // Auxilio Acidente 50
    //       rmi = mediaContribuicoesPrimarias * 0.5;
    //       break;
    //     case 19: // Auxilio Acidente 60
    //       rmi = mediaContribuicoesPrimarias * 0.6;
    //       break;
    //   }
    // }

    //let somaContribuicoes = totalContribuicaoPrimaria + totalContribuicaoSecundaria;

    let currency = this.loadCurrency(this.dataInicioBeneficio);

    //conclusoes.coeficiente_calculo = coeficiente;//resultados['Coeficiente do Cálculo'] = coeficiente //Arrendodar para duas casas decimais;
    //conclusoes.soma_contribuicoes_primarias = this.formatMoney(totalContribuicoesPrimarias, currency.acronimo);//resultados['Soma das Contribuições Primarias'] = currency.acrônimo + totalContribuicoesPrimarias;
    //conclusoes.divisor_calculo_media_primaria = divisorMediaPrimaria;//resultados['Divisor do Cálculo da média primária: '] = divisorMediaPrimaria;
    //conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaContribuicoesPrimarias, currency.acronimo);//resultados['Média das contribuições primárias'] = currency.acrônimo + mediaContribuicoesPrimarias;


    // conclusoes.push({ string: "Coeficiente do Cálculo:", value: (coeficiente < 100) ? this.formatDecimal(coeficiente, 0) + '%' : this.formatDecimal(coeficiente, 0) + '%' });
    conclusoes.push({ string: "Soma das Contribuições:", value: this.formatMoney(totalContribuicaoPrimaria, currency.acronimo) });
    conclusoes.push({ string: "Divisor do Cálculo da média:", value: divisorMediaPrimaria + ' ' + this.msgDivisorMinimo });
    conclusoes.push({ string: "Média das contribuições", value: this.formatMoney(mediaContribuicoesPrimarias, currency.acronimo) });

    // if (totalContribuicaoSecundaria > 0) {
    //   conclusoes.push({ string: "Soma das contribuições secundárias:", value: this.formatMoney(totalContribuicaoSecundaria, currency.acronimo) });//resultados['Soma das contribuições secundárias'] = currency.acrônumo + totalContribuicoesSecundarias;
    //   conclusoes.push({ string: "Divisor do Cálculo da média secundária:", value: divisorSecundario });//resultados['Divisor do Cálculo da média secundária: '] = divisorMediaPrimaria;
    //   conclusoes.push({ string: "Média das contribuições Secundárias:", value: this.formatMoney(mediaContribuicoesSecundarias, currency.acronimo) });//resultados['Média das contribuições Secundárias: '] =  currency.acrônumo + mediaContribuicoesSecundarias;
    //   conclusoes.push({ string: "Taxa:", value: this.formatDecimal(taxaSecundaria, 6) });//resultados['Taxa: '] =  taxaSecundaria;
    //   conclusoes.push({ string: "Média Secundária - Pós Taxa:", value: this.formatMoney(mediaContribuicoesSecundarias * taxaSecundaria, currency.acronimo) });//resultados['Média Secundárias - Pós Taxa: '] =  currency.acrônimo + taxaSecundaria;
    // }

    conclusoes.push({ string: "Idade em anos:", value: `${Math.trunc(this.idadeFracionada)} (${this.formatDecimalIdade(this.idadeFracionada, 2)}) ` });//resultados['Idade em anos'] = truncate(idadeFracionada) (idadeFracionada); this.idadeFracionada.toLocaleString('pt-BR',{ style: 'decimal', maximumFractionDigits: 2}))
    // conclusoes.push({ string: "Média das contribuições:", value: this.formatMoney(somaMedias, currency.acronimo) });//resultados['Média das contribuições'] = currency.acrônimo + somaMedias;
    // conclusoes.push({ string: "CT - Número de competências transcorridas desde 29/11/1999:", value: numeroCompetencias });//resultados['CT - Número de competências transcorridas desde 29/11/1999:'] = numeroCompetencias;

    const arrayEspecialDeficiente = [25, 26, 27, 28];
    if (this.tipoBeneficio == 4 || arrayEspecialDeficiente.includes(this.tipoBeneficio)) {

      if (this.formula_fator != '') {
        conclusoes.push({ string: "Fórmula Fator:", value: this.formula_fator });
      }
      if (irt >= 1) {
        //  conclusoes.push({ string: "Índice de reajuste no teto:", value: this.formatDecimal(irt, 4) });//resultados['Índice de reajuste no teto: '] = irt; // Arredondar para 4 casas decimais;
      }

      if (this.formula_expectativa_sobrevida != '') {
        conclusoes.push({ string: 'Fórmula Expectativa de Sobrevida:', value: this.formula_expectativa_sobrevida });
      }

      conclusoes.push({ string: "Expectativa de Sobrevida:", value: this.formatDecimal(expectativa, 2) });//resultados['Expectativa de Sobrevida: '] = expectativa; // Arredondar para 4 casas decimais;
      conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca });

    }


    //???????
    // if (this.tipoBeneficio == 6 && redutorSexo == 5) {
    //   this.contribuicaoTotal -= this.contribuicaoTotal - 5;
    // }

    // let contribuicao85_95 = this.contribuicaoTotal + this.idadeFracionada;
    // let contribuicao86_96 = this.contribuicaoTotal + this.idadeFracionada;
    // let contribuicao87_97 = this.contribuicaoTotal + this.idadeFracionada;
    // let contribuicao88_98 = this.contribuicaoTotal + this.idadeFracionada;
    // let contribuicao89_99 = this.contribuicaoTotal + this.idadeFracionada;
    // let contribuicao90_100 = this.contribuicaoTotal + this.idadeFracionada;

    // let dateFormat = "DD/MM/YYYY";
    // let dataRegra85_95 = moment('17/06/2015', dateFormat);
    // let dataRegra86_96 = moment('31/12/2018', dateFormat);
    // let dataRegra87_97 = moment('31/12/2020', dateFormat);
    // let dataRegra88_98 = moment('31/12/2022', dateFormat);
    // let dataRegra89_99 = moment('31/12/2024', dateFormat);
    // let dataRegra90_100 = moment('31/12/2026', dateFormat);

    // let dataFimRegra85_95 = moment('30/12/2018', dateFormat);
    // let dataFimRegra86_96 = moment('30/12/2020', dateFormat);
    // let dataFimRegra87_97 = moment('30/12/2022', dateFormat);
    // let dataFimRegra88_98 = moment('30/12/2024', dateFormat);
    // let dataFimRegra89_99 = moment('30/12/2026', dateFormat);
    // let dataFimRegra90_100 = moment('30/12/2052', dateFormat);

    let dataBeneficio = this.dataInicioBeneficio;
    // let teto = moedaDib.teto;
    // let minimo = moedaDib.salario_minimo;

    let comparacaoContribuicao = 35 - redutorSexo;

    if (this.tipoBeneficio == 29) {
      rmi = somaMedias * (coeficiente / 100);
      if (rmi <= moedaDib.salario_minimo) {
        rmi = moedaDib.salario_minimo;
      }
    }

    if (dataBeneficio >= this.dataMP664) {
      if (this.tipoBeneficio == 1 && rmi > totalMediaDozeContribuicoes) {
        if (totalMediaDozeContribuicoes > 0)
          rmi = totalMediaDozeContribuicoes;
      }
      if (this.tipoBeneficio == 1) {
        let rmi2 = 0;
        rmi2 = somaMedias * (coeficiente / 100);
        // conclusoes.push({ string: "Média das contribuições x Coeficiente do Cálculo:", value: this.formatMoney(rmi2, currency.acronimo) });//resultados['Média das contribuições x Coeficiente do Cálculo: '] = currency.acronimo + rmi2;

        if (parseFloat(divisorContribuicoes) < rmi) {
          rmi = divisorContribuicoes;
        }

        // conclusoes.push({ string: "Renda Mensal Inicial:", value: this.formatMoney(rmi, currency.acronimo) });//resultados['Renda Mensal Inicial: '] = currency.acronimo + rmi;
      }
    }


    if (naoFocado) {
      if (fatorSeguranca <= 1) {
        // conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca });//resultados['Fp - fator previdenciário'] = fatorSeguranca;
      } else {
        // conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '(Incide fator previdenciario)' });//resultados['Fp - fator previdenciário'] = fatorSeguranca + '(Incide fator previdenciario)';
      }
    } else {

      //   if ((dataBeneficio >= dataRegra85_95 && dataBeneficio <= dataFimRegra85_95) && (this.contribuicaoPrimaria.anos >= comparacaoContribuicao)) {

      //     const redutorSexo85_95 = (this.segurado.sexo == 'f') ? 85 : 95;
      //     const redutorProfessor85_95 = (this.tipoBeneficio == 6) ? 80 : 90;

      //     if (fatorSeguranca >= 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo && this.tipoBeneficio == 4) {

      //       somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
      //       conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Fator Previdenciário favorável' });//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca + '- Fator Previdenciário favorável';
      //       this.fatorPrevidenciario = fatorSeguranca;
      //       //let rmi85_95 = this.formatMoney(somaMedias, currency.acronimo);
      //       this.rmi8595 = this.formatMoney(somaMedias, currency.acronimo);
      //       //conclusoes.push({string:"Renda Mensal Inicial com Regra 85/95:",value:rmi85_95});//resultados['Renda Mensal Inicial com Regra 85/95: '] = currency.acronimo + somaMedias

      //     } else if (fatorSeguranca < 1 && contribuicao85_95 >= redutorProfessor85_95 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo && this.tipoBeneficio == 6) {

      //       somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
      //       conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Fator Previdenciário favorável' });//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca + '- Fator Previdenciário favorável';
      //       this.fatorPrevidenciario = fatorSeguranca;
      //       //let rmi80_90 = this.formatMoney(somaMedias, currency.acronimo);
      //       this.rmi8090 = this.formatMoney(somaMedias, currency.acronimo);
      //       //conclusoes.push({string:"Renda Mensal Inicial com Regra 80/90:",value:rmi80_90});//resultados['Renda Mensal Inicial com Regra 80/90: '] = currency.acronimo + somaMedias

      //     } else if (fatorSeguranca < 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao && this.tipoBeneficio == 4) {
      //       somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
      //       conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- FP desfavorável (Aplica-se a regra 85/95)' });//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca + '- FP desfavorável (Aplica-se a regra 85/95)';
      //       this.fatorPrevidenciario = fatorSeguranca;
      //       //let rmi85_95 = this.formatMoney(somaMedias, currency.acronimo);
      //       this.rmi8595 = this.formatMoney(somaMedias, currency.acronimo);
      //       //conclusoes.push({string:"Renda Mensal Inicial com Regra 85/95:",value:rmi85_95});//resultados['Renda Mensal Inicial com Regra 85/95: '] = currency.acronimo + somaMedias;
      //     } else if (fatorSeguranca < 1 && contribuicao85_95 < redutorSexo85_95 && tempoTotalContribuicao < comparacaoContribuicao) {

      //       if (this.tipoBeneficio == 6) {
      //         conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 80/90' });//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
      //         this.fatorPrevidenciario = fatorSeguranca;
      //       } else {
      //         conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 85/95' });//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
      //         this.fatorPrevidenciario = fatorSeguranca;
      //       }

      //     } else if (fatorSeguranca > 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao < comparacaoContribuicao) {

      //       if (this.tipoBeneficio == 6) {
      //         conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 80/90' });//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
      //         this.fatorPrevidenciario = fatorSeguranca;
      //       } else {
      //         conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 85/95' });//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
      //         this.fatorPrevidenciario = fatorSeguranca;
      //       }

      //     } else if (fatorSeguranca < 1 && contribuicao85_95 < redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao) {

      //       if (this.tipoBeneficio == 6) {
      //         conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 80/90' });//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
      //         this.fatorPrevidenciario = fatorSeguranca;
      //       } else {
      //         conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 85/95' });//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
      //         this.fatorPrevidenciario = fatorSeguranca;
      //       }

      //     }
      //   }

      //   // else if (dataBeneficio < dataRegra85_95 || dataBeneficio > dataFimRegra85_95) {
      //   //   conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca });//resultados['Fp - fator Previdenciario: '] = fatorSeguranca;
      //   //   this.fatorPrevidenciario = fatorSeguranca;
      //   // }

      //   else if (dataBeneficio >= dataRegra86_96 && dataBeneficio <= dataFimRegra86_96 && this.segurado.sexo == 'f') { // 86/96
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra86_96, dataFimRegra86_96, contribuicao86_96, 86, tempoTotalContribuicao, fatorSeguranca, '86/96', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra86_96, dataFimRegra86_96, contribuicao86_96, 86, tempoTotalContribuicao, fatorSeguranca, '86/96', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else if (dataBeneficio >= dataRegra86_96 && dataBeneficio <= dataFimRegra86_96) {
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra86_96, dataFimRegra86_96, contribuicao86_96, 96, tempoTotalContribuicao, fatorSeguranca, '86/96', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra86_96, dataFimRegra86_96, contribuicao86_96, 96, tempoTotalContribuicao, fatorSeguranca, '86/96', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else if (dataBeneficio >= dataRegra87_97 && dataBeneficio <= dataFimRegra87_97 && this.segurado.sexo == 'f') {
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra87_97, dataFimRegra87_97, contribuicao87_97, 87, tempoTotalContribuicao, fatorSeguranca, '87/97', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra87_97, dataFimRegra87_97, contribuicao87_97, 87, tempoTotalContribuicao, fatorSeguranca, '87/97', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else if (dataBeneficio >= dataRegra87_97 && dataBeneficio <= dataFimRegra87_97) {
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra87_97, dataFimRegra87_97, contribuicao87_97, 97, tempoTotalContribuicao, fatorSeguranca, '87/97', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra87_97, dataFimRegra87_97, contribuicao87_97, 97, tempoTotalContribuicao, fatorSeguranca, '87/97', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else if (dataBeneficio >= dataRegra88_98 && dataBeneficio <= dataFimRegra88_98 && this.segurado.sexo == 'f') {
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra88_98, dataFimRegra88_98, contribuicao88_98, 88, tempoTotalContribuicao, fatorSeguranca, '88/98', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra88_98, dataFimRegra88_98, contribuicao88_98, 88, tempoTotalContribuicao, fatorSeguranca, '88/98', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else if (dataBeneficio >= dataRegra88_98 && dataBeneficio <= dataFimRegra88_98) {
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra88_98, dataFimRegra88_98, contribuicao88_98, 98, tempoTotalContribuicao, fatorSeguranca, '88/98', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra88_98, dataFimRegra88_98, contribuicao88_98, 98, tempoTotalContribuicao, fatorSeguranca, '88/98', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else if (dataBeneficio >= dataRegra89_99 && dataBeneficio <= dataFimRegra89_99 && this.segurado.sexo == 'f') {
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra89_99, dataFimRegra89_99, contribuicao89_99, 89, tempoTotalContribuicao, fatorSeguranca, '89/99', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra89_99, dataFimRegra89_99, contribuicao89_99, 89, tempoTotalContribuicao, fatorSeguranca, '89/99', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else if (dataBeneficio >= dataRegra89_99 && dataBeneficio <= dataFimRegra89_99) {
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra89_99, dataFimRegra89_99, contribuicao89_99, 99, tempoTotalContribuicao, fatorSeguranca, '89/99', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra89_99, dataFimRegra89_99, contribuicao89_99, 99, tempoTotalContribuicao, fatorSeguranca, '89/99', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else if (dataBeneficio >= dataRegra90_100 && dataBeneficio <= dataFimRegra90_100 && this.segurado.sexo == 'f') {
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra90_100, dataFimRegra90_100, contribuicao90_100, 90, tempoTotalContribuicao, fatorSeguranca, '90/100', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra90_100, dataFimRegra90_100, contribuicao90_100, 90, tempoTotalContribuicao, fatorSeguranca, '90/100', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else if (dataBeneficio >= dataRegra90_100 && dataBeneficio <= dataFimRegra90_100) {
      //     rmi <= somaMedias ? this.getRendaMensal(conclusoes, rmi, currency) : this.tratamentoDeRegras(dataRegra90_100, dataFimRegra90_100, contribuicao90_100, 100, tempoTotalContribuicao, fatorSeguranca, '90/100', comparacaoContribuicao, conclusoes, somaMedias);
      //     rmi <= somaMedias ? this.tratamentoDeRegras(dataRegra90_100, dataFimRegra90_100, contribuicao90_100, 100, tempoTotalContribuicao, fatorSeguranca, '90/100', comparacaoContribuicao, conclusoes, somaMedias) : this.getRendaMensal(conclusoes, rmi, currency);
      //   } else {
      //     conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca });//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca;
      //     this.fatorPrevidenciario = fatorSeguranca;
      //     this.getRendaMensal(conclusoes, rmi, currency);
      //   }
    }

    this.getRendaMensal(conclusoes, rmi, currency);

    // ULTIMA LINHA
    // if (conclusoes[conclusoes.length - 1].value >= conclusoes[conclusoes.length - 2].value) {
    //   conclusoes[conclusoes.length - 1]["class"] = "destaque";
    // } else if (conclusoes[conclusoes.length - 2].value >= conclusoes[conclusoes.length - 1].value) {
    //   this.isUpdating = true;
    //   console.log(conclusoes);
    //   let valor = conclusoes[conclusoes.length - 2];
    //   conclusoes.push(valor);
    //   conclusoes[conclusoes.length - 3] = {};
    //   conclusoes[conclusoes.length - 1]["class"] = "destaque";
    //   this.isUpdating = false;
    // }

    // conclusoes[conclusoes.length - 1]["class"] = "destaque";

    this.valorExportacao = this.formatDecimal(rmi, 2).replace(',', '.');
    this.tableData = tableData;
    this.tableOptions = {
      ...this.tableOptions,
      data: this.tableData,
    }
    // Salvar Valor do Beneficio no Banco de Dados (rmi, somaContribuicoes);
    this.calculo.soma_contribuicao = totalContribuicaoPrimaria;
    this.calculo.valor_beneficio = rmi;
    this.CalculoRgpsService.update(this.calculo);
  }

  corrigirBeneficio(beneficio, coeficiente, moeda) {
    let beneficioCorrigido = beneficio;
    if (moeda && beneficio > moeda.teto) {
      beneficioCorrigido = moeda.teto * coeficiente / 100;
      this.limited = true;
    }
    if (moeda && beneficio < moeda.salario_minimo && this.tipoBeneficio != 7) {
      beneficioCorrigido = moeda.salario_minimo
    }
    return beneficioCorrigido;
  }

  getTempoServico(redutorProfessor, redutorSexo, secundario) {
    let tempo;

    // if (secundario) {
    //   tempo = this.contribuicaoSecundaria;
    //   // let contagemSecundaria = parseInt(tempo.anos) + (((parseInt(tempo.meses) * 30) + parseInt(tempo.dias)) / 365)
    //   let contagemSecundaria = (parseInt(tempo.anos) * 365) + (parseInt(tempo.meses) * 30) + parseInt(tempo.dias);
    //   //let contagemSecundaria = parseInt(tempo.anos) + ((parseInt(tempo.meses) + (parseInt(tempo.dias) /  30.4375)) / 12);
    //   return contagemSecundaria;
    // }

    tempo = this.contribuicaoPrimaria;
    // let contagemPrimariaAnos = parseInt(tempo.anos) + (((parseInt(tempo.meses) * 30) + parseInt(tempo.dias)) / 365);
    let contagemPrimaria = (parseInt(tempo.anos) * 365) + (parseInt(tempo.meses) * 30) + (parseInt(tempo.dias));
    let contagemPrimariaAnos = contagemPrimaria / 365;
    //let contagemPrimariaAnos = parseInt(tempo.anos) + ((parseInt(tempo.meses) + (parseInt(tempo.dias) /  30.4375)) / 12);
    // if (this.tipoBeneficio == 6) { // Tempo de Serviço Professor
    //   contagemPrimariaAnos += redutorProfessor + redutorSexo;
    // }

    this.contribuicaoTotal = contagemPrimariaAnos;


    if (redutorSexo > 0) {
      if (this.tipoBeneficio == 16 || this.tipoBeneficio == 3 || this.tipoBeneficio == 4) {
        contagemPrimariaAnos += redutorSexo;
      }
    }
    return contagemPrimariaAnos;
  }

  getMesesCarencia() {
    let mesesCarencia = 180;
    if (this.dataFiliacao <= this.dataLei8213) {
      let progressiveLack = this.CarenciaProgressiva.getCarencia(this.dataInicioBeneficio.year());
      if (progressiveLack != 0) {
        mesesCarencia = progressiveLack;
      }
    }
    return mesesCarencia;
  }



  // case 1: //Auxilio Doença Previdenciario
  // case 2: //Aposentadoria por invalidez previdenciaria
  // case 5: // Aposentadoria Especial
  // case 7: // Auxilio Acidente Previdenciario 50%
  // case 3://Aposentadoria Idade Trabalhador Urbano
  // case 4://Aposentadoria Tempo de Contribuicao
  // case 16://Aposentadoria Idade Trabalhafor Rural
  // case 25://Deficiencia Grave
  // case 27://Deficiencia Leva
  // case 26://Deficiencia Moderado
  // case 28://Deficiencia PorSalvar Idade

  // getTaxaSecundaria(redutorProfessor, redutorSexo, contadorSecundario) {
  //   let taxaSecundaria = 0;
  //   let tempoServicoSecundario = this.getTempoServico(0, 0, true);
  //   let quantidadePBCSecudaria = contadorSecundario;


  //   let specieKind;
  //   if (this.tipoBeneficio == 4 || this.tipoBeneficio == 5 || this.tipoBeneficio == 6 ||
  //     this.tipoBeneficio == 8 || this.tipoBeneficio == 9 || this.tipoBeneficio == 10 ||
  //     this.tipoBeneficio == 14 || this.tipoBeneficio == 15) {
  //     specieKind = 1;
  //   } else if (this.tipoBeneficio == 3 || this.tipoBeneficio == 16 || this.tipoBeneficio == 13) {
  //     specieKind = 2;
  //   } else if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2 || this.tipoBeneficio == 11
  //     || this.tipoBeneficio == 29) {
  //     specieKind = 3;
  //   } else if (this.tipoBeneficio == 25) {
  //     specieKind = 4;
  //   } else {
  //     specieKind = null;
  //   }

  //   let tempoServico = 0;
  //   switch (specieKind) {
  //     case 1:

  //       tempoServico = tempoServicoSecundario;// / 365.25;

  //       let redutorProporcional = 0;
  //       if (this.isProportional) {
  //         redutorProporcional = 5;
  //       }
  //       taxaSecundaria = tempoServico / (35 - redutorProfessor - redutorSexo - redutorProporcional);
  //       break;
  //     case 2:
  //       tempoServico = tempoServicoSecundario * 12;
  //       let carenciaMeses = this.getMesesCarencia();
  //       taxaSecundaria = tempoServico / carenciaMeses;
  //       break;
  //     case 3:
  //       const mesesSecundaria = (this.contribuicaoSecundaria.anos * 12) + (this.contribuicaoSecundaria.meses) + (this.contribuicaoSecundaria.dias / 30);
  //       taxaSecundaria = mesesSecundaria / 12;
  //       break;
  //     case 4:
  //       tempoServico = tempoServicoSecundario; // 365;
  //       if (redutorSexo == 5) {
  //         taxaSecundaria = tempoServico / 20;
  //       } else {
  //         taxaSecundaria = tempoServico / 25;
  //       }
  //       break;
  //     case 5:
  //       tempoServico = tempoServicoSecundario; // 365;
  //       if (redutorSexo == 5) {
  //         taxaSecundaria = tempoServico / 23;
  //       } else {
  //         taxaSecundaria = tempoServico / 28;
  //       }
  //       break;
  //     case 6:
  //       tempoServico = tempoServicoSecundario;// / 365;
  //       if (redutorSexo == 5) {
  //         taxaSecundaria = tempoServico / 28;
  //       } else {
  //         taxaSecundaria = tempoServico / 33;
  //       }
  //       break;
  //   }
  //   return (taxaSecundaria >= 1) ? 1 : taxaSecundaria;
  // }

  // tratamentoDeRegras(dataRegra, dataFimRegra, valorRegra, valorComparacao, tempoTotalContribuicao, fatorSeguranca, resultString, comparacaoTempoContribuicao, conclusoes, somaMediasGeral) {
  //   let currency = this.loadCurrency(this.dataInicioBeneficio);
  //   let somaMedias = somaMediasGeral;
  //   let somaMediasString = '';

  //   if (fatorSeguranca >= 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao && this.tipoBeneficio == 4) {
  //     somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
  //     conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + ' - Fator Previdenciário favorável' });//conclusoes.fator_previdenciario = fatorSeguranca + '- Fator Previdenciário favorável';
  //     this.fatorPrevidenciario = fatorSeguranca;
  //     if (typeof somaMedias.valor === 'number') {
  //       somaMediasString = somaMedias.valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  //     }
  //     conclusoes.push({ string: 'Renda Mensal Inicial com Regra ' + resultString + ':', value: currency.acronimo + somaMediasString });//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
  //     //resultados['Renda Mensal Inicial com Regra ' + resultString + ': '] = currency.acronimo + somaMedias;
  //   } else if (fatorSeguranca >= 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao) {
  //     if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
  //       somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
  //       conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + ' - Fator Previdenciário favorável' });//conclusoes.fator_previdenciario = fatorSeguranca + '- Fator Previdenciário favorável';
  //       this.fatorPrevidenciario = fatorSeguranca;
  //       if (typeof somaMedias.valor === 'number') {
  //         somaMediasString = somaMedias.valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  //       }
  //       conclusoes.push({ string: 'Renda Mensal Inicial com Regra ' + resultString + ':', value: currency.acronimo + somaMediasString });//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
  //       //resultados['Renda Mensal Inicial com Regra'+ resultString + ' : '] = currency.acronimo + somaMedias
  //     }
  //   } else if (fatorSeguranca < 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao) {
  //     if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
  //       somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
  //       conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + ' - FP desfavorável (Aplica-se a regra ' + resultString + ')' });//conclusoes.fator_previdenciario = fatorSeguranca + '- FP desfavorável (Aplica-se a regra ' + resultString+ ')';
  //       this.fatorPrevidenciario = fatorSeguranca;
  //       if (typeof somaMedias.valor === 'number') {
  //         somaMediasString = somaMedias.valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  //       }
  //       conclusoes.push({ string: 'Renda Mensal Inicial com Regra ' + resultString + ':', value: currency.acronimo + somaMediasString });//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
  //       //resultados['specieKind = 4Renda Mensal Inicial com Regra'+ resultString + ': '] = currency.acronimo + somaMedias;
  //     }
  //   } else if (fatorSeguranca < 1 && valorRegra < valorComparacao && tempoTotalContribuicao < comparacaoTempoContribuicao) {
  //     if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
  //       conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra' + resultString });//conclusoes.fator_previdenciario = fatorSeguranca + '- Não tem direito a Regra' + resultString;
  //       this.fatorPrevidenciario = fatorSeguranca;
  //     }
  //   } else if (fatorSeguranca > 1 && valorRegra >= valorComparacao && tempoTotalContribuicao < comparacaoTempoContribuicao) {
  //     conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + ' - Não tem direito a regra ' + resultString + ' por não possuir 35 anos de contribuição' });//conclusoes.fator_previdenciario =  fatorSeguranca + '- Tem direito a regra ' + resultString +' (Não possui 35 anos de contribuicao)';
  //     this.fatorPrevidenciario = fatorSeguranca;
  //   } else if (fatorSeguranca < 1 && valorRegra < valorComparacao && tempoTotalContribuicao > comparacaoTempoContribuicao) {
  //     conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + ' - Não tem direito a Regra ' + resultString });//conclusoes.fator_previdenciario = fatorSeguranca + '- Não tem direito a Regra'+ resultString;
  //     this.fatorPrevidenciario = fatorSeguranca;
  //   } else if (this.dataInicioBeneficio < dataRegra || this.dataInicioBeneficio > dataFimRegra) {
  //     conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca });//conclusoes.fator_previdenciario = fatorSeguranca;
  //     this.fatorPrevidenciario = fatorSeguranca;
  //   }
  // }


  procurarExpectativa(idadeFracionada, ano, dataInicio, dataFim) {
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    let dataAgora = moment();
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

  projetarExpectativa(idadeFracionada, dib, conclusoes) {
    let expectativa = 0;

    let dataInicio = moment('2000-11-30');
    let dataFim = moment('2019-12-01');
    let dataHoje = moment();


    // if (moment().isAfter(moment('01/12/' + dataHoje.year(), 'DD/MM/YYYY'))) {
    //   dataFim = moment('01/12/' + dataHoje.year(), 'DD/MM/YYYY');
    // }else {
    //   dataFim = moment('01/12/' + (dataHoje.year() - 1), 'DD/MM/YYYY');
    // }

    // console.log(dataFim);




    if (dib > dataHoje) {
      let anos = Math.abs(dataHoje.diff(dib, 'years', true));

      if (anos < 1) {
        anos = Math.round(anos);
      } else {
        anos = Math.trunc(anos);
      }

      let tempo1 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-2, 'years')).year(), null, null);
      let tempo2 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-3, 'years')).year(), null, null);
      let tempo3 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-4, 'years')).year(), null, null);

      expectativa = (anos * Math.abs(((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1;

      this.formula_expectativa_sobrevida = `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - ${tempo1})) + ${tempo1}`;
      //conclusoes.push({string:'Fórmula Expectativa de Sobrevida:' ,value: `(${anos} * (((${tempo1} + ${tempo2} + ${tempo3}) / 3) - ${tempo1})) + ${tempo1}`});//formula_expectativa_sobrevida = "(anos * (((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1";
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

    return expectativa;
  }

  direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria) {
    let idadeDoSegurado = this.idadeSegurado;
    //let tempoContribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    let redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;
    let redutorSexo = (this.segurado.sexo == 'm') ? 0 : 5;
    //let anosSecundaria = (this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98)).anos;
    let anosSecundaria = tempoContribuicaoSecundaria.anos;
    let anosPrimaria = ((parseFloat(tempoContribuicaoPrimaria.anos) * 365) + (parseFloat(tempoContribuicaoPrimaria.meses) * 30) + parseFloat(tempoContribuicaoPrimaria.dias)) / 365;

    let anosContribuicao = anosPrimaria;
    this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, false, dib);

    let totalContribuicao98 = 0;
    let tempoContribuicaoPrimaria98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    if (tempoContribuicaoPrimaria98 != { anos: 0, meses: 0, dias: 0 }) {
      totalContribuicao98 = ((tempoContribuicaoPrimaria98.anos * 365) + (tempoContribuicaoPrimaria98.meses * 30) + tempoContribuicaoPrimaria98.dias) / 365;
    }

    let direito = true;
    let idadeMinima = true;
    let extra;
    let toll;



    let erroString = '';
    if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
      direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 0);
      if (!direito) {
        if (dib <= this.dataDib98) {
          direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 5);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, true, dib);
        } else {



          extra = this.calcularExtra(totalContribuicao98, redutorSexo);
          toll = this.calcularToll(totalContribuicao98, 0.4, 5, redutorSexo);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, true, dib);
          direito = this.verificarIdadeNecessaria(idadeDoSegurado, 7, 0, redutorSexo, errorArray);
          direito = direito && this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra + 5);

        }

        let contribuicao = 35 - redutorProfessor - redutorSexo - anosContribuicao;
        let tempoFracionado = this.tratarTempoFracionado(contribuicao); //Separar o tempo de contribuicao em anos, meses e dias
        if (direito) {
          // Exibir Mensagem de beneficio Proporcional, com o tempo faltante;
          // "POSSUI direito ao benefício proporcional."
          // "Falta(m) 'tempoFracionado' para possuir o direito ao benefício INTEGRAL."
          // errorArray.push("POSSUI direito ao benefício proporcional. Falta(m) " + tempoFracionado + " para possuir o direito ao benefício INTEGRAL.");
        } else {
          // Exibir Mensagem de beneficio nao concedido.
          // Falta(m) 'tempoFracionado' para completar o tempo de serviço necessário para o benefício INTEGRAL.
          // errorArray.push("Falta(m) " + tempoFracionado + " para completar o tempo de serviço necessário para o benefício INTEGRAL.");
          if (totalContribuicao98 > 0) {
            let tempo = 35 - redutorProfessor - redutorSexo - (extra + 5) - anosContribuicao;
            let tempoProporcional = this.tratarTempoFracionado(tempo);
            // Exibir Mensagem com o tempo faltante para o beneficio proporcioanl;
            // Falta(m) 'tempoProporcional' para completar o tempo de serviço necessário para o benefício PROPORCIONAL.
            //errorArray.push("Falta(m) " + tempoProporcional + " para completar o tempo de serviço necessário para o benefício PROPORCIONAL.");
          }
        }
      }
    } else if (this.tipoBeneficio == 3) {
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
      if (!idadeMinima) {
        return false;
      }
      if (!this.verificarCarencia(-5, redutorProfessor, redutorSexo, errorArray)) {
        return false;
      }
    } else if ([1915,1920,1925].includes(this.tipoBeneficio)) {

      const parametrosParaVerificarTempoDeServico = {  5: 20, 1915: 20, 1920: 15, 1925: 10 }
      const valorExtra = parametrosParaVerificarTempoDeServico[this.tipoBeneficio];

      direito = this.verificarTempoDeServico(anosContribuicao, 0, 0, valorExtra);
      if (!direito) {
        errorArray.push("Não possui direito ao benefício de aposentadoria especial.");
      }
    } else if (this.tipoBeneficio == 16) {
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
      if (!idadeMinima) {
        return false;
      }
      if (!this.verificarCarencia(0, redutorProfessor, redutorSexo, errorArray)) {
        return false;
      }
    } else if (this.tipoBeneficio == 25) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 10);
      if (!direito) {
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
      }
    } else if (this.tipoBeneficio == 26) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 6);
      if (!direito) {
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
      }
    } else if (this.tipoBeneficio == 27) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 2);
      if (!direito) {
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.   
      }
    } else if (this.tipoBeneficio == 28) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 20);
      if (!direito) {
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
      if (!this.verificarIdadeMinima(idadeDoSegurado, errorArray)) {
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a idade faltando;
      }
    }
    return direito;
  }

  getIN45() {
    this.withIN45 = true;
    if (this.tipoBeneficio == 25 || this.tipoBeneficio == 26 || this.tipoBeneficio == 27 || this.tipoBeneficio == 28) {
      this.withIN45 = false;
    }
  }

  limitarTetosEMinimos(valor, data) {
    // se a data estiver no futuro deve ser utilizado os dados no mês atual
    let moeda = data.isSameOrBefore(moment(), 'month') ? this.Moeda.getByDate(data) : this.Moeda.getByDate(moment());

    let salarioMinimo = (moeda) ? moeda.salario_minimo : 0;
    let tetoSalarial = (moeda) ? moeda.teto : 0;
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

  verificarCarencia(redutorIdade, redutorProfessor, redutorSexo, errorArray) {
    if (this.tipoBeneficio == 3 || this.tipoBeneficio == 16) {
      let mesesCarencia = 180;
      if (moment(this.segurado.data_filiacao, 'DD/MM/YYYY') < this.dataLei8213) { // Verificar se a data de filiação existe
        let anoNecessario = this.getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo)
        let carenciaProgressiva = this.CarenciaProgressiva.getCarencia(anoNecessario);
        if (carenciaProgressiva != 0) {
          mesesCarencia = carenciaProgressiva;
        } else if (anoNecessario < 1991) {
          mesesCarencia = 60;
        }
      }

      if (this.calculo.carencia < mesesCarencia) {
        let erroCarencia = "Falta(m) " + (mesesCarencia - this.calculo.carencia) + " mês(es) para a carência necessária.";
        errorArray.push(erroCarencia);
        this.erroCarenciaMinima = true;
        return false;
      }
    }
    return true;
  }

  getRendaMensal(conclusoes, rmi, currency) {
    if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6 || this.tipoBeneficio == 3 || this.tipoBeneficio == 16) {
      //conclusoes.push({string:"Renda Mensal Inicial com Fator Previdenciario:",value:this.formatMoney(somaMedias * this.fatorPrevidenciario, currency.acronimo)});//resultados['Renda Mensal Inicial com Fator Previdenciario: '] = currency.acronimo + rmi;
      // conclusoes.push({ string: "Renda Mensal Inicial com Fator Previdenciario:", value: this.formatMoney(rmi, currency.acronimo) });
    } else if (this.tipoBeneficio != 1) {
      // conclusoes.push({ string: "Renda Mensal Inicial:", value: this.formatMoney(rmi, currency.acronimo) });//resultados['Renda Mensal Inicial: '] = currency.acronimo + rmi;
    }
  }

  getIdadeFracionada() {
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    let idadeEmDias = this.dataInicioBeneficio.diff(dataNascimento, 'days');
    return idadeEmDias / 365.25;
  }



  public calcularIdadeFracionada(final, type) {

    const dataFinalFracionada = (final != null) ?
      moment(final).hour(0).minute(0).second(0).millisecond(0) :
      moment().hour(0).minute(0).second(0).millisecond(0);

    const dataDiffAtual = moment.duration(dataFinalFracionada.diff(moment(this.segurado.data_nascimento, 'DD/MM/YYYY')));

    const contribuicaoTotal = (dataDiffAtual.years() * 365.25) +
      (dataDiffAtual.months() * 30)
      + dataDiffAtual.days();

    return (type === 'days' || type === 'd') ? Math.floor(dataDiffAtual.asDays()) : contribuicaoTotal / 365.25;

  }


  mostrarReajustesAdministrativos(tableId) {
    if (this.showReajustesAdministrativos) {
      document.getElementById(tableId).scrollIntoView();
      return;
    }
    let dataInicio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
    this.ReajusteAutomatico.getByDate(dataInicio, moment())
      .then((reajustes: ReajusteAutomatico[]) => {
        let reajustesAutomaticos = reajustes;
        let valorBeneficio = (this.calculo.valor_beneficio) ? parseFloat(this.calculo.valor_beneficio) : 0;
        let dataPrevia = moment(reajustesAutomaticos[0].data_reajuste);
        let dataCorrente = dataInicio;
        for (let reajusteAutomatico of reajustesAutomaticos) {
          dataCorrente = moment(reajusteAutomatico.data_reajuste);
          let siglaMoedaDataCorrente = this.loadCurrency(dataCorrente).acronimo;
          let teto = parseFloat(reajusteAutomatico.teto);
          let minimo = parseFloat(reajusteAutomatico.salario_minimo);
          if (this.tipoBeneficio == 17) {
            minimo *= 0.3;
          } else if (this.tipoBeneficio == 18) {
            minimo *= 0.4;
          } else if (this.tipoBeneficio == 7) {
            minimo *= 0.5;
          } else if (this.tipoBeneficio == 19) {
            minimo *= 0.6;
          }
          let reajuste = reajusteAutomatico.indice != null ? parseFloat(reajusteAutomatico.indice) : 1;

          if (dataCorrente.year() == 2006 && dataCorrente.month() == 7) {
            reajuste = 1.000096;
          }

          valorBeneficio *= reajuste;
          valorBeneficio = this.convertCurrency(valorBeneficio, dataPrevia, dataCorrente);

          let limit = '-';
          if (valorBeneficio < minimo) {
            valorBeneficio = minimo;
            limit = 'M'
          }
          if (valorBeneficio > teto) {
            valorBeneficio = teto;
            limit = 'T'
          }
          let line = {
            competencia: dataCorrente.format('MM/YYYY'),
            reajuste: reajuste,
            beneficio: this.formatMoney(valorBeneficio, siglaMoedaDataCorrente),
            limite: limit
          };
          this.reajustesAdministrativosTableData.push(line);
          dataPrevia = dataCorrente;
        }
        this.reajustesAdministrativosTableOptions = {
          ...this.reajustesAdministrativosTableOptions,
          data: this.reajustesAdministrativosTableData,
        }
        this.showReajustesAdministrativos = true;
        document.getElementById(tableId).scrollIntoView();
      });
  }







  /**
   * regra de transição regra de pontos - Art 15
   * /**
 * Regra 1: regra de pontos. Elevação em um ponto por ano. Em
    2019: 96/86 e em 2033 105/100. Cálculo: 60%+2% por ano de
    contribuição que exceder 20 anos de tempo de contribuição.
    Redução de 5 anos nos pontos para professores, que
    começam em 2019 com a regra 81/91 até atingir 95/100, com
    a mesma elevação anual.
 *
 */
  public regraPontos(mesesContribuicao, valorMedio, redutorProfessor) {

    const pontos = this.contribuicaoTotal + this.idadeFracionada;

    const tempoPercentual = {
      m: 20,
      f: 15
    };

    this.conclusoesRegra1 = {
      status: false,
      msg: '',
      valor: '',
      valorString: '',
      percentual: '',
      formula: '',
      requisitoDib: '',
      segurado: '',
      aviso: '',
      destaque: ''
    };

    if (redutorProfessor == 0) {
      this.conclusoesRegra1.status = this.requisitosRegra1(pontos,
        this.dataInicioBeneficio.year(),
        this.segurado.sexo,
        this.contribuicaoTotal);
    } else {
      this.conclusoesRegra1.status = this.requisitosRegra1Prof(pontos,
        this.dataInicioBeneficio.year(),
        this.segurado.sexo,
        this.contribuicaoTotal);
    }


    if (this.conclusoesRegra1.status) {

      this.conclusoesRegra1.status = true;
      let percentualR1 = 60;

      if (Math.trunc(this.contribuicaoTotal) >= tempoPercentual[this.segurado.sexo]) {
        percentualR1 += ((Math.trunc(this.contribuicaoTotal) - tempoPercentual[this.segurado.sexo]) * 2);
      }

      this.conclusoesRegra1.percentual = percentualR1;

      percentualR1 /= 100;

      this.conclusoesRegra1.valor = (valorMedio * percentualR1)

      this.conclusoesRegra1.formula = `60 + ((${Math.trunc(this.contribuicaoTotal)} - ${tempoPercentual[this.segurado.sexo]}) * 2)`;


      const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegra1.valor, this.dataInicioBeneficio);
      this.conclusoesRegra1.valor = resutadoAjuste.valor;
      this.conclusoesRegra1.aviso = resutadoAjuste.aviso;

      this.conclusoesRegra1.valorString = this.formatMoney(this.conclusoesRegra1.valor);
    } else {
      this.conclusoesRegra1.msg = 'Não atende atende a pontuação exigida no ano da data de início do benefício.'
    }

    // console.log(this.conclusoesRegra1);

  }


  public requisitosRegra1(pontos, ano, sexo, tempo_contribuicao) {

    const requisitoContribuicoes = {
      f: 30,
      m: 35
    };

    const regra1 = {
      2019: { m: 96, f: 86 },
      2020: { m: 97, f: 87 },
      2021: { m: 98, f: 88 },
      2022: { m: 99, f: 89 },
      2023: { m: 100, f: 90 },
      2024: { m: 101, f: 91 },
      2025: { m: 102, f: 92 },
      2026: { m: 103, f: 93 },
      2027: { m: 104, f: 94 },
      2028: { m: 105, f: 95 },
      2029: { m: 105, f: 96 },
      2030: { m: 105, f: 97 },
      2031: { m: 105, f: 98 },
      2032: { m: 105, f: 99 },
      2033: { m: 105, f: 100 }
    };

    if ((sexo === 'm' && ano > 2028 && pontos >= 105)
      && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
      return true;
    }

    if ((sexo === 'f' && ano > 2033 && pontos >= 100)
      && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
      return true;
    }

    return (((ano >= 2019 && ano <= 2033) && pontos >= regra1[ano][sexo])
      && tempo_contribuicao >= requisitoContribuicoes[sexo]) ? true : false;

  }

  public requisitosRegra1Prof(pontos, ano, sexo, tempo_contribuicao) {

    const requisitoContribuicoes = {
      f: 25,
      m: 30
    };

    const regra1 = {
      2019: { m: 91, f: 81 },
      2020: { m: 92, f: 82 },
      2021: { m: 93, f: 83 },
      2022: { m: 94, f: 84 },
      2023: { m: 95, f: 85 },
      2024: { m: 96, f: 86 },
      2025: { m: 97, f: 87 },
      2026: { m: 98, f: 88 },
      2027: { m: 99, f: 89 },
      2028: { m: 100, f: 90 },
      2029: { m: 100, f: 91 },
      2030: { m: 100, f: 92 }
    };

    if ((sexo === 'm' && ano > 2028 && pontos >= 100)
      && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
      return true;
    }

    if ((sexo === 'f' && ano > 2030 && pontos >= 92)
      && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
      return true;
    }

    return (((ano >= 2019 && ano <= 2030) && pontos >= regra1[ano][sexo])
      && tempo_contribuicao >= requisitoContribuicoes[sexo]) ? true : false;

  }



  // regra 1 fim

  // regra 2 inicio
  /**
   *
   * Regra 2: conjugação de tempo de contribuição com idade
      mínima. 35 anos de contribuição para os homens e 30 para as
      mulheres + idade mínima inicial de 61 anos para os homens e
      56 para as mulheres, com elevação na idade mínima em 06
      meses por ano até atingir-se mínima 65 anos para homens e
      62 para mulheres em 2031. Cálculo: 60%+2% por ano de
      contribuição que exceder 20 anos de tempo de contribuição
      Bônus de 5 anos na idade mínima para professores, que
      sobem até 60 anos de idade para ambos os sexos.
   *
   */

  public requisitosRegra2(idade, ano, sexo, tempo_contribuicao, redutorProfessor) {

    const contribuicao_min = {
      m: (35 - redutorProfessor),
      f: (30 - redutorProfessor)
    };


    const regra2 = {
      2019: { m: 61, f: 56 },
      2020: { m: 61.5, f: 56.5 },
      2021: { m: 62, f: 57 },
      2022: { m: 62.5, f: 57.5 },
      2023: { m: 63, f: 58 },
      2024: { m: 63.5, f: 58.5 },
      2025: { m: 64, f: 59 },
      2026: { m: 64.5, f: 59.5 },
      2027: { m: 65, f: 60 },
      2028: { m: 65, f: 60.5 },
      2029: { m: 65, f: 61 },
      2030: { m: 65, f: 61.5 },
      2031: { m: 65, f: 62 }
    };

    if ((sexo === 'm' && ano > 2027 && idade >= (65 - redutorProfessor)) && tempo_contribuicao >= contribuicao_min[sexo]) {
      return true;
    }

    if ((sexo === 'f' && ano > 2031 && idade >= (62 - redutorProfessor)) && tempo_contribuicao >= contribuicao_min[sexo]) {
      return true;
    }

    return (((ano >= 2019 && ano <= 2031) && idade >= (regra2[ano][sexo] - redutorProfessor))
      && tempo_contribuicao >= contribuicao_min[sexo]) ? true : false;

  }




  /**
   * regra de transição regra de pontos - Art 16
   * 
   */
  public regraTempoContribuicaoIdadeMinima(mesesContribuicao, valorMedio, redutorProfessor) {

    this.conclusoesRegra2 = {
      status: false,
      msg: '',
      valor: 0,
      valorString: '',
      percentual: 0,
      formula: '',
      requisitoDib: '',
      segurado: '',
      aviso: '',
      destaque: ''
    };

    const tempoPercentual = {
      m: 20,
      f: 15
    };

    this.conclusoesRegra2.status = this.requisitosRegra2(
      this.idadeFracionada,
      this.dataInicioBeneficio.year(),
      this.segurado.sexo,
      this.contribuicaoTotal,
      redutorProfessor);

    if (this.conclusoesRegra2.status) {

      this.conclusoesRegra2.status = true;
      let percentualR2 = 60;
      if (Math.trunc(this.contribuicaoTotal) >= tempoPercentual[this.segurado.sexo]) {
        percentualR2 += ((Math.trunc(this.contribuicaoTotal) - tempoPercentual[this.segurado.sexo]) * 2);
      }

      this.conclusoesRegra2.percentual = percentualR2;

      percentualR2 /= 100;

      this.conclusoesRegra2.valor = (valorMedio * percentualR2)

      this.conclusoesRegra2.formula = `60 + ((${Math.trunc(this.contribuicaoTotal)} - ${tempoPercentual[this.segurado.sexo]}) * 2)`;

      const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegra2.valor, this.dataInicioBeneficio);
      this.conclusoesRegra2.valor = resutadoAjuste.valor;
      this.conclusoesRegra2.aviso = resutadoAjuste.aviso;

      this.conclusoesRegra2.valorString = this.formatMoney(this.conclusoesRegra2.valor);

    } else {

      this.conclusoesRegra2.msg = 'Não atende a idade mínima exigida no ano da data de início do benefício.'

    }


    // console.log(this.conclusoesRegra2);


  }

  // regra 2 fim


  // Regra 3
  /**
   * Regra 3: Quem estiver até a 2 anos de se aposentar por
    tempo de contribuição mínimo poderá optar por aposentar-se
    sem cumprir idade mínima, mediante pagamento de pedágio
    de 50% do tempo que faltava e com a aplicação do fator
    previdenciário
   */

  public requisitosRegra3(sexo, tempo_contribuicao) {

    let status = false;
    const contribuicao_min = { m: 33, f: 28 };
    // const contribuicao_max = { m: 35, f: 30 };

    if (tempo_contribuicao >= contribuicao_min[sexo]) {
      status = true;
    }

    return status;

  }

  public regraPedagio50(mesesContribuicao, valorMedio) {


    this.conclusoesRegra3 = {
      status: false,
      msg: '',
      valor: '',
      valorString: '',
      exibirValor: false,
      dataParaAposentar: '',
      tempoDeContribuicaoAposentar: '',
      tempoDeAtualDecontribuicao: '',
      tempoDePedagio: '',
      tempoDePedagioTotal: '',
      formula: '',
      segurado: '',
      fator: '',
      destaque: ''
    };

    const tempoAtePec = this.getContribuicaoObj(this.calculo.contribuicao_primaria_atual);
    const tempoContribuicaoAnosAtePec = (((tempoAtePec.anos) * 365) + ((tempoAtePec.meses) * 30) + (tempoAtePec.dias)) / 365;

    this.conclusoesRegra3.status = this.requisitosRegra3(this.segurado.sexo,
      tempoContribuicaoAnosAtePec);

    if (this.conclusoesRegra3.status) {
      const contribuicao_max = { m: 35, f: 30 };

      const dibParaRegra3 = this.dataInicioBeneficio.clone();

      let contribuicaoDiff = 0;
      let tempoDePedagio = 0;
      let tempoFinalContrib = 0;
      let tempoDePedagioTotal = 0;


      if (tempoContribuicaoAnosAtePec <= contribuicao_max[this.segurado.sexo]) {
        contribuicaoDiff = (contribuicao_max[this.segurado.sexo] - this.contribuicaoTotal);

        tempoDePedagio = ((contribuicao_max[this.segurado.sexo] - tempoContribuicaoAnosAtePec) * 0.5);
        tempoFinalContrib = contribuicao_max[this.segurado.sexo] + tempoDePedagio;
      }

      tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;

      this.conclusoesRegra3.tempoDePedagioTotal = this.tratarTempoFracionado(tempoDePedagioTotal);
      this.conclusoesRegra3.tempoDeContribuicaoAposentar = this.tratarTempoFracionado(tempoFinalContrib);

      // this.conclusoesRegra3.formula = contribuicao_max[this.segurado.sexo] +' - ((' + contribuicao_max[this.segurado.sexo] + '-' + this.contribuicaoTotal + ') * 0.5)';
      this.conclusoesRegra3.dataParaAposentar = dibParaRegra3.add(tempoDePedagioTotal, 'years').format('DD/MM/YYYY');
      this.conclusoesRegra3.tempoDeAtualDecontribuicao = this.tratarTempoFracionado(this.contribuicaoTotal);

      if (tempoDePedagioTotal > 0.00273973) {

        this.conclusoesRegra3.tempoDePedagio = 'Não faz jus a aplicação desta regra falta '
          + moment.duration((tempoDePedagioTotal * 365.25), 'd').locale("pt-BR").humanize()
          + ' para cumprir o pedágio.';

      } else {

        this.conclusoesRegra3.tempoDePedagio = 'Alcançou os requisitos de tempo de contribuição';
        this.conclusoesRegra3.valor = valorMedio * this.fatorPrevidenciario;

        const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegra3.valor, this.dataInicioBeneficio);
        this.conclusoesRegra3.valor = resutadoAjuste.valor;
        this.conclusoesRegra3.aviso = resutadoAjuste.aviso;

        this.conclusoesRegra3.valorString = this.formatMoney(this.conclusoesRegra3.valor);
        this.conclusoesRegra3.fator = this.fatorPrevidenciario;
        this.conclusoesRegra3.exibirValor = true;

      }

    } else {

      const contribuicao_min = { m: 33, f: 28 };


      if (tempoContribuicaoAnosAtePec > 0) {

        this.conclusoesRegra3.msg = `Não atende os requisitos desta regra. O segurado precisa de
      ${contribuicao_min[this.segurado.sexo]} anos de contribuição na data de entrada em vigor da EC nº 103/2019 `;

      } else {

        this.conclusoesRegra3.msg = `O segurado não possuí tempo de contribuição na data de entrada em vigor da EC nº 103/2019 `;

      }



    }

    // console.log(this.conclusoesRegra3);

  }
  // regra 3 fim


  /**
   * Regra 4 - pedagio 100%
   *
   */

  public requisitosRegra4(sexo, tempo_contribuicao, redutorProfessor, idade) {

    let status = false;

    const contribuicao_idade_min = {
      m: 60 - redutorProfessor,
      f: 57 - redutorProfessor
    };

    const contribuicao_min = {
      m: 35 - redutorProfessor,
      f: 30 - redutorProfessor
    };

    //tempo_contribuicao >= contribuicao_min[sexo] &&


    if (idade >= contribuicao_idade_min[sexo]) {
      status = true;
    }

    return status;

  }

  public regraPedagio100(mesesContribuicao, valorMedio, redutorProfessor) {


    this.conclusoesRegra4 = {
      status: false,
      msg: '',
      valor: '',
      valorString: '',
      exibirValor: false,
      dataParaAposentar: '',
      tempoDeContribuicaoAposentar: '',
      tempoDeAtualDecontribuicao: '',
      tempoDePedagio: '',
      tempoDePedagioTotal: '',
      formula: '',
      segurado: '',
      destaque: ''
    };

    const tempoAtePec = this.getContribuicaoObj(this.calculo.contribuicao_primaria_atual);
    const tempoContribuicaoAnosAtePec = (((tempoAtePec.anos) * 365.25) + ((tempoAtePec.meses) * 30.4375) + (tempoAtePec.dias)) / 365.25;

    const teste_tempoContribuicaoAtePecMoment = moment.duration({
      years: tempoAtePec.anos,
      months: tempoAtePec.meses,
      days: tempoAtePec.dias
    });

    const tempoTotal = this.getContribuicaoObj(this.calculo.contribuicao_primaria_19);


    const teste_tempoContribuicaoTotalMoment = moment.duration({
      years: tempoTotal.anos,
      months: tempoTotal.meses,
      days: tempoTotal.dias
    });


    this.conclusoesRegra4.status = this.requisitosRegra4(this.segurado.sexo,
      tempoContribuicaoAnosAtePec,
      redutorProfessor,
      this.idadeFracionada);

    if (this.conclusoesRegra4.status && tempoContribuicaoAnosAtePec > 0) {

      const contribuicao_min = {
        m: 35 - redutorProfessor,
        f: 30 - redutorProfessor
      };

      const contribuicao_min_moment = {
        m: moment.duration(35, 'y').subtract(redutorProfessor, 'y'),
        f: moment.duration(30, 'y').subtract(redutorProfessor, 'y')
      };

      const dibParaRegra4 = this.dataInicioBeneficio.clone();

      // let contribuicaoDiff = 0;
      // let tempoDePedagio = 0;
      // let tempoFinalContribComPedagio = 0;
      // let tempoDePedagioTotal = 0;


      // contribuicaoDiff = (contribuicao_min[this.segurado.sexo] - this.contribuicaoTotal);

      // tempoDePedagio = (contribuicao_min[this.segurado.sexo] - tempoContribuicaoAnosAtePec);
      // tempoFinalContribComPedagio = contribuicao_min[this.segurado.sexo] + tempoDePedagio;


      let tempoDePedagio = contribuicao_min_moment[this.segurado.sexo].clone();
      tempoDePedagio = tempoDePedagio.subtract(teste_tempoContribuicaoAtePecMoment);


      let tempoFinalContribComPedagio = contribuicao_min_moment[this.segurado.sexo].clone();
      tempoFinalContribComPedagio = tempoFinalContribComPedagio.add(tempoDePedagio);

      this.conclusoesRegra4.tempoDePedagioTotal = this.tratarTempoFracionadoMoment(
        tempoDePedagio.years(),
        tempoDePedagio.months(),
        tempoDePedagio.days(),
        true
      );
      this.conclusoesRegra4.tempoDeContribuicaoAposentar = this.tratarTempoFracionadoMoment(
        tempoFinalContribComPedagio.years(),
        tempoFinalContribComPedagio.months(),
        tempoFinalContribComPedagio.days(),
        true
      );

      //   tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;

      let tempoDePedagioTotal = tempoDePedagio.clone();
      tempoDePedagioTotal = tempoDePedagioTotal.add(tempoDePedagio);

      // this.conclusoesRegra4.tempoDePedagioTotal = this.tratarTempoFracionado(tempoDePedagio);
      // this.conclusoesRegra4.tempoDeContribuicaoAposentar = this.tratarTempoFracionado(tempoFinalContribComPedagio);

      // this.conclusoesRegra4.formula = contribuicao_max[this.segurado.sexo] +' - ((' + contribuicao_max[this.segurado.sexo] + '-' + this.contribuicaoTotal + ') * 0.5)';
      this.conclusoesRegra4.dataParaAposentar = dibParaRegra4.add(tempoDePedagioTotal, 'years').format('DD/MM/YYYY');
      this.conclusoesRegra4.tempoDeAtualDecontribuicao = this.tratarTempoFracionado(this.contribuicaoTotal);



      // console.log('------ inicio ---------');
      // contribuicao_min_moment
      // teste_tempoContribuicaoAtePecMoment
      // teste_tempoContribuicaoTotalMoment


      // console.log('------ p --------');

      // console.log(tempoDePedagio);
      // console.log(tempoFinalContribComPedagio);
      // console.log(teste_tempoContribuicaoTotalMoment);

      // console.log(tempoFinalContribComPedagio.asDays());
      // console.log(teste_tempoContribuicaoTotalMoment.asDays());

      // console.log('---')
      // console.log(teste_tempoContribuicaoTotalMoment.asDays() >= tempoFinalContribComPedagio.asDays())
      // console.log(contribuicao_min_moment.f === teste_tempoContribuicaoTotalMoment)
      // console.log(contribuicao_min_moment.f === teste_tempoContribuicaoTotalMoment)

      // console.log('------ p --------');

      // if (this.contribuicaoTotal.toPrecision(5) >= tempoFinalContribComPedagio.toPrecision(5)
      //   ||
      //   ((this.contribuicaoTotal + 0.0014).toPrecision(5) >= tempoFinalContribComPedagio.toPrecision(5))) {
      if (teste_tempoContribuicaoTotalMoment.asDays() >= tempoFinalContribComPedagio.asDays()) {

        this.conclusoesRegra4.tempoDePedagio = `Alcançou os requisitos de tempo de contribuição`;
        // this.conclusoesRegra4.tempoDePedagio = this.tratarAnosFracionado(tempoDePedagio);
        const resutadoAjuste = this.limitarTetosEMinimos(valorMedio, this.dataInicioBeneficio);
        this.conclusoesRegra4.valor = resutadoAjuste.valor;
        //  this.conclusoesRegra4.valor = valorMedio;
        this.conclusoesRegra4.valorString = this.formatMoney(this.conclusoesRegra4.valor);
        this.conclusoesRegra4.exibirValor = true;

      } else {

        let contribuicaoDiff = tempoFinalContribComPedagio.clone()
        contribuicaoDiff = contribuicaoDiff.subtract(teste_tempoContribuicaoTotalMoment).subtract(1, 'd');

        let diffRegraDe100 = this.tratarTempoFracionadoMoment(
          contribuicaoDiff.years(),
          contribuicaoDiff.months(),
          contribuicaoDiff.days(),
          false
        );



        this.conclusoesRegra4.tempoDePedagio = 'Não faz jus a aplicação desta regra faltam - '
          + diffRegraDe100 + ' para cumprir o pedágio.';



      }

    } else {

      const contribuicao_idade_min = {
        m: 60 - redutorProfessor,
        f: 57 - redutorProfessor
      };

      this.conclusoesRegra4.status = false;

      if (tempoContribuicaoAnosAtePec > 0) {
        this.conclusoesRegra4.msg = `Não atende os requisitos desta regra. O segurado deve possuir
          ${contribuicao_idade_min[this.segurado.sexo]} anos de idade.`;
      } else {

        this.conclusoesRegra4.msg = `O segurado não possuí tempo de contribuição na data de entrada em vigor da EC nº 103/2019 `;

      }


    }

    // console.log(this.conclusoesRegra4);

  }


  // regra 4 fim



  /* 
    Regra 5 idade:
  */
  public getparametrosRegra5(ano) {

    const regra5 = {
      2019: { f: 60, m: 65 },
      2020: { f: 60.5, m: 65 },
      2021: { f: 61, m: 65 },
      2022: { f: 61.5, m: 65 },
      2023: { f: 62, m: 65 }
    };

    if (ano <= 2019) {
      return regra5[2019];
    }

    if (ano > 2019 && ano <= 2023) {
      return regra5[ano];
    }

    if (ano > 2023) {
      return regra5[2023];
    }

  }

  /**
   * regra 5 - idade
   */
  public requisitosRegra5(idade, ano, sexo, tempo_contribuicao) {

    const contribuicao_min = 15;

    const regra5 = this.getparametrosRegra5(ano);



    if (sexo === 'm' && idade >= 65 && tempo_contribuicao >= contribuicao_min) {
      return true;
    };


    return (sexo === 'f' && idade >= regra5['f'] && tempo_contribuicao >= contribuicao_min) ? true : false;

  }

  /**
   * regra de transição idade - Art 18
   */
  public regraIdade(mesesContribuicao, valorMedio) {

    this.conclusoesRegra5 = {
      status: false,
      msg: '',
      valor: '',
      valorString: '',
      percentual: '',
      formula: '',
      requisitoDib: '',
      segurado: '',
      destaque: ''
    };

    const tempoPercentual = {
      m: 20,
      f: 15
    };

    this.conclusoesRegra5.status = this.requisitosRegra5(
      this.idadeFracionada,
      this.dataInicioBeneficio.year(),
      this.segurado.sexo,
      this.contribuicaoTotal);

    const idadeEm2019 = this.calcularIdadeFracionada('2019-12-31', 'y');

    const regraIdadeAnterior = this.requisitosRegra5(
      idadeEm2019,
      2019,
      this.segurado.sexo,
      this.contribuicaoTotal);

    if (this.conclusoesRegra5.status || regraIdadeAnterior) {

      this.conclusoesRegra5.status = true;

      let percentual = 60;
      this.conclusoesRegra5.formula = `60% (percentual mínimo)`
      if (this.contribuicaoTotal > tempoPercentual[this.segurado.sexo]) {
        percentual += ((Math.trunc(this.contribuicaoTotal) - tempoPercentual[this.segurado.sexo]) * 2);
        this.conclusoesRegra5.formula = `60 + ((${Math.trunc(this.contribuicaoTotal)} - ${tempoPercentual[this.segurado.sexo]}) * 2)`;
      }

      this.conclusoesRegra5.percentual = percentual;
      percentual /= 100;
      this.conclusoesRegra5.valor = (valorMedio * percentual);

      const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegra5.valor, this.dataInicioBeneficio);
      this.conclusoesRegra5.valor = resutadoAjuste.valor;
      this.conclusoesRegra5.aviso = resutadoAjuste.aviso;

      this.conclusoesRegra5.valorString = this.formatMoney(this.conclusoesRegra5.valor);

    } else {
      const idadeMin = this.getparametrosRegra5(this.dataInicioBeneficio.year());
      this.conclusoesRegra5.msg = 'Não atende os requisitos desta regra. O segurado deve possuir ' + idadeMin[this.segurado.sexo] + ' ano(s)';
    }

    // console.log(this.conclusoesRegra5);

  }

  // regra 5 fim






  /**
   * aplicarRegrasTransicao
  */
  public aplicarRegrasTransicao(mesesContribuicao, valorMedio, redutorProfessor) {

    // const mesesContribuicao = this.getDifferenceInMonths(moment('1994-07-01'), this.dataInicioBeneficio);
    // const valorMedio = (this.valorTotalContribuicoes / mesesContribuicao);
    // const redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;

    // console.log(mesesContribuicao);
    // console.log(this.tipoBeneficio);

    if (
      (this.contribuicaoPrimaria.anos > 0 ||
        this.contribuicaoPrimaria.meses > 0 ||
        this.contribuicaoPrimaria.dias > 0) &&
      (this.listaValoresContribuidos.length > 0)
    ) {
      this.errorRegrasTransicao.status = false;

      this.regraPontos(mesesContribuicao, valorMedio, redutorProfessor);
      this.regraTempoContribuicaoIdadeMinima(mesesContribuicao, valorMedio, redutorProfessor);
      this.regraPedagio50(mesesContribuicao, valorMedio);
      this.regraPedagio100(mesesContribuicao, valorMedio, redutorProfessor);
      this.regraIdade(mesesContribuicao, valorMedio);

    } else {
      this.errorRegrasTransicao.status = true;
      this.errorRegrasTransicao.msg = 'Não e possível calcular falta tempo de contribuição ou valores de contribuição.';
    }

  }




  // aposentadoria inicio especial

  public regraAposentadoriaEspecial(mesesContribuicao, valorMedio, tipoBeneficio) {

    this.conclusoesRegraAposentadoriaEspecial = {
      status: false,
      msg: '',
      percentual: 0,
      formula: '',
      valor: 0,
      valorString: '',
      pontosSegurado: 0,
      pontosNecessarios: 0,
      tempoContribuicaoSegurado: 0,
      tempoContribuicaoMin: 0,
      diffTempoContribuicao: 0,
      diffPontos: 0,
      diffIdadeRequisito: 0,
      statusTempo: true,
      statusPontos: true,
      statusIdade: true,
      destaque: ''
    };

    const tempoRegra = {
      1915: 15,
      1920: 20,
      1925: 25
    };

    const tempoPercentual = {
      1915: 15,
      1920: 20,
      1925: 20
    };

    const regraEspecial = {
      1915: { pontos: 66 },
      1920: { pontos: 76 },
      1925: { pontos: 86 }
    };

    const idadeTransitoria = {
      1915: 55,
      1920: 58,
      1925: 60
    }

    const pontosEspecial = Math.trunc(this.contribuicaoTotal + this.idadeFracionada);

    this.conclusoesRegraAposentadoriaEspecial.status = (pontosEspecial >= regraEspecial[tipoBeneficio].pontos)
      && (this.contribuicaoTotal >= tempoRegra[tipoBeneficio]);

    if (this.isRegraTransitoria) {
      this.conclusoesRegraAposentadoriaEspecial.status = (this.idadeFracionada >= idadeTransitoria[tipoBeneficio]);
    }

    if (this.conclusoesRegraAposentadoriaEspecial.status) {


      let percentual = ((Math.trunc(this.contribuicaoTotal) - tempoPercentual[tipoBeneficio]) * 2);
      percentual += 60;

      this.conclusoesRegraAposentadoriaEspecial.percentual = percentual;

      percentual /= 100;

      this.conclusoesRegraAposentadoriaEspecial.valor = (valorMedio * percentual);

      this.conclusoesRegraAposentadoriaEspecial.formula = `60 + ((${Math.trunc(this.contribuicaoTotal)} 
                                                              - ${tempoPercentual[tipoBeneficio]}) * 2)`;

      const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegraAposentadoriaEspecial.valor, this.dataInicioBeneficio);
      this.conclusoesRegraAposentadoriaEspecial.valor = resutadoAjuste.valor;
      this.conclusoesRegraAposentadoriaEspecial.aviso = resutadoAjuste.aviso;

      this.conclusoesRegraAposentadoriaEspecial.valorString = this.formatMoney(this.conclusoesRegraAposentadoriaEspecial.valor);
      this.updateResultadoCalculo(this.conclusoesRegraAposentadoriaEspecial.valor);

    } else {
      this.conclusoesRegraAposentadoriaEspecial.msg = 'O Segurado não atingiu os requisitos: ';

      if (this.contribuicaoTotal < tempoRegra[tipoBeneficio]) {
        this.conclusoesRegraAposentadoriaEspecial.statusTempo = false;
        this.conclusoesRegraAposentadoriaEspecial.diffTempoContribuicao =
          this.tratarTempoFracionado(tempoRegra[tipoBeneficio] - this.contribuicaoTotal);
      }

      if (this.isRegraTransitoria) {
        if (this.idadeFracionada < idadeTransitoria[tipoBeneficio]) {
          this.conclusoesRegraAposentadoriaEspecial.statusIdade = false;
          this.conclusoesRegraAposentadoriaEspecial.diffIdadeRequisito =
            this.tratarTempoFracionado((idadeTransitoria[tipoBeneficio] - this.idadeFracionada));
        }
      } else {
        if (pontosEspecial < regraEspecial[tipoBeneficio].pontos) {
          this.conclusoesRegraAposentadoriaEspecial.statusPontos = false;
          this.conclusoesRegraAposentadoriaEspecial.diffPontos = regraEspecial[tipoBeneficio].pontos - pontosEspecial;
        }
      }
      this.updateResultadoCalculo(0.00);
    }



    // console.log(this.conclusoesRegraAposentadoriaEspecial);
  }
  // aposentadoria fim especial


  // pensao por morte
  public regraPensaoPorMorte(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio, sexo_instituidor) {

    this.conclusoesRegraPensaoObito = {
      status: true,
      msg: '',
      percentual: 0,
      percentualBeneficio: 0,
      formula: '',
      formulaBeneficio: '',
      valor: 0,
      valorBase: 0,
      valorString: '',
      valorUltimoBeneficio: 0,
      valorObs: '',
      sexo_instituidor: '',
      destaque: ''
    };

    const tempoPercentual = {
      m: 20,
      f: 15
    };


    let percentual = 100;
    let percentualBeneficio = 100;

    // 1ª parte
    percentualBeneficio = ((Math.trunc(this.contribuicaoTotal) - tempoPercentual[this.calculo.sexo_instituidor]) * 2);
    percentualBeneficio += 60;
    this.conclusoesRegraPensaoObito.formulaBeneficio = `60% + ((${Math.trunc(this.contribuicaoTotal)}
                                                            - ${tempoPercentual[this.calculo.sexo_instituidor]}) * 2%)`;

    // 2ª parte
    percentual = (this.calculo.num_dependentes * 10);
    percentual += 50;
    this.conclusoesRegraPensaoObito.formula = `50% + (${this.calculo.num_dependentes}-dependentes * 10%)`;

    if (this.calculo.obito_decorrencia_trabalho === 1) {

      percentualBeneficio = 100;
      this.conclusoesRegraPensaoObito.formulaBeneficio = `100% (consequente de acidente de trabalho, doença profissional ou doença do trabalho)`;

    }

    if (this.calculo.depedente_invalido === 1) {

      percentual = 100;
      this.conclusoesRegraPensaoObito.formula = `100% (Possuí dependente inválido ou com deficiência intelectual, mental ou grave)`;

    }

    // percentual = (percentual > 100) ? 100 : percentual;

    this.conclusoesRegraPensaoObito.percentualBeneficio = percentualBeneficio;

    this.conclusoesRegraPensaoObito.percentual = percentual;

    percentual /= 100;
    percentualBeneficio /= 100;

    let valorUltimoBeneficio;
    switch (tipoBeneficio) {
      case 1900: // é aposentado então o valor e calculado com base no valor o ultimo beneficio que usuario digitou para calculo

        valorUltimoBeneficio = parseFloat(this.calculo.ultimo_beneficio);
        this.conclusoesRegraPensaoObito.valor = (percentual == 100) ? valorUltimoBeneficio : (valorUltimoBeneficio * percentual);

        break;
      case 1901: // não é aposentado 

        this.conclusoesRegraPensaoObito.sexo_instituidor = (this.calculo.sexo_instituidor === 'm') ? 'Masculino' : 'Feminino';
        valorUltimoBeneficio = (valorMedio * percentualBeneficio);
        this.conclusoesRegraPensaoObito.valor = (percentual == 100) ? valorUltimoBeneficio : (valorUltimoBeneficio * percentual);

        break;
    }

    const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegraPensaoObito.valor, this.dataInicioBeneficio);
    this.conclusoesRegraPensaoObito.valor = resutadoAjuste.valor;
    this.conclusoesRegraPensaoObito.valorAviso = resutadoAjuste.aviso;
    this.conclusoesRegraPensaoObito.valorString = this.formatMoney(this.conclusoesRegraPensaoObito.valor);
    this.conclusoesRegraPensaoObito.valorUltimoBeneficio = this.formatMoney(valorUltimoBeneficio);

    this.updateResultadoCalculo(this.conclusoesRegraPensaoObito.valor);

    //console.log(this.conclusoesRegraPensaoObito);

  }
  // fim pensao por morte

  // incapacidade permanente
  public regraIncapacidade(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio) {


    this.conclusoesRegraIncapacidade = {
      status: true,
      msg: '',
      percentual: 0,
      formula: '',
      valor: 0,
      valorString: '',
      valorObs: '',
      destaque: ''
    };

    const tempoPercentual = {
      m: 20,
      f: 15
    };

    let percentual = 60;
    if (this.calculo.obito_decorrencia_trabalho !== 1) {

      if (Math.trunc(this.contribuicaoTotal) > tempoPercentual[this.segurado.sexo]) {

        percentual += ((Math.trunc(this.contribuicaoTotal) - tempoPercentual[this.segurado.sexo]) * 2);
        this.conclusoesRegraIncapacidade.formula = `60% + ((${Math.trunc(this.contribuicaoTotal)}
                                                    - ${tempoPercentual[this.segurado.sexo]}) * 2%)`;
      } else {
        this.conclusoesRegraIncapacidade.formula = `60% (o segurado possuí menos de 
                                                      ${tempoPercentual[this.segurado.sexo]} anos de contribuição.)`;
      }

      //  percentual = (percentual > 100) ? 100 : percentual;

    } else if (this.calculo.obito_decorrencia_trabalho === 1) {
      percentual = 100;
      this.conclusoesRegraIncapacidade.formula = `100% (consequente de acidente de trabalho, doença profissional ou doença do trabalho)`;
    }

    this.conclusoesRegraIncapacidade.percentual = percentual;
    this.conclusoesRegraIncapacidade.valor = (percentual == 100) ? valorMedio : (valorMedio * (percentual / 100));

    const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegraIncapacidade.valor, this.dataInicioBeneficio);
    this.conclusoesRegraIncapacidade.valor = resutadoAjuste.valor;
    this.conclusoesRegraIncapacidade.valorAviso = resutadoAjuste.aviso;
    this.conclusoesRegraIncapacidade.valorString = this.formatMoney(this.conclusoesRegraIncapacidade.valor);
    this.updateResultadoCalculo(this.conclusoesRegraIncapacidade.valor);

    // console.log(this.conclusoesRegraIncapacidade);

  }
  // fim incapacidade permanente



  // incapacidade permanente
  public regraAuxilioDoenca(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio) {

    this.conclusoesRegrasAuxilioDoenca = {
      status: true,
      msg: '',
      percentual: 0,
      formula: '',
      valor: 0,
      valorString: '',
      valorObs: '',
      destaque: ''
    };

    this.conclusoesRegrasAuxilioDoenca.percentual = 91;
    this.conclusoesRegrasAuxilioDoenca.valor = (valorMedio * (this.conclusoesRegrasAuxilioDoenca.percentual / 100));

    if (this.conclusoesRegrasAuxilioDoenca.valor > this.contribuicoesPrimarias12Media) {
      this.conclusoesRegrasAuxilioDoenca.valor = this.contribuicoesPrimarias12Media;
    }

    const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegrasAuxilioDoenca.valor, this.dataInicioBeneficio);
    this.conclusoesRegrasAuxilioDoenca.valor = resutadoAjuste.valor;
    this.conclusoesRegrasAuxilioDoenca.valorAviso = resutadoAjuste.aviso;
    this.conclusoesRegrasAuxilioDoenca.valorString = this.formatMoney(this.conclusoesRegrasAuxilioDoenca.valor);

    this.updateResultadoCalculo(this.conclusoesRegrasAuxilioDoenca.valor);

    // console.log(this.conclusoesRegrasAuxilioDoenca);

  }
  // fim incapacidade permanente



  // Auxilio Acidente
  public regraAuxilioAcidente(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio) {

    this.conclusoesRegrasAuxilioAcidente = {
      status: true,
      msg: '',
      percentual: 0,
      percentualParte1: 0,
      formula: '',
      formulaParte1: '',
      valor: 0,
      valorParte1: 0,
      valorString: '',
      valorParte1String: '',
      valorParte1Aviso: '',
      valorObs: '',
      destaque: ''
    };

    const tempoPercentualParte1 = {
      m: 20,
      f: 15
    };

    let percentualParte1 = 60;
    if (Math.trunc(this.contribuicaoTotal) > tempoPercentualParte1[this.segurado.sexo]) {

      percentualParte1 += ((Math.trunc(this.contribuicaoTotal) - tempoPercentualParte1[this.segurado.sexo]) * 2);
      this.conclusoesRegrasAuxilioAcidente.formulaParte1 = `60% + ((${Math.trunc(this.contribuicaoTotal)}
                                                  - ${tempoPercentualParte1[this.segurado.sexo]}) * 2%)`;

    } else {

      this.conclusoesRegrasAuxilioAcidente.formulaParte1 = `60% (o segurado possuí menos de 
                                                    ${tempoPercentualParte1[this.segurado.sexo]} anos de contribuição.)`;

    }

    if (this.calculo.obito_decorrencia_trabalho === 1) {

      percentualParte1 = 100;
      this.conclusoesRegrasAuxilioAcidente.formulaParte1 = `100% (consequente de acidente de trabalho, doença profissional ou doença do trabalho)`;

    }

    this.conclusoesRegrasAuxilioAcidente.percentualParte1 = percentualParte1;
    this.conclusoesRegrasAuxilioAcidente.valorParte1 = (percentualParte1 === 100) ? valorMedio : (valorMedio * (percentualParte1 / 100));
    const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegrasAuxilioAcidente.valorParte1, this.dataInicioBeneficio);

    this.conclusoesRegrasAuxilioAcidente.valorParte1 = resutadoAjuste.valor;
    this.conclusoesRegrasAuxilioAcidente.valorParte1Aviso = resutadoAjuste.aviso;

    this.conclusoesRegrasAuxilioAcidente.valorParte1String = this.formatMoney(this.conclusoesRegrasAuxilioAcidente.valorParte1);


    this.conclusoesRegrasAuxilioAcidente.percentual = 50;
    this.conclusoesRegrasAuxilioAcidente.valor = (this.conclusoesRegrasAuxilioAcidente.valorParte1 *
      (this.conclusoesRegrasAuxilioAcidente.percentual / 100));
    this.conclusoesRegrasAuxilioAcidente.valorString = this.formatMoney(this.conclusoesRegrasAuxilioAcidente.valor);

    this.updateResultadoCalculo(this.conclusoesRegrasAuxilioAcidente.valor);

    // console.log(this.conclusoesRegrasAuxilioAcidente);

  }
  // fim Auxilio Acidente



  /**
   * Idade Final
   */
  public requisitosIdadeFinal(idade, ano, sexo, tempo_contribuicao, tipoBeneficio) {


    let contribuicao_min = { m: 20, f: 15 };
    let idade_min = { m: 65, f: 62 };

    if (tipoBeneficio === 16) {
      contribuicao_min = { m: 15, f: 15 };
      idade_min = { m: 60, f: 55 };
    }

    if (tempo_contribuicao < contribuicao_min[sexo]) {
      return {
        status: false, msg: `O segurado não possuí tempo mínimo de contribuição, faltam
                                ${this.tratarTempoFracionado((contribuicao_min[sexo] - tempo_contribuicao))} `
      }
    }

    if (idade < idade_min[sexo]) {
      return {
        status: false, msg: `O segurado não possuí a idade mínima, faltam 
                                ${this.tratarTempoFracionado((idade_min[sexo] - idade))} `
      }
    };


    return { status: true, msg: 'O segurado preenche os requisitos.' };
  }

  /**
   * regra de idade urbano / Rural
   */
  public regraIdadeFinal(mesesContribuicao, valorMedio, tipoBeneficio) {

    this.conclusoesRegrasIdadeFinal = {
      status: false,
      msg: '',
      valor: '',
      valorString: '',
      percentual: '',
      formula: '',
      requisitoDib: '',
      segurado: '',
      destaque: ''
    };

    const tempoPercentual = {
      m: 20,
      f: 15
    };

    const requisitosRST = this.requisitosIdadeFinal(
      this.idadeFracionada,
      this.dataInicioBeneficio.year(),
      this.segurado.sexo,
      this.contribuicaoTotal,
      tipoBeneficio);


    this.conclusoesRegrasIdadeFinal.status = requisitosRST.status;

    if (this.conclusoesRegrasIdadeFinal.status) {

      this.conclusoesRegrasIdadeFinal.status = true;

      let percentual = 60;
      let percentualPorAno = 2;


      switch (tipoBeneficio) {
        case 3: // idade urbano Transitória
          if (this.contribuicaoTotal > tempoPercentual[this.segurado.sexo]) {
            percentual += ((Math.trunc(this.contribuicaoTotal) - tempoPercentual[this.segurado.sexo]) * percentualPorAno);
            this.conclusoesRegrasIdadeFinal.formula = `${percentual} + 
                                                          ((${Math.trunc(this.contribuicaoTotal)} - 
                                                          ${tempoPercentual[this.segurado.sexo]}) * ${percentualPorAno})`;
          }
          break;
        case 16:
          percentual = 70;
          percentualPorAno = 1;
          percentual += Math.trunc(this.contribuicaoTotal);
          percentual = (percentual < 100) ? percentual : 100;
          this.conclusoesRegrasIdadeFinal.formula = `${percentual} + ${Math.trunc(this.contribuicaoTotal)}`;
          break;
      }

      if (this.conclusoesRegrasIdadeFinal.formula == '') {
        this.conclusoesRegrasIdadeFinal.formula = `${percentual}% (percentual mínimo)`;
      }

      this.conclusoesRegrasIdadeFinal.percentual = percentual;
      percentual /= 100;
      this.conclusoesRegrasIdadeFinal.valor = (valorMedio * percentual);

      const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegrasIdadeFinal.valor, this.dataInicioBeneficio);
      this.conclusoesRegrasIdadeFinal.valor = resutadoAjuste.valor;
      this.conclusoesRegrasIdadeFinal.aviso = resutadoAjuste.aviso;

      this.conclusoesRegrasIdadeFinal.valorString = this.formatMoney(this.conclusoesRegrasIdadeFinal.valor);

    } else {
      this.conclusoesRegrasIdadeFinal.msg = requisitosRST.msg;
    }


    // console.log(this.conclusoesRegrasIdadeFinal);


  }
  // regra idade urbano Rural fim

  // regra especial do deficiente
  public getRequisitoEspecialDeficiente(tipoBeneficio) {

    let requisito: any;

    switch (tipoBeneficio) {
      case 25:
        requisito = { m: 25, f: 20 }; // tempo Grave
        break;
      case 26:
        requisito = { m: 29, f: 24 }; // tempo moderada
        break;
      case 27:
        requisito = { m: 33, f: 28 }; // tempo leve
        break;
      case 28:
        requisito = {
          tempo: { m: 15, f: 15 },
          idade: { m: 60, f: 55 }
        };
        break;
    }

    return requisito;

  }


  public getRegraEspecialDeficiente(idade, ano, sexo, tempo_contribuicao, tipoBeneficio) {

    const requisitoEspecial = this.getRequisitoEspecialDeficiente(tipoBeneficio);
    let status = true;
    let msg = '';

    if (tipoBeneficio !== 28) {
      // tempo

      if (tempo_contribuicao < requisitoEspecial[sexo]) {
        status = false;
        msg = `O segurado não possuí o tempo de contribuição necessário, faltam 
              ${this.tratarTempoFracionado((requisitoEspecial[sexo] - tempo_contribuicao))}`;
      }

    } else {
      // idade

      if (tempo_contribuicao < requisitoEspecial.tempo[sexo]) {
        status = false;
        msg = `O segurado não possuí o(s) requisito(s), faltam 
                ${this.tratarTempoFracionado((requisitoEspecial.tempo[sexo] - tempo_contribuicao))}
                de tempo de contribuição `;
      }

      if (idade < requisitoEspecial.idade[sexo]) {

        status = false;
        msg += (msg == '') ? `O segurado não possuí a idade necessária, faltam
               ${this.tratarTempoFracionado((requisitoEspecial.idade[sexo] - idade))}` :
          ` e ${this.tratarTempoFracionado((requisitoEspecial.idade[sexo] - idade))} de idade `;
      }

    }

    return { status: status, msg: msg };
  }


  /**
   * regra especial
   */
  public regraEspecialDeficiente(mesesContribuicao, valorMedio, tipoBeneficio) {


    this.conclusoesRegrasEspecialDeficiente = {
      status: false,
      msg: '',
      valor: '',
      valorString: '',
      percentual: '',
      formula: '',
      requisitoDib: '',
      segurado: '',
      aviso: '',
      totalComDescarte: this.valorTotalContribuicoesComDescarte20,
      totalComDescarteString: this.formatMoney(this.valorTotalContribuicoesComDescarte20),
      CompetenciasComDescarte: this.numeroDeCompetenciasAposDescarte20,
      mediaComDescarte: 0,
      destaque: ''
    };

    const tempoPercentual = {
      m: 20,
      f: 15
    };

    const requisitosRST = this.getRegraEspecialDeficiente(
      this.idadeFracionada,
      this.dataInicioBeneficio.year(),
      this.segurado.sexo,
      this.contribuicaoTotal,
      tipoBeneficio);


    this.conclusoesRegrasEspecialDeficiente.mediaComDescarte = (this.valorTotalContribuicoesComDescarte20 /
      this.numeroDeCompetenciasAposDescarte20);
    this.conclusoesRegrasEspecialDeficiente.status = requisitosRST.status;

    if (tipoBeneficio !== 28 && this.conclusoesRegrasEspecialDeficiente.status) {
      // tempo

      this.conclusoesRegrasEspecialDeficiente.valor = (this.conclusoesRegrasEspecialDeficiente.mediaComDescarte);
      this.conclusoesRegrasEspecialDeficiente.percentual = 100;

    } else if (tipoBeneficio === 28 && this.conclusoesRegrasEspecialDeficiente.status) {
      // idade

      let percentual = 70 + Math.trunc(this.contribuicaoTotal);
      percentual = (percentual < 100) ? percentual : 100;
      this.conclusoesRegrasEspecialDeficiente.percentual = percentual;
      percentual /= 100;
      this.conclusoesRegrasEspecialDeficiente.valor = (this.conclusoesRegrasEspecialDeficiente.mediaComDescarte * percentual);

    }

    if (this.fatorPrevidenciario > 1) { // se fator maior que aplique o fator
      this.conclusoesRegrasEspecialDeficiente.valor *= this.fatorPrevidenciario;

      const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegrasEspecialDeficiente.valor, this.dataInicioBeneficio);
      this.conclusoesRegrasEspecialDeficiente.valor = resutadoAjuste.valor;
      this.conclusoesRegrasEspecialDeficiente.aviso = resutadoAjuste.aviso;
      this.conclusoesRegrasEspecialDeficiente.aviso += '(Incide fator previdenciário)';
    }

    this.conclusoesRegrasEspecialDeficiente.valorString = this.formatMoney(this.conclusoesRegrasEspecialDeficiente.valor);

    this.conclusoesRegrasEspecialDeficiente.msg = requisitosRST.msg;
    // console.log(this.conclusoesRegrasEspecialDeficiente);

  }

  // regra especial do deficiente




  /**
   * regra de professor transitoria
   */
  public requisitosProfessorTransitoria(idade, ano, sexo, tempo_contribuicao, tipoBeneficio) {


    let contribuicao_min = { m: 25, f: 25 };
    let idade_min = { m: 60, f: 57 };



    if (tempo_contribuicao < contribuicao_min[sexo]) {
      return {
        status: false, msg: `O segurado não possuí tempo mínimo de contribuição, faltam
                                ${this.tratarTempoFracionado((contribuicao_min[sexo] - tempo_contribuicao))} `
      }
    }

    if (idade < idade_min[sexo]) {
      return {
        status: false, msg: `O segurado não possuí a idade mínima, faltam 
                                ${this.tratarTempoFracionado((idade_min[sexo] - idade))} `
      }
    };


    return { status: true, msg: 'O segurado preenche os requisitos.' };
  }




  public regraProfessorTransitoria(mesesContribuicao, valorMedio, tipoBeneficio) {

    this.conclusoesRegrasTransitoriaProfessor = {
      status: false,
      msg: '',
      valor: '',
      valorString: '',
      percentual: '',
      formula: '',
      requisitoDib: '',
      segurado: '',
      destaque: ''
    };

    const tempoPercentual = {
      m: 20,
      f: 15
    };

    const requisitosRST = this.requisitosProfessorTransitoria(
      this.idadeFracionada,
      this.dataInicioBeneficio.year(),
      this.segurado.sexo,
      this.contribuicaoTotal,
      tipoBeneficio);

    this.conclusoesRegrasTransitoriaProfessor.status = requisitosRST.status;

    if (this.conclusoesRegrasTransitoriaProfessor.status) {

      this.conclusoesRegrasTransitoriaProfessor.status = true;

      let percentual = 60;
      percentual += ((Math.trunc(this.contribuicaoTotal) - tempoPercentual[this.segurado.sexo]) * 2);
      this.conclusoesRegrasTransitoriaProfessor.formula = ` 60 + 
                                                          ((${Math.trunc(this.contribuicaoTotal)} - 
                                                          ${tempoPercentual[this.segurado.sexo]}) * 2%)`;

      this.conclusoesRegrasTransitoriaProfessor.percentual = percentual;
      percentual /= 100;
      this.conclusoesRegrasTransitoriaProfessor.valor = (valorMedio * percentual);

      const resutadoAjuste = this.limitarTetosEMinimos(this.conclusoesRegrasTransitoriaProfessor.valor, this.dataInicioBeneficio);
      this.conclusoesRegrasTransitoriaProfessor.valor = resutadoAjuste.valor;
      this.conclusoesRegrasTransitoriaProfessor.aviso = resutadoAjuste.aviso;

      this.conclusoesRegrasTransitoriaProfessor.valorString = this.formatMoney(this.conclusoesRegrasTransitoriaProfessor.valor);
      this.updateResultadoCalculo(this.conclusoesRegrasTransitoriaProfessor.valor);
    } else {
      this.conclusoesRegrasTransitoriaProfessor.msg = requisitosRST.msg;
    }


    // console.log(this.conclusoesRegrasTransitoriaProfessor);

  }
  // regra idade transitoria


  private updateResultadoCalculo(valorRMI) {

    // Salvar Valor do Beneficio no Banco de Dados (rmi, somaContribuicoes);
    this.calculo.soma_contribuicao = this.valorTotalContribuicoes;
    this.calculo.valor_beneficio = valorRMI;
    this.CalculoRgpsService.update(this.calculo);

  }

  public atualizarCalculoMelhorRMIRegrasTransicao() {

    const arrayConclusoes = [
      this.conclusoesRegra1,
      this.conclusoesRegra2,
      this.conclusoesRegra3,
      this.conclusoesRegra4,
      this.conclusoesRegra5,
    ];


    const testeIsValidValor = (conclusao) => {
      return (conclusao !== undefined && typeof conclusao !== 'undefined' && conclusao != null) &&
        (conclusao.valor !== undefined && typeof conclusao.valor !== 'undefined' && conclusao.valor != null);
    };

    let MelhorValor = 0;
    for (const conclusoresTansicao of arrayConclusoes) {
      if (testeIsValidValor(conclusoresTansicao) && conclusoresTansicao.valor > MelhorValor) {
        MelhorValor = conclusoresTansicao.valor;
      }
    }

    this.updateResultadoCalculo(MelhorValor);

  }




  /**
    * aplicarRegrasTransicao
   */
  public regrasDaReforma() {

    this.isUpdating = true;

    const arrayEspecial = [1915, 1920, 1925];
    const arrayPensao = [1900, 1901];
    const arrayIdade = [3, 16];
    const arrayEspecialDeficiente = [25, 26, 27, 28];

    if (this.dataFiliacao && this.dataFiliacao != null && moment(this.dataFiliacao).isValid()) {
      this.isRegraTransitoria = (this.dataFiliacao.isSameOrAfter(this.dataPromulgacao2019));
    }

    //  const mesesContribuicao = this.getDifferenceInMonths(moment('1994-07-01'), this.dataInicioBeneficio);
    // const mesesContribuicao = this.numeroDeContribuicoes;
    const mesesContribuicao = this.divisorMinimo;
    const valorMedio = (this.valorTotalContribuicoes / mesesContribuicao);
    const redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;

    //if( typeof this.contribuicaoTotal === 'undefined'  ){

    const tempo = this.contribuicaoPrimaria;
    let contagemPrimaria = (tempo.anos * 365.25) + (tempo.meses * 30.4375) + tempo.dias;
    let contagemPrimariaAnos = contagemPrimaria / 365.25;

    this.contribuicaoTotal = contagemPrimariaAnos;

    // }


    // let moeda = this.dataInicioBeneficio.isSameOrBefore(moment(), 'month') ? this.Moeda.getByDate(this.dataInicioBeneficio) : this.Moeda.getByDate(moment());



    // aplicação default false
    if (arrayEspecial.includes(this.tipoBeneficio)) {

      // Aposentadoria especial
      this.isRegrasAposentadoriaEspecial = true;
      this.regraAposentadoriaEspecial(mesesContribuicao, valorMedio, this.tipoBeneficio);

    } else if (arrayPensao.includes(this.tipoBeneficio)) {

      // pensão 
      this.isRegrasPensaoObito = true;
      this.regraPensaoPorMorte(mesesContribuicao, valorMedio, redutorProfessor, this.tipoBeneficio, this.calculo.sexo_instituidor);

    } else if (this.tipoBeneficio === 1903) {

      // incapacidade
      this.isRegrasIncapacidade = true;
      this.regraIncapacidade(mesesContribuicao, valorMedio, redutorProfessor, this.tipoBeneficio);

    } else if (this.tipoBeneficio === 1905) {

      // Auxilio acidente
      this.isRegrasAuxilioAcidente = true;
      this.regraAuxilioAcidente(mesesContribuicao, valorMedio, redutorProfessor, this.tipoBeneficio);

    } else if (this.tipoBeneficio === 1) {

      // Auxilio doença
      this.isRegrasAuxilioDoenca = true;
      this.regraAuxilioDoenca(mesesContribuicao, valorMedio, redutorProfessor, this.tipoBeneficio);

    } else if (arrayIdade.includes(this.tipoBeneficio)) {
      // Aposentadoria por idade 
      this.isStatusTransicaoIdade = (this.tipoBeneficio === 3) ? true : false;

      // Aposentadoria por idade - Trabalhador Rural
      if (!this.erroCarenciaMinima) {
        this.isRegrasIdade = true;
        this.regraIdade(mesesContribuicao, valorMedio);
        this.regraIdadeFinal(mesesContribuicao, valorMedio, this.tipoBeneficio);
      }

    } else if (arrayEspecialDeficiente.includes(this.tipoBeneficio)) {

      // especial deficiente
      this.isRegraEspecialDeficiente = true;
      this.regraEspecialDeficiente(mesesContribuicao, valorMedio, this.tipoBeneficio)

    } else if (this.tipoBeneficio === 6) {

      // professor transitoria e transição
      if (!this.isRegraTransitoria) {

        this.isRegrasTransicao = true;
        this.aplicarRegrasTransicao(mesesContribuicao, valorMedio, redutorProfessor);
        this.atualizarCalculoMelhorRMIRegrasTransicao();
      }

      this.isRegraTransitoriaProfessor = true;
      this.regraProfessorTransitoria(mesesContribuicao, valorMedio, this.tipoBeneficio);

    } else {
      this.isRegrasTransicao = true;
      this.aplicarRegrasTransicao(mesesContribuicao, valorMedio, redutorProfessor);
      this.atualizarCalculoMelhorRMIRegrasTransicao();

    }

    this.isUpdating = false;

    // setTimeout(() => {
    //   this.descarteContribuicoesSelecionadas();
    // }, 5000);


  }




  // setDescarteConpetencia() {

  // }

  // descarteContribuicoesSelecionadas() {



  // const idList = [];
  //     for (const checkboxId of this.checkboxIdDescarteArray) {
  //       console.log((<HTMLInputElement>document.getElementById(checkboxId)));

  //       if ((<HTMLInputElement>document.getElementById(checkboxId)).checked) {
  //         idList.push(checkboxId.split('-')[0]);
  //       }
  //     }



  // const mesesContribuicao = this.getDifferenceInMonths(moment('1994-07-01'), this.dataInicioBeneficio);
  // console.log((<HTMLInputElement>document.getElementById('296-checkbox')));


  // const idList = [];
  // let checkboxId = '';
  // for (let i = 0; i <= mesesContribuicao; i++) {

  //   checkboxId = i + '-checkbox';

  //   console.log(document.getElementById(checkboxId));
  //   // if ((<HTMLInputElement>document.getElementById(checkboxId)).checked) {
  //   //   idList.push(checkboxId.split('-')[0]);
  //   // }
  //   console.log((<HTMLInputElement>document.getElementById(checkboxId)));

  // }


  // }



  // regras de transição fim




}
