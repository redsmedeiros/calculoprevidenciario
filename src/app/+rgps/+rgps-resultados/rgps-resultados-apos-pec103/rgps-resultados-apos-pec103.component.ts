

import { Component, OnInit, Input } from '@angular/core';
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
import { RegrasAcessoConclusoes } from './regrasAcesso/regras-acesso-conclusoes';



@Component({
  selector: 'app-rgps-resultados-apos-pec103',
  templateUrl: './rgps-resultados-apos-pec103.component.html',
  styleUrls: ['./rgps-resultados-apos-pec103.component.css'],
  providers: [
    RegrasAcesso,
    RegrasAcessoConclusoes
  ]
})
export class RgpsResultadosAposPec103Component extends RgpsResultadosComponent implements OnInit {

  @Input() calculo;
  @Input() segurado;

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


  public divisorMinimo = 0;
  public isDivisorMinimo = true;
  public msgDivisorMinimo = '';


  // transição INICIO
  public dataPromulgacao2019 = moment('13/11/2019', 'DD/MM/YYYY');
  public isRegrasPensaoObitoInstituidorAposentado = false;


  public listaConclusaoAcesso = [];

  constructor(

    private ExpectativaVida: ExpectativaVidaService,
    protected route: ActivatedRoute,
    private ReajusteAutomatico: ReajusteAutomaticoService,
    protected ValoresContribuidos: ValorContribuidoService,
    private CarenciaProgressiva: CarenciaProgressivaService,
    private CalculoRgpsService: CalculoRgpsService,
    private Moeda: MoedaService,
    private regrasAcesso: RegrasAcesso,
    private regrasAcessoConclusoes: RegrasAcessoConclusoes

  ) {
    super(null, route, null, null, null, null);
  }


  ngOnInit() {

    this.getListaCompetencias();

  }



  public getListaCompetencias() {

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
    this.msgDivisorMinimo = '';
    this.isDivisorMinimo = (!this.calculo.divisor_minimo) ? true : false;

    const dataInicio = (this.dataInicioBeneficio.clone()).startOf('month');

    // pbc da vida toda
    this.pbcCompleto = (this.route.snapshot.params['pbc'] === 'pbc');
    const dataLimite = (this.pbcCompleto) ? moment('1930-01-01') : moment('1994-07-01');
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
          // this.regrasDaReforma();

        } else {

          const primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
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

                            // this.calculo_apos_pec_2019(this.erros, this.conclusoes, this.contribuicaoPrimaria, this.contribuicaoSecundaria);
                            this.getVerificarOpcoesDeRegra();

                            console.log(this.contribuicaoPrimariaAtePec);
                            console.log(this.contribuicaoPrimaria);
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

    this.listaConclusaoAcesso =  this.regrasAcesso.getVerificacaoRegras(
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
                                                                      redutorSexo
                                                                    );


  this.regrasAcesso.calCularTempoMaximoExcluido(this.listaConclusaoAcesso);


  }



  getIdadeFracionada() {
    return this.dataInicioBeneficio.diff(moment(this.segurado.data_nascimento, 'DD/MM/YYYY'), 'days') / 365.25;
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
