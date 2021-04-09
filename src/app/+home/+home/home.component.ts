import { Component, OnInit } from '@angular/core';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Auth } from "../../services/Auth/Auth.service";
import { AuthResponse } from "../../services/Auth/AuthResponse.model";
import swal from 'sweetalert';

@FadeInTop()
@Component({
  selector: 'sa-datatables-showcase',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {


  private textosSimuladoresMenu = [
    {
      value: 'RMI',
      link: '/rgps/rgps-segurados',
      icon: `fa fa-lg fa-fw fa-calculator`,
      title: `RMI  <br>do RGPS`,
      label: `Simula a Renda Mensal Inicial de benefícios com datas de início a
      partir de Janeiro de 1970.`
    },
    {
      value: 'benef-atrasados',
      link: '/beneficios/beneficios-segurados',
      icon: `fa fa-lg fa-fw fa-calendar`,
      title: `Liquidação <br> de Sentença`,
      label: `Elabora demonstrativo de cálculo para Cumprimento de Sentença, calculando 
      a diferença entre os valores de benefícios devido e recebido, com aplicação de correção 
      monetária, juros de mora e honorários advocatícios, incluindo, para os benefícios concedidos 
      até 12/2003, a readequação aos Tetos Constitucionais previstos nas EC’s 20/98 e 41/03 (Revisão do Teto).`
    },
    {
      value: 'contrib-atrasadas',
      link: '/contribuicoes/contribuicoes-segurados',
      icon: `fa fa-lg fa-fw fa-history`,
      title: `Contribuições <br> em Atraso`,
      label: ` Simula cálculo de contribuições previdenciárias em atraso com base
      no entendimento jurisprudencial e Lei Complementar nº. 128, de
      12/2008.`
    },
    {

      value: 'contagem',
      link: '/contagem-tempo/contagem-tempo-segurados',
      icon: `fa fa-lg fa-fw fa-calendar-check-o`,
      title: `Contagem  <br>de Tempo`,
      label: `Simula contagem do tempo de contribuição para períodos especial e
               comum e de atividade como contribuinte individual.`
    },
    {
      value: 'trasicao',
      link: '/transicao',
      icon: `fa fa-lg fa-fw fa-list-ul`,
      title: 'Regras  <br>de Transição',
      label: `Possibilita simular quando o segurado vai atingir os requisitos exigidos pelas regras de transição da
       EC nº 103/2019.`
    },
    {
      value: 'plan',
      link: '/rgps/rgps-planejamento',
      icon: `fa  fa-history fa-flip-horizontal fa-lg fa-fw`,
      title: `Planejamento  <br> Previdenciário`,
      label: `Possibilita a realização de cálculos, comparando o valor do benefício em diferentes datas (atual e/ou futura),
       a fim de identificar o melhor momento para o requerimento da aposentadoria.`
    },
    {
      value: 'tutorial',
      link: '/tutorial',
      icon: `fa fa-lg fa-fw fa-question-circle `,
      title: `Tutoriais  <br>e Manuais`,
      label: `Tutoriais dos simuladores de cálculos previdenciários.`
    },
  ];

  private textDescricao = '';

  constructor(
    private route: ActivatedRoute,
    private Auth: Auth
  ) { }




  ngOnInit() {

  }


  over(value) {
    this.textDescricao = this.textosSimuladoresMenu.find(item => item.value === value).label;
  }

  out(value) {
    this.textDescricao = '';
  }

}
