import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SeguradoService } from '../../Segurado.service';
import { ErrorService } from '../../../services/error.service';
import { SeguradoContribuicao as SeguradoModel } from '../../SeguradoContribuicao.model';
import { Router } from '@angular/router';

@Component({
  // selector: 'sa-datatables-showcase',
  selector: 'app-contribuicoes-segurados-create',
  templateUrl: './contribuicoes-segurados-create.component.html',
  styleUrls: ['./contribuicoes-segurados-create.component.css'],
  providers: [
    ErrorService
  ]
})
export class ContribuicoesSeguradosCreateComponent implements OnInit, OnDestroy {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...SeguradoModel.form};
  @Output() onSubmit = new EventEmitter();

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
          .then((model:SeguradoModel) => {
            this.resetForm();
            this.onSubmit.emit();
            window.location.href='#/contribuicoes/contribuicoes-calculos/'+ model.id;
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
