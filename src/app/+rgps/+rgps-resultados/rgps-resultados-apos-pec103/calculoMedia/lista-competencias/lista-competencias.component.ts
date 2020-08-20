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
    const rodape = '<footer><p>IEPREV - Instituto de Estudos Previdenciários <br> Tel: (31) 3271-1701 BH/MG</p></footer>';

    const css = `<link rel="stylesheet" type="text/css"  href="assets/css/bootstrap.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-production-plugins.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-production.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-skins.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-rtl.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/smartadmin-angular-next.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/demo.min.css">
                <link rel="stylesheet" type="text/css"  href="assets/css/your_style.css" media="print">
                <style>i.fa, .not-print{ display: none; }
                      div,p,td,th{font-size:11px !important;}
                      .table>tbody>tr>td, .table>tbody>tr>th,
                     .table>tfoot>tr>td, .table>tfoot>tr>th,
                     .table>thead>tr>td, .table>thead>tr>th {padding: 3.5px 8px;}
                      footer{text-align: center;}
                      </style>`;


                      // .ui-sortable-handle, th{
                      //   background-color: #831721 !important;
                      //   border-color: #CCC !important;
                      //   color: #fafafa !important;
                      // }
        // const css = `
              // <style>
              //       body{font-family: Arial, Helvetica, sans-serif;}
              //       h1, h2{font-size:0.9rem;}
              //       i.fa, .not-print{ display: none; }
              //       table{margin-top: 20;}
              //       footer,div,p,td,th{font-size:11px !important;}
              //       .table>tbody>tr>td, .table>tbody>tr>th,
              //        .table>tfoot>tr>td, .table>tfoot>tr>th,
              //        .table>thead>tr>td, .table>thead>tr>th {padding: 3.5px 10px;}
              //        footer{text-align: center;}
              // </style>`;

    // let printableString = '<html><head>' + css
    //   + '<style>#tituloCalculo{font-size:0.9rem;}</style><title> RMI do RGPS - '
    //   + this.segurado.nome + '</title></head><body onload="window.print()">'
    //   + seguradoBox  + calculoBox + boxconclusao + boxlista + rodape + '</body></html>';

    // printableString = printableString.replace(/<table/g,
    //   `<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"`);
    // const popupWin = window.open('', '_blank', 'width=300,height=300');

    // popupWin.document.open();
    // popupWin.document.write(printableString);
    // popupWin.document.close();
    const printContents = seguradoBox + calculoBox + boxlista + boxconclusao;

    const popupWin = window.open('', '_blank', 'width=640,height=480');

    popupWin.document.open();
    popupWin.document.write(`<!doctype html>
                                <html>
                                  <head>${css}</head>
                                  <title> RMI do RGPS - ${this.segurado.nome}</title>
                                  <body onload="window.print()">
                                   <article>${printContents}</article>
                                   <footer>${rodape}</footer>
                                  </body>
                                </html>`);
    popupWin.document.close();
  }

}
