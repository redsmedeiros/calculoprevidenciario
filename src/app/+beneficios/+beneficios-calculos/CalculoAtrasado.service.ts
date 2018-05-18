import { ControllerService } from '../../contracts/Controller.service';

import { CalculoAtrasado } from './CalculoAtrasado.model';

export class CalculoAtrasadoService extends ControllerService {

  public model = CalculoAtrasado;
  public name = 'calculoAtrasado';
  public list: CalculoAtrasado[] = this.store.data['calculoAtrasado'];

}
