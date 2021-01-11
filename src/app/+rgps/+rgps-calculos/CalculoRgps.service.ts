import { ControllerService } from '../../contracts/Controller.service';

import { CalculoRgps } from './CalculoRgps.model';

export class CalculoRgpsService extends ControllerService {

  public model = CalculoRgps;
  public name = 'calculoRgps';
  public list: CalculoRgps[] = this.store.data['calculoRgps'];



  public getCalculoBySeguradoId(idSegurado) {
    return new Promise((resolve, reject) => {
      const parameters = ['id_segurado', idSegurado];
      this.getWithParameters(parameters)
        .then(() => {
          let list = this.list;
          resolve(list);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }


  public getCalculoById(id) {
    return new Promise((resolve, reject) => {
      const parameters = ['id_calculo', id];
      this.getWithParameters(parameters)
        .then(() => {
          let list = this.list[0];
          resolve(list);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }
}