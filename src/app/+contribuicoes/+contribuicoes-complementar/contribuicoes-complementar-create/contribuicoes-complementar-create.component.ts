import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { ContribuicaoComplementarService } from '../ContribuicaoComplementar.service';
import { ErrorService } from '../../../services/error.service';
import { ContribuicaoComplementar as ContribuicaoModel } from '../ContribuicaoComplementar.model';
import { MatrixService } from '../../MatrixService.service'
import { MoedaService } from '../../../services/Moeda.service';
import { Moeda } from '../../../services/Moeda.model';
import * as moment from 'moment';

@Component({
  selector: 'app-contribuicoes-complementar-create',
  templateUrl: './contribuicoes-complementar-create.component.html',
  styleUrls: ['./contribuicoes-complementar-create.component.css'],
  providers: [
  	ErrorService
  ]
})
export class ContribuicoesComplementarCreateComponent implements OnInit {
  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public numAnos;
  public numMeses;
  public jurosMensais = 0.005;
  public jurosAnuais = 1.06;
  public baseAliquota = 0;
  public multa = 0;

  public form = {...ContribuicaoModel.form};

  matriz = [{
      "ano": 0,
      "valores": []
    }
  ];

  public anosConsiderados = [];
  public moeda: Moeda[];
  public matrizHasValues = false;
  public matrixTableOptions = {
      paging: false, 
      ordering: false, 
      info: false, 
      searching: false
  }
  
  constructor(
  	protected Calculo: ContribuicaoComplementarService,
    protected MatrixStore: MatrixService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
    private Moeda: MoedaService,
    ) { }

  ngOnInit() {
  }

  preencher(data){
  	let monthList = this.monthAndYear(data.contribuicao_basica_inicial, data.contribuicao_basica_final);
    this.form.numero_contribuicoes = Math.floor(monthList.length*0.8);

  	let ano = monthList[0].split('-')[0];
  	let valores = [0,0,0,0,0,0,0,0,0,0,0];
    this.anosConsiderados.push(ano);
  	for (let entry of monthList){
  		if(ano == entry.split('-')[0]){
  			valores[+entry.split('-')[1]-1] = data.salario;
  		}else{
  			this.updateMatrix(+ano, valores);
    		ano = entry.split('-')[0];
    		valores = [0,0,0,0,0,0,0,0,0,0,0];
    		valores[+entry.split('-')[1]-1] = data.salario;
        this.anosConsiderados.push(ano);
  		}
  	}
  	this.updateMatrix(+ano, valores);
  }

  generateList(e){
    let unique_anos = this.anosConsiderados.filter(this.onlyUnique);
    let data_dict = [];
    for(let ano of unique_anos){
      let valor_jan = (<HTMLInputElement>document.getElementById("01-"+ano)).value;
      data_dict.push("01/"+ano+'-'+valor_jan);
      let valor_fev = (<HTMLInputElement>document.getElementById("02-"+ano)).value;
      data_dict.push("02/"+ano+'-'+valor_fev);
      let valor_mar = (<HTMLInputElement>document.getElementById("03-"+ano)).value;
      data_dict.push("03/"+ano+'-'+valor_mar);
      let valor_abr = (<HTMLInputElement>document.getElementById("04-"+ano)).value;
      data_dict.push("04/"+ano+'-'+valor_abr);
      let valor_mai = (<HTMLInputElement>document.getElementById("05-"+ano)).value;
      data_dict.push("05/"+ano+'-'+valor_mai);
      let valor_jun = (<HTMLInputElement>document.getElementById("06-"+ano)).value;
      data_dict.push("06/"+ano+'-'+valor_jun);
      let valor_jul = (<HTMLInputElement>document.getElementById("07-"+ano)).value;
      data_dict.push("07/"+ano+'-'+valor_jul);
      let valor_ago = (<HTMLInputElement>document.getElementById("08-"+ano)).value;
      data_dict.push("08/"+ano+'-'+valor_ago);
      let valor_set = (<HTMLInputElement>document.getElementById("09-"+ano)).value;
      data_dict.push("09/"+ano+'-'+valor_set);
      let valor_out = (<HTMLInputElement>document.getElementById("10-"+ano)).value;
      data_dict.push("10/"+ano+'-'+valor_out);
      let valor_nov = (<HTMLInputElement>document.getElementById("11-"+ano)).value;
      data_dict.push("11/"+ano+'-'+valor_nov);
      let valor_dez = (<HTMLInputElement>document.getElementById("12-"+ano)).value;
      data_dict.push("12/"+ano+'-'+valor_dez);
    }
    this.MatrixStore.setDict(data_dict);
    //window.location.href='/#/contribuicoes/'+this.route.snapshot.params['id']+'/contribuicoes-resultados-complementar/1'
  }

  createCalculo(e){
    this.generateList(e);
    this.generateTabelaDetalhes();
    this.generateTabelaResultados();
    console.log(this.form);
  }
  
  //Tabela de detalhes gerada no momento no calculo
  generateTabelaDetalhes(){
    let data_array = this.MatrixStore.getDict();
    let indice_num = 0;
    let dataTabelaDetalhes = []
    for(let data of data_array){
      let splitted = data.split('-');
      let mes = splitted[0];
      let contrib = splitted[1];
      
      if(contrib == 0 || contrib == ''){
        continue;
      }

      indice_num++;
      let indice = this.getIndice(mes);
      let contrib_base = this.getContribBase(mes, contrib);
      let valor_corrigido = contrib_base * indice;

      let line = {indice_num: indice_num, mes: mes, contrib_base: contrib_base, indice: indice, valor_corrigido: valor_corrigido};
      dataTabelaDetalhes.push(line);
    }

    //Ordenação dos dados pelo valor corrigido
    dataTabelaDetalhes.sort((entry1, entry2) => {
      if(entry1.valor_corrigido > entry2.valor_corrigido){
        return 1;
      }
      if(entry1.valor_corrigido < entry2.valor_corrigido){
        return -1;
      }
      return 0;
    });

    //Colore de vermelho os 20% menores valores. 
    //form.numero_contribuicoes contem o numero equivalente as 80% maiores contribuicoes, 
    //dividindo por 4 obtem-se os 20% restante
    let index = 0;
    let numero_contrib_desconsideradas = Math.floor((this.form.numero_contribuicoes)/4);

    for(index = 0; index < numero_contrib_desconsideradas ; index++){
      dataTabelaDetalhes[index].mes ='<div style="color:red;">' + dataTabelaDetalhes[index].mes + '</div>'
      dataTabelaDetalhes[index].contrib_base ='<div style="color:red;">' + dataTabelaDetalhes[index].contrib_base + '</div>'
      dataTabelaDetalhes[index].indice ='<div style="color:red;">' + dataTabelaDetalhes[index].indice + '</div>'
      dataTabelaDetalhes[index].valor_corrigido ='<div style="color:red;">' + dataTabelaDetalhes[index].valor_corrigido + '</div>'
    }
    
    for(index = index; index < Math.floor((this.form.numero_contribuicoes)/0.8); index++){
      this.form.total_contribuicao += dataTabelaDetalhes[index].valor_corrigido;
    }
    this.form.media_salarial = this.form.total_contribuicao/this.form.numero_contribuicoes;
    this.MatrixStore.setTabelaDetalhes(dataTabelaDetalhes);
  }

  generateTabelaResultados(){
    let competencias = this.monthAndYear(this.form.inicio_atraso, this.form.final_atraso);
    let dataTabelaResultados = [];
    
    //Variaveis para a linha de total
    let total_contrib = 0.0;
    let total_juros = 0.0;
    let total_multa = 0.0;
    let total_total = 0.0;

    for(let competencia of competencias){
      let splited = competencia.split('-');
      competencia = splited[1] + '/' + splited[0];
      let valor_contribuicao = this.getValorContribuicao();
      let juros = 'R$ 0,00';
      let multa = this.getMulta();
      let total = 'R$ 0,00';
      let line = {competencia: competencia, valor_contribuicao: valor_contribuicao, juros: juros, multa: multa, total: total};
      dataTabelaResultados.push(line);

      //calculos dos totais
      total_contrib += parseFloat((valor_contribuicao.split(' ')[1]).replace(',','.'));
      total_juros += parseFloat((juros.split(' ')[1]).replace(',','.'));
      total_multa += parseFloat((multa.split(' ')[1]).replace(',','.'));
      total_total += parseFloat((total.split(' ')[1]).replace(',','.'));
    }
    let last_line = {competencia: '<b>Total</b>', 
                     valor_contribuicao: '<b>R$ '+ (total_contrib).toFixed(2).replace('.',',') + '</b>', 
                     juros: '<b>R$ ' + (total_juros).toFixed(2).replace('.',',') + '</b>', 
                     multa: '<b>R$ ' + (total_multa).toFixed(2).replace('.',',') + '</b>', 
                     total: '<b>R$ ' + (total_total).toFixed(2).replace('.',',') + '</b>'
                    };
    dataTabelaResultados.push(last_line);
    this.form.contribuicao_calculada = total_total;
    this.MatrixStore.setTabelaResultados(dataTabelaResultados);
  }

  updateMatrix(ano, valores){
    if(!this.matrizHasValues){
      this.matriz.splice(0,1);
    }
  	for(let entry of this.matriz){
  		if(entry.ano == ano){
  			entry.valores = valores;
  			return;
  		}
  	}
  	this.matriz.push({ "ano": ano, "valores": valores });
    this.matrizHasValues = true;
  }
  
  //Retorna uma lista com os meses entre dateStart e dateEnd
  monthAndYear(dateStart, dateEnd){
  	dateStart = '01/'+dateStart;
  	dateEnd = '01/'+dateEnd;

  	let startSplit = dateStart.split('/');
  	let endSplit = dateEnd.split('/');

  	dateStart = moment(startSplit[2]+'-'+startSplit[1]+'-'+startSplit[0]);
	  dateEnd = moment(endSplit[2]+'-'+endSplit[1]+'-'+endSplit[0]);
	  let timeValues = [];

	  while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
   	  timeValues.push(dateStart.format('YYYY-MM'));
   		dateStart.add(1,'month');
	  }
	  return timeValues;
  }

  //Valor da contribuição base para cada mês
  getContribBase(dataMes, contrib){
    let teto = 0;
    let salario_minimo = 0;

    if(contrib > teto){
      return teto;
    }else if(contrib < salario_minimo){
      return salario_minimo;
    }else if(salario_minimo < contrib && contrib < teto){
      return contrib;
    }

  }

  //Valor fixado para cada mês, carregado de uma tabela do banco de dados 
  getIndice(dataMes){
    let indice = 1;
    return indice;
  }

  getValorContribuicao(){
    return 'R$ ' + this.getBaseAliquota();
  }

  getMulta(){
    return 'R$ ' + ((this.multa.toFixed(2)).replace('.',','));
  }

  getBaseAliquota(){
    return (this.baseAliquota.toFixed(2)).replace('.',',');
  }

  voltar(){
    window.location.href='/#/contribuicoes/contribuicoes-calculos/'+ this.route.snapshot.params['id'];
  }

  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }

}
