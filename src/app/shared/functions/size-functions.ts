
import { Console } from 'console';

export class SizeFunctions {


    static isWidthGreaterThan(size) {

        const width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        return (width > size);
    }



    static isHeightGreaterThan(size) {

        const height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        return (height > size);

    }


}
