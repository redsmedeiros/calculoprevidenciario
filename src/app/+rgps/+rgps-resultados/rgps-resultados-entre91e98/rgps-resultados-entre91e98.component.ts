import { Component, OnInit, Input } from '@angular/core';
import { CarenciaProgressiva } from '../CarenciaProgressiva.model';
import { CarenciaProgressivaService } from '../CarenciaProgressiva.service';
import { ReajusteAutomatico } from '../ReajusteAutomatico.model';
import { ActivatedRoute } from '@angular/router';
import { ReajusteAutomaticoService } from '../ReajusteAutomatico.service';
import { CalculoRgps as CalculoModel } from '../../+rgps-calculos/CalculoRgps.model';
import { CalculoRgpsService } from '../../+rgps-calculos/CalculoRgps.service';
import { ValorContribuidoService } from '../../+rgps-valores-contribuidos/ValorContribuido.service'
import { RgpsResultadosComponent } from '../rgps-resultados.component'
import { MoedaService } from '../../../services/Moeda.service';
import { Moeda } from '../../../services/Moeda.model';
import * as moment from 'moment';

@Component({
  selector: 'app-rgps-resultados-entre91e98',
  templateUrl: './rgps-resultados-entre91e98.component.html',
  styleUrls: ['./rgps-resultados-entre91e98.component.css']
})
export class RgpsResultadosEntre91e98Component extends RgpsResultadosComponent implements OnInit {
	@Input() calculo;
	@Input() segurado;
	@Input() tipoCalculo;

  public boxId;
	public isUpdating = false;
	public idCalculo;
	public tipoBeneficio;
	public dataInicioBeneficio;
	public stringCabecalho;
	public moeda;
	public idadeSegurado;
	public conclusoes = {};
  public tableData = [];
  public listaValoresContribuidos;
  public carenciasProgressivas;
  public reajustesAutomaticos;
  public valorExportacao;
  public contribuicaoPrimaria = {anos:0,meses:0,dias:0};
  public contribuicaoSecundaria = {anos:0,meses:0,dias:0};
  public coeficiente;
  public erros = [];
  public tableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.tableData,
    columns: [
      {data: 'competencia'},
      {data: 'fator'},
      {data: 'contribuicao_primaria'},
      {data: 'contribuicao_secundaria'},
      {data: 'contribuicao_primaria_revisada'},
      {data: 'contribuicao_secundaria_revisada'},
      {data: 'limite'},
    ] 
  };

  public reajustesAdministrativos = true;
  public showReajustesAdministrativos = false;
  public reajustesAdministrativosTableData = [];
  public reajustesAdministrativosTableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.reajustesAdministrativosTableData,
    columns: [
      {data: 'competencia'},
      {data: 'reajuste'},
      {data: 'beneficio'},
      {data: 'limite'},
    ] 
  };

  constructor(private CarenciaProgressiva:CarenciaProgressivaService,
    private ReajusteAutomatico:ReajusteAutomaticoService,
    protected ValoresContribuidos: ValorContribuidoService,
    private Moeda: MoedaService,
    private CalculoRgpsService:CalculoRgpsService,
    protected rt: ActivatedRoute,) { super(null, null, null, null);}

  ngOnInit() {
    if(this.rt.snapshot.queryParams['withINPC'] == 'true'){
      this.reajustesAdministrativos = false;
    }else{
      this.reajustesAdministrativos = true;
    }

    this.boxId = this.generateBoxId();
  	this.isUpdating = true;
  	this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
  	this.idadeSegurado = this.getIdadeSegurado();
  	if(this.tipoCalculo == '91_98'){
  		this.stringCabecalho = 'Entre 05/04/1991 e 15/12/1998'
  		this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
  		this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);
  	}else if(this.tipoCalculo == '98_99'){
  		this.stringCabecalho = 'Entre 16/12/1998 e 28/11/1999'
  		this.contribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_99);
  		this.contribuicaoSecundaria = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_99);
  	}

  	this.idCalculo = this.calculo.id;
  	this.tipoBeneficio = this.getEspecieBeneficio(this.calculo);
		let dataInicio = this.dataInicioBeneficio;
    if (this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999' && 
      this.dataInicioBeneficio > this.dataDib99) {
      dataInicio = this.dataDib99;
    }
    if (this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998' &&
      this.dataInicioBeneficio > this.dataDib98) {
      dataInicio = this.dataDib98;
    }

    dataInicio = (dataInicio.clone()).startOf('month');

    let mesesLimite = 0;
    let mesesLimiteTotal = 0;
    if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
      mesesLimite = 18;
      mesesLimiteTotal = 12;
    } else {
      mesesLimite = 48;
      mesesLimiteTotal = 36;
    }
    if(this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998'){
      mesesLimite = 36;
      mesesLimiteTotal = 48;
    }
    let dataLimite;
    if(mesesLimite > 0){
      dataLimite = (dataInicio.clone()).add(-mesesLimite,'months');
    }else{
      dataLimite = moment('1994-07-01');
    }

  	this.ValoresContribuidos.getByCalculoId(this.idCalculo, dataInicio, dataLimite)
  		.then(valorescontribuidos => {
      	this.listaValoresContribuidos = valorescontribuidos;
        if(this.listaValoresContribuidos.length == 0) {
          // Exibir MSG de erro e encerrar Cálculo.
          this.erros.push("Nenhuma contribuição encontrada em 48 meses anteriores a DIB conforme " + "<a href=\"http://www.ieprev.com.br/legislacao/10634/lei-no-8.213,-de-24-7-1991---atualizada-ate-dezembro-2008#art29\" target='_blank'>Art. 29 da Lei nº 8.213, de 24/7/1991</a>");
          this.isUpdating = false;
        }else{
          let primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
          this.Moeda.getByDateRange(primeiraDataTabela, moment())
            .then((moeda: Moeda[]) => {
              this.moeda = moeda;
              let dataReajustesAutomaticos = this.dataInicioBeneficio;
              if(this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998'){
                dataReajustesAutomaticos = this.dataDib98;
              }else if(this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999'){
                dataReajustesAutomaticos = this.dataDib99;
              }
              this.ReajusteAutomatico.getByDate(dataReajustesAutomaticos, this.dataInicioBeneficio)
                .then(reajustes => {
                  this.reajustesAutomaticos = reajustes;
                  this.CarenciaProgressiva.getCarencias()
                    .then(carencias => {
                      this.carenciasProgressivas = carencias;
                      this.calculo91_98(this.erros, this.conclusoes, this.contribuicaoPrimaria, this.contribuicaoSecundaria);
                      this.isUpdating = false;
                  });
              });
          });
        }
      	    	
  	});
  }

  calculo91_98(errorArray, conclusoes, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria){
    let dib = this.dataInicioBeneficio;
    let dibCurrency = this.loadCurrency(dib);

    if (this.calculo.tipoAposentadoria == 'Entre 16/12/1998 e 28/11/1999' && 
        this.dataInicioBeneficio > this.dataDib99) {
        dib = this.dataDib99;
    }
    if (this.calculo.tipoAposentadoria == 'Entre 05/04/1991 e 15/12/1998' &&
        this.dataInicioBeneficio > this.dataDib98) {
        dib = this.dataDib98;
    }

    let dataComparacao = (dib.clone()).startOf('month');
    if (this.reajustesAdministrativos) {
      dataComparacao = (this.dataInicioBeneficio.clone()).startOf('month');
    }

    let dibPrimeiro = (dib.clone()).startOf('month');

    let moedaComparacao = this.Moeda.getByDate(dataComparacao);
    let moedaDIB = this.Moeda.getByDate(dib);

    if (!this.direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria)){
      return;
    }
    let totalPrimaria = 0;
    let totalSecundaria = 0;

    let contagemSecundaria = 0;
    let contagemPrimaria = 0;
    let tableData = [];

    for(let contribuicao of this.listaValoresContribuidos) {
      contagemPrimaria++;
      
      let valorPrimario = parseFloat(contribuicao.valor_primaria);
      let valorSecundario = parseFloat(contribuicao.valor_secundaria);
      let dataContribuicao = moment(contribuicao.data);
        
      let contribuicaoPrimaria = 0;
        
      if (valorPrimario != null){
        contribuicaoPrimaria = valorPrimario;
      }

      let contribuicaoSecundaria = 0;
      if (valorSecundario != null){
        contribuicaoSecundaria = valorSecundario;
      }

      let currency = this.loadCurrency(dataContribuicao); //Definido na seção de algortimos uteis
      
      let dataContribuicaoString = dataContribuicao.format('MM/YYYY');
      let contribuicaoPrimariaString = this.formatMoney(valorPrimario, currency.acronimo);
      let contribuicaoSecundariaString = '';

      if (!this.isBlackHole){
        contribuicaoSecundariaString = this.formatMoney(valorSecundario, currency.acronimo);
      }

      let moeda = this.Moeda.getByDate(dataContribuicao);
      let fator = moeda.fator;
      let fatorLimite = moedaComparacao.fator;
      let fatorCorrigido = fator / fatorLimite;
      let fatorCorrigidoString = this.formatDecimal(fatorCorrigido, 4);

      let valorPrimarioCorrigido = 0;
      let valorSecundarioCorrigido = 0;

      let limiteString = '';
      if (contribuicaoPrimaria != 0) {

        let valorAjustadoObj = this.limitarTetosEMinimos(contribuicaoPrimaria, dataContribuicao);
        contribuicaoPrimaria =  valorAjustadoObj.valor;
        limiteString = valorAjustadoObj.aviso;
      }

      if (contribuicaoSecundaria != 0) {
        contribuicaoSecundaria = (this.limitarTetosEMinimos(contribuicaoSecundaria, dataContribuicao)).valor;
        contagemSecundaria ++;
      }

      valorPrimarioCorrigido = contribuicaoPrimaria * fatorCorrigido;
      valorSecundarioCorrigido = contribuicaoSecundaria * fatorCorrigido;

      let valorPrimarioRevisado   = this.convertCurrency(valorPrimarioCorrigido  , dataContribuicao, dib);
      let valorSecundarioRevisado = this.convertCurrency(valorSecundarioCorrigido, dataContribuicao, dib);

      totalPrimaria += valorPrimarioRevisado;
      totalSecundaria += valorSecundarioRevisado;

      let contribuicaoPrimariaRevisadaString = this.formatMoney(valorPrimarioRevisado, dibCurrency.acronimo);
      let contribuicaoSecundariaRevisadaString = "";
      if (!this.isBlackHole){
        contribuicaoSecundariaRevisadaString = this.formatMoney(valorSecundarioRevisado, dibCurrency.acronimo); // Acronimo da moeda após a conversão.
      }
      let line = {competencia: dataContribuicaoString,
                  contribuicao_primaria: contribuicaoPrimariaString,
                  contribuicao_secundaria: contribuicaoSecundariaString,
                  fator: fatorCorrigidoString,
                  contribuicao_primaria_revisada: contribuicaoPrimariaRevisadaString,
                  contribuicao_secundaria_revisada: contribuicaoSecundariaRevisadaString,
                  limite: limiteString};
      tableData.push(line);

    }


    if (this.tipoBeneficio == 4 || this.tipoBeneficio == 6 || this.tipoBeneficio == 5 || this.tipoBeneficio == 3 || this.tipoBeneficio == 16){
      if(contagemPrimaria < 24){
        contagemPrimaria = 24;
      }
      if(contagemSecundaria < 24){
        contagemSecundaria = 24;
      }
    }
    

    let mediaPrimaria = totalPrimaria / contagemPrimaria;
    let mediaSecundaria = 0;
    if(totalSecundaria > 0) {
      mediaSecundaria = totalSecundaria / contagemSecundaria;
    }

    let contribuicaoMedia = mediaPrimaria + mediaSecundaria;

    let rmi = (this.limitarTetosEMinimos(contribuicaoMedia, dataComparacao)).valor;

    let indiceReajuste = contribuicaoMedia / rmi;

    // Coeficiente Calculado na função direitoAposentadoria
    rmi = rmi * (this.coeficiente / 100);

    rmi = (this.limitarTetosEMinimos(rmi, dataComparacao)).valor;

    let rmiValoresAdministrativos = rmi;

    if(this.reajustesAdministrativos && 
      ((this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999' && this.dataInicioBeneficio >= this.dataDib99) ||
       (this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998' && this.dataInicioBeneficio >= this.dataDib98))){
           rmiValoresAdministrativos = this.getValoresAdministrativos(rmiValoresAdministrativos);
    }

    if (this.tipoBeneficio == 17 || //AuxilioAcidente30
        this.tipoBeneficio == 18 || //AuxilioAcidente40
        this.tipoBeneficio == 7  || //AuxilioAcidente50
        this.tipoBeneficio == 19){  //AuxilioAcidente60
        let fatorAuxilio;
        switch(this.tipoBeneficio){
          case 17:
            fatorAuxilio = 0.3;
            break;
          case 18:
            fatorAuxilio = 0.4;
            break;
          case 7:
            fatorAuxilio = 0.5;
            break;
          case 19:
            fatorAuxilio = 0.6;
            break;
        }
        let moedaAuxilio = this.Moeda.getByDate(this.dataInicioBeneficio);
        let salMinimo = moedaAuxilio.salario_minimo;

        if(contribuicaoMedia > rmiValoresAdministrativos){
          rmiValoresAdministrativos = contribuicaoMedia * fatorAuxilio;
        }else{
          rmiValoresAdministrativos = salMinimo * fatorAuxilio;
        }

        if (contribuicaoMedia > rmi){
          rmi = contribuicaoMedia * fatorAuxilio;
        }else{
          rmi = rmi * fatorAuxilio;
        }
    }

    let somaContribuicoes = totalPrimaria + totalSecundaria;

    if (this.reajustesAdministrativos) {
      this.calculo.soma_contribuicao = somaContribuicoes;
      this.calculo.valor_beneficio = rmi;
      this.CalculoRgpsService.update(this.calculo)
    }

    let currency = this.loadCurrency(dib);

    //Conclusões abaixo da tabela:
    conclusoes.total_contribuicoes_primarias = this.formatMoney(totalPrimaria, currency.acronimo);
    conclusoes.media_contribuicoes_primarias = this.formatMoney(mediaPrimaria, currency.acronimo);
    conclusoes.divisor_calculo_media = contagemPrimaria;

    if (totalSecundaria > 0)
      conclusoes.total_contribuicoes_secundarias = this.formatMoney(totalSecundaria, currency.acronimo);;
    if (mediaSecundaria > 0) {
      conclusoes.media_contribuicoes_secundarias = this.formatMoney(mediaSecundaria, currency.acronimo); 
      conclusoes.divisor_calculo_media_secundaria = contagemSecundaria;
    }

    conclusoes.media_contribuicoes = this.formatMoney(contribuicaoMedia, currency.acronimo);
    conclusoes.coeficiente = this.coeficiente;
    conclusoes.indice_reajuste_teto = indiceReajuste;
    conclusoes.salario_minimo = this.formatMoney(moedaComparacao.salario_minimo, currency.acronimo);
    conclusoes.teto = this.formatMoney(moedaComparacao.teto, currency.acronimo);
    conclusoes.renda_mensal_inicial = this.formatMoney(rmi, currency.acronimo);
    conclusoes.renda_mensal_inicial_data_dib = this.formatMoney(rmiValoresAdministrativos, currency.acronimo);
    this.valorExportacao = this.formatDecimal(rmiValoresAdministrativos, 2).replace(',', '.');
    this.tableData = tableData;
    this.tableOptions = {
      ...this.tableOptions,
      data: this.tableData,
    }
  }

  direitoAposentadoria(dib, errorArray, tempoContribuicaoPrimaria, tempoContribuicaoSecundaria){
    let idadeDoSegurado = this.idadeSegurado;
    //let tempoContribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    let redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;
    let redutorSexo = (this.segurado.sexo == 'm') ? 0 : 5;
    //let anosSecundaria = (this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98)).anos;
    let anosSecundaria = tempoContribuicaoSecundaria.anos;
    let anosPrimaria = ((tempoContribuicaoPrimaria.anos * 365) + (tempoContribuicaoPrimaria.meses * 30) + tempoContribuicaoPrimaria.dias)/365;

    let anosContribuicao = anosPrimaria;
    this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, false, dib); 

    let totalContribuicao98 = 0;
    let tempoContribuicaoPrimaria98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    if(tempoContribuicaoPrimaria98 != {anos:0, meses:0, dias:0}) {
      totalContribuicao98 = ((tempoContribuicaoPrimaria98.anos * 365) + (tempoContribuicaoPrimaria98.meses * 30) + tempoContribuicaoPrimaria98.dias) /365;
    }

    let direito = true;
    let idadeMinima = true;
    let extra;
    let toll;

    let erroString = '';
    if(this.tipoBeneficio == 4 || this.tipoBeneficio == 6){
      direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 0);
      if (!direito){
        if (dib <= this.dataDib98) {
          direito = this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, 5);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, 0, redutorProfessor, redutorSexo, true, dib); 
        }else{
          extra = this.calcularExtra(totalContribuicao98, redutorSexo);
          toll = this.calcularToll(totalContribuicao98, 0.4, 5, redutorSexo);
          this.coeficiente = this.calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, true, dib); 
          direito = this.verificarIdadeNecessaria(idadeDoSegurado, 7, 0, redutorSexo, errorArray);
          direito = direito && this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra + 5);
        }
        let contribuicao = 35 - redutorProfessor - redutorSexo - anosContribuicao;
        let tempoFracionado = this.tratarTempoFracionado(contribuicao); //Separar o tempo de contribuicao em anos, meses e dias
        if (direito) {
          // Exibir Mensagem de beneficio Proporcional, com o tempo faltante;
          //"POSSUI direito ao benefício proporcional."
          //"Falta(m) 'tempoFracionado' para possuir o direito ao benefício INTEGRAL."
          errorArray.push("POSSUI direito ao benefício proporcional. Falta(m) " + tempoFracionado + " para possuir o direito ao benefício INTEGRAL."); 
        }else{
          // Exibir Mensagem de beneficio nao concedido.
          // Falta(m) 'tempoFracionado' para completar o tempo de serviço necessário para o benefício INTEGRAL.
          errorArray.push("Falta(m) "+ tempoFracionado + " para completar o tempo de serviço necessário para o benefício INTEGRAL.");
          if (totalContribuicao98 > 0) {
            let tempo = 35 - redutorProfessor - (extra + 5) - anosContribuicao;
            let tempoProporcional = this.tratarTempoFracionado(tempo);
            // Exibir Mensagem com o tempo faltante para o beneficio proporcioanl;
            // Falta(m) 'tempoProporcional' para completar o tempo de serviço necessário para o benefício PROPORCIONAL.
             errorArray.push("Falta(m) "+ tempoProporcional + " para completar o tempo de serviço necessário para o benefício PROPORCIONAL.");
          }
        }    
      }
    }else if(this.tipoBeneficio == 3){
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
      if (!idadeMinima){ 
        return false;
      }
      if(!this.verificarCarencia(-5, redutorProfessor, redutorSexo, errorArray)){
        return false;
      }
    }else if(this.tipoBeneficio == 5){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, 0, 20);
      if(!direito) {
        errorArray.push("Não possui direito ao benefício de aposentadoria especial.");
      }
    }else if(this.tipoBeneficio == 16){
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado, errorArray);
      if (!idadeMinima){
        return false;
      }
      if (!this.verificarCarencia(0, redutorProfessor, redutorSexo, errorArray)){
        return false;
      }
    }else if(this.tipoBeneficio == 25){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 10);
      if (!direito){
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
      }
    }else if (this.tipoBeneficio == 26){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 6);
      if (!direito){
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
      }
    }else if(this.tipoBeneficio == 27){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 2);
      if (!direito){
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.   
      }
    }else if(this.tipoBeneficio == 28){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 20);
      if (!direito){
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
      if (!this.verificarIdadeMinima(idadeDoSegurado, errorArray)){
        errorArray.push("");
        return false; // Exibir Mensagem de erro com a idade faltando;
      }
    }
    return direito;
  }

  calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, proporcional, dib) {
    let coeficienteAux = 0;
    let porcentagem = 0.06;
    let coeficienteAux2 = 100;

    if(dib > this.dataDib98){
      porcentagem = 0.05;
    }
    if(proporcional) {
      let extra = this.tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, 5);
      coeficienteAux2 = 100 * this.coeficienteProporcional(extra, porcentagem, toll);
    }

    switch(this.tipoBeneficio) {
      // Auxílio Doença Previdenciário
      case 1:
        if (dib >= this.dataLei9032)
          coeficienteAux = 91;
        else if(dib >= this.dataLei8213) {
          coeficienteAux = 80 + anosContribuicao;
          if (coeficienteAux > 92) 
            coeficienteAux = 92;
        }else{  
          coeficienteAux = 80 + anosContribuicao;
        }
        break;
      // Aposentadoria por invalidez previdênciária
      case 2:
        if (dib >= this.dataLei9032)
          coeficienteAux = 100;
        else
          coeficienteAux = 80 + anosContribuicao;
        break;
      // Aponsentadoria por idade trabalhador Urbano ou Rural
      case 3:
        coeficienteAux = 70 + anosContribuicao;
        break;
      // Aposentadoria por tempo de contribuição
      case 4:
        coeficienteAux = coeficienteAux2;
        break;
      // Aposentadoria Especial
      case 5:
        if (dib >= this.dataLei9032)
            coeficienteAux = 100;
        else
            coeficienteAux = 85 + anosContribuicao;
        break;
      //Aposentadoria por tempo de serviço de professor
      case 6:
        coeficienteAux = coeficienteAux2;
        break;
      // Auxílio Acidente Previdenciário 50%
      case 7:
        coeficienteAux = 50;
        break;
      // Aponsentadoria por idade trabalhador Rural
      case 16:
        coeficienteAux = 70 + anosContribuicao;
        break;
      // Auxílio Acidente Previdenciário 30%
      case 17:
        coeficienteAux = 30;
        break;
      // Auxílio Acidente Previdenciário 40%
      case 18:
        coeficienteAux = 40;
        break;
      // Auxílio Acidente Previdenciário 60%
      case 19:
        coeficienteAux = 60;
        break;
      // Pessoa com deficiencia Grave 100%
      case 25:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia Moderada 100%
      case 26:
        coeficienteAux = 100;
        break;
      //Pessoa com deficiencia Leve 100%
      case 27:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia por Idade 70%
      case 28:
        coeficienteAux = 70 + anosContribuicao;
        break;
    }
    coeficienteAux = (coeficienteAux > 100) ? 100 : coeficienteAux;
    return coeficienteAux;
  }

  tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, extra){
    let retVal = anosContribuicao - (35 - redutorProfessor - redutorSexo - extra);
    return retVal;
  }

  verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra){
    let tempoNecessario = 35 - redutorProfessor - redutorSexo - extra;
    if (Math.trunc(anosContribuicao) < Math.trunc(tempoNecessario)) 
      return false;
    return true;
  }

  coeficienteProporcional(extra, porcentagem, toll) {
    let coeficienteProporcional = 0.7 * Math.trunc(extra - toll) * porcentagem;
    coeficienteProporcional = (coeficienteProporcional > 1) ? 1 : coeficienteProporcional;
    coeficienteProporcional = (coeficienteProporcional < 0.7) ? 0.7 : coeficienteProporcional;
    return coeficienteProporcional;
  }

  verificarIdadeMinima(idade, errorArray) {
    let temIdadeMinima = true;
    let idadeMinima;
    if(this.tipoBeneficio == 3) {
      if (this.segurado.sexo == 'm' && this.idadeSegurado < 65){
        idadeMinima = 65;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo == 'f' && this.idadeSegurado < 60){
        idadeMinima = 60;
        temIdadeMinima = false;
      }
    }else if(this.tipoBeneficio == 16 || this.tipoBeneficio == 28) {
      if (this.segurado.sexo == 'm' && this.idadeSegurado < 60){
        idadeMinima = 60;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo == 'f' && this.idadeSegurado < 55){
        idadeMinima = 55;
        temIdadeMinima = false;
      }
    }

    if(!temIdadeMinima){
      errorArray.push("O segurado não tem a idade mínima (" + idadeMinima + " anos) para se aposentar por idade. Falta(m) " + (idadeMinima - this.idadeSegurado) + " ano(s) para atingir a idade mínima.");
    }
    return temIdadeMinima;
  }

  getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo){
    let idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    let anoNecessario = (moment(this.segurado.data_nascimento, 'DD/MM/YYYY')).add(idadeNecessaria, 'years');
    return anoNecessario.year();
  }

  getValoresAdministrativos(rmi) { 
    let valorBeneficio = rmi;
    let dataAnterior = null;
    let dataCorrente = null;
    for(let reajusteAutomatico of this.reajustesAutomaticos) {
      if (dataAnterior == null){
        dataAnterior = reajusteAutomatico.data_reajuste;
      }else{
        dataAnterior = dataCorrente;
      }
      dataCorrente = reajusteAutomatico.data_reajuste;
      let reajuste = (reajusteAutomatico.indice != null) ? reajusteAutomatico.indice : 1;
      valorBeneficio = this.convertCurrency(valorBeneficio, dataAnterior, dataCorrente);
      if (this.reajustesAdministrativos) {
        valorBeneficio = valorBeneficio * reajuste;
      }
      valorBeneficio = (valorBeneficio < reajusteAutomatico.salario_minimo) ? reajusteAutomatico.salario_minimo : valorBeneficio;
      valorBeneficio = (valorBeneficio > reajusteAutomatico.teto) ? reajusteAutomatico.teto : valorBeneficio;
    }
    return valorBeneficio;
  }

  verificarCarencia(redutorIdade, redutorProfessor, redutorSexo, errorArray) {
    if (this.tipoBeneficio == 3 || this.tipoBeneficio == 16) {
      let mesesCarencia = 180;
      if (moment(this.segurado.data_filiacao, 'DD/MM/YYYY') < this.dataLei8213) { // Verificar se a data de filiação existe
        let anoNecessario = this.getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo)
        let carenciaProgressiva = this.CarenciaProgressiva.getCarencia(anoNecessario);
        if (carenciaProgressiva != 0) {
            mesesCarencia = carenciaProgressiva;
        } else if (anoNecessario < 1991) {
            mesesCarencia = 60;
        }
      }

      if (this.calculo.carencia < mesesCarencia) {
        let erroCarencia = "Falta(m) " + (mesesCarencia - this.calculo.carencia) + " mês(es) para a carência necessária.";
        errorArray.push(erroCarencia);
        return false;
      }
    }
    return true;
  }

  calcularExtra(tempoServico, redutorSexo) {
    let extra;
    if (this.tipoBeneficio == 6) {
      extra = this.calcularToll(tempoServico, 0.4, 5, redutorSexo) + this.calcularBonus(tempoServico) * (-1);
    } else {
      extra = this.calcularToll(tempoServico, 0.4, 5, redutorSexo) * (-1);
    }
    return extra;
  }

  calcularToll(tempoDeServico, porcentagem, proporcional, redutorSexo) {
    let toll = ((35 - proporcional - redutorSexo) - tempoDeServico) * porcentagem;
    toll = (toll < 0) ? 0 : toll;
    return toll;
  }

  verificarIdadeNecessaria(idade, redutorIdade, redutorProfessor, redutorSexo, errorArray) {
    let idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    let direito = idade > idadeNecessaria;
    if(!direito){
      errorArray.push("Falta(m) "+ (idadeNecessaria - idade) + "ano(s)");
    }
    return direito;
  }

  tratarTempoFracionado(time){
    let year = Math.floor(time);
    let month = Math.round((time - year) * 12);

    let returnStr = "";
    if(year != 0){
      returnStr += year + " ano(s)";
    }
    if(month != 0 && year != 0){ 
      returnStr += " e ";
    }
    if(month != 0){
      returnStr += month + " mes(es)";
    }
    if(month == 0 && year == 0){
      returnStr = " 0 ano(s) ";
    }
    if (year < 0){
      returnStr = "";
    }
    return returnStr;
  }

  calcularBonus(tempoServico){
    let bonus;
    if (this.segurado.sexo == 'm') {
      bonus = 17 / 100;
    }else{
      bonus = 20 / 100;
    }
    bonus = bonus * tempoServico;
    return bonus;
  }

  calcularComINPC(){
    window.location.href = (this.reajustesAdministrativos) ? window.location.href.split('?')[0] + '?withINPC=true' : window.location.href.split('?')[0];
    window.location.reload();
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

  mostrarReajustesAdministrativos(tableId){
    if(this.showReajustesAdministrativos){
      document.getElementById(tableId).scrollIntoView();
      return;
    }

    let dataInicio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY').startOf('month');
    this.ReajusteAutomatico.getByDate(dataInicio, moment())
      .then((reajustes:ReajusteAutomatico[]) => {
        let reajustesAutomaticos = reajustes;
        let valorBeneficio = (this.calculo.valor_beneficio) ? parseFloat(this.calculo.valor_beneficio) : 0;
        let dataPrevia = moment(reajustesAutomaticos[0].data_reajuste);
        let dataCorrente = dataInicio;
        for (let reajusteAutomatico of reajustesAutomaticos) {
          dataCorrente = moment(reajusteAutomatico.data_reajuste);
          let siglaMoedaDataCorrente = this.loadCurrency(dataCorrente).acronimo;
          let teto = parseFloat(reajusteAutomatico.teto);
          let minimo = parseFloat(reajusteAutomatico.salario_minimo); 
          if (this.tipoBeneficio == 17) {
            minimo *= 0.3;
          } else if (this.tipoBeneficio == 18) {
            minimo *= 0.4;
          } else if (this.tipoBeneficio == 7) {
            minimo *= 0.5;
          } else if (this.tipoBeneficio == 19) {
            minimo *= 0,6;
          }    
          let reajuste = reajusteAutomatico.indice != null ? reajusteAutomatico.indice : 1;
          valorBeneficio = this.convertCurrency(valorBeneficio, dataPrevia, dataCorrente);
          
          if (dataCorrente.year() == 2006 && dataCorrente.month() == 7) {
            reajuste = 1.000096;
          }
          
          let limit = '-';    
          if (valorBeneficio < minimo) {
            valorBeneficio = minimo;
            limit = 'M'
          } 
          if (valorBeneficio > teto) {
            valorBeneficio = teto;
            limit = 'T'
          }
          let line = {competencia: dataCorrente.format('MM/YYYY'),
                      reajuste: reajuste,
                      beneficio: this.formatMoney(valorBeneficio, siglaMoedaDataCorrente),
                      limite: limit};
          this.reajustesAdministrativosTableData.push(line);
          dataPrevia = dataCorrente;
        }
        this.reajustesAdministrativosTableOptions = {
          ...this.reajustesAdministrativosTableOptions,
          data: this.reajustesAdministrativosTableData,
        }
        this.showReajustesAdministrativos = true;
        document.getElementById(tableId).scrollIntoView();
      });    
  }

}
