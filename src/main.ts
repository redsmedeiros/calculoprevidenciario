import './lib'

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

import axios from 'axios';
window['axios'] = axios;

platformBrowserDynamic().bootstrapModule(AppModule);
