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

  sortBy(sortBy: any) {
    return this.loadMenu(this.lastId).map((data: any) => {
      let result = [];
      switch (sortBy.sortBy) {
        case "abv":
          result = data.sort((a: any, b: any) => {
            if (a.Beverage.Abv > b.Beverage.Abv) {
              return -1;
            }
            return 1;
          });
        break;
        case "alphabetical":
          result = data.sort((a: any, b: any) => {
            if (a.FullBeverageName > b.FullBeverageName) {
              return -1;
            }
            return 1;
          });
        break;
        case "keg-life":
          result = data.sort((a: any, b: any) => {
            if (a.PercentFull > b.PercentFull) {
              return -1;
            }
            return 1;
          });
        break;
        case "style":
          result = data.sort((a: any, b: any) => {
            if (a.FullStyleName > b.FullStyleName) {
              return -1;
            }
            return 1;
          });
        break;
        case "tap-number":
          result = data;
        break;
        default:
          result = data;
        break;
      }
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
