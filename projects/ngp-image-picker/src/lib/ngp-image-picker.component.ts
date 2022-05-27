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
import { convertImageUsingCanvas } from './functions/image-processing';
import { ImagePickerConf, IState } from './models/index.models';
import labelEs from './i18n/es.json';
import labelEn from './i18n/en.json';
import labelFr from './i18n/fr.json';
import labelDe from './i18n/de.json';

@Component({
  selector: 'ngp-image-picker',
  templateUrl: './ngp-image-picker.component.html',
  styleUrls: ['./ngp-image-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgpImagePickerComponent implements OnInit {
  config: ImagePickerConf = {
    language: 'en',
    objectFit: 'cover',
    hideDeleteBtn: false,
    hideDownloadBtn: false,
    hideEditBtn: false,
    hideAddBtn: false,
  };

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
  imageSrc: any;
  loadImage = false;
  fileType;
  urlImage;
  uuidFilePicker = Date.now().toString(20);
  showEditPanel = false;
  imageName = 'donload';
  labels: any = labelEn;
  arrayCopiedImages: any[] = [];

  @Input() color: string = '#1e88e5';

  @Input() set _imageSrc(value) {
    if (value) {
      this.parseToBase64(value).then((dataUri) => {
        this.imageSrc = dataUri;
        this.state.originImageSrc = value;
        this.state.arrayCopiedImages.push({
          lastImage: dataUri,
          width: this.state.maxWidth,
          height: this.state.maxHeight,
          quality: this.state.quality,
          format: this.state.format,
          originImageSrc: value,
        });
        this.$imageOriginal.next(this.state.originImageSrc);
        this.loadImage = true;
        this.chRef.markForCheck();
      });
    } else {
      this.imageSrc = null;
      this.state.originImageSrc = null;
      this.loadImage = false;
      this.state.arrayCopiedImages = [];
      this.$imageOriginal.next(null);
      this.state = {
        ...this.state,
        format: 'jpeg',
        maxHeight: 1000,
        maxWidth: 1000,
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
    this.state.originImageSrc = this.urlImage + base64textString;
    if (this.config.compressInitial) {
      this.state = {
        ...this.state,
        quality: Math.min(this.config.compressInitial || 92, 100),
        maintainAspectRatio: true,
        format: 'jpeg',
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
          originImageSrc: this.state.originImageSrc,
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
      this.$imageChanged.next(this.imageSrc);
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
      img.onerror = (e: any) => {
        return reject(e.message || `Error loading the src = ${imageUrl}`);
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
          this.labels = { ...labelEn };
        }
        if (value.language == 'es') {
          this.labels = { ...labelEs };
        }
        if (value.language == 'fr') {
          this.labels = { ...labelFr };
        }
        if (value.language == 'de') {
          this.labels = { ...labelDe };
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

  ////////////////////////////////////////////////

  onRemove() {
    this.imageSrc = null;
    this.loadImage = false;
    this.$imageOriginal.next(null);
    this.$imageChanged.next(null);
    this.state = {
      ...this.state,
      originImageSrc: '',
      format: 'jpeg',
      maxHeight: 1000,
      maxWidth: 1000,
      cropHeight: 150,
      cropWidth: 150,
      maintainAspectRatio: true,
      arrayCopiedImages: [],
      basicFilters: null,
      quality: 92,
    };
    this.showEditPanel = false;
  }
}
