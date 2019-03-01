import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalculoContagemTempoService } from '../CalculoContagemTempo.service';
import { ErrorService } from '../../../services/error.service';
import { CalculoContagemTempo as CalculoModel } from '../CalculoContagemTempo.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contagem-tempo-calculos-edit',
  templateUrl: './contagem-tempo-calculos-edit.component.html',
  styleUrls: ['./contagem-tempo-calculos-edit.component.css'],
  providers: [
    ErrorService
  ]
})
export class ContagemTempoCalculosEditComponent implements OnInit, OnDestroy {
  public edit_mode = true;

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = { ...CalculoModel.form };
  public calculo;

  private rotaRetorno = '/contagem-tempo/contagem-tempo-calculos/' + this.route.snapshot.params['id'];

  public isUpdating = false;
  constructor(
    protected CalculoContagemTempo: CalculoContagemTempoService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.isUpdating = true;
    this.CalculoContagemTempo.find(this.route.snapshot.params['id_calculo'])
      .then(calculo => {
        this.calculo = calculo;
        this.form = this.calculo;
        this.isUpdating = false;
      });

      this.setQueryParamsRota();
  }


  setQueryParamsRota() {
    // let queryParamsLastURL = this.route.snapshot.queryParams;

    // if ( typeof queryParamsLastURL.last !== 'undefined' && queryParamsLastURL.last != '' ) {
    //   this.rotaRetorno = '/contagem-tempo/contagem-tempo-' + queryParamsLastURL.last + '/'
    //   + this.route.snapshot.params['id'] + '/' + this.route.snapshot.params['id_calculo'];
    // }

    if (sessionStorage.last_url && sessionStorage.last_url != undefined) {
      this.rotaRetorno = sessionStorage.last_url
      sessionStorage.removeItem('last_url');
    }

  }


  submit(data) {
    this.CalculoContagemTempo
      .update(this.calculo)
      .then(model => {
        swal('Sucesso', 'Cálculo salvo com sucesso', 'success').then(() => {
          this.CalculoContagemTempo.get()
            .then(() => this.router.navigate([this.rotaRetorno]));
        });
      })
      .catch(errors => this.Errors.add(errors));
  }





  ngOnDestroy() {
    this.resetForm();
    if (!this.Errors.empty()) {
      Object.keys(this.Errors.all()).forEach(field => {
        this.calculo[field] = this.calculo['_data'][field];
      });
      this.Errors.clear();
    }

  }

  resetForm() {
    this.form = { ...CalculoModel.form };
  }

}
