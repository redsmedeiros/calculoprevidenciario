
import * as moment from 'moment';
import { Console } from 'console';


export class DefinicaoTempoExport {


  static setExportRGPSobj(tempo, carencia, label) {

    return {
      label: label,
      years: tempo.years,
      months: tempo.months,
      days: tempo.days,
      carencia: carencia,
      totalDias: tempo.fullDays
    };
  }

  static setExportRGPSList() {
    const dadosParaExportar = {};

    const itensExport = ['', '88', '91', '98', '99', '19'];

    itensExport.forEach(label => {
      const objExport = this.setExportRGPSobj(this['tempoTotalConFator' + label], this['carencia' + label], label);
      dadosParaExportar['total' + label] = objExport;
    });

    return dadosParaExportar;

  }



}
