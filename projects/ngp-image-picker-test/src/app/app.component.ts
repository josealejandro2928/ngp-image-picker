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
  config3: ImagePickerConf = {
    borderRadius: '4px',
    language: 'en',
  };

  initialImage = 'https://havanatursa.com/assets/images/carousel/Hoteles.webp';

  onImageChanged(base64): void {
    console.log('AppComponent -> onImageChanged -> base64', base64);
  }
}
