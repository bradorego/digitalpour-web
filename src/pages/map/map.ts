import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Platform, NavController, App} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import {StoresData} from '../../providers/stores';
import {MenuPage} from '../menu/menu';

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
     public app:App,
     public geolocation: Geolocation
  ) {}

  private _currentLocationCircle: any = {};

  ionViewDidLoad() {
    this.app.setTitle('Map');
    this.storesData.getMapData().subscribe((data: any) => {
      // console.log(data);

      let map = new google.maps.Map(this.mapElement.nativeElement, {
        center: {lat: 43.074640, lng: -89.384103},
        zoom: 13,
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
      let thisNavCtrl = this.navCtrl;

      data.forEach((markerData: any) => {

        let marker = new google.maps.Marker({
          position: {lat: markerData.lat, lng: markerData.lng},
          map: map,
          title: markerData.name,
          html: `<div class='dp-infowindow'><img src="${markerData.imgUrl}" />
            <h5>${markerData.name}</h5>
            <p>${markerData.address}</p>
            <p>Bottles? ${markerData.bottles ? "Yes" : "No"}, Taps? ${markerData.taps ? "Yes" : "No"}</p>
            <button class="map-button">See Menu</button></div>`
        });

        marker.addListener('click', () => {
          infoWindow.close();
          // google.maps.event.removeListener(infoWindowListener);
          google.maps.event.clearListeners(infoWindow);
          infoWindow.setContent(marker.html);
          infoWindow.open(map, marker);
          infoWindowListener = google.maps.event.addListener(infoWindow, 'domready', function() {
            let domObj: any = document.querySelector('.map-button');
            if (domObj) {
              domObj.addEventListener("click", function(e: Event) {
                e.stopPropagation();
                e.preventDefault();
                // console.log(markerData.id);
                thisNavCtrl.push(MenuPage, { storeId: markerData.id, name: markerData.name });
              });
            }
          });
        });
      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        this.mapElement.nativeElement.classList.add('show-map');
      });
      this.geolocation.getCurrentPosition().then((resp) => {
        map.setCenter({lat: resp.coords.latitude, lng: resp.coords.longitude});
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
      if (this._currentLocationCircle) {
        this._currentLocationCircle.setPosition({lat: resp.coords.latitude, lng: resp.coords.longitude});
      }
    });
  }
}
