import { Component, OnInit, Input } from '@angular/core';
import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-pedagio100',
  templateUrl: './transicao-resultados-pedagio100.component.html',
  styleUrls: ['./transicao-resultados-pedagio100.component.css']
})
export class TransicaoResultadosPedagio100Component extends TransicaoResultadosComponent implements OnInit {


  @Input() seguradoTransicao;
  
  constructor(  ) { 
    super();
  }

  ngOnInit() {
  }

}
