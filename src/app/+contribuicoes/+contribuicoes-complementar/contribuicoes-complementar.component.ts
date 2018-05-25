import { Component, OnInit } from '@angular/core';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NgForm } from '@angular/forms';
import { ErrorService } from '../../services/error.service';


@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contribuicoes-complementar.component.html',
  providers: [
  ErrorService,
  ]
})
export class ContribuicoesComplementarComponent implements OnInit {

  constructor(protected Errors: ErrorService) {}

  ngOnInit() {}

}