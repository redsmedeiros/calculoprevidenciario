import { Model } from '../../contracts/Model';

export class ReajusteAutomatico extends Model {

  static url = 'http://localhost:8000/indicesrgps';
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