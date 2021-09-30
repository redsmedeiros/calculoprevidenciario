import { Component, OnInit, ViewChild } from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { CalculoRgpsService } from '../+rgps-calculos/CalculoRgps.service';
import { ErrorService } from '../../services/error.service';
import { RgpsMatrizComponent } from './rgps-valores-contribuidos-matriz/rgps-valores-contribuidos-matriz.component'
import { ValorContribuido } from './ValorContribuido.model'
import { ValorContribuidoService } from './ValorContribuido.service'
import * as moment from 'moment';
import swal from 'sweetalert2';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-valores-contribuidos.component.html',
  providers: [
    ErrorService
  ]
})


export class RgpsValoresContribuidosComponent implements OnInit {
  @ViewChild('contribuicoesPrimarias') matrizContribuicoesPrimarias: RgpsMatrizComponent;
  @ViewChild('contribuicoesSecundarias') matrizContribuicoesSecundarias: RgpsMatrizComponent;

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
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculoList,
    columns: [
      { data: 'especie' },
      // { data: 'periodoInicioBeneficio' },
      // { data: 'contribuicaoPrimaria' },
      // { data: 'contribuicaoSecundaria' },
      { data: 'dib' },
      // { data: 'dataCriacao' },
    ]
  };

  public inicioPeriodo = '';
  public finalPeriodo = '';
  public salarioContribuicao = undefined;
  public tipoContribuicao = 'Primaria';

  public exibirCampoAnteriorLei13846 = false;
  public somarSecundaria = '0';

  constructor(protected router: Router,
    private route: ActivatedRoute,
    protected Segurado: SeguradoService,
    protected CalculoRgps: CalculoRgpsService,
    protected errors: ErrorService,
    protected ValorContribuidoService: ValorContribuidoService) {
  }

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    // this.idCalculo = this.route.snapshot.params['id'];
    this.idsCalculos = this.route.snapshot.params['id'].split(',');
    this.isUpdating = true;
    this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.segurado = segurado;

        if (localStorage.getItem('user_id') != this.segurado.user_id) {
          // redirecionar para pagina de segurados
          swal({
            type: 'error',
            title: 'Erro',
            text: 'Você não tem permissão para acessar esta página!',
            allowOutsideClick: false
          }).then(() => {
            window.location.href = '/#/rgps/rgps-segurados/';
          });
        } else {
          if (this.idsCalculos.length == 1) {
            this.CalculoRgps.find(this.idsCalculos[0])
              .then(calculo => {

                this.calculo = calculo;
                this.updateDatatable(calculo);
                this.isSomarSecundariaCheck();

                this.ValorContribuidoService.getByCalculoId(this.idsCalculos[0], null, null, 0, this.idSegurado)
                  .then((valorescontribuidos: ValorContribuido[]) => {
                    this.initializeMatrix(valorescontribuidos);
                    this.isUpdating = false;
                  });
              });
          } else {
            let counter = 0;
            for (const idCalculo of this.idsCalculos) {
              this.CalculoRgps.find(idCalculo)
                .then((calculo: CalculoModel) => {
                  this.updateDatatable(calculo)
                  if ((counter + 1) === this.idsCalculos.length) {
                    this.isUpdating = false;
                  }
                  counter++;
                });
            }
          }
        }
      });
  }

  private testeContribuicoesCliente() {

    const teste = [];
    const contribuicoesAdicionadasteste = [];

    if (teste.length > 0 && window.location.hostname === 'localhost' ) {
      for (const row of teste) {

        const valorContribuido = new ValorContribuido({
          id_calculo: this.idsCalculos,
          id_segurado: this.idSegurado,
          data: row.data,
          tipo: 0,
          valor: row.valor_primaria,
        });
        contribuicoesAdicionadasteste.push(valorContribuido);
      }
      this.ValorContribuidoService.save(contribuicoesAdicionadasteste).then(() => {
        // swal.close();
        swal({
          position: 'top-end',
          type: 'success',
          title: 'Valores salvos com sucesso!',
          showConfirmButton: false,
          timer: 1000
        });
      });
    }

  }


  private isSomarSecundariaCheck() {

    // console.log(this.calculo.somar_contribuicao_secundaria)
    if (moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').isBefore(moment('17/06/2019', 'DD/MM/YYYY'))) {
      this.somarSecundaria = '' + this.calculo.somar_contribuicao_secundaria;
      this.exibirCampoAnteriorLei13846 = true;
    }

  }

  private somarSecundariaUpdate() {

    this.calculo.somar_contribuicao_secundaria = Number(this.somarSecundaria);

    this.CalculoRgps
      .update(this.calculo)
      .then(model => {

        swal({
          type: 'success',
          title: 'Cálculo atualizado',
          allowOutsideClick: false,
          timer: 1500,
          showConfirmButton: false
        })

      })
      .catch(errors => this.errors.add(errors));
  }

  contribsChanged(event, tipo_contrib) {

    const valor = parseFloat(event.srcElement.value.replace(/[\.]/g, '').replace(',', '.'));
    const mes = event.srcElement.id.split('-')[0];
    const ano = event.srcElement.id.split('-')[1];
    const date = `${ano}-${mes}-01`;

    const valorContribuido = new ValorContribuido({
      id_calculo: this.idsCalculos,
      id_segurado: this.idSegurado,
      data: date,
      tipo: tipo_contrib,
      valor: valor,
    });

    swal({
      type: 'info',
      title: 'Aguarde por favor...',
      allowOutsideClick: false
    });
    swal.showLoading();
    this.ValorContribuidoService.save([valorContribuido]).then(() => {
      swal.close();
    });
  }

  realizarCalculo(pbc = false) {

    if (pbc) {
      window.location.href = '/#/rgps/rgps-resultados/' + this.idSegurado + '/' + this.idsCalculos + '/pbc';
    } else {
      window.location.href = '/#/rgps/rgps-resultados/' + this.idSegurado + '/' + this.idsCalculos;
    }

  }


  initializeMatrix(valorescontribuidos) {
    valorescontribuidos.sort((entry1, entry2) => {
      if (moment(entry1.data) > moment(entry2.data)) {
        return 1;
      }
      if (moment(entry1.data) < moment(entry2.data)) {
        return -1;
      }
      return 0;
    });
    if (valorescontribuidos.length !== 0) {
      const matrizPrimarias = [];
      const matrizSecundarias = [];
      let ano = 0
      let valuesPrimaria = [];
      let valuesSecundaria = [];
      for (const contribuicao of valorescontribuidos) {
        const contribAno = parseInt((contribuicao.data).split('-')[0], 10);
        const contribMes = parseInt((contribuicao.data).split('-')[1], 10);
        if (contribAno !== ano) {
          this.matrizContribuicoesPrimarias.updateMatrix(ano, valuesPrimaria);
          this.matrizContribuicoesSecundarias.updateMatrix(ano, valuesSecundaria);
          ano = contribAno;
          this.matrizContribuicoesPrimarias.anosConsiderados.push(ano);
          this.matrizContribuicoesSecundarias.anosConsiderados.push(ano);
          valuesPrimaria = ['0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00'];
          valuesSecundaria = ['0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00', '0,00'];
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

  updateDatatable(calculo) {
    const especie = calculo.tipo_seguro;
    const periodoInicioBeneficio = calculo.tipo_aposentadoria;
    const contribuicaoPrimaria = this.getTempoDeContribuicaoPrimaria(calculo);
    const contribuicaoSecundaria = this.getTempoDeContribuicaoSecundaria(calculo);
    const dib = calculo.data_pedido_beneficio;
    const dataCriacao = this.formatReceivedDate(calculo.data_calculo);

    const line = {
      especie: especie,
      periodoInicioBeneficio: periodoInicioBeneficio,
      contribuicaoPrimaria: contribuicaoPrimaria,
      contribuicaoSecundaria: contribuicaoSecundaria,
      dib: dib,
      dataCriacao: dataCriacao
    }

    this.calculoList.push(line);

    this.grupoCalculosTableOptions = {
      ...this.grupoCalculosTableOptions,
      data: this.calculoList,
    }

  }

  submit() {
    if (this.isValid()) {
      const periodoObj = {
        inicioPeriodo: this.inicioPeriodo,
        finalPeriodo: this.finalPeriodo,
        salarioContribuicao: this.salarioContribuicao
      };
      // Preenche a tabela de contribuiçoes
      if (this.tipoContribuicao === 'Primaria') {
        this.matrizContribuicoesPrimarias.preencher(periodoObj);
      } else if (this.tipoContribuicao === 'Secundaria') {
        this.matrizContribuicoesSecundarias.preencher(periodoObj);
      }
      // Salva contribuicoes no bd 
      this.salvarContribuicoes(periodoObj, this.tipoContribuicao)
      this.inicioPeriodo = ((moment(this.finalPeriodo, 'MM/YYYY')).add(1, 'month')).format('MM/YYYY');
      this.finalPeriodo = this.inicioPeriodo;
      this.salarioContribuicao = '';
    } else {
      swal('Erro', 'Confira os dados digitados', 'error');
    }
  }

  moveNext(event, maxLength, nextElementId) {
    const value = event.srcElement.value;
    if (value.indexOf('_') < 0 && value != '') {
      const next = <HTMLInputElement>document.getElementById(nextElementId);
      next.focus();
    }
  }

  salvarContribuicoes(periodoObj, tipoContribuicao) {
    // swal({
    //     type: 'info',
    //     title: 'Aguarde por favor...',
    //     allowOutsideClick: false
    //    });
    //   swal.showLoading();

    const contribuicoesAdicionadas = [];
    const monthList = this.monthAndYear(periodoObj.inicioPeriodo, periodoObj.finalPeriodo);
    for (const mes of monthList) {
      const dateMonth = mes;
      const valor = periodoObj.salarioContribuicao;
      const tipo = (tipoContribuicao === 'Primaria') ? 0 : 1;
      // if (valor == 0)
      //  continue;
      const date = dateMonth + '-01';
      const valorContribuido = new ValorContribuido({
        id_calculo: this.idsCalculos,
        id_segurado: this.idSegurado,
        data: date,
        tipo: tipo,
        valor: valor,
      });
      contribuicoesAdicionadas.push(valorContribuido);
    }
    this.ValorContribuidoService.save(contribuicoesAdicionadas).then(() => {
      // swal.close();
      swal({
        position: 'top-end',
        type: 'success',
        title: 'Valores salvos com sucesso!',
        showConfirmButton: false,
        timer: 1000
      });
    });
  }

  isValid() {
    const dateInicioPeriodo = moment(this.inicioPeriodo.split('/')[1] + '-' + this.inicioPeriodo.split('/')[0] + '-01');
    const dateFinalPeriodo = moment(this.finalPeriodo.split('/')[1] + '-' + this.finalPeriodo.split('/')[0] + '-01');
    const dataLimite = moment('1970-01-01');

    // inicioPeriodo
    if (this.isEmpty(this.inicioPeriodo) || !dateInicioPeriodo.isValid()) {
      this.errors.add({ 'inicioPeriodo': ['Insira uma data válida'] });
    } else {
      // if (dateFinalPeriodo >= dataLimite) {
      //   this.errors.add({ "inicioPeriodo": ["Insira uma data posterior ou igual 01/1970"] });
      // }
    }

    // finalPeriodo
    if (this.isEmpty(this.finalPeriodo) || !dateFinalPeriodo.isValid()) {
      this.errors.add({ 'finalPeriodo': ['Insira uma data válida'] });
    } else {
      if (dateFinalPeriodo < dateInicioPeriodo) {
        this.errors.add({ 'finalPeriodo': ['Insira uma data posterior a data inicial'] });
      }

      // if (dateFinalPeriodo >= dataLimite) {
      //   this.errors.add({ "finalPeriodo": ["Insira uma data posterior ou igual 01/1970"] });
      // }
    }

    // salarioContribuicao
    if (this.isEmpty(this.salarioContribuicao)) {
      this.errors.add({ 'salarioContribuicao': ['Insira o salário'] });
    } else {
      this.errors.clear('salarioContribuicao');
    }

    return this.errors.empty();
  }

  isEmpty(data) {
    // console.log(data)
    if (data === undefined || data === ''
      || typeof data === 'undefined' || data === null) {
      return true;
    }
    return false;
  }

  formatReceivedDate(inputDate) {
    const date = new Date(inputDate);
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
    if (data.contribuicao_primaria_19 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_19.replace(/-/g, '/') + '<br>';
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
    return (data.toFixed(2)).replace('.', ',');
    // return 'R$ ' + (data.toFixed(2)).replace('.', ','); OLD

  }

  dateMask(rawValue) {
    if (rawValue === '') {
      return [/[0-1]/, /\d/, '/', /[1-2]/, /[0|9]/, /\d/, /\d/];
    }
    const mask = [];
    mask.push(/[0-1]/);

    if (rawValue[0] === '1') {
      mask.push(/[0-2]/);
    } else if (rawValue[0] === '0') {
      mask.push(/[1-9]/);
    }

    mask.push('/');
    mask.push(/[1-2]/);

    if (rawValue[3] === '1') {
      mask.push(/[9]/);
    } else if (rawValue[3] === '2') {
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

  monthAndYear(dateStart, dateEnd) {
    dateStart = '01/' + dateStart;
    dateEnd = '01/' + dateEnd;

    const startSplit = dateStart.split('/');
    const endSplit = dateEnd.split('/');

    dateStart = moment(startSplit[2] + '-' + startSplit[1] + '-' + startSplit[0]);
    dateEnd = moment(endSplit[2] + '-' + endSplit[1] + '-' + endSplit[0]);
    const timeValues = [];

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      timeValues.push(dateStart.format('YYYY-MM'));
      dateStart.add(1, 'month');
    }
    return timeValues;
  }

}
