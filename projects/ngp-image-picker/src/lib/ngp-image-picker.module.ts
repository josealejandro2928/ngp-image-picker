import { NgpImagePickerComponent } from './ngp-image-picker.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [NgpImagePickerComponent],
  imports: [
    CommonModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  exports: [NgpImagePickerComponent],
})
export class NgpImagePickerModule {}
