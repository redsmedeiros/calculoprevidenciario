import { ControllerService } from '../../contracts/Controller.service';

import { CarenciaProgressiva } from './CarenciaProgressiva.model';

export class CarenciaProgressivaService extends ControllerService {

  public model = CarenciaProgressiva;
  public name = 'carenciaProgressiva';
  public list: CarenciaProgressiva[] = this.store.data['carenciaProgressiva'];

  public getCarencias() {

    return new Promise((resolve, reject) => {

	  	if (this.list.length == 0) {
	  		this.get().then(() => {
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

  public getCarencia(ano){
  	for(let carencia of this.list){
  		if(carencia.ano == ano){
  			return carencia.quantidade_meses;
  		}
  	}

  	return 0;
  }

}