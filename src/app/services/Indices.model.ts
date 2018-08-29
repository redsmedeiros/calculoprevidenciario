import { Model } from '../contracts/Model';
import { environment } from '../../environments/environment';

export class Indices extends Model {

  static url = environment.apiUrl + 'indices';
  static form = {
    data_moeda: '',
    indice: '',
    indice_os: '',
  };

  public data_moeda;
  public indice;
  public indice_os;
}
