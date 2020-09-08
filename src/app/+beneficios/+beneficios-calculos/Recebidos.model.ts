
export class Recebidos {

  public id;
  public especie;
  public numeroBeneficio;
  public dib;
  public cessacao;
  public dibAnterior;
  public rmi;
  public rmiBuracoNegro;
  public irt;
  public reajuesteMinimo;

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
      cessacao,
      dibAnterior,
      rmi,
      rmiBuracoNegro,
      irt,
      reajuesteMinimo
    ){
      this.id = id;
      this.especie = especie;
      this.numeroBeneficio = numeroBeneficio;
      this.dib = dib;
      this.cessacao = cessacao;
      this.dibAnterior = dibAnterior;
      this.rmi = rmi;
      this.rmiBuracoNegro = rmiBuracoNegro;
      this.irt = irt;
      this.reajuesteMinimo = reajuesteMinimo;
    }


}
