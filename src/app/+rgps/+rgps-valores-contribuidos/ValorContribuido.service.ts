import { ControllerService } from '../../contracts/Controller.service';

import { ValorContribuido } from './ValorContribuido.model';

export class ValorContribuidoService extends ControllerService {

  public model = ValorContribuido;
  public name = 'valorContribuido';
  public list: ValorContribuido[] = this.store.data['valorContribuido'];

}