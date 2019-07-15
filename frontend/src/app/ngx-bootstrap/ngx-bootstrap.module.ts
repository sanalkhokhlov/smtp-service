import { NgModule } from '@angular/core';
import { PaginationModule, ModalModule, TooltipModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        PaginationModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot()
    ],
    exports: [
        PaginationModule,
        ModalModule,
        TooltipModule
    ]
})
export class NgxBootstrapModule { }
