import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PeriodosContagemTempo } from './../../+contagem-tempo-periodos/PeriodosContagemTempo.model';
import { PeriodosContagemTempoService } from './../../+contagem-tempo-periodos/PeriodosContagemTempo.service';
import { DefinicaoTempo } from 'app/shared/functions/definicao-tempo';

import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-contagem-tempo-conclusao-periodos',
  templateUrl: './contagem-tempo-conclusao-periodos.component.html',
  styleUrls: ['./contagem-tempo-conclusao-periodos.component.css']
})
export class ContagemTempoConclusaoPeriodosComponent implements OnInit {

  @Input() idCalculoSelecionado;

  public idsCalculos = '';
  public isUpdating = false;
  public periodo: any = {};
  public periodosListInicial = [];
  public periodosList = [];
  public Math = Math;
  // public tableOptionsPeriodos = {
  //   colReorder: false,
  //   paging: false,
  //   searching: false,
  //   ordering: false,
  //   bInfo: false,
  //   data: this.periodosList,
  //   columns: [
  //     { data: 'vinculo' },
  //     { data: 'empresa' },
  //     { data: 'data_inicio' },
  //     { data: 'data_termino' },
  //     { data: 'fator_condicao_especial' },
  //     { data: 'carencia' },
  //     { data: 'concomitantes.text' },
  //     { data: 'totalSemFator.years' },
  //     { data: 'totalSemFator.months' },
  //     { data: 'totalSemFator.days' },
  //     { data: 'totalComFator.years' },
  //     { data: 'totalComFator.months' },
  //     { data: 'totalComFator.days' },
  //     { data: 'concomitantes.vinculosList' }
  //   ]
  // };



  @Output() periodosListRst = new EventEmitter();

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected PeriodosContagemTempoService: PeriodosContagemTempoService,
  ) { }

  ngOnInit() {
    this.periodosListInicial = [];
    this.isUpdating = true;
    this.updateTabelaPeriodosView();
  }

  updateTabelaPeriodosView() {

    this.idsCalculos = this.idCalculoSelecionado;

    this.PeriodosContagemTempoService.getByPeriodosId(this.idsCalculos)
      .then((periodosContribuicao: PeriodosContagemTempo[]) => {
        this.periodosListInicial = [];
        if (periodosContribuicao.length > 0) {

          for (const periodo of periodosContribuicao) {
            this.updateDatatablePeriodos(periodo);
          }

          for (const periodo of this.periodosListInicial) {
            this.periodosConcomitantes(periodo);
          }

          this.periodosList = this.periodosListInicial;
          this.periodosListRst.emit({
            listRST: this.periodosList,
            listDB: periodosContribuicao
          });
        }

        // this.tableOptionsPeriodos = {
        //   ...this.tableOptionsPeriodos,
        //   data: this.periodosList,
        // }

        this.isUpdating = false;
      });
  }


  private convertSCEMObjjSON(sc) {

    if (this.isExist(sc)) {
      sc = JSON.parse(sc)
    }
    return sc;
  }

  updateDatatablePeriodos(periodo) {

    if (typeof periodo === 'object' && this.idsCalculos === periodo.id_contagem_tempo) {

      const statusCarencia = this.defineStatusCarencia(periodo);
      const statusTempoContribuicao = this.defineStatusTempoContribuicao(periodo);

      periodo.sc = this.convertSCEMObjjSON(periodo.sc);
      periodo.limites = this.testInicioFimDoPeriodoIntegral(periodo, statusTempoContribuicao)

      const ajusteFator = (periodo.condicao_especial !== 0) ? Number(periodo.fator_condicao_especial) : 1;
      const totalTempo = this.dateDiffPeriodos(periodo.data_inicio,
        periodo.data_termino,
        periodo.fator_condicao_especial,
        periodo.limites);

      const limites = this.descontarTempoConformeSC(periodo, totalTempo, statusCarencia, statusTempoContribuicao);

      const line = {
        vinculo: this.periodosListInicial.length + 1,
        data_inicio: this.formatReceivedDate(periodo.data_inicio),
        data_termino: this.formatReceivedDate(periodo.data_termino),
        data_inicioDb: periodo.data_inicio,
        data_terminoDb: periodo.data_termino,
        empresa: periodo.empresa,
        fator_condicao_especial: periodo.fator_condicao_especial,
        fator_condicao_especialN: ajusteFator,
        carencia: statusCarencia,
        carenciaP: periodo.carencia,
        tempoContrib: statusTempoContribuicao,
        actions: periodo.actions,
        created_at: this.formatReceivedDate(periodo.created_at),
        id: periodo.id,
        totalSemFator: totalTempo.semFator,
        totalComFator: totalTempo.comFator,
        totalCarencia: totalTempo.carencia,
        concomitantes: '',
        sc: periodo.sc,
        sc_count: periodo.sc_count,
        sc_mm_ajustar: periodo.sc_mm_ajustar,
        sc_mm_considerar_carencia: periodo.sc_mm_considerar_carencia,
        sc_mm_considerar_tempo: periodo.sc_mm_considerar_tempo,
        sc_pendentes: periodo.sc_pendentes,
        sc_pendentes_mm: periodo.sc_pendentes_mm,
        converter_especial_apos_ec103: periodo.converter_especial_apos_ec103,
        limites: limites,
      }

      console.log(line);

      this.periodosListInicial.push(line);
    }

  }

  /**
   * define o status da carencia conforme os salários de contribuição
   * @param periodo
   * @returns string status
   */
  private defineStatusCarencia(periodo) {

    if (periodo.carencia === 0) {
      return 'Não';
    }

    // if (this.checkPeriodoPosReforma(periodo)) {
    //   return 'Integral';
    // }

    if ((periodo.sc_pendentes_mm === 0 || this.isEmpty(periodo.sc_pendentes_mm))
      && ((periodo.sc_pendentes === 0 || this.isEmpty(periodo.sc_pendentes)))
    ) {

      return (periodo.carencia) ? 'Integral' : 'Não';

    } else {

      return (!this.isExist(periodo.sc_mm_considerar_carencia) && periodo.sc_mm_considerar_carencia === 1) ? 'Integral' : 'Parcial';
    }

  }

  /**
   * define o status de tempo de contribuição conforme os salários de contribuição
   * @param periodo
   * @returns string status
   */
  private defineStatusTempoContribuicao(periodo) {

    // if (this.checkPeriodoPosReforma(periodo)) {
    //   return 'Integral';
    // }

    if ((periodo.sc_pendentes_mm === 0 || this.isEmpty(periodo.sc_pendentes_mm))
      && ((periodo.sc_pendentes === 0 || this.isEmpty(periodo.sc_pendentes)))
    ) {

      return 'Integral';

    } else {

      return ((!this.isExist(periodo.sc_mm_considerar_tempo) ||
        (this.isExist(periodo.sc_mm_considerar_tempo) && periodo.sc_mm_considerar_tempo === 1))) ? 'Integral' : 'Parcial';
    }


  }


  private checkPeriodoPosReforma(periodo) {

    if (moment(periodo.data_inicio).isSameOrAfter('2019-11-13')
      || moment('2019-11-13').isBetween(periodo.data_inicio, periodo.data_termino, null, '[]')) {

      return false;

    }
    return true;

  }



  private checkPeriodoComIntersessaoEC(periodo) {

    if (this.checkPeriodoIntervaloReforma(periodo) === 'entre') {

      return true;

    }

    return false;

  }


  private checkPeriodoIntervaloReforma(periodo) {


    if (moment(periodo.data_termino).isSameOrBefore('2019-11-13')) {

      return 'anterior';
    }

    if (moment(periodo.data_inicio).isSameOrAfter('2019-11-14')) {

      return 'apos';
    }

    if (moment('2019-11-13').isBetween(periodo.data_inicio, periodo.data_termino, null, '[]')) {

      return 'entre';
    }

  }



  private testInicioFimDoPeriodoIntegral(periodo, statusTempoContribuicao) {

    const limites = {
      inicio: 0,
      fim: 0,
      inicioType: '',
      fimType: ''
    }

    if ((this.isExist(periodo.sc) && typeof periodo.sc === 'object')
      && (statusTempoContribuicao === 'Integral')
      && !this.checkPeriodoPosReforma(periodo)) {

      const inicioSC = periodo.sc[0];
      const fimSC = periodo.sc[periodo.sc.length - 1];

      if ((inicioSC.msc === 0 && inicioSC.sc !== '0,00')) {

        if (moment(periodo.data_inicio).isSameOrAfter('2019-11-14')) {
          limites.inicio = 30;
        }
        limites.inicioType = 'i'; // integral

      }

      if ((fimSC.msc === 0 && fimSC.sc !== '0,00')) {

        if (moment(periodo.data_termino).isSameOrAfter('2019-11-14')) {
          limites.fim = 30;
        }

        limites.fimType = 'i'; // integral

      }

    }

    return limites

  }


  private testInicioFimDoPeriodo(dataIni, inicioSC, dataFim, fimSC) {

    const limites = {
      inicio: 0,
      fim: 0,
      inicioType: '',
      fimType: ''
    }

    const defineType = (msc, sc) => {

      if ((msc !== 1 && sc === '0,00')) {
        return 'z'
      } else if ((msc === 1 && sc !== '0,00')) {
        return 'm'
      }

    }

    if (moment(inicioSC.cp, 'MM/YYYY').isSame(dataIni, 'month')
      && moment(dataIni).isSameOrAfter(moment(dataIni).startOf('month'))
    ) {

      if (inicioSC.msc === 1) {  // parcial

        const inicioDias = (moment(dataIni).date() >= 30) ? 1 : 30 - moment(dataIni).date();
        limites.inicio = inicioDias;
        limites.inicioType = 'm';

      } else if (inicioSC.sc === '0,00') { // não conta

        limites.inicioType = 'z';

      }

    }

    if (moment(fimSC.cp, 'MM/YYYY').isSame(dataFim, 'month')
      && moment(dataFim).isSameOrBefore(moment(dataFim).endOf('month'))
    ) {

      if (fimSC.msc === 1) { // parcial

        limites.fim = moment(dataFim).date();
        limites.fimType = 'm';

      } else if (inicioSC.sc === '0,00') { // não conta

        limites.fimType = 'z';

      }

    }

    return limites

  }

  /**
   * calcular descarte da carencia
   * @param periodo obj
   * @param totalTempo obj
   * @returns obj
   */
  private calcularDescarteCarencia(periodo, totalTempo) {

    if (periodo.sc_mm_considerar_carencia === 0) {
      totalTempo.carencia -= periodo.sc_pendentes
      totalTempo.carencia -= periodo.sc_pendentes_mm
    }

    return totalTempo.carencia

  }

  // private calcularDescarteTempoContribuicao2(periodo, totalTempo) {


  //   let totalDescarteDias = 0;
  //   let totalDescarteMeses = 0;
  //   let totalFinalEmDias = totalTempo.semFator.fullDays;

  //   if (this.isExist(periodo.limites.inicioType) && periodo.limites.inicioType !== ''
  //     || this.isExist(periodo.limites.fimType) && periodo.limites.fimType !== '') {

  //     if (periodo.limites.inicioType === 'z') {

  //       periodo.sc_pendentes -= 1;
  //       totalDescarteDias = periodo.limites.inicio;

  //     } else if (periodo.limites.inicioType === 'm') {

  //       periodo.sc_pendentes_mm -= 1;
  //       totalDescarteDias = periodo.limites.inicio;

  //     }


  //     if (periodo.limites.fimType === 'z') {

  //       periodo.sc_pendentes -= 1;
  //       totalDescarteDias += periodo.limites.fim;

  //     } else if (periodo.limites.fimType === 'm') {

  //       periodo.sc_pendentes_mm -= 1;
  //       totalDescarteDias += periodo.limites.fim;

  //     }

  //     console.log(totalDescarteDias)

  //     totalDescarteMeses = (periodo.sc_pendentes + periodo.sc_pendentes_mm);
  //     console.log(totalDescarteMeses)

  //     if (totalDescarteMeses > 0) {
  //       totalDescarteDias += (30 * totalDescarteMeses);
  //     }

  //     console.log(totalDescarteDias)
  //     console.log(totalFinalEmDias)

  //     if (totalFinalEmDias > totalDescarteDias) {
  //       totalFinalEmDias -= totalDescarteDias
  //     }

  //   } else {

  //     if (periodo.sc_pendentes > 0 || periodo.sc_pendentes_mm > 0) {

  //       totalFinalEmDias = (periodo.sc_count - (periodo.sc_pendentes + periodo.sc_pendentes_mm)) * 30;

  //     }

  //   }



  //   console.log(totalFinalEmDias)

  //   totalTempo.semFator = DefinicaoTempo.convertD360ToDMY(totalFinalEmDias);

  //   const fator = parseFloat(periodo.fator_condicao_especial);

  //   if (fator === 1) {

  //     totalTempo.comFator = Object.assign({}, totalTempo.semFator);

  //   } else {

  //     const totalFatorDay360 = DefinicaoTempo.aplicarFator(totalFinalEmDias, fator);
  //     totalTempo.comFator = DefinicaoTempo.convertD360ToDMY(totalFatorDay360);

  //   }

  //   return totalTempo
  // }



  private countPosEC103SC(contribuicoes: Array<any>, type = 'mm') {

    return contribuicoes.filter(function (item) {
      if (moment(item.cp, 'MM/YYYY').isSameOrAfter('2019-11-14')) { return item }
    }).length;

  }


  private countPendenciasPosEC103SC(contribuicoes: Array<any>, type = 'mm') {

    if (type === 'mm') {
      return contribuicoes.filter(function (item) {
        if (item.msc === 1
          && moment(item.cp, 'MM/YYYY').isSameOrAfter('2019-11-14')) { return item }
      }).length;
    }

    return contribuicoes.filter(function (item) {
      if (item.sc === '0,00'
        && moment(item.cp, 'MM/YYYY').isSameOrAfter('2019-11-14')) { return item }
    }).length;
  }


  private checkScCompetenciaFull(salariosC, auxiliarDate) {

    const data = auxiliarDate.format('MM/YYYY');
    const salC = salariosC.find((x) => x.cp === data)

    if (this.isExist(salC) && (salC.msc === 0 && salC.sc !== '0,00')) {
      return true;
    }

    return false;
  }


  /**
   * Calcular o descarte conforme os salários de contribuição
   * @param periodo
   * @param totalTempo
   * @returns
   */
  private calcularDescarteTempoContribuicao(periodo, totalTempo) {

    let totalDias = 0;
    let totalFinalEmDias = totalTempo.semFator.fullDays;
    let totalDay360AntesEC = { dias: 0, meses: 0 };

    if (periodo.limites.inicioType !== 'i' || periodo.limites.fimType !== 'i') {

      if (periodo.limites.inicioType === 'm') {

        // periodo.sc_pendentes_mm -= 1;
        totalDias = periodo.limites.inicio;

      }

      if (periodo.limites.fimType === 'm') {

        // periodo.sc_pendentes_mm -= 1;
        totalDias += periodo.limites.fim;

      }

      totalFinalEmDias = (periodo.sc_count - (periodo.sc_pendentes + periodo.sc_pendentes_mm)) * 30;

      if (periodo.sc_mm_considerar_tempo === 1) {
        totalFinalEmDias += totalDias;
      }

    } else {

      if (periodo.sc_pendentes > 0 || periodo.sc_pendentes_mm > 0) {

        totalFinalEmDias = (periodo.sc_count - (periodo.sc_pendentes + periodo.sc_pendentes_mm)) * 30;

      }

    }

    if (this.checkPeriodoComIntersessaoEC(periodo)) {

      // totalDay360AntesEC = DefinicaoTempo.dataDiffDateToDateCustom(
      //   moment(periodo.data_inicio).format('YYYY-MM-DD'),
      //   '2019-11-13'
      // );

      totalDay360AntesEC = DefinicaoTempo.dataDiffDateToDateCustom(
        moment(periodo.data_inicio).format('YYYY-MM-DD'),
        '2019-10-31'
      );

      const sc_countApos19 = this.countPosEC103SC(periodo.sc);
      const sc_countApos19mm = this.countPendenciasPosEC103SC(periodo.sc, 'zero');
      const sc_countApos19zero = this.countPendenciasPosEC103SC(periodo.sc);

      if (periodo.limites.fimType === 'm') {
        periodo.sc_pendentes_mm -= 1;
        totalDias = periodo.limites.fim;
      }

      const dataFull = this.checkScCompetenciaFull(periodo.sc, moment('2019-11-13'));
      totalDias = (dataFull) ? 30 : 0;

      if (totalDias === 0
        && !dataFull
        && moment('2019-11-13').isBetween(
          moment(periodo.data_inicio),
          moment(periodo.data_termino), 'month', '[]')
      ) {

        totalDias = 13;

      }


      // totalFinalEmDias = totalDay360AntesEC.dias + totalDias
      // + ((sc_countApos19 - (periodo.sc_pendentes + periodo.sc_pendentes_mm)) * 30);
      totalFinalEmDias = totalDay360AntesEC.dias + totalDias +
        ((sc_countApos19 - (sc_countApos19zero + sc_countApos19mm)) * 30);

      // console.log(moment(periodo.data_inicio).format('YYYY-MM-DD'))
      // console.log(totalFinalEmDias)
      // console.log(totalFinalEmDias)
      // console.log(totalDias)

    }

    totalTempo.semFator = DefinicaoTempo.convertD360ToDMY(totalFinalEmDias);

    const fator = parseFloat(periodo.fator_condicao_especial);

    // if (fator === 1 || (fator > 1 && !this.checkPeriodoPosReforma(periodo))) {
    if (fator === 1 ||
      (fator > 1
        && this.checkPeriodoIntervaloReforma(periodo) === 'apos'
        && periodo.converter_especial_apos_ec103 === 0)) {

      totalTempo.comFator = Object.assign({}, totalTempo.semFator);

    } else {

      let totalFatorDay360 = DefinicaoTempo.aplicarFator(totalFinalEmDias, fator);

      if (fator > 1 && this.checkPeriodoComIntersessaoEC(periodo)) {

        let totalDay360AntesECFator = DefinicaoTempo.aplicarFator(totalDay360AntesEC.dias, fator);
        if (totalDay360AntesEC.dias > 0) {
          totalDay360AntesECFator += ((13 * fator) - 13);
        }

        totalFatorDay360 = totalDay360AntesECFator + (totalFinalEmDias - totalDay360AntesEC.dias)

      }

      totalTempo.comFator = DefinicaoTempo.convertD360ToDMY(totalFatorDay360);
    }

    return totalTempo
  }


  /**
   * Calcular descarete do tempo conforme a EC103
   * @param periodo
   * @param totalTempo
   * @param statusCarencia
   * @param statusTempoContribuicao
   * @returns
   */
  private calcularDescarte(periodo, totalTempo, statusCarencia, statusTempoContribuicao) {

    if (statusCarencia === 'Parcial' || this.checkPeriodoComIntersessaoEC(periodo)) {

      totalTempo.carencia = this.calcularDescarteCarencia(periodo, totalTempo);

    }

    if (statusTempoContribuicao === 'Parcial' || this.checkPeriodoComIntersessaoEC(periodo)) {

      totalTempo = this.calcularDescarteTempoContribuicao(periodo, totalTempo);

    }

    return totalTempo

  }


  private descontarTempoConformeSC(periodo, totalTempo, statusCarencia, statusTempoContribuicao) {

    if ((this.isExist(periodo.sc) && typeof periodo.sc === 'object')
      && ((statusTempoContribuicao === 'Parcial' || statusCarencia === 'Parcial')
        || (this.checkPeriodoComIntersessaoEC(periodo)))) {

      periodo.limites = this.testInicioFimDoPeriodo(periodo.data_inicio,
        periodo.sc[0],
        periodo.data_termino,
        periodo.sc[periodo.sc.length - 1]);

      totalTempo = this.calcularDescarte(periodo, totalTempo, statusCarencia, statusTempoContribuicao);

    }

    return periodo.limites;
  }


  public dataDiffDateToDate(date1, date2, fator, limites = null) {

    let inicioP = moment(date1).format('YYYY-MM-DD');
    let fimP = moment(date2).format('YYYY-MM-DD');
    let integralInicioFim = false;

    if (this.isExist(limites)) {

      if (limites.inicioType === 'i' && limites.fimType === 'i'
        && limites.inicio === 30 && limites.fim === 30) {

        integralInicioFim = true;

      } else {

        if (limites.inicioType === 'i' && limites.inicio === 30) {
          inicioP = moment(date1).startOf('month').format('YYYY-MM-DD');
        }

        if (limites.fimType === 'i' && limites.fim === 30) {
          fimP = moment(date2).endOf('month').format('YYYY-MM-DD');
        }
      }

    }

    const totalDay360 = DefinicaoTempo.dataDiffDateToDateCustom(
      inicioP,
      fimP,
      integralInicioFim
    );

    const totalFatorDay360 = DefinicaoTempo.aplicarFator(totalDay360.dias, fator);
    const totalDMY = DefinicaoTempo.convertD360ToDMY(totalDay360.dias);
    const totalFatorDMY = DefinicaoTempo.convertD360ToDMY(totalFatorDay360);

    return {
      semFator: totalDMY,
      comFator: totalFatorDMY,
      carencia: totalDay360.meses
    };

  };



  /**
   * Ajustar o periodo de 30 ou 31 para um mês completo
   */
  private ajusteHumanizadoDateINSS(tempoObj) {

    if (tempoObj.days >= 30) {
      tempoObj.months += 1;
      tempoObj.days = 0;
    }


    if (tempoObj.months >= 12) {
      tempoObj.months = (tempoObj.months - 12);
      tempoObj.years += 1;
    }

    return tempoObj;
  }

  private considerarMesCompleto() {

  }


  public dateDiffPeriodos(inicio, fim, fator, limites = null) {

    // const tempoTotal = this.dataDiff(inicio, fim, Number(fator));

    const tempoTotal = this.dataDiffDateToDate(inicio, fim, Number(fator), limites);

    return tempoTotal;
  }


  private checkDatasConcomitantes(inicio, fim, inicioAux, fimAux) {
    let checkConcomitante = false;

    inicio = moment(inicio, 'DD/MM/YYYY').hour(1).minute(1).second(1).millisecond(1);
    fim = moment(fim, 'DD/MM/YYYY').hour(1).minute(1).second(1).millisecond(1);

    inicioAux = moment(inicioAux, 'DD/MM/YYYY').hour(1).minute(1).second(1).millisecond(1);
    fimAux = moment(fimAux, 'DD/MM/YYYY').hour(1).minute(1).second(1).millisecond(1);


    if (inicio === inicioAux && fim === fimAux) {
      checkConcomitante = true;
    } else {
      if (inicio >= inicioAux && fim <= fimAux) {
        checkConcomitante = true;
      }

      if (inicio <= inicioAux && fim >= fimAux) {
        checkConcomitante = true;
      }
    }

    if (inicio < inicioAux && fim >= inicioAux && fim <= fimAux) {
      checkConcomitante = true;
    }

    if (inicio > inicioAux && inicio <= fimAux && fim >= fimAux) {
      checkConcomitante = true;
    }

    return checkConcomitante;
  }

  public periodosConcomitantes(periodo) {

    const concomitantes: any = {
      'vinculosList': '',
      'check': false,
      'text': 'Não'
    };

    let checkConcomitante = false;

    for (const periodoCom of this.periodosListInicial) {

      checkConcomitante = this.checkDatasConcomitantes(periodo.data_inicio, periodo.data_termino,
        periodoCom.data_inicio, periodoCom.data_termino);

      if (periodo.vinculo !== periodoCom.vinculo && checkConcomitante) {

        concomitantes.check = true;
        concomitantes.text = 'Sim';
        concomitantes.vinculosList += (concomitantes.vinculosList === '') ? periodoCom.vinculo : ', ' + periodoCom.vinculo;

      }

    }

    periodo.concomitantes = concomitantes;

    return periodo;
  }

  isExist(data) {
    if (data === undefined
      || typeof data === 'undefined'
      || data === 'undefined'
      || data === null) {
      return false;
    }
    return true;
  }

  returnListaPeriodos() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-periodos/' +
      this.route.snapshot.params['id_segurado'] + '/' + this.idsCalculos;
  }


  toMoment(dateString) {
    return moment(dateString, 'DD/MM/YYYY');
  }

  toMomentTempo(dateString) {
    return moment(this.toDateString(dateString.add(1, 'd').hour(1).minute(1).second(1).millisecond(1)), 'DD/MM/YYYY');
  }

  toDateString(date) {
    return date.format('DD/MM/YYYY');
  }


  toDateStringYYYY(date) {
    return moment(date).format('YYYY-MM-DD');
  }


  formatReceivedDate(inputDate) {
    const date = moment(inputDate, 'YYYY-MM-DD');
    return date.format('DD/MM/YYYY');
  }

  formatPostDataDate(inputDate) {
    const date = moment(inputDate, 'DD/MM/YYYY');
    return date.format('YYYY-MM-DD');
  }

  isEmpty(data) {
    if (data === undefined
      || typeof data === 'undefined'
      || data === 'undefined'
      || data === null) {
      return true;
    }
    return false;
  }
}
