import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-beneficios-segurados-form',
  templateUrl: './beneficios-segurados-form.component.html',
  styleUrls: ['./beneficios-segurados-form.component.css']
})
export class BeneficiosSeguradosFormComponent {

  @Input() formData;
  @Input() errors: ErrorService;
  @Output() onSubmit = new EventEmitter;

  public submit(e) {
    e.preventDefault();
    if (this.errors.empty()) {
      this.onSubmit.emit( this.formData );
    }
  }

}
