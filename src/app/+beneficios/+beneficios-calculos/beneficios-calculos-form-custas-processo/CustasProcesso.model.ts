
export class CustasProcesso {

  public id: number;
  public descricao: string;
  public data: any;
  public valor: number;
  public aplicarJuros: boolean;

  constructor(
    id,
    descricao,
    data,
    valor,
    aplicarJuros,
  ) {

    this.id = id;
    this.descricao = descricao;
    this.data = data;
    this.valor = valor;
    this.aplicarJuros = aplicarJuros;

  }


}
