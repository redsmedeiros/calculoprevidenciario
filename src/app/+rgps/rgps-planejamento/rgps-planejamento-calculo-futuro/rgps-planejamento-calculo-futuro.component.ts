import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { RgpsPlanejamentoService } from './../rgps-planejamento.service';
import { PlanejamentoRgps } from './../PlanejamentoRgps.model';
import swal from 'sweetalert2';
import * as moment from 'moment';



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

  //@ViewChild('iframe') iframe: ElementRef;

  private baseUrl = window.location.origin;
  private url;
  private isResultRMIFutura = false;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    protected planejamentoService: RgpsPlanejamentoService,
  ) { }

  ngOnInit() {


    //this.getURL();
    // this.iframe.nativeElement.addEventListener('load', this.onLoad.bind(this));
    //console.log('teste');
    
  }

  ngAfterViewInit() {
    /// this.iframe.nativeElement.addEventListener('load', this.onLoad.bind(this));

    setTimeout(() => {

      this.planejar();

    }, 5000);

  }



  private planejar() {

    //window.location.href 
    const urlpbcNew = '/rgps/rgps-resultados/' + this.segurado.id + '/' + this.calculo.id + '/plan/' + this.planejamento.id;
    this.router.navigate([urlpbcNew]);

  }




  private getValueRMIFutura() {


    // exportPlanejamentoRSTRMI

    const exportObjPlanejamento = JSON.parse(sessionStorage.exportPlanejamentoRSTRMI);

    console.log(exportObjPlanejamento);

    const planejamentoP = this.planejamentoService.find(this.planejamento.id)
      .then((planejamentoRMIRST: PlanejamentoRgps) => {

        console.log('fim')
        console.log(planejamentoRMIRST);

      }).catch(errors => console.log(errors));

  }




  private habilitarResultadoPlanejamento() {


    //   const asyncLocalStorage = {
    //     setItem: function (key, value) {
    //       return Promise.resolve().then(function () {
    //         sessionStorage.setItem(key, value);
    //       });
    //     },
    //     getItem: function (key) {
    //       return Promise.resolve().then(function () {
    //         return sessionStorage.getItem(key);
    //       });
    //     }
    //   };

    // //   const asyncLocalStorage = {
    // //     setItem: async function (key, value) {
    // //       //  await null;
    // //         return localStorage.setItem(key, value);
    // //     },
    // //     getItem: async function (key) {
    // //       //  await null;
    // //         return localStorage.getItem(key);
    // //     }
    // // };

    //   const data = Date.now() % 10000;
    //   const promisseFrame = asyncLocalStorage.setItem('exportPlanejamentoRSTRMI', data).then(function () {
    //     return asyncLocalStorage.getItem('exportPlanejamentoRSTRMI');
    //   }).then(function (value) {
    //     console.log('Value has been set to:', value);
    //   });
    //   console.log('waiting for value to become ' + data +
    //     '. Current value: ', sessionStorage.getItem('exportPlanejamentoRSTRMI'));


    //   Promise.all([promisseFrame]).then((values) => {

    //     console.log('fim');
    //     console.log(sessionStorage.exportPlanejamentoRSTRMI);

    //   });



    // setTimeout(() => {

    //   this.getValueRMIFutura();
    //   this.isResultRMIFutura = true;

    //   const doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    //   console.log(doc);


    //   console.log(sessionStorage.exportPlanejamentoRSTRMI);

    // }, 5000);

  }

  onLoad(e) {

    console.log('onLoad executed', e);


    // console.log(' ---- onLoad executed ---- ');
    // console.log('onLoad executed', e);
    // console.log(this.iframe.nativeElement);
    // console.log(this.iframe.nativeElement.contentWindow.document.body);
    // console.log(typeof this.iframe.nativeElement);
    // console.log(this.iframe.nativeElement.querySelector('div'));
    // console.log(doc.document.querySelector('#header'));
    // console.log(this.iframe.nativeElement.contentWindow.document.querySelector('#header'));
    // console.log(doc.header);

    // console.log(' ---- onLoad executed ---- ');

    // var iframe = document.getElementById("myFrame");
    // var elmnt = iframe.contentWindow.document.getElementsByTagName("H1")[0];
    // elmnt.style.display = "none";


    this.habilitarResultadoPlanejamento();
  }

  getURL() {
    let value = `${this.baseUrl}/#/rgps/rgps-resultados/`;
    value += `${this.segurado.id}/${this.calculo.id}/plan/${this.planejamento.id}`;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(value);

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

  formatDate(date: string) {
    return moment(date).format('DD/MM/YYYY');
  }

}
