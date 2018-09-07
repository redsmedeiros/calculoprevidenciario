import { ControllerService } from '../../contracts/Controller.service';

import { SalarioMinimoMaximo } from './SalarioMinimoMaximo.model';
import * as moment from 'moment';

export class SalarioMinimoMaximoService extends ControllerService {

  public model = SalarioMinimoMaximo;
  public name = 'salarioMinimoMaximo';
  public list: SalarioMinimoMaximo[] = this.store.data['salarioMinimoMaximo'];

  public getByDate(dataSalario) {
    return new Promise((resolve, reject) => {
    	let parameters = ['data_salario', dataSalario.format('YYYY-MM-DD'), '', ''];
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