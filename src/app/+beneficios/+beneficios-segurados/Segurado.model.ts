import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class Segurado extends Model {

  static url = environment.apiUrl + 'segurados';
  static form = {
    id: '',
    nome: '',
    id_documento: '',
    numero_documento: '',
    data_nascimento: '',
    documento: '',
    tipo: '',
    sexo: '',
    salario: '',
    data_filiacao: '',
    data_segurado: '',
    funcao: '',
    data_entrada_servico_publico: ''
  };

  public id: number;
  public nome;
  public id_documento;
  public numero_documento;
  public data_nascimento;
  public sexo;
  public salario;
  public data_filiacao;
  public data_segurado;
  public funcao;
  public data_entrada_servico_publico;
  public actions = `
    <a href="#/beneficios/beneficios-segurados/${this.id}/editar"  class="action-edit"> <i title="Editar" class="fa fa-edit"></i> </a>
    <a href="#/beneficios/beneficios-segurados/${this.id}/destroy" class="action-edit"> <i title="Remover" class="fa fa-times"></i> </a>
    <a href="#/beneficios/beneficios-calculos/${this.id}" class="action-edit"> <i title="Ver cálculos" class="fa fa-calculator"></i> </a>
  `;

  // Definir e padronizar front e back-end Models
  public tipo = this['funcao'];
  public documento = this['numero_documento'];
  public data_cadastro = this['created_at'];
}
