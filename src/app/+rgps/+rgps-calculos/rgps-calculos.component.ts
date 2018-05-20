import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { CalculoRgps as CalculoModel } from './CalculoRgps.model';
import { CalculoRgpsService } from './CalculoRgps.service';
import { ErrorService } from '../../services/error.service';

import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';

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

  public calculosList = this.CalculoRgps.list;

  public isUpdating = false;

  public idSegurado = '';

  public segurado:any = {};

  constructor(
    protected Segurado: SeguradoService,    
  	protected CalculoRgps: CalculoRgpsService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id'];

    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
    });
  }


  editSegurado() {
    window.location.href='/#/rgps/rgps-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

}
