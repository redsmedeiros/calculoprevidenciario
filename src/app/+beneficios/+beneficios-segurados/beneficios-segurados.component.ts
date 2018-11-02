import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import { Segurado as SeguradoModel } from './Segurado.model';
import { SeguradoService } from './Segurado.service';
import { ErrorService } from '../../services/error.service';
import { environment } from '../../../environments/environment';

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
  public userId;
  public form = {...SeguradoModel.form};
  public list = this.Segurado.list;
  public datatableOptions = {
    colReorder: true,
    data: this.list,
    columns: [
      {data: 'actions'},
      {data: 'nome'},
      {data: 'id_documento',
        render: (data) => {
          return this.getDocumentType(data);
        }},
      {data: 'documento'},
      {data: 'data_nascimento'},
      {data: 'data_filiacao'},
      {data: 'data_cadastro'}
    ] };

  constructor(
    protected Segurado: SeguradoService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isUpdating = true;
    this.userId = this.route.snapshot.queryParams['user_id'];
    if(!this.userId)
      window.location.href = environment.loginPageUrl;
    this.Segurado.getByUserId(this.userId)
        .then(() => {
           localStorage.setItem('user_id', this.userId);
           this.updateDatatable();
           this.isUpdating = false;
        })
  }

  getDocumentType(id_documento) {
    switch (id_documento) {
      case 1:
        return 'PIS';
      case 2:
        return 'PASEP';
      case 3:
        return 'CPF';
      case 4:
        return 'NIT';
      case 5:
        return 'RG';
      default:
        return ''
    }
  }

  updateDatatable() {
    this.datatableOptions = {
      ...this.datatableOptions,
      data: this.list,
    }
  }

  onCreate(e) {
    this.isUpdating = true;
    this.Segurado.getByUserId(this.userId)
        .then(() => {
           this.updateDatatable();
           this.list = this.Segurado.list;
           this.isUpdating = false;
        })
  }

}
