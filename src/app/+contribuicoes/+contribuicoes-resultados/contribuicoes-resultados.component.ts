import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { ContribuicaoJurisprudencialService } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.service';
import { ContribuicaoJurisprudencial } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.model';
import * as moment from 'moment';

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
  public results = [];
  public isUpdating = false;

  // public tableOptions = {
  //   colReorder: true,
  //   paging: false,
  //   ordering: false,
  //   info: false,
  //   searching: false,
  //   data: this.moeda,
  //   columns: [
  //     {data: 'data_moeda',
  //      render: (data) => {
  //         return this.formatDate(data);
  //      }},
  //     {data: (data) => {
  //         return this.getSalarioMinimo(data);
  //      }},
  //     {data: (data) => {
  //         return this.getAliquota(data);
  //      }},
  //     {data: 'cam'},
  //     {data: (data) => {
  //       return this.getValorCorrigido(data);
  //     }}
  //   ] };
  public tableOptions = {
    colReorder: true,
    paging: false,
    ordering: false,
    info: false,
    searching: false,
    data: this.results,
    columns: [
      {data: 'data'},
      {data: 'salario_minimo'},
      {data: 'aliquota'},
      {data: 'indice'},
      {data: 'valor_corrigido'},
    ] 
  };
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

        this.contribuicaoDe = moment(this.calculoJurisprudencial.inicio_atraso);
        this.contribuicaoAte = moment(this.calculoJurisprudencial.final_atraso);
        this.Moeda.getByDateRange(this.contribuicaoDe, this.contribuicaoAte)
          .then((moeda: Moeda[]) => {
            this.moeda = moeda;
            this.updateDatatable();
            this.isUpdating = false;
          })
      })
    }   
  }

  getSalarioMinimo(data){
    return data.sigla + ' ' +this.formatMoney(data.salario_minimo);
  }

  getAliquota(data){
    return data.sigla + ' ' + this.formatMoney(data.aliquota * data.salario_minimo);
  }

  getValorCorrigido(data){
    return 'R$ ' + this.formatMoney(data.salario_minimo * data.aliquota * data.cam);
  }

  updateDatatable() {
    for(let moedaAtual of this.moeda){
      let line = {
        data: this.formatDate(moedaAtual.data_moeda),
        salario_minimo: this.getSalarioMinimo(moedaAtual),
        aliquota: this.getAliquota(moedaAtual),
        indice: moedaAtual.cam,
        valor_corrigido: this.getValorCorrigido(moedaAtual)
      }
      this.results.push(line)
    }
    let lastLine = {
        data: '<b>Total</b>',
        salario_minimo: '',
        aliquota: '',
        indice: '',
        valor_corrigido: '<b>R$' + this.formatMoney(this.calculoJurisprudencial.valor_acumulado)+'</b>'
    }
    this.results.push(lastLine);
    this.tableOptions = {
      ...this.tableOptions,
      data: this.results,
    }
  }

  formatMoney(data){
    data = parseFloat(data);
    return data.toFixed(2).replace('.',',');
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
