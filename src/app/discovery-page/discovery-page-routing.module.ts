import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoveryPagePage } from './discovery-page.page';

const routes: Routes = [
  {
    path: '',
    component: DiscoveryPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscoveryPagePageRoutingModule {}
