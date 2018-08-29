import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class ReajusteAutomatico extends Model {

  static url = environment.apiUrl + 'indicesrgps';
  static form = {
    data_reajuste : '',
    teto: '',
    salario_minimo: '',
    indice: '',
  };
  public data_reajuste;
  public teto;
  public salario_minimo;
  public indice;
}