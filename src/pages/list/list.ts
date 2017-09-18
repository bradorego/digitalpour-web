import { Component } from '@angular/core';

import { IonicPage, App, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import {StoresData} from '../../providers/stores';

import { MenuPage } from '../menu/menuPage';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  // @ViewChild('scheduleList', { read: List }) scheduleList: List;

  queryText = '';
  storeList:any = [];
  private _loading:any;
  private _coords: any = {lat: 43.074751, lng: -89.384141}; /// assume madison if no location data woo

  constructor(
    public app: App,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public stores: StoresData,
    public geolocation: Geolocation
  ) {}

  ionViewDidLoad() {
    this.app.setTitle('List - Digital Pour');
    this.updateList();
    this.presentLoadingDefault();
  }

  presentLoadingDefault() {
    this._loading = this.loadingCtrl.create({});
    this._loading.present();
  }

  updateList() {
    this.geolocation.getCurrentPosition().then((resp: any) => {
      this._coords = resp.coords;
      this.stores.getListData(this._coords, false).subscribe((data: any) => {
        this.storeList = data;
        if (this._loading) {
          this._loading.dismiss();
        }
      });
    }, (err) => {
      console.error(err);
      this.stores.getListData(this._coords, false).subscribe((data: any) => {
        this.storeList = data;
        if (this._loading) {
          this._loading.dismiss();
        }
      });
    });
  }

  searchItems() {
    // Reset items back to all of the items
    this.updateList();

    // if the value is an empty string don't filter the items
    if (this.queryText && this.queryText.trim() != '') {
      this.storeList = this.storeList.filter((item: any) => {
        let searchTerm = `${item.name} ${item.address}`;
        return (searchTerm.toLowerCase().indexOf(this.queryText.toLowerCase()) > -1);
      })
    }
  }

  goToSessionDetail(item: any) {
    this.app.getRootNavs()[0].push(MenuPage, { storeId: item.id, name: item.name }, {updateUrl: true});
  }

  doRefresh(refresher: Refresher) {
    this.presentLoadingDefault();
    this.stores.getListData(this._coords, true).subscribe((data: any) => {
      this.storeList = data;
      // simulate a network request that would take longer
      // than just pulling from out local json file
      refresher.complete();
      const toast = this.toastCtrl.create({
        message: 'Sessions have been updated.',
        position: "top",
        duration: 3000
      });
      this._loading.dismiss();
      toast.present();
    });
  }
}
