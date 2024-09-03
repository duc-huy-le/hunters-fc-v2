import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BarController, Colors, Legend } from 'chart.js';
import { provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#336699'
  }
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideNzConfig(ngZorroConfig),
    provideRouter(routes),
    provideAnimations(),
    provideNzI18n(en_US),
    provideCharts(withDefaultRegisterables()),
    provideCharts({ registerables: [BarController, Legend, Colors] }),
    provideHttpClient(),
    DatePipe,
  ],
};
