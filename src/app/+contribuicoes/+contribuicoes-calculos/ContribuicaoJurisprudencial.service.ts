import { ControllerService } from '../../contracts/Controller.service';

import { ContribuicaoJurisprudencial } from './ContribuicaoJurisprudencial.model';

export class ContribuicaoJurisprudencialService extends ControllerService {

  public model = ContribuicaoJurisprudencial;
  public name = 'contribuicaoJurisprudencial';
  public list: ContribuicaoJurisprudencial[] = this.store.data['contribuicaoJurisprudencial'];

}
