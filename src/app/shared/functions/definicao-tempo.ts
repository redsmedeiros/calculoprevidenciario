
import * as moment from 'moment';
import { Console } from 'console';


export class DefinicaoTempo {



    static toDateStringYYYY(date) {
        return moment(date).format('YYYY-MM-DD');
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
        const months = (years * 12) + (date2.getMonth() - date1.getMonth());
        return months;
    }

    /**
     * Aplicar fator se houver
     * @param daysY360 
     * @param fator 
     */
    static aplicarFator(daysY360, fator) {

        if (fator !== 1 && fator > 0) {
            return daysY360 * fator;
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
     */
    static dataDiffDateToDateCustom(dataInicio, dataFim, mesInteiro = false) {

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
                diasInicio = (30 - dataInicio.date()) + 1;
                totalDias += diasInicio;

            }

            if (!dataFim.isSame(compareDataFimStartM)) {

                totalDias -= 30;
                diasFim = dataFim.date();
                totalDias += diasFim;

            }

        }

        return{dias: totalDias, meses: totalMeses};
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


}
