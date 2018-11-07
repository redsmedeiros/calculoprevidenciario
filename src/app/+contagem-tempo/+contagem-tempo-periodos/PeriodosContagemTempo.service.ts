import { PeriodosContagemTempo } from './PeriodosContagemTempo.model';
import { ControllerService } from '../../contracts/Controller.service';


export class PeriodosContagemTempoService extends ControllerService {

	public model = PeriodosContagemTempo;
	public name = 'periodosContagemTempo';
	public list: PeriodosContagemTempo[] = this.store.data['periodosContagemTempo'];

	public getByPeriodosId(id_contagem_tempo) {
		return new Promise((resolve, reject) => {
			let parameters = ['id_contagem_tempo', id_contagem_tempo];
			this.getWithParameters(parameters).then(() => {
				let list = this.list;
				resolve(list);
			}).catch(error => {
				console.error(error);
				reject(error);
			})
		});
	}

	public updatePeriodo(id) {
		return new Promise((resolve, reject) => {
			this.update(id).then(() => {
				let list = this.list;
				resolve(list);
			}).catch(error => {
				console.error(error);
				reject(error);
			})
		});
	}

}