import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transicao-resultados-pedagio100',
  templateUrl: './transicao-resultados-pedagio100.component.html',
  styleUrls: ['./transicao-resultados-pedagio100.component.css']
})
export class TransicaoResultadosPedagio100Component implements OnInit {


  @Input() seguradoTransicao;
  
  constructor() { }

  ngOnInit() {
  }

}
