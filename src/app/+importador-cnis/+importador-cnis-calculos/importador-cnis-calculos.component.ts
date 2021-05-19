import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';
import { ErrorService } from 'app/services/error.service';

import { CalculoContagemTempoService } from 'app/+contagem-tempo/+contagem-tempo-calculos/CalculoContagemTempo.service';
import { CalculoContagemTempo as CalculoContagemTempoModel } from 'app/+contagem-tempo/+contagem-tempo-calculos/CalculoContagemTempo.model';

@Component({
  selector: 'app-importador-cnis-calculos',
  templateUrl: './importador-cnis-calculos.component.html',
  styleUrls: ['./importador-cnis-calculos.component.css'],
  providers: [
    ErrorService
  ]
})
export class ImportadorCnisCalculosComponent implements OnInit, OnChanges {

  @Input() isUpdating;
  @Input() dadosPassoaPasso;
  @Input() calculo;

  public calculoContagemTempo = {};
  public isFormCalculo = false;

  constructor(
    protected CalculoContagemService: CalculoContagemTempoService,
    protected Errors: ErrorService,
  ) { }

  ngOnInit() {

    console.log(this.dadosPassoaPasso);
    console.log(this.calculo)

    this.setCalculoImportador();

  }



  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    const changedisUpdating = changes['isUpdating'];
    const calculo = changes['calculo'];

    console.log(this.calculo)
    console.log(calculo)


   this.setCalculoImportador();

  }


  public setCalculoImportador() {

    if (this.dadosPassoaPasso !== undefined
      && this.dadosPassoaPasso.origem === 'passo-a-passo'
      && this.dadosPassoaPasso.type === 'seguradoExistente'
      && typeof this.calculo.id_segurado !== 'undefined'
    ) {

      this.calculoContagemTempo = {
        id: this.calculo.id,
        id_segurado: this.calculo.id_segurado,
        total_dias: 0,
        total_88: 0,
        total_91: 0,
        total_98: 0,
        total_99: 0,
        total_carencia: 0,
        tipo_contribuicao: 'g',
        referencia_calculo: this.calculo.referencia_calculo,
      }

      this.isFormCalculo = true;

    }

  }



  public createCalculoImportador(seguradoId) {

    const ref = 'Importação - ' + new Date().toLocaleDateString('pt-BR');

    const contagemTempo = {
      id_segurado: seguradoId,
      total_dias: 0,
      total_88: 0,
      total_91: 0,
      total_98: 0,
      total_99: 0,
      total_carencia: 0,
      tipo_contribuicao: 'g',
      referencia_calculo: ref,
    };

    return this.CalculoContagemService
      .save(contagemTempo)
      .then((model: CalculoContagemTempoModel) => {
        return model.id;
      })
      .catch(errors => this.Errors.add(errors));

  }


}
