import { Injectable } from '@angular/core';

import { StoreService } from '../services/store.service';

@Injectable()
export abstract class ControllerService {

  abstract list;
  abstract name;
  abstract model;

  constructor(
    public store: StoreService
  ) { }

  get() {
    return new Promise((resolve, reject) => {
      this.model.all()
        .then(models => {
          this.store.push(this.name, models.data.map(model => {
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

  getWithPair(key, value) {
    return new Promise((resolve, reject) => {
      this.model.all()
        .then(models => {
          models.data = models.data.filter((element) => {
            return element[key] == value;
          });
          this.store.push(this.name, models.data.map(model => {
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

  getWithParameters(params) {
    this.store.data[this.name].length = 0;
    return new Promise((resolve, reject) => {
      this.model.getWithParameters(params)
        .then(models => {
          this.store.push(this.name, models.data.map(model => {
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

  getWithParameter(params) {
    return new Promise((resolve, reject) => {
      this.model.getWithParameter(params)
        .then(models => {
          this.store.push(this.name, models.data.map(model => {
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

  getWithParametersObj(params) {
    this.store.data[this.name].length = 0;
    return new Promise((resolve, reject) => {
      this.model.getWithParametersObj(params)
        .then(models => {
          this.store.push(this.name, models.data.map(model => {
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

  public getByDateRange(from, to) {

    return new Promise((resolve, reject) => {

      if (this.list.length === 0 || this.list == []) {
        this.get().then(() => {
          let list = this.list.filter((moeda) => {
            return from > moeda.data_moeda && to < moeda.data_moeda;
          });
          resolve(list);
        }).catch(error => {
          console.error(error);
          reject(error);
        })
      } else {
        let list = this.list.filter((moeda) => {
          return from > moeda.data_moeda && to < moeda.data_moeda;
        })
        resolve(list);
      }
    });
  }

  getFromUser(userId) {
    return new Promise((resolve, reject) => {
      this.model.allFromUser(userId)
        .then(models => {
          this.store.push(this.name, models.data.map(model => {
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
      const data = this.list.find(model => {
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
    // console.log(data);
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
          resolve(true);
        })
        .catch(error => reject(error.response.data));
    });
  }


  public postDataURL(urlController, matriz) {

    return new Promise((resolve, reject) => {
      this.model.postDataURL(urlController, matriz)
        .then(data => {
          resolve(data.data);
          return;
        }).catch(error => reject(error.response.data));
    });

  }

  public getDataURL(urlController, matriz) {

    return new Promise((resolve, reject) => {
      this.model.getDataURL(urlController, matriz)
        .then(data => {
          resolve(data.data);
          return;
        }).catch(error => reject(error.response.data));
    });

  }

  public getDataParameterURL(urlController, param) {

    return new Promise((resolve, reject) => {
      this.model.getDataParameterURL(urlController, param)
        .then(data => {
          resolve(data.data);
          return;
        }).catch(error => reject(error.response.data));
    });

  }


}
