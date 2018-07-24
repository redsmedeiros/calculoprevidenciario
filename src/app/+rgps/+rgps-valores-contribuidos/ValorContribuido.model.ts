import { Model } from '../../contracts/Model';

export class ValorContribuido extends Model {

  static url = 'http://localhost:8000/rgps/calculos/valorescontribuidos';
  static form = {
  	id : '',
    id_calculo: '',
    data: '',
    tipo: '',
    valor: '',
  };
   public id ;
   public id_calculo;
   public data;
   public tipo;
   public valor;
}
