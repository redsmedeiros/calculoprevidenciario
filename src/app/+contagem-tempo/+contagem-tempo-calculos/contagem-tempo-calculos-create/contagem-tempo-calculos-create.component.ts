import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CalculoContagemTempoService } from '../CalculoContagemTempo.service';
import { ErrorService } from '../../../services/error.service';
import { CalculoContagemTempo as CalculoModel } from '../CalculoContagemTempo.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-contagem-tempo-calculos-create',
  templateUrl: './contagem-tempo-calculos-create.component.html',
  styleUrls: ['./contagem-tempo-calculos-create.component.css'],
  providers: [
    ErrorService
  ]
})
export class ContagemTempoCalculosCreateComponent implements OnDestroy {
  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];
  public form = { ...CalculoModel.form };

  @Output() onSubmit = new EventEmitter();

  constructor(
    protected Calculo: CalculoContagemTempoService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
  ) { }

  submit(data) {
    console.log(data);
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
    this.form = { ...CalculoModel.form };
  }

}
