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
    resultado_rmi_original: '',
    resultado_rmi_novo: '',
  };

  public id;
  public id_calculo;
  public data_fatura;
  public valor_beneficio;
  public aliquota;
  public novo_rmi;
  public resultado_rmi_original;
  public resultado_rmi_novo;
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