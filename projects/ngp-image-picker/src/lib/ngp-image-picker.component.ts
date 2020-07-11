import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

export interface ImagePickerConf {
  width?: string;
  height?: string;
  borderRadius?: string;
  compressInitial?: boolean;
  language?: string;
}

export interface ImageConverterInput {
  width?: number;
  height?: number;
  quality?: number;
  dataType?: string;
  maintainRatio?: boolean;
}
@Component({
  selector: 'ngp-image-picker',
  templateUrl: './ngp-image-picker.component.html',
  styleUrls: ['./ngp-image-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NgpImagePickerComponent implements OnInit {
  @Input() set _imageSrc(value) {
    if (value != undefined) {
      this.parseToBase64(value).then((dataUri) => {
        // this.imageSrc = dataUri;
        // this.originImageSrc = dataUri;
        this.loadImage = true;
      });
      this.imageSrc = value;
      this.originImageSrc = value;
    }
  }

  @Input() set _config(value) {
    this.processConfig(value);
  }

  config: ImagePickerConf = {
    height: '240px',
    width: '320px',
    borderRadius: '16px',
    compressInitial: true,
    language: 'en',
  };

  @Output() $imageChanged: EventEmitter<any> = new EventEmitter<any>();

  imageSrc: any;
  originImageSrc: any;
  loadImage = false;
  fileType;
  urlImage;
  uuidFilePicker = Date.now().toString(20);
  showEditPanel = false;
  quality = 96;
  format = 'webp';
  allFormats = ['webp', 'jpeg', 'png'];
  maxHeight = 2000;
  maxWidth = 2000;
  maintainAspectRatio = true;
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
    'max-height(px)': 'max. alto',
    Format: 'Formato',
  };
  labelEs: any = {
    'Upload a image': 'Suba una imagen',
    'You must edit the image in order to resize it': 'Debe editar la imagen para disminuir su tamaño',
    'too large': 'muy grande',
    'Open the editor panel': 'Abra el panel de edición',
    'Download the image': 'Descarge la imagen',
    'Control Panel': 'Panel de control',
    Quality: 'Calidad',
    'Max dimensions': 'Dimensiones',
    'aspect-ratio': 'relación-aspecto',
    'max-width(px)': 'max. ancho',
    'max-height(px)': 'max. alto',
    Format: 'Formato',
  };

  labels = this.labelEn;

  constructor() {}

  ngOnInit(): void {}

  onUpload(event) {
    event.preventDefault();
    const element: HTMLElement = document.getElementById('filePicker-' + this.uuidFilePicker) as HTMLElement;
    element.click();
  }

  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    this.fileType = file.type;
    this.urlImage = `data:${file.type};base64,`;
    if (files && file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  async handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    this.originImageSrc = this.urlImage + base64textString;
    if (this.config.compressInitial) {
      this.quality = 92;
      let input: ImageConverterInput = {
        dataType: this.format,
        quality: 0.92,
        maintainRatio: true,
      };
      this.imageSrc = await this.resizedataURL(this.urlImage + base64textString, input);
    } else {
      this.imageSrc = this.urlImage + base64textString;
    }
    this.$imageChanged.next(this.imageSrc);
    this.loadImage = true;
  }

  onOpenEditPanel() {
    this.showEditPanel = true;
    // setTimeout(() => {
    //   this.dragElement(document.getElementById('image-croper'));
    // }, 250);
  }

  parseToBase64(imageUrl) {
    let types = imageUrl.split('.');
    let type = types[types.length - 1];
    console.log('ImagePickerComponent -> ngOnInit -> type', type);
    if (type && (type == 'png' || type == 'jpeg' || type == 'webp')) {
      type = type;
    } else {
      type = 'webp';
    }
    this.format = type;
    return new Promise((resolve, reject) => {
      var img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      this.maxHeight = img.height;
      this.maxWidth = img.width;
      img.onload = function () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var ratio = 1.0;
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataURI = canvas.toDataURL(`image/${type}`, 0.96);
        return resolve({ dataUri: dataURI, width: canvas.width, height: canvas.height });
      };
    }).then((data: any) => {
      // console.log('ImagePickerComponent -> ngOnInit -> data', data);
      this.maxHeight = data.height;
      this.maxWidth = data.width;
      return data.dataUri;
    });
  }

  processConfig(value: ImagePickerConf) {
    if (value.height) {
      this.config.height = value.height;
    }
    if (value.width) {
      this.config.width = value.width;
    }
    if (value.borderRadius) {
      this.config.borderRadius = value.borderRadius;
    }
    if (value.compressInitial) {
      this.config.compressInitial = value.compressInitial;
    }
    if (value.language != undefined) {
      if (value.language == 'en') {
        this.labels = { ...this.labelEn };
      }
      if (value.language == 'es') {
        this.labels = { ...this.labelEs };
      }
    }
  }

  /////////////////////////////////////////////////
  resizedataURL(datas, input: ImageConverterInput): Promise<any> {
    return new Promise(async function (resolve, reject) {
      var img = document.createElement('img');
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
          canvas.width = width;
          canvas.height = width / ratio;
        } else {
          canvas.width = width;
          canvas.height = height;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let type = input.dataType ? input.dataType : 'webp';
        var dataURI = canvas.toDataURL(`image/${type}`, quality);
        resolve({ dataUri: dataURI, width: canvas.width, height: canvas.height });
      };
    }).then((data: any) => {
      // console.log('ImagePickerComponent -> ngOnInit -> data', data);
      this.maxHeight = data.height;
      this.maxWidth = data.width;
      return data.dataUri;
    });
  }

  calculateSize() {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if (this.imageSrc && base64regex.test(this.imageSrc.split(',')[1])) {
      return Math.ceil(((3 / 4) * this.imageSrc.length) / 1024);
    } else {
      return;
    }
  }

  async onChangeQuality(event) {
    let qualityItem = this.quality / 100;
    this.maxHeight = this.maxHeight && +this.maxHeight ? this.maxHeight : 2000;
    // console.log('ImagePickerComponent -> onChangeQuality -> this.maxHeight', this.maxHeight);
    this.maxWidth = this.maxWidth && +this.maxWidth ? this.maxWidth : 2000;
    // console.log('ImagePickerComponent -> onChangeQuality ->  this.maxWidth', this.maxWidth);
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

  async onChangeSize(value) {
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
      };
      this.imageSrc = await this.resizedataURL(this.originImageSrc, input);
      this.$imageChanged.next(this.imageSrc);
      this.loadImage = true;
    } catch (error) {
      this.loadImage = true;
    }
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

  dragElement(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + '-header')) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + '-header').onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      console.log(
        "ImagePickerComponent -> elementDrag -> elmnt.offsetTop - pos2 + 'px';",
        elmnt.offsetTop - pos2 + 'px',
      );
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}
