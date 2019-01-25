import { Component, Input } from '@angular/core';
import { CalculoContagemTempo as CalculoModel } from '../CalculoContagemTempo.model';
import { CalculoContagemTempoService } from '../CalculoContagemTempo.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-contagem-tempo-calculos-index',
  templateUrl: './contagem-tempo-calculos-index.component.html',
  styleUrls: ['./contagem-tempo-calculos-index.component.css'],
  providers: [
    ErrorService,
  ]
})
export class ContagemTempoCalculosIndexComponent {

  @Input() list;
  @Input() datatableOptions;

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = { ...CalculoModel.form };

}
