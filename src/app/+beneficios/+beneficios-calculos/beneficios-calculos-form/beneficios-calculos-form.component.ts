import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from '../../../shared/animations/fade-in-top.decorator';
import { ErrorService } from '../../../services/error.service';
import { CalculoAtrasado } from '../CalculoAtrasado.model';
import { CalculoAtrasadoService } from '../CalculoAtrasado.service';
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-beneficios-calculos-form',
  templateUrl: './beneficios-calculos-form.component.html',
  styleUrls: ['./beneficios-calculos-form.component.css'],
  providers: [
    ErrorService
  ]
})
export class BeneficiosCalculosFormComponent implements OnInit {

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public dateMaskCompetencia = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public NumProcessoMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
                            '-', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/,
                            '.', /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];

  public IndiceMask =  [ /\d/, ',', /\d/, /\d/, /\d/, /\d/];
  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];
  public isEdit = false;

  public chkNotGranted = false;
  public chkUseSameDib = false;
  public chkJurosMora = true;
  public chkDibAnterior = false;
  public chkAjusteMaximo = false;
  public chkDemandasJudiciais = false;
  public chkPrecedidoRecebidos = false;
  public chkNaoUsarDeflacao = false;
  public chkIndice = false;
  public chkBoxTaxaSelic = true;

  public recebidosBuracoNegro = false;
  public recebidosPosBuracoNegro = false;

  public devidosBuracoNegro = false;
  public devidosPosBuracoNegro = false;

  public dibValoresRecebidos;
  public dibValoresDevidos;
  public dibAnteriorValoresDevidos;
  public dibAnteriorValoresRecebidos;

  public dataCalculo;
  public dataAcaoJudicial;
  public dataCitacaoReu;

  public rmiValoresRecebidos;
  public rmiValoresRecebidosBuracoNegro;
  public rmiValoresDevidos;
  public rmiValoresDevidosBuracoNegro;

  public percentualHonorarios;

  public cessacaoValoresRecebidos;
  public cessacaoValoresDevidos;

  public taxaAjusteMaximaEsperada;
  public taxaAjusteMaximaConcedida;

  public dataHonorariosDe;
  public dataHonorariosAte;
  public maturidade = 0;
  public jurosAntes2003;
  public jurosDepois2003;
  public jurosDepois2009;

  public taxaAdvogadoAplicacaoSobre = '';
  public dataHonorariosSucumbenciaDe;
  public dataHonorariosSucumbenciaAte;

  // Se taxaAdvogadoAplicacaoSobre tem valor 'fixo'
  public taxaAdvogadoValorFixoHonorarios;

  // CPC Art85
  public taxaAdvogadoAplicarCPCArt85 = ''; // false devido | true dif entre devido e recebido
  public taxaAdvogadoPercateAte200SM = 0;
  public taxaAdvogadoPerc200A2000SM = 0;
  public taxaAdvogadoPerc2000A20000SM = 0;
  public taxaAdvogadoPerc20000A100000SM = 0;
  public taxaAdvogadoPerc100000SM = 0;

  // tipo de juros
  public naoAplicarJurosSobreNegativo = false;
  public tipoDejurosSelecionado = '';
  public competenciaInicioJuros;

  // valor inferior ao salario minimo
  public naoAplicarSMBeneficioConcedido = false;
  public naoAplicarSMBeneficioEsperado = false;

  //Num Processo
  public numeroProcesso = '';
  public afastarPrescricao = false;
  public calcularAbono13UltimoMes = false;

  public especieValoresDevidos;
  public especieValoresRecebidos;

  public acordoJudicial;

  public segurado: any = {};

  public inicioBuracoNegro = moment('1988-10-05');
  public finalBuracoNegro = moment('1991-04-04');
  public dataMinima = moment('1970-01-01');

  private tipoCorrecaoMonetaria = '';
  private indiceCorrecao = 0;
  public correcaoOptions = [
    {
      text: '- Selecione uma opção -',
      value: ''
    },
    {
      text: 'Tabela da IPCAe a partir de 07/2009',
      value: 'ipca'
    },
    {
      text: 'Tabela da IPCA-e todo período',
      value: 'ipca_todo_periodo'
    },
    {
      text: 'Tabela do manual de cálculos da Justiça Federal',
      value: 'cam'
    },
    {
      text: 'Tabela da TR após 07/2009',
      value: 'tr'
    },
    {
      text: 'Tabela da TR todo período',
      value: 'tr_todo_periodo'
    },
    {
      text: 'Tabela da TR até 03/2015 e IPCA-e',
      value: 'tr032015_ipcae'
    },
    {
      text: 'Tabela administrativa Art.175, Decreto No 3.048/99 a partir de 07/1994',
      value: 'cam_art_175_3048'
    },
    {
      text: 'IGPDI até 01/2004 e INPC até 06/2009 e TR até 03/2015 e INPC',
      value: 'igpdi_012004_inpc062009_tr032015_inpc'
    },
    {
      text: 'IGPDI até 2006 e INPC até 06/2009 e TR até 03/2015 e IPCA-e',
      value: 'igpdi_2006_inpc062009_tr032015_ipcae'
    },
    {
      text: 'IGPDI até 01/2004 e INPC até 06/2009 e TR até 09/2017 e INPC',
      value: 'igpdi_012004_inpc062009_tr092017_inpc'
    },
    {
      text: 'IGPDI até 01/2004 e INPC até 06/2009 e TR até 09/2017 e IPCA-e',
      value: 'igpdi_012004_inpc062009_tr092017_ipcae'
    },
  ];

  public especieValoresOptions = [
    {
      name: '- Selecione uma opção -',
      value: ''
    }, {
      name: 'Auxílio Doença',
      value: 0
    }, {
      name: 'Aposentadoria por Invalidez ',
      value: 1
    }, {
      name: 'Pensão por Morte',
      value: 1
    }, {
      name: 'Aposentadoria por Idade - Trabalhador Urbano',
      value: 2
    }, {
      name: 'Aposentadoria por Idade - Trabalhador Rural',
      value: 7
    }, {
      name: 'Aposentadoria por Tempo de Contribuição',
      value: 3
    }, {
      name: 'Aposentadoria Especial',
      value: 4
    },{
      name: 'Aposentadoria por Tempo de Contribuição Professor',
      value: 5 
    
    // {
    //   name: 'Aposentadoria por Tempo de Serviço de professor',
    //   value: 5
    // }, {
    //   name: 'Auxílio Acidente previdenciário - 50%',
    //   value: 6
    }, {
      name: 'Auxílio Acidente - 30%',
      value: 8
    }, {
      name: 'Auxílio Acidente - 40%',
      value: 9
    }, {
      name: 'Auxílio Acidente - 50%',
      value: 6
    }, {
      name: 'Auxílio Acidente - 60%',
      value: 10
    }, {
      name: 'Abono de Permanência em Serviço',
      value: 11
    }, {
      name: 'Benefício de Prestação Continuada - BPC ', // (salário mínimo)
      value: 12
    }, {
      name: 'Aposentadoria Pessoa com Deficiência',
      value: 13
    }, {
    //   name: 'Aposentadoria especial da Pessoa com Deficiência Grave',
    //   value: 13
    // }, {
    //   name: 'Aposentadoria especial da Pessoa com Deficiência Moderada',
    //   value: 14
    // }, {
    //   name: 'Aposentadoria especial da Pessoa com Deficiência Leve',
    //   value: 15
    // }, {
      name: 'Aposentadoria por Idade da Pessoa com Deficiência',
      value: 16
    }
    // , {
    //   name: 'Benfeficio de prestação continuada - BPC',
    //   value: 17
    // }
  ];

  public tipoHonorariosOptions = [
    {
      text: '- Selecione uma opção -',
      value: ''
    },
    {
      text: 'Não calcular honorários',
      value: 'nao_calc'
    },
    {
      text: 'Percentual sobre a diferença entre valores devido e recebido',
      value: 'dif'
    },
    {
      text: 'Percentual sobre valor devido',
      value: 'dev'
    },
    {
      text: 'Calcular o valor conforme §3º do Art. 85 da Lei 13105/15',
      value: 'CPC85'
    },
    {
      text: 'Fixo',
      value: 'fixo'
    }
  ];

  public tipoJurosOptions = [
    {
      text: '- Selecione uma opção -',
      value: ''
    },
    {
      text: 'Sem juros',
      value: 'sem_juros'
    },
    {
      text: '12% ao ano (até 06/2009) / 6% ao ano (Poupança)',
      value: '12_6'
    },
    {
      text: '6% ao ano (observando a SELIC - Poupança)',
      value: '6_selic'
    },
    {
      text: '12% ao ano',
      value: '12_ano'
    },
    {
      text: '6% ao ano (até 01/2003) / 12% ao ano',
      value: '6_12'
    },
    {
      text: '6% ao ano (até 01/2003) / 12% ao ano (até 06/2009) / 6% ao ano',
      value: '6_12_6'
    },
    {
      text: '6% ao ano (fixo)',
      value: '6_fixo'
    },
    {
      text: 'Desejo definir manualmente',
      value: 'manual'
    }
  ];


  @Input() formData;
  @Input() errors: ErrorService;
  @Input() type;
  @Output() onSubmit = new EventEmitter;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private Calculo: CalculoAtrasadoService) { }

  ngOnInit() {
    if (this.route.snapshot.params['type'] !== undefined) {

      this.type = this.route.snapshot.params['type'];


      // if (this.type === 'AC') {
      //   this.chkNotGranted = false;
      // } else if (this.type === 'AR') {
      //   this.chkNotGranted = true;
      // }

      if (this.type == 'AJ') {
        this.chkAjusteMaximo = true;
      } else if (this.type == 'AI') {
        this.chkIndice = true;
      }

    }

    if (this.route.snapshot.params['id_calculo'] !== undefined) {
      this.isEdit = true;
      this.loadCalculo();
    } else {
      // Initialize variables for a new calculo
      // this.jurosAntes2003 = '0,5';
      // this.jurosDepois2003 = '1';
      // this.jurosDepois2009 = '0,5';

      // this.dataCalculo = this.getFormatedDate(new Date());
      // this.dataAcaoJudicial = this.getFormatedDate(new Date());
      // this.dataCitacaoReu = this.getFormatedDate(new Date());

      // this.especieValoresDevidos = 3;
      // this.especieValoresRecebidos = 3;

      this.especieValoresDevidos = '';
      this.especieValoresRecebidos = '';
    }

    this.checkImportBeneficioAtrasado();
  }


  importRGPS() {

    const exportDados = JSON.parse(sessionStorage.exportBeneficioAtrasado);

    const dataRgps = exportDados.dib || 0;
    const valorRgps = parseFloat(exportDados.valor) || 0;

    if (dataRgps && valorRgps) {
      if (this.type == 'AJ') {
        this.chkUseSameDib = true;
        this.rmiValoresRecebidos = valorRgps;
      } else {
        this.rmiValoresDevidos = valorRgps;
      }
      this.dibValoresDevidos = dataRgps.split('-')[2] + '/' +
        dataRgps.split('-')[1] + '/' +
        dataRgps.split('-')[0];
    }

  }

  checkImportBeneficioAtrasado() {

    if (sessionStorage.exportBeneficioAtrasado && sessionStorage.exportBeneficioAtrasado != undefined) {
      // this.resetForm();
      this.importRGPS();
      sessionStorage.removeItem('exportBeneficioAtrasado');
    }

  }


  validateInputs() {

    this.errors.clear();

    let valid = true;

    if (this.isEmptyInput(this.dataCalculo)) {
      // this.errors.add({ 'dataCalculo': ['A data do Cálculo é Necessária.'] });
      // valid = false;
    } else if (!moment(this.dataCalculo, 'MM/YYYY').isValid()) {
      this.errors.add({ 'dataCalculo': ['Insira uma data Válida.'] });
      valid = false;
    } else if (moment(this.dataCalculo, 'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({ 'dataCalculo': ['A data do Cálculo deve ser posterior a 01/01/1970.'] })
      valid = false;
    }

    if (this.isEmptyInput(this.dataAcaoJudicial)) {
      // this.errors.add({ 'dataAcaoJudicial': ['A data da Ação Jucidical é Necessária.'] });
      // valid = false;
    } else if (!this.isValidDate(this.dataAcaoJudicial)) {
      this.errors.add({ 'dataAcaoJudicial': ['Insira uma data Válida.'] });
      valid = false;
    } else if (moment(this.dataAcaoJudicial, 'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({ 'dataAcaoJudicial': ['A data deve ser posterior a 01/01/1970.'] })
      valid = false;
    }

    if (this.isEmptyInput(this.dataCitacaoReu)) {
      // this.errors.add({ 'dataCitacaoReu': ['A data da Citação do Réu é Necessária.'] });
      // valid = false;
    } else if (!this.isValidDate(this.dataCitacaoReu)) {
      this.errors.add({ 'dataCitacaoReu': ['Insira uma data Válida.'] });
      valid = false;
    } else if (moment(this.dataCitacaoReu, 'DD/MM/YYYY') < this.dataMinima) {
      // this.errors.add({ 'dataCitacaoReu': ['A data deve ser maior que 01/01/1970'] });
      // valid = false;
    }

    // Check if its necessary to validate the box of 'Valores Recebidos'
    if (!this.isEmptyInput(this.especieValoresRecebidos) ||
        !this.isEmptyInput(this.dibValoresRecebidos) ||
        !this.isEmptyInput(this.cessacaoValoresRecebidos) ||
        !this.isEmptyInput(this.rmiValoresRecebidos) ||
        !this.isEmptyInput(this.dibAnteriorValoresRecebidos)) {

      if (this.isEmptyInput(this.especieValoresRecebidos)) {
        this.errors.add({ 'especieValoresRecebidos': ['Selecione uma opção.'] });
        valid = false;
      }

      if (this.isEmptyInput(this.dibValoresRecebidos)) {
        this.errors.add({ 'dibValoresRecebidos': ['A DIB de Valores Recebidos é Necessária.'] });
        valid = false;
      } else {

        if (!this.isValidDate(this.dibValoresRecebidos)) {
          this.errors.add({ 'dibValoresRecebidos': ['Insira uma data Válida.'] });
          valid = false;
        } else if (moment(this.dibValoresRecebidos, 'DD/MM/YYYY') < this.dataMinima) {
          this.errors.add({ 'dibValoresRecebidos': ['A data deve ser maior que 01/1970'] });
          valid = false;
        }

      }

      if (!this.isEmptyInput(this.cessacaoValoresRecebidos) &&
        !this.isValidDate(this.cessacaoValoresRecebidos) &&
        !this.isEmptyInput(this.dibValoresDevidos) &&
        !this.isValidDate(this.dibValoresDevidos) &&
        !this.compareDates(this.dibValoresDevidos, this.cessacaoValoresRecebidos)) {

        this.errors.add({ 'cessacaoValoresRecebidos': ['A Cessação de valores recebidos deve ser maior que a DIB de valores devidos.'] });
        valid = false;
      }

      if (this.isEmptyInput(this.rmiValoresRecebidos)) {
        this.errors.add({ 'rmiValoresRecebidos': ['A RMI de Valores Recebidos é Necessária.'] });
        valid = false;
      } else if (this.rmiValoresRecebidos == 0) {
        this.errors.add({ 'rmiValoresRecebidos': ['A RMI de Valores Recebidos deve ser maior que zero.'] });
        valid = false;
      }

      if (!this.isEmptyInput(this.dibAnteriorValoresRecebidos)) {

        if (!this.isValidDate(this.dibAnteriorValoresRecebidos)) {
          this.errors.add({ 'dibAnteriorValoresRecebidos': ['Insira uma data válida.'] });
          valid = false;
        } else if (moment(this.dibAnteriorValoresRecebidos, 'DD/MM/YYYY') < this.dataMinima) {
          this.errors.add({ 'dibAnteriorValoresRecebidos': ['A data deve ser maior que 01/1970'] });
          valid = false;
        }
      }


      if (!this.isEmptyInput(this.cessacaoValoresRecebidos)) {

        if (!this.isValidDate(this.cessacaoValoresRecebidos)) {
          this.errors.add({ 'cessacaoValoresRecebidos': ['Insira uma data válida.'] });
          valid = false;
        } else if (moment(this.cessacaoValoresRecebidos, 'DD/MM/YYYY') < this.dataMinima) {
          this.errors.add({ 'cessacaoValoresRecebidos': ['A data deve ser maior que 01/1970'] });
          valid = false;
        }
      }
    }

    if (this.isEmptyInput(this.especieValoresDevidos)) {
      this.errors.add({ 'especieValoresDevidos': ['Selecione uma opção.'] });
      valid = false;
    }

    if (this.isEmptyInput(this.dibValoresDevidos)) {
      this.errors.add({ 'dibValoresDevidos': ['A DIB de Valores Devidos é Necessária.'] });
      valid = false;
    } else if (!this.isValidDate(this.dibValoresDevidos)) {
      this.errors.add({ 'dibValoresDevidos': ['Insira uma data Válida.'] });
      valid = false;
    } else if (moment(this.dibValoresDevidos, 'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({ 'dibValoresDevidos': ['A data deve ser maior que 01/1970'] });
      valid = false;
    }

    if (this.isEmptyInput(this.rmiValoresDevidos)) {
      this.errors.add({ 'rmiValoresDevidos': ['A RMI de Valores Devidos é Necessária.'] });
      valid = false;
    } else if (this.rmiValoresDevidos == 0) {
      this.errors.add({ 'rmiValoresDevidos': ['A RMI de Valores Devidos deve ser maior que zero.'] });
      valid = false;
    }

    if (!this.isEmptyInput(this.dibAnteriorValoresDevidos)) {

      if (!this.isValidDate(this.dibAnteriorValoresDevidos)) {
        this.errors.add({ 'dibAnteriorValoresDevidos': ['Insira uma data válida.'] });
        valid = false;
      } else if (moment(this.dibAnteriorValoresDevidos, 'DD/MM/YYYY') < this.dataMinima) {
        this.errors.add({ 'dibAnteriorValoresDevidos': ['A data deve ser maior que 01/1970.'] });
        valid = false;
      }
    }

    if (this.taxaAdvogadoAplicacaoSobre === 'fixo') {

      if (!this.isExits(this.taxaAdvogadoValorFixoHonorarios)) {
        this.errors.add({ 'taxaAdvogadoAplicacaoSobre': ['Digite um valor fixo ou selecione outra opção.'] });
        valid = false;
      }

    }

    if (!this.isEmptyInput(this.cessacaoValoresDevidos)) {

      if (!this.isValidDate(this.cessacaoValoresDevidos)) {
        this.errors.add({ 'cessacaoValoresDevidos': ['Insira uma data válida.'] });
        valid = false;
      } else if (moment(this.cessacaoValoresDevidos, 'DD/MM/YYYY') < this.dataMinima) {
        this.errors.add({ 'cessacaoValoresDevidos': ['A data deve ser maior que 01/1970.'] });
        valid = false;
      }
    }


    if (!this.isEmptyInput(this.dataHonorariosDe) || !this.isEmptyInput(this.dataHonorariosAte)) {
      // if (!this.isValidDate(this.dataHonorariosDe)) {
      //   this.errors.add({ 'dataHonorariosDe': ['Insira uma data válida.'] });
      //   valid = false;
      // } else {
      //   if (moment(this.dataHonorariosDe, 'DD/MM/YYYY') < this.dataMinima) {
      //     this.errors.add({ 'dataHonorariosAte': ['A data deve ser maior que 01/1970'] });
      //     valid = false;
      //   }
      // }

      if (!this.isValidDate(this.dataHonorariosAte)) {
        this.errors.add({ 'dataHonorariosAte': ['Insira uma data válida.'] });
        valid = false;
      } else {

        if (moment(this.dataHonorariosAte, 'DD/MM/YYYY') < this.dataMinima) {
          this.errors.add({ 'dataHonorariosAte': ['A data deve ser maior que 01/1970'] });
          valid = false;
        }

        // if (this.isValidDate(this.dataHonorariosDe)) {
        //   if (moment(this.dataHonorariosAte, 'DD/MM/YYYY') < this.dataMinima) {
        //     this.errors.add({ 'dataHonorariosAte': ['A data deve ser maior que a data de inicio'] });
        //     valid = false;
        //   }
        // }
      }

      if (this.isEmptyInput(this.percentualHonorarios)) {
        this.errors.add({ 'percentualHonorarios': ['Insira o percentual dos Honorários.'] });
        valid = false;
      } else if (!this.isValidFloat(this.percentualHonorarios)) {
        this.errors.add({ 'percentualHonorarios': ['O valor deve ser um número com casas decimais separadas por vírgula.'] });
        valid = false;
      } else if (parseFloat(this.percentualHonorarios) == 0) {
        this.errors.add({ 'percentualHonorarios': ['O percentual dos Honorários deve ser maior que zero.'] });
        valid = false;
      }

      if (!this.isEmptyInput(this.acordoJudicial)) {
        if (!this.isValidFloat(this.acordoJudicial)) {
          this.errors.add({ 'acordoJudicial': ['O valor deve ser um número com casas decimais separadas por vírgula.'] });
          valid = false;
        }
      }
    }

    if (!this.isEmptyInput(this.jurosAntes2003) && this.tipoDejurosSelecionado == 'manual') {
      if (!this.isValidFloat(this.jurosAntes2003)) {
        this.errors.add({ 'jurosAntes2003': ['O valor deve ser um número com casas decimais separadas por vírgula.'] });
        valid = false;
      }
    }

    if (!this.isEmptyInput(this.jurosDepois2003) && this.tipoDejurosSelecionado == 'manual') {
      if (!this.isValidFloat(this.jurosDepois2003)) {
        this.errors.add({ 'jurosDepois2003': ['O valor deve ser um número com casas decimais separadas por vírgula.'] });
        valid = false;
      }
    }

    if (!this.isEmptyInput(this.jurosDepois2009) && this.tipoDejurosSelecionado == 'manual') {
      if (!this.isValidFloat(this.jurosDepois2009)) {
        this.errors.add({ 'jurosDepois2009': ['O valor deve ser um número com casas decimais separadas por vírgula.'] });
        valid = false;
      }
    }

    if (!this.isEmptyInput(this.taxaAjusteMaximaConcedida)) {
      if (!this.isValidFloat(this.taxaAjusteMaximaConcedida)) {
        this.errors.add({ 'taxaAjusteMaximaConcedida': ['O valor deve ser um número com casas decimais separadas por vírgula.'] });
        valid = false;
      }
    }

    if (!this.isEmptyInput(this.taxaAjusteMaximaEsperada)) {
      if (!this.isValidFloat(this.taxaAjusteMaximaEsperada)) {
        this.errors.add({ 'taxaAjusteMaximaEsperada': ['O valor deve ser um número com casas decimais separadas por vírgula.'] });
        valid = false;
      }
    }

    // cpc 85
    if (this.taxaAdvogadoAplicacaoSobre === 'CPC85') {

      if (this.isEmptyInput(this.taxaAdvogadoAplicarCPCArt85)) {
        this.errors.add({ 'taxaAdvogadoAplicarCPCArt85': ['- Selecione uma opção.'] });
        valid = false;
      }

      if (!(this.taxaAdvogadoPercateAte200SM >= 10.00 && this.taxaAdvogadoPercateAte200SM <= 20.00)) {
        this.errors.add({ 'taxaAdvogadoPercateAte200SM': ['O valor deve estar entre 10 e 20.'] });
        valid = false;
      }

      if (!(this.taxaAdvogadoPerc200A2000SM >= 8.00 && this.taxaAdvogadoPerc200A2000SM <= 10.00)) {
        this.errors.add({ 'taxaAdvogadoPerc200A2000SM': ['O valor deve estar entre 8 e 10.'] });
        valid = false;
      }


      if (!(this.taxaAdvogadoPerc2000A20000SM >= 5.00 && this.taxaAdvogadoPerc2000A20000SM <= 8.00)) {
        this.errors.add({ 'taxaAdvogadoPerc2000A20000SM': ['O valor deve estar entre 5 e 8.'] });
        valid = false;
      }


      if (!(this.taxaAdvogadoPerc20000A100000SM >= 3.00 && this.taxaAdvogadoPerc20000A100000SM <= 5.00)) {
        this.errors.add({ 'taxaAdvogadoPerc20000A100000SM': ['O valor deve estar entre 3 e 5 .'] });
        valid = false;
      }

      if (!(this.taxaAdvogadoPerc100000SM >= 1.00 && this.taxaAdvogadoPerc100000SM <= 3.00)) {
        this.errors.add({ 'taxaAdvogadoPerc100000SM': ['O valor deve estar entre 1 e 3.'] });
        valid = false;
      }

    }

    return valid;
  }

 submit(e) {
    e.preventDefault();
    this.validateInputs();
    
    this.setCcheckBoxdibAnterior();
    this.setCheckRevisao();
    this.setJurosAnualParaMensal(this.tipoDejurosSelecionado);

    if (this.errors.empty()) {

      if (!this.chkPrecedidoRecebidos) {
        this.dibAnteriorValoresRecebidos = '';
        // console.log('entrou')
      }

      if (!this.chkDibAnterior) {
        this.dibAnteriorValoresDevidos = '';
        this.formData.previa_data_pedido_beneficio_esperado = '';
        //  console.log('entrou')
      }

      // Data inicial do benefício DIB de valores devidos
      // OU
      // Data inicial do benefício DIB de valores recebidos
      let dataPedidoBeneficio;
      // Data inicial do benefício anterior de valores devidos
      // OU
      // Data inicial do benefício anterior de valores recebidos
      let data_anterior_pedido_beneficio;
      if (this.chkNotGranted || this.chkUseSameDib) {
        // Valores Devidos
        dataPedidoBeneficio = this.dibValoresDevidos;
        data_anterior_pedido_beneficio = this.dibAnteriorValoresDevidos;
      } else {
        // Valores Recebidos
        dataPedidoBeneficio = this.dibValoresRecebidos;
        data_anterior_pedido_beneficio = this.dibAnteriorValoresRecebidos;
      }

      this.formData.usar_mesma_dib = this.chkUseSameDib;
      // Id Segurado
      this.formData.id_segurado = this.route.snapshot.params['id'];
      // Data do cálculo:
     // this.formData.data_calculo_pedido = this.dataCalculo;
      this.formData.data_calculo_pedido = moment(this.dataCalculo, 'MM/YYYY').format('01/MM/YYYY');

      // Data da citação do réu
      this.formData.data_acao_judicial = this.dataAcaoJudicial;
      // Data da ajuizamento da ação:
      this.formData.data_citacao_reu = this.dataCitacaoReu
      // Tipo de Correçao monetária que será usada no calculo
      this.formData.tipo_correcao = this.tipoCorrecaoMonetaria;
      // CONDICIONAL
      this.formData.data_pedido_beneficio = dataPedidoBeneficio;
      // RMI de valores Recebidos
      this.formData.valor_beneficio_concedido = this.rmiValoresRecebidos;
      // RMI de valores recebidos depois da revisão (Buraco Negro)
      this.formData.valor_beneficio_concedido_revisao = this.rmiValoresRecebidosBuracoNegro;
      // Nova RMI de valores devidos
      this.formData.valor_beneficio_esperado = this.rmiValoresDevidos;
      // RMI de valores devidos depois da revisão (Buraco Negro)
      this.formData.valor_beneficio_esperado_revisao = this.rmiValoresDevidosBuracoNegro;
      // CheckBox Beneficio Não Concedido
      this.formData.beneficio_nao_concedido = this.chkNotGranted;
      // Data de Cessação dos Valores Recebidos
      this.formData.data_cessacao = this.cessacaoValoresRecebidos;
      // CheckBoc Juros de Mora
      this.formData.previo_interesse = this.chkJurosMora;
      // CheckBox Não Usar Deflação
      this.formData.nao_usar_deflacao = this.chkNaoUsarDeflacao;
      // CheckBox calcular aplicando os índices de 2,28% em 06/1999 e 1,75% em 05/2004
      this.formData.usar_indice_99_04 = this.chkIndice;
      // CONDICIONAL
      this.formData.data_anterior_pedido_beneficio = data_anterior_pedido_beneficio;
      // Percentual dos Honorarios
      if (this.percentualHonorarios != undefined) {
        this.formData.percentual_taxa_advogado = this.formatPrecentual(this.percentualHonorarios).toString().replace(',', '.');
      } else {
        this.formData.percentual_taxa_advogado = 0;
      }
      // Intervalo de Honorarios DE
      this.dataHonorariosDe = this.dibValoresDevidos;
      this.formData.taxa_advogado_inicio = this.dataHonorariosDe;
      // Intervalo de Honorarios ATE
      this.formData.taxa_advogado_final = this.dataHonorariosAte;

      this.formData.taxa_advogado_inicio_sucumbencia = this.dataHonorariosSucumbenciaDe;
      this.formData.taxa_advogado_final_sucumbencia = this.dataHonorariosSucumbenciaAte;
      this.formData.taxa_advogado_valor_fixo = this.taxaAdvogadoValorFixoHonorarios;

      // aplicação sobre devido ou diferença entre devido e recebido
      this.formData.taxa_advogado_aplicacao_sobre = this.taxaAdvogadoAplicacaoSobre;

      if (this.isExits(this.formData.taxa_advogado_inicio_sucumbencia)
        && !this.isExits(this.dataHonorariosSucumbenciaAte)) {
        this.formData.taxa_advogado_final_sucumbencia = this.formData.data_calculo_pedido;
      }

      // cpc 85
      this.formData.taxa_advogado_aplicar_CPCArt85 = this.taxaAdvogadoAplicarCPCArt85;
      if (this.taxaAdvogadoAplicarCPCArt85) // somente se o check for maracado
      {

        this.formData.taxa_advogado_perc_ate_200_SM = this.taxaAdvogadoPercateAte200SM;
        this.formData.taxa_advogado_perc_200_2000_SM = this.taxaAdvogadoPerc200A2000SM;
        this.formData.taxa_advogado_perc_2000_20000_SM = this.taxaAdvogadoPerc2000A20000SM;
        this.formData.taxa_advogado_perc_20000_100000_SM = this.taxaAdvogadoPerc20000A100000SM;
        this.formData.taxa_advogado_perc_100000_SM = this.taxaAdvogadoPerc100000SM;

      } else {

        this.formData.taxa_advogado_perc_ate_200_SM = null;
        this.formData.taxa_advogado_perc_200_2000_SM = null;
        this.formData.taxa_advogado_perc_2000_20000_SM = null;
        this.formData.taxa_advogado_perc_20000_100000_SM = null;
        this.formData.taxa_advogado_perc_100000_SM = null;

      }

      // opções adicionais de juros
      this.formData.nao_aplicar_juros_sobre_negativo = this.naoAplicarJurosSobreNegativo;
     // this.formData.competencia_inicio_juros = this.competenciaInicioJuros;

    if (this.isExits(this.competenciaInicioJuros)) {
      this.formData.competencia_inicio_juros = moment(this.competenciaInicioJuros, 'MM/YYYY').format('01/MM/YYYY');
     }else{
      this.formData.competencia_inicio_juros = null;
     }

     // valor inferior ao salario minimo
      this.formData.nao_aplicar_sm_beneficio_concedido = this.naoAplicarSMBeneficioConcedido;
      this.formData.nao_aplicar_sm_beneficio_esperado = this.naoAplicarSMBeneficioEsperado;

      this.formData.numero_processo = this.numeroProcesso;
      this.formData.afastar_prescricao = this.afastarPrescricao;
      this.formData.calcular_abono_13_ultimo_mes = this.calcularAbono13UltimoMes;

      // Calcular Mais (Vincendos)
      this.formData.maturidade = (this.maturidade) ? 12 : 0;
      // Juros anterior a janeiro 2003
      if (this.jurosAntes2003 != undefined) {

        this.formData.previo_interesse_2003 =
          (this.tipoDejurosSelecionado == 'manual') ? this.jurosAntes2003.replace(',', '.') : this.jurosAntes2003;

      } else {
        this.formData.previo_interesse_2003 = 0;
      }
      // Juros posterior a janeiro 2003
      if (this.jurosDepois2003 != undefined) {

        this.formData.pos_interesse_2003 =
          (this.tipoDejurosSelecionado == 'manual') ? this.jurosDepois2003.replace(',', '.') : this.jurosDepois2003;

      } else {
        this.formData.pos_interesse_2003 = 0;
      }
      // Juros posterior a julho 2009
      if (this.jurosDepois2009 != undefined) {

        this.formData.pos_interesse_2009 =
          (this.tipoDejurosSelecionado == 'manual') ? this.jurosDepois2009.replace(',', '.') : this.jurosDepois2009;

      } else {
        this.formData.pos_interesse_2009 = 0;
      }
      // Espécie valores devidos
      this.formData.tipo_aposentadoria = this.especieValoresDevidos;
      // Agora
      this.formData.data_calculo = this.getFormatedDate(new Date());
      // CheckBox tetos judiciais em 12/1998 e em 12/2003 (indisponivel para calculo comum)
      this.formData.aplicar_ajuste_maximo_98_2003 = this.chkAjusteMaximo;
      // Percentual do Acordo Judicial
      if (this.acordoJudicial != undefined) {
        // this.formData.acordo_pedido = this.acordoJudicial.replace(',','.');
        this.formData.acordo_pedido = this.formatPrecentual(this.acordoJudicial).toString().replace(',', '.');
      } else {
        this.formData.acordo_pedido = 0;
      }

      // CheckBox 'Desmarque para não aplicar os juros da poupança'
      this.formData.aplicar_juros_poupanca = this.chkBoxTaxaSelic;
      // checkBox Não Limitar Teto para demandas Judiciais
      this.formData.nao_aplicar_ajuste_maximo_98_2003 = this.chkDemandasJudiciais;
      // Data inicial do benefício DIB de valores devidos
      this.formData.data_pedido_beneficio_esperado = this.dibValoresDevidos;
      // Data inicial do benefício anterior de valores devidos
      this.formData.previa_data_pedido_beneficio_esperado = this.dibAnteriorValoresDevidos;
      // Data de Cessação de valores devidos
      this.formData.data_prevista_cessacao = this.cessacaoValoresDevidos;
      
      // Espécie valores recebidos
      if (!this.isEmptyInput(this.especieValoresRecebidos)) {
        this.formData.tipo_aposentadoria_recebida = this.especieValoresRecebidos;
      }
     
      // CheckBox Beneficio Precedido com DIB Anterior (recebidos)
      this.formData.concedido_anterior_dib = this.chkPrecedidoRecebidos;
      // CheckBox Beneficio Precedido com DIB Anterior (devidos)
      this.formData.esperado_anterior = this.chkDibAnterior;
      // Índice de reajuste no teto da Nova RMI de valores devidos:
      if (this.taxaAjusteMaximaEsperada != undefined) {
        this.formData.taxa_ajuste_maxima_esperada = this.taxaAjusteMaximaEsperada.replace(',', '.');
      } else {
        this.formData.taxa_ajuste_maxima_esperada = 0.0;
      }
      // Índice de reajuste no teto da Nova RMI de valores recebidos:
      if (this.taxaAjusteMaximaConcedida != undefined) {
        this.formData.taxa_ajuste_maxima_concedida = this.taxaAjusteMaximaConcedida.replace(',', '.');
      } else {
        this.formData.taxa_ajuste_maxima_concedida = 0.0;
      }


      this.onSubmit.emit(this.formData);

    } else {
      // console.log(this.errors.all())
      // swal('Erro', 'Confira os dados digitados','error');
      swal({
        position: 'top-end',
        type: 'error',
        title: 'Confira os dados digitados',
        showConfirmButton: false,
        timer: 2000
      });

      // .then(() => {
      //   setTimeout(() => {
      //     this.scroll('inicioForm');
      //   }, 1000)
      // });

    }


  }

  preencherCorrecaoMonetaria() {
    let tipoCorrecao = this.formData.tipo_correcao;
    this.tipoCorrecaoMonetaria = tipoCorrecao;
    for (let index = 0; index < this.correcaoOptions.length; index++) {
      if (this.correcaoOptions[index].value == tipoCorrecao) {
        this.indiceCorrecao = index;
        // console.log(this.indiceCorrecao)
      }
    }
  }

  setCheckRevisao(){

    // this.chkNotGranted se verdadeiro existe recebido;
    if (!this.isEmptyInput(this.dibValoresDevidos) && !this.isEmptyInput(this.dibValoresRecebidos)) {
      this.chkNotGranted = false;
    } else {
      this.chkNotGranted = true;
    }

    console.log(this.chkNotGranted);
  }




  setCcheckBoxdibAnterior(){

    if (!this.isEmptyInput(this.dibAnteriorValoresDevidos)) {
      this.chkDibAnterior = true;
    }

    //recebido
    if (!this.isEmptyInput(this.dibAnteriorValoresRecebidos)) {
      this.chkPrecedidoRecebidos = true;
    }


  }

  loadCalculo() {
    this.preencherCorrecaoMonetaria();
    // Data do cálculo:
    // this.dataCalculo = this.formatReceivedDate(this.formData.data_calculo_pedido);
    this.dataCalculo = moment(this.formData.data_calculo_pedido, 'YYYY-MM-DD').format('MM/YYYY');

    // Data da citação do réu
    this.dataAcaoJudicial = this.formatReceivedDate(this.formData.data_acao_judicial);
    // Data da ajuizamento da ação:
    this.dataCitacaoReu = this.formatReceivedDate(this.formData.data_citacao_reu);
    // CONDICIONAL
    let dataPedidoBeneficio = this.formData.data_pedido_beneficio;
    // RMI de valores Recebidos
    this.rmiValoresRecebidos = this.formData.valor_beneficio_concedido;
    // RMI de valores recebidos depois da revisão (Buraco Negro)
    this.rmiValoresRecebidosBuracoNegro = this.formData.valor_beneficio_concedido_revisao;
    // Nova RMI de valores devidos
    this.rmiValoresDevidos = this.formData.valor_beneficio_esperado;
    // RMI de valores devidos depois da revisão (Buraco Negro)
    this.rmiValoresDevidosBuracoNegro = this.formData.valor_beneficio_esperado_revisao;
    // CheckBox Beneficio Não Concedido
    this.chkNotGranted = this.formData.beneficio_nao_concedido;
    // Data de Cessação dos Valores Recebidos
    this.cessacaoValoresRecebidos = this.formatReceivedDate(this.formData.data_cessacao);
    // CheckBoc Juros de Mora
    this.chkJurosMora = this.formData.previo_interesse;
    // CONDICIONAL
    let data_anterior_pedido_beneficio = this.formData.data_anterior_pedido_beneficio;

    // Percentual dos Honorarios

    this.percentualHonorarios = Math.floor(this.formData.percentual_taxa_advogado * 100);

    // Intervalo de Honorarios DE
    this.dataHonorariosDe = this.formatReceivedDate(this.formData.taxa_advogado_inicio);
    // Intervalo de Honorarios ATE
    this.dataHonorariosAte = this.formatReceivedDate(this.formData.taxa_advogado_final);

    // Intervalo de Honorarios inicio sucumbencia
    this.dataHonorariosSucumbenciaDe = this.formatReceivedDate(this.formData.taxa_advogado_inicio_sucumbencia);
    // Intervalo de Honorarios fim sucumbencia
    this.dataHonorariosSucumbenciaAte = this.formatReceivedDate(this.formData.taxa_advogado_final_sucumbencia);
    // Aplicação dos honorários sobre a diferença ou sobre o devido
    this.taxaAdvogadoAplicacaoSobre = (this.isExits(this.formData.taxa_advogado_aplicacao_sobre)) ?
      this.formData.taxa_advogado_aplicacao_sobre : 'dif';

    // Calcular Mais (Vincendos)
    this.maturidade = this.formData.maturidade;
    // Juros anterior a janeiro 2003
    if (this.formData.previo_interesse_2003 != null) {
      this.jurosAntes2003 = this.formData.previo_interesse_2003.toString().replace('.', ',');
    }
    // Juros posterior a janeiro 2003
    if (this.formData.pos_interesse_2003 != null) {
      this.jurosDepois2003 = this.formData.pos_interesse_2003.toString().replace('.', ',');
    }
    // Juros posterior a julho 2009
    if (this.formData.pos_interesse_2009 != null) {
      this.jurosDepois2009 = this.formData.pos_interesse_2009.toString().replace('.', ',');
    }
    // Espécie valores devidos
    this.especieValoresDevidos = this.formData.tipo_aposentadoria;
    // CheckBox tetos judiciais em 12/1998 e em 12/2003 (indisponivel para calculo comum)
    if (this.formData.aplicar_ajuste_maximo_98_2003) {
      this.type = 'AJ';
    }
    this.chkAjusteMaximo = this.formData.aplicar_ajuste_maximo_98_2003;

    // Percentual do Acordo Judicial
    if (this.formData.acordo_pedido != null) {
      //  this.acordoJudicial = this.formData.acordo_pedido.toString().replace('.',',');
      this.acordoJudicial = this.formatPrecentual(this.formData.acordo_pedido, false).toString().replace('.', ',');
    }

    // checkBox Não Limitar Teto para demandas Judiciais
    this.chkDemandasJudiciais = this.formData.nao_aplicar_ajuste_maximo_98_2003;
    // Data inicial do benefício DIB de valores devidos
    this.dibValoresDevidos = this.formatReceivedDate(this.formData.data_pedido_beneficio_esperado);
    // Data inicial do benefício anterior de valores devidos
    this.dibAnteriorValoresDevidos = this.formatReceivedDate(this.formData.previa_data_pedido_beneficio_esperado);
    // Data de Cessação de valores devidos
    this.cessacaoValoresDevidos = this.formatReceivedDate(this.formData.data_prevista_cessacao);
    
    // Espécie valores recebidos
    //this.especieValoresRecebidos = this.formData.tipo_aposentadoria_recebida;

    if (!this.isEmptyInput(this.formData.valor_beneficio_concedido) 
        && !this.isEmptyInput(this.formData.rmiValoresRecebidos)) {
      this.especieValoresRecebidos = this.formData.tipo_aposentadoria_recebida;
    }else{
      this.especieValoresRecebidos = '';
    }
    
    // CheckBox Beneficio Precedido com DIB Anterior (recebidos)
    this.chkPrecedidoRecebidos = this.formData.concedido_anterior_dib;
    // CheckBox Beneficio Precedido com DIB Anterior (devidos)
    this.chkDibAnterior = this.formData.esperado_anterior;

    if (this.formData.taxa_ajuste_maxima_concedida != null) {
      this.taxaAjusteMaximaConcedida = this.formData.taxa_ajuste_maxima_concedida.toString().replace('.', ',');
    }
    if (this.formData.taxa_ajuste_maxima_esperada != null) {
      this.taxaAjusteMaximaEsperada = this.formData.taxa_ajuste_maxima_esperada.toString().replace('.', ',');
    }
    
    // CheckBox 'Desmarque para não aplicar os juros da poupança'
    this.chkBoxTaxaSelic = this.formData.aplicar_juros_poupanca;
    this.chkUseSameDib = this.formData.usar_mesma_dib;

    if (this.chkNotGranted || this.chkUseSameDib) {
      // Valores Devidos
      this.dibValoresDevidos = this.formatReceivedDate(dataPedidoBeneficio);
      //this.dibValoresRecebidos = this.formatReceivedDate(dataPedidoBeneficio);
      this.dibAnteriorValoresDevidos = this.formatReceivedDate(data_anterior_pedido_beneficio);
    } else {
      // Valores Recebidos
      this.dibValoresRecebidos = this.formatReceivedDate(dataPedidoBeneficio);
      this.dibAnteriorValoresRecebidos = this.formatReceivedDate(data_anterior_pedido_beneficio);
    }

    this.naoAplicarJurosSobreNegativo = this.formData.nao_aplicar_juros_sobre_negativo;
   // this.competenciaInicioJuros = this.formatReceivedDate(this.formData.competencia_inicio_juros);
  
   if (this.isExits(this.formData.competencia_inicio_juros)) {
    this.competenciaInicioJuros = moment(this.formData.competencia_inicio_juros, 'YYYY-MM-DD').format('MM/YYYY');
   }
  
   this.taxaAdvogadoValorFixoHonorarios = this.formData.taxa_advogado_valor_fixo;

    // valor inferior ao salario minimo
    this.naoAplicarSMBeneficioConcedido = this.formData.nao_aplicar_sm_beneficio_concedido;
    this.naoAplicarSMBeneficioEsperado = this.formData.nao_aplicar_sm_beneficio_esperado;

    this.numeroProcesso = this.formData.numero_processo;
    this.afastarPrescricao = this.formData.afastar_prescricao;
    this.calcularAbono13UltimoMes = this.formData.calcular_abono_13_ultimo_mes;
    this.taxaAdvogadoAplicarCPCArt85 = this.formData.taxa_advogado_aplicar_CPCArt85;

    if (this.taxaAdvogadoAplicacaoSobre === 'CPC85') // somente se o check for maracado
    {
      this.taxaAdvogadoPercateAte200SM = (this.isExits(this.formData.taxa_advogado_perc_ate_200_SM)) ?
        this.formData.taxa_advogado_perc_ate_200_SM : 0;

      this.taxaAdvogadoPerc200A2000SM = (this.isExits(this.formData.taxa_advogado_perc_200_2000_SM)) ?
        this.formData.taxa_advogado_perc_200_2000_SM : 0;

      this.taxaAdvogadoPerc2000A20000SM = (this.isExits(this.formData.taxa_advogado_perc_2000_20000_SM)) ?
        this.formData.taxa_advogado_perc_2000_20000_SM : 0;

      this.taxaAdvogadoPerc20000A100000SM = (this.isExits(this.formData.taxa_advogado_perc_20000_100000_SM)) ?
        this.formData.taxa_advogado_perc_20000_100000_SM : 0;

      this.taxaAdvogadoPerc100000SM = (this.isExits(this.formData.taxa_advogado_perc_100000_SM)) ?
        this.formData.taxa_advogado_perc_100000_SM : 0;
    }

    this.dibValoresDevidosChanged();
    this.dibValoresRecebidosChanged();
    this.tipoDejurosSelecionado = this.getValueSelectJurosAnualParaMensal();
  }


  dibValoresRecebidosChanged() {
    if (this.chkUseSameDib) {
      if (this.dibValoresRecebidos !== undefined && this.dibValoresDevidos !== null) {
        this.updateDIBValoresDevidos();
      }
    }
    this.checkRecebidosBuracoNegro();
  }

  dibValoresDevidosChanged() {
    this.checkDevidosBuracoNegro();
  }

  notGrantedChanged() {
    console.log(this.chkNotGranted);
  }

  useSameDIBChanged() {
    if (this.chkUseSameDib) {
      if (this.dibValoresDevidos !== undefined && this.dibValoresDevidos !== null) {
        // this.updateDIBValoresDevidos();
        this.updateDIBValoresRecebidos();
      }
    }
  }

  updateDIBValoresDevidos() {
    this.dibValoresDevidos = this.dibValoresRecebidos;
    this.checkDevidosBuracoNegro();
  }


  updateDIBValoresRecebidos() {
    this.dibValoresRecebidos = this.dibValoresDevidos;
    this.checkDevidosBuracoNegro();
  }


  checkRecebidosBuracoNegro() {
    let dibDate = moment(this.dibValoresRecebidos, 'DD/MM/YYYY');
    if (isNaN(dibDate.valueOf())) {
      this.recebidosBuracoNegro = false;
      this.recebidosPosBuracoNegro = false;
      return;
    }

    if (this.checkDateBuracoNegro(dibDate)) {
      this.recebidosBuracoNegro = true;
      this.recebidosPosBuracoNegro = false;
    } else if (this.checkDateAfterBuracoNegro(dibDate)) {
      this.recebidosBuracoNegro = false;
      this.recebidosPosBuracoNegro = true;
    } else {
      this.recebidosBuracoNegro = false;
      this.recebidosPosBuracoNegro = false;
    }
  }

  checkDevidosBuracoNegro() {
    let dibDate = moment(this.dibValoresDevidos, 'DD/MM/YYYY');
    if (isNaN(dibDate.valueOf())) {
      this.devidosBuracoNegro = false;
      this.devidosPosBuracoNegro = false;
      return;
    }

    if (this.checkDateBuracoNegro(dibDate)) {
      this.devidosBuracoNegro = true;
      this.devidosPosBuracoNegro = false;
    } else if (this.checkDateAfterBuracoNegro(dibDate)) {
      this.devidosBuracoNegro = false;
      this.devidosPosBuracoNegro = true;
    } else {
      this.devidosBuracoNegro = false;
      this.devidosPosBuracoNegro = false;
    }
  }

  checkDateBuracoNegro(dibDate) {
    if (dibDate >= this.inicioBuracoNegro && dibDate <= this.finalBuracoNegro) {
      return true;
    }
    return false;
  }

  checkDateAfterBuracoNegro(dibDate) {
    if (dibDate > this.finalBuracoNegro) {
      return true;
    }
    return false;
  }

  jurosMoraChanged() {
    console.log(this.chkJurosMora);
  }

  setCompetenciaInicioJurosIsNull(){
    if (this.isEmptyInput(this.competenciaInicioJuros)) {
      this.competenciaInicioJuros = moment(this.dataCitacaoReu, 'DD/MM/YYYY').format('MM/YYYY');
    }
  }

  // return true if date1 is before or igual date2
  compareDates(date1, date2) {
    let bits1 = date1.split('/');
    let d1 = new Date(bits1[2], bits1[1] - 1, bits1[0]);
    let bits2 = date2.split('/');
    let d2 = new Date(bits2[2], bits2[1] - 1, bits2[0]);
    return d1 <= d2;
  }

  getFormatedDate(date: Date) {
    let dd: any = date.getDate();
    let mm: any = date.getMonth() + 1; // January is 0!
    dd = '0' + dd;
    mm = '0' + mm;
    let yyyy = date.getFullYear();

    let today = dd.slice(-2) + '/' +
      mm.slice(-2) + '/' + yyyy;
    return today;
  }

  formatReceivedDate(inputDate) {
    let date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))

    if (!isNaN(date.getTime()) && inputDate != null) {
      // Months use 0 index.
      return ('0' + (date.getDate())).slice(-2) + '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        date.getFullYear();
    }

    return '';
  }


  isEmptyInput(input) {
    if (input == '' || input === undefined || input === null) {
      return true;
    }

    return false;
  }

  isValidFloat(input) {

    if (typeof input == 'string' && (/\,/).test(input)) {
      input = input.replace(',', '.');
    }

    if (isNaN(input)) {
      return false;
    }
    return true;
  }

  isValidDate(date) {
    let bits = date.split('/');
    let d = new Date(bits[2], bits[1] - 1, bits[0]);
    return d && (d.getMonth() + 1) == bits[1];
  }

  onCorrecaoChange(newCorrecao) {
    this.tipoCorrecaoMonetaria = newCorrecao.value;
    // console.log(this.tipoCorrecaoMonetaria);
  }


  voltar() {
    window.location.href = '/#/beneficios/beneficios-calculos/' + this.route.snapshot.params['id'];
  }


  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined && value != '')
      ? true : false;
  }


  formatPrecentual(valor, type = true) {
    return (type) ? valor / 100 : valor * 100;
  }

  public setJurosAnualParaMensal(tipoDejurosSelecionado) {

    // console.log(this.tipoDejurosSelecionado);

    switch (tipoDejurosSelecionado) {
      case '12_6':
        // 12% ao ano (até 06/2009) / 6% ao ano (Poupança)
        this.jurosAntes2003 = 1.00;
        this.jurosDepois2003 = 1.00;
        this.jurosDepois2009 = 0.50;
        this.chkBoxTaxaSelic = true;
        break;
      case '6_selic':
        // 6% ao ano (observando a SELIC - Poupança)
        this.jurosAntes2003 = 0.50;
        this.jurosDepois2003 = 0.50;
        this.jurosDepois2009 = 0.50;
        this.chkBoxTaxaSelic = true;
        break;
      case '12_ano':
        // 12% ao ano
        this.jurosAntes2003 = 1.00;
        this.jurosDepois2003 = 1.00;
        this.jurosDepois2009 = 1.00;
        this.chkBoxTaxaSelic = false;
        break;
      case '6_12':
        // 6% ao ano (até 01/2003) / 12% ao ano
        this.jurosAntes2003 = 0.50;
        this.jurosDepois2003 = 1.00;
        this.jurosDepois2009 = 1.00;
        this.chkBoxTaxaSelic = false;
        break;
      case '6_12_6':
        // 6% ao ano (até 01/2003) / 12% ao ano (até 06/2009) / 6% ao ano
        this.jurosAntes2003 = 0.50;
        this.jurosDepois2003 = 1.00;
        this.jurosDepois2009 = 0.50;
        this.chkBoxTaxaSelic = false;
        break;
      case '6_fixo':
        // 6% ao ano (fixo)
        this.jurosAntes2003 = 0.50;
        this.jurosDepois2003 = 0.50;
        this.jurosDepois2009 = 0.50;
        this.chkBoxTaxaSelic = false;
        break;
      case 'manual':
        // (manual)
        this.jurosAntes2003 = null;
        this.jurosDepois2003 = null;
        this.jurosDepois2009 = null;
        break;
      case 'sem_juros':
        // sem juros
        this.jurosAntes2003 = null;
        this.jurosDepois2003 = null;
        this.jurosDepois2009 = null;
        this.chkBoxTaxaSelic = false;
        break;
    }

  }

  public getValueSelectJurosAnualParaMensal() {

    const opcoesMensalParaAnual = [
      { jurosAntes2003: 1, jurosDepois2003: 1, jurosDepois2009: 0.5, poupancaSelic: 1, value: '12_6' },  // 12% ao ano (até 06/2009) / 6% ao ano (Poupança)
      { jurosAntes2003: 0.5, jurosDepois2003: 0.5, jurosDepois2009: 0.5, poupancaSelic: 1, value: '6_selic' }, // 6% ao ano (observando a SELIC - Poupança)
      { jurosAntes2003: 1, jurosDepois2003: 1, jurosDepois2009: 1, poupancaSelic: 0, value: '12_ano' }, // 12% ao ano
      { jurosAntes2003: 0.5, jurosDepois2003: 1, jurosDepois2009: 1, poupancaSelic: 0, value: '6_12' }, // 6% ao ano (até 01/2003) / 12% ao ano
      { jurosAntes2003: 0.5, jurosDepois2003: 1, jurosDepois2009: 0.5, poupancaSelic: 0, value: '6_12_6' }, // 6% ao ano (até 01/2003) / 12% ao ano (até 06/2009) / 6% ao ano
      { jurosAntes2003: 0.5, jurosDepois2003: 0.5, jurosDepois2009: 0.5, poupancaSelic: 0, value: '6_fixo' }, // 6% ao ano (fixo)
      { jurosAntes2003: null, jurosDepois2003: null, jurosDepois2009: null, poupancaSelic: 0, value: 'sem_juros' },
    ];
    
    for (const confJuros of opcoesMensalParaAnual) {

      if (
        confJuros.jurosAntes2003 === this.formData.previo_interesse_2003 &&
        confJuros.jurosDepois2003 === this.formData.pos_interesse_2003 &&
        confJuros.jurosDepois2009 === this.formData.pos_interesse_2009 &&
        confJuros.poupancaSelic === this.formData.aplicar_juros_poupanca
      ) {
        return confJuros.value;
      }

    }
    return 'manual';

  }


  scroll(id) {
    if (this.isExits(id)) {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    }
  }


}


