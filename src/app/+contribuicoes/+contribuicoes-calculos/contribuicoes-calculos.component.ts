import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoService } from '../Segurado.service';
import { ContribuicaoJurisprudencialService } from './ContribuicaoJurisprudencial.service';
import { ContribuicaoComplementarService } from '../+contribuicoes-complementar/ContribuicaoComplementar.service';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { Auth } from "../../services/Auth/Auth.service";
import { AuthResponse } from "../../services/Auth/AuthResponse.model";
import swal from 'sweetalert2';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './contribuicoes-calculos.component.html',
})
export class ContribuicoesCalculosComponent implements OnInit {

  public isUpdating = false;

  public segurado: any = {};

  public idSegurado = '';

  public jurisprudencialList = this.Jurisprudencial.list;

  public complementarList = this.Complementar.list;

  public jurisprudencialTableOptions = {
    colReorder: true,
    data: this.jurisprudencialList,
    columns: [
      { data: 'actions', width: '15rem' },
      { data: 'id' },
      {
        data: 'data_calculo',
        render: (data) => {
          return this.formatReceivedDateTime(data);
        }
      },
      {
        data: 'inicio_atraso',
        render: (data) => {
          return this.formatReceivedMonthAndYear(data);
        }
      },
      {
        data: 'final_atraso',
        render: (data) => {
          return this.formatReceivedMonthAndYear(data);
        }
      },
    ],
    columnDefs: [
      { className: 'text-center', targets: '_all' },
    ]
  };

  public complementarTableOptions = {
    colReorder: false,
    data: this.complementarList,
    ordering: false,
    columns: [
      { data: 'actions', width: '15rem' },
    //  { data: 'id' },
      {
        data: 'data_calculo',
        render: (data) => {
          return this.formatReceivedDateTime(data);
        }
      },
      {
        data: 'inicio_atraso',
        render: (data) => {
          return this.formatReceivedMonthAndYear(data);
        }
      },
      {
        data: 'final_atraso',
        render: (data) => {
          return this.formatReceivedMonthAndYear(data);
        }
      },
      // {
      //   data: 'contribuicao_basica_inicial',
      //   render: (data) => {
      //     return this.formatReceivedMonthAndYear(data);
      //   }
      // },
      // {
      //   data: 'contribuicao_basica_final',
      //   render: (data) => {
      //     return this.formatReceivedMonthAndYear(data);
      //   }
      // },
      {
        data: 'media_salarial',
        render: (data) => {
          return this.formatMoney(data);
        }
      },
      {
        data: 'media_salarial',
        render: (data) => {
          return this.formatMoney(data);
        }
      },
      {
        data: 'contribuicao_calculada',
        render: (data) => {
          return this.formatMoney(data);
        }
      },
    ],
    columnDefs: [
      { className: 'text-center', targets: '_all' },
    ]
  };



  public state: any = {
    tabs: {
      selectedTab: 'hr2',
    }
  };


  constructor(protected Segurado: SeguradoService,
    protected router: Router,
    private route: ActivatedRoute,
    protected Jurisprudencial: ContribuicaoJurisprudencialService,
    protected Complementar: ContribuicaoComplementarService,
    private Auth: Auth
  ) {
  }

  ngOnInit() {

    this.idSegurado = this.route.snapshot.params['id'];

    this.isUpdating = true;


    // retrive user info
    this.Segurado.find(this.route.snapshot.params['id'])
      .then(segurado => {
        this.segurado = segurado;

        if (localStorage.getItem('user_id') != this.segurado.user_id) {
          //redirecionar para pagina de segurados
          swal({
            type: 'error',
            title: 'Erro',
            text: 'Você não tem permissão para acessar esta página!',
            allowOutsideClick: false
          }).then(() => {
            window.location.href = '/#/contribuicoes/contribuicoes-segurados/';
          });
        } else {
          this.Jurisprudencial.get()
            .then(() => {
              this.jurisprudencialList = this.Jurisprudencial.list;
              this.updateDatatable();
            })

          this.Complementar.get()
            .then(() => {
              this.complementarList = this.Complementar.list;
              this.updateDatatable();
              this.isUpdating = false;
            });
        }
      });


  }


  createNewJurisprudencial() {
    window.location.href = '/#/contribuicoes/' + this.segurado.id + '/novo-jurisprudencial';
  }

  createNewComplementar() {
    window.location.href = '/#/contribuicoes/' + this.segurado.id + '/novo-complementar';
  }

  updateDatatable() {
    this.jurisprudencialList = this.jurisprudencialList.filter(this.isSegurado, this);
    this.jurisprudencialTableOptions = {
      ...this.jurisprudencialTableOptions,
      data: this.jurisprudencialList,
    }

    this.complementarList = this.complementarList.filter(this.isSegurado, this);
    this.complementarTableOptions = {
      ...this.complementarTableOptions,
      data: this.complementarList,
    }
  }

  editSegurado() {
    window.location.href = '/#/contribuicoes/contribuicoes-segurados/' +
      this.route.snapshot.params['id'] + '/editar';
  }

  isSegurado(element, index, array) {
    return element['id_segurado'] == this.idSegurado;
  }

  formatReceivedDateTime(inputDateTime) {
    // inputDateTime.substring(11, 19) + ' ' +
    return  this.formatReceivedDate(inputDateTime.substring(0, 10));
  }

  formatMoney(data) {
    return 'R$' + (data.toFixed(2)).replace('.', ',');
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
    if (!inputDate) {
      return '';
    } else {
      let date = moment(inputDate);
      return date.format('MM/YYYY');
    }
  }

  formatReceivedDate(inputDate) {
    var date = new Date(inputDate);
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return ('0' + (date.getDate() + 1)).slice(-2) + '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        date.getFullYear();
    }
    return '';
  }

}
