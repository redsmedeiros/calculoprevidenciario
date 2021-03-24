import * as moment from 'moment';


export class IndiceBuracoNegro {

    static indicesList = [{
        dataDIB: '1988-10-01',
        reajuste1: 9140.5469,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1988-11-01',
        reajuste1: 7214.8978,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1988-12-01',
        reajuste1: 5630.0412,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-01-01',
        reajuste1: 4383.7397,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-02-01',
        reajuste1: 3235.7122,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-03-01',
        reajuste1: 2781.0141,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-04-01',
        reajuste1: 2626.0765,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-05-01',
        reajuste1: 2430.2022,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-06-01',
        reajuste1: 2082.971,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-07-01',
        reajuste1: 1609.7148,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-08-01',
        reajuste1: 1263.5124,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-09-01',
        reajuste1: 948.7253,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-10-01',
        reajuste1: 695.8015,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-11-01',
        reajuste1: 501.4424,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1989-12-01',
        reajuste1: 337.7399,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-01-01',
        reajuste1: 223.2548,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-02-01',
        reajuste1: 132.7397,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-03-01',
        reajuste1: 76.2915,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-04-01',
        reajuste1: 41.877,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-05-01',
        reajuste1: 36.5196,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-06-01',
        reajuste1: 34.0319,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-07-01',
        reajuste1: 30.4836,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-08-01',
        reajuste1: 27.0676,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-09-01',
        reajuste1: 24.1288,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-10-01',
        reajuste1: 21.1174,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-11-01',
        reajuste1: 18.4544,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1990-12-01',
        reajuste1: 15.7838,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1991-01-01',
        reajuste1: 13.2481,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1991-02-01',
        reajuste1: 10.9534,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1991-03-01',
        reajuste1: 9.1128,
        reajuste2: 1.3726,
    }, {
        dataDIB: '1991-04-01',
        reajuste1: 8.1517,
        reajuste2: 1.3726,
    }];


    static inicioBN = moment('1988-10-05');
    static finalBN = moment('1991-04-04');


    /**
     * retornar o indice de reajuste para 06-1992 conforme a DIB
     * @param dataDIB
     * @returns object
     */
    static get(dataDIB) {

        const indiceReajuste = this.indicesList.find((indice) => { return moment(indice.dataDIB).isSame(dataDIB) });

        if (indiceReajuste === undefined) {
            return {
                dataDIB: dataDIB,
                reajuste1: 1.0000,
                reajuste2: 1.0000,
            };
        }

        return indiceReajuste;

    }

    /**
     * verificar se o periodo corresponde ao buraco negro
     * @param dibDate dib moment
     * @returns bool
     */
    static checkDIB(dibDate) {

        // if (dibDate >= this.inicioBN && dibDate <= this.finalBN) {
        if (moment(dibDate).isBetween(this.inicioBN, this.finalBN, undefined, '[]')) {
            return true;
        }

        return false;
    }




}
