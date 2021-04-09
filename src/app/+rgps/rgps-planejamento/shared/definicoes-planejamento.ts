import * as moment from 'moment';


export class DefinicoesPlanejamento {

  static aliquotasList = [
    { value: 5, label: 'Contribuinte Individual - 5% - MEI' },
    { value: 51, label: 'Contribuinte Facultativo- 5% - Dona(s) de Casa - Baixa Renda' },
    { value: 8, label: 'Trabalhador Rural a Serviço de Produtor Rural PF - 8%' },
    { value: 11, label: 'Contribuinte Individual - Prestador de Serviço para PJ - 11% ' },
    { value: 113, label: 'Contribuinte Individual - Prestador de Serviço para PJ e Equiparados - 11%' },
    { value: 112, label: 'Contribuinte Individual - Autônomo - 11% - Regime Simplicado' },
    { value: 20, label: 'Contribuinte Individual- Autônomo - 20%' },
    { value: 201, label: 'Contribuinte Facultativo - 20%' },
    { value: 99, label: 'Contribuinte Empregado, Avulso e Doméstico - Progressiva e Cumulativa - 7,5% a 14%' },
  ];

  static especiesPlanejamento = [
    { value: 'Aposentadoria Especial - 15 anos' },
    { value: 'Aposentadoria Especial - 20 anos' },
    { value: 'Aposentadoria Especial - 25 anos' },
    { value: 'Aposentadoria por Idade da PcD' },
    { value: 'Aposentadoria por Idade - Trabalhador Rural' },
    { value: 'Aposentadoria por Idade - Trabalhador Urbano' },
    { value: 'Aposentadoria por Tempo de Contribuição' },
    { value: 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Grave)' },
    { value: 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Moderada)' },
    { value: 'Aposentadoria por Tempo de Contribuição da PcD (Deficiência Leve)' },
    { value: 'Aposentadoria por Tempo de Contribuição do(a) Professor(a)' },
    { value: 'Aposentadoria Programada' },
    { value: 'Aposentadoria Programada - Professor' },
  ]



  static getAliquota(value: Number) {

    return this.aliquotasList.find(aliquota => aliquota.value === value);

  }



}
