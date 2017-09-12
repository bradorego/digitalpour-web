import { Component } from '@angular/core';
import { IonicPage, NavParams, App, LoadingController } from 'ionic-angular';

import {MenuData} from '../../providers/menu';

@IonicPage({
  name: 'menu',
  segment: 'menu/:storeId',
  defaultHistory: ['ds-map']
})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  menu: any;
  storeName: string;
  upNext: any;
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
    this.initializeItems(this.navParams);
    this.storeName = this.navParams.get("name");
    this.app.setTitle(this.storeName);
    history.replaceState({}, this.navParams.get('name'), `#/menu/${this.navParams.get('storeId')}`);
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({});
    this.loading.onDidDismiss(() => {
      this.loading = null;
    });

    this.loading.present();
  }

  initializeItems(params:NavParams) {
    this.menuProvider.load(params.get("storeId")).subscribe((data: any) => {
      this.menu = data.map((item: any) => {
        item.MenuItemProductDetail.DatePutOn = new Date(item.DatePutOn);
        if (this.loading) {
          this.loading.dismiss();
        }
        return item.MenuItemProductDetail;
      });
    });
    this.menuProvider.getUpNext(params.get("storeId")).subscribe((data: any) => {
      this.upNext = data.map((item: any) => {
        /// maybe manipulate - we'll see
        return item;
      });
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
