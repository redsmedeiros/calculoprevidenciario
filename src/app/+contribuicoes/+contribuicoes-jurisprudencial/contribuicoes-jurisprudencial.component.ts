import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import { ContribuicaoJurisprudencialService } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.service';
import { ContribuicaoJurisprudencial } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.model';
import swal from 'sweetalert';



@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contribuicoes-jurisprudencial.component.html',
  providers: [
    ErrorService,
  ],
})
export class ContribuicoesJurisprudencialComponent implements OnInit {

  public dateMask = [/[0-1]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public contribuicaoDe;
  public contribuicaoAte;

  public moeda: Moeda[];

  constructor(private Moeda: MoedaService,
              protected Jurisprudencial: ContribuicaoJurisprudencialService,
              protected errors: ErrorService,
              protected router: Router,
              private route: ActivatedRoute,
    ) {}

  ngOnInit() {

   if (this.route.snapshot.params['id_calculo'] !== undefined) {

      this.Jurisprudencial.find(this.route.snapshot.params['id_calculo']).then(calculo => {
        this.loadCalculo(calculo);
      })
    }

  }

  createNewCalculation() {

    this.validateInputs();

    if (!this.errors.empty()) {
      swal('Erro', 'Confira os dados digitados','error');
      return;
    }

    this.Moeda.getByDateRange('01/' + this.contribuicaoDe, '01/' + this.contribuicaoAte).then((moeda: Moeda[]) => {
      this.moeda = moeda;
      let valorTotal = 0;
      for(let moeda of this.moeda) {
        let aliquota = moeda.salario_minimo * moeda.aliquota;
        let valorCorrigido = moeda.salario_minimo * aliquota * moeda.correcao;
        valorTotal = valorTotal + valorCorrigido;
      }

      let novoCalculo = new ContribuicaoJurisprudencial({id: this.route.snapshot.params['id_calculo'],
                                                         id_segurado: this.route.snapshot.params['id'],
                                                         inicio_atraso: '01/' + this.contribuicaoDe,
                                                         final_atraso: '01/' + this.contribuicaoAte,
                                                         valor_acumulado: valorTotal,});

     if (this.route.snapshot.params['id_calculo'] !== undefined) {

        this.Jurisprudencial.update(novoCalculo).then((data) => {
          swal('Sucesso', 'O Cálculo foi salvo com sucesso','success');
          window.location.href= '/#/contribuicoes/contribuicoes-calculos/'+this.route.snapshot.params['id'];
        }).catch(error => {
          console.log(error);
        });

     } else {

        this.Jurisprudencial.save(novoCalculo).then((data) => {
          swal('Sucesso', 'O Cálculo foi salvo com sucesso','success');
          window.location.href= '/#/contribuicoes/contribuicoes-calculos/'+this.route.snapshot.params['id'];
        }).catch(error => {
          console.log(error);
        });
     }

    })

  }

  loadCalculo(calculo) {

    this.contribuicaoDe = this.formatReceivedDate(calculo.inicio_atraso);
    this.contribuicaoAte = this.formatReceivedDate(calculo.final_atraso);
  }

  validateInputs() {

    this.errors.clear();

    if (this.isEmptyInput(this.contribuicaoDe)) {
      this.errors.add({"contribuicaoDe":["O campo Contribuição De é obrigatório."]});
    } else if (!this.isValidDate(this.contribuicaoDe)) {
      this.errors.add({"contribuicaoDe":["Insira uma data válida (mm/aaaa)."]});
    }

    if (this.isEmptyInput(this.contribuicaoAte)) {
      this.errors.add({"contribuicaoAte":["O campo Contribuição Até é obrigatório."]});
    } else if (!this.isValidDate(this.contribuicaoAte)) {
      this.errors.add({"contribuicaoAte":["Insira uma data válida (mm/aaaa)."]});
    }

    if (this.isValidDate(this.contribuicaoDe) && this.isValidDate(this.contribuicaoAte)) {

      if (!this.compareDates(this.contribuicaoDe, '10/1996')) {
        this.errors.add({"contribuicaoDe":["O sistema calcula contribuições até outubro/1996."]});
      }

      if (!this.compareDates(this.contribuicaoAte, '10/1996')) {
        this.errors.add({"contribuicaoAte":["O sistema calcula contribuições até outubro/1996."]});
      }

      if (this.compareDates(this.contribuicaoDe, '01/1970')) {
        this.errors.add({"contribuicaoDe":["O sistema calcula contribuições a partir de janeiro/1970."]});
      }

      if (this.compareDates(this.contribuicaoAte, '01/1970')) {
        this.errors.add({"contribuicaoAte":["O sistema calcula contribuicoes a partir de janeiro/1970."]});
      }
      
    }

    if (this.errors.empty() && !this.compareDates(this.contribuicaoDe, this.contribuicaoAte)) {
      this.errors.add({"contribuicaoAte":["A contribuicao De deve ser de antes da contribuicao Ate."]});
    }

  }

  isEmptyInput(input) {
    if (input == '' || input === undefined)
      return true;

    return false;
  }

  isValidDate(date) {
    date = '01/' + date;
    var bits = date.split('/');
    var d = new Date(bits[2], bits[1] - 1, bits[0]);
    return d && (d.getMonth() + 1) == bits[1];
  }

  // return true if date1 is before or igual date2
  compareDates(date1, date2) {
    console.log('comparting:', date1, date2);
    var bits1 = date1.split('/');
    var d1 = new Date(bits1[1], bits1[0] - 1, 1);
    var bits2 = date2.split('/');
    var d2 = new Date(bits2[1], bits2[0] - 1, 1);
    console.log('result: ', d1 <= d2);
    return d1 <= d2;
  }

  formatReceivedDate(inputDate) {
      var date = new Date(inputDate);
      if (!isNaN(date.getTime())) {
          // Months use 0 index.
          date.setMonth(date.getMonth()+1);
          return  ('0' + (date.getMonth()+1)).slice(-2)+'/'+
                         date.getFullYear();
      }
      return '';
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
