import { ControllerService } from '../../contracts/Controller.service';
import { CalculoContagemTempo } from './CalculoContagemTempo.model';

export class CalculoContagemTempoService extends ControllerService {

  public model = CalculoContagemTempo;
  public name = 'calculoContagemTempo';
  public list: CalculoContagemTempo[] = this.store.data['calculoContagemTempo'];
}
