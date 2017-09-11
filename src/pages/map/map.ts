import { Component, ViewChild, ElementRef } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

import {StoresData} from '../../providers/stores';

import { Platform, NavController} from 'ionic-angular';

import {SessionDetailPage} from '../session-detail/session-detail';

declare var google: any;


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(
     public confData: ConferenceData,
     public platform: Platform,
     public storesData: StoresData,
     public navCtrl: NavController
  ) {}

  ionViewDidLoad() {
    this.storesData.getMapData().subscribe((data: any) => {
      // console.log(data);
      let mapEle = this.mapElement.nativeElement;

      let map = new google.maps.Map(mapEle, {
        center: {lat: 43.074640, lng: -89.384103},
        zoom: 13
      });
      let infoWindow = new google.maps.InfoWindow();
      let infoWindowListener = {};
      let thisNavCtrl = this.navCtrl;

      data.forEach((markerData: any) => {

        let marker = new google.maps.Marker({
          position: {lat: markerData.lat, lng: markerData.lng},
          map: map,
          title: markerData.name,
          html: `<h5>${markerData.name}</h5>
            <p>${markerData.address}</p>
            <p>Bottles? ${markerData.bottles ? "Yes" : "No"}, Taps? ${markerData.taps ? "Yes" : "No"}</p>
            <a class="bjo-map-button" href="/#/tabs-page/conference-schedule/sessionDetail/${markerData.id}">See Menu</button>`
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
                console.log(markerData.id);
                thisNavCtrl.push(SessionDetailPage, { sessionId: markerData.id, name: markerData.name });
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
