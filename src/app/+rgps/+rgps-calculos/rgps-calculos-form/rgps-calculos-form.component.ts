import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalculoRgps as CalculoModel } from '../CalculoRgps.model';
import { SeguradoService } from 'app/+rgps/+rgps-segurados/SeguradoRgps.service';
// import swal from 'sweetalert2';
import swal from 'sweetalert';
import swal2 from 'sweetalert2';
import * as moment from 'moment';
import { InputFunctions } from 'app/shared/functions/input-functions';


@Component({
  selector: 'app-rgps-calculos-form',
  templateUrl: './rgps-calculos-form.component.html',
  styleUrls: ['./rgps-calculos-form.component.css'],
  providers: [
    ErrorService
  ],
})
export class RgpsCalculosFormComponent implements OnInit, OnChanges {

  public dataInicioBeneficio;
  public lastDataInicioBeneficio;
  public periodoInicioBeneficio;
  public periodoInicioBeneficioOLD;
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

  // reforma EC 103/2019
  public primaria19anos;
  public primaria19meses;
  public primaria19dias;
  // reforma EC 103/2019

  public grupoDos12;
  public carencia;
  public carenciaAposEc103;
  public alertCarenciaAposEc103 = false;

  // reforma EC 103/2019
  public numDependentes;
  public depedenteInvalido;
  public obitoDecorrenciaTrabalho;
  public ultimoBeneficio;
  public sexoInstituidor;
  public divisorMinimo;
  public calcularDescarteAposEC103 = false;
  public isCalcularDescarteAposEC103 = false;
  public calcularDescarteDeficienteEC103 = false;
  public iscalcularDescarteDeficienteEC103 = false;
  public media12Ultimos = false;
  public ismedia12Ultimos = false;
  // reforma EC 103/2019

  public hasAnterior = false;
  public has98 = false;
  public has99 = false;
  public has19 = false;
  public hasAtual = false;
  public hasCarencia = false;
  public hasGrupoDos12 = false;
  public posteriorMaio2013 = false;

  // reforma EC 103/2019
  public hasPensao19 = false;
  public hasInvalidez19 = false;
  public hasPensaoNaoInstuidorAposentado = false;
  public hasPensaoInstuidorAposentado = false;
  public hasAuxilioAcidente = false;
  public hasDivisorMinimo = false;
  // reforma EC 103/2019



  public periodoOptions: string[] = [];
  public dateMaskdiB = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  private segurado;
  private isTransitoria = false;

  private inputFunctions = InputFunctions;

  @Input() formData;
  @Input() errors: ErrorService;
  @Input() isEdit: boolean;
  @Input() dadosPassoaPasso;
  @Input() calculoRMIDefaulForm;
  @Output() retunCTEvent = new EventEmitter;
  @Output() onSubmit = new EventEmitter;

  constructor(
    private route: ActivatedRoute,
    protected Segurado: SeguradoService
  ) { }


  private iniciarForm() {


    if (this.isEdit) {
      this.dataInicioBeneficio = this.formData.data_pedido_beneficio;

      this.changePeriodoOptions();
      this.especieBeneficio = this.formData.tipo_seguro;
      this.changeEspecieBeneficio();
      this.periodoInicioBeneficio = ((this.formData.tipo_aposentadoria === 'A partir de 13/11/2019') ?
        'A partir de 14/11/2019' : this.formData.tipo_aposentadoria);
      //   this.periodoInicioBeneficio = this.formData.tipo_aposentadoria;
      this.periodoInicioBeneficioOLD = this.formData.tipo_aposentadoria;

      this.changeGrupoDos12();
      if (this.formData.contibuicao_primaria_98 !== '') {
        this.primaria98anos = this.formData.contribuicao_primaria_98.split('-')[0];
        this.primaria98meses = this.formData.contribuicao_primaria_98.split('-')[1];
        this.primaria98dias = this.formData.contribuicao_primaria_98.split('-')[2];
        this.secundaria98anos = this.formData.contribuicao_secundaria_98.split('-')[0];
        this.secundaria98meses = this.formData.contribuicao_secundaria_98.split('-')[1];
        this.secundaria98dias = this.formData.contribuicao_secundaria_98.split('-')[2];
      }

      if (this.formData.contibuicao_primaria_99 !== '') {
        this.primaria99anos = this.formData.contribuicao_primaria_99.split('-')[0];
        this.primaria99meses = this.formData.contribuicao_primaria_99.split('-')[1];
        this.primaria99dias = this.formData.contribuicao_primaria_99.split('-')[2];
        this.secundaria99anos = this.formData.contribuicao_secundaria_99.split('-')[0];
        this.secundaria99meses = this.formData.contribuicao_secundaria_99.split('-')[1];
        this.secundaria99dias = this.formData.contribuicao_secundaria_99.split('-')[2];
      }
      if (this.formData.contibuicao_primaria_atual !== '') {
        this.primariaAtualanos = this.formData.contribuicao_primaria_atual.split('-')[0];
        this.primariaAtualmeses = this.formData.contribuicao_primaria_atual.split('-')[1];
        this.primariaAtualdias = this.formData.contribuicao_primaria_atual.split('-')[2];
        this.secundariaAtualanos = this.formData.contribuicao_secundaria_atual.split('-')[0];
        this.secundariaAtualmeses = this.formData.contribuicao_secundaria_atual.split('-')[1];
        this.secundariaAtualdias = this.formData.contribuicao_secundaria_atual.split('-')[2];
      }

      if (this.formData.contibuicao_primaria_19 !== '') {
        this.primaria19anos = this.formData.contribuicao_primaria_19.split('-')[0];
        this.primaria19meses = this.formData.contribuicao_primaria_19.split('-')[1];
        this.primaria19dias = this.formData.contribuicao_primaria_19.split('-')[2];
      }

      this.numDependentes = this.formData.num_dependentes;
      this.depedenteInvalido = this.formData.depedente_invalido;
      this.obitoDecorrenciaTrabalho = this.formData.obito_decorrencia_trabalho;
      this.ultimoBeneficio = this.formData.ultimo_beneficio;
      this.sexoInstituidor = this.formData.sexo_instituidor;
      this.divisorMinimo = this.formData.divisor_minimo;
      this.carencia = this.formData.carencia;
      this.carenciaAposEc103 = this.formData.carencia_apos_ec103;
      this.grupoDos12 = this.formData.grupo_dos_12;
      this.calcularDescarteAposEC103 = this.formData.calcular_descarte_apos_ec103;
      this.calcularDescarteDeficienteEC103 = this.formData.calcular_descarte_deficiente_ec103;
      this.media12Ultimos = this.formData.media_12_ultimos;

    } else {
      this.checkImportContagemTempo();
    }

    if (!this.isEdit && this.isExits(this.calculoRMIDefaulForm)) {
      this.setNewFormRMIinfoContagemTempo();
    }

    this.lastDataInicioBeneficio = this.dataInicioBeneficio;

    // console.log(this.calculoRMIDefaulForm);

  }

  private setNewFormRMIinfoContagemTempo() {

    if (this.isExits(this.calculoRMIDefaulForm)) {
      for (const key in this.calculoRMIDefaulForm) {
        if (Object.prototype.hasOwnProperty.call(this.calculoRMIDefaulForm, key)) {

          this[key] = this.calculoRMIDefaulForm[key];

        }
      }

    }

    this.changePeriodoOptions();

  }


  ngOnInit() { }


  ngOnChanges(changes: SimpleChanges) {

    this.getSegurado();
    this.iniciarForm();

  }



  private getSegurado() {

    this.Segurado.find(this.route.snapshot.params['id'])
      .then(segurado => {
        this.segurado = segurado;

        if (moment(this.segurado.data_filiacao, 'DD/MM/YYYY').isAfter('2019-11-13')) {
          this.isTransitoria = true;
        }

      });

  }


  public submit(e) {
    e.preventDefault();
    this.validate();
    if (this.errors.empty()) {

      this.formData.id_segurado = this.route.snapshot.params['id'];
      this.formData.tipo_seguro = this.especieBeneficio;
      this.formData.tipo_aposentadoria = this.periodoInicioBeneficio;
      this.formData.data_pedido_beneficio = this.dataInicioBeneficio;
      this.formData.contribuicao_primaria_98 = this.formatDate('98', 0);
      this.formData.contribuicao_primaria_99 = this.formatDate('99', 0);
      this.formData.contribuicao_primaria_atual = this.formatDate('atual', 0);
      this.formData.contribuicao_primaria_19 = this.formatDate('19', 0);
      this.formData.contribuicao_secundaria_98 = this.formatDate('98', 1);
      this.formData.contribuicao_secundaria_99 = this.formatDate('99', 1);
      this.formData.contribuicao_secundaria_atual = this.formatDate('atual', 1);
      this.formData.valor_beneficio = ''; // TODO: deixar em branco por enquanto
      this.formData.soma_contribuicao = ''; // TODO: deixar em branco por enquanto
      this.formData.carencia = this.carencia;
      this.formData.carencia_apos_ec103 = this.carenciaAposEc103;
      this.formData.grupo_dos_12 = this.grupoDos12;

      // pens??o inicio por morte EC103
      this.formData.num_dependentes = this.numDependentes;
      this.formData.depedente_invalido = this.depedenteInvalido;
      this.formData.obito_decorrencia_trabalho = this.obitoDecorrenciaTrabalho;
      this.formData.ultimo_beneficio = this.ultimoBeneficio;
      this.formData.sexo_instituidor = this.sexoInstituidor;
      // pens??o fim por morte
      this.formData.divisor_minimo = this.divisorMinimo;
      this.formData.calcular_descarte_apos_ec103 = this.calcularDescarteAposEC103;
      this.formData.calcular_descarte_deficiente_ec103 = this.calcularDescarteDeficienteEC103;
      this.formData.media_12_ultimos = this.media12Ultimos;

      //  swal('Sucesso', 'C??lculo salvo com sucesso', 'success');
      this.onSubmit.emit(this.formData);
      this.resetForm();

    } else {

      // console.log(this.errors.all())
      // swal('Erro', 'Confira os dados digitados', 'error');

      const swalErrorConf = {
        position: 'top-end',
        icon: 'error',
        title: 'Confira os dados digitados',
        button: false,
        timer: 1500
      };

      swal(swalErrorConf);

    }
  }


  resetForm() {
    this.formData = { ...CalculoModel.form };
    this.dataInicioBeneficio = '';
    this.periodoInicioBeneficio = '';
    this.periodoInicioBeneficioOLD = '';
    this.especieBeneficio = '- Selecione uma esp??cie -';

    this.primaria98anos = '';
    this.primaria98meses = '';
    this.primaria98dias = '';

    this.secundaria98anos = '';
    this.secundaria98meses = '';
    this.secundaria98dias = '';

    this.primaria99anos = '';
    this.primaria99meses = '';
    this.primaria99dias = '';

    this.secundaria99anos = '';
    this.secundaria99meses = '';
    this.secundaria99dias = '';

    this.primariaAtualanos = '';
    this.primariaAtualmeses = '';
    this.primariaAtualdias = '';

    this.secundariaAtualanos = '';
    this.secundariaAtualmeses = '';
    this.secundariaAtualdias = '';

    this.primaria19anos = '';
    this.primaria19meses = '';
    this.primaria19dias = '';

    this.grupoDos12 = '';
    this.carencia = '';
    this.carenciaAposEc103 = '';

    this.numDependentes = 0;
    this.depedenteInvalido = false;
    this.obitoDecorrenciaTrabalho = false;
    this.ultimoBeneficio = false;
    this.sexoInstituidor = '';

    this.divisorMinimo = false;

    this.hasAnterior = false;
    this.has98 = false;
    this.has99 = false;
    this.has19 = false;
    this.hasAtual = false;
    this.hasCarencia = false;
    this.hasGrupoDos12 = false;
  }

  validate() {

    this.errors.clear();

    if (this.dataInicioBeneficio === undefined || this.dataInicioBeneficio === '') {
      this.errors.add({ 'dataInicioBeneficio': ['A Data ?? obrigat??ria.'] });
    } else {

      const dateParts = this.dataInicioBeneficio.split('/');
      const date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);

      if (isNaN(date.getTime()) || date < new Date('01/01/1970')) {
        this.errors.add({ 'dataInicioBeneficio': ['Insira uma data v??lida.'] });
      }

    }

    if (this.periodoInicioBeneficio === undefined || this.periodoInicioBeneficio === '') {
      this.errors.add({ 'periodoInicioBeneficio': ['Selecione per??odo.'] });
    }

    if (this.especieBeneficio === undefined || this.especieBeneficio === '' || this.especieBeneficio === '- Selecione uma esp??cie -') {
      this.errors.add({ 'especieBeneficio': ['A esp??cie do benef??cio ?? obrigat??ria.'] });
    }

    if (this.has98 || this.hasAnterior) {
      if (this.primaria98anos === undefined || this.primaria98anos === '') {
        this.errors.add({ 'primaria98anos': ['Campo obrigat??rio.'] });
      } else {
        if (!this.isNumber(this.primaria98anos)) {
          this.errors.add({ 'primaria98anos': ['Valor inv??lido.'] });
        }
      }

      if (this.primaria98dias === undefined || this.primaria98dias === '') {
        this.errors.add({ 'primaria98dias': ['Campo obrigat??rio.'] });
      } else {
        if (this.primaria98dias > 29 || !this.isNumber(this.primaria98dias)) {
          this.errors.add({ 'primaria98dias': ['Insira um valor entre 0 e 29'] });
        }
      }

      if (this.primaria98meses === undefined || this.primaria98meses === '') {
        this.errors.add({ 'primaria98meses': ['Campo obrigat??rio.'] });
      } else {
        if (this.primaria98meses > 11 || !this.isNumber(this.primaria98meses)) {
          this.errors.add({ 'primaria98meses': ['Insira um valor entre 0 e 11'] });
        }
      }

      if (!(this.secundaria98anos === undefined || this.secundaria98anos === '')) {
        if (!this.isNumber(this.secundaria98anos)) {
          this.errors.add({ 'secundaria98anos': ['Valor inv??lido.'] });
        }
      }

      if (!(this.secundaria98meses === undefined || this.secundaria98meses === '')) {
        if (this.secundaria98meses > 11 || !this.isNumber(this.secundaria98meses)) {
          this.errors.add({ 'secundaria98meses': ['Insira um valor entre 1 e 11'] });
        }
      }

      if (!(this.secundaria98dias === undefined || this.secundaria98dias === '')) {
        if (this.secundaria98dias > 29 || !this.isNumber(this.secundaria98dias)) {
          this.errors.add({ 'secundaria98dias': ['Insira um valor entre 0 e 29'] });
        }
      }
    }


    if (this.has99) {
      if (this.primaria99anos === undefined || this.primaria99anos === '') {
        this.errors.add({ 'primaria99anos': ['Campo obrigat??rio.'] });
      } else {
        if (!this.isNumber(this.primaria99anos)) {
          this.errors.add({ 'primaria99anos': ['Valor inv??lido.'] });
        }
      }

      if (this.primaria99meses === undefined || this.primaria99meses === '') {
        this.errors.add({ 'primaria99meses': ['Campo obrigat??rio.'] });
      } else {
        if (this.primaria99meses > 11 || !this.isNumber(this.primaria99meses)) {
          this.errors.add({ 'primaria99meses': ['Insira um valor entre 1 e 11'] });
        }
      }

      if (this.primaria99dias === undefined || this.primaria99dias === '') {
        this.errors.add({ 'primaria99dias': ['Campo obrigat??rio.'] });
      } else {
        if (this.primaria99dias > 29 || !this.isNumber(this.primaria99dias)) {
          this.errors.add({ 'primaria99dias': ['Insira um valor entre 0 e 29'] });
        }
      }

      if (!(this.secundaria99anos === undefined || this.secundaria99anos === '')) {
        if (!this.isNumber(this.secundaria99anos)) {
          this.errors.add({ 'secundaria99anos': ['Valor inv??lido.'] });
        }
      }

      if (!(this.secundaria99meses === undefined || this.secundaria99meses === '')) {
        if (this.secundaria99meses > 11 || !this.isNumber(this.secundaria99meses)) {
          this.errors.add({ 'secundaria99meses': ['Insira um valor entre 1 e 11'] });
        }
      }

      if (!(this.secundaria99dias === undefined || this.secundaria99dias === '')) {
        if (this.secundaria99dias > 29 || !this.isNumber(this.secundaria99dias)) {
          this.errors.add({ 'secundaria99dias': ['Insira um valor entre 0 e 29'] });
        }
      }
    }

    if (this.hasAtual) {
      if (this.primariaAtualanos === undefined || this.primariaAtualanos === '') {
        this.errors.add({ 'primariaAtualanos': ['Campo obrigat??rio.'] });
      } else {
        if (!this.isNumber(this.primariaAtualanos)) {
          this.errors.add({ 'primariaAtualanos': ['Valor inv??lido.'] });
        }
      }

      if (this.primariaAtualmeses === undefined || this.primariaAtualmeses === '') {
        this.errors.add({ 'primariaAtualmeses': ['Campo obrigat??rio.'] });
      } else {
        if (this.primariaAtualmeses > 11 || !this.isNumber(this.primariaAtualmeses)) {
          this.errors.add({ 'primariaAtualmeses': ['Insira um valor entre 1 e 11'] });
        }
      }

      if (this.primariaAtualdias === undefined || this.primariaAtualdias === '') {
        this.errors.add({ 'primariaAtualdias': ['Campo obrigat??rio.'] });
      } else {
        if (this.primariaAtualdias > 29 || !this.isNumber(this.primariaAtualdias)) {
          this.errors.add({ 'primariaAtualdias': ['Insira um valor entre 0 e 29'] });
        }
      }

      // Secundaria
      if (!(this.secundariaAtualanos === undefined || this.secundariaAtualanos === '')) {
        if (!this.isNumber(this.secundariaAtualanos)) {
          this.errors.add({ 'secundariaAtualanos': ['Valor inv??lido.'] });
        }
      }

      if (!(this.secundariaAtualmeses === undefined || this.secundariaAtualmeses === '')) {
        if (this.secundariaAtualmeses > 11 || !this.isNumber(this.secundariaAtualmeses)) {
          this.errors.add({ 'secundariaAtualmeses': ['Insira um valor entre 1 e 11'] });
        }
      }

      if (!(this.secundariaAtualdias === undefined || this.secundariaAtualdias === '')) {
        if (this.secundariaAtualdias > 29 || !this.isNumber(this.secundariaAtualdias)) {
          this.errors.add({ 'secundariaAtualdias': ['Insira um valor entre 0 e 29'] });
        }
      }
    }

    if (this.has19 && (this.especieBeneficio !== 'Pens??o por Morte instituidor aposentado na data ??bito'
      && this.especieBeneficio !== 'Pens??o por Morte - Instituidor Aposentado na Data do ??bito')) {
      if (this.primaria19anos === undefined || this.primaria19anos === '') {
        this.errors.add({ 'primaria19anos': ['Campo obrigat??rio.'] });
      } else {
        if (!this.isNumber(this.primaria19anos)) {
          this.errors.add({ 'primaria19anos': ['Valor inv??lido.'] });
        }
      }

      if (this.primaria19meses === undefined || this.primaria19meses === '') {
        this.errors.add({ 'primaria19meses': ['Campo obrigat??rio.'] });
      } else {
        if (this.primaria19meses > 11 || !this.isNumber(this.primaria19meses)) {
          this.errors.add({ 'primaria19meses': ['Insira um valor entre 1 e 11'] });
        }
      }

      if (this.primaria19dias === undefined || this.primaria19dias === '') {
        this.errors.add({ 'primaria19dias': ['Campo obrigat??rio.'] });
      } else {
        if (this.primaria19dias > 29 || !this.isNumber(this.primaria19dias)) {
          this.errors.add({ 'primaria19dias': ['Insira um valor entre 0 e 29'] });
        }
      }


      if ((this.hasPensao19 && this.hasPensaoNaoInstuidorAposentado) &&
        (this.sexoInstituidor === undefined || this.sexoInstituidor === '')) {

        this.errors.add({ 'sexoInstituidor': ['O campo sexo do instituidor ?? obrigat??rio.'] });
      }

      if (this.hasPensao19 &&
        (this.numDependentes === undefined || this.numDependentes === '' || !this.isNumber(this.numDependentes))) {
        this.errors.add({ 'numDependentes': ['Campo obrigat??rio.'] });
      }

      // if (this.hasPensao19 && (this.depedente_invalido == undefined || this.carencia === '')) {
      //   this.errors.add({ 'carencia': ['Preenchimento Obrigat??rio.'] });
      // }

      // if (this.hasPensao19 && (this.carencia == undefined || this.carencia === '')) {
      //   this.errors.add({ 'carencia': ['Preenchimento Obrigat??rio.'] });
      // }

    }

    if (this.hasCarencia && (this.carencia === undefined || this.carencia === '')
      && this.getEspecieBeneficio(this.especieBeneficio) !== 31) {
      this.errors.add({ 'carencia': ['Campo obrigat??rio.'] });
    }

    if (this.has19 && (this.hasCarencia && (this.carenciaAposEc103 === undefined || this.carenciaAposEc103 === ''))) {
      this.errors.add({ 'carenciaAposEc103': ['Campo obrigat??rio.'] });
    }

  }

  clearEspecieChange() {
    if (this.periodoInicioBeneficio !== this.periodoInicioBeneficioOLD) {
      this.especieBeneficio = '';
    }
  }

  changePeriodoOptions() {
    this.errors.clear('dataInicioBeneficio');
    this.errors.clear('periodoInicioBeneficio');
    this.periodoOptions = [];

    this.hasPensao19 = false;
    this.hasPensaoNaoInstuidorAposentado = false;
    this.hasPensaoInstuidorAposentado = false;
    this.hasAuxilioAcidente = false;


    let tipoInvalidezPensao = false;
    if ((this.especieBeneficio === 'Aposentadoria por invalidez Previdenci??ria ou Pens??o por Morte') ||
      (this.especieBeneficio === 'Aposentadoria especial por Idade da Pessoa com Defici??ncia') ||
      (this.especieBeneficio === 'Aposentadoria por Idade da Pessoa com Defici??ncia')
    ) {
      tipoInvalidezPensao = true;
    }

    if ((this.especieBeneficio === 'Pens??o por Morte - Instituidor Aposentado na Data do ??bito') ||
      (this.especieBeneficio === 'Pens??o por Morte - Instituidor n??o Aposentado na Data do ??bito') ||
      (this.especieBeneficio === 'Pens??o por Morte instituidor aposentado na data ??bito') ||
      (this.especieBeneficio === 'Pens??o por Morte instituidor n??o ?? aposentado na data ??bito')) {
      this.hasPensao19 = true;
      tipoInvalidezPensao = true;

      // campos especificos para pens??o por morte
      if ((this.especieBeneficio === 'Pens??o por Morte - Instituidor n??o Aposentado na Data do ??bito') ||
        (this.especieBeneficio === 'Pens??o por Morte instituidor n??o ?? aposentado na data ??bito')) {
        this.hasPensaoNaoInstuidorAposentado = true;
      } else {
        this.hasPensaoInstuidorAposentado = true;
      }

    }

    let tipoIdade = false;
    if ([
      'Aposentadoria por idade - Trabalhador Urbano',
      'Aposentadoria por idade - Trabalhador Rural',
      'Aposentadoria por Idade - Trabalhador Urbano',
      'Aposentadoria por Idade - Trabalhador Rural',
      'Aposentadoria por Idade da PcD',
      'Aux??lio Doen??a',
      'Aux??lio por Incapacidade Tempor??ria',
      'Aposentadoria Programada',
      'Aposentadoria Programada - Professor'
    ].includes(this.especieBeneficio)) {
      tipoIdade = true;
    }


    this.hasInvalidez19 = false;
    if ((this.especieBeneficio === 'Aposentadoria por Incapacidade Permanente') ||
      (this.especieBeneficio === 'Aposentadoria por incapacidade permanente') ||
      (this.especieBeneficio === 'Pens??o por Morte instituidor n??o ?? aposentado na data ??bito') ||
      (this.especieBeneficio === 'Pens??o por Morte - Instituidor n??o Aposentado na Data do ??bito')
    ) {
      this.hasInvalidez19 = true;
      tipoInvalidezPensao = true;
    }

    if ((this.especieBeneficio === 'Aux??lio Acidente - 50%') || (this.especieBeneficio === 'Aux??lio Acidente')) {
      tipoInvalidezPensao = true;
      this.hasAuxilioAcidente = true;
    }

    this.hasDivisorMinimo = false;
    if ([
      'Aposentadoria por tempo de contribui????o',
      'Aposentadoria por Tempo de Contribui????o',
      'Aposentadoria por idade - Trabalhador Urbano',
      'Aposentadoria por idade - Trabalhador Rural',
      'Aposentadoria por Idade - Trabalhador Urbano',
      'Aposentadoria por Idade - Trabalhador Rural',
      'Aposentadoria Programada',
      'Aposentadoria Programada - Professor',
      'Aposentadoria especial - 15 anos de exposi????o',
      'Aposentadoria especial - 20 anos de exposi????o',
      'Aposentadoria especial - 25 anos de exposi????o',
      'Aposentadoria Especial - 15 anos',
      'Aposentadoria Especial - 20 anos',
      'Aposentadoria Especial - 25 anos',
      'Aposentadoria por tempo de servi??o de professor',
      'Aposentadoria por Tempo de Contribui????o do(a) Professor(a)',
      'Aposentadoria especial da Pessoa com Defici??ncia Grave',
      'Aposentadoria especial da Pessoa com Defici??ncia Moderada',
      'Aposentadoria especial da Pessoa com Defici??ncia Leve',
      'Aposentadoria especial por Idade da Pessoa com Defici??ncia',
      'Aposentadoria por Idade da Pessoa com Defici??ncia',
      'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Grave)',
      'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Moderada)',
      'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Leve)',
      'Aposentadoria por Idade da PcD',
    ].includes(this.especieBeneficio)
    ) {
      this.hasDivisorMinimo = true;
    }

    if (moment(this.dataInicioBeneficio, 'DD/MM/YYYY') > moment('2013-05-08')) {
      this.posteriorMaio2013 = true;
    } else {
      this.posteriorMaio2013 = false;
    }

    const dib = moment(this.dataInicioBeneficio, 'DD/MM/YYYY');

    if (dib < moment('1988-10-05')) {

      this.periodoOptions.push('Anterior a 05/10/1988');
      this.periodoInicioBeneficio = 'Anterior a 05/10/1988';

    } else if (dib >= moment('1988-10-05') && dib < moment('1991-04-05')) {

      this.periodoOptions.push('Anterior a 05/10/1988');
      this.periodoOptions.push('Entre 05/10/1988 e 04/04/1991');
      this.periodoInicioBeneficio = 'Entre 05/10/1988 e 04/04/1991';

    } else if (dib >= moment('1991-04-05') && dib <= moment('1998-12-15')) {

      this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
      this.periodoInicioBeneficio = 'Entre 05/04/1991 e 15/12/1998';

    } else if (dib > moment('1998-12-15') && dib <= moment('1999-11-29')) {

      this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
      this.periodoOptions.push('Entre 16/12/1998 e 28/11/1999');
      this.periodoInicioBeneficio = 'Entre 16/12/1998 e 28/11/1999';

    } else if (dib > moment('1999-11-29') && dib <= moment('2019-11-13')) {
      if (!tipoInvalidezPensao) {
        this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
        this.periodoOptions.push('Entre 16/12/1998 e 28/11/1999');
      }

      // this.periodoOptions.push('A partir de 29/11/1999');
      // this.periodoInicioBeneficio = 'A partir de 29/11/1999';

      this.periodoOptions.push('Entre 29/11/1999 e 13/11/2019');
      this.periodoInicioBeneficio = 'Entre 29/11/1999 e 13/11/2019';

    } else if (dib > moment('2019-11-13')) {

      if (!tipoInvalidezPensao) {
        this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
        this.periodoOptions.push('Entre 16/12/1998 e 28/11/1999');
      }

      this.periodoOptions.push('Entre 29/11/1999 e 13/11/2019');
      this.periodoOptions.push('A partir de 14/11/2019');
      this.periodoInicioBeneficio = 'A partir de 14/11/2019';
    }

    let dateParts = this.dataInicioBeneficio.split('/');
    let dateBeneficio = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);

    // if (dateBeneficio < new Date('04/05/1991')) {
    //   this.periodoOptions.push('Anterior a 05/10/1988');
    // }
    // if (dateBeneficio > new Date('10/04/1988')) {
    //   this.periodoOptions.push('Entre 05/10/1988 e 04/04/1991');
    // }
    // if (dateBeneficio > new Date('04/04/1991')) {
    //   this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
    // }
    // if (dateBeneficio > new Date('12/15/1998')) {
    //   this.periodoOptions.push('Entre 16/12/1998 e 28/11/1999');
    // }
    // if (dateBeneficio > new Date('11/29/1999')) {
    //   this.periodoOptions.push('A partir de 29/11/1999');
    // }

    if (dateBeneficio < new Date('12/16/1998')) {
      this.hasAnterior = true;
      this.has98 = false
      this.has99 = false;
      this.hasAtual = false;
      this.has19 = false;
    } else if (dateBeneficio >= new Date('12/16/1998') && dateBeneficio <= new Date('11/29/1999')) {
      this.hasAnterior = false;
      this.has98 = true;
      this.has99 = true;
      this.hasAtual = false;
      this.has19 = false;
    } else if (dateBeneficio > new Date('11/29/1999') && dateBeneficio <= new Date('11/13/2019')) {

      this.hasAnterior = false;
      this.has98 = true;
      this.has99 = true;
      this.hasAtual = true;
      this.has19 = false;

      if (tipoInvalidezPensao) {
        this.hasAnterior = false;
        this.has98 = false;
        this.has99 = false;
        this.hasAtual = true;
        this.has19 = false;
      }

      if (tipoIdade) {
        this.hasAnterior = false;
        this.has98 = false;
        this.has99 = false;
        this.hasAtual = true;
        this.has19 = false;
      }

    } else if (dateBeneficio > new Date('11/13/2019')) {
      this.hasAnterior = false;
      this.has98 = true;
      this.has99 = true;
      this.hasAtual = true;
      this.has19 = true;

      if (tipoInvalidezPensao) {
        this.hasAnterior = false;
        this.has98 = false;
        this.has99 = false;
        this.hasAtual = false;
        this.has19 = true;
      }


      if (tipoIdade) {
        this.hasAnterior = false;
        this.has98 = false;
        this.has99 = false;
        this.hasAtual = true;
        this.has19 = true;
      }

      if (this.getEspecieBeneficio(this.especieBeneficio) === 31) {
        this.hasAnterior = false;
        this.has98 = false;
        this.has99 = false;
        this.hasAtual = false;
        this.has19 = true;
      }

    } else {
      this.hasAnterior = false;
      this.has98 = false;
      this.has99 = false;
      this.hasAtual = false;
      this.has19 = false;
    }

  }

  importContagemTempo() {

    const exportDados = JSON.parse(sessionStorage.exportContagemTempo);

    const periodos = exportDados.dadosParaExportar;

    this.dataInicioBeneficio = exportDados.dib;

    this.changePeriodoOptions();

    const dib = moment(exportDados.dib, 'DD/MM/YYYY');

    // posterior a EC n?? 103/2019
    this.primaria19anos = '';
    this.primaria19meses = '';
    this.primaria19dias = '';
    // posterior a EC n?? 103/2019

    if (dib < moment('1988-10-05')) {

      this.primaria98anos = periodos.total88.years;
      this.primaria98meses = periodos.total88.months;
      this.primaria98dias = periodos.total88.days;
      this.periodoInicioBeneficio = 'Anterior a 05/10/1988';
      this.carencia = periodos.total88.carencia;

    } else if (dib <= moment('1991-04-04')) {


      this.primaria98anos = periodos.total91.years;
      this.primaria98meses = periodos.total91.months;
      this.primaria98dias = periodos.total91.days;
      this.periodoInicioBeneficio = 'Entre 05/10/1988 e 04/04/1991';
      this.carencia = periodos.total91.carencia;

    } else if (dib >= moment('1991-04-05') && dib <= moment('1998-12-15')) {

      this.primaria98anos = periodos.total98.years;
      this.primaria98meses = periodos.total98.months;
      this.primaria98dias = periodos.total98.days;
      this.periodoInicioBeneficio = 'Entre 05/04/1991 e 15/12/1998';
      this.carencia = periodos.total98.carencia;

    } else if (dib > moment('1998-12-15') && dib <= moment('1999-11-29')) {

      this.primaria98anos = periodos.total98.years;
      this.primaria98meses = periodos.total98.months;
      this.primaria98dias = periodos.total98.days;

      this.primaria99anos = periodos.total99.years;
      this.primaria99meses = periodos.total99.months;
      this.primaria99dias = periodos.total99.days;

      this.periodoInicioBeneficio = 'Entre 16/12/1998 e 28/11/1999';
      this.carencia = periodos.total99.carencia;

    } else if (dib > moment('1999-11-29') && dib <= moment('2019-11-13')) {

      // At?? a EC n?? 103/2019
      this.primariaAtualanos = periodos.total19.years;
      this.primariaAtualmeses = periodos.total19.months;
      this.primariaAtualdias = periodos.total19.days;
      // At?? a EC n?? 103/2019

      this.primaria98anos = periodos.total98.years;
      this.primaria98meses = periodos.total98.months;
      this.primaria98dias = periodos.total98.days;

      this.primaria99anos = periodos.total99.years;
      this.primaria99meses = periodos.total99.months;
      this.primaria99dias = periodos.total99.days;

      // this.periodoInicioBeneficio = 'A partir de 29/11/1999';
      this.periodoInicioBeneficio = 'Entre 29/11/1999 e 13/11/2019';

      this.carencia = periodos.total19.carencia;

    } else if (dib > moment('2019-11-13')) {

      this.primaria98anos = periodos.total98.years;
      this.primaria98meses = periodos.total98.months;
      this.primaria98dias = periodos.total98.days;

      this.primaria99anos = periodos.total99.years;
      this.primaria99meses = periodos.total99.months;
      this.primaria99dias = periodos.total99.days;

      // At?? a EC n?? 103/2019
      this.primariaAtualanos = periodos.total19.years;
      this.primariaAtualmeses = periodos.total19.months;
      this.primariaAtualdias = periodos.total19.days;
      // At?? a EC n?? 103/2019

      // posterior a EC n?? 103/2019
      this.primaria19anos = periodos.total.years;
      this.primaria19meses = periodos.total.months;
      this.primaria19dias = periodos.total.days;
      // posterior a EC n?? 103/2019

      this.periodoInicioBeneficio = 'A partir de 14/11/2019';
      // this.carencia = periodos.total.carencia;

      this.carencia = periodos.total19.carencia;
    }

    this.carenciaAposEc103 = periodos['total' + exportDados.typeExport].carencia;

    this.errors.clear();
    this.changePeriodoOptions();
    this.validate();

  }

  checkImportContagemTempo() {

    if (sessionStorage.exportContagemTempo &&
      sessionStorage.exportContagemTempo !== undefined) {

      this.importContagemTempo();
      sessionStorage.removeItem('exportContagemTempo');
    }
    // else {
    // this.resetForm();
    // }

  }

  public clearCarenciaChange(tipo) {

    if (this.hasCarencia) {

      if (tipo == 99) {
        this.carencia = '';
      }

      this.carenciaAposEc103 = ''

      const errorCarencia = {
        position: 'top-end',
        icon: 'error',
        // title: 'O Tempo de Contribui????o foi alterado manualmente - Verificar Car??ncia.',
        text: `Aten????o! Toda vez que o tempo de contribui????o for alterado manualmente o tempo
         de car??ncia dever?? ser inserido pelo usu??rio para confirma????o e seguran??a da simula????o.`,
        closeOnClickOutside: true,
        closeOnEsc: true,
        button: false,
        timer: 5000,
        // content: {
        //   element: 'label',
        //   attributes: {
        //     placeholder: 'Type your password',
        //     type: 'password',
        //     text: 'teste'
        //   },
        // },
      };

      // swal(errorCarencia);

      this.alertCarenciaAposEc103 = true

    }

  }

  changeGrupoDos12() {
    this.errors.clear('periodoInicioBeneficio');
    if (this.periodoInicioBeneficio === 'Anterior a 05/10/1988' || this.periodoInicioBeneficio === 'Entre 05/10/1988 e 04/04/1991') {
      this.hasGrupoDos12 = true;
    } else {
      this.hasGrupoDos12 = false;
    }

  }

  formatDate(ano, prim_or_sec) {
    // prim_or_sec = 0 para primaria
    //            = 1 para secundaria
    if (ano === '98' && prim_or_sec === 0) {
      return this.primaria98anos + '-' + this.primaria98meses + '-' + this.primaria98dias;
    } else if (ano === '98' && prim_or_sec === 1) {
      if (!(this.secundaria98dias === undefined || this.secundaria98dias === '') &&
        !(this.secundaria98meses === undefined || this.secundaria98meses === '') &&
        !(this.secundaria98anos === undefined || this.secundaria98anos === '')) {
        return this.secundaria98anos + '-' + this.secundaria98meses + '-' + this.secundaria98dias;
      } else {
        return '';
      }
    } else if (ano === '99' && prim_or_sec === 0) {
      return this.primaria99anos + '-' + this.primaria99meses + '-' + this.primaria99dias;
    } else if (ano === '99' && prim_or_sec === 1) {
      if (!(this.secundaria99dias === undefined || this.secundaria99dias === '') &&
        !(this.secundaria99meses === undefined || this.secundaria99meses === '') &&
        !(this.secundaria99anos === undefined || this.secundaria99anos === '')) {
        return this.secundaria99anos + '-' + this.secundaria99meses + '-' + this.secundaria99dias;
      } else {
        return '';
      }
    } else if (ano === 'atual' && prim_or_sec === 0) {
      return this.primariaAtualanos + '-' + this.primariaAtualmeses + '-' + this.primariaAtualdias;
    } else if (ano === 'atual' && prim_or_sec === 1) {
      if (!(this.secundariaAtualdias === undefined || this.secundariaAtualdias === '') &&
        !(this.secundariaAtualmeses === undefined || this.secundariaAtualmeses === '') &&
        !(this.secundariaAtualanos === undefined || this.secundariaAtualanos === '')) {
        return this.secundariaAtualanos + '-' + this.secundariaAtualmeses + '-' + this.secundariaAtualdias;
      } else {
        return '';
      }
    } else if (ano === '19' && prim_or_sec === 0) {
      return this.primaria19anos + '-' + this.primaria19meses + '-' + this.primaria19dias;
    } else {
      return 'erro nos parametros';
    }
  }


  changeEspecieBeneficio() {
    this.errors.clear('especieBeneficio');
    if (this.especieBeneficio === 'Aposentadoria por idade - Trabalhador Rural'
      || this.especieBeneficio === 'Aposentadoria por idade - Trabalhador Urbano'
      || this.especieBeneficio === 'Aposentadoria por Idade - Trabalhador Urbano'
      || this.especieBeneficio === 'Aposentadoria por Idade - Trabalhador Rural'
      || this.especieBeneficio === 'Aposentadoria Programada'
      || this.especieBeneficio === 'Aposentadoria Programada - Professor'
      || this.especieBeneficio === 'Aposentadoria Programada'
      || this.especieBeneficio === 'Aposentadoria Programada - Professor'
      || this.especieBeneficio === 'Aposentadoria por Tempo de Contribui????o'
      || this.especieBeneficio === 'Aposentadoria especial'
      || this.especieBeneficio === 'Aposentadoria por Tempo de Contribui????o do(a) Professor(a)'
      || this.especieBeneficio === 'Aposentadoria por tempo de servi??o de professor'
      || this.especieBeneficio === 'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Grave)'
      || this.especieBeneficio === 'Aposentadoria especial da Pessoa com Defici??ncia Grave'
      || this.especieBeneficio === 'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Moderada)'
      || this.especieBeneficio === 'Aposentadoria especial da Pessoa com Defici??ncia Moderada'
      || this.especieBeneficio === 'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Leve)'
      || this.especieBeneficio === 'Aposentadoria especial da Pessoa com Defici??ncia Leve'
      || this.especieBeneficio === 'Aposentadoria por Idade da PcD'
      || this.especieBeneficio === 'Aposentadoria especial por Idade da Pessoa com Defici??ncia'
      || this.especieBeneficio === 'Aposentadoria Especial - 15 anos'
      || this.especieBeneficio === 'Aposentadoria especial - 15 anos de exposi????o'
      || this.especieBeneficio === 'Aposentadoria Especial - 20 anos'
      || this.especieBeneficio === 'Aposentadoria especial - 20 anos de exposi????o'
      || this.especieBeneficio === 'Aposentadoria Especial - 25 anos'
      || this.especieBeneficio === 'Aposentadoria especial - 25 anos de exposi????o'
    ) {
      this.hasCarencia = true;
    } else {
      this.hasCarencia = false;
    }

    // check especie aposentadoria por invalidez
    this.changePeriodoOptions();
    this.checkIsmedia12Ultimos();
    this.checkIsCalcularDescarteAposEC103();
    this.checkIsCalcularDescarteDeficienteEC103();
    this.translateNovosNomesEspecie();
  }


  private translateNovosNomesEspecie() {

    if (this.isEdit &&
      this.has19 &&
      [
        'Aux??lio Doen??a',
        'Aux??lio Acidente - 50%',
        'Aposentadoria especial da Pessoa com Defici??ncia Grave',
        'Aposentadoria especial da Pessoa com Defici??ncia Leve',
        'Aposentadoria especial da Pessoa com Defici??ncia Moderada',
        'Aposentadoria especial por Idade da Pessoa com Defici??ncia',
        'Aposentadoria especial por Idade da Pessoa com Defici??ncia',
        'Aposentadoria por Idade da Pessoa com Defici??ncia',
        'Aposentadoria por tempo de servi??o de professor',
        'Aposentadoria especial - 15 anos de exposi????o',
        'Aposentadoria especial - 20 anos de exposi????o',
        'Aposentadoria especial - 25 anos de exposi????o',
        'Aposentadoria por idade - Trabalhador Rural',
        'Aposentadoria por idade - Trabalhador Urbano',
        'Aposentadoria por incapacidade permanente',
        'Pens??o por Morte instituidor aposentado na data ??bito',
        'Pens??o por Morte instituidor n??o ?? aposentado na data do ??bito',
        'Aposentadoria por tempo de contribui????o'
      ].includes(this.especieBeneficio)) {

      const novasEspecies = [
        {
          antigo: 'Aposentadoria por tempo de contribui????o',
          novo: 'Aposentadoria por Tempo de Contribui????o'
        },
        {
          antigo: 'Aux??lio Doen??a',
          novo: 'Aux??lio por Incapacidade Tempor??ria'
        },
        {
          antigo: 'Aux??lio Acidente - 50%',
          novo: 'Aux??lio Acidente'
        },
        {
          antigo: 'Aposentadoria especial da Pessoa com Defici??ncia Grave',
          novo: 'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Grave)'
        },
        {
          antigo: 'Aposentadoria especial da Pessoa com Defici??ncia Moderada',
          novo: 'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Moderada)'
        },
        {
          antigo: 'Aposentadoria especial da Pessoa com Defici??ncia Leve',
          novo: 'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Leve)'
        },
        {
          antigo: 'Aposentadoria especial por Idade da Pessoa com Defici??ncia',
          novo: 'Aposentadoria por Idade da PcD'
        },
        {
          antigo: 'Aposentadoria por tempo de servi??o de professor',
          novo: 'Aposentadoria por Tempo de Contribui????o do(a) Professor(a)'
        },
        {
          antigo: 'Aposentadoria especial - 15 anos de exposi????o',
          novo: 'Aposentadoria Especial - 15 anos'
        },
        {
          antigo: 'Aposentadoria especial - 20 anos de exposi????o',
          novo: 'Aposentadoria Especial - 20 anos'
        },
        {
          antigo: 'Aposentadoria especial - 25 anos de exposi????o',
          novo: 'Aposentadoria Especial - 25 anos'
        },
        {
          antigo: 'Aposentadoria por idade - Trabalhador Rural',
          novo: 'Aposentadoria por Idade - Trabalhador Rural'
        },
        {
          antigo: 'Aposentadoria por idade - Trabalhador Urbano',
          novo: 'Aposentadoria por Idade - Trabalhador Urbano'
        },
        {
          antigo: 'Aposentadoria por incapacidade permanente',
          novo: 'Aposentadoria por Incapacidade Permanente'
        },
        {
          antigo: 'Pens??o por Morte instituidor aposentado na data ??bito',
          novo: 'Pens??o por Morte - Instituidor Aposentado na Data do ??bito'
        },
        {
          antigo: 'Pens??o por Morte instituidor n??o ?? aposentado na data do ??bito',
          novo: 'Pens??o por Morte - Instituidor n??o Aposentado na Data do ??bito'
        }
      ];

      this.especieBeneficio = (novasEspecies.find((element) => element.antigo === this.especieBeneficio)).novo;

    }

  }

  /**
   * verificar a aplica????o da media dos 12 ultimos salarios
   */
  private checkIsmedia12Ultimos() {

    const especiesActive = [
      'Aux??lio Doen??a',
      'Aux??lio por Incapacidade Tempor??ria',
    ];

    this.ismedia12Ultimos = false;

    if (((this.has19 || this.hasAtual) && !this.hasPensaoInstuidorAposentado)
      && especiesActive.includes(this.especieBeneficio)) {

      this.ismedia12Ultimos = true;

    } else {

      this.media12Ultimos = false;

    }

  }

  /**
   * Habilitar o calculo unico com 100% dos salarios de contribui????o
   *  para aposentadoria de pessoa com deficiencia
   */
  private checkIsCalcularDescarteAposEC103() {

    const especiesActive = [
      'Aposentadoria por incapacidade permanente',
      'Aposentadoria por Incapacidade Permanente',
      'Aux??lio Doen??a',
      'Aux??lio Acidente - 50%',
      'Aux??lio por Incapacidade Tempor??ria',
      'Aux??lio Acidente',
      'Pens??o por Morte instituidor n??o ?? aposentado na data ??bito',
      'Pens??o por Morte - Instituidor n??o Aposentado na Data do ??bito'
    ];

    this.isCalcularDescarteAposEC103 = false;

    if ((this.has19 && !this.hasPensaoInstuidorAposentado)
      && especiesActive.includes(this.especieBeneficio)) {

      this.isCalcularDescarteAposEC103 = true;

    } else {

      this.calcularDescarteAposEC103 = false;

    }

  }
  /**
   * Habilitar o descarte de 20% para aposentadoria de pessoa com deficiencia
   */
  private checkIsCalcularDescarteDeficienteEC103() {

    const especiesActive = [
      'Aposentadoria especial da Pessoa com Defici??ncia Grave',
      'Aposentadoria especial da Pessoa com Defici??ncia Leve',
      'Aposentadoria especial da Pessoa com Defici??ncia Moderada',
      'Aposentadoria especial por Idade da Pessoa com Defici??ncia',
      'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Grave)',
      'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Moderada)',
      'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Leve)',
      'Aposentadoria por Idade da PcD',
    ];

    this.iscalcularDescarteDeficienteEC103 = false;

    if ((this.has19 && !this.hasPensaoInstuidorAposentado)
      && especiesActive.includes(this.especieBeneficio)) {

      this.iscalcularDescarteDeficienteEC103 = true;

    } else {

      this.calcularDescarteDeficienteEC103 = false;

    }

  }

  private confirmAlteracaoContagemTempo(dibAtual, dibOriginal) {

    if (moment(dibAtual, 'DD/MM/YYYY').isBefore(moment(dibOriginal, 'DD/MM/YYYY'))) {

      const text = `Aten????o ! \n Deseja limitar a contagem de tempo conforme a DIB ${dibAtual}?`;
      swal2({
        title: text,
        text: ``,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim',
        cancelButtonText: 'N??o'
      }).then((result) => {

        if (result.value) {

          sessionStorage.setItem('dibLimiteContagemTempo', this.dataInicioBeneficio);
          sessionStorage.setItem('isToStep6', 'aStep4ToRMI');
          this.retunCTEvent.emit({ dibLimiteContagemTempo: this.dataInicioBeneficio });
          this.toastAlert('success', 'Aguarde a execu????o da contagem de tempo com o novo par??metro.', null);
          //  this.toastAlert('error', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', null);

        } else if (result.dismiss === swal2.DismissReason.cancel) {

        }

      });

    }

  }


  /**
   * verificarSeaDIBMenorUltimoVinculo
   */
  public verificarSeaDIBMenorUltimoVinculo() {

    if (!this.isEdit && this.dadosPassoaPasso.origem === 'passo-a-passo') {
      this.confirmAlteracaoContagemTempo(this.dataInicioBeneficio, this.lastDataInicioBeneficio);
    }

  }


  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '') ? true : false;
  }

  isNumber(value) {
    if (!isNaN(value) && Number.isInteger(+value)) {
      return true;
    }
    return false;
  }



  dateMask(rawValue) {
    if (rawValue === '') {
      return [/[0-3]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

    }
    let mask = [];
    mask.push(/[0-3]/);

    if (rawValue[0] === 0) {
      mask.push(/[1-9]/);
    } else if (rawValue[0] === 1) {
      mask.push(/[0-9]/);
    } else if (rawValue[0] === 2) {
      mask.push(/[0-9]/);
    } else if (rawValue[0] === 3) {
      mask.push(/[0-1]/);
    }

    mask.push('/');
    mask.push(/[0-1]/);

    if (rawValue[3] === 0) {
      mask.push(/[1-9]/);
    } else if (rawValue[3] === 1) {
      mask.push(/[1-2]/);
    }

    mask.push('/');
    mask.push(/[1-2]/);

    if (rawValue[6] === 1) {
      mask.push(/[9]/);
    } else if (rawValue[6] === 2) {
      mask.push(/[0]/);
    }
    mask.push(/\d/);
    mask.push(/\d/);
    return mask;
  }



  public getEspecieBeneficio(especie) {
    let numeroEspecie = 0;
    switch (especie) {
      case 'Aux??lio Doen??a':
      case 'Aux??lio por Incapacidade Tempor??ria':
        numeroEspecie = 1;
        break;
      case 'Aposentadoria por invalidez Previdenci??ria ou Pens??o por Morte':
        numeroEspecie = 2;
        break;
      case 'Aposentadoria por Idade - Trabalhador Urbano':
      case 'Aposentadoria por idade - Trabalhador Urbano':
      case 'Aposentadoria Programada':
        numeroEspecie = 3;
        break;
      case 'Aposentadoria Programada - Professor':
        numeroEspecie = 31;
        break;
      case 'Aposentadoria por Tempo de Contribui????o':
      case 'Aposentadoria por tempo de contribui????o':
      case 'Aposentadoria por tempo de servi??o':
        numeroEspecie = 4;
        break;
      case 'Aposentadoria especial':
        numeroEspecie = 5;
        break;
      case 'Aposentadoria por Tempo de Contribui????o do(a) Professor(a)':
      case 'Aposentadoria por tempo de servi??o de professor':
        numeroEspecie = 6;
        break;
      case 'Aux??lio Acidente previdenci??rio - 50%':
        numeroEspecie = 7;
        break;
      case 'Aposentadoria por Idade - Trabalhador Rural':
      case 'Aposentadoria por idade - Trabalhador Rural':
        numeroEspecie = 16;
        break;
      case 'Aux??lio Acidente - 30%':
        numeroEspecie = 17;
        break;
      case 'Aux??lio Acidente - 40%':
        numeroEspecie = 18;
        break;
      case 'Aux??lio Acidente - 60%':
        numeroEspecie = 19;
        break;
      case 'Abono de Perman??ncia em Servi??o':
        numeroEspecie = 20;
        break;
      case 'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Grave)':
      case 'Aposentadoria especial da Pessoa com Defici??ncia Grave':
        numeroEspecie = 25;
        break;
      case 'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Moderada)':
      case 'Aposentadoria especial da Pessoa com Defici??ncia Moderada':
        numeroEspecie = 26;
        break;
      case 'Aposentadoria por Tempo de Contribui????o da PcD (Defici??ncia Leve)':
      case 'Aposentadoria especial da Pessoa com Defici??ncia Leve':
        numeroEspecie = 27;
        break;
      case 'Aposentadoria por Idade da PcD':
      case 'Aposentadoria especial por Idade da Pessoa com Defici??ncia':
        numeroEspecie = 28;
        break;
      // Reforma  inicio 2019
      case 'Aposentadoria Especial - 15 anos':
      case 'Aposentadoria especial - 15 anos de exposi????o':
        numeroEspecie = 1915;
        break;
      case 'Aposentadoria Especial - 20 anos':
      case 'Aposentadoria especial - 20 anos de exposi????o':
        numeroEspecie = 1920;
        break;
      case 'Aposentadoria Especial - 25 anos':
      case 'Aposentadoria especial - 25 anos de exposi????o':
        numeroEspecie = 1925;
        break;
      case 'Pens??o por Morte - Instituidor Aposentado na Data do ??bito':
      case 'Pens??o por Morte instituidor aposentado na data ??bito':
        numeroEspecie = 1900;
        break;
      case 'Pens??o por Morte - Instituidor n??o Aposentado na Data do ??bito':
      case 'Pens??o por Morte instituidor n??o ?? aposentado na data ??bito':
        numeroEspecie = 1901;
        break;
      case 'Aposentadoria por Incapacidade Permanente':
      case 'Aposentadoria por incapacidade permanente':
        numeroEspecie = 1903;
        break;
      case 'Aux??lio Acidente':
      case 'Aux??lio Acidente - 50%':
        numeroEspecie = 1905;
        break;
      default:
        break;
    }
    return numeroEspecie;
  }



  private toastAlert(type, title, position) {

    position = (!position) ? 'top-end' : position;

    swal2({
      position: position,
      type: type,
      title: title,
      showConfirmButton: false,
      timer: 1500
    });

  }

}
