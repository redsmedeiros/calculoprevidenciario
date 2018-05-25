import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-contribuicoes-complementar-form',
  templateUrl: './contribuicoes-complementar-form.component.html',
  styleUrls: ['./contribuicoes-complementar-form.component.css']
})
export class ContribuicoesComplementarFormComponent implements OnInit {

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];


  public competenciaInicial;
  public competenciaFinal;
  public contribuicaoDe;
  public contribuicaoAte;
  public salarioContribuicao;

  public dataDecadente;


  public dataMinima = new Date(1970,0,1);
  public data94 = new Date(1994, 6, 31);

  @Input() formData;
  @Input() errors: ErrorService;
  @Output() onSubmit = new EventEmitter;
  constructor() { }

  ngOnInit(){
  	let today = new Date();
  	this.dataDecadente = new Date(today.getFullYear()-5, today.getMonth(), 1); 	
  }
  submit(e){
  	e.preventDefault();
  	this.validateInputs();
  }

  validateInputs(){
  	//competenciaInicial
  	if(this.isEmpty(this.competenciaInicial) || !this.isValidDate('01/'+this.competenciaInicial)){
  		this.errors.add({"competenciaInicial":["Insira uma data válida"]});
  	}else{
  		let pieces = this.competenciaInicial.split('/');
  		let dateCompetenciaInicial = new Date(pieces[1], pieces[0]-1, 1);
  		if(dateCompetenciaInicial <= this.dataMinima){
  			this.errors.add({"competenciaInicial":["Insira uma data após 01/1970"]});
  		}
  		if(dateCompetenciaInicial >= this.dataDecadente){
  			this.errors.add({"competenciaInicial":["Insira uma data posterior a "+(this.dataDecadente.getMonth()+1)+'/'+(this.dataDecadente.getFullYear())]});
  		}
  	}

  	//competenciaFinal
  	if(this.isEmpty(this.competenciaFinal) || !this.isValidDate('01/'+this.competenciaFinal)){
  		this.errors.add({"competenciaFinal":["Insira uma data válida"]});
  	}else{
  		let pieces = this.competenciaFinal.split('/');
  		let dateCompetenciaFinal = new Date(pieces[1], pieces[0]-1, 1);
  		pieces = this.competenciaInicial.split('/');
  		let dateCompetenciaInicial = new Date(pieces[1], pieces[0]-1, 1);

  		if(dateCompetenciaFinal <= this.dataMinima){
  			this.errors.add({"competenciaFinal":["Insira uma data após 01/1970"]});
  		}
  		if(dateCompetenciaFinal >= this.dataDecadente){
  			this.errors.add({"competenciaFinal":["Insira uma data posterior a "+(this.dataDecadente.getMonth()+1)+'/'+(this.dataDecadente.getFullYear())]});
  		}
  		if(dateCompetenciaFinal <= dateCompetenciaInicial){
  			this.errors.add({"competenciaFinal":["Insira uma data posterior a data inicial"]});
  		}
  	}

  	//contribuicaoDe
  	if(this.isEmpty(this.contribuicaoDe) || !this.isValidDate('01/'+this.contribuicaoDe)){
  		this.errors.add({"contribuicaoDe":["Insira uma data válida"]});
  	}else{
  		let pieces = this.contribuicaoDe.split('/');
  		let dateContribuicaoDe = new Date(pieces[1], pieces[0]-1, 1);

  		if(dateContribuicaoDe <= this.data94){
  			this.errors.add({"contribuicaoDe":["Insira uma data posterior a 07/1994"]});
  		}
  	}

  	//contribuicaoAte
  	if(this.isEmpty(this.contribuicaoAte) || !this.isValidDate('01/'+this.contribuicaoAte)){
  		this.errors.add({"contribuicaoAte":["Insira uma data válida"]});
  	}else{
  		let pieces = this.contribuicaoAte.split('/');
  		let dateContribuicaoAte = new Date(pieces[1], pieces[0]-1, 1);

  		pieces = this.contribuicaoDe.split('/');
  		let dateContribuicaoDe = new Date(pieces[1], pieces[0]-1, 1);

  		if(dateContribuicaoAte <= this.data94){
  			this.errors.add({"contribuicaoAte":["Insira uma data posterior a 07/1994"]});
  		}
  		if(dateContribuicaoAte <= dateContribuicaoDe){
  			this.errors.add({"contribuicaoAte":["Insira uma data posterior a data inicial"]});
  		}
  	}

  	//salarioContribuicao
  	if(this.isEmpty(this.salarioContribuicao)){
  		this.errors.add({"salarioContribuicao":["Insira o salário"]});
  	}
  }

  isEmpty(data){
  	if(data == undefined || data == '') {
      return true;
    }
    return false;
  }

  isValidDate(date) {
    var bits = date.split('/');
    var d = new Date(bits[2], bits[1] - 1, bits[0]);
    return d && (d.getMonth() + 1) == bits[1];
  }
}
