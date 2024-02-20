import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupComponent } from './signup.component';
import { SignupRoutingModule } from './signup-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    SignupComponent
  ],
  declarations: [
    SignupComponent
  ],
  providers: [
  ],
})
export class SignupModule { }
