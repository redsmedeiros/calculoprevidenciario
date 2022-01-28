
import * as moment from 'moment';
import { Console } from 'console';


export class DefinicaoTempo {



    static toDateStringYYYY(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    static toDateStringISO(date) {
        return moment(date).format();
    }

    static toMoment(dateString) {
        return moment(dateString, 'YYYY-MM-DD');
    }

    /**
     * Diferenca entre meses
     * @param d1
     * @param d2
     */
    static monthsDiff(d1, d2) {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        const years = date2.getFullYear() - date1.getFullYear();
        const months = (years * 12) + ((date2.getMonth() - date1.getMonth()) + 1);
        return months;
    }


    /**
     * Diferenca entre meses
     * @param d1
     * @param d2
     */
    static daysDiff(d1, d2) {
        const oneDay = 24 * 60 * 60 * 1000
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        const days = Math.floor(Math.abs((date2.getTime() - date1.getTime()) / oneDay));
        return days;
    }

    /**
     * Aplicar fator se houver
     * @param daysY360
     * @param fator
     */
    static aplicarFator(daysY360, fator) {

        if (daysY360 > 0 && fator !== 1 && fator > 0) {
            let rstFator = (daysY360 * fator);
            const testDecimal99 = rstFator - Math.floor(rstFator);

            if ((Math.floor(testDecimal99 * 100) / 100) === 0.99) {
                rstFator = Math.round(rstFator);
            }

            return Math.floor(rstFator);
        }

        return daysY360;
    }

    /**
     * Conversão usando ano 360 e dia 30
     * @param daysY360 total em dias
     */
    static convertD360ToDMY(daysY360) {
        const total = { years: 0, months: 0, days: 0, fullDays: daysY360 };

        total.years = Math.floor(daysY360 / 360);
        total.months = Math.floor((daysY360 - total.years * 360) / 30);
        total.days = Math.floor(daysY360 - total.years * 360 - total.months * 30);

        return total;
    }

    /**
     * Diferença entre datas condiderando mês 30 dias e ano 360
     * @param dataInicio Inicio do periodo string data format ('YYYY-MM-DD')
     * @param dataFim Fim do periodo string data format ('YYYY-MM-DD')
     * @param mesInteiro Considerar sempre o mês Completo no inicio e fim
     * @param contarFinal Considerar o dia final 01/01/2020 - 01/01/2021 = 1 ano e 1 dia
     */
    static dataDiffDateToDateCustom(dataInicio, dataFim, mesInteiro = false, contarFinal = 1) {

        const dataInicioString = dataInicio;
        const dataFimString = dataFim;

        dataInicio = moment(dataInicio).hour(0).minute(0).second(0).millisecond(0);
        dataFim = moment(dataFim).hour(0).minute(0).second(0).millisecond(0);

        const compareDataInicioStartM = this.toDateStringYYYY(moment(dataInicioString, 'YYYY-MM-DD').startOf('month'));
        const compareDataFimStartM = this.toDateStringYYYY(moment(dataFimString, 'YYYY-MM-DD').endOf('month'));

        let totalDias = 0;
        let totalMeses = 0;

        let diasInicio = 0
        let diasFim = 0

        totalMeses = this.monthsDiff(this.toDateStringISO(compareDataInicioStartM),
                                    this.toDateStringISO(compareDataFimStartM));

        if ((dataInicio.isSame(compareDataInicioStartM) && dataFim.isSame(compareDataFimStartM)) || mesInteiro) {

            totalDias = (totalMeses * 30)

        } else {

            totalDias = (totalMeses * 30)

            if (!dataInicio.isSame(compareDataInicioStartM)) {

                totalDias -= 30;
                diasInicio = (30 - dataInicio.date()) + contarFinal;
                totalDias += diasInicio;

            }

            if (!dataFim.isSame(compareDataFimStartM)) {

                totalDias -= 30;
                diasFim = dataFim.date();
                totalDias += diasFim;

            }

        }

        return { dias: totalDias, meses: totalMeses };
    }

    static calcularTempo360(dataNasc, dataFim = null) {

        if (dataFim === null) {
            dataFim = moment().format('YYYY-MM-DD');
        }

        const totalDay360 = DefinicaoTempo.dataDiffDateToDateCustom(
            dataNasc,
            dataFim
        );

        const totalDMY = DefinicaoTempo.convertD360ToDMY(totalDay360.dias);

        return totalDMY;
    }



    static calcularTempo360Dias(dataNasc, dataFim = null) {

        if (dataFim === null) {
            dataFim = moment().format('YYYY-MM-DD');
        }

        const totalDay360 = DefinicaoTempo.dataDiffDateToDateCustom(
            dataNasc,
            dataFim
        );

        return totalDay360;
    }


    static calcularTempo360MenosDiaFim(dataNasc, dataFim = null) {

        if (dataFim === null) {
            dataFim = moment().format('YYYY-MM-DD');
        }

        const totalDay360 = DefinicaoTempo.dataDiffDateToDateCustom(
            dataNasc,
            dataFim,
            false,
            0
        );

        const totalDMY = DefinicaoTempo.convertD360ToDMY(totalDay360.dias);

        return totalDMY;
    }


    /**
    * Diferença entre datas condiderando mês 30 dias e ano 360
    * @param dataInicio Inicio do periodo string data format ('YYYY-MM-DD')
    * @param dataFim Fim do periodo string data format ('YYYY-MM-DD')
    * @param mesInteiro Considerar sempre o mês Completo no inicio e fim
    */
    static dataDiffDateToDateCustomNotDayStart(dataInicio, dataFim, mesInteiro = false) {

        const dataInicioString = dataInicio;
        const dataFimString = dataFim;

        dataInicio = moment(dataInicio).hour(0).minute(0).second(0).millisecond(0);
        dataFim = moment(dataFim).hour(0).minute(0).second(0).millisecond(0);

        const compareDataInicioStartM = this.toDateStringYYYY(moment(dataInicioString, 'YYYY-MM-DD').startOf('month'));
        const compareDataFimStartM = this.toDateStringYYYY(moment(dataFimString, 'YYYY-MM-DD').endOf('month'));

        let totalDias = 0;
        let totalMeses = 0;

        let diasInicio = 0
        let diasFim = 0

        totalMeses = this.monthsDiff(compareDataInicioStartM, compareDataFimStartM);

        if ((dataInicio.isSame(compareDataInicioStartM) && dataFim.isSame(compareDataFimStartM)) || mesInteiro) {

            totalDias = (totalMeses * 30)

        } else {

            totalDias = (totalMeses * 30)

            if (!dataInicio.isSame(compareDataInicioStartM)) {

                totalDias -= 30;
                diasInicio = (30 - dataInicio.date());
                totalDias += diasInicio;

            }

            if (!dataFim.isSame(compareDataFimStartM)) {

                totalDias -= 30;
                diasFim = dataFim.date();
                totalDias += diasFim;

            }

        }

        return { dias: totalDias, meses: totalMeses };
    }

    static calcularTempo360NotDayStart(dataNasc, dataFim = null) {

        if (dataFim === null) {
            dataFim = moment().format('YYYY-MM-DD');
        }

        const totalDay360 = DefinicaoTempo.dataDiffDateToDateCustomNotDayStart(
            dataNasc,
            dataFim
        );

        const totalDMY = DefinicaoTempo.convertD360ToDMY(totalDay360.dias);

        return totalDMY;
    }

    static addDaysToDate(dateP, days) {
        const date = new Date(dateP);
        date.setDate(date.getDate() + days);

        return date;
    }


    static formataDataTo(formatIN, FormatOuT, data) {

        if (data !== undefined
            && data !== ''
            && moment(data, formatIN).isValid()
        ) {

            return moment(data, formatIN).format(FormatOuT);

        }

        return '';

    }

    static formateStringAnosMesesDias(anos, meses, dias, notDays = false) {

        if (notDays) {
            return ` ${anos} ano(s), ${meses} mes(es)`;
        }

        if (anos < 0) {
            return ` ${meses} mes(es) e ${Math.floor(dias)} dia(s)`;
        }

        return ` ${anos} ano(s), ${meses} mes(es) e ${Math.floor(dias)} dia(s)`;

    }

    /**
     * Formatar a data em formato objeto { years: 0, months: 0, days: 0, fullYears: fullYears }
     * @param  {} tempoObj
     * @param  {} notDays=false
     */
    static formateObjToStringAnosMesesDias(tempoObj, notDays = false) {

        let tempoString = '';

        if (notDays) {
            return ` ${tempoObj.years} ano(s) ${tempoObj.months} mes(es)`;
        }

        if (tempoObj.years > 0) {
            tempoString += ` ${tempoObj.years} ano(s)`;
        }

        if (tempoObj.months > 0) {
            tempoString += ` ${tempoObj.months} mes(es)`;
        }

        if (tempoObj.days > 0) {
            tempoString += ` ${Math.floor(tempoObj.days)} dia(s)`;
        }

        //  return `${tempoObj.years} ano(s), ${tempoObj.months} mes(es) e ${Math.floor(tempoObj.days)} dia(s)`;

        return tempoString;
    }

    /**
     * Converter tempo em anos para { years: 0, months: 0, days: 0, fullYears: fullYears }
     * @param  {} fullYears
     */
    static converterTempoAnos(fullYears) {

        const totalFator = { years: 0, months: 0, days: 0, fullYears: fullYears };

        const xValor = fullYears;

        totalFator.years = Math.floor(xValor);
        const xVarMes = (xValor - totalFator.years) * 12;
        totalFator.months = Math.floor(xVarMes);
        const dttDias = (xVarMes - totalFator.months) * 30;
        totalFator.days = Math.floor(dttDias);

        return totalFator;
    }

    /**
     * Identifica ano bissexto
     * @param year
     * @returns
     */
    static leapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }




    // private defineMelhorTempo(auxiliarDate) {

    //     let melhorTempo = 0;
    //     let dataFull = false;

    //     for (const vinculo of this.periodosList) {

    //       const inicioVinculo = this.toMoment(vinculo.data_inicio);
    //       const fimVinculo = this.toMoment(vinculo.data_termino);
    //       const fator = vinculo.fator_condicao_especialN;

    //       if (moment(auxiliarDate).isBetween(
    //         moment(inicioVinculo),
    //         moment(fimVinculo), 'month')) {
    //         melhorTempo = (30 * fator);
    //         dataFull = true;
    //       }

    //       if (moment(auxiliarDate).isSame(inicioVinculo, 'month') && !dataFull) {
    //         melhorTempo = ((30 - inicioVinculo.date()) + 1) * fator;
    //       }

    //       if (moment(auxiliarDate).isSame(fimVinculo, 'month') && !dataFull) {

    //         let tempo = fimVinculo.date();
    //         if (((fimVinculo.month() + 1) === 2) && (fimVinculo.date() === 28 || fimVinculo.date() === 29)
    //           || fimVinculo.date() === 31) {
    //           tempo = 30;
    //         }

    //         melhorTempo = (tempo * fator);

    //       }

    //     }

    //     melhorTempo = Math.floor(melhorTempo);
    //     //console.log('tempo = ' + melhorTempo + ' / ' + auxiliarDate.format('DD/MM/YYYY'))
    //     //console.log(melhorTempo);

    //     return melhorTempo;
    //   }


    //   private tempoTotal360(limitesDoVinculo) {

    //     return new Promise((resolve, reject) => {

    //       let auxiliarDate = moment(this.toDateString(limitesDoVinculo.inicio), 'DD/MM/YYYY');
    //       const fimContador = moment(this.toDateString(limitesDoVinculo.fim), 'DD/MM/YYYY');

    //       auxiliarDate.startOf('month');
    //       fimContador.endOf('month')

    //       let count = 0;
    //       let count88 = 0;
    //       let count91 = 0;
    //       let count98 = 0;
    //       let count99 = 0;
    //       let count15 = 0;
    //       let count19 = 0;

    //       const fimContador88 = this.momentCarenciaEnd(this.fimContador88);
    //       const fimContador91 = this.momentCarenciaEnd(this.fimContador91);
    //       const fimContador98 = this.momentCarenciaEnd(this.fimContador98);
    //       const fimContador99 = this.momentCarenciaEnd(this.fimContador99);
    //       const fimContador15 = this.momentCarenciaEnd(this.fimContador15);
    //       const fimContador19 = this.momentCarenciaEnd(this.fimContador19);

    //       let melhorTempo = 0;

    //       do {

    //         melhorTempo = this.defineMelhorTempo(auxiliarDate)

    //         if (melhorTempo > 0) {

    //           count += melhorTempo;

    //           if (auxiliarDate.isSameOrBefore(fimContador88, 'month')) {
    //             count88 += (auxiliarDate.isSame(fimContador88, 'month')) ? 5 : melhorTempo;
    //           };

    //           if (auxiliarDate.isSameOrBefore(fimContador91, 'month')) {
    //             count91 += (auxiliarDate.isSame(fimContador91, 'month')) ? 4 : melhorTempo;
    //           };

    //           if (auxiliarDate.isSameOrBefore(fimContador98, 'month')) {
    //             count98 += (auxiliarDate.isSame(fimContador98, 'month')) ? 15 : melhorTempo;
    //           };

    //           if (auxiliarDate.isSameOrBefore(fimContador99, 'month')) {
    //             count99 += (auxiliarDate.isSame(fimContador99, 'month')) ? 5 : melhorTempo;
    //           };

    //           if (auxiliarDate.isSameOrBefore(fimContador15, 'month')) {
    //             count15 += (auxiliarDate.isSame(fimContador99, 'month')) ? 5 : melhorTempo;
    //           };

    //           if (auxiliarDate.isSameOrBefore(fimContador19, 'month')) {
    //             count19 += (auxiliarDate.isSame(fimContador19, 'month')) ? 13 : melhorTempo;
    //           };
    //         }

    //         auxiliarDate = moment(this.toDateString(auxiliarDate), 'DD/MM/YYYY').add(1, 'M');

    //       } while (fimContador.isSameOrAfter(auxiliarDate));

    //       this.tempoTotalConFator = DefinicaoTempo.convertD360ToDMY(count);
    //       this.tempoTotalConFator88 = DefinicaoTempo.convertD360ToDMY(count88);
    //       this.tempoTotalConFator91 = DefinicaoTempo.convertD360ToDMY(count91);
    //       this.tempoTotalConFator98 = DefinicaoTempo.convertD360ToDMY(count98);
    //       this.tempoTotalConFator99 = DefinicaoTempo.convertD360ToDMY(count99);
    //       this.tempoTotalConFator15 = DefinicaoTempo.convertD360ToDMY(count15);
    //       this.tempoTotalConFator19 = DefinicaoTempo.convertD360ToDMY(count19);

    //       // console.log(this.tempoTotalConFator);
    //       // console.log(this.tempoTotalConFator88);
    //       // console.log(this.tempoTotalConFator91);
    //       // console.log(this.tempoTotalConFator98);
    //       // console.log(this.tempoTotalConFator99);
    //       // console.log(this.tempoTotalConFator19);

    //       if (this.tempoTotalConFator) {

    //         // this.verificaPeriodoAposReforma();
    //         // this.subTotais();
    //         resolve(true);
    //       } else {
    //         reject(false);
    //       }
    //     });

    //   }



    // private countdown(targetDate) {
    //   let nowMillis = new Date().getTime();
    //   let targetMillis = targetDate.getTime();
    //   let duration = targetMillis - nowMillis;
    //   let years = Math.floor(duration / 3.154e+10);
    //   let durationMinusYears = duration - (years * 3.154e+10);
    //   let months = Math.floor(duration / 2.628e+9) % 12;
    //   let durationMinusMonths = durationMinusYears - (months * 2.628e+9);
    //   let days = Math.floor(durationMinusMonths / 8.64e+7);
    //   let hours = Math.floor(duration / 3.6e+6 ) % 24;
    //   let mins = Math.floor(duration / 60000 ) % 60;
    //   let secs = Math.floor(duration / 1000 ) % 60;

    //   return [ years, months, days, hours, mins, secs ];
    // }
}
