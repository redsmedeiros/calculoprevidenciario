
import {
  Component, OnInit, ViewChild,
  ElementRef, ChangeDetectorRef,
  Input, OnChanges, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../shared/animations/fade-in-top.decorator';
import swal from 'sweetalert2'
import { ErrorService } from '../../../services/error.service';

import { ImportadorCnisSeguradosComponent } from './+importador-cnis-segurados/importador-cnis-segurados.component';
import { ImportadorCnisCalculosComponent } from './+importador-cnis-calculos/importador-cnis-calculos.component';
import { ImportadorCnisPeriodosComponent } from './+importador-cnis-periodos/importador-cnis-periodos.component';

import { MoedaService } from 'app/services/Moeda.service';
import { Moeda } from 'app/services/Moeda.model';
import { Auth } from '../services/Auth/Auth.service';
import { AuthResponse } from '../services/Auth/AuthResponse.model';

import * as moment from 'moment';
import { CheckVarFunctions } from 'app/shared/functions/check-var-functions';


@Component({
  selector: 'app-importador-cnis',
  templateUrl: './importador-cnis.component.html',
  styleUrls: ['./importador-cnis.component.css']
})
export class ImportadorCnisComponent implements OnInit, OnChanges {


  @Input() dadosPassoaPasso;
  @Input() moeda;
  @Output() eventCalcularContagem = new EventEmitter();
  @Output() eventPrevStepPassoaPasso = new EventEmitter();
  @Output() eventStatusImport = new EventEmitter();

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
    private Auth: Auth,
    private Moeda: MoedaService,
  ) { }

  ngOnInit() {
    // this.ref.markForCheck();
    // this.ref.detectChanges();

    this.getTabelaMoeda();
    this.checkUserSession();

    if (this.dadosPassoaPasso === undefined) {
      this.dadosPassoaPasso = {
        origem: 'contagem',
        type: 'auto'
      };
    }



  }

  ngOnChanges(changes: SimpleChanges) {

    this.checkUserSession();

    this.ref.markForCheck();
    this.setExibirForm(this.dadosPassoaPasso);
    this.ref.detectChanges();
  }


  private getTabelaMoeda() {

    if (CheckVarFunctions.isEmpty(this.moeda)) {

      this.Moeda.moedaSalarioMinimoTeto()
        .then((moeda: Moeda[]) => {
          this.moeda = moeda;
          console.log(this.moeda);

          sessionStorage.setItem(
            'moedaSalarioMinimoTeto',
            JSON.stringify(moeda));

        });

    }
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

      if (sessionStorage.getItem('isToStep6') === 'aStep4') {

        setTimeout(() => {
          this.seguradoId = this.segurado.id;
          this.calculoId = this.calculosSelecionado['id'];
          this.setNextStepContagemTempo();
        }, 1000);

      }

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
    this.setEventStatusImport(this.isUploadReaderComplete);
    this.ref.detectChanges();

  }

  reciverCountSeguradoErros(eventCountSeguradoErros) {
    this.eventCountSeguradoErros = eventCountSeguradoErros;
    this.ref.detectChanges();
  }

  reciverCountVinculosErros(eventCountVinculosErros) {
    this.eventCountVinculosErros = eventCountVinculosErros;
    this.ref.detectChanges();
  }


  public gravarImportacaoContagemTempo() {

    const errosSegurado = this.SeguradoComponent.validate();
    const erros = this.PeriodosComponent.verificarVinculos();

    if (erros === 0 && errosSegurado.count === 0) {

      if (this.dadosPassoaPasso !== undefined
        && this.dadosPassoaPasso.origem === 'passo-a-passo'
        && this.dadosPassoaPasso.type === 'seguradoExistente'
      ) {

        this.SeguradoComponent.updateSeguradoImportador(this.userId).then(seguradoId => {

          if (Object.keys(this.calculosSelecionado).length > 1
            && typeof this.calculosSelecionado['referencia_calculo'] !== 'undefined') {

            this.CalculosComponent.updateCalculoImportador(seguradoId).then(calculoId => {
              this.PeriodosComponent.crudPeriodosImportador(calculoId).then(status => {


                this.seguradoId = seguradoId;
                this.calculoId = calculoId;
                this.setNextStepContagemTempo();
                this.realizarCalculoContagemTempo(seguradoId, calculoId);

              });
            });

          } else {

            this.CalculosComponent.createCalculoImportador(seguradoId).then(calculoId => {
              this.PeriodosComponent.createPeriodosImportador(calculoId).then(status => {

                this.seguradoId = seguradoId;
                this.calculoId = calculoId;
                this.setNextStepContagemTempo();
                this.realizarCalculoContagemTempo(seguradoId, calculoId);
              });
            });

          }

        });

      } else {

        this.SeguradoComponent.createSeguradoImportador(this.userId).then(seguradoId => {
          this.CalculosComponent.createCalculoImportador(seguradoId).then(calculoId => {
            this.PeriodosComponent.createPeriodosImportador(calculoId).then(status => {

              this.seguradoId = seguradoId;
              this.calculoId = calculoId;
              this.setNextStepContagemTempo();
              this.realizarCalculoContagemTempo(seguradoId, calculoId);
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


  public prevStepPassoaPasso() {

    const step = (this.dadosPassoaPasso.type !== 'seguradoExistente') ? 'step1' : 'step3';
    this.eventPrevStepPassoaPasso.emit({ activeStep: step });

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

      // sessionStorage.removeItem('seguradoSelecionado');
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


    if (this.dadosPassoaPasso.origem === 'contagem') {

      window.location.href = '/#/contagem-tempo/contagem-tempo-resultados/' +
        seguradoId + '/' + calculoId;

    }

    // window.open(
    //   '/#/contagem-tempo/contagem-tempo-resultados/' + seguradoId + '/' + calculoId,
    //   '_blank');
  }

  setEventStatusImport(status) {

    if (this.dadosPassoaPasso.origem !== 'contagem') {
      this.eventStatusImport.emit({
        status: status
      });
    }

  }

  setNextStepContagemTempo() {

    if (this.dadosPassoaPasso.origem !== 'contagem') {
      this.eventCalcularContagem.emit({
        seguradoId: this.seguradoId,
        calculoId: this.calculoId
      });
    }

  }



}

