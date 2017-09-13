import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

// const STORE_URL = 'http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/StoreLocations?ApiKey=574725e55e002c0b7cf0cf19';

// http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/57ac96c65e002c02e8ac2105/1/Tap?ApiKey=574725e55e002c0b7cf0cf19
// http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/FlattenedMenuItems/Tap?ApiKey=574725e55e002c0b7cf0cf19


// http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/55b11c2a5e002c0cdc1b49a3/1/KegQueue?allItems=1&ApiKey=574725e55e002c0b7cf0cf19

// http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/TapVote/55b11c2a5e002c0cdc1b49a3/1?ApiKey=574725e55e002c0b7cf0cf19


// POST http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/TapVote/true?ApiKey=574725e55e002c0b7cf0cf19
// {
//     "BeverageId": "59a1ad2d5e002c0714b245ae",
//     "CompanyId": "55b11c2a5e002c0cdc1b49a3",
//     "DeviceId": "5062983101",
//     "LocationId": "1",
//     "MobileUserId": "77530"
// }

@Injectable()
export class MenuData {
  data: any;
  upNext: any;
  lastId: string;
  constructor(public http: Http) { }

  public loadMenu(id: string): any {
    const MENU_URL = `http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/${id}/1/Tap?ApiKey=574725e55e002c0b7cf0cf19`;
    if (this.data && this.lastId === id) {
      return Observable.of(this.data);
    } else {
      this.lastId = id;
      return this.http.get(MENU_URL)
        .map(this.processData, this);
    }
  }

  getUpNext(id: string): any {
    const URL = `http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/${id}/1/KegQueue?allItems=1&ApiKey=574725e55e002c0b7cf0cf19`
    if (this.upNext && this.lastId === id) {
      return Observable.of(this.upNext);
    } else {
      this.lastId = id
      return this.http.get(URL)
        .map(this.processUpNext, this);
    }
  }

  private _comparator(item1: any, item2: any) {
    if (item1 > item2) {
      return 1;
    }
    return -1;
  }

  sortBy (sortBy: any) {
    return this.loadMenu(this.lastId).map((data: any) => {
      let result = data.slice();
      result.sort((a: any, b:any) => {
        let tieBreaker = a.MenuItemDisplayDetail.DisplayOrder > b.MenuItemDisplayDetail.DisplayOrder ? 1 : -1
        if (sortBy.sortBy === "abv") {
          let aABV = a.MenuItemProductDetail.Beverage.Abv;
          let bABV = b.MenuItemProductDetail.Beverage.Abv;
          if (aABV === bABV) {
            return tieBreaker;
          }
          return this._comparator(aABV, bABV);
        }
        if (sortBy.sortBy === "alphabetical") {
          let aName = `${a.MenuItemProductDetail.Beverage.BeverageProducer.ProducerName} - ${a.MenuItemProductDetail.Beverage.BeverageName}`;
          let bName = `${b.MenuItemProductDetail.Beverage.BeverageProducer.ProducerName} - ${b.MenuItemProductDetail.Beverage.BeverageName}`;
          if (aName === bName) {
            return tieBreaker;
          }
          return this._comparator(aName, bName);
        }
        if (sortBy.sortBy === "keg-life") {
          let aPF = a.MenuItemProductDetail.PercentFull;
          let bPF = b.MenuItemProductDetail.PercentFull;
          if (aPF === bPF) {
            return tieBreaker;
          }
          return this._comparator(aPF, bPF);
        }
        if (sortBy.sortBy === "style") {
          let aStyle = a.MenuItemProductDetail.FullStyleName;
          let bStyle = b.MenuItemProductDetail.FullStyleName;
          if (aStyle === bStyle) {
            return tieBreaker;
          }
          return this._comparator(aStyle, bStyle);
        }
        if (sortBy.sortBy === "tap-number") {
          return tieBreaker;
        }
        return 0;
      });
      return sortBy.ascending ? result : result.reverse();
    });
  }

  processUpNext(data: any) {
    this.upNext = data.json();
    /// maybe do some manipulation here
    return this.upNext;
  }

  processData(data: any) {
    this.data = data.json();
    /// maybe do some manipulation here
    return this.data;
  }
}
