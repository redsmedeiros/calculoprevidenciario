export class ListaVideos {

  public static listVideos = [{
    label: 'MIGRANDO OS DADOS DO CNIS PARA CONTAGEM DE TEMPO DE CONTRIBUIÇÃO ',
    // value: '453291034'
    value: '0wwPYtCh4lM'
  }, {
    label: 'MIGRANDO OS SALÁRIOS DE CONTRIBUIÇÃO DO CNIS',
    value: 'tLHpO9tjuvQ'
    // value: '454141361'
  }, {
    label: 'RMI DA APOSENTADORIA POR IDADE',
    // value: '453291169'
    value: 'r76CE45av2Q'
  }, {
    label: 'RMI DA APOSENTADORIA POR TEMPO DE CONTRIBUIÇÃO',
    // value: '453291229'
    value: '9e6XRlvbZ0g'
  }, {
    label: 'RMI DO AUXÍLIO POR INCAPACIDADE TEMPORÁRIA ',
    value: 'vg-xS8r3D08'
    // value: '453291500'
  }, {
    label: 'RMI DO APOSENTADORIA POR INCAPACIDADE PERMANENTE ',
    // value: '453291654'
    value: 'mPt8VhbFhNU'
  }, {
    label: 'RMI DO AUXÍLIO ACIDENTE',
    // value: '453291748'
    value: '6icZhmC9IDo'
  }, {
    label: 'RMI DA PENSÃO POR MORTE',
    // value: '453291755'
    value: 'y8H0tll1EuQ'
  }, {
    label: 'RMI DA APOSENTADORIA DA PcD',
    // value: '453291879'
    value: '-Ge9o59vWMI'
  }, {
    label: 'Revisão da Vida Toda - Dr. Sergio Geromes',
    // value: '413680168'
    value: 'jbUWfP6WYTo'
  },

  // {
  //   label: 'Liquidação de Sentença',
  //   value: '447520641'
  // }, {
  //   label: 'Regras de Transição',
  //   value: '377178520'
  // }, 

  {
    label: 'Planejamento Previdenciário - Plataforma IEPREV Premium',
    value: 'ENJaER2VoJQ'
  },
  ];

  static getVideoId(value: string) {

    return this.listVideos.find(video => video.value === value);

  }



}
