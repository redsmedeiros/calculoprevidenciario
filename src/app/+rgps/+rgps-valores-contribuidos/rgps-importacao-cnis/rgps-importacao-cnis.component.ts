import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FadeInTop } from "../../../shared/animations/fade-in-top.decorator";
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoService } from '../../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../../+rgps-segurados/SeguradoRgps.model';
import { ErrorService } from '../../../services/error.service';
import { ValorContribuido } from '../ValorContribuido.model'
import { ValorContribuidoService } from '../ValorContribuido.service'
import * as moment from 'moment';
import swal from 'sweetalert';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-importacao-cnis.component.html',
  providers: [
    ErrorService
  ]
})


export class RgpsImportacaoCnisComponent implements OnInit {
  @ViewChild('cnisFileInput') fileInput:ElementRef;

  public isUpdating = false;
  public idSegurado = '';
  public idCalculo = '';
  public segurado: any = {};


  //Variaveis para importação do CNIS
  private files: UploadFile[] = [];
  private cnisTextArea;
  private regexpEmpregado = /(\s|\n|\t|\r)((\d{2}\/\d{4})(\s)(\d{0,3}\.?\d{0,3}\.?\d{0,3}\,\d{2}))(?!\s\d{2}\/\d{2}\/\d{4})/g;
  private regexpFacultativo = /(\s|\t|\n)(\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})|(\s|\n|\t)(\d{2}\/\d{4})(\s|\n|\t)(\d{2}\/\d{2}\/\d{4})(\s)(\d{1,3}\.?\d{1,3}\.?\d{0,3}\,\d{2})/g;

  constructor(protected router: Router,
    private route: ActivatedRoute,
    protected Segurado: SeguradoService,
    protected errors: ErrorService,
    protected ValorContribuidoService: ValorContribuidoService) {
  }

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    //this.idCalculo = this.route.snapshot.params['id'];
    this.idCalculo = this.route.snapshot.params['id'];
    this.isUpdating = true;
    this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.segurado = segurado;
        this.isUpdating = false;
      });
  }

  editSegurado() {
    window.location.href = '/#/rgps/rgps-segurados/' +
      this.route.snapshot.params['id_segurado'] + '/editar';
  }

  public dropped(event: UploadEvent) {
    let files = event.files;
    if(files.length > 1){
      swal('Erro', 'Arraste apenas um arquivo', 'error');
      return;
    }
    let file = event.files[0]
    if (file.fileEntry.isFile) { //É um arquivo?
      const fileEntry = file.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        if(file.type != 'application/pdf'){
          swal('Erro', 'Formato de arquivo inválido', 'error');
        }else{
          this.processPdfFile(file)
        }       
      });
    } else {
      //É um diretório
      swal('Erro', 'Não é permitido arrastar um diretório', 'error');
    }
  }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }

  clickedDropzone(){
    let event = new MouseEvent('click', {bubbles: false});
    this.fileInput.nativeElement.dispatchEvent(event);
  }

  onFileInputChange(event){
    let files = event.srcElement.files;
    if(files.length > 1){
      swal('Erro', 'Selecione apenas um arquivo', 'error');
    }else if(files[0].type != 'application/pdf'){
      swal('Erro', 'Formato de arquivo inválido', 'error');
    }else{
      this.processPdfFile(files[0]); 
    }
  }

  processPdfFile(file){
    let reader = new FileReader();
    reader.onload = (e) => {
      console.log(reader.result)
    }
    reader.readAsText(file)
  }

  importFromTextArea(){
    let tipoImportacao = true;
    let text = this.cnisTextArea.trim();
    text = text.replace('\n', '\t');

    let empregado = null;
    let facultativoOuIndividual = null;

    let empregado_array = [];
    let facultativoOuIndividual_array = [];
    let todas_os_periodos_array = [];
    let regras_aplicadas_array = [];

    empregado = text.match(this.regexpEmpregado)
    facultativoOuIndividual = text.match(this.regexpFacultativo);

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
    console.log(regras_aplicadas_array);
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
      for (let i = 0; i < 4; i++) {
        valor = valor.replace('.', '');
      }
      return parseFloat(valor.replace(',', '.'));
    };

    let somaContrib = function (valor1, valor2) {
      return Number((replacePontos(valor1) + replacePontos(valor2)).toFixed(2)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    // function dateFormat(date) {
    //   let parts = date.split("/");
    //   return new Date(parts[1], parts[0], '01');
    // }

    arrayOrganizado.sort(function (a, b) {
      let dateA = moment(a.data, 'MM/YYYY');
      let dateB = moment(b.data, 'MM/YYYY');
      if(dateA > dateB){
        return 1;
      }
      if(dateA < dateB){
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

    //reduzir o array somando item onde value.data+"-"+value.contributionType são iguais
    let result = [];
    arrayOrganizado.reduce(function (res, value) {
      if (!res[value.data + "-" + value.contributionType]) {
        res[value.data + "-" + value.contributionType] = {
            contrib: "0,00",
            data: value.data,
            contributionType: value.contributionType
        };
        result.push(res[value.data + "-" + value.contributionType])
      }
      res[value.data + "-" + value.contributionType].contrib = somaContrib(res[value.data + "-" + value.contributionType].contrib, value.contrib);
      return res;
    }, {});

    return result;
  }

}

export interface FileSystemFileEntry {
  isDirectory: false
  isFile: true
  file(callback: (file: File) => void): void
  name: string
}
