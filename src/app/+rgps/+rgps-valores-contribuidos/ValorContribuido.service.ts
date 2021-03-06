import { ControllerService } from '../../contracts/Controller.service';

import { ValorContribuido } from './ValorContribuido.model';
import * as moment from 'moment';

export class ValorContribuidoService extends ControllerService {

	public model = ValorContribuido;
	public name = 'valorContribuido';
	public list: ValorContribuido[] = this.store.data['valorContribuido'];

	public getByCalculoId(calculoId, dataInicio, dataLimite, qtdeMeses=0, seguradoId=null) {
		this.store.data['valorContribuido'].length = 0;
		return new Promise((resolve, reject) => {
			dataInicio = (dataInicio != null) ? dataInicio.format('YYYY-MM-DD') : null;
			//let parameters = ['id_calculo', calculoId, 'inicio_intervalo', dataInicio];
			let parameters = {
				id_calculo: calculoId,
				inicio_intervalo: dataInicio,
				id_segurado: seguradoId
			};
			this.getWithParametersObj(parameters).then(() => {
				if(dataInicio == null || dataLimite == null){
					let list = this.list;
					resolve(list);
				}else{
					dataInicio = moment(dataInicio);
					let list = this.list.filter((valor: ValorContribuido) => {
						let dataContribuicao = moment(valor.data);
						return dataContribuicao < dataInicio && dataContribuicao >= dataLimite;
					});
					if(qtdeMeses){
						list = list.slice(0, qtdeMeses);
					}
					resolve(list);
				}
			}).catch(error => {
				console.error(error);
				reject(error);
			});
		});
	}
}