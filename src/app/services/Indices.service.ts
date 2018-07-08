import { ControllerService } from '../contracts/Controller.service';

import { Indices } from './Indices.model';

export class IndicesService extends ControllerService {

  public model = Indices;
  public name = 'indices';
  public list: Indices[] = this.store.data['indices'];


  public getByDateRange(from, to) {

    return new Promise((resolve, reject) => {
    	let parameters = ['inicio_intervalo', from, 'final_intervalo', to];
	  	if (this.list.length == 0) {
	  		this.getWithParameters(parameters).then(() => {
			  	let list = this.list.filter((indices) => {
			  		return true;
			  	});
			  	resolve(list);
	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  	} else {
			let list =  this.list.filter((indices) => {
			  	return true;
			  	//return fromDate <= inicioIntervalo && fimIntervalo <= toDate;
	  		})
	  		resolve(list);
  		}
    });
  }

}
