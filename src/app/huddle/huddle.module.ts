import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HuddlePageRoutingModule } from './huddle-routing.module';

import { HuddlePage } from './huddle.page';
import { HeaderModule } from '../components/header/header.component.module';
import { CreateHuddleComponent } from './create-huddle/create-huddle.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    HuddlePageRoutingModule,
    HeaderModule,
  ],
  declarations: [
    HuddlePage,
    CreateHuddleComponent,
  ]
})
export class HuddlePageModule {}
