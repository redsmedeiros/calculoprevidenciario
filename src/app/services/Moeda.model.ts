import { Model } from '../contracts/Model';
import { environment } from '../../environments/environment';

export class Moeda extends Model {

  static url = environment.apiUrl + 'moeda';
  static form = {
    data_moeda: '',
    salario_minimo: '',
    aliquota: '',
    cam: '',
    teto: '',
    fator: '',
    sigla: '',
    nome: '',
    tr: '',
    ipca: '',
    juros_selic_70: ''
  };

  public data_moeda;
  public salario_minimo;
  public aliquota;
  public cam;
  public teto;
  public fator;
  public sigla;
  public nome;
  public tr;
  public ipca;
  public juros_selic_70;
}
