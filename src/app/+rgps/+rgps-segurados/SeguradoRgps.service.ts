import { ControllerService } from '../../contracts/Controller.service';

import { SeguradoRgps } from './SeguradoRgps.model';

export class SeguradoService extends ControllerService {

  public model = SeguradoRgps;
  public name = 'seguradosRgps';
  public list: SeguradoRgps[] = this.store.data['seguradosRgps'];

  public getByUserId(userId) {

    return new Promise((resolve, reject) => {
    	let parameters = ['user_id', userId];
	  	// if (this.list.length == 0) {
	  		this.getWithParameter(parameters).then(() => {
			  	let list = this.list;
			  	resolve(list);

	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  	// } else {
				// 	let list = this.list;
			 //  	resolve(list);
  		// }
    });
  }
}
