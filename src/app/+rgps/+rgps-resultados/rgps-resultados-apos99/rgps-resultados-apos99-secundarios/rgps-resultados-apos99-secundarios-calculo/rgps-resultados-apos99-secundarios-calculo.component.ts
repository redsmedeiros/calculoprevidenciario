import { Component, Input, OnInit } from '@angular/core';
import {RgpsResultadosApos99Component} from '../rgps-resultados-apos99-secundarios-calculo'
@Component({
  selector: 'app-rgps-resultados-apos99-secundarios-calculo',
  templateUrl: './rgps-resultados-apos99-secundarios-calculo.component.html',
  styleUrls: ['./rgps-resultados-apos99-secundarios-calculo.component.css']
})
export class RgpsResultadosApos99SecundariosCalculoComponent implements OnInit {



    @Input() isUpdatingParent;
    @Input() tableData;
    @Input() indexSec;
    @Input() resultadoFinal

    public isUpdating = true;
    

    private tableDataCalculo = [];
    public tableOptions = {
      colReorder: false,
      paging: false,
      searching: false,
      ordering: false,
      bInfo: false,
      data: this.tableDataCalculo,
      columns: [
        { data: 'id' },
        { data: 'competencia' },
        { data: 'indice_corrigido' },
        { data: 'contribuicao_secundaria'},
        { data: 'contribuicao_secundaria_revisada' },
        { data: 'limite' },
      ],
      columnDefs: [
        { 'width': '15rem', 'targets': [4] },
        {
          'targets': [0, 1, 2, 3, 4],
          'className': 'text-center'
        }
      ]
    };

  constructor() { }

  ngOnInit() {

    
   
    this.tableDataCalculo = this.tableData
    

    this.tableDataCalculo = this.tableData
    this.tableOptions = {
      ...this.tableOptions,
      data: this.tableDataCalculo,
    }
    this.isUpdating = false;
    

   
    
  }

}
