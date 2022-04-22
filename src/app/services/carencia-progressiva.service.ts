import { Injectable } from '@angular/core';
import { CarenciaProgressiva } from '../+rgps/+rgps-resultados/CarenciaProgressiva.model';

@Injectable()
export class CarenciaProgressivaService {

  constructor() { }

  public getCarenciaProgressiva(): Array<object>{

        let CarenciaProgressiva = [
          {ano: 1991, mesesContribuicaoExigido: 60},
          {ano: 1992, mesesContribuicaoExigido: 60},
          {ano: 1993, mesesContribuicaoExigido: 66},
          {ano: 1994, mesesContribuicaoExigido: 72},
          {ano: 1995, mesesContribuicaoExigido: 78},
          {ano: 1996, mesesContribuicaoExigido: 90},
          {ano: 1997, mesesContribuicaoExigido: 96},
          {ano: 1998, mesesContribuicaoExigido: 102},
          {ano: 1999, mesesContribuicaoExigido: 108},
          {ano: 2000, mesesContribuicaoExigido: 114},
          {ano: 2001, mesesContribuicaoExigido: 120},
          {ano: 2002, mesesContribuicaoExigido: 126},
          {ano: 2003, mesesContribuicaoExigido: 132},
          {ano: 2004, mesesContribuicaoExigido: 138},
          {ano: 2005, mesesContribuicaoExigido: 144},
          {ano: 2006, mesesContribuicaoExigido: 150},
          {ano: 2007, mesesContribuicaoExigido: 156},
          {ano: 2008, mesesContribuicaoExigido: 162},
          {ano: 2009, mesesContribuicaoExigido: 168},
          {ano: 2010, mesesContribuicaoExigido: 174},
          {ano: 2011, mesesContribuicaoExigido: 180},
        ]

        return CarenciaProgressiva
  }

}
