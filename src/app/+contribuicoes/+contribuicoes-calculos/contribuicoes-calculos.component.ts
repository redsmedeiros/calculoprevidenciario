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

  public segurado;

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

  updateDatatable() {
    this.jurisprudencialTableOptions = {
      ...this.jurisprudencialTableOptions,
      data: [...this.list],
    }
  }

}
