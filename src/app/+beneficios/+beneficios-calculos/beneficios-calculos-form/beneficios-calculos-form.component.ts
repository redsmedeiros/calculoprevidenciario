import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../../shared/animations/fade-in-top.decorator";
import { ErrorService } from '../../../services/error.service';
import { CalculoAtrasado } from '../CalculoAtrasado.model';
import { CalculoAtrasadoService } from '../CalculoAtrasado.service';
import swal from 'sweetalert';
import * as moment from 'moment';

@Component({
  selector: 'app-beneficios-calculos-form',
  templateUrl: './beneficios-calculos-form.component.html',
  styleUrls: ['./beneficios-calculos-form.component.css'],
  providers:[
    ErrorService
  ]
})
export class BeneficiosCalculosFormComponent implements OnInit {

  public dateMask = [/\d/, /\d/,'/',/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

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

  public especieValoresDevidos;
  public especieValoresRecebidos;

  public acordoJudicial;

  public segurado:any ={};

  public inicioBuracoNegro = moment('1988-10-05');
  public finalBuracoNegro = moment('1991-04-04');
  public dataMinima = moment('1970-01-01');

  private tipoCorrecaoMonetaria = 'ipca';
  public correcaoOptions = [
    {
      text: 'Tabela da IPCA-e',
      value: 'ipca'
    },
    {
      text: 'Tabela da Justiça Federal',
      value: 'cam'
    },  
    {
      text: 'Tabela da TR',
      value: 'tr'
    },
    {
      text: 'Tabela da TR até 03/2015 e IPCA-e',
      value: 'tr032015_ipcae'
    }  
  ]

  public especieValoresOptions = [{
  	name: "Auxílio Doença",
  	value: 0
  },{
  	name: "Aposentadoria por invalidez Previdenciária ou Pensão por Morte",
  	value: 1
  },{
  	name: "Aposentadoria por idade - Trabalhador Urbano",
  	value: 2
  },{
  	name: "Aposentadoria por tempo de contribuição",
  	value: 3
  },{
  	name: "Aposentadoria por tempo de serviço de professor",
  	value: 4
  },{
  	name: "Auxílio Acidente previdenciário - 50%",
  	value: 5
  },{
  	name: "Aposentadoria por idade - Trabalhador Rural",
  	value: 6
  },{
  	name: "Auxílio Acidente  - 30%",
  	value: 7
  },{
  	name: "Auxílio Acidente - 40%",
  	value: 8
  },{
  	name: "Auxílio Acidente - 60%",
  	value: 9
  },{
  	name: "Abono de Permanência em Serviço",
  	value: 10
  },{
  	name: "LOAS - Benefício no valor de um salário mínimo",
  	value: 11
  },{
  	name: "Aposentadoria especial da Pessoa com Deficiência Grave",
  	value: 12
  },{
  	name: "Aposentadoria especial da Pessoa com Deficiência Moderada",
  	value: 13
  },{
  	name: "Aposentadoria especial da Pessoa com Deficiência Leve",
  	value: 14
  },{
  	name: "Aposentadoria especial por Idade da Pessoa com Deficiência",
  	value: 15
  },{
  	name: "LOAS",
  	value: 16
  }
]

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
      
      if (this.type == 'AJ') {
        this.chkAjusteMaximo = true;
      }else if (this.type == 'AI') {
        this.chkIndice = true;
      }

    }

    let dataRgps = this.route.snapshot.queryParams['dib'] || 0;
    let valorRgps = parseFloat(this.route.snapshot.queryParams['valor']) || 0;
    if(dataRgps && valorRgps){
      if(this.type == 'AJ'){
        this.chkUseSameDib = true;
        this.rmiValoresRecebidos = valorRgps;
      }else{
        this.rmiValoresDevidos = valorRgps;
      }
    this.dibValoresDevidos = dataRgps.split('-')[2] + '/' + 
                             dataRgps.split('-')[1] + '/' +
                             dataRgps.split('-')[0];
    }

    if (this.route.snapshot.params['id_calculo'] !== undefined) {
      this.isEdit = true;
      this.loadCalculo();        
    } else {
      // Initialize variables for a new calculo
      this.jurosAntes2003 = '0,5';
      this.jurosDepois2003 = '1';
      this.jurosDepois2009 = '0,5';

      this.dataCalculo = this.getFormatedDate(new Date());
      this.dataAcaoJudicial = this.getFormatedDate(new Date());
      this.dataCitacaoReu = this.getFormatedDate(new Date());

      this.especieValoresDevidos = 3;
      this.especieValoresRecebidos = 3;
    }
  }

  validateInputs() {

    this.errors.clear();

    let valid = true;

    if (this.isEmptyInput(this.dataCalculo)) {
      this.errors.add({"dataCalculo":["A data do Cálculo é Necessária."]});
      valid = false;
    } else if (!this.isValidDate(this.dataCalculo)) {
      this.errors.add({"dataCalculo":["Insira uma data Válida."]});
      valid = false;
    } else if (moment(this.dataCalculo, 'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({"dataCalculo":["A data do Cálculo deve ser posterior a 01/01/1970."]})
      valid = false;
    }

    if (this.isEmptyInput(this.dataAcaoJudicial)) {
     this.errors.add({"dataAcaoJudicial":["A data da Ação Jucidical é Necessária."]});
     valid = false; 
    } else if (!this.isValidDate(this.dataAcaoJudicial)) {
      this.errors.add({"dataAcaoJudicial":["Insira uma data Válida."]});
      valid = false;
    } else if (moment(this.dataAcaoJudicial,'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({"dataAcaoJudicial":["A data deve ser posterior a 01/01/1970."]})
      valid = false;
    }

    if (this.isEmptyInput(this.dataCitacaoReu)) {
     this.errors.add({"dataCitacaoReu":["A data da Citação do Réu é Necessária."]});
     valid = false; 
    } else if (!this.isValidDate(this.dataCitacaoReu)) {
      this.errors.add({"dataCitacaoReu":["Insira uma data Válida."]});
      valid = false;
    } else if (moment(this.dataCitacaoReu,'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({"dataCitacaoReu":["A data deve ser maior que 01/01/1970"]});
      valid = false;
    }

    // Check if its necessary to validate the box of 'Valores Recebidos'
    if (!this.chkNotGranted) {

      if (this.isEmptyInput(this.dibValoresRecebidos)) {
       this.errors.add({"dibValoresRecebidos":["A DIB de Valores Recebidos é Necessária."]});
       valid = false;
      } else {

        if (!this.isValidDate(this.dibValoresRecebidos)) {
          this.errors.add({"dibValoresRecebidos":["Insira uma data Válida."]});
          valid = false;
        } else if (moment(this.dibValoresRecebidos,'DD/MM/YYYY') < this.dataMinima) {
          this.errors.add({"dibValoresRecebidos":["A data deve ser maior que 01/1970"]});
          valid = false;
        }

      }

      if (!this.isEmptyInput(this.cessacaoValoresRecebidos) &&
          !this.isValidDate(this.cessacaoValoresRecebidos) &&
          !this.isEmptyInput(this.dibValoresDevidos) &&
          !this.isValidDate(this.dibValoresDevidos) &&
          !this.compareDates(this.dibValoresDevidos,this.cessacaoValoresRecebidos)) {

        this.errors.add({"cessacaoValoresRecebidos":["A Cessação de valores recebidos deve ser maior que a DIB de valores devidos."]});
        valid = false; 
      }

      if (this.isEmptyInput(this.rmiValoresRecebidos)) {        
       this.errors.add({"rmiValoresRecebidos":["A RMI de Valores Recebidos é Necessária."]});
       valid = false;
      } else if (this.rmiValoresRecebidos == 0) {
        this.errors.add({"rmiValoresRecebidos":["A RMI de Valores Recebidos deve ser maior que zero."]});
        valid = false;
      }

      if (!this.isEmptyInput(this.dibAnteriorValoresRecebidos)) {

        if (!this.isValidDate(this.dibAnteriorValoresRecebidos)) {
          this.errors.add({"dibAnteriorValoresRecebidos":["Insira uma data válida."]});
          valid = false; 
        } else if (moment(this.dibAnteriorValoresRecebidos,'DD/MM/YYYY') < this.dataMinima){
          this.errors.add({"dibAnteriorValoresRecebidos":["A data deve ser maior que 01/1970"]});
          valid = false; 
        }
      }


      if (!this.isEmptyInput(this.cessacaoValoresRecebidos)) {
        
        if (!this.isValidDate(this.cessacaoValoresRecebidos)) {
          this.errors.add({"cessacaoValoresRecebidos":["Insira uma data válida."]});
          valid = false; 
        } else if (moment(this.cessacaoValoresRecebidos,'DD/MM/YYYY') < this.dataMinima) {
          this.errors.add({"cessacaoValoresRecebidos":["A data deve ser maior que 01/1970"]});
          valid = false; 
        }
      }
    }

    if (this.isEmptyInput(this.dibValoresDevidos)) {
     this.errors.add({"dibValoresDevidos":["A DIB de Valores Devidos é Necessária."]});
     valid = false;
    } else if (!this.isValidDate(this.dibValoresDevidos)) {
      this.errors.add({"dibValoresDevidos":["Insira uma data Válida."]});
      valid = false;
    } else if (moment(this.dibValoresDevidos,'DD/MM/YYYY') < this.dataMinima) {
      this.errors.add({"dibValoresDevidos":["A data deve ser maior que 01/1970"]});
      valid = false;
    }

    if (this.isEmptyInput(this.rmiValoresDevidos)) {        
     this.errors.add({"rmiValoresDevidos":["A RMI de Valores Devidos é Necessária."]});
     valid = false;
    } else if (this.rmiValoresDevidos == 0) {
      this.errors.add({"rmiValoresDevidos":["A RMI de Valores Devidos deve ser maior que zero."]});
      valid = false;
    }

    if (!this.isEmptyInput(this.dibAnteriorValoresDevidos)) {

      if (!this.isValidDate(this.dibAnteriorValoresDevidos)) {
        this.errors.add({"dibAnteriorValoresDevidos":["Insira uma data válida."]});
        valid = false; 
      } else if (moment(this.dibAnteriorValoresDevidos,'DD/MM/YYYY') < this.dataMinima) {
        this.errors.add({"dibAnteriorValoresDevidos":["A data deve ser maior que 01/1970."]});
        valid = false; 
      }
    }
    

    if (!this.isEmptyInput(this.cessacaoValoresDevidos)) {

      if (!this.isValidDate(this.cessacaoValoresDevidos)) {
        this.errors.add({"cessacaoValoresDevidos":["Insira uma data válida."]});
        valid = false; 
      } else if (moment(this.cessacaoValoresDevidos,'DD/MM/YYYY') < this.dataMinima){
        this.errors.add({"cessacaoValoresDevidos":["A data deve ser maior que 01/1970."]});
        valid = false;
      }
    }


    if (!this.isEmptyInput(this.dataHonorariosDe) || !this.isEmptyInput(this.dataHonorariosAte)){
      if (!this.isValidDate(this.dataHonorariosDe)) {
        this.errors.add({"dataHonorariosDe":["Insira uma data válida."]});
        valid = false; 
      } else {
        if (moment(this.dataHonorariosDe,'DD/MM/YYYY') < this.dataMinima) {
          this.errors.add({"dataHonorariosAte":["A data deve ser maior que 01/1970"]});
          valid = false;
        }
      }

      if (!this.isValidDate(this.dataHonorariosAte)) {
        this.errors.add({"dataHonorariosAte":["Insira uma data válida."]});
        valid = false;
      } else {
        
        if (moment(this.dataHonorariosAte,'DD/MM/YYYY') < this.dataMinima) {
          this.errors.add({"dataHonorariosAte":["A data deve ser maior que 01/1970"]});
          valid = false;
        }

        if (this.isValidDate(this.dataHonorariosDe)) {
          if(moment(this.dataHonorariosAte,'DD/MM/YYYY') < this.dataMinima) {
            this.errors.add({"dataHonorariosAte":["A data deve ser maior que a data de inicio"]});
            valid = false;
          }
        }
      }

      if (this.isEmptyInput(this.percentualHonorarios)) {
        this.errors.add({"percentualHonorarios":["Insira o percentual dos Honorários."]});
        valid = false; 
      } else if (!this.isValidFloat(this.percentualHonorarios)) {
        this.errors.add({"percentualHonorarios":["O valor deve ser um número com casas decimais separadas por vírgula."]});
        valid = false;
      } else if (parseFloat(this.percentualHonorarios.replace(',','.')) == 0) {
        this.errors.add({"percentualHonorarios":["O percentual dos Honorários deve ser maior que zero."]});
        valid = false;
      }

      if (!this.isEmptyInput(this.acordoJudicial)) {
        if (!this.isValidFloat(this.acordoJudicial)) {          
          this.errors.add({"acordoJudicial":["O valor deve ser um número com casas decimais separadas por vírgula."]});
          valid = false; 
        }
      }
    }

    if (!this.isEmptyInput(this.jurosAntes2003)) {
      if (!this.isValidFloat(this.jurosAntes2003)) {          
        this.errors.add({"jurosAntes2003":["O valor deve ser um número com casas decimais separadas por vírgula."]});
        valid = false; 
      }
    }

    if (!this.isEmptyInput(this.jurosDepois2003)) {
      if (!this.isValidFloat(this.jurosDepois2003)) {          
        this.errors.add({"jurosDepois2003":["O valor deve ser um número com casas decimais separadas por vírgula."]});
        valid = false; 
      }
    }

    if (!this.isEmptyInput(this.jurosDepois2009)) {
      if (!this.isValidFloat(this.jurosDepois2009)) {          
        this.errors.add({"jurosDepois2009":["O valor deve ser um número com casas decimais separadas por vírgula."]});
        valid = false; 
      }
    }

    if (!this.isEmptyInput(this.taxaAjusteMaximaConcedida)) {
      if (!this.isValidFloat(this.taxaAjusteMaximaConcedida)) {          
        this.errors.add({"taxaAjusteMaximaConcedida":["O valor deve ser um número com casas decimais separadas por vírgula."]});
        valid = false; 
      }
    }

    if (!this.isEmptyInput(this.taxaAjusteMaximaEsperada)) {
      if (!this.isValidFloat(this.taxaAjusteMaximaEsperada)) {          
        this.errors.add({"taxaAjusteMaximaEsperada":["O valor deve ser um número com casas decimais separadas por vírgula."]});
        valid = false; 
      }
    }

    return valid;
  }

  submit(e) {
    e.preventDefault();
    this.validateInputs();
    if(this.errors.empty()){
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
        this.formData.id_segurado  = this.route.snapshot.params['id'];
        // Data do cálculo:
        this.formData.data_calculo_pedido  = this.dataCalculo;
        // Data da citação do réu
        this.formData.data_acao_judicial  = this.dataAcaoJudicial;
        // Data da ajuizamento da ação:
        this.formData.data_citacao_reu  = this.dataCitacaoReu
        //Tipo de Correçao monetária que será usada no calculo
        this.formData.tipo_correcao = this.tipoCorrecaoMonetaria;
        // CONDICIONAL
        this.formData.data_pedido_beneficio = dataPedidoBeneficio;
        // RMI de valores Recebidos
        this.formData.valor_beneficio_concedido  = this.rmiValoresRecebidos;
        // RMI de valores recebidos depois da revisão (Buraco Negro)
        this.formData.valor_beneficio_concedido_revisao  = this.rmiValoresRecebidosBuracoNegro;
        // Nova RMI de valores devidos
        this.formData.valor_beneficio_esperado  = this.rmiValoresDevidos;
        // RMI de valores devidos depois da revisão (Buraco Negro)
        this.formData.valor_beneficio_esperado_revisao  = this.rmiValoresDevidosBuracoNegro;
        // CheckBox Beneficio Não Concedido
        this.formData.beneficio_nao_concedido  = this.chkNotGranted;
        // Data de Cessação dos Valores Recebidos
        this.formData.data_cessacao = this.cessacaoValoresRecebidos;
        // CheckBoc Juros de Mora
        this.formData.previo_interesse = this.chkJurosMora;
        //CheckBox Não Usar Deflação
        this.formData.nao_usar_deflacao = this.chkNaoUsarDeflacao;
        //CheckBox calcular aplicando os índices de 2,28% em 06/1999 e 1,75% em 05/2004
        this.formData.usar_indice_99_04 = this.chkIndice;
        // CONDICIONAL
        this.formData.data_anterior_pedido_beneficio  = data_anterior_pedido_beneficio;
        // Percentual dos Honorarios
        if (this.percentualHonorarios != undefined) {
          this.formData.percentual_taxa_advogado  = this.percentualHonorarios.replace(',','.');
        } else {
          this.formData.percentual_taxa_advogado = 0;
        }
        // Intervalo de Honorarios DE
        this.formData.taxa_advogado_inicio = this.dataHonorariosDe;
        // Intervalo de Honorarios ATE 
        this.formData.taxa_advogado_final = this.dataHonorariosAte;
        // Calcular Mais (Vincendos)
        this.formData.maturidade = this.maturidade;
        // Juros anterior a janeiro 2003
        if (this.jurosAntes2003 != undefined) {
          this.formData.previo_interesse_2003 = this.jurosAntes2003.replace(',','.');
        } else {
          this.formData.previo_interesse_2003 = 0;
        }
        // Juros posterior a janeiro 2003
        if (this.jurosDepois2003 != undefined) {
          this.formData.pos_interesse_2003 = this.jurosDepois2003.replace(',','.');
        } else {
          this.formData.pos_interesse_2003 = 0;
        }
        // Juros posterior a julho 2009
        if (this.jurosDepois2009 != undefined) {
          this.formData.pos_interesse_2009 = this.jurosDepois2009.replace(',','.');
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
          this.formData.acordo_pedido = this.acordoJudicial.replace(',','.');
        } else {
          this.formData.acordo_pedido = 0;
        }

        //CheckBox 'Desmarque para não aplicar os juros da poupança'
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
        this.formData.tipo_aposentadoria_recebida = this.especieValoresRecebidos;
        // CheckBox Beneficio Precedido com DIB Anterior (recebidos)
        this.formData.concedido_anterior_dib = this.chkPrecedidoRecebidos;
        // CheckBox Beneficio Precedido com DIB Anterior (devidos)
        this.formData.esperado_anterior = this.chkDibAnterior;
        // Índice de reajuste no teto da Nova RMI de valores devidos:
        if (this.taxaAjusteMaximaEsperada != undefined) {
          this.formData.taxa_ajuste_maxima_esperada = this.taxaAjusteMaximaEsperada.replace(',','.');
        } else {
          this.formData.taxa_ajuste_maxima_esperada = 0;
        }
        // Índice de reajuste no teto da Nova RMI de valores recebidos:
        if (this.taxaAjusteMaximaConcedida != undefined) {
          this.formData.taxa_ajuste_maxima_concedida = this.taxaAjusteMaximaConcedida.replace(',','.');
        } else {
          this.formData.taxa_ajuste_maxima_concedida = 0;
        }

        if(this.isEdit){
          swal('Sucesso', 'Cálculo salvo com sucesso','success');
        }

        this.onSubmit.emit(this.formData);
    }else{
      console.log(this.errors.all())
      swal('Erro', 'Confira os dados digitados','error');
    }
  }

  loadCalculo() {
  	// Data do cálculo:
    this.dataCalculo = this.formatReceivedDate(this.formData.data_calculo_pedido);
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
    this.percentualHonorarios = this.formData.percentual_taxa_advogado.toString().replace('.',',');
    // Intervalo de Honorarios DE
    this.dataHonorariosDe = this.formatReceivedDate(this.formData.taxa_advogado_inicio);
    // Intervalo de Honorarios ATE 
    this.dataHonorariosAte = this.formatReceivedDate(this.formData.taxa_advogado_final);
    // Calcular Mais (Vincendos)
    this.maturidade = this.formData.maturidade;
    // Juros anterior a janeiro 2003
    if (this.formData.previo_interesse_2003 != null)
    this.jurosAntes2003 = this.formData.previo_interesse_2003.toString().replace('.',',');
    // Juros posterior a janeiro 2003
    if (this.formData.pos_interesse_2003 != null)
    this.jurosDepois2003 = this.formData.pos_interesse_2003.toString().replace('.',',');
    // Juros posterior a julho 2009
    if (this.formData.pos_interesse_2009 != null)
      this.jurosDepois2009 = this.formData.pos_interesse_2009.toString().replace('.',',');
    // Espécie valores devidos
    this.especieValoresDevidos = this.formData.tipo_aposentadoria;
    // CheckBox tetos judiciais em 12/1998 e em 12/2003 (indisponivel para calculo comum)
    if (this.formData.aplicar_ajuste_maximo_98_2003) {
      this.type = 'AJ';
    }
    this.chkAjusteMaximo = this.formData.aplicar_ajuste_maximo_98_2003;
    // Percentual do Acordo Judicial
    if (this.formData.acordo_pedido != null)
      this.acordoJudicial = this.formData.acordo_pedido.toString().replace('.',',');
    // checkBox Não Limitar Teto para demandas Judiciais
    this.chkDemandasJudiciais = this.formData.nao_aplicar_ajuste_maximo_98_2003;
    // Data inicial do benefício DIB de valores devidos
    this.dibValoresDevidos = this.formatReceivedDate(this.formData.data_pedido_beneficio_esperado);
    // Data inicial do benefício anterior de valores devidos
    this.dibAnteriorValoresDevidos = this.formatReceivedDate(this.formData.previa_data_pedido_beneficio_esperado);
    // Data de Cessação de valores devidos
    this.cessacaoValoresDevidos = this.formatReceivedDate(this.formData.data_prevista_cessacao);
    // Espécie valores recebidos
    this.especieValoresRecebidos = this.formData.tipo_aposentadoria_recebida;
    // CheckBox Beneficio Precedido com DIB Anterior (recebidos)
    this.chkPrecedidoRecebidos = this.formData.concedido_anterior_dib;
    // CheckBox Beneficio Precedido com DIB Anterior (devidos)
    this.chkDibAnterior = this.formData.esperado_anterior;

    if (this.formData.taxa_ajuste_maxima_concedida != null)
      this.taxaAjusteMaximaConcedida = this.formData.taxa_ajuste_maxima_concedida.toString().replace('.',',');
    if (this.formData.taxa_ajuste_maxima_esperada != null)
      this.taxaAjusteMaximaEsperada = this.formData.taxa_ajuste_maxima_esperada.toString().replace('.',',');

    this.chkUseSameDib = this.formData.usar_mesma_dib;

  	if (this.chkNotGranted || this.chkUseSameDib) {
  		// Valores Devidos
  		this.dibValoresDevidos = this.formatReceivedDate(dataPedidoBeneficio);
      this.dibValoresRecebidos = this.formatReceivedDate(dataPedidoBeneficio);
  		this.dibAnteriorValoresDevidos = this.formatReceivedDate(data_anterior_pedido_beneficio);
  	} else {
  		// Valores Recebidos
  		this.dibValoresRecebidos = this.formatReceivedDate(dataPedidoBeneficio);
  		this.dibAnteriorValoresRecebidos = this.formatReceivedDate(data_anterior_pedido_beneficio);
  	}

    this.dibValoresDevidosChanged();
    this.dibValoresRecebidosChanged();
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
  		if (this.dibValoresRecebidos !== undefined && this.dibValoresDevidos !== null) {
  			this.updateDIBValoresDevidos();
  		}
  	}
  }

  updateDIBValoresDevidos() { 
  	this.dibValoresDevidos = this.dibValoresRecebidos;
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

  jurosMoraChanged(){
  	console.log(this.chkJurosMora);
  }

  // return true if date1 is before or igual date2
  compareDates(date1, date2) {
    var bits1 = date1.split('/');
    var d1 = new Date(bits1[2], bits1[1] - 1, bits1[0]);
    var bits2 = date2.split('/');
    var d2 = new Date(bits2[2], bits2[1] - 1, bits2[0]);
    return d1 <= d2;
  }

  getFormatedDate(date: Date) {
  	var dd:any = date.getDate();
  	var mm:any = date.getMonth()+1; //January is 0!
        dd = '0' + dd;
        mm = '0' + mm;
  	var yyyy = date.getFullYear();

  	var today = dd.slice(-2)+'/' +
                mm.slice(-2)+'/'+yyyy;
  	return today;
  }

  formatReceivedDate(inputDate) {
      var date = new Date(inputDate);
      date.setTime(date.getTime() + (5*60*60*1000))
      if (!isNaN(date.getTime())) {
          // Months use 0 index.
          return  ('0' + (date.getDate())).slice(-2)+'/'+
                  ('0' + (date.getMonth()+1)).slice(-2)+'/'+
                         date.getFullYear();
      }
      return '';
  }

  isEmptyInput(input) {
    if (input == '' || input === undefined || input === null)
      return true;

    return false;
  }

  isValidFloat(input) {
    if(isNaN(input.replace(',','.')))
      return false;
    return true;    
  }

  isValidDate(date) {
    var bits = date.split('/');
    var d = new Date(bits[2], bits[1] - 1, bits[0]);
    return d && (d.getMonth() + 1) == bits[1];
  }

  onCorrecaoChange(newCorrecao){
    this.tipoCorrecaoMonetaria = newCorrecao.value;
    console.log(this.tipoCorrecaoMonetaria);
  }
}
