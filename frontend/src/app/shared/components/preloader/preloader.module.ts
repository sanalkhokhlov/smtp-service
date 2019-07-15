import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderComponent } from './preloader.component';
import { PreloaderService } from './preloader.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PreloaderComponent],
    exports: [PreloaderComponent],
    providers: [PreloaderService]
})
export class PreloaderModule { }
