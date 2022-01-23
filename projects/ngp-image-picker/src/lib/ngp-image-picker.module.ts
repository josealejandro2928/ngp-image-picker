import { NgpImagePickerComponent } from './ngp-image-picker.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [NgpImagePickerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [NgpImagePickerComponent],
})
export class NgpImagePickerModule {}
