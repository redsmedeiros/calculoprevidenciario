import { Model } from '../../contracts/Model';
import { environment } from 'environments/environment';
import * as moment from 'moment';

export class SeguradoContagemTempo extends Model {

  static url = environment.apiUrl + 'contagem-tempo/segurados';
  static form = {
    id: '',
    nome: '',
    user_id: '',
    id_documento: '',
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
  public user_id;
  public id_documento;
  public numero_documento;
  public data_nascimento;
  public sexo;
  public salario;
  public data_filiacao;
  public data_segurado;
  public funcao;
  public data_entrada_servico_publico;

  public actions = `
  <div class="btn-group">
    <a href="#/contagem-tempo/contagem-tempo-calculos/${this.id}" class="btn btn-primary btn-xs" title="Visualizar as simulações do segurado">&nbsp;&nbsp;<i class="fa fa-list fa-1-7x"></i>&nbsp;&nbsp;</a>
    <a href="#/contagem-tempo/contagem-tempo-segurados/${this.id}/editar" id="testee" class="btn btn-warning btn-xs"  title="Editar o Segurado">&nbsp;&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;&nbsp;</a>
    <a href="#/contagem-tempo/contagem-tempo-segurados/${this.id}/destroy" class="btn btn-danger btn-xs" title="Deletar o Segurado">&nbsp;&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;&nbsp;</a>
  </div>
`;


  // Definir e padronizar front e back-end Models
  public tipo = this['funcao'];
  public documento = this['numero_documento'];
  public data_cadastro = this['created_at'];


  public getDocumentType(id_documento) {
    switch (id_documento) {
      case 1:
        return 'PIS';
      case 2:
        return 'PASEP';
      case 3:
        return 'CPF';
      case 4:
        return 'NIT';
      case 5:
        return 'RG';
      default:
        return 'CPF'
    }
  }
  public getIdadeAtual(data_nascimento, type) {

    let inicio = moment(data_nascimento.split('/')[2]
      + '-' + data_nascimento.split('/')[1]
      + '-' + data_nascimento.split('/')[0]);

    let fim = moment();

    let idade = moment.duration(fim.diff(inicio));

    switch (type) {
      case 1:
        return idade.years() + ' anos  ' + idade.months() + ' meses  ' + idade.days() + ' dias.';
      case 2:
        return idade.years() + ' anos.';
      default:
        return ''
    }
  }
}
