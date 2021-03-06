import { ControllerService } from '../../contracts/Controller.service';

import { ExpectativaVida } from './ExpectativaVida.model';
import * as moment from 'moment';

export class ExpectativaVidaService extends ControllerService {

  public model = ExpectativaVida;
  public name = 'expectativaVida';
  public list: ExpectativaVida[] = this.store.data['expectativaVida'];

  public getByIdade(idadeFracionada) {
    if (idadeFracionada > 80) {
      idadeFracionada = 80;
    }
    return new Promise((resolve, reject) => {
      let parameters = ['idade', idadeFracionada, '', ''];
      // if (this.list.length == 0) {
      this.getWithParameters(parameters).then(() => {
        let list = this.list;
        resolve(list);
      }).catch(error => {
        console.error(error);
        reject(error);
      })
      // 	} else {
      // let list = this.list;
      // 		resolve(list);
      // 	}
    });
  }


  public getByAnoIdade(idadeFracionada, ano) {
    if (idadeFracionada > 80) {
      idadeFracionada = 80;
    }
    return new Promise((resolve, reject) => {
      const parameters = [
          'idade', idadeFracionada,
          'ano', ano
        ];
      this.getWithParameters(parameters).then(() => {
        const list = this.list;
        resolve(list);
      }).catch(error => {
        console.error(error);
        reject(error);
      })
    });
  }

  public getByDates(dataInicio, dataFim) {
    // console.log(dataInicio, dataFim)
    for (let expectativa of this.list) {
      let startDate = (expectativa.data_inicial) ? moment(expectativa.data_inicial) : null;
      let endDate = (expectativa.data_final) ? moment(expectativa.data_final) : null;
      if (dataFim == null) {
        if (startDate.isSameOrBefore(dataInicio) && endDate.isSameOrAfter(dataInicio)) {
          return expectativa.valor;
        }
      } else {
        if (startDate.isSameOrBefore(dataInicio) && endDate.isSameOrAfter(dataFim)) {
          return expectativa.valor;
        }
      }
    }
    return -1;
  }

  public getByProperties(dataInicio, dataFim) {
    let resultado = {};
    if (dataInicio != null) {
      if (dataFim != null) {
        //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e startDate <= dataInicio e endData >= dataFim
        resultado = this.list.find((expectativa) => {
          return moment(expectativa.data_inicial).isSameOrBefore(dataInicio) && moment(expectativa.data_final).isSameOrAfter(dataFim);
        });
      } else {
        //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e  startDate <= dataInicio e endData == null;
        resultado = this.list.find((expectativa) => {
          return moment(expectativa.data_inicial).isSameOrBefore(dataInicio) && expectativa.data_final == null;
        });
        if (!resultado) {
          resultado = this.list.find((expectativa) => {
            return moment(expectativa.data_inicial).isSameOrBefore(dataInicio) && moment(expectativa.data_final).isSameOrAfter(dataInicio);
          });
        }
      }
    } else {
      if (dataFim != null) {
        //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e startDate == null e endData >= dataFim
        resultado = this.list.find((expectativa) => {
          return expectativa.data_inicial == null && moment(expectativa.data_final).isSameOrAfter(dataFim);
        });
      } else {
        //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e  startDate == null e endData == null;
        resultado = this.list.find((expectativa) => {
          return expectativa.data_inicial == null && expectativa.data_final == null;
        });
      }
    }

    if (resultado) {
      return resultado['valor'];
    } else {
      return -1
    }

  }

  // public getPlanejamento(dataInicio, dataFim,sexo){
  //   let resultado = {};
  //   if (dataInicio != null){
  //     if (dataFim != null) {
  //        //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e startDate <= dataInicio e endData >= dataFim
  //       resultado = this.list.find((expectativa) => {
  //         return moment(expectativa.data_inicial).isSameOrBefore(dataInicio) && moment(expectativa.data_final).isSameOrAfter(dataFim);
  //       });
  //     } else {
  //       //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e  startDate <= dataInicio e endData == null;
  //       resultado = this.list.find((expectativa) => {
  //         return moment(expectativa.data_inicial).isSameOrBefore(dataInicio) && expectativa.data_final == null;
  //       });
  //       if(!resultado){
  //         resultado = this.list.find((expectativa) => {
  //           return moment(expectativa.data_inicial).isSameOrBefore(dataInicio) && moment(expectativa.data_final).isSameOrAfter(dataInicio);
  //         });
  //       }
  //     }
  //   } else {
  //     if (dataFim != null) {
  //       //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e startDate == null e endData >= dataFim
  //       resultado = this.list.find((expectativa) => {
  //         return expectativa.data_inicial == null && moment(expectativa.data_final).isSameOrAfter(dataFim);
  //       });
  //     } else {
  //       //Carregar do BD na tabela ExpectativaVida onde age == idadeFracionada e  startDate == null e endData == null;
  //       resultado = this.list.find((expectativa) => {
  //         return expectativa.data_inicial == null && expectativa.data_final == null;
  //       });
  //     }
  //   }

  //   if(resultado){
  //      if(sexo === 'm'){        
  //       return resultado['m'];
  //      }
  //      return resultado['f'];

  //   }else{
  //     return -1
  //   }

  // }

  public getByAno(ano) {
    for (let expectativa of this.list) {
      if (expectativa.ano == ano) {
        return expectativa.valor;
      }
    }
    return -1;
  }
}