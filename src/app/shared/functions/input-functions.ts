
import * as moment from 'moment';
import { Console } from 'console';


export class InputFunctions {


    static moveNextInput(event, maxLength, nextElementId) {

        const value = event.srcElement.value;

        if (isNaN(value)) {
            const element = <HTMLInputElement>document.getElementById(event.srcElement.id);
            element.value = '';
        }

        if (value != '' && value.length >= maxLength) {
            const next = <HTMLInputElement>document.getElementById(nextElementId);
            next.focus();
           // next.setSelectionRange(0, 0);
            next.select();
        }

    }


    static moveNextMask(event, maxLength, nextElementId) {

        const value = event.srcElement.value;

        // if (isNaN(value)) {
        //     const element = <HTMLInputElement>document.getElementById(event.srcElement.id);
        //     element.value = '';
        // }

        if (value.indexOf('_') < 0 && value != '') {
            const next = <HTMLInputElement>document.getElementById(nextElementId);
            next.focus();
        }
    }
}
