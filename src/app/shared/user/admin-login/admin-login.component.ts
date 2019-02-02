import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {LayoutService} from "../../layout/layout.service";
import { Auth } from "../../../services/Auth/Auth.service";
import swal from 'sweetalert2'

@Component({

  selector: 'admin-login',
  templateUrl: './admin-login.component.html',
  
})
export class AdminLoginComponent implements OnInit {
  
  @Input() password;
  @Input() isAuth: boolean;
  @Output() isAuthEvent = new EventEmitter<boolean>();
  
  constructor(
    private authService: Auth,
    private layoutService: LayoutService) {
    this.isAuth = this.authService.isAdminAuth ();
  }

  ngOnInit() {
   

  }

  login(event){
    event.preventDefault();
    
    if (!this.password || !this.authService.loginAdmin(this.password)){
      this.isAuth = false ;
      swal('Erro', 'Senha incorreta, tente novamente', 'error');
    }
    else {
      this.isAuth = true ;
      swal('Sucesso', 'Login administrativo realizado com sucesso','success');
    }
    
    this.isAuthEvent.emit(this.isAuth)

  }
  

}
