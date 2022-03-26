import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { convertImageUsingCanvas } from '../../functions/image-processing';
export interface ICacheData {
  lastImage: string;
  width: number;
  height: number;
  quality: number;
  format: string;
}
export interface IState {
  quality: number;
  maxHeight: number;
  maxWidth: number;
  cropHeight: number;
  cropWidth: number;
  maintainAspectRatio: boolean;
  format: string;
  arrayCopiedImages: Array<ICacheData>;
}
@Component({
  selector: 'lib-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent implements OnInit {
  @Input() labels: any;
  @Input() imageSrc: string;
  @Input() originImageSrc: string;
  @Input() color: string;
  controlPanelIndex: number = 0;
  showCrop: boolean;
  observer: ResizeObserver = null;
  allFormats = ['webp', 'jpeg', 'png', 'svg'];

  @Input() initialState: IState | null | any = {};

  state: IState = {
    quality: 92,
    maxHeight: 4000,
    maxWidth: 4000,
    cropHeight: 150,
    cropWidth: 150,
    maintainAspectRatio: true,
    format: 'jpeg',
    arrayCopiedImages: [],
  };

  @Output() closeModal = new EventEmitter<{ state: IState; imageSrc: string } | null | undefined>();

  constructor(private chRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.state = JSON.parse(JSON.stringify({ ...this.state, ...this.initialState }));
    console.log(this.state);
  }

  onCloseEditPanel(saveChanges: boolean = false) {
    if (this.observer instanceof ResizeObserver) {
      this.observer.unobserve(document.getElementById('image-croper'));
      this.observer.unobserve(document.getElementById('image-full'));
    }
    this.showCrop = false;
    if (saveChanges) this.closeModal.next({ state: this.state, imageSrc: this.imageSrc });
    else this.closeModal.next(null);
  }

  onControlPanelIndexChange(idex: number) {
    this.controlPanelIndex = idex;
  }

  onCropStateChange() {}

  calculateSize() {
    if (this.imageSrc && this.imageSrc.length) {
      return Math.ceil(((3 / 4) * this.imageSrc.length) / 1024);
    } else {
      return;
    }
  }

  async onChangeSize(changeHeight = false) {
    try {
      this.imageSrc = await convertImageUsingCanvas(this.originImageSrc, changeHeight, this.state);
      this.chRef.markForCheck();
    } catch (error) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 76 ~ EditImageComponent ~ onChangeSize ~ error', error);
      this.chRef.markForCheck();
    }
  }

  async onChangeQuality() {
    try {
      this.imageSrc = await convertImageUsingCanvas(this.originImageSrc, false, this.state);
      this.chRef.markForCheck();
    } catch (error) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 86 ~ EditImageComponent ~ onChangeQuality ~ error', error);
      this.chRef.markForCheck();
    }
  }

  async onChangeFormat() {
    try {
      this.imageSrc = await convertImageUsingCanvas(this.originImageSrc, false, this.state);
      this.chRef.markForCheck();
    } catch (error) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 98 ~ EditImageComponent ~ onChangeFormat ~ error', error);
      this.chRef.markForCheck();
    }
  }

  async onRestore() {
    try {
      if (this.state.arrayCopiedImages.length > 1) {
        this.state.arrayCopiedImages.pop();
        let newValue = this.state.arrayCopiedImages[this.state.arrayCopiedImages.length - 1];
        this.state = {
          ...this.state,
          maxHeight: newValue.height,
          maxWidth: newValue.width,
          quality: newValue.quality,
          format: newValue.format,
        };
        this.imageSrc = newValue.lastImage;
        this.chRef.markForCheck();
      }
    } catch (e) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 126 ~ EditImageComponent ~ onRestore ~ e', e);
    }
    // console.log('====================================');
    // console.log(this.arrayCopiedImages);
    // console.log('====================================');
    // if (this.state.arrayCopiedImages.length > 1) {
    //   let lastState = this.state.arrayCopiedImages.pop();
    //   this.imageSrc = lastState.lastImage;
    //   this.state = { ...this.state, maxHeight: lastState.height, maxWidth: lastState.width };
    //   this.originImageSrc = this.lastOriginSrc + '';
    //   this.chRef.markForCheck();
    // } else {
    //   this.imageSrc = this.lastOriginSrc;
    //   this.originImageSrc = this.lastOriginSrc + '';
    // }
    // this.$imageChanged.next(this.imageSrc);
  }
}
