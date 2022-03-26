import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ResizeObserver } from 'resize-observer';
import { IState } from './components/edit-image/edit-image.component';
import { convertImageUsingCanvas } from './functions/image-processing';

export interface ImageConverterInput {
  width?: number;
  height?: number;
  quality?: number;
  dataType?: string;
  maintainRatio?: boolean;
  changeHeight?: boolean;
  changeWidth?: boolean;
}

export interface ImagePickerConf {
  width?: string;
  height?: string;
  borderRadius?: string;
  compressInitial?: number | undefined | null;
  language?: string;
  hideDeleteBtn?: boolean;
  hideDownloadBtn?: boolean;
  hideEditBtn?: boolean;
  hideAddBtn?: boolean;
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
    language: 'en',
    compressInitial: 92,
    hideDeleteBtn: false,
    hideDownloadBtn: false,
    hideEditBtn: false,
    hideAddBtn: false,
  };

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

  observer = null;
  showCrop = false;
  imageSrc: any;
  originImageSrc: any;
  loadImage = false;
  fileType;
  urlImage;
  uuidFilePicker = Date.now().toString(20);
  showEditPanel = false;
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
    Save: 'Save',
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
    Save: 'Guardar',
  };
  labelFr: any = {
    'Upload a image': 'Charger une image',
    'You must edit the image in order to resize it': "Vous devez éditer l'image pour changer sa taille",
    'too large': 'Trop grande',
    'Open the editor panel': "Ouvrir le panneau d'édition",
    'Download the image': "Télécharger l'image",
    'Control Panel': 'Panneau de commande',
    Remove: 'Supprimer',
    Quality: 'Qualité',
    'Max dimensions': 'Dimensions maximales',
    'aspect-ratio': 'rapport de forme',
    'max-width(px)': 'largeur max.',
    'max-height(px)': 'hauteur max',
    Format: 'Format',
    Crop: 'Recadrer',
    'width(px)': 'largeur(px)',
    'height(px)': 'hauteur(px)',
    Save: 'Sauvez',
  };
  labelDe: any = {
    'Upload a image': 'Bild hochladen',
    'You must edit the image in order to resize it': 'Sie müssen das Bild bearbeiten, um seine Größe zu ändern',
    'too large': 'zu groß',
    'Open the editor panel': 'Editor-Fenster öffnen',
    'Download the image': 'Bild herunterladen',
    'Control Panel': 'Bedienfeld',
    Quality: 'Qualität',
    'Max dimensions': 'Maximale Größe',
    'aspect-ratio': 'Seitenverhältnis',
    'max-width(px)': 'Max. Breite(px)',
    'max-height(px)': 'Max. Höhe(px)',
    Format: 'Format',
    Crop: 'Zuschneiden',
    'width(px)': 'Breite(px)',
    'height(px)': 'Höhe(px)',
    Remove: 'Entfernen',
    Save: 'Speichern',
  };

  labels = this.labelEn;
  arrayCopiedImages: any[] = [];

  @Input() color: string = '#1e88e5';

  @Input() set _imageSrc(value) {
    if (value != undefined) {
      this.parseToBase64(value).then((dataUri) => {
        this.imageSrc = dataUri;
        this.state.arrayCopiedImages.push({
          lastImage: dataUri,
          width: this.state.maxWidth,
          height: this.state.maxHeight,
          quality: this.state.quality,
          format: this.state.format,
        });
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
      this.state.arrayCopiedImages = [];
      this.lastOriginSrc = null;
      this.$imageOriginal.next(null);
      this.state = {
        ...this.state,
        format: 'jpeg',
        maxHeight: 4000,
        maxWidth: 4000,
        cropHeight: 150,
        cropWidth: 150,
        maintainAspectRatio: true,
      };
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

  ngOnInit(): void {
    this.appendLinkIconsToHead();
  }

  appendLinkIconsToHead() {
    let head: HTMLElement = document.head;
    let linkIcons: HTMLElement = head.querySelector('#ngp-image-picker-icons-id');
    if (linkIcons) return;
    let link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    link.id = 'ngp-image-picker-icons-id';
    head.appendChild(link);
  }

  onUpload(event) {
    event.preventDefault();
    this.imagePicker.nativeElement.click();
  }

  handleFileSelect(evt) {
    const files = evt.target?.files;
    if (files) {
      const file = files[0];

      this.imageName = file.name.split('.')[0];
      this.fileType = file.type;
      if (!this.fileType.includes('image')) return;
      this.urlImage = `data:${file.type};base64,`;
      if (file) {
        this.state.format = this.fileType.split('image/')[1];
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
      this.state = {
        ...this.state,
        quality: Math.min(this.config.compressInitial || 92, 100),
        maintainAspectRatio: true,
      };
      this.imageSrc = await convertImageUsingCanvas(this.urlImage + base64textString, false, this.state, { getDimFromImage: true });
    } else {
      this.imageSrc = this.urlImage + base64textString;
      let img = document.createElement('img');
      img.src = this.imageSrc;
      img.onload = () => {
        this.state.arrayCopiedImages = [];
        this.state.maxHeight = img.height;
        this.state.maxWidth = img.width;
        this.state.arrayCopiedImages.push({
          lastImage: this.imageSrc,
          width: img.width,
          height: img.height,
          quality: this.state.quality,
          format: this.state.format,
        });
      };
    }
    this.$imageChanged.next(this.imageSrc);
    this.loadImage = true;
    this.chRef.markForCheck();
  }

  onOpenEditPanel() {
    this.showEditPanel = true;
  }

  onCloseEditPanel(data) {
    if (data) {
      this.state = data.state;
      this.imageSrc = data.imageSrc;
    }
    this.showEditPanel = false;
  }

  parseToBase64(imageUrl) {
    let types = imageUrl.split('.');
    let type = types[types.length - 1];
    if (type && (type == 'png' || type == 'jpeg' || type == 'webp')) {
      type = type;
    } else {
      type = 'jpeg';
    }

    this.state = {
      ...this.state,
      format: type,
    };

    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      this.state = {
        ...this.state,
        maxHeight: img.height,
        maxWidth: img.width,
      };
      img.onload = () => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let ratio = 1.0;
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let dataURI = canvas.toDataURL(`image/${type}`, this.state.quality);
        return resolve({
          dataUri: dataURI,
          width: canvas.width,
          height: canvas.height,
        });
      };
      img.src = imageUrl;
    }).then((data: any) => {
      this.state = {
        ...this.state,
        maxHeight: data.height,
        maxWidth: data.width,
      };
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
        if (value.language == 'fr') {
          this.labels = { ...this.labelFr };
        }
        if (value.language == 'de') {
          this.labels = { ...this.labelDe };
        }
      }
    }
  }

  calculateSize() {
    if (this.imageSrc && this.imageSrc.length) {
      return Math.ceil(((3 / 4) * this.imageSrc.length) / 1024);
    } else {
      return;
    }
  }

  // onChangeCrop(data) {
  //   const croper = document.getElementById('image-croper');
  //   croper.style.width = this.cropWidth + 'px';
  //   croper.style.height = this.cropHeight + 'px';
  //   // this.chRef.markForCheck();
  // }

  ////////////////////////////////////////////////

  // dragElement(elemnt) {
  //   var pos1 = 0,
  //     pos2 = 0,
  //     pos3 = 0,
  //     pos4 = 0;
  //   if (document.getElementById(elemnt.id + '-header')) {
  //     /* if present, the header is where you move the DIV from:*/
  //     document.getElementById(elemnt.id + '-header').onmousedown = dragPressOn;
  //     document.getElementById(elemnt.id + '-header').ontouchstart = dragPressOn;
  //   } else {
  //     /* otherwise, move the DIV from anywhere inside the DIV:*/
  //     elemnt.ontouchstart = dragPressOn;
  //     elemnt.onmousedown = dragPressOn;
  //   }

  //   function dragPressOn(e) {
  //     let popup: any = document.querySelector('#popup');
  //     popup.style.overflowY = 'hidden';
  //     e = e || window.event;
  //     pos3 = e.clientX;
  //     pos4 = e.clientY;
  //     document.ontouchend = closeDragElement;
  //     document.onmouseup = closeDragElement;
  //     document.ontouchmove = elementDragTouch;
  //     document.onmousemove = elementDragMouse;
  //   }

  //   function elementDragMouse(e) {
  //     let holderImage = document.getElementById('image-full');
  //     e = e || window.event;
  //     pos1 = pos3 - e.clientX;
  //     pos3 = e.clientX;
  //     pos2 = pos4 - e.clientY;
  //     pos4 = e.clientY;

  //     let newTop = elemnt.offsetTop - pos2;
  //     let newLeft = elemnt.offsetLeft - pos1;
  //     let rectHolder = holderImage.getBoundingClientRect();
  //     let rectElemnt = elemnt.getBoundingClientRect();
  //     // console.log('====================================');
  //     // console.log(rectElemnt,rectHolder);
  //     // console.log('====================================');
  //     newTop = Math.max(newTop, rectHolder.top);
  //     newTop = Math.min(newTop, rectHolder.bottom - rectElemnt.height);
  //     newLeft = Math.max(newLeft, rectHolder.left);
  //     newLeft = Math.min(newLeft, rectHolder.right - rectElemnt.width);
  //     elemnt.style.top = newTop + 'px';
  //     elemnt.style.left = newLeft + 'px';
  //   }

  //   function elementDragTouch(e) {
  //     let holderImage = document.getElementById('image-full');
  //     e = e || window.event;

  //     if (e?.changedTouches?.length) {
  //       pos1 = pos3 - e.changedTouches[0]?.clientX;
  //       pos3 = e.changedTouches[0]?.clientX;
  //     }
  //     if (e?.changedTouches?.length) {
  //       pos2 = pos4 - e.changedTouches[0]?.clientY;
  //       pos4 = e.changedTouches[0]?.clientY;
  //     }

  //     let newTop = elemnt.offsetTop - pos2;
  //     let newLeft = elemnt.offsetLeft - pos1;
  //     let rectHolder = holderImage.getBoundingClientRect();
  //     let rectElemnt = elemnt.getBoundingClientRect();

  //     // console.log('====================================');
  //     // console.log(rectElemnt,rectHolder);
  //     // console.log('====================================');

  //     newTop = Math.max(newTop, rectHolder.top);
  //     newTop = Math.min(newTop, rectHolder.bottom - rectElemnt.height);
  //     newLeft = Math.max(newLeft, rectHolder.left);
  //     newLeft = Math.min(newLeft, rectHolder.right - rectElemnt.width);
  //     elemnt.style.top = newTop + 'px';
  //     elemnt.style.left = newLeft + 'px';
  //   }

  //   function closeDragElement() {
  //     /* stop moving when mouse button is released:*/
  //     let popup: any = document.querySelector('#popup');
  //     popup.style.overflowY = 'auto';
  //     document.onmouseup = null;
  //     document.onmousemove = null;
  //     document.ontouchend = null;
  //     document.ontouchmove = null;
  //   }
  // }

  // onCropStateChange() {
  //   const croper = document.getElementById('image-croper');
  //   if (this.showCrop) {
  //     croper.style.opacity = '1.0';
  //     this.dragElement(croper);
  //     this.observer = new ResizeObserver((entries) => {
  //       entries.forEach((entry) => {
  //         if (this.showEditPanel) {
  //           const elemntCropper = document.getElementById('image-croper');
  //           const rectHolder = document.getElementById('image-full').getBoundingClientRect();
  //           const rectElemnt = elemntCropper.getBoundingClientRect();
  //           const maxWidth = rectHolder.x + rectHolder.width - rectElemnt.x - 1;
  //           const maxHeight = rectHolder.y + rectHolder.height - rectElemnt.y - 1;
  //           elemntCropper.style.maxWidth = maxWidth + 'px';
  //           elemntCropper.style.maxHeight = maxHeight + 'px';
  //           this.cropWidth = rectElemnt.width;
  //           this.cropHeight = rectElemnt.height;
  //           if (entry.target.id == 'image-full') {
  //             if (rectHolder.top > 0) {
  //               elemntCropper.style.top = rectHolder.top + 1 + 'px';
  //             }
  //             elemntCropper.style.left = rectHolder.left + 1 + 'px';
  //           }
  //         }
  //       });
  //     });
  //     this.observer.observe(document.getElementById('image-croper'));
  //     this.observer.observe(document.getElementById('image-full'));
  //   } else {
  //     croper.style.opacity = '0.0';
  //     if (this.observer instanceof ResizeObserver) {
  //       this.observer.unobserve(document.getElementById('image-croper'));
  //       this.observer.unobserve(document.getElementById('image-full'));
  //     }
  //   }
  // }

  // onCrop(type?) {
  //   type = type ? type : this.format;
  //   const croper = document.getElementById('image-croper');
  //   const rectCroper = croper.getBoundingClientRect();
  //   const dataHolderRect = document.getElementById('image-full').getBoundingClientRect();
  //   const canvas = document.createElement('canvas');
  //   return new Promise((resolve, reject) => {
  //     let ctx = canvas.getContext('2d');
  //     let img = document.getElementById('image-full');
  //     let image = new Image();
  //     image.src = this.imageSrc;
  //     image.onload = () => {
  //       let ratio = image.height / dataHolderRect.height;
  //       let newWidth = rectCroper.width * ratio;
  //       let newHeight = rectCroper.height * ratio;
  //       canvas.height = newHeight;
  //       canvas.width = newWidth;
  //       ctx.drawImage(
  //         image,
  //         Math.abs(rectCroper.x * ratio) - Math.abs(dataHolderRect.x * ratio),
  //         Math.abs(rectCroper.y * ratio) - Math.abs(dataHolderRect.y * ratio),
  //         newWidth,
  //         newHeight,
  //         0,
  //         0,
  //         newWidth,
  //         newHeight,
  //       );
  //       // ctx.drawImage(image, 90, 130, 50, 60, 10, 10, 50, 60);
  //       return resolve(canvas.toDataURL(`image/${type}`, 0.98));
  //     };
  //     image.onerror = (e) => {
  //       reject(e);
  //     };
  //   })
  //     .then((dataUri) => {
  //       // console.log('NgpImagePickerComponent -> onCrop -> dataUri', dataUri);
  //       this.imageSrc = dataUri;
  //       this.showCrop = false;
  //       this.onCropStateChange();
  //       this.maxWidth = canvas.width;
  //       this.maxHeight = canvas.height;
  //       this.lastOriginSrc = this.originImageSrc + '';
  //       this.originImageSrc = dataUri;
  //       this.$imageChanged.next(this.imageSrc);
  //       this.chRef.markForCheck();
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }

  onRemove() {
    this.imageSrc = null;
    this.originImageSrc = null;
    this.loadImage = false;
    this.lastOriginSrc = null;
    this.$imageOriginal.next(null);
    this.$imageChanged.next(null);
    this.state = {
      ...this.state,
      format: 'jpeg',
      maxHeight: 4000,
      maxWidth: 4000,
      cropHeight: 150,
      cropWidth: 150,
      maintainAspectRatio: true,
      arrayCopiedImages: [],
    };
    this.showEditPanel = false;
  }
}
