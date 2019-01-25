import { Model } from '../../contracts/Model';

export class AuthResponse extends Model {

  static url = 'http://codificar.ieprev.com.br/verificatoken';
  static form = {
    status: '',
    msg: '',
  };
  public status;
  public msg;
}