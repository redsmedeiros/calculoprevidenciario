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
import { Moeda } from './Moeda.model';

@Injectable()
export class StoreService {

  public data: {
    segurados: Segurado[],
    seguradosContribuicao: SeguradoContribuicao[],
    contribuicaoJurisprudencial: ContribuicaoJurisprudencial[],
    moeda: Moeda[],
    calculoAtrasado: CalculoAtrasado[]
  } = {
    segurados: [],
    seguradosContribuicao: [],
    contribuicaoJurisprudencial: [],
    moeda: [],
    calculoAtrasado:[]
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
