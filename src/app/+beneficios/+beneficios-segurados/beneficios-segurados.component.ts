import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import { Segurado as SeguradoModel } from './Segurado.model';
import { SeguradoService } from './Segurado.service';
import { ErrorService } from '../../services/error.service';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './beneficios-segurados.component.html',
  providers: [
    ErrorService,
  ],
})
export class BeneficiosSeguradosComponent implements OnInit {

  public styleTheme = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public isUpdating = false;
  public form = {...SeguradoModel.form};
  public list = this.Segurado.list;
  public datatableOptions = {
    colReorder: true,
    data: this.list,
    columns: [
      {data: 'actions'},
      {data: 'nome'},
      {data: 'tipo'},
      {data: 'documento'},
      {data: 'data_nascimento'},
      {data: 'data_filiacao'},
      {data: 'data_cadastro'}
    ] };

  constructor(
    protected Segurado: SeguradoService,
    protected Errors: ErrorService,
    protected router: Router,
  ) {}

  ngOnInit() {
    this.isUpdating = true;
    this.Segurado.get()
        .then(() => {
           this.updateDatatable();
           this.isUpdating = false;
        })
  }

  updateDatatable() {
    this.datatableOptions = {
      ...this.datatableOptions,
      data: [...this.list],
    }
  }

  onCreate(e) {
    this.isUpdating = true;
    this.Segurado.get()
        .then(() => {
           this.updateDatatable();
           this.isUpdating = false;
        })
  }

}
