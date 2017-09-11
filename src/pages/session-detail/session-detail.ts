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
    this.initializeItems(this.navParams);
  }

  initializeItems(params:NavParams) {
    this.menuProvider.load(params.get("sessionId")).subscribe((data: any) => {
      console.log(data);
      this.menu = data.map((item: any) => {
        item.MenuItemProductDetail.DatePutOn = new Date(item.DatePutOn);
        return item.MenuItemProductDetail;
      });
      this.menu.name = params.get("name");
    });
  }

  searchItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems(this.navParams);

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.menu = this.menu.filter((item: any) => {
        console.log(item);
        let searchTerm = `${item.FullBeverageName} ${item.FullStyleName}`;
        return (searchTerm.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
