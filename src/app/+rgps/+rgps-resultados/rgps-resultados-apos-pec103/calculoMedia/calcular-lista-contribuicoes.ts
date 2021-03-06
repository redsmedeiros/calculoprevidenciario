import * as moment from 'moment';
import { DefinicaoMoeda } from '../share-rmi/definicao-moeda';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { switchMap } from 'rxjs/operator/switchMap';


export class CalcularListaContribuicoes {

    private Moeda;
    private contribuicoes;
    private listaConclusaoAcesso;
    private calculo;
    private pbcCompleto;
    private indicesSelecionado;
    private dibCurrency;
    private divisorMinimo;
    private dadosPassoaPassoOrigem;

    private tableData = []

    private tableOptions = {
        colReorder: false,
        paging: false,
        searching: false,
        ordering: false,
        bInfo: false,
        data: this.tableData,
        columns: [
            { data: 'id' },
            { data: 'competencia' },
            { data: 'indice_corrigido' },
            { data: 'contribuicao_primaria' },
            { data: 'contribuicao_primaria_revisada' },
            { data: 'limite' },
        ],
        columnDefs: [
            { 'width': '2rem', 'targets': [0] },
            {
                'targets': [0, 1, 2, 3, 4, 5],
                'className': 'text-center'
            }
        ]
    };

    /**
     * Criar a listas de competencias para cada possibilidade caso o calculo tenha mais de uma possibilidade
     * @param  {object} moeda
     * @param  {Array<object>} contribuicoes
     * @param  {Array<object>} listaConclusaoAcesso
     * @param  {object} calculo
     * @param  {boolean} pbcCompleto
     * @param  {Array<object>} indicesSelecionado
     */
    public criarListasCompetenciasParaPossibilidades(
        moeda: object,
        contribuicoes: Array<object>,
        listaConclusaoAcesso: Array<object>,
        calculo: object,
        pbcCompleto: boolean,
        indicesSelecionado: Array<object>,
        divisorMinimo: object,
        dadosPassoaPassoOrigem: boolean
    ) {

        this.Moeda = moeda;
        this.contribuicoes = contribuicoes;
        this.listaConclusaoAcesso = listaConclusaoAcesso;
        this.calculo = calculo;
        this.pbcCompleto = pbcCompleto;
        this.indicesSelecionado = indicesSelecionado;
        this.divisorMinimo = divisorMinimo;
        this.dadosPassoaPassoOrigem = dadosPassoaPassoOrigem;

        listaConclusaoAcesso.forEach(elementRegraEspecie => {
            this.verificarListaParaUmaRegraEspecie(elementRegraEspecie);
        });

        return listaConclusaoAcesso;

    }

    /**
     * Realizar uma verifica????o simples e requisitar a cria????o da lista de contribui????es
     * @param  {} elementRegraEspecie
     */
    private verificarListaParaUmaRegraEspecie(elementRegraEspecie) {

        if (elementRegraEspecie.status && elementRegraEspecie.calculosPossiveis.length > 0) {

            elementRegraEspecie.calculosPossiveis.forEach(elementPossibilidade => {

                this.criarListaContribPossibilidade(elementPossibilidade, elementRegraEspecie);
                this.realizarDescarteContribuicoes(elementPossibilidade, elementRegraEspecie);
                this.setTableOption(elementPossibilidade);

            });
        }

        return elementRegraEspecie;
    }


    /**
     * @param  {} elementPossibilidade
     */
    private criarListaContribPossibilidade(elementPossibilidade, elementRegraEspecie) {

        let line = {};
        const list = [];
        const list12 = [];

        let contribuicaoPrimariaRevisada = 0;
        let limiteString = '';

        const dib = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
        this.dibCurrency = DefinicaoMoeda.loadCurrency(dib);
        const dataComparacao = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
        const moedaComparacao = (dataComparacao.isSameOrBefore(moment(), 'month')) ? this.Moeda.getByDate(dataComparacao) : undefined;
        const isDoenca12 = (elementRegraEspecie.regra === 'doenca' && !this.calculo.media_12_ultimos);


        this.contribuicoes.forEach((contribuicao, index) => {

            let sc_mm_ajustar = true;

            if (this.dadosPassoaPassoOrigem) {
              sc_mm_ajustar = (contribuicao.sc_mm_ajustar === 1);
            }

            let contribuicaoPrimaria = parseFloat(contribuicao.valor_primaria);
            const contribuicaoSecundaria = parseFloat(contribuicao.valor_secundaria);

            contribuicaoPrimaria += contribuicaoSecundaria;

            const dataContribuicao = moment(contribuicao.data);
            const moedaContribuicao = (dataContribuicao.isSameOrBefore(moment(), 'month')) ?
                this.Moeda.getByDate(dataContribuicao) : undefined;
            const currency = DefinicaoMoeda.loadCurrency(dataContribuicao);

            const fatorObj = this.getFatorparaRMI(moedaContribuicao, moedaComparacao);
            const fatorCorrigido = (moedaContribuicao) ? (fatorObj.fator / fatorObj.fatorLimite) : 1;
            const fatorCorrigidoString = DefinicaoMoeda.formatDecimal(fatorCorrigido, 6);

            contribuicaoPrimariaRevisada = 0;
            limiteString = '';

            // reajuste ao teto
            if (contribuicaoPrimaria > 0) {

                const valorAjustadoObj = this.limitarTetosEMinimos(contribuicaoPrimaria, dataContribuicao, sc_mm_ajustar);
                contribuicaoPrimariaRevisada = valorAjustadoObj.valor;
                limiteString = valorAjustadoObj.aviso;

            }

            // contribui????o
            const contribuicaoPrimariaString = DefinicaoMoeda.formatMoney(contribuicaoPrimariaRevisada, currency.acronimo);

            // contribui????o com indice de corre????o
            contribuicaoPrimariaRevisada = (contribuicaoPrimariaRevisada * fatorCorrigido);
            contribuicaoPrimariaRevisada = DefinicaoMoeda.convertCurrency(contribuicaoPrimariaRevisada, dataContribuicao, dib);
            const contribuicaoPrimariaRevisadaString = DefinicaoMoeda.formatMoney(contribuicaoPrimariaRevisada, this.dibCurrency.acronimo);

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

            if (index < 12 && isDoenca12) {
                list12.push(line)
            }

        });

        elementPossibilidade.listaCompetencias = list;
        elementPossibilidade.lista12Competencias = list12;

        return elementPossibilidade;

    }

    /**
     * Realizar o descarte das contribui????es previamente calculado com base na regra de aposentadoria da especie
     * @param  {} elementPossibilidade
     */
    private realizarDescarteContribuicoes(elementPossibilidade, elementRegraEspecie) {

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

        const list12 = [];
        let soma12Ultimas = 0;
        let somaContribuicoes = 0;
        let indexMax = (elementPossibilidade.listaCompetencias.length - elementPossibilidade.descarteContrib);
        const isDoenca12 = (elementRegraEspecie.regra === 'doenca' && !this.calculo.media_12_ultimos);

        if (this.divisorMinimo.aplicar
            && indexMax < this.divisorMinimo.value
            && elementRegraEspecie.regra === 'deficiente') {

            elementPossibilidade.descarteContrib = 0;
            indexMax = this.divisorMinimo.value;
        }

        // somar e sinalizar a contribui????o descartada
        elementPossibilidade.listaCompetencias.forEach((element, index) => {

            if (index >= elementPossibilidade.descarteContrib) {
                somaContribuicoes += element.valor_primario;
            } else {
                element.limite = 'DESCONSIDERADO';
            }

        });

        elementPossibilidade.listaCompetencias.sort((entry1, entry2) => {
            if (entry1.id > entry2.id) {
                return 1;
            }
            if (entry1.id < entry2.id) {
                return -1;
            }
            return 0;
        });

        elementPossibilidade.somaContribuicoes = {
            value: somaContribuicoes,
            valueString: DefinicaoMoeda.formatMoney(
                somaContribuicoes,
                this.dibCurrency.acronimo)
        };

        elementPossibilidade.numeroCompetencias = indexMax;
        const mediaDasContribuicoes = (somaContribuicoes / indexMax);

        elementPossibilidade.mediaDasContribuicoes = {
            value: mediaDasContribuicoes,
            valueString: DefinicaoMoeda.formatMoney(
                mediaDasContribuicoes,
                this.dibCurrency.acronimo)
        };

        if (isDoenca12) {

            // somar e sinalizar a contribui????o descartada
            elementPossibilidade.lista12Competencias.forEach((element, index) => {
                soma12Ultimas += element.valor_primario;
            });

            // elementPossibilidade.lista12Competencias = list12;
            const mediaDasContribuicoes12 = soma12Ultimas / 12;
            elementPossibilidade.mediaDasContribuicoes12 = {
                value: mediaDasContribuicoes12,
                valueString: DefinicaoMoeda.formatMoney(
                    mediaDasContribuicoes12,
                    this.dibCurrency.acronimo)
            };

        }

        return elementPossibilidade;
    }


    /**
     * Modelar as informa????es para exibir no componente
     * @param  {} tableData
     */
    private setTableOption(elementPossibilidade) {

        elementPossibilidade.listaCompetencias = this.tableOptions = {
            ...this.tableOptions,
            data: elementPossibilidade.listaCompetencias,
        };

        return elementPossibilidade;
    }


    /**
     * Seleciona o fator adequado, por??m como padr??o retorna 1
     * @param  {} moedaContribuicao
     * @param  {} moedaComparacao
     */
    private getFatorparaRMI(moedaContribuicao, moedaComparacao) {

        let fator = 1
        let fatorLimite = 1;

        // defini????o de indices
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
    private limitarTetosEMinimos(valor, data, sc_mm_ajustar = true) {
        // se a data estiver no futuro deve ser utilizado os dados no m??s atual
        const moeda = data.isSameOrBefore(moment(), 'month') ?
            this.Moeda.getByDate(data) :
            this.Moeda.getByDate(moment());

        const salarioMinimo = (moeda) ? moeda.salario_minimo : 0;
        const tetoSalarial = (moeda) ? moeda.teto : 0;
        let avisoString = '';
        let valorRetorno = valor;

        if (moeda && valor < salarioMinimo && sc_mm_ajustar) {
            valorRetorno = salarioMinimo;
            avisoString = 'LIMITADO AO M??NIMO'
        } else if (moeda && valor > tetoSalarial) {
            valorRetorno = tetoSalarial;
            avisoString = 'LIMITADO AO TETO'
        }
        return { valor: valorRetorno, aviso: avisoString };
    }



}
