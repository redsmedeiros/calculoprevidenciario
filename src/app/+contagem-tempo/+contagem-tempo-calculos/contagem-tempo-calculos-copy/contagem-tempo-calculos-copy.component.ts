import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalculoContagemTempo as CalculoModel } from '../CalculoContagemTempo.model';
import { CalculoContagemTempoService } from '../CalculoContagemTempo.service';
import { ErrorService } from '../../../services/error.service';
import { SeguradoService } from '../../+contagem-tempo-segurados/SeguradoContagemTempo.service';
import { SeguradoContagemTempo as SeguradoModel } from '../+contagem-tempo-segurados/SeguradoContagemTempo.model';
import { PeriodosContagemTempo } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.model';
import { PeriodosContagemTempoService } from 'app/+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.service';
import * as moment from 'moment';
import swal from 'sweetalert2';
import loadingAlert from 'sweetalert2';

import { Auth } from '../../../services/Auth/Auth.service';
import { AuthResponse } from '../../../services/Auth/AuthResponse.model';

@Component({
  selector: 'app-contagem-tempo-calculos-copy',
  templateUrl: './contagem-tempo-calculos-copy.component.html',
  styleUrls: ['./contagem-tempo-calculos-copy.component.css'],
  providers: [
    ErrorService,
  ],
})

export class ContagemTempoCalculosCopyComponent implements OnInit {

  private idSegurado;
  private idCalculo;
  private idCalculoNew;

  private isUpdating;

  public segurado: any = {};
  public calculo: any = {};
  public periodo: any = {};
  public periodosList = [];


  constructor(
    protected SeguradoService: SeguradoService,
    protected CalculoContagemTempoService: CalculoContagemTempoService,
    protected PeriodosContagemTempoService: PeriodosContagemTempoService,
    protected errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
    private Auth: Auth
  ) { }

  ngOnInit() {


    loadingAlert({
      title: 'Aguarde. A cópia está em andamento',
      allowOutsideClick: false
    });


    this.idSegurado = this.route.snapshot.params['id'];
    this.idCalculo = this.route.snapshot.params['id_calculo'];
    this.isUpdating = true;
    this.SeguradoService.find(this.route.snapshot.params['id'])
      .then(segurado => {

        loadingAlert.showLoading();
        this.segurado = segurado;
        if (localStorage.getItem('user_id') != this.segurado.user_id) {
          this.segurado = {};
          // redirecionar para pagina de segurados em caso de falha
          swal({
            type: 'error',
            title: 'Erro - Você não tem permissão para acessar esta página!',
            text: '',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1500
          }).then(() => {
            this.voltar();
          });
        } else {

          this.CalculoContagemTempoService.find(this.idCalculo)
            .then(calculo => {
              this.setCalculo(calculo);

              this.PeriodosContagemTempoService.getByPeriodosId(this.idCalculo)
                .then((periodosContribuicao: PeriodosContagemTempo[]) => {
                  this.setPeriodos(periodosContribuicao);
                  this.copyCalculo();

                });

            });
        }
      });
  }

  /**
   * Remove alguns atributos do calculo para criar a cópia.
   * @param calculo calculo a ser copiado
   */
  private setCalculo(calculo) {
    delete calculo['id'];
    delete calculo['actions'];
    delete calculo['created_at'];
    delete calculo['updated_at'];
    delete calculo['url'];
    delete calculo['form'];
    delete calculo['_data'];
    this.calculo = calculo;
    this.calculo.referencia_calculo = 'Cópia de: ' + this.calculo.referencia_calculo;
  }

  /**
   * Remove o id key e id_contagem_tempo
   * @param periodosContribuicao lista de periodos do calculo para cópia.
   */
  private setPeriodos(periodosContribuicao) {

    this.periodosList = [];
    periodosContribuicao.map((periodo) => {
      delete periodo['id'];
      delete periodo['id_contagem_tempo'];
      this.periodosList.push(periodo);
    });

  }

  /**
   * Ajusta a lista de periodos para gravar
   * @param idCalculoCopy novo id da cópia do cálculo.
   */
  private createListPostPeriodos(idCalculoCopy) {

    this.periodosList.map((periodo) => {
      periodo.id_contagem_tempo = idCalculoCopy
    });

  }

  /**
   * Cria a cópia do calculo e seus periodos se houver,
   * porém ele zera o resultado para que não ocorra erro de interpretação pelo usuário
   */
  public copyCalculo() {

    this.CalculoContagemTempoService
      .save(this.calculo)
      .then((model: CalculoModel) => {
        this.idCalculoNew = model.id;

        if (this.periodosList.length > 0) {
          this.createListPostPeriodos(model.id)
          this.PeriodosContagemTempoService
            .save(this.periodosList)
            .then((model) => {
              loadingAlert.close();
              this.gotoCalculo();
            })
            .catch(errors => this.errors.add(errors));

        } else {
          loadingAlert.close();
          this.gotoCalculo();
        }


      })
      .catch(errors => this.errors.add(errors));
  }

  gotoCalculo() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-periodos/' + this.idSegurado + '/' + this.idCalculoNew;
  }

  voltar() {
    window.location.href = '/#/contagem-tempo/contagem-tempo-segurados/'
  }

}
