import { Component, OnInit, Input } from '@angular/core';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-pedagio50',
  templateUrl: './transicao-resultados-pedagio50.component.html',
  styleUrls: ['./transicao-resultados-pedagio50.component.css']
})
export class TransicaoResultadosPedagio50Component extends TransicaoResultadosComponent implements OnInit {

  @Input() seguradoTransicao;

  constructor() {
    super();
   }

  ngOnInit() {
  }

}
