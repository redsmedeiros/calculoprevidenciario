import { ControllerService } from '../../contracts/Controller.service';

import { Segurado } from './Segurado.model';

export class SeguradoService extends ControllerService {

  public model = Segurado;
  public name = 'segurados';
  public list: Segurado[] = this.store.data['segurados'];

}
