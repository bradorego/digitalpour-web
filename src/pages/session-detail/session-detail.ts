import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';
import {MenuData} from '../../providers/menu';

@IonicPage({
  segment: 'session/:sessionId'
})
@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  menu: any;

  constructor(
    public dataProvider: ConferenceData,
    public menuProvider: MenuData,
    public navParams: NavParams
  ) {}

  ionViewWillEnter() {
    console.log(this.navParams.get('sessionId'));
    this.menuProvider.load(this.navParams.data.sessionId).subscribe((data: any) => {
      console.log(data);
      this.menu = data.map((item: any) => {
        item.MenuItemProductDetail.DatePutOn = new Date(item.DatePutOn);
        return item.MenuItemProductDetail;
      });
      this.menu.name = this.navParams.get("name");
    });

  }
}
