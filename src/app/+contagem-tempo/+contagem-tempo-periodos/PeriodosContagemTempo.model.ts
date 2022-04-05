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
    sc: '',
    sc_menor_minimo: '',
    sc_mm_considerar_carencia: '',
    sc_mm_considerar_tempo: '',
    sc_pendentes: '',
    sc_pendentes_mm: '',
    sc_count: '',
    sc_mm_ajustar: '',
    converter_especial_apos_ec103: '',
    created_at: '',
    updated_at: '',
    concomitantes: '',
    secundario: '',
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
  public sc;
  public sc_menor_minimo;
  public sc_mm_considerar_carencia;
  public sc_mm_considerar_tempo;
  public sc_pendentes;
  public sc_pendentes_mm;
  public sc_count;
  public sc_mm_ajustar;
  public converter_especial_apos_ec103;
  public concomitantes;
  public secundario;
  public created_at;
  public updated_at;

  // public actions = `
  //   <div class="btn-group">
  //     <button type="button" class="btn btn-xs btn-warning" (click)='updatePeriodo(${this.id})' title='Editar Referência'>
  //       <i class='fa fa-edit fa-1-7x'></i>
  //     </button>
  //     <button type="button" class="btn btn-xs btn-danger" (click)='deletarPeriodo(${this.id})' title='Excluir'>
  //       <i class='fa fa-times fa-1-7x'></i>
  //     </button>
  //   </div>
  //     `;

}
