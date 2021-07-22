import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessingPagePageRoutingModule } from './processing-page-routing.module';

import { ProcessingPagePage } from './processing-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcessingPagePageRoutingModule
  ],
  declarations: [ProcessingPagePage]
})
export class ProcessingPagePageModule {}
