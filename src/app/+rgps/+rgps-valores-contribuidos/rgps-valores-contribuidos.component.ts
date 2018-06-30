import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { CalculoRgpsService } from '../+rgps-calculos/CalculoRgps.service';
import { ErrorService } from '../../services/error.service';
import * as moment from 'moment';
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-valores-contribuidos.component.html',
  providers: [
    ErrorService
  ]
})


export class RgpsValoresContribuidosComponent implements OnInit {

  public isUpdating = false;

  public idSegurado = '';

  public segurado:any = {};
  public calculo:any = {};
  public calculoList = [];

  input = [];

  public grupoCalculosTableOptions = {
    colReorder: false,
    data: this.calculoList,
    columns: [
      {data: 'especie'},
      {data: 'periodoInicioBeneficio'},
      {data: 'contribuicaoPrimaria'},
      {data: 'contribuicaoSecundaria'},
      {data: 'dib'},
      {data: 'dataCriacao'},
    ] 
  };

  public inicioPeriodo = '';
  public finalPeriodo = '';
  public salarioContribuicao = undefined;
  public tipoContribuicao = 'Primaria';

  matriz = [
    {
      "ano": 1995,
      "valores": [
        1230.23,
        1523.85,
        1549.12,
        1654.58,
        2487.23,
        1982.63,
        1754.85,
        3546.85,
        2459.45,
        1468.91,
        2146.85,
        1793.25
      ]
    },
    {
      "ano": 1996,
      "valores": [
        1230.23,
        1523.85,
        1549.12,
        1654.58,
        2487.23,
        1982.63,
        1754.85,
        3546.85,
        2459.45,
        1468.91,
        2146.85,
        1793.25
      ]
    }
  ];

  onKey(ano, mes, valor) { // without type info
    console.log(ano + "," + mes + "," +  valor);
  }
  randomInt(min, max){
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  constructor(protected router: Router,
    private route: ActivatedRoute,
    protected Segurado: SeguradoService,    
    protected CalculoRgps: CalculoRgpsService,
    protected errors: ErrorService,) {
  }

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.isUpdating = true;
    this.Segurado.find(this.idSegurado)
        .then(segurado => {
            this.segurado = segurado;
            this.CalculoRgps.find(this.route.snapshot.params['id'])
              .then(calculo => {
                this.calculo = calculo;
                this.updateDatatable();
                this.isUpdating = false;
            });
    });
  }

  updateDatatable() {
    let especie = this.calculo.tipo_seguro;
    let periodoInicioBeneficio = this.calculo.tipo_aposentadoria;
    let contribuicaoPrimaria = this.getTempoDeContribuicaoPrimaria(this.calculo);
    let contribuicaoSecundaria = this.getTempoDeContribuicaoSecundaria(this.calculo);
    let dib = this.calculo.data_pedido_beneficio;
    let dataCriacao = this.formatReceivedDate(this.calculo.data_calculo);

    let line = {
      especie: especie,
      periodoInicioBeneficio:periodoInicioBeneficio,
      contribuicaoPrimaria:contribuicaoPrimaria,
      contribuicaoSecundaria:contribuicaoSecundaria,
      dib:dib,
      dataCriacao:dataCriacao
    }

    this.calculoList.push(line);

    this.grupoCalculosTableOptions = {
      ...this.grupoCalculosTableOptions,
      data: this.calculoList,
    }
  }

  submit() {
    console.log(this.inicioPeriodo,this.finalPeriodo, this.salarioContribuicao)

    if(this.isValid()){
      console.log('valid')
    }else{
      swal('Erro', 'Confira os dados digitados','error');
    }
    
  }

  isValid(){
    let dateInicioPeriodo = moment(this.inicioPeriodo.split('/')[1] + '-' + this.inicioPeriodo.split('/')[0]  + '-01');
    let dateFinalPeriodo = moment(this.finalPeriodo.split('/')[1] + '-' + this.finalPeriodo.split('/')[0]  + '-01');

    //inicioPeriodo
    if(this.isEmpty(this.inicioPeriodo) || !dateInicioPeriodo.isValid()){
      this.errors.add({"inicioPeriodo":["Insira uma data válida"]});
    }

    //finalPeriodo
    if(this.isEmpty(this.finalPeriodo) || !dateFinalPeriodo.isValid()){
      this.errors.add({"finalPeriodo":["Insira uma data válida"]});
    }else{
      if(dateFinalPeriodo <= dateInicioPeriodo){
        this.errors.add({"finalPeriodo":["Insira uma data posterior a data inicial"]});
      }
    }

    //salarioContribuicao
    if(this.isEmpty(this.salarioContribuicao)){
      this.errors.add({"salarioContribuicao":["Insira o salário"]});
    }else{
      this.errors.clear('salarioContribuicao');
    }

    return this.errors.empty();
  }

  isEmpty(data){
    if(data == undefined || data == '') {
      return true;
    }
    return false;
  }

  formatReceivedDate(inputDate) {
      var date = new Date(inputDate);
      date.setTime(date.getTime() + (5*60*60*1000))
      if (!isNaN(date.getTime())) {
          // Months use 0 index.
          return  ('0' + (date.getDate())).slice(-2)+'/'+
                  ('0' + (date.getMonth()+1)).slice(-2)+'/'+
                         date.getFullYear();
      }
      return '';
  }

  getTempoDeContribuicaoPrimaria(data) {
    let str = '';
    if (data.contribuicao_primaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_98.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_primaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_99.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_primaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_atual.replace(/-/g,'/') +'<br>';
    }

    return str;

  }

  getTempoDeContribuicaoSecundaria(data) {
    let str = '';
    if (data.contribuicao_secundaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_98.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_secundaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_99.replace(/-/g,'/') +'<br>';
    }
    if (data.contribuicao_secundaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_atual.replace(/-/g,'/') +'<br>';
    }

    return str;

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

  editSegurado() {
    window.location.href='/#/rgps/rgps-segurados/'+ 
                            this.route.snapshot.params['id_segurado']+'/editar';
  }

}
