import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transicao-resultados-idade',
  templateUrl: './transicao-resultados-idade.component.html',
  styleUrls: ['./transicao-resultados-idade.component.css']
})
export class TransicaoResultadosIdadeComponent implements OnInit {

  @Input() seguradoTransicao;

  constructor() { }

  ngOnInit() {
  }

}
