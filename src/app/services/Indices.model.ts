import { Model } from '../contracts/Model';

export class Indices extends Model {

  static url = 'http://localhost:8000/indices';
  static form = {
    data_moeda: '',
    indice: '',
    indice_os: '',
  };

  public data_moeda;
  public indice;
  public indice_os;
}
