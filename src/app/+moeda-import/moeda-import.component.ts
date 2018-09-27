import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FadeInTop } from "../shared/animations/fade-in-top.decorator";
import * as moment from 'moment';
//import swal from 'sweetalert';
import swal from 'sweetalert2'

import { UploadEvent, UploadFile } from 'ngx-file-drop';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './moeda-import.component.html',
  providers: []
})

export class MoedaImportComponent implements OnInit {
  @ViewChild('csvFileInput') fileInput:ElementRef;

  private files: UploadFile[] = [];
  private cnisTextArea;
  
  constructor() {}

  ngOnInit() {}

  dropped(event: UploadEvent) {
    let files = event.files;
    if(files.length > 1){
      swal('Erro', 'Arraste apenas um arquivo', 'error');
      return;
    }
    let file = event.files[0]
    if (file.fileEntry.isFile) { //É um arquivo?
      const fileEntry = file.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
      	console.log(file)
        if(file.type != 'text/csv'){
          swal('Erro', 'Formato de arquivo inválido', 'error');
        }else{
          console.log(file)
        }       
      });
    } else {
      //É um diretório
      swal('Erro', 'Não é permitido arrastar um diretório', 'error');
    }
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
      console.log(files[0]); 
    }
  }

}

export interface FileSystemFileEntry {
  isDirectory: false
  isFile: true
  file(callback: (file: File) => void): void
  name: string
}
