
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
      // console.log(this.errors.all())
      swal('Erro', 'Confira os dados digitados', 'error');
    }
    
  }


  resetForm() {
    this.formData = { ...CalculoModel.form };
    this.referencia_calculo = '';
  }

   validate() {
    this.errors.clear('referencia_calculo');
    if (this.referencia_calculo == undefined || this.referencia_calculo == '') {
          this.errors.add({ 'referencia_calculo': ['Insira uma referência para simulação.'] });
       }

   }

}
