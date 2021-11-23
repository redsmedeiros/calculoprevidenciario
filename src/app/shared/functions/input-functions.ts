
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



    /**
    * Selecionar somente umm checkBox De acordo com a Classe e Id
    * @param idRow id do elemeto unico
    * @param className classe de todos os checkbox
    */
    static unCheckedAll(className) {

        const listCheckBox = Array.from(document.querySelectorAll(className));
        listCheckBox.forEach((rowCheck) => {
            (<HTMLInputElement>rowCheck).checked = false;
        });

    }

    /**
     * Selecionar somente umm checkBox De acordo com a Classe e Id
     * @param idRow id do elemeto unico
     * @param className classe de todos os checkbox
     */
    static checkedUnique(idRow: string, className: string) {

        // const teste2 = <HTMLInputElement>document.getElementById(idRow);
        // const teste2 = <HTMLInputElement>document.querySelector('.checkboxSegurado:checked');
        const listCheckBox = Array.from(document.querySelectorAll(className));
        listCheckBox.forEach((rowCheck) => {

            // if ((<HTMLInputElement>rowCheck).value !== teste2.value) {
            if ((<HTMLInputElement>rowCheck).id !== idRow) {
                (<HTMLInputElement>rowCheck).checked = false;
            }

        });

    }

    /**
     * Selecionar somente umm checkBox De acordo com a Classe e Id
     * @param idRow id do elemeto unico
     * @param className classe de todos os checkbox
     */
    static checkedUniqueCount(idRow: string, className: string) {

        // const teste2 = <HTMLInputElement>document.getElementById(idRow);
        // const teste2 = <HTMLInputElement>document.querySelector('.checkboxSegurado:checked');
        let count = 0
        const listCheckBox = Array.from(document.querySelectorAll(className));
        listCheckBox.forEach((rowCheck) => {

            if ((<HTMLInputElement>rowCheck).id === idRow && (<HTMLInputElement>rowCheck).checked) {
                count++;
            }

        });

        return count;
    }

}
