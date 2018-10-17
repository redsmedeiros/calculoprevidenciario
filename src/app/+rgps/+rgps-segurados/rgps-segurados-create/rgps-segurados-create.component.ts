import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SeguradoService } from '../SeguradoRgps.service';
import { ErrorService } from '../../../services/error.service';
import { SeguradoRgps as SeguradoModel } from '../SeguradoRgps.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rgps-segurados-create',
  templateUrl: './rgps-segurados-create.component.html',
  styleUrls: ['./rgps-segurados-create.component.css'],
  providers: [
    ErrorService
  ]
})
export class RgpsSeguradosCreateComponent implements OnInit, OnDestroy {

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
            window.location.href='#/rgps/rgps-calculos/'+ model.id;
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
