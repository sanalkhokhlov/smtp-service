import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { ContentComponent } from './containers/content/content.component';

@NgModule({
    imports: [
        CommonModule,
        CoreRoutingModule
    ],
    exports: [],
    declarations: [
        ContentComponent
    ],
    providers: [],
})
export class CoreModule { }
