import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth/auth.guard';

import { HuddlePage } from './huddle.page';

const routes: Routes = [
  {
    path: ':huddleDay',
    component: HuddlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HuddlePageRoutingModule {}
