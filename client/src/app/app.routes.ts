import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemeberListComponent } from './members/memeber-list/memeber-list.component';
import { MemeberDetailComponent } from './members/memeber-detail/memeber-detail.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guard/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'members',
        component: MemeberListComponent,
      },
      { path: 'members/:id', component: MemeberDetailComponent },
      { path: 'list', component: ListComponent },
      { path: 'messages', component: MessagesComponent },
    ],
  },
  {
    path: 'errors',
    component: TestErrorComponent,
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },

  { path: '**', component: HomeComponent, pathMatch: 'full' },
];
