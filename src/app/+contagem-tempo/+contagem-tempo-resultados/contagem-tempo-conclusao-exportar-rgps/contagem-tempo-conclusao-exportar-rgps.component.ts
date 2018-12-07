import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contagem-tempo-conclusao-exportar-rgps',
  templateUrl: './contagem-tempo-conclusao-exportar-rgps.component.html',
  styleUrls: ['./contagem-tempo-conclusao-exportar-rgps.component.css']
})
export class ContagemTempoConclusaoExportarRgpsComponent implements OnInit {

  @Input() calculo;
  @Input() segurado;
  @Input() dataExportacao;
  @Input() carencia;
  @Input() totalAnos;
  @Input() totalMeses;
  @Input() totalDias;


  constructor() { }

  ngOnInit() {

    console.log(this.calculo);
  console.log(this.segurado);
  console.log(this.dataExportacao);
  console.log(this.carencia);
  console.log(this.totalAnos);
  console.log(this.totalMeses);
  console.log(this.totalDias);
  }

}
