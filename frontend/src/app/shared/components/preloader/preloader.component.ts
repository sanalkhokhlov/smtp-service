import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PreloaderService } from './preloader.service';

@Component({
  selector: 'preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css']
})
export class PreloaderComponent implements OnInit, OnDestroy {
    show = false;
    private statusSubscription: Subscription;

    constructor(
        private preloader: PreloaderService,
        private cdr: ChangeDetectorRef
    ) {
        this.cdr.detach();
    }

    ngOnInit() {
        this.statusSubscription = this.preloader.statusShare.asObservable().subscribe((response: boolean) => {
            this.show = response;
            this.cdr.detectChanges();
        });
    }


    ngOnDestroy(): void {
        this.statusSubscription.unsubscribe();
    }
}
