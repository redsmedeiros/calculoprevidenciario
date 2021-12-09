import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter } from '@angular/core';



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
  @Output() calculoSelecionadoEventRST = new EventEmitter();

  public calculoRMIDefaulForm = { };

  constructor() { }

  ngOnInit() {

    // this.setDefaultValueContagemTempoExport();

  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    this.setDefaultValueContagemTempoExport();

  }



  public setTempoContribuicao() {
    // this.dadosParaExportar = {};

    // const itensExport = ['', '88', '91', '98', '99', '19'];

    // itensExport.forEach(label => {
    //   const objExport = this.setExportRGPSobj(this['tempoTotalConFator' + label], this['carencia' + label], label);
    //   this.dadosParaExportar['total' + label] = objExport;
    //   // this.dadosParaExportar.push(objExport);
    // });

  }

  formatCalcRMIDefaulForm(exportResultContagemTempo) {

    const exportCT = exportResultContagemTempo.export_result;

    this.calculoRMIDefaulForm = {
      dataInicioBeneficio: exportResultContagemTempo.limitesDoVinculo.fim,
      primaria98anos: exportCT.total98.years,
      primaria98meses: exportCT.total98.months,
      primaria98dias: exportCT.total98.days,
      secundaria98anos: '',
      secundaria98meses: '',
      secundaria98dias: '',
      primaria99anos: exportCT.total99.years,
      primaria99meses: exportCT.total99.months,
      primaria99dias: exportCT.total99.days,
      secundaria99anos: '',
      secundaria99meses: '',
      secundaria99dias: '',
      primariaAtualanos: exportCT.total19.years,
      primariaAtualmeses: exportCT.total19.months,
      primariaAtualdias: exportCT.total19.days,
      secundariaAtualanos: '',
      secundariaAtualmeses: '',
      secundariaAtualdias: '',
      primaria19anos: exportCT.total.years,
      primaria19meses: exportCT.total.months,
      primaria19dias: exportCT.total.days,
      carencia: exportCT.total19.carencia,
      carenciaAposEc103: exportCT.total.carencia,
    };

  }



  public setDefaultValueContagemTempoExport() {

    if (!this.isExits(this.exportResultContagemTempo)) {
      this.exportResultContagemTempo = JSON.parse(sessionStorage.getItem('exportResultContagemTempo'));
    }

    this.formatCalcRMIDefaulForm(this.exportResultContagemTempo);
  }


  public setCalculoSelecionadoEvent(data) {

    this.calculoSelecionadoEventRST.emit(data);
  }




  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '')
      ? true : false;
  }


}
