import { Component, OnInit, ViewChild } from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import swal from 'sweetalert';
import { SeguradoService } from '../+contagem-tempo-segurados/SeguradoContagemTempo.service';
import { SeguradoContagemTempo as SeguradoModel } from '../+contagem-tempo-segurados/SeguradoContagemTempo.model';
import { CalculoContagemTempo  as CalculoModel } from '../+contagem-tempo-calculos/CalculoContagemTempo.model';
import { CalculoContagemTempoService } from '../+contagem-tempo-calculos/CalculoContagemTempo.service';
import { PeriodosContagemTempo } from './PeriodosContagemTempo.model';
import { ContagemTempoPeriodosListaComponent } from './contagem-tempo-periodos-lista/contagem-tempo-periodos-lista.component';
import { PeriodosContagemTempoService } from './PeriodosContagemTempo.service';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contagem-tempo-periodos.component.html',
  providers: [
    ErrorService
  ]
})


export class ContagemTempoPeriodosComponent implements OnInit {
  @ViewChild('contribuicoesPrimarias') matrizContribuicoesPrimarias: ContagemTempoPeriodosListaComponent;
  @ViewChild('contribuicoesSecundarias') matrizContribuicoesSecundarias: ContagemTempoPeriodosListaComponent;

  public isUpdating = false;
  public mostrarBotaoRealizarCalculos = true;
  public idSegurado = '';
  public idsCalculos = '';

  public segurado: any = {};
  public calculo: any = {};
  public calculoList = [];

  public grupoCalculosTableOptions = {
    colReorder: false,
    paging: false,
    ordering: false,
    info: false,
    searching: false,
    data: this.calculoList,
    columns: [
      { data: 'referencia_calculo' },
      { data: 'total_dias' },
      { data: 'total_carencia' },
      {
        data: 'created_at',
        render: (data) => {
          return this.formatReceivedDate(data);
        }
      }
    ]
  };

  public inicioPeriodo = '';
  public finalPeriodo = '';
  public salarioContribuicao = undefined;
  public tipoContribuicao = 'Primaria';

  constructor(
                protected router: Router,
                private route: ActivatedRoute,
                protected Segurado: SeguradoService,
                protected CalculoContagemTempoService: CalculoContagemTempoService,
                protected PeriodosContagemTempoService: PeriodosContagemTempoService,
                protected errors: ErrorService
                ) {
              }

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.idsCalculos = this.route.snapshot.params['id'].split(',');
    this.isUpdating = true;
    this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.segurado = segurado;
        if (this.idsCalculos.length == 1) {
          this.CalculoContagemTempoService.find(this.idsCalculos[0])
            .then(calculo => {
              this.calculo = calculo;
              this.updateDatatable(calculo);
              this.PeriodosContagemTempoService.getByPeriodosId(this.idsCalculos[0])
                .then((periodosContribuicao: PeriodosContagemTempo[]) => {
               //   this.initializeMatrix(periodosContribuicao);
                  this.isUpdating = false;
                });
            });
        } else {
          let counter = 0;
          for (let idCalculo of this.idsCalculos) {
            this.CalculoContagemTempoService.find(idCalculo)
              .then((calculo: CalculoModel) => {
                this.updateDatatable(calculo)
                if ((counter + 1) == this.idsCalculos.length)
                  this.isUpdating = false;
                counter++;
              });
          }
        }
      });
  }
  realizarCalculo() {
    let contribuicoesPrimarias = this.matrizContribuicoesPrimarias.getMatrixData();
    let contribuicoesSecundarias = this.matrizContribuicoesSecundarias.getMatrixData();

    let primarias = [];
    let secundarias = [];
    for (let contribuicao of contribuicoesPrimarias) {
      let dateMonth = contribuicao.split('-')[0];
      let valor = contribuicao.split('-')[1];
      if (valor == 0)
        continue;
      let date = dateMonth.split('/')[1] + '-' + dateMonth.split('/')[0] + '-01';
      let periodosContagemTempo = new PeriodosContagemTempo({
        id_calculo: this.idsCalculos,
        data: date,
        tipo: 0,
        valor: valor,
      });
      primarias.push(periodosContagemTempo);
    }
    for (let contribuicao of contribuicoesSecundarias) {
      let dateMonth = contribuicao.split('-')[0];
      let valor = contribuicao.split('-')[1];
      if (valor == 0)
        continue;
      let date = dateMonth.split('/')[1] + '-' + dateMonth.split('/')[0] + '-01';
      let periodosContagemTempo = new PeriodosContagemTempo({
        id_calculo: this.idsCalculos,
        data: date,
        tipo: 1,
        valor: valor,
      });
      secundarias.push(periodosContagemTempo);
    }
    let todasContribuicoes = primarias.concat(secundarias);
    if (todasContribuicoes.length != 0) {
      this.mostrarBotaoRealizarCalculos = false;
      this.PeriodosContagemTempoService.save(todasContribuicoes).then(() => {
        window.location.href = '/#/rgps/rgps-resultados/' + this.idSegurado + '/' + this.idsCalculos;
      });
    } else {
      swal('Erro', 'Nenhum valor inserido', 'error');
    }
  }

  initializeMatrix(periodosContribuicao) {
    periodosContribuicao.sort((entry1, entry2) => {
      if (moment(entry1.data) > moment(entry2.data)) {
        return 1;
      }
      if (moment(entry1.data) < moment(entry2.data)) {
        return -1;
      }
      return 0;
    });
    if (periodosContribuicao.length != 0) {
      let matrizPrimarias = [];
      let matrizSecundarias = [];
      let ano = 0
      let valuesPrimaria = [];
      let valuesSecundaria = [];
      for (let contribuicao of periodosContribuicao) {
        let contribAno = parseInt((contribuicao.data).split('-')[0]);
        let contribMes = parseInt((contribuicao.data).split('-')[1]);
        if (contribAno != ano) {
          this.matrizContribuicoesPrimarias.updateMatrix(ano, valuesPrimaria);
          this.matrizContribuicoesSecundarias.updateMatrix(ano, valuesSecundaria);
          ano = contribAno;
          valuesPrimaria = ['R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00'];
          valuesSecundaria = ['R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00', 'R$ 0,00'];
        }
        this.matrizContribuicoesPrimarias.updateMatrix(ano, valuesPrimaria);
        this.matrizContribuicoesSecundarias.updateMatrix(ano, valuesSecundaria);
        valuesPrimaria[contribMes - 1] = this.formatMoney(contribuicao.valor_primaria);
        valuesSecundaria[contribMes - 1] = this.formatMoney(contribuicao.valor_secundaria);
      }
      this.matrizContribuicoesPrimarias.matriz.splice(0, 1);
      this.matrizContribuicoesSecundarias.matriz.splice(0, 1);
    }

  }

//   updateDatatable(calculo) {
//     let line = {
//       referencia_calculo: calculo.referencia_calculo,
//       total_dias: calculo.total_dias,
//       total_carencia: calculo.total_carencia,
//       created_at: calculo.created_at,
//     }


//     this.calculoList.push(line);

//    this.grupoCalculosTableOptions = {
//      ...this.grupoCalculosTableOptions,
//      data: this.calculoList,
//    }
// console.log(this.grupoCalculosTableOptions);

//   }



updateDatatable(calculo) {

  let referencia_calculo = calculo.referencia_calculo;
  let total_dias = calculo.total_dias;
  let total_carencia = calculo.total_carencia;
  let created_at = calculo.created_at;

  let line = {
    referencia_calculo: referencia_calculo,
    total_dias: total_dias,
    total_carencia: total_carencia,
    created_at: created_at,
  }

  this.calculoList.push(line);

  this.grupoCalculosTableOptions = {
    ...this.grupoCalculosTableOptions,
    data: this.calculoList,
  }

  console.log(this.grupoCalculosTableOptions);
}

  submit() {

    if (this.isValid()) {
      let periodoObj = {
        inicioPeriodo: this.inicioPeriodo,
        finalPeriodo: this.finalPeriodo,
        salarioContribuicao: this.salarioContribuicao
      };

      if (this.tipoContribuicao === 'Primaria') {
        this.matrizContribuicoesPrimarias.preencher(periodoObj);
      } else if (this.tipoContribuicao === 'Secundaria') {
        this.matrizContribuicoesSecundarias.preencher(periodoObj);
      }

    } else {
      swal('Erro', 'Confira os dados digitados', 'error');
    }

  }

  isValid() {
    let dateInicioPeriodo = moment(this.inicioPeriodo.split('/')[1] + '-' + this.inicioPeriodo.split('/')[0] + '-01');
    let dateFinalPeriodo = moment(this.finalPeriodo.split('/')[1] + '-' + this.finalPeriodo.split('/')[0] + '-01');

    //inicioPeriodo
    if (this.isEmpty(this.inicioPeriodo) || !dateInicioPeriodo.isValid()) {
      this.errors.add({ 'inicioPeriodo': ['Insira uma data válida'] });
    }

    //finalPeriodo
    if (this.isEmpty(this.finalPeriodo) || !dateFinalPeriodo.isValid()) {
      this.errors.add({ 'finalPeriodo': ['Insira uma data válida'] });
    } else {
      if (dateFinalPeriodo <= dateInicioPeriodo) {
        this.errors.add({ 'finalPeriodo': ['Insira uma data posterior a data inicial'] });
      }
    }

    //salarioContribuicao
    if (this.isEmpty(this.salarioContribuicao)) {
      this.errors.add({ 'salarioContribuicao': ['Insira o salário'] });
    } else {
      this.errors.clear('salarioContribuicao');
    }

    return this.errors.empty();
  }

  isEmpty(data) {
    if (data == undefined || data == '') {
      return true;
    }
    return false;
  }

  formatReceivedDate(inputDate) {
    var date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return ('0' + (date.getDate())).slice(-2) + '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        date.getFullYear();
    }
    return '';
  }

  getTempoDeContribuicaoPrimaria(data) {
    let str = '';
    if (data.contribuicao_primaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_98.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_primaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_99.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_primaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_atual.replace(/-/g, '/') + '<br>';
    }

    return str;

  }

  getTempoDeContribuicaoSecundaria(data) {
    let str = '';
    if (data.contribuicao_secundaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_98.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_secundaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_99.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_secundaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_atual.replace(/-/g, '/') + '<br>';
    }

    return str;

  }

  formatMoney(data) {
    data = parseFloat(data);
    return 'R$ ' + (data.toFixed(2)).replace('.', ',');
  }

  dateMask(rawValue) {
    if (rawValue == '') {
      return [/[0-1]/, /\d/, '/', /[1-2]/, /[0|9]/, /\d/, /\d/];
    }
    let mask = [];
    mask.push(/[0-1]/);

    if (rawValue[0] == 1) {
      mask.push(/[0-2]/);
    } else if (rawValue[0] == 0) {
      mask.push(/[1-9]/);
    }

    mask.push('/');
    mask.push(/[1-2]/);

    if (rawValue[3] == 1) {
      mask.push(/[9]/);
    } else if (rawValue[3] == 2) {
      mask.push(/[0]/);
    }
    mask.push(/\d/);
    mask.push(/\d/);
    return mask;
  }

  editSegurado() {
    window.location.href = '/#/rgps/rgps-segurados/' +
      this.route.snapshot.params['id_segurado'] + '/editar';
  }

}
