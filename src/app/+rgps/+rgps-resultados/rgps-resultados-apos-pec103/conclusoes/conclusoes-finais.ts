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
    private pbcCompleto;
    private indicesSelecionado;
    private dibCurrency;


public createConclusoesFinais(
    moedaDib: object,
    listaConclusaoAcesso: Array<object>,
    calculo: object,
    pbcCompleto: boolean
    ){

    this.moedaDib = moedaDib;
    this.listaConclusaoAcesso = listaConclusaoAcesso;
    this.calculo = calculo;
    this.pbcCompleto = pbcCompleto;



 // console.log(moeda);
        // console.log(contribuicoes);
        // console.log(listaConclusaoAcesso);

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

                this.calcularConclusaoPossibilidade(elementPossibilidade);


            });
        }

        return elementRegraEspecie;
    }


    private calcularConclusaoPossibilidade(elementPossibilidade) {


        console.log(elementPossibilidade);

    }



  /**
     * Ajustar ao teto e minimo
     * @param  {} valor
     * @param  {} data
     */
    private limitarTetosEMinimos(valor, data) {
        // se a data estiver no futuro deve ser utilizado os dados no mês atual
        const moeda = this.moedaDib;

        const salarioMinimo = (moeda) ? moeda.salario_minimo : 0;
        const tetoSalarial = (moeda) ? moeda.teto : 0;
        let avisoString = '';
        let valorRetorno = valor;

        if (moeda && valor < salarioMinimo) {
            valorRetorno = salarioMinimo;
            avisoString = 'LIMITADO AO MÍNIMO'
        } else if (moeda && valor > tetoSalarial) {
            valorRetorno = tetoSalarial;
            avisoString = 'LIMITADO AO TETO'
        }
        return { valor: valorRetorno, aviso: avisoString };
    }





    
}
