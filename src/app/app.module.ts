
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing'
import { OnlyLoggedInUsersGuard } from './can-activate-route.guard'
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Core providers
import { CoreModule } from "./core/core.module";
import { SmartadminLayoutModule } from "./shared/layout/layout.module";
import { SeguradoService } from './+beneficios/+beneficios-segurados/Segurado.service';
import { SeguradoService as ContribuicoesSeguradoService } from './+contribuicoes/Segurado.service';
import { SeguradoService as RgpsSeguradoService } from './+rgps/+rgps-segurados/SeguradoRgps.service';
import { ContribuicaoJurisprudencialService } from './+contribuicoes/+contribuicoes-calculos/ContribuicaoJurisprudencial.service';
import { ContribuicaoComplementarService } from './+contribuicoes/+contribuicoes-complementar/ContribuicaoComplementar.service';
import { CalculoAtrasadoService } from './+beneficios/+beneficios-calculos/CalculoAtrasado.service';
import { StoreService } from './services/store.service';
import { MoedaService } from './services/Moeda.service';
import { MatrixService } from './+contribuicoes/MatrixService.service'
import { IntervaloReajusteService } from './services/IntervaloReajuste.service';
import { IndicesService } from './services/Indices.service';
import { CarenciaProgressivaService } from './+rgps/+rgps-resultados/CarenciaProgressiva.service';
import { ExpectativaVidaService } from './+rgps/+rgps-resultados/ExpectativaVida.service';
import { ValorContribuidoService } from './+rgps/+rgps-valores-contribuidos/ValorContribuido.service.ts'
import { IndiceInpsService } from './+rgps/+rgps-resultados/IndiceInps.service.ts'
import { SalarioMinimoMaximoService } from './+rgps/+rgps-resultados/SalarioMinimoMaximo.service.ts'
import { ReajusteAutomaticoService } from './+rgps/+rgps-resultados/ReajusteAutomatico.service.ts'
import { TextMaskModule } from 'angular2-text-mask';
import { CalculoRgpsService } from './+rgps/+rgps-calculos/CalculoRgps.service';
import { CalculoContagemTempoService } from './+contagem-tempo/+contagem-tempo-calculos/CalculoContagemTempo.service';
import { SeguradoService as SeguradoContagemTempoService } from './+contagem-tempo/+contagem-tempo-segurados/SeguradoContagemTempo.service';
import { PeriodosContagemTempoService } from './+contagem-tempo/+contagem-tempo-periodos/PeriodosContagemTempo.service';
import { RgpsPlanejamentoService } from './+rgps/rgps-planejamento/rgps-planejamento.service';
import { SeguradoPlanService } from './+rgps/rgps-planejamento/rgps-planejamento-segurados/SeguradoPlan.service';
import { ImportadorCnisContribuicoesService } from './+importador-cnis/+importador-cnis-contribuicoes/importador-cnis-contribuicoes.service';
import { FileDropModule } from 'ngx-file-drop';
import { Auth } from './services/Auth/Auth.service';


// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    TextMaskModule,
    CoreModule,
    SmartadminLayoutModule,
    FileDropModule,    
    routing
  ],
  exports: [
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    // ENV_PROVIDERS,
    APP_PROVIDERS,
    StoreService,
    SeguradoService,
    ContribuicoesSeguradoService,
    RgpsSeguradoService,
    ContribuicaoJurisprudencialService,
    CalculoAtrasadoService,
    MoedaService,
    IntervaloReajusteService,
    IndicesService,
    CalculoRgpsService,
    ContribuicaoComplementarService,
    MatrixService,
    ValorContribuidoService,
    IndiceInpsService,
    SalarioMinimoMaximoService,
    CarenciaProgressivaService,
    ReajusteAutomaticoService,
    ExpectativaVidaService,
    SeguradoContagemTempoService,
    CalculoContagemTempoService,
    PeriodosContagemTempoService,
    RgpsPlanejamentoService,
    SeguradoPlanService,
    ImportadorCnisContribuicoesService,
    Auth,
    OnlyLoggedInUsersGuard
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) { }


}

