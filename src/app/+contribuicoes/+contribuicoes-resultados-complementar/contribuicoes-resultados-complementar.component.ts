import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { ContribuicaoComplementarService } from '../+contribuicoes-complementar/ContribuicaoComplementar.service';
import { ContribuicaoComplementar } from '../+contribuicoes-complementar/ContribuicaoComplementar.model';
import { MatrixService } from '../MatrixService.service'
import * as moment from 'moment'

@FadeInTop()
@Component({
  selector: 'app-contribuicoes-resultados-complementar',
  templateUrl: './contribuicoes-resultados-complementar.component.html',
})
export class ContribuicoesResultadosComplementarComponent implements OnInit {
  public numAnos;
  public numMeses;
  public jurosMensais = 0.005;
  public jurosAnuais = 1.06;
  public baseAliquota = 0;
  public multa = 0;

  public calculoComplementar: any = {};
  public moeda: Moeda[];
  public isUpdating = false;

  public competenciaInicial;
  public competenciaFinal;

  public hasDetalhe = false;

  public resultadosList;
  public resultadosTableOptions = {
    paging: false, 
    ordering: false, 
    info: false, 
    searching: false,
    data: this.resultadosList,
    columns: [
      {data: 'competencia'},
      {data: 'valor_contribuicao'},
      {data: 'juros'},
      {data: 'multa'},
      {data: 'total'},
    ]
  }

  public detalhesTableOptions = {
    paging: false, 
    ordering: false, 
    info: false, 
    searching: false
  }

  constructor(
  	protected Complementar: ContribuicaoComplementarService,
  	protected router: Router,
    private route: ActivatedRoute,
    private Moeda: MoedaService,
    protected MatrixStore: MatrixService,
  ) { }

  ngOnInit() {
  	this.isUpdating = true;
    this.Complementar.find(this.route.snapshot.params['id_calculo']).then(calculo => {
      this.calculoComplementar = calculo;

      let splited = this.calculoComplementar.inicio_atraso.split('-');
      this.competenciaInicial = splited[1]+'/'+splited[0];
      splited = this.calculoComplementar.final_atraso.split('-');
      this.competenciaFinal = splited[1]+'/'+splited[0];
      this.baseAliquota = (this.calculoComplementar.media_salarial*0.2);
      this.multa = (this.baseAliquota*0.1);
      this.resultadosList = this.getTabelaResultados();
      this.updateResultadosDatatable();

      this.Moeda.getByDateRange('01/' + this.competenciaInicial, '01/' + this.competenciaFinal)
        .then((moeda: Moeda[]) => {
          this.moeda = moeda;
          this.updateDatatable();
          this.isUpdating = false;
        })
    })
   this.hasDetalhe = !((this.MatrixStore.getMatrix()).length === 0);
  }

  updateDatatable(){

  }

  updateResultadosDatatable(){
    this.resultadosTableOptions = {
      ...this.resultadosTableOptions,
      data: this.resultadosList,
    }
  }

  getTaxaJuros(){
  	let taxaJuros = ((this.jurosAnuais ** this.numAnos) * (this.jurosMensais * this.numMeses) + 1) - 1;
  	return Math.min(this.baseAliquota * taxaJuros, 0.005);
  }

  getValorContribuicao(){
    return 'R$ ' + this.getBaseAliquota();
  }

  getMulta(){
    return 'R$ ' + ((this.multa.toFixed(2)).replace('.',','));
  }

  getBaseAliquota(){
    return (this.baseAliquota.toFixed(2)).replace('.',',');
  }

  formatTotalContrib(){
    return (this.calculoComplementar.total_contribuicao).toFixed(2).replace('.',',');
  }

  formatValorMedioFinal(){
    return (this.calculoComplementar.media_salarial).toFixed(2).replace('.',',');
  }


  //Retorna a diferença em anos completos entre a data passada como parametro e a data atual
  getDifferenceInYears(dateString){
    let today = moment();
    let pastDate = moment(dateString);
    let duration = moment.duration(today.diff(pastDate));
    let years = duration.asYears();
    return Math.floor(years);
  }

  getTabelaResultados(){
    let competencias = this.monthAndYear(this.competenciaInicial, this.competenciaFinal);
    let dataTabelaResultados = [];
    let total_contrib = 0.0;
    let total_juros = 0.0;
    let total_multa = 0.0;
    let total_total = 0.0;

    for(let competencia of competencias){
      let splited = competencia.split('-');
      competencia = splited[1] + '/' + splited[0];
      let valor_contribuicao = this.getValorContribuicao();
      let juros = 'R$ 0,00';
      let multa = this.getMulta();
      let total = 'R$ 0,00';
      let line = {competencia: competencia, valor_contribuicao: valor_contribuicao, juros: juros, multa: multa, total: total};
      dataTabelaResultados.push(line);

      //calculos dos totais
      total_contrib += parseFloat((valor_contribuicao.split(' ')[1]).replace(',','.'));
      total_juros += parseFloat((juros.split(' ')[1]).replace(',','.'));
      total_multa += parseFloat((multa.split(' ')[1]).replace(',','.'));
      total_total += parseFloat((total.split(' ')[1]).replace(',','.'));
    }
    let last_line = {competencia: '<b>Total</b>', 
                     valor_contribuicao: '<b>R$ '+ (total_contrib).toFixed(2).replace('.',',') + '</b>', 
                     juros: '<b>R$ ' + (total_juros).toFixed(2).replace('.',',') + '</b>', 
                     multa: '<b>R$ ' + (total_multa).toFixed(2).replace('.',',') + '</b>', 
                     total: '<b>R$ ' + (total_total).toFixed(2).replace('.',',') + '</b>'
                    };
    dataTabelaResultados.push(last_line);
    return dataTabelaResultados;
  }

  //Retorna uma lista com os meses entre dateStart e dateEnd
  monthAndYear(dateStart, dateEnd){
    dateStart = '01/'+dateStart;
    dateEnd = '01/'+dateEnd;

    let startSplit = dateStart.split('/');
    let endSplit = dateEnd.split('/');

    dateStart = moment(startSplit[2]+'-'+startSplit[1]+'-'+startSplit[0]);
    dateEnd = moment(endSplit[2]+'-'+endSplit[1]+'-'+endSplit[0]);
    let timeValues = [];

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
       timeValues.push(dateStart.format('YYYY-MM'));
       dateStart.add(1,'month');
    }
    return timeValues;
  }

  listaSegurados(){
    window.location.href='/#/contribuicoes/contribuicoes-segurados/';
  }

  voltar(){
    window.location.href='/#/contribuicoes/contribuicoes-calculos/'+ this.route.snapshot.params['id'];
  }
}
