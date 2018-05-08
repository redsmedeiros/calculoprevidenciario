import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../Segurado.service';
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'app-beneficios-segurados-destroy',
  templateUrl: './beneficios-segurados-destroy.component.html',
  styleUrls: ['./beneficios-segurados-destroy.component.css']
})
export class BeneficiosSeguradosDestroyComponent implements OnInit {

  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  constructor(
    protected Segurado: SeguradoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
          this.Segurado.destroy(segurado)
              .then(() => this.router.navigate(['/beneficios/beneficios-segurados']));
        })
    swal(
      'Sucesso',
      'Segurado excluído',
      'success'
    )

  }

  ngOnInit() {
  }

}
