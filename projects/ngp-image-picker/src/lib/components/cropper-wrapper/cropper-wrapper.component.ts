import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import Croppr from '../../functions/croppr/index';

@Component({
  selector: 'lib-cropper-wrapper',
  templateUrl: './cropper-wrapper.component.html',
  styleUrls: ['./cropper-wrapper.component.scss'],
})
export class CropperWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  imageSrc: string = '';
  croppr: Croppr;
  croppSize: { width: number; height: number } = { width: 150, height: 150 };

  @HostListener('document:keydown.Control', ['$event'])
  onKeyDown() {
    this.croppr.options.aspectRatio = 1.0;
  }
  @HostListener('document:keyup.Control', ['$event'])
  onKeyUp() {
    this.croppr.options.aspectRatio = null;
  }

  @Input() set _imageSrc(value) {
    this.imageSrc = value;
  }

  @Input() set setSize(value) {
    this.croppSize = value;
    if (this.croppr) this.croppr.resizeTo(this.croppSize.width, this.croppSize.height);
  }

  @Output() croppUpdate: EventEmitter<{ x: number; y: number; width: number; height: number }> = new EventEmitter<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>();

  constructor() {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.croppr = new Croppr('#croppr', {
      minSize: [32, 32, 'px'],
      startSize: [this.croppSize.width, this.croppSize.height, 'px'],
      onInitialize: (data: Croppr) => {
        this.croppUpdate.emit(data.getValue());
      },
      onCropEnd: (data: { x: number; y: number; width: number; height: number }) => {
        this.croppUpdate.emit(data);
      },
    });
  }

  ngOnDestroy(): void {
    this.croppr.destroy();
  }
}
