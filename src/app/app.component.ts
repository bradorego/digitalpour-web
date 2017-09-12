import { Component, ViewChild } from '@angular/core';

import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MapPage } from '../pages/map/map';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { ListPage } from '../pages/list/list';


export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class DigitalPourApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'List', name: 'TabsPage', component: TabsPage, tabComponent: ListPage, index: 0, icon: 'list' },
    { title: 'Map', name: 'TabsPage', component: TabsPage, tabComponent: MapPage, index: 1, icon: 'map' },
  ];
  rootPage: any;

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen
  ) {
    this.rootPage = TabsPage;
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }
}
