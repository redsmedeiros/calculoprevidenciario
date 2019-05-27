import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { SeguradoService } from '../+rgps-segurados/SeguradoRgps.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguradoRgps as SeguradoModel } from '../+rgps-segurados/SeguradoRgps.model';
import { CalculoRgps as CalculoModel } from '../+rgps-calculos/CalculoRgps.model';
import { MoedaService } from '../../services/Moeda.service';
import { IndiceInps } from './IndiceInps.model';
import { IndiceInpsService } from './IndiceInps.service';
import { SalarioMinimoMaximo } from './SalarioMinimoMaximo.model';
import { SalarioMinimoMaximoService } from './SalarioMinimoMaximo.service';
import { CarenciaProgressiva } from './CarenciaProgressiva.model';
import { CarenciaProgressivaService } from './CarenciaProgressiva.service';
import { ReajusteAutomatico } from './ReajusteAutomatico.model';
import { ReajusteAutomaticoService } from './ReajusteAutomatico.service';
import { ExpectativaVida } from './ExpectativaVida.model';
import { ExpectativaVidaService } from './ExpectativaVida.service';
import { Moeda } from '../../services/Moeda.model';
import { CalculoRgpsService } from '../+rgps-calculos/CalculoRgps.service';
import { ValorContribuidoService } from '../+rgps-valores-contribuidos/ValorContribuido.service';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { DOCUMENT } from '@angular/platform-browser';
import { WINDOW } from "../+rgps-calculos/window.service";

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './rgps-resultados.component.html',
  styleUrls: ['./rgps-resultados.component.css']
})
export class RgpsResultadosComponent implements OnInit {

  public styleTheme: string = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];
  private caixaOpcoes;
  private navIsFixed = false;

  public isUpdating = false;
  public checkboxIdList = [];
  public idSegurado = '';
  public idadeSegurado = 0;
  public idsCalculo;
  public calculosList = [];
  public erroAnterior88;
  public currencyList = [
    {
      "startDate": "1000-01-01",
      "endDate": "1942-10-31",
      "acronimo": "MR$",
      "nome": "Mil-Réis",
      "indiceCorrecaoAnterior": 1
    },
    {
      "startDate": "1942-11-01",
      "endDate": "1967-02-12",
      "acronimo": "Cr$",
      "nome": "Cruzeiro",
      "indiceCorrecaoAnterior": 1000
    },
    {
      "startDate": "1967-02-13",
      "endDate": "1970-05-15",
      "acronimo": "NCR$",
      "nome": "Cruzeiro Novo",
      "indiceCorrecaoAnterior": 1000
    },
    {
      "startDate": "1970-05-15",
      "endDate": "1986-02-28",
      "acronimo": "Cr$",
      "nome": "Cruzeiro",
      "indiceCorrecaoAnterior": 1
    },
    {
      "startDate": "1986-03-01",
      "endDate": "1988-12-31",
      "acronimo": "CZ$",
      "nome": "Cruzado",
      "indiceCorrecaoAnterior": 1000
    },
    {
      "startDate": "1989-01-01",
      "endDate": "1990-03-15",
      "acronimo": "NCZ$",
      "nome": "Cruzado Novo",
      "indiceCorrecaoAnterior": 1000
    },
    {
      "startDate": "1990-03-16",
      "endDate": "1993-07-31",
      "acronimo": "Cr$",
      "nome": "Cruzeiro",
      "indiceCorrecaoAnterior": 1
    },
    {
      "startDate": "1993-08-01",
      "endDate": "1994-02-28",
      "acronimo": "CR$",
      "nome": "Cruzeiro Real",
      "indiceCorrecaoAnterior": 1000
    },
    {
      "startDate": "1994-03-01",
      "endDate": "1994-06-30",
      "acronimo": "URV",
      "nome": "Unidade Real de Valor",
      "indiceCorrecaoAnterior": 637.639978027344
    },
    {
      "startDate": "1994-07-01",
      "endDate": "9999-12-31",
      "acronimo": "R$",
      "nome": "Real",
      "indiceCorrecaoAnterior": 1
    }
  ];

  public segurado: any = {};
  public calculo: any = {};
  public moeda: any = {};
  public isBlackHole = false;
  public salarioMinimoMaximo;
  public primeiraDataTabela;
  public dataInicioBeneficio;
  public dataFiliacao;
  public contribuicaoPrimariaTotal;
  public listaValoresContribuidos;
  public tipoBeneficio;

  public calculoList = [];
  public grupoCalculosTableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculoList,
    columns: [
      { data: 'especie' },
      { data: 'periodoInicioBeneficio' },
      { data: 'contribuicaoPrimaria' },
      { data: 'contribuicaoSecundaria' },
      { data: 'dib' },
      { data: 'dataCriacao' },
      { data: 'checkbox' },
    ]
  };

  public inpsList;
  public conclusoesAnterior88 = {};
  public calculoAnterior88TableData = [];
  public contribuicaoPrimariaAnterior88 = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundariaAnterior88 = { anos: 0, meses: 0, dias: 0 };
  public calculoAnterior88TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculoAnterior88TableData,
    columns: [
      { data: 'competencia' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria' },
      { data: 'inps' },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada' },
    ]
  };

  public conclusoes91_98 = {};
  public calculo91_98TableData = [];
  public carenciasProgressivas;
  public reajustesAutomaticos;
  public contribuicaoPrimaria91_98 = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundaria91_98 = { anos: 0, meses: 0, dias: 0 };
  public coeficiente;
  public errosCalculo91_98 = [];
  public calculo91_98TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculo91_98TableData,
    columns: [
      { data: 'competencia' },
      { data: 'fator' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria' },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada' },
      { data: 'limite' },
    ]
  };

  public conclusoes98_99 = [];
  public calculo98_99TableData = [];
  public errosCalculo98_99 = [];
  public calculo98_99TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculo98_99TableData,
    columns: [
      { data: 'competencia' },
      { data: 'fator' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria' },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada' },
      { data: 'limite' },
    ]
  };


  public contribuicaoTotal;
  public conclusoesApos99 = [];
  public limited;
  public isProportional = false;
  public idadeFracionada;
  public expectativasVida;
  public calculoApos99TableData = [];
  public contribuicaoPrimaria99 = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundaria99 = { anos: 0, meses: 0, dias: 0 };
  public errosCalculoApos99 = [];
  public withMemo = false;
  public withIN45 = true;
  public calculoApos99TableOptions = {
    colReorder: false,
    paging: false,
    searching: false,
    ordering: false,
    bInfo: false,
    data: this.calculoApos99TableData,
    columns: [
      { data: 'id' },
      { data: 'competencia' },
      { data: 'indice_corrigido' },
      { data: 'contribuicao_primaria' },
      { data: 'contribuicao_secundaria' },
      { data: 'contribuicao_primaria_revisada' },
      { data: 'contribuicao_secundaria_revisada' },
      { data: 'limite' },
    ]
  };

  public contribuicaoPrimariaAtual = { anos: 0, meses: 0, dias: 0 };
  public contribuicaoSecundariaAtual = { anos: 0, meses: 0, dias: 0 };

  //Datas
  public dataLei9032 = moment('1995-04-28');
  public dataLei8213 = moment('1991-07-24');
  public dataReal = moment('1994-06-01');
  public dataDib98 = moment('1998-12-16');
  public dataDib99 = moment('1999-11-29');
  public dataMP664 = moment('2015-03-01');
  public dataDecreto6939_2009 = moment('2009-08-18');

  //Variaveis de controle do template
  public mostrarCalculoAnterior88 = false;
  public mostrarCalculo91_98 = false;
  public mostrarCalculo98_99 = false;
  public mostrarCalculoApos99 = false;

  constructor(protected router: Router,
    protected route: ActivatedRoute,
    protected Segurado: SeguradoService,
    protected CalculoRgps: CalculoRgpsService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() {
    this.idSegurado = this.route.snapshot.params['id_segurado'];
    this.idsCalculo = this.route.snapshot.params['id'].split(',');
    this.isUpdating = true;

    this.Segurado.find(this.idSegurado)
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
            this.listaSegurados();
          });
        } else {
          this.idadeSegurado = this.getIdadeSegurado();
          this.dataFiliacao = this.getDataFiliacao();
          let counter = 0;
          for (let idCalculo of this.idsCalculo) {
            this.CalculoRgps.find(idCalculo)
              .then((calculo: CalculoModel) => {
                this.controleExibicao(calculo);
                this.calculosList.push(calculo);
                let checkBox = `<div class="checkbox"><label><input type="checkbox" id='${calculo.id}-checkbox' class="checkbox {{styleTheme}}"><span> </span></label></div>`;
                this.checkboxIdList.push(`${calculo.id}-checkbox`);
                let line = {
                  especie: calculo.tipo_seguro,
                  periodoInicioBeneficio: calculo.tipo_aposentadoria,
                  contribuicaoPrimaria: this.getTempoDeContribuicaoPrimaria(calculo),
                  contribuicaoSecundaria: this.getTempoDeContribuicaoSecundaria(calculo),
                  dib: calculo.data_pedido_beneficio,
                  dataCriacao: this.formatReceivedDate(calculo.data_calculo),
                  checkbox: checkBox
                }
                this.calculoList.push(line);
                this.grupoCalculosTableOptions = {
                  ...this.grupoCalculosTableOptions,
                  data: this.calculoList,
                }
                if ((counter + 1) == this.idsCalculo.length)
                  this.isUpdating = false;
                counter++;
              });
          }
        }
      });
  }

  loadCurrency(data) {
    for (let currency of this.currencyList) {
      let startDate = moment(currency.startDate);
      let endDate = moment(currency.endDate);
      if (startDate <= data && data <= endDate) {
        return currency;
      }
    }
  }

  calcularCoeficiente(anosContribuicao, toll, redutorProfessor, redutorSexo, proporcional, dib) {
    let coeficienteAux = 0;
    let porcentagem = 0.06;
    let coeficienteAux2 = 100;

    if (dib > this.dataDib98) {
      porcentagem = 0.05;
    }
    if (proporcional) {
      let extra = this.tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, 5);
      coeficienteAux2 = 100 * this.coeficienteProporcional(extra, porcentagem, toll);
    }

    switch (this.tipoBeneficio) {
      // Auxílio Doença Previdenciário
      case 1:
        if (dib >= this.dataLei9032)
          coeficienteAux = 91;
        else if (dib >= this.dataLei8213) {
          coeficienteAux = 80 + anosContribuicao;
          if (coeficienteAux > 92)
            coeficienteAux = 92;
        } else {
          coeficienteAux = 80 + anosContribuicao;
        }
        break;
      // Aposentadoria por invalidez previdênciária
      case 2:
        if (dib >= this.dataLei9032)
          coeficienteAux = 100;
        else
          coeficienteAux = 80 + anosContribuicao;
        break;
      // Aponsentadoria por idade trabalhador Urbano ou Rural
      case 3:
        coeficienteAux = 70 + anosContribuicao;
        break;
      // Aposentadoria por tempo de contribuição
      case 4:
        coeficienteAux = coeficienteAux2;
        break;
      // Aposentadoria Especial
      case 5:
        if (dib >= this.dataLei9032)
          coeficienteAux = 100;
        else
          coeficienteAux = 85 + anosContribuicao;
        break;
      //Aposentadoria por tempo de serviço de professor
      case 6:
        coeficienteAux = coeficienteAux2;
        break;
      // Auxílio Acidente Previdenciário 50%
      case 7:
        coeficienteAux = 50;
        break;
      // Aponsentadoria por idade trabalhador Rural
      case 16:
        coeficienteAux = 70 + anosContribuicao;
        break;
      // Auxílio Acidente Previdenciário 30%
      case 17:
        coeficienteAux = 30;
        break;
      // Auxílio Acidente Previdenciário 40%
      case 18:
        coeficienteAux = 40;
        break;
      // Auxílio Acidente Previdenciário 60%
      case 19:
        coeficienteAux = 60;
        break;
      // Pessoa com deficiencia Grave 100%
      case 25:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia Moderada 100%
      case 26:
        coeficienteAux = 100;
        break;
      //Pessoa com deficiencia Leve 100%
      case 27:
        coeficienteAux = 100;
        break;
      // Pessoa com deficiencia por Idade 70%
      case 28:
        coeficienteAux = 70 + anosContribuicao;
        break;
    }
    coeficienteAux = (coeficienteAux > 100) ? 100 : coeficienteAux;
    return coeficienteAux;
  }

  tempoExtra(anosContribuicao, redutorProfessor, redutorSexo, extra) {
    let retVal = anosContribuicao - (35 - redutorProfessor - redutorSexo - extra);
    return retVal;
  }

  verificarTempoDeServico(anosContribuicao, redutorProfessor, redutorSexo, extra) {
    let tempoNecessario = 35 - redutorProfessor - redutorSexo - extra;
    if (Math.trunc(anosContribuicao) < Math.trunc(tempoNecessario))
      return false;
    return true;
  }

  coeficienteProporcional(extra, porcentagem, toll) {
    let coeficienteProporcional = 0.7 + (Math.trunc(extra - toll) * porcentagem);
    coeficienteProporcional = (coeficienteProporcional > 1) ? 1 : coeficienteProporcional;
    coeficienteProporcional = (coeficienteProporcional < 0.7) ? 0.7 : coeficienteProporcional;
    return coeficienteProporcional;
  }

  verificarIdadeMinima(idade, errorArray) {
    let temIdadeMinima = true;
    let idadeMinima;
    if (this.tipoBeneficio == 3) {
      if (this.segurado.sexo == 'm' && this.idadeSegurado < 65) {
        idadeMinima = 65;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo == 'f' && this.idadeSegurado < 60) {
        idadeMinima = 60;
        temIdadeMinima = false;
      }
    } else if (this.tipoBeneficio == 16 || this.tipoBeneficio == 28) {
      if (this.segurado.sexo == 'm' && this.idadeSegurado < 60) {
        idadeMinima = 60;
        temIdadeMinima = false;
      }
      if (this.segurado.sexo == 'f' && this.idadeSegurado < 55) {
        idadeMinima = 55;
        temIdadeMinima = false;
      }
    }

    if (!temIdadeMinima) {
      errorArray.push("O segurado não tem a idade mínima (" + idadeMinima + " anos) para se aposentar por idade. Falta(m) " + (idadeMinima - this.idadeSegurado) + " ano(s) para atingir a idade mínima.");
    }
    return temIdadeMinima;
  }

  getAnoNecessario(redutorIdade, redutorProfessor, redutorSexo) {
    let idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    let anoNecessario = (moment(this.segurado.data_nascimento, 'DD/MM/YYYY')).add(idadeNecessaria, 'years');
    return anoNecessario.year();
  }

  getValoresAdministrativos(rmi) {
    let reajustesAdministrativos = true;
    let valorBeneficio = rmi;
    let dataAnterior = null;
    let dataCorrente = null;
    for (let reajusteAutomatico of this.reajustesAutomaticos) {
      if (dataAnterior == null) {
        dataAnterior = reajusteAutomatico.data_reajuste;
      } else {
        dataAnterior = dataCorrente;
      }
      dataCorrente = reajusteAutomatico.data_reajuste;
      let reajuste = (reajusteAutomatico.indice != null) ? reajusteAutomatico.indice : 1;
      valorBeneficio = this.convertCurrency(valorBeneficio, dataAnterior, dataCorrente);
      if (reajustesAdministrativos) {
        valorBeneficio = valorBeneficio * reajuste;
      }
      valorBeneficio = (valorBeneficio < reajusteAutomatico.salario_minimo) ? reajusteAutomatico.salario_minimo : valorBeneficio;
      valorBeneficio = (valorBeneficio > reajusteAutomatico.teto) ? reajusteAutomatico.teto : valorBeneficio;
    }
    return valorBeneficio;
  }

  calcularExtra(tempoServico, redutorSexo) {
    let extra;
    if (this.tipoBeneficio == 6) {
      extra = this.calcularToll(tempoServico, 0.4, 5, redutorSexo) + this.calcularBonus(tempoServico) * (-1);
    } else {
      extra = this.calcularToll(tempoServico, 0.4, 5, redutorSexo) * (-1);
    }
    return extra;
  }

  calcularToll(tempoDeServico, porcentagem, proporcional, redutorSexo) {
    let toll = ((35 - proporcional - redutorSexo) - tempoDeServico) * porcentagem;
    toll = (toll < 0) ? 0 : toll;
    return toll;
  }

  verificarIdadeNecessaria(idade, redutorIdade, redutorProfessor, redutorSexo, errorArray) {
    let idadeNecessaria = 60 - redutorIdade - redutorProfessor - redutorSexo;
    let direito = idade > idadeNecessaria;
    if (!direito) {
      errorArray.push("Falta(m) " + (idadeNecessaria - idade) + "ano(s)");
    }
    return direito;
  }

  tratarTempoFracionado(time) {
    let year = Math.floor(time);
    let month = Math.round((time - year) * 12);

    let returnStr = "";
    if (year != 0) {
      returnStr += year + " ano(s)";
    }
    if (month != 0 && year != 0) {
      returnStr += " e ";
    }
    if (month != 0) {
      returnStr += month + " mes(es)";
    }
    if (month == 0 && year == 0) {
      returnStr = " 0 ano(s) ";
    }
    if (year < 0) {
      returnStr = "";
    }
    return returnStr;
  }

  calcularBonus(tempoServico) {
    let bonus;
    if (this.segurado.sexo == 'm') {
      bonus = 17 / 100;
    } else {
      bonus = 20 / 100;
    }
    bonus = bonus * tempoServico;
    return bonus;
  }

  getEspecieBeneficio(calculo) {
    let numeroEspecie = 0;
    switch (calculo.tipo_seguro) {
      case "Auxílio Doença":
        numeroEspecie = 1;
        break;
      case "Aposentadoria por invalidez Previdenciária ou Pensão por Morte":
        numeroEspecie = 2;
        break;
      case "Aposentadoria por idade - Trabalhador Urbano":
        numeroEspecie = 3;
        break;
      case "Aposentadoria por tempo de contribuição":
        numeroEspecie = 4;
        break;
      case "Aposentadoria por tempo de serviço":
        numeroEspecie = 4;
        break;
      case "Aposentadoria especial":
        numeroEspecie = 5;
        break;
      case "Aposentadoria por tempo de serviço de professor":
        numeroEspecie = 6;
        break;
      case "Auxílio Acidente previdenciário - 50%":
        numeroEspecie = 7;
        break;
      case "Aposentadoria por idade - Trabalhador Rural":
        numeroEspecie = 16;
        break;
      case "Auxílio Acidente - 30%":
        numeroEspecie = 17;
        break;
      case "Auxílio Acidente - 40%":
        numeroEspecie = 18;
        break;
      case "Auxílio Acidente - 60%":
        numeroEspecie = 19;
        break;
      case "Abono de Permanência em Serviço":
        numeroEspecie = 20;
        break;
      case "Aposentadoria especial da Pessoa com Deficiência Grave":
        numeroEspecie = 25;
        break;
      case "Aposentadoria especial da Pessoa com Deficiência Moderada":
        numeroEspecie = 26;
        break;
      case "Aposentadoria especial da Pessoa com Deficiência Leve":
        numeroEspecie = 27;
        break;
      case "Aposentadoria especial por Idade da Pessoa com Deficiência":
        numeroEspecie = 28;
        break;
      default:
        break;
    }
    return numeroEspecie;
  }


/**
 * Regras anteriores a 29/11/1999 não devem ser calculadas para os tipo 2,3,16
 * @param especieBeneficio 
 */
  verificaEspecieDeBeneficioIvalidezIdade99(especieBeneficio, dib){
    let data99 = moment('1999-11-29');

    if ((((especieBeneficio === 2) ||
      (especieBeneficio === 3) ||
      (especieBeneficio === 16))
      ||
      ((especieBeneficio === 'Aposentadoria por invalidez Previdenciária ou Pensão por Morte') ||
      (especieBeneficio === 'Aposentadoria por idade - Trabalhador Urbano') ||
      (especieBeneficio === 'Aposentadoria por idade - Trabalhador Rural') ))
      && 
      dib > data99) {
       return true;
  }
    return false;
}


  formatMoney(value, sigla = 'R$') {
    let numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    return sigla + numeroPadronizado;
  }

  formatDecimal(value, n_of_decimal_digits) {
    value = parseFloat(value);
    return (value.toFixed(parseInt(n_of_decimal_digits))).replace('.', ',');
  }

  formatReceivedDate(inputDate) {
    var date = new Date(inputDate);
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000))
    if (!isNaN(date.getTime())) {
      // Months use 0 index.
      return ('0' + (date.getDate())).slice(-2) + '/' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        date.getFullYear();
    }
    return '';
  }

  getDifferenceInMonths(date1, date2 = moment(), floatRet = false) {
    let difference = date1.diff(date2, 'months', true);
    difference = Math.abs(difference);
    if (floatRet) {
      return difference;
    }
    return Math.floor(difference);
  }

  getTempoDeContribuicaoPrimaria(data) {
    let str = '';
    if (data.contribuicao_primaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_98.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_primaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_99.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_primaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_primaria_atual.replace(/-/g, '/') + '<br>';
    }

    return str;
  }

  getTempoDeContribuicaoSecundaria(data) {
    let str = '';
    if (data.contribuicao_secundaria_98 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_98.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_secundaria_99 !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_99.replace(/-/g, '/') + '<br>';
    }
    if (data.contribuicao_secundaria_atual !== 'undefined-undefined-undefined') {
      str = str + data.contribuicao_secundaria_atual.replace(/-/g, '/') + '<br>';
    }

    return str;
  }

  convertCurrency(valor, dataCorrente, dataConversao) {
    let valorConvertido = parseFloat(valor);
    for (let currency of this.currencyList) {
      let startDate = moment(currency.startDate);
      let endDate = moment(currency.endDate);
      if (dataCorrente > endDate) {
        // já esta em uma data maior que a data que a moeda termina, procurar na proxima
        continue;
      } else if (startDate > dataConversao) {
        // já ultrapassou a data de conversão, finalizar o calculo
        break;
      } else if (dataCorrente < endDate && dataCorrente >= startDate) {
        // Propria Moeda, não há corte.
        continue;
      } else if (dataCorrente <= endDate) {
        // Estamos na moeda seguinte, converter divindindo pelo indiceDeCorreção;
        valorConvertido /= currency.indiceCorrecaoAnterior;
      }
    }
    return valorConvertido;
  }

  getContribuicaoObj(stringContrib) {
    let returnObj = { anos: 0, meses: 0, dias: 0 };
    if (stringContrib) {
      let anos = (stringContrib.split('-')[0] != 'undefined') ? stringContrib.split('-')[0] : 0;
      let meses = (stringContrib.split('-')[1] != 'undefined') ? stringContrib.split('-')[1] : 0;
      let dias = (stringContrib.split('-')[2] != 'undefined') ? stringContrib.split('-')[2] : 0;
      returnObj = { anos: parseFloat(anos), meses: parseFloat(meses), dias: parseFloat(dias) };
    }
    return returnObj;
  }

  controleExibicao(calculo) {
    let data88 = moment('1988-10-05');
    let data91 = moment('1991-04-04');
    let data91_98 = moment('1991-04-05');
    let data98_99 = moment('1998-12-15');
    let data99 = moment('1999-11-29');
    let dataInicioBeneficio = moment(calculo.data_pedido_beneficio, 'DD/MM/YYYY');
    calculo.isBlackHole = false;
    if (dataInicioBeneficio < data88) {
      //* Periodo = Anterior a 05/10/88
      // Cálculos realizados: anterior a 88
      calculo.mostrarCalculoAnterior88 = true;
    } else if (dataInicioBeneficio >= data88 && dataInicioBeneficio <= data91) {
      if (calculo.tipo_aposentadoria == 'Anterior a 05/10/1988') {
        //Cálculos: Anterior a 88
        calculo.mostrarCalculoAnterior88 = true;
      } else if (calculo.tipo_aposentadoria == 'Entre 05/10/1988 e 04/04/1991') {
        //Cálculos: anterior a 88 + entre 91 e 98 (realizar contas no mesmo box)
        // calculo.mostrarCalculoAnterior88 = true;
        // calculo.mostrarCalculo91_98 = true;
        calculo.mostrarCalculo88_91 = true;
        calculo.isBlackHole = true;
      }
    } else if (dataInicioBeneficio > data91_98 && dataInicioBeneficio <= data98_99) {
      //Cálculos: entre 91 e 98
      calculo.mostrarCalculo91_98 = true;
    } else if (dataInicioBeneficio > data98_99 && dataInicioBeneficio <= data99) {
      //if(calculo.tipo_aposentadoria == 'Entre 05/04/1991 e 15/12/1998'){
      //Cálculos: entre 91 e 98 (tempo de contribuicao até a ementa (98)
      //calculo.mostrarCalculo91_98 = true;
      //}else if(calculo.tipo_aposentadoria == 'Entre 16/12/1998 e 28/11/1999'){
      //Cálculos = entre 91 e 98) (tempo de contribuicao até a lei 99)(cálculos realizados em box separados)
      calculo.mostrarCalculo91_98 = true;
      calculo.mostrarCalculo98_99 = true;
      //}
    } else if (dataInicioBeneficio > data99) {
      /*Todos os periodos de contribuicao (entre 91 e 98, entre 98 e 99, após 99)
      Cálculos: entre 91 e 98 (tempo de contribuicao até ementa 98)
                entre 98 e 99 (tempo de contribuicao até lei 99)
                após 99     (tempo de contribuicao após a lei 99)
      (cálculos em box separados)*/
      calculo.mostrarCalculo91_98 = true;
      calculo.mostrarCalculo98_99 = true;
      calculo.mostrarCalculoApos99 = true;
    }
  }

  preencheGrupoDeCalculos() {
    for (let calculo of this.calculosList) {
      let especie = calculo.tipo_seguro;
      let periodoInicioBeneficio = calculo.tipo_aposentadoria;
      let contribuicaoPrimaria = this.getTempoDeContribuicaoPrimaria(calculo);
      let contribuicaoSecundaria = this.getTempoDeContribuicaoSecundaria(calculo);
      let dib = calculo.data_pedido_beneficio;
      let dataCriacao = this.formatReceivedDate(calculo.data_calculo);
      let checkBox = `<div class="checkbox"><label><input type="checkbox" id='${calculo.id}-checkbox' class="checkbox {{styleTheme}}"><span> </span></label></div>`;
      this.checkboxIdList.push(`${calculo.id}-checkbox`);
      let line = {
        especie: especie,
        periodoInicioBeneficio: periodoInicioBeneficio,
        contribuicaoPrimaria: contribuicaoPrimaria,
        contribuicaoSecundaria: contribuicaoSecundaria,
        dib: dib,
        dataCriacao: dataCriacao,
        checkbox: checkBox,
      }
      this.calculoList.push(line);
    }

    this.grupoCalculosTableOptions = {
      ...this.grupoCalculosTableOptions,
      data: this.calculoList,
    }
  }

  getIdadeSegurado() {
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    return moment().diff(dataNascimento, 'years');
  }

  getIdadeNaDIB(dib) {
    let dataNascimento = moment(this.segurado.data_nascimento, 'DD/MM/YYYY');
    return dib.diff(dataNascimento, 'years');
  }

  exportarParaBeneficios(data, valor, tipoCalculo) {

    const objExport = JSON.stringify({
      seguradoId: this.segurado.id,
      dib: data,
      valor: valor,
    });

    sessionStorage.setItem('exportBeneficioAtrasado', objExport);
    window.location.href = '/#/beneficios/beneficios-calculos/' + tipoCalculo + '/' + this.segurado.id;

  }

  generateBoxId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  editSegurado() {
    window.location.href = '/#/rgps/rgps-segurados/' + this.idSegurado + '/editar';
  }

  listaSegurados() {
    window.location.href = '/#/rgps/rgps-segurados/';
  }

  infoCalculos() {
    window.location.href = '/#/rgps/rgps-calculos/' + this.idSegurado + '/' + this.idsCalculo[0] + '/edit';
  }

  valoresContribuidos() {
    let idList = [];
    for (let checkboxId of this.checkboxIdList) {
      idList.push(checkboxId.split('-')[0]);
    }
    let stringArr = idList.join(',');
    window.location.href = '/#/rgps/rgps-valores-contribuidos/' + this.idSegurado + '/' + stringArr;
  }

  imprimirPagina() {
    let seguradoBox = document.getElementById('printableSegurado').innerHTML
    let grupoCalculos = document.getElementById('boxGrupoCalculos').innerHTML + '<br>';
    let allCalcBoxHtml = document.getElementsByClassName('boxCalculo');
    let allCalcBoxText = '';
    for (let index = 0; index < allCalcBoxHtml.length; index++) {
      allCalcBoxText += allCalcBoxHtml[index].innerHTML + '<br><br>';
    }

    //let printContents = document.getElementById('content').innerHTML;
    let printContents = seguradoBox + grupoCalculos + allCalcBoxText;
    printContents = printContents.replace(/<table/g, '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');
    let rodape = '<footer><p>IEPREV - Instituto de Estudos Previdenciários - Rua Timbiras, 1940 Sala 810 | Tel: (31) 3271-1701 | CEP: 30140-069 Lourdes - Belo Horizonte - MG</p></footer>';
    let popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /><style>#tituloCalculo{font-size:1.2em;}</style></head><body onload="window.print()">' + printContents + rodape + '</body></html>');
    popupWin.document.close();
  }

  imprimirBox(boxId) {
    let seguradoBox = document.getElementById('printableSegurado').innerHTML
    let boxContent = document.getElementById(boxId).innerHTML;
    let rodape = '<footer><p>IEPREV - Instituto de Estudos Previdenciários - Rua Timbiras, 1940 Sala 810 | Tel: (31) 3271-1701 | CEP: 30140-069 Lourdes - Belo Horizonte - MG</p></footer>';
    let printableString = '<html><head><link rel="stylesheet" type="text/css" href="style.css" /><style>#tituloCalculo{font-size:1.2em;}</style></head><body onload="window.print()">' + seguradoBox + ' <br> ' + boxContent + rodape + '</body></html>';
    printableString = printableString.replace(/<table/g, '<table align="center" style="width: 100%; border: 1px solid black; border-collapse: collapse;" border=\"1\" cellpadding=\"3\"');
    let popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    popupWin.document.write(printableString);
    popupWin.document.close();
  }

  getDataFiliacao() {
    if (this.segurado.data_filiacao) {
      return moment(this.segurado.data_filiacao, "DD/MM/YYYY");
    }
    return null;
  }

  compararCalculos() {
    let idList = [];
    for (let checkboxId of this.checkboxIdList) {
      if ((<HTMLInputElement>document.getElementById(checkboxId)).checked) {
        idList.push(checkboxId.split('-')[0]);
      }
    }

    if (idList.length != 2) {
      swal('Erro', 'Só é possível comparar 2 cálculos', 'error');
    } else {
      window.location.href = '/#/rgps/rgps-elements/' +
        this.route.snapshot.params['id_segurado'] + '/' + idList[0] + '/' + idList[1];

    }
  }



  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.caixaOpcoes = document.getElementById("containerOpcoes");
    let navbar = document.getElementById("navbar");

    // const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const offset = 0;

    if ((this.window != undefined && this.window.pageYOffset != undefined) ||
      (this.document != undefined && this.document.documentElement.scrollTop != undefined)
      || (this.document != undefined && this.document.body.scrollTop != undefined)
    ) {
      const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

      if (offset > this.offset(this.caixaOpcoes)) {
        this.navIsFixed = true;
        //  navbar.classList.add("sticky")
      } else if (this.navIsFixed) {
        this.navIsFixed = false;
        //  navbar.classList.remove("sticky");
      }
    }
  }

  offset(el) {
    if (el != undefined) {
      var rect = el.getBoundingClientRect(),
        scrollTop = this.window.pageYOffset || this.document.documentElement.scrollTop;
      return rect.top + scrollTop;
    }
  }

}
