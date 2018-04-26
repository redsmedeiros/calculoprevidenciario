import { Model } from '../contracts/Model';

export class Moeda extends Model {

  static url = 'http://localhost:8000/moeda';
  static form = {
    data_moeda: '',
    salario_minimo: '',
    aliquota: '',
    correcao: '',
    teto: '',
    fator: '',
    sigla: '',
    nome: '',
  };

  public data_moeda;
  public salario_minimo;
  public aliquota;
  public correcao;
  public teto;
  public fator;
  public sigla;
  public nome;

}
