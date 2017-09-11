import { Component, ViewChild } from '@angular/core';

import { App, List, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import {StoresData} from '../../providers/stores';

import { MenuPage } from '../menu/menu';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('scheduleList', { read: List }) scheduleList: List;

  queryText = '';
  storeList:any = [];
  private coords: any = {};

  constructor(
    public app: App,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public stores: StoresData,
    public geolocation: Geolocation
  ) {}

  ionViewDidLoad() {
    this.updateList();
  }

  updateList() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.coords = resp.coords;
      this.stores.getListData(this.coords, false).subscribe((data: any) => {
        this.storeList = data;
      });
    }, (err) => {
      console.error(err);
      this.stores.getListData(this.coords, false).subscribe((data: any) => {
        this.storeList = data;
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
    // go to the session detail page
    // and pass in the session data
    this.navCtrl.push(MenuPage, { storeId: item.id, name: item.name });
  }

  doRefresh(refresher: Refresher) {
    this.stores.getListData(this.coords, true).subscribe((data: any) => {
      this.storeList = data;
      // simulate a network request that would take longer
      // than just pulling from out local json file
      refresher.complete();
      const toast = this.toastCtrl.create({
        message: 'Sessions have been updated.',
        position: "top",
        duration: 3000
      });
      toast.present();
    });
  }
}
