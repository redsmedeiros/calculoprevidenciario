
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

            const diferenca = Math.floor(elementRegraEspecie.requisitos.pontos - elementRegraEspecie.pontos);
            const diferencaString = `Faltam ${diferenca} pontos.`;

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


        this.calcularSalarioBeneficio(elementPossibilidade, elementRegraEspecie);
        this.calcularIndiceRejusteTeto(elementPossibilidade, elementRegraEspecie);
        this.calcularAliquotaBeneficio(elementPossibilidade, elementRegraEspecie);
        this.calcularRMIBeneficio(elementPossibilidade, elementRegraEspecie);
        this.gerarListaConlusoes(elementPossibilidade, elementRegraEspecie);

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
            slBeneficio *= elementRegraEspecie.fatorPrevidenciario.value;
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
            irtBeneficio *= elementRegraEspecie.fatorPrevidenciario.value;
        }

        irtBeneficio /= elementPossibilidade.salarioBeneficio.value;
        elementPossibilidade.irt = { value: irtBeneficio, valueString: irtBeneficio.toFixed(4) };

    }


    private calcularAliquotaBeneficio(elementPossibilidade, elementRegraEspecie) {

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

        if (elementRegraEspecie.regra === 'pedagio50') {
            rmi = elementPossibilidade.salarioBeneficio.value * elementRegraEspecie.fatorPrevidenciario.value;
        }

        elementPossibilidade.rmi = this.limitarTetosEMinimos(rmi);
        elementPossibilidade.moeda = this.moedaDib;
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

        listC.push(this.setConclusao(0, `Soma dos ${elementPossibilidade.numeroCompetencias} maiores salários de Contribuição`,
            elementPossibilidade.somaContribuicoes.valueString));

        listC.push(this.setConclusao(1, `Divisor da Média`, elementPossibilidade.numeroCompetencias));

        if (elementRegraEspecie.regra === 'pedagio50') {

            listC.push(this.setConclusao(2, 'Fator Previdenciário', elementRegraEspecie.fatorPrevidenciario.value));
            listC.push(this.setConclusao(3, 'Fórmula Fator Previdenciário', elementRegraEspecie.fatorPrevidenciario.formula));

        }

        listC.push(this.setConclusao(4, 'Média dos Salários de Contribuição', elementPossibilidade.mediaDasContribuicoes.valueString));
        listC.push(this.setConclusao(5, 'Teto do Salário de Contribuição', elementPossibilidade.moeda.tetoString));
        listC.push(this.setConclusao(6, 'Salário de Benefício', elementPossibilidade.salarioBeneficio.valueString));

        if (elementPossibilidade.irt > 1) {
            listC.push(this.setConclusao(7, 'Índice de Reajuste Teto', elementPossibilidade.irt.valueString));
        }

        listC.push(this.setConclusao(8, 'Alíquota do Benefício', elementPossibilidade.aliquota.valueString));
        listC.push(this.setConclusao(9, 'Renda Mensal Inicial', elementPossibilidade.rmi.valueString));

        if (elementRegraEspecie.regra === 'pensaoObito') {

            const conclusaoPensao = this.calcularPensaoObito(this.calculo,
                elementPossibilidade.moeda,
                1901,
                elementPossibilidade.rmi.value);
            listC.push(...conclusaoPensao.list);

        }

        elementPossibilidade.conclusoes = listC;
    }

    /**
     * Ordenar decrescente as possibilidades e aplicar destaque a melhor
     * @param  {} elementRegraEspecie
     */
    private aplicarDestaqueMelhorValor(elementRegraEspecie) {

        elementRegraEspecie.calculosPossiveis.sort((entry1, entry2) => {
            if (entry1.rmi.value < entry2.rmi.value) {
                return 1;
            }
            if (entry1.rmi.value > entry2.rmi.value) {
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
        const valueString = aliquota + '%'

        return this.setAliquota(
            aliquota,
            valueString,
            formula
        );
    }



    private defineAliquotaAposentadoriaEspecial(elementPossibilidade, elementRegraEspecie) {

        const tempoParaPercentual = (elementRegraEspecie.requisitos.tempo === 15) ? 15 : 20;

        let aliquota = 60;
        let formula = '60'
        let valueString = aliquota + '%'

        if (Math.floor(elementPossibilidade.tempo) > tempoParaPercentual) {
            aliquota = aliquota + ((Math.floor(elementPossibilidade.tempo) - tempoParaPercentual) * 2);
            formula = `60 + ((${Math.floor(elementPossibilidade.tempo)} - ${tempoParaPercentual}) * 2)`;
            valueString = aliquota + '%'
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
        let formula = '70'
        let valueString = aliquota + '%'


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


    // define aliquotas por espepecie - fim

    /**
     * calcular pensão por óbito de Instituidor Aposentado
     * @param  {} calculo
     * @param  {} moeda
     * @param  {} tipoBeneficio
     * @param  {} valorSalarioBeneficio = 0 default 0 para aposentadoria com intituidor aposentado
     */
    public calcularPensaoObito(calculo, moeda, tipoBeneficio, ultimoBeneficioRMI = 0) {

        const salarioBeneficio = { value: 0, valueString: '' };
        const aliquotaDependentes = { value: 0, valueString: '', formula: '' };
        let rmi = { value: 0, valueString: '' };

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
                = `100% (Possuí dependente inválido ou com deficiência intelectual, mental ou grave)`;

        }

        salarioBeneficio.value = (tipoBeneficio === 1901) ? ultimoBeneficioRMI : parseFloat(calculo.ultimo_beneficio);
        salarioBeneficio.valueString = DefinicaoMoeda.formatMoney(salarioBeneficio.value, moeda.acronimo);

        rmi = this.limitarTetosEMinimos(salarioBeneficio.value * (aliquotaDependentes.value / 100));

        if (tipoBeneficio === 1900) {
            return this.gerarConlusoesPensaoObitoInstituidorAposentado(moeda,
                salarioBeneficio,
                aliquotaDependentes,
                rmi);
        }

        return this.gerarConlusoesPensaoObitoInstituidorNaoAposentado(moeda,
            salarioBeneficio,
            aliquotaDependentes,
            rmi);
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
        listC.push(this.setConclusao(2, 'Alíquota do Benefício', aliquotaDependentes.valueString));
        listC.push(this.setConclusao(3, 'Renda Mensal Inicial', rmi.valueString));

        return { list: listC, label: 'Pensão por Morte instituidor aposentado na data óbito' };
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
        listC.push(this.setConclusao(92, 'Alíquota do Benefício (Pensão por Morte)', aliquotaDependentes.valueString));
        listC.push(this.setConclusao(93, 'Renda Mensal Inicial (Pensão por Morte)', rmi.valueString));

        return { list: listC, label: 'Pensão por Morte instituidor não é aposentado na data óbito' };
    }

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
            valueString: DefinicaoMoeda.formatMoney(valueRetorno),
            aviso: avisoString
        };
    }



}
