import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { SeguradoService } from '../Segurado.service';
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { ContribuicaoComplementarService } from '../+contribuicoes-complementar/ContribuicaoComplementar.service';
import { ContribuicaoComplementar } from '../+contribuicoes-complementar/ContribuicaoComplementar.model';
import { MatrixService } from '../MatrixService.service'
import * as moment from 'moment'
import swal from 'sweetalert2';

@FadeInTop()
@Component({
  selector: 'app-contribuicoes-resultados-complementar',
  templateUrl: './contribuicoes-resultados-complementar.component.html',
})
export class ContribuicoesResultadosComplementarComponent implements OnInit {
  public baseAliquota = 0;


  public calculoComplementar: any = {};
  public moeda: Moeda[];
  public isUpdating = false;
  private segurado;
  public competenciaInicial;
  public competenciaFinal;

  public hasDetalhe = false;
  public mostrarJuros;
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

  public detalhesList;
  public detalhesTableOptions = {
    paging: false, 
    ordering: false, 
    info: false, 
    searching: false,
    data: this.detalhesList,
    columns: [
      {data: 'indice_num'},
      {data: 'mes'},
      {data: 'contrib_base'},
      {data: 'indice'},
      {data: 'valor_corrigido'},
    ]
  }

  private idCalculo = '';
  private idSegurado = '';
  constructor(
  	protected Complementar: ContribuicaoComplementarService,
  	protected router: Router,
    private route: ActivatedRoute,
    private Moeda: MoedaService,
    protected Segurado: SeguradoService, 
    protected MatrixStore: MatrixService,
  ) { }

  ngOnInit() {
    this.idCalculo = this.route.snapshot.params['id_calculo'];
    this.idSegurado = this.route.snapshot.params['id']
    this.hasDetalhe = !((this.MatrixStore.getTabelaDetalhes()).length === 0);
  	this.isUpdating = true;
    this.Segurado.find(this.idSegurado).then(segurado => {
      this.segurado = segurado;
      this.dataNascimento();
      if(localStorage.getItem('user_id') != this.segurado.user_id){
          //redirecionar para pagina de segurados
          swal({
            type: 'error',
            title: 'Erro',
            text: 'Você não tem permissão para acessar esta página!',
            allowOutsideClick: false
          }).then(()=> {
            this.listaSegurados();
          });
        }else{
          this.Complementar.find(this.idCalculo).then(calculo => {
          this.calculoComplementar = calculo;
          this.mostrarJuros = this.calculoComplementar.chk_juros;
          if(!this.mostrarJuros){
            this.resultadosTableOptions = {
              ...this.resultadosTableOptions,
              columns: [
                        {data: 'competencia'},
                        {data: 'valor_contribuicao'},
                        {data: 'multa'},
                        {data: 'total'},
              ],
            }
          }
          let splited = this.calculoComplementar.inicio_atraso.split('-');
          this.competenciaInicial = splited[1]+'/'+splited[0];
          splited = this.calculoComplementar.final_atraso.split('-');
          this.competenciaFinal = splited[1]+'/'+splited[0];
          this.baseAliquota = (this.calculoComplementar.media_salarial * 0.2);
          this.resultadosList = this.generateTabelaResultados();
         
          this.updateResultadosDatatable();
          if(this.hasDetalhe){
         
                this.detalhesList = this.MatrixStore.getTabelaDetalhes().filter(this.onlyUnique);
                this.updateDetalhesDatatable();
          
          }
            console.log(this.detalhesList);
            
          
          this.Moeda.getByDateRange('01/' + this.competenciaInicial, '01/' + this.competenciaFinal)
            .then((moeda: Moeda[]) => {
              this.moeda = moeda;
              this.isUpdating = false;
            });
          });
        }

      
        
        
    });
    
   
  }


  // getNumberFromTableEntry(tableEntry){
  //   if(tableEntry == ''){
  //     return 0.0;
  //   }
  //   return parseFloat((tableEntry.split(' ')[1]).replace(',','.'));
  // }


  // getMatrixData(){
  //   let unique_anos = this.anosConsiderados.filter(this.onlyUnique);
  //   let data_dict = [];
  //   for(let ano of unique_anos){
  //     data_dict.push("01/"+ano+'-'+valor_jan);
  //     data_dict.push("02/"+ano+'-'+valor_fev);
  //     data_dict.push("03/"+ano+'-'+valor_mar);
  //     data_dict.push("04/"+ano+'-'+valor_abr);
  //     data_dict.push("05/"+ano+'-'+valor_mai);
  //     data_dict.push("06/"+ano+'-'+valor_jun);
  //     data_dict.push("07/"+ano+'-'+valor_jul);
  //     data_dict.push("08/"+ano+'-'+valor_ago);
  //     data_dict.push("09/"+ano+'-'+valor_set);
  //     data_dict.push("10/"+ano+'-'+valor_out);
  //     data_dict.push("11/"+ano+'-'+valor_nov);
  //     data_dict.push("12/"+ano+'-'+valor_dez);
  //   }
  //   return data_dict;
  // }

  

  dataNascimento(){
    this.segurado.data_nascimento;
    let idadeSegurado = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    this.segurado.idade = moment().diff(idadeSegurado, 'years');
  
  }
  generateTabelaResultados(){
    let competencias = this.monthAndYear(this.competenciaInicial,  this.competenciaFinal);
    let dataTabelaResultados = [];
    
    //Variaveis para a linha de total
    let total_contrib = 0.0;
    let total_juros = 0.0;
    let total_multa = 0.0;
    let total_total = 0.0;

  //  console.log(competencias);
    

    for(let competencia of competencias){
      let splited = competencia.split('-');

      competencia = splited[1] + '/' + splited[0];
      let valor_contribuicao = this.getValorContribuicao();
      let juros = (this.mostrarJuros) ? this.getTaxaJuros(competencia) : 0;
      let multa = this.getMulta();
      let total = (this.getBaseAliquota()*1.1) + juros;

      let line = {competencia: competencia, 
                  valor_contribuicao: this.formatMoney(valor_contribuicao), 
                  juros: this.formatMoney(juros), 
                  multa: this.formatMoney(multa), 
                  total: this.formatMoney(total)};

      dataTabelaResultados.push(line);

      //calculos dos totais
      total_contrib += valor_contribuicao;
      total_juros += juros;
      total_multa += multa;
      total_total += total;
    }
    let last_line = {competencia: '<b>Total</b>', 
                     valor_contribuicao: '<b>'+ this.formatMoney(total_contrib) + '</b>', 
                     juros: '<b>' + this.formatMoney(total_juros) + '</b>', 
                     multa: '<b>' + this.formatMoney(total_multa) + '</b>', 
                     total: '<b>' + this.formatMoney(total_total) + '</b>'
                    };
    dataTabelaResultados.push(last_line);
    return dataTabelaResultados;
  }

  //Retorna uma lista com os meses entre dateStart e dateEnd
  monthAndYear(dateStart, dateEnd){
    dateStart = moment(dateStart, 'MM/YYYY');
    dateEnd = moment(dateEnd, 'MM/YYYY');
    let timeValues = [];
    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
       timeValues.push(dateStart.format('YYYY-MM'));
       dateStart.add(1,'month');
    }
    return timeValues;
  }

  getTaxaJuros(dataReferencia){
    let taxaJuros = 0.0;
    let jurosMensais = 0.005;
    let jurosAnuais = 1.06;
    let numAnos = this.getDifferenceInYears(dataReferencia);
    let numMeses = this.getDifferenceInMonths(dataReferencia) - (numAnos*12);
    taxaJuros = ((jurosAnuais ** numAnos) * ((jurosMensais * numMeses) + 1)) - 1;
    taxaJuros = Math.min(taxaJuros, 0.5);
    //console.log(dataReferencia, numAnos, numMeses, taxaJuros);
    let totalJuros = this.getBaseAliquota() * taxaJuros;

    return totalJuros;
  }

  getValorContribuicao(){
    return this.getBaseAliquota();
  }

  getMulta(){
    return this.getBaseAliquota()*0.1;
  }

  getBaseAliquota(){
    return this.baseAliquota;
  }

  updateDetalhesDatatable(){
    this.detalhesTableOptions = {
      ...this.detalhesTableOptions,
      data: this.detalhesList,
    }
  }

  updateResultadosDatatable(){
    this.resultadosTableOptions = {
      ...this.resultadosTableOptions,
      data: this.resultadosList,
    }
  }

  //Retorna a diferença em anos completos entre a data passada como parametro e a data atual
  getDifferenceInYears(dateString){
    let today = moment();
    let pastDate = moment(dateString, 'MM/YYYY');
    let differenceInYears = Math.abs(today.diff(pastDate, 'years'));
    return differenceInYears;
  }

  //Retorna a diferença em meses completos entre as datas passadas como parametro.
  //Caso só uma data seja passada, retorna a diferença entre ela e a data atual
  getDifferenceInMonths(dateString, dateString2=''){
    let splitted = dateString.split('/');
    let recent;
    if(dateString2 == ''){
      recent = moment();
    }else{
      recent = moment(dateString2, 'MM/YYYY');
    }
    let pastDate = moment(dateString, 'MM/YYYY');
    let differenceInMonths = Math.abs(recent.diff(pastDate, 'months'));
    return differenceInMonths;
  }

  formatMoney(data){
    data = parseFloat(data);
    return 'R$ ' + data.toLocaleString('pt-BR', {maximumFractionDigits:2, minimumFractionDigits:2});
  }

  listaSegurados(){
    window.location.href='/#/contribuicoes/contribuicoes-segurados/';
  }

  voltar(){
    window.location.href='/#/contribuicoes/contribuicoes-calculos/'+ this.route.snapshot.params['id'];
  }

  // imprimirPagina(){
  //   let seguradoBox = document.getElementById('printableSegurado').innerHTML
  //   let dadosCalculo = document.getElementById('printableDadosCalculo').innerHTML
  //   let detalhamentoCalculo = document.getElementById('detalhamentoCalculo').innerHTML
  //   let resultadosCalculo = document.getElementById('resultadosCalculo').innerHTML
  //   let printContents = seguradoBox + '<br>' + dadosCalculo + '<br>' + detalhamentoCalculo + '<br>' + resultadosCalculo + '<br>';
  //   printContents = printContents.replace(/<table/g, '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');
   
  //   const rodape = `<footer style="color: #c5c7c8!important;margin-top: 80px;">
  //   <img src="assets/img/logo-IEPREV.png" style="display:block; margin-left: auto; margin-right: auto;opacity: 0.4;">
  //   <p style="text-align: center;">Simulador de Cálculos do Instituto de Estudos Previdenciários - IEPREV.</p>
  // </footer>`;


  //   let popupWin = window.open('', '_blank', 'width=300,height=300');
  //   popupWin.document.open();
  //   popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + rodape + '</body></html>');
  //   popupWin.document.close();
  // }


  
  imprimirPagina(){

    const css = `<link rel="stylesheet" type="text/css"  href="assets/css/bootstrap.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/demo.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/your_style.css" media="print">
                <style>i.fa, .not-print{ display: none; }
                      div,p,td,th{font-size:11px !important;}
                      table{margin-top: 20px;}
                      .table-bordered, .table-bordered>tbody>tr>td,
                      .table-bordered>tbody>tr>th,
                      .table-bordered>tfoot>tr>td,
                      .table-bordered>tfoot>tr>th,
                      .table-bordered>thead>tr>td, .table-bordered>thead>tr>th {
                        border: 1px solid #000 !important;
                    }
                     .table>tbody>tr>td, .table>tbody>tr>th,
                     .table>tfoot>tr>td, .table>tfoot>tr>th,
                     .table>thead>tr>td, .table>thead>tr>th {
                       padding: 3.5px 8px;
                      border-color: #000 !important
                    }
                      footer{text-align: center; margin-top: 50px;}
                      .page-break { page-break-inside: avoid;}
                      </style>`;


    let seguradoBox = document.getElementById('printableSegurado').innerHTML
    let dadosCalculo = document.getElementById('printableDadosCalculo').innerHTML
    let detalhamentoCalculo = document.getElementById('detalhamentoCalculo').innerHTML
    let resultadosCalculo = document.getElementById('resultadosCalculo').innerHTML
    let printContents = seguradoBox  + dadosCalculo  + detalhamentoCalculo  + resultadosCalculo ;
    // printContents = printContents.replace(/<table/g, 
    //   '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');

      const rodape = `<img src='./assets/img/rodapesimulador.png' alt='Logo'>`;

    let popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    // popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' 
    //                           + printContents + rodape + '</body></html>');

                              popupWin.document.write(`<!doctype html>
                              <html>
                                <head>${css}</head>
                                <title> Contribuições Atrasadas - Lei complementar 128_08 - ${this.segurado.nome}</title>
                                <body onload="window.print()">
                                 <article class="mt-5">${printContents}</article>
                                 <footer class="mt-5">${rodape}</footer>
                                </body>
                              </html>`);
    popupWin.document.close();
  }

  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }
}
