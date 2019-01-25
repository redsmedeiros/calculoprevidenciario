
import { ControllerService } from '../../contracts/Controller.service';
import { SeguradoContagemTempo } from './SeguradoContagemTempo.model';




export class SeguradoService extends ControllerService {

  public model = SeguradoContagemTempo;
  public name = 'seguradoContagemTempo';
  public list: SeguradoContagemTempo[] = this.store.data['seguradoContagemTempo'];


  public getByUserId(userId) {

    return new Promise((resolve, reject) => {
      let parameters = ['user_id', userId];
      this.getWithParameter(parameters).then(() => {
          let list = this.list;
          resolve(list);
      }).catch(error => {
          console.error(error);
          reject(error);
      })
    });
  }

}


