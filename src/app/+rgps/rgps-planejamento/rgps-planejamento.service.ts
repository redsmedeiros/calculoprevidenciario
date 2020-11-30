import { ControllerService } from '../../contracts/Controller.service';

import { PlanejamentoRgps } from "./PlanejamentoRgps.model";

export class RgpsPlanejamentoService extends ControllerService {
  public model = PlanejamentoRgps;
  public name = 'planejamentoRgps';
  public list: PlanejamentoRgps[] = this.store.data['planejamentoRgps'];

  public getPlanejamentoByCalculoId(id_calculo) {
    return new Promise((resolve, reject) => {
      const parameters = ['id_calculo', id_calculo];
      this.getWithParameters(parameters)
        .then(() => {
          let list = this.list;
          resolve(list);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }
}
