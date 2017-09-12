import { Component } from '@angular/core';
import {NavParams} from "ionic-angular";

@Component({
  selector: 'popover-filter',
  templateUrl: 'filter.html'
})
export class FilterPage {
  _callback: any;
  sortBy: string;
  constructor(
    private _params:NavParams
  ) {
    this._callback = this._params.get("callback");
    this.sortBy = this._params.get("sortBy");
  }
  radioChange(value: string, ascending: boolean) {
    this._callback({sortBy: value, ascending: ascending});
  }
}
