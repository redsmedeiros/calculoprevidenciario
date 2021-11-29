import * as moment from 'moment';


export class DefinicaoMoeda {


    static currencyList = [
        {
            'startDate': '1000-01-01',
            'endDate': '1942-10-31',
            'acronimo': 'MR$',
            'nome': 'Mil-Réis',
            'indiceCorrecaoAnterior': 1
        },
        {
            'startDate': '1942-11-01',
            'endDate': '1967-02-12',
            'acronimo': 'Cr$',
            'nome': 'Cruzeiro',
            'indiceCorrecaoAnterior': 1000
        },
        {
            'startDate': '1967-02-13',
            'endDate': '1970-05-15',
            'acronimo': 'NCR$',
            'nome': 'Cruzeiro Novo',
            'indiceCorrecaoAnterior': 1000
        },
        {
            'startDate': '1970-05-15',
            'endDate': '1986-02-28',
            'acronimo': 'Cr$',
            'nome': 'Cruzeiro',
            'indiceCorrecaoAnterior': 1
        },
        {
            'startDate': '1986-03-01',
            'endDate': '1988-12-31',
            'acronimo': 'CZ$',
            'nome': 'Cruzado',
            'indiceCorrecaoAnterior': 1000
        },
        {
            'startDate': '1989-01-01',
            'endDate': '1990-03-15',
            'acronimo': 'NCZ$',
            'nome': 'Cruzado Novo',
            'indiceCorrecaoAnterior': 1000
        },
        {
            'startDate': '1990-03-16',
            'endDate': '1993-07-31',
            'acronimo': 'Cr$',
            'nome': 'Cruzeiro',
            'indiceCorrecaoAnterior': 1
        },
        {
            'startDate': '1993-08-01',
            'endDate': '1994-02-28',
            'acronimo': 'CR$',
            'nome': 'Cruzeiro Real',
            'indiceCorrecaoAnterior': 1000
        },
        {
            'startDate': '1994-03-01',
            'endDate': '1994-06-30',
            'acronimo': 'URV',
            'nome': 'Unidade Real de Valor',
            'indiceCorrecaoAnterior': 637.639978027344
        },
        {
            'startDate': '1994-07-01',
            'endDate': '9999-12-31',
            'acronimo': 'R$',
            'nome': 'Real',
            'indiceCorrecaoAnterior': 1
        }
    ];


    /**
     * Converter moeda entre os tipos por data
     * @param valor 
     * @param dataCorrente 
     * @param dataConversao 
     */
    static convertCurrency(valor, dataCorrente, dataConversao) {
        let valorConvertido = parseFloat(valor);
        for (const currency of this.currencyList) {
            const startDate = moment(currency.startDate);
            const endDate = moment(currency.endDate);
            if (dataCorrente > endDate) {
                // já esta em uma data maior que a data que a moeda termina, procurar na proxima
                continue;
            } else if (startDate > dataConversao) {
                // já ultrapassou a data de conversão, finalizar o calculo
                break;
            } else if (dataCorrente < endDate && dataCorrente >= startDate) {
                // Propria Moeda, não há corte.
                continue;
            } else if (dataCorrente <= endDate) {
                // Estamos na moeda seguinte, converter divindindo pelo indiceDeCorreção;
                valorConvertido /= currency.indiceCorrecaoAnterior;
            }
        }
        return valorConvertido;
    }

    /**
     * Localizar a moeda conforme a data
     * @param  {} data
     */
    static loadCurrency(data) {
        for (const currency of this.currencyList) {
            const startDate = moment(currency.startDate);
            const endDate = moment(currency.endDate);
            if (startDate <= data && data <= endDate) {
                return currency;
            }
        }
    }
    /**
     * Formatar para moeda 
     * @param  {} value
     * @param  {} sigla='R$'
     */
    static formatMoney(value, sigla = 'R$') {

        value = parseFloat(value);
        const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

        return sigla + ' ' + numeroPadronizado;
    }

    /**
     * 
     * @param  {} value
     * @param  {} n_of_decimal_digits
     */
    static formatDecimal(value, n_of_decimal_digits) {
        value = parseFloat(value);
        return (value.toFixed(parseInt(n_of_decimal_digits, 10))).replace('.', ',');
    }

    /**
     * Converter o valor string para decimal
     * @param  {} valor
     */
    static convertDecimalValue(valor) {

        if (!isNaN(valor)) {
            return valor;
        }

        if ((/\,/).test(valor)) {
            valor = valor.replace('R$', '').replace(/\./g, '').replace(',', '.');
        } else {
            valor = valor.replace('R$', '');
        }

        return isNaN(valor) ? 0 : parseFloat(valor);

    }

    /**
     * Ajustar ao teto e minimo
     /**
      * @param  {} valor
      * @param  {} data
      * @param  {} moeda
      */
    private limitarTetosEMinimos(valor, moeda) {

        const salarioMinimo = (moeda) ? moeda.salario_minimo : 0;
        const tetoSalarial = (moeda) ? moeda.teto : 0;
        let avisoString = '';
        let valorRetorno = valor;

        if (moeda && valor < salarioMinimo) {

            valorRetorno = parseFloat(salarioMinimo);
            avisoString = 'LIMITADO AO MÍNIMO'

        } else if (moeda && valor > tetoSalarial) {

            valorRetorno = parseFloat(tetoSalarial);
            avisoString = 'LIMITADO AO TETO'

        }

        return { valor: valorRetorno, aviso: avisoString };
    }




}
