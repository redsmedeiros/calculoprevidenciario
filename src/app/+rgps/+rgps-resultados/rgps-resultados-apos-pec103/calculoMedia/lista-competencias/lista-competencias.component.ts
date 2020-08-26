import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { WINDOW } from 'app/+rgps/+rgps-calculos/window.service';

@Component({
  selector: 'app-lista-competencias',
  templateUrl: './lista-competencias.component.html',
  styleUrls: ['./lista-competencias.component.css']
})
export class ListaCompetenciasComponent implements OnInit {


  @Input() listaConclusaoAcesso;
  @Input() isUpdating;
  @Input() isRegrasTransicao;
  @Input() segurado;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() {

  }


  imprimirBox(event, boxId) {
    event.stopPropagation();


    const seguradoBox = document.getElementById('printableSegurado').innerHTML
    const calculoBox = document.getElementById('printableCalculo').innerHTML
    const boxlista = document.getElementById('lista-' + boxId).innerHTML;
    const boxconclusao = document.getElementById('conclusao-' + boxId).innerHTML;
    const rodape = `<img src='./assets/img/rodapesimulador.png' alt='Logo'>`;

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
    const printContents = seguradoBox + calculoBox + boxlista + boxconclusao;

    const popupWin = window.open('', '_blank', 'width=640,height=480');

    popupWin.document.open();
    popupWin.document.write(`<!doctype html>
                                <html>
                                  <head>${css}</head>
                                  <title> Renda Mensal Inicial - ${this.segurado.nome}</title>
                                  <body onload="window.print()">
                                   <article class="mt-5">${printContents}</article>
                                   <footer class="mt-5">${rodape}</footer>
                                  </body>
                                </html>`);
    popupWin.document.close();
  }

}
