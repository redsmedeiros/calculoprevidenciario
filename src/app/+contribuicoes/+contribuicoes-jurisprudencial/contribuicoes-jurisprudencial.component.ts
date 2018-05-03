import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import { ContribuicaoJurisprudencialService } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.service'
import { ContribuicaoJurisprudencial } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.model'


@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contribuicoes-jurisprudencial.component.html',
  providers: [
    ErrorService,
  ],
})
export class ContribuicoesJurisprudencialComponent implements OnInit {

  public contribuicaoDe;
  public contribuicaoAte;

  public moeda: Moeda[];

  constructor(private Moeda: MoedaService,
              protected Jurisprudencial: ContribuicaoJurisprudencialService,
              protected router: Router,
              private route: ActivatedRoute,
    ) {}

  ngOnInit() {
  }

  createNewCalculation() {

    this.Moeda.getByDateRange('01/' + this.contribuicaoDe, '01/' + this.contribuicaoAte).then((moeda: Moeda[]) => {
      this.moeda = moeda;
      let valorTotal = 0;
      for(let moeda of this.moeda) {
        let aliquota = moeda.salario_minimo * moeda.aliquota;
        let valorCorrigido = moeda.salario_minimo * aliquota * moeda.correcao;
        valorTotal = valorTotal + valorCorrigido;
      }

      let novoCalculo = new ContribuicaoJurisprudencial({id_segurado: this.route.snapshot.params['id'],
                                                         inicio_atraso: '01/' + this.contribuicaoDe,
                                                         final_atraso: '01/' + this.contribuicaoAte,
                                                         valor_acumulado: valorTotal,});

      this.Jurisprudencial.save(novoCalculo).then((data) => {
        window.location.href= '/#/contribuicoes/contribuicoes-calculos/'+this.route.snapshot.params['id'];
      }).catch(error => {
        console.log(error);
      });
    })

  }


  calculateMonth() {

    var from = new Date('01/' + this.contribuicaoDe);
    var to = new Date('01/' + this.contribuicaoAte);

    for (
          var current = new Date(from);
          current.getTime() <= to.getTime();
          current.setMonth(current.getMonth() + 1)
    ) {

      this.Moeda.get()
        .then(() => {

      })
      console.log(current);

    }
  }

}
