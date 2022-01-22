import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ImagePickerConf } from 'ngp-image-picker';

@Component({
  selector: 'app-test-library-wrapper',
  templateUrl: './test-library-wrapper.component.html',
  styleUrls: ['./test-library-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestLibraryWrapperComponent implements OnInit {
  config2: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    width: '200px',
    height: '200px',
  };

  constructor() {}

  ngOnInit(): void {}
}
