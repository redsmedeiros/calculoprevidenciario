import * as moment from 'moment';


export class DefinicoesBeneficiosAtrasados {


    public static tiposAposentadoria = [
        { name: '', value: '' },
        { name: 'Abono de Permanência em Serviço', value: 11 },
        { name: 'Aposentadoria Especial', value: 4 },
        { name: 'Aposentadoria por Incapacidade Permanente', value: 19 },
        { name: 'Aposentadoria por Idade - Trabalhador Rural', value: 7 },
        { name: 'Aposentadoria por Idade - Trabalhador Urbano', value: 2 },
        { name: 'Aposentadoria por Idade da Pessoa com Deficiência', value: 16 },
        { name: 'Aposentadoria por Invalidez ', value: 1 },
        { name: 'Aposentadoria por Tempo de Contribuição', value: 3 },
        { name: 'Aposentadoria por Tempo de Contribuição Professor', value: 5 },
        { name: 'Aposentadoria por Tempo de Contribuição da Pessoa com Deficiência', value: 13 },
        { name: 'Aposentadoria por Tempo de Serviço', value: 18 },
        { name: 'Auxílio Acidente - 30%', value: 8 },
        { name: 'Auxílio Acidente - 40%', value: 9 },
        { name: 'Auxílio Acidente - 50%', value: 6 },
        { name: 'Auxílio Acidente - 60%', value: 10 },
        { name: 'Auxílio Doença', value: 0 },
        { name: 'Auxílio por Incapacidade Temporária', value: 20 },
        { name: 'Benefício de Prestação Continuada - BPC ', value: 12 },
        { name: 'Auxílio Reclusão', value: 23 },
        { name: 'Pensão por Morte', value: 22 }
    ];



    public static getTipoAposentadoria(value) {

        value = parseInt(value, 10);
        return (this.tiposAposentadoria.filter(item => value === item.value))[0].name;

    }


    public static setJurosAnualParaMensal(tipoDejurosSelecionado) {

        const jurosObj = {
            jurosAntes2003: null,
            jurosDepois2003: null,
            jurosDepois2009: null,
            chkBoxTaxaSelic: false
        }

        switch (tipoDejurosSelecionado) {
            case '12_6':
                // 12% ao ano (até 06/2009) / 6% ao ano (Poupança)
                jurosObj.jurosAntes2003 = 1.00;
                jurosObj.jurosDepois2003 = 1.00;
                jurosObj.jurosDepois2009 = 0.50;
                jurosObj.chkBoxTaxaSelic = true;
                break;
            case '6_selic':
                // 6% ao ano (observando a SELIC - Poupança)
                jurosObj.jurosAntes2003 = 0.50;
                jurosObj.jurosDepois2003 = 0.50;
                jurosObj.jurosDepois2009 = 0.50;
                jurosObj.chkBoxTaxaSelic = true;
                break;
            case '12_ano':
                // 12% ao ano
                jurosObj.jurosAntes2003 = 1.00;
                jurosObj.jurosDepois2003 = 1.00;
                jurosObj.jurosDepois2009 = 1.00;
                jurosObj.chkBoxTaxaSelic = false;
                break;
            case '6_12':
                // 6% ao ano (até 01/2003) / 12% ao ano
                jurosObj.jurosAntes2003 = 0.50;
                jurosObj.jurosDepois2003 = 1.00;
                jurosObj.jurosDepois2009 = 1.00;
                jurosObj.chkBoxTaxaSelic = false;
                break;
            case '6_12_6':
                // 6% ao ano (até 01/2003) / 12% ao ano (até 06/2009) / 6% ao ano
                jurosObj.jurosAntes2003 = 0.50;
                jurosObj.jurosDepois2003 = 1.00;
                jurosObj.jurosDepois2009 = 0.50;
                jurosObj.chkBoxTaxaSelic = false;
                break;
            case '6_fixo':
                // 6% ao ano (fixo)
                jurosObj.jurosAntes2003 = 0.50;
                jurosObj.jurosDepois2003 = 0.50;
                jurosObj.jurosDepois2009 = 0.50;
                jurosObj.chkBoxTaxaSelic = false;
                break;
            case 'manual':
                // (manual)
                jurosObj.jurosAntes2003 = null;
                jurosObj.jurosDepois2003 = null;
                jurosObj.jurosDepois2009 = null;
                break;
            case 'sem_juros':
                // sem juros
                jurosObj.jurosAntes2003 = 0;
                jurosObj.jurosDepois2003 = 0;
                jurosObj.jurosDepois2009 = 0;
                jurosObj.chkBoxTaxaSelic = false;
                break;
        }

    }


}
