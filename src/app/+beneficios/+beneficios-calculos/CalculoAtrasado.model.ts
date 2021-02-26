import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class CalculoAtrasado extends Model {

  static url = environment.apiUrl + 'beneficios/calculos/atrasados';
  static form = {
    id: '',
    id_segurado: '',
    data_calculo_pedido: '',
    data_acao_judicial: '',
    data_citacao_reu: '',
    data_pedido_beneficio: '',
    valor_beneficio_concedido: '',
    valor_beneficio_concedido_revisao: '',
    valor_beneficio_esperado: '',
    valor_beneficio_esperado_revisao: '',
    beneficio_nao_concedido: '',
    taxa_ajuste_maxima_concedida: '',
    taxa_ajuste_maxima_esperada: '',
    data_cessacao: '',
    previo_interesse: '',
    data_anterior_pedido_beneficio: '',
    percentual_taxa_advogado: '',
    taxa_advogado_inicio: '',
    taxa_advogado_final: '',
    taxa_advogado_inicio_sucumbencia: '',
    taxa_advogado_final_sucumbencia: '',
    taxa_advogado_aplicacao_sobre: '',
    maturidade: '',
    previo_interesse_2003: '',
    pos_interesse_2003: '',
    pos_interesse_2009: '',
    tipo_aposentadoria: '',
    data_calculo: '',
    tipo_correcao: '',
    aplicar_ajuste_maximo_98_2003: '',
    acordo_pedido: '',
    nao_aplicar_ajuste_maximo_98_2003: '',
    data_pedido_beneficio_esperado: '',
    previa_data_pedido_beneficio_esperado: '',
    data_prevista_cessacao: '',
    tipo_aposentadoria_recebida: '',
    concedido_anterior_dib: '',
    esperado_anterior: '',
    nao_usar_deflacao: '',
    usar_indice_99_04: '',
    aplicar_juros_poupanca: '',
    usar_mesma_dib: '',
    taxa_advogado_valor_fixo: '',
    taxa_advogado_perc_100000_SM: '',
    taxa_advogado_perc_20000_100000_SM: '',
    taxa_advogado_perc_2000_20000_SM: '',
    taxa_advogado_perc_200_2000_SM: '',
    taxa_advogado_perc_ate_200_SM: '',
    taxa_advogado_aplicar_CPCArt85: '',
    nao_aplicar_juros_sobre_negativo: '',
    competencia_inicio_juros: '',
    nao_aplicar_sm_beneficio_concedido: '',
    nao_aplicar_sm_beneficio_esperado: '',
    numero_processo: '',
    afastar_prescricao: '',
    calcular_abono_13_ultimo_mes: '',
    numero_beneficio_devido: '',
    numero_beneficio_recebido: '',
    num_dependentes: '',
    dip_valores_devidos: '',
    list_recebidos: '',
    list_devidos: '',
    list_acrescimos_deducoes: '',
    data_adicional_25: '',
    limit_60_sc: '',
    rra_sem_juros: '',
  };

  public id: number;
  public id_segurado
  public data_calculo_pedido
  public data_acao_judicial
  public data_citacao_reu
  public data_pedido_beneficio;
  public valor_beneficio_concedido;
  public valor_beneficio_concedido_revisao;
  public valor_beneficio_esperado;
  public valor_beneficio_esperado_revisao;
  public beneficio_nao_concedido;
  public taxa_ajuste_maxima_concedida;
  public taxa_ajuste_maxima_esperada;
  public data_cessacao;
  public previo_interesse;
  public data_anterior_pedido_beneficio;
  public percentual_taxa_advogado;
  public taxa_advogado_inicio;
  public taxa_advogado_final;
  public taxa_advogado_inicio_sucumbencia;
  public taxa_advogado_final_sucumbencia;
  public taxa_advogado_aplicacao_sobre;
  public maturidade;
  public previo_interesse_2003;
  public pos_interesse_2003;
  public pos_interesse_2009;
  public tipo_aposentadoria;
  public data_calculo;
  public tipo_correcao;
  public aplicar_ajuste_maximo_98_2003;
  public acordo_pedido;
  public nao_aplicar_ajuste_maximo_98_2003;
  public data_pedido_beneficio_esperado;
  public previa_data_pedido_beneficio_esperado;
  public data_prevista_cessacao;
  public tipo_aposentadoria_recebida;
  public concedido_anterior_dib;
  public esperado_anterior;
  public nao_usar_deflacao;
  public usar_indice_99_04;
  public aplicar_juros_poupanca;
  public usar_mesma_dib;
  public taxa_advogado_valor_fixo;
  public taxa_advogado_perc_100000_SM;
  public taxa_advogado_perc_20000_100000_SM;
  public taxa_advogado_perc_2000_20000_SM;
  public taxa_advogado_perc_200_2000_SM;
  public taxa_advogado_perc_ate_200_SM;
  public taxa_advogado_aplicar_CPCArt85;
  public nao_aplicar_juros_sobre_negativo;
  public competencia_inicio_juros;
  public nao_aplicar_sm_beneficio_concedido;
  public nao_aplicar_sm_beneficio_esperado;
  public numero_processo;
  public afastar_prescricao;
  public calcular_abono_13_ultimo_mes;
  public numero_beneficio_devido;
  public numero_beneficio_recebido;
  public num_dependentes;
  public dip_valores_devidos;
  public list_recebidos;
  public list_devidos;
  public list_acrescimos_deducoes;
  public data_adicional_25;
  public limit_60_sc;
  public rra_sem_juros;


  public actions = `
    <div class="btn-group">
      <a href="#/beneficios/beneficios-resultados/${this.id_segurado}/${this.id}" class="btn btn-primary btn-xs" title="Ver Cálculo">&nbsp;&nbsp;<i class="fa fa-calculator fa-1-7x"></i>&nbsp;&nbsp;</a>
      <a href="#/beneficios/beneficios-calculos/A/${this.id_segurado}/${this.id}/edit" id="testee" class="btn btn-warning btn-xs"  title="Editar">&nbsp;&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;&nbsp;</a>
      <a href="#/beneficios/beneficios-calculos/${this.id_segurado}/${this.id}/destroy" class="btn btn-danger btn-xs" title="Deletar">&nbsp;&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;&nbsp;</a>
    </div>
    `;

}


  // public actions = `
  //   <a href="#/beneficios/beneficios-calculos/A/${this.id_segurado}/${this.id}/edit" id="testee" class="action-edit">  <i title="Editar" class='fa fa-edit'></i> </a>
  //   <a href="#/beneficios/beneficios-calculos/${this.id_segurado}/${this.id}/destroy" class="action-edit"> <i title="Remover" class='fa fa-times'></i> </a>
  //   <a href="#/beneficios/beneficios-resultados/${this.id_segurado}/${this.id}" class="action-edit"> <i title="Ver Cálculo" class='fa fa-calculator'></i> </a>
  // `;
