import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SocialModule } from '../../../../+dashboard/+social/social.module';
import { SeguradoContagemTempo as SeguradoModel } from 'app/+contagem-tempo/+contagem-tempo-segurados/SeguradoContagemTempo.model';
import { RgpsResultadosApos99Component } from '../../rgps-resultados-apos99old/rgps-resultados-apos99.component';

@Component({
  selector: 'app-rgps-resultados-apos99-global',
  templateUrl: './rgps-resultados-apos99-global.component.html',
  styleUrls: ['./rgps-resultados-apos99-global.component.css']
})
export class RgpsResultadosApos99GlobalComponent extends RgpsResultadosApos99Component implements OnInit {

  @Output() resultadoEmitter = new EventEmitter()

  @Input() resultadoFinal
  @Input() conclusoes
  @Input() moedaDibSec

  public isUpdating = true
  public controleDeTitulos = [
    'Benefício Primário',
    'Soma Benefícios Secundários',
    'Aliquota',
    'Benefício Global'

  ]

  public arrayResultadosFinais = []
  public tabela = []

  constructor() { 
    super(null, null, null, null, null, null, null);
  }

  ngOnInit() {

    this.resultados()
  
   
    
  }

  public somaSecundarios(){

    if (this.isExits(this.resultadoFinal)) {
      
      let soma = 0

      for(const row of this.resultadoFinal){

        let formatarValor = this.replaceMoney(row[6])
        
        soma = formatarValor + soma


      }
    
        return soma
    }

   
    
  }

  public replaceMoney(valor){

    if (valor === "") {
      valor = 0;
    } else {
      valor = valor.replace(".", "");
      valor = valor.replace(",", ".");
      valor = valor.replace("R", " ");
      valor = valor.replace("$", " ");
      valor = parseFloat(valor);
    }

    return valor;


  }

  public getBeneficioPrimario(){

      let primario = this.conclusoes[6]
      return this.replaceMoney(primario.value)

  }

  public somaGeral(){

    
    let secundario = this.somaSecundarios()
    let soma = this.getBeneficioPrimario() + secundario 

  

   return soma
  }



  public resultados(){

    let aliquota

    for(const row of this.conclusoes ){

      
       
      if(row.order === 19){
        aliquota = row.value
      }
    }
    

    this.arrayResultadosFinais.push(this.formatMoney(this.getBeneficioPrimario()))
    this.arrayResultadosFinais.push(this.formatMoney(this.somaSecundarios()))
    this.arrayResultadosFinais.push(aliquota)
    this.arrayResultadosFinais.push(this.formatMoney(this.somaGeral()))
    
    
    
    let i = 0
    

    for(const row in this.controleDeTitulos){

      let resultadoParcial = {
        titulo: this.controleDeTitulos[i],
        resultado: this.arrayResultadosFinais[i]
      }

      i++

      this.tabela.push(resultadoParcial)
     
     
      
    }

  }

}
