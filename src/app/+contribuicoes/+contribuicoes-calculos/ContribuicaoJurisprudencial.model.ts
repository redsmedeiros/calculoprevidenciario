import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class ContribuicaoJurisprudencial extends Model {

  static url = environment.apiUrl + 'contribuicoes/calculos/jurisprudencial';
  static form = {
    id: '',
    id_segurado: '',
    inicio_atraso: '',
    final_atraso: '',
    inicio_atraso2: '',
    final_atraso2: '',
    valor_acumulado: '',
    data_calculo: ''
  };

  public id: number;
  public id_segurado: number;
  public inicio_atraso;
  public final_atraso;
  public valor_acumulado;
  public inicio_atraso2;
  public final_atraso2;
  // public actions = `
  //   <a href="#/contribuicoes/${this.id_segurado}/novo-jurisprudencial/${this.id}" id="testee" class="action-edit"> <i title="Editar" class='fa fa-edit'></i> </a>
  //   <a href="#/contribuicoes/contribuicoes-calculos/jurisprudencial/${this.id_segurado}/${this.id}/destroy" class="action-edit"> <i title="Remover" class='fa fa-times'></i> </a>
  //   <a href="#/contribuicoes/${this.id_segurado}/contribuicoes-resultados/${this.id}" class="action-edit"> <i title="Ver Cálculo" class="fa fa-search"></i> </a>
  // `;

  public actions = `
 <div class="btn-group ">
    <a href="#/contribuicoes/${this.id_segurado}/contribuicoes-resultados/${this.id}" class="btn btn-primary btn-xs" title=""Ver Cálculo">&nbsp;&nbsp;<i class="fa fa-calculator fa-1-7x"></i>&nbsp;&nbsp;</a>
    <a href="#/contribuicoes/${this.id_segurado}/novo-jurisprudencial/${this.id}" id="testee" class="btn btn-warning btn-xs"  title="Editar o Segurado">&nbsp;&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;&nbsp;</a>
    <a href="#/contribuicoes/contribuicoes-calculos/jurisprudencial/${this.id_segurado}/${this.id}/destroy" class="btn btn-danger btn-xs" title="Deletar o Segurado">&nbsp;&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;&nbsp;</a>
  </div>
`;


  // Definir e padronizar front e back-end Models
  public data_calculo = this['created_at'];
}
