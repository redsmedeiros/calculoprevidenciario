import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../../Segurado.service';

@FadeInTop()
@Component({
  selector: 'app-contribuicoes-segurados-destroy',
  templateUrl: './contribuicoes-segurados-destroy.component.html',
  styleUrls: ['./contribuicoes-segurados-destroy.component.css']
})
export class ContribuicoesSeguradosDestroyComponent implements OnInit {

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
              .then(() => this.router.navigate(['/contribuicoes/contribuicoes-segurados']));
        })
  }

  ngOnInit() {
  }

}
