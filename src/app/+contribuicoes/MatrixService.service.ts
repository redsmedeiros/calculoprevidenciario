import { Injectable } from '@angular/core';

@Injectable()
export class MatrixService {
  public sharedData;

  constructor(){
    this.sharedData = [];
  }

  setMatrix(data) {
    this.sharedData = data;
  }
  
  getMatrix() {
    return this.sharedData;
  }
}