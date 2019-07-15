import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailListPageComponent } from './containers/email-list-page/email-list-page.component';

const routes: Routes = [
    {
        path: '',
        component: EmailListPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailRoutingModule { }
