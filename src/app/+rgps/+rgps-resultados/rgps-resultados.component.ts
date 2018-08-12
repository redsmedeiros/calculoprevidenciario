import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { MoedaService } from '../../services/Moeda.service';
import { IndiceInps } from './IndiceInps.model';
import { IndiceInpsService } from './IndiceInps.service';
import { SalarioMinimoMaximo } from './SalarioMinimoMaximo.model';
import { SalarioMinimoMaximoService } from './SalarioMinimoMaximo.service';
import { CarenciaProgressiva } from './CarenciaProgressiva.model';
import { CarenciaProgressivaService } from './CarenciaProgressiva.service';
import { ReajusteAutomatico } from './ReajusteAutomatico.model';
import { ReajusteAutomaticoService } from './ReajusteAutomatico.service';
import { Moeda } from '../../services/Moeda.model';
import { CalculoRgpsService } from '../+rgps-calculos/CalculoRgps.service';
import { ValorContribuidoService } from '../+rgps-valores-contribuidos/ValorContribuido.service'
import * as moment from 'moment';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-resultados.component.html',
})
export class RgpsResultadosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public isUpdating = false;

  public idSegurado = '';
  public idadeSegurado = 0;
  public idCalculo = '';
  public erroAnterior88;
  public currencyList = [
	{
		"startDate": "1000-01-01",
		"endDate": "1942-10-31",
		"acronimo": "MR$",
		"nome": "Mil-Réis",
		"indiceCorrecaoAnterior": 1
	},
	{
		"startDate": "1942-11-01",
		"endDate": "1967-02-12",
		"acronimo": "Cr$",
		"nome": "Cruzeiro",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "1967-02-13",
		"endDate": "1970-05-15",
		"acronimo": "NCR$",
		"nome": "Cruzeiro Novo",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "1970-05-15",
		"endDate": "1986-02-28",
		"acronimo": "Cr$",
		"nome": "Cruzeiro",
		"indiceCorrecaoAnterior": 1
	},
	{
		"startDate": "1986-03-01",
		"endDate": "1988-12-31",
		"acronimo": "CZ$",
		"nome": "Cruzado",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "1989-01-01",
		"endDate": "1990-03-15",
		"acronimo": "NCZ$",
		"nome": "Cruzado Novo",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "16/03/1990",
		"endDate": "31/07/1993",
		"acronimo": "Cr$",
		"nome": "Cruzeiro",
		"indiceCorrecaoAnterior": 1
	},
	{
		"startDate": "1993-08-01",
		"endDate": "1994-02-28",
		"acronimo": "CR$",
		"nome": "Cruzeiro Real",
		"indiceCorrecaoAnterior": 1000
	},
	{
		"startDate": "1994-03-01",
		"endDate": "1994-06-30",
		"acronimo": "URV",
		"nome": "Unidade Real de Valor",
		"indiceCorrecaoAnterior": 637.639978027344
	},
	{
		"startDate": "1994-07-01",
		"endDate": "9999-12-31",
		"acronimo": "R$",
		"nome": "Real",
		"indiceCorrecaoAnterior": 1
	}
  ];

  public segurado:any = {};
  public calculo:any = {};
  public moeda:any = {};

  public salarioMinimoMaximo;
  public primeiraDataTabela;
  public dataInicioBeneficio;
  public contribuicaoPrimariaTotal;
  public listaValoresContribuidos;
  public tipoBeneficio;
  
  public calculoList = [];
  public grupoCalculosTableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculoList,
    columns: [
      {data: 'especie'},
      {data: 'periodoInicioBeneficio'},
      {data: 'contribuicaoPrimaria'},
      {data: 'contribuicaoSecundaria'},
      {data: 'dib'},
      {data: 'dataCriacao'},
    ] 
  };

  public inpsList;
  public conclusoesAnterior88 = {};
  public calculoAnterior88TableData = [];
  public contribuicaoPrimariaAnterior88 = {anos:0,meses:0,dias:0};
  public contribuicaoSecundariaAnterior88 = {anos:0,meses:0,dias:0};
  public calculoAnterior88TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculoAnterior88TableData,
    columns: [
      {data: 'competencia'},
      {data: 'contribuicao_primaria'},
      {data: 'contribuicao_secundaria'},
      {data: 'inps'},
      {data: 'contribuicao_primaria_revisada'},
      {data: 'contribuicao_secundaria_revisada'},
    ] 
  };

  public conclusoes91_98 = {};
  public calculo91_98TableData = [];
  public carenciasProgressivas;
  public reajustesAutomaticos;
  public contribuicaoPrimaria91_98 = {anos:0,meses:0,dias:0};
  public contribuicaoSecundaria91_98 = {anos:0,meses:0,dias:0};
  public coeficiente;
  public errosCalculo91_98 = [];
  public calculo91_98TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculo91_98TableData,
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

  public contribuicaoTotal;
  public conclusoesApos99 = {};
  public calculoApos99TableData = [];
  public contribuicaoPrimaria99 = {anos:0,meses:0,dias:0};
  public contribuicaoSecundaria99 = {anos:0,meses:0,dias:0};
  public errosCalculoApos99 = [];
  public calculoApos99TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.calculo91_98TableData,
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

  //Datas
  public dataLei9032 = moment('1995-04-28');
  public dataLei8213 = moment('1991-07-24');
  public dataReal = moment('1994-06-01');
  public dataDib98 = moment('1998-12-16');
  public dataDib99 = moment('1999-11-29');

  constructor(protected router: Router,
    private route: ActivatedRoute,
    protected Segurado: SeguradoService,    
    protected CalculoRgps: CalculoRgpsService,
    protected ValoresContribuidos: ValorContribuidoService,
    private Moeda: MoedaService,
    private IndiceInps: IndiceInpsService,
    private SalarioMinimoMaximo: SalarioMinimoMaximoService,
    private CarenciaProgressiva:CarenciaProgressivaService,
    private ReajusteAutomatico:ReajusteAutomaticoService,) {}

  ngOnInit() {
  	this.idSegurado = this.route.snapshot.params['id_segurado'];
  	this.idCalculo = this.route.snapshot.params['id'];
    this.isUpdating = true;

    this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.segurado = segurado;
        this.idadeSegurado = this.getIdadeSegurado();
        this.CalculoRgps.find(this.idCalculo)
          .then(calculo => {
            this.calculo = calculo;
            this.tipoBeneficio = this.getEspecieBeneficio();
            this.dataInicioBeneficio = moment(this.calculo.data_pedido_beneficio, 'DD/MM/YYYY');
            let dataInicio = this.getDataInicio();
            let dataLimite = this.getDataLimite(dataInicio);
            this.preencheGrupoDeCalculos();
            this.ValoresContribuidos.getByCalculoId(this.idCalculo, dataInicio, dataLimite)
              .then(valorescontribuidos => {
                this.listaValoresContribuidos = valorescontribuidos;
                console.log(this.listaValoresContribuidos)
                this.primeiraDataTabela = moment(this.listaValoresContribuidos[this.listaValoresContribuidos.length - 1].data);
                this.Moeda.getByDateRange(this.primeiraDataTabela, moment())
                  .then((moeda: Moeda[]) => {
                    this.moeda = moeda;
                    console.log(moeda)
                    if(this.calculo.tipo_aposentadoria == 'Anterior a 05/10/1998'){
                      this.erroAnterior88 = this.verificaErrosAnterior88();
                      if(!this.erroAnterior88){
                        this.IndiceInps.getByDate(this.dataInicioBeneficio.clone().startOf('month'))
                          .then(indices => {
                            this.inpsList = indices;
                            this.SalarioMinimoMaximo.getByDate((this.dataInicioBeneficio.clone()).startOf('month'))
                              .then(salario => {
                                this.salarioMinimoMaximo = salario[0];
                                this.contribuicaoPrimariaAnterior88 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
                                this.contribuicaoSecundariaAnterior88 = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);
                                this.calculoAnterior88(this.conclusoesAnterior88);
                                console.log(this.conclusoesAnterior88);
                                this.isUpdating = false;  
                              });
                          });
                      }else{//há erro no calculo anterior a 88
                        this.isUpdating = false;  
                      }
                    }else if(this.calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998'){
                      this.contribuicaoPrimaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
                      this.contribuicaoSecundaria91_98 = this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98);
                      this.CarenciaProgressiva.getCarencias()
                        .then(carencias => {
                          this.carenciasProgressivas = carencias;
                          //TODO REAJUSTES CALCULO entr 98 e 99
                          // if (this.calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999') {
                          //   dataInicio = this.dataDib99;
                          // }
                          this.ReajusteAutomatico.getByDate(this.dataDib98, this.dataInicioBeneficio)
                            .then(reajustes => {
                              this.reajustesAutomaticos = reajustes;
                              this.calculo91_98(this.conclusoes91_98);
                              this.isUpdating = false;  
                            });
                        });
                    }
                  });
              });
          });
      });
  }

  verificaErrosAnterior88(){
    let erro = "";
    let anoContribuicaoPrimariaAnterior88 = this.contribuicaoPrimariaAnterior88.anos;
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
    let isBlackHole = false;
    let currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
    let totalPrimario = 0;
    let totalSecundario = 0;
    let anoPrimario = this.contribuicaoPrimariaAnterior88.anos;
    let anoSecundario = this.contribuicaoSecundariaAnterior88.anos;

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
      let contribuicaoSecundariaString = (!isBlackHole) ? this.formatMoney(valorSecundario, currency.acronimo) : "";
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
      let contribuicaoSecundariaRevisadaString = (!isBlackHole) ? this.formatMoney(valorSecundario, currencyDataInicioBeneficio.acronimo) : '';
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

    this.calculoAnterior88TableData = tableData;
    this.calculoAnterior88TableOptions = {
      ...this.calculoAnterior88TableOptions,
      data: this.calculoAnterior88TableData,
    }
  }

  calculateRMI(mediaTotal, somaContribuicoes, conclusoes){
    let currencyDataInicioBeneficio = this.loadCurrency(this.dataInicioBeneficio);
    let dataSalario = (this.dataInicioBeneficio.clone()).startOf('month');
    let dataSalarioMoedaIndex = this.getIndex(dataSalario);
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
    let valorSalarioMinimo = indiceSalarioMinimo * this.moeda[dataSalarioMoedaIndex].salario_minimo;
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

  loadCurrency(data){
    for(let currency of this.currencyList){
      let startDate = moment(currency.startDate);
      let endDate = moment(currency.endDate);
      if(startDate <= data && data <= endDate){
        return currency;
      }
    }
  }

  calculo91_98(conclusoes){
    let dib = this.dataInicioBeneficio;
    let dibCurrency = this.loadCurrency(dib);
    let isBlackHole = false;

    if (this.calculo.tipoAposentadoria == 'Entre 16/12/1998 e 28/11/1999' && 
        this.dataInicioBeneficio > this.dataDib99) {
        dib = this.dataDib99;
    }
    if (this.calculo.tipoAposentadoria == 'Entre 05/04/1991 e 15/12/1998' &&
        this.dataInicioBeneficio > this.dataDib98) {
        dib = this.dataDib98;
    }

    let dataComparacao = (dib.clone()).startOf('month');
    let reajustesAdministrativos = true;
    if (reajustesAdministrativos) { // Definir tal booleano, a principio sempre true
      dataComparacao = (this.dataInicioBeneficio.clone()).startOf('month');
    }

    let dibPrimeiro = (dib.clone()).startOf('month');

    let moedaComparacao = this.moeda[this.getIndex(dataComparacao)];
    let moedaDIB = this.moeda[this.getIndex(dib)];

    if(this.listaValoresContribuidos.length == 0) {
      // Exibir MSG de erro e encerrar Cálculo.
      this.errosCalculo91_98.push("Nenhuma contribuição encontrada em 48 meses anteriores a DIB conforme" + "http://www.ieprev.com.br/legislacao/10634/lei-no-8.213,-de-24-7-1991---atualizada-ate-dezembro-2008#art29' target='_blank'>Art. 29 da Lei nº 8.213, de 24/7/1991");
      return;
    }

    if (!this.direitoAposentadoria(dib)){
      console.log(this.errosCalculo91_98)
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

      if (!isBlackHole){
        contribuicaoSecundariaString = this.formatMoney(valorSecundario, currency.acronimo);
      }

      let moeda = this.moeda[this.getIndex(dataContribuicao)];
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
      if (!isBlackHole){
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

    if(reajustesAdministrativos && 
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
        let moedaAuxilio = this.moeda[this.getIndex(this.dataInicioBeneficio)];
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

    if (reajustesAdministrativos) {
       //TODO: salvarBeneficiosNoBD;
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
    
    this.calculo91_98TableData = tableData;
    this.calculo91_98TableOptions = {
      ...this.calculo91_98TableOptions,
      data: this.calculo91_98TableData,
    }
  }

  direitoAposentadoria(dib){
    let idadeDoSegurado = this.idadeSegurado;
    let tempoContribuicaoPrimaria = this.getContribuicaoObj(this.calculo.contribuicao_primaria_98);
    let redutorProfessor = (this.tipoBeneficio == 6) ? 5 : 0;
    let redutorSexo = (this.segurado.sexo == 'm') ? 0 : 5;
    let anosSecundaria = (this.getContribuicaoObj(this.calculo.contribuicao_secundaria_98)).anos;
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
          direito = this.verificarIdadeNecessaria(idadeDoSegurado, 7, 0, redutorSexo);
          direito = direito && this.verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra + 5);
        }
        let contribuicao = 35 - redutorProfessor - redutorSexo - anosContribuicao;
        let tempoFracionado = this.tratarTempoFracionado(contribuicao); //Separar o tempo de contribuicao em anos, meses e dias
        if (direito) {
          this.errosCalculo91_98.push(""); 
          // Exibir Mensagem de beneficio Proporcional, com o tempo faltante;
          //"POSSUI direito ao benefício proporcional."
          //"Falta(m) 'tempoFracionado' para possuir o direito ao benefício INTEGRAL."
        }else{
          this.errosCalculo91_98.push("")
          // Exibir Mensagem de beneficio nao concedido.
          // Falta(m) 'tempoFracionado' para completar o tempo de serviço necessário para o benefício INTEGRAL.
          if (totalContribuicao98 > 0) {
          let tempo = 35 - redutorProfessor - (extra + 5) - anosContribuicao;
          let tempoProporcional = this.tratarTempoFracionado(tempo);
          this.errosCalculo91_98.push("")
          // Exibir Mensagem com o tempo faltante para o beneficio proporcioanl;
          // Falta(m) 'tempoProporcional' para completar o tempo de serviço necessário para o benefício PROPORCIONAL.
          }
        }    
      }
    }else if(this.tipoBeneficio == 3){
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado);
      if (!idadeMinima){ 
        return false;
      }
      if(!this.verificarCarencia(-5, redutorProfessor, redutorSexo)){
        return false;
      }
    }else if(this.tipoBeneficio == 5){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, 0, 20);
      if(!direito) {
        this.errosCalculo91_98.push("");
        // Exibir Mensagem de Erro:
        // "Não possui direito ao benefício de aposentadoria especial."
      }
    }else if(this.tipoBeneficio == 16){
      idadeMinima = this.verificarIdadeMinima(idadeDoSegurado);
      if (!idadeMinima){
        return false;
      }
      if (!this.verificarCarencia(0, redutorProfessor, redutorSexo)){
        return false;
      }
    }else if(this.tipoBeneficio == 25){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 10);
      if (!direito){
        this.errosCalculo91_98.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
      }
    }else if (this.tipoBeneficio == 26){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 6);
      if (!direito){
        this.errosCalculo91_98.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.    
      }
    }else if(this.tipoBeneficio == 27){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 2);
      if (!direito){
        this.errosCalculo91_98.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.   
      }
    }else if(this.tipoBeneficio == 28){
      direito = this.verificarTempoDeServico(anosContribuicao, 0, redutorSexo, 20);
      if (!direito){
        this.errosCalculo91_98.push("");
        return false; // Exibir Mensagem de erro com a quantidade de tempo faltando.
      }
      if (!this.verificarIdadeMinima(idadeDoSegurado)){
        this.errosCalculo91_98.push("");
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
    console.log(this.tipoBeneficio)
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
    console.log(coeficienteAux);
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

  verificarIdadeMinima(idade) {
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
      this.errosCalculo91_98.push("O segurado não tem a idade mínima (" + idadeMinima + " anos) para se aposentar por idade. Falta(m) " + (idadeMinima - this.idadeSegurado) + " ano(s) para atingir a idade mínima.");
    }
    return temIdadeMinima;
  }

  getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo){
    let idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    let anoNecessario = (moment(this.segurado.data_nascimento, 'DD/MM/YYYY')).add(idadeNecessaria, 'years');
    return anoNecessario.year();
  }

  getValoresAdministrativos(rmi) {
    let reajustesAdministrativos = true;   
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
      if (reajustesAdministrativos) {
        valorBeneficio = valorBeneficio * reajuste;
      }
      valorBeneficio = (valorBeneficio < reajusteAutomatico.salario_minimo) ? reajusteAutomatico.salario_minimo : valorBeneficio;
      valorBeneficio = (valorBeneficio > reajusteAutomatico.teto) ? reajusteAutomatico.teto : valorBeneficio;
    }
    return valorBeneficio;
  }

  verificarCarencia(redutorIdade, redutorProfessor, redutorSexo) {
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
        this.errosCalculo91_98.push(erroCarencia);
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

  verificarIdadeNecessaria(idade, redutorIdade, redutorProfessor, redutorSexo) {
    let idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    let direito = idade > idadeNecessaria; // TODO: Caso o resultado seja falso, exibir o tempo faltante;
    return direito;
  }

  tratarTempoFracionado(time){
    //TODO: verificar valor passado como parametro
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
      returnStr = " 0 ano(s) "
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

  //FIM DAS FUNÇOES DO CALCULO 91-98
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

  getEspecieBeneficio(){
    let numeroEspecie = 0;
    switch (this.calculo.tipo_seguro) {
      case "Auxílio Doença Previdenciário":
        numeroEspecie = 1;
        break;
      case "Aposentadoria por invalidez previdênciária":
        numeroEspecie = 2;
        break;
      case "Aponsentadoria por idade trabalhador Urbano":
        numeroEspecie = 3;
        break;
      case "Aposentadoria por tempo de contribuição":
        numeroEspecie = 4;
        break;
      case "Aposentadoria especial":
        numeroEspecie = 5;
        break;
      case "Aposentadoria por tempo de  serviço de professor":
        numeroEspecie = 6;
        break;
      case "Auxílio Acidente - 50%":
        numeroEspecie = 7;
        break;
      case "Aponsentadoria por idade trabalhador Rural":
        numeroEspecie = 16;
        break;
      case "Auxílio Acidente - 30%":
        numeroEspecie = 17;
        break;
      case "Auxílio Acidente - 40%":
        numeroEspecie = 18;
        break;
      case "Auxílio Acidente - 60%":
        numeroEspecie = 19;
        break;
      case "Pessoa com deficiencia Grave - 100%":
        numeroEspecie = 25;
        break;
      case "Pessoa com deficiencia Moderada - 100%":
        numeroEspecie = 26;
        break;
      case "Pessoa com deficiencia Leve 100%":
        numeroEspecie = 27;
        break;
      case "Pessoa com deficiencia por Idade 70%":
        numeroEspecie = 28;
        break;
      default:
        // code...
        break;
    }
    return numeroEspecie;
  }

  formatMoney(value, sigla='R$'){
    return sigla + this.formatDecimal(value, 2);
  }

  formatDecimal(value, n_of_decimal_digits){
    value = parseFloat(value);
    return (value.toFixed(parseInt(n_of_decimal_digits))).replace('.', ',');
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

  limitarTetosEMinimos(valor, data){
    let moedaIndex = this.getIndex(data);
    let salarioMinimo = this.moeda[moedaIndex].salario_minimo;
    let tetoSalarial = this.moeda[moedaIndex].teto;
    console.log(data.format('YYYY-MM-DD'), this.moeda[moedaIndex].data_moeda)
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

  getIndex(data){
    return this.getDifferenceInMonths(this.primeiraDataTabela,data);
  }

  getDifferenceInMonths(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.floor(difference);
  }

  getTempoDeContribuicaoPrimaria(data) {
    let str = '';
    if (data.contribuicao_primaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_98.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_primaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_99.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_primaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_atual.replace(/-/g,'/') +'<br>';
    }

    return str;
  }

  getTempoDeContribuicaoSecundaria(data) {
    let str = '';
    if (data.contribuicao_secundaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_98.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_secundaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_99.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_secundaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_atual.replace(/-/g,'/') +'<br>';
    }

    return str;
  }

  convertCurrency(valor, dataCorrente, dataConversao) {
    let valorConvertido = parseFloat(valor);
    for (let currency of this.currencyList) {
      let startDate = moment(currency.startDate);
      let endDate = moment(currency.endDate);
      if (dataCorrente > endDate) {
        // já esta em uma data maior que a data que a moeda termina, procurar na proxima
        continue;
      }else if (startDate > dataConversao) {
        // já ultrapassou a data de conversão, finalizar o calculo
        break;
      } else if (dataCorrente < endDate && dataCorrente >= startDate) {
        // Propria Moeda, não há corte.
        continue;
      }else if (dataCorrente <= endDate) {
        // Estamos na moeda seguinte, converter divindindo pelo indiceDeCorreção;
        valorConvertido /= currency.indiceCorrecaoAnterior;
      }
    }
    return valorConvertido;
  }

  getContribuicaoObj(stringContrib){
    let returnObj = {anos:0, meses:0, dias:0};
    if(stringContrib){
      let anos = (stringContrib.split('-')[0] != 'undefined') ? stringContrib.split('-')[0] : 0;
      let meses = (stringContrib.split('-')[1] != 'undefined') ? stringContrib.split('-')[1] : 0;
      let dias = (stringContrib.split('-')[2] != 'undefined') ? stringContrib.split('-')[2] : 0;
      returnObj = {anos: anos, meses:meses, dias:dias};
    }
    return returnObj;
  }

  getDataInicio(){
    let dataInicio;
    if(this.calculo.tipo_aposentadoria = 'Anterior a 05/10/1998'){
      dataInicio = this.dataInicioBeneficio;
    }else{
      let dib = this.dataInicioBeneficio;
      if (this.calculo.tipoAposentadoria == 'Entre 16/12/1998 e 28/11/1999' && 
        this.dataInicioBeneficio > this.dataDib99) {
        dib = this.dataDib99;
      }
      if (this.calculo.tipoAposentadoria == 'Entre 05/04/1991 e 15/12/1998' &&
        this.dataInicioBeneficio > this.dataDib98) {
        dib = this.dataDib98;
      }

      dataInicio = (dib.clone()).startOf('month');
    }
    return dataInicio;
  }

  getDataLimite(dataInicio){
    let mesesLimite = 0;
    let mesesLimiteTotal = 0;
    if (this.tipoBeneficio == 1 || this.tipoBeneficio == 2) {
      mesesLimite = 18;
      mesesLimiteTotal = 12;
    } else {
      mesesLimite = 48;
      mesesLimiteTotal = 36;
    }

    if(this.calculo.tipo_aposentadoria = 'Entre 05/04/1991 e 15/12/1998'){
      mesesLimite = 36;
      mesesLimiteTotal = 48;
    }

    let dataLimite;
    if(mesesLimite > 0){
      dataLimite = (dataInicio.clone()).add(-mesesLimite,'months');
    }else{
      dataLimite = moment('1964-10-01');
    }
    return dataLimite;
  }

  preencheGrupoDeCalculos(){
    let especie = this.calculo.tipo_seguro;
    let periodoInicioBeneficio = this.calculo.tipo_aposentadoria;
    let contribuicaoPrimaria = this.getTempoDeContribuicaoPrimaria(this.calculo);
    let contribuicaoSecundaria = this.getTempoDeContribuicaoSecundaria(this.calculo);
    let dib = this.calculo.data_pedido_beneficio;
    let dataCriacao = this.formatReceivedDate(this.calculo.data_calculo);

    let line = {
      especie: especie,
      periodoInicioBeneficio:periodoInicioBeneficio,
      contribuicaoPrimaria:contribuicaoPrimaria,
      contribuicaoSecundaria:contribuicaoSecundaria,
      dib:dib,
      dataCriacao:dataCriacao
    }

    this.calculoList.push(line);
    this.grupoCalculosTableOptions = {
      ...this.grupoCalculosTableOptions,
      data: this.calculoList,
    }
  }

  getIdadeSegurado(){
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    return moment().diff(dataNascimento, 'years');
  }

  editSegurado() {
    window.location.href='/#/rgps/rgps-segurados/'+ this.idSegurado+'/editar';
  }

  listaSegurados(){
    window.location.href='/#/rgps/rgps-segurados/';
  }

  infoCalculos(){
  	window.location.href='/#/rgps/rgps-calculos/' + this.idSegurado;
  }

  valoresContribuidos(){
    window.location.href='/#/rgps/rgps-valores-contribuidos/' + this.idSegurado 
    + '/' + this.idCalculo; 
  }

  imprimirPagina(){
    let printContents = document.getElementById('content').innerHTML;
    let popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWin.document.close();
  }

}
