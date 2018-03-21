import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeguradoService } from '../Segurado.service';
import { ErrorService } from '../../../services/error.service';
import { Segurado as SeguradoModel } from '../Segurado.model';
import { Router } from '@angular/router';

@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './beneficios-segurados-create.component.html',
  styleUrls: ['./beneficios-segurados-create.component.css'],
  providers: [
    ErrorService
  ]
})
export class BeneficiosSeguradosCreateComponent implements OnInit, OnDestroy {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...SeguradoModel.form};

  constructor(
    protected Segurado: SeguradoService,
    protected Errors: ErrorService,
    protected router: Router,
  ) {}

  ngOnInit() {
  }

  submit(data) {
    this.Segurado
          .save(data)
          .then(model => {
            this.Segurado.get()
                .then(() => this.router.navigate(['/beneficios/beneficios-segurados']));
          })
          .catch(errors => this.Errors.add(errors));
  }

  ngOnDestroy() {
    this.resetForm();
  }

  resetForm() {
    this.form = {...SeguradoModel.form};
  }

}
