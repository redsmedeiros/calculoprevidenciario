
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../shared/animations/fade-in-top.decorator';
import swal from 'sweetalert2'
import { ErrorService } from '../../../services/error.service';

import { ImportadorCnisSeguradosComponent } from './+importador-cnis-segurados/importador-cnis-segurados.component';
import { ImportadorCnisCalculosComponent } from './+importador-cnis-calculos/importador-cnis-calculos.component';
import { ImportadorCnisPeriodosComponent } from './+importador-cnis-periodos/importador-cnis-periodos.component';

import { Auth } from '../services/Auth/Auth.service';
import { AuthResponse } from '../services/Auth/AuthResponse.model';

@Component({
  selector: 'app-importador-cnis',
  templateUrl: './importador-cnis.component.html',
  styleUrls: ['./importador-cnis.component.css']
})
export class ImportadorCnisComponent implements OnInit, OnChanges {


  @Input() dadosPassoaPasso;

  public exibirForm = false;
  public isUpdatingSegurado = true;
  public isUpdatingVinculos = true;
  public segurado: any;
  public vinculos: any;
  public isUploadReaderComplete = false;
  public isCnisValid = false;
  public userId

  public seguradoId;
  public calculoId;

  public eventCountSeguradoErros = 0;
  public eventCountVinculosErros = 0;


  @ViewChild(ImportadorCnisSeguradosComponent) SeguradoComponent: ImportadorCnisSeguradosComponent;
  @ViewChild(ImportadorCnisCalculosComponent) CalculosComponent: ImportadorCnisCalculosComponent;
  @ViewChild(ImportadorCnisPeriodosComponent) PeriodosComponent: ImportadorCnisPeriodosComponent;


  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private Auth: Auth) { }

  ngOnInit() {
    // this.ref.markForCheck();
    // this.ref.detectChanges();
    this.checkUserSession();

    if (this.dadosPassoaPasso == undefined) {
      this.dadosPassoaPasso = {
        origem: 'contagem',
        type: 'auto'
      };
    }

    this.checkUserSession();
  }


  ngOnChanges(changes: SimpleChanges) {

    this.ref.markForCheck();
    this.ref.detectChanges();
    this.checkUserSession();
    this.setExibirForm(this.dadosPassoaPasso);

  }

  private setExibirForm(dadosPassoaPasso) {
      if (dadosPassoaPasso !== undefined
      && dadosPassoaPasso.origem === 'passo-a-passo'
      && dadosPassoaPasso.type === 'manual'
    ) {
      this.segurado = {
        nome: '',
        id_documento: '',
        numero_documento: '',
        data_nascimento: '',
        sexo: '',
        funcao: '',
        user_id: this.userId,
      };

      this.vinculos = [];
      this.isUpdatingSegurado = false;
      this.isUpdatingVinculos = false;
      this.isUploadReaderComplete = true;
      this.exibirForm = true;

    }
 
    this.segurado.user_id = this.userId;

  }


  private checkUserSession() {

    this.userId = this.route.snapshot.queryParams['user_id'];

    if (this.userId === undefined || typeof this.userId === 'undefined') {
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

  reciverCountSeguradoErros(eventCountSeguradoErros) {
    this.eventCountSeguradoErros = eventCountSeguradoErros;
   // console.log(eventCountSeguradoErros);
  }

  reciverCountVinculosErros(eventCountVinculosErros) {
    this.eventCountVinculosErros = eventCountVinculosErros;
    // console.log(eventCountVinculosErros);
  }


  public gravarImportacaoContagemTempo() {

    const erros = this.PeriodosComponent.verificarVinculos();
    const errosSegurado = this.SeguradoComponent.validate();

    console.log(this.userId);

    if (erros === 0 && errosSegurado.count === 0) {

      this.SeguradoComponent.createSeguradoImportador(this.userId).then(seguradoId => {
        this.CalculosComponent.createCalculoImportador(seguradoId).then(calculoId => {
          this.PeriodosComponent.createPeriodosImportador(calculoId).then(status => {
            this.realizarCalculoContagemTempo(seguradoId, calculoId);
            this.seguradoId = seguradoId;
            this.calculoId = calculoId;
          });
        });
      });

    } else {

      swal({
        // position: position,
        type: 'error',
        title: 'Verifique os dados antes de prosseguir.',
        showConfirmButton: false,
        timer: 1500
      });

    }

  }


  realizarCalculoContagemTempo(seguradoId, calculoId) {
    window.location.href = '/#/contagem-tempo/contagem-tempo-resultados/' +
      seguradoId + '/' + calculoId;


    // window.open(
    //   '/#/contagem-tempo/contagem-tempo-resultados/' + seguradoId + '/' + calculoId,
    //   '_blank');
  }

}


