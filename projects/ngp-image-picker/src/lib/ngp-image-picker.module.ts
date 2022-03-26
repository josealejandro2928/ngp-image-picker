import { NgpImagePickerComponent } from './ngp-image-picker.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsComponent } from './components/tabs/tabs.component';
import { EditImageComponent } from './components/edit-image/edit-image.component';
@NgModule({
  declarations: [NgpImagePickerComponent, TabsComponent, EditImageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [NgpImagePickerComponent],
  providers: [],
})
export class NgpImagePickerModule {}
