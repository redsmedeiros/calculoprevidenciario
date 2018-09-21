import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from './../SeguradoContagemTempo.service';
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'app-contagem-tempo-segurados-destroy',
  templateUrl: './contagem-tempo-segurados-destroy.component.html',
  styleUrls: ['./contagem-tempo-segurados-destroy.component.css']
})
export class ContagemTempoSeguradosDestroyComponent implements OnInit {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  constructor(
    protected Segurado: SeguradoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.Segurado.find(this.route.snapshot.params['id'])
      .then(segurado => {
        this.Segurado.destroy(segurado).then(() => {
          this.router.navigate(['/rgps/rgps-segurados']);
          swal('Sucesso', 'Segurado excluído', 'success');
        }).catch((err) => {
          swal('Erro', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', 'error');
        });
      })
  }

  ngOnInit() {
  }

}
