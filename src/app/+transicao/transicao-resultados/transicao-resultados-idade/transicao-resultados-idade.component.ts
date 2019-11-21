import { Component, OnInit, Input } from '@angular/core';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-idade',
  templateUrl: './transicao-resultados-idade.component.html',
  styleUrls: ['./transicao-resultados-idade.component.css']
})
export class TransicaoResultadosIdadeComponent extends TransicaoResultadosComponent implements OnInit {

  @Input() seguradoTransicao;

  constructor() { 
    super();
  }

  ngOnInit() {
  }

}
