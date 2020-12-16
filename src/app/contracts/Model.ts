import { Injectable } from '@angular/core';

import axios from 'axios';

//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
//axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//axios.defaults.headers.common['Authorization'] = 'da91377af82e4445dbbf4f772cbea39206f9abe0';

//axios.defaults.headers.common['Content-Type'] = 'application/json'
//axios.defaults.headers.common['Authorization'] = 'da91377af82e4445dbbf4f772cbea39206f9abe0';
//axios.defaults.headers.common['X-API-KEY'] = 'da91377af82e4445dbbf4f772cbea39206f9abe0';

// axios.defaults.headers.common["X-CSRF-k"] = "test";
@Injectable()
export abstract class Model {
  static url: string;
  get url(): string { return this.constructor['url']; }
  set url(val: string) { this.constructor['url'] = val; }

  static form: {};
  get form(): {} { return this.constructor['form']; }
  set form(val: {}) { this.constructor['form'] = val; }

  public id;
  protected _data: {};

  public actions;

  public static all() {
    return axios.get(`${this.url}`);
  }

  public static allFromUser(userId) {
    return axios.get(`${this.url}/${userId}`);
  }

  public static store(data) {
    return axios.post(`${this.url}`, data);
  }

  public static find(id) {
    return axios.get(`${this.url}/${id}`);
  }

  public static getWithParameters(params) {
    if (params.length > 2) {
      return axios.get(`${this.url}`+'?'+params[0]+'='+params[1]+'&'+params[2]+'='+params[3]);
    } else {
      return axios.get(`${this.url}`+'?'+params[0]+'='+params[1]);
    }
  }

  public static getWithParameter(params) {
    return axios.get(`${this.url}`+'?'+params[0]+'='+params[1]);
  }

  public static getWithParametersObj(params) {
    return axios.get(`${this.url}`, {params: params});
  }  

  public update() {
    const data = {};
    for (const field in this.form) {
      if (this.hasOwnProperty(field)) {
        data[field] = this[field];
      }
    }
    return axios.patch(`${this.url}/${this.id}`, data);
  }

  public destroy() {
    return axios.delete(`${this.url}/${this.id}`);
  }

  constructor(
    data: {} = {}
  ) {
    this._data = data;
    this.hydrate(data);
  }

  protected hydrate(data: {}) {
    for (const field in data) {
      if (data.hasOwnProperty(field)) {
        this[field] = data[field];
      }
    }
  }

}
