import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeguradoService } from './../SeguradoContagemTempo.service';
import { ErrorService } from '../../../services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoContagemTempo as SeguradoModel } from '../SeguradoContagemTempo.model';

@Component({
  selector: 'app-contagem-tempo-segurados-edit',
  templateUrl: './contagem-tempo-segurados-edit.component.html',
  styleUrls: ['./contagem-tempo-segurados-edit.component.css'],
  providers: [
    ErrorService
  ]
})
export class ContagemTempoSeguradosEditComponent implements OnInit, OnDestroy {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...SeguradoModel.form};
  public segurado;


  private rotaRetorno = '/contagem-tempo/contagem-tempo-segurados';
  private isUpdating = false;

  constructor(
    protected Segurado: SeguradoService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isUpdating = true;
    this.Segurado.find(this.route.snapshot.params['id'])
          .then(segurado => {
            this.segurado = segurado;
            this.form = this.segurado;

            this.setQueryParamsRota();
          });
  }


  setQueryParamsRota() {
    let queryParamsLastURL = this.route.snapshot.queryParams;

    if ( typeof queryParamsLastURL.last !== 'undefined' && queryParamsLastURL.last != '' ) {
      this.rotaRetorno = '/contagem-tempo/contagem-tempo-' + queryParamsLastURL.last + '/'
      + this.route.snapshot.params['id'] ;
    }

    if (queryParamsLastURL.calc != '' &&  typeof queryParamsLastURL.calc !== 'undefined') {
      this.rotaRetorno += '/' + queryParamsLastURL.calc;
    }
    this.isUpdating = false;
  }

  submit(data) {
    this.Segurado
          .update(this.segurado)
          .then(model => {
            this.Segurado.get()
                .then(() => this.router.navigate([this.rotaRetorno]));
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
