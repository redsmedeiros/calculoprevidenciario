import { ControllerService } from '../../contracts/Controller.service';
import axios from 'axios';
import * as sha1 from 'js-sha1';
import { AuthResponse } from './AuthResponse.model';

export class Auth extends ControllerService {

  public model = AuthResponse;
  public name = 'authResponse';
  public list: AuthResponse[] = this.store.data['authResponse'];
  private admin_token = sha1('13prev@c4lcAd!m1n');

  public authenticate(userId, userToken, product, type) {

    return new Promise((resolve, reject) => {
    	let parameters = {
    		user_id: userId,
    		user_token: userToken,
        product: product,
        type: type
    	};

      axios.get(AuthResponse.url, {params: parameters}).then(response => {
        resolve(response.data);
      }).catch(error => {
          console.error(error);
          reject(error);          
      })

    });
  }

  public isAdminAuth (){
    return this.admin_token == localStorage.getItem('admin_token')
  }

  public loginAdmin(pass){
    if(sha1(pass) == this.admin_token){
      localStorage.setItem('admin_token', sha1(pass));
      return true ;
    }
    else return false ;
  }

}