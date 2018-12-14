import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';


import { SeguradoService } from '../../../+rgps/+rgps-segurados/SeguradoRgps.service';
import { ErrorService } from '../../../services/error.service';
import { SeguradoRgps as SeguradoModel } from '../../../+rgps/+rgps-segurados/SeguradoRgps.model';

@Component({
  selector: 'app-contagem-tempo-conclusao-exportar-rgps',
  templateUrl: './contagem-tempo-conclusao-exportar-rgps.component.html',
  styleUrls: ['./contagem-tempo-conclusao-exportar-rgps.component.css']
})
export class ContagemTempoConclusaoExportarRgpsComponent implements OnInit {

  @Input() calculo;
  @Input() segurado;
  @Input() dataExportacao;
  @Input() dadosParaExportar;
  @Input() label;


  constructor(
    protected SeguradoRGPS: SeguradoService,
    protected Errors: ErrorService,
  ) { }

  ngOnInit() { }


  public exportRGPS(typeExport) {

    console.log(this.calculo);
    console.log(this.segurado);
    console.log(this.dataExportacao);
    console.log(this.dadosParaExportar);
    console.log(typeExport);

    console.log(this.SeguradoRGPS);

  }

}
