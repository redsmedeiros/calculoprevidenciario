import { Component, Inject,Input, Output, EventEmitter } from '@angular/core';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { ErrorService } from '../../services/error.service';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-planejamento.component.html',
  styleUrls: ['./rgps-planejamento.component.css'],
  providers: [
    ErrorService,
  ],
})
export class RgpsPlanejamentoComponent {

  constructor(
  ) { }

}