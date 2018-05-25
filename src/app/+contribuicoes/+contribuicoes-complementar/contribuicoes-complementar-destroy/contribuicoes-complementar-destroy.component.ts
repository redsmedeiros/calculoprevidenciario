import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { ContribuicaoComplementarService } from '../ContribuicaoComplementar.service';
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'app-contribuicoes-complementar-destroy',
  templateUrl: './contribuicoes-complementar-destroy.component.html',
  styleUrls: ['./contribuicoes-complementar-destroy.component.css']
})
export class ContribuicoesComplementarDestroyComponent {

  constructor(
  	protected ContribuicaoComplementar: ContribuicaoComplementarService,
    private route: ActivatedRoute,
    private router: Router
  	) { 
  	let calculo = this.route.snapshot.params['id_calculo'];
    let user = this.route.snapshot.params['id'];
    this.ContribuicaoComplementar.find(calculo)
        .then(contribuicaoComplementar => {
          this.ContribuicaoComplementar.destroy(contribuicaoComplementar)
              .then(() => this.router.navigate(['/contribuicoes/contribuicoes-calculos/'+user]));
        })
    swal('Sucesso', 'Cálculo excluído com sucesso','success');

  }
}
