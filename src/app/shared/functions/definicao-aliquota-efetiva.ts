
import * as moment from 'moment';
import { Console } from 'console';

/**
 * Define a aliquota efetiva de reconhimento para previdência confome a EC103/2019
 */
export class DefinicaoAliquotaEfetiva {

    // static maximoValor = [
    //     { f: 'faixa1', v: 78.38 },
    //     { f: 'faixa2', v: 94.01 },
    //     { f: 'faixa3', v: 125.38 },
    //     { f: 'faixa4', v: 415.33 },
    // ];

    static maximoValor = [
        { f: 'faixa1', v: 82.50},
        { f: 'faixa2', v: 99.31 },
        { f: 'faixa3', v: 132.21 },
        { f: 'faixa4', v: 437.97 },
    ];

    static aliquotasParametros = {
        faixa1: { percentual: 7.50, min: 1100.00, max: 1100.00, valor_maximo:  82.50 },
        faixa2: { percentual: 9, min: 1100.01, max: 2203.48, valor_maximo: 99.31 },
        faixa3: { percentual: 12, min: 2203.49, max: 3305.22, valor_maximo: 132.21 },
        faixa4: { percentual: 14, min: 3305.22, max: 6433.57, valor_maximo: 437.97 },
    };


    private static resultadoF = { aliquota: 0, valor: 0 };


    static formatValorDecimal(valor) {

        return (Math.round(valor * 100) / 100);
    }

    static getSomaFaixas(somarAte) {

        let somaFaixas = 0;
        for (let i = 0; i < somarAte; i++) {
            somaFaixas += this.maximoValor[i].v;
        }
        return this.formatValorDecimal(somaFaixas);
    }


    static calcularFaixa(valor, faixaA, faixa, somarAte) {

        let valorF = (valor - this.aliquotasParametros[faixaA].max);
        valorF *= (this.aliquotasParametros[faixa].percentual / 100);
        valorF += this.getSomaFaixas(somarAte);

        return this.formatValorDecimal(valorF);
    }

    static calcularPercentualAliquota(valor, result) {
        return this.formatValorDecimal((result / valor) * 100);
    }


    static calcular(valor: number) {

        // Até faixa 1
        if (valor <= this.aliquotasParametros.faixa1.max) {

            this.resultadoF.aliquota = this.aliquotasParametros.faixa1.percentual;
            this.resultadoF.valor = this.formatValorDecimal(1100.00 * (7.5 / 100));
            return this.resultadoF;

        }

        // Até faixa 2
        if (valor >= this.aliquotasParametros.faixa2.min && valor <= this.aliquotasParametros.faixa2.max) {

            const valorF = this.calcularFaixa(valor, 'faixa1', 'faixa2', 1);
            this.resultadoF.valor = valorF;
            this.resultadoF.aliquota = this.calcularPercentualAliquota(valor, valorF);
            return this.resultadoF;

        }


        // Até faixa 3
        if (valor >= this.aliquotasParametros.faixa3.min && valor <= this.aliquotasParametros.faixa3.max) {

            const valorF = this.calcularFaixa(valor, 'faixa2', 'faixa3', 2);
            this.resultadoF.valor = valorF;
            this.resultadoF.aliquota = this.calcularPercentualAliquota(valor, valorF);
            return this.resultadoF;

        }


        // Até faixa 4
        if (valor >= this.aliquotasParametros.faixa4.min && valor <= this.aliquotasParametros.faixa4.max) {

            const valorF = this.calcularFaixa(valor, 'faixa3', 'faixa4', 3);
            this.resultadoF.valor = valorF;
            this.resultadoF.aliquota = this.calcularPercentualAliquota(valor, valorF);
            return this.resultadoF;

        }


        // Até faixa 4
        if (valor > this.aliquotasParametros.faixa4.max) {

            const valorF = this.getSomaFaixas(4);
            this.resultadoF.valor = valorF;
            this.resultadoF.aliquota = this.calcularPercentualAliquota(this.aliquotasParametros.faixa4.max, valorF);
            return this.resultadoF;

        }



    }


}
