import { RgpsResultadosAposPec103Component } from './../rgps-resultados-apos-pec103.component';
import * as moment from 'moment';


export class RegrasAcesso {

    public dataPromulgacao2019 = moment('13/11/2019', 'DD/MM/YYYY');
    private contribuicaoTotal;

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
        tempoTotalAposEC103: 0
    };

    // conclusaoAcessoRegraAcessoPontos;
    // conclusaoAcessoRegrasAcessoIdadeProgressiva;
    // conclusaoAcessoRegraAcessoPedagio100;
    // conclusaoAcessoRegraAcessoPedagio50;
    // conclusaoAcessoRegraAcessoIdade;

    constructor() {

    }

    calcularRMI() {

    }


    public getVerificacaoRegras(
        dataInicioBeneficio,
        dataFiliacao,
        tipoBeneficio,
        isRegraTransitoria,
        contribuicaoPrimaria,
        tempoContribuicaoTotal,
        tempoContribuicaoTotalAtePec,
        idadeSegurado,
        idadeFracionada,
        sexo,
        redutorProfessor,
        redutorSexo
    ) {

        if (
            (contribuicaoPrimaria.anos <= 0)
        ) {
            return this.listaConclusaoAcesso;
        }

        const arrayEspecial = [1915, 1920, 1925];
        const arrayPensao = [1900, 1901];
        const arrayIdade = [3, 16];
        const arrayEspecialDeficiente = [25, 26, 27, 28];

        // const mesesContribuicao = divisor;
        // const valorMedio = (valorTotalContribuicoes / mesesContribuicao);
        // const redutorProfessor = (tipoBeneficio == 6) ? 5 : 0;

        this.contribuicaoTotal = tempoContribuicaoTotal.anos;
        const pontos = tempoContribuicaoTotal.anos + idadeFracionada;
        const ano = dataInicioBeneficio.year();

        // aplicação default false
        if (arrayEspecial.includes(tipoBeneficio)) {

            // Aposentadoria especial
            //   this.isRegrasAposentadoriaEspecial = true;
            //   this.regraAposentadoriaEspecial(mesesContribuicao, valorMedio, tipoBeneficio);

        } else if (arrayPensao.includes(tipoBeneficio)) {

            // pensão 
            //   this.isRegrasPensaoObito = true;
            //   this.regraPensaoPorMorte(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio, calculo.sexo_instituidor);

        } else if (tipoBeneficio === 1903) {

            // incapacidade
            //   this.isRegrasIncapacidade = true;
            //   this.regraIncapacidade(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio);

        } else if (tipoBeneficio === 1905) {

            // Auxilio acidente
            //   this.isRegrasAuxilioAcidente = true;
            //   this.regraAuxilioAcidente(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio);

        } else if (tipoBeneficio === 1) {

            // Auxilio doença
            //   this.isRegrasAuxilioDoenca = true;
            //   this.regraAuxilioDoenca(mesesContribuicao, valorMedio, redutorProfessor, tipoBeneficio);

        } else if (arrayIdade.includes(tipoBeneficio)) {
            // Aposentadoria por idade 
            //   this.isStatusTransicaoIdade = (tipoBeneficio === 3) ? true : false;

            // Aposentadoria por idade - Trabalhador Rural
            //   if (!this.erroCarenciaMinima) {
            //     this.isRegrasIdade = true;
            //     this.regraIdade(mesesContribuicao, valorMedio);
            //     this.regraIdadeFinal(mesesContribuicao, valorMedio, tipoBeneficio);
            //   }

        } else if (arrayEspecialDeficiente.includes(tipoBeneficio)) {

            // especial deficiente
            //   this.isRegraEspecialDeficiente = true;
            //   this.regraEspecialDeficiente(mesesContribuicao, valorMedio, tipoBeneficio)

        } else if (tipoBeneficio === 6) {

            // professor transitoria e transição
            if (!isRegraTransitoria) {

                // this.isRegrasTransicao = true;
                //this.verificaRegrasTransicao(contribuicaoPrimaria);
                // this.atualizarCalculoMelhorRMIRegrasTransicao();

                this.regraAcessoPontos(pontos, ano, sexo, this.contribuicaoTotal, redutorProfessor);
                this.RegrasAcessoIdadeProgressiva(idadeFracionada, ano, sexo, this.contribuicaoTotal, redutorProfessor);
                this.regraAcessoPedagio100(sexo, this.contribuicaoTotal, redutorProfessor, idadeFracionada);
                this.regraAcessoPedagio50(sexo, this.contribuicaoTotal);
                this.regraAcessoIdade(idadeFracionada, ano, sexo, this.contribuicaoTotal);


                console.log(this.listaConclusaoAcesso);
            }

            //   isRegraTransitoriaProfessor = true;
            //   this.regraProfessorTransitoria(mesesContribuicao, valorMedio, tipoBeneficio);

        } else {
            //   isRegrasTransicao = true;
            //   this.aplicarRegrasTransicao(mesesContribuicao, valorMedio, redutorProfessor);
            //   this.atualizarCalculoMelhorRMIRegrasTransicao();

            this.regraAcessoPontos(pontos, ano, sexo, this.contribuicaoTotal, redutorProfessor);
            this.RegrasAcessoIdadeProgressiva(idadeFracionada, ano, sexo, this.contribuicaoTotal, redutorProfessor);
            this.regraAcessoPedagio100(sexo, this.contribuicaoTotal, redutorProfessor, idadeFracionada);
            this.regraAcessoPedagio50(sexo, this.contribuicaoTotal);
            this.regraAcessoIdade(idadeFracionada, ano, sexo, this.contribuicaoTotal);


            console.log(this.listaConclusaoAcesso);

        }


    }
    // transição regras de acesso inicio



    public regraAcessoPontos(pontos, ano, sexo, tempo_contribuicao, redutorProfessor) {

        let status = false;
        let  requisitoContribuicoes = { f: 30, m: 35 };
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


      if (status) {
        this.listaConclusaoAcesso.push({
            regra: 'pontos',
            status: status,
            pontosTotal: pontos,
            pontosExcendente: (pontos - pontosRequeridos),
            idadeAteEC103: 0,
            idadeAposEC103: 0,
            tempoExcendenteAteEC103: 0,
            tempoExcendenteAposEC103: ( tempo_contribuicao - requisitoContribuicoes[sexo]),
            tempoTotalAteEC103: 0,
            tempoTotalAposEC103: 0
        });
      } else {
        this.listaConclusaoAcesso.push({
            regra: 'pontos',
            status: false,
            pontosTotal: 0,
            pontosExcendente: 0,
            idadeAteEC103: 0,
            idadeAposEC103: 0,
            tempoExcendenteAteEC103: 0,
            tempoExcendenteAposEC103: 0,
            tempoTotalAteEC103: 0,
            tempoTotalAposEC103: 0
        });
      }

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

        status =  (((ano >= 2019 && ano <= 2031) && idade >= (regra2[ano][sexo] - redutorProfessor))
            && tempo_contribuicao >= contribuicao_min[sexo]) ? true : false;

            if (status) {
                this.listaConclusaoAcesso.push({
                    regra: 'idadeProgressiva',
                    status: status,
                    pontosTotal: 0,
                    pontosExcendente: 0,
                    idadeAteEC103: 0,
                    idadeAposEC103: (idade - (regra2[ano][sexo] - redutorProfessor)),
                    tempoExcendenteAteEC103: 0,
                    tempoExcendenteAposEC103: (tempo_contribuicao - contribuicao_min[sexo]),
                    tempoTotalAteEC103: 0,
                    tempoTotalAposEC103: 0
                });
              } else {
                this.listaConclusaoAcesso.push({
                    regra: 'idadeProgressiva',
                    status: false,
                    pontosTotal: 0,
                    pontosExcendente: 0,
                    idadeAteEC103: 0,
                    idadeAposEC103: 0,
                    tempoExcendenteAteEC103: 0,
                    tempoExcendenteAposEC103: 0,
                    tempoTotalAteEC103: 0,
                    tempoTotalAposEC103: 0
                });
              }

    }


    /**
     * regra 5 - idade
     */
    public regraAcessoIdade(idade, ano, sexo, tempo_contribuicao) {

        let status = false;
        const contribuicao_min = 15;
        let idadeMin = 0;

        const regraIdadeParm = (ano , sexo) => {

            const regra5 = {
                2019: { f: 60, m: 65 },
                2020: { f: 60.5, m: 65 },
                2021: { f: 61, m: 65 },
                2022: { f: 61.5, m: 65 },
                2023: { f: 62, m: 65 }
            };

            if (ano <= 2019) {
                return regra5[2019];
            }

            if (ano > 2019 && ano <= 2023) {
                return regra5[ano];
            }

            if (ano > 2023) {
                return regra5[2023];
            }

        };

        const regra5 = regraIdadeParm(ano, sexo);

        // status =  (sexo === 'm' && idade >= 65 && tempo_contribuicao >= contribuicao_min) ? true : false;

        // status =  (sexo === 'f' && idade >= regra5['f'] && tempo_contribuicao >= contribuicao_min) ? true : false;
        status =  (idade >= regra5[sexo] && tempo_contribuicao >= contribuicao_min) ? true : false;

        if (status) {
            this.listaConclusaoAcesso.push({
                regra: 'idade',
                status: status,
                pontosTotal: 0,
                pontosExcendente: 0,
                idadeAteEC103: 0,
                idadeAposEC103: (idade - (regra5[sexo])),
                tempoExcendenteAteEC103: 0,
                tempoExcendenteAposEC103: (tempo_contribuicao - contribuicao_min),
                tempoTotalAteEC103: 0,
                tempoTotalAposEC103: 0
            });
          } else {
            this.listaConclusaoAcesso.push({
                regra: 'idade',
                status: false,
                pontosTotal: 0,
                pontosExcendente: 0,
                idadeAteEC103: 0,
                idadeAposEC103: 0,
                tempoExcendenteAteEC103: 0,
                tempoExcendenteAposEC103: 0,
                tempoTotalAteEC103: 0,
                tempoTotalAposEC103: 0
            });
          }

    }



    public regraAcessoPedagio100(sexo, tempo_contribuicao, redutorProfessor, idade) {

        let status = false;

        const contribuicao_idade_min = {
            m: 60 - redutorProfessor,
            f: 57 - redutorProfessor
        };

        const contribuicao_min = {
            m: 35 - redutorProfessor,
            f: 30 - redutorProfessor
        };

        //tempo_contribuicao >= contribuicao_min[sexo] &&


        if (idade >= contribuicao_idade_min[sexo]) {
            status = true;
        }

        return status;

    }


    public regraAcessoPedagio50(sexo, tempo_contribuicao) {

        let status = false;
        const contribuicao_min = { m: 33, f: 28 };
        // const contribuicao_max = { m: 35, f: 30 };

        if (tempo_contribuicao >= contribuicao_min[sexo]) {
            status = true;
        }

        return status;

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

        if (tipoBeneficio === 16) {
            contribuicao_min = { m: 15, f: 15 };
            idade_min = { m: 60, f: 55 };
        }

        if (tempo_contribuicao < contribuicao_min[sexo]) {
            return {
                status: false,
                // msg: `O segurado não possuí tempo mínimo de contribuição, faltam
                //                     ${this.tratarTempoFracionado((contribuicao_min[sexo] - tempo_contribuicao))} `
            }
        }

        if (idade < idade_min[sexo]) {
            return {
                status: false,
                // msg: `O segurado não possuí a idade mínima, faltam 
                //                     ${this.tratarTempoFracionado((idade_min[sexo] - idade))} `
            }
        };


        return { status: true, msg: 'O segurado preenche os requisitos.' };
    }


    //




    public regraAcessoAposentadoriaEspecial(
        contribuicaoTotalTempoAnos,
        idadeFracionada,
        tipoBeneficio,
        isRegraTransitoria
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


        const pontosEspecial = Math.trunc(contribuicaoTotalTempoAnos + idadeFracionada);

        if (isRegraTransitoria) {
            return (idadeFracionada >= idadeTransitoria[tipoBeneficio]);
        }

        return (pontosEspecial >= regraEspecial[tipoBeneficio].pontos) && (contribuicaoTotalTempoAnos >= tempoRegra[tipoBeneficio]);
    }


    public regraAcessoAuxilioAcidente(
        contribuicaoTotal,
        sexo,
    ) {

        const tempoPercentualParte1 = {
            m: 20,
            f: 15
        };

        let percentualParte1 = 60;

        if (Math.trunc(contribuicaoTotal) > tempoPercentualParte1[sexo]) {

            percentualParte1 += ((Math.trunc(contribuicaoTotal) - tempoPercentualParte1[sexo]) * 2);

            // this.conclusoesRegrasAuxilioAcidente.formulaParte1 = `60% + ((${Math.trunc(this.contribuicaoTotal)}
            //                                             - ${tempoPercentualParte1[this.segurado.sexo]}) * 2%)`;

        } else {

            // this.conclusoesRegrasAuxilioAcidente.formulaParte1 = `60% (o segurado possuí menos de 
            //                                               ${tempoPercentualParte1[this.segurado.sexo]} anos de contribuição.)`;

        }

    }




    // regra especial do deficiente

    public getRegraEspecialDeficiente(idade, ano, sexo, tempo_contribuicao, tipoBeneficio) {

        const getRequisitoEspecialDeficiente = (tipoBeneficio) => {

            let requisito: any;

            switch (tipoBeneficio) {
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
        let msg = '';

        if (tipoBeneficio !== 28) {
            // tempo

            if (tempo_contribuicao < requisitoEspecial[sexo]) {
                status = false;
                //     msg = `O segurado não possuí o tempo de contribuição necessário, faltam 
                //   ${this.tratarTempoFracionado((requisitoEspecial[sexo] - tempo_contribuicao))}`;
            }

        } else {
            // idade

            if (tempo_contribuicao < requisitoEspecial.tempo[sexo]) {
                status = false;
                // msg = `O segurado não possuí o(s) requisito(s), faltam 
                // ${this.tratarTempoFracionado((requisitoEspecial.tempo[sexo] - tempo_contribuicao))}
                // de tempo de contribuição `;
            }

            if (idade < requisitoEspecial.idade[sexo]) {

                status = false;
                //     msg += (msg == '') ? `O segurado não possuí a idade necessária, faltam
                //    ${this.tratarTempoFracionado((requisitoEspecial.idade[sexo] - idade))}` :
                //         ` e ${this.tratarTempoFracionado((requisitoEspecial.idade[sexo] - idade))} de idade `;
            }

        }

        return { status: status, msg: msg };
    }


    public regraAcessoIncapacidade(
        mesesContribuicao,
        redutorProfessor,
        tipoBeneficio,
        obito_decorrencia_trabalho,
        sexo,
        contribuicaoTotal
    ) {


        const tempoPercentual = {
            m: 20,
            f: 15
        };

        let percentual = 60;
        if (obito_decorrencia_trabalho !== 1) {

            if (Math.trunc(contribuicaoTotal) > tempoPercentual[sexo]) {

                percentual += ((Math.trunc(contribuicaoTotal) - tempoPercentual[sexo]) * 2);
                //   this.conclusoesRegraIncapacidade.formula = `60% + ((${Math.trunc(this.contribuicaoTotal)}
                //                                               - ${tempoPercentual[this.segurado.sexo]}) * 2%)`;
            } else {
                //   this.conclusoesRegraIncapacidade.formula = `60% (o segurado possuí menos de 
                //                                                 ${tempoPercentual[this.segurado.sexo]} anos de contribuição.)`;
            }

            //  percentual = (percentual > 100) ? 100 : percentual;

        } else if (obito_decorrencia_trabalho === 1) {
            percentual = 100;
            // this.conclusoesRegraIncapacidade.formula = `100% (consequente de acidente de trabalho, doença profissional ou doença do trabalho)`;
        }


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


    //     // let moeda = this.dataInicioBeneficio.isSameOrBefore(moment(), 'month') ? this.Moeda.getByDate(this.dataInicioBeneficio) : this.Moeda.getByDate(moment());



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
