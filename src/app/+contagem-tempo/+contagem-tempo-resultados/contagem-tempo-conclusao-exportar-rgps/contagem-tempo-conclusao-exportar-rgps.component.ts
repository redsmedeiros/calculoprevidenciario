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

  @Input() seguradoId;
  @Input() dataExportacao;
  @Input() dadosParaExportar;
  @Input() label;


  constructor(
    protected Errors: ErrorService
  ) { }

  ngOnInit() { }


  public exportRGPS(typeExport) {
    const objExport = JSON.stringify({
      seguradoId: this.seguradoId,
      dib: this.dataExportacao,
      typeExport: typeExport,
      dadosParaExportar: this.dadosParaExportar
    });

    sessionStorage.setItem('exportContagemTempo', objExport);

   window.location.href = '/#/rgps/rgps-calculos/' + this.seguradoId;

  }

}
