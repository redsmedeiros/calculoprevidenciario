
import * as moment from 'moment';
import { Console } from 'console';


export class DefinicaoTempo {



    static toDateStringYYYY(date) {
        return moment(date).format('YYYY-MM-DD');
    }


    

    static monthsDiff(d1, d2) {
        let date1 = new Date(d1);
        let date2 = new Date(d2);
        let years = date2.getFullYear() - date1.getFullYear();
        let months = (years * 12) + (date2.getMonth() - date1.getMonth());
        return months;
    }


    static dataDiffDateToDateCustom(dataInicio, dataFim) {

        const dataInicioString = this.toDateStringYYYY(dataInicio.clone());
        const dataFimString = this.toDateStringYYYY(dataFim.clone());

        const compareDataInicioStartM = this.toDateStringYYYY(moment(dataInicioString, 'YYYY-MM-DD').startOf('month'));
        const compareDataFimStartM = this.toDateStringYYYY(moment(dataFimString, 'YYYY-MM-DD').endOf('month'));

        let totalDias = 0;
        let totalMeses = 0;

        let diasInicio = 0
        let diasFim = 0
        // console.log(dataInicioString);
        // console.log(dataFimString);


        //  let teste = dataInicio.clone().hour(0).minute(0).second(0).millisecond(0);
        //  let dataInicioString = moment(this.toDateStringYYYY(teste), 'YYYY-MM-DD');


        console.log('------')
        totalMeses = this.monthsDiff(compareDataInicioStartM, compareDataFimStartM);

        console.log(totalMeses);

        if (dataInicio.isSame(compareDataInicioStartM) && dataFim.isSame(compareDataFimStartM)) {

            totalDias = (totalMeses * 30)

        } else {

            totalDias = (totalMeses * 30)


            if (dataInicio.isSame(compareDataInicioStartM)) {


            } else {

                totalDias -= 30;
                diasInicio = (30 - dataInicio.date()) + 1;
                totalDias += diasInicio;

            }


            if (dataFim.isSame(compareDataFimStartM)) {

                //console.log(compareDataFimStartM);

            } else {

                totalDias -= 30;
                diasFim = dataFim.date();
                totalDias += diasFim;

            }



        }


        console.log(totalDias);


    }


    //








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
