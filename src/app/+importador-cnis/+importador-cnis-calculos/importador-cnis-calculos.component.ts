import { Component, OnInit, Input } from '@angular/core';
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
export class ImportadorCnisCalculosComponent implements OnInit {

  @Input() isUpdating;

  constructor(
    protected CalculoContagemService: CalculoContagemTempoService,
    protected Errors: ErrorService,
  ) { }

  ngOnInit() { }


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
    }

   return this.CalculoContagemService
    .save(contagemTempo)
    .then((model: CalculoContagemTempoModel) => {
      // console.log(model.id);
      return model.id;
    })
    .catch(errors => this.Errors.add(errors));

  }


}
