import { Injectable } from '@angular/core';

import { City } from './../../models/City.model';
import { State } from './../../models/State.model';
import { Admin } from './../../models/Admin.model';
import { Country } from './../../models/Country.model';
import { Ngo } from '../../models/Ngo.model';
import { StrategicGoal } from '../../models/StrategicGoal.model';
import { AreaOfWork } from '../../models/AreaOfWork.model';
import { Company } from '../../models/Company.model';
import { Manager } from '../../models/Manager.model';
import { Project } from '../../models/Project.model';
import { BusinessUnit } from '../../models/BusinessUnit.model';
import { Session } from '../../models/Session.model';
import { Partner } from '../../models/Partner.model';
import { Segurado } from '../+beneficios/+beneficios-segurados/Segurado.model';
import { CalculoAtrasado } from '../+beneficios/+beneficios-calculos/CalculoAtrasado.model';
import { SeguradoContribuicao } from '../+contribuicoes/SeguradoContribuicao.model';
import { ContribuicaoJurisprudencial } from '../+contribuicoes/+contribuicoes-calculos/ContribuicaoJurisprudencial.model';
import { ContribuicaoComplementar } from '../+contribuicoes/+contribuicoes-complementar/ContribuicaoComplementar.model';
import { Moeda } from './Moeda.model';
import { SeguradoRgps } from '../+rgps/+rgps-segurados/SeguradoRgps.model';
import { CalculoRgps } from '../+rgps/+rgps-calculos/CalculoRgps.model';
import { ValorContribuido } from '../+rgps/+rgps-valores-contribuidos/ValorContribuido.model';
import { IndiceInps } from '../+rgps/+rgps-resultados/IndiceInps.model';
import { SalarioMinimoMaximo } from '../+rgps/+rgps-resultados/SalarioMinimoMaximo.model';
import { CarenciaProgressiva } from '../+rgps/+rgps-resultados/CarenciaProgressiva.model';
import { ExpectativaVida } from '../+rgps/+rgps-resultados/ExpectativaVida.model';
import { ReajusteAutomatico } from '../+rgps/+rgps-resultados/ReajusteAutomatico.model';
import { IntervaloReajuste } from './IntervaloReajuste.model';
import { Indices } from './Indices.model';

@Injectable()
export class StoreService {

  public data: {
    segurados: Segurado[],
    seguradosContribuicao: SeguradoContribuicao[],
    contribuicaoJurisprudencial: ContribuicaoJurisprudencial[],
    moeda: Moeda[],
    calculoAtrasado: CalculoAtrasado[],
    seguradosRgps: SeguradoRgps[],
    calculoRgps: CalculoRgps[],
    contribuicaoComplementar: ContribuicaoComplementar[],
    intervaloReajuste: IntervaloReajuste[],
    indices: Indices[],
    valorContribuido: ValorContribuido[],
    indiceInps: IndiceInps[],
    salarioMinimoMaximo: SalarioMinimoMaximo[],
    carenciaProgressiva: CarenciaProgressiva[],
    reajusteAutomatico: ReajusteAutomatico[],
    expectativaVida: ExpectativaVida[],
  } = {
    segurados: [],
    seguradosContribuicao: [],
    contribuicaoJurisprudencial: [],
    moeda: [],
    calculoAtrasado:[],
    seguradosRgps: [],
    calculoRgps: [],
    contribuicaoComplementar: [],
    intervaloReajuste: [],
    indices: [],
    valorContribuido: [],
    indiceInps: [],
    salarioMinimoMaximo: [],
    carenciaProgressiva: [],
    reajusteAutomatico: [],
    expectativaVida: [],
  };

  public push(name: string, data) {
    this.data[name] = Object.assign(this.data[name], data);

    return this.data[name];
  }

  public update(name: string, data) {
    this.data[name] = this.data[name].map(model => model !== data ? model : data);

    return this.data[name];
  }

  public remove(name: string, data) {
    this.data[name] = this.data[name].filter(model => model !== data);

    return this.data[name];
  }

}
