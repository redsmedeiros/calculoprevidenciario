import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {FadeInTop} from '../../../shared/animations/fade-in-top.decorator';
import { CalculoAtrasado as CalculoAtrasadoModel } from '../../CalculoAtrasado.model';
import { CalculoAtrasadoService } from '../../CalculoAtrasado.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-beneficios-calculos-index',
  templateUrl: './beneficios-calculos-index.component.html',
  styleUrls: ['./beneficios-calculos-index.component.css'],
  providers: [
    ErrorService,
  ],
})
export class BeneficiosCalculosIndexComponent {

  @Input() list;
  @Input() datatableOptions;
  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...CalculoAtrasadoModel.form};

}
