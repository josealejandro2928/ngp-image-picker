import { Component } from '@angular/core';
import { ImagePickerConf } from 'ngp-image-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngp-image-picker-test';
  config1: ImagePickerConf = {
    borderRadius: '16px',
    language: 'en',
  };
  config2: ImagePickerConf = {
    borderRadius: '50%',
    language: 'es',
    width: '200px',
    height: '200px',
  };
}
