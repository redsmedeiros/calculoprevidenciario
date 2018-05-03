import { ControllerService } from '../contracts/Controller.service';

import { SeguradoContribuicao } from './SeguradoContribuicao.model';

export class SeguradoService extends ControllerService {

  public model = SeguradoContribuicao;
  public name = 'seguradosContribuicao';
  public list: SeguradoContribuicao[] = this.store.data['seguradosContribuicao'];

}
