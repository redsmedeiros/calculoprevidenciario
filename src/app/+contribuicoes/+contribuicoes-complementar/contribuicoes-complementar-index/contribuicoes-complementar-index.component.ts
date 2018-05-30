import { Component, Input } from '@angular/core';
import { ContribuicaoComplementar as CalculoModel } from '../ContribuicaoComplementar.model';
import { ContribuicaoComplementarService } from '../ContribuicaoComplementar.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-contribuicoes-complementar-index',
  templateUrl: './contribuicoes-complementar-index.component.html',
  styleUrls: ['./contribuicoes-complementar-index.component.css'],
  providers: [
    ErrorService,
  ],
})
export class ContribuicoesComplementarIndexComponent {
  @Input() datatableOptions;

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...CalculoModel.form};



}
