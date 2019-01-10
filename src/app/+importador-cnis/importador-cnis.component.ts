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

  public isUpdating = true;
  public segurado: any;
  public vinculos: any;


  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  reciverInfoSegurado(importSegurado) {
    this.segurado = importSegurado;
    this.isUpdating = false;
    console.log(this.segurado);
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  reciverInfoVinculos(importVinculos) {
    this.vinculos = importVinculos;
    this.isUpdating = false;
    console.log(this.vinculos);
    this.ref.markForCheck();
    this.ref.detectChanges();
    
  }



}


