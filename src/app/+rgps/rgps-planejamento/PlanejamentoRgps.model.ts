import { Model } from '../../contracts/Model';
import { environment } from 'environments/environment';

export class PlanejamentoRgps extends Model {

  static url = environment.apiUrl + 'planejamento';
  static form = {
    id: '',
    id_calculo: '',
    data_futura: '',
    valor_beneficio: '',
    aliquota: '',
    novo_rmi: '',
    nova_soma_contribuicoes: '',
    resultado_rmi_original: '',
    resultado_rmi_novo: '',
    especie: '',
    sc: '',
    sc_menor_minimo: '',
    sc_mm_considerar_carencia: '',
    sc_mm_considerar_tempo: '',
    sc_pendentes: '',
    sc_pendentes_mm: '',
    sc_count: '',
    sc_mm_ajustar: '',
  };

  public id;
  public id_calculo;
  public data_futura;
  public valor_beneficio;
  public aliquota;
  public novo_rmi;
  public nova_soma_contribuicoes;
  public resultado_rmi_original;
  public resultado_rmi_novo;
  public especie;
  public contribuicoes_pendentes_mm;
  public contribuicoes_pendentes;
  public sc;
  public sc_menor_minimo;
  public sc_mm_considerar_carencia;
  public sc_mm_considerar_tempo;
  public sc_pendentes;
  public sc_pendentes_mm;
  public sc_count;
  public sc_mm_ajustar;
  
  //   public actions = `
  //     <div class="btn-group">
  //       <button type="button" class="btn btn-xs btn-warning" (click)='updatePlananejamentoList(${this.id})' title='Editar Referência'>
  //         <i class='fa fa-edit fa-1-7x'></i>
  //       </button>
  //       <button type="button" class="btn btn-xs btn-danger" (click)='deletarPlananejamentoList(${this.id})' title='Excluir'>
  //         <i class='fa fa-times fa-1-7x'></i>
  //       </button>
  //     </div>
  //       `;


}