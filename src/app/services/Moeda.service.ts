import { ControllerService } from '../contracts/Controller.service';

import { Moeda } from './Moeda.model';

export class MoedaService extends ControllerService {

  public model = Moeda;
  public name = 'moeda';
  public list: Moeda[] = this.store.data['moeda'];


  public getByDateRange(from, to) {

    return new Promise((resolve, reject) => {

    	let fromDate = Date.parse(from);
    	let toDate = Date.parse(to);

	  	if (this.list.length == 0) {
	  		this.get().then(() => {
			  	let list = this.list.filter((moeda) => {
			  		let moedaDate = Date.parse(moeda.data_moeda);
			  		return fromDate <= moedaDate && moedaDate <= toDate;
			  	});
			  	resolve(list);
	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  	} else {
			let list =  this.list.filter((moeda) => {
		  		let moedaDate = Date.parse(moeda.data_moeda);
		  		return fromDate <= moedaDate && moedaDate <= toDate;
	  		})
	  		resolve(list);
  		}
    });
  }

}
