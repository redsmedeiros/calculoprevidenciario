import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { ContribuicaoJurisprudencialService } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.service';
import { ContribuicaoJurisprudencial } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.model';


@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contribuicoes-resultados.component.html',
})
export class ContribuicoesResultadosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public calculoJurisprudencial: any ={};

  public contribuicaoDe;
  public contribuicaoAte;

  public moeda: Moeda[];

  public isUpdating = false;

  public tableOptions = {
    colReorder: true,
    data: this.moeda,
    columns: [
      {data: 'data_moeda',
       render: (data) => {
          return this.formatDate(data);
       }},
      {data: 'salario_minimo',
       render: (data) => {
          return this.formatMoney(data);
       }},
      {data: 'aliquota',
       render: (data) => {
          return this.formatMoney(data);
       }},
      {data: 'correcao'},
      {data: 'valor_corrigido'}
    ] };
  constructor(
  	protected Jurisprudencial: ContribuicaoJurisprudencialService,
  	protected router: Router,
    private route: ActivatedRoute,
    private Moeda: MoedaService,
  ) {}

  ngOnInit() {
  	if (this.route.snapshot.params['id_calculo'] !== undefined) {
      this.isUpdating = true;
      this.Jurisprudencial.find(this.route.snapshot.params['id_calculo']).then(calculo => {
        this.calculoJurisprudencial = calculo;

        let splited = this.calculoJurisprudencial.inicio_atraso.split('-');
        this.contribuicaoDe = splited[1]+'/'+splited[0];
        splited = this.calculoJurisprudencial.final_atraso.split('-');
        this.contribuicaoAte = splited[1]+'/'+splited[0];

        this.Moeda.getByDateRange('01/' + this.contribuicaoDe, '01/' + this.contribuicaoAte)
          .then((moeda: Moeda[]) => {
            this.moeda = moeda;
            this.updateDatatable();
            this.isUpdating = false;
          })
      })
    }   
  }

  updateDatatable() {
    this.tableOptions = {
      ...this.tableOptions,
      data: this.moeda,
    }
  }
  formatMoney(data){
    return 'R$ ' + data;
  }

  formatDate(data){
    let splited = data.split('-');
    return splited[1] +'/'+splited[0];
  }

  listaSegurados(){
    window.location.href='/#/contribuicoes/contribuicoes-segurados/';
  }

  voltar(){
    window.location.href='/#/contribuicoes/contribuicoes-calculos/'+ this.route.snapshot.params['id'];
  }

}
