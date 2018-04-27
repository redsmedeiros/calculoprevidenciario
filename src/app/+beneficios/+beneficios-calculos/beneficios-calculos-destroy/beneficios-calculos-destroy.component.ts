import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { CalculoAtrasadoService } from '../../CalculoAtrasado.service';

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
    this.CalculosAtrasado.find(this.route.snapshot.params['id'])
        .then(CalculoAtrasado => {
          this.CalculosAtrasado.destroy(CalculoAtrasado)
              .then(() => this.router.navigate(['/beneficios/beneficios-segurados']));
        })
  }

  ngOnInit() {
  }

}
