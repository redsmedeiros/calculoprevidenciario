
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2'
import { environment } from './../../environments/environment';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

    swal({
      title: 'Deseja sair do sistema?',
      text: 'Imformações não salvas podem ser perdidas.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sair&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
      cancelButtonText: 'Voltar ao Início'
    }).then((result) => {
      if (result.value) {

        this.limparSessionUser(result.value);

      } else if (result.dismiss === swal.DismissReason.cancel) {

        this.router.navigate(['/home/home']);

      }
    })

  }


  private limparSessionUser(rst) {

    if (rst) {
          localStorage.clear();
          window.location.href = environment.loginPageUrl;
    }


  }

}
