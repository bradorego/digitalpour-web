import { Component } from '@angular/core';
import {NavParams} from "ionic-angular";

@Component({
  selector: 'popover-filter',
  templateUrl: 'filter.html'
})
export class FilterPage {
  _callback: any;
  sortBy: string;
  ascending: boolean;
  constructor(
    private _params:NavParams
  ) {
    this._callback = this._params.get("callback");
    this.sortBy = this._params.get("sortBy");
    this.ascending = this._params.get("ascending");
    console.log(this._params.get("sortBy"));
  }
  radioChange() {
    console.log(this.sortBy, this.ascending);
    this._callback({sortBy: this.sortBy, ascending: this.ascending});
  }
}
