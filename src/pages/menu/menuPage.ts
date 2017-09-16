import { Component } from '@angular/core';
import { IonicPage, NavParams, App, LoadingController, PopoverController } from 'ionic-angular';

import {MenuData} from '../../providers/menu';
import {StoresData} from '../../providers/stores';
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
  private _upNext: any;
  private _onTap: any;
  list = "onTap";
  private _loading: any;
  private _id: string;
  private _sortBy = "tap-number";
  private _ascending = true;

  constructor(
    public menuProvider: MenuData,
    public storesProvider: StoresData,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public app: App,
    private _popover:PopoverController
  ) {}

  ionViewWillEnter() {
    this.app.setTitle(this.storeName);
    this.storeName = this.navParams.get("name");
    this._id = this.navParams.get("storeId");
    if (!this.storeName) {
      this.storesProvider.getById(this._id).subscribe((store: any) => {
        this.storeName = store.name;
        this.app.setTitle(this.storeName);
      });
    }
    history.replaceState({}, this.navParams.get('name'), `#/menu/${this._id}`);
    this.initializeItems(this.list);
  }

  toggleList(list: string) {
    this.initializeItems(list);
  }

  displayFilters(ev:Event) {
    let popover = this._popover.create(FilterPage,{
      sortBy: this._sortBy,
      ascending: this._ascending,
      callback: (_data: any) => {
        this._sortBy = _data.sortBy;
        this._ascending = _data.ascending;
        _data.list = this.list; /// tell sortBy which list to work off of
        this.menuProvider.sortBy(_data).subscribe((result: any) => {
          // this._handleData(result);
          this.menu = result.slice();
        });
      }
    });
    popover.present({ev});
  }

  log(beverage: any) {
    console.log(beverage);
  }

  presentLoadingDefault() {
    this._loading = this.loadingCtrl.create({});
    this._loading.present();
  }

  // private _handleData(data: any) {
  //   this.menu = data.map((item: any) => {
  //     return item;
  //   });
  // }

  initializeItems(list : string) {
    this.presentLoadingDefault();
    this.menuProvider.loadMenu(this._id).subscribe((data: any) => {
      this._onTap = data.map((item: any) => {
        /// maybe manipulate - we'll see
        return item;
      });
      if (list === "onTap") {
        this.menu = this._onTap.slice();
      }
      if (this._loading) {
        this._loading.dismiss();
      }
    });
    this.menuProvider.getUpNext(this._id).subscribe((data: any) => {
      this._upNext = data.map((item: any) => {
        /// maybe manipulate - we'll see
        return item;
      });
      if (list === "upNext") {
        this.menu = this._upNext.slice();
      }
    });
  }

  searchItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems(this.list);

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
