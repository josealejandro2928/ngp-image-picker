import { Component, OnInit } from '@angular/core';
import { ImagePickerConf } from 'ngp-image-picker';

@Component({
  selector: 'app-test-library-wrapper',
  templateUrl: './test-library-wrapper.component.html',
  styleUrls: ['./test-library-wrapper.component.scss'],
})
export class TestLibraryWrapperComponent implements OnInit {
  config2: ImagePickerConf = {
    borderRadius: '8px',
    language: 'es',
    width: '330px',
    objectFit: 'contain',
    aspectRatio: 4 / 3,
    compressInitial: null,
  };
  initialImage: string = "https://josealejandro2928.github.io/portfolio/archives/pokedex/1.jpeg";
  // initialImage: string = "https://local-spaces.fra1.digitaloceanspaces.com/test.jpg";
  imageSrc: any = '';
  constructor() {}

  ngOnInit(): void {
  }

  onImageChanged(dataUri: string) {
    this.imageSrc = dataUri;
  }
}
