
import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { WINDOW } from 'app/+rgps/+rgps-calculos/window.service';
import * as moment from 'moment';
import { ImprimirRMI } from './../../share-rmi/imprimir-rmi';

@Component({
  selector: 'app-lista-competencias',
  templateUrl: './lista-competencias.component.html',
  styleUrls: ['./lista-competencias.component.css']
})
export class ListaCompetenciasComponent implements OnInit {


  @Input() listaConclusaoAcesso;
  @Input() isUpdating;
  @Input() isRegrasTransicao;
  @Input() segurado;
  @Input() dataInicioBeneficio;

  constructor(
    // @Inject(DOCUMENT) private document: Document,
    // @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() { }


  imprimirBox(event, boxId) {
    event.stopPropagation();
    ImprimirRMI.imprimirBox(this.segurado.nome, boxId);
  }

}
