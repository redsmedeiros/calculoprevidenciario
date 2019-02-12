import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalculoRgps as CalculoModel } from '../CalculoRgps.model';
import swal from 'sweetalert';
import * as moment from 'moment';

@Component({
  selector: 'app-rgps-calculos-form',
  templateUrl: './rgps-calculos-form.component.html',
  styleUrls: ['./rgps-calculos-form.component.css'],
  providers: [
    ErrorService
  ],
})
export class RgpsCalculosFormComponent implements OnInit {

  public dataInicioBeneficio;
  public periodoInicioBeneficio;
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

  public grupoDos12;
  public carencia;

  public hasAnterior = false;
  public has98 = false;
  public has99 = false;
  public hasAtual = false;
  public hasCarencia = false;
  public hasGrupoDos12 = false;
  public posteriorMaio2013 = false;

  public periodoOptions: string[] = [];
  public dateMaskdiB = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  @Input() formData;
  @Input() errors: ErrorService;
  @Input() isEdit: boolean;
  @Output() onSubmit = new EventEmitter;

  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
    if (this.isEdit) {
      this.dataInicioBeneficio = this.formData.data_pedido_beneficio;
      this.changePeriodoOptions();
      this.especieBeneficio = this.formData.tipo_seguro;
      this.changeEspecieBeneficio();
      this.periodoInicioBeneficio = this.formData.tipo_aposentadoria;
      this.changeGrupoDos12();
      if (this.formData.contibuicao_primaria_98 != '') {
        this.primaria98anos = this.formData.contribuicao_primaria_98.split('-')[0];
        this.primaria98meses = this.formData.contribuicao_primaria_98.split('-')[1];
        this.primaria98dias = this.formData.contribuicao_primaria_98.split('-')[2];
        this.secundaria98anos = this.formData.contribuicao_secundaria_98.split('-')[0];
        this.secundaria98meses = this.formData.contribuicao_secundaria_98.split('-')[1];
        this.secundaria98dias = this.formData.contribuicao_secundaria_98.split('-')[2];
      }

      if (this.formData.contibuicao_primaria_99 != '') {
        this.primaria99anos = this.formData.contribuicao_primaria_99.split('-')[0];
        this.primaria99meses = this.formData.contribuicao_primaria_99.split('-')[1];
        this.primaria99dias = this.formData.contribuicao_primaria_99.split('-')[2];
        this.secundaria99anos = this.formData.contribuicao_secundaria_99.split('-')[0];
        this.secundaria99meses = this.formData.contribuicao_secundaria_99.split('-')[1];
        this.secundaria99dias = this.formData.contribuicao_secundaria_99.split('-')[2];
      }
      if (this.formData.contibuicao_primaria_atual != '') {
        this.primariaAtualanos = this.formData.contribuicao_primaria_atual.split('-')[0];
        this.primariaAtualmeses = this.formData.contribuicao_primaria_atual.split('-')[1];
        this.primariaAtualdias = this.formData.contribuicao_primaria_atual.split('-')[2];
        this.secundariaAtualanos = this.formData.contribuicao_secundaria_atual.split('-')[0];
        this.secundariaAtualmeses = this.formData.contribuicao_secundaria_atual.split('-')[1];
        this.secundariaAtualdias = this.formData.contribuicao_secundaria_atual.split('-')[2];
      }
      this.carencia = this.formData.carencia;
      this.grupoDos12 = this.formData.grupo_dos_12;

    }

    this.checkImportContagemTempo();

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
      this.formData.contribuicao_secundaria_98 = this.formatDate('98', 1);
      this.formData.contribuicao_secundaria_99 = this.formatDate('99', 1);
      this.formData.contribuicao_secundaria_atual = this.formatDate('atual', 1);
      this.formData.valor_beneficio = ''; //TODO: deixar em branco por enquanto
      this.formData.soma_contribuicao = '';//TODO: deixar em branco por enquanto
      this.formData.carencia = this.carencia;
      this.formData.grupo_dos_12 = this.grupoDos12;
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
    this.dataInicioBeneficio = '';
    this.periodoInicioBeneficio = '';
    this.especieBeneficio = '';

    this.primaria98anos = '';
    this.primaria98meses = '';
    this.primaria98dias = '';

    this.secundaria98anos = undefined;
    this.secundaria98meses = undefined;
    this.secundaria98dias = undefined;

    this.primaria99anos = undefined;
    this.primaria99meses = undefined;
    this.primaria99dias = undefined;

    this.secundaria99anos = undefined;
    this.secundaria99meses = undefined;
    this.secundaria99dias = undefined;

    this.primariaAtualanos = undefined;
    this.primariaAtualmeses = undefined;
    this.primariaAtualdias = undefined;

    this.secundariaAtualanos = undefined;
    this.secundariaAtualmeses = undefined;
    this.secundariaAtualdias = undefined;

    this.grupoDos12 = '';
    this.carencia = '';

    this.hasAnterior = false;
    this.has98 = false;
    this.has99 = false;
    this.hasAtual = false;
    this.hasCarencia = false;
    this.hasGrupoDos12 = false;
  }

  validate() {
    if (this.dataInicioBeneficio == undefined || this.dataInicioBeneficio == '') {
      this.errors.add({ "dataInicioBeneficio": ["A data de inicio do benefício é obrigatória."] });
    } else {
      var dateParts = this.dataInicioBeneficio.split("/");
      let date = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      if (isNaN(date.getTime()) || date < new Date('01/01/1970'))
        this.errors.add({ "dataInicioBeneficio": ["Insira uma data válida."] });
    }

    if (this.periodoInicioBeneficio == undefined || this.periodoInicioBeneficio == '') {
      this.errors.add({ "periodoInicioBeneficio": ["O período do inicio do benefício é obrigatório."] });
    }

    if (this.especieBeneficio == undefined || this.especieBeneficio == '') {
      this.errors.add({ "especieBeneficio": ["A espécie do benefício é obrigatória."] });
    }

    if (this.has98 || this.hasAnterior) {
      if (this.primaria98anos == undefined || this.primaria98anos == '') {
        this.errors.add({ "primaria98anos": ["Campo obrigatório."] });
      } else {
        if (!this.isNumber(this.primaria98anos)) {
          this.errors.add({ "primaria98anos": ["Valor inválido."] });
        }
      }

      if (this.primaria98dias == undefined || this.primaria98dias == '') {
        this.errors.add({ "primaria98dias": ["Campo obrigatório."] });
      } else {
        if (this.primaria98dias > 29 || !this.isNumber(this.primaria98dias)) {
          this.errors.add({ "primaria98dias": ["Insira um valor entre 0 e 29"] });
        }
      }

      if (this.primaria98meses == undefined || this.primaria98meses == '') {
        this.errors.add({ "primaria98meses": ["Campo obrigatório."] });
      } else {
        if (this.primaria98meses > 11 || !this.isNumber(this.primaria98meses)) {
          this.errors.add({ "primaria98meses": ["Insira um valor entre 0 e 11"] });
        }
      }

      if (!(this.secundaria98anos == undefined || this.secundaria98anos == '')) {
        if (!this.isNumber(this.secundaria98anos)) {
          this.errors.add({ "secundaria98anos": ["Valor inválido."] });
        }
      }

      if (!(this.secundaria98meses == undefined || this.secundaria98meses == '')) {
        if (this.secundaria98meses > 11 || !this.isNumber(this.secundaria98meses)) {
          this.errors.add({ "secundaria98meses": ["Insira um valor entre 1 e 11"] });
        }
      }

      if (!(this.secundaria98dias == undefined || this.secundaria98dias == '')) {
        if (this.secundaria98dias > 29 || !this.isNumber(this.secundaria98dias)) {
          this.errors.add({ "secundaria98dias": ["Insira um valor entre 0 e 29"] });
        }
      }
    }


    if (this.has99) {
      if (this.primaria99anos == undefined || this.primaria99anos == '') {
        this.errors.add({ "primaria99anos": ["Campo obrigatório."] });
      } else {
        if (!this.isNumber(this.primaria99anos)) {
          this.errors.add({ "primaria99anos": ["Valor inválido."] });
        }
      }

      if (this.primaria99meses == undefined || this.primaria99meses == '') {
        this.errors.add({ "primaria99meses": ["Campo obrigatório."] });
      } else {
        if (this.primaria99meses > 11 || !this.isNumber(this.primaria99meses)) {
          this.errors.add({ "primaria99meses": ["Insira um valor entre 1 e 11"] });
        }
      }

      if (this.primaria99dias == undefined || this.primaria99dias == '') {
        this.errors.add({ "primaria99dias": ["Campo obrigatório."] });
      } else {
        if (this.primaria99dias > 29 || !this.isNumber(this.primaria99dias)) {
          this.errors.add({ "primaria99dias": ["Insira um valor entre 0 e 29"] });
        }
      }

      if (!(this.secundaria99anos == undefined || this.secundaria99anos == '')) {
        if (!this.isNumber(this.secundaria99anos)) {
          this.errors.add({ "secundaria99anos": ["Valor inválido."] });
        }
      }

      if (!(this.secundaria99meses == undefined || this.secundaria99meses == '')) {
        if (this.secundaria99meses > 11 || !this.isNumber(this.secundaria99meses)) {
          this.errors.add({ "secundaria99meses": ["Insira um valor entre 1 e 11"] });
        }
      }

      if (!(this.secundaria99dias == undefined || this.secundaria99dias == '')) {
        if (this.secundaria99dias > 29 || !this.isNumber(this.secundaria99dias)) {
          this.errors.add({ "secundaria99dias": ["Insira um valor entre 0 e 29"] });
        }
      }
    }

    if (this.hasAtual) {
      if (this.primariaAtualanos == undefined || this.primariaAtualanos == '') {
        this.errors.add({ "primariaAtualanos": ["Campo obrigatório."] });
      } else {
        if (!this.isNumber(this.primariaAtualanos)) {
          this.errors.add({ "primariaAtualanos": ["Valor inválido."] });
        }
      }

      if (this.primariaAtualmeses == undefined || this.primariaAtualmeses == '') {
        this.errors.add({ "primariaAtualmeses": ["Campo obrigatório."] });
      } else {
        if (this.primariaAtualmeses > 11 || !this.isNumber(this.primariaAtualmeses)) {
          this.errors.add({ "primariaAtualmeses": ["Insira um valor entre 1 e 11"] });
        }
      }

      if (this.primariaAtualdias == undefined || this.primariaAtualdias == '') {
        this.errors.add({ "primariaAtualdias": ["Campo obrigatório."] });
      } else {
        if (this.primariaAtualdias > 29 || !this.isNumber(this.primariaAtualdias)) {
          this.errors.add({ "primariaAtualdias": ["Insira um valor entre 0 e 29"] });
        }
      }

      //Secundaria
      if (!(this.secundariaAtualanos == undefined || this.secundariaAtualanos == '')) {
        if (!this.isNumber(this.secundariaAtualanos)) {
          this.errors.add({ "secundariaAtualanos": ["Valor inválido."] });
        }
      }

      if (!(this.secundariaAtualmeses == undefined || this.secundariaAtualmeses == '')) {
        if (this.secundariaAtualmeses > 11 || !this.isNumber(this.secundariaAtualmeses)) {
          this.errors.add({ "secundariaAtualmeses": ["Insira um valor entre 1 e 11"] });
        }
      }

      if (!(this.secundariaAtualdias == undefined || this.secundariaAtualdias == '')) {
        if (this.secundariaAtualdias > 29 || !this.isNumber(this.secundariaAtualdias)) {
          this.errors.add({ "secundariaAtualdias": ["Insira um valor entre 0 e 29"] });
        }
      }
    }

    if (this.hasCarencia && (this.carencia == undefined || this.carencia == '')) {
      this.errors.add({ "carencia": ["Campo obrigatório."] });
    }
  }

  changePeriodoOptions() {
    this.errors.clear('dataInicioBeneficio');
    this.periodoOptions = [];

    if (moment(this.dataInicioBeneficio, 'DD/MM/YYYY') > moment('2013-05-08')) {
      this.posteriorMaio2013 = true;
    } else {
      this.posteriorMaio2013 = false;
    }
    let dib = moment(this.dataInicioBeneficio, 'DD/MM/YYYY');
    if (dib < moment('1988-10-05')) {
      this.periodoOptions.push('Anterior a 05/10/1988');
    } else if (dib >= moment('1988-10-05') && dib < moment('1991-04-05')) {
      this.periodoOptions.push('Anterior a 05/10/1988');
      this.periodoOptions.push('Entre 05/10/1988 e 04/04/1991');
    } else if (dib >= moment('1991-04-05') && dib <= moment('1998-12-15')) {
      this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
    } else if (dib > moment('1998-12-15') && dib <= moment('1999-11-29')) {
      this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
      this.periodoOptions.push('Entre 16/12/1998 e 28/11/1999');
    } else if (dib > moment('1999-11-29')) {
      this.periodoOptions.push('Entre 05/04/1991 e 15/12/1998');
      this.periodoOptions.push('Entre 16/12/1998 e 28/11/1999');
      this.periodoOptions.push('A partir de 29/11/1999');
    }
    var dateParts = this.dataInicioBeneficio.split("/");
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
    } else if (dateBeneficio >= new Date('12/16/1998') && dateBeneficio <= new Date('11/29/1999')) {
      this.hasAnterior = false;
      this.has98 = true;
      this.has99 = true;
      this.hasAtual = false;
    } else if (dateBeneficio > new Date('11/29/1999')) {
      this.hasAnterior = false;
      this.has98 = true;
      this.has99 = true;
      this.hasAtual = true;
    } else {
      this.hasAnterior = false;
      this.has98 = false;
      this.has99 = false;
      this.hasAtual = false;
    }
  }



  importContagemTempo() {

    const exportDados = JSON.parse(sessionStorage.exportContagemTempo);

    const periodos = exportDados.dadosParaExportar;


    console.log(exportDados);
    
    this.dataInicioBeneficio = exportDados.dib;

    this.changePeriodoOptions();

    const dib = moment(exportDados.dib, 'DD/MM/YYYY');

    if (dib < moment('1988-10-05')) {

      this.primaria98anos = periodos.total88.years;
      this.primaria98meses = periodos.total88.months;
      this.primaria98dias = periodos.total88.days;

      this.periodoInicioBeneficio = 'Anterior a 05/10/1988';

    } else if (dib < moment('1999-11-29')) {

      this.primaria98anos = periodos.total98.years;
      this.primaria98meses = periodos.total98.months;
      this.primaria98dias = periodos.total98.days;

      this.primaria99anos = periodos.total99.years;
      this.primaria99meses = periodos.total99.months;
      this.primaria99dias = periodos.total99.days;

      if (dib >= moment('1991-04-05') && dib <= moment('1998-12-15')) {
        this.periodoInicioBeneficio = 'Entre 05/04/1991 e 15/12/1998';
      } else if (dib > moment('1998-12-15') && dib <= moment('1999-11-29')) {
        this.periodoInicioBeneficio = 'Entre 16/12/1998 e 28/11/1999';
      }

    } else if (dib > moment('1999-11-29')) {

      this.primariaAtualanos = periodos.total.years;
      this.primariaAtualmeses = periodos.total.months;
      this.primariaAtualdias = periodos.total.days;

      this.primaria98anos = periodos.total91.years;
      this.primaria98meses = periodos.total91.months;
      this.primaria98dias = periodos.total91.days;

      this.primaria99anos = periodos.total99.years;
      this.primaria99meses = periodos.total99.months;
      this.primaria99dias = periodos.total99.days;
      this.periodoInicioBeneficio = 'A partir de 29/11/1999';
    } else {

    }

  }

  checkImportContagemTempo() {

    if (sessionStorage.exportContagemTempo && sessionStorage.exportContagemTempo != undefined) {
      this.resetForm();
      this.importContagemTempo();
      sessionStorage.removeItem('exportContagemTempo');
    } else {
      this.resetForm();
    }

  }



  changeGrupoDos12() {
    this.errors.clear('periodoInicioBeneficio');
    if (this.periodoInicioBeneficio == 'Anterior a 05/10/1988' || this.periodoInicioBeneficio == 'Entre 05/10/1988 e 04/04/1991') {
      this.hasGrupoDos12 = true;
    } else {
      this.hasGrupoDos12 = false;
    }

  }

  formatDate(ano, prim_or_sec) {
    //prim_or_sec = 0 para primaria
    //            = 1 para secundaria
    if (ano == '98' && prim_or_sec == 0) {
      return this.primaria98anos + '-' + this.primaria98meses + '-' + this.primaria98dias;
    } else if (ano == '98' && prim_or_sec == 1) {
      if (!(this.secundaria98dias == undefined || this.secundaria98dias == '') &&
        !(this.secundaria98meses == undefined || this.secundaria98meses == '') &&
        !(this.secundaria98anos == undefined || this.secundaria98anos == '')) {
        return this.secundaria98anos + '-' + this.secundaria98meses + '-' + this.secundaria98dias;
      } else {
        return '';
      }
    } else if (ano == '99' && prim_or_sec == 0) {
      return this.primaria99anos + '-' + this.primaria99meses + '-' + this.primaria99dias;
    } else if (ano == '99' && prim_or_sec == 1) {
      if (!(this.secundaria99dias == undefined || this.secundaria99dias == '') &&
        !(this.secundaria99meses == undefined || this.secundaria99meses == '') &&
        !(this.secundaria99anos == undefined || this.secundaria99anos == '')) {
        return this.secundaria99anos + '-' + this.secundaria99meses + '-' + this.secundaria99dias;
      } else {
        return '';
      }
    } else if (ano == 'atual' && prim_or_sec == 0) {
      return this.primariaAtualanos + '-' + this.primariaAtualmeses + '-' + this.primariaAtualdias;
    } else if (ano == 'atual' && prim_or_sec == 1) {
      if (!(this.secundariaAtualdias == undefined || this.secundariaAtualdias == '') &&
        !(this.secundariaAtualmeses == undefined || this.secundariaAtualmeses == '') &&
        !(this.secundariaAtualanos == undefined || this.secundariaAtualanos == '')) {
        return this.secundariaAtualanos + '-' + this.secundariaAtualmeses + '-' + this.secundariaAtualdias;
      } else {
        return '';
      }
    } else {
      return 'erro nos parametros';
    }
  }
  changeEspecieBeneficio() {
    this.errors.clear('especieBeneficio');
    if (this.especieBeneficio == 'Aposentadoria por idade - Trabalhador Rural' || this.especieBeneficio == 'Aposentadoria por idade - Trabalhador Urbano') {
      this.hasCarencia = true;
    } else {
      this.hasCarencia = false;
    }
  }

  isNumber(value) {
    if (!isNaN(value) && Number.isInteger(+value)) {
      return true;
    }
    return false;
  }

 

  dateMask(rawValue) {
    if (rawValue == '') {
      return [/[0-3]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

    }
    let mask = [];
    mask.push(/[0-3]/);

    if (rawValue[0] == 0) {
      mask.push(/[1-9]/);
    } else if (rawValue[0] == 1) {
      mask.push(/[0-9]/);
    } else if (rawValue[0] == 2) {
      mask.push(/[0-9]/);
    } else if (rawValue[0] == 3) {
      mask.push(/[0-1]/);
    }

    mask.push('/');
    mask.push(/[0-1]/);

    if (rawValue[3] == 0) {
      mask.push(/[1-9]/);
    } else if (rawValue[3] == 1) {
      mask.push(/[1-2]/);
    }

    mask.push('/');
    mask.push(/[1-2]/);

    if (rawValue[6] == 1) {
      mask.push(/[9]/);
    } else if (rawValue[6] == 2) {
      mask.push(/[0]/);
    }
    mask.push(/\d/);
    mask.push(/\d/);
    return mask;
  }
}
