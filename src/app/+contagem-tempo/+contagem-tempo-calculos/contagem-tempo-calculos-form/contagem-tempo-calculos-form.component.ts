
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalculoContagemTempo as CalculoModel } from '../CalculoContagemTempo.model';
import swal from 'sweetalert';

@Component({
  selector: 'app-contagem-tempo-calculos-form',
  templateUrl: './contagem-tempo-calculos-form.component.html',
  styleUrls: ['./contagem-tempo-calculos-form.component.css'],
  providers: [
    ErrorService
  ],
})
export class ContagemTempoCalculosFormComponent implements OnInit {

  public id;
  public id_segurado;
  public total_dias;
  public total_88;
  public total_91;
  public total_98;
  public total_99;
  public carencia;
  public tipo_contribuicao;
  public referencia_calculo;
  public created_at;
  public updated_at;











  
  // public dataInicioBeneficio;
  // public periodoInicioBeneficio;
  // public especieBeneficio;

  // public primaria98anos;
  // public primaria98meses;
  // public primaria98dias;

  // public secundaria98anos;
  // public secundaria98meses;
  // public secundaria98dias;

  // public primaria99anos;
  // public primaria99meses;
  // public primaria99dias;

  // public secundaria99anos;
  // public secundaria99meses;
  // public secundaria99dias;

  // public primariaAtualanos;
  // public primariaAtualmeses;
  // public primariaAtualdias;

  // public secundariaAtualanos;
  // public secundariaAtualmeses;
  // public secundariaAtualdias;

  // public grupoDos12;
  // public carencia;

  public hasAnterior = false;
  public has98 = false;
  public has99 = false;
  public hasAtual = false;
  public hasCarencia = false;
  public hasGrupoDos12 = false;

  public periodoOptions: string[] = [];

  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  @Input() formData;
  @Input() errors: ErrorService;
  @Input() isEdit: boolean;
  @Output() onSubmit = new EventEmitter;

  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
    if (this.isEdit) {
       this.referencia_calculo = this.formData.referencia_calculo;
      // this.dataInicioBeneficio = this.formData.data_pedido_beneficio;
      // this.changePeriodoOptions();
      // this.especieBeneficio = this.formData.tipo_seguro;
      // this.changeEspecieBeneficio();
      // this.periodoInicioBeneficio = this.formData.tipo_aposentadoria;
      // this.changeGrupoDos12();
      // if (this.formData.contibuicao_primaria_98 != '') {
      //   this.primaria98anos = this.formData.contribuicao_primaria_98.split('-')[0];
      //   this.primaria98meses = this.formData.contribuicao_primaria_98.split('-')[1];
      //   this.primaria98dias = this.formData.contribuicao_primaria_98.split('-')[2];
      //   this.secundaria98anos = this.formData.contribuicao_secundaria_98.split('-')[0];
      //   this.secundaria98meses = this.formData.contribuicao_secundaria_98.split('-')[1];
      //   this.secundaria98dias = this.formData.contribuicao_secundaria_98.split('-')[2];
      // }

      // if (this.formData.contibuicao_primaria_99 != '') {
      //   this.primaria99anos = this.formData.contribuicao_primaria_99.split('-')[0];
      //   this.primaria99meses = this.formData.contribuicao_primaria_99.split('-')[1];
      //   this.primaria99dias = this.formData.contribuicao_primaria_99.split('-')[2];
      //   this.secundaria99anos = this.formData.contribuicao_secundaria_99.split('-')[0];
      //   this.secundaria99meses = this.formData.contribuicao_secundaria_99.split('-')[1];
      //   this.secundaria99dias = this.formData.contribuicao_secundaria_99.split('-')[2];
      // }
      // if (this.formData.contibuicao_primaria_atual != '') {
      //   this.primariaAtualanos = this.formData.contribuicao_primaria_atual.split('-')[0];
      //   this.primariaAtualmeses = this.formData.contribuicao_primaria_atual.split('-')[1];
      //   this.primariaAtualdias = this.formData.contribuicao_primaria_atual.split('-')[2];
      //   this.secundariaAtualanos = this.formData.contribuicao_secundaria_atual.split('-')[0];
      //   this.secundariaAtualmeses = this.formData.contribuicao_secundaria_atual.split('-')[1];
      //   this.secundariaAtualdias = this.formData.contribuicao_secundaria_atual.split('-')[2];
      // }
      // this.carencia = this.formData.carencia;
      // this.grupoDos12 = this.formData.grupo_dos_12;

    }

  }
  public submit(e) {
    e.preventDefault();
    this.validate();
    if (this.errors.empty()) {

      this.formData.id_segurado = this.route.snapshot.params['id'];
      this.formData.referencia_calculo = this.referencia_calculo;
      swal('Sucesso', 'Cálculo salvo com sucesso', 'success')
      this.onSubmit.emit(this.formData);
      this.resetForm();
    }
    else {
      console.log(this.errors.all())
      swal('Erro', 'Confira os dados digitados', 'error');
    }
  }


  resetForm() {
    this.formData = { ...CalculoModel.form };

    this.referencia_calculo = '';
  }

   validate() {
    if (this.referencia_calculo == undefined || this.referencia_calculo == '') {
          this.errors.add({ 'referencia_calculo': ['Insira uma referência para simulação.'] });
       }

   }

}
