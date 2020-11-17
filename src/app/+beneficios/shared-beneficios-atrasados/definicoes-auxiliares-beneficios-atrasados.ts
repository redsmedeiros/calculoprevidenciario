import * as moment from 'moment';


export class DefinicoesAuxiliaresBeneficiosAtrasados {



    public static isEmptyInput(input) {
        if (input == '' || input === undefined || input === null) {
            return true;
        }

        return false;
    }

    public static isValidFloat(input) {

        if (typeof input == 'string' && (/\,/).test(input)) {
            input = input.replace(',', '.');
        }

        if (isNaN(input)) {
            return false;
        }
        return true;
    }

    public static isValidDate(date) {

        if (!this.isExits(date)) {
            return false;
        }

        let bits = date.split('/');
        let d = new Date(bits[2], bits[1] - 1, bits[0]);
        return d && (d.getMonth() + 1) == bits[1];

    }



    public static isExits(value) {
        return (typeof value !== 'undefined' &&
            value != null && value != 'null' &&
            value !== undefined && value != '')
            ? true : false;
    }


    public static compareDates(date1, date2) {
        let bits1 = date1.split('/');
        let d1 = new Date(bits1[2], bits1[1] - 1, bits1[0]);
        let bits2 = date2.split('/');
        let d2 = new Date(bits2[2], bits2[1] - 1, bits2[0]);
        return d1 <= d2;
    }

    public static getFormatedDate(date: Date) {
        let dd: any = date.getDate();
        let mm: any = date.getMonth() + 1; // January is 0!
        dd = '0' + dd;
        mm = '0' + mm;
        let yyyy = date.getFullYear();

        let today = dd.slice(-2) + '/' +
            mm.slice(-2) + '/' + yyyy;
        return today;
    }

    public static formatReceivedDate(inputDate) {
        let date = new Date(inputDate);
        date.setTime(date.getTime() + (5 * 60 * 60 * 1000))

        if (!isNaN(date.getTime()) && inputDate != null) {
            // Months use 0 index.
            return ('0' + (date.getDate())).slice(-2) + '/' +
                ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
                date.getFullYear();
        }

        return '';
    }
}
