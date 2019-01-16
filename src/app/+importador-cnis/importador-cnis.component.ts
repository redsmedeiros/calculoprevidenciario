import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-importador-cnis',
  templateUrl: './importador-cnis.component.html',
  styleUrls: ['./importador-cnis.component.css']
})
export class ImportadorCnisComponent implements OnInit {

  public isUpdatingSegurado = true;
  public isUpdatingVinculos = true;
  public segurado: any;
  public vinculos: any;
  public isUploadReaderComplete = false;


  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  reciverInfoSegurado(importSegurado) {
    this.segurado = importSegurado;
    this.isUpdatingSegurado = false;
    console.log(this.segurado);
    this.ref.detectChanges();
  }

  reciverInfoVinculos(importVinculos) {
    this.vinculos = importVinculos;
    this.isUpdatingVinculos = false;
    this.isUploadReaderComplete = true;
    console.log(this.vinculos);
    this.ref.detectChanges();
  }



}


