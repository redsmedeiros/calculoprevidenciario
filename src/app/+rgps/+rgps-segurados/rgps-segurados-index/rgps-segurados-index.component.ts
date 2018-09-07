import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {FadeInTop} from '../../../shared/animations/fade-in-top.decorator';
import { SeguradoRgps as SeguradoModel } from '../SeguradoRgps.model';
import { SeguradoService } from '../SeguradoRgps.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-rgps-segurados-index',
  templateUrl: './rgps-segurados-index.component.html',
  styleUrls: ['./rgps-segurados-index.component.css'],
  providers: [
    ErrorService,
  ],
})
export class RgpsSeguradosIndexComponent {

  @Input() list;
  @Input() datatableOptions;

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...SeguradoModel.form};

}
