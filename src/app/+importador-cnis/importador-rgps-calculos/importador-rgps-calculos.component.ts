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

  public calculoRMIDefaulForm = {
    dataInicioBeneficio: '',
    primaria98anos: '',
    primaria98meses: '',
    primaria98dias: '',
    secundaria98anos: '',
    secundaria98meses: '',
    secundaria98dias: '',
    primaria99anos: '',
    primaria99meses: '',
    primaria99dias: '',
    secundaria99anos: '',
    secundaria99meses: '',
    secundaria99dias: '',
    primariaAtualanos: '',
    primariaAtualmeses: '',
    primariaAtualdias: '',
    secundariaAtualanos: '',
    secundariaAtualmeses: '',
    secundariaAtualdias: '',
    primaria19anos: '',
    primaria19meses: '',
    primaria19dias: '',
    carencia: '',
    carenciaAposEc103: ''
  };

  constructor() { }

  ngOnInit() {

    this.setDefaultValueContagemTempoExport();

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

    console.log(this.calculoRMIDefaulForm);
    console.log(exportResultContagemTempo);

    const CalculoRMIobject = {
      carencia: "",
      carencia_apos_ec103: "",
      contribuicao_primaria_19: "",
      contribuicao_primaria_98: "",
      contribuicao_primaria_99: "",
      contribuicao_primaria_atual: "",
      contribuicao_secundaria_98: "",
      contribuicao_secundaria_99: "",
      contribuicao_secundaria_atual: "",
      data_pedido_beneficio: "",
      id_contagem_tempo: this.idCalculoSelecionadoCT,
      id_segurado: this.idSeguradoSelecionado,
      tipo_seguro: "",
    }


    // console.log(exportResultContagemTempo);
    // deve ser padronizado object CalculoRgps
    //  this.calcRMIDefaulForm = exportResultContagemTempo;
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
