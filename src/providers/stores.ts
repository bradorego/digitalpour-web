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
  data: any;
  constructor(public http: Http) { }

  private distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    let p:number = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a:number = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return (12742 * Math.asin(Math.sqrt(a))) * 0.62137; // 2 * R; R = 6371 km; /// converting km to mi
  }

  load(force:boolean = false): any {
    if (this.data && !force) {
      return Observable.of(this.data);
    } else {
      return this.http.get(STORE_URL)
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    this.data = data.json();
    // console.log(this.data);
    /// maybe do some manipulation here
    return this.data;
  }

  getListData(coords: any, force?: boolean) {
    let listData:any = [];
    return this.load(force).map((data: any) => {
      data.forEach((item:any) => {
        listData.push({
          "id": item.CompanyId,
          "name": item.StoreName,
          "distance": this.distance(coords.latitude, coords.longitude, item.Latitude, item.Longitude),
          "address": `${item.Address}, ${item.City}, ${item.State} ${item.ZipCode}`,
          "imgUrl": item.BarLogoUrl,
          "hours": item.StoreHours,
          "bottles": item.HasBottles,
          "taps": item.HasTaps
        });
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
