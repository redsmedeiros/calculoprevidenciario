import { ControllerService } from '../contracts/Controller.service';
import { Moeda } from './Moeda.model';
import * as moment from 'moment';

export class MoedaService extends ControllerService {

  public model = Moeda;
  public name = 'moeda';
  public list: Moeda[] = this.store.data['moeda'];
  public firstMonth;

  public getByDateRange(from, to) {

    return new Promise((resolve, reject) => {

    	let fromDate = Date.parse(from);
    	let toDate = Date.parse(to);
	  	if (this.list.length == 0) {
	  		this.get().then(() => {
			  	let list = this.list.filter((moeda) => {
			  		let moedaDate = Date.parse(moeda.data_moeda+'T02:00:00.000Z');
			  		return fromDate <= moedaDate && moedaDate <= toDate;
			  	});
			  	this.firstMonth = moment(this.list[0].data_moeda);
			  	resolve(list);
	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  	} else {
			let list =  this.list.filter((moeda) => {
		  		let moedaDate = Date.parse(moeda.data_moeda+'T02:00:00.000Z');
		  		return fromDate <= moedaDate && moedaDate <= toDate;
	  		})
	  		this.firstMonth = moment(this.list[0].data_moeda);
	  		resolve(list);
  		}
    });
  }

  public getByDateRangeMoment(from, to) {
  	console.log(from.format('DD-MM-YYYY'), to.format('DD-MM-YYYY'))
    return new Promise((resolve, reject) => {
	  	if (this.list.length == 0) {
	  		this.get().then(() => {
			  	let list = this.list.filter((moeda) => {
			  		let moedaDate = moment(moeda.data_moeda);
			  		return from <= moedaDate && moedaDate <= to;
			  	});
			  	this.firstMonth = moment(this.list[0].data_moeda);
			  	resolve(list);
	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  	} else {
			let list =  this.list.filter((moeda) => {
		  		let moedaDate = moment(moeda.data_moeda);
		  		return from <= moedaDate && moedaDate <= to;
	  		})
	  		this.firstMonth = moment(this.list[0].data_moeda);
	  		resolve(list);
  		}
    });
  }

  public getByDate(date){
  	date = date.startOf('month');
  	let difference = date.diff(this.firstMonth, 'months', true);
    //difference = Math.abs(difference);
	difference = Math.floor(difference);
    return this.list[difference];
  }

}
