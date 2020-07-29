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

        let slBeneficio = elementPossibilidade.mediaDasContribuicoes;

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

        let irtBeneficio = elementPossibilidade.mediaDasContribuicoes;

        if (elementRegraEspecie.regra === 'pedagio50') {
            irtBeneficio *= elementRegraEspecie.fatorPrevidenciario.fatorPrevidenciarioValue;
        }

        irtBeneficio /= elementPossibilidade.salarioBeneficio.valor;
        elementPossibilidade.irt = irtBeneficio;

       // return elementPossibilidade
    }




    private calcularAliquotaBeneficio(elementPossibilidade, elementRegraEspecie) {

       this.getAliquotaBeneficio(elementRegraEspecie, elementPossibilidade);

     //   return elementPossibilidade
    }

    private calcularRMIBeneficio(elementPossibilidade, elementRegraEspecie) {



        return elementPossibilidade
    }





    private getAliquotaBeneficio(elementRegraEspecie, elementPossibilidade) {

        const methodsPorEspecie = {
            idade: this.defineAliquotaIdade,
            idadeTransitoria: this.defineAliquotaIdade,
            pontos: this.defineAliquotaPontos,
            idadeProgressiva: this.defineAliquotaIdadeProgressiva,
            pedagio100: this.defineAliquotaPedagio100,
            pedagio50: this.defineAliquotaPedagio50,
            especial: this.defineAliquotaAposentadoriaEspecial,
            acidente: this.defineAliquotaAuxilioAcidente,
            doenca: this.defineAliquotaAuxilioDoenca,
            deficiente: this.defineAliquotaEspecialDeficiente,
            incapacidade: this.defineAliquotaIncapacidade,
        };

        // console.log(elementRegraEspecie.regra);
        // console.log(methodsPorEspecie[elementRegraEspecie.regra]);

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
            formula
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

        if(Math.floor(elementPossibilidade.tempo) > tempoParaPercentual[this.segurado.sexo]) {
            aliquota = aliquota + (( Math.floor(elementPossibilidade.tempo) - tempoParaPercentual[this.segurado.sexo]) * 2);
            formula =  `60 + ((${Math.floor(elementPossibilidade.tempo)} - ${tempoParaPercentual[this.segurado.sexo]}) * 2)`;
        }

        return this.setAliquota(
                aliquota,
                formula
            );
    }
    // private defineAliquotaIdadeTransitoria( elementPossibilidade, elementRegraEspecie) {
    //     return this.setAliquota(0, '');
    // }



    private defineAliquotaPedagio50( elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }
    private defineAliquotaPedagio100( elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }
    private defineAliquotaPontos( elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }
    private defineAliquotaIdadeProgressiva( elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }



    private defineAliquotaAposentadoriaEspecial( elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');

    }
    private defineAliquotaAuxilioAcidente( elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }
    private defineAliquotaAuxilioDoenca( elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }
    private defineAliquotaEspecialDeficiente( elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }
    private defineAliquotaIncapacidade( elementPossibilidade, elementRegraEspecie) {

        return this.setAliquota(0, '');
    }


    // define aliquotas por espepecie - fim







    /**
       * Ajustar ao teto e minimo
       * @param  {} valor
       */
    private limitarTetosEMinimos(valor) {
        // se a data estiver no futuro deve ser utilizado os dados no mês atual
        const moeda = this.moedaDib;

        const salarioMinimo = (moeda) ? parseFloat(moeda.salario_minimo) : 0;
        const tetoSalarial = (moeda) ? parseFloat(moeda.teto) : 0;
        let avisoString = '';
        let valorRetorno = parseFloat(valor);

        if (moeda && valor < salarioMinimo) {
            valorRetorno = salarioMinimo;
            avisoString = 'LIMITADO AO MÍNIMO'
        } else if (moeda && valor > tetoSalarial) {
            valorRetorno = tetoSalarial;
            avisoString = 'LIMITADO AO TETO'
        }

        return {
            valor: valorRetorno,
            valorString: DefinicaoMoeda.formatMoney(valorRetorno, moeda.acronimo),
            aviso: avisoString
        };
    }








}
