
import * as moment from 'moment';
import { Console } from 'console';


export class DefinicaoTempo {


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
