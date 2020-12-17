import { ControllerService } from '../../../contracts/Controller.service';
import { SeguradoPlan } from './SeguradoPlan.model';


export class SeguradoPlanService extends ControllerService {

	public model = SeguradoPlan;
	public name = 'seguradoPlan';
	public list: SeguradoPlan[] = this.store.data['seguradoPlan'];

	public getByUserId(userId) {

		return new Promise((resolve, reject) => {
			let parameters = ['user_id', userId];
			// if (this.list.length == 0) {
			this.getWithParameter(parameters).then(() => {
				let list = this.list;
				resolve(list);

			}).catch(error => {
				console.error(error);
				reject(error);
			})
			// } else {
			// 	let list = this.list;
			//  	resolve(list);
			// }
		});
	}


	public getByIdSegurado(id) {

		return new Promise((resolve, reject) => {
			let parameters = ['segurado_id', id];
			// if (this.list.length == 0) {
			this.getWithParameter(parameters).then(() => {
				let list = this.list[0];
				resolve(list);
			}).catch(error => {
				console.error(error);
				reject(error);
			})
			// } else {
			// 	let list = this.list;
			//  	resolve(list);
			// }
		});
	}
}
