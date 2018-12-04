import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../../services/error.service';
import { ContribuicaoComplementarService } from '../ContribuicaoComplementar.service';
import swal from 'sweetalert';


@Component({
  selector: 'app-contribuicoes-complementar-form',
  templateUrl: './contribuicoes-complementar-form.component.html',
  styleUrls: ['./contribuicoes-complementar-form.component.css']
})
export class ContribuicoesComplementarFormComponent implements OnInit {

  public competenciaInicial;
  public competenciaFinal;
  public contribuicaoDe;
  public contribuicaoAte;
  public salarioContribuicao;
  public chkJuros = true;
  public showMessage = false;
  public dataDecadente;


  public dataMinima = new Date(1970,0,1);
  public data94 = new Date(1994, 5, 31);

  public idCalculo='';
  public calculo;

  @Input() formData;
  @Input() errors: ErrorService;
  @Output() onSubmit = new EventEmitter;
  constructor(
    protected Calculo: ContribuicaoComplementarService,
  	protected router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(){
  	let today = new Date();
  	this.dataDecadente = new Date(today.getFullYear()-5, today.getMonth(), 1); 	

      this.idCalculo = this.route.snapshot.params['id_calculo'];
      if(this.idCalculo != undefined){
        this.Calculo.find(this.idCalculo)
                  .then(calculo => {
                        this.calculo = calculo;
                        
                        let splited = this.calculo.contribuicao_basica_inicial.split('-');
                        this.contribuicaoDe = splited[1] + '/' + splited[0];
                        splited = this.calculo.contribuicao_basica_final.split('-');
                        this.contribuicaoAte = splited[1] + '/' + splited[0];
                        splited = this.calculo.inicio_atraso.split('-');
                        this.competenciaInicial = splited[1] + '/' + splited[0];
                        splited = this.calculo.final_atraso.split('-');
                        this.competenciaFinal = splited[1] + '/' + splited[0];
                        this.salarioContribuicao = this.calculo.salario;
                        this.submit();
                     });
    }
  }
  submit(){
  	this.errors.clear();
  	this.validateInputs();
  	if(!this.errors.empty()){
  		swal('Erro', 'Confira os dados digitados','error');
  	}else{
      if(this.idCalculo != ''){
        this.formData.id = this.idCalculo;
      }
  		this.formData.id_segurado = this.route.snapshot.params['id'];
  		this.formData.inicio_atraso = this.competenciaInicial;
  		this.formData.final_atraso = this.competenciaFinal;
  		this.formData.contribuicao_basica_inicial = this.contribuicaoDe;
		  this.formData.contribuicao_basica_final = this.contribuicaoAte;
		  this.formData.salario = this.salarioContribuicao;
      this.formData.chk_juros = this.chkJuros;
		  this.onSubmit.emit(this.formData);
  	}
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
  			this.errors.add({"competenciaInicial":["Insira uma data anterior a "+(this.dataDecadente.getMonth()+1)+'/'+(this.dataDecadente.getFullYear())]});
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
  			this.errors.add({"competenciaFinal":["Insira uma data anterior a "+(this.dataDecadente.getMonth()+1)+'/'+(this.dataDecadente.getFullYear())]});
  		}
  		if(dateCompetenciaFinal < dateCompetenciaInicial){
  			this.errors.add({"competenciaFinal":["Insira uma data posterior a data inicial"]});
  		}
  	}

  	//contribuicaoDe
  	if(this.isEmpty(this.contribuicaoDe) || !this.isValidDate('01/'+this.contribuicaoDe)){
  		this.errors.add({"contribuicaoDe":["Insira uma data válida"]});
  	}else{
  		let pieces = this.contribuicaoDe.split('/');
  		let dateContribuicaoDe = new Date(pieces[1], pieces[0]-1, 1);

  		if(dateContribuicaoDe < this.data94){
  			this.errors.add({"contribuicaoDe":["Insira uma data posterior a 06/1994"]});
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

  		if(dateContribuicaoAte < this.data94){
  			this.errors.add({"contribuicaoAte":["Insira uma data posterior a 06/1994"]});
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

  voltar(){
    window.location.href='/#/contribuicoes/contribuicoes-calculos/'+ this.route.snapshot.params['id'];
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

  dateMask(rawValue){
    if(rawValue == ''){
      return [/[0-1]/, /\d/, '/', /[1-2]/, /[0|9]/, /\d/, /\d/];
    }
    let mask = [];
    mask.push(/[0-1]/);

    if (rawValue[0] == 1){
      mask.push(/[0-2]/);
    }else if(rawValue[0] == 0){
      mask.push(/[1-9]/);
    }

    mask.push('/');
    mask.push( /[1-2]/);
    
    if (rawValue[3] == 1){
      mask.push(/[9]/);
    }else if(rawValue[3] == 2){
      mask.push(/[0]/);
    }
    mask.push(/\d/);
    mask.push( /\d/);
    return mask;
  }
}
