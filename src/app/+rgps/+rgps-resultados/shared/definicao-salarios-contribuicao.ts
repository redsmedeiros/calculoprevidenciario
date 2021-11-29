
import * as moment from 'moment';
import { ValorContribuido } from 'app/+rgps/+rgps-valores-contribuidos/ValorContribuido.model';
import { DefinicaoMoeda } from 'app/shared/functions/definicao-moeda';


export class DefinicaoSalariosContribuicao {

    // constructor(){}


    static setValoresCotribuicaoRMICT(listaPeriodosCT) {

        'use strict';
        // const dataInicioBeneficio = moment(calculo.data_pedido_beneficio, 'DD/MM/YYYY');
        const dataInicioBeneficio = null;
        this.convertContribuicoesJSON(listaPeriodosCT, dataInicioBeneficio);

        const scMerge = this.mergeSalariosContribiocao(listaPeriodosCT);
        const scGroupContribuicoes = this.groupSalariosContribuicoes(scMerge);

        return scGroupContribuicoes;
    }

    static convertContribuicoesJSON(listaPeriodosCT, dataInicioBeneficio) {

        'use strict';


        listaPeriodosCT.map((rowObj) => {

            // console.log((this.isExits(rowObj.sc) && (typeof rowObj.sc === 'string' || typeof rowObj.sc !== 'object')));

            if (this.isExits(rowObj.sc) && (typeof rowObj.sc === 'string' || typeof rowObj.sc !== 'object')) {
                rowObj.sc = JSON.parse(rowObj.sc);
            }

            rowObj.sc_original = rowObj.sc;

            if (this.isExits(rowObj.sc)) {
                rowObj.sc = this.checarSalariosContribuicao(rowObj);
            }
        });

        return listaPeriodosCT;
    }

    static checarSalariosContribuicao(rowObj) {
        'use strict';

        // if (rowObj.sc_mm_ajustar !== 1) {
        //     // rowObj.sc = rowObj.sc.filter((scRow) => (scRow.msc === 0 && scRow.sc !== '0,00' && scRow.sc !== 0));


        //     rowObj.sc = rowObj.sc.filter((scRow) => (((scRow.msc === 0 && moment(scRow.cp, 'MM/YYYY').isAfter('2019-11-13', 'month')
        //         || moment(scRow.cp, 'MM/YYYY').isBefore('2019-11-13', 'month')))
        //         && scRow.sc !== '0,00' && scRow.sc !== 0 && scRow.sc !== 0.00 && scRow.sc !== ''));

        // } else {

        //     rowObj.sc = rowObj.sc.filter((scRow) => (scRow.sc !== '' && scRow.sc !== '0,00'
        //         && scRow.sc !== 0 && scRow.sc !== 0.00 && scRow.sc !== 0));

        // }

        rowObj.sc = rowObj.sc.filter((scRow) => (scRow.sc !== '' && scRow.sc !== '0,00'));

        return rowObj.sc
    }

    //  static filterSCAposDecreto10410(listSM, sc_mm_ajustar){

    //     if (sc_mm_ajustar !== 1) {
    //         listSM = listSM.filter((scRow) => ( scRow.msc === 0 && scRow.sc !== '0,00' && scRow.sc !== 0));

    //            // listSM = listSM.filter((scRow) => (((scRow.msc === 0 && moment(scRow.cp, 'MM/YYYY').isAfter('2019-11-13', 'month')
    //         //     || moment(scRow.cp, 'MM/YYYY').isBefore('2019-11-13', 'month')))
    //         //     && scRow.sc !== '0,00' && scRow.sc !== 0));
    //     }

    //     return listSM

    //  }




    static setMCAjuste(periodo) {

        const n_ajustar_mm = !(periodo.sc_mm_ajustar === 0
            && periodo.sc_mm_considerar_tempo === 1);

        periodo.sc.map((SC) => {
            SC.sc_ao_m = (SC.msc === 1 && n_ajustar_mm);
        });

        return periodo
    }



    static mergeSalariosContribiocao(listaPeriodosCT) {
        'use strict';

        const scMerge = [];
        for (const periodo of listaPeriodosCT) {

            this.setMCAjuste(periodo);
            scMerge.push(...periodo.sc)
        }

        scMerge.sort((a, b) => {

            const cp1 = moment(a.cp, 'MM/YYYY');
            const cp2 = moment(b.cp, 'MM/YYYY');

            const valor1 = parseFloat(a.sc)
            const valor2 = parseFloat(b.sc)

            if (cp1.isSame(cp2, 'month')) {
                return valor1 < valor2 ? -1 : 1
            } else {
                if (cp1 < cp2) {
                    return 1;
                }
                if (cp1 > cp2) {
                    return -1;
                }
                return 0;
            }

        })


        return scMerge;
    }



    static verificarRejusteConcomitante(anterior, atual) {

        if (!anterior || !atual) {
            return false;
        }

        return true;
    }

    static groupSalariosContribuicoes(scMerge) {
        'use strict';

        const listaDeSCRMI = [];
        let lastDate;
        const lastObject = {
            data: '',
            valor_primaria: 0,
            valor_secundaria: 0,
            array_secundaria: [],
            sc_mm_ajustar: true
        };

        for (const rowSC of scMerge) {

            const newDate = moment(rowSC.cp, 'MM/YYYY');
            rowSC.sc = DefinicaoMoeda.convertDecimalValue(rowSC.sc);

            if (!newDate.isSame(lastDate, 'month')) {

                listaDeSCRMI.push({
                    data: newDate.format('YYYY-MM-DD'),
                    valor_primaria: rowSC.sc,
                    valor_secundaria: 0,
                    array_secundaria: [],
                    sc_mm_ajustar: rowSC.sc_ao_m,
                });

            } else {

                const indexSec = (listaDeSCRMI.length > 0) ? listaDeSCRMI.length - 1 : 0

                listaDeSCRMI[indexSec].array_secundaria.push(rowSC.sc);
                listaDeSCRMI[indexSec].valor_secundaria += rowSC.sc;
                listaDeSCRMI[indexSec].sc_mm_ajustar = this.verificarRejusteConcomitante(
                                                        listaDeSCRMI[indexSec].sc_mm_ajustar, rowSC.sc_ao_m);

            }


            lastDate = newDate.clone();

        }

        // Nova regra Lei 13.846/19 - não há constribuições secundárias, secundárias devem ser somadas as primarias; 
        // if (dataInicioBeneficio.isAfter(moment('17/06/2019', 'DD/MM/YYYY')) || somarSecundaria) {}

        return listaDeSCRMI;


    }


    static isExits(value) {
        'use strict';

        return (typeof value !== 'undefined' &&
            value != null && value !== 'null' &&
            value !== undefined) ? true : false;
    }



}
