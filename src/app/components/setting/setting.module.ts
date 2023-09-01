import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { SettingRoutingModule } from './setting-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from "@angular/forms";
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    SettingRoutingModule,
    SharedModule,
    FormsModule,
  
  ],
})
export class SettingModule {}
