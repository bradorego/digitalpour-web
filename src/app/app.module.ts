
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DigitalPourApp } from './app.component';

import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { MenuPage } from '../pages/menu/menu';
import { TabsPage } from '../pages/tabs-page/tabs-page';

import {StoresData} from '../providers/stores';
import {MenuData} from '../providers/menu';

import { Geolocation } from '@ionic-native/geolocation';


@NgModule({
  declarations: [
    DigitalPourApp,
    MapPage,
    ListPage,
    MenuPage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(DigitalPourApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: ListPage, name: 'List', segment: 'list' },
        { component: MapPage, name: 'Map', segment: 'map' },
        { component: MenuPage, name: 'Menu', segment: 'menu/:storeId', defaultHistory: [TabsPage] }
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DigitalPourApp,
    MapPage,
    ListPage,
    MenuPage,
    TabsPage,
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SplashScreen,
    StoresData,
    MenuData,
    Geolocation
  ]
})
export class AppModule { }
