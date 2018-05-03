import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
