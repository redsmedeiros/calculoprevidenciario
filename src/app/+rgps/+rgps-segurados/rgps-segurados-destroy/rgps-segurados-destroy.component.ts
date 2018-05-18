import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../SeguradoRgps.service';
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'app-rgps-segurados-destroy',
  templateUrl: './rgps-segurados-destroy.component.html',
  styleUrls: ['./rgps-segurados-destroy.component.css']
})
export class RgpsSeguradosDestroyComponent implements OnInit {

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
