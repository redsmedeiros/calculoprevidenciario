import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { ContribuicaoJurisprudencialService } from '../ContribuicaoJurisprudencial.service';
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'app-contribuicoes-calculos-destroy',
  templateUrl: './contribuicoes-calculos-destroy.component.html',
  styleUrls: ['./contribuicoes-calculos-destroy.component.css']
})
export class ContribuicoesCalculosDestroyComponent implements OnInit {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  constructor(
    protected ContribuicaoJurisprudencial: ContribuicaoJurisprudencialService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    let calculo = this.route.snapshot.params['id_calculo'];
    let user = this.route.snapshot.params['id'];
    this.ContribuicaoJurisprudencial.find(calculo)
        .then(contribuicaoJurisprudencial => {
          this.ContribuicaoJurisprudencial.destroy(contribuicaoJurisprudencial)
              .then(() => this.router.navigate(['/contribuicoes/contribuicoes-calculos/'+user]));
        })
    swal('Sucesso', 'Cálculo excluído com sucesso','success');
  }

  ngOnInit() {
  }

}
