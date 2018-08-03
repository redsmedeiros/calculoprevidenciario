import { Model } from '../../contracts/Model';

export class IndiceInps extends Model {

  static url = 'http://localhost:8000/indices_inps';
  static form = {
    ano : '',
    valor: '',
  };
  public ano;
  public valor;
}
