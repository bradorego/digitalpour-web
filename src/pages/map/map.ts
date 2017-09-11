import { Component, ViewChild, ElementRef } from '@angular/core';

import {StoresData} from '../../providers/stores';

import { Platform, NavController, App} from 'ionic-angular';

import {MenuPage} from '../menu/menu';

declare var google: any;


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
     public app:App
  ) {}

  ionViewDidLoad() {
    this.app.setTitle('Map');
    this.storesData.getMapData().subscribe((data: any) => {
      // console.log(data);
      let mapEle = this.mapElement.nativeElement;

      let map = new google.maps.Map(mapEle, {
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
          html: `<img src="${markerData.imgUrl}" />
            <h5>${markerData.name}</h5>
            <p>${markerData.address}</p>
            <p>Bottles? ${markerData.bottles ? "Yes" : "No"}, Taps? ${markerData.taps ? "Yes" : "No"}</p>
            <a class="bjo-map-button">See Menu</button>`
        });

        marker.addListener('click', () => {
          infoWindow.close();
          // google.maps.event.removeListener(infoWindowListener);
          google.maps.event.clearListeners(infoWindow);
          infoWindow.setContent(marker.html);
          infoWindow.open(map, marker);
          infoWindowListener = google.maps.event.addListener(infoWindow, 'domready', function() {
            let domObj: any = document.querySelector('.bjo-map-button');
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
        mapEle.classList.add('show-map');
      });
    });
  }
}
