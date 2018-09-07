import { ControllerService } from '../../contracts/Controller.service';

import { ValorContribuido } from './ValorContribuido.model';
import * as moment from 'moment';

export class ValorContribuidoService extends ControllerService {

	public model = ValorContribuido;
	public name = 'valorContribuido';
	public list: ValorContribuido[] = this.store.data['valorContribuido'];

	public getByCalculoId(calculoId, dataInicio, dataLimite) {

		return new Promise((resolve, reject) => {
			dataInicio = (dataInicio != null) ? dataInicio.format('YYYY-MM-DD') : null;
			let parameters = ['id_calculo', calculoId, 'inicio_intervalo', dataInicio];
			if (this.list.length == 0) {
				this.getWithParameters(parameters).then(() => {
					if(dataInicio == null || dataLimite == null){
						let list = this.list;
						resolve(list);
					}else{
						dataInicio = moment(dataInicio);
						let list = this.list.filter((valor: ValorContribuido) => {
							let dataContribuicao = moment(valor.data);
							return dataContribuicao < dataInicio && dataContribuicao >= dataLimite;
						});
						resolve(list);
					}
				}).catch(error => {
					console.error(error);
					reject(error);
				})
			} else {
				if (dataInicio == null || dataLimite == null) {
					let list = this.list;
					resolve(list);
				} else {
					dataInicio = moment(dataInicio);
					let list = this.list.filter((valor: ValorContribuido) => {
						let dataContribuicao = moment(valor.data);
						return dataContribuicao < dataInicio && dataContribuicao >= dataLimite;
					});
					resolve(list);
				}
			}
		});
	}

}