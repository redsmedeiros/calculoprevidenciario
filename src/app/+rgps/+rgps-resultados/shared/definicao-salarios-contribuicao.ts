
import * as moment from 'moment';
import { ValorContribuido } from 'app/+rgps/+rgps-valores-contribuidos/ValorContribuido.model';
import { DefinicaoMoeda } from 'app/shared/functions/definicao-moeda';


export class DefinicaoSalariosContribuicao {

    // constructor(){}


    static setValoresCotribuicaoRMICT(listaPeriodosCT) {

        // const dataInicioBeneficio = moment(calculo.data_pedido_beneficio, 'DD/MM/YYYY');
        const dataInicioBeneficio = null;
        this.convertContribuicoesJSON(listaPeriodosCT, dataInicioBeneficio);

        const scMerge = this.mergeSalariosContribiocao(listaPeriodosCT);
        const scGroupContribuicoes = this.groupSalariosContribuicoes(scMerge);

        return scGroupContribuicoes;
    }

    static convertContribuicoesJSON(listaPeriodosCT, dataInicioBeneficio) {


        listaPeriodosCT.map((rowObj) => {

            if (this.isExits(rowObj.sc)) {
                rowObj.sc = JSON.parse(rowObj.sc);
                // rowObj.sc = this.checarSalariosContribuicao(rowObj, dataInicioBeneficio);
            }

        });

        return listaPeriodosCT;
    }

    static checarSalariosContribuicao(rowObj, dataInicioBeneficio) {


        if (rowObj.sc_mm_ajustar !== 1) {
            rowObj.sc = rowObj.sc.filter((sc) => sc.msc === 0);
        }


        return rowObj.sc
    }

    static mergeSalariosContribiocao(listaPeriodosCT) {

        const scMerge = [];
        for (const periodo of listaPeriodosCT) {
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
                if (cp1 > cp2) {
                    return 1;
                }
                if (cp1 < cp2) {
                    return -1;
                }
                return 0;
            }

        })


        return scMerge;
    }


    static groupSalariosContribuicoes(scMerge) {


        const listaDeSCRMI = [];
        let lastDate;
        const lastObject = {
            data: '',
            valor_primaria: 0,
            valor_secundaria: 0,
            array_secundaria: []
        };

        for (const rowSC of scMerge) {

            const newDate = moment(rowSC.cp, 'MM/YYYY');
            rowSC.sc = DefinicaoMoeda.convertDecimalValue(rowSC.sc);

            if (!newDate.isSame(lastDate, 'month')) {

                listaDeSCRMI.push({
                    data: newDate.format('YYYY-MM-DD'),
                    valor_primaria: rowSC.sc,
                    valor_secundaria: 0,
                    array_secundaria: []
                });

            } else {

                listaDeSCRMI[listaDeSCRMI.length - 1].array_secundaria.push(rowSC.sc);
                listaDeSCRMI[listaDeSCRMI.length - 1].valor_secundaria += rowSC.sc;

            }


            lastDate = newDate.clone();

        }

        // Nova regra Lei 13.846/19 - não há constribuições secundárias, secundárias devem ser somadas as primarias; 
        // if (dataInicioBeneficio.isAfter(moment('17/06/2019', 'DD/MM/YYYY')) || somarSecundaria) {}

        return listaDeSCRMI;


    }


    static isExits(value) {
        return (typeof value !== 'undefined' &&
            value != null && value !== 'null' &&
            value !== undefined) ? true : false;
    }



}
