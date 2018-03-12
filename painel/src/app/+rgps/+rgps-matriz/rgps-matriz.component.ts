import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {NgForm} from '@angular/forms';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-matriz.component.html',
})


export class RgpsMatrizComponent implements OnInit {

  

  teste: string;

  input = [];

  

  matriz = [
    {
      "ano": 1995,
      "valores": [
        1230.23,
        1523.85,
        1549.12,
        1654.58,
        2487.23,
        1982.63,
        1754.85,
        3546.85,
        2459.45,
        1468.91,
        2146.85,
        1793.25
      ]
    },
    {
      "ano": 1996,
      "valores": [
        1230.23,
        1523.85,
        1549.12,
        1654.58,
        2487.23,
        1982.63,
        1754.85,
        3546.85,
        2459.45,
        1468.91,
        2146.85,
        1793.25
      ]
    }
  ];

  onSubmit(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
    this.matriz.push(
      {
        "ano": this.randomInt(1990, 2018),
        "valores": [
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
          this.randomInt(500, 20180),
        ]
      }
    );
    
  }

  onKey(ano, mes, valor) { // without type info
    console.log(ano + "," + mes + "," +  valor);
  }
  randomInt(min, max){
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  constructor() {
    this.teste;
  }

  ngOnInit() {
    console.log(this.input);
    
  }

}
