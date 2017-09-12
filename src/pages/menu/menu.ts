import { Component } from '@angular/core';
import { IonicPage, NavParams, App, LoadingController, PopoverController } from 'ionic-angular';

import {MenuData} from '../../providers/menu';
import {FilterPage} from "./filter";

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
  private _id: string;
  private _sortBy = "tap-number";

  constructor(
    public menuProvider: MenuData,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public app: App,
    private _popover:PopoverController
  ) {}

  ionViewWillEnter() {
    this.app.setTitle(this.storeName);
    this.storeName = this.navParams.get("name");
    this._id = this.navParams.get("storeId");
    history.replaceState({}, this.navParams.get('name'), `#/menu/${this._id}`);
    this.initializeItems();
  }

  displayFilters(ev:Event) {
    let popover = this._popover.create(FilterPage,{
      sortBy: this._sortBy,
      callback: (_data: any) => {
        console.log(_data);
        this._sortBy = _data;
        this.menuProvider.sortBy(_data).subscribe((result: any) => {
          this._handleData(result);
        });
      }
    });
    popover.present({ev});
  }

  log(beverage: any) {
    console.log(beverage);
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({});
    this.loading.onDidDismiss(() => {
      this.loading = null;
    });

    this.loading.present();
  }

  private _handleData(data: any) {
    this.menu = data.map((item: any) => {
      item.MenuItemProductDetail.DatePutOn = new Date(item.DatePutOn);
      if (this.loading) {
        this.loading.dismiss();
      }
      return item.MenuItemProductDetail;
    });
  }

  initializeItems() {
    this.menuProvider.loadMenu(this._id).subscribe((data: any) => {
      this._handleData(data);
    });
    this.menuProvider.getUpNext(this._id).subscribe((data: any) => {
      this.upNext = data.map((item: any) => {
        /// maybe manipulate - we'll see
        return item;
      });
    });
  }

  searchItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

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
