import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CalculoRgpsService } from '../CalculoRgps.service';
import { ErrorService } from '../../../services/error.service';
import { CalculoRgps as CalculoModel } from '../CalculoRgps.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rgps-calculos-create',
  templateUrl: './rgps-calculos-create.component.html',
  styleUrls: ['./rgps-calculos-create.component.css'],
  providers: [
    ErrorService
  ]
})
export class RgpsCalculosCreateComponent implements OnDestroy {
  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];
  public form = {...CalculoModel.form};

  @Output() onSubmit = new EventEmitter();

  constructor(    
  	protected Calculo: CalculoRgpsService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
    ) { }

  submit(data) {
    this.Calculo
          .save(data)
          .then(model => {
            this.resetForm();
            this.onSubmit.emit();
          })
          .catch(errors => this.Errors.add(errors));
  }


  ngOnDestroy() {
  	this.resetForm();
  }

  resetForm() {
    this.form = {...CalculoModel.form};
  }

}
