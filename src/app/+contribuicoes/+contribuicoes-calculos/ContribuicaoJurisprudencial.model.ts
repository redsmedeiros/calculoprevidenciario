import { Model } from '../../contracts/Model';

export class ContribuicaoJurisprudencial extends Model {

  static url = 'http://localhost:8000/contribuicoes/calculos/jurisprudencial';
  static form = {
    id: '',
    id_segurado: '',
    inicio_atraso: '',
    final_atraso: '',
    valor_acumulado: '',
    data_calculo: ''
  };

  public id: number;
  public id_segurado: number;
  public inicio_atraso;
  public final_atraso;
  public valor_acumulado;
  public actions = `
    <a href="#/contribuicoes/contribuicoes-segurados/${this.id}/editar" id="testee" class="action-edit"> <i class="fa fa-edit"></i> </a>
    <a href="#/contribuicoes/contribuicoes-segurados/${this.id}/destroy" class="action-edit"> <i class="fa fa-times"></i> </a>
    <a href="#/contribuicoes/contribuicoes-calculos/${this.id}" class="action-edit"> <i class="fa fa-calculator"></i> </a>
  `;

  // Definir e padronizar front e back-end Models
  public data_calculo = this['created_at'];
}