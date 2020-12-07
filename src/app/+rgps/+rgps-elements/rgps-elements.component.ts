import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { ExpectativaVida } from '../+rgps-resultados/ExpectativaVida.model';
import { ExpectativaVidaService } from '../+rgps-resultados/ExpectativaVida.service';
import { CalculoRgpsService } from '../+rgps-calculos/CalculoRgps.service';
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { RgpsResultadosComponent } from '../+rgps-resultados/rgps-resultados.component';
import * as moment from 'moment';
import { Moeda } from '../../services/Moeda.model';
import { MoedaService } from '../../services/Moeda.service';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-elements.component.html',
})
export class RgpsElementsComponent extends RgpsResultadosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public isUpdating = false;
  public expvida;
  public idSegurado;
  public segurado;
  public dataNascimentoSegurado;

  public aliquota = 20;
  public contribEmAtraso = 0.00;
  public idadeUltimaDib;

  public calculo1;
  public calculo2

  public resultadosFacultativo = []
  public resultadosDescontadoSlario = [];

  public boxId;
  public sexoSegurado;

  public idadeExpectativa;
  public tableData = [];
  public tableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering:  false,
    bInfo : false,
    data: this.tableData,
    columns: [
      {data: 'data_calculo',
      render: (data) => {
        return this.formatReceivedDate(data);
        }
      },
      {data: 'especie'},
      {data: 'dib'},
      {data: 'beneficio'},
    ] 
  };
  constructor(protected Segurado: SeguradoService,
  						private ExpectativaVida: ExpectativaVidaService,
  						protected CalculoRgps:CalculoRgpsService,
              protected router: Router,
              private Moeda: MoedaService,
    					protected route: ActivatedRoute,) 
  {super(null,null,null,null,null,null);}

  ngOnInit() {
  	this.isUpdating = true;
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.boxId = this.generateBoxId(this.calculo.id, 'comparar');

   	this.Segurado.find(this.idSegurado)
      .then(segurado => {
        this.segurado = segurado;
        this.dataNascimentoSegurado = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');

        this.Moeda.getByDateRange(moment().subtract(1, 'months'), moment())
        .then((moeda: Moeda[]) => {
        this.moeda = moeda;
      //  console.log( this.moeda );
        });

       	this.CalculoRgps.find(this.route.snapshot.params['id_calculo1'])
       		.then((calculo:CalculoModel) => {
       			this.calculo1 = calculo;
       			let data = [];
       			data.push({data_calculo:calculo.data_calculo,
       								especie: calculo.tipo_seguro,
       								dib: calculo.data_pedido_beneficio,
                       beneficio: calculo.valor_beneficio.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})
                    });


       			this.CalculoRgps.find(this.route.snapshot.params['id_calculo2'])
       				.then((calculo2:CalculoModel) => {
       					this.calculo2 = calculo2;
       					data.push({data_calculo:calculo2.data_calculo,
       										 especie: calculo2.tipo_seguro,
       										 dib: calculo2.data_pedido_beneficio,
                            beneficio: calculo2.valor_beneficio.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})
                          });
       					if(moment(this.calculo2.data_pedido_beneficio, 'DD/MM/YYYY') < 
       					moment(this.calculo1.data_pedido_beneficio, 'DD/MM/YYYY')){
       						let aux = this.calculo1;
       						this.calculo1 = this.calculo2;
       						this.calculo2 = aux;
       					}

       					this.tableData = data;
       					this.tableOptions = {
         					...this.tableOptions,
         					data: this.tableData,
       					}
                 let idadeExpectativa = Math.abs(this.dataNascimentoSegurado.diff(moment(this.calculo2.data_pedido_beneficio, 'DD/MM/YYYY'), 'years'));
                 
       					this.ExpectativaVida.getByIdade(idadeExpectativa)
       						.then(expvida =>{
       							this.expvida = expvida;
       							this.compare_calculations(this.calculo1, this.calculo2);
       							this.isUpdating = false;
                 });
                 
                
       			});
       	});
    });
  }

  changeAliquota(){

  }

  recalcular(){
    
    this.compare_calculations(this.calculo1, this.calculo2);
    
  }
  

  //na página de listagem de cálculos ha um checkbox para cada cálculos. Quando clicado em realizar cálculos, 
  //deverão ser realizados todos os cálculos selecionas normalmente. Podem ser selecionados 1 ou mais cálculos.
	//na página de resultado de cálculos, há a listagem de cálculos cujos resultados estão sendo exibidos. 
	//Tal listagem também possui checkbox. Nesta listagem é possivel fazer a comparação.
	//a comparação sempre deve ser feita com exatamente 2 cálculos da forma como mostrado abaixo.

	compare_calculations(calculo1, calculo2){
    this.resultadosFacultativo = [];
    this.resultadosDescontadoSlario = [];
    this.sexoSegurado = this.segurado.sexo;
//console.log(calculo1);
//console.log(calculo2);

    let dateFormat = ('DD/MM/YYYY');
		let dataInicioBeneficio1 = moment(calculo1.data_pedido_beneficio, dateFormat);
    let dataInicioBeneficio2 = moment(calculo2.data_pedido_beneficio, dateFormat);
    let valor = this.Moeda.getByDate(moment());
    let salMinimo = valor.salario_minimo * 0.05;
    

	//	let dataComparacao = (dataInicioBeneficio2.clone()).startOf('month');

		let totalEntreDatas = 0;
		let tempoMinimo1 = 0;
    let tempoMinimo2 = 0;

    // Veriricar se os valores para soma de contribuicoes existem, caso não existam considerar 0.
    let investimentoEntreDatas = Math.abs(calculo1.soma_contribuicao - calculo2.soma_contribuicao);

    investimentoEntreDatas += this.contribEmAtraso;// contribuicao em atraso no forms na pŕópria página
   
    let aliquota = this.aliquota/100;
   
    switch(aliquota){
      case (0.05) : investimentoEntreDatas*=aliquota;
      break;
      case (0.2) : investimentoEntreDatas *= aliquota;
      break;
      case (0.11) :investimentoEntreDatas *= aliquota;
      break;
      case (0.31) :investimentoEntreDatas *= aliquota;
      break;
    }
    
   // investimentoEntreDatas *= aliquota;
 // console.log("valor :",investimentoEntreDatas); 
    let mesesEntreDatas = this.getDifferenceInMonths(dataInicioBeneficio1, dataInicioBeneficio2); 
      
    // Variável que guarda o Total que deixou de receber caso tivesse se aposentado na primeira data
   
    let totalPerdidoEntreData = mesesEntreDatas * calculo1.valor_beneficio;
    let diferencaRmi = Math.abs(calculo2.valor_beneficio-calculo1.valor_beneficio);

    if (diferencaRmi != 0) {
			tempoMinimo1 = ((investimentoEntreDatas + totalPerdidoEntreData) / diferencaRmi) / 13;
			tempoMinimo2 = (totalPerdidoEntreData / diferencaRmi) / 13;
    }
   
    
    let tempoMinimo1Meses = Math.floor((tempoMinimo1 - Math.floor(tempoMinimo1)) * 12);

    let idadeSegurado = Math.abs(this.dataNascimentoSegurado.diff(moment(), 'years'));


    let idadeSeguradoDIB = Math.abs(this.dataNascimentoSegurado.diff(dataInicioBeneficio2, 'years'));//Idade do Segurado na Calculo2.data_pedido_beneficio

    let expectativaDIB = this.projetarExpectativa(idadeSeguradoDIB, dataInicioBeneficio2);

    let expectativaSegurado = expectativaDIB + idadeSeguradoDIB;
    

    let expectativaTotalMeses = Math.floor((expectativaSegurado - (idadeSeguradoDIB + tempoMinimo1)) * 13);
    if (expectativaTotalMeses < 0){
    	expectativaTotalMeses = 0;
    }
    expectativaTotalMeses *= diferencaRmi;

      let currency = this.loadCurrency(dataInicioBeneficio2);

    this.idadeUltimaDib = idadeSeguradoDIB;

    // No Box:
    // Hipótese em que o segurado contribuía como segurado facultativo ou contribuinte individual cuja alíquota é de 'Aliquota Selecionada:
    this.resultadosFacultativo.push({string: 'Espécie:',  value:calculo1.tipo_seguro });

    this.resultadosFacultativo.push({string: 'DIB:',  value:calculo1.data_pedido_beneficio });

    this.resultadosFacultativo.push({string: 'Benefício:',  value:calculo1.valor_beneficio.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2}) });

    this.resultadosFacultativo.push({string: 'Total investido em contribuições ao INSS entre as duas datas:', 
    														value:this.formatMoney(investimentoEntreDatas, currency.acronimo)});
    
    this.resultadosFacultativo.push({string: 'Total que deixou de receber caso tivesse se aposentado na primeira data: ', 
    														value:this.formatMoney(totalPerdidoEntreData, currency.acronimo)});
   	
   	this.resultadosFacultativo.push({string: 'Total perdido: ', 
    														value:this.formatMoney((investimentoEntreDatas + totalPerdidoEntreData), currency.acronimo)});
    
    this.resultadosFacultativo.push({string: 'Diferença entre os dois benefícios: ', 
    														value:this.formatMoney(diferencaRmi, currency.acronimo)});
    
    this.resultadosFacultativo.push({string: 'Tempo mínimo necessário para recuperar as perdas:  ', 
    														value:Math.floor(tempoMinimo1) + " ano(s) e " + tempoMinimo1Meses + " mes(es)"});
    
    this.resultadosFacultativo.push({string: 'Idade do segurado quando recuperar as perdas: ', 
    														value: Math.floor(idadeSeguradoDIB + tempoMinimo1) + " ano(s) " + tempoMinimo1Meses + " mes(es)"});
    
    this.resultadosFacultativo.push({string: 'Idade do segurado de acordo com a expectativa de sobrevida (IBGE): ', 
    														value:Math.floor(expectativaSegurado) + " anos " + Math.floor((expectativaSegurado - Math.floor(expectativaSegurado)) * 12) + " mes(es)"});
    
    this.resultadosFacultativo.push({string: 'Total de ganhos até atingir a idade esperada (incluindo 13º salário): ', 
    														value:this.formatMoney(expectativaTotalMeses, currency.acronimo)});

		expectativaTotalMeses = Math.floor((expectativaSegurado - (idadeSeguradoDIB + tempoMinimo2)) * 13);

		if (expectativaTotalMeses < 0){
			expectativaTotalMeses = 0;
		}

    expectativaTotalMeses *= diferencaRmi;

    // No Box:
    // Hipóteses em que o Segurado(a) teve contribuição descontada diretamente de seu salário;
    this.resultadosDescontadoSlario.push({string: 'Espécie:',  value:calculo2.tipo_seguro });

    this.resultadosDescontadoSlario.push({string: 'DIB:',  value:calculo2.data_pedido_beneficio });

    this.resultadosDescontadoSlario.push({string: 'Benefício:',  value:calculo2.valor_beneficio.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2}) });

    this.resultadosDescontadoSlario.push({string:'Total que deixou de receber caso tivesse se aposentado na primeira data:',
    																			value: this.formatMoney(totalPerdidoEntreData, currency.acronimo)});
    let tempoMinimo2Meses = Math.floor((tempoMinimo2 - Math.floor(tempoMinimo2)) * 12);


    this.resultadosDescontadoSlario.push({string:'Total perdido:',
    																			value: this.formatMoney(totalPerdidoEntreData, currency.acronimo)});

    this.resultadosDescontadoSlario.push({string:'Diferença entre os dois benefícios:',
    																			value: this.formatMoney(diferencaRmi, currency.acronimo)});
    
    this.resultadosDescontadoSlario.push({string:'Tempo mínimo necessário para recuperar as perdas:',
    																			value: Math.floor(tempoMinimo2) + " ano(s) " + tempoMinimo2Meses + " mes(es)"});
    
    this.resultadosDescontadoSlario.push({string:'Idade do segurado quando recuperar as perdas:',
    																			value: Math.floor(idadeSeguradoDIB + Math.floor(tempoMinimo2)) + " ano(s) " + tempoMinimo2Meses + " mes(es)"});
    
    this.resultadosDescontadoSlario.push({string:'Idade do segurado de acordo com a expectativa de sobrevida (IBGE):',
    																			value: Math.floor(expectativaSegurado) + " ano(s) " + Math.floor((expectativaSegurado - Math.floor(expectativaSegurado)) * 12) + " mes(es)"});
    
    this.resultadosDescontadoSlario.push({string:'Total de ganhos até atingir a idade esperada (incluindo 13º salário):',
    																			value: this.formatMoney(expectativaTotalMeses, currency.acronimo)});
	}

	getDifferenceInMonths(date1, date2 = moment()) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    return Math.floor(difference);
  }


  projetarExpectativa(idadeFracionada, dib) {
    let expectativa = 0;
    let dataInicio = moment('2000-11-30');
    let dataFim = moment('2016-12-01');
    let dataHoje = moment();

    if (dib > dataHoje) {
      let anos = dataHoje.diff(dib, 'years');

      let tempo1 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-2, 'years')).year(), null, null);
      let tempo2 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-3, 'years')).year(), null, null);
      let tempo3 = this.procurarExpectativa(idadeFracionada, ((dataHoje.clone()).add(-4, 'years')).year(), null, null);
      // expectativa = (anos * Math.abs((tempo1 + tempo2 + tempo3) / 3) - tempo1) + tempo1;
      expectativa = (anos * Math.abs(((tempo1 + tempo2 + tempo3) / 3) - tempo1)) + tempo1;

    } else if (dib <= dataInicio) {
      expectativa = this.procurarExpectativa(idadeFracionada, null, null, dataInicio);
    } else if (dib >= dataFim) {
      expectativa = this.procurarExpectativa(idadeFracionada, null, dib, null);
    } else {
      expectativa = this.procurarExpectativa(idadeFracionada, null, dib, dib);
    }

    if (expectativa <= 0) {
      expectativa = 6;
    }

    return expectativa;
  }

  procurarExpectativa(idadeFracionada, ano, dataInicio, dataFim) {
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    let dataAgora = moment();
    let expectativaVida;
    let sexo = this.sexoSegurado;
    if (idadeFracionada > 80){
      idadeFracionada = 80;
    }    
  
    if (ano != null) {
      expectativaVida = this.ExpectativaVida.getByAno(ano);//Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e year == ano


    }else{
      // expectativaVida = this.ExpectativaVida.getByDates(dataInicio, dataFim);
      expectativaVida = this.ExpectativaVida.getByProperties(dataInicio, dataFim);
    }

    // if(this.sexoSegurado === 'm'){
    //    expectativaVida = this.ExpectativaVida.getPlanejamento(dataInicio,dataFim,sexo);
       
    // }else{
    //   expectativaVida = this.ExpectativaVida.getPlanejamento(dataInicio,dataFim,sexo);
    // }

    return expectativaVida;
  }

  updateDatatable(){
  	
  }

  imprimirBox(event, boxId) {
    event.stopPropagation();

    const css = `
    <style>
          body{font-family: Arial, Helvetica, sans-serif;}
          h1, h2{font-size:0.9rem;}
          i.fa, .not-print{ display: none; }
          table{margin-top: 10px;}
          footer,div,p,td,th{font-size:10px !important;}
          .list-inline{ display:inline; }
          .table>tbody>tr>td, .table>tbody>tr>th,
           .table>tfoot>tr>td, .table>tfoot>tr>th,
           .table>thead>tr>td, .table>thead>tr>th {padding: 3.5px 10px;}
           footer{text-align: center; margin-top: 50px;}
           .list-inline-print{ display:inline !important;}
    </style>`;

    const seguradoBox = document.getElementById('printableSegurado').innerHTML
    const boxContent = document.getElementById(boxId).innerHTML;
    

                    const rodape = `<img src='./assets/img/rodapesimulador.png' alt='Logo'>`;
    let printableString = '<html><head>' + css + '<style>#tituloCalculo{font-size:0.9rem;}</style><title> RMI do RGPS - ' 
                          + this.segurado.nome + '</title></head><body onload="window.print()">' + seguradoBox + ' <br> ' 
                          + boxContent +'<br><br><br>'+ rodape + '</body></html>';
    printableString = printableString.replace(/<table/g,
         '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');
    const popupWin = window.open('', '_blank', 'width=300,height=300');

    popupWin.document.open();
    popupWin.document.write(printableString);
    popupWin.document.close();
  }

}
