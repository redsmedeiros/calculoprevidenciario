import { DefinicaoMoeda } from '../share-rmi/definicao-moeda';
import * as moment from 'moment';


// conclusaoAcessoRegraAcessoPontos;
// conclusaoAcessoRegrasAcessoIdadeProgressiva;
// conclusaoAcessoRegraAcessoPedagio100;
// conclusaoAcessoRegraAcessoPedagio50;
// conclusaoAcessoRegraAcessoIdade;

export class conclusoesFinais {


    private moedaDib;
    private contribuicoes;
    private listaConclusaoAcesso;
    private calculo;
    private segurado;
    private pbcCompleto;
    private indicesSelecionado;
    private dibCurrency;


    public createConclusoesFinais(
        moedaDib: object,
        listaConclusaoAcesso: Array<object>,
        segurado: object,
        calculo: object,
        pbcCompleto: boolean
    ) {

        this.moedaDib = moedaDib;
        this.listaConclusaoAcesso = listaConclusaoAcesso;
        this.calculo = calculo;
        this.segurado = segurado;
        this.pbcCompleto = pbcCompleto;

        listaConclusaoAcesso.forEach(elementRegraEspecie => {
            this.criarConclusaoPossibilidade(elementRegraEspecie);
        });

        // console.log(listaConclusaoAcesso);

        return listaConclusaoAcesso;

    }

    /**
       * Realizar uma verificação simples e requisitar a criação da lista de contribuições
       * @param  {} elementRegraEspecie
       */
    private criarConclusaoPossibilidade(elementRegraEspecie) {

        if (elementRegraEspecie.status && elementRegraEspecie.calculosPossiveis.length > 0) {

            elementRegraEspecie.calculosPossiveis.forEach(elementPossibilidade => {

                this.calcularConclusaoPossibilidade(elementPossibilidade, elementRegraEspecie);

            });
        }

        return elementRegraEspecie;
    }

    /**
     * Interação para calcular as conclusões das possíbilidades para cada regra
     * @param  {} elementPossibilidade
     * @param  {} elementRegraEspecie
     */
    private calcularConclusaoPossibilidade(elementPossibilidade, elementRegraEspecie) {


        this.calcularSalarioBeneficio(elementPossibilidade, elementRegraEspecie);
        this.calcularIndiceRejusteTeto(elementPossibilidade, elementRegraEspecie);
        this.calcularAliquotaBeneficio(elementPossibilidade, elementRegraEspecie);
        this.calcularRMIBeneficio(elementPossibilidade, elementRegraEspecie);


        return elementPossibilidade;
    }


    /**
     * Calcula salario de beneficio
     * @param  {} elementPossibilidade
     * @param  {} elementRegraEspecie
     */
    private calcularSalarioBeneficio(elementPossibilidade, elementRegraEspecie) {

        let slBeneficio = elementPossibilidade.mediaDasContribuicoes.value;

        if (elementRegraEspecie.regra === 'pedagio50') {
            slBeneficio *= elementRegraEspecie.fatorPrevidenciario.fatorPrevidenciarioValue;
        }

        slBeneficio = this.limitarTetosEMinimos(slBeneficio)
        elementPossibilidade.salarioBeneficio = slBeneficio;

        //  return elementPossibilidade
    }


    /**
     * @param  {} elementPossibilidade
     * @param  {} elementRegraEspecie
     */
    private calcularIndiceRejusteTeto(elementPossibilidade, elementRegraEspecie) {

        let irtBeneficio = elementPossibilidade.mediaDasContribuicoes.value;

        if (elementRegraEspecie.regra === 'pedagio50') {
            irtBeneficio *= elementRegraEspecie.fatorPrevidenciario.fatorPrevidenciarioValue;
        }

        irtBeneficio /= elementPossibilidade.salarioBeneficio.value;
        elementPossibilidade.irt = irtBeneficio;

        // return elementPossibilidade
    }


    private calcularAliquotaBeneficio(elementPossibilidade, elementRegraEspecie) {

        this.getAliquotaBeneficio(elementRegraEspecie, elementPossibilidade);

        //   return elementPossibilidade
    }

    private calcularRMIBeneficio(elementPossibilidade, elementRegraEspecie) {

        let rmi  = elementPossibilidade.salarioBeneficio.value * (elementPossibilidade.aliquota.value / 100);

        if (elementRegraEspecie.regra === 'pedagio50') {
             rmi  = elementPossibilidade.salarioBeneficio.value * elementPossibilidade.aliquota.value;
        }

        elementPossibilidade.rmi = this.limitarTetosEMinimos(rmi);

        // return elementPossibilidade;
    }


    private getAliquotaBeneficio(elementRegraEspecie, elementPossibilidade) {

        const methodsPorEspecie = {
            idade: this.defineAliquotaIdade,
            idadeTransitoria: this.defineAliquotaIdadeTransitoria,
            pontos: this.defineAliquotaPontos,
            idadeProgressiva: this.defineAliquotaIdadeProgressiva,
            pedagio50: this.defineAliquotaPedagio50,
            pedagio100: this.defineAliquotaPedagio100,
            especial: this.defineAliquotaAposentadoriaEspecial,
            acidente: this.defineAliquotaAuxilioAcidente,
            doenca: this.defineAliquotaAuxilioDoenca,
            deficiente: this.defineAliquotaEspecialDeficiente,
            incapacidade: this.defineAliquotaIncapacidade,
        };

        if (methodsPorEspecie[elementRegraEspecie.regra] !== undefined) {

            elementPossibilidade.aliquota = methodsPorEspecie[elementRegraEspecie.regra]
                .call(
                    this,
                    elementPossibilidade,
                    elementRegraEspecie
                );

        }


        return elementPossibilidade;

    }


    /**
     * Set aliquota obj
     * @param  {number} value
     * @param  {string} formula
     */
    private setAliquota(
        value: number,
        formula: string
    ) {
        return {
            value,
            formula,
        };
    }


    // define aliquotas por espepecie - inicio

    private defineAliquotaIdade(elementPossibilidade) {

        const tempoParaPercentual = {
            m: 20,
            f: 15
        };

        let aliquota = 60;
        let formula = '60'

        if (Math.floor(elementPossibilidade.tempo) > tempoParaPercentual[this.segurado.sexo]) {
            aliquota = aliquota + ((Math.floor(elementPossibilidade.tempo) - tempoParaPercentual[this.segurado.sexo]) * 2);
            formula = `60 + ((${Math.floor(elementPossibilidade.tempo)} - ${tempoParaPercentual[this.segurado.sexo]}) X 2)`;
        }

        return this.setAliquota(
            aliquota,
            formula,
        );
    }

    private defineAliquotaIdadeTransitoria(elementPossibilidade) {

        return this.defineAliquotaIdade(elementPossibilidade);
    }

    private defineAliquotaPontos(elementPossibilidade) {

        return this.defineAliquotaIdade(elementPossibilidade);
    }

    private defineAliquotaIdadeProgressiva(elementPossibilidade) {

        return this.defineAliquotaIdade(elementPossibilidade);
    }

    private defineAliquotaPedagio50(elementPossibilidade, elementRegraEspecie) {

        const aliquota = elementRegraEspecie.fatorPrevidenciario.value;
        const formula = '100% média salarial aplicando o Fator previdenciario'

        return this.setAliquota(
            aliquota,
            formula
        );
    }

    private defineAliquotaPedagio100(elementPossibilidade, elementRegraEspecie) {

        const aliquota = 100;
        const formula = '100% média salarial aplicando o Fator previdenciario'

        return this.setAliquota(
            aliquota,
            formula
        );
    }



    private defineAliquotaAposentadoriaEspecial(elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');

    }
    private defineAliquotaAuxilioAcidente(elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }
    private defineAliquotaAuxilioDoenca(elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }
    private defineAliquotaEspecialDeficiente(elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }
    private defineAliquotaIncapacidade(elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }


    // define aliquotas por espepecie - fim



    /**
       * Ajustar ao teto e minimo
       * @param  {} value
       */
    private limitarTetosEMinimos(value) {
        // se a data estiver no futuro deve ser utilizado os dados no mês atual
        const moeda = this.moedaDib;

        const salarioMinimo = (moeda) ? parseFloat(moeda.salario_minimo) : 0;
        const tetoSalarial = (moeda) ? parseFloat(moeda.teto) : 0;
        let avisoString = '';
        let valueRetorno = parseFloat(value);

        if (moeda && value < salarioMinimo) {
            valueRetorno = salarioMinimo;
            avisoString = 'LIMITADO AO MÍNIMO'
        } else if (moeda && value > tetoSalarial) {
            valueRetorno = tetoSalarial;
            avisoString = 'LIMITADO AO TETO'
        }

        return {
            value: valueRetorno,
            valueString: DefinicaoMoeda.formatMoney(valueRetorno, moeda.acronimo),
            aviso: avisoString
        };
    }





}
