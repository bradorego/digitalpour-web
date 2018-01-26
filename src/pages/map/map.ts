import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, IonicPage, Platform, NavController, App} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { DatePipe } from '@angular/common';

import {StoresData} from '../../providers/stores';
import {MenuPage} from '../menu/menuPage';

declare var google: any;

@IonicPage({
  name: 'ds-map'
})
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(
     public platform: Platform,
     public storesData: StoresData,
     public navCtrl: NavController,
     private _loadingCtrl: LoadingController,
     public app:App,
     public geolocation: Geolocation,
     private _datePipe: DatePipe
  ) {}

  private _coords: any = {lat: 43.074751, lng: -89.384141}; /// assume madison if no location data woo
  private _currentLocationCircle: any = {};
  private _loading: any;

  presentLoadingDefault() {
    this._loading = this._loadingCtrl.create({});
    this._loading.present();
  }

  ionViewWillLoad() {
    this.presentLoadingDefault();
  }

  ionViewDidLoad() {
    this.app.setTitle('Map - Digital Pour');
    this.storesData.getMapData(this._coords).subscribe((data: any) => {
      let map = new google.maps.Map(this.mapElement.nativeElement, {
        center: {lat: 43.074640, lng: -89.384103},
        zoom: 11,
        styles: [
          {
            "featureType": "poi",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      });
      let infoWindow = new google.maps.InfoWindow();
      let infoWindowListener = {};

      data.forEach((item: any) => {

        let marker = new google.maps.Marker({
          position: {lat: item.lat, lng: item.lng},
          map: map,
          title: item.name,
          html: `<div class='dp-infowindow'>
            <div class="img-wrap"><img src="${item.imgUrl}" /></div>
            <div class="text-wrap">
              <h2>${item.name} ${item.distance ? `(${item.distance})` : ``}</h2>
              <h4>${item.address}</h4>
              <p>${this._datePipe.transform(item.todayOpen, 'shortTime')} - ${this._datePipe.transform(item.todayClose, 'shortTime')}</p>
              <p>${item.wifi ? `WiFi Password: ${item.wifi}` : ``}</p>
            </div>
            <button class="map-button">See Menu</button>
          </div>`
        });

        marker.addListener('click', () => {
          infoWindow.close();
          // google.maps.event.removeListener(infoWindowListener);
          google.maps.event.clearListeners(infoWindow);
          infoWindow.setContent(marker.html);
          infoWindow.open(map, marker);
          infoWindowListener = google.maps.event.addListener(infoWindow, 'domready', () => {
            let domObj: any = document.querySelector('.map-button');
            if (domObj) {
              domObj.addEventListener("click", (e: Event) => {
                e.stopPropagation();
                e.preventDefault();
                this.app.getRootNavs()[0].push(MenuPage, { storeId: item.id, name: item.name, locationId: item.locationId }, {updateUrl: true});
              });
            }
          });
        });
      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        this.mapElement.nativeElement.classList.add('show-map');
        this._loading.dismiss();
      });
      this.geolocation.getCurrentPosition().then((resp) => {
        map.setCenter({lat: resp.coords.latitude, lng: resp.coords.longitude});
        this._coords = resp.coords;
        this._currentLocationCircle = new google.maps.Marker({
          map: map,
          position: map.getCenter(),
          title: "circle",
          icon: {
            strokeColor: '#FFFFFF',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            fillColor: '#689df6',
            fillOpacity: 1.0,
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            anchor: new google.maps.Point(0, 0)
          }
        });
      }, (err) => {
        console.error(err);
      });
    });
    this.geolocation.watchPosition({timeout: 30000}).subscribe((resp) => {
      this._coords = resp.coords;
      if (this._currentLocationCircle && this._currentLocationCircle.setPosition) {
        this._currentLocationCircle.setPosition({lat: resp.coords.latitude, lng: resp.coords.longitude});
      }
    });
  }
}
