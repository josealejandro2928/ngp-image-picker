import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ResizeObserver } from 'resize-observer';

export interface ImagePickerConf {
  width?: string;
  height?: string;
  borderRadius?: string;
  compressInitial?: boolean;
  language?: string;
  hideDeleteBtn?: boolean;
  hideDownloadBtn?: boolean;
  hideEditBtn?: boolean;
  hideAddBtn?: boolean;
}

export interface ImageConverterInput {
  width?: number;
  height?: number;
  quality?: number;
  dataType?: string;
  maintainRatio?: boolean;
  changeHeight?: boolean;
  changeWidth?: boolean;
}

@Component({
  selector: 'ngp-image-picker',
  templateUrl: './ngp-image-picker.component.html',
  styleUrls: ['./ngp-image-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgpImagePickerComponent implements OnInit {
  config: ImagePickerConf = {
    height: '240px',
    width: '320px',
    borderRadius: '16px',
    compressInitial: true,
    language: 'en',
    hideDeleteBtn: false,
    hideDownloadBtn: false,
    hideEditBtn: false,
    hideAddBtn: false,
  };

  observer = null;
  showCrop = false;
  imageSrc: any;
  originImageSrc: any;
  loadImage = false;
  fileType;
  urlImage;
  uuidFilePicker = Date.now().toString(20);
  showEditPanel = false;
  quality = 92;
  format = 'jpeg';
  allFormats = ['webp', 'jpeg', 'png'];
  maxHeight = 2000;
  maxWidth = 2000;
  cropHeight = 150;
  cropWidth = 150;
  maintainAspectRatio = true;
  imageName = 'donload';
  lastOriginSrc;
  ///////////////////////////////////////////////////////
  labelEn: any = {
    'Upload a image': 'Upload a image',
    'You must edit the image in order to resize it': 'You must edit the image in order to resize it',
    'too large': 'too large',
    'Open the editor panel': 'Open the editor panel',
    'Download the image': 'Download the image',
    'Control Panel': 'Control Panel',
    Quality: 'Quality',
    'Max dimensions': 'Max dimensions',
    'aspect-ratio': 'aspect-ratio',
    'max-width(px)': 'max-width(px)',
    'max-height(px)': 'max-height(px)',
    Format: 'Format',
    Crop: 'Crop',
    'width(px)': 'width(px)',
    'height(px)': 'height(px)',
    Remove: 'Remove',
  };
  labelEs: any = {
    'Upload a image': 'Suba una imagen',
    'You must edit the image in order to resize it': 'Debe editar la imagen para disminuir su tamaño',
    'too large': 'muy grande',
    'Open the editor panel': 'Abra el panel de edición',
    'Download the image': 'Descarge la imagen',
    'Control Panel': 'Panel de control',
    Remove: 'Quitar',
    Quality: 'Calidad',
    'Max dimensions': 'Dimensiones',
    'aspect-ratio': 'relación-aspecto',
    'max-width(px)': 'max. ancho',
    'max-height(px)': 'max. alto',
    Format: 'Formato',
    Crop: 'Recortar',
    'width(px)': 'ancho(px)',
    'height(px)': 'altura(px)',
  };

  labels = this.labelEn;
  arrayCopiedImages: any[] = [];

  @Input() set _imageSrc(value) {
    if (value != undefined) {
      this.parseToBase64(value).then((dataUri) => {
        this.imageSrc = dataUri;
        this.arrayCopiedImages = [];
        this.arrayCopiedImages.push(this.imageSrc);
        this.originImageSrc = value;
        this.lastOriginSrc = value;
        this.$imageOriginal.next(this.originImageSrc);
        this.loadImage = true;
        this.chRef.markForCheck();
      });
    } else {
      this.imageSrc = null;
      this.originImageSrc = null;
      this.loadImage = false;
      this.arrayCopiedImages = [];
      this.lastOriginSrc = null;
      this.$imageOriginal.next(null);
      this.format = 'jpeg';
      this.maxHeight = 2000;
      this.maxWidth = 2000;
      this.cropHeight = 150;
      this.cropWidth = 150;
      this.maintainAspectRatio = true;
      this.showEditPanel = false;
      this.chRef.markForCheck();
    }
  }

  @Input() set _config(value) {
    this.processConfig(value);
  }

  @ViewChild('imagePicker', { static: false }) imagePicker: ElementRef;
  @Output() $imageChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() $imageOriginal: EventEmitter<any> = new EventEmitter<any>();

  constructor(private chRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onUpload(event) {
    event.preventDefault();
    // const element: HTMLElement = document.getElementById('filePicker-' + this.uuidFilePicker) as HTMLElement;
    this.imagePicker.nativeElement.click();
    // element.click();
  }

  handleFileSelect(evt) {
    const files = evt.target?.files;
    if (files) {
      const file = files[0];
      this.imageName = file.name.split('.')[0];
      // console.log('NgpImagePickerComponent -> handleFileSelect -> file.name', file.name);
      this.fileType = file.type;
      this.urlImage = `data:${file.type};base64,`;
      if (files && file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }
  }

  async handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    const base64textString = btoa(binaryString);
    this.originImageSrc = this.urlImage + base64textString;
    this.lastOriginSrc = this.urlImage + base64textString;
    if (this.config.compressInitial) {
      this.quality = 92;
      const input: ImageConverterInput = {
        dataType: this.format,
        quality: 0.92,
        maintainRatio: true,
      };
      this.imageSrc = await this.resizedataURL(this.urlImage + base64textString, input);
    } else {
      this.imageSrc = this.urlImage + base64textString;
      this.arrayCopiedImages = [];
      this.arrayCopiedImages.push({
        lastImage: this.imageSrc,
        width: this.maxWidth,
        height: this.maxHeight,
        quality: this.quality,
      });
      this.$imageOriginal.next(this.imageSrc);
    }
    this.$imageChanged.next(this.imageSrc);
    this.loadImage = true;
  }

  onOpenEditPanel() {
    this.showEditPanel = true;
  }

  onCloseEditPanel() {
    if (this.observer instanceof ResizeObserver) {
      this.observer.unobserve(document.getElementById('image-croper'));
      this.observer.unobserve(document.getElementById('image-full'));
    }
    this.showCrop = false;
    this.showEditPanel = false;
  }

  parseToBase64(imageUrl) {
    let types = imageUrl.split('.');
    let type = types[types.length - 1];
    // console.log('ImagePickerComponent -> ngOnInit -> type', type);
    if (type && (type == 'png' || type == 'jpeg' || type == 'webp')) {
      type = type;
    } else {
      type = 'jpeg';
    }
    this.format = type;
    return new Promise((resolve, reject) => {
      let img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      this.maxHeight = img.height;
      this.maxWidth = img.width;
      img.onload = function () {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let ratio = 1.0;
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let dataURI = canvas.toDataURL(`image/${type}`, 0.92);
        return resolve({
          dataUri: dataURI,
          width: canvas.width,
          height: canvas.height,
        });
      };
    }).then((data: any) => {
      // console.log('ImagePickerComponent -> ngOnInit -> data', data);
      this.maxHeight = data.height;
      this.maxWidth = data.width;
      return data.dataUri;
    });
  }

  processConfig(value: ImagePickerConf) {
    if (value && value.constructor == Object) {
      this.config = { ...this.config, ...value };
      if (value.language != undefined) {
        if (value.language == 'en') {
          this.labels = { ...this.labelEn };
        }
        if (value.language == 'es') {
          this.labels = { ...this.labelEs };
        }
      }
    }
  }

  /////////////////////////////////////////////////
  resizedataURL(datas, input: ImageConverterInput): Promise<any> {
    return new Promise(async function (resolve, reject) {
      let img = document.createElement('img');
      img.src = datas + '';
      img.crossOrigin = 'Anonymous';
      let quality = input.quality ? input.quality : 1.0;
      let maintainRatio = input.maintainRatio != undefined ? input.maintainRatio : true;

      img.onload = function () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        let ratio = img.width / img.height;
        let width = input.width ? input.width : img.width;
        let height = input.height ? input.height : img.height;

        if (maintainRatio) {
          if (input.changeHeight) {
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

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let type = input.dataType ? input.dataType : 'webp';
        var dataURI = canvas.toDataURL(`image/${type}`, quality);
        resolve({
          dataUri: dataURI,
          width: canvas.width,
          height: canvas.height,
        });
      };
    }).then((data: any) => {
      // console.log('ImagePickerComponent -> ngOnInit -> data', data);
      this.maxHeight = data.height;
      this.maxWidth = data.width;
      if (this.arrayCopiedImages.length <= 20) {
        this.arrayCopiedImages.push({
          lastImage: data.dataUri,
          width: this.maxWidth,
          height: this.maxHeight,
          quality: this.quality,
        });
      }

      return data.dataUri;
    });
  }

  calculateSize() {
    let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if (this.imageSrc && base64regex.test(this.imageSrc.split(',')[1])) {
      return Math.ceil(((3 / 4) * this.imageSrc.length) / 1024);
    } else {
      return;
    }
  }

  async onChangeQuality(event) {
    const qualityItem = this.quality / 100;
    this.maxHeight = this.maxHeight && +this.maxHeight ? this.maxHeight : 2000;
    // console.log('ImagePickerComponent -> onChangeQuality -> this.maxHeight', this.maxHeight);
    this.maxWidth = this.maxWidth && +this.maxWidth ? this.maxWidth : 2000;
    // console.log('ImagePickerComponent -> onChangeQuality ->  this.maxWidth', this.maxWidth);
    await this.wait(250);
    try {
      const input: ImageConverterInput = {
        height: this.maxHeight,
        width: this.maxWidth,
        dataType: this.format,
        quality: qualityItem,
        maintainRatio: this.maintainAspectRatio,
      };

      this.imageSrc = await this.resizedataURL(this.originImageSrc, input);
      this.$imageChanged.next(this.imageSrc);
      this.loadImage = true;
    } catch (error) {
      this.loadImage = true;
    }
  }
  async onChangeFormat(format) {
    let qualityItem = this.quality / 100;
    this.maxHeight = this.maxHeight && +this.maxHeight ? this.maxHeight : 2000;
    this.maxWidth = this.maxWidth && +this.maxWidth ? this.maxWidth : 2000;
    // console.log('ImagePickerComponent -> onChangeFormat -> this.maintainAspectRatio', this.maintainAspectRatio);
    await this.wait(250);
    try {
      let input: ImageConverterInput = {
        height: this.maxHeight,
        width: this.maxWidth,
        dataType: this.format,
        quality: qualityItem,
        maintainRatio: this.maintainAspectRatio,
      };
      this.imageSrc = await this.resizedataURL(this.originImageSrc, input);
      this.$imageChanged.next(this.imageSrc);
      this.loadImage = true;
    } catch (error) {
      this.loadImage = true;
    }
  }

  async onChangeSize(changeWidth?, changeHeight?) {
    let qualityItem = this.quality / 100;
    this.maxHeight = this.maxHeight && +this.maxHeight ? this.maxHeight : 2000;
    this.maxWidth = this.maxWidth && +this.maxWidth ? this.maxWidth : 2000;
    await this.wait(500);

    try {
      let input: ImageConverterInput = {
        height: this.maxHeight,
        width: this.maxWidth,
        dataType: this.format,
        quality: qualityItem,
        maintainRatio: this.maintainAspectRatio,
        changeHeight: changeHeight,
        changeWidth: changeWidth,
      };
      this.imageSrc = await this.resizedataURL(this.originImageSrc, input);
      this.$imageChanged.next(this.imageSrc);
      this.loadImage = true;
    } catch (error) {
      this.loadImage = true;
    }
  }

  onChangeCrop(data) {
    const croper = document.getElementById('image-croper');
    croper.style.width = this.cropWidth + 'px';
    croper.style.height = this.cropHeight + 'px';
  }
  ////////////////////////////////////////////////

  wait(ms?): Promise<any> {
    ms = ms ? ms : 1000;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(true);
      }, ms);
    });
  }

  dragElement(elemnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elemnt.id + '-header')) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elemnt.id + '-header').onmousedown = dragMouseDown;
      document.getElementById(elemnt.id + '-header').ontouchstart = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elemnt.onmousedown = dragMouseDown;
      elemnt.ontouchstart = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.ontouchend = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
      document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
      let holderImage = document.getElementById('image-full');
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      const newTop = elemnt.offsetTop - pos2;
      const newLeft = elemnt.offsetLeft - pos1;
      const rectHolder = holderImage.getBoundingClientRect();
      const rectElemnt = elemnt.getBoundingClientRect();
      if (newTop >= rectHolder.y + 8) {
        elemnt.style.top = Math.min(newTop, rectHolder.y + rectHolder.height - rectElemnt.height - 4) + 'px';
      }
      if (newLeft > rectHolder.x + 4 && rectHolder.x + rectHolder.width > rectElemnt.x + rectElemnt.width + 2) {
        elemnt.style.left = Math.min(newLeft, rectHolder.x + rectHolder.width - rectElemnt.width - 4) + 'px';
      }
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
    }
  }

  onCropStateChange() {
    const croper = document.getElementById('image-croper');
    if (this.showCrop) {
      croper.style.opacity = '1.0';
      this.dragElement(croper);
      this.observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (this.showEditPanel) {
            const elemntCropper = document.getElementById('image-croper');
            const rectHolder = document.getElementById('image-full').getBoundingClientRect();
            const rectElemnt = elemntCropper.getBoundingClientRect();
            const maxWidth = rectHolder.x + rectHolder.width - rectElemnt.x - 4;
            const maxHeight = rectHolder.y + rectHolder.height - rectElemnt.y - 4;
            elemntCropper.style.maxWidth = maxWidth + 'px';
            elemntCropper.style.maxHeight = maxHeight + 'px';
            this.cropWidth = rectElemnt.width;
            this.cropHeight = rectElemnt.height;
            if (entry.target.id == 'image-full') {
              if (rectHolder.top > 0) {
                elemntCropper.style.top = rectHolder.top + 4 + 'px';
              }
              elemntCropper.style.left = rectHolder.left + 4 + 'px';
            }
          }
        });
      });
      this.observer.observe(document.getElementById('image-croper'));
      this.observer.observe(document.getElementById('image-full'));
    } else {
      croper.style.opacity = '0.0';
      if (this.observer instanceof ResizeObserver) {
        this.observer.unobserve(document.getElementById('image-croper'));
        this.observer.unobserve(document.getElementById('image-full'));
      }
    }
  }

  onCrop(type?) {
    type = type ? type : this.format;
    const croper = document.getElementById('image-croper');
    const rectCroper = croper.getBoundingClientRect();
    const dataHolderRect = document.getElementById('image-full').getBoundingClientRect();
    const canvas = document.createElement('canvas');
    new Promise((resolve, reject) => {
      let ctx = canvas.getContext('2d');
      let img = document.getElementById('image-full');
      let image = new Image();
      image.src = this.imageSrc;
      image.onload = () => {
        let ratio = image.height / dataHolderRect.height;
        let newWidth = rectCroper.width * ratio;
        let newHeight = rectCroper.height * ratio;
        canvas.height = newHeight;
        canvas.width = newWidth;
        ctx.drawImage(
          image,
          Math.abs(rectCroper.x * ratio) - Math.abs(dataHolderRect.x * ratio),
          Math.abs(rectCroper.y * ratio) - Math.abs(dataHolderRect.y * ratio),
          newWidth,
          newHeight,
          0,
          0,
          newWidth,
          newHeight,
        );
        // ctx.drawImage(image, 90, 130, 50, 60, 10, 10, 50, 60);
        resolve(canvas.toDataURL(`image/${type}`, 0.98));
      };
      image.onerror = (e) => {
        reject(e);
      };
    })
      .then((dataUri) => {
        // console.log('NgpImagePickerComponent -> onCrop -> dataUri', dataUri);
        this.imageSrc = dataUri;
        this.showCrop = false;
        this.onCropStateChange();
        this.maxWidth = canvas.width;
        this.maxHeight = canvas.height;
        this.lastOriginSrc = this.originImageSrc + '';
        this.originImageSrc = dataUri;
        this.$imageChanged.next(this.imageSrc);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  onRestore() {
    if (this.arrayCopiedImages.length) {
      let lastState = this.arrayCopiedImages.pop();
      this.imageSrc = lastState.lastImage;
      this.maxWidth = lastState.width;
      this.maxHeight = lastState.height;
      this.originImageSrc = this.lastOriginSrc + '';
    } else {
      this.imageSrc = this.lastOriginSrc;
      this.originImageSrc = this.lastOriginSrc + '';
    }
    this.$imageChanged.next(this.imageSrc);
  }

  onRemove() {
    this.imageSrc = null;
    this.originImageSrc = null;
    this.loadImage = false;
    this.arrayCopiedImages = [];
    this.lastOriginSrc = null;
    this.$imageOriginal.next(null);
    this.$imageChanged.next(null);
    this.format = 'jpeg';
    this.maxHeight = 2000;
    this.maxWidth = 2000;
    this.cropHeight = 150;
    this.cropWidth = 150;
    this.maintainAspectRatio = true;
    this.showEditPanel = false;
  }
}
