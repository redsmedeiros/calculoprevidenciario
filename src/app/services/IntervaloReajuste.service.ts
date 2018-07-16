import { ControllerService } from '../contracts/Controller.service';

import { IntervaloReajuste } from './IntervaloReajuste.model';

export class IntervaloReajusteService extends ControllerService {

  public model = IntervaloReajuste;
  public name = 'intervaloReajuste';
  public list: IntervaloReajuste[] = this.store.data['intervaloReajuste'];


  public getByDateRange(from, to) {

    return new Promise((resolve, reject) => {
    	let fromDate = Date.parse(from);
    	let toDate = Date.parse(to);

	  	if (this.list.length == 0) {
	  		this.get().then(() => {
			  	let list = this.list.filter((intervaloReajuste) => {
			  		let inicioIntervalo = Date.parse(intervaloReajuste.dib_ini);
			  		let fimIntervalo = Date.parse(intervaloReajuste.dib_fim);
			  		return true;
			  		//return fromDate <= inicioIntervalo && fimIntervalo <= toDate;
			  	});
			  	resolve(list);
	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  	} else {
			let list =  this.list.filter((intervaloReajuste) => {
		  		let inicioIntervalo = Date.parse(intervaloReajuste.dib_ini);
			  	let fimIntervalo = Date.parse(intervaloReajuste.dib_fim);
			  	return true;
			  	//return fromDate <= inicioIntervalo && fimIntervalo <= toDate;
	  		})
	  		resolve(list);
  		}
    });
  }

}
