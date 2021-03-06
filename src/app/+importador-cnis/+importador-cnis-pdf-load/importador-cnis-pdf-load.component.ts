import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../shared/animations/fade-in-top.decorator';
import * as moment from 'moment';
import { ImportadorCnisSeguradosComponent } from './+importador-cnis-segurados/importador-cnis-segurados.component';
import swal from 'sweetalert2'
import { ErrorService } from '../../../services/error.service';
import { PDFJSStatic, PDFPageProxy } from 'pdfjs-dist';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

@Component({
  selector: 'app-importador-cnis-pdf-load',
  templateUrl: './importador-cnis-pdf-load.component.html',
  styleUrls: ['./importador-cnis-pdf-load.component.css']
})
export class ImportadorCnisPdfLoadComponent implements OnInit {


  @Input() userId;

  public seq: any;
  public vinculos: any;


  public segurado = {
    nome: null,
    nit: null,
    data_nascimento: null,
    numero_documento: null,
    type: null,
    id_documento: 0,
    funcao: 'contagem',
    sexo: null,
    userId: ''
  };

  @Output() infoSegurado = new EventEmitter();
  @Output() infoVinculos = new EventEmitter();
  @ViewChild('cnisFileInput') fileInput: ElementRef;

  private moedaImportAmerika = false;
  private regexpEmpregado = /(\s|\n|\t|\r)((\d{2}\/\d{4})(\s)(\d{0,3}\.?\d{0,3}\.?\d{0,3}\,\d{2}))(?!\s\d{2}\/\d{2}\/\d{4})/g;
  private regexpFacultativoTextArea = /(\s|\t|\n)(\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})|(\s|\n|\t)(\d{2}\/\d{4})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})/g;
  private regexpFacultativoPdf = /(\s|\t|\n)(\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})|(\s|\n|\t)(\d{2}\/\d{4})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})/g;


  constructor() { }

  ngOnInit() { }


  /**
   * Seleciona os dados do segurado 
   * @param text texto completo do CNIS
   */
  // private selecionarDadosDoSegurado(text) {

  //   this.segurado.type = 0;

  //   if (text.search(/(\d{3}.\d{5}.\d{2}-\d{1})/) > 0) {
  //     this.segurado.nit = text.match(/(\d{3}.\d{5}.\d{2}-\d{1})/)[0].trim();
  //     this.segurado.numero_documento = text.match(/(\d{1,3}.\d{3}.\d{3}-\d{2})/)[0].trim();
  //     this.segurado.data_nascimento = text.substring(text.indexOf('nascimento:'), text.indexOf('Nome da')).match(/(\d{2}\/\d{2}\/\d{4})/)[0].trim();
  //     this.segurado.nome = text.substring(text.indexOf('Nome:') + 5, text.indexOf('Data de nascimento:')).trim();
  //     this.segurado.type = 1;
  //   } else {
  //     this.segurado.nit = text.match(/(\d{1}.\d{3}.\d{3}.\d{3}-\d{1})/)[0].trim();
  //     this.segurado.numero_documento = text.match(/(\d{1,3}.\d{3}.\d{3}-\d{2})/)[0].trim();
  //     this.segurado.data_nascimento = text.substring(text.indexOf('Nit:'), text.indexOf('CPF:')).match(/(\d{2}\/\d{2}\/\d{4})/)[0].trim();
  //     this.segurado.nome = text.substring(text.indexOf('Nome da M??e:') + 12, text.indexOf('CPF:')).match(/([A-Z]|\s)+/)[0].trim();
  //     this.segurado.type = 2;
  //   }

  //   this.segurado.userId = this.userId;

  //   return this.segurado;
  // }


  private getDadosDoSegurado(text) {
    return new Promise((resolve, reject) => {
      this.segurado.type = 0;

      if (text.search(/(\d{3}.\d{5}.\d{2}-\d{1})/) > 0) {
        this.segurado.nit = text.match(/(\d{3}.\d{5}.\d{2}-\d{1})/)[0].trim();
        this.segurado.numero_documento = text.match(/(\d{1,3}.\d{3}.\d{3}-\d{2})/)[0].trim();
        this.segurado.data_nascimento = text.substring(text.indexOf('nascimento:'), text.indexOf('Nome da')).match(/(\d{2}\/\d{2}\/\d{4})/)[0].trim();
        this.segurado.nome = text.substring(text.indexOf('Nome:') + 5, text.indexOf('Data de nascimento:')).trim();
        this.segurado.type = 1;
      } else {
        this.segurado.nit = text.match(/(\d{1}.\d{3}.\d{3}.\d{3}-\d{1})/)[0].trim();
        this.segurado.numero_documento = text.match(/(\d{1,3}.\d{3}.\d{3}-\d{2})/)[0].trim();
        this.segurado.data_nascimento = text.substring(text.indexOf('Nit:'), text.indexOf('CPF:')).match(/(\d{2}\/\d{2}\/\d{4})/)[0].trim();
        this.segurado.nome = text.substring(text.indexOf('Nome da M??e:') + 12, text.indexOf('CPF:')).match(/([A-Z]|\s)+/)[0].trim();
        this.segurado.type = 2;
      }

      this.segurado.userId = this.userId;

      if (this.segurado.type > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }


  /**
   * Subdividir os vinculos do documento
   * @param text texto completo do documento CNIS
   * @param segurado obj segurado 
   */
  // private selectSequencias(text, segurado) {


  //   let text_limite_seq = (segurado.type === 1) ? 'Seq.' : '??ndice';


  //   const seq = []
  //   const text_full = text;
  //   let init = text.indexOf(text_limite_seq);
  //   let count = 0;
  //   let next = 0;
  //   let textaux = '';
  //   let fim_doc = '';


  //   while (init !== -1) {
  //     count++;
  //     next = text_full.indexOf(text_limite_seq, init + 1);

  //     if (next !== -1) {
  //       textaux = text_full.substring(init, next);
  //     } else {
  //       fim_doc = (text_full.search('Legenda de Indicadores') > 0) ? text_full.indexOf('Legenda de Indicadores') : text_full.indexOf('https://meu.inss.gov.br/central/autenticidade');
  //       textaux = text_full.substring(init, fim_doc);
  //     }
  //     textaux = textaux.replace(/(INSS - INSTITUTO NACIONAL DO SEGURO SOCIAL CNIS - Cadastro Nacional de Informa????es Sociais Extrato Previdenci??rio)(\s)(\d{2}\/\d{2}\/\d{4})(\s)(\d{2}:\d{2}:\d{2})/i, ' ');

  //     seq.push(textaux);
  //     init = next;
  //   }

  //   return seq;
  // }



  private getSequencias(text, segurado) {
    return new Promise((resolve, reject) => {
      const text_limite_seq = (segurado.type === 1) ? 'Seq.' : '??ndice';
      const seq = []
      const text_full = text;
      let init = text.indexOf(text_limite_seq);
      let count = 0;
      let next = 0;
      let textaux = '';
      let fim_doc = '';


      while (init !== -1) {
        count++;
        next = text_full.indexOf(text_limite_seq, init + 1);

        if (next !== -1) {
          textaux = text_full.substring(init, next);
        } else {
          fim_doc = (text_full.search('Legenda de Indicadores') > 0) ? text_full.indexOf('Legenda de Indicadores') : text_full.indexOf('https://meu.inss.gov.br/central/');
          textaux = text_full.substring(init, fim_doc);
        }
        textaux = textaux.replace(/(INSS - INSTITUTO NACIONAL DO SEGURO SOCIAL CNIS - Cadastro Nacional de Informa????es Sociais Extrato Previdenci??rio)(\s)(\d{2}\/\d{2}\/\d{4})(\s)(\d{2}:\d{2}:\d{2})/i, ' ');

        seq.push(textaux);
        init = next;
      }

      if (seq.length > 0) {
        return resolve(seq);
      } else {
        reject(seq);
      }
    });
  }


  /**
   * Seleciona o periodo do vinculo
   * @param text_vinculo
   * @param segurado
   */
  private selecionarPeriodo(text_vinculo, segurado) {
    let datas = null;
    let periodo = [];

    if (text_vinculo.search(/(\d{2}\/\d{2}\/\d{4}\s\d{2}\/\d{2}\/\d{4})/) > 0) {
      datas = text_vinculo.match(/(\d{2}\/\d{2}\/\d{4}\s\d{2}\/\d{2}\/\d{4})/)[0].trim();
      periodo = datas.split(' ');
    } else if (periodo.length == 0 && text_vinculo.search(/(\d{2}\/\d{2}\/\d{4}\s\d{2}\/\d{4})/) > 0) {
      datas = text_vinculo.match(/(\d{2}\/\d{2}\/\d{4})/)[0].trim();
      periodo = datas.split(' ');
    } else if (periodo.length == 0 && text_vinculo.search(/(\w\s\d{2}\/\d{2}\/\d{4}\s\w)/) > 0) {
      datas = text_vinculo.match(/(\s\d{2}\/\d{2}\/\d{4}\s)/)[0].trim();
      periodo = datas.split(' ');
    }

    return periodo;
  }

  private checkFormatoMoedaSC(text_vinculo) {

    if (this.isExits(text_vinculo)) {

      this.moedaImportAmerika = (/(\d{0,3}\,?\d{0,3}\,?\d{0,3}\.\d{2})($|\s|\n|\t|\r)/gi).test(text_vinculo);

      if (this.moedaImportAmerika) {

        this.regexpEmpregado = /(\s|\n|\t|\r)((\d{2}\/\d{4})(\s)(\d{0,3}\,?\d{0,3}\,?\d{0,3}\.\d{2}))(?!\s\d{2}\/\d{2}\/\d{4})/g;
        this.regexpFacultativoTextArea = /(\s|\t|\n)(\d{2}\/\d{4})(\s)(\d{1,3}\,?\d{1,3}\,?\d{0,3}\.\d{2})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\,?\d{1,3}\,?\d{0,3}\.\d{2})|(\s|\n|\t)(\d{2}\/\d{4})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\,?\d{1,3}\,?\d{0,3}\.\d{2})(\s)(\d{1,3}\,?\d{1,3}\,?\d{0,3}\.\d{2})/g;
        this.regexpFacultativoPdf = /(\s|\t|\n)(\d{2}\/\d{4})(\s)(\d{1,3}\,?\d{1,3}\,?\d{0,3}\.\d{2})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\,?\d{1,3}\,?\d{0,3}\.\d{2})|(\s|\n|\t)(\d{2}\/\d{4})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\,?\d{1,3}\,?\d{0,3}\.\d{2})/g;

      }

    }

    return this.moedaImportAmerika;

  }



  /**
   * Selecionar as contribui????es do texto completo do vinculo
   * @param text_vinculo
   * @param segurado
   */
  private selecionarContribuicoes(text_vinculo, segurado) {

    let contribuicoes = null;

    this.checkFormatoMoedaSC(text_vinculo);

    if ((text_vinculo.search(/(\s|\n|\t|\r)((\d{2}\/\d{4})(\s)(\d{0,3}\.?\d{0,3}\.?\d{0,3}\,\d{2}))(?!\s\d{2}\/\d{2}\/\d{4})/g) > 0)
    ||  (text_vinculo.search(this.regexpEmpregado) > 0)
      && (text_vinculo.search(/(\s)(Empregado|Benef??cio)(\s)/) > 0 || text_vinculo.search(/(\s)(EMPREGADO DOM??STICO)(\s)/) < 0)) {
      // contribuicoes = text_vinculo.match(/(\s|\n|\t|\r)((\d{2}\/\d{4})(\s)(\d{0,3}\.?\d{0,3}\.?\d{0,3}\,\d{2}))(?!\s\d{2}\/\d{2}\/\d{4})/g);
      contribuicoes = text_vinculo.match(this.regexpEmpregado);
    }
    if ((text_vinculo.search(/(\s|\t|\n)(\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})|(\s|\n|\t)(\d{2}\/\d{4})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})/g) > 0)
     || (text_vinculo.search(this.regexpFacultativoPdf) > 0)
      && text_vinculo.search(/(Individual|Facultativo)|(Empres??rio \/ Empregador)|(Aut??nomo)|(CONTRIBUINTE INDIVIDUAL)|(EMPREGADO DOM??STICO)/) > 0) {
      // contribuicoes = text_vinculo.match(/(\s|\t|\n)(\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})|(\s|\n|\t)(\d{2}\/\d{4})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})/g);
      contribuicoes = text_vinculo.match(this.regexpFacultativoPdf);
    }

    if ((!contribuicoes &&
      text_vinculo.search(/(\s|\n|\t|\r)((\d{2}\/\d{4})(\s)(\d{0,3}\.?\d{0,3}\.?\d{0,3}\,\d{2}))(?!\s\d{2}\/\d{2}\/\d{4})/g) > 0)) {
      // contribuicoes = text_vinculo.match(/(\s|\n|\t|\r)((\d{2}\/\d{4})(\s)(\d{0,3}\.?\d{0,3}\.?\d{0,3}\,\d{2}))(?!\s\d{2}\/\d{2}\/\d{4})/g);
      contribuicoes = text_vinculo.match(this.regexpEmpregado);
    }

    return contribuicoes;
  }


  /**
   * Montar o objeto do vinculo
   * @param text_vinculo vinculo em string
   * @param segurado obj segurado
   */
  private selecionarDadosDoVinculo(text_vinculo, segurado, index) {

    const vinculo = {
      cnpj: null,
      nitEmpregador: null,
      origemVinculo: null,
      tipoVinculo: null,
      indicador: null,
      periodo: null,
      contribuicoes: null,
      index: null,
      sc_mm_ajustar: null,
      sc_mm_considerar_tempo: null,
      sc_mm_considerar_carencia: null,
    }

    vinculo.cnpj = this.selecionarDadosCNPJ(text_vinculo);
    vinculo.tipoVinculo = this.selecionarTipoVinculo(text_vinculo);
    vinculo.indicador = this.selecionarIndicadores(text_vinculo);
    vinculo.origemVinculo = this.selecionarOrigem(text_vinculo, segurado);
    vinculo.nitEmpregador = this.selecionarDadosNIT(text_vinculo, segurado);
    vinculo.periodo = this.selecionarPeriodo(text_vinculo, segurado);
    vinculo.contribuicoes = this.selecionarContribuicoes(text_vinculo, segurado);
    vinculo.index = index + 1;

    return vinculo;
  }


  /**
   * Criar objetos das contribui????o e competencia em string
   * @param text contribui????es em array
   * @param num_col coluna com valor de s??lario de contribui????o
   */
  private creatArrayContribuicoes(contribuicoes, num_col) {

    const arrayOrganizadoNew = [];
    let arrayText = [];

    if (contribuicoes && contribuicoes != null) {

      for (let i = 0; i < contribuicoes.length; i++) {

        contribuicoes[i] = contribuicoes[i].trim();
        arrayText = contribuicoes[i].replace(/\n/i, ' ').trim().split(/\s/i);
        num_col = (typeof arrayText[num_col] != 'undefined' &&
          arrayText[num_col].trim() != null &&
          arrayText[num_col].search(/(\d{2}\/\d{2}\/\d{4})|(\d{2}\/\d{4})/) > 0) ? num_col : arrayText.length - 1;

        const converterValorAmerikaToBR = (valorString) => {

          valorString = valorString.trim();

          if (!this.moedaImportAmerika) {
            return valorString;
          }

          return (parseFloat(valorString.replace(/\,/g, ''))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        }

        arrayOrganizadoNew.push({
          cp: arrayText[0].trim(),
          sc: converterValorAmerikaToBR(arrayText[num_col]),
          msc: 0,
        });

      }
    }

    return arrayOrganizadoNew;
  }

  /**
   * aplicar a regra que define qual valor deve ser considerado como contribui????o no array de contribui????es
   * @param vinculos obj vinculo todas as informa????es
   */
  private splitContribuicoes(vinculos) {

    vinculos.forEach(vinculo => {
      if (vinculo.tipoVinculo === 'Empregado') { // 'Empregado'
        vinculo.contribuicoes = this.creatArrayContribuicoes(vinculo.contribuicoes, 1);
      } else {
        vinculo.contribuicoes = this.creatArrayContribuicoes(vinculo.contribuicoes, 2);
      }
    });

    return vinculos;

  }


  private selecionarDadosDosVinculos(seq, segurado) {
    let vinculos = [];

    seq.forEach((text_vinculo, index) => {
      const vinculo_seq = this.selecionarDadosDoVinculo(text_vinculo, segurado, index);
      vinculos.push(vinculo_seq);
    });

    vinculos = this.splitContribuicoes(vinculos);

    function filterPeriodos(vinculo) {
      let textOrigem = (/(\/CPF\/NB Origem do V??nculo Data In??cio Data Fim Ult\. Remun\. Tipo V??nculo Indicadores O INSS poder?? rever a qualquer tempo as informa????es constantes deste extrato, conforme art\. 19, [\W|\w] 3 do Decreto 3\.048\/99\s{1,4}P??gina\s\d{2}\sde\s\d{2})/gi).test(vinculo.origemVinculo);

      return ((vinculo.contribuicoes.length > 0 || vinculo.periodo != null || vinculo.tipoVinculo != null) && (!textOrigem));
    }

    return vinculos.filter(filterPeriodos);
  }




  private getVinculos(seq, segurado) {
    return new Promise((resolve, reject) => {

      let vinculos = [];

      seq.forEach((text_vinculo, index) => {
        const vinculo_seq = this.selecionarDadosDoVinculo(text_vinculo, segurado, index);
        vinculos.push(vinculo_seq);
      });

      vinculos = this.splitContribuicoes(vinculos);

      function filterPeriodos(vinculo) {
        let textOrigem = (/(\/CPF\/NB Origem do V??nculo Data In??cio Data Fim Ult\. Remun\. Tipo V??nculo Indicadores O INSS poder?? rever a qualquer tempo as informa????es constantes deste extrato, conforme art\. 19, [\W|\w] 3 do Decreto 3\.048\/99\s{1,4}P??gina\s\d{2}\sde\s\d{2})/gi).test(vinculo.origemVinculo);
        return ((vinculo.contribuicoes.length > 0 || vinculo.periodo != null || vinculo.tipoVinculo != null) && (!textOrigem));
      }

      vinculos = vinculos.filter(filterPeriodos);

      if (vinculos.length > 0) {
        return resolve(vinculos);
      } else {
        reject(vinculos);
      }
    });
  }





  /**
           * Convert o texto em um array
           * @returns {void}
           */
  private newImportText(file_text) {

    // var text = $('.formTextBox').val();

    let text = file_text;

    if (text) {

      text = text.trim().replace('\n', '\t');

      // this.segurado = this.selecionarDadosDoSegurado(text);
      // this.seq = this.selectSequencias(text, this.segurado);

      //  this.vinculos = this.selecionarDadosDosVinculos(this.seq, this.segurado);

      //  this.defineinfoSegurado();
      //  this.defineinfoVinculos();

      this.getDadosDoSegurado(text).then(result => {

        this.defineinfoSegurado();
        this.toastAlert('success', 'Segurado importado', null);

        this.getSequencias(text, this.segurado).then(seq => {

          this.seq = seq;
          this.getVinculos(this.seq, this.segurado).then(vinculos => {
            this.vinculos = vinculos;
            this.defineinfoVinculos();
            this.toastAlert('success', 'Os v??nculos foram importados', null);

          }).catch((error) => {
            this.toastAlert('error', ' AS Rela????es Previdenci??rias n??o foram localizadas.', null);
          });

        }).catch((error) => {
          this.toastAlert('error', 'AS Rela????es Previdenci??rias n??o foram localizadas na sequ??ncias de dados.', null);
        });
      }).catch((error) => {
        this.toastAlert('error', 'Segurado n??o pode ser importado cod. 1', null);
      });

    } else {
      this.toastAlert('error', 'N??o foi poss??vel identificar o arquivo como CNIS - Cadastro Nacional de Informa????es Sociais', null);
    }
  }


  private defineinfoSegurado() {
    this.infoSegurado.emit(this.segurado);
  }

  private defineinfoVinculos() {
    this.infoVinculos.emit(this.vinculos);
  }




  /**
   * captura arquivo
   * @param event
   */
  public dropped(event: UploadEvent) {

    const files = event.files;

    if (files.length > 1) {
      swal('Erro', 'Arraste apenas um arquivo', 'error');
      return;
    }

    const file = event.files[0]
    if (file.fileEntry.isFile) { // ?? um arquivo?
      const fileEntry = file.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        if (file.type != 'application/pdf') {
          swal('Erro', 'Formato de arquivo inv??lido', 'error');
        } else {
          this.processPdfFile(file);
        }
      });
    } else {
      // ?? um diret??rio
      swal('Erro', 'N??o ?? permitido arrastar um diret??rio', 'error');
    }
  }

  /**
   * click evento dropzone
   */
  clickedDropzone() {
    const event = new MouseEvent('click', { bubbles: false });
    this.fileInput.nativeElement.dispatchEvent(event);
  }

  // public fileOver(event) {
  //   console.log(event);
  // }

  // public fileLeave(event) {
  //   console.log(event);
  // }

  /**
   * Altera????o no input file
   * @param event 
   */
  onFileInputChange(event) {
    let files = event.srcElement.files;
    if (files.length > 1) {
      swal('Erro', 'Selecione apenas um arquivo', 'error');
    } else if (files[0].type != 'application/pdf') {
      swal('Erro', 'Formato de arquivo inv??lido', 'error');
    } else {
      this.processPdfFile(files[0]);
    }
  }


  /**
   * Capturar text usando pdfjs
   * @param pageNum 
   * @param PDFDocumentInstance 
   */
  getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise((resolve, reject) => {
      PDFDocumentInstance.getPage(pageNum).then(pdfPage => {
        // The main trick to obtain the text of the PDF page, use the getTextContent method
        pdfPage.getTextContent().then(textContent => {
          let textItems = textContent.items;
          let finalString = '';
          // Concatenate the string of the item to the final string
          for (let i = 0; i < textItems.length; i++) {
            let item = textItems[i];
            finalString += item.str + ' ';
          }
          // Solve promise with the text retrieven from the page
          resolve(finalString);
        });
      });
    });
  }

  /**
   * Seleciona as paginas do arquivo e requisita o metodo de captura do texto
   * @param file 
   */
  processPdfFile(file) {

    const PDFJS = require('pdfjs-dist');
    // PDFJS.GlobalWorkerOptions.workerSrc = './../../../../../../node_modules/pdfjs-dist/build/pdf.worker.js';
    PDFJS.GlobalWorkerOptions.workerSrc = './assets/js/pdfjs/pdf.worker.min.js';
    PDFJS.getDocument(window.URL.createObjectURL(file)).then(pdf => {
      const pdfDocument = pdf;
      // Create an array that will contain our promises
      const pagesPromises = [];
      for (let i = 0; i < pdf.pdfInfo.numPages; i++) {
        // Required to prevent that i is always the total of pages
        (pageNumber => {
          // Store the promise of getPageText that returns the text of a page
          pagesPromises.push(this.getPageText(pageNumber, pdfDocument));
        })(i + 1);
      }
      // Execute all the promises
      Promise.all(pagesPromises).then(pagesText => {
        this.newImportText(pagesText.join(' '));
      });
    });
  }


  /**
   * Seleciona o campo origem da sequ??ncia (seq.)
   * @param text_vinculo 
   * @param segurado 
   */
  private selecionarOrigem(text_vinculo, segurado) {

    let origemVinculo = null;
    let inicio_string = null;
    let fim_string = null;

    if (text_vinculo.search(/(Benef??cio)|(Empres??rio \/ Empregador)|(Contribuinte\sIndividual)|(Aut??nomo)|(Contribuinte)|(EMPREGADO\sDOM??STICO)|(\d)(\s|\D|\W)(N??O\sCADASTRADO)|(RECOLHIMENTO)/) < 0) {
      if (text_vinculo.search(/(\d)(\s|\D|\W)(Indeterminado)/) > 0) {
        inicio_string = text_vinculo.search(/(\d)(\s|\D|\W)(Indeterminado)/) + 15;
        fim_string = text_vinculo.search(/(Empregado|Individual|Facultativo)(\s|\D|\W)(\d{2}\/\d{2}\/\d{4})/);
      } else if (segurado.type == 1) {
        inicio_string = text_vinculo.search(/(\s|\D|\W)(\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})/) + 20;
        fim_string = text_vinculo.search(/(Empregado|Individual|Facultativo)(\s|\D|\W)(\d{2}\/\d{2}\/\d{4})/);
      } else if (segurado.type == 2) {
        inicio_string = text_vinculo.search(/(\s|\D|\W)(\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})/) + 20;
        fim_string = text_vinculo.search(/(\s|\D|\W)(\d{2}\/\d{2}\/\d{4})(\s|\D|\W)(\d{0,2})/);
      }

      origemVinculo = text_vinculo.substring(inicio_string, fim_string).trim();

    } else if (text_vinculo.search(/(RECOLHIMENTO)/) > 0) {

      origemVinculo = 'Recolhimento';

    } else if (text_vinculo.search(/(Contribuinte\sIndividual|CONTRIBUINTE\sINDIVIDUAL)/) > 0) {

      origemVinculo = 'Contribuinte Individual';

    } else if (text_vinculo.search(/(Aut??nomo)/) > 0) {

      origemVinculo = 'Aut??nomo';

    } else if (text_vinculo.search(/(Contribuinte)/) > 0) {

      origemVinculo = 'Contribuinte';

    } else if (text_vinculo.search(/(Empres??rio \/ Empregador)/) > 0) {

      origemVinculo = 'Empres??rio\/Empregador';

    } else if (text_vinculo.search(/(Benef??cio)/) > 0) {

      origemVinculo = 'Benef??cio';

    } else if (text_vinculo.search(/(EMPREGADO\sDOM??STICO)/) > 0) {

      origemVinculo = 'EMPREGADO DOM??STICO';

    } else if (text_vinculo.search(/(N??O\sCADASTRADO)/) > 0) {

      origemVinculo = 'N??O CADASTRADO';

    }

    return (origemVinculo.length > 3) ? origemVinculo : null;
  }


  /**
   * captura o CNPJ dento da seq.
   * @param text_vinculo 
   */
  private selecionarDadosCNPJ(text_vinculo) {
    return (text_vinculo.search(/(\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})/) > 0) ?
      text_vinculo.match(/(\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})/)[0].trim() : null;
  }


  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '')
      ? true : false;
  }

  /**
   * captura o NIT dentro da seq.
   * @param text_vinculo // texto referente ao vinculo
   * @param segurado // obj segurado
   */
  private selecionarDadosNIT(text_vinculo, segurado) {
    if (text_vinculo.search(/(\d{3}.\d{5}.\d{2}-\d{1})/) > 0) {
      return text_vinculo.match(/(\d{3}.\d{5}.\d{2}-\d{1})/)[0].trim()
    } else if (text_vinculo.search(/(\d{1}.\d{3}.\d{3}.\d{3}-\d{1})/) > 0) {
      return text_vinculo.match(/(\d{1}.\d{3}.\d{3}.\d{3}-\d{1})/)[0].trim()
    } else {
      return;
    }

  }

  /**
   * captura o tipo de vinculo do segurado
   * @param text_vinculo // texto referente ao vinculo
   */
  private selecionarTipoVinculo(text_vinculo) {

    if ((text_vinculo.search('Empres??rio / Empregador') > 0)) {
      return 'Empres??rio / Empregador';
    }

    if ((text_vinculo.search('Individual') > 0)) {
      return 'Individual';
    }

    if ((text_vinculo.search('Facultativo') > 0)) {
      return 'Facultativo';
    }

    if ((text_vinculo.search('Benef??cio') > 0)) {
      return 'Benef??cio';
    }

    if ((text_vinculo.search('Empregado') > 0)) {
      return 'Empregado';
    }

    if ((text_vinculo.search('Aut??nomo') > 0)) {
      return 'Aut??nomo';
    }

    if ((text_vinculo.search('Contribuinte') > 0)) {
      return 'Contribuinte';
    }


    return null;
  }


  /**
   * captura os indicadores da seq.
   * @param text_vinculo // texto referente ao vinculo
   */
  private selecionarIndicadores(text_vinculo) {

    const indicadores = []

    if ((text_vinculo.search('ACNISVR') > 0)) {
      indicadores.push({
        'indicador': 'ACNISVR',
        'desc': 'Acerto realizado pelo INSS'
      });
    } if ((text_vinculo.search('AEXT-VI') > 0)) {
      indicadores.push({
        'indicador': 'AEXT-VI',
        'desc': 'Acerto de v??nculo extempor??neo indeferido'
      });
    }
    if ((text_vinculo.search('AEXT_VT') > 0)) {
      indicadores.push({
        'indicador': 'AEXT_VT',
        'desc': 'V??nculo extempor??neo confirmado pelo INSS'
      });
    }
    if ((text_vinculo.search('AVRC-DEF') > 0)) {
      indicadores.push({
        'indicador': 'AEXT_VT',
        'desc': 'Acerto de v??nculo extempor??neo deferido'
      });
    }

    if ((text_vinculo.search('IEAN (15)') > 0)) {
      indicadores.push({
        'indicador': 'IEAN (15)',
        'desc': 'indica per??odo de exposi????o a agentes insalubres do grupo de 15 anos'
      });
    }

    if ((text_vinculo.search('IEAN (20)') > 0)) {
      indicadores.push({
        'indicador': 'IEAN (20)',
        'desc': 'indica per??odo de exposi????o a agentes insalubres do grupo de 20 anos'
      });
    }

    if ((text_vinculo.search('IEAN (25)') > 0)) {
      indicadores.push({
        'indicador': 'IEAN (25)',
        'desc': 'indica per??odo de exposi????o a agentes insalubres do grupo de 25 anos'
      });
    }
    if ((text_vinculo.search('IGFIP-INF') > 0)) {
      indicadores.push({
        'indicador': 'IGFIP-INF',
        'desc': 'Indicador de GFIP meramente informativa'
      });
    }
    if ((text_vinculo.search('ILEI123') > 0)) {
      indicadores.push({
        'indicador': 'ILEI123',
        'desc': 'Contribui????o da compet??ncia foi recolhida com c??digo da Lei Complementar 123/2006'
      });
    }

    if ((text_vinculo.search('IMEI') > 0)) {
      indicadores.push({
        'indicador': 'IMEI',
        'desc': 'Contribui????o da compet??ncia foi recolhida com c??digo MEI'
      });
    }
    if ((text_vinculo.search('IREC-CIRURAL') > 0)) {
      indicadores.push({
        'indicador': 'IREC-CIRURAL',
        'desc': 'Recolhimento com c??digo de CI Rural sem homologa????o'
      });
    }

    if ((text_vinculo.search('IREC-FBR') > 0)) {
      indicadores.push({
        'indicador': 'IREC-FBR',
        'desc': 'Recolhimento facultativo baixa renda'
      });
    }

    if ((text_vinculo.search('IREC-INDPEND') > 0)) {
      indicadores.push({
        'indicador': 'IREC-INDPEND',
        'desc': 'Recolhimentos com indicadores e/ou pend??ncias'
      });
    }

    if ((text_vinculo.search('IREC-LC123') > 0)) {
      indicadores.push({
        'indicador': 'IREC-LC123',
        'desc': 'Recolhimentos para fins da LC 123'
      });
    }

    if ((text_vinculo.search('IREC-LC123-SUP') > 0)) {
      indicadores.push({
        'indicador': 'IREC-LC123-SUP',
        'desc': 'Recolhimento / Complementa????o LC 123 superior ao sal??rio m??nimo'
      });
    }

    if ((text_vinculo.search('PADM-EMPR') > 0)) {
      indicadores.push({
        'indicador': 'PADM-EMPR',
        'desc': 'Inconsist??ncia temporal, admiss??o anterior ao in??cio da atividade do empregador'
      });
    }

    if ((text_vinculo.search('PEMP-CAD') > 0)) {
      indicadores.push({
        'indicador': 'PEMP-CAD',
        'desc': 'Falta de informa????es cadastrais do CNPJ ou CEI'
      });
    }

    if ((text_vinculo.search('PEXT') > 0)) {
      indicadores.push({
        'indicador': 'PEXT',
        'desc': 'Pend??ncia de v??nculo extempor??neo n??o tratado'
      });
    }

    if ((text_vinculo.search('PREC-COD1821') > 0)) {
      indicadores.push({
        'indicador': 'PREC-COD1821',
        'desc': 'Recolhimento com c??digo de pagamento 1821 ??? Mandato Eletivo'
      });
    }
    if ((text_vinculo.search('PREC-CSE') > 0)) {
      indicadores.push({
        'indicador': 'PREC-CSE',
        'desc': 'Recolhimento GPS de Segurado Especial Pendente Comprova????o'
      });
    }

    if ((text_vinculo.search('PREC-FBR') > 0)) {
      indicadores.push({
        'indicador': 'PREC-FBR',
        'desc': 'Recolhimento facultativo baixa renda n??o validado / homologado'
      });
    }

    if ((text_vinculo.search('PREC-FBR-ANT') > 0)) {
      indicadores.push({
        'indicador': 'PREC-FBR-ANT',
        'desc': 'Recolhimento facultativo baixa renda anterior a comp. 09/2011'
      });
    }

    if ((text_vinculo.search('PREC-LC123-ANT') > 0)) {
      indicadores.push({
        'indicador': 'PREC-LC123-ANT',
        'desc': 'Recolhimento com c??digo da LC 123 anterior ?? compet??ncia 04/2007'
      });
    }

    if ((text_vinculo.search('PREC-MENOR-MIN') > 0)) {
      indicadores.push({
        'indicador': 'PREC-MENOR-MIN',
        'desc': 'Recolhimento realizado ?? inferior ao valor m??nimo'
      });
    }
    if ((text_vinculo.search('PREC-PMIG-DOM') > 0)) {
      indicadores.push({
        'indicador': 'PREC-PMIG-DOM',
        'desc': 'Recolhimento inclusive sal.mat., e/ou per??odo declarado empregado dom??stico sem registro de v??nculo'
      });
    }

    if ((text_vinculo.search('PRECFACULTCONC') > 0)) {
      indicadores.push({
        'indicador': 'PRECFACULTCONC',
        'desc': 'Recolhimento ou per??odo atividade de contribuinte facultativo concomitante com outro TFV'
      });
    }

    if ((text_vinculo.search('PREM-EMPR') > 0)) {
      indicadores.push({
        'indicador': 'PREM-EMPR',
        'desc': 'Remunera????o antes do in??cio da atividade do empregador'
      });
    }

    if ((text_vinculo.search('PREM-EXT') > 0)) {
      indicadores.push({
        'indicador': 'PREM-EXT',
        'desc': ' Remunera????o da compet??ncia ?? extempor??nea'
      });
    }

    if ((text_vinculo.search('PREM-FVIN') > 0)) {
      indicadores.push({
        'indicador': 'PREM-FVIN',
        'desc': 'Remunera????es posteriores ao fim do v??nculo de trabalho'
      });
    }

    if ((text_vinculo.search('PREM-RET') > 0)) {
      indicadores.push({
        'indicador': 'PREM-RET',
        'desc': `Remunera????o de prestador de servi??o declarada em GFIP mas que n??o ?? 
          considerada para previd??ncia por ser anterior a 04/2003 ou n??o possui a declara????o 
          do campo ???valor retido??? se posterior a esse per??odo`
      });
    }

    if ((text_vinculo.search('PVIN-IRREG') > 0)) {
      indicadores.push({
        'indicador': 'PVIN-IRREG',
        'desc': 'Pend??ncia de V??nculo Irregular'
      });
    }

    if ((text_vinculo.search('PREM-FVIN') > 0)) {
      indicadores.push({
        'indicador': 'PREM-FVIN',
        'desc': ' Remunera????o ap??s o fim do v??nculo'
      });

    } if ((text_vinculo.search('PRPPS') > 0)) {
      indicadores.push({
        'indicador': 'PRPPS',
        'desc': 'V??nculo de empregado com informa????es de Regime Pr??prio (Servidor P??blico)'
      });
    }

    if ((text_vinculo.search('AVRC-DEF') > 0)) {
      indicadores.push({
        'indicador': 'AVRC-DEF',
        'desc': 'Acerto confirmado pelo INSS'
      });
    }

    if ((text_vinculo.search('PREC-MENOR-MIN') > 0)) {
      indicadores.push({
        'indicador': 'PREC-MENOR-MIN',
        'desc': 'Recolhimento abaixo do valor m??nimo'
      });
    }

    if ((text_vinculo.search('PREM-EXT') > 0)) {
      indicadores.push({
        'indicador': 'PREM-EXT',
        'desc': 'Remunera????o informada fora do prazo, pass??vel de comprova????o'
      });
    }

    if ((text_vinculo.search('GFIP') > 0)) {
      indicadores.push({
        'indicador': 'GFIP',
        'desc': 'Indica que a remunera????o da compet??ncia foi declarada em GFIP'
      });
    }

    if ((text_vinculo.search('IRECOL') > 0)) {
      indicadores.push({
        'indicador': 'IRECOL',
        'desc': 'Indica que a contribui????o da compet??ncia ?? recolhimento'
      });
    }

    return indicadores;

  }


  toastAlert(type, title, position) {

    position = (!position) ? 'top-end' : position;

    swal({
      position: position,
      type: type,
      title: title,
      showConfirmButton: false,
      timer: 1500
    });

  }


}



export interface FileSystemFileEntry {
  isDirectory: false
  isFile: true
  file(callback: (file: File) => void): void
  name: string
}
