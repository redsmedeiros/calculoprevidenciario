import { Component, OnInit } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { CalculoRgpsService } from '../CalculoRgps.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@FadeInTop()
@Component({
  selector: 'app-rgps-calculos-destroy',
  templateUrl: './rgps-calculos-destroy.component.html',
  styleUrls: ['./rgps-calculos-destroy.component.css']
})
export class RgpsCalculosDestroyComponent {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  constructor(
    protected CalculosRgps: CalculoRgpsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    let calculo = this.route.snapshot.params['id_calculo'];
    let user = this.route.snapshot.params['id'];
    swal({
      title: 'Tem certeza?',
      text: "Essa ação é irreversível!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Deletar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.CalculosRgps.find(calculo)
        .then(calculorgps => {
          console.log(calculorgps);
          this.CalculosRgps.destroy(calculorgps)
              .then(() => {
                this.router.navigate(['/rgps/rgps-calculos/'+user]);
                swal('Sucesso', 'Cálculo excluído com sucesso','success');
              }).catch((err) => {
            swal('Erro', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', 'error');
          });
        })
      }else if (result.dismiss === swal.DismissReason.cancel){
        this.router.navigate(['/rgps/rgps-calculos/'+user]);
      }
    });
  }


}
