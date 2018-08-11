import { Model } from '../../contracts/Model';

export class CarenciaProgressiva extends Model {

  static url = 'http://localhost:8000/carencia_progressiva';
  static form = {
    ano : '',
    quantidade_meses: '',
  };
  public ano;
  public quantidade_meses;
}