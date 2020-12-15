
import * as moment from 'moment';
import { Console } from 'console';

/**
 * Define a aliquota efetiva de reconhimento para previdência confome a EC103/2019
 */
export class DefinicaoAliquotaEfetiva {

    static maximoValor = [
        { f: 'faixa1', v: 78.38 },
        { f: 'faixa2', v: 94.01 },
        { f: 'faixa3', v: 125.38 },
        { f: 'faixa4', v: 415.33 },
    ];

    static aliquotasParametros = {
        faixa1: { percentual: 7.50, min: 1045.00, max: 1045.00, valor_maximo: 78.38 },
        faixa2: { percentual: 9, min: 1045.01, max: 2089.60, valor_maximo: 94.01 },
        faixa3: { percentual: 12, min: 2089.61, max: 3134.40, valor_maximo: 125.38 },
        faixa4: { percentual: 14, min: 3134.41, max: 6101.06, valor_maximo: 415.33 },
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
            this.resultadoF.valor = this.formatValorDecimal(1045.00 * (7.5 / 100));
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
