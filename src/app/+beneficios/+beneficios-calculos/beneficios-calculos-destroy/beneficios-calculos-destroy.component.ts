import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { CalculoAtrasadoService } from '../CalculoAtrasado.service';
import swal from 'sweetalert2';

@FadeInTop()
@Component({
  selector: 'app-beneficios-calculos-destroy',
  templateUrl: './beneficios-calculos-destroy.component.html',
  styleUrls: ['./beneficios-calculos-destroy.component.css']
})
export class BeneficiosCalculosDestroyComponent implements OnInit {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  constructor(
    protected CalculosAtrasado: CalculoAtrasadoService,
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
        this.CalculosAtrasado.find(calculo)
        .then(CalculoAtrasado => {
          this.CalculosAtrasado.destroy(CalculoAtrasado)
              .then(() => this.router.navigate(['/beneficios/beneficios-calculos/'+user]));
               swal('Sucesso', 'Cálculo excluído com sucesso','success');
        })
      }else if (result.dismiss === swal.DismissReason.cancel){
        this.router.navigate(['/beneficios/beneficios-calculos/'+user])
      }
    });
    
   
  }

  ngOnInit() {
  }

}
