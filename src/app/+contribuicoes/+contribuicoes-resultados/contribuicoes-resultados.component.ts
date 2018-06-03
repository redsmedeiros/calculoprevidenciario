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
    paging: false,
    ordering: false,
    info: false,
    searching: false,
    data: this.moeda,
    columns: [
      {data: 'data_moeda',
       render: (data) => {
          return this.formatDate(data);
       }},
      {data: (data) => {
          return this.getSalarioMinimo(data);
       }},
      {data: (data) => {
          return this.getAliquota(data);
       }},
      {data: 'cam'},
      {data: (data) => {
        return this.getValorCorrigido(data);
      }}
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

  getSalarioMinimo(data){
    return data.sigla + ' ' +data.salario_minimo;
  }

  getAliquota(data){
    return data.sigla + ' ' +data.aliquota;
  }

  getValorCorrigido(data){
    let aliquota = data.salario_minimo * data.aliquota;
    return 'R$ ' + data.salario_minimo * aliquota * data.cam;
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

  imprimirPagina(){
    let printContents = document.getElementById('content').innerHTML;
    let popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWin.document.close();
  }

}
