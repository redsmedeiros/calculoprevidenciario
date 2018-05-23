import { Model } from '../../contracts/Model';

export class CalculoAtrasado extends Model {

  static url = 'http://localhost:8000/beneficios/calculos/atrasados';
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
    maturidade: '',
    previo_interesse_2003: '',
    pos_interesse_2003: '',
    pos_interesse_2009: '',
    tipo_aposentadoria: '',
    data_calculo: '',
    aplicar_ajuste_maximo_98_2003: '',
    acordo_pedido: '',
    nao_aplicar_ajuste_maximo_98_2003: '',
    data_pedido_beneficio_esperado: '',
    previa_data_pedido_beneficio_esperado: '',
    data_prevista_cessacao: '',
    tipo_aposentadoria_recebida: '',
    concedido_anterior_dib: '',
    esperado_anterior: ''
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
  public maturidade;
  public previo_interesse_2003;
  public pos_interesse_2003;
  public pos_interesse_2009;
  public tipo_aposentadoria;
  public data_calculo;
  public aplicar_ajuste_maximo_98_2003;
  public acordo_pedido;
  public nao_aplicar_ajuste_maximo_98_2003;
  public data_pedido_beneficio_esperado;
  public previa_data_pedido_beneficio_esperado;
  public data_prevista_cessacao;
  public tipo_aposentadoria_recebida;
  public concedido_anterior_dib;
  public esperado_anterior;

  public actions = `
    <a href="#/beneficios/beneficios-calculos/A/${this.id_segurado}/${this.id}/edit" id="testee" class="action-edit"> <i class="fa fa-edit"></i> </a>
    <a href="#/beneficios/beneficios-calculos/${this.id_segurado}/${this.id}/destroy" class="action-edit"> <i class="fa fa-times"></i> </a>
    <a href="#/beneficios/novo-calculo/A/${this.id_segurado}/${this.id}" class="action-edit"> <i class="fa fa-calculator"></i> </a>
  `;

}
