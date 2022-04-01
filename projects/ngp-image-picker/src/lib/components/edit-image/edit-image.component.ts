import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { convertImageUsingCanvas, dragElement, MAX_BUFFER_UNDO_MEMORY, saveState } from '../../functions/image-processing';
import { IBasicFilterState, IState } from '../../models/index.models';

// const Croppr = require('../../services/croppr-service')
@Component({
  selector: 'lib-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent implements OnInit {
  @Input() labels: any;
  @Input() imageSrc: string;
  @Input() color: string;
  controlPanelIndex: number = 0;
  showCrop: boolean = false;
  observer: ResizeObserver = null;
  allFormats = ['webp', 'jpeg', 'png'];

  @Input() initialState: IState | null | any = {};

  state: IState = {
    quality: 92,
    maxHeight: 1000,
    maxWidth: 1000,
    cropHeight: 150,
    cropWidth: 150,
    maintainAspectRatio: true,
    format: 'jpeg',
    arrayCopiedImages: [],
    originImageSrc: '',
  };
  croppState: { x: number; y: number; width: number; height: number };
  croppSize: { width: number; height: number } = { width: 150, height: 150 };
  isMobile = false;

  @Output() closeModal = new EventEmitter<{ state: IState; imageSrc: string } | null | undefined>();

  constructor(private chRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.state = JSON.parse(JSON.stringify({ ...this.state, ...this.initialState }));
    // console.log(this.state);
    this.isMobile = window.innerWidth < 800;
    console.log('🚀 ~ file: edit-image.component.ts ~ line 45 ~ EditImageComponent ~ ngOnInit ~ this.isMobile', this.isMobile);
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

  calculateSize() {
    if (this.imageSrc && this.imageSrc.length) {
      return Math.ceil(((3 / 4) * this.imageSrc.length) / 1024);
    } else {
      return;
    }
  }

  async onChangeSize(changeHeight = false) {
    try {
      this.imageSrc = await convertImageUsingCanvas(this.state.originImageSrc, changeHeight, this.state);
      this.chRef.markForCheck();
    } catch (error) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 76 ~ EditImageComponent ~ onChangeSize ~ error', error);
      this.chRef.markForCheck();
    }
  }

  async onChangeQuality() {
    try {
      this.imageSrc = await convertImageUsingCanvas(this.state.originImageSrc, false, this.state);
      this.chRef.markForCheck();
    } catch (error) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 86 ~ EditImageComponent ~ onChangeQuality ~ error', error);
      this.chRef.markForCheck();
    }
  }

  async onChangeFormat() {
    try {
      this.imageSrc = await convertImageUsingCanvas(this.state.originImageSrc, false, this.state);
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
          originImageSrc: newValue.originImageSrc,
          basicFilters: newValue.basicFilters,
        };
        this.imageSrc = newValue.lastImage;
        this.chRef.markForCheck();
      }
    } catch (e) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 126 ~ EditImageComponent ~ onRestore ~ e', e);
    }
  }

  onCroppUpdate(data: { x: number; y: number; width: number; height: number }) {
    // console.log('🚀 ~ file: edit-image.component.ts ~ line 120 ~ EditImageComponent ~ onCroppUpdate ~ data', data);
    this.croppState = data;
    this.state.cropHeight = data.height;
    this.state.cropWidth = data.width;
  }

  onChangeCrop() {
    this.croppSize = { width: this.state.cropWidth, height: this.state.cropHeight };
  }

  onCrop() {
    // const dataHolderRect = document.querySelector('.croppr-container').getBoundingClientRect();
    const canvas = document.createElement('canvas');
    return new Promise((resolve, reject) => {
      let ctx = canvas.getContext('2d');
      let image = new Image();
      image.src = this.imageSrc;
      image.onload = () => {
        // let ratio = image.height / dataHolderRect.height;
        let newWidth = this.croppState.width;
        let newHeight = this.croppState.height;
        canvas.height = newHeight;
        canvas.width = newWidth;
        ctx.drawImage(
          image,
          Math.abs(this.croppState.x),
          Math.abs(this.croppState.y),
          this.croppState.width,
          this.croppState.height,
          0,
          0,
          this.croppState.width,
          this.croppState.height,
        );
        return resolve(canvas.toDataURL(`image/${this.state.format}`, this.state.quality));
      };
      image.onerror = (e) => {
        reject(e);
      };
    })
      .then((dataUri: string) => {
        this.imageSrc = dataUri;
        this.showCrop = false;
        this.state.maxWidth = canvas.width;
        this.state.maxHeight = canvas.height;
        this.state.originImageSrc = dataUri;
        this.state.cropHeight = 150;
        this.state.cropWidth = 150;
        saveState(this.state, dataUri);
        this.croppSize = { width: 150, height: 150 };
        this.chRef.markForCheck();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async onChangeFilters(data: IBasicFilterState) {
    try {
      if (!this.state.basicFilters) {
        this.state.basicFilters = data;
      } else {
        this.state.basicFilters = { ...this.state.basicFilters, ...data };
      }
      this.imageSrc = await convertImageUsingCanvas(this.state.originImageSrc, false, this.state);
      this.chRef.markForCheck();
    } catch (e) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 250 ~ EditImageComponent ~ onChangeFilters ~ e', e);
    }
  }

  // async onRotate(deg = 90) {
  //   try {
  //     this.imageSrc = await convertImageUsingCanvas(this.state.originImageSrc, false, this.state, { rotate: deg });
  //     this.chRef.markForCheck();
  //   } catch (e) {
  //     console.log('🚀 ~ file: edit-image.component.ts ~ line 250 ~ EditImageComponent ~ onRotate ~ e', e);
  //   }
  // }
}
