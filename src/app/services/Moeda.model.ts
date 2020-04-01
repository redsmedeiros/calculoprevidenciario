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
    fator_pbc: '',
    fator_pbc_inpc1085ortn: '',
    fator_pbc_inpc1088ortn: '',
    sigla: '',
    nome: '',
    tr: '',
    ipca: '',
    juros_selic_70: '',
    tr032015_ipcae: ''
  };

  public data_moeda;
  public salario_minimo;
  public aliquota;
  public cam;
  public teto;
  public fator;
  public fator_pbc;
  public fator_pbc_inpc1085ortn;
  public fator_pbc_inpc1088ortn;
  public sigla;
  public nome;
  public tr;
  public ipca;
  public juros_selic_70;
  public tr032015_ipcae;
}
