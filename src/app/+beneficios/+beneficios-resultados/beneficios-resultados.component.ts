import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { Segurado as SeguradoModel } from "../+beneficios-segurados/Segurado.model";
import { SeguradoService } from "../+beneficios-segurados/Segurado.service";
import { CalculoAtrasado as CalculoModel } from "../+beneficios-calculos/CalculoAtrasado.model";
import { CalculoAtrasadoService as CalculoService } from "../+beneficios-calculos/CalculoAtrasado.service";

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './beneficios-resultados.component.html',
})
export class BeneficiosResultadosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public segurado:any = {};
  public calculo:any = {};

  public isUpdating = false;


  constructor(protected router: Router,
              private route: ActivatedRoute,
              protected Segurado: SeguradoService,
              protected CalculoAtrasado: CalculoService
              ) {}

  ngOnInit() {
    this.isUpdating = true;

    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
    });

    this.CalculoAtrasado.find(this.route.snapshot.params['id_calculo'])
    	.then(calculo => {
    		this.calculo = calculo;
    		console.log(calculo);
    		this.isUpdating = false;
    });

  }

  formatDatetimeToDate(dataString){
  	let date = dataString.split(' ')[0];
  	let splited_date = date.split('-');
  	return splited_date[2] + '/' +splited_date[1] + '/' + splited_date[0];
  }

  formatDate(dataString){
  	if(dataString != '0000-00-00'){
  	  	let splited_date = dataString.split('-');
  	  	return splited_date[2] + '/' +splited_date[1] + '/' + splited_date[0];
  	}
  	return '--'
  }

  formatPercent(value){
  	value = parseFloat(value) * 100;
  	return this.formatDecimal(value, 0) + '%';
  }

  formatMoney(value){
  	return 'R$' + this.formatDecimal(value, 2);
  }

  formatDecimal(value, n_of_decimal_digits){
  	value = parseFloat(value);
  	return (value.toFixed(parseInt(n_of_decimal_digits))).replace('.', ',');
  }
  getTipoAposentadoria(value){
  	console.log(value);
  	let tipos_aposentadoria = [{
  	            name: "Auxílio Doença",
  				value: 0
  			},{
  				name: "Aposentadoria por invalidez Previdenciária ou Pensão por Morte",
  				value: 1
  			},{
  				name: "Aposentadoria por idade - Trabalhador Urbano",
  				value: 2
  			},{
  				name: "Aposentadoria por tempo de contribuição",
  				value: 3
  			},{
  				name: "Aposentadoria por tempo de serviço de professor",
  				value: 4
  			},{
  				name: "Auxílio Acidente previdenciário - 50%",
  				value: 5
  			},{
  				name: "Aposentadoria por idade - Trabalhador Rural",
  				value: 6
  			},{
  				name: "Auxílio Acidente  - 30%",
  				value: 7
  			},{
  				name: "Auxílio Acidente - 40%",
  				value: 8
  			},{
  				name: "Auxílio Acidente - 60%",
  				value: 9
  			},{
  				name: "Abono de Permanência em Serviço",
  				value: 10
  			},{
  				name: "LOAS - Benefício no valor de um salário mínimo",
  				value: 11
  			},{
  				name: "Aposentadoria especial da Pessoa com Deficiência Grave",
  				value: 12
  			},{
  				name: "Aposentadoria especial da Pessoa com Deficiência Moderada",
  				value: 13
  			},{
  				name: "Aposentadoria especial da Pessoa com Deficiência Leve",
  				value: 14
  			},{
  				name: "Aposentadoria especial por Idade da Pessoa com Deficiência",
  				value: 15
  			},{
  				name: "LOAS",
  				value: 16
  			}
  	]
  	return tipos_aposentadoria[value].name;
  }

  editSegurado() {
    window.location.href='/#/beneficios/beneficios-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

}
