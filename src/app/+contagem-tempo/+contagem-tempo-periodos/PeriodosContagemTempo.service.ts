// import { ControllerService } from '../../contracts/Controller.service';

// import { PeriodosContagemTempo } from './PeriodosContagemTempo.model';
// import * as moment from 'moment';

// export class PeriodosContagemTempoService extends ControllerService {

// 	public model = PeriodosContagemTempo;
// 	public name = 'periodosContagemTempo';
// 	public list: PeriodosContagemTempo[] = this.store.data['periodosContagemTempo'];

// 	public getByCalculoId(calculoId, dataInicio, dataLimite) {

// 		return new Promise((resolve, reject) => {
// 			let parameters = ['id_contagem_tempo', calculoId];

// 			console.log(this);
			
// 			if ((typeof this.list !== 'undefined') && this.list.length == 0) {
// 				this.getWithParameters(parameters).then(() => {
// 					let list = this.list;
// 					resolve(list);
// 				}).catch(error => {
// 					console.error(error);
// 					reject(error);
// 				})
// 			}
// 		});
// 	}

// }


import { PeriodosContagemTempo } from './PeriodosContagemTempo.model';
import { ControllerService } from '../../contracts/Controller.service';
import * as moment from 'moment';


export class PeriodosContagemTempoService extends ControllerService {

	public model = PeriodosContagemTempo;
	public name = 'periodosContagemTempo';
	public list: PeriodosContagemTempo[] = this.store.data['periodosContagemTempo'];
	public getByPeriodosId(id_contagem_tempo) {

		return new Promise((resolve, reject) => {
			let parameters = ['id_contagem_tempo', id_contagem_tempo];
			console.log(this);

			if (this.list.length == 0) {
				this.getWithParameters(parameters).then(() => {
						let list = this.list;
						resolve(list);
					
				}).catch(error => {
					console.error(error);
					reject(error);
				})
			} else {
				// if (dataInicio == null || dataLimite == null) {
				// 	let list = this.list;
				// 	resolve(list);
				// } else {
				// 	dataInicio = moment(dataInicio);
				// 	let list = this.list.filter((valor: PeriodosContagemTempo) => {
				// 		let dataContribuicao = moment(valor.data_inicio);
				// 		return dataContribuicao < dataInicio && dataContribuicao >= dataLimite;
				// 	});
				// 	resolve(list);
				// }
			}
		});
	}

}