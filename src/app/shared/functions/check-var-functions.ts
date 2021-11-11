
import { Console } from 'console';

export class CheckVarFunctions {


    static isEmpty(data) {
        if (data === undefined
            || data === ''
            || typeof data === 'undefined'
            || data === 'undefined') {
            return true;
        }
        return false;
    }

    static isExist(data) {
        if (data === undefined
            || typeof data === 'undefined'
            || data === 'undefined') {
            return false;
        }
        return true;
    }


}
