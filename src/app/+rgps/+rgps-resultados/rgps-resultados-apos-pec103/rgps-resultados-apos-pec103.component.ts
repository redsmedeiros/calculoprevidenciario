
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
import { RgpsResultadosComponent } from '../rgps-resultados.component'
import * as moment from 'moment';




@Component({
  selector: 'app-rgps-resultados-apos-pec103',
  templateUrl: './rgps-resultados-apos-pec103.component.html',
  styleUrls: ['./rgps-resultados-apos-pec103.component.css']
})
export class RgpsResultadosAposPec103Component extends RgpsResultadosComponent implements OnInit {

  @Input() calculo;
  @Input() segurado;

  public boxId;
  public dataFiliacao;
  public idadeSegurado;
  public idCalculo;
  public contribuicaoTotal;
  public isUpdating = false;
  public nenhumaContrib = false;
  public contribuicaoPrimaria = { anos: 0, meses: 0, dias: 0 };


  public divisorMinimo = 0;
  public isDivisorMinimo = true;
  public msgDivisorMinimo = '';


  // transição INICIO
  public dataPromulgacao2019 = moment('13/11/2019', 'DD/MM/YYYY');
  public isRegrasPensaoObitoInstituidorAposentado = false;

  constructor(

    private ExpectativaVida: ExpectativaVidaService,
    protected route: ActivatedRoute,
    private ReajusteAutomatico: ReajusteAutomaticoService,
    protected ValoresContribuidos: ValorContribuidoService,
    private CarenciaProgressiva: CarenciaProgressivaService,
    private CalculoRgpsService: CalculoRgpsService,
    private Moeda: MoedaService,


    )
  {
    super(null, route, null, null, null, null);
  }


  ngOnInit() {
   
   this.getListaCompetencias();
  }


  public getListaCompetencias(){
    this.boxId = this.generateBoxId(this.calculo.id, '19');
    this.isUpdating = true;
    this.dataFiliacao = this.getDataFiliacao();
    this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    this.idadeSegurado = this.getIdadeNaDIB(this.dataInicioBeneficio);
    this.idadeFracionada = this.getIdadeFracionada();
    this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_19);
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

                            //this.calculo_apos_pec_2019(this.erros, this.conclusoes, this.contribuicaoPrimaria, this.contribuicaoSecundaria);

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


}
