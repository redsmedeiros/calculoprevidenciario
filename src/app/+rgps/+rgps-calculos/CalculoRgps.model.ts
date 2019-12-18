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
    contribuicao_primaria_19: '',
	  contribuicao_secundaria_98: '',
	  contribuicao_secundaria_99: '',
	  contribuicao_secundaria_atual: '',
	  data_calculo: '',
	  valor_beneficio: '',
	  soma_contribuicao: '',
	  carencia: '',
    grupo_dos_12: '',
    num_dependentes: '',
    depedente_invalido: '',
    obito_decorrencia_trabalho: '',
    ultimo_beneficio: '',
    sexo_instituidor: '',
    divisor_minimo: '',
    pbc_completo: '',
  };
  
   public id ;
   public id_segurado;
   public tipo_seguro;
   public tipo_aposentadoria;
   public data_pedido_beneficio;
   public contribuicao_primaria_98;
   public contribuicao_primaria_99;
   public contribuicao_primaria_atual;
   public contribuicao_primaria_19;
   public contribuicao_secundaria_98;
   public contribuicao_secundaria_99;
   public contribuicao_secundaria_atual;
   public data_calculo;
   public valor_beneficio;
   public soma_contribuicao;
   public carencia;
   public grupo_dos_12;
   public num_dependentes;
   public depedente_invalido;
   public obito_decorrencia_trabalho;
   public ultimo_beneficio;
   public sexo_instituidor;
   public divisor_minimo;
   public pbc_completo;

  //  public actions = `
  //   <a href='#/rgps/rgps-calculos/${this.id_segurado}/${this.id}/edit' id='testee' class='action-edit'> <i title="Editar" class='fa fa-edit'></i> </a> 
  //   <a href='#/rgps/rgps-calculos/${this.id_segurado}/${this.id}/destroy' class='action-delete'> <i title="Remover" class='fa fa-times'></i> </a> 
  //   <a href='#/rgps/rgps-valores-contribuidos/${this.id_segurado}/${this.id}/' class='action-contribut'> <i title="Inserir Valores de Contribuição" class='fa fa-money '></i> </a> 
  //   <a href='#/rgps/rgps-importacao-cnis/${this.id_segurado}/${this.id}/' class='action-import'> <i title="Importar Dados do CNIS" class='fa fa-arrow-down '></i> </a> 
  //   <a href='#/rgps/rgps-resultados/${this.id_segurado}/${this.id}/' class='action-calc'> <i title="Ver Cálculo" class='fa fa-calculator'></i> </a>
  // `;
  
  public actions = `
      <div class="btn-group">
        <a href="#/rgps/rgps-valores-contribuidos/${this.id_segurado}/${this.id}/" class="btn bg-color-blue txt-color-white btn-xs "  title="Inserir Valores de Contribuição">&nbsp;<i class="fa fa-money fa-1-7x"></i>&nbsp;</a>
        <a href="#/rgps/rgps-importacao-cnis/${this.id_segurado}/${this.id}/" class="btn bg-color-blueLight txt-color-white btn-xs"  title="Importar Dados do CNIS">&nbsp;<i class="fa fa-arrow-down fa-1-7x"></i>&nbsp;</a>
        <a href="#/rgps/rgps-resultados/${this.id_segurado}/${this.id}/" class="btn btn-primary btn-xs "title="Ver Cálculo">&nbsp;<i class="fa fa-calculator fa-1-7x"></i>&nbsp;</a>
        <a href="#/rgps/rgps-calculos/${this.id_segurado}/${this.id}/edit" id="testee" class="btn btn-warning btn-xs "  title="Editar o cálculo">&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;</a>
        <a href="#/rgps/rgps-calculos/${this.id_segurado}/${this.id}/destroy" class="btn btn-danger btn-xs " title="Remover este cálculo" >&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;</a>
      </div>
  `;
}
