import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class CalculoRgps extends Model {

  static url = environment.apiUrl + 'rgps/calculos';
  static form = {
    id: '',
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
    calcular_descarte_apos_ec103: '',
    calcular_descarte_deficiente_ec103: '',
    media_12_ultimos: '',
    carencia_apos_ec103: '',
    somar_contribuicao_secundaria: '',
  };

  public id;
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
  public calcular_descarte_apos_ec103;
  public calcular_descarte_deficiente_ec103;
  public media_12_ultimos;
  public carencia_apos_ec103;
  public somar_contribuicao_secundaria;


  // public actions = `
  //     <div class="btn-group">
  //       <a href="#/rgps/rgps-valores-contribuidos/${this.id_segurado}/${this.id}/" class="btn bg-color-blue txt-color-white btn-xs "  title="Inserir Valores de Contribui????o">&nbsp;<i class="fa fa-money fa-1-7x"></i>&nbsp;</a>
  //       <a href="#/rgps/rgps-importacao-cnis/${this.id_segurado}/${this.id}/" class="btn bg-color-blueLight txt-color-white btn-xs"  title="Importar Dados do CNIS">&nbsp;<i class="fa fa-arrow-down fa-1-7x"></i>&nbsp;</a>
  //       <a href="#/rgps/rgps-resultados/${this.id_segurado}/${this.id}/" class="btn btn-success btn-xs "title="Calcular">&nbsp;<i class="fa fa-calculator fa-1-7x"></i>&nbsp;</a>
  //       <a href="#/rgps/rgps-resultados/${this.id_segurado}/${this.id}/pbc" class="btn bg-color-greenDark txt-color-white btn-xs "title="C??lculo na revis??o da vida toda">&nbsp;<i class="fa fa-calculator fa-1-7x"></i>&nbsp;</a>
  //       <a href="#/rgps/rgps-calculos/${this.id_segurado}/${this.id}/edit" id="testee" class="btn btn-warning btn-xs "  title="Editar o c??lculo">&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;</a>
  //       <a href="#/rgps/rgps-calculos/${this.id_segurado}/${this.id}/destroy" class="btn btn-danger btn-xs " title="Remover este c??lculo" >&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;</a>
  //     </div>
  // `;

  public actions = `
        <div class="btn-group">
          <a href="${window.location.origin}/#/rgps/rgps-resultados/${this.id_segurado}/${this.id}/" 
          class="btn btn-success btn-xs "title="Calcular RMI em uma nova Aba">&nbsp;<i class="fa fa-calculator fa-1-7x"></i>&nbsp;</a>
          <a href="${window.location.origin}/#/rgps/rgps-resultados/${this.id_segurado}/${this.id}/pbc" 
          class="btn bg-color-greenDark txt-color-white btn-xs "title="C??lcular na revis??o da vida toda em uma nova aba">&nbsp;<i class="fa fa-calculator fa-1-7x"></i>&nbsp;</a>
        </div>
      `;

//   public actions = `
//   <div class="btn-group">
//     <a href="#/rgps/rgps-resultados/${this.id_segurado}/${this.id}/" class="btn btn-success btn-xs "title="Calcular">&nbsp;<i class="fa fa-calculator fa-1-7x"></i>&nbsp;</a>
//     <a href="#/rgps/rgps-calculos/${this.id}"
//     class="btn btn-primary btn-xs" title="Visualizar as simula????es do segurado">&nbsp;&nbsp;<i class="fa fa-calculator fa-1-7x">
//     </i>&nbsp;&nbsp;</a>
//   </div>
// `;

}
