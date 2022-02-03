
export class Recebidos {

  public id;
  public especie;
  public numeroBeneficio;
  public dib;
  public dip;
  public cessacao;
  public dibAnterior;
  public rmi;
  public rmiBuracoNegro;
  public irt;
  public reajusteMinimo;
  public dataAdicional25;
  public abono13Ultimo;
  public manterPercentualSMConcedido;
  public parcRecConcedido;
  public dataParcRecConcedido;
  // public action = `
  //         <div class="btn-group">
  //         <button type="button" class="btn btn-xs btn-warning" (click)='getupdateRecebido(${this.id})' title='Editar' >
  //           <i class='fa fa-edit fa-1-7x'></i>
  //         </button>
  //         <button type="button" class="btn btn-xs btn-danger" (click)='deletarRecebido(${this.id})' title='Excluir'>
  //           <i class='fa fa-times fa-1-7x'></i>
  //         </button>
  //       </div>
  //   `;


  constructor(
    id,
    especie,
    numeroBeneficio,
    dib,
    dip,
    cessacao,
    dibAnterior,
    rmi,
    rmiBuracoNegro,
    irt,
    reajusteMinimo,
    dataAdicional25,
    abono13Ultimo,
    manterPercentualSMConcedido,
    parcRecConcedido,
    dataParcRecConcedido,
  ) {
    this.id = id;
    this.especie = especie;
    this.numeroBeneficio = numeroBeneficio;
    this.dib = dib;
    this.dip = dip;
    this.cessacao = cessacao;
    this.dibAnterior = dibAnterior;
    this.rmi = rmi;
    this.rmiBuracoNegro = rmiBuracoNegro;
    this.irt = irt;
    this.reajusteMinimo = reajusteMinimo;
    this.dataAdicional25 = dataAdicional25;
    this.abono13Ultimo = abono13Ultimo;
    this.manterPercentualSMConcedido = manterPercentualSMConcedido;
    this.parcRecConcedido = parcRecConcedido;
    this.dataParcRecConcedido = dataParcRecConcedido;
  }


}
