import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SeguradoService } from '../Segurado.service';
import { ErrorService } from '../../../services/error.service';
import { Segurado as SeguradoModel } from '../Segurado.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-beneficios-segurados-edit',
  templateUrl: './beneficios-segurados-edit.component.html',
  styleUrls: ['./beneficios-segurados-edit.component.css'],
  providers: [
    ErrorService
  ]
})
export class BeneficiosSeguradosEditComponent implements OnInit, OnDestroy {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...SeguradoModel.form};
  public segurado;
  @Output() onSubmit = new EventEmitter();

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
            this.onSubmit.emit();
            window.location.href='#/beneficios/beneficios-segurados/';
            // this.Segurado.get()
            //     .then(() => this.router.navigate(['/beneficios/beneficios-segurados']));
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
