
import * as moment from 'moment';
import { DefinicaoMoeda } from './definicao-moeda';


export class DefinicaoSalariosContribuicao {

    // constructor(){}


    static setValoresCotribuicaoRMICT(listaPeriodosCT) {

        this.convertContribuicoes(listaPeriodosCT)
       const scMerge = this.mergeSalariosContribiocao(listaPeriodosCT);
        this.groupSalariosContribuicoes(scMerge)

        console.log(listaPeriodosCT);
    }

    static convertContribuicoes(listaPeriodosCT) {

        listaPeriodosCT.map((rowObj) => {

            if (this.isExits(rowObj.sc)) {
                rowObj.sc = JSON.parse(rowObj.sc);
            }

        });

        return listaPeriodosCT;
    }

    static mergeSalariosContribiocao(listaPeriodosCT) {

        const scMerge = [];
        for (const periodo of listaPeriodosCT) {

            scMerge.push(...periodo.sc)

        }

        console.log(scMerge);

        return scMerge;
    }


    static groupSalariosContribuicoes(scMerge) {

        const scObj = {
            data: '',
            valor_primaria: '',
            valor_secundaria: 0
        }

        for (const rowSC of scMerge) {

        }



    }


    static isExits(value) {
        return (typeof value !== 'undefined' &&
            value != null && value !== 'null' &&
            value !== undefined) ? true : false;
    }



}
