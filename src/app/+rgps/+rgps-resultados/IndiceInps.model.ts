import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class IndiceInps extends Model {

  static url = environment.apiUrl + 'indices_inps';
  static form = {
    ano : '',
    valor: '',
  };
  public ano;
  public valor;
}
