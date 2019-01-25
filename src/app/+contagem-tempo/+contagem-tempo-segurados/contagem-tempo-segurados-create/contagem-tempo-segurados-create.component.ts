import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SeguradoService } from './../SeguradoContagemTempo.service';
import { ErrorService } from '../../../services/error.service';
import { SeguradoContagemTempo as SeguradoModel } from '../SeguradoContagemTempo.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contagem-tempo-segurados-create',
  templateUrl: './contagem-tempo-segurados-create.component.html',
  styleUrls: ['./contagem-tempo-segurados-create.component.css'],
  providers: [
    ErrorService
  ]
})
export class ContagemTempoSeguradosCreateComponent implements OnInit, OnDestroy {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = { ...SeguradoModel.form };
  @Output() onSubmit = new EventEmitter();

  constructor(
    protected Segurado: SeguradoService,
    protected Errors: ErrorService,
    protected router: Router,
  ) { }

  ngOnInit() {
  }

  submit(data) {
    // this.Segurado
    //   .save(data)
    //   .then(model => {
    //     this.resetForm();
    //     this.onSubmit.emit();
    //   })
    //   .catch(errors => this.Errors.add(errors));

    this.Segurado
      .save(data)
      .then((model: SeguradoModel) => {
        this.resetForm();
        this.onSubmit.emit();
        window.location.href = '#/contagem-tempo/contagem-tempo-calculos/' + model.id;
      })
      .catch(errors => this.Errors.add(errors));
  }

  ngOnDestroy() {
    this.resetForm();
  }

  resetForm() {
    this.form = { ...SeguradoModel.form };
  }

}
