import { Model } from '../../contracts/Model';

export class AuthResponse extends Model {

 // static url = 'http://codificar.ieprev.com.br/verificatoken';
  static url = 'http://ieprev:8080/verificatoken';
  static form = {
    status: '',
    msg: '',
  };
  public status;
  public msg;
}