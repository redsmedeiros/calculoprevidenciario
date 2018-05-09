import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { ErrorService } from '../../services/error.service';
import { SeguradoService } from '../+beneficios-segurados/Segurado.service';
import { CalculoAtrasado } from '../CalculoAtrasado.model';
import { CalculoAtrasadoService } from '../CalculoAtrasado.service';
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './beneficios-novo-calculo.component.html',
  providers: [
    ErrorService
  ],
})
export class BeneficiosNovoCalculoComponent implements OnInit {

  public dateMask = [/[0-3]/, /\d/,'/',/[0-3]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public isUpdating = false;

  public type = 'A';

  public chkNotGranted = false;
  public chkUseSameDib = false;
  public chkJurosMora = true;
  public chkDibAnterior = false;
  public chkAjusteMaximo = false;
  public chkDemandasJudiciais = false;
  public chkPrecedidoRecebidos = false;

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

  public inicioBuracoNegro = new Date('05/10/1988');
  public finalBuracoNegro = new Date('04/04/1991');
  public dataMinima = '01/01/1970';

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

  constructor(protected Segurado: SeguradoService,
	            protected router: Router,
    		      protected errors: ErrorService,
              private route: ActivatedRoute,
              private Calculo: CalculoAtrasadoService) {}

  ngOnInit() {
	this.isUpdating = true;
    // retrive user info
    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
    });

    if (this.route.snapshot.params['type'] !== undefined) {
      
      this.type = this.route.snapshot.params['type'];
      
      if (this.type == 'AJ') {
        this.chkAjusteMaximo = true;
      }

    }

    if (this.route.snapshot.params['id_calculo'] !== undefined) {

    	this.Calculo.find(this.route.snapshot.params['id_calculo']).then(calculo => {
    		this.loadCalculo(calculo);
    	})
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
  	let dibDate = new Date(this.dibValoresRecebidos);
	if (isNaN( dibDate.getTime())) {
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
  	let dibDate = new Date(this.dibValoresDevidos);
	if (isNaN( dibDate.getTime())) {
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

  saveCalculation() {

    if (!this.validateInputs()) {
      swal('Erro', 'Confira os dados digitados','error');
      return;
    }

  	let calculoAtrasado = new CalculoAtrasado();

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

  	// Id Segurado
    calculoAtrasado.form['id_segurado'] = this.route.snapshot.params['id'];
  	calculoAtrasado.id_segurado = this.route.snapshot.params['id'];
  	// Data do cálculo:
    calculoAtrasado.form['data_calculo_pedido'] = this.dataCalculo;
    calculoAtrasado.data_calculo_pedido = this.dataCalculo;
    // Data da citação do réu
    calculoAtrasado.form['data_acao_judicial'] = this.dataAcaoJudicial;
    calculoAtrasado.data_acao_judicial = this.dataAcaoJudicial;
    // Data da ajuizamento da ação:
    calculoAtrasado.form['data_citacao_reu'] = this.dataCitacaoReu
    calculoAtrasado.data_citacao_reu = this.dataCitacaoReu
    // CONDICIONAL
    calculoAtrasado.form['data_pedido_beneficio'] = dataPedidoBeneficio;
    calculoAtrasado.data_pedido_beneficio = dataPedidoBeneficio;
    // RMI de valores Recebidos
    calculoAtrasado.form['valor_beneficio_concedido'] = this.rmiValoresRecebidos;
    calculoAtrasado.valor_beneficio_concedido = this.rmiValoresRecebidos;
    // RMI de valores recebidos depois da revisão (Buraco Negro)
    calculoAtrasado.form['valor_beneficio_concedido_revisao'] = this.rmiValoresRecebidosBuracoNegro;
    calculoAtrasado.valor_beneficio_concedido_revisao = this.rmiValoresRecebidosBuracoNegro;
    // Nova RMI de valores devidos
    calculoAtrasado.form['valor_beneficio_esperado'] = this.rmiValoresDevidos;
    calculoAtrasado.valor_beneficio_esperado = this.rmiValoresDevidos;
    // RMI de valores devidos depois da revisão (Buraco Negro)
    calculoAtrasado.form['valor_beneficio_esperado_revisao'] = this.rmiValoresDevidosBuracoNegro;
    calculoAtrasado.valor_beneficio_esperado_revisao = this.rmiValoresDevidosBuracoNegro;
    // CheckBox Beneficio Não Concedido
    calculoAtrasado.form['beneficio_nao_concedido'] = this.chkNotGranted;
    calculoAtrasado.beneficio_nao_concedido = this.chkNotGranted;
    // Data de Cessação dos Valores Recebidos
    calculoAtrasado.form['data_cessacao'] = this.cessacaoValoresRecebidos;
    calculoAtrasado.data_cessacao = this.cessacaoValoresRecebidos;
    // CheckBoc Juros de Mora
    calculoAtrasado.previo_interesse = this.chkJurosMora;
    // CONDICIONAL
    calculoAtrasado.form['data_anterior_pedido_beneficio'] = data_anterior_pedido_beneficio;
    calculoAtrasado.data_anterior_pedido_beneficio = data_anterior_pedido_beneficio;
    // Percentual dos Honorarios
    if (this.percentualHonorarios != undefined) {
      calculoAtrasado.form['percentual_taxa_advogado'] = this.percentualHonorarios.replace(',','.');
      calculoAtrasado.percentual_taxa_advogado = this.percentualHonorarios.replace(',','.');
    } else {
      calculoAtrasado.form['percentual_taxa_advogado'] = 0;
      calculoAtrasado.percentual_taxa_advogado = 0;
    }
    // Intervalo de Honorarios DE
    calculoAtrasado.form['taxa_advogado_inicio'] = this.dataHonorariosDe;
    calculoAtrasado.taxa_advogado_inicio = this.dataHonorariosDe;
    // Intervalo de Honorarios ATE 
    calculoAtrasado.form['taxa_advogado_final'] = this.dataHonorariosAte;
    calculoAtrasado.taxa_advogado_final = this.dataHonorariosAte;
    // Calcular Mais (Vincendos)
    calculoAtrasado.form['maturidade'] = this.maturidade;
    calculoAtrasado.maturidade = this.maturidade;
    // Juros anterior a janeiro 2003
    if (this.jurosAntes2003 != undefined) {
      calculoAtrasado.form['previo_interesse_2003'] = this.jurosAntes2003.replace(',','.');
      calculoAtrasado.previo_interesse_2003 = this.jurosAntes2003.replace(',','.');
    } else {
      calculoAtrasado.form['previo_interesse_2003'] = 0;
      calculoAtrasado.previo_interesse_2003 = 0;
    }
    // Juros posterior a janeiro 2003
    if (this.jurosDepois2003 != undefined) {
      calculoAtrasado.form['pos_interesse_2003'] = this.jurosDepois2003.replace(',','.');
      calculoAtrasado.pos_interesse_2003 = this.jurosDepois2003.replace(',','.');
    } else {
      calculoAtrasado.form['pos_interesse_2003'] = 0;
      calculoAtrasado.pos_interesse_2003 = 0;
    }
    // Juros posterior a julho 2009
    if (this.jurosDepois2009 != undefined) {
      calculoAtrasado.form['pos_interesse_2009'] = this.jurosDepois2009.replace(',','.');
      calculoAtrasado.pos_interesse_2009 = this.jurosDepois2009.replace(',','.');
    } else {
      calculoAtrasado.form['pos_interesse_2009'] = 0;
      calculoAtrasado.pos_interesse_2009 = 0;
    }
    // Espécie valores devidos
    calculoAtrasado.form['tipo_aposentadoria'] = this.especieValoresDevidos;
    calculoAtrasado.tipo_aposentadoria = this.especieValoresDevidos;
    // Agora
    calculoAtrasado.form['data_calculo'] = this.getFormatedDate(new Date());
    calculoAtrasado.data_calculo = this.getFormatedDate(new Date());
    // CheckBox tetos judiciais em 12/1998 e em 12/2003 (indisponivel para calculo comum)
    calculoAtrasado.form['aplicar_ajuste_maximo_98_2003'] = this.chkAjusteMaximo;
    calculoAtrasado.aplicar_ajuste_maximo_98_2003 = this.chkAjusteMaximo;
    // Percentual do Acordo Judicial
    if (this.acordoJudicial != undefined) {
      calculoAtrasado.form['acordo_pedido'] = this.acordoJudicial.replace(',','.');
      calculoAtrasado.acordo_pedido= this.acordoJudicial.replace(',','.');
    } else {
      calculoAtrasado.form['acordo_pedido'] = 0;
      calculoAtrasado.acordo_pedido= 0;
    }
    // checkBox Não Limitar Teto para demandas Judiciais
    calculoAtrasado.form['nao_aplicar_ajuste_maximo_98_2003'] = this.chkDemandasJudiciais;
    calculoAtrasado.nao_aplicar_ajuste_maximo_98_2003 = this.chkDemandasJudiciais;
    // Data inicial do benefício DIB de valores devidos
    calculoAtrasado.form['data_pedido_beneficio_esperado'] = this.dibValoresDevidos;
    calculoAtrasado.data_pedido_beneficio_esperado = this.dibValoresDevidos;
    // Data inicial do benefício anterior de valores devidos
    calculoAtrasado.form['previa_data_pedido_beneficio_esperado'] = this.dibAnteriorValoresDevidos;
    calculoAtrasado.previa_data_pedido_beneficio_esperado = this.dibAnteriorValoresDevidos;
    // Data de Cessação de valores devidos
    calculoAtrasado.form['data_prevista_cessacao'] = this.cessacaoValoresDevidos;
    calculoAtrasado.data_prevista_cessacao = this.cessacaoValoresDevidos;
    // Espécie valores recebidos
    calculoAtrasado.form['tipo_aposentadoria_recebida'] = this.especieValoresRecebidos;
    calculoAtrasado.tipo_aposentadoria_recebida = this.especieValoresRecebidos;
    // CheckBox Beneficio Precedido com DIB Anterior (recebidos)
    calculoAtrasado.form['concedido_anterior_dib'] = this.chkPrecedidoRecebidos;
    calculoAtrasado.concedido_anterior_dib = this.chkPrecedidoRecebidos;
    // CheckBox Beneficio Precedido com DIB Anterior (devidos)
    calculoAtrasado.form['esperado_anterior'] = this.chkDibAnterior;
    calculoAtrasado.esperado_anterior = this.chkDibAnterior;
    // Índice de reajuste no teto da Nova RMI de valores devidos:
    if (this.taxaAjusteMaximaEsperada != undefined) {
      calculoAtrasado.form['taxa_ajuste_maxima_esperada'] = this.taxaAjusteMaximaEsperada.replace(',','.');
      calculoAtrasado.taxa_ajuste_maxima_esperada = this.taxaAjusteMaximaEsperada.replace(',','.');
    } else {
      calculoAtrasado.form['taxa_ajuste_maxima_esperada'] = 0;
      calculoAtrasado.taxa_ajuste_maxima_esperada = 0;
    }
    // Índice de reajuste no teto da Nova RMI de valores recebidos:
    if (this.taxaAjusteMaximaConcedida != undefined) {
      calculoAtrasado.form['taxa_ajuste_maxima_concedida'] = this.taxaAjusteMaximaConcedida.replace(',','.');
      calculoAtrasado.taxa_ajuste_maxima_concedida = this.taxaAjusteMaximaConcedida.replace(',','.');
    } else {
      calculoAtrasado.form['taxa_ajuste_maxima_concedida'] = 0;
      calculoAtrasado.taxa_ajuste_maxima_concedida = 0;
    }

    if (this.route.snapshot.params['id_calculo'] === undefined) {

	    this.Calculo
	          .save(calculoAtrasado.form)
	          .then(model => {
	          	console.log(model);
	  			window.location.href='#/beneficios/beneficios-calculos/'+this.route.snapshot.params['id'];

	          })
	          .catch(errors => this.errors.add(errors));
    } else {
      calculoAtrasado.id = this.route.snapshot.params['id_calculo'];
    	this.Calculo
    		.update(calculoAtrasado)
    		.then(model => {
	  			window.location.href='#/beneficios/beneficios-calculos/'+this.route.snapshot.params['id'];
		  }).catch(errors => console.log(errors));
    }
    swal('Sucesso', 'Cálculo salvo com sucesso','success');
  }

  loadCalculo(calculoAtrasado) {
  	// Data do cálculo:
    this.dataCalculo = this.formatReceivedDate(calculoAtrasado.data_calculo_pedido);
    // Data da citação do réu
    this.dataAcaoJudicial = this.formatReceivedDate(calculoAtrasado.data_acao_judicial);
    // Data da ajuizamento da ação:
    this.dataCitacaoReu = this.formatReceivedDate(calculoAtrasado.data_citacao_reu);
    // CONDICIONAL
    let dataPedidoBeneficio = calculoAtrasado.data_pedido_beneficio;
    // RMI de valores Recebidos
    this.rmiValoresRecebidos = calculoAtrasado.valor_beneficio_concedido;
    // RMI de valores recebidos depois da revisão (Buraco Negro)
    this.rmiValoresRecebidosBuracoNegro = calculoAtrasado.valor_beneficio_concedido_revisao;
    // Nova RMI de valores devidos
    this.rmiValoresDevidos = calculoAtrasado.valor_beneficio_esperado;
    // RMI de valores devidos depois da revisão (Buraco Negro)
    this.rmiValoresDevidosBuracoNegro = calculoAtrasado.valor_beneficio_esperado_revisao;
    // CheckBox Beneficio Não Concedido
    this.chkNotGranted = calculoAtrasado.beneficio_nao_concedido;
    // Data de Cessação dos Valores Recebidos
    this.cessacaoValoresRecebidos = this.formatReceivedDate(calculoAtrasado.data_cessacao);
    // CheckBoc Juros de Mora
    this.chkJurosMora = calculoAtrasado.previo_interesse;
    // CONDICIONAL
    let data_anterior_pedido_beneficio = calculoAtrasado.data_anterior_pedido_beneficio;
    // Percentual dos Honorarios
    this.percentualHonorarios = calculoAtrasado.percentual_taxa_advogado.toString().replace('.',',');
    // Intervalo de Honorarios DE
    this.dataHonorariosDe = this.formatReceivedDate(calculoAtrasado.taxa_advogado_inicio);
    // Intervalo de Honorarios ATE 
    this.dataHonorariosAte = this.formatReceivedDate(calculoAtrasado.taxa_advogado_final);
    // Calcular Mais (Vincendos)
    this.maturidade = calculoAtrasado.maturidade;
    // Juros anterior a janeiro 2003
    if (calculoAtrasado.previo_interesse_2003 != null)
    this.jurosAntes2003 = calculoAtrasado.previo_interesse_2003.toString().replace('.',',');
    // Juros posterior a janeiro 2003
    if (calculoAtrasado.pos_interesse_2003 != null)
    this.jurosDepois2003 = calculoAtrasado.pos_interesse_2003.toString().replace('.',',');
    // Juros posterior a julho 2009
    if (calculoAtrasado.pos_interesse_2009 != null)
      this.jurosDepois2009 = calculoAtrasado.pos_interesse_2009.toString().replace('.',',');
    // Espécie valores devidos
    this.especieValoresDevidos = calculoAtrasado.tipo_aposentadoria;
    // CheckBox tetos judiciais em 12/1998 e em 12/2003 (indisponivel para calculo comum)
    if (calculoAtrasado.aplicar_ajuste_maximo_98_2003) {
      this.type = 'AJ';
    }
    this.chkAjusteMaximo = calculoAtrasado.aplicar_ajuste_maximo_98_2003;
    // Percentual do Acordo Judicial
    if (calculoAtrasado.acordo_pedido != null)
      this.acordoJudicial = calculoAtrasado.acordo_pedido.toString().replace('.',',');
    // checkBox Não Limitar Teto para demandas Judiciais
    this.chkDemandasJudiciais = calculoAtrasado.nao_aplicar_ajuste_maximo_98_2003;
    // Data inicial do benefício DIB de valores devidos
    this.dibValoresDevidos = this.formatReceivedDate(calculoAtrasado.data_pedido_beneficio_esperado);
    // Data inicial do benefício anterior de valores devidos
    this.dibAnteriorValoresDevidos = this.formatReceivedDate(calculoAtrasado.previa_data_pedido_beneficio_esperado);
    // Data de Cessação de valores devidos
    this.cessacaoValoresDevidos = this.formatReceivedDate(calculoAtrasado.data_prevista_cessacao);
    // Espécie valores recebidos
    this.especieValoresRecebidos = calculoAtrasado.tipo_aposentadoria_recebida;
    // CheckBox Beneficio Precedido com DIB Anterior (recebidos)
    this.chkPrecedidoRecebidos = calculoAtrasado.concedido_anterior_dib;
    // CheckBox Beneficio Precedido com DIB Anterior (devidos)
    this.chkDibAnterior = calculoAtrasado.esperado_anterior;

    if (calculoAtrasado.taxa_ajuste_maxima_concedida != null)
      this.taxaAjusteMaximaConcedida = calculoAtrasado.taxa_ajuste_maxima_concedida.toString().replace('.',',');
    if (calculoAtrasado.taxa_ajuste_maxima_esperada != null)
      this.taxaAjusteMaximaEsperada = calculoAtrasado.taxa_ajuste_maxima_esperada.toString().replace('.',',');


  	if (this.chkNotGranted || this.chkUseSameDib) {
  		// Valores Devidos
  		this.dibValoresDevidos = this.formatReceivedDate(dataPedidoBeneficio);
  		this.dibAnteriorValoresDevidos = this.formatReceivedDate(data_anterior_pedido_beneficio);
  	} else {
  		// Valores Recebidos
  		this.dibValoresRecebidos = this.formatReceivedDate(dataPedidoBeneficio);
  		this.dibAnteriorValoresRecebidos = this.formatReceivedDate(data_anterior_pedido_beneficio);
  	}

    this.dibValoresDevidosChanged();
    this.dibValoresRecebidosChanged();
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
    } else if (this.compareDates(this.dataCalculo,this.dataMinima)) {
      this.errors.add({"dataCalculo":["A data do Cálculo deve ser posterior a 01/01/1970."]})
      valid = false;
    }

    if (this.isEmptyInput(this.dataAcaoJudicial)) {
     this.errors.add({"dataAcaoJudicial":["A data da Ação Jucidical é Necessária."]});
     valid = false; 
    } else if (!this.isValidDate(this.dataAcaoJudicial)) {
      this.errors.add({"dataAcaoJudicial":["Insira uma data Válida."]});
      valid = false;
    } else if (this.compareDates(this.dataAcaoJudicial,this.dataMinima)) {
      this.errors.add({"dataAcaoJudicial":["A data deve ser posterior a 01/01/1970."]})
      valid = false;
    }

    if (this.isEmptyInput(this.dataCitacaoReu)) {
     this.errors.add({"dataCitacaoReu":["A data da Citação do Réu é Necessária."]});
     valid = false; 
    } else if (!this.isValidDate(this.dataCitacaoReu)) {
      this.errors.add({"dataCitacaoReu":["Insira uma data Válida."]});
      valid = false;
    } else if (this.compareDates(this.dataCitacaoReu,this.dataMinima)) {
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
        } else if (this.compareDates(this.dibValoresRecebidos,this.dataMinima)) {
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
        } else if (this.compareDates(this.dibAnteriorValoresRecebidos,this.dataMinima)){
          this.errors.add({"dibAnteriorValoresRecebidos":["A data deve ser maior que 01/1970"]});
          valid = false; 
        }
      }


      if (!this.isEmptyInput(this.cessacaoValoresRecebidos)) {
        
        if (!this.isValidDate(this.cessacaoValoresRecebidos)) {
          this.errors.add({"cessacaoValoresRecebidos":["Insira uma data válida."]});
          valid = false; 
        } else if(this.compareDates(this.cessacaoValoresRecebidos,this.dataMinima)) {
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
    } else if (this.compareDates(this.dibValoresDevidos,this.dataMinima)) {
      this.errors.add({"dibValoresDevidos":["Insira uma data Válida."]});
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
      } else if (this.compareDates(this.dibAnteriorValoresDevidos,this.dataMinima)) {
        this.errors.add({"dibAnteriorValoresDevidos":["A data deve ser maior que 01/1970."]});
        valid = false; 
      }
    }
    

    if (!this.isEmptyInput(this.cessacaoValoresDevidos)) {

      if (!this.isValidDate(this.cessacaoValoresDevidos)) {
        this.errors.add({"cessacaoValoresDevidos":["Insira uma data válida."]});
        valid = false; 
      } else if (this.compareDates(this.cessacaoValoresDevidos,this.dataMinima)){
        this.errors.add({"cessacaoValoresDevidos":["A data deve ser maior que 01/1970."]});
        valid = false;
      }
    }


    if (!this.isEmptyInput(this.dataHonorariosDe) || !this.isEmptyInput(this.dataHonorariosAte)){
      if (!this.isValidDate(this.dataHonorariosDe)) {
        this.errors.add({"dataHonorariosDe":["Insira uma data válida."]});
        valid = false; 
      } else {
        if (this.compareDates(this.dataHonorariosDe,this.dataMinima)) {
          this.errors.add({"dataHonorariosAte":["A data deve ser maior que 01/1970"]});
          valid = false;
        }
      }

      if (!this.isValidDate(this.dataHonorariosAte)) {
        this.errors.add({"dataHonorariosAte":["Insira uma data válida."]});
        valid = false;
      } else {
        
        if (this.compareDates(this.dataHonorariosAte,this.dataMinima)) {
          this.errors.add({"dataHonorariosAte":["A data deve ser maior que 01/1970"]});
          valid = false;
        }

        if (this.isValidDate(this.dataHonorariosDe)) {
          if(this.compareDates(this.dataHonorariosAte,this.dataHonorariosDe)) {
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

  getFormatedDate(date: Date) {

  	var dd:any = date.getDate();
  	var mm:any = date.getMonth()+1; //January is 0!

  	var yyyy = date.getFullYear();

  	var today = ('0'+dd).slice(-2)+'/' +
                ('0'+mm).slice(-2)+'/'+yyyy;
  	return today;
  }

	formatReceivedDate(inputDate) {
    	var date = new Date(inputDate);
    	if (!isNaN(date.getTime())) {
        	// Months use 0 index.
        	return  ('0' + (date.getDate() +1)).slice(-2)+'/'+
                  ('0' + (date.getMonth()+1)).slice(-2)+'/'+
                         date.getFullYear();
    	}
    	return '';
	}

  isEmptyInput(input) {
    if (input == '' || input === undefined)
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

  editSegurado() {
    window.location.href='/#/beneficios/beneficios-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

  // return true if date1 is before or igual date2
  compareDates(date1, date2) {
    var bits1 = date1.split('/');
    var d1 = new Date(bits1[2], bits1[1] - 1, bits1[0]);
    var bits2 = date2.split('/');
    var d2 = new Date(bits2[2], bits2[1] - 1, bits2[0]);
    return d1 <= d2;
  }


}
