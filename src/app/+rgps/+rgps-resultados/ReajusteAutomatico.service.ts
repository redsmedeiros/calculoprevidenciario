import { ControllerService } from '../../contracts/Controller.service';

import { ReajusteAutomatico } from './ReajusteAutomatico.model';

export class ReajusteAutomaticoService extends ControllerService {

  public model = ReajusteAutomatico;
  public name = 'reajusteAutomatico';
  public list: ReajusteAutomatico[] = this.store.data['reajusteAutomatico'];

  public getByDate(inicio, fim) {

    return new Promise((resolve, reject) => {
	  	let parameters = ['inicio_intervalo', inicio.format('YYYY-MM-DD'), 'final_intervalo', fim.format('YYYY-MM-DD')];
      this.getWithParameters(parameters).then(() => {
        let list = this.list;
        resolve(list);
      }).catch(error => {
        console.error(error);
        reject(error);          
      });
    });
  }

}