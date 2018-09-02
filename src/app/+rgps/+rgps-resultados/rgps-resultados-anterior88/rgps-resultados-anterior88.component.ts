import { Component, OnInit, Input } from '@angular/core';
import {FadeInTop} from "../../../shared/animations/fade-in-top.decorator";
import { CalculoRgps as CalculoModel } from '../../+rgps-calculos/CalculoRgps.model';
import { CalculoRgpsService } from '../../+rgps-calculos/CalculoRgps.service';
import { MoedaService } from '../../../services/Moeda.service';
import { Moeda } from '../../../services/Moeda.model';
import { IndiceInps } from '../IndiceInps.model';
import { IndiceInpsService } from '../IndiceInps.service';
import { SalarioMinimoMaximo } from '../SalarioMinimoMaximo.model';
import { SalarioMinimoMaximoService } from '../SalarioMinimoMaximo.service';
import { ValorContribuidoService } from '../../+rgps-valores-contribuidos/ValorContribuido.service'
import { RgpsResultadosComponent } from '../rgps-resultados.component'
import * as moment from 'moment';

@Component({
  selector: 'app-rgps-resultados-anterior88',
  templateUrl: './rgps-resultados-anterior88.component.html',
  styleUrls: ['./rgps-resultados-anterior88.component.css']
})
export class RgpsResultadosAnterior88Component extends RgpsResultadosComponent implements OnInit {

	@Input() calculo;
	@Input() segurado;
	@Input() isBlackHole;

  public boxId;
	public inpsList;
	public salarioMinimoMaximo;
	public idCalculo;
	public dataInicioBeneficio;
	public tipoBeneficio;
	public moeda;
	public isUpdating = false;
	public conclusoes = {};
  public tableData = [];
  public erro = '';
  public valorExportacao;
  public idadeSegurado;
  public contribuicaoPrimaria = {anos:0,meses:0,dias:0};
  public contribuicaoSecundaria = {anos:0,meses:0,dias:0};
  public listaValoresContribuidos;
  public tableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.tableData,
    columns: [
      {data: 'competencia'},
      {data: 'contribuicao_primaria'},
      {data: 'contribuicao_secundaria'},
      {data: 'inps'},
      {data: 'contribuicao_primaria_revisada'},
      {data: 'contribuicao_secundaria_revisada'},
    ] 
  };

  constructor(protected ValoresContribuidos: ValorContribuidoService,
    private Moeda: MoedaService,
    private IndiceInps: IndiceInpsService,
    private SalarioMinimoMaximo: SalarioMinimoMaximoService,
    ) {super(null, null, null, null);}

  ngOnInit(){
    this.boxId = this.generateBoxId();
  	this.isUpdating = true;
  	this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
  	this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);
  	this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
  	this.idCalculo = this.calculo.id;
  	this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);
  	this.idadeSegurado = this.getIdadeSegurado();
  	let mesesLimite = 0;
    let mesesLimiteTotal = 0;
    if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
      mesesLimite = 18;
      mesesLimiteTotal = 12;
    } else {
      mesesLimite = 48;
      mesesLimiteTotal = 36;
    }

    let dataLimite;
    if(mesesLimite > 0){
      dataLimite = (this.dataInicioBeneficio.clone()).add(-mesesLimite,'months');
    }else{
      dataLimite = moment('1994-07-01');
    }


  	this.ValoresContribuidos.getByCalculoId(this.idCalculo, this.dataInicioBeneficio, dataLimite)
  		.then(valorescontribuidos => {
      	this.listaValoresContribuidos = valorescontribuidos;
        if(this.listaValoresContribuidos.length == 0) {
          // Exibir MSG de erro e encerrar Cálculo.
          this.erro = "Nenhuma contribuição encontrada em até 48 meses para este cálculo <a href='http://www.ieprev.com.br/legislacao/4506/decreto-no-83.080,-de-24-1-1979' target='_blank'>Art. 37 da Decreto nº 83.080, de 24/01/1979</a>";
          this.isUpdating = false;
        }else{
          let primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
          this.Moeda.getByDateRange(primeiraDataTabela, moment())
            .then((moeda: Moeda[]) => {
              this.moeda = moeda;
              this.IndiceInps.getByDate(this.dataInicioBeneficio.clone().startOf('month'))
                .then(indices => {
                  this.inpsList = indices;
                  this.SalarioMinimoMaximo.getByDate((this.dataInicioBeneficio.clone()).startOf('month'))
                    .then(salario => {
                      this.salarioMinimoMaximo = salario[0];
                      this.erro = this.verificaErros();
                      if(!this.erro){
                        this.calculoAnterior88(this.conclusoes);
                      }
                      this.isUpdating = false;
                  });
              });
          });
        }
  	});
  }

  verificaErros(){
    let erro = "";
    let anoContribuicaoPrimariaAnterior88 = this.contribuicaoPrimaria.anos;
    if ((this.calculo.tipo_seguro == "Aposentadoria por Idade (Rural)" ||
         this.calculo.tipo_seguro == "Aposentadoria por idade (Urbano)") && this.calculo.carencia < 60){
      erro = "Falta(m) "+ (60 - this.calculo.carencia) + " mês(es) para a carencia necessária.";
    }else if(this.segurado.sexo == 'h' && this.idadeSegurado < 65 && (this.tipoBeneficio == 3 || this.tipoBeneficio == 16)){
      erro = "O segurado não tem a idade mínima (65 anos) para se aposentar por idade. Falta(m) " + (65 - this.idadeSegurado) + " ano(s) para atingir a idade mínima."
    }else if(this.segurado.sexo == 'm' && this.idadeSegurado < 60 && (this.tipoBeneficio == 3 || this.tipoBeneficio == 16)){
      erro = "O segurado não tem a idade mínima (60 anos) para se aposentar por idade. Falta(m) " + (60 - this.idadeSegurado) + " ano(s) para atingir a idade mínima."
    }else if(this.calculo.tipo_seguro == "Aposentadoria por tempo de serviço" && 
             anoContribuicaoPrimariaAnterior88 < 30){
      //TODO: Colocar mensagem completa :
      //Falta(m) "quantidade de anos que faltam" ano(s), "Quantidade de meses que faltam" mês(es) e quantidade de dia(s) para completar o tempo de serviço necessário.
      erro = "Erro no tempo de contibuição";
    }else if (this.listaValoresContribuidos.length == 0){
      erro = "Nenhuma contribuição encontrada em até 48 meses para este cálculo <a href='http://www.ieprev.com.br/legislacao/4506/decreto-no-83.080,-de-24-1-1979' target='_blank'>Art. 37 da Decreto nº 83.080, de 24/01/1979</a>"
    }
    return erro;
  }

  calculoAnterior88(conclusoes){
    let index = 0;
    let mesPrimario = 0;
    let mesSecundario = 0;
    let tableData = [];
    let currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
    let totalPrimario = 0;
    let totalSecundario = 0;
    let anoPrimario = this.contribuicaoPrimaria.anos;
    let anoSecundario = this.contribuicaoSecundaria.anos;

    for(let contribuicao of this.listaValoresContribuidos){
      let valorPrimario = parseFloat(contribuicao.valor_primaria);
      let valorSecundario = parseFloat(contribuicao.valor_secundaria);
      let dataContribuicao = moment(contribuicao.data);
      let currency = this.loadCurrency(dataContribuicao);

      if(valorSecundario){
        mesSecundario++;
      }else{
        valorSecundario = 0;
      }
      
      let contribuicaoPrimariaString = this.formatMoney(valorPrimario, currency.acronimo);
      let contribuicaoSecundariaString = (!this.isBlackHole) ? this.formatMoney(valorSecundario, currency.acronimo) : "";
      let inps = this.getInps(dataContribuicao.year());

      let valorAjustadoObj = this.limitarTetosEMinimos(valorPrimario, dataContribuicao);
      valorPrimario = valorAjustadoObj.valor;
      let limiteString = valorAjustadoObj.aviso;

      if (index > 11 && inps != null) {
        valorPrimario *= inps;
      }
      valorPrimario = this.convertCurrency(valorPrimario, dataContribuicao, this.dataInicioBeneficio);
        if (valorSecundario > 0){
        valorSecundario = (this.limitarTetosEMinimos(valorSecundario, dataContribuicao)).valor;
      }

      if (index > 11 && inps != null) {
        valorSecundario *= inps;
      }
      valorSecundario = this.convertCurrency(valorSecundario, dataContribuicao, this.dataInicioBeneficio);
      totalPrimario += valorPrimario;
      totalSecundario += valorSecundario;
      let inpsString = '';
      if(index > 11 && inps != null){
        inpsString = inps;
      }else{
        inpsString  = '1.00';
      }
      let contribuicaoPrimariaRevisadaString = this.formatMoney(valorPrimario, currencyDataInicioBeneficio.acronimo);
      let contribuicaoSecundariaRevisadaString = (!this.isBlackHole) ? this.formatMoney(valorSecundario, currencyDataInicioBeneficio.acronimo) : '';
      let line = {competencia: dataContribuicao.format('MM/YYYY'),
              contribuicao_primaria: contribuicaoPrimariaString,
              contribuicao_secundaria: contribuicaoSecundariaString,
              inps: this.formatDecimal(inpsString,2),
              contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
              contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString,
              limite: limiteString};
      tableData.push(line);
      index++;
    }
    let somaContribuicoes = totalPrimario + totalSecundario;
    let mediaContribuicoesPrimaria = totalPrimario / index;
    let mediaContribuicoesSecundaria = 0;
    if(totalSecundario > 0){
      if((this.tipoBeneficio == 4 || this.tipoBeneficio == 6) && anoSecundario != 0 && mesSecundario != 0){
        mediaContribuicoesSecundaria = totalSecundario / (mesSecundario) * (anoSecundario / 30.0);
      }else if(anoSecundario != 0 && mesSecundario != 0){
        let lackAux = 0;
        if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
          lackAux = 12;
        } else {
          lackAux = 60;
        }
        mediaContribuicoesSecundaria = totalSecundario * (mesSecundario / lackAux); 
      }
    }

    let mediaTotal = mediaContribuicoesPrimaria + mediaContribuicoesSecundaria;
    let rmi = this.calculateRMI(mediaTotal,somaContribuicoes, conclusoes);

    // Exibir as conclusões:
    conclusoes.total_contribuicoes_primarias = this.formatMoney(totalPrimario, currencyDataInicioBeneficio.acronimo);
    conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaContribuicoesPrimaria, currencyDataInicioBeneficio.acronimo);
    if(totalSecundario > 0){
      conclusoes.total_contribuicoes_secundarias = this.formatMoney(totalSecundario, currencyDataInicioBeneficio.acronimo);
      conclusoes.media_contribuicoes_secundarias = this.formatMoney(mediaContribuicoesSecundaria, currencyDataInicioBeneficio.acronimo);
      conclusoes.divisor_calculo_media_secundaria = mesSecundario;
    }
    conclusoes.divisor_calculo_media = index;
    conclusoes.media_contribuicoes = this.formatMoney(mediaTotal,currencyDataInicioBeneficio.acronimo);
    conclusoes.renda_mensal_inicial = this.formatMoney(rmi, currencyDataInicioBeneficio.acronimo);
    this.valorExportacao = this.formatDecimal(rmi, 2).replace(',', '.');
    this.tableData = tableData;
    this.tableOptions = {
      ...this.tableOptions,
      data: this.tableData,
    }
  }

  calculateRMI(mediaTotal, somaContribuicoes, conclusoes){
    let currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
    let dataSalario = (this.dataInicioBeneficio.clone()).startOf('month');
    //let dataSalarioMoedaIndex = this.getIndex(dataSalario);
    let limitesSalariais = this.getLimitesSalariais(dataSalario);
    let grupoDos12 = this.calculo.grupo_dos_12;

    conclusoes.maior_valor_teto = this.formatMoney(limitesSalariais.maximo, currencyDataInicioBeneficio.acronimo);
    conclusoes.menor_valor_teto = this.formatMoney(limitesSalariais.minimo, currencyDataInicioBeneficio.acronimo);
    
    let anoContribuicao = this.calculo.contribuicao_primaria_98.split('-')[0];

    let indiceEspecie = this.getIndiceEspecie(this.tipoBeneficio, this.segurado.sexo, anoContribuicao); // Seção 1.1.4
    let rmi = 0;
    if(mediaTotal >= limitesSalariais.minimo) {
      let primeiraParcela = indiceEspecie * limitesSalariais.minimo;
      if(limitesSalariais.maximo <= mediaTotal){
        mediaTotal = limitesSalariais.maximo;
      }
      // Calculo do valor do excedente
      let excedente = mediaTotal - limitesSalariais.minimo;
      let segundaParcela = (grupoDos12 / 30) * excedente;
      if(segundaParcela > (0.8 * excedente)){
        segundaParcela = 0.8 * excedente;
      }
      let somaParcelas = primeiraParcela + segundaParcela;
      if(somaParcelas > (0.9 * limitesSalariais.maximo)){
        rmi = (0.9 * limitesSalariais.maximo);
      }else{
        rmi = somaParcelas;
      }
      //Inserir nas conclusões
      conclusoes.primeira_parcela_rmi = this.formatMoney(primeiraParcela, currencyDataInicioBeneficio.acronimo);
      conclusoes.grupo_dos_12 =  grupoDos12;
      conclusoes.valor_excedente = this.formatMoney(excedente, currencyDataInicioBeneficio.acronimo);
      conclusoes.segunda_parcela_rmi = this.formatMoney(segundaParcela, currencyDataInicioBeneficio.acronimo);
      conclusoes.oitenta_porcento_valor_excedente = this.formatMoney((0.8 * excedente), currencyDataInicioBeneficio.acronimo);
      conclusoes.noventa_porcento_maior_valor_teto = this.formatMoney((0.9 * limitesSalariais.maximo),currencyDataInicioBeneficio.acronimo) ;
    } else {
      rmi = indiceEspecie * mediaTotal;
    }

    let indiceSalarioMinimo = this.getIndiceSalarioMinimo(this.tipoBeneficio, anoContribuicao);
    let valorSalarioMinimo = indiceSalarioMinimo * (this.Moeda.getByDate(dataSalario)).salario_minimo;
    if (rmi > (0.95 * mediaTotal)) {
        rmi = 0.95 * mediaTotal;
    } else if (rmi < valorSalarioMinimo) {
        rmi = valorSalarioMinimo;
    }
    conclusoes.porcentagem_calculo_beneficio = indiceEspecie * 100;
    conclusoes.beneficio_minimo_com_indice =  this.formatMoney(valorSalarioMinimo, currencyDataInicioBeneficio.acronimo);
    conclusoes.noventaecinco_porcento_valor_da_media = this.formatMoney((0.95*mediaTotal), currencyDataInicioBeneficio.acronimo);

    // TODO: Nesse momento Salvar o valor da RMI e da somaContribuições no BD do calculo.
    return rmi;
  }

  getInps(year){
    if(this.inpsList){
      for(let inps of this.inpsList){
        if(inps.ano == year){
          return inps.valor;
        }
      }
      return null;
    }
    return null;
  }

  getLimitesSalariais(data){
    let ret = {minimo: this.salarioMinimoMaximo.minimum_salary_ammount, maximo: this.salarioMinimoMaximo.maximum_salary_ammount};
    return ret;
  }

  getIndiceSalarioMinimo(especie, anoContribuicao){
  	let index = 0.0;
  	if (especie === 1){
  		index = 0.75;
  	} else if ((especie > 1 && especie <= 5) || especie === 16){
  		index = 0.9;
  	} else if (especie === 20){
  		index = 0.25;
  		if (anoContribuicao >= 30 && anoContribuicao < 35){
        index = 0.2;
      }
  	}
    return index;
	}

	getIndiceEspecie(especie, sexo, anoContribuicao){
		let indiceAno = 0.0
    if (anoContribuicao != 0 ) {
        indiceAno = anoContribuicao / 100;
    }

    let index = 0.0;
    switch (especie){
      case 1: {// Auxílio Doença
      	index = 0.7;
        if (indiceAno > 0.2){
        	indiceAno = 0.2;
        }
        index += indiceAno;
        break;
      }
      case 2: {// Aposentadoria por invalidez
      	index = 0.7;
      	if (indiceAno > 0.3){
      	    indiceAno = 0.3;
      	}
      	index += indiceAno;
      	break;
      }
      case 3: { // Idade - trabalhador Rural
        index = 0.7;
        if (indiceAno > 0.25) {
        	indiceAno = 0.25;
        }
        index += indiceAno;
        break;
      }
      case 5: { // Idade - trabalhador Urbano
        index = 0.7;
        if (indiceAno > 0.25){
					indiceAno = 0.25;
				}
        index += indiceAno;
      	break;
      }
      case 16: {//Aposentadoria Especial.
      	index = 0.7;
        if (indiceAno > 0.25){
        	indiceAno = 0.25;
        }
        index += indiceAno;
        break;
      }
      case 4: {  // Aposentadoria por tempo de contribuição
      	if(sexo === 'm'){
      	  index = 0.8;
      	  let indiceAnoAux = anoContribuicao - 30;
      	  if(indiceAnoAux > 5){
      	  	indiceAnoAux = 5;
      	  }
      	  if(indiceAnoAux < 0){
      	  	indiceAnoAux = 0;
      	  }
      	  index += (0.03 * indiceAnoAux);
      	}else{
      	    index = 0.95;
      	}
      	break;
      }
      case 20: { 
        index = 0.2;
        break;
      }
      default:{
      	index = 0;
      	break;
      }
    }
    return index;
  }

  limitarTetosEMinimos(valor, data){
    let moeda = this.Moeda.getByDate(data);
    let salarioMinimo = moeda.salario_minimo;
    let tetoSalarial = moeda.teto;
    let avisoString = '';
    let valorRetorno = valor;

    if(valor < salarioMinimo){
      valorRetorno = salarioMinimo;
      avisoString = 'LIMITADO AO MÍNIMO'
    }else if(valor > tetoSalarial){
      valorRetorno = tetoSalarial;
      avisoString = 'LIMITADO AO TETO'
    }
    return {valor:valorRetorno, aviso:avisoString};
  }
}
