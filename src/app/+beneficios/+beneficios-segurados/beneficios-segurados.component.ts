import { Component, OnInit, OnDestroy } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { Segurado as SeguradoModel } from './Segurado.model';
import { SeguradoService } from './Segurado.service';
import { ErrorService } from '../../services/error.service';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './beneficios-segurados.component.html',
  providers: [
    ErrorService,
  ],
})
export class BeneficiosSeguradosComponent implements OnInit, OnDestroy {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public list: SeguradoModel[] = [];
  public form = {...SeguradoModel.form};

  constructor(
    protected Segurado: SeguradoService,
    protected Errors: ErrorService,
  ) {
    this.list = this.Segurado.list;
  }

  ngOnInit() {
    this.Segurado.get();
  }

  submit(e) {
    e.preventDefault();
    this.Segurado
          .save(this.form)
          .then(model => {
            this.form = {...SeguradoModel.form};
          })
          .catch(errors => this.Errors.add(errors));
  }

  ngOnDestroy() {
    // Limpar o formulário quando mudar a rota
    this.form = {...SeguradoModel.form};
  }

}
