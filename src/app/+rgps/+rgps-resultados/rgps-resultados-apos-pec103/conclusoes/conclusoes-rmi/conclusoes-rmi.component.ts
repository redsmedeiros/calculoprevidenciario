import { Component, OnInit, Input } from '@angular/core';
import { ImprimirRMI } from './../../share-rmi/imprimir-rmi';

@Component({
  selector: 'app-conclusoes-rmi',
  templateUrl: './conclusoes-rmi.component.html',
  styleUrls: ['./conclusoes-rmi.component.css']
})
export class ConclusoesRmiComponent implements OnInit {


  @Input() conclusoes;
  @Input() regraLabel;
  @Input() isUpdating;
  @Input() dataInicioBeneficio;
  @Input() segurado;
  @Input() valorExportacao;
  @Input() regra;

  constructor() { }

  ngOnInit() { }

  exportarParaBeneficios(data, valor, tipoCalculo) {

    const objExport = JSON.stringify({
      seguradoId: this.segurado.id,
      dib: data,
      valor: valor,
      tipoCalculo: tipoCalculo,
    });

    sessionStorage.setItem('exportBeneficioAtrasado', objExport);
    window.location.href = '/#/beneficios/beneficios-calculos/' + tipoCalculo + '/' + this.segurado.id;

  }


  imprimirBoxC(event, boxId) {

    event.stopPropagation();
    ImprimirRMI.imprimirBox(this.segurado.nome, boxId);
  }

}
