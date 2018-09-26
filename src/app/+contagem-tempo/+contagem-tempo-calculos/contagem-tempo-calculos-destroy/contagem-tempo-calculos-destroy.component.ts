import { Component, OnInit } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { CalculoContagemTempoService } from '../CalculoContagemTempo.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'app-contagem-tempo-calculos-destroy',
  templateUrl: './contagem-tempo-calculos-destroy.component.html',
  styleUrls: ['./contagem-tempo-calculos-destroy.component.css']
})
export class ContagemTempoCalculosDestroyComponent {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  constructor(
    protected CalculosContagemTempo: CalculoContagemTempoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    let calculo = this.route.snapshot.params['id_calculo'];
    let user = this.route.snapshot.params['id'];

    this.CalculosContagemTempo.find(calculo)
        .then(calculoContagem => {
          console.log(calculoContagem);
          this.CalculosContagemTempo.destroy(calculoContagem)
              .then(() => {
                this.router.navigate(['contagem-tempo/contagem-tempo-calculos/' + user]);
                swal('Sucesso', 'Cálculo excluído com sucesso','success');
              }).catch((err) => {
            swal('Erro', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', 'error');
          });
        })
  }


}
