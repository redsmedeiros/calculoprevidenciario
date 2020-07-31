import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lista-competencias',
  templateUrl: './lista-competencias.component.html',
  styleUrls: ['./lista-competencias.component.css']
})
export class ListaCompetenciasComponent implements OnInit {


  @Input() listaConclusaoAcesso;
  @Input() isUpdating;

  constructor() { }

  ngOnInit() { }

}
