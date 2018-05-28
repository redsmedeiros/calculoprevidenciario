import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { ContribuicaoComplementarService } from '../ContribuicaoComplementar.service';
import { ErrorService } from '../../../services/error.service';
import { ContribuicaoComplementar as ContribuicaoModel } from '../ContribuicaoComplementar.model';
import { MatrixService } from '../../MatrixService.service'
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

  public form = {...ContribuicaoModel.form};

  matriz = [{
      "ano": 0,
      "valores": []
    }
  ];

  public anosConsiderados = [];

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
    ) { }

  ngOnInit() {
  }

  submit(data){
  	let monthList = this.monthandYear(data.contribuicao_basica_inicial, data.contribuicao_basica_final);
    this.form.numero_contribuicoes = String(Math.floor(monthList.length*0.8));

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

  confirm(e){
    console.log(this.matriz);
    let unique_anos = this.anosConsiderados.filter(this.onlyUnique);
    let temp_matrix = this.matriz;

    console.log(temp_matrix);
    temp_matrix = [];
    console.log(temp_matrix);
    for(let ano of unique_anos){
      let valores = [];
      let valor_jan = (<HTMLInputElement>document.getElementById("01-"+ano)).value;
      valores.push(valor_jan);
      let valor_fev = (<HTMLInputElement>document.getElementById("02-"+ano)).value;
      valores.push(valor_fev);
      let valor_mar = (<HTMLInputElement>document.getElementById("03-"+ano)).value;
      valores.push(valor_mar);
      let valor_abr = (<HTMLInputElement>document.getElementById("04-"+ano)).value;
      valores.push(valor_abr);
      let valor_mai = (<HTMLInputElement>document.getElementById("05-"+ano)).value;
      valores.push(valor_mai);
      let valor_jun = (<HTMLInputElement>document.getElementById("06-"+ano)).value;
      valores.push(valor_jun);
      let valor_jul = (<HTMLInputElement>document.getElementById("07-"+ano)).value;
      valores.push(valor_jul);
      let valor_ago = (<HTMLInputElement>document.getElementById("08-"+ano)).value;
      valores.push(valor_ago);
      let valor_set = (<HTMLInputElement>document.getElementById("09-"+ano)).value;
      valores.push(valor_set);
      let valor_out = (<HTMLInputElement>document.getElementById("10-"+ano)).value;
      valores.push(valor_out);
      let valor_nov = (<HTMLInputElement>document.getElementById("11-"+ano)).value;
      valores.push(valor_nov);
      let valor_dez = (<HTMLInputElement>document.getElementById("12-"+ano)).value;
      valores.push(valor_dez);
      temp_matrix.push({"ano": ano, "valores": valores});
    }
    this.MatrixStore.setMatrix(temp_matrix);
    window.location.href='/#/contribuicoes/'+this.route.snapshot.params['id']+'/contribuicoes-resultados-complementar/1'
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
  monthandYear(dateStart, dateEnd){
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

  voltar(){
    window.location.href='/#/contribuicoes/contribuicoes-calculos/'+ this.route.snapshot.params['id'];
  }

  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }

}
