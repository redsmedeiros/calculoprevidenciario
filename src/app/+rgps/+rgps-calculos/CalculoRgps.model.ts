import { Model } from '../../contracts/Model';

export class CalculoRgps extends Model {

  static url = 'http://localhost:8000/rgps/calculos';
  static form = {
  	id : '',
    id_segurado: '',
	tipo_seguro: '',
	tipo_aposentadoria: '',
	data_pedido_beneficio: '',
	contribuicao_primaria_98: '',
	contribuicao_primaria_99: '',
	contribuicao_primaria_atual: '',
	contribuicao_secundaria_98: '',
	contribuicao_secundaria_99: '',
	contribuicao_secundaria_atual: '',
	data_calculo: '',
	valor_beneficio: '',
	soma_contribuicao: '',
	carencia: '',
	grupo_dos_12: ''
  };
   public id ;
   public id_segurado;
   public tipo_seguro;
   public tipo_aposentadoria;
   public data_pedido_beneficio;
   public contribuicao_primaria_98;
   public contribuicao_primaria_99;
   public contribuicao_primaria_atual;
   public contribuicao_secundaria_98;
   public contribuicao_secundaria_99;
   public contribuicao_secundaria_atual;
   public valor_beneficio;
   public soma_contribuicao;
   public carencia;
   public grupo_dos_12;
   public actions = `
    <a href="#/contribuicoes/contribuicoes-segurados/${this.id}/editar" id="testee" class="action-edit"> <i class="fa fa-edit"></i> </a>
    <a href="#/contribuicoes/contribuicoes-segurados/${this.id}/destroy" class="action-edit"> <i class="fa fa-times"></i> </a>
    <a href="#/contribuicoes/contribuicoes-calculos/${this.id}" class="action-edit"> <i class="fa fa-calculator"></i> </a>
  `;
}
