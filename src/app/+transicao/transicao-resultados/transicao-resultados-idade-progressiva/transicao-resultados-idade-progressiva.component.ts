import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { TransicaoResultadosComponent } from './../transicao-resultados.component';

@Component({
  selector: 'app-transicao-resultados-idade-progressiva',
  templateUrl: './transicao-resultados-idade-progressiva.component.html',
  styleUrls: ['./transicao-resultados-idade-progressiva.component.css']
})
export class TransicaoResultadosIdadeProgressivaComponent extends TransicaoResultadosComponent implements OnInit {

  @Input() seguradoTransicao;





  public requisitoIdadeProgressivaRegra2 = {
    2019: { m: 61, md: 22265, f: 56, fd: 20440 },
    2020: { m: 61.5, md: 22447.5, f: 56.5, fd: 20622.5 },
    2021: { m: 62, md: 22630, f: 57, fd: 20805 },
    2022: { m: 62.5, md: 22812.5, f: 57.5, fd: 20987.5 },
    2023: { m: 63, md: 22995, f: 58, fd: 21170 },
    2024: { m: 63.5, md: 23177.5, f: 58.5, fd: 21352.5 },
    2025: { m: 64, md: 23360, f: 59, fd: 21535 },
    2026: { m: 64.5, md: 23542.5, f: 59.5, fd: 21717.5 },
    2027: { m: 65, md: 23725, f: 60, fd: 21900 },
    2028: { m: 65, md: 23725, f: 60.5, fd: 22082.5 },
    2029: { m: 65, md: 23725, f: 61, fd: 22265 },
    2030: { m: 65, md: 23725, f: 61.5, fd: 22447.5 },
    2031: { m: 65, md: 23725, f: 62, fd: 22630 },
  }


  
  public conclusoesRegra2 = {
    status: false,
    percentual: '',
    formula: '',
    requisitoDib: '',
    idadeDib: '',
    tempoDib: '',
    dataDib: ''
  };

  public isUpdating;



  constructor() {
    super();
  }




  ngOnInit() {
    
    this.isUpdating = true;
    this.conclusaoRegra2Pontos();

  }

  conclusaoRegra2Pontos(){

    

    try {


      this.isUpdating = false;

    } catch (error) {
      console.log(error);
    }


  }



}
