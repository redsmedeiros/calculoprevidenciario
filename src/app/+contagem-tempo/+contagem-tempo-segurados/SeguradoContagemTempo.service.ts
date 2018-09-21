
import { ControllerService } from '../../contracts/Controller.service';
import { SeguradoContagemTempo } from './SeguradoContagemTempo.model';




export class SeguradoService extends ControllerService {

  public model = SeguradoContagemTempo;
  public name = 'seguradoContagemTempo';
  public list: SeguradoContagemTempo[] = this.store.data['seguradoContagemTempo'];
}


