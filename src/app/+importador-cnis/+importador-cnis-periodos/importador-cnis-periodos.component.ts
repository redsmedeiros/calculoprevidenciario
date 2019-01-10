import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-importador-cnis-periodos',
  templateUrl: './importador-cnis-periodos.component.html',
  styleUrls: ['./importador-cnis-periodos.component.css']
})
export class ImportadorCnisPeriodosComponent implements OnInit {

  @Input() isUpdating;
  @Input() vinculos;

  constructor() { }

  ngOnInit() {
  }

}
