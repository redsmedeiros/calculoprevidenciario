import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';
import { CalculoRgps } from 'app/+rgps/+rgps-calculos/CalculoRgps.model';


@Component({
  selector: 'app-importador-rgps-calculos',
  templateUrl: './importador-rgps-calculos.component.html',
  styleUrls: ['./importador-rgps-calculos.component.css']
})
export class ImportadorRgpsCalculosComponent implements OnInit, OnChanges {

  @Input() dadosPassoaPasso;
  @Input() idSeguradoSelecionado;
  @Input() idCalculoSelecionadoCT;
  @Input() exportResultContagemTempo;

  public calcRMIDefaulForm = CalculoRgps.form;

  constructor() { }

  ngOnInit() {

    this.setDefaultValueContagemTempoExport();

  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    this.setDefaultValueContagemTempoExport();

  }


  formatCalcRMIDefaulForm(exportResultContagemTempo){

    console.log(exportResultContagemTempo);
    // deve ser padronizado object CalculoRgps
  //  this.calcRMIDefaulForm = exportResultContagemTempo;
  }



  public setDefaultValueContagemTempoExport() {
    console.log(JSON.parse(sessionStorage.getItem('exportResultContagemTempo')));

    const exportResultContagemTempo = JSON.parse(sessionStorage.getItem('exportResultContagemTempo'));
    this.formatCalcRMIDefaulForm(exportResultContagemTempo);
    // JSON.parse(sessionStorage.getItem('exportResultContagemTempo'));

  }

}
