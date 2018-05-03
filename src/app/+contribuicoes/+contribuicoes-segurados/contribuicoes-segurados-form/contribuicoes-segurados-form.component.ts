import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-contribuicoes-segurados-form',
  templateUrl: './contribuicoes-segurados-form.component.html',
  styleUrls: ['./contribuicoes-segurados-form.component.css']
})
export class ContribuicoesSeguradosFormComponent {

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
