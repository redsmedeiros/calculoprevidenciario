import { Model } from '../../contracts/Model';

export class ExpectativaVida extends Model {

  static url = 'http://localhost:8000/exp_vida';
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