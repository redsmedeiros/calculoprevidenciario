import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transicao-resultados-pontos',
  templateUrl: './transicao-resultados-pontos.component.html',
  styleUrls: ['./transicao-resultados-pontos.component.css']
})
export class TransicaoResultadosPontosComponent implements OnInit {


  @Input() seguradoTransicao;

    // const pontos = this.contribuicaoTotal + this.idadeFracionada;

    // const tempoPercentual = {
    //   m: 20,
    //   f: 15
    // };

    // conclusoesRegra1 = {
    //   status: false,
    //   msg: '',
    //   valor: '',
    //   valorString: '',
    //   percentual: '',
    //   formula: '',
    //   requisitoDib: '',
    //   segurado: '',
    //   aviso: '',
    //   destaque: ''
    // };

  constructor() { }

  ngOnInit() {
  }

}
