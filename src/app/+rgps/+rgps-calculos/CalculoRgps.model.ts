import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class CalculoRgps extends Model {

  static url = environment.apiUrl + 'rgps/calculos';
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
   public data_calculo;
   public valor_beneficio;
   public soma_contribuicao;
   public carencia;
   public grupo_dos_12;
   public actions = `
    <a href='#/rgps/rgps-calculos/${this.id_segurado}/${this.id}/edit' id='testee' class='action-edit'> <i title="Editar" class='fa fa-edit'></i> </a> 
    <a href='#/rgps/rgps-calculos/${this.id_segurado}/${this.id}/destroy' class='action-delete'> <i title="Remover" class='fa fa-times'></i> </a> 
    <a href='#/rgps/rgps-valores-contribuidos/${this.id_segurado}/${this.id}/' class='action-contribut'> <i title="Inserir Valores de Contribuição" class='fa fa-money '></i> </a> 
    <a href='#/rgps/rgps-importacao-cnis/${this.id_segurado}/${this.id}/' class='action-import'> <i title="Importar Dados do CNIS" class='fa fa-arrow-down '></i> </a> 
    <a href='#/rgps/rgps-resultados/${this.id_segurado}/${this.id}/' class='action-calc'> <i title="Ver Cálculo" class='fa fa-calculator'></i> </a>
  `;
}
