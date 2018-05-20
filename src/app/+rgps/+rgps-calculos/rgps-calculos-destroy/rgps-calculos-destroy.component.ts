import { Component, OnInit } from '@angular/core';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { CalculoRgpsService } from '../CalculoRgps.service';

import swal from 'sweetalert';


@FadeInTop()
@Component({
  selector: 'app-rgps-calculos-destroy',
  templateUrl: './rgps-calculos-destroy.component.html',
  styleUrls: ['./rgps-calculos-destroy.component.css']
})
export class RgpsCalculosDestroyComponent {

  constructor(
    protected Calculo: CalculoRgpsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.Calculo.find(this.route.snapshot.params['id_calculo'])
        .then(calculo => {
          this.Calculo.destroy(calculo)
              .then(() => this.router.navigate(['/rgps/rgps-segurados']));
        })
    swal(
      'Sucesso',
      'Calculo excluído',
      'success'
    )

  }


}
