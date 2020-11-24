import { ControllerService } from '../contracts/Controller.service';

import { Indices } from './Indices.model';
import * as moment from 'moment';

export class IndicesService extends ControllerService {

  public model = Indices;
  public name = 'indices';
  public list: Indices[] = this.store.data['indices'];
  public firstMonth;


  public getByDateRange(from, to) {

    return new Promise((resolve, reject) => {

      const parameters = ['inicio_intervalo', from, 'final_intervalo', to];

      this.getWithParameters(parameters).then(() => {

        const list = this.list;
        this.firstMonth = moment(this.list[0].data_moeda);
        resolve(list);

      }).catch(error => {

        console.error(error);
        reject(error);

      });
    });

  }


  public getByDateRangeDirectResult(from, to) {

    return new Promise((resolve, reject) => {
      const parameters = ['inicio_intervalo', from, 'final_intervalo', to];
      this.getWithParameters(parameters).then((rstList) => {

        const list = rstList['data'].map(model => {
          return new Indices(model);
        });
        resolve(list);
      }

      ).catch(error => {
        console.error(error);
        reject(error);
      });
    });

  }




  public getByDate(date) {
    date = date.startOf('month');
    let difference = date.diff(this.firstMonth, 'months', true);
    difference = Math.abs(difference);
    difference = Math.floor(difference);
    return this.list[difference];
  }

}
