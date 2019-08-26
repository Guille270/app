import { BrowserModule } from '@angular/platform-browser';
import { HttpModule} from '@angular/http';

import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AdminTasacionesPage } from '../pages/admin-tasaciones/admin-tasaciones';
import { AddTasacionPage } from '../pages/add-tasacion/add-tasacion';
import { UpdateTasacionPage } from '../pages/update-tasacion/update-tasacion';

import { AdminFilesPage } from '../pages/admin-files/admin-files';

import { LoginPage } from '../pages/login/login';



@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    AdminTasacionesPage,
    AddTasacionPage,
    UpdateTasacionPage,
    AdminFilesPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    AdminTasacionesPage,
    AddTasacionPage,
    UpdateTasacionPage,
    AdminFilesPage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
