import { ControllerService } from '../../contracts/Controller.service';

import { IndiceInps } from './IndiceInps.model';
import * as moment from 'moment';

export class IndiceInpsService extends ControllerService {

  public model = IndiceInps;
  public name = 'indiceInps';
  public list: IndiceInps[] = this.store.data['indiceInps'];

  public getByDate(dataComparacao) {

    return new Promise((resolve, reject) => {
    	let parameters = ['data_comparacao', dataComparacao.format('YYYY-MM-DD'), '', ''];
	  	if (this.list.length == 0) {
	  		this.getWithParameters(parameters).then(() => {
			  	let list = this.list;
			  	resolve(list);
	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  	} else {
			let list = this.list;
			resolve(list);
  		}
    });
  }

}