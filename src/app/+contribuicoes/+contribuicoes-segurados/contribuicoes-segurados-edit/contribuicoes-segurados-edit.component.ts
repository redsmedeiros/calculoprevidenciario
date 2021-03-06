import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeguradoService } from '../../Segurado.service';
import { ErrorService } from '../../../services/error.service';
import { SeguradoContribuicao as SeguradoModel } from '../../SeguradoContribuicao.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contribuicoes-segurados-edit.component.html',
  styleUrls: ['./contribuicoes-segurados-edit.component.css'],
  providers: [
    ErrorService
  ]
})
export class ContribuicoesSeguradosEditComponent implements OnInit, OnDestroy {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...SeguradoModel.form};
  public segurado;

  constructor(
    protected Segurado: SeguradoService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.Segurado.find(this.route.snapshot.params['id'])
          .then(segurado => {
            this.segurado = segurado;
            this.form = this.segurado;
          });
  }

  submit(data) {
    this.Segurado
          .update(this.segurado)
          .then(model => {
            this.router.navigate(['/contribuicoes/contribuicoes-segurados']);
            // this.Segurado.get()
            //     .then(() => this.router.navigate(['/contribuicoes/contribuicoes-segurados']));
          })
          .catch(errors => this.Errors.add(errors));
  }

  ngOnDestroy() {
    this.resetForm();
    if (!this.Errors.empty()) {
      Object.keys(this.Errors.all()).forEach(field => {
        this.segurado[field] = this.segurado['_data'][field];
      });
      this.Errors.clear();
    }
  }

  resetForm() {
    this.form = {...SeguradoModel.form};
  }

}
