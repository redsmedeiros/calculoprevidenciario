import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../../utils/notification.service";

declare var $:any;

@Component({
  selector: 'sa-logout',
//   template: `
// <div id="logout" (click)="showPopup()" class="btn-header transparent pull-right">
//         <span> <a routerlink="/auth/login" title="Sign Out" data-action="userLogout"
//                   data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i
//           class="fa fa-sign-out"></i></a> </span>
//     </div>
//   `,
  template:'',
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private notificationService: NotificationService) { }

  showPopup(){
    this.notificationService.smartMessageBox({
      title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
      content : "Você pode melhorar sua segurança fechando o browser após sair.",
      buttons : '[Não][Sim]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {
        this.logout()
      }
    });
  }

  logout(){
      this.router.navigate(['/auth/login'])
  }

  ngOnInit() {

  }



}
