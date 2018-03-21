import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {FadeInTop} from '../../../shared/animations/fade-in-top.decorator';
import { Segurado as SeguradoModel } from '../Segurado.model';
import { SeguradoService } from '../Segurado.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-beneficios-segurados-index',
  templateUrl: './beneficios-segurados-index.component.html',
  styleUrls: ['./beneficios-segurados-index.component.css'],
  providers: [
    ErrorService,
  ],
})
export class BeneficiosSeguradosIndexComponent {

  @Input() list;
  @Input() datatableOptions;

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...SeguradoModel.form};

}
