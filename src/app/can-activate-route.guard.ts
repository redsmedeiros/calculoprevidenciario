import { Injectable } from "@angular/core";
import {Routes, Router, RouterModule, CanActivate, CanActivateChild, ActivatedRouteSnapshot,
RouterStateSnapshot} from '@angular/router';
import { environment } from '../environments/environment';
import { Auth } from "./services/Auth/Auth.service";
import { AuthResponse } from "./services/Auth/AuthResponse.model";
import swal from 'sweetalert';

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate, CanActivateChild {
  constructor(private Auth: Auth , private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    console.log("canActivateChild");
    let params = route.queryParams;
    let product = localStorage.getItem('product') || params.product;
    let type = localStorage.getItem('type') || params.type;
    let user_id = params.user_id || localStorage.getItem('user_id');
    let user_token = localStorage.getItem('user_token') || params.user_token;
    
    return new Promise((resolve) => {
      if (user_id && user_token) {

        //Caso haja parametros via query string, limpa a url
        if(!(Object.keys(params).length === 0 && params.constructor === Object)){
          console.log('entrou')
          localStorage.setItem('user_id', user_id);
          localStorage.setItem('user_token', user_token);
          localStorage.setItem('product', product);
          localStorage.setItem('type', type);
          this.router.navigate(['.'], {queryParams: {}, queryParamsHandling: "merge",});
          resolve(false)
        }

        this.Auth.authenticate(user_id, user_token, product, type).then((response:AuthResponse) => {
          if(response.status){
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('user_token', user_token);
            localStorage.setItem('product', product);
            localStorage.setItem('type', type);
            resolve(true);
          }
        }).catch(err => {
          if(err.response.status == 401){
            //redirecionar para pagina de login
            swal('Erro', 'É necessário estar logado para acessar esta página.', 'error').then(()=> {
              window.location.href = environment.loginPageUrl;
            });
            resolve(false);
          }
        });
      } else {
        swal('Erro', 'É necessário estar logado para acessar esta página.', 'error').then(()=> {
              window.location.href = environment.loginPageUrl;
            });
        resolve(false);
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Promise<boolean> {
    console.log("canActivate");
    let params = route.queryParams;
    let product = localStorage.getItem('product') || params.product;
    let type = localStorage.getItem('type') || params.type;
    let user_id = params.user_id || localStorage.getItem('user_id');
    let user_token = localStorage.getItem('user_token') || params.user_token;

    return new Promise((resolve) => {
      if (user_id && user_token) {
        
        //Caso haja parametros via query string, limpa a url
        if(!(Object.keys(params).length === 0 && params.constructor === Object)){
          console.log('entrou')
          localStorage.setItem('user_id', user_id);
          localStorage.setItem('user_token', user_token);
          localStorage.setItem('product', product);
          localStorage.setItem('type', type);
          this.router.navigate(['.'], {queryParams: {}, queryParamsHandling: "merge",});
          resolve(false)
        }

        this.Auth.authenticate(user_id, user_token, product, type).then((response:AuthResponse) => {
          if(response.status){
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('user_token', user_token);
            localStorage.setItem('product', product);
            localStorage.setItem('type', type);
            resolve(true);
          }
        }).catch(err => {
          if(err.response.status == 401){
            //redirecionar para pagina de login
            swal('Erro', 'É necessário estar logado para acessar esta página.', 'error').then(()=> {
              window.location.href = environment.loginPageUrl;
            });
            resolve(false);
          }
        });
      } else {
        swal('Erro', 'É necessário estar logado para acessar esta página.', 'error').then(()=> {
              window.location.href = environment.loginPageUrl;
            });
        resolve(false);
      }
    });
  }
}