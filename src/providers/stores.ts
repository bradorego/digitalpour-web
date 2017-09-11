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

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get(STORE_URL)
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    this.data = data.json();
    /// maybe do some manipulation here
    return this.data;
  }

  getMapData() {
    let mapData:any = [];
    return this.load().map((data:any) => {
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
