import { Component } from '@angular/core';
import { IonicPage, NavParams, App, LoadingController } from 'ionic-angular';

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
  loading: any;

  constructor(
    public menuProvider: MenuData,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public app: App
  ) {}


  log(beverage: any) {
    console.log(beverage);
  }
  ionViewWillEnter() {
    // this.presentLoadingDefault();
    this.initializeItems(this.navParams);
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({});
    this.loading.onDidDismiss(() => {
      this.loading = null;
    });

    this.loading.present();
  }

  initializeItems(params:NavParams) {
    this.menuProvider.load(params.get("sessionId")).subscribe((data: any) => {
      this.menu = data.map((item: any) => {
        item.MenuItemProductDetail.DatePutOn = new Date(item.DatePutOn);
        if (this.loading) {
          this.loading.dismiss();
        }
        return item.MenuItemProductDetail;
      });
      this.menu.name = params.get("name");
      this.app.setTitle(this.menu.name);
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
        let searchTerm = `${item.FullBeverageName} ${item.FullStyleName}`;
        return (searchTerm.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
