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

  private url;

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


  onLoad(e) {
    console.log('onLoad executed', e);
    console.log(this.iframe.nativeElement);
    console.log( typeof this.iframe.nativeElement);
    console.log(this.iframe.nativeElement.querySelector('div'));

    let doc =  this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    console.log(doc);
    console.log(doc.header);

    // var iframe = document.getElementById("myFrame");
    // var elmnt = iframe.contentWindow.document.getElementsByTagName("H1")[0];
    // elmnt.style.display = "none";

  }

  getURL() {

    let value = `http://localhost:4200/#/rgps/rgps-resultados/`;
    value += `${this.segurado.id}/${this.calculo.id}/plan/${this.planejamento.id}`;

    console.log(value);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(value);

    console.log(this.url);

    return this.url;
  }


  seguirParaResultados() {
    '/rgps/rgps-planejamento/resultados/275/228/2';

    let value = `/rgps/rgps-planejamento/resultados/`;
    value += `${this.segurado.id}/${this.calculo.id}/${this.planejamento.id}`;

    swal({
      position: 'top-end',
      type: 'success',
      title: 'Crie o segurado e execute um cálculo de RMI em que o segurado atenda os requisitos.',
      showConfirmButton: false,
      timer: 3000
    });


    this.router.navigate(['/rgps/rgps-segurados']);
  }


  formatMoeda(value, sigla = 'R$') {

    value = parseFloat(value);
    const numeroPadronizado = value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return sigla + ' ' + numeroPadronizado;
  }


}
