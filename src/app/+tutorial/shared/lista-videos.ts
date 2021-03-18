export class ListaVideos {

 public static listVideos = [{
    label: 'MIGRANDO OS DADOS DO CNIS PARA CONTAGEM DE TEMPO DE CONTRIBUIÇÃO ',
    value: '453291034'
  }, {
    label: 'MIGRANDO OS SALÁRIOS DE CONTRIBUIÇÃO DO CNIS',
    value: '454141361'
  }, {
    label: 'RMI DA APOSENTADORIA POR IDADE',
    value: '453291169'
  }, {
    label: 'RMI DA APOSENTADORIA POR TEMPO DE CONTRIBUIÇÃO',
    value: '453291229'
  }, {
    label: 'RMI DO AUXÍLIO POR INCAPACIDADE TEMPORÁRIA ',
    value: '453291500'
  }, {
    label: 'RMI DO APOSENTADORIA POR INCAPACIDADE PERMANENTE ',
    value: '453291654'
  }, {
    label: 'RMI DO AUXÍLIO ACIDENTE',
    value: '453291748'
  }, {
    label: 'RMI DA PENSÃO POR MORTE',
    value: '453291755'
  }, {
    label: 'RMI DA APOSENTADORIA DA PcD',
    value: '453291879'
  }, {
    label: 'Revisão da Vida Toda - Dr. Sergio Geromes',
    value: '413680168'
  }, {
    label: 'Liquidação de Sentença',
    value: '447520641'
  }, {
    label: 'Regras de Transição',
    value: '377178520'
  }, {
    label: 'Contagem de Tempo e Importação dados do CNIS',
    value: '374977453'
  }, {
    label: 'Exportação dos dados da Contagem de Tempo para o calculo de RMI',
    value: '374976235'
  }, {
    label: 'Pensão por Morte de Instituidor não Aposentado na Data do Óbito',
    value: '374976988'
  }, {
    label: 'Pensão por Morte de Segurado Aposentado na Data do Óbito',
    value: '374977398'
  }, {
    label: 'Planejamento Previdenciário - Plataforma IEPREV Premium',
    value: '499277891'
  },
  ];

  static getVideoId(value: string) {

    return this.listVideos.find(video => video.value === value);

  }



}
