import { Model } from '../../contracts/Model';
import { environment } from 'environments/environment';

export class ImportadorCnisContribuicoes extends Model {

  static url = environment.apiUrl + 'cnis/contribuicoes';

}
