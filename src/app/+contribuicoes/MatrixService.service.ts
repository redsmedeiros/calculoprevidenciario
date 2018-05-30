import { Injectable } from '@angular/core';

@Injectable()
//Serviço que armazena a Tabela de Detalhamento do calculo da Lei complementar.
export class MatrixService {

  public sharedTabelaDetalhes;

  constructor(){
    this.sharedTabelaDetalhes = [];
  }

  setTabelaDetalhes(data) {
    this.sharedTabelaDetalhes = data;
  }
  
  getTabelaDetalhes() {
    return this.sharedTabelaDetalhes;
  }

}