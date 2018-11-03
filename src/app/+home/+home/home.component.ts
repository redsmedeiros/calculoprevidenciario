import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { environment } from '../../../environments/environment';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  	if(!localStorage.getItem('user_id')){
      swal('Erro', 'Falha de login!','error').then(() => {window.location.href = environment.loginPageUrl;});
    }
  }

}
