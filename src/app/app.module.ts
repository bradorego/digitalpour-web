
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { MenuPage } from '../pages/menu/menu';
import { TabsPage } from '../pages/tabs-page/tabs-page';

import {StoresData} from '../providers/stores';
import {MenuData} from '../providers/menu';

import { Geolocation } from '@ionic-native/geolocation';


@NgModule({
  declarations: [
    ConferenceApp,
    MapPage,
    ListPage,
    MenuPage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: ListPage, name: 'List', segment: 'list' },
        { component: MapPage, name: 'Map', segment: 'map' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    MapPage,
    ListPage,
    MenuPage,
    TabsPage,
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InAppBrowser,
    SplashScreen,
    StoresData,
    MenuData,
    Geolocation
  ]
})
export class AppModule { }
