import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

const STORE_URL = 'https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/StoreLocations?ApiKey=574725e55e002c0b7cf0cf19';

// https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/57ac96c65e002c02e8ac2105/1/Tap?ApiKey=574725e55e002c0b7cf0cf19
// https://mobile.digitalpour.com/DashboardServer/v4/MobileApp/FlattenedMenuItems/Tap?ApiKey=574725e55e002c0b7cf0cf19


@Injectable()
export class StoresData {
  private _data: any;
  private _now = new Date();
  constructor(public http: Http) { }

  distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    let p:number = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a:number = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return (12742 * Math.asin(Math.sqrt(a))) * 0.62137; // 2 * R; R = 6371 km; /// converting km to mi
  }

  public load(force:boolean = false): any {
    if (this._data && !force) {
      return Observable.of(this._data).map(this.processData, this);
    } else {
      return this.http.get(STORE_URL)
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    if (data.json) {
      this._data = data.json();
    }
    /// maybe do some manipulation here
    return this._data;
  }


  getById(id: string, coords:any = {latitude: false}) {
    return this.load(false).map((data: any) => {
      this._now = new Date();
      let item = data.find((item:any) => {
        return item.CompanyId === id;
      });
      if (item.Id) {
        return this._formatItem(item, coords);
      }
      return {};
    });
  }

  private _getTodayOpen(todayHours: any) {
    let openChunks = todayHours.TimeOpen.split(":");
    let open = new Date();
    open.setHours(parseInt(openChunks[0], 10));
    open.setMinutes(parseInt(openChunks[1], 10));
    open.setSeconds(parseInt(openChunks[2], 10));
    return open;
  }

  private _getTodayClose(todayHours: any) {
    let closeChunks = todayHours.TimeClose.split(":");
    let close = new Date();
    close.setHours(parseInt(closeChunks[0], 10));
    close.setMinutes(parseInt(closeChunks[1], 10));
    close.setSeconds(parseInt(closeChunks[2], 10));
    return close;
  }

  private _determineOpenNow(todayHours: any) { //// whoever decided to pass this as a string should perish
    return (this._now < this._getTodayClose(todayHours) && this._now > this._getTodayOpen(todayHours));
  }

  private _formatItem(item: any, coords: any) {
    let todayHours = item.StoreHours ? item.StoreHours[this._now.getDay()] : false;
    return {
      "id": item.CompanyId,
      "name": item.StoreName,
      "distance": coords.latitude ? this.distance(coords.latitude, coords.longitude, item.Latitude, item.Longitude) : null,
      "lat": item.Latitude,
      "lng": item.Longitude,
      "address": `${item.Address}, ${item.City}, ${item.State} ${item.ZipCode}`,
      "imgUrl": item.BarLogoUrl,
      "hours": item.StoreHours,
      "bottles": item.HasBottles,
      "taps": item.HasTaps,
      "wifi": item.WiFiPassword,
      "todayOpen": todayHours ? this._getTodayOpen(todayHours) : false,
      "todayClose": todayHours ? this._getTodayClose(todayHours) : false,
      "openNow": todayHours ? this._determineOpenNow(todayHours) : false
    };
  }

  getListData(coords: any, force?: boolean) {
    let listData:any = [];
    return this.load(force).map((data: any) => {
      data.forEach((item:any) => {
        listData.push(this._formatItem(item, coords));
      });
      listData.sort((a: any, b: any) => {
        if (a.distance > b.distance) {
          return 1;
        }
        return -1;
      });
      return listData;
    });
  }

  getMapData(coords: any, force?: boolean) {
    let mapData:any = [];
    return this.load(force).map((data:any) => {
      data.forEach((item: any) => {
        mapData.push(this._formatItem(item, coords));
      });
      return mapData;
    });
  }
}
