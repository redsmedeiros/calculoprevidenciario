import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {FadeInTop} from '../../../shared/animations/fade-in-top.decorator';
import { SeguradoContagemTempo as SeguradoModel } from '../SeguradoContagemTempo.model';
import { SeguradoService } from './../SeguradoContagemTempo.service';
import { ErrorService } from '../../../services/error.service';


@Component({
  selector: 'app-contagem-tempo-segurados-index',
  templateUrl: './contagem-tempo-segurados-index.component.html',
  styleUrls: ['./contagem-tempo-segurados-index.component.css'],
  providers: [
    ErrorService,
  ],
})
export class ContagemTempoSeguradosIndexComponent {

  @Input() list;
  @Input() datatableOptions;

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...SeguradoModel.form};

}
