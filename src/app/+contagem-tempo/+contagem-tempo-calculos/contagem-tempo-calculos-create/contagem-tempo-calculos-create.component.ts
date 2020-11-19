import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CalculoContagemTempoService } from '../CalculoContagemTempo.service';
import { ErrorService } from '../../../services/error.service';
import { CalculoContagemTempo as CalculoModel } from '../CalculoContagemTempo.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

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
    this.Calculo
      .save(data)
      .then((model: CalculoModel) => {
        swal(
          {
            type: 'success',
            title: 'Cálculo salvo com sucesso',
            text: '',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 2000
          }
        ).then(() => {
          this.resetForm();
          this.onSubmit.emit();
          window.location.href = '#/contagem-tempo/contagem-tempo-periodos/' + this.route.snapshot.params['id'] + '/' + model.id;
        });
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