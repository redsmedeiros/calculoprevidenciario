import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {FadeInTop} from '../../../shared/animations/fade-in-top.decorator';
import { SeguradoContribuicao as SeguradoModel } from '../../SeguradoContribuicao.model';
import { SeguradoService } from '../../Segurado.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-contribuicoes-segurados-index',
  templateUrl: './contribuicoes-segurados-index.component.html',
  styleUrls: ['./contribuicoes-segurados-index.component.css'],
  providers: [
    ErrorService,
  ],
})
export class ContribuicoesSeguradosIndexComponent {

  @Input() list;
  @Input() datatableOptions;

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...SeguradoModel.form};

}
