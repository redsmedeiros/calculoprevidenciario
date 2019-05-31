import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { ContribuicaoJurisprudencialService } from '../ContribuicaoJurisprudencial.service';
import swal from 'sweetalert2';

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
        this.ContribuicaoJurisprudencial.find(this.route.snapshot.params['id_calculo'])
        .then(contribuicaoJurisprudencial => {
          this.ContribuicaoJurisprudencial.destroy(contribuicaoJurisprudencial)
              .then(() => {

                this.router.navigate(['/contribuicoes/contribuicoes-calculos/'+user]);
                swal('Sucesso', 'Cálculo excluído com sucesso','success');
                
              }).catch((err) => {
            swal('Erro', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', 'error');
          });
              
        })
      }else if (result.dismiss === swal.DismissReason.cancel){
        this.router.navigate(['/contribuicoes/contribuicoes-calculos/'+user]);
      }
    });   
  }

  ngOnInit() {
  }

}
