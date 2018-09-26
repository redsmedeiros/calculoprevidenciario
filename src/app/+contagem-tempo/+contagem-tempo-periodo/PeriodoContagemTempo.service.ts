import { ControllerService } from '../../contracts/Controller.service';

import { PeriodoContagemTempo } from './PeriodoContagemTempo.model';
import * as moment from 'moment';

export class PeriodoContagemTempoService extends ControllerService {

	public model = PeriodoContagemTempo;
	public name = 'periodoContagemTempo';
	public list: PeriodoContagemTempo[] = this.store.data['periodoContagemTempo'];

	public getByCalculoId(calculoId, dataInicio, dataLimite) {

		return new Promise((resolve, reject) => {
			let parameters = ['id_contagem_tempo', calculoId];
			if (this.list.length == 0) {
				this.getWithParameters(parameters).then(() => {
					let list = this.list;
					resolve(list);
				}).catch(error => {
					console.error(error);
					reject(error);
				})
			}
		});
	}

}