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
  public controleDeTitulos = []

  public arrayResultadosFinais = []
  public tabela = []
  public numeroDeSecundarios = 0

  constructor() { 
    super(null, null, null, null, null, null, null);
  }

  ngOnInit() {

    this.resultados()
  
  }

  public Secundarios(){

    if (this.isExits(this.resultadoFinal)) {
      
      let formatarValor = []

     for(const row of this.resultadoFinal){

        
        formatarValor.push(this.replaceMoney(row[6]))
      
      }


    
      return formatarValor
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

  public replacePocentagem(valor){

    if (valor === "") {
      valor = 0;
    } else {
      valor = valor.replace("%", "");
      valor = valor.replace(",", " ");
      valor = parseFloat(valor);
    }

    valor = valor / 100

    return valor;


  }


  public getBeneficioPrimario(){

      let primario = this.conclusoes[6]
      return this.replaceMoney(primario.value)

  }

  public somaGeral(){

    let valorSecundario = this.Secundarios()

    let somaSecundarios = 0

    for(let i = 0; i < valorSecundario.length; i++ ){

        
        somaSecundarios = somaSecundarios +  valorSecundario[i]
   

    }

   

    let soma = this.getBeneficioPrimario() + somaSecundarios

  

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

    let valorSecundario = this.Secundarios()

   

    if(this.resultadoFinal.length >= 1){

      for(const row of valorSecundario){

        this.arrayResultadosFinais.push(this.formatMoney(row))

      }
    } 
    
    this.arrayResultadosFinais.push(this.formatMoney(this.somaGeral()))
    this.arrayResultadosFinais.push(aliquota)
 
    this.arrayResultadosFinais.push(this.formatMoney(this.getResultadoRmi(aliquota)))

    this.controleDeTitulos.push( 'Salário de Benefício (Atividade Primária)')

    if(this.resultadoFinal.length >= 1){

      let i = 1

      for(const row of valorSecundario){

        this.controleDeTitulos.push( 'Percentual do Salário de Benefício (Atividade Secundária - '+i+ ')')
        i++

      }
    }

    this.controleDeTitulos.push('Soma dos Salários de Contribuição')
    this.controleDeTitulos.push(' Aliquota')
    this.controleDeTitulos.push('Renda Mensal Inicial')

   

   
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

  public getResultadoRmi(aliquota){

    aliquota = this.replacePocentagem(aliquota)

  
  

    let resultado = this.somaGeral() * aliquota



    return resultado


  }

 

}
