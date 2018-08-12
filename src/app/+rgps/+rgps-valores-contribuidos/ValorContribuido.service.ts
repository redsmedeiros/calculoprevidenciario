import { ControllerService } from '../../contracts/Controller.service';

import { ValorContribuido } from './ValorContribuido.model';
import * as moment from 'moment';

export class ValorContribuidoService extends ControllerService {

  public model = ValorContribuido;
  public name = 'valorContribuido';
  public list: ValorContribuido[] = this.store.data['valorContribuido'];

  public getByCalculoId(calculoId, dataInicio, dataLimite) {

    return new Promise((resolve, reject) => {
    	let parameters = ['id_calculo', calculoId, 'inicio_intervalo', dataInicio.format('YYYY-MM-DD')];
	  	if (this.list.length == 0) {
	  		this.getWithParameters(parameters).then(() => {
			  	let list = this.list.filter((valor:ValorContribuido) => {
			  		let dataContribuicao = moment(valor.data);
			  		return dataContribuicao < dataInicio &&  dataContribuicao >= dataLimite;
			  	});
			  	resolve(list);
	  		}).catch(error => {
	          console.error(error);
	          reject(error);	  			
	  		})
	  	} else {
			let list = this.list.filter((valor:ValorContribuido) => {
				let dataContribuicao = moment(valor.data);
			  return dataContribuicao < dataInicio &&  dataContribuicao >= dataLimite;
			});
	  		resolve(list);
  		}
    });
  }

}