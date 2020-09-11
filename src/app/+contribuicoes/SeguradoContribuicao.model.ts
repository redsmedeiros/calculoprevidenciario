import { Model } from '../contracts/Model';
import { environment } from '../../environments/environment';

export class SeguradoContribuicao extends Model {

  static url = environment.apiUrl + 'contribuicoes/segurados';
  static form = {
    id: '',
    nome: '',
    id_documento: '',
    user_id: '',
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
  public user_id;
  public numero_documento;
  public data_nascimento;
  public sexo;
  public salario;
  public data_filiacao;
  public data_segurado;
  public funcao;
  public data_entrada_servico_publico;
  // public actions = `
  //   <a href="#/contribuicoes/contribuicoes-segurados/${this.id}/editar" id="testee" class="action-edit"> <i title="Editar" class="fa fa-edit"></i> </a>
  //   <a href="#/contribuicoes/contribuicoes-segurados/${this.id}/destroy" class="action-edit"> <i title="Remover" class="fa fa-times"></i> </a>
  //   <a href="#/contribuicoes/contribuicoes-calculos/${this.id}" class="action-edit"> <i title="Ver cálculos" class="fa fa-calculator"></i> </a>
  // `;


  public actions = `
  <div class="btn-group ">
    <a href="#/contribuicoes/contribuicoes-calculos/${this.id}" class="btn btn-primary btn-xs" title="Ver cálculos">&nbsp;&nbsp;<i class="fa fa-list fa-1-7x"></i>&nbsp;&nbsp;</a>
    <a href="#/contribuicoes/contribuicoes-segurados/${this.id}/editar" id="testee" class="btn btn-warning btn-xs"  title="Editar">&nbsp;&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;&nbsp;</a>
    <a href="#/contribuicoes/contribuicoes-segurados/${this.id}/destroy" class="btn btn-danger btn-xs" title="Deletar">&nbsp;&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;&nbsp;</a>
  </div>  
`;

  // Definir e padronizar front e back-end Models
  public tipo = this['funcao'];
  public documento = this['numero_documento'];
  public data_cadastro = this['created_at'];
}
