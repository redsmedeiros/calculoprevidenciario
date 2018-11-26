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

  public contribuicaoDe2;
  public contribuicaoAte2;

  public moeda: Moeda[];
  public moeda2: Moeda[];
  public results = [];
  public isUpdating = false;
  private idCalculo = '';
  private idSegurado = '';
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
    this.idCalculo = this.route.snapshot.params['id_calculo'];
    this.idSegurado = this.route.snapshot.params['id'];
  	if (this.route.snapshot.params['id_calculo'] !== undefined) {
      this.isUpdating = true;
      this.Jurisprudencial.find(this.route.snapshot.params['id_calculo']).then(calculo => {
        this.calculoJurisprudencial = calculo;

        this.contribuicaoDe = moment(this.calculoJurisprudencial.inicio_atraso);
        this.contribuicaoAte = moment(this.calculoJurisprudencial.final_atraso);
        this.contribuicaoDe2 = (this.calculoJurisprudencial.inicio_atraso2) ? moment(this.calculoJurisprudencial.inicio_atraso2) : '';
        this.contribuicaoAte2 = (this.calculoJurisprudencial.final_atraso2) ? moment(this.calculoJurisprudencial.final_atraso2) : '';
                
        this.Moeda.getByDateRangeMoment(moment(this.contribuicaoDe), moment(this.contribuicaoAte))
          .then((moeda: Moeda[]) => {
            this.moeda = moeda;
            if(this.contribuicaoDe2 && this.contribuicaoAte2){
              this.Moeda.getByDateRangeMoment(moment(this.contribuicaoDe2), moment(this.contribuicaoAte2))
                .then((moeda: Moeda[]) => {
                  this.moeda2 = moeda;
                  this.updateDatatable();
                  this.isUpdating = false;
              });
            }else{
              this.updateDatatable();
              this.isUpdating = false;
            }
        });
      });
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
    if(this.contribuicaoDe2 && this.contribuicaoAte2){
      for(let moedaAtual of this.moeda2){
        let line = {
          data: this.formatDate(moedaAtual.data_moeda),
          salario_minimo: this.getSalarioMinimo(moedaAtual),
          aliquota: this.getAliquota(moedaAtual),
          indice: moedaAtual.cam,
          valor_corrigido: this.getValorCorrigido(moedaAtual)
        }
        this.results.push(line)
      }
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
