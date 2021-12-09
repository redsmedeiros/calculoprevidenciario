import { Injectable } from "@angular/core";
import {
  Routes, Router, RouterModule, CanActivate, CanActivateChild, ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { environment } from '../environments/environment';
import { Auth } from "./services/Auth/Auth.service";
import { AuthResponse } from "./services/Auth/AuthResponse.model";
import swal from 'sweetalert';
import loadingAlert from 'sweetalert2'

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate, CanActivateChild {
  constructor(private Auth: Auth, private router: Router) { }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let params = route.queryParams;
    let product = params.product || localStorage.getItem('product');
    let type = params.type || localStorage.getItem('type');
    let user_id = params.user_id || localStorage.getItem('user_id');
    let user_token = params.user_token || localStorage.getItem('user_token');
    let plan = params.plan || sessionStorage.getItem('plan');

    loadingAlert({
      title: 'Aguarde por favor...',
      allowOutsideClick: false,
      timer: 2000
    });

    loadingAlert.showLoading();


    return new Promise((resolve) => {
      if (user_id && user_token) {

        //Caso haja parametros via query string, limpa a url
        if (!(Object.keys(params).length === 0 && params.constructor === Object)) {
          localStorage.setItem('user_id', user_id);
          localStorage.setItem('user_token', user_token);
          localStorage.setItem('product', product);
          localStorage.setItem('type', type);
          sessionStorage.setItem('plan', plan);
          this.router.navigate(['.'], { queryParams: {}, queryParamsHandling: "merge", });
          resolve(false);
        }

        this.Auth.authenticate(user_id, user_token, product, type).then((response: AuthResponse) => {
       
          if (response.status) {
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('user_token', user_token);
            localStorage.setItem('product', product);
            localStorage.setItem('type', type);
            sessionStorage.setItem('plan', plan);
            resolve(true);
          } else {
            loadingAlert.close();
            //redirecionar para pagina de login
            swal('Erro (CAC0)', 'É necessário estar logado para acessar esta página.', 'error').then(() => {
              window.location.href = environment.loginPageUrl;
            });
            resolve(false);
          }

        }).catch(err => {
          if (err.response.status == 401) {
            loadingAlert.close();
            //redirecionar para pagina de login
            swal('Erro (CAC1)', 'É necessário estar logado para acessar esta página.', 'error').then(() => {
              window.location.href = environment.loginPageUrl;
            });
            resolve(false);
          }
        });
      } else {
        loadingAlert.close();
        swal('Erro (CAC2)', 'É necessário estar logado para acessar esta página.', 'error').then(() => {
          window.location.href = environment.loginPageUrl;
        });
        resolve(false);
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let params = route.queryParams;
    let product = params.product || localStorage.getItem('product');
    let type = params.type || localStorage.getItem('type');
    let user_id = params.user_id || localStorage.getItem('user_id');
    let user_token = params.user_token || localStorage.getItem('user_token');
    let plan = params.plan || localStorage.getItem('plan');

    loadingAlert({
      title: 'Aguarde por favor...',
      allowOutsideClick: false,
      timer: 2000
    });  

    loadingAlert.showLoading();

    return new Promise((resolve) => {
      if (user_id && user_token) {
        //Caso haja parametros via query string, limpa a url
        if (!(Object.keys(params).length === 0 && params.constructor === Object)) {
          localStorage.setItem('user_id', user_id);
          localStorage.setItem('user_token', user_token);
          localStorage.setItem('product', product);
          localStorage.setItem('type', type);
          sessionStorage.setItem('plan', plan);
          this.router.navigate(['.'], { queryParams: {}, queryParamsHandling: "merge", });
          resolve(false);
        }

        this.Auth.authenticate(user_id, user_token, product, type).then((response: AuthResponse) => {
          if (response.status) {
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('user_token', user_token);
            localStorage.setItem('product', product);
            localStorage.setItem('type', type);
            sessionStorage.setItem('plan', plan);
            resolve(true);
          }
        }).catch(err => {
          if (err.response.status == 401) {
            //redirecionar para pagina de login
            loadingAlert.close();
            swal('Erro (CA1)', 'É necessário estar logado para acessar esta página.', 'error').then(() => {
              window.location.href = environment.loginPageUrl;
            });
            resolve(false);
          }
        });
      } else {
        loadingAlert.close();
        swal('Erro (CA2)', 'É necessário estar logado para acessar esta página.', 'error').then(() => {
          window.location.href = environment.loginPageUrl;
        });
        resolve(false);
      }
    });
  }
}