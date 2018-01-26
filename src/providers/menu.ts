import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

// const STORE_URL = 'https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/StoreLocations?ApiKey=574725e55e002c0b7cf0cf19';

// https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/57ac96c65e002c02e8ac2105/1/Tap?ApiKey=574725e55e002c0b7cf0cf19
// https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/FlattenedMenuItems/Tap?ApiKey=574725e55e002c0b7cf0cf19


// https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/55b11c2a5e002c0cdc1b49a3/1/KegQueue?allItems=1&ApiKey=574725e55e002c0b7cf0cf19

// https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/TapVote/55b11c2a5e002c0cdc1b49a3/1?ApiKey=574725e55e002c0b7cf0cf19


// POST https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/TapVote/true?ApiKey=574725e55e002c0b7cf0cf19
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
  lastOnTapId: string;
  lastUpNextId: string;
  lastOnTapLocationId: string;
  lastUpNextLocationId: string;
  constructor(public http: Http) { }

  public loadMenu(id: string, locationId: string): any {
    const MENU_URL = `https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/${id}/${locationId}/Tap?ApiKey=574725e55e002c0b7cf0cf19`;
    if (this.data && (this.lastOnTapId === id) && (this.lastOnTapLocationId === locationId)) {
      return Observable.of(this.data).map(this.processData, this);
    } else {
      this.lastOnTapId = id;
      this.lastOnTapLocationId = locationId;
      return this.http.get(MENU_URL)
        .map(this.processData, this);
    }
  }

  getUpNext(id: string, locationId: string): any {
    const URL = `https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/${id}/${locationId}/KegQueue?allItems=1&ApiKey=574725e55e002c0b7cf0cf19`
    if (this.upNext && (this.lastUpNextId === id) && (this.lastUpNextLocationId === locationId)) {
      return Observable.of(this.upNext).map(this.processUpNext, this);
    } else {
      this.lastUpNextId = id;
      this.lastUpNextLocationId = locationId;
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
    let dataHold = sortBy.list === "onTap" ? this.loadMenu(this.lastOnTapId, this.lastOnTapLocationId) : this.getUpNext(this.lastUpNextId, this.lastUpNextLocationId);     /// please tell me this is gonna work
    return dataHold.map((data: any) => {
      let result = data.slice();
      result.sort((a: any, b:any) => {
        let tieBreaker = a.tapNumber > b.tapNumber ? 1 : -1
        if (sortBy.sortBy === "abv") {
          if (a.abv === b.abv) {
            return tieBreaker;
          }
          return this._comparator(a.abv, b.abv);
        }
        if (sortBy.sortBy === "alphabetical") {
          let aName = `${a.producerName} - ${a.name}`;
          let bName = `${b.producerName} - ${b.name}`;
          if (aName === bName) {
            return tieBreaker;
          }
          return this._comparator(aName, bName);
        }
        if (sortBy.sortBy === "keg-life") {
          if (a.kegLife === b.kegLife) {
            return tieBreaker;
          }
          return this._comparator(a.kegLife, b.kegLife);
        }
        if (sortBy.sortBy === "style") {
          if (a.style === b.style) {
            return tieBreaker;
          }
          return this._comparator(a.style, b.style);
        }
        if (sortBy.sortBy === "date-tapped") {
          if (a.datePutOn === b.datePutOn) {
            return tieBreaker;
          }
          return this._comparator(a.datePutOn, b.datePutOn)
        }
        if (sortBy.sortBy === "tap-number") {
          return tieBreaker;
        }
        return 0;
      });
      return sortBy.ascending ? result : result.reverse();
    });
  }

  formatItem (item: any) {
    return {
      "name": item.MenuItemProductDetail.Beverage.BeverageName,
      "abv": item.MenuItemProductDetail.Beverage.Abv,
      "id": item.Id,
      "tapNumber": item.MenuItemDisplayDetail.DisplayOrder,
      "producerName": item.MenuItemProductDetail.Beverage.BeverageProducer.ProducerName,
      "nitro": item.MenuItemProductDetail.KegType === 'Nitro',
      "style": item.MenuItemProductDetail.FullStyleName,
      "kegLife": item.MenuItemProductDetail.PercentFull,
      "city": item.MenuItemProductDetail.Beverage.BeverageProducer.Location,
      "prices": item.MenuItemProductDetail.Prices,
      "imgUrl": item.MenuItemProductDetail.Beverage.ResolvedLogoImageUrl,
      "datePutOn": new Date(item.DatePutOn)
    }
  }

  processUpNext(data: any) {
    let output:any = [];
    if (data.json) {
      this.upNext = data.json();
    }
    /// maybe do some manipulation here
    this.upNext.forEach((item:any) => {
      output.push(this.formatItem(item));
    });
    return output;
  }

  processData(data: any) {
    let output:any = [];
    if (data.json) {
      this.data = data.json();
    }
    this.data.forEach((item: any) => {
      output.push(this.formatItem(item));
    });
    /// maybe do some manipulation here
    return output;
  }
}
