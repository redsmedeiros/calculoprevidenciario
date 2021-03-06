
import * as moment from 'moment';
// import { Injectable } from '@angular/core';

// @Injectable()

export class RegrasAcesso {

    public dataPromulgacao2019 = moment('13/11/2019', 'DD/MM/YYYY');
    private contribuicaoTotal = 0;
    private numeroDeContribuicoes = 0;
    private numeroDeContribuicoesAuxTotal = 0;
    private carenciaConformDataFiliacao = 0;
    private carenciaRequisito = 180;
    private calculo;

    private arrayEspecial = [1915, 1920, 1925];
    private arrayEspecialDeficiente = [25, 26, 27, 28];
    private arrayIdade = [3, 16, 31];

    public listaConclusaoAcesso = [];
    public conclusaoAcesso = {};
    public expectativaSobrevida = {};
    public fatorPrevidenciario = {};
    private moedaDib = {};

    private divisorMinimo = { aplicar: false, value: 0 };

    constructor() { }

    /**
     * Adicionar a lista de conclusões os parametros para cada possibilidade
     * @param  {any[]} listaConclusaoAcesso
     * @param  {} numeroDeContribuicoes
     * @param  {} carenciaConformDataFiliacao
     */
    public calCularTempoMaximoExcluido(
        listaConclusaoAcesso: any[],
        numeroDeContribuicoes,
        numeroDeContribuicoesAuxTotal,
        carenciaConformDataFiliacao,
        calculo,
        carenciaRequisito,
        divisorMinimo) {

        this.numeroDeContribuicoes = numeroDeContribuicoes;
        this.numeroDeContribuicoesAuxTotal = numeroDeContribuicoesAuxTotal;
        this.carenciaConformDataFiliacao = carenciaConformDataFiliacao;
        this.calculo = calculo;
        this.carenciaRequisito = carenciaRequisito;
        this.divisorMinimo = divisorMinimo;

        for (const elementTipo of listaConclusaoAcesso) {
            elementTipo.calculosPossiveis = this.gerarParametrosPorTipoAposentadoria(elementTipo)
        }

        return listaConclusaoAcesso;
    }
    /**
     * calcular o tempo maximo a excedente
     * @param  {} elementTipo
     */
    private gerarParametrosPorTipoAposentadoria(elementTipo) {

        let calculosPossiveis = [];
        const calculoPossivel = {
            tempo: 0,
            idade: 0,
            pontos: 0
        };

        if (!elementTipo.status) {
            return calculosPossiveis;
        }

        const maximoDescarte = { anos: 0, meses: 0 }
        let difIdadeExcedente = 0;
        let difTempoContribExcedente = 0;
        let difPontosExcedente = 0;

        difTempoContribExcedente = elementTipo.tempoTotalAposEC103 - elementTipo.requisitos.tempo;

        maximoDescarte.anos = difTempoContribExcedente;

        if (elementTipo.requisitos.idade > 0
            && (elementTipo.regra === 'especial' || elementTipo.regra === 'pontos')) {

            difIdadeExcedente = elementTipo.idade - elementTipo.requisitos.idade;
            maximoDescarte.anos = (difIdadeExcedente > maximoDescarte.anos) ? maximoDescarte.anos : difIdadeExcedente;

        }

        if (elementTipo.requisitos.pontos > 0) {

            difPontosExcedente = (elementTipo.pontos - elementTipo.requisitos.pontos) / 2;
            maximoDescarte.anos = (difPontosExcedente > maximoDescarte.anos) ? maximoDescarte.anos : difPontosExcedente;
        }

        maximoDescarte.meses = Math.floor(maximoDescarte.anos * 12);

        // Ajuste para considerar a carrencia mínima para idade
        if (['idadeTransitoria', 'idade'].includes(elementTipo.regra)) {

            let maxDescarteCarencia = (this.carenciaConformDataFiliacao - this.carenciaRequisito);

            // deve restar 12 após 1994, pois são os valores base para pós EC103
            if (
                (maxDescarteCarencia >= this.numeroDeContribuicoes)
            ) {

                if (this.numeroDeContribuicoes > 12) {
                    maxDescarteCarencia = (this.numeroDeContribuicoes - 12);
                } else {
                    maxDescarteCarencia = (this.numeroDeContribuicoes - 1);
                }

                if ((this.numeroDeContribuicoes > 1
                    && (this.calculo.carencia >= this.carenciaRequisito && this.calculo.carencia_apos_ec103 >= 1))) {
                    maxDescarteCarencia = (this.numeroDeContribuicoes - 1);
                }

            }

            if (maxDescarteCarencia < maximoDescarte.meses) {

                maximoDescarte.meses = maxDescarteCarencia;
                maximoDescarte.anos = (maximoDescarte.meses / 12);

            }

        }

        // Ajuste para considerar a carrencia mínima para idade
        //   if (['idadeTransitoria', 'idade'].includes(elementTipo.regra)) {


        //     let maxDescarteCarencia = (this.carenciaConformDataFiliacao - this.carenciaRequisito);

        //     console.log(this.carenciaConformDataFiliacao);
        //     console.log(maxDescarteCarencia);
        //     console.log((this.numeroDeContribuicoes - maxDescarteCarencia));

        //     if (
        //         (maxDescarteCarencia >= this.numeroDeContribuicoes)
        //     ) {

        //         if ((this.numeroDeContribuicoes - maxDescarteCarencia) >= 12) {

        //             maxDescarteCarencia = (this.numeroDeContribuicoes - 12);

        //         } else {

        //             maxDescarteCarencia = (this.numeroDeContribuicoes - 1);

        //         }

        //     }

        //     console.log(maxDescarteCarencia);

        //     if (maxDescarteCarencia < maximoDescarte.meses) {

        //         maximoDescarte.meses = maxDescarteCarencia;
        //         maximoDescarte.anos = (maximoDescarte.meses / 12);

        //     }

        // }



        // Ajuste para considerar a carrencia mínima para auxilio acidente, doença, pensaoObito e incapacidade
        if (['acidente', 'doenca', 'incapacidade', 'pensaoObito'].includes(elementTipo.regra)) {

            const maxDescarteCarencia = (this.numeroDeContribuicoes - 12);
            // maximoDescarte.meses = (maximoDescarte.meses > maxDescarteCarencia) ? maxDescarteCarencia : maximoDescarte.meses;
            maximoDescarte.meses = maxDescarteCarencia;
            maximoDescarte.anos = maximoDescarte.meses / 12;

        }

        // evitar que o numero de contribuicoes seja negativo
        if (this.numeroDeContribuicoes < maximoDescarte.meses) {

            let tempAjusteMaximoDescarte = this.numeroDeContribuicoes - 12;
            tempAjusteMaximoDescarte = (tempAjusteMaximoDescarte < 0) ? 0 : tempAjusteMaximoDescarte;

            maximoDescarte.meses = tempAjusteMaximoDescarte;
            maximoDescarte.anos = maximoDescarte.meses / 12;
        }

        if ((!this.calculo.calcular_descarte_apos_ec103
            && ['acidente',
                'doenca',
                'incapacidade',
                'pensaoObito',
                'deficiente',
                'idadeRural'].includes(elementTipo.regra))
        ) { // !this.calculo.calcular_descarte_deficiente_ec103 &&

            maximoDescarte.meses = 0;
            maximoDescarte.anos = 0;
            // pessoa com deficiencia com descarte de 20%
            if (!this.calculo.calcular_descarte_deficiente_ec103 && elementTipo.regra === 'deficiente') {

                if (this.divisorMinimo.aplicar &&
                    this.divisorMinimo.value) {

                    maximoDescarte.meses = (this.numeroDeContribuicoes > this.divisorMinimo.value) ?
                        this.numeroDeContribuicoes - this.divisorMinimo.value : 0;

                } else {

                    maximoDescarte.meses = Math.floor(this.numeroDeContribuicoes * 0.20);

                }

                // maximoDescarte.meses = Math.floor(this.numeroDeContribuicoes * 0.20);
            }

            calculosPossiveis = this.criarPossibilidadeUnica(maximoDescarte, elementTipo);

        } else {

            calculosPossiveis = this.criarListaPossibilidades(maximoDescarte, elementTipo);

        }

        return calculosPossiveis;
    }

    /**
     * Criar a lista de parametros de acordo com as regras de acesso e requisitos
     * @param  {} maximoDescarte tempo maximo em anos a ser descartado
     * @param  {} elementTipo calculo por tipo
     */
    private criarListaPossibilidades(
        maximoDescarte,
        elementTipo
    ) {

        const requisitos = elementTipo.requisitos;
        let calculosPossiveis = [];


        if (elementTipo.regra === 'idade') {

            calculosPossiveis = this.descarteMensal(elementTipo, maximoDescarte);

        } else {

            calculosPossiveis = this.descarteAnual(elementTipo, maximoDescarte);
        }

        return calculosPossiveis;

    }


    private setCalculosPossiveis(tempo, idade, pontos, descarteContrib) {

        return {
            tempo: tempo,
            idade: idade,
            pontos: pontos,
            descarteContrib: descarteContrib,
            listaCompetencias: [],
            lista12Competencias: [],
            mediaDasContribuicoes: {},
            mediaDasContribuicoes12: {},
            somaContribuicoes: {},
            numeroCompetencias: 0,
            salarioBeneficio: 0,
            irt: 0,
            rmi: 0,
            rmiConsiderado: 0,
            fator: {},
            moeda: {},
            conclusoes: [],
            destaqueMelhorValorRMI: false
        };
    }

    private descarteAnual(elementTipo, maximoDescarte) {


        const requisitos = elementTipo.requisitos;
        const calculosPossiveis = [];
        const idadeInicial = elementTipo.idade;
        const tempoInicial = elementTipo.tempoTotalAposEC103;
        const pontosInicial = elementTipo.pontos;

        // Valor default sem decrementar
        if ((maximoDescarte.anos) - Math.floor(maximoDescarte.anos) > 0) {

            calculosPossiveis.push(this.setCalculosPossiveis(
                tempoInicial,
                idadeInicial,
                ((requisitos.pontos > 0) ? pontosInicial : 0), 0)
            );

        }

        for (let i = maximoDescarte.anos; i >= 0; i--) {


            calculosPossiveis.push(this.setCalculosPossiveis(
                (tempoInicial - i),
                (idadeInicial - i),
                ((requisitos.pontos > 0) ? pontosInicial : 0),
                Math.floor(i * 12)));

        }

        if (elementTipo.regra === 'idade' || ['pontos', 'idadeProgressiva', 'pedagio50', 'pedagio100'].includes(elementTipo.regra)) {

            const lastPossibilidade = calculosPossiveis.find((element) => element.descarteContrib === maximoDescarte.meses);
            const numeroConsideradoFinal = (this.numeroDeContribuicoes - maximoDescarte.meses);


            let idadeTeste15AnosFracao = false;
            let testeTempoRest = 0;
            if ((this.numeroDeContribuicoes > 1
                && (this.calculo.carencia >= this.carenciaRequisito && this.calculo.carencia_apos_ec103 > 0))
                && elementTipo.regra === 'idade'
                && Math.floor(lastPossibilidade.tempo) === elementTipo.requisitos.tempo) {

                testeTempoRest = (lastPossibilidade.tempo - elementTipo.requisitos.tempo);
                if (testeTempoRest < 1 && testeTempoRest > 0) {
                    idadeTeste15AnosFracao = true;
                }

            }

            // console.log((this.numeroDeContribuicoes > 1
            //     && (this.calculo.carencia >= this.carenciaRequisito && this.calculo.carencia_apos_ec103 > 0)));

            // console.log((this.numeroDeContribuicoes > 1
            //     && (numeroConsideradoFinal === 1 && numeroConsideradoFinal > 0)));
            // console.log((this.numeroDeContribuicoes > 1
            //     && (this.numeroDeContribuicoesAuxTotal - (this.carenciaRequisito)) >= 1));

            if (this.numeroDeContribuicoes > 1
                && (numeroConsideradoFinal === 1 && numeroConsideradoFinal > 0)
                ||
                (this.numeroDeContribuicoes > 1
                    && (this.numeroDeContribuicoesAuxTotal - (this.carenciaRequisito)) >= 1)) {

                const tempoRef11meses = (11 * 30.436875) / 365.25;
                const maximoDescarteIdade = maximoDescarte.meses + 11;

                if (typeof lastPossibilidade !== 'undefined' &&
                    maximoDescarteIdade <= maximoDescarte.meses) {


                    calculosPossiveis.push(this.setCalculosPossiveis(
                        (lastPossibilidade.tempo - tempoRef11meses),
                        lastPossibilidade.idade,
                        0,
                        maximoDescarteIdade));
                }

            }
            // else if (idadeTeste15AnosFracao) {

            // const tempoRef11meses = Math.floor(testeTempoRest * 12);
            // const maximoDescarteIdade = maximoDescarte.meses + tempoRef11meses;

            // calculosPossiveis.push(this.setCalculosPossiveis(
            //     (lastPossibilidade.tempo - tempoRef11meses),
            //     lastPossibilidade.idade,
            //     0,
            //     maximoDescarteIdade));

            // }
        }


        return calculosPossiveis;

    }




    private descarteMensal(elementTipo, maximoDescarte) {

        const requisitos = elementTipo.requisitos;
        const calculosPossiveis = [];
        const idadeInicial = elementTipo.idade;
        const tempoInicial = elementTipo.tempoTotalAposEC103;
        const pontosInicial = elementTipo.pontos;

        let count12meses = 0;
        let countMesesD = 0;
        let tempoPorAno = tempoInicial;
        let idadePorAno = idadeInicial;
        let pontosPorAno = pontosInicial;

        // Valor default sem decrementar
        if ((maximoDescarte.anos) - Math.floor(maximoDescarte.anos) >= 0) {

            calculosPossiveis.push(this.setCalculosPossiveis(
                tempoInicial,
                idadeInicial,
                ((requisitos.pontos > 0) ? pontosInicial : 0),
                0));
        }


        const round12 = (x) => {
            return Math.ceil(x / 12) * 12;
        }

        // const countDescarteList = (this.numeroDeContribuicoes > maximoDescarte.meses) ?
        //     this.numeroDeContribuicoes : maximoDescarte.meses;

        const countDescarteList =  maximoDescarte.meses;

        const listCalculoP = [];
        for (let i = countDescarteList; i >= 0; i--) {

            const num = round12(i)
            if (i === num) {
                listCalculoP.push(num);
            }

        }

        const ultimaOpcao = (this.numeroDeContribuicoes - countDescarteList);

        for (let i = maximoDescarte.meses; i >= 0; i--) {

            count12meses++;

            if (count12meses === 11) {

                tempoPorAno -= 1;
                idadePorAno -= 1;

                if (pontosInicial > 0) {
                    pontosPorAno -= 2;
                }

                count12meses = 0;
            }

            if (listCalculoP.includes(this.numeroDeContribuicoes - countMesesD)
                || (this.numeroDeContribuicoes - countMesesD) < 12
                || this.numeroDeContribuicoes === countMesesD
                || (((this.numeroDeContribuicoes - countMesesD) - ultimaOpcao) <= 11)) {

                calculosPossiveis.push(this.setCalculosPossiveis(
                    tempoPorAno,
                    idadePorAno,
                    pontosPorAno,
                    countMesesD));

            }

            countMesesD++
        }

        return calculosPossiveis;

    }


    /**
      * Criar uma unica possibilidade com 100% ou 80% das contribuições existentes
      * @param  {} maximoDescarte tempo maximo em anos a ser descartado
      * @param  {} elementTipo calculo por tipo
      */
    private criarPossibilidadeUnica(
        maximoDescarte,
        elementTipo
    ) {

        const requisitos = elementTipo.requisitos;
        const calculosPossiveis = [];
        const idadeInicial = elementTipo.idade;
        const tempoInicial = elementTipo.tempoTotalAposEC103;
        const pontosInicial = elementTipo.pontos;



        // Valor default sem decrementar
        calculosPossiveis.push(this.setCalculosPossiveis(
            tempoInicial,
            idadeInicial,
            ((requisitos.pontos > 0) ? pontosInicial : 0),
            maximoDescarte.meses));

        return calculosPossiveis;

    }


    /**
     * Set conclusão
     * @param  {string} regra
     * @param  {boolean} status
     * @param  {number} pontosTotal
     * @param  {number} idade
     * @param  {number} tempoTotalAteEC103
     * @param  {number} tempoTotalAposEC103
     * @param  {object} requisitos
     */
    private setConclusaoAcesso(
        regra: string,
        label: string,
        status: boolean,
        pontosTotal: number,
        idade: number,
        tempoTotalAteEC103: number,
        tempoTotalAposEC103: number,
        requisitos: object
    ) {
        if (status) {
            this.listaConclusaoAcesso.push({
                regra: regra,
                status: status,
                label: label,
                pontos: pontosTotal,
                idade: idade,
                tempoTotalAteEC103: tempoTotalAteEC103,
                tempoTotalAposEC103: tempoTotalAposEC103,
                requisitos: requisitos,
                requisitosNaoAtendidos: [],
                calculosPossiveis: [],
                expectativaSobrevida: this.expectativaSobrevida,
                fatorPrevidenciario: this.fatorPrevidenciario,
                moedaDib: this.moedaDib,
            });
        } else {
            this.listaConclusaoAcesso.push({
                regra: regra,
                label: label,
                status: false,
                pontos: pontosTotal,
                idade: idade,
                tempoTotalAteEC103: tempoTotalAteEC103,
                tempoTotalAposEC103: tempoTotalAposEC103,
                requisitos: requisitos,
                requisitosNaoAtendidos: [],
                calculosPossiveis: [],
                expectativaSobrevida: 0,
                moedaDib: {}
            });
        }
    }



    /**
     * Verifica o acesso as regras e define o requisito
     * @param  {any} dataInicioBeneficio
     * @param  {any} dataFiliacao
     * @param  {number} tipoBeneficio
     * @param  {boolean} isRegraTransitoria
     * @param  {any} contribuicaoPrimaria
     * @param  {any} tempoContribuicaoTotal
     * @param  {any} tempoContribuicaoTotalAtePec
     * @param  {any} tempoContribuicaoTotalMoment
     * @param  {any} tempoContribuicaoTotalAtePecMoment
     * @param  {number} idadeSegurado
     * @param  {number} idadeFracionada
     * @param  {string} sexo
     * @param  {number} redutorProfessor
     * @param  {number} redutorSexo
     */
    public getVerificacaoRegras(
        dataInicioBeneficio: any,
        dataFiliacao: any,
        tipoBeneficio: number,
        isRegraTransitoria: boolean,
        contribuicaoPrimaria: any,
        tempoContribuicaoTotal: any,
        tempoContribuicaoTotalAtePec: any,
        tempoContribuicaoTotalMoment: any,
        tempoContribuicaoTotalAtePecMoment: any,
        idadeSegurado: number,
        idadeFracionada: number,
        sexo: string,
        redutorProfessor: number,
        redutorSexo: number,
        expectativaSobrevida: object,
        fatorPrevidenciario: object,
        moedaDib: object,
        numeroDeContribuicoes: number,
        numeroDeContribuicoesAuxTotal: number,
        carenciaRequisito: number
    ) {

        if (
            (contribuicaoPrimaria.anos <= 0)
        ) {
            return this.listaConclusaoAcesso;
        }

        this.expectativaSobrevida = expectativaSobrevida;
        this.fatorPrevidenciario = fatorPrevidenciario;
        this.contribuicaoTotal = tempoContribuicaoTotal.anos;
        const pontos = tempoContribuicaoTotal.anos + idadeFracionada;
        const ano = dataInicioBeneficio.year();
        this.moedaDib = moedaDib;
        this.numeroDeContribuicoes = numeroDeContribuicoes;
        this.carenciaRequisito = carenciaRequisito;

        // aplicação default false
        if (this.arrayEspecial.includes(tipoBeneficio)) {

            this.regraAcessoAposentadoriaEspecial(
                pontos,
                this.contribuicaoTotal,
                idadeFracionada,
                tipoBeneficio,
                isRegraTransitoria,
                tempoContribuicaoTotalAtePec,
                tempoContribuicaoTotalMoment,
                tempoContribuicaoTotalAtePecMoment,
                dataInicioBeneficio.clone()
            )

        } else if (tipoBeneficio === 1903) {

            this.regraAcessoIncapacidade(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal
            );

        } else if (tipoBeneficio === 1905) {

            this.regraAcessoAuxilioAcidente(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal
            );

        } else if (tipoBeneficio === 1) {

            this.regraAcessoAuxilioDoenca(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal
            );


        } else if (this.arrayEspecialDeficiente.includes(tipoBeneficio)) {

            this.regraAcessoDeficiente(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal,
                tipoBeneficio
            );

        } else if (tipoBeneficio === 1901) {

            this.regraAcessoPensaoObitoInstituidorNaoAposentado(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal
            );

        } else if (this.arrayIdade.includes(tipoBeneficio)) {

            if (isRegraTransitoria
                || tipoBeneficio === 16
                || tipoBeneficio === 31) {

                this.regraAcessoIdadeTransitoria(
                    idadeFracionada,
                    ano,
                    sexo,
                    this.contribuicaoTotal,
                    tipoBeneficio,
                    redutorProfessor);

            } else {

                this.regraAcessoIdade(
                    idadeFracionada,
                    ano,
                    sexo,
                    this.contribuicaoTotal,
                    redutorProfessor);

            }

        } else if (tipoBeneficio === 6) {

            // professor transitoria e transição
            if (!isRegraTransitoria) {

                this.regraAcessoPontos(idadeFracionada, pontos, ano, sexo, this.contribuicaoTotal, redutorProfessor);
                this.regraAcessoIdadeProgressiva(idadeFracionada, ano, sexo, this.contribuicaoTotal, redutorProfessor);
                this.regraAcessoPedagio50(
                    sexo,
                    this.contribuicaoTotal,
                    redutorProfessor,
                    idadeFracionada,
                    tempoContribuicaoTotalAtePec,
                    tempoContribuicaoTotalMoment,
                    tempoContribuicaoTotalAtePecMoment,
                    dataInicioBeneficio.clone());
                this.regraAcessoPedagio100(
                    sexo,
                    this.contribuicaoTotal,
                    redutorProfessor,
                    idadeFracionada,
                    tempoContribuicaoTotalAtePec,
                    tempoContribuicaoTotalMoment,
                    tempoContribuicaoTotalAtePecMoment,
                    dataInicioBeneficio.clone());

            }

        } else {

            this.regraAcessoPontos(idadeFracionada, pontos, ano, sexo, this.contribuicaoTotal, redutorProfessor);
            this.regraAcessoIdadeProgressiva(idadeFracionada, ano, sexo, this.contribuicaoTotal, redutorProfessor);
            this.regraAcessoPedagio50(sexo,
                this.contribuicaoTotal,
                redutorProfessor,
                idadeFracionada,
                tempoContribuicaoTotalAtePec,
                tempoContribuicaoTotalMoment,
                tempoContribuicaoTotalAtePecMoment,
                dataInicioBeneficio.clone());
            this.regraAcessoPedagio100(
                sexo,
                this.contribuicaoTotal,
                redutorProfessor,
                idadeFracionada,
                tempoContribuicaoTotalAtePec,
                tempoContribuicaoTotalMoment,
                tempoContribuicaoTotalAtePecMoment,
                dataInicioBeneficio.clone());

        }

        return this.listaConclusaoAcesso;

    }




    /**
     * transição regras de acesso inicio
     * @param  {} idadeFracionada
     * @param  {} pontos
     * @param  {} ano
     * @param  {} sexo
     * @param  {} tempo_contribuicao
     * @param  {} redutorProfessor
     */
    public regraAcessoPontos(idadeFracionada, pontos, ano, sexo, tempo_contribuicao, redutorProfessor) {

        let status = false;
        let requisitoContribuicoes = { f: 30, m: 35 };
        let pontosRequeridos = 0;

        if (redutorProfessor === 0) {

            const regra1 = {
                2019: { m: 96, f: 86 },
                2020: { m: 97, f: 87 },
                2021: { m: 98, f: 88 },
                2022: { m: 99, f: 89 },
                2023: { m: 100, f: 90 },
                2024: { m: 101, f: 91 },
                2025: { m: 102, f: 92 },
                2026: { m: 103, f: 93 },
                2027: { m: 104, f: 94 },
                2028: { m: 105, f: 95 },
                2029: { m: 105, f: 96 },
                2030: { m: 105, f: 97 },
                2031: { m: 105, f: 98 },
                2032: { m: 105, f: 99 },
                2033: { m: 105, f: 100 }
            };

            pontosRequeridos = (ano >= 2033) ? regra1[2033][sexo] : regra1[ano][sexo];
            status = (((ano >= 2019) && pontos >= pontosRequeridos)
                && tempo_contribuicao >= requisitoContribuicoes[sexo]) ? true : false;

        } else {

            requisitoContribuicoes = { f: 25, m: 30 };

            const regra1 = {
                2019: { m: 91, f: 81 },
                2020: { m: 92, f: 82 },
                2021: { m: 93, f: 83 },
                2022: { m: 94, f: 84 },
                2023: { m: 95, f: 85 },
                2024: { m: 96, f: 86 },
                2025: { m: 97, f: 87 },
                2026: { m: 98, f: 88 },
                2027: { m: 99, f: 89 },
                2028: { m: 100, f: 90 },
                2029: { m: 100, f: 91 },
                2030: { m: 100, f: 92 }
            };

            pontosRequeridos = (ano >= 2030) ? regra1[2030][sexo] : regra1[ano][sexo];
            status = (((ano >= 2019) && pontos >= pontosRequeridos)
                && tempo_contribuicao >= requisitoContribuicoes[sexo]) ? true : false;
        }


        this.setConclusaoAcesso(
            'pontos',
            'Regra de Transição do art. 15 da EC nº 103/2019 (Regra de pontos progressiva)',
            status,
            pontos,
            idadeFracionada,
            0,
            tempo_contribuicao,
            {
                tempo: requisitoContribuicoes[sexo],
                idade: 0,
                pedagio: 0,
                pontos: pontosRequeridos,
                ano: ano
            }
        );


    }

    /**
     * Regra de acesso idade progressiva
     * @param  {} idade
     * @param  {} ano
     * @param  {} sexo
     * @param  {} tempo_contribuicao
     * @param  {} redutorProfessor
     */
    public regraAcessoIdadeProgressiva
        (
            idade,
            ano,
            sexo,
            tempo_contribuicao,
            redutorProfessor
        ) {


        let status = false;
        const contribuicao_min = {
            m: (35 - redutorProfessor),
            f: (30 - redutorProfessor)
        };


        const regra2 = {
            2019: { m: 61, f: 56 },
            2020: { m: 61.5, f: 56.5 },
            2021: { m: 62, f: 57 },
            2022: { m: 62.5, f: 57.5 },
            2023: { m: 63, f: 58 },
            2024: { m: 63.5, f: 58.5 },
            2025: { m: 64, f: 59 },
            2026: { m: 64.5, f: 59.5 },
            2027: { m: 65, f: 60 },
            2028: { m: 65, f: 60.5 },
            2029: { m: 65, f: 61 },
            2030: { m: 65, f: 61.5 },
            2031: { m: 65, f: 62 }
        };


        const ajusteRegraAcessso = (ano >= 2031) ? regra2[2031][sexo] : regra2[ano][sexo];

        status = (((ano >= 2019) && idade >= (ajusteRegraAcessso - redutorProfessor))
            && tempo_contribuicao >= contribuicao_min[sexo]) ? true : false;

        this.setConclusaoAcesso(
            'idadeProgressiva',
            'Regra de Transição do art. 16 da EC nº 103/2019 (Regra de idade mínima progressiva)',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: contribuicao_min[sexo],
                idade: (ajusteRegraAcessso - redutorProfessor),
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );


    }



    /**
     * Regra de acesso Pedagio de 100 do periodo que faltava antes da reforma
     * @param  {} sexo
     * @param  {} tempo_contribuicao
     * @param  {} redutorProfessor
     * @param  {} idade
     * @param  {} tempoContribuicaoTotalAtePec
     * @param  {} tempoContribuicaoTotalMoment
     * @param  {} tempoContribuicaoTotalAtePecMoment
     * @param  {} dataInicioBeneficio
     */
    public regraAcessoPedagio100(
        sexo,
        tempo_contribuicao,
        redutorProfessor,
        idade,
        tempoContribuicaoTotalAtePec,
        tempoContribuicaoTotalMoment,
        tempoContribuicaoTotalAtePecMoment,
        dataInicioBeneficio) {

        let status = false;

        const contribuicao_idade_min = {
            m: 60 - redutorProfessor,
            f: 57 - redutorProfessor
        };

        const contribuicao_min = {
            m: 35 - redutorProfessor,
            f: 30 - redutorProfessor
        };

        let tempoDePedagio = 0;
        let contribuicaoDiff = 0;
        let tempoFinalContrib = contribuicao_min[sexo];
        let tempoDePedagioTotal = 0;

        if (idade >= contribuicao_idade_min[sexo] && tempoContribuicaoTotalAtePec.anos > 0) {

            if (tempoContribuicaoTotalAtePec.anos <= contribuicao_min[sexo]) {

                contribuicaoDiff = (contribuicao_min[sexo] - tempo_contribuicao);
                tempoDePedagio = ((contribuicao_min[sexo] - tempoContribuicaoTotalAtePec.anos));
                tempoFinalContrib = contribuicao_min[sexo] + tempoDePedagio;

            } else {
                tempoFinalContrib = contribuicao_min[sexo];
            }

            tempoDePedagioTotal = (contribuicaoDiff + tempoDePedagio);
            status = (tempo_contribuicao >= tempoFinalContrib) ? true : false;

            if ((tempoFinalContrib - tempo_contribuicao) < 0.002737850787132) {
                status = true;
            }

        }


        this.setConclusaoAcesso(
            'pedagio100',
            'Regra de Transição do art. 20 da EC nº 103/2019 (Regra de pedágio de 100% e idade)',
            status,
            0,
            idade,
            tempoContribuicaoTotalAtePec,
            tempo_contribuicao,
            {
                tempo: tempoFinalContrib,
                idade: contribuicao_idade_min[sexo],
                pedagio: tempoDePedagioTotal,
                pontos: 0,
                ano: 0
            }
        );

    }
    /**
     * egra de acesso Pedagio de 50% do periodo que faltava antes da reforma
     * @param  {} sexo
     * @param  {} tempo_contribuicao
     * @param  {} redutorProfessor
     * @param  {} idade
     * @param  {} tempoContribuicaoTotalAtePec
     * @param  {} tempoContribuicaoTotalMoment
     * @param  {} tempoContribuicaoTotalAtePecMoment
     * @param  {} dataInicioBeneficio
     */
    public regraAcessoPedagio50(
        sexo,
        tempo_contribuicao,
        redutorProfessor,
        idade,
        tempoContribuicaoTotalAtePec,
        tempoContribuicaoTotalMoment,
        tempoContribuicaoTotalAtePecMoment,
        dataInicioBeneficio) {

        let status = false;
        const contribuicao_min = { m: 33, f: 28 };
        const contribuicao_max = { m: 35, f: 30 };
        let contribuicaoDiff = 0;
        let tempoDePedagio = 0;
        let tempoFinalContrib = 0;
        let tempoDePedagioTotal = 0;
        let dataParaAposentar;


        if (tempoContribuicaoTotalAtePec.anos >= contribuicao_min[sexo]) {

            if (tempoContribuicaoTotalAtePec.anos <= contribuicao_max[sexo]) {

                contribuicaoDiff = (contribuicao_max[sexo] - tempo_contribuicao);
                tempoDePedagio = ((contribuicao_max[sexo] - tempoContribuicaoTotalAtePec.anos) * 0.5);
                tempoFinalContrib = contribuicao_max[sexo] + tempoDePedagio;

            } else {
                tempoFinalContrib = contribuicao_max[sexo];
            }

            tempoDePedagioTotal = (contribuicaoDiff + tempoDePedagio);
            //  tempoDePedagioTotal = (tempoDePedagioTotal <= 0) ? 0 : tempoDePedagioTotal;
            // status = (tempoDePedagioTotal > 0.00273973) ? false : true;
            /// status = (tempo_contribuicao >= tempoFinalContrib) ? true : false;

            status = ((tempoFinalContrib - tempo_contribuicao) < 0.002737850787132) ? true : false;

        }

        this.setConclusaoAcesso(
            'pedagio50',
            'Regra de Transição do art. 17 da EC nº 103/2019 (Regra de pedágio de 50%)',
            status,
            0,
            idade,
            tempoContribuicaoTotalAtePec,
            tempo_contribuicao,
            {
                tempo: tempoFinalContrib,
                tempoAnterior: contribuicao_min[sexo],
                idade: 0,
                pedagio: tempoDePedagio,
                pontos: 0,
                ano: 0
            }
        );

    }


    /**
     * Regra de acesso idade transição
     * @param  {} idade
     * @param  {} ano
     * @param  {} sexo
     * @param  {} tempo_contribuicao
     */
    public regraAcessoIdade(idade, ano, sexo, tempo_contribuicao, redutorProfessor) {

        let status = false;
        const contribuicao_min = 15;
        const idadeMin = 0;

        const regraIdadeParm = (anoR) => {

            const regra5 = {
                2019: { f: 60, m: 65 },
                2020: { f: 60.5, m: 65 },
                2021: { f: 61, m: 65 },
                2022: { f: 61.5, m: 65 },
                2023: { f: 62, m: 65 }
            };

            if (anoR <= 2019) {
                return regra5[2019];
            }

            if (anoR > 2019 && anoR <= 2023) {
                return regra5[anoR];
            }

            if (anoR > 2023) {
                return regra5[2023];
            }

        };

        const regra5 = regraIdadeParm(ano);

        status = (idade >= regra5[sexo] && tempo_contribuicao >= contribuicao_min) ? true : false;

        this.setConclusaoAcesso(
            'idade',
            'Regra de Transição do art. 18 da EC nº 103/2019 (Aposentadoria por idade)',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: contribuicao_min,
                tempoAnterior: 0,
                idade: regra5[sexo],
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );

    }

    /**
     * Regra idade transitoria (FINAL)
     * @param  {} idade
     * @param  {} ano
     * @param  {} sexo
     * @param  {} tempo_contribuicao
     * @param  {} tipoBeneficio
     */
    public regraAcessoIdadeTransitoria
        (
            idade,
            ano,
            sexo,
            tempo_contribuicao,
            tipoBeneficio,
            redutorProfessor
        ) {

        const contribuicao_mins = {
            3: { m: 20, f: 15 },
            16: { m: 15, f: 15 },
            31: { m: 25, f: 25 }
        };

        const idade_mins = {
            3: { m: 65, f: 62 },
            16: { m: 50, f: 55 },
            31: { m: 60, f: 57 }
        }

        const labelsIdade = {
            3: 'Aposentadoria por Idade - Trabalhador Urbano - Regra Transitória',
            16: 'Aposentadoria por Idade - Trabalhador Rural',
            31: 'Aposentadoria Programada - alinea II do  § 1º art. 19 da EC nº 103/2019'
        };

        const label = labelsIdade[tipoBeneficio];
        const idade_min = idade_mins[tipoBeneficio];
        const contribuicao_min = contribuicao_mins[tipoBeneficio];
        let status = false;


        if (tempo_contribuicao >= contribuicao_min[sexo] && idade >= idade_min[sexo]) {
            status = true;

        }

        const regra = (tipoBeneficio === '16' || tipoBeneficio === 16) ? 'idadeRural' : 'idadeTransitoria';

        this.setConclusaoAcesso(
            regra,
            label,
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: contribuicao_min[sexo],
                tempoAnterior: 0,
                idade: idade_min[sexo],
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );

    }


    /**
     * Regra de Acesso aposentadoria Especial transição e transitoria
     * @param  {} pontosEspecial
     * @param  {} contribuicaoTotalTempoAnos
     * @param  {} idadeFracionada
     * @param  {} tipoBeneficio
     * @param  {} isRegraTransitoria
     * @param  {} tempoContribuicaoTotalAtePec
     * @param  {} tempoContribuicaoTotalMoment
     * @param  {} tempoContribuicaoTotalAtePecMoment
     * @param  {} dataInicioBeneficio
     */
    public regraAcessoAposentadoriaEspecial(
        pontosEspecial,
        contribuicaoTotalTempoAnos,
        idadeFracionada,
        tipoBeneficio,
        isRegraTransitoria,
        tempoContribuicaoTotalAtePec,
        tempoContribuicaoTotalMoment,
        tempoContribuicaoTotalAtePecMoment,
        dataInicioBeneficio
    ) {

        const tempoRegra = {
            1915: 15,
            1920: 20,
            1925: 25
        };

        const tempoPercentual = {
            1915: 15,
            1920: 20,
            1925: 20
        };

        const regraEspecial = {
            1915: { pontos: 66 },
            1920: { pontos: 76 },
            1925: { pontos: 86 }
        };

        const idadeTransitoria = {
            1915: 55,
            1920: 58,
            1925: 60
        }

        const label = {
            1915: 'Aposentadoria Especial (Regra de Transição) - 15 anos',
            1920: 'Aposentadoria Especial (Regra de Transição) - 20 anos',
            1925: 'Aposentadoria Especial (Regra de Transição) - 25 anos'
        }

        const labelTansitoria = {
            1915: 'Aposentadoria Especial (Regra Transitória) - 15 anos',
            1920: 'Aposentadoria Especial (Regra Transitória) - 20 anos',
            1925: 'Aposentadoria Especial (Regra Transitória) - 25 anos'
        }

        let status = false;
        let idade_min = 0;
        let tempoMinimo = tempoRegra[tipoBeneficio];
        let pontosExcendente = 0

        // const pontosEspecial = Math.trunc(contribuicaoTotalTempoAnos + idadeFracionada);

        if (!isRegraTransitoria) {

            status = (pontosEspecial >= regraEspecial[tipoBeneficio].pontos)
                && (contribuicaoTotalTempoAnos >= tempoRegra[tipoBeneficio]);

            if (status) {

                if (pontosEspecial > regraEspecial[tipoBeneficio].pontos) {
                    pontosExcendente = (pontosEspecial - regraEspecial[tipoBeneficio].pontos) / 2
                    // tempoMinimo = contribuicaoTotalTempoAnos - pontosExcendente
                    idade_min = idadeFracionada - pontosExcendente;
                }

            }


            this.setConclusaoAcesso(
                'especial',
                label[tipoBeneficio],
                status,
                pontosEspecial,
                idadeFracionada,
                0,
                contribuicaoTotalTempoAnos,
                {
                    tempo: tempoMinimo,
                    tempoAnterior: 0,
                    idade: idade_min,
                    pedagio: 0,
                    pontos: regraEspecial[tipoBeneficio].pontos,
                    ano: 0
                }
            );

        }

        status = ((idadeFracionada >= idadeTransitoria[tipoBeneficio])
            && (contribuicaoTotalTempoAnos >= tempoRegra[tipoBeneficio]));

        idade_min = idadeTransitoria[tipoBeneficio];

        if (status) {

            if (pontosEspecial > regraEspecial[tipoBeneficio].pontos) {
                pontosExcendente = (pontosEspecial - regraEspecial[tipoBeneficio].pontos) / 2
                // tempoMinimo = contribuicaoTotalTempoAnos - pontosExcendente
                idade_min = idadeFracionada - pontosExcendente;
            }

        }

        this.setConclusaoAcesso(
            'especialt',
            labelTansitoria[tipoBeneficio],
            status,
            pontosEspecial,
            idadeFracionada,
            0,
            contribuicaoTotalTempoAnos,
            {
                tempo: tempoMinimo,
                tempoAnterior: 0,
                idade: idade_min,
                pedagio: 0,
                pontos: regraEspecial[tipoBeneficio].pontos,
                ano: 0
            }
        );


    }


    // Incapacidade
    public regraAcessoIncapacidade(
        idade,
        ano,
        sexo,
        tempo_contribuicao
    ) {

        const requisitoTempoContrib = {
            m: 1,
            f: 1
        }; // 12 meses

        let status = false;
        if (Math.trunc(tempo_contribuicao) >= requisitoTempoContrib[sexo] && this.numeroDeContribuicoes > 12) {

            status = true;

        } else {

            status = false;
        }


        this.setConclusaoAcesso(
            'incapacidade',
            'Aposentadoria por Incapacidade Permanente',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: requisitoTempoContrib[sexo],
                tempoAnterior: 0,
                idade: 0,
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );


    }

    // Auxilio Acidente
    public regraAcessoAuxilioAcidente(
        idade,
        ano,
        sexo,
        tempo_contribuicao
    ) {

        const tempoPercentualParte1 = { m: 1, f: 1 };

        let status = false;
        // this.numeroDeContribuicoes > 12
        // if (Math.trunc(tempo_contribuicao) > tempoPercentualParte1[sexo] && this.numeroDeContribuicoes > 12) {

        //     status = true;

        // } else {

        //     status = false;
        // }

        if (Math.trunc(tempo_contribuicao) > 0 && this.numeroDeContribuicoes > 0) {

            status = true;

        } else {

            status = false;
        }


        this.setConclusaoAcesso(
            'acidente',
            'Auxílio Acidente',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: tempoPercentualParte1[sexo],
                tempoAnterior: 0,
                idade: 0,
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );

    }


    /**
     * Regra acesso auxilio doença
     * @param  {} idade
     * @param  {} ano
     * @param  {} sexo
     * @param  {} tempo_contribuicao
     */
    public regraAcessoAuxilioDoenca(
        idade,
        ano,
        sexo,
        tempo_contribuicao
    ) {

        const requisitoTempoContrib = {
            m: 1,
            f: 1
        }; // 12 meses

        let status = false;
        if (Math.trunc(tempo_contribuicao) >= requisitoTempoContrib[sexo] && this.numeroDeContribuicoes > 12) {

            status = true;

        } else {

            status = false;
        }


        this.setConclusaoAcesso(
            'doenca',
            'Auxílio por Incapacidade Temporária',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: requisitoTempoContrib[sexo],
                tempoAnterior: 0,
                idade: 0,
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );

    }


    /**
     * regra especial do deficiente
     * @param  {} idade
     * @param  {} ano
     * @param  {} sexo
     * @param  {} tempo_contribuicao
     * @param  {} tipoBeneficio
     */
    public regraAcessoDeficiente(
        idade,
        ano,
        sexo,
        tempo_contribuicao,
        tipoBeneficio
    ) {

        const requisitoPCD = {
            25: {
                tempo: { m: 25, f: 20 },
                idade: { m: 0, f: 0 },
                label: 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Grave)'
            },
            26: {
                tempo: { m: 29, f: 24 },
                idade: { m: 0, f: 0 },
                label: 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Moderada)'
            },
            27: {
                tempo: { m: 33, f: 28 },
                idade: { m: 0, f: 0 },
                label: 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Leve)'
            },
            28: {
                tempo: { m: 15, f: 15 },
                idade: { m: 60, f: 55 },
                label: 'Aposentadoria por Idade da PcD'
            }
        };

        const requisitoEspecial = requisitoPCD[tipoBeneficio];

        let status = true;

        // tempo
        if (tempo_contribuicao < requisitoEspecial.tempo[sexo]) {
            status = false;
        }

        // idade
        if (idade < requisitoEspecial.idade[sexo]) {
            status = false;
        }


        this.setConclusaoAcesso(
            'deficiente',
            requisitoEspecial.label,
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: requisitoEspecial.tempo[sexo],
                tempoAnterior: 0,
                idade: requisitoEspecial.idade[sexo],
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );


    }



    // Pensão por Morte - Instituidor não Aposentado na Data do Óbito
    public regraAcessoPensaoObitoInstituidorNaoAposentado(
        idade,
        ano,
        sexo,
        tempo_contribuicao
    ) {

        const requisitoTempoContrib = {
            m: 1,
            f: 1
        }; // 12 meses

        let status = false;
        if (Math.trunc(tempo_contribuicao) >= requisitoTempoContrib[sexo] && this.numeroDeContribuicoes > 12) {

            status = true;

        } else {

            status = false;
        }


        this.setConclusaoAcesso(
            'pensaoObito',
            'Pensão por Morte - Instituidor não Aposentado na Data do Óbito',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: requisitoTempoContrib[sexo],
                tempoAnterior: 0,
                idade: 0,
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );


    }

}
