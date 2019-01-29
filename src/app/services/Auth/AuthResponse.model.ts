import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';
export class AuthResponse extends Model {

  static url = environment.authUrl;
  static form = {
    status: '',
    msg: '',
  };
  public status;
  public msg;
}