import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';




@Component({
  selector: 'app-rgps-planejamento-calculo-futuro',
  templateUrl: './rgps-planejamento-calculo-futuro.component.html',
  styleUrls: ['./rgps-planejamento-calculo-futuro.component.css']
})
export class RgpsPlanejamentoCalculoFuturoComponent implements OnInit {

  @Input() segurado;
  @Input() calculo;
  @Input() planejamento;
  @Input() isPlanejamentoSelecionado;

  @ViewChild('iframe') iframe: ElementRef;

  private baseUrl = window.location.origin;
  private url;
  private isResultRMIFutura;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {


    this.getURL();
    // this.iframe.nativeElement.addEventListener('load', this.onLoad.bind(this));
    console.log('teste')

  }

  ngAfterViewInit() {
    this.iframe.nativeElement.addEventListener('load', this.onLoad.bind(this));
  }


  private habilitarResultadoPlanejamento() {


    setTimeout(() => {
      this.isResultRMIFutura = true;
    }, 2000);

  }


  onLoad(e) {

    console.log(' ---- onLoad executed ---- ');
    console.log('onLoad executed', e);
    console.log(this.iframe.nativeElement);
    console.log(typeof this.iframe.nativeElement);
    console.log(this.iframe.nativeElement.querySelector('div'));

    let doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    console.log(doc.document.querySelector('#header'));
    console.log(this.iframe.nativeElement.contentWindow.document.querySelector('#header'));
    console.log(doc.header);

    console.log(' ---- onLoad executed ---- ');

    // var iframe = document.getElementById("myFrame");
    // var elmnt = iframe.contentWindow.document.getElementsByTagName("H1")[0];
    // elmnt.style.display = "none";


    this.habilitarResultadoPlanejamento();
  }

  getURL() {

    //let value = `http://localhost:4200/#/rgps/rgps-resultados/`;

    console.log(this.router)

    let value = `${this.baseUrl}/#/rgps/rgps-resultados/`;
    value += `${this.segurado.id}/${this.calculo.id}/plan/${this.planejamento.id}`;

    console.log(value);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(value);

    console.log(this.url);

    return this.url;
  }


  seguirParaResultados() {

    // let value = `${this.baseUrl}/#/rgps/rgps-planejamento/resultados/`;
    let value = `/rgps/rgps-planejamento/resultados/`;
    value += `${this.segurado.id}/${this.calculo.id}/${this.planejamento.id}`;

    swal({
      position: 'top-end',
      type: 'success',
      title: 'Crie o segurado e execute um cálculo de RMI em que o segurado atenda os requisitos.',
      showConfirmButton: false,
      timer: 3000
    });


    this.router.navigate([value]);
  }


  formatMoeda(value, sigla = 'R$') {

    value = parseFloat(value);
    const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return sigla + ' ' + numeroPadronizado;
  }


}
