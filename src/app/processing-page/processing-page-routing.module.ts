import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessingPagePage } from './processing-page.page';

const routes: Routes = [
  {
    path: '',
    component: ProcessingPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessingPagePageRoutingModule {}
