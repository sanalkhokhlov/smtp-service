import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './containers/content/content.component';

const routes: Routes = [
    {
        path: '',
        component: ContentComponent,
        children: [
            {
                path: 'emails',
                loadChildren: '../email/email.module#EmailModule'
            },
            {
                path: '',
                redirectTo: '/emails',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**', redirectTo: '/emails'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule { }
