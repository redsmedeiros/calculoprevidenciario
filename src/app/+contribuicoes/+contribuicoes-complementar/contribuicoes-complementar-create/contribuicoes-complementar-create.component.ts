import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { ContribuicaoComplementarService } from '../ContribuicaoComplementar.service';
import { ErrorService } from '../../../services/error.service';
import { ContribuicaoComplementar as ContribuicaoModel } from '../ContribuicaoComplementar.model';
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
  public matrizHasValues = false;
  constructor(
  	protected Calculo: ContribuicaoComplementarService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
  }

  submit(data){
  	let monthList = this.monthandYear(data.contribuicao_basica_inicial, data.contribuicao_basica_final);
    this.form.numero_contribuicoes = String(monthList.length*0.8);

  	let ano = monthList[0].split('-')[0];
  	let valores = [0,0,0,0,0,0,0,0,0,0,0];

  	for (let entry of monthList){
  		if(ano == entry.split('-')[0]){
  			valores[+entry.split('-')[1]-1] = data.salario;
  		}else{
  			this.updateMatrix(+ano, valores);
    		ano = entry.split('-')[0];
    		valores = [0,0,0,0,0,0,0,0,0,0,0];
    		valores[+entry.split('-')[1]-1] = data.salario;
  		}
  	}
  	this.updateMatrix(+ano, valores);
  }

  confirm(e){

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

}
