
export class Devidos {

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
  public chkDemandasJudiciais;
  public calcularAbono13UltimoMes;
  public SBSemLimitacao;
  public SBSemLimitacaoAliquota;
  public numDependentes;
  public manterPercentualSMEsperado;
  public parcRecEsperado;
  public dataParcRecEsperado;
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
    chkDemandasJudiciais,
    calcularAbono13UltimoMes,
    SBSemLimitacao,
    SBSemLimitacaoAliquota,
    numDependentes,
    manterPercentualSMEsperado,
    parcRecEsperado,
    dataParcRecEsperado,
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
    this.chkDemandasJudiciais = chkDemandasJudiciais;
    this.calcularAbono13UltimoMes = calcularAbono13UltimoMes;
    this.SBSemLimitacao = SBSemLimitacao;
    this.SBSemLimitacaoAliquota = SBSemLimitacaoAliquota;
    this.numDependentes = numDependentes;
    this.manterPercentualSMEsperado = manterPercentualSMEsperado;
    this.parcRecEsperado = parcRecEsperado;
    this.dataParcRecEsperado = dataParcRecEsperado;
  }


}
