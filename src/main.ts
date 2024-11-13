import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import './webcomponents/simple-custom-table';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
