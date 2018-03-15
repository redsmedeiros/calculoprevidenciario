import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contribuicoes-calculos.component.html',
})
export class ContribuicoesCalculosComponent implements OnInit {




  public state: any = {
    tabs: {
      demo1: 0,
      demo2: 'tab-r1',
      demo3: 'hr1',
      demo4: 'AA',
      demo5: 'iss1',
      demo6: 'l1',
      demo7: 'tab1',
      demo8: 'hb1',
      demo9: 'A1',
      demo10: 'is1'
    },

    carousel: {
      demo1: {
        interval: 2000,
        noWrap: false,
        slides: [
          {
            title: 'Title 1',
            text: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.',
            src: 'assets/img/demo/m3.jpg',
          },
          {
            title: 'Title 2',
            text: 'Dolores justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.',
            src: 'assets/img/demo/m2.jpg',
          },
          {
            title: 'Title 3',
            text: 'Lorem justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.',
            src: 'assets/img/demo/m1.jpg',
          },
        ]
      },
      demo2: {
        interval: 3000,
        noWrap: false,
        slides: [
          {
            title: 'Title 2',
            text: 'Dolores justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.',
            src: 'assets/img/demo/m2.jpg',
          },
          {
            title: 'Title 1',
            text: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.',
            src: 'assets/img/demo/m3.jpg',
          },
          {
            title: 'Title 3',
            text: 'Lorem justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.',
            src: 'assets/img/demo/m1.jpg',
          },
        ]
      }
    }
  };


  


  constructor() {}

  ngOnInit() {
  }

}
