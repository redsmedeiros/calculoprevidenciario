
import * as moment from 'moment';

import { DefinicaoTempo } from './../share-rmi/definicao-tempo';
import { DefinicaoMoeda } from '../share-rmi/definicao-moeda';

export class conclusoesFinais {


    private moedaDib;
    private contribuicoes;
    private listaConclusaoAcesso;
    private calculo;
    private segurado;
    private pbcCompleto;
    private indicesSelecionado;
    private dibCurrency;
    private divisorMinimo;


    public createConclusoesFinais(
        moedaDib: object,
        listaConclusaoAcesso: Array<object>,
        segurado: object,
        calculo: object,
        pbcCompleto: boolean,
        divisorMinimo: object
    ) {

        this.moedaDib = moedaDib;
        this.listaConclusaoAcesso = listaConclusaoAcesso;
        this.calculo = calculo;
        this.segurado = segurado;
        this.pbcCompleto = pbcCompleto;
        this.divisorMinimo = divisorMinimo;

        listaConclusaoAcesso.forEach(elementRegraEspecie => {
            this.criarConclusaoPossibilidade(elementRegraEspecie);
        });

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

            this.aplicarDestaqueMelhorValor(elementRegraEspecie);
        } else {

            this.conclusaoPossibilidadeNaoAtenteRequisitos(elementRegraEspecie);
        }

        return elementRegraEspecie;
    }


    /**
     * Quando o segurado não cumpre os requisitos da especie
     * @param  {} elementRegraEspecie
     */
    private conclusaoPossibilidadeNaoAtenteRequisitos(elementRegraEspecie) {

        moment.locale('pt-br');
        const requisitosNaoAtendidos = [];

        if (elementRegraEspecie.requisitos.tempo > 0 && elementRegraEspecie.tempoTotalAposEC103 < elementRegraEspecie.requisitos.tempo) {

            const diferenca = elementRegraEspecie.requisitos.tempo - elementRegraEspecie.tempoTotalAposEC103;
            const diferencaOBJ = DefinicaoTempo.converterTempoAnos(diferenca);
            const diferencaString = `Faltam ${DefinicaoTempo.formateObjToStringAnosMesesDias(diferencaOBJ)} de tempo de Contribuição.`;

            requisitosNaoAtendidos.push({ tipo: 'tempo', value: diferenca, valueString: diferencaString });
        }

        if (elementRegraEspecie.requisitos.tempoAnterior > 0
            && elementRegraEspecie.tempoTotalAteEC103.anos < elementRegraEspecie.requisitos.tempoAnterior) {

            const diferenca = elementRegraEspecie.requisitos.tempoAnterior - elementRegraEspecie.tempoTotalAteEC103.anos;
            const diferencaOBJ = DefinicaoTempo.converterTempoAnos(diferenca);
            const diferencaString = `Faltam 
               ${DefinicaoTempo.formateObjToStringAnosMesesDias(diferencaOBJ)} de tempo de Contribuição anterior a EC103/2019.`;

            requisitosNaoAtendidos.push({ tipo: 'tempo', value: diferenca, valueString: diferencaString });
        }


        if (elementRegraEspecie.requisitos.idade > 0 && elementRegraEspecie.idade < elementRegraEspecie.requisitos.idade) {

            const diferenca = elementRegraEspecie.requisitos.idade - elementRegraEspecie.idade;
            const diferencaOBJ = DefinicaoTempo.converterTempoAnos(diferenca);
            const diferencaString = `Faltam ${DefinicaoTempo.formateObjToStringAnosMesesDias(diferencaOBJ)} de idade.`;

            requisitosNaoAtendidos.push({ tipo: 'idade', value: diferenca, valueString: diferencaString });
        }


        if (elementRegraEspecie.requisitos.pontos > 0 && elementRegraEspecie.pontos < elementRegraEspecie.requisitos.pontos) {

            const diferenca = elementRegraEspecie.requisitos.pontos - elementRegraEspecie.pontos;

            let inicioTexo = 'Faltam';
            let fimTexo = 'pontos';
            if (diferenca <= 1) {
                inicioTexo = 'Falta';
                fimTexo = 'ponto';
            }

            const diferencaString = `${inicioTexo} ${diferenca.toFixed(4)} ${fimTexo}. `;
            requisitosNaoAtendidos.push({ tipo: 'pontos', value: diferenca, valueString: diferencaString });
        }

        elementRegraEspecie.requisitosNaoAtendidos = requisitosNaoAtendidos;

    }

    /**
     * Interação para calcular as conclusões das possíbilidades para cada regra
     * @param  {} elementPossibilidade
     * @param  {} elementRegraEspecie
     */
    private calcularConclusaoPossibilidade(elementPossibilidade, elementRegraEspecie) {


        this.calcularFator(elementPossibilidade, elementRegraEspecie);
        this.calcularSalarioBeneficio(elementPossibilidade, elementRegraEspecie);
        this.calcularIndiceRejusteTeto(elementPossibilidade, elementRegraEspecie);
        this.calcularAliquotaBeneficio(elementPossibilidade, elementRegraEspecie);
        this.calcularRMIBeneficio(elementPossibilidade, elementRegraEspecie);
        this.gerarListaConlusoes(elementPossibilidade, elementRegraEspecie);

        return elementPossibilidade;
    }

    /**
     * Calcular o fator para cada possibilidade
     * @param  {} elementPossibilidade
     * @param  {} elementRegraEspecie
     */
    private calcularFator(elementPossibilidade, elementRegraEspecie) {

        let fatorPrevidenciario = 1;
        let fatorPrevidenciarioFormula = '';
        let valueString = '';
        let valueMelhorString = '';
        const aliquota = 0.31;
        let tempoConsiderado = elementPossibilidade.tempo;

        if (this.calculo.tipoBeneficio === 16 ||
            this.calculo.tipoBeneficio === 3 ||
            this.calculo.tipoBeneficio === 4) {
            tempoConsiderado += this.calculo.redutorSexo;
        }

        fatorPrevidenciario = ((tempoConsiderado * aliquota) / elementRegraEspecie.expectativaSobrevida.expectativa) *
            (1 + (elementRegraEspecie.idade + (tempoConsiderado * aliquota)) / 100);
        fatorPrevidenciario = parseFloat(fatorPrevidenciario.toFixed(4));

        // Adicionar nas conclusões a fórmula com os valores, não os resutlados:
        fatorPrevidenciarioFormula = '((' + DefinicaoMoeda.formatDecimal(tempoConsiderado, 4) +
            ' * ' + DefinicaoMoeda.formatDecimal(aliquota, 2) + ') / ' +
            DefinicaoMoeda.formatDecimal(elementRegraEspecie.expectativaSobrevida.expectativa, 2) + ') * (1 + (' +
            DefinicaoMoeda.formatDecimal(elementRegraEspecie.idade, 2) + ' + (' +
            DefinicaoMoeda.formatDecimal(tempoConsiderado, 4) + ' * ' +
            DefinicaoMoeda.formatDecimal(aliquota, 2) + ')) / ' + '100)';

        valueString = DefinicaoMoeda.formatDecimal(fatorPrevidenciario, 4);
        valueMelhorString = DefinicaoMoeda.formatDecimal(fatorPrevidenciario, 4);

        elementPossibilidade.fator = {
            value: fatorPrevidenciario,
            formula: fatorPrevidenciarioFormula,
            valueString: valueString,
            valueMelhorString: valueMelhorString
        };

    }



    /**
     * Calcula salario de beneficio
     * @param  {} elementPossibilidade
     * @param  {} elementRegraEspecie
     */
    private calcularSalarioBeneficio(elementPossibilidade, elementRegraEspecie) {

        let slBeneficio = elementPossibilidade.mediaDasContribuicoes.value;

        if (elementRegraEspecie.regra === 'pedagio50') {
            slBeneficio *= elementPossibilidade.fator.value;
        }

        slBeneficio = this.limitarTetosEMinimos(slBeneficio)
        elementPossibilidade.salarioBeneficio = slBeneficio;

    }


    /**
     * @param  {} elementPossibilidade
     * @param  {} elementRegraEspecie
     */
    private calcularIndiceRejusteTeto(elementPossibilidade, elementRegraEspecie) {

        let irtBeneficio = elementPossibilidade.mediaDasContribuicoes.value;

        if (elementRegraEspecie.regra === 'pedagio50') {
            irtBeneficio *= elementPossibilidade.fator.value;
        }

        irtBeneficio /= elementPossibilidade.salarioBeneficio.value;
        elementPossibilidade.irt = { value: irtBeneficio, valueString: irtBeneficio.toFixed(4) };

    }


    private calcularAliquotaBeneficio(elementPossibilidade, elementRegraEspecie) {

        const methodsPorEspecie = {
            idade: this.defineAliquotaIdade,
            idadeTransitoria: this.defineAliquotaIdadeTransitoria,
            idadeRural: this.defineAliquotaIdadeRural,
            pontos: this.defineAliquotaPontos,
            idadeProgressiva: this.defineAliquotaIdadeProgressiva,
            pedagio50: this.defineAliquotaPedagio50,
            pedagio100: this.defineAliquotaPedagio100,
            especial: this.defineAliquotaAposentadoriaEspecial,
            especialt: this.defineAliquotaAposentadoriaEspecial,
            acidente: this.defineAliquotaAuxilioAcidente,
            doenca: this.defineAliquotaAuxilioDoenca,
            deficiente: this.defineAliquotaDeficiente,
            incapacidade: this.defineAliquotaIncapacidade,
            pensaoObito: this.defineAliquotaPensaoObitoInstituidorNaoAposentado,
        };
        
        if (methodsPorEspecie[elementRegraEspecie.regra] !== undefined) {

            elementPossibilidade.aliquota = methodsPorEspecie[elementRegraEspecie.regra]
                .call(
                    this,
                    elementPossibilidade,
                    elementRegraEspecie
                );

        }

    }
    /**
     * Calcular RMI
     * @param  {} elementPossibilidade
     * @param  {} elementRegraEspecie
     */
    private calcularRMIBeneficio(elementPossibilidade, elementRegraEspecie) {

        let rmi = elementPossibilidade.salarioBeneficio.value * (elementPossibilidade.aliquota.value / 100);

        // if (elementRegraEspecie.regra === 'pedagio50') {

        //     rmi = elementPossibilidade.salarioBeneficio.value * elementPossibilidade.fator.value;
        // }

        if ((elementRegraEspecie.regra === 'deficiente' && elementPossibilidade.fator.value > 1)) {

            rmi = elementPossibilidade.salarioBeneficio.value * elementPossibilidade.fator.value;

        }

        elementPossibilidade.rmi = this.limitarTetosEMinimos(rmi, elementRegraEspecie.regra);
        elementPossibilidade.moeda = this.moedaDib;

        if (elementRegraEspecie.regra === 'doenca' && !this.calculo.media_12_ultimos) {

            elementPossibilidade.rmiConsiderado = (elementPossibilidade.rmi.value < elementPossibilidade.mediaDasContribuicoes12.value) ?
                elementPossibilidade.rmi : elementPossibilidade.mediaDasContribuicoes12;
            elementPossibilidade.rmiConsiderado = this.limitarTetosEMinimos(elementPossibilidade.rmiConsiderado.value);

        }


    }


    private setConclusao(
        order: number,
        label: string,
        valueString: string
    ) {
        return {
            order,
            label,
            valueString,
        };
    }

    private gerarListaConlusoes(elementPossibilidade, elementRegraEspecie) {

        const listC = []

        // listC.push(this.setConclusao(0, `Soma dos ${elementPossibilidade.numeroCompetencias} maiores salários de Contribuição`,
        //     elementPossibilidade.somaContribuicoes.valueString));
        listC.push(this.setConclusao(0, `Soma dos Salários de Contribuição Considerados`,
            elementPossibilidade.somaContribuicoes.valueString));

        const divisor = (this.divisorMinimo.aplicar) ?
            this.divisorMinimo.valueString : elementPossibilidade.numeroCompetencias;
        listC.push(this.setConclusao(1, `Divisor da Média dos Salários de Contribuição`, divisor));

        if (elementRegraEspecie.regra === 'pedagio50' ||
            (elementRegraEspecie.regra === 'deficiente')
        ) {

          
            listC.push(this.setConclusao(2, 'Fator Previdenciário', (elementPossibilidade.fator.valueMelhorString)));
            listC.push(this.setConclusao(3, 'Fórmula do Fator Previdenciário', elementPossibilidade.fator.formula));
        }

        listC.push(this.setConclusao(4, 'Média dos Salários de Contribuição', elementPossibilidade.mediaDasContribuicoes.valueString));
        listC.push(this.setConclusao(6, 'Teto do Salário de Contribuição', elementPossibilidade.moeda.tetoString));
        listC.push(this.setConclusao(5, 'Salário de Benefício', elementPossibilidade.salarioBeneficio.valueString));

        if (elementPossibilidade.irt.value > 1) {
            listC.push(this.setConclusao(7, 'Índice de Reajuste Teto', elementPossibilidade.irt.valueString));
        }

        listC.push(this.setConclusao(8, 'Alíquota do Benefício', elementPossibilidade.aliquota.valueString));
        listC.push(this.setConclusao(9, 'Renda Mensal Inicial', elementPossibilidade.rmi.valueString));

        if (elementRegraEspecie.regra === 'doenca' && !this.calculo.media_12_ultimos) {

            listC.push(this.setConclusao(10, 'Média dos 12 últimos Salários de contribuição',
                elementPossibilidade.mediaDasContribuicoes12.valueString));
            listC.push(this.setConclusao(11, 'Renda Mensal Inicial Considerada',
                elementPossibilidade.rmiConsiderado.valueString));

            elementPossibilidade.rmi = elementPossibilidade.rmiConsiderado;
        }

        if (elementRegraEspecie.regra === 'pensaoObito') {

            const conclusaoPensao = this.calcularPensaoObito(
                this.calculo,
                elementPossibilidade.moeda,
                1901,
                elementPossibilidade,
                elementPossibilidade.rmi.value
            );

            listC.push(...conclusaoPensao.list);

        }

        elementPossibilidade.conclusoes = listC;
    }

    /**
     * Ordenar decrescente as possibilidades e aplicar destaque a melhor
     * @param  {} elementRegraEspecie
     */
    private aplicarDestaqueMelhorValor(elementRegraEspecie) {

        if (elementRegraEspecie.calculosPossiveis.length > 1) {

            elementRegraEspecie.calculosPossiveis.sort((entry1, entry2) => {
                if ((entry1.rmi.value < entry2.rmi.value) && (entry1.mediaDasContribuicoes.value < entry2.mediaDasContribuicoes.value)) {
                    return 1;
                }
                if ((entry1.rmi.value > entry2.rmi.value) && (entry1.mediaDasContribuicoes.value > entry2.mediaDasContribuicoes.value)) {
                    return -1;
                }
                return 0;
            });

            elementRegraEspecie.calculosPossiveis[0].destaqueMelhorValorRMI = true;

            // ordenar pelo numero de contribuicoes
            elementRegraEspecie.calculosPossiveis.sort((entry1, entry2) => {
                if (entry1.descarteContrib < entry2.descarteContrib) {
                    return 1;
                }
                if (entry1.descarteContrib > entry2.descarteContrib) {
                    return -1;
                }
                return 0;
            });

        } else {

            elementRegraEspecie.calculosPossiveis[0].destaqueMelhorValorRMI = true;

        }

    }


    private setAliquota(
        value: number,
        valueString: string,
        formula: string
    ) {
        return {
            value,
            valueString,
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
        let valueString = aliquota + '%'

        if (Math.floor(elementPossibilidade.tempo) > tempoParaPercentual[this.segurado.sexo]) {
            aliquota = aliquota + ((Math.floor(elementPossibilidade.tempo) - tempoParaPercentual[this.segurado.sexo]) * 2);
            formula = `60 + ((${Math.floor(elementPossibilidade.tempo)} - ${tempoParaPercentual[this.segurado.sexo]}) X 2)`;
            valueString = aliquota + '%'
        }

        return this.setAliquota(
            aliquota,
            valueString,
            formula,
        );
    }

    private defineAliquotaIdadeRural(elementPossibilidade) {

        const tempoParaPercentual = {
            m: 20,
            f: 15
        };

        let aliquota = 70;
        let formula = '70'
        let valueString = aliquota + '%'

            aliquota = aliquota + ((Math.floor(elementPossibilidade.tempo)));
            formula = `70 + ((${Math.floor(elementPossibilidade.tempo)}))`;
            valueString = aliquota + '%'

        return this.setAliquota(
            aliquota,
            valueString,
            formula,
        );
    }

    private defineAliquotaIdadeTransitoria(elementPossibilidade) {

        if (this.calculo.tipoBeneficio !== undefined
            && this.calculo.tipoBeneficio === 16) {
            // Rural 16
            return this.defineAliquotaIdadeRural(elementPossibilidade);
        }

        return this.defineAliquotaIdade(elementPossibilidade);
    }

    private defineAliquotaPontos(elementPossibilidade) {

        return this.defineAliquotaIdade(elementPossibilidade);
    }

    private defineAliquotaIdadeProgressiva(elementPossibilidade) {

        return this.defineAliquotaIdade(elementPossibilidade);
    }

    private defineAliquotaPedagio50(elementPossibilidade, elementRegraEspecie) {

        const aliquota = 100;
        const formula = '100% média salarial aplicando o Fator previdenciario';
        const valueString = aliquota + '%'

        return this.setAliquota(
            aliquota,
            valueString,
            formula
        );
    }

    private defineAliquotaPedagio100(elementPossibilidade, elementRegraEspecie) {

        const aliquota = 100;
        const formula = '100% média salarial aplicando o Fator previdenciario';
        const valueString = aliquota + '%';

        return this.setAliquota(
            aliquota,
            valueString,
            formula
        );
    }



    private defineAliquotaAposentadoriaEspecial(elementPossibilidade, elementRegraEspecie) {

        let tempoParaPercentual = (elementRegraEspecie.requisitos.tempo === 15) ? 15 : 20;

        if (this.segurado.sexo === 'f') {
            tempoParaPercentual = 15;
        }

        let aliquota = 60;
        let formula = '60';
        let valueString = aliquota + '%';

        if (Math.floor(elementPossibilidade.tempo) > tempoParaPercentual) {
            aliquota = aliquota + ((Math.floor(elementPossibilidade.tempo) - tempoParaPercentual) * 2);
            formula = `60 + ((${Math.floor(elementPossibilidade.tempo)} - ${tempoParaPercentual}) * 2)`;
            valueString = aliquota + '%';
        }

        return this.setAliquota(
            aliquota,
            valueString,
            formula,
        );
    }


    /**
     * Aliquota de deficiente
     * @param  {} elementPossibilidade
     * @param  {} elementRegraEspecie
     */
    private defineAliquotaDeficiente(elementPossibilidade, elementRegraEspecie) {

        let aliquota = 70;
        let formula = '70';
        let valueString = aliquota + '%';

        // Se diferente de PCD Idade
        if (this.calculo.tipoBeneficio != 28) {

            aliquota = 100;
            formula = '100% média salarial';
            valueString = aliquota + '%';

            return this.setAliquota(
                aliquota,
                valueString,
                formula,
            );
        }

        aliquota = aliquota + ((Math.floor(elementPossibilidade.tempo)) * 1);
        aliquota = (aliquota > 100) ? 100 : aliquota;
        formula = `70 + (${Math.floor(elementPossibilidade.tempo)} X 1)`;
        valueString = aliquota + '%';

        return this.setAliquota(
            aliquota,
            valueString,
            formula,
        );
    }

    private defineAliquotaAuxilioAcidente(elementPossibilidade, elementRegraEspecie) {

        const aliquota = 50;
        const formula = '50%';
        const valueString = aliquota + '%'

        return this.setAliquota(
            aliquota,
            valueString,
            formula
        );

    }

    private defineAliquotaAuxilioDoenca(elementPossibilidade, elementRegraEspecie) {

        const aliquota = 91;
        const formula = '91%';
        const valueString = aliquota + '%'

        return this.setAliquota(
            aliquota,
            valueString,
            formula
        );

    }

    private defineAliquotaIncapacidade(elementPossibilidade, elementRegraEspecie) {

        if (!this.calculo.obito_decorrencia_trabalho) {

            return this.defineAliquotaIdade(elementPossibilidade);

        } else {

            const aliquota = 100;
            const formula = '100%';
            const valueString = aliquota + '%'

            return this.setAliquota(
                aliquota,
                valueString,
                formula
            );

        }

    }

    private defineAliquotaPensaoObitoInstituidorNaoAposentado(elementPossibilidade, elementRegraEspecie) {

        if (!this.calculo.obito_decorrencia_trabalho) {

            const tempoParaPercentual = {
                m: 20,
                f: 15
            };

            let aliquota = 60;
            let formula = '60'
            let valueString = aliquota + '%'

            if (Math.floor(elementPossibilidade.tempo) > tempoParaPercentual[this.calculo.sexo_instituidor]) {
                aliquota = aliquota + ((Math.floor(elementPossibilidade.tempo) - tempoParaPercentual[this.calculo.sexo_instituidor]) * 2);
                formula = `60 + ((${Math.floor(elementPossibilidade.tempo)} - ${tempoParaPercentual[this.calculo.sexo_instituidor]}) X 2)`;
                valueString = aliquota + '%'
            }

            return this.setAliquota(
                aliquota,
                valueString,
                formula,
            );

        } else {

            const aliquota = 100;
            const formula = '100%';
            const valueString = aliquota + '%'

            return this.setAliquota(
                aliquota,
                valueString,
                formula
            );

        }

    }


    // define aliquotas por espepecie - fim

    /**
     * calcular pensão por óbito de Instituidor Aposentado
     * @param  {} calculo
     * @param  {} moeda
     * @param  {} tipoBeneficio
     * @param  {} valorSalarioBeneficio = 0 default 0 para aposentadoria com intituidor aposentado
     */
    public calcularPensaoObito(calculo, moeda, tipoBeneficio, elementPossibilidade, ultimoBeneficioRMI = 0) {

        const salarioBeneficio = { value: 0, valueString: '', aviso: '' };
        const aliquotaDependentes = { value: 0, valueString: '', formula: '' };
        let rmi = { value: 0, valueString: '' };
        this.calculo = calculo;
        this.moedaDib = moeda;

        const tempoPercentual = {
            m: 20,
            f: 15
        };

        aliquotaDependentes.value = (calculo.num_dependentes * 10);
        aliquotaDependentes.value += 50;
        aliquotaDependentes.value = (aliquotaDependentes.value > 100) ? 100 : aliquotaDependentes.value;
        aliquotaDependentes.valueString = aliquotaDependentes.value + '%';
        aliquotaDependentes.formula = `50% + (${calculo.num_dependentes} * 10%)`;

        if (calculo.depedente_invalido === 1) {

            aliquotaDependentes.value = 100;
            aliquotaDependentes.valueString = '100%';
            aliquotaDependentes.formula
                = `100% (Possui dependente inválido ou com deficiência intelectual, mental ou grave)`;

        }

        const salarioBeneficioAtual = (tipoBeneficio === 1901) ? ultimoBeneficioRMI : parseFloat(calculo.ultimo_beneficio);
        salarioBeneficio.value = (this.limitarTetosEMinimos(salarioBeneficioAtual)).value;
        salarioBeneficio.valueString = DefinicaoMoeda.formatMoney(salarioBeneficio.value, moeda.acronimo);

        rmi = this.limitarTetosEMinimos(salarioBeneficio.value * (aliquotaDependentes.value / 100));



        if (tipoBeneficio === 1900) {
            return this.gerarConlusoesPensaoObitoInstituidorAposentado(moeda,
                salarioBeneficio,
                aliquotaDependentes,
                rmi);
        } else {
            elementPossibilidade.rmi = rmi;
            return this.gerarConlusoesPensaoObitoInstituidorNaoAposentado(moeda,
                salarioBeneficio,
                aliquotaDependentes,
                rmi);
        }

    }

    /**
     * @param  {} moeda
     * @param  {} salarioBeneficio
     * @param  {} aliquotaDependentes
     * @param  {} rmi
     */
    private gerarConlusoesPensaoObitoInstituidorAposentado(moeda,
        salarioBeneficio,
        aliquotaDependentes,
        rmi) {

        const listC = []

        listC.push(this.setConclusao(1, 'Salário de Benefício', salarioBeneficio.valueString));
        listC.push(this.setConclusao(2, 'Número de Dependentes', (this.calculo.num_dependentes)));
        listC.push(this.setConclusao(3, 'Possui dependente inválido ou com deficiência intelectual, mental ou grave',
            (this.calculo.depedente_invalido) ? 'SIM' : 'Não'));
        listC.push(this.setConclusao(4, 'Alíquota do Benefício', aliquotaDependentes.valueString));
        listC.push(this.setConclusao(19000, 'Renda Mensal Inicial', rmi.valueString));

        return { list: listC, label: 'Pensão por Morte - Instituidor Aposentado na Data do Óbito' };
    }

    /**
     * @param  {} moeda
     * @param  {} salarioBeneficio
     * @param  {} aliquotaDependentes
     * @param  {} rmi
     * @param  {} elementPossibilidade
     */
    private gerarConlusoesPensaoObitoInstituidorNaoAposentado(
        moeda,
        salarioBeneficio,
        aliquotaDependentes,
        rmi) {

        const listC = []

        // listC.push(this.setConclusao(91, 'Salário de Benefício', salarioBeneficio.valueString));
        listC.push(this.setConclusao(91, 'Sexo do instituidor do benefício',
            ((this.calculo.sexo_instituidor === 'm') ? 'Masculino  ' : 'Feminino')));
        listC.push(this.setConclusao(2, 'Número de Dependentes', (this.calculo.num_dependentes)));
        listC.push(this.setConclusao(3, 'Possui dependente inválido ou com deficiência intelectual, mental ou grave',
            (this.calculo.depedente_invalido) ? 'SIM' : 'Não'));
        listC.push(this.setConclusao(92, 'Alíquota do Benefício (Pensão por Morte)', aliquotaDependentes.valueString));
        listC.push(this.setConclusao(19000, 'Renda Mensal Inicial (Pensão por Morte)', rmi.valueString));

        return { list: listC, label: 'Pensão por Morte - Instituidor não Aposentado na Data do Óbito' };
    }

    /**
       * Ajustar ao teto e minimo
       * @param  {} value
       */
    private limitarTetosEMinimos(value, elementRegraEspecie = '') {

        // se a data estiver no futuro deve ser utilizado os dados no mês atual
        const moeda = this.moedaDib;
        const salarioMinimo = (moeda) ? parseFloat(moeda.salario_minimo) : 0;
        const tetoSalarial = (moeda) ? parseFloat(moeda.teto) : 0;
        let avisoString = '';
        let valueRetorno = parseFloat(value);

        if (moeda && value < salarioMinimo && elementRegraEspecie !== 'acidente') {
            valueRetorno = salarioMinimo;
            avisoString = 'LIMITADO AO MÍNIMO'
        } else if (moeda && value > tetoSalarial) {
            valueRetorno = tetoSalarial;
            avisoString = 'LIMITADO AO TETO'
        }

        return {
            value: (Math.round(valueRetorno * 100) / 100),
            valueString: DefinicaoMoeda.formatMoney(valueRetorno),
            aviso: avisoString
        };
    }


}
