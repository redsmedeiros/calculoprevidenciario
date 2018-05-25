import { Model } from '../../contracts/Model';

export class ContribuicaoComplementar extends Model {

  static url = 'http://localhost:8000/contribuicoes/calculos/complementar';
  static form = {
  	id: '',
  	id_segurado: '',
	inicio_atraso: '',
	final_atraso: '',
	contribuicao_basica_inicial: '',
	contribuicao_basica_final: '',
	salario: '',
	total_contribuicao: '',
	numero_contribuicoes: '',
	media_salarial: '',
	contribuicao_calculada: '',
	data_calculo: ''
  };

  public id: number;
  public id_segurado: number;
  public inicio_atraso;
  public final_atraso;
  public contribuicao_basica_inicial;
  public contribuicao_basica_final;
  public salario;
  public total_contribuicao;
  public numero_contribuicoes;
  public media_salarial;
  public contribuicao_calculada;
  public data_calculo;
  public actions = `
    <a href="#/contribuicoes/${this.id_segurado}/novo-jurisprudencial/${this.id}" id="testee" class="action-edit"> <i class="fa fa-edit"></i> </a>
    <a href="#/contribuicoes/contribuicoes-calculos/${this.id_segurado}/${this.id}/destroy" class="action-edit"> <i class="fa fa-times"></i> </a>
    <a href="#/contribuicoes/contribuicoes-calculos/${this.id}" class="action-edit"> <i class="fa fa-calculator"></i> </a>
  `;

  // Definir e padronizar front e back-end Models
  //public data_calculo = this['created_at'];
}
