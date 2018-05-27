import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { ContribuicaoComplementarService } from '../+contribuicoes-complementar/ContribuicaoComplementar.service';
import { ContribuicaoComplementar } from '../+contribuicoes-complementar/ContribuicaoComplementar.model';

@FadeInTop()
@Component({
  selector: 'app-contribuicoes-resultados-complementar',
  templateUrl: './contribuicoes-resultados-complementar.component.html',
})
export class ContribuicoesResultadosComplementarComponent implements OnInit {
  public numAnos;
  public numMeses;
  public jurosMensais = 0,005;
  public jurosAnuais = 1,06;
  public baseAliquota;

  public calculoComplementar: any = {};
  public moeda: Moeda[];
  public isUpdating = false;

  public competenciaInicial;
  public competenciaFinal;
  constructor(
  	protected Complementar: ContribuicaoComplementarService,
  	protected router: Router,
    private route: ActivatedRoute,
    private Moeda: MoedaService,
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
  }


  getTaxaJuros(){
  	let taxaJuros = ((this.jurosAnuais ** this.numAnos) * (this.jurosMensais * this.numMeses) + 1) - 1;
  	return Math.min(this.baseAliquota * taxaJuros, 0.005);
  }

  listaSegurados(){
    window.location.href='/#/contribuicoes/contribuicoes-segurados/';
  }

  voltar(){
    window.location.href='/#/contribuicoes/contribuicoes-calculos/'+ this.route.snapshot.params['id'];
  }
}
