
import * as moment from 'moment';
import { DefinicaoMoeda } from './definicao-moeda';
import { ValorContribuido } from 'app/+rgps/+rgps-valores-contribuidos/ValorContribuido.model';


export class DefinicaoSalariosContribuicao {

    // constructor(){}


    static setValoresCotribuicaoRMICT(listaPeriodosCT, calculo) {

        const dataInicioBeneficio = moment(calculo.data_pedido_beneficio, 'DD/MM/YYYY')
        this.convertContribuicoesJSON(listaPeriodosCT, dataInicioBeneficio);

        const scMerge = this.mergeSalariosContribiocao(listaPeriodosCT);
        this.groupSalariosContribuicoes(scMerge, dataInicioBeneficio, calculo.soma);

        console.log(calculo);
        console.log(listaPeriodosCT);

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


        scMerge.sort(function (a, b) {

            const cp1 = moment(a.cp, 'MM/YYYY');
            const cp2 = moment(b.cp, 'MM/YYYY');

            if (cp1 > cp2) {
                return 1;
            }
            if (cp1 < cp2) {
                return -1;
            }
            return 0;
        });


        return scMerge;
    }


    static groupSalariosContribuicoes(scMerge, dataInicioBeneficio, somarSecundaria) {



        const scObj = new ValorContribuido;

        const listaDeSCRMI = [];
        let lastDate;

        for (const rowSC of scMerge) {

            const newDate = moment(rowSC.cp, 'MM/YYYY');

            if (this.isExits(lastDate) && newDate.isSame(lastDate, 'month')) {

                listaDeSCRMI.push({
                    data: newDate.format('YYYY-MM-DD'),
                    valor_primaria: rowSC.sc,
                    valor_secundaria: 1
                });

            } else {

                listaDeSCRMI.push({
                    data: newDate.format('YYYY-MM-DD'),
                    valor_primaria: rowSC.sc,
                    valor_secundaria: 0
                });

            }


            lastDate = newDate.clone();

        }


        console.log(listaDeSCRMI);

        // Nova regra Lei 13.846/19 - não há constribuições secundárias, secundárias devem ser somadas as primarias; 
        if (dataInicioBeneficio.isAfter(moment('17/06/2019', 'DD/MM/YYYY')) || somarSecundaria) {




        //     const listaDeSCRMISoma = [];
        //     listaDeSCRMI.reduce((sc1, sc2) => {

        //         const cp1 = moment(sc1.data)
        //         const cp2 = moment(sc2.data)

        //         if (cp1.isSame(cp2, 'month') && sc1.valor_secundaria === 1 && sc2.valor_secundaria === 1) {

        //         }else{

        //         }


        //     });

        //     let cplast = moment('1900-01-01')
        //     for (const rowR of listaDeSCRMI) {

        //         let cpnew = moment(rowR.data)


        //         if (cpnew.isSame(cplast, 'month')) {


        //             cplast = cpnew
        //         }else{


        //         }

        //     }


        // const replacePontos = function (valor) {
        //     return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
        // };

        // const somaContrib = function (valor1, valor2) {
        //     return Number((replacePontos(valor1) + replacePontos(valor2)).toFixed(2))
        //         .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        // };


        // const result = [];
        // listaDeSCRMI.reduce(function (res, value) {
        //     if (!res[value.data + '-' + value.contributionType]) {
        //         res[value.data + '-' + value.contributionType] = {
        //             contrib: '0,00',
        //             data: value.data,
        //             contributionType: value.contributionType
        //         };
        //         result.push(res[value.data + '-' + value.contributionType])
        //     }
        //     res[value.data + '-' + value.contributionType].contrib =
        //         somaContrib(res[value.data + '-' + value.contributionType].contrib, value.contrib);


        //     return res;
        // }, {});



    }

        return listaDeSCRMI;


    }


    static isExits(value) {
    return (typeof value !== 'undefined' &&
        value != null && value !== 'null' &&
        value !== undefined) ? true : false;
}



}
