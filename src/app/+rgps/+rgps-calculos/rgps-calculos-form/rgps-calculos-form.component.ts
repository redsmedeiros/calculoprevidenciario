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
  public hasCarencia = false;
  public periodoOptions: string[] = [];

  public dateMask = [/\d/, /\d/,'/',/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  @Input() formData;
  @Input() errors: ErrorService;
  @Output() onSubmit = new EventEmitter;

  constructor() { }

  validate(){
  	if(this.dataInicioBeneficio == undefined || this.dataInicioBeneficio == ''){
  		this.errors.add({"dataInicioBeneficio":["A data de inicio do benefício é obrigatória."]});
  	}
  	if(this.periodoInicioBeneficio == undefined || this.periodoInicioBeneficio == ''){
  		this.errors.add({"periodoInicioBeneficio":["O período do inicio do benefício é obrigatório."]});
  	}
  	if(this.especieBeneficio == undefined || this.especieBeneficio == ''){
  		this.errors.add({"especieBeneficio":["A espécie do benefício é obrigatória."]});
  	}
  	if(this.primaria98anos == undefined || this.primaria98anos == ''){
  		this.errors.add({"primaria98anos":["Campo obrigatório."]});
  	}
  	if(this.primaria98dias == undefined || this.primaria98dias == ''){
  		this.errors.add({"primaria98dias":["Campo obrigatório."]});
  	}else{
  		if(this.secundariaAtualdias <= 12){
	  		this.errors.add({"secundariaAtualdias":["Insira um valor entre 0 e 30"]});
  		}
  	}
  	if(this.primaria98meses == undefined || this.primaria98meses == ''){
  		this.errors.add({"primaria98meses":["Campo obrigatório."]});
  	}else{
  		if(this.secundariaAtualdias > 12){
	  		this.errors.add({"primaria98meses":["Insira um valor entre 1 e 12"]});
  		}
  	}
  	if(this.secundaria98anos == undefined || this.secundaria98anos == ''){
  		this.errors.add({"secundaria98anos":["Campo obrigatório."]});
  	}
  	if(this.secundaria98meses == undefined || this.secundaria98meses == ''){
  		this.errors.add({"secundaria98meses":["Campo obrigatório."]});
  	}else{
  		if(this.secundaria98meses > 12){
	  		this.errors.add({"secundaria98meses":["Insira um valor entre 1 e 12"]});
  		}
  	}
  	if(this.secundaria98dias == undefined || this.secundaria98dias == ''){
  		this.errors.add({"secundaria98dias":["Campo obrigatório."]});
  	}else{
  		if(this.secundaria98dias > 30 ){
	  		this.errors.add({"secundaria98dias":["Insira um valor entre 0 e 30"]});
  		}
  	}
  	if(this.primaria99anos == undefined || this.primaria99anos == ''){
  		this.errors.add({"primaria99anos":["Campo obrigatório."]});
  	}
  	if(this.primaria99meses == undefined || this.primaria99meses == ''){
  		this.errors.add({"primaria99meses":["Campo obrigatório."]});
  	}else{
  		if(this.primaria99meses > 12){
	  		this.errors.add({"primaria99meses":["Insira um valor entre 1 e 12"]});
  		}
  	}
  	if(this.primaria99dias == undefined || this.primaria99dias == ''){
  		this.errors.add({"primaria99dias":["Campo obrigatório."]});
  	}else{
  		if(this.primaria99dias > 30){
	  		this.errors.add({"primaria99dias":["Insira um valor entre 0 e 30"]});
  		}
  	}
  	if(this.secundaria99anos == undefined || this.secundaria99anos == ''){
  		this.errors.add({"secundaria99anos":["Campo obrigatório."]});
  	}
  	if(this.secundaria99meses == undefined || this.secundaria99meses == ''){
  		this.errors.add({"secundaria99meses":["Campo obrigatório."]});
  	}
  	if(this.secundaria99dias == undefined || this.secundaria99dias == ''){
  		this.errors.add({"secundaria99dias":["Campo obrigatório."]});
  	}else{
  		if(this.secundaria99dias > 30){
	  		this.errors.add({"secundaria99dias":["Insira um valor entre 0 e 30"]});
  		}
  	}
  	if(this.primariaAtualanos == undefined || this.primariaAtualanos == ''){
  		this.errors.add({"primariaAtualanos":["Campo obrigatório."]});
  	}
  	if(this.primariaAtualmeses == undefined || this.primariaAtualmeses == ''){
  		this.errors.add({"primariaAtualmeses":["Campo obrigatório."]});
  	}
  	if(this.primariaAtualdias == undefined || this.primariaAtualdias == ''){
  		this.errors.add({"primariaAtualdias":["Campo obrigatório."]});
  	}else{
  		if(this.primariaAtualdias > 30){
	  		this.errors.add({"primariaAtualdias":["Insira um valor entre 0 e 30"]});
  		}
  	}
  	if(this.secundariaAtualanos == undefined || this.secundariaAtualanos == ''){
  		this.errors.add({"secundariaAtualanos":["Campo obrigatório."]});
  	}
  	if(this.secundariaAtualmeses == undefined || this.secundariaAtualmeses == ''){
  		this.errors.add({"secundariaAtualmeses":["Campo obrigatório."]});
  	}
  	if(this.secundariaAtualdias == undefined || this.secundariaAtualdias == ''){
  		this.errors.add({"secundariaAtualdias":["Campo obrigatório."]});
  	}else{
  		if(this.secundariaAtualdias > 12){
	  		this.errors.add({"secundariaAtualdias":["Insira um valor entre 0 e 30"]});
  		}
  	} 

  	if(this.hasCarencia && (this.carencia == undefined || this.carencia == '')){
  		this.errors.add({"carencia":["Campo obrigatório."]});
  	}
  }

  changePeriodoOptions(){
  	console.log(this.dataInicioBeneficio);
  	var dateBeneficio = new Date(this.dataInicioBeneficio.split('/')[2],this.dataInicioBeneficio.split('/')[1],this.dataInicioBeneficio.split('/')[0]); 
  	console.log(dateBeneficio);
  	if(dateBeneficio < new Date('05/04/1991')){
  		this.periodoOptions.push('Anterior a 05/10/1998');
  	}
  	if(dateBeneficio > new Date('04/10/1988')){
  		this.periodoOptions.push('Entre 05/10/1998 e 04/04/1991 ');
  	}
  	if(dateBeneficio > new Date('04/04/1991')){
  		this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
  	}
  	if(dateBeneficio > new Date('15/12/1998')){
  		this.periodoOptions.push('Entre 16/12/1998 e 28/11/1999');
  	}
  	if(dateBeneficio < new Date('29/11/1999')){
  		this.periodoOptions.push('A partir de 29/11/1999');
  	}
  }

  changeEspecieBeneficio(){
  	if(this.especieBeneficio=='Aposentadoria por idade - Trabalhador Rural' || this.especieBeneficio=='Aposentadoria por idade - Trabalhador Urbano'){
  		this.hasCarencia = true;
  	}else{
  		this.hasCarencia = false;
  	}
  }

}
