import { Component } from '@angular/core';

import { NavParams, IonicPage } from 'ionic-angular';

import { ListPage} from '../list/list';
import { MapPage } from '../map/map';

@IonicPage({
  name: 'dp-tabs',
  segment: 'tabs'
})
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = MapPage;
  tab2Root: any = ListPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
