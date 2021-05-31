
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
  public calculosSelecionado = {};


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

  }

  ngOnChanges(changes: SimpleChanges) {

    this.checkUserSession();

    this.ref.markForCheck();
    this.ref.detectChanges();
    this.setExibirForm(this.dadosPassoaPasso);

  }

  private setExibirForm(dadosPassoaPasso) {

    this.segurado = {
      nome: '',
      id_documento: '',
      numero_documento: '',
      data_nascimento: '',
      sexo: '',
      funcao: '',
      user_id: this.userId,
    };

    if (dadosPassoaPasso !== undefined
      && dadosPassoaPasso.origem === 'passo-a-passo'
      && dadosPassoaPasso.type === 'manual'
    ) {

      this.vinculos = [];
      this.isUpdatingSegurado = false;
      this.isUpdatingVinculos = false;
      this.isUploadReaderComplete = true;
      this.exibirForm = true;

    } else if (dadosPassoaPasso !== undefined
      && dadosPassoaPasso.origem === 'passo-a-passo'
      && dadosPassoaPasso.type === 'seguradoExistente'
    ) {

      this.vinculos = [];

      this.setDadosSeguradoSelecionado();
      this.setDadosCalculoSelecionado();
      this.setDadosPeriodosSelecionados();

      this.isUpdatingSegurado = false;
      this.isUpdatingVinculos = false;
      this.isUploadReaderComplete = true;
      this.exibirForm = true;

    }

    // this.segurado.user_id = this.userId;

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
    this.ref.detectChanges();

  }

  reciverInfoVinculos(importVinculos) {

    this.vinculos = importVinculos;
    this.isUpdatingVinculos = false;
    this.isUploadReaderComplete = true;
    this.ref.detectChanges();

  }

  reciverCountSeguradoErros(eventCountSeguradoErros) {
    this.eventCountSeguradoErros = eventCountSeguradoErros;
  }

  reciverCountVinculosErros(eventCountVinculosErros) {
    this.eventCountVinculosErros = eventCountVinculosErros;
  }


  public gravarImportacaoContagemTempo() {

    const errosSegurado = this.SeguradoComponent.validate();
    const erros = this.PeriodosComponent.verificarVinculos();

    if (erros === 0 && errosSegurado.count === 0) {

      if (this.dadosPassoaPasso !== undefined
        && this.dadosPassoaPasso.origem === 'passo-a-passo'
        && this.dadosPassoaPasso.type === 'seguradoExistente'
      ) {

        swal({
          // position: position,
          type: 'error',
          title: 'update or create',
          showConfirmButton: false,
          timer: 1500
        });

        this.SeguradoComponent.updateSeguradoImportador(this.userId).then(seguradoId => {

          if (Object.keys(this.calculosSelecionado).length > 1 
          && typeof this.calculosSelecionado['referencia_calculo'] !== 'undefined') {

            this.CalculosComponent.updateCalculoImportador(seguradoId).then(calculoId => {

              this.PeriodosComponent.crudPeriodosImportador(calculoId).then(status => {

                console.log(status);
                console.log(seguradoId);
                console.log(calculoId);

                // this.realizarCalculoContagemTempo(seguradoId, calculoId);
                // this.seguradoId = seguradoId;
                // this.calculoId = calculoId;
                // console.log(seguradoId);
                // console.log(calculoId);
              });
            });

          } else {

            this.CalculosComponent.createCalculoImportador(seguradoId).then(calculoId => {
              this.PeriodosComponent.createPeriodosImportador(calculoId).then(status => {
                this.realizarCalculoContagemTempo(seguradoId, calculoId);
                this.seguradoId = seguradoId;
                this.calculoId = calculoId;
              });
            });

          }

        });

      } else {

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


  /**
   * setar dados do segurado selecionado
   */
  public setDadosSeguradoSelecionado() {

    const seguradoSelecionado = (this.isEmptySessionStorage(sessionStorage.getItem('seguradoSelecionado'))) ?
      JSON.parse(sessionStorage.getItem('seguradoSelecionado')) : {};

    if (Object.keys(seguradoSelecionado).length > 0) {

      this.segurado = {
        nome: seguradoSelecionado.nome,
        id_documento: seguradoSelecionado.id_documento,
        numero_documento: seguradoSelecionado.numero_documento,
        data_nascimento: seguradoSelecionado.data_nascimento,
        data_filiacao: seguradoSelecionado.data_filiacao,
        sexo: seguradoSelecionado.sexo,
        funcao: seguradoSelecionado.funcao,
        user_id: this.userId,
        id: seguradoSelecionado.id,
      };

      this.calculosSelecionado = { id_segurado: seguradoSelecionado.id };

      sessionStorage.removeItem('seguradoSelecionado');
    }

  }


  /**
   * setar dados do cálculo selecionado
   */
  public setDadosCalculoSelecionado() {


    const calculosSelecionado = (this.isEmptySessionStorage(sessionStorage.getItem('calculosSelecionado'))) ?
      JSON.parse(sessionStorage.getItem('calculosSelecionado')) : {};

    if (Object.keys(calculosSelecionado).length > 0) {

      this.calculosSelecionado = calculosSelecionado;
      sessionStorage.removeItem('calculosSelecionado');

    }


  }


  /**
   * setar dados do periodo selecionado
   */
  public setDadosPeriodosSelecionados() {

    const periodosSelecionado = (this.isEmptySessionStorage(sessionStorage.getItem('periodosSelecionado'))) ?
      JSON.parse(sessionStorage.getItem('periodosSelecionado')) : {};

    if (Object.keys(periodosSelecionado).length > 0) {

      this.vinculos = periodosSelecionado;
      sessionStorage.removeItem('periodosSelecionado');

    }
  }


  public isEmptySessionStorage(value) {
    return (value !== null
      && value !== undefined
      && value !== '')
  }

  realizarCalculoContagemTempo(seguradoId, calculoId) {
    window.location.href = '/#/contagem-tempo/contagem-tempo-resultados/' +
      seguradoId + '/' + calculoId;


    // window.open(
    //   '/#/contagem-tempo/contagem-tempo-resultados/' + seguradoId + '/' + calculoId,
    //   '_blank');
  }

}

