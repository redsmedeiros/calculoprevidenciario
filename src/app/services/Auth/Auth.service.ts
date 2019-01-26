import { ControllerService } from '../../contracts/Controller.service';
import axios from 'axios';
import { AuthResponse } from './AuthResponse.model';

export class Auth extends ControllerService {

  public model = AuthResponse;
  public name = 'authResponse';
  public list: AuthResponse[] = this.store.data['authResponse'];


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

}