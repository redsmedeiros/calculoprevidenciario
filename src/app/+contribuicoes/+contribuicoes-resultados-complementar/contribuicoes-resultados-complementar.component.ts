import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { ContribuicaoComplementarService } from '../+contribuicoes-complementar/ContribuicaoComplementar.service';
import { ContribuicaoComplementar } from '../+contribuicoes-complementar/ContribuicaoComplementar.model';
import { MatrixService } from '../MatrixService.service'

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
  public baseAliquota;

  public calculoComplementar: any = {};
  public moeda: Moeda[];
  public isUpdating = false;

  public competenciaInicial;
  public competenciaFinal;

  public resultadosTableOptions = {
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

      this.Moeda.getByDateRange('01/' + this.competenciaInicial, '01/' + this.competenciaFinal)
        .then((moeda: Moeda[]) => {
          this.moeda = moeda;
          this.updateDatatable();
          this.isUpdating = false;
        })
    })
    console.log(this.MatrixStore.getMatrix());
  }

  updateDatatable(){

  }

  getTaxaJuros(){
  	let taxaJuros = ((this.jurosAnuais ** this.numAnos) * (this.jurosMensais * this.numMeses) + 1) - 1;
  	return Math.min(this.baseAliquota * taxaJuros, 0.005);
  }

  getValorBaseRecolhimentoAliquota(){return (this.calculoComplementar.media_salarial*0.2).toFixed(2).replace('.',',');}

  formatTotalContrib(){return (this.calculoComplementar.total_contribuicao).toFixed(2).replace('.',',');}

  formatValorMedioFinal(){return (this.calculoComplementar.media_salarial).toFixed(2).replace('.',',');}

  listaSegurados(){
    window.location.href='/#/contribuicoes/contribuicoes-segurados/';
  }

  voltar(){
    window.location.href='/#/contribuicoes/contribuicoes-calculos/'+ this.route.snapshot.params['id'];
  }
}
