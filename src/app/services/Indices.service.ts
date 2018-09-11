import { ControllerService } from '../contracts/Controller.service';

import { Indices } from './Indices.model';
import * as moment from 'moment';

export class IndicesService extends ControllerService {

  public model = Indices;
  public name = 'indices';
  public list: Indices[] = this.store.data['indices'];
  public firstMonth;


  public getByDateRange(from, to) {

    return new Promise((resolve, reject) => {
    	let parameters = ['inicio_intervalo', from, 'final_intervalo', to];
	  	if (this.list.length == 0) {
	  		this.getWithParameters(parameters).then(() => {
			  	let list = this.list;
			  	this.firstMonth = moment(this.list[0].data_moeda);
			  	resolve(list);
	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  	} else {
			let list =  this.list;
			this.firstMonth = moment(this.list[0].data_moeda);
	  		resolve(list);
  		}
    });
  }

  public getByDate(date){
  	date = date.startOf('month');
  	let difference = date.diff(this.firstMonth, 'months', true);
    difference = Math.abs(difference);
    difference = Math.floor(difference);
    return this.list[difference];
  }

}
