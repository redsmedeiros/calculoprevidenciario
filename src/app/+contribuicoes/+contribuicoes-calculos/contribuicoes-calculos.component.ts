import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoService } from '../Segurado.service';
import { ContribuicaoJurisprudencialService } from './ContribuicaoJurisprudencial.service';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contribuicoes-calculos.component.html',
})
export class ContribuicoesCalculosComponent implements OnInit {

  public isUpdating = false;

  public segurado:any = {};

  public idSegurado = '';

  public list = this.Jurisprudencial.list;

  public jurisprudencialTableOptions = {
    colReorder: true,
    data: this.list,
    columns: [
      {data: 'actions'},
      {data: 'id'},
      {data: 'data_calculo',
       render: (data) => {
          return this.formatReceivedDateTime(data);
       }},
      {data: 'inicio_atraso',
        render: (data) => {
          return this.formatReceivedMonthAndYear(data);
       }},
      {data: 'final_atraso',
       render: (data) => {
          return this.formatReceivedMonthAndYear(data);
       }},
    ] };
  


  public state: any = {
    tabs: {
      selectedTab: 'hr1',
    }
  };


  constructor(protected Segurado: SeguradoService,
              protected router: Router,
              private route: ActivatedRoute,
              protected Jurisprudencial: ContribuicaoJurisprudencialService
          ) {
  }

  ngOnInit() {

    this.idSegurado = this.route.snapshot.params['id'];

    this.isUpdating = true;
    // retrive user info
    this.Segurado.find(this.route.snapshot.params['id'])
        .then(segurado => {
            this.segurado = segurado;
    });

    this.Jurisprudencial.get()
        .then(() => {
           this.updateDatatable();
           this.list = this.Jurisprudencial.list;
           this.isUpdating = false;
    })
  }


  createNewJurisprudencial() {
    window.location.href='/#/contribuicoes/'+this.segurado.id+'/novo-jurisprudencial';
  }

  createNewComplementar(){
    window.location.href='/#/contribuicoes/'+this.segurado.id+'/novo-complementar';
  }

  updateDatatable() {
    this.list = this.list.filter(this.isSegurado, this);
    this.jurisprudencialTableOptions = {
      ...this.jurisprudencialTableOptions,
      data: this.list,
    }
  }

  editSegurado() {
    window.location.href='/#/contribuicoes/contribuicoes-segurados/'+ 
                            this.route.snapshot.params['id']+'/editar';
  }

  isSegurado(element, index, array){
    return element['id_segurado'] == this.idSegurado;
  }

  formatReceivedDateTime(inputDateTime) {
    return inputDateTime.substring(11, 19) + ' ' + 
           this.formatReceivedDate(inputDateTime.substring(0, 10));
  }


  getDocumentType(id_documento) {
    switch (id_documento) {
      case 1:
        return 'PIS: ';
      case 2:
        return 'PASEP: ';
      case 3:
        return 'CPF: ';
      case 4:
        return 'NIT: ';
      case 5:
        return 'RG: ';
      default:
        return ''
    }
  }

  formatReceivedMonthAndYear(inputDate) {
      var date = new Date(inputDate);
      if (!isNaN(date.getTime())) {
          date.setMonth(date.getMonth()+1);
          // Months use 0 index.
          return ('0' + (date.getMonth()+1)).slice(-2)+'/'+
                         date.getFullYear();
      }
      return '';
  }

  formatReceivedDate(inputDate) {
      var date = new Date(inputDate);
      if (!isNaN(date.getTime())) {
          // Months use 0 index.
          return  ('0' + (date.getDate() +1)).slice(-2)+'/'+
                  ('0' + (date.getMonth()+1)).slice(-2)+'/'+
                         date.getFullYear();
      }
      return '';
  }

}
