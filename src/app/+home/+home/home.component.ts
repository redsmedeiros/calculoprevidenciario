import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Auth } from "../../services/Auth/Auth.service";
import { AuthResponse } from "../../services/Auth/AuthResponse.model";
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  private isUpdating;
  constructor(
  	private route: ActivatedRoute,
  	private Auth: Auth){}

  ngOnInit() {
    this.isUpdating = true;
  	let user_id = this.route.snapshot.queryParams['user_id'];
  	let user_token = this.route.snapshot.queryParams['user_token'];

  	this.Auth.authenticate(user_id, user_token).then((response:AuthResponse) => {
  		if(response.status){
  			localStorage.setItem('user_id', user_id);
  			localStorage.setItem('user_token', user_token);
        this.isUpdating = false;
  		}else{
  			//redirecionar para pagina de login
  			swal('Erro', 'É necessário estar logado para acessar esta página.', 'error').then(()=> {
        	window.location.href = environment.loginPageUrl;
      	});
  		}
  	}).catch(err => {
      if(err.response.status == 401){
        //redirecionar para pagina de login
        swal('Erro', 'É necessário estar logado para acessar esta página.', 'error').then(()=> {
          window.location.href = environment.loginPageUrl;
        });
      }
  	});
  } 

}
