import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class ValorContribuido extends Model {

  static url = environment.apiUrl + 'rgps/calculos/valorescontribuidos';
  static form = {
  	id : '',
    id_calculo: '',
    data: '',
    tipo: '',
    valor: '',
    id_segurado: '',
  };
   public id ;
   public id_calculo;
   public data;
   public tipo;
   public valor;
   public id_segurado;
}
