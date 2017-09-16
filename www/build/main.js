webpackJsonp([0],{

/***/ 101:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_stores__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__menu_menuPage__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MapPage = (function () {
    function MapPage(platform, storesData, navCtrl, _loadingCtrl, app, geolocation, _datePipe) {
        this.platform = platform;
        this.storesData = storesData;
        this.navCtrl = navCtrl;
        this._loadingCtrl = _loadingCtrl;
        this.app = app;
        this.geolocation = geolocation;
        this._datePipe = _datePipe;
        this._coords = { lat: 43.074751, lng: -89.384141 }; /// assume madison if no location data woo
        this._currentLocationCircle = {};
    }
    MapPage.prototype.presentLoadingDefault = function () {
        this._loading = this._loadingCtrl.create({});
        this._loading.present();
    };
    MapPage.prototype.ionViewWillLoad = function () {
        this.presentLoadingDefault();
    };
    MapPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.app.setTitle('Map - Digital Pour');
        this.storesData.getMapData(this._coords).subscribe(function (data) {
            var map = new google.maps.Map(_this.mapElement.nativeElement, {
                center: { lat: 43.074640, lng: -89.384103 },
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
            var infoWindow = new google.maps.InfoWindow();
            var infoWindowListener = {};
            data.forEach(function (item) {
                var marker = new google.maps.Marker({
                    position: { lat: item.lat, lng: item.lng },
                    map: map,
                    title: item.name,
                    html: "<div class='dp-infowindow'>\n            <div class=\"img-wrap\"><img src=\"" + item.imgUrl + "\" /></div>\n            <div class=\"text-wrap\">\n              <h2>" + item.name + " " + (item.distance ? "(" + item.distance + ")" : "") + "</h2>\n              <h4>" + item.address + "</h4>\n              <p>" + _this._datePipe.transform(item.todayOpen, 'shortTime') + " - " + _this._datePipe.transform(item.todayClose, 'shortTime') + "</p>\n              <p>" + (item.wifi ? "WiFi Password: " + item.wifi : "") + "</p>\n            </div>\n            <button class=\"map-button\">See Menu</button>\n          </div>"
                });
                marker.addListener('click', function () {
                    infoWindow.close();
                    // google.maps.event.removeListener(infoWindowListener);
                    google.maps.event.clearListeners(infoWindow);
                    infoWindow.setContent(marker.html);
                    infoWindow.open(map, marker);
                    infoWindowListener = google.maps.event.addListener(infoWindow, 'domready', function () {
                        var domObj = document.querySelector('.map-button');
                        if (domObj) {
                            domObj.addEventListener("click", function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                _this.app.getRootNavs()[0].push(__WEBPACK_IMPORTED_MODULE_5__menu_menuPage__["a" /* MenuPage */], { storeId: item.id, name: item.name }, { updateUrl: true });
                            });
                        }
                    });
                });
            });
            google.maps.event.addListenerOnce(map, 'idle', function () {
                _this.mapElement.nativeElement.classList.add('show-map');
                _this._loading.dismiss();
            });
            _this.geolocation.getCurrentPosition().then(function (resp) {
                map.setCenter({ lat: resp.coords.latitude, lng: resp.coords.longitude });
                _this._coords = resp.coords;
                _this._currentLocationCircle = new google.maps.Marker({
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
            }, function (err) {
                console.error(err);
            });
        });
        this.geolocation.watchPosition({ timeout: 30000 }).subscribe(function (resp) {
            _this._coords = resp.coords;
            if (_this._currentLocationCircle && _this._currentLocationCircle.setPosition) {
                _this._currentLocationCircle.setPosition({ lat: resp.coords.latitude, lng: resp.coords.longitude });
            }
        });
    };
    return MapPage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])('mapCanvas'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
], MapPage.prototype, "mapElement", void 0);
MapPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])({
        name: 'ds-map'
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-map',template:/*ion-inline-start:"/Users/bradorego/Development/ionic-test/test/src/pages/map/map.html"*/'<ion-header>\n  <ion-toolbar>\n    <ion-title>Map</ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content class="map-page">\n  <div style="height: 100%; width: 100%" #mapCanvas id="map_canvas"></div>\n</ion-content>\n'/*ion-inline-end:"/Users/bradorego/Development/ionic-test/test/src/pages/map/map.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_4__providers_stores__["a" /* StoresData */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* App */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */],
        __WEBPACK_IMPORTED_MODULE_3__angular_common__["c" /* DatePipe */]])
], MapPage);

//# sourceMappingURL=map.js.map

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MenuPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_menu__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_stores__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__filter__ = __webpack_require__(201);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MenuPage = (function () {
    function MenuPage(menuProvider, storesProvider, navParams, loadingCtrl, app, _popover) {
        this.menuProvider = menuProvider;
        this.storesProvider = storesProvider;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.app = app;
        this._popover = _popover;
        this.list = "onTap";
        this._sortBy = "tap-number";
        this._ascending = true;
    }
    MenuPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.app.setTitle(this.storeName);
        this.storeName = this.navParams.get("name");
        this._id = this.navParams.get("storeId");
        if (!this.storeName) {
            this.storesProvider.getById(this._id).subscribe(function (store) {
                _this.storeName = store.name;
                _this.app.setTitle(_this.storeName);
            });
        }
        history.replaceState({}, this.navParams.get('name'), "#/menu/" + this._id);
        this.initializeItems(this.list);
    };
    MenuPage.prototype.toggleList = function (list) {
        this.initializeItems(list);
    };
    MenuPage.prototype.displayFilters = function (ev) {
        var _this = this;
        var popover = this._popover.create(__WEBPACK_IMPORTED_MODULE_4__filter__["a" /* FilterPage */], {
            sortBy: this._sortBy,
            ascending: this._ascending,
            callback: function (_data) {
                _this._sortBy = _data.sortBy;
                _this._ascending = _data.ascending;
                _data.list = _this.list; /// tell sortBy which list to work off of
                _this.menuProvider.sortBy(_data).subscribe(function (result) {
                    // this._handleData(result);
                    _this.menu = result.slice();
                });
            }
        });
        popover.present({ ev: ev });
    };
    MenuPage.prototype.log = function (beverage) {
        console.log(beverage);
    };
    MenuPage.prototype.presentLoadingDefault = function () {
        this._loading = this.loadingCtrl.create({});
        this._loading.present();
    };
    // private _handleData(data: any) {
    //   this.menu = data.map((item: any) => {
    //     return item;
    //   });
    // }
    MenuPage.prototype.initializeItems = function (list) {
        var _this = this;
        this.presentLoadingDefault();
        this.menuProvider.loadMenu(this._id).subscribe(function (data) {
            _this._onTap = data.map(function (item) {
                /// maybe manipulate - we'll see
                return item;
            });
            if (list === "onTap") {
                _this.menu = _this._onTap.slice();
            }
            if (_this._loading) {
                _this._loading.dismiss();
            }
        });
        this.menuProvider.getUpNext(this._id).subscribe(function (data) {
            _this._upNext = data.map(function (item) {
                /// maybe manipulate - we'll see
                return item;
            });
            if (list === "upNext") {
                _this.menu = _this._upNext.slice();
            }
        });
    };
    MenuPage.prototype.searchItems = function (ev) {
        // Reset items back to all of the items
        this.initializeItems(this.list);
        // set val to the value of the searchbar
        var val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.menu = this.menu.filter(function (item) {
                var searchTerm = item.FullBeverageName + " " + item.FullStyleName;
                return (searchTerm.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    };
    return MenuPage;
}());
MenuPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])({
        name: 'menu',
        segment: 'menu/:storeId',
        defaultHistory: ['ds-map']
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-menu',template:/*ion-inline-start:"/Users/bradorego/Development/ionic-test/test/src/pages/menu/menu.html"*/'<ion-header>\n  <ion-navbar no-border-top>\n    <ion-title *ngIf="storeName">{{storeName}}</ion-title>\n    <ion-buttons end>\n      <button ion-button icon-only (click)="displayFilters($event)">\n        <ion-icon name="funnel"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n  <ion-segment [(ngModel)]="list" (ionChange)="toggleList(list)">\n    <ion-segment-button value="onTap">\n      On Tap\n    </ion-segment-button>\n    <ion-segment-button value="upNext">\n      Up Next\n    </ion-segment-button>\n  </ion-segment>\n</ion-header>\n\n<ion-content>\n  <div *ngIf="menu">\n    <ion-list>\n      <ion-item *ngFor="let beverage of menu" (click)="log(beverage)">\n        <ion-avatar item-start>\n          <img *ngIf="beverage.imgUrl" [src]="beverage.imgUrl" />\n        </ion-avatar>\n        <h2 color="secondary">{{beverage.producerName}} - {{beverage.name}}</h2>\n        <h4 *ngIf="beverage.style">{{beverage.style}}</h4>\n        <h6>{{beverage.city}}</h6>\n        <h5>\n          <ion-badge *ngIf="beverage.nitro" color="light">Nitro</ion-badge>\n          <ion-badge>ABV</ion-badge>\n          <span *ngIf="beverage.abv; else elseABV">{{beverage.abv | number:\'1.1-1\'}}%</span>\n          <ng-template #elseABV>???%</ng-template>\n          <ion-badge color="secondary" *ngIf="beverage.kegLife >= 0.75 && list === \'onTap\'">Keg</ion-badge>\n          <ion-badge *ngIf="beverage.kegLife > 0.25 && beverage.kegLife < 0.75 && list === \'onTap\'">Keg</ion-badge>\n          <ion-badge color="danger" *ngIf="beverage.kegLife <= 0.25 && list === \'onTap\'">Keg</ion-badge>\n          <span *ngIf="beverage.kegLife > 0 && list === \'onTap\'; else elsePercentFull">{{beverage.kegLife | percent:\'1.0-0\'}}</span>\n          <ng-template #elsePercentFull *ngIf="list === \'onTap\'">???%</ng-template>\n          <ion-badge *ngIf="list === \'onTap\'">Tapped</ion-badge>\n          <span *ngIf="list === \'onTap\'">{{beverage.datePutOn | date:\'shortDate\'}}</span>\n        </h5>\n        <p><span *ngFor="let size of beverage.prices">{{size.DisplayName}}: {{size.Price | currency:\'USD\':true:\'1.2-2\'}}</span></p>\n      </ion-item>\n    </ion-list>\n  </div>\n</ion-content>\n\n<ion-footer>\n  <ion-toolbar class="dp-searchbar">\n    <ion-searchbar (ionInput)="searchItems($event)"></ion-searchbar>\n  </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/Users/bradorego/Development/ionic-test/test/src/pages/menu/menu.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__providers_menu__["a" /* MenuData */],
        __WEBPACK_IMPORTED_MODULE_3__providers_stores__["a" /* StoresData */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* App */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* PopoverController */]])
], MenuPage);

//# sourceMappingURL=menuPage.js.map

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_stores__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__menu_menuPage__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';


var ListPage = (function () {
    function ListPage(app, loadingCtrl, navCtrl, toastCtrl, stores, geolocation) {
        this.app = app;
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.stores = stores;
        this.geolocation = geolocation;
        // the list is a child of the schedule page
        // @ViewChild('scheduleList') gets a reference to the list
        // with the variable #scheduleList, `read: List` tells it to return
        // the List and not a reference to the element
        // @ViewChild('scheduleList', { read: List }) scheduleList: List;
        this.queryText = '';
        this.storeList = [];
        this._coords = { lat: 43.074751, lng: -89.384141 }; /// assume madison if no location data woo
    }
    ListPage.prototype.ionViewDidLoad = function () {
        this.app.setTitle('List - Digital Pour');
        this.updateList();
        this.presentLoadingDefault();
    };
    ListPage.prototype.presentLoadingDefault = function () {
        this._loading = this.loadingCtrl.create({});
        this._loading.present();
    };
    ListPage.prototype.updateList = function () {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (resp) {
            _this._coords = resp.coords;
            _this.stores.getListData(_this._coords, false).subscribe(function (data) {
                _this.storeList = data;
            });
        }, function (err) {
            console.error(err);
            _this.stores.getListData(_this._coords, false).subscribe(function (data) {
                _this.storeList = data;
            });
        }).then(function () {
            _this._loading.dismiss();
        });
        ;
    };
    ListPage.prototype.searchItems = function () {
        var _this = this;
        // Reset items back to all of the items
        this.updateList();
        // if the value is an empty string don't filter the items
        if (this.queryText && this.queryText.trim() != '') {
            this.storeList = this.storeList.filter(function (item) {
                var searchTerm = item.name + " " + item.address;
                return (searchTerm.toLowerCase().indexOf(_this.queryText.toLowerCase()) > -1);
            });
        }
    };
    ListPage.prototype.goToSessionDetail = function (item) {
        this.app.getRootNavs()[0].push(__WEBPACK_IMPORTED_MODULE_4__menu_menuPage__["a" /* MenuPage */], { storeId: item.id, name: item.name }, { updateUrl: true });
    };
    ListPage.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.presentLoadingDefault();
        this.stores.getListData(this._coords, true).subscribe(function (data) {
            _this.storeList = data;
            // simulate a network request that would take longer
            // than just pulling from out local json file
            refresher.complete();
            var toast = _this.toastCtrl.create({
                message: 'Sessions have been updated.',
                position: "top",
                duration: 3000
            });
            _this._loading.dismiss();
            toast.present();
        });
    };
    return ListPage;
}());
ListPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-list',template:/*ion-inline-start:"/Users/bradorego/Development/ionic-test/test/src/pages/list/list.html"*/'<ion-header>\n  <ion-toolbar no-border-top>\n    <ion-title>List</ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content></ion-refresher-content>\n  </ion-refresher>\n\n  <ion-list>\n    <ion-item *ngFor="let item of storeList" (click)="goToSessionDetail(item)">\n      <ion-avatar item-start>\n        <img *ngIf="item.imgUrl" [src]="item.imgUrl" />\n      </ion-avatar>\n      <h2>{{item.name}} <span *ngIf="item.distance; else locationBlock">({{item.distance | number:\'1.1-1\'}} mi.)</span></h2>\n      <h4>{{item.address}}</h4>\n      <h5 *ngIf="item.todayOpen">\n        <ion-badge>Hours</ion-badge>\n        {{item.todayOpen | date:\'shortTime\'}} - {{item.todayClose | date:\'shortTime\'}}\n      </h5>\n      <p *ngIf="item.wifi"><ion-badge>WiFi Password</ion-badge> {{item.wifi}}</p>\n      <ng-template #locationBlock><h5>Enable location services to show distance</h5></ng-template>\n    </ion-item>\n  </ion-list>\n</ion-content>\n<ion-footer>\n  <ion-toolbar class="dp-searchbar">\n    <ion-searchbar\n       [(ngModel)]="queryText"\n       (ionInput)="searchItems()"\n       placeholder="Search">\n    </ion-searchbar>\n  </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"/Users/bradorego/Development/ionic-test/test/src/pages/list/list.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* App */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_3__providers_stores__["a" /* StoresData */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */]])
], ListPage);

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 113:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 113;

/***/ }),

/***/ 155:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 155;

/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MenuData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





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
var MenuData = (function () {
    function MenuData(http) {
        this.http = http;
    }
    MenuData.prototype.loadMenu = function (id) {
        var MENU_URL = "http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/" + id + "/1/Tap?ApiKey=574725e55e002c0b7cf0cf19";
        if (this.data && this.lastId === id) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.data).map(this.processData, this);
        }
        else {
            this.lastId = id;
            return this.http.get(MENU_URL)
                .map(this.processData, this);
        }
    };
    MenuData.prototype.getUpNext = function (id) {
        var URL = "http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/" + id + "/1/KegQueue?allItems=1&ApiKey=574725e55e002c0b7cf0cf19";
        if (this.upNext && this.lastId === id) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.upNext).map(this.processUpNext, this);
        }
        else {
            this.lastId = id;
            return this.http.get(URL)
                .map(this.processUpNext, this);
        }
    };
    MenuData.prototype._comparator = function (item1, item2) {
        if (item1 > item2) {
            return 1;
        }
        return -1;
    };
    MenuData.prototype.sortBy = function (sortBy) {
        var _this = this;
        var dataHold = sortBy.list === "onTap" ? this.loadMenu(this.lastId) : this.getUpNext(this.lastId); /// please tell me this is gonna work
        return dataHold.map(function (data) {
            var result = data.slice();
            result.sort(function (a, b) {
                var tieBreaker = a.tapNumber > b.tapNumber ? 1 : -1;
                if (sortBy.sortBy === "abv") {
                    if (a.abv === b.abv) {
                        return tieBreaker;
                    }
                    return _this._comparator(a.abv, b.abv);
                }
                if (sortBy.sortBy === "alphabetical") {
                    var aName = a.producerName + " - " + a.name;
                    var bName = b.producerName + " - " + b.name;
                    if (aName === bName) {
                        return tieBreaker;
                    }
                    return _this._comparator(aName, bName);
                }
                if (sortBy.sortBy === "keg-life") {
                    if (a.kegLife === b.kegLife) {
                        return tieBreaker;
                    }
                    return _this._comparator(a.kegLife, b.kegLife);
                }
                if (sortBy.sortBy === "style") {
                    if (a.style === b.style) {
                        return tieBreaker;
                    }
                    return _this._comparator(a.style, b.style);
                }
                if (sortBy.sortBy === "date-tapped") {
                    if (a.datePutOn === b.datePutOn) {
                        return tieBreaker;
                    }
                    return _this._comparator(a.datePutOn, b.datePutOn);
                }
                if (sortBy.sortBy === "tap-number") {
                    return tieBreaker;
                }
                return 0;
            });
            return sortBy.ascending ? result : result.reverse();
        });
    };
    MenuData.prototype.formatItem = function (item) {
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
        };
    };
    MenuData.prototype.processUpNext = function (data) {
        var _this = this;
        var output = [];
        if (data.json) {
            this.upNext = data.json();
        }
        /// maybe do some manipulation here
        this.upNext.forEach(function (item) {
            output.push(_this.formatItem(item));
        });
        return output;
    };
    MenuData.prototype.processData = function (data) {
        var _this = this;
        var output = [];
        if (data.json) {
            this.data = data.json();
        }
        this.data.forEach(function (item) {
            output.push(_this.formatItem(item));
        });
        /// maybe do some manipulation here
        return output;
    };
    return MenuData;
}());
MenuData = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
], MenuData);

//# sourceMappingURL=menu.js.map

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FilterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FilterPage = (function () {
    function FilterPage(_params) {
        this._params = _params;
        this._callback = this._params.get("callback");
        this.sortBy = this._params.get("sortBy");
        this.ascending = this._params.get("ascending");
    }
    FilterPage.prototype.radioChange = function () {
        this._callback({ sortBy: this.sortBy, ascending: this.ascending });
    };
    return FilterPage;
}());
FilterPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'popover-filter',template:/*ion-inline-start:"/Users/bradorego/Development/ionic-test/test/src/pages/menu/filter.html"*/'<ion-item>\n  <ion-label>Ascending</ion-label>\n  <ion-toggle [(ngModel)]="ascending" (ionChange)="radioChange(sortBy, ascending)"></ion-toggle>\n</ion-item>\n<ion-list radio-group [(ngModel)]="sortBy" (ionChange)="radioChange(sortBy, ascending)">\n  <ion-item>\n    <ion-label>Tap Number</ion-label>\n    <ion-radio value="tap-number"></ion-radio>\n  </ion-item>\n  <ion-item>\n    <ion-label>Alphabetical</ion-label>\n    <ion-radio value="alphabetical"></ion-radio>\n  </ion-item>\n  <ion-item>\n    <ion-label>ABV</ion-label>\n    <ion-radio value="abv"></ion-radio>\n  </ion-item>\n  <ion-item>\n    <ion-label>Keg Life</ion-label>\n    <ion-radio value="keg-life"></ion-radio>\n  </ion-item>\n  <ion-item>\n    <ion-label>Style</ion-label>\n    <ion-radio value="style"></ion-radio>\n  </ion-item>\n  <ion-item>\n      <ion-label>Date Tapped</ion-label>\n      <ion-radio value="date-tapped"></ion-radio>\n    </ion-item>\n</ion-list>\n'/*ion-inline-end:"/Users/bradorego/Development/ionic-test/test/src/pages/menu/filter.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
], FilterPage);

//# sourceMappingURL=filter.js.map

/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__list_list__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__map_map__ = __webpack_require__(101);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TabsPage = (function () {
    function TabsPage(navParams) {
        // set the root pages for each tab
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_3__map_map__["a" /* MapPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_2__list_list__["a" /* ListPage */];
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
    return TabsPage;
}());
TabsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])({
        name: 'dp-tabs',
        segment: 'tabs'
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/bradorego/Development/ionic-test/test/src/pages/tabs-page/tabs-page.html"*/'<ion-tabs [selectedIndex]="mySelectedIndex" name="digital-pour">\n  <ion-tab [root]="tab1Root" tabTitle="Map" tabIcon="map"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="List" tabIcon="list"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/Users/bradorego/Development/ionic-test/test/src/pages/tabs-page/tabs-page.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
], TabsPage);

//# sourceMappingURL=tabs-page.js.map

/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(221);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_geolocation__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_map_map__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_list_list__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_tabs_page_tabs_page__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_menu_filter__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_menu_menuPage__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__providers_stores__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__providers_menu__ = __webpack_require__(200);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* DigitalPourApp */],
            __WEBPACK_IMPORTED_MODULE_8__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_list_list__["a" /* ListPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_menu_menuPage__["a" /* MenuPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_tabs_page_tabs_page__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_menu_filter__["a" /* FilterPage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* DigitalPourApp */], {}, {
                links: [
                    { component: __WEBPACK_IMPORTED_MODULE_10__pages_tabs_page_tabs_page__["a" /* TabsPage */], name: 'TabsPage', segment: 'tabs-page' },
                    { component: __WEBPACK_IMPORTED_MODULE_9__pages_list_list__["a" /* ListPage */], name: 'List', segment: 'list' },
                    { component: __WEBPACK_IMPORTED_MODULE_8__pages_map_map__["a" /* MapPage */], name: 'Map', segment: 'map' },
                    { component: __WEBPACK_IMPORTED_MODULE_12__pages_menu_menuPage__["a" /* MenuPage */], name: 'Menu', segment: 'menu/:storeId', defaultHistory: [__WEBPACK_IMPORTED_MODULE_10__pages_tabs_page_tabs_page__["a" /* TabsPage */]] }
                ]
            })
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["b" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* DigitalPourApp */],
            __WEBPACK_IMPORTED_MODULE_8__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_list_list__["a" /* ListPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_menu_menuPage__["a" /* MenuPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_tabs_page_tabs_page__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_menu_filter__["a" /* FilterPage */]
        ],
        providers: [
            { provide: __WEBPACK_IMPORTED_MODULE_2__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["c" /* IonicErrorHandler */] },
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_13__providers_stores__["a" /* StoresData */],
            __WEBPACK_IMPORTED_MODULE_14__providers_menu__["a" /* MenuData */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_3__angular_common__["c" /* DatePipe */]
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 269:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DigitalPourApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_map_map__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_tabs_page_tabs_page__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_list_list__ = __webpack_require__(103);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DigitalPourApp = (function () {
    function DigitalPourApp(platform, splashScreen) {
        this.platform = platform;
        this.splashScreen = splashScreen;
        // List of pages that can be navigated to from the left menu
        // the left menu only works after login
        // the login page disables the left menu
        this.appPages = [
            { title: 'List', name: 'TabsPage', component: __WEBPACK_IMPORTED_MODULE_4__pages_tabs_page_tabs_page__["a" /* TabsPage */], tabComponent: __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */], index: 0, icon: 'list' },
            { title: 'Map', name: 'TabsPage', component: __WEBPACK_IMPORTED_MODULE_4__pages_tabs_page_tabs_page__["a" /* TabsPage */], tabComponent: __WEBPACK_IMPORTED_MODULE_3__pages_map_map__["a" /* MapPage */], index: 1, icon: 'map' },
        ];
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_tabs_page_tabs_page__["a" /* TabsPage */];
    }
    DigitalPourApp.prototype.platformReady = function () {
        var _this = this;
        // Call any initial plugins when ready
        this.platform.ready().then(function () {
            _this.splashScreen.hide();
        });
    };
    return DigitalPourApp;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */])
], DigitalPourApp.prototype, "nav", void 0);
DigitalPourApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/bradorego/Development/ionic-test/test/src/app/app.template.html"*/'<!-- main navigation -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false" main name="app"></ion-nav>\n'/*ion-inline-end:"/Users/bradorego/Development/ionic-test/test/src/app/app.template.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__["a" /* SplashScreen */]])
], DigitalPourApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StoresData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var STORE_URL = 'http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/StoreLocations?ApiKey=574725e55e002c0b7cf0cf19';
// http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/MenuItems/57ac96c65e002c02e8ac2105/1/Tap?ApiKey=574725e55e002c0b7cf0cf19
// http://mobile.digitalpour.com/DashboardServer/v4/MobileApp/FlattenedMenuItems/Tap?ApiKey=574725e55e002c0b7cf0cf19
var StoresData = (function () {
    function StoresData(http) {
        this.http = http;
        this._now = new Date();
    }
    StoresData.prototype.distance = function (lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295; // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
                (1 - c((lon2 - lon1) * p)) / 2;
        return (12742 * Math.asin(Math.sqrt(a))) * 0.62137; // 2 * R; R = 6371 km; /// converting km to mi
    };
    StoresData.prototype.load = function (force) {
        if (force === void 0) { force = false; }
        if (this._data && !force) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this._data).map(this.processData, this);
        }
        else {
            return this.http.get(STORE_URL)
                .map(this.processData, this);
        }
    };
    StoresData.prototype.processData = function (data) {
        if (data.json) {
            this._data = data.json();
        }
        /// maybe do some manipulation here
        return this._data;
    };
    StoresData.prototype.getById = function (id, coords) {
        var _this = this;
        if (coords === void 0) { coords = { latitude: false }; }
        return this.load(false).map(function (data) {
            _this._now = new Date();
            var item = data.find(function (item) {
                return item.CompanyId === id;
            });
            if (item.Id) {
                return _this._formatItem(item, coords);
            }
            return {};
        });
    };
    StoresData.prototype._getTodayOpen = function (todayHours) {
        var openChunks = todayHours.TimeOpen.split(":");
        var open = new Date();
        open.setHours(parseInt(openChunks[0], 10));
        open.setMinutes(parseInt(openChunks[1], 10));
        open.setSeconds(parseInt(openChunks[2], 10));
        return open;
    };
    StoresData.prototype._getTodayClose = function (todayHours) {
        var closeChunks = todayHours.TimeClose.split(":");
        var close = new Date();
        close.setHours(parseInt(closeChunks[0], 10));
        close.setMinutes(parseInt(closeChunks[1], 10));
        close.setSeconds(parseInt(closeChunks[2], 10));
        return close;
    };
    StoresData.prototype._determineOpenNow = function (todayHours) {
        return (this._now < this._getTodayClose(todayHours) && this._now > this._getTodayOpen(todayHours));
    };
    StoresData.prototype._formatItem = function (item, coords) {
        var todayHours = item.StoreHours ? item.StoreHours[this._now.getDay()] : false;
        return {
            "id": item.CompanyId,
            "name": item.StoreName,
            "distance": coords.latitude ? this.distance(coords.latitude, coords.longitude, item.Latitude, item.Longitude) : null,
            "lat": item.Latitude,
            "lng": item.Longitude,
            "address": item.Address + ", " + item.City + ", " + item.State + " " + item.ZipCode,
            "imgUrl": item.BarLogoUrl,
            "hours": item.StoreHours,
            "bottles": item.HasBottles,
            "taps": item.HasTaps,
            "wifi": item.WiFiPassword,
            "todayOpen": todayHours ? this._getTodayOpen(todayHours) : false,
            "todayClose": todayHours ? this._getTodayClose(todayHours) : false,
            "openNow": todayHours ? this._determineOpenNow(todayHours) : false
        };
    };
    StoresData.prototype.getListData = function (coords, force) {
        var _this = this;
        var listData = [];
        return this.load(force).map(function (data) {
            data.forEach(function (item) {
                listData.push(_this._formatItem(item, coords));
            });
            listData.sort(function (a, b) {
                if (a.distance > b.distance) {
                    return 1;
                }
                return -1;
            });
            return listData;
        });
    };
    StoresData.prototype.getMapData = function (coords, force) {
        var _this = this;
        var mapData = [];
        return this.load(force).map(function (data) {
            data.forEach(function (item) {
                mapData.push(_this._formatItem(item, coords));
            });
            return mapData;
        });
    };
    return StoresData;
}());
StoresData = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
], StoresData);

//# sourceMappingURL=stores.js.map

/***/ })

},[203]);
//# sourceMappingURL=main.js.map