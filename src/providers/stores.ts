import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

const STORE_URL = 'http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/StoreLocations?ApiKey=574725e55e002c0b7cf0cf19';

// http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/57ac96c65e002c02e8ac2105/1/Tap?ApiKey=574725e55e002c0b7cf0cf19
// http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/FlattenedMenuItems/Tap?ApiKey=574725e55e002c0b7cf0cf19


@Injectable()
export class StoresData {
  _data: any;
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

  getById(id: string) {
    return this.load(false).map((data: any) => {
      let item = data.find((item:any) => {
        return item.CompanyId === id;
      });
      if (item.Id) {
        return {
          "id": item.CompanyId,
          "name": item.StoreName,
          // "distance": coords.latitude ? this.distance(coords.latitude, coords.longitude, item.Latitude, item.Longitude) : null,
          "address": `${item.Address}, ${item.City}, ${item.State} ${item.ZipCode}`,
          "imgUrl": item.BarLogoUrl,
          "hours": item.StoreHours,
          "bottles": item.HasBottles,
          "taps": item.HasTaps
        }
      }
    });
  }

  getListData(coords: any, force?: boolean) {
    let listData:any = [];
    return this.load(force).map((data: any) => {
      data.forEach((item:any) => {
        listData.push({
          "id": item.CompanyId,
          "name": item.StoreName,
          "distance": coords.latitude ? this.distance(coords.latitude, coords.longitude, item.Latitude, item.Longitude) : null,
          "address": `${item.Address}, ${item.City}, ${item.State} ${item.ZipCode}`,
          "imgUrl": item.BarLogoUrl,
          "hours": item.StoreHours,
          "bottles": item.HasBottles,
          "taps": item.HasTaps
        });
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

  getMapData(force?: boolean) {
    let mapData:any = [];
    return this.load(force).map((data:any) => {
      data.forEach((item: any) => {
        mapData.push({
          "id": item.CompanyId,
          "name": item.StoreName,
          "lat": item.Latitude,
          "lng": item.Longitude,
          "address": `${item.Address}, ${item.City}, ${item.State} ${item.ZipCode}`,
          "imgUrl": item.BarLogoUrl,
          "hours": item.StoreHours,
          "bottles": item.HasBottles,
          "taps": item.HasTaps
        });
      });
      return mapData;
    });
  }
}
