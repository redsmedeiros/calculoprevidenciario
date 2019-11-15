import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transicao-resultados-idade-progressiva',
  templateUrl: './transicao-resultados-idade-progressiva.component.html',
  styleUrls: ['./transicao-resultados-idade-progressiva.component.css']
})
export class TransicaoResultadosIdadeProgressivaComponent implements OnInit {

  @Input() seguradoTransicao;

  constructor() { }

  ngOnInit() {
  }

}
