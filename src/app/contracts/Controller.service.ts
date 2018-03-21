import { Injectable } from '@angular/core';

import { StoreService } from '../services/store.service';

@Injectable()
export abstract class ControllerService {

  abstract list;
  abstract name;
  abstract model;

  constructor(
    public store: StoreService
  ) {}

  get() {
    return new Promise((resolve, reject) => {
      this.model.all()
        .then(models => {
          this.store.push(this.name, models.data.map( model => {
            return new this.model(model);
          }));
          resolve(models);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }

  find(id) {
    return new Promise((resolve, reject) => {
      const data = this.list.find( model => {
        return +model.id === +id;
      });
      if (data) {
        resolve(data);
        return;
      }

      this.model.find(id)
          .then(response => {
            const model = new this.model(response.data);
            this.store.push(this.name, model);
            resolve(model);
          })
          .catch(error => reject(error.response.data));
    });
  }

  save(data) {
    return new Promise((resolve, reject) => {
      this.model.store(data)
        .then(model => {
          const newModel = new this.model(model.data);
          this.store.push(this.name, newModel);
          resolve(newModel);
        })
        .catch(error => reject(error.response.data));
    });
  }

  update(data) {
    return new Promise((resolve, reject) => {
      data.update()
          .then(model => {
            data.hydrate(model.data);
            this.list = this.store.update(this.name, data);
            resolve(data);
          }).catch(error => reject(error.response.data));
    });
  }

  destroy(model) {
    return new Promise((resolve, reject) => {
      model.destroy()
           .then(response => {
              this.list = this.store.remove(this.name, model);
              resolve();
            })
           .catch(error => reject(error.response.data));
    });
  }

}
