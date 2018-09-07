import { ControllerService } from '../../contracts/Controller.service';

import { CalculoRgps } from './CalculoRgps.model';

export class CalculoRgpsService extends ControllerService {

  public model = CalculoRgps;
  public name = 'calculoRgps';
  public list: CalculoRgps[] = this.store.data['calculoRgps'];

}