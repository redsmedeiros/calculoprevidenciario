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

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public isUpdating = false;

  public segurado;

  public idSegurado = '';

  public list = this.Jurisprudencial.list;

  public jurisprudencialTableOptions = {
    colReorder: true,
    data: this.list,
    columns: [
      {data: 'actions'},
      {data: 'id'},
      {data: 'data_calculo'},
      {data: 'inicio_atraso'},
      {data: 'final_atraso'}
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
      data: [...this.list],
    }
  }

  isSegurado(element, index, array){
    return element['id_segurado'] == this.idSegurado;
  }

}
