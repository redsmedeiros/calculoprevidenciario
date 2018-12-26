import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { SeguradoContagemTempo as SeguradoModel } from './SeguradoContagemTempo.model';
import { SeguradoService } from './SeguradoContagemTempo.service';
import { ErrorService } from '../../services/error.service';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contagem-tempo-segurados.component.html',
  providers: [
    ErrorService,
  ],
})
export class ContagemTempoSeguradosComponent implements OnInit {

  public styleTheme = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public userId;
  public isUpdating = false;
  public isEdit = false;
  public form = { ...SeguradoModel.form };
  public list = this.Segurado.list;
  public datatableOptions = {
    colReorder: true,
    data: this.list,
    columns: [
      { data: 'actions', width: '7%', className: 'dt-center' },
      { data: 'nome' },
      {
        data: 'id_documento',
        render: (data) => {
          return this.getDocumentType(data);
        }
      },
      { data: 'documento' },
      { data: 'data_nascimento' },
      { data: 'data_filiacao' },
      { data: 'data_cadastro' }
    ]
  };

  constructor(
    protected Segurado: SeguradoService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isUpdating = true;

    this.getListSegurados();

  }


  private getListSegurados() {

    this.userId = this.route.snapshot.queryParams['user_id'];

    if (this.userId === undefined) {
      this.userId = this.route.snapshot.params['id'] || localStorage.getItem('user_id');
    }

    this.Segurado.getByUserId(this.userId)
        .then(() => {
           localStorage.setItem('user_id', this.userId);
           this.updateDatatable();
           this.isUpdating = false;
        });

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
    this.Segurado.get()
      .then(() => {
        this.updateDatatable();
        this.list = this.Segurado.list;
        this.isUpdating = false;
      })
  }

}
