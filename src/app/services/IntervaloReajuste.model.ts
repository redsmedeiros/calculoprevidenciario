import { Model } from '../contracts/Model';
import { environment } from '../../environments/environment';

export class IntervaloReajuste extends Model {

  static url = environment.apiUrl + 'intervaloreajuste';
  static form = {
    id: '',
    n_reajuste: '',
    dib_ini: '',
    dib_fim: '',
    indice: '',
    indice_os: '',
  };

  public id;
  public n_reajuste;
  public dib_ini;
  public dib_fim;
  public indice;
  public indice_os;
}
