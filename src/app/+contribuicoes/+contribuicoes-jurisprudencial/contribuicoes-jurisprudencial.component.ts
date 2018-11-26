import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { MoedaService } from '../../services/Moeda.service';
import { Moeda } from '../../services/Moeda.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import { ContribuicaoJurisprudencialService } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.service';
import { ContribuicaoJurisprudencial } from '../+contribuicoes-calculos/ContribuicaoJurisprudencial.model';
import swal from 'sweetalert';
import * as moment from 'moment'


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
  public contribuicaoDe2;
  public contribuicaoAte2;

  public moeda: Moeda[];
  public moeda2: Moeda[];

  private dataMinima = moment('01-1970', 'MM-YYYY');
  private dataMaxima = moment('10-1996', 'MM-YYYY');
  private idSegurado = '';

  constructor(private Moeda: MoedaService,
              protected Jurisprudencial: ContribuicaoJurisprudencialService,
              protected errors: ErrorService,
              protected router: Router,
              private route: ActivatedRoute,
    ) {}

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id'];
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

    //this.Moeda.getByDateRange('01/' + this.contribuicaoDe, '01/' + this.contribuicaoAte).then((moeda: Moeda[]) => {
    this.Moeda.getByDateRangeMoment(moment(this.contribuicaoDe,'MM/YYYY'), moment(this.contribuicaoAte, 'MM/YYYY')).then((moeda: Moeda[]) => {
      this.moeda = moeda;
      let valorTotal = 0;
      for(let moeda of this.moeda) {
        let aliquota = moeda.salario_minimo * moeda.aliquota;
        let valorCorrigido =  aliquota * moeda.cam;
        valorTotal = valorTotal + valorCorrigido;
      }


      let inicio2 = (this.contribuicaoDe2) ? '01/' + this.contribuicaoDe2 : '';
      let fim2 = (this.contribuicaoAte2) ? '01/' + this.contribuicaoAte2 : '';
      if(inicio2 && fim2){
        console.log(inicio2, fim2)
        this.Moeda.getByDateRangeMoment(moment(this.contribuicaoDe2,'DD/MM/YYYY'), moment(this.contribuicaoAte2, 'DD/MM/YYYY')).then((moeda: Moeda[]) => {
          this.moeda2 = moeda;
          for(let moeda of this.moeda2) {
            let aliquota = moeda.salario_minimo * moeda.aliquota;
            let valorCorrigido =  aliquota * moeda.cam;
            valorTotal = valorTotal + valorCorrigido;
          }

          let novoCalculo = new ContribuicaoJurisprudencial({id: this.route.snapshot.params['id_calculo'],
            id_segurado: this.route.snapshot.params['id'],
            inicio_atraso: '01/' + this.contribuicaoDe,
            final_atraso: '01/' + this.contribuicaoAte,
            inicio_atraso2: inicio2,
            final_atraso2: fim2,
            valor_acumulado: valorTotal,});
          if (this.route.snapshot.params['id_calculo'] !== undefined) {
            this.Jurisprudencial.update(novoCalculo).then((data:ContribuicaoJurisprudencial) => {
              this.Jurisprudencial.get().then(() =>{
                swal('Sucesso', 'O Cálculo foi salvo com sucesso','success').then(() =>{
                  window.location.href='/#/contribuicoes/'+data.id_segurado+'/contribuicoes-resultados/'+data.id;
                });
              });
            }).catch(error => {
              console.log(error);
            });
          } else {
            this.Jurisprudencial.save(novoCalculo).then((data:ContribuicaoJurisprudencial) => {
              this.Jurisprudencial.get().then(() =>{
                swal('Sucesso', 'O Cálculo foi salvo com sucesso','success').then(() => {
                  window.location.href='/#/contribuicoes/'+data.id_segurado+'/contribuicoes-resultados/'+data.id;
                });
              });
            }).catch(error => {
               console.log(error);
            });
          }
        });
      }else{
        let novoCalculo = new ContribuicaoJurisprudencial({id: this.route.snapshot.params['id_calculo'],
        id_segurado: this.route.snapshot.params['id'],
        inicio_atraso: '01/' + this.contribuicaoDe,
        final_atraso: '01/' + this.contribuicaoAte,
        inicio_atraso2: inicio2,
        final_atraso2: fim2,
        valor_acumulado: valorTotal,});

        if (this.route.snapshot.params['id_calculo'] !== undefined) {
          this.Jurisprudencial.update(novoCalculo).then((data:ContribuicaoJurisprudencial) => {
            this.Jurisprudencial.get().then(() =>{
              swal('Sucesso', 'O Cálculo foi salvo com sucesso','success').then(() =>{
                window.location.href='/#/contribuicoes/'+data.id_segurado+'/contribuicoes-resultados/'+data.id;
              });
            });
          }).catch(error => {
            console.log(error);
          });
        }else{
          this.Jurisprudencial.save(novoCalculo).then((data:ContribuicaoJurisprudencial) => {
            this.Jurisprudencial.get().then(() =>{
              swal('Sucesso', 'O Cálculo foi salvo com sucesso','success').then(() => {
                window.location.href='/#/contribuicoes/'+data.id_segurado+'/contribuicoes-resultados/'+data.id;
              });
            });
          }).catch(error => {
            console.log(error);
          });
        }
      }
    });
  }

  loadCalculo(calculo) {

    this.contribuicaoDe = this.formatReceivedDate(calculo.inicio_atraso);
    this.contribuicaoAte = this.formatReceivedDate(calculo.final_atraso);
    this.contribuicaoDe2 = this.formatReceivedDate(calculo.inicio_atraso2);
    this.contribuicaoAte2 = this.formatReceivedDate(calculo.final_atraso2);
  }

  validateInputs() {

    this.errors.clear();
    let temSegundoPeriodo = false;
    if (this.isEmptyInput(this.contribuicaoDe)) {
      this.errors.add({"contribuicaoDe":["O campo Contribuição De é obrigatório."]});
    } else if (!this.isValidDate(this.contribuicaoDe)) {
      this.errors.add({"contribuicaoDe":["Insira uma data válida (mm/aaaa)."]});
    }else{
      let inicioDate = moment(this.contribuicaoDe, 'MM/YYYY');
      if (inicioDate > this.dataMaxima) {
        this.errors.add({"contribuicaoDe":["O sistema calcula contribuições até outubro/1996."]});
      }
      if (inicioDate < this.dataMinima) {
        this.errors.add({"contribuicaoDe":["O sistema calcula contribuições a partir de janeiro/1970."]});
      }
    }

    if (this.isEmptyInput(this.contribuicaoAte)) {
      this.errors.add({"contribuicaoAte":["O campo Contribuição Até é obrigatório."]});
    } else if (!this.isValidDate(this.contribuicaoAte)) {
      this.errors.add({"contribuicaoAte":["Insira uma data válida (mm/aaaa)."]});
    }else{
      let finalDate = moment(this.contribuicaoAte, 'MM/YYYY'); 
      if (finalDate > this.dataMaxima) {
        this.errors.add({"contribuicaoAte":["O sistema calcula contribuições até outubro/1996."]});
      }
      if (finalDate < this.dataMinima) {
        this.errors.add({"contribuicaoAte":["O sistema calcula contribuicoes a partir de janeiro/1970."]});
      }
    }

    if (!this.isEmptyInput(this.contribuicaoDe2) || !this.isEmptyInput(this.contribuicaoAte2)) {
      if (this.isEmptyInput(this.contribuicaoDe2)) {
        this.errors.add({"contribuicaoDe2":["Preencha ambos ou nenhum campo do segundo período"]});
      } else if (!this.isValidDate(this.contribuicaoDe2)) {
        this.errors.add({"contribuicaoDe2":["Insira uma data válida (mm/aaaa)."]});
      }else{
        let inicioDate = moment(this.contribuicaoDe2, 'MM/YYYY');
        if (inicioDate > this.dataMaxima) {
          this.errors.add({"contribuicaoDe2":["O sistema calcula contribuições até outubro/1996."]});
        }
        if (inicioDate < this.dataMinima) {
          this.errors.add({"contribuicaoDe2":["O sistema calcula contribuições a partir de janeiro/1970."]});
        }
      }

      if (this.isEmptyInput(this.contribuicaoAte2)) {
        this.errors.add({"contribuicaoAte2":["Preencha ambos ou nenhum campo do segundo período"]});
      }else if(!this.isValidDate(this.contribuicaoAte2)) {
        this.errors.add({"contribuicaoAte2":["Insira uma data válida (mm/aaaa)."]});
      }else{
        let finalDate = moment(this.contribuicaoAte2, 'MM/YYYY'); 
        if (finalDate > this.dataMaxima) {
          this.errors.add({"contribuicaoAte2":["O sistema calcula contribuições até outubro/1996."]});
        }
        if (finalDate < this.dataMinima) {
          this.errors.add({"contribuicaoAte2":["O sistema calcula contribuicoes a partir de janeiro/1970."]});
        }
      }
      if (this.errors.empty()) {
        temSegundoPeriodo = true;
      }
    }

    if (this.errors.empty()) {
      let inicioPeriodo1 = moment(this.contribuicaoDe, 'MM/YYYY');
      let finalPeriodo1 = moment(this.contribuicaoAte, 'MM/YYYY');
      if(inicioPeriodo1 >= finalPeriodo1){
        this.errors.add({"contribuicaoAte":["O final do periodo deve ser de antes do início."]});
      }

      if(temSegundoPeriodo){
        let inicioPeriodo2 = moment(this.contribuicaoDe2, 'MM/YYYY');
        let finalPeriodo2 = moment(this.contribuicaoAte2, 'MM/YYYY');
        if(inicioPeriodo2 >= finalPeriodo2){
          this.errors.add({"contribuicaoAte2":["O final do periodo deve ser de antes do início."]});
        }
        if(inicioPeriodo2 <= finalPeriodo1 || inicioPeriodo2 <= inicioPeriodo1){
          this.errors.add({"contribuicaoDe2":["O segundo periodo deve ser posterior ao primeiro."]});
        }
        if(finalPeriodo2 <= finalPeriodo1 || finalPeriodo2 <= inicioPeriodo1){
          this.errors.add({"contribuicaoAte2":["O segundo periodo deve ser posterior ao primeiro."]});
        }
      }
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

  dateMask(rawValue){
    if(rawValue == ''){
      return [/[0-1]/, /\d/, '/', /[1-2]/, /[0|9]/, /\d/, /\d/];
    }
    let mask = [];
    mask.push(/[0-1]/);

    if (rawValue[0] == 1){
      mask.push(/[0-2]/);
    }else if(rawValue[0] == 0){
      mask.push(/[1-9]/);
    }

    mask.push('/');
    mask.push( /[1-2]/);
    
    if (rawValue[3] == 1){
      mask.push(/[9]/);
    }else if(rawValue[3] == 2){
      mask.push(/[0]/);
    }
    mask.push(/\d/);
    mask.push( /\d/);
    return mask;
  }

}
