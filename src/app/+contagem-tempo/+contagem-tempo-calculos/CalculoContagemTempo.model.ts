import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class CalculoContagemTempo extends Model {

  static url = environment.apiUrl + 'contagem-tempo/calculos';
  static form = {
    id: '',
    id_segurado: '',
    total_dias: '',
    total_88: '',
    total_91: '',
    total_98: '',
    total_99: '',
    total_carencia: '',
    tipo_contribuicao: '',
    referencia_calculo: '',
    created_at: '',
    updated_at: '',
  };
  public id;
  public id_segurado;
  public total_dias;
  public total_88;
  public total_91;
  public total_98;
  public total_99;
  public carencia;
  public tipo_contribuicao;
  public referencia_calculo;
  public created_at;
  public updated_at;

  public actions = `
  <div class="btn-group btn-group-justified">
    <a href='#/contagem-tempo/contagem-tempo-periodos/${this.id_segurado}/${this.id}/' class='btn btn-primary btn-xs' title="Editar Períodos" data-placement="bottom" tooltip="Editar Períodos"> <i class='fa fa-calendar fa-1-7x'></i> </a> 
    <a href='#/contagem-tempo/contagem-tempo-resultados/${this.id_segurado}/${this.id}/' class='btn btn-success btn-xs'  title="Resultado"> <i class='fa fa-calculator fa-1-7x'></i> </a>
    <a href='#/contagem-tempo/contagem-tempo-calculos/${this.id_segurado}/${this.id}/editar' id='testee' class='btn btn-warning btn-xs' title='Editar Referência'> <i class='fa fa-edit fa-1-7x'></i></a> 
    <a href='#/contagem-tempo/contagem-tempo-calculos/${this.id_segurado}/${this.id}/destroy' class='btn btn-danger btn-xs'  title='Excluir'> <i class='fa fa-times fa-1-7x'></i></a> 
  </div>
    `;

}