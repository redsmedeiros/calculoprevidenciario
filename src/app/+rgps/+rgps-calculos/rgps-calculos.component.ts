import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { CalculoRgps as CalculoModel } from './CalculoRgps.model';
import { CalculoRgpsService } from './CalculoRgps.service';
import { ErrorService } from '../../services/error.service';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-calculos.component.html',
  providers: [
    ErrorService,
  ],
})
export class RgpsCalculosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...CalculoModel.form};

  constructor(    
  	protected Calculo: CalculoRgpsService,
    protected Errors: ErrorService,
    protected router: Router
  ) {}

  ngOnInit() {
  }

}
