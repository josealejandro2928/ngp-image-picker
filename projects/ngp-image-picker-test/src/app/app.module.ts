
import { NgpImagePickerModule,ImagePickerConf } from 'ngp-image-picker';

import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    NgpImagePickerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
