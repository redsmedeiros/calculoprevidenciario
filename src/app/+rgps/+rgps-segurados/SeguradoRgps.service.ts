import { ControllerService } from '../../contracts/Controller.service';

import { SeguradoRgps } from './SeguradoRgps.model';

export class SeguradoService extends ControllerService {

  public model = SeguradoRgps;
  public name = 'seguradosRgps';
  public list: SeguradoRgps[] = this.store.data['seguradosRgps'];

}
