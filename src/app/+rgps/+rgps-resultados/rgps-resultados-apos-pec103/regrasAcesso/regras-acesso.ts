import { RgpsResultadosAposPec103Component } from './../rgps-resultados-apos-pec103.component';
import * as moment from 'moment';
// import { Injectable } from '@angular/core';

// @Injectable()

export class RegrasAcesso {

    public dataPromulgacao2019 = moment('13/11/2019', 'DD/MM/YYYY');
    private contribuicaoTotal;


    private arrayEspecial = [1915, 1920, 1925];
    private arrayPensao = [1900, 1901];
    private arrayEspecialDeficiente = [25, 26, 27, 28];
    private arrayIdade = [3, 16];

    public listaConclusaoAcesso = [];
    public conclusaoAcesso = {
        regra: '',
        status: false,
        pontosTotal: 0,
        pontosExcendente: 0,
        idadeAteEC103: 0,
        idadeAposEC103: 0,
        tempoExcendenteAteEC103: 0,
        tempoExcendenteAposEC103: 0,
        tempoTotalAteEC103: 0,
        tempoTotalAposEC103: 0,
        requisitos: {
            ano: 0,
            tempo: 0,
            idade: 0,
            pedagio: 0,
            pontos: 0
        }
    };

    constructor() {

    }


    public calCularTempoMaximoExcluido(listaConclusaoAcesso: any[]) {

        listaConclusaoAcesso.forEach((elementTipo, indice) => {
            // console.log(elementTipo);
            // console.log(indice);

            elementTipo.calculosPossiveis = this.gerarParametrosPorTipoAposentadoria(elementTipo)
        })

        console.log(listaConclusaoAcesso);

    }

    private gerarParametrosPorTipoAposentadoria(elementTipo) {

        const calculosPossiveis = [];
        const calculoPossivel = {
            ano: 0,
            tempo: 0,
            idade: 0,
            pedagio: 0,
            pontos: 0
        };

        console.log(elementTipo);

        if (!elementTipo.status) {
            return calculosPossiveis;
        }

        const idade =  [ 'idadeTransitoria' , 'idade'];
        const maximoDescarte = {anos: 0, meses: 0 }
        let difIdadeExcedente = 0;
        let difTempoContribExcedente = 0;


        // idade (transição e transitoria)
        if (idade.includes(elementTipo.regra)) {

            difIdadeExcedente = elementTipo.idade - elementTipo.requisitos.idade;
            difTempoContribExcedente = elementTipo.tempoTotalAposEC103 - elementTipo.requisitos.tempo;

            maximoDescarte.anos = (difIdadeExcedente > difTempoContribExcedente) ? difTempoContribExcedente : difIdadeExcedente;
            maximoDescarte.meses = Math.floor(maximoDescarte.anos * 12);

            console.log(difIdadeExcedente);
            console.log(maximoDescarte);

        }

        // Tempo de contribuição (regras de transição)
        if (elementTipo.regra === 6) {

            difIdadeExcedente = elementTipo.idade - elementTipo.requisitos.idade;
            difTempoContribExcedente = elementTipo.tempoTotalAposEC103 - elementTipo.requisitos.tempo;

            maximoDescarte.anos = (difIdadeExcedente > difTempoContribExcedente) ? difTempoContribExcedente : difIdadeExcedente;
            maximoDescarte.meses = Math.floor(maximoDescarte.anos * 12);

            console.log(difIdadeExcedente);
            console.log(maximoDescarte);

        }


        this.criarListaPossibilidades(maximoDescarte,
                                      elementTipo.requisitos);

        return [];

    }


    private criarListaPossibilidades(
        maximoDescarte,
        requisitos
    ){




    }



    private setConclusaoAcesso(
        regra: string,
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
                pontosTotal: pontosTotal,
                idade: idade,
                tempoTotalAteEC103: tempoTotalAteEC103,
                tempoTotalAposEC103: tempoTotalAposEC103,
                requisitos: requisitos,
                calculosPossiveis: [],
                excedente: {}
            });
        } else {
            this.listaConclusaoAcesso.push({
                regra: regra,
                status: false,
                pontosTotal: 0,
                idade: 0,
                tempoTotalAteEC103: 0,
                tempoTotalAposEC103: 0,
                requisitos: requisitos,
                calculosPossiveis: [],
                excedente: {}
            });
        }
    }




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
        redutorSexo: number
    ) {

        if (
            (contribuicaoPrimaria.anos <= 0)
        ) {
            return this.listaConclusaoAcesso;
        }




        // const mesesContribuicao = divisor;
        // const valorMedio = (valorTotalContribuicoes / mesesContribuicao);
        // const redutorProfessor = (tipoBeneficio == 6) ? 5 : 0;

        this.contribuicaoTotal = tempoContribuicaoTotal.anos;
        const pontos = tempoContribuicaoTotal.anos + idadeFracionada;
        const ano = dataInicioBeneficio.year();


        // tipoBeneficio = 6;
        // tipoBeneficio = 1915;


        // aplicação default false
        if (this.arrayEspecial.includes(tipoBeneficio)) {

            // Aposentadoria especial
            //   this.isRegrasAposentadoriaEspecial = true;
            //   this.regraAposentadoriaEspecial(mesesContribuicao, valorMedio, tipoBeneficio);

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

            // incapacidade
            //   this.isRegrasIncapacidade = true;
            this.regraAcessoIncapacidade(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal
            );

        } else if (tipoBeneficio === 1905) {

            // Auxilio acidente
            //   this.isRegrasAuxilioAcidente = true;
            //   this.regraAuxilioAcidente(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio);

            this.regraAcessoAuxilioAcidente(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal
            );

        } else if (tipoBeneficio === 1) {

            // Auxilio doença
            //   this.isRegrasAuxilioDoenca = true;
            //   this.regraAuxilioDoenca(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio);

        } else if (this.arrayEspecialDeficiente.includes(tipoBeneficio)) {

            // especial deficiente
            //   this.isRegraEspecialDeficiente = true;
            //   this.regraEspecialDeficiente(mesesContribuicao, valorMedio, tipoBeneficio)

            this.regraAcessoEspecialDeficiente(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal,
                tipoBeneficio
            )

        } else if (this.arrayIdade.includes(tipoBeneficio)) {

            // Aposentadoria por idade
            //   this.isStatusTransicaoIdade = (tipoBeneficio === 3) ? true : false;

            // Aposentadoria por idade - Trabalhador Rural
            //   if (!this.erroCarenciaMinima) {
            //     this.isRegrasIdade = true;
            //     this.regraIdade(mesesContribuicao, valorMedio);
            //     this.regraIdadeFinal(mesesContribuicao, valorMedio, tipoBeneficio);
            //   }



            this.regraAcessoIdadeTransitoria(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal,
                tipoBeneficio
            )
            this.regraAcessoIdade(
                idadeFracionada,
                ano,
                sexo,
                this.contribuicaoTotal
            )


        } else if (tipoBeneficio === 6) {

            // professor transitoria e transição
            if (!isRegraTransitoria) {

                // this.isRegrasTransicao = true;
                // this.verificaRegrasTransicao(contribuicaoPrimaria);
                // this.atualizarCalculoMelhorRMIRegrasTransicao();

                this.regraAcessoPontos(idadeFracionada, pontos, ano, sexo, this.contribuicaoTotal, redutorProfessor);
                this.RegrasAcessoIdadeProgressiva(idadeFracionada, ano, sexo, this.contribuicaoTotal, redutorProfessor);
                this.regraAcessoPedagio100(
                    sexo,
                    this.contribuicaoTotal,
                    redutorProfessor,
                    idadeFracionada,
                    tempoContribuicaoTotalAtePec,
                    tempoContribuicaoTotalMoment,
                    tempoContribuicaoTotalAtePecMoment,
                    dataInicioBeneficio.clone());
                this.regraAcessoPedagio50(
                    sexo,
                    this.contribuicaoTotal,
                    redutorProfessor,
                    idadeFracionada,
                    tempoContribuicaoTotalAtePec,
                    tempoContribuicaoTotalMoment,
                    tempoContribuicaoTotalAtePecMoment,
                    dataInicioBeneficio.clone());
                this.regraAcessoIdade(idadeFracionada, ano, sexo, this.contribuicaoTotal);



            }

            //   isRegraTransitoriaProfessor = true;
            //   this.regraProfessorTransitoria(mesesContribuicao, valorMedio, tipoBeneficio);

        } else {
            //   isRegrasTransicao = true;
            //   this.aplicarRegrasTransicao(mesesContribuicao, valorMedio, redutorProfessor);
            //   this.atualizarCalculoMelhorRMIRegrasTransicao();

            this.regraAcessoPontos(idadeFracionada, pontos, ano, sexo, this.contribuicaoTotal, redutorProfessor);
            this.RegrasAcessoIdadeProgressiva(idadeFracionada, ano, sexo, this.contribuicaoTotal, redutorProfessor);
            this.regraAcessoPedagio100(
                sexo,
                this.contribuicaoTotal,
                redutorProfessor,
                idadeFracionada,
                tempoContribuicaoTotalAtePec,
                tempoContribuicaoTotalMoment,
                tempoContribuicaoTotalAtePecMoment,
                dataInicioBeneficio.clone());
            this.regraAcessoPedagio50(sexo,
                this.contribuicaoTotal,
                redutorProfessor,
                idadeFracionada,
                tempoContribuicaoTotalAtePec,
                tempoContribuicaoTotalMoment,
                tempoContribuicaoTotalAtePecMoment,
                dataInicioBeneficio.clone());
            this.regraAcessoIdade(idadeFracionada, ano, sexo, this.contribuicaoTotal);

        }

        // console.log(this.listaConclusaoAcesso);

        return this.listaConclusaoAcesso;

    }



    // transição regras de acesso inicio
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

            // if ((sexo === 'm' && ano > 2028 && pontos >= 105)
            //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
            //     return true;

            // }

            // if ((sexo === 'f' && ano > 2033 && pontos >= 100)
            //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
            //     return true;
            // }
            pontosRequeridos = regra1[ano][sexo];
            status = (((ano >= 2019 && ano <= 2033) && pontos >= regra1[ano][sexo])
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

            // if ((sexo === 'm' && ano > 2028 && pontos >= 100)
            //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
            //     return true;
            // }

            // if ((sexo === 'f' && ano > 2030 && pontos >= 92)
            //     && tempo_contribuicao >= requisitoContribuicoes[sexo]) {
            //     return true;
            // }
            pontosRequeridos = regra1[ano][sexo];
            status = (((ano >= 2019 && ano <= 2030) && pontos >= regra1[ano][sexo])
                && tempo_contribuicao >= requisitoContribuicoes[sexo]) ? true : false;
        }


        this.setConclusaoAcesso(
            'pontos',
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


    public RegrasAcessoIdadeProgressiva
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

        // if ((sexo === 'm' && ano > 2027 && idade >= (65 - redutorProfessor)) && tempo_contribuicao >= contribuicao_min[sexo]) {
        //     return true;
        // }

        // if ((sexo === 'f' && ano > 2031 && idade >= (62 - redutorProfessor)) && tempo_contribuicao >= contribuicao_min[sexo]) {
        //     return true;
        // }

        status = (((ano >= 2019 && ano <= 2031) && idade >= (regra2[ano][sexo] - redutorProfessor))
            && tempo_contribuicao >= contribuicao_min[sexo]) ? true : false;


        this.setConclusaoAcesso(
            'idadeProgressiva',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: contribuicao_min[sexo],
                idade: (regra2[ano][sexo] - redutorProfessor),
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );


    }




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

        let tempoExcendenteAposEC103 = tempoContribuicaoTotalMoment.clone();
        let tempoFinalContribComPedagio;
        let tempoDePedagio;

        if (idade >= contribuicao_idade_min[sexo] && tempoContribuicaoTotalAtePec.anos > 0) {

            const contribuicao_min_moment = {
                m: moment.duration(35, 'y').subtract(redutorProfessor, 'y'),
                f: moment.duration(30, 'y').subtract(redutorProfessor, 'y')
            };


            tempoDePedagio = (contribuicao_min_moment[sexo].clone())
                .subtract(tempoContribuicaoTotalAtePecMoment);


            tempoFinalContribComPedagio = (contribuicao_min_moment[sexo].clone()).add(tempoDePedagio);

            let tempoDePedagioTotal = tempoDePedagio.clone();
            tempoDePedagioTotal = tempoDePedagioTotal.add(tempoDePedagio);

            const dataParaAposentar = dataInicioBeneficio.add(tempoDePedagioTotal, 'years').format('DD/MM/YYYY');

            if (tempoContribuicaoTotalMoment.asDays() >= tempoFinalContribComPedagio.asDays()) {

                tempoExcendenteAposEC103 = tempoExcendenteAposEC103.subtract(tempoFinalContribComPedagio);
                console.log(tempoExcendenteAposEC103);

                status = true;

            } else {

                let contribuicaoDiff = tempoFinalContribComPedagio.clone()
                contribuicaoDiff = contribuicaoDiff.subtract(tempoContribuicaoTotalMoment).subtract(1, 'd');

                status = false;
            }

        }

        this.setConclusaoAcesso(
            'pedagio100',
            status,
            0,
            idade,
            tempoContribuicaoTotalAtePec,
            tempo_contribuicao,
            {
                tempo: tempoFinalContribComPedagio,
                idade: contribuicao_idade_min[sexo],
                pedagio: tempoDePedagio,
                pontos: 0,
                ano: 0
            }
        );

    }


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

            }

            tempoDePedagioTotal = contribuicaoDiff + tempoDePedagio;
            tempoDePedagioTotal = (tempoDePedagioTotal <= 0) ? 0 : tempoDePedagioTotal;

            dataParaAposentar = (dataInicioBeneficio.clone()).add(tempoDePedagioTotal, 'years').format('DD/MM/YYYY');

            status = (tempoDePedagioTotal > 0.00273973) ? false : true;

        }


        this.setConclusaoAcesso(
            'pedagio50',
            status,
            0,
            idade,
            tempoContribuicaoTotalAtePec,
            tempo_contribuicao,
            {
                tempo: tempoDePedagioTotal,
                idade: 0,
                pedagio: tempoDePedagio,
                pontos: 0,
                ano: 0
            }
        );

    }



    /**
     * regra 5 - idade
     */
    public regraAcessoIdade(idade, ano, sexo, tempo_contribuicao) {

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

        // status =  (sexo === 'm' && idade >= 65 && tempo_contribuicao >= contribuicao_min) ? true : false;

        // status =  (sexo === 'f' && idade >= regra5['f'] && tempo_contribuicao >= contribuicao_min) ? true : false;
        status = (idade >= regra5[sexo] && tempo_contribuicao >= contribuicao_min) ? true : false;

        this.setConclusaoAcesso(
            'idade',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: contribuicao_min,
                idade: regra5[sexo],
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );

    }


    // transição regras de acesso fim

    //

    public regraAcessoIdadeTransitoria
        (
            idade,
            ano,
            sexo,
            tempo_contribuicao,
            tipoBeneficio
        ) {


        let contribuicao_min = { m: 20, f: 15 };
        let idade_min = { m: 65, f: 62 };
        let status = false;

        if (tipoBeneficio === 16) {
            contribuicao_min = { m: 15, f: 15 };
            idade_min = { m: 60, f: 55 };
        }

        if (tempo_contribuicao >= contribuicao_min[sexo] && idade >= idade_min[sexo]) {
            status = true;
        }


        this.setConclusaoAcesso(
            'idadeTransitoria',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: contribuicao_min[sexo],
                idade: idade_min[sexo],
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );

    }


    // Aposentadoria especial
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

        let status = false;
        let idade_min = 0;

        // const pontosEspecial = Math.trunc(contribuicaoTotalTempoAnos + idadeFracionada);

        if (isRegraTransitoria) {

            status = (idadeFracionada >= idadeTransitoria[tipoBeneficio]);
            idade_min = idadeTransitoria[tipoBeneficio];

        } else {

            status = (pontosEspecial >= regraEspecial[tipoBeneficio].pontos)
                && (contribuicaoTotalTempoAnos >= tempoRegra[tipoBeneficio]);

        }


        this.setConclusaoAcesso(
            'especial',
            status,
            pontosEspecial,
            idadeFracionada,
            0,
            contribuicaoTotalTempoAnos,
            {
                tempo: tempoRegra[tipoBeneficio],
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

        const tempoPercentual = {
            m: 20,
            f: 15
        };

        let status = false;

        if (tempo_contribuicao > tempoPercentual[sexo]) {

            status = true;
        } else {

            status = false;
        }

        this.setConclusaoAcesso(
            'incapacidade',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: tempoPercentual[sexo],
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

        const tempoPercentualParte1 = {
            m: 20,
            f: 15
        };

        let percentualParte1 = 60;
        let status = false;

        if (Math.trunc(tempo_contribuicao) > tempoPercentualParte1[sexo]) {

            percentualParte1 += ((Math.trunc(tempo_contribuicao) - tempoPercentualParte1[sexo]) * 2);
            status = true;

        } else {

            status = false;
        }


        this.setConclusaoAcesso(
            'acidente',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: tempoPercentualParte1[sexo],
                idade: 0,
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );

    }




    // regra especial do deficiente

    public regraAcessoEspecialDeficiente(
        idade,
        ano,
        sexo,
        tempo_contribuicao,
        tipoBeneficio
    ) {

        const getRequisitoEspecialDeficiente = (tipoBeneficioREQ: number) => {

            let requisito: any;

            switch (tipoBeneficioREQ) {
                case 25:
                    requisito = { m: 25, f: 20 }; // tempo Grave
                    break;
                case 26:
                    requisito = { m: 29, f: 24 }; // tempo moderada
                    break;
                case 27:
                    requisito = { m: 33, f: 28 }; // tempo leve
                    break;
                case 28:
                    requisito = {
                        tempo: { m: 15, f: 15 },
                        idade: { m: 60, f: 55 }
                    };
                    break;
            }

            return requisito;

        };

        const requisitoEspecial = getRequisitoEspecialDeficiente(tipoBeneficio);

        let status = true;

        if (tipoBeneficio !== 28) {
            // tempo

            if (tempo_contribuicao < requisitoEspecial[sexo]) {
                status = false;
            }

        } else {
            // idade

            if (tempo_contribuicao < requisitoEspecial.tempo[sexo]) {
                status = false;
            }

            if (idade < requisitoEspecial.idade[sexo]) {

                status = false;
            }

        }


        this.setConclusaoAcesso(
            'deficiente',
            status,
            0,
            idade,
            0,
            tempo_contribuicao,
            {
                tempo: requisitoEspecial[sexo],
                idade: 0,
                pedagio: 0,
                pontos: 0,
                ano: ano
            }
        );


    }



    // public regrasDaReforma(
    //     dataFiliacao,
    // ) {

    //     const arrayEspecial = [1915, 1920, 1925];
    //     const arrayPensao = [1900, 1901];
    //     const arrayIdade = [3, 16];
    //     const arrayEspecialDeficiente = [25, 26, 27, 28];

    //     if (dataFiliacao && dataFiliacao != null && moment(dataFiliacao).isValid()) {
    //       this.isRegraTransitoria = (dataFiliacao.isSameOrAfter(this.dataPromulgacao2019));
    //     }

    //     //  const mesesContribuicao = this.getDifferenceInMonths(moment('1994-07-01'), this.dataInicioBeneficio);
    //     // const mesesContribuicao = this.numeroDeContribuicoes;
    //     const mesesContribuicao = this.divisorMinimo;
    //     const valorMedio = (this.valorTotalContribuicoes / mesesContribuicao);
    //     const redutorProfessor = (tipoBeneficio == 6) ? 5 : 0;

    //     //if( typeof this.contribuicaoTotal === 'undefined'  ){

    //     const tempo = this.contribuicaoPrimaria;
    //     let contagemPrimaria = (tempo.anos * 365.25) + (tempo.meses * 30.4375) + tempo.dias;
    //     let contagemPrimariaAnos = contagemPrimaria / 365.25;

    //     this.contribuicaoTotal = contagemPrimariaAnos;

    //     // }


    //     // let moeda = this.dataInicioBeneficio.isSameOrBefore(moment(), 'month') ? 
            // this.Moeda.getByDate(this.dataInicioBeneficio) : this.Moeda.getByDate(moment());



    //     // aplicação default false
    //     if (arrayEspecial.includes(this.tipoBeneficio)) {

    //       // Aposentadoria especial
    //       this.isRegrasAposentadoriaEspecial = true;
    //       this.regraAposentadoriaEspecial(mesesContribuicao, valorMedio, this.tipoBeneficio);

    //     } else if (arrayPensao.includes(this.tipoBeneficio)) {

    //       // pensão
    //       this.isRegrasPensaoObito = true;
    //       this.regraPensaoPorMorte(mesesContribuicao, valorMedio, redutorProfessor, this.tipoBeneficio, this.calculo.sexo_instituidor);

    //     } else if (this.tipoBeneficio === 1903) {

    //       // incapacidade
    //       this.isRegrasIncapacidade = true;
    //       this.regraIncapacidade(mesesContribuicao, valorMedio, redutorProfessor, this.tipoBeneficio);

    //     } else if (this.tipoBeneficio === 1905) {

    //       // Auxilio acidente
    //       this.isRegrasAuxilioAcidente = true;
    //       this.regraAuxilioAcidente(mesesContribuicao, valorMedio, redutorProfessor, this.tipoBeneficio);

    //     } else if (this.tipoBeneficio === 1) {

    //       // Auxilio doença
    //       this.isRegrasAuxilioDoenca = true;
    //       this.regraAuxilioDoenca(mesesContribuicao, valorMedio, redutorProfessor, this.tipoBeneficio);

    //     } else if (arrayIdade.includes(this.tipoBeneficio)) {
    //       // Aposentadoria por idade
    //       this.isStatusTransicaoIdade = (this.tipoBeneficio === 3) ? true : false;

    //       // Aposentadoria por idade - Trabalhador Rural
    //       if (!this.erroCarenciaMinima) {
    //         this.isRegrasIdade = true;
    //         this.regraIdade(mesesContribuicao, valorMedio);
    //         this.regraIdadeFinal(mesesContribuicao, valorMedio, this.tipoBeneficio);
    //       }

    //     } else if (arrayEspecialDeficiente.includes(this.tipoBeneficio)) {

    //       // especial deficiente
    //       this.isRegraEspecialDeficiente = true;
    //       this.regraEspecialDeficiente(mesesContribuicao, valorMedio, this.tipoBeneficio)

    //     } else if (this.tipoBeneficio === 6) {

    //       // professor transitoria e transição
    //       if (!this.isRegraTransitoria) {

    //         this.isRegrasTransicao = true;
    //         this.aplicarRegrasTransicao(mesesContribuicao, valorMedio, redutorProfessor);
    //         this.atualizarCalculoMelhorRMIRegrasTransicao();
    //       }

    //       this.isRegraTransitoriaProfessor = true;
    //       this.regraProfessorTransitoria(mesesContribuicao, valorMedio, this.tipoBeneficio);

    //     } else {
    //       this.isRegrasTransicao = true;
    //       this.aplicarRegrasTransicao(mesesContribuicao, valorMedio, redutorProfessor);
    //       this.atualizarCalculoMelhorRMIRegrasTransicao();

    //     }


    //     // setTimeout(() => {
    //     //   this.descarteContribuicoesSelecionadas();
    //     // }, 5000);


    //   }

}
