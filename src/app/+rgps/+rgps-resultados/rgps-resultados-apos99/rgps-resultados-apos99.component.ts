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
  selector: 'app-rgps-resultados-apos99',
  templateUrl: './rgps-resultados-apos99.component.html',
  styleUrls: ['./rgps-resultados-apos99.component.css']
})
export class RgpsResultadosApos99Component extends RgpsResultadosComponent implements OnInit {
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
      { data: 'contribuicao_secundaria' },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada' },
      { data: 'limite' },
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
    this.boxId = this.generateBoxId(this.calculo.id, '99');
    this.isUpdating = true;
    this.dataFiliacao = this.getDataFiliacao();
    this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    this.idadeSegurado = this.getIdadeNaDIB(this.dataInicioBeneficio);
    this.idadeFracionada = this.getIdadeFracionada();
    this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_atual);
    this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_atual);
    this.idCalculo = this.calculo.id;
    this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);

    let dataInicio = (this.dataInicioBeneficio.clone()).startOf('month');
    let dataLimite = moment('1994-07-01');
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.ValoresContribuidos.getByCalculoId(this.idCalculo, dataInicio, dataLimite, 0, this.idSegurado)
      .then(valorescontribuidos => {
        this.listaValoresContribuidos = valorescontribuidos;
        if (this.listaValoresContribuidos.length == 0) {
          // Exibir MSG de erro e encerrar Cálculo.
          this.nenhumaContrib = true;
          this.isUpdating = false;
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
                          this.calculo_apos_99(this.erros, this.conclusoes, this.contribuicaoPrimaria, this.contribuicaoSecundaria);
                          this.isUpdating = false;
                        });
                    });
                });
            });
        }
      });
  }

  calculo_apos_99(errorArray, conclusoes, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria) {
    let dib = this.dataInicioBeneficio;
    let dibCurrency = this.loadCurrency(dib);
    let moedaDib = this.Moeda.getByDate(dib);
    let dataComparacao = (dib.clone()).startOf('month');
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

      let idString = contadorPrimario + 1; //tabela['id'] = contadorPrimario;
      contadorPrimario++;
      let dataContribuicaoString = dataContribuicao.format('MM/YYYY');//tabela['dataContribuicao'] = contribuicao.dataContribuicao;
      let contribuicaoPrimariaString = this.formatMoney(contribuicaoPrimaria, currency.acronimo); //tabela['Contribuicao Primaria'] = currency.acronimo + contribuicaoPrimaria;
      let contribuicaoSecundariaString = this.formatMoney(contribuicaoSecundaria, currency.acronimo); //tabela['Contribuicao Secundaria'] = currency.acronimo + contribuicaoSecundaria;

      let moedaContribuicao = (dataContribuicao.isSameOrBefore(moment(), 'month')) ? this.Moeda.getByDate(dataContribuicao) : undefined;
      let fator = (moedaContribuicao) ? moedaContribuicao.fator : 1;
      let fatorLimite = (moedaComparacao) ? moedaComparacao.fator : 1;
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
      if (contribuicaoSecundaria != 0) {
        contribuicaoSecundariaRevisada = (this.limitarTetosEMinimos(contribuicaoSecundaria, dataContribuicao)).valor; //Inserir texto 'Limitado ao teto' e 'limitado ao minimo' quando cabivel.
        contadorSecundario++;
      }

      contribuicaoPrimariaRevisada = contribuicaoPrimariaRevisada * fatorCorrigido;
      contribuicaoSecundariaRevisada = contribuicaoSecundariaRevisada * fatorCorrigido;

      contribuicaoPrimariaRevisada = this.convertCurrency(contribuicaoPrimariaRevisada, dataContribuicao, dib);
      contribuicaoSecundariaRevisada = this.convertCurrency(contribuicaoSecundariaRevisada, dataContribuicao, dib);

      totalContribuicaoPrimaria += contribuicaoPrimariaRevisada;
      totalContribuicaoSecundaria += contribuicaoSecundariaRevisada;


      let contribuicaoPrimariaRevisadaString = this.formatMoney(contribuicaoPrimariaRevisada, dibCurrency.acronimo);
      let contribuicaoSecundariaRevisadaString = this.formatMoney(contribuicaoSecundariaRevisada, dibCurrency.acronimo);
      //tabela['Contribuicao Primaria Corrigida'] = currency.Acronimo + contribuicaoPrimariaRevisada
      //tabela['Contribuicao Secundaria Corrigida'] = currency.Acronimo + contribuicaoSecundariaRevisada

      let line = {
        id: idString,
        competencia: dataContribuicaoString,
        contribuicao_primaria: contribuicaoPrimariaString,
        contribuicao_secundaria: contribuicaoSecundariaString,
        indice_corrigido: fatorCorrigidoString,
        contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
        contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString,
        limite: limiteString,
        valor_primario: contribuicaoPrimariaRevisada,
        valor_secundario: contribuicaoSecundariaRevisada
      };
      tableData.push(line);
      if (tabelaIndex < 12) {
        primeirasContribuicoes.push(line);
      }
      tabelaIndex++;
    }


    let mesesContribuicao = this.getDifferenceInMonths(moment('1994-07-01'), this.dataInicioBeneficio);
    let mesesContribuicao80 = Math.trunc((mesesContribuicao * 0.8) - 0.5);
    let mesesContribuicao60 = Math.trunc((mesesContribuicao * 0.6) - 0.5);
    let divisorMinimo = Math.trunc(mesesContribuicao * 0.6);

    // if (contadorSecundario < mesesContribuicao * 0.6) {
    //   contadorSecundario = Math.trunc(mesesContribuicao * 0.6);
    // } else if (contadorSecundario < mesesContribuicao * 0.6) {
    //   contadorSecundario = Math.trunc(mesesContribuicao * 0.8);
    // }

    let numeroContribuicoes = tableData.length;//Numero de contribuicoes carregadas para o periodo;
    let divisorMediaPrimaria = numeroContribuicoes;
    let divisorSecundario = contadorSecundario;


    if (divisorSecundario < 24) {
      divisorSecundario = 24;
    }

    if (divisorSecundario < mesesContribuicao * 0.6) {
      divisorSecundario = Math.round(mesesContribuicao * 0.6);
    } else if (divisorSecundario < mesesContribuicao * 0.8) {
      divisorSecundario = Math.round(mesesContribuicao * 0.8);
    }


    let label;
    switch (this.tipoBeneficio) {
      case 1: // Auxilio Doença Previdenciario

        divisorMediaPrimaria = Math.round((divisorMediaPrimaria * 0.8) - 0.5);
        //modificado dia 04-06-2019
        divisorSecundario = contadorSecundario;
        divisorSecundario = Math.round((divisorSecundario * 0.8) - 0.5);


        if (this.withMemo) {
          // Exibir Label contendo o texto
          label = "Este calculo foi realizado com base no <a href='#' onclick='javascript:alert(\"Em breve a descrição do Memorando.\");'>Memorando n.º21,28/10</a> descarte dos 20% menores salários .";
        }
        break;
      case 2: // Aposentadoria Por Invalidez previdenciaria
        if (divisorMediaPrimaria >= divisorMinimo || this.withMemo) {
          //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
          divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
          if (this.withMemo) {
            // Exibir Label contendo o texto
            label = "Este calculo foi realizado com base no <a href='#' onclick='javascript:alert(\"Em breve a descrição do Memorando.\");'>Memorando n.º21,28/10</a> descarte dos 20% menores salários.";
          }
        }
        break;
      case 7: // Auxilio Doença Previdenciario 50%
        //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
        divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
        break;
    }

    if (this.dataFiliacao >= this.dataDib99) {
      switch (this.tipoBeneficio) {
        case 1: //Auxilio Doença Previdenciario
        case 2: //Aposentadoria por invalidez previdenciaria
          if (numeroContribuicoes >= 144 || this.withMemo) {
            //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
            divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
          } else {
            divisorMediaPrimaria = numeroContribuicoes;
          }
          break;
        case 5: // Aposentadoria Especial
        case 7: // Auxilio Acidente Previdenciario 50%
          if (numeroContribuicoes < 144 || this.withMemo) {
            divisorMediaPrimaria = numeroContribuicoes;
          } else {
            //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
            divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
          }
          break;
        case 3://Aposentadoria Idade Trabalhador Urbano
        case 4://Aposentadoria Tempo de Contribuicao
        case 16://Aposentadoria Idade Trabalhafor Rural
        case 25://Deficiencia Grave
        case 27://Deficiencia Leva
        case 26://Deficiencia Moderado
        case 28://Deficiencia PorSalvar Idade
          //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
          divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
          break;
      }
    } else if (this.dataFiliacao < this.dataDib99) {
      if (this.tipoBeneficio == 3 || this.tipoBeneficio == 4 || this.tipoBeneficio == 5 || this.tipoBeneficio == 6 ||
        this.tipoBeneficio == 16 || this.tipoBeneficio == 25 || this.tipoBeneficio == 27 || this.tipoBeneficio == 26 ||
        this.tipoBeneficio == 28) {
        // Deficiencia Por Idade, Deficiencia Grave, Deficiencia Leve, Deficiencia Moderada, Aposentadoria Idade trabalhador Rural,
        // Aposentadoria Idade Urbano, Aposentadoria Tempo Contribuicao, Aposentadoria Especial, Aposentadoria Tempo Servico Professor
        //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
        divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
        if (numeroContribuicoes < mesesContribuicao60) {
          divisorMediaPrimaria = mesesContribuicao60
        }
        if (numeroContribuicoes >= mesesContribuicao60 && numeroContribuicoes <= mesesContribuicao80) {
          if (this.withIN45) {
            divisorMediaPrimaria = numeroContribuicoes;
          } else {
            //divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8)-0.5);
            divisorMediaPrimaria = Math.trunc((divisorMediaPrimaria * 0.8));
          }
        }
        if (divisorMediaPrimaria < divisorMinimo) {
          divisorMediaPrimaria = divisorMinimo;
        }
      }
    }

    let totalMediaDozeContribuicoes = 0;
    switch (this.tipoBeneficio) {
      case 1: // Auxilio Doenca Previdenciario
        if (this.dataInicioBeneficio >= this.dataMP664) {
          let currency = this.loadCurrency(this.dataInicioBeneficio);
          if (numeroContribuicoes >= 12) {
            let contribuicoesPrimarias12 = 0;
            let contribuicoesSecundarias12 = 0;
            for (let contribuicao of primeirasContribuicoes) {
              contribuicoesPrimarias12 += contribuicao.valor_primario;
              contribuicoesSecundarias12 += contribuicao.valor_secundario;
            }
            let moeda = this.Moeda.getByDate(this.dataInicioBeneficio);// Carregar 1 linha da tabela moeda onde a data é menor ou igual que data_pedido_beneficio;
            let salarioMinimoRMI = moeda.salario_minimo;
            let divisorContribuicoes = this.formatDecimal((contribuicoesPrimarias12 + contribuicoesSecundarias12) / 12, 1);
            if (divisorContribuicoes < salarioMinimoRMI) {
              divisorContribuicoes = salarioMinimoRMI;
            }
            totalMediaDozeContribuicoes = divisorContribuicoes;
            // Inserir nas conclusoes:
            //conclusoes.soma_doze_ultimas_contribuicoes = this.formatMoney(contribuicoesPrimarias12, currency.acronimo);
            conclusoes.push({ string: "Soma das 12 últimas contribuções", value: this.formatMoney(contribuicoesPrimarias12, currency.acronimo) });
            //conclusoes.media_doze_ultimas_contribuicoes = this.formatMoney(divisorContribuicoes, currency.acronimo);
            conclusoes.push({ string: "Média das 12 últimas contribuções", value: this.formatMoney(divisorContribuicoes, currency.acronimo) });
          }
        }
        break;
      case 2: //Aposentadoria por invalidez previdenciaria
        if (this.dataInicioBeneficio >= this.dataDecreto6939_2009 && Math.round(divisorMediaPrimaria) > 1) {
          divisorMediaPrimaria = Math.round(numeroContribuicoes * 0.8);
          //  divisorMediaPrimaria =  this.formatDecimal((numeroContribuicoes * 0.8)-0.5, 1);
        }
        break;
    }


    tableData.sort((entry1, entry2) => {
      if (entry1.valor_primario > entry2.valor_primario) {
        return 1;
      }
      if (entry1.valor_primario < entry2.valor_primario) {
        return -1;
      }
      return 0;
    });
    if (numeroContribuicoes > divisorMediaPrimaria) {
      totalContribuicaoPrimaria = 0
      for (let i = 0; i < tableData.length; i++) {
        if (i >= tableData.length - divisorMediaPrimaria) {
          totalContribuicaoPrimaria += tableData[i].valor_primario;
        } else {
          tableData[i].limite = "DESCONSIDERADO";
        }
      }
    }
    tableData.sort((entry1, entry2) => {
      if (entry1.id > entry2.id) {
        return 1;
      }
      if (entry1.id < entry2.id) {
        return -1;
      }
      return 0;
    });
    let numeroCompetencias = Math.ceil(this.getDifferenceInMonths(this.dataDib99, this.dataInicioBeneficio, true)); // Calcular a quantidade de meses contida entre as duas datas.
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
        // Adicionar nas conclusões a fórmula com os valores, não os resutlados:
        //conclusoes.formula_fator = "(("+tempoTotalContribuicao +'*'+ aliquota+") / "+expectativa+") * (1 + ("+idadeFracionada+" + ("+tempoTotalContribuicao+" * "+aliquota+")) / "+"100)";
        this.formula_fator = "((" + this.formatDecimal(tempoTotalContribuicao, 4) + ' * ' + this.formatDecimal(aliquota, 2) + ") / " + this.formatDecimal(expectativa, 2) + ") * (1 + (" + this.formatDecimal(this.idadeFracionada, 2) + " + (" + this.formatDecimal(tempoTotalContribuicao, 4) + " * " + this.formatDecimal(aliquota, 2) + ")) / " + "100)";
        //conclusoes.push({string:"Fórmula Fator:",value: "(("+this.formatDecimal(tempoTotalContribuicao,4) +' * '+ this.formatDecimal(aliquota,2)+") / "+this.formatDecimal(expectativa, 2)+") * (1 + ("+this.formatDecimal(this.idadeFracionada,2)+" + ("+this.formatDecimal(tempoTotalContribuicao,4)+" * "+this.formatDecimal(aliquota,2)+")) / "+"100)"});
        break;
    }

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

    let mediaContribuicoesSecundarias = totalContribuicaoSecundaria;
    if (divisorSecundario > 1) {
      mediaContribuicoesSecundarias /= divisorSecundario;
    }

    if (moedaDib && mediaContribuicoesSecundarias > moedaDib.teto) {
      mediaContribuicoesSecundarias = moedaDib.teto;
    }

    this.limited = false;

    let rmi = fatorSeguranca * numeroCompetencias * mediaContribuicoesPrimarias / 60;

    rmi += mediaContribuicoesPrimarias * ((60 - numeroCompetencias) / 60);

    let taxaSecundaria = 0;
    let taxaMediaSecundaria = 0;

    if (mediaContribuicoesSecundarias != 0) {
      taxaSecundaria = this.getTaxaSecundaria(redutorProfessor, redutorSexo, contadorSecundario);
      taxaMediaSecundaria = mediaContribuicoesSecundarias * taxaSecundaria;

      if (taxaMediaSecundaria > mediaContribuicoesSecundarias) {
        taxaMediaSecundaria = mediaContribuicoesSecundarias;
      }
    }
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
    let objMoeda = this.Moeda.getByDate(this.dataInicioBeneficio);
    //let salarioAcidente = objMoeda.salario_minimo;
    if (objMoeda && mediaContribuicoesPrimarias > objMoeda.salario_minimo) {
      switch (this.tipoBeneficio) {
        case 17:// Auxilio Acidente 30
          rmi = mediaContribuicoesPrimarias * 0.3;
          break;
        case 18: // Auxilio Acidente 40
          rmi = mediaContribuicoesPrimarias * 0.4;
          break;
        case 7: // Auxilio Acidente 50
          rmi = mediaContribuicoesPrimarias * 0.5;
          break;
        case 19: // Auxilio Acidente 60
          rmi = mediaContribuicoesPrimarias * 0.6;
          break;
      }
    }

    let somaContribuicoes = totalContribuicaoPrimaria + totalContribuicaoSecundaria;

    let currency = this.loadCurrency(this.dataInicioBeneficio);

    //conclusoes.coeficiente_calculo = coeficiente;//resultados['Coeficiente do Cálculo'] = coeficiente //Arrendodar para duas casas decimais;
    //conclusoes.soma_contribuicoes_primarias = this.formatMoney(totalContribuicoesPrimarias, currency.acronimo);//resultados['Soma das Contribuições Primarias'] = currency.acrônimo + totalContribuicoesPrimarias;
    //conclusoes.divisor_calculo_media_primaria = divisorMediaPrimaria;//resultados['Divisor do Cálculo da média primária: '] = divisorMediaPrimaria;
    //conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaContribuicoesPrimarias, currency.acronimo);//resultados['Média das contribuições primárias'] = currency.acrônimo + mediaContribuicoesPrimarias;

    conclusoes.push({ string: "Coeficiente do Cálculo:", value: (coeficiente < 100) ? this.formatDecimal(coeficiente, 0) + '%' : this.formatDecimal(coeficiente, 0) + '%' });
    conclusoes.push({ string: "Soma das Contribuições Primarias:", value: this.formatMoney(totalContribuicaoPrimaria, currency.acronimo) });
    conclusoes.push({ string: "Divisor do Cálculo da média primária:", value: divisorMediaPrimaria });
    conclusoes.push({ string: "Média das contribuições primárias", value: this.formatMoney(mediaContribuicoesPrimarias, currency.acronimo) });

    if (totalContribuicaoSecundaria > 0) {
      conclusoes.push({ string: "Soma das contribuições secundárias:", value: this.formatMoney(totalContribuicaoSecundaria, currency.acronimo) });//resultados['Soma das contribuições secundárias'] = currency.acrônumo + totalContribuicoesSecundarias;
      conclusoes.push({ string: "Divisor do Cálculo da média secundária:", value: divisorSecundario });//resultados['Divisor do Cálculo da média secundária: '] = divisorMediaPrimaria;
      conclusoes.push({ string: "Média das contribuições Secundárias:", value: this.formatMoney(mediaContribuicoesSecundarias, currency.acronimo) });//resultados['Média das contribuições Secundárias: '] =  currency.acrônumo + mediaContribuicoesSecundarias;
      conclusoes.push({ string: "Taxa:", value: this.formatDecimal(taxaSecundaria, 6) });//resultados['Taxa: '] =  taxaSecundaria;
      conclusoes.push({ string: "Média Secundária - Pós Taxa:", value: this.formatMoney(mediaContribuicoesSecundarias * taxaSecundaria, currency.acronimo) });//resultados['Média Secundárias - Pós Taxa: '] =  currency.acrônimo + taxaSecundaria;
    }
    conclusoes.push({ string: "Idade em anos:", value: `${Math.trunc(this.idadeFracionada)} (${this.formatDecimal(this.idadeFracionada, 2)}) ` });//resultados['Idade em anos'] = truncate(idadeFracionada) (idadeFracionada); this.idadeFracionada.toLocaleString('pt-BR',{ style: 'decimal', maximumFractionDigits: 2}))
    conclusoes.push({ string: "Média das contribuições:", value: this.formatMoney(somaMedias, currency.acronimo) });//resultados['Média das contribuições'] = currency.acrônimo + somaMedias;
    conclusoes.push({ string: "CT - Número de competências transcorridas desde 29/11/1999:", value: numeroCompetencias });//resultados['CT - Número de competências transcorridas desde 29/11/1999:'] = numeroCompetencias;

    if (this.formula_fator != '') {
      conclusoes.push({ string: "Fórmula Fator:", value: this.formula_fator });
    }

    //???????
    // if (this.tipoBeneficio == 6 && redutorSexo == 5) {
    //   this.contribuicaoTotal -= this.contribuicaoTotal - 5;
    // }

    let contribuicao85_95 = this.contribuicaoTotal + this.idadeFracionada;
    let contribuicao86_96 = this.contribuicaoTotal + this.idadeFracionada;
    let contribuicao87_97 = this.contribuicaoTotal + this.idadeFracionada;
    let contribuicao88_98 = this.contribuicaoTotal + this.idadeFracionada;
    let contribuicao89_99 = this.contribuicaoTotal + this.idadeFracionada;
    let contribuicao90_100 = this.contribuicaoTotal + this.idadeFracionada;

    let dateFormat = "DD/MM/YYYY";
    let dataRegra85_95 = moment('17/06/2015', dateFormat);
    let dataRegra86_96 = moment('31/12/2018', dateFormat);
    let dataRegra87_97 = moment('31/12/2020', dateFormat);
    let dataRegra88_98 = moment('31/12/2022', dateFormat);
    let dataRegra89_99 = moment('31/12/2024', dateFormat);
    let dataRegra90_100 = moment('31/12/2026', dateFormat);

    let dataFimRegra85_95 = moment('30/12/2018', dateFormat);
    let dataFimRegra86_96 = moment('30/12/2020', dateFormat);
    let dataFimRegra87_97 = moment('30/12/2022', dateFormat);
    let dataFimRegra88_98 = moment('30/12/2024', dateFormat);
    let dataFimRegra89_99 = moment('30/12/2026', dateFormat);
    let dataFimRegra90_100 = moment('30/12/2052', dateFormat);

    let dataBeneficio = this.dataInicioBeneficio;
    // let teto = moedaDib.teto;
    // let minimo = moedaDib.salario_minimo;

    let comparacaoContribuicao = 35 - redutorSexo;

    if (naoFocado) {
      if (fatorSeguranca <= 1) {
        conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca });//resultados['Fp - fator previdenciário'] = fatorSeguranca;
      } else {
        conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '(Incide fator previdenciario)' });//resultados['Fp - fator previdenciário'] = fatorSeguranca + '(Incide fator previdenciario)';
      }
    } else {

      if ((dataBeneficio >= dataRegra85_95 && dataBeneficio <= dataFimRegra85_95) && (this.contribuicaoPrimaria.anos >= comparacaoContribuicao) ) {

        const redutorSexo85_95 = (this.segurado.sexo == 'f') ? 85 : 95;
        const redutorProfessor85_95 = (this.tipoBeneficio == 6)? 80 : 90;

          if (fatorSeguranca >= 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo && this.tipoBeneficio == 4) {
        
          somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
          conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Fator Previdenciário favorável' });//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca + '- Fator Previdenciário favorável';
          this.fatorPrevidenciario = fatorSeguranca;
          //let rmi85_95 = this.formatMoney(somaMedias, currency.acronimo);
          this.rmi8595 = this.formatMoney(somaMedias, currency.acronimo);
          //conclusoes.push({string:"Renda Mensal Inicial com Regra 85/95:",value:rmi85_95});//resultados['Renda Mensal Inicial com Regra 85/95: '] = currency.acronimo + somaMedias
       
        } else if (fatorSeguranca < 1 && contribuicao85_95 >= redutorProfessor85_95 && tempoTotalContribuicao >= comparacaoContribuicao - redutorSexo && this.tipoBeneficio == 6) {
       
          somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
          conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Fator Previdenciário favorável' });//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca + '- Fator Previdenciário favorável';
          this.fatorPrevidenciario = fatorSeguranca;
          //let rmi80_90 = this.formatMoney(somaMedias, currency.acronimo);
          this.rmi8090 = this.formatMoney(somaMedias, currency.acronimo);
          //conclusoes.push({string:"Renda Mensal Inicial com Regra 80/90:",value:rmi80_90});//resultados['Renda Mensal Inicial com Regra 80/90: '] = currency.acronimo + somaMedias
      
        } else if (fatorSeguranca < 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao && this.tipoBeneficio == 4) {
          somaMedias = (this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio)).valor;
          conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- FP desfavorável (Aplica-se a regra 85/95)' });//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca + '- FP desfavorável (Aplica-se a regra 85/95)';
          this.fatorPrevidenciario = fatorSeguranca;
          //let rmi85_95 = this.formatMoney(somaMedias, currency.acronimo);
          this.rmi8595 = this.formatMoney(somaMedias, currency.acronimo);
          //conclusoes.push({string:"Renda Mensal Inicial com Regra 85/95:",value:rmi85_95});//resultados['Renda Mensal Inicial com Regra 85/95: '] = currency.acronimo + somaMedias;
        } else if (fatorSeguranca < 1 && contribuicao85_95 < redutorSexo85_95 && tempoTotalContribuicao < comparacaoContribuicao) {
      
          if (this.tipoBeneficio == 6) {
            conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 80/90' });//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
            this.fatorPrevidenciario = fatorSeguranca;
          } else {
            conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 85/95' });//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
            this.fatorPrevidenciario = fatorSeguranca;
          }
      
        } else if (fatorSeguranca > 1 && contribuicao85_95 >= redutorSexo85_95 && tempoTotalContribuicao < comparacaoContribuicao) {
      
          if (this.tipoBeneficio == 6) {
            conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 80/90' });//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
            this.fatorPrevidenciario = fatorSeguranca;
          } else {
            conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 85/95' });//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
            this.fatorPrevidenciario = fatorSeguranca;
          }
     
        } else if (fatorSeguranca < 1 && contribuicao85_95 < redutorSexo85_95 && tempoTotalContribuicao >= comparacaoContribuicao) {
       
          if (this.tipoBeneficio == 6) {
            conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 80/90' });//resultados['Fp - Fator Previdenciario: '] =  fatorSeguranca + '- Não tem direito a Regra 80/90';
            this.fatorPrevidenciario = fatorSeguranca;
          } else {
            conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra 85/95' });//resultados['Fp - Fator Previdenciario: '] =   fatorSeguranca + '- Não tem direito a Regra 85/95';
            this.fatorPrevidenciario = fatorSeguranca;
          }
       
        }
      }

      // else if (dataBeneficio < dataRegra85_95 || dataBeneficio > dataFimRegra85_95) {
      //   conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca });//resultados['Fp - fator Previdenciario: '] = fatorSeguranca;
      //   this.fatorPrevidenciario = fatorSeguranca;
      // }

      else if (dataBeneficio >= dataRegra86_96 && dataBeneficio <= dataFimRegra86_96 && this.segurado.sexo == 'f') { // 86/96
        this.tratamentoDeRegras(dataRegra86_96, dataFimRegra86_96, contribuicao86_96, 86, tempoTotalContribuicao, fatorSeguranca, '86/96', comparacaoContribuicao, conclusoes, somaMedias);
      } else if (dataBeneficio >= dataRegra86_96 && dataBeneficio <= dataFimRegra86_96) {
        this.tratamentoDeRegras(dataRegra86_96, dataFimRegra86_96, contribuicao86_96, 96, tempoTotalContribuicao, fatorSeguranca, '86/96', comparacaoContribuicao, conclusoes, somaMedias);
      } else if (dataBeneficio >= dataRegra87_97 && dataBeneficio <= dataFimRegra87_97 && this.segurado.sexo == 'f') {
        this.tratamentoDeRegras(dataRegra87_97, dataFimRegra87_97, contribuicao87_97, 87, tempoTotalContribuicao, fatorSeguranca, '87/97', comparacaoContribuicao, conclusoes, somaMedias);
      } else if (dataBeneficio >= dataRegra87_97 && dataBeneficio <= dataFimRegra87_97) {
        this.tratamentoDeRegras(dataRegra87_97, dataFimRegra87_97, contribuicao87_97, 97, tempoTotalContribuicao, fatorSeguranca, '87/97', comparacaoContribuicao, conclusoes, somaMedias);
      } else if (dataBeneficio >= dataRegra88_98 && dataBeneficio <= dataFimRegra88_98 && this.segurado.sexo == 'f') {
        this.tratamentoDeRegras(dataRegra88_98, dataFimRegra88_98, contribuicao88_98, 88, tempoTotalContribuicao, fatorSeguranca, '88/98', comparacaoContribuicao, conclusoes, somaMedias);
      } else if (dataBeneficio >= dataRegra88_98 && dataBeneficio <= dataFimRegra88_98) {
        this.tratamentoDeRegras(dataRegra88_98, dataFimRegra88_98, contribuicao88_98, 98, tempoTotalContribuicao, fatorSeguranca, '88/98', comparacaoContribuicao, conclusoes, somaMedias);
      } else if (dataBeneficio >= dataRegra89_99 && dataBeneficio <= dataFimRegra89_99 && this.segurado.sexo == 'f') {
        this.tratamentoDeRegras(dataRegra89_99, dataFimRegra89_99, contribuicao89_99, 89, tempoTotalContribuicao, fatorSeguranca, '89/99', comparacaoContribuicao, conclusoes, somaMedias);
      } else if (dataBeneficio >= dataRegra89_99 && dataBeneficio <= dataFimRegra89_99) {
        this.tratamentoDeRegras(dataRegra89_99, dataFimRegra89_99, contribuicao89_99, 99, tempoTotalContribuicao, fatorSeguranca, '89/99', comparacaoContribuicao, conclusoes, somaMedias);
      } else if (dataBeneficio >= dataRegra90_100 && dataBeneficio <= dataFimRegra90_100 && this.segurado.sexo == 'f') {
        this.tratamentoDeRegras(dataRegra90_100, dataFimRegra90_100, contribuicao90_100, 90, tempoTotalContribuicao, fatorSeguranca, '90/100', comparacaoContribuicao, conclusoes, somaMedias);
      } else if (dataBeneficio >= dataRegra90_100 && dataBeneficio <= dataFimRegra90_100) {
        this.tratamentoDeRegras(dataRegra90_100, dataFimRegra90_100, contribuicao90_100, 100, tempoTotalContribuicao, fatorSeguranca, '90/100', comparacaoContribuicao, conclusoes, somaMedias);
      } else {
        conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca });//resultados['Fp - Fator Previdenciário: '] = fatorSeguranca;
        this.fatorPrevidenciario = fatorSeguranca;
      }
    }
    if (irt >= 1) {
      conclusoes.push({ string: "Índice de reajuste no teto:", value: this.formatDecimal(irt, 4) });//resultados['Índice de reajuste no teto: '] = irt; // Arredondar para 4 casas decimais;
    }

    if (this.formula_expectativa_sobrevida != '') {
      conclusoes.push({ string: 'Fórmula Expectativa de Sobrevida:', value: this.formula_expectativa_sobrevida });
    }

    conclusoes.push({ string: "Expectativa de Sobrevida:", value: this.formatDecimal(expectativa, 2) });//resultados['Expectativa de Sobrevida: '] = expectativa; // Arredondar para 4 casas decimais;

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
        conclusoes.push({ string: "Média das contribuições x Coeficiente do Cálculo:", value: this.formatMoney(rmi2, currency.acronimo) });//resultados['Média das contribuições x Coeficiente do Cálculo: '] = currency.acronimo + rmi2;
      }
    }

    if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6 || this.tipoBeneficio == 3 || this.tipoBeneficio == 16) {
      //conclusoes.push({string:"Renda Mensal Inicial com Fator Previdenciario:",value:this.formatMoney(somaMedias * this.fatorPrevidenciario, currency.acronimo)});//resultados['Renda Mensal Inicial com Fator Previdenciario: '] = currency.acronimo + rmi;
      conclusoes.push({ string: "Renda Mensal Inicial com Fator Previdenciario:", value: this.formatMoney(rmi, currency.acronimo) });
    } else {
      conclusoes.push({ string: "Renda Mensal Inicial:", value: this.formatMoney(rmi, currency.acronimo) });//resultados['Renda Mensal Inicial: '] = currency.acronimo + rmi;
    }

    if (this.rmi8595 && this.contribuicaoPrimaria.anos >= comparacaoContribuicao) {
      conclusoes.push({ string: "Renda Mensal Inicial com Regra 85/95:", value: this.rmi8595 });
    } else if (this.rmi8090 && this.contribuicaoPrimaria.anos >= comparacaoContribuicao) {
      conclusoes.push({ string: "Renda Mensal Inicial com Regra 80/90:", value: this.rmi8090 });
    }

    this.valorExportacao = this.formatDecimal(rmi, 2).replace(',', '.');
    this.tableData = tableData;
    this.tableOptions = {
      ...this.tableOptions,
      data: this.tableData,
    }
    //Salvar Valor do Beneficio no Banco de Dados (rmi, somaContribuicoes);
    this.calculo.soma_contribuicao = somaContribuicoes;
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

    if (secundario) {
      tempo = this.contribuicaoSecundaria;
      // let contagemSecundaria = parseInt(tempo.anos) + (((parseInt(tempo.meses) * 30) + parseInt(tempo.dias)) / 365)
      let contagemSecundaria = (parseInt(tempo.anos) * 365) + (parseInt(tempo.meses) * 30) + parseInt(tempo.dias);
      //let contagemSecundaria = parseInt(tempo.anos) + ((parseInt(tempo.meses) + (parseInt(tempo.dias) /  30.4375)) / 12);
      return contagemSecundaria;
    }

    tempo = this.contribuicaoPrimaria;
    // let contagemPrimariaAnos = parseInt(tempo.anos) + (((parseInt(tempo.meses) * 30) + parseInt(tempo.dias)) / 365);
    let contagemPrimaria = (parseInt(tempo.anos) * 365) + (parseInt(tempo.meses) * 30) + (parseInt(tempo.dias));
    let contagemPrimariaAnos = contagemPrimaria / 365;
    //let contagemPrimariaAnos = parseInt(tempo.anos) + ((parseInt(tempo.meses) + (parseInt(tempo.dias) /  30.4375)) / 12);
    if (this.tipoBeneficio == 6) { // Tempo de Serviço Professor
      contagemPrimariaAnos += redutorProfessor + redutorSexo;
    }

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

  getTaxaSecundaria(redutorProfessor, redutorSexo, contadorSecundario) {
    let taxaSecundaria = 0;
    let tempoServicoSecundario = this.getTempoServico(0, 0, true);
    let quantidadePBCSecudaria = contadorSecundario;


    let specieKind;
    if (this.tipoBeneficio == 4 || this.tipoBeneficio == 5 || this.tipoBeneficio == 6 ||
      this.tipoBeneficio == 8 || this.tipoBeneficio == 9 || this.tipoBeneficio == 10 ||
      this.tipoBeneficio == 14 || this.tipoBeneficio == 15) {
      specieKind = 1;
    } else if (this.tipoBeneficio == 3 || this.tipoBeneficio == 16 || this.tipoBeneficio == 13) {
      specieKind = 2;
    } else if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2 || this.tipoBeneficio == 11
      || this.tipoBeneficio == 29) {
      specieKind = 3;
    } else if (this.tipoBeneficio == 25) {
      specieKind = 4;
    } else {
      specieKind = null;
    }

    let tempoServico = 0;
    switch (specieKind) {
      case 1:

        tempoServico = tempoServicoSecundario;// / 365.25;

        let redutorProporcional = 0;
        if (this.isProportional) {
          redutorProporcional = 5;
        }
        taxaSecundaria = tempoServico / (35 - redutorProfessor - redutorSexo - redutorProporcional);
        break;
      case 2:
        tempoServico = tempoServicoSecundario * 12;
        let carenciaMeses = this.getMesesCarencia();
        taxaSecundaria = tempoServico / carenciaMeses;
        break;
      case 3:
        const mesesSecundaria = (this.contribuicaoSecundaria.anos * 12) + (this.contribuicaoSecundaria.meses) + (this.contribuicaoSecundaria.dias / 30);
        taxaSecundaria = mesesSecundaria / 12;
        break;
      case 4:
        tempoServico = tempoServicoSecundario; // 365;
        if (redutorSexo == 5) {
          taxaSecundaria = tempoServico / 20;
        } else {
          taxaSecundaria = tempoServico / 25;
        }
        break;
      case 5:
        tempoServico = tempoServicoSecundario; // 365;
        if (redutorSexo == 5) {
          taxaSecundaria = tempoServico / 23;
        } else {
          taxaSecundaria = tempoServico / 28;
        }
        break;
      case 6:
        tempoServico = tempoServicoSecundario;// / 365;
        if (redutorSexo == 5) {
          taxaSecundaria = tempoServico / 28;
        } else {
          taxaSecundaria = tempoServico / 33;
        }
        break;
    }
    return (taxaSecundaria >= 1) ? 1 : taxaSecundaria;
  }

  tratamentoDeRegras(dataRegra, dataFimRegra, valorRegra, valorComparacao, tempoTotalContribuicao, fatorSeguranca, resultString, comparacaoTempoContribuicao, conclusoes, somaMediasGeral) {
    let currency = this.loadCurrency(this.dataInicioBeneficio);
    let somaMedias = somaMediasGeral;
    let somaMediasString = '';

    if (fatorSeguranca >= 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao && this.tipoBeneficio == 4) {
      somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
      conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Fator Previdenciário favorável' });//conclusoes.fator_previdenciario = fatorSeguranca + '- Fator Previdenciário favorável';
      this.fatorPrevidenciario = fatorSeguranca;
      if (typeof somaMedias.valor === 'number') {
        somaMediasString = somaMedias.valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      }
      conclusoes.push({ string: 'Renda Mensal Inicial com Regra ' + resultString + ':', value: currency.acronimo + somaMediasString });//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
      //resultados['Renda Mensal Inicial com Regra ' + resultString + ': '] = currency.acronimo + somaMedias;
    } else if (fatorSeguranca >= 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao) {
      if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
        somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
        conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Fator Previdenciário favorável' });//conclusoes.fator_previdenciario = fatorSeguranca + '- Fator Previdenciário favorável';
        this.fatorPrevidenciario = fatorSeguranca;
        if (typeof somaMedias.valor === 'number') {
          somaMediasString = somaMedias.valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        }
        conclusoes.push({ string: 'Renda Mensal Inicial com Regra ' + resultString + ':', value: currency.acronimo + somaMediasString });//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
        //resultados['Renda Mensal Inicial com Regra'+ resultString + ' : '] = currency.acronimo + somaMedias
      }
    } else if (fatorSeguranca < 1 && valorRegra >= valorComparacao && tempoTotalContribuicao >= comparacaoTempoContribuicao) {
      if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
        somaMedias = this.limitarTetosEMinimos(somaMedias, this.dataInicioBeneficio);
        conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- FP desfavorável (Aplica-se a regra ' + resultString + ')' });//conclusoes.fator_previdenciario = fatorSeguranca + '- FP desfavorável (Aplica-se a regra ' + resultString+ ')';
        this.fatorPrevidenciario = fatorSeguranca;
        if (typeof somaMedias.valor === 'number') {
          somaMediasString = somaMedias.valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        }
        conclusoes.push({ string: 'Renda Mensal Inicial com Regra ' + resultString + ':', value: currency.acronimo + somaMediasString });//conclusoes.renda_mensal_inicial_com_regra = currency.acronimo + somaMedias;
        //resultados['specieKind = 4Renda Mensal Inicial com Regra'+ resultString + ': '] = currency.acronimo + somaMedias;
      }
    } else if (fatorSeguranca < 1 && valorRegra < valorComparacao && tempoTotalContribuicao < comparacaoTempoContribuicao) {
      if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6) {
        conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra' + resultString });//conclusoes.fator_previdenciario = fatorSeguranca + '- Não tem direito a Regra' + resultString;
        this.fatorPrevidenciario = fatorSeguranca;
      }
    } else if (fatorSeguranca > 1 && valorRegra >= valorComparacao && tempoTotalContribuicao < comparacaoTempoContribuicao) {
      conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Tem direito a regra ' + resultString + ' (Não possui 35 anos de contribuicao)' });//conclusoes.fator_previdenciario =  fatorSeguranca + '- Tem direito a regra ' + resultString +' (Não possui 35 anos de contribuicao)';
      this.fatorPrevidenciario = fatorSeguranca;
    } else if (fatorSeguranca < 1 && valorRegra < valorComparacao && tempoTotalContribuicao > comparacaoTempoContribuicao) {
      conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca + '- Não tem direito a Regra ' + resultString });//conclusoes.fator_previdenciario = fatorSeguranca + '- Não tem direito a Regra'+ resultString;
      this.fatorPrevidenciario = fatorSeguranca;
    } else if (this.dataInicioBeneficio < dataRegra || this.dataInicioBeneficio > dataFimRegra) {
      conclusoes.push({ string: "Fp - Fator Previdenciário:", value: fatorSeguranca });//conclusoes.fator_previdenciario = fatorSeguranca;
      this.fatorPrevidenciario = fatorSeguranca;
    }
  }

  procurarExpectativa(idadeFracionada, ano, dataInicio, dataFim) {
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    let dataAgora = moment();
    let expectativaVida;
    if (idadeFracionada > 80) {
      idadeFracionada = 80;
    }

    if (ano != null) {
      expectativaVida = this.ExpectativaVida.getByAno(ano);//Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e year == ano
    } else {
      expectativaVida = this.ExpectativaVida.getByProperties(dataInicio, dataFim);
    }
    return expectativaVida;
  }

  projetarExpectativa(idadeFracionada, dib, conclusoes) {
    let expectativa = 0;

    let dataInicio = moment('2000-11-30');
    let dataFim = moment('2017-12-01');
    let dataHoje = moment();



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
          errorArray.push("POSSUI direito ao benefício proporcional. Falta(m) " + tempoFracionado + " para possuir o direito ao benefício INTEGRAL.");
        } else {
          // Exibir Mensagem de beneficio nao concedido.
          // Falta(m) 'tempoFracionado' para completar o tempo de serviço necessário para o benefício INTEGRAL.
          errorArray.push("Falta(m) " + tempoFracionado + " para completar o tempo de serviço necessário para o benefício INTEGRAL.");
          if (totalContribuicao98 > 0) {
            let tempo = 35 - redutorProfessor - redutorSexo - (extra + 5) - anosContribuicao;
            let tempoProporcional = this.tratarTempoFracionado(tempo);
            // Exibir Mensagem com o tempo faltante para o beneficio proporcioanl;
            // Falta(m) 'tempoProporcional' para completar o tempo de serviço necessário para o benefício PROPORCIONAL.
            errorArray.push("Falta(m) " + tempoProporcional + " para completar o tempo de serviço necessário para o benefício PROPORCIONAL.");
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
    } else if (this.tipoBeneficio == 5) {
      direito = this.verificarTempoDeServico(anosContribuicao, 0, 0, 20);
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
        return false;
      }
    }
    return true;
  }

  getIdadeFracionada() {
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    let idadeEmDias = this.dataInicioBeneficio.diff(dataNascimento, 'days');
    return idadeEmDias / 365.25;
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
            minimo *= 0, 6;
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
}
