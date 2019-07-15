import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PreloaderService {
    statusShare = new Subject();
    private _queries = 0;

    constructor() {
    }

    show(value: boolean) {
        if (value) {
            this._queries++;
        } else if (this._queries > 0) {
            this._queries--;
        }

        this.statusShare.next(Boolean(this._queries));
    }

}
