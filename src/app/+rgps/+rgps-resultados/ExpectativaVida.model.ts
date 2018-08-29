import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class ExpectativaVida extends Model {

  static url = environment.apiUrl + 'exp_vida';
  static form = {
    data_inicial : '',
    data_final: '',
    ano: '',
    valor: '',
  };
  public data_inicial;
  public data_final;
  public ano;
  public valor;
}