
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { DatePipe } from '@angular/common';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { DigitalPourApp } from './app.component';

import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import {FilterPage} from '../pages/menu/filter';
import {MenuPage} from '../pages/menu/menuPage';

import {StoresData} from '../providers/stores';
import {MenuData} from '../providers/menu';



@NgModule({
  declarations: [
    DigitalPourApp,
    MapPage,
    ListPage,
    MenuPage,
    TabsPage,
    FilterPage
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
    FilterPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SplashScreen,
    StoresData,
    MenuData,
    Geolocation,
    DatePipe
  ]
})
export class AppModule { }
