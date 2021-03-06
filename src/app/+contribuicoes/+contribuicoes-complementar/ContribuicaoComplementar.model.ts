import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class ContribuicaoComplementar extends Model {

  static url = environment.apiUrl + 'contribuicoes/calculos/complementar';
  static form = {
    id: '',
    id_segurado: 0,
    inicio_atraso: '',
    final_atraso: '',
    contribuicao_basica_inicial: '',
    contribuicao_basica_final: '',
    salario: '',
    total_contribuicao: 0,
    numero_contribuicoes: 0,
    media_salarial: 0,
    contribuicao_calculada: 0,
    data_calculo: '',
    chk_juros: '',
    contribuicoes: '',
    atualizar_ate: ''
  };

  public id;
  public id_segurado: number;
  public inicio_atraso;
  public final_atraso;
  public contribuicao_basica_inicial;
  public contribuicao_basica_final;
  public salario;
  public total_contribuicao: number;
  public numero_contribuicoes: number;
  public media_salarial: number;
  public contribuicao_calculada: number;
  public data_calculo;
  public chk_juros;
  public contribuicoes;
  public atualizar_ate;
  public updated_at;
  // public actions = `
  //   <a href="#/contribuicoes/contribuicoes-calculos/${this.id_segurado}/${this.id}/edit" id="testee" class="action-edit"> <i title="Editar" class='fa fa-edit'></i> </a>
  //   <a href="#/contribuicoes/contribuicoes-calculos/${this.id_segurado}/${this.id}/destroy" class="action-edit"> <i title="Remover" class='fa fa-times'></i> </a>
  //   <a href="#/contribuicoes/${this.id_segurado}/contribuicoes-resultados-complementar/${this.id}" class="action-edit"> <i title="Ver Cálculo" class="fa fa-search"></i> </a>
  // `;

  public actions = `
  <div class="btn-group ">
    <a href="#/contribuicoes/${this.id_segurado}/contribuicoes-resultados-complementar/${this.id}" class="btn btn-primary btn-xs" title="Ver Cálculo">&nbsp;&nbsp;<i class="fa fa-calculator fa-1-7x"></i>&nbsp;&nbsp;</a>
    <a href="#/contribuicoes/contribuicoes-calculos/${this.id_segurado}/${this.id}/edit" id="testee" class="btn btn-warning btn-xs"  title="Editar">&nbsp;&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;&nbsp;</a>
    <a href="#/contribuicoes/contribuicoes-calculos/${this.id_segurado}/${this.id}/destroy" class="btn btn-danger btn-xs" title="Deletar">&nbsp;&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;&nbsp;</a>
  </div>

  `;

  // Definir e padronizar front e back-end Models
  //public data_calculo = this['created_at'];
}
