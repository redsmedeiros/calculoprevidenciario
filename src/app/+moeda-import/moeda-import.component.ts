import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FadeInTop } from "../shared/animations/fade-in-top.decorator";
import { PapaParseService } from 'ngx-papaparse';
import { MoedaService } from '../services/Moeda.service';
import { Moeda } from '../services/Moeda.model';
import * as moment from 'moment';
//import swal from 'sweetalert';
import swal from 'sweetalert2'
import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { AdminLoginComponent } from "../shared/user/admin-login/admin-login.component";

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './moeda-import.component.html',
  providers: [AdminLoginComponent]
})

export class MoedaImportComponent implements OnInit {
  @ViewChild('csvFileInput') fileInput:ElementRef;
  @ViewChild(AdminLoginComponent) adminComponent;

  private files: UploadFile[] = [];
  private cnisTextArea;
  private isAuth:boolean ;
  
  constructor(private csvParse: PapaParseService,
              private MoedaService: MoedaService) {

  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.isAuth = this.adminComponent.isAuth
  }

  parseCsv(file){
  	let options = {
  		header: true, 
  		complete: (results) => { this.saveValues(results) },
      error: (error) => { this.processoAbortado(error) },
			dynamicTyping:true,
      skipEmptyLines: true,
      beforeFirstChunk: function(chunk) {
                    var rows = chunk.split( /\r\n|\r|\n/ );
                    var headings = rows[0].toLowerCase();
                    rows[0] = headings;
                    return rows.join("\r\n");
                },
		};
		this.csvParse.parse(file, options);
  }

  saveValues(data){
  	let values = data.data;
    if(values.length == 0){
      swal('Erro', 'Verifique o arquivo', 'error');
      return;
    }
  	if(data.meta.fields.length != 14){
      console.log(data.meta.fields)
  		swal('Erro', 'Número incorreto de colunas. O correto são 13 colunas e o encontrado foram ' + data.meta.fields.length, 'error');
  	}else{
  	  console.log(data)
  	  swal({
  	    type: 'info',
  	    title: 'Aguarde por favor...',
  	   });
  	  swal.showLoading();
  	  this.MoedaService.save(values).then(() => {
  	    swal.close();
        swal({
          type: 'success',
          title: 'Importação concluída com sucesso!',
        });
  	  }).catch(err =>{
  	    swal.close();
  	    console.log(err);
  	    swal('Erro', 'Um erro ocorreu. Tente novamente mais tarde!', 'error');
  	  });
  	}
  }

  processoAbortado(error){
    swal('Um erro ocorreu', error, 'error');
    console.log(error)
  }

  //Arquivo é solto na área de transferência
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
        this.parseCsv(file);
      });
    } else {
      //É um diretório
      swal('Erro', 'Não é permitido arrastar um diretório', 'error');
    }
  }

  //Arquivo selecionado atraves do file dialog
  onFileInputChange(event){
    let files = event.srcElement.files;
    if(files.length > 1){
      swal('Erro', 'Selecione apenas um arquivo', 'error');
    }else{
      console.log(files[0]);
      this.parseCsv(files[0]); 
    }
  }

  getDifferenceInMonths(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.floor(difference);
  }

  //Zona de arquivo clicada
  clickedDropzone(){
    let event = new MouseEvent('click', {bubbles: false});
    this.fileInput.nativeElement.dispatchEvent(event);
  }

}

export interface FileSystemFileEntry {
  isDirectory: false
  isFile: true
  file(callback: (file: File) => void): void
  name: string
}
