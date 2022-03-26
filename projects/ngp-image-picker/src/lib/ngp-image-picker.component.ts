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
import { IState } from './components/edit-image/edit-image.component';
import { convertImageUsingCanvas } from './functions/image-processing';
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
    Contrast: 'Contrast',
    Blur: 'Blur',
    Brightness: 'Brightness',
    Grayscale: 'Grayscale',
    Saturate: 'Saturate',
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
    Contrast: 'Contraste',
    Blur: 'Blur',
    Brightness: 'Brillo',
    Grayscale: 'Scala de gris',
    Saturate: 'Saturación',
    Sepia: 'Sepia',
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
    Contrast: 'Contraste',
    Blur: 'Blur',
    Brightness: 'Luminosité',
    Grayscale: 'Grayscale',
    Saturate: 'Saturer',
    Sepia: 'Seiche',
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
    Contrast: 'Kontrast',
    Blur: 'Blur',
    Brightness: 'Helligkeit',
    Grayscale: 'Graustufen',
    Saturer: 'Sättigen',
    Sepia: 'Tintenfisch',
  };

  labels = this.labelEn;
  arrayCopiedImages: any[] = [];

  @Input() color: string = '#1e88e5';

  @Input() set _imageSrc(value) {
    if (value != undefined) {
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
    };
    this.showEditPanel = false;
  }
}
