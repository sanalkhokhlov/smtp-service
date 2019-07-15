import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxBootstrapModule } from '../ngx-bootstrap/ngx-bootstrap.module';
import { EmailListPageComponent } from './containers/email-list-page/email-list-page.component';
import { EmailSourceComponent } from './components/email-source/email-source.component';
import { EmailService } from './email.service';
import { EmailRoutingModule } from './email-routing.module';
import { EmailTableComponent } from './components/email-table/email-table.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgxBootstrapModule,
        EmailRoutingModule,
        HttpClientModule
    ],
    declarations: [
        EmailListPageComponent,
        EmailSourceComponent,
        EmailTableComponent
    ],
    providers: [
        EmailService
    ],
    entryComponents: [
        EmailSourceComponent
    ]
})
export class EmailModule { }
