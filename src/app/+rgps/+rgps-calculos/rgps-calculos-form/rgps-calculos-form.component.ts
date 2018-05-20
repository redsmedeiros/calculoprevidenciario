import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-rgps-calculos-form',
  templateUrl: './rgps-calculos-form.component.html',
  styleUrls: ['./rgps-calculos-form.component.css'],
  providers: [
    ErrorService
  ],
})
export class RgpsCalculosFormComponent {

  public dataInicioBeneficio;
  public periodoInicioBeneficio;
  public especieBeneficio;

  public primaria98anos;
  public primaria98meses;
  public primaria98dias;

  public secundaria98anos;
  public secundaria98meses;
  public secundaria98dias;

  public primaria99anos;
  public primaria99meses;
  public primaria99dias;

  public secundaria99anos;
  public secundaria99meses;
  public secundaria99dias;

  public primariaAtualanos;
  public primariaAtualmeses;
  public primariaAtualdias;

  public secundariaAtualanos;
  public secundariaAtualmeses;
  public secundariaAtualdias;

  public grupoDos12;
  public carencia;

  public has98 = false;
  public has99 = false;
  public hasAtual = false;
  public hasCarencia = false;
  public hasGrupoDos12 = false;

  public periodoOptions: string[] = [];

  public dateMask = [/\d/, /\d/,'/',/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  @Input() formData;
  @Input() errors: ErrorService;
  @Output() onSubmit = new EventEmitter;

  constructor() {}
  public submit(e){
	  e.preventDefault();
    this.validate();
    if (this.errors.empty()) {
      swal('Sucesso', 'Segurado salvo com sucesso','success');
    }
    else {
      swal('Erro', 'Confira os dados digitados','error');
    }
  }

  validate(){
  	if(this.dataInicioBeneficio == undefined || this.dataInicioBeneficio == ''){
  		this.errors.add({"dataInicioBeneficio":["A data de inicio do benefício é obrigatória."]});
  	}else {
      var dateParts = this.dataInicioBeneficio.split("/");
      let date = new Date(dateParts[1]+'/'+dateParts[0]+'/'+dateParts[2]);
      if (isNaN(date.getTime()) || date <= new Date('01/01/1970'))
        this.errors.add({"dataInicioBeneficio":["Insira uma data válida."]});
    }
  	
  	if(this.periodoInicioBeneficio == undefined || this.periodoInicioBeneficio == ''){
  		this.errors.add({"periodoInicioBeneficio":["O período do inicio do benefício é obrigatório."]});
  	}
  	
  	if(this.especieBeneficio == undefined || this.especieBeneficio == ''){
  		this.errors.add({"especieBeneficio":["A espécie do benefício é obrigatória."]});
  	}
  	
  	if(this.has98)
  	{
  	  	if(this.primaria98anos == undefined || this.primaria98anos == ''){
  	  		this.errors.add({"primaria98anos":["Campo obrigatório."]});
  	  	}else{
  	  		if(!this.isNumber(this.primaria98anos)){
  		  		this.errors.add({"primaria98anos":["Valor inválido."]});
  	  		}
  	  	}
  	  	
  	  	if(this.primaria98dias == undefined || this.primaria98dias == ''){
  	  		this.errors.add({"primaria98dias":["Campo obrigatório."]});
  	  	}else{
  	  		if(this.primaria98dias > 30|| !this.isNumber(this.primaria98dias)){
  		  		this.errors.add({"primaria98dias":["Insira um valor entre 0 e 30"]});
  	  		}
  	  	}
  	  	
  	  	if(this.primaria98meses == undefined || this.primaria98meses == ''){
  	  		this.errors.add({"primaria98meses":["Campo obrigatório."]});
  	  	}else{
  	  		if(this.primaria98meses > 12 || !this.isNumber(this.primaria98meses)){
  		  		this.errors.add({"primaria98meses":["Insira um valor entre 0 e 12"]});
  	  		}
  	  	}
  	  	
  	  	if(!(this.secundaria98anos == undefined || this.secundaria98anos == '')){
  	  		if(!this.isNumber(this.secundaria98anos)){
  		  		this.errors.add({"secundaria98anos":["Valor inválido."]});
  	  		}
  	  	}
  	  	
  	  	if(!(this.secundaria98meses == undefined || this.secundaria98meses == '')){
  	  		if(this.secundaria98meses > 12 || !this.isNumber(this.secundaria98meses)){
  		  		this.errors.add({"secundaria98meses":["Insira um valor entre 1 e 12"]});
  	  		}
  	  	}
  	  	
  	  	if(this.secundaria98dias == undefined || this.secundaria98dias == ''){
  	  		if(this.secundaria98dias > 30 || !this.isNumber(this.secundaria98dias)){
  		  		this.errors.add({"secundaria98dias":["Insira um valor entre 0 e 30"]});
  	  		}
  	  	}
  	}


  	if(this.has99){
  	  	if(this.primaria99anos == undefined || this.primaria99anos == ''){
  	  		this.errors.add({"primaria99anos":["Campo obrigatório."]});
  	  	}else{
  	  		if(!this.isNumber(this.primaria99anos)){
  		  		this.errors.add({"primaria99anos":["Valor inválido."]});
  	  		}
  	  	}
  	  	
  	  	if(this.primaria99meses == undefined || this.primaria99meses == ''){
  	  		this.errors.add({"primaria99meses":["Campo obrigatório."]});
  	  	}else{
  	  		if(this.primaria99meses > 12 || !this.isNumber(this.primaria99meses)){
  		  		this.errors.add({"primaria99meses":["Insira um valor entre 1 e 12"]});
  	  		}
  	  	}
  	  	
  	  	if(this.primaria99dias == undefined || this.primaria99dias == ''){
  	  		this.errors.add({"primaria99dias":["Campo obrigatório."]});
  	  	}else{
  	  		if(this.primaria99dias > 30 || !this.isNumber(this.primaria99dias)){
  		  		this.errors.add({"primaria99dias":["Insira um valor entre 0 e 30"]});
  	  		}
  	  	}
  	  	
  	  	if(this.secundaria99anos == undefined || this.secundaria99anos == ''){
  	  		if(!this.isNumber(this.secundaria99anos)){
  		  		this.errors.add({"secundaria99anos":["Valor inválido."]});
  	  		}
  	  	}
  	  	
  	  	if(this.secundaria99meses == undefined || this.secundaria99meses == ''){
  	  		if(this.secundaria99meses > 12 || !this.isNumber(this.secundaria99meses)){
  		  		this.errors.add({"secundaria99meses":["Insira um valor entre 1 e 12"]});
  	  		}
  	  	}
  	  	
  	  	if(this.secundaria99dias == undefined || this.secundaria99dias == ''){
  	  		if(this.secundaria99dias > 30 || !this.isNumber(this.secundaria99dias)){
  		  		this.errors.add({"secundaria99dias":["Insira um valor entre 0 e 30"]});
  	  		}
  	  	}
  	}
  	
  	if(this.hasAtual){
  	  	if(this.primariaAtualanos == undefined || this.primariaAtualanos == ''){
  	  		this.errors.add({"primariaAtualanos":["Campo obrigatório."]});
  	  	}else{
  	  		if(!this.isNumber(this.primariaAtualanos)){
  		  		this.errors.add({"primariaAtualanos":["Valor inválido."]});
  	  		}
  	  	}
  	  	
  	  	if(this.primariaAtualmeses == undefined || this.primariaAtualmeses == ''){
  	  		this.errors.add({"primariaAtualmeses":["Campo obrigatório."]});
  	  	}else{
  	  		if(this.primariaAtualmeses > 12 || !this.isNumber(this.primariaAtualmeses)){
  		  		this.errors.add({"primariaAtualmeses":["Insira um valor entre 1 e 12"]});
  	  		}
  	  	}
  	  	
  	  	if(this.primariaAtualdias == undefined || this.primariaAtualdias == ''){
  	  		this.errors.add({"primariaAtualdias":["Campo obrigatório."]});
  	  	}else{
  	  		if(this.primariaAtualdias > 30 || !this.isNumber(this.primariaAtualdias)){
  		  		this.errors.add({"primariaAtualdias":["Insira um valor entre 0 e 30"]});
  	  		}
  	  	}
  	  	
  	  	//Secundaria
  	  	if(this.secundariaAtualanos == undefined || this.secundariaAtualanos == ''){
  	  		if(!this.isNumber(this.secundariaAtualanos)){
  		  		this.errors.add({"secundariaAtualanos":["Valor inválido."]});
  	  		}
  	  	}
  	  	
  	  	if(this.secundariaAtualmeses == undefined || this.secundariaAtualmeses == ''){
  	  		if(this.secundariaAtualmeses > 12 || !this.isNumber(this.secundariaAtualmeses)){
  		  		this.errors.add({"secundariaAtualmeses":["Insira um valor entre 1 e 12"]});
  	  		}
  	  	}
  	  	
  	  	if(this.secundariaAtualdias == undefined || this.secundariaAtualdias == ''){
  	  		if(this.secundariaAtualdias > 30 || !this.isNumber(this.secundariaAtualdias)){
  		  		this.errors.add({"secundariaAtualdias":["Insira um valor entre 0 e 30"]});
  	  		}
  	  	}
  	}

  	if(this.hasCarencia && (this.carencia == undefined || this.carencia == '')){
  		this.errors.add({"carencia":["Campo obrigatório."]});
  	}
  }

  changePeriodoOptions(){
  	this.errors.clear('dataInicioBeneficio');
  	this.periodoOptions = [];
  	var dateParts = this.dataInicioBeneficio.split("/");
    let dateBeneficio = new Date(dateParts[1]+'/'+dateParts[0]+'/'+dateParts[2]);
  	if(dateBeneficio < new Date('04/05/1991')){
  		this.periodoOptions.push('Anterior a 05/10/1998');
  	}
  	if(dateBeneficio > new Date('10/04/1988')){
  		this.periodoOptions.push('Entre 05/10/1998 e 04/04/1991 ');
  	}
  	if(dateBeneficio > new Date('04/04/1991')){
  		this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
  	}
  	if(dateBeneficio > new Date('12/15/1998')){
  		this.periodoOptions.push('Entre 16/12/1998 e 28/11/1999');
  	}
  	if(dateBeneficio < new Date('11/29/1999')){
  		this.periodoOptions.push('A partir de 29/11/1999');
  	}

  	if(dateBeneficio >= new Date('12/16/1998') && dateBeneficio < new Date('12/16/1998')){
  		this.has98 = true;
  		this.has99 = true;
  		this.hasAtual = false;
  	}else if(dateBeneficio > new Date('11/29/1999')){
  		this.has98 = true;
  		this.has99 = true;
  		this.hasAtual = true;
  	}else{
      this.has98 = false;
      this.has99 = false;
      this.hasAtual = false;
    }
  }

  changeGrupoDos12(){
  	this.errors.clear('periodoInicioBeneficio');
  	if(this.periodoInicioBeneficio == 'Anterior a 05/10/1998' || this.periodoInicioBeneficio == 'Entre 05/10/1998 e 04/04/1991'){
  		this.hasGrupoDos12 = true;
  	}else{
  		this.hasGrupoDos12 = false;
  	}

  }

  changeEspecieBeneficio(){
  	this.errors.clear('especieBeneficio');
  	if(this.especieBeneficio=='Aposentadoria por idade - Trabalhador Rural' || this.especieBeneficio=='Aposentadoria por idade - Trabalhador Urbano'){
  		this.hasCarencia = true;
  	}else{
  		this.hasCarencia = false;
  	}
  }

  isNumber(value){
  	if(!isNaN(value) && Number.isInteger(+value)){
  		console.log("True");
  		return true;
  	}
  	return false;
  }

}
