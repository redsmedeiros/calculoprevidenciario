import { ImportadorCnisContribuicoes } from './importador-cnis-contribuicoes.model';
import { ControllerService } from '../../contracts/Controller.service';

export class ImportadorCnisContribuicoesService extends ControllerService {

	public model = ImportadorCnisContribuicoes;
	public name = 'importadorCnisContribuicoes';
	public list: ImportadorCnisContribuicoes[] = this.store.data['importadorCnisContribuicoes'];

}