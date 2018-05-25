import { ControllerService } from '../../contracts/Controller.service';

import { ContribuicaoComplementar } from './ContribuicaoComplementar.model';

export class ContribuicaoComplementarService extends ControllerService {

  public model = ContribuicaoComplementar;
  public name = 'contribuicaoComplementar';
  public list: ContribuicaoComplementar[] = this.store.data['contribuicaoComplementar'];

}
