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

  public idSegurado;

  public baseAliquota = 0;

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
    let today = moment();
    this.Moeda.getByDateRange('06/' + '01/1994', (today.month()+1) + '/01/' + today.year())
        .then((moeda: Moeda[]) => {
          this.moeda = moeda;
        })
  }

  preencher(data){
    this.idSegurado = this.route.snapshot.params['id'];
  	let monthList = this.monthAndYear(data.contribuicao_basica_inicial, data.contribuicao_basica_final);
    this.form.numero_contribuicoes = monthList.length*0.8;

  	let ano = monthList[0].split('-')[0];
  	let valores = ['R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00'];
    this.anosConsiderados.push(ano);
  	for (let entry of monthList){
  		if(ano == entry.split('-')[0]){
  			valores[+entry.split('-')[1]-1] =  this.formatMoney(data.salario);
  		}else{
  			this.updateMatrix(+ano, valores);
    		ano = entry.split('-')[0];
    		valores = ['R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00','R$ 0,00'];
    		valores[+entry.split('-')[1]-1] = this.formatMoney(data.salario);
        this.anosConsiderados.push(ano);
  		}
  	}
  	this.updateMatrix(+ano, valores);
  }

  createCalculo(e){
    e.preventDefault();
    this.generateTabelaDetalhes();
    this.form.contribuicao_calculada = this.calculateContribuicao();

    let novoCalculo = new ContribuicaoModel();
    novoCalculo.id_segurado = this.form.id_segurado;
    novoCalculo.inicio_atraso = "01/" + this.form.inicio_atraso;
    novoCalculo.final_atraso = "01/"+ this.form.final_atraso
    novoCalculo.contribuicao_basica_inicial = "01/" + this.form.contribuicao_basica_inicial
    novoCalculo.contribuicao_basica_final = "01/" + this.form.contribuicao_basica_final
    novoCalculo.salario = this.form.salario;
    novoCalculo.total_contribuicao = this.form.total_contribuicao;
    novoCalculo.numero_contribuicoes = Math.ceil(this.form.numero_contribuicoes);
    novoCalculo.media_salarial = this.form.media_salarial;
    novoCalculo.contribuicao_calculada = this.form.contribuicao_calculada;

    if(this.form.id == undefined){
        this.Calculo.save(novoCalculo).then((data:ContribuicaoModel) => {
                  this.Calculo.get().then(() =>{
                  swal('Sucesso', 'O Cálculo foi salvo com sucesso','success').then(() => {
                      window.location.href='/#/contribuicoes/'+this.idSegurado+'/contribuicoes-resultados-complementar/'+data.id;
                    });
                  });
                }).catch(error => {
                  console.log(error);
                });
    }else{
      novoCalculo.id = this.form.id;
      this.Calculo.update(novoCalculo).then((data:ContribuicaoModel) => {
                  this.Calculo.get().then(() =>{
                  swal('Sucesso', 'O Cálculo foi salvo com sucesso','success').then(() => {
                      window.location.href='/#/contribuicoes/'+this.idSegurado+'/contribuicoes-resultados-complementar/'+data.id;
                    });
                  });
                }).catch(error => {
                  console.log(error);
                });
    }
  }

  getMatrixData(){
    let unique_anos = this.anosConsiderados.filter(this.onlyUnique);
    let data_dict = [];
    for(let ano of unique_anos){
      let valor_jan = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("01-"+ano)).value);
      data_dict.push("01/"+ano+'-'+valor_jan);
      let valor_fev = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("02-"+ano)).value);
      data_dict.push("02/"+ano+'-'+valor_fev);
      let valor_mar = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("03-"+ano)).value);
      data_dict.push("03/"+ano+'-'+valor_mar);
      let valor_abr = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("04-"+ano)).value);
      data_dict.push("04/"+ano+'-'+valor_abr);
      let valor_mai = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("05-"+ano)).value);
      data_dict.push("05/"+ano+'-'+valor_mai);
      let valor_jun = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("06-"+ano)).value);
      data_dict.push("06/"+ano+'-'+valor_jun);
      let valor_jul = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("07-"+ano)).value);
      data_dict.push("07/"+ano+'-'+valor_jul);
      let valor_ago = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("08-"+ano)).value);
      data_dict.push("08/"+ano+'-'+valor_ago);
      let valor_set = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("09-"+ano)).value);
      data_dict.push("09/"+ano+'-'+valor_set);
      let valor_out = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("10-"+ano)).value);
      data_dict.push("10/"+ano+'-'+valor_out);
      let valor_nov = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("11-"+ano)).value);
      data_dict.push("11/"+ano+'-'+valor_nov);
      let valor_dez = this.getNumberFromTableEntry((<HTMLInputElement>document.getElementById("12-"+ano)).value);
      data_dict.push("12/"+ano+'-'+valor_dez);
    }
    console.log(data_dict)
    return data_dict;
  }


  //Tabela de detalhes gerada no momento no calculo
  generateTabelaDetalhes(){
    let data_array = this.getMatrixData();
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

      let line = {indice_num: indice_num, 
                  mes: mes, 
                  contrib_base: this.formatMoney(contrib_base), 
                  indice: indice, 
                  valor_corrigido: this.formatMoney(valor_corrigido)
                 };
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
      dataTabelaDetalhes[index].indice_num = index+1;
      dataTabelaDetalhes[index].mes ='<div style="color:red;">' + dataTabelaDetalhes[index].mes + '</div>'
      dataTabelaDetalhes[index].contrib_base ='<div style="color:red;">' + dataTabelaDetalhes[index].contrib_base + '</div>'
      dataTabelaDetalhes[index].indice ='<div style="color:red;">' + dataTabelaDetalhes[index].indice + '</div>'
      dataTabelaDetalhes[index].valor_corrigido ='<div style="color:red;">' + dataTabelaDetalhes[index].valor_corrigido + '</div>'
    }
    for(index = index; index < (this.form.numero_contribuicoes/0.8); index++){
      dataTabelaDetalhes[index].indice_num = index+1;
      this.form.total_contribuicao += parseFloat((dataTabelaDetalhes[index].valor_corrigido).split(' ')[1].replace(',','.'));
    }
    this.form.media_salarial = this.form.total_contribuicao/Math.floor(this.form.numero_contribuicoes);
    this.baseAliquota = this.form.media_salarial*0.2;
    this.MatrixStore.setTabelaDetalhes(dataTabelaDetalhes);
  }

  //Valor da contribuição base para cada mês
  getContribBase(dataMes, contrib){
    let teto = this.getTeto(dataMes);
    let salario_minimo = this.getSalarioMinimo(dataMes);
    contrib = parseFloat(contrib);
    if(salario_minimo <= contrib && contrib <= teto){
      return contrib;
    }else if(contrib > teto){
      return teto;
    }else if(contrib < salario_minimo){
      return salario_minimo;
    }
  }

  getSalarioMinimo(dataString){
    let diff = this.getDifferenceInMonths('07/1994', dataString);
    return parseFloat(this.moeda[diff].salario_minimo);
  }

  getTeto(dataString){
    let diff = this.getDifferenceInMonths('07/1994', dataString);
    return parseFloat(this.moeda[diff].teto);
  }
  //Valor fixado para cada mês, carregado de uma tabela do banco de dados 
  getIndice(dataString){
    let diff = this.getDifferenceInMonths('07/1994', dataString);
    return parseFloat(this.moeda[diff].fator);
  }

  calculateContribuicao(){
    let competencias = this.monthAndYear(this.form.inicio_atraso, this.form.final_atraso);
    let contrib_calculada = 0.0;

    for(let competencia of competencias){
      let splited = competencia.split('-');

      competencia = splited[1] + '/' + splited[0];
      let juros = this.getTaxaJuros(competencia);
      let total = (this.getBaseAliquota()*1.1) + juros;

      contrib_calculada += total;
    }
    return contrib_calculada;
  }

  getBaseAliquota(){
    return this.baseAliquota;
  }

  getTaxaJuros(dataReferencia){
    let taxaJuros = 0.0;
    let jurosMensais = 0.005;
    let jurosAnuais = 1.06;
    let numAnos = this.getDifferenceInYears(dataReferencia);
    let numMeses = this.getDifferenceInMonths(dataReferencia) - (numAnos*12);
    taxaJuros = ((jurosAnuais ** numAnos) * ((jurosMensais * numMeses) + 1)) - 1;
    taxaJuros = Math.min(taxaJuros, 0.5);
    let totalJuros = this.getBaseAliquota() * taxaJuros;

    return totalJuros;
  }

  getNumberFromTableEntry(tableEntry){
    if(tableEntry == ''){
      return 0.0;
    }
    return parseFloat((tableEntry.split(' ')[1]).replace(',','.'));
  }

  updateMatrix(ano, valores){
    if(!this.matrizHasValues){
      this.matriz.splice(0,1);
    }
    for(let entry of this.matriz){
      if(entry.ano == ano){
        let index = 0;
        for (index = 0; index < 12; ++index) {
          if(entry.valores[index] != valores[index] && valores[index] != 'R$ 0,00'){
            entry.valores[index] = valores[index];
          }
        }
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

  //Retorna a diferença em anos completos entre a data passada como parametro e a data atual
  getDifferenceInYears(dateString){
    let splitted = dateString.split('/');
    let today = moment();
    let pastDate = moment(splitted[0]+'-01-'+splitted[1], "MM-DD-YYYY");
    let duration = moment.duration(today.diff(pastDate));
    let years = duration.asYears();
    return Math.floor(years);
  }

  //Retorna a diferença em meses completos entre a data passada como parametro e a data atual
  getDifferenceInMonths(dateString, dateString2=''){
    let splitted = dateString.split('/');
    let recent;
    if(dateString2 == ''){
      recent = moment();
    }else{
      let splitted = dateString2.split('/');
      recent = moment(splitted[0]+'-01-'+splitted[1], "MM-DD-YYYY");
    }
    let pastDate = moment(splitted[0]+'-01-'+splitted[1], "MM-DD-YYYY");
    let duration = moment.duration(recent.diff(pastDate));
    let months = duration.asMonths();
    return Math.floor(months);
  }

  //Recebe um valor float e retorna com duas casas decimais, virgula como separador e prefixo R$
  formatMoney(data){
    data = parseFloat(data);
    return 'R$ ' + (data.toFixed(2)).replace('.',',');
  }

  voltar(){
    window.location.href='/#/contribuicoes/contribuicoes-calculos/'+ this.idSegurado;
  }

  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }

}
