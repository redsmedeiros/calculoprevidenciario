
import { Console } from 'console';


export class UserFunctions {


    static userCheCkPremium() {
        const tipoProduto = window.localStorage.getItem('product');
        return (tipoProduto === '3jrim7u0');
    }

    static userRedirectAssinatura() {

        if (this.userCheCkPremium()) {
            const baseURL = window.location.origin;
            window.location.href = `${baseURL}/#/`;
        }


    }

    static linkOldSimuladorAcess(){

    }

}
