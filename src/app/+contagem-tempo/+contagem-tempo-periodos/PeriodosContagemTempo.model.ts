import { Model } from '../../contracts/Model';
import { environment } from 'environments/environment';

export class PeriodosContagemTempo extends Model {

  static url = environment.apiUrl + 'contagem-tempo/periodos';
  static form = {
    id: '',
    id_contagem_tempo: '',
    empresa: '',
    data_inicio: '',
    data_termino: '',
    condicao_especial: '',
    fator_condicao_especial: '',
    carencia: '',
    licenca_premio_nao_usufruida: '',
    created_at: '',
    updated_at: '',
  };
  public id;
  public id_contagem_tempo;
  public empresa;
  public data_inicio;
  public data_termino;
  public condicao_especial;
  public fator_condicao_especial;
  public carencia;
  public licenca_premio_nao_usufruida;
  public created_at;
  public updated_at;
}
