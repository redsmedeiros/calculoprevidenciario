import * as moment from 'moment';
import { DefinicaoMoeda } from '../share-rmi/definicao-moeda';


export class CalcularListaContribuicoes {

    private Moeda;
    private contribuicoes;
    private listaConclusaoAcesso;
    private calculo;
    private pbcCompleto;
    private indicesSelecionado;

    /**
     * Criar a listas de competencias para cada possibilidade caso o calculo tenha mais de uma possibilidade
     * @param  {object} moeda
     * @param  {Array} contribuicoes
     * @param  {Array} listaConclusaoAcesso
     * @param  {object} calculo
     */
    public criarListasCompetenciasParaPossibilidades(
        moeda: object,
        contribuicoes: Array<object>,
        listaConclusaoAcesso: Array<object>,
        calculo: object,
        pbcCompleto: boolean,
        indicesSelecionado
    ) {

        this.Moeda = moeda;
        this.contribuicoes = contribuicoes;
        this.listaConclusaoAcesso = listaConclusaoAcesso;
        this.calculo = calculo;
        this.pbcCompleto = pbcCompleto;
        this.indicesSelecionado = indicesSelecionado;

        // console.log(moeda);
        // console.log(contribuicoes);
        // console.log(listaConclusaoAcesso);

        listaConclusaoAcesso.forEach(elementRegraEspecie => {
            this.verificarListaParaUmaRegraEspecie(elementRegraEspecie);
        });

        // console.log(listaConclusaoAcesso);

        return listaConclusaoAcesso;

    }

    /**
     * Realizar uma verificação simples e requisitar a criação da lista de contribuições
     * @param  {} elementRegraEspecie
     */
    private verificarListaParaUmaRegraEspecie(elementRegraEspecie) {

        if (elementRegraEspecie.status && elementRegraEspecie.calculosPossiveis.length > 0) {

            elementRegraEspecie.calculosPossiveis.forEach(elementPossibilidade => {

                this.criarListaContribPossibilidade(elementPossibilidade);
                this.realizarDescarteContribuicoes(elementPossibilidade);

            });
        }

        return elementRegraEspecie;
    }


    /**
     * @param  {} elementPossibilidade
     */
    private criarListaContribPossibilidade(elementPossibilidade) {

        // this.Moeda 
        // 


        let line = {};
        const list = [];
        const list12 = [];
        let contribuicaoPrimariaRevisada = 0;
        let limiteString = '';

        const dib = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
        // const moedaDib = this.Moeda.getByDate(moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY'));
        const dibCurrency = DefinicaoMoeda.loadCurrency(dib);
        const dataComparacao = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
        const moedaComparacao = (dataComparacao.isSameOrBefore(moment(), 'month')) ? this.Moeda.getByDate(dataComparacao) : undefined;

        this.contribuicoes.forEach((contribuicao, index) => {

            const contribuicaoPrimaria = parseFloat(contribuicao.valor_primaria);
            const dataContribuicao = moment(contribuicao.data);
            const moedaContribuicao = (dataContribuicao.isSameOrBefore(moment(), 'month')) ?
                this.Moeda.getByDate(dataContribuicao) : undefined;
            const currency = DefinicaoMoeda.loadCurrency(dataContribuicao);
            const contribuicaoPrimariaString = DefinicaoMoeda.formatMoney(contribuicaoPrimaria, currency.acronimo);
            const fatorObj = this.getFatorparaRMI(moedaContribuicao, moedaComparacao);
            const fatorCorrigido = (moedaContribuicao) ? (fatorObj.fator / fatorObj.fatorLimite) : 1;
            const fatorCorrigidoString = DefinicaoMoeda.formatDecimal(fatorCorrigido, 6);

            contribuicaoPrimariaRevisada = 0;
            limiteString = '';

            // reajuste ao teto
            if (contribuicaoPrimaria > 0) {

                const valorAjustadoObj = this.limitarTetosEMinimos(contribuicaoPrimaria, dataContribuicao);
                contribuicaoPrimariaRevisada = valorAjustadoObj.valor;
                limiteString = valorAjustadoObj.aviso;
            }

            // contribuição
            contribuicaoPrimariaRevisada = (contribuicaoPrimariaRevisada * fatorCorrigido);
            contribuicaoPrimariaRevisada = DefinicaoMoeda.convertCurrency(contribuicaoPrimariaRevisada, dataContribuicao, dib);
            const contribuicaoPrimariaRevisadaString = DefinicaoMoeda.formatMoney(contribuicaoPrimariaRevisada, dibCurrency.acronimo);

            line = {
                id: index + 1,
                competencia: dataContribuicao.format('MM/YYYY'),
                contribuicao_primaria: contribuicaoPrimariaString,
                indice_corrigido: fatorCorrigidoString,
                contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
                limite: limiteString,
                valor_primario: contribuicaoPrimariaRevisada,
            };

            list.push(line);

            if (index < 12) {
                list12.push(line)
            }

        });
        // console.log(elementPossibilidade);

        elementPossibilidade.listaCompetencias = list;
        elementPossibilidade.lista12Competencias = list12;

        return elementPossibilidade;

    }

    /**
     * Realizar o descarte das contribuições previamente calculado com base na regra de aposentadoria da especie
     * @param  {} elementPossibilidade
     */
    private realizarDescarteContribuicoes(elementPossibilidade) {

            // menor valor primeiro
            elementPossibilidade.listaCompetencias.sort((entry1, entry2) => {
                if (entry1.valor_primario > entry2.valor_primario) {
                    return 1;
                }
                if (entry1.valor_primario < entry2.valor_primario) {
                    return -1;
                }
                return 0;
            });

            let somaContribuicoes = 0;
            const indexMax = (elementPossibilidade.listaCompetencias.length - elementPossibilidade.descarteContrib);

            // somar e sinalizar a contribuição descartada
            elementPossibilidade.listaCompetencias.forEach((element, index) => {

                if (index >= elementPossibilidade.descarteContrib) {
                    somaContribuicoes += element.valor_primario;
                } else {
                    element.limite = 'DESCONSIDERADO';
                }

            });

            elementPossibilidade.numeroCompetencias = indexMax;
            elementPossibilidade.somaContribuicoes = somaContribuicoes;
            elementPossibilidade.mediaDasContribuicoes = (somaContribuicoes / indexMax);

            elementPossibilidade.listaCompetencias.sort((entry1, entry2) => {
                if (entry1.id > entry2.id) {
                    return 1;
                }
                if (entry1.id < entry2.id) {
                    return -1;
                }
                return 0;
            });


        return elementPossibilidade;
    }


    /**
     * Seleciona o fator adequado, porém como padrão retorna 1
     * @param  {} moedaContribuicao
     * @param  {} moedaComparacao
     */
    private getFatorparaRMI(moedaContribuicao, moedaComparacao) {

        let fator = 1
        let fatorLimite = 1;

        // definição de indices
        if ((!this.pbcCompleto)) {

            fator = (moedaContribuicao) ? moedaContribuicao.fator : 1;
            fatorLimite = (moedaComparacao) ? moedaComparacao.fator : 1;

        } else {

            switch (this.indicesSelecionado) {
                case 'inpc1085':
                    fator = (moedaContribuicao) ? moedaContribuicao.fator_pbc_inpc1085ortn : 1;
                    fatorLimite = (moedaComparacao) ? moedaComparacao.fator_pbc_inpc1085ortn : 1;
                    break;
                case 'inpc1088':
                    fator = (moedaContribuicao) ? moedaContribuicao.fator_pbc_inpc1088ortn : 1;
                    fatorLimite = (moedaComparacao) ? moedaComparacao.fator_pbc_inpc1088ortn : 1;
                    break;
                default: // inpc1084 == fator_pbc
                    fator = (moedaContribuicao) ? moedaContribuicao.fator_pbc : 1;
                    fatorLimite = (moedaComparacao) ? moedaComparacao.fator_pbc : 1;
                    break;
            }

        }

        return { fator: fator, fatorLimite: fatorLimite }

    }




    /**
     * Ajustar ao teto e minimo
     * @param  {} valor
     * @param  {} data
     */
    private limitarTetosEMinimos(valor, data) {
        // se a data estiver no futuro deve ser utilizado os dados no mês atual
        const moeda = data.isSameOrBefore(moment(), 'month') ? this.Moeda.getByDate(data) : this.Moeda.getByDate(moment());

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