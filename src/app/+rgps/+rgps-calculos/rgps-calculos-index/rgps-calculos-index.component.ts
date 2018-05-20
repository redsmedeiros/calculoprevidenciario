import { Component, Input } from '@angular/core';
import { CalculoRgps as CalculoModel } from '../CalculoRgps.model';
import { CalculoRgpsService } from '../CalculoRgps.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-rgps-calculos-index',
  templateUrl: './rgps-calculos-index.component.html',
  styleUrls: ['./rgps-calculos-index.component.css'],
  providers: [
  	ErrorService,
  ]
})
export class RgpsCalculosIndexComponent {

  @Input() list;
  @Input() datatableOptions;

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...CalculoModel.form};

}
