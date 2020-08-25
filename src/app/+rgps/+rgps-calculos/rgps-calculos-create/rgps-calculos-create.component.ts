import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { CalculoRgpsService } from '../CalculoRgps.service';
import { ErrorService } from '../../../services/error.service';
import { CalculoRgps as CalculoModel } from '../CalculoRgps.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-rgps-calculos-create',
  templateUrl: './rgps-calculos-create.component.html',
  styleUrls: ['./rgps-calculos-create.component.css'],
  providers: [
    ErrorService
  ]
})
export class RgpsCalculosCreateComponent implements OnInit, OnDestroy {
  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];
  public form = { ...CalculoModel.form };

  @Output() onSubmit = new EventEmitter();
  @ViewChild('modalCreate') public modalCreate: ModalDirective;

  constructor(
    protected Calculo: CalculoRgpsService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.checkImportContagemTempoOpemModal();
  
  }


  submit(data) {
    this.Calculo
      .save(data)
      .then(model => {

        const teste = {
          position: 'top-end',
          icon: 'success',
          title: 'Cálculo salvo com sucesso.',
          button: false,
          timer: 1500
        };

        swal(teste);
        this.hideChildModal();
        this.resetForm();
        this.onSubmit.emit();
      })
      .catch(errors => this.Errors.add(errors));
  }


  public showChildModal(): void {
    this.modalCreate.show();
  }

  public hideChildModal(): void {
    this.modalCreate.hide();
  }


  checkImportContagemTempoOpemModal() {

    if (sessionStorage.exportContagemTempo && sessionStorage.exportContagemTempo !== undefined) {
      setTimeout(() => {
        this.modalCreate.show();
      }, 2000);
    }

  }


  ngOnDestroy() {
    this.resetForm();
  }

  resetForm() {
    this.form = { ...CalculoModel.form };
  }

}
