import { Injectable } from '@angular/core';

@Injectable()
export class MatrixService {
  public sharedData;
  public sharedDict;

  constructor(){
    this.sharedData = [];
    this.sharedDict = [];
  }

  setMatrix(data) {
    this.sharedData = data;
  }
  
  getMatrix() {
    return this.sharedData;
  }

  setDict(data) {
    this.sharedDict = data;
  }
  
  getDict() {
    return this.sharedDict;
  }
}