import { ControllerService } from '../../contracts/Controller.service';

import { ExpectativaVida } from './ExpectativaVida.model';
import * as moment from 'moment';

export class ExpectativaVidaService extends ControllerService {

	public model = ExpectativaVida;
  public name = 'expectativaVida';
  public list: ExpectativaVida[] = this.store.data['expectativaVida'];

  public getByIdade(idadeFracionada) {

    return new Promise((resolve, reject) => {
    	let parameters = ['idade', idadeFracionada, '', ''];
	  	// if (this.list.length == 0) {
	  		this.getWithParameters(parameters).then(() => {
			  	let list = this.list;
			  	resolve(list);
	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  // 	} else {
			// let list = this.list;
	  // 		resolve(list);
  	// 	}
    });
  }

  public getByDates(dataInicio, dataFim){
    console.log(dataInicio, dataFim)
  	for(let expectativa of this.list){
  		let startDate = (expectativa.data_inicial) ? moment(expectativa.data_inicial) : null ;
  		let endDate = (expectativa.data_final) ? moment(expectativa.data_final) : null;
      if(dataFim == null){
        if(startDate <= dataInicio && endDate >= dataInicio){
          return expectativa.valor;
        }
      }else{
        if(startDate <= dataInicio && endDate >= dataFim){
          return expectativa.valor;
        }
      }
  	}
  	return -1;
  }



  public getByAno(ano){
  	for(let expectativa of this.list){
  		if(expectativa.ano == ano){
  			return expectativa.valor;
  		}
  	}
  	return -1;
  }
}