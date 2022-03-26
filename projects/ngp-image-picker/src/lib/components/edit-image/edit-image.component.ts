import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

export interface ICacheData {
  lastImage: string;
  width: number;
  height: number;
  quality: number;
  format: string;
  imageSrc?: string;
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

  @Input() state: IState = {
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

  onRestore() {}

  calculateSize() {
    if (this.imageSrc && this.imageSrc.length) {
      return Math.ceil(((3 / 4) * this.imageSrc.length) / 1024);
    } else {
      return;
    }
  }

  async onChangeSize(changeHeight = false) {
    try {
      this.imageSrc = await this.resizedataURL(this.originImageSrc, changeHeight);
      console.log(this.state);
      this.chRef.markForCheck();
    } catch (error) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 76 ~ EditImageComponent ~ onChangeSize ~ error', error);
      this.chRef.markForCheck();
    }
  }

  async onChangeQuality() {
    try {
      this.imageSrc = await this.resizedataURL(this.originImageSrc);
      console.log(this.state);
      this.chRef.markForCheck();
    } catch (error) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 86 ~ EditImageComponent ~ onChangeQuality ~ error', error);
      this.chRef.markForCheck();
    }
  }

  async onChangeFormat() {
    try {
      this.imageSrc = await this.resizedataURL(this.originImageSrc);
      console.log(this.state);
      this.chRef.markForCheck();
    } catch (error) {
      console.log('🚀 ~ file: edit-image.component.ts ~ line 98 ~ EditImageComponent ~ onChangeFormat ~ error', error);
      this.chRef.markForCheck();
    }
  }

  resizedataURL(datas, changeHeight = false): Promise<any> {
    return new Promise(async (resolve, _) => {
      let img = document.createElement('img');
      img.src = datas + '';
      img.crossOrigin = 'Anonymous';
      let quality = this.state.quality / 100;
      let maintainRatio = this.state.maintainAspectRatio;

      img.onload = () => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        let ratio = img.width / img.height;
        let width = this.state.maxWidth;
        let height = this.state.maxHeight;

        if (maintainRatio) {
          if (changeHeight) {
            canvas.width = height * ratio;
            canvas.height = height;
          } else {
            canvas.width = width;
            canvas.height = width / ratio;
          }
        } else {
          canvas.width = width;
          canvas.height = height;
        }
        // ctx.filter=`sepia(1)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let type = this.state.format;
        var dataURI = canvas.toDataURL(`image/${type}`, quality);
        resolve({
          dataUri: dataURI,
          width: canvas.width,
          height: canvas.height,
        });
      };
    }).then((data: any) => {
      this.state = { ...this.state, maxHeight: data.height, maxWidth: data.width };
      if (this.state.arrayCopiedImages.length <= 20) {
        this.state.arrayCopiedImages.push({
          lastImage: data.dataUri,
          width: this.state.maxWidth,
          height: this.state.maxHeight,
          quality: this.state.quality,
          format: this.state.format,
        });
      } else {
        this.state.arrayCopiedImages[this.state.arrayCopiedImages.length - 1] = {
          lastImage: data.dataUri,
          width: this.state.maxWidth,
          height: this.state.maxHeight,
          quality: this.state.quality,
          format: this.state.format,
        };
      }
      return data.dataUri;
    });
  }

  wait(ms?): Promise<any> {
    ms = ms ? ms : 1000;
    return new Promise((resolve, _) => {
      setTimeout(() => {
        return resolve(true);
      }, ms);
    });
  }
}
