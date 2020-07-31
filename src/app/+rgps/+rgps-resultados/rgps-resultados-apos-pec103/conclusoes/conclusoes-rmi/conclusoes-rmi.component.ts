import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-conclusoes-rmi',
  templateUrl: './conclusoes-rmi.component.html',
  styleUrls: ['./conclusoes-rmi.component.css']
})
export class ConclusoesRmiComponent implements OnInit {


  @Input() conclusoes;
  @Input() regraLabel;
  @Input() isUpdating;

  constructor() { }

  ngOnInit() {

    // console.log(this.conclusoes);

  }

}
