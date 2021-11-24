import { ControllerService } from '../../contracts/Controller.service';
import { CalculoContagemTempo } from './CalculoContagemTempo.model';

export class CalculoContagemTempoService extends ControllerService {

  public model = CalculoContagemTempo;
  public name = 'calculoContagemTempo';
  public list: CalculoContagemTempo[] = this.store.data['calculoContagemTempo'];



  

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


}
