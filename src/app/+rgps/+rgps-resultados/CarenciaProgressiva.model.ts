import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class CarenciaProgressiva extends Model {

  static url = environment.apiUrl + 'carencia_progressiva';
  static form = {
    ano : '',
    quantidade_meses: '',
  };
  public ano;
  public quantidade_meses;
}