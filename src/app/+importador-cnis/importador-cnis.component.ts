
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../shared/animations/fade-in-top.decorator';
import swal from 'sweetalert2'
import { ErrorService } from '../../../services/error.service';

import { ImportadorCnisSeguradosComponent } from './+importador-cnis-segurados/importador-cnis-segurados.component';
import { ImportadorCnisCalculosComponent } from './+importador-cnis-calculos/importador-cnis-calculos.component';
import { ImportadorCnisPeriodosComponent } from './+importador-cnis-periodos/importador-cnis-periodos.component';



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
  public userId

  public seguradoId;
  public calculoId;


  @ViewChild(ImportadorCnisSeguradosComponent) SeguradoComponent: ImportadorCnisSeguradosComponent;
  @ViewChild(ImportadorCnisCalculosComponent) CalculosComponent: ImportadorCnisCalculosComponent;
  @ViewChild(ImportadorCnisPeriodosComponent) PeriodosComponent: ImportadorCnisPeriodosComponent;


  constructor(private ref: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit() {
    this.ref.markForCheck();
    this.ref.detectChanges();
    this.checkUserSession();
  }


  private checkUserSession() {

    this.userId = this.route.snapshot.queryParams['user_id'];

    if (this.userId === undefined) {
      this.userId = this.route.snapshot.params['id'] || localStorage.getItem('user_id');
    }

  }

  reciverInfoSegurado(importSegurado) {

    this.segurado = importSegurado;
    this.isUpdatingSegurado = false;
    // console.log(this.segurado);
    this.ref.detectChanges();

  }

  reciverInfoVinculos(importVinculos) {

    this.vinculos = importVinculos;
    this.isUpdatingVinculos = false;
    this.isUploadReaderComplete = true;
    //  console.log(this.vinculos);
    this.ref.detectChanges();

  }


  public gravarImportacaoContagemTempo() {
    this.SeguradoComponent.createSeguradoImportador(this.userId).then(seguradoId => {
      this.CalculosComponent.createCalculoImportador(seguradoId).then(calculoId => {
        this.PeriodosComponent.createPeriodosImportador(calculoId).then(status => {
          this.realizarCalculoContagemTempo(seguradoId, calculoId);
          this.seguradoId = seguradoId;
          this.calculoId = calculoId;
        });
      });
    });

  }



  realizarCalculoContagemTempo(seguradoId, calculoId) {
    window.location.href = '/#/contagem-tempo/contagem-tempo-resultados/' +
      seguradoId + '/' + calculoId;


    // window.open(
    //   '/#/contagem-tempo/contagem-tempo-resultados/' + seguradoId + '/' + calculoId,
    //   '_blank');
  }

}


