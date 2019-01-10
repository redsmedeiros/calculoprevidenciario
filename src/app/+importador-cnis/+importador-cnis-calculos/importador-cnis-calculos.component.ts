import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-importador-cnis-calculos',
  templateUrl: './importador-cnis-calculos.component.html',
  styleUrls: ['./importador-cnis-calculos.component.css']
})
export class ImportadorCnisCalculosComponent implements OnInit {


  @Input() isUpdating;
  @Input() vinculos;
  
  constructor() { }

  ngOnInit() {
  }

}
