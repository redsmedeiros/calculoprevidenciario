import { Component, OnInit, ViewChild, ElementRef, SimpleChange, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../../services/error.service';
import * as moment from 'moment';
import swal from 'sweetalert2'
import { PDFJSStatic, PDFPageProxy } from "pdfjs-dist";

//import * as PDFJS from "pdfjs-dist";
//import {PDFJS} from 'pdfjs-dist';
import { UploadEvent, UploadFile } from 'ngx-file-drop';


@FadeInTop()
@Component({
  selector: 'app-contribuicoes-importacao-cnis',
  templateUrl: './contribuicoes-importacao-cnis.component.html',
  providers: [
    ErrorService
  ]
})


export class ContribuicoesImportacaoCnisComponent implements OnInit {
  @ViewChild('cnisFileInput') fileInput: ElementRef;


  @Input() atualizarAte;
  @Output() contribuicoesEventOut = new EventEmitter;

  public isUpdating = false;
  public idSegurado = '';
  public idCalculo = '';
  public segurado: any = {};
  public calculo: any;
  public somarSecundaria: boolean = false;
  public exibirCampoAnteriorLei13846: boolean = false;
  public arrayPrimarias = [];
  public arraySecundarias = [];




  //Variaveis para importação do CNIS
  private files: UploadFile[] = [];
  private cnisTextArea;
  private regexpEmpregado = /(\s|\n|\t|\r)((\d{2}\/\d{4})(\s)(\d{0,3}\.?\d{0,3}\.?\d{0,3}\,\d{2}))(?!\s\d{2}\/\d{2}\/\d{4})/g;
  private regexpFacultativoTextArea = /(\s|\t|\n)(\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})|(\s|\n|\t)(\d{2}\/\d{4})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})/g;
  private regexpFacultativoPdf = /(\s|\t|\n)(\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})|(\s|\n|\t)(\d{2}\/\d{4})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})/g;

  constructor(protected router: Router,
    private route: ActivatedRoute,
    protected errors: ErrorService,
  ) {
  }

  ngOnInit() {
    this.isUpdating = true;
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    //  atualizarAte = moment().format('DD/MM/YYYY');

    this.isUpdating = true;

    let changedatualizarAte = changes['atualizarAte'];

    console.log(changedatualizarAte);


  }

  changeSomarSecundaria() { }

  editSegurado() {
    window.location.href = '/#/rgps/rgps-segurados/' +
      this.route.snapshot.params['id_segurado'] + '/editar';
  }

  public dropped(event: UploadEvent) {
    let files = event.files;
    if (files.length > 1) {
      swal('Erro', 'Arraste apenas um arquivo', 'error');
      return;
    }

    let file = event.files[0]
    if (file.fileEntry.isFile) { //É um arquivo?
      const fileEntry = file.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        if (file.type != 'application/pdf') {
          swal('Erro', 'Formato de arquivo inválido', 'error');
        } else {
          this.processPdfFile(file)
        }
      });

    } else {
      //É um diretório
      swal('Erro', 'Não é permitido arrastar um diretório', 'error');
    }
  }

  clickedDropzone() {
    let event = new MouseEvent('click', { bubbles: false });
    this.fileInput.nativeElement.dispatchEvent(event);
  }

  onFileInputChange(event) {
    let files = event.srcElement.files;
    if (files.length > 1) {
      swal('Erro', 'Selecione apenas um arquivo', 'error');
    } else if (files[0].type != 'application/pdf') {
      swal('Erro', 'Formato de arquivo inválido', 'error');
    } else {
      this.processPdfFile(files[0]);
    }
  }

  processPdfFile(file) {
    let PDFJS = require("pdfjs-dist");
    PDFJS.GlobalWorkerOptions.workerSrc = '../../../../../node_modules/pdfjs-dist/build/pdf.worker.js';
    PDFJS.getDocument(window.URL.createObjectURL(file)).then(pdf => {
      let pdfDocument = pdf;
      // Create an array that will contain our promises 
      let pagesPromises = [];
      for (let i = 0; i < pdf.pdfInfo.numPages; i++) {
        // Required to prevent that i is always the total of pages
        (pageNumber => {
          // Store the promise of getPageText that returns the text of a page
          pagesPromises.push(this.getPageText(pageNumber, pdfDocument));
        })(i + 1);
      }
      // Execute all the promises
      Promise.all(pagesPromises).then(pagesText => {
        this.processText(pagesText.join(' '), false);
      });
    });
  }

  getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise((resolve, reject) => {
      PDFDocumentInstance.getPage(pageNum).then(pdfPage => {
        // The main trick to obtain the text of the PDF page, use the getTextContent method
        pdfPage.getTextContent().then(textContent => {
          let textItems = textContent.items;
          let finalString = "";
          // Concatenate the string of the item to the final string
          for (let i = 0; i < textItems.length; i++) {
            let item = textItems[i];
            finalString += item.str + " ";
          }
          // Solve promise with the text retrieven from the page
          resolve(finalString);
        });
      });
    });
  }

  importFromTextArea() {
    let text = this.cnisTextArea;
    this.processText(text, true);
  }

  processText(text, tipoImportacao) {
    text = text.trim().replace('\n', '\t');

    let empregado = null;
    let facultativoOuIndividual = null;

    let empregado_array = [];
    let facultativoOuIndividual_array = [];
    let todas_os_periodos_array = [];
    let regras_aplicadas_array = [];

    empregado = text.match(this.regexpEmpregado)
    if (tipoImportacao) {
      facultativoOuIndividual = text.match(this.regexpFacultativoTextArea);
    } else {
      facultativoOuIndividual = text.match(this.regexpFacultativoPdf);
    }

    if (empregado) {
      empregado_array = this.getArrayFromText(empregado, 1);
    }

    if (facultativoOuIndividual) {
      if (tipoImportacao) {
        facultativoOuIndividual_array = this.getArrayFromText(facultativoOuIndividual, 3);
      } else {
        facultativoOuIndividual_array = this.getArrayFromText(facultativoOuIndividual, 2);
      }
    }

    if (empregado && facultativoOuIndividual) {
      todas_os_periodos_array = empregado_array.concat(facultativoOuIndividual_array);
    } else if (empregado && !facultativoOuIndividual) {
      todas_os_periodos_array = empregado_array;
    } else if (!empregado && facultativoOuIndividual) {
      todas_os_periodos_array = facultativoOuIndividual_array;
    }

    regras_aplicadas_array = this.aplicarRegras(todas_os_periodos_array);

    if (regras_aplicadas_array.length != 0) {
      this.salvarContribuicoes(regras_aplicadas_array);
    } else {
      swal('Erro', 'Nenhuma contribuição encontrada no PDF', 'error');
    }

    //console.log(regras_aplicadas_array);

  }

  getArrayFromText(text, numCol) {
    let arrayOrganizadoNew = [];
    let arrayText = [];
    for (let i = 0; i < text.length; i++) {
      arrayText = text[i].replace(/\n/i, ' ').trim().split(/\s/i);
      arrayOrganizadoNew.push({
        data: arrayText[0].trim(),
        contrib: arrayText[numCol].trim(),
        contributionType: 0
      });
    }
    return arrayOrganizadoNew;
  }

  aplicarRegras(arrayOrganizado) {
    let replacePontos = function (valor) {
      return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    };

    let somaContrib = function (valor1, valor2) {
      return Number((replacePontos(valor1) + replacePontos(valor2)).toFixed(2)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    arrayOrganizado.sort(function (a, b) {
      let dateA = moment(a.data, 'MM/YYYY');
      let dateB = moment(b.data, 'MM/YYYY');
      if (dateA > dateB) {
        return 1;
      }
      if (dateA < dateB) {
        return -1;
      }
      return 0;
      //sort by date ascending
    });

    let teste_data = null;



    arrayOrganizado.filter(function (i, index) {
      if (i.data != teste_data) {
        i.contributionType = 0;
        teste_data = i.data;
      } else {
        i.contributionType = 1; // false para secundarias
      }
    });

    // reduzir o array somando item onde value.data+"-"+value.contributionType são iguais
    let result = [];
    arrayOrganizado.reduce(function (res, value) {
      if (!res[value.data + '-' + value.contributionType]) {
        res[value.data + '-' + value.contributionType] = {
          contrib: '0,00',
          data: value.data,
          contributionType: value.contributionType
        };
        result.push(res[value.data + "-" + value.contributionType])
      }
      res[value.data + '-' + value.contributionType].contrib = somaContrib(res[value.data + '-' + value.contributionType].contrib, value.contrib);

      //  if (value.data == '12/2007' && value.contributionType == 1) {
      //    console.log( value.contrib);
      //   console.log( res[value.data + "-" + value.contributionType].contrib);
      //  }

      return res;
    }, {});


    // Nova regra Lei 13.846/19 - não há constribuições secundárias, secundárias devem ser somadas as primarias; 
    if (moment(this.atualizarAte, 'DD/MM/YYYY').isAfter(moment('17/06/2019', 'DD/MM/YYYY')) || this.somarSecundaria) {
      let teste_data = null;
      for (const objPS of arrayOrganizado) {

        if (objPS.data != teste_data) {
          objPS.contributionType = 0;
          teste_data = objPS.data;
          // this.arrayPrimarias.push(objPS);
        } else {
          objPS.contributionType = 1; // false para secundarias
          this.arraySecundarias.push(objPS);
        }

      }

      let arraySomatorioPS = [];
      for (const objPrim of arrayOrganizado) {

        arraySomatorioPS.push({
          contrib: (objPrim.contributionType === 0) ? this.getValueSecundarias(objPrim.data, objPrim.contrib) : "0,00",
          data: objPrim.data,
          contributionType: objPrim.contributionType
        });

      }

      return arraySomatorioPS;
    } else {


      return result;
    }

  }


  getValueSecundarias(data, contrib) {
    let replacePontos = function (valor) {
      return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    };

    let somaContrib = function (valor1, valor2) {
      return Number((replacePontos(valor1) + replacePontos(valor2)).toFixed(2)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    let value = contrib;
    for (const objSec of this.arraySecundarias) {
      if (objSec.data === data) {
        value = somaContrib(objSec.contrib, value);
      }
    }
    return value
  }

  salvarContribuicoes(array) {
    let contribuicoes = [];

    let replacePontos = function (valor) {
      for (let i = 0; i < 5; i++) {
        valor = valor.replace('.', '');
      }
      return parseFloat(valor.replace(',', '.'));
    };

    for (const element of array) {
      contribuicoes.push({
        data: moment(element.data, 'MM/YYYY').format('MM/YYYY'),
        valor: replacePontos(element.contrib)
      });
    }

    swal({
      type: 'info',
      title: 'Aguarde por favor...',
    })

    swal.showLoading();

    this.contribuicoesEventOut.emit(contribuicoes);

    swal.close();
    this.isUpdating = false;
  }

}

export interface FileSystemFileEntry {
  isDirectory: false
  isFile: true
  file(callback: (file: File) => void): void
  name: string
}
