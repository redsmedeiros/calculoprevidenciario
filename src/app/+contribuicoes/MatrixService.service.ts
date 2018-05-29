import { Injectable } from '@angular/core';

@Injectable()
export class MatrixService {

  public sharedDict;
  public sharedTabelaDetalhes;
  public sharedTabelaResultados;

  constructor(){
    this.sharedDict = [];
    this.sharedTabelaDetalhes = [];
  }

  setDict(data) {
    this.sharedDict = data;
  }
  
  getDict() {
    return this.sharedDict;
  }

  setTabelaDetalhes(data) {
    this.sharedTabelaDetalhes = data;
  }
  
  getTabelaDetalhes() {
    return this.sharedTabelaDetalhes;
  }

  setTabelaResultados(data) {
    this.sharedTabelaResultados = data;
  }
  
  getTabelaResultados() {
    return this.sharedTabelaResultados;
  }
}