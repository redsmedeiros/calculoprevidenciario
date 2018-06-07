import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { Segurado as SeguradoModel } from "../+beneficios-segurados/Segurado.model";
import { SeguradoService } from "../+beneficios-segurados/Segurado.service";
import { CalculoAtrasado as CalculoModel } from "../+beneficios-calculos/CalculoAtrasado.model";
import { CalculoAtrasadoService as CalculoService } from "../+beneficios-calculos/CalculoAtrasado.service";

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './beneficios-resultados.component.html',
})
export class BeneficiosResultadosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public segurado:any = {};

  public isUpdating = false;


  constructor(protected Segurado: SeguradoService,
              protected router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.isUpdating = true;

    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
            this.isUpdating = false;
    });
  }

  editSegurado() {
    window.location.href='/#/beneficios/beneficios-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

}
