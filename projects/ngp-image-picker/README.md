# NgpImagePicker

Angular library for the selection, edition and compression of images in png, jpeg and webp formats
This library was generated with Angular CLI version 12.0.0, and support the latest version of angular.
Previous versions of this library relied entirely on angular material components.
Today it is made with html and css without any extra components.
**Recently new functionality has been added. More image editing capabilities, initial compression indexing is now available for the first time an more**

### Description

In many projects it is of interest to upload images for a backend, and sometimes we have to consult other programs for the compression of images and the change of format to improve the performance of the page. With `NgpImagePicker` this is possible in real time with for each image that you want to upload.

### Installation

```sh
npm i ngp-image-picker --save
```

### External Resource

`NgpImagePicker`, for use the functionality of cropping images, the ResizeObserver api is used
The ResizeObserver interface reports changes to the dimensions of an Element's content or border box, or the bounding box of an SVGElement.
Install the package

```sh
npm i resize-observer --save
```

### Usages

You must import the module `NgpImagePicker` where you will use it and use the component

```typescript
***
import { NgpImagePickerModule } from 'ngp-image-picker';
@NgModule({
  ***
  imports: [
    NgpImagePickerModule,
  ],
****
})
```

In your component:

```html
<ngp-image-picker [_config]="imagePickerConf" ($imageChanged)="onImageChange($event)"></ngp-image-picker>
```

In .ts file

```typescript
export class ExampleComponent {
  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'en',
    width: '320px',
    height: '240px',
  };
}
```

### Here is an example with different configurations

```typescript
export class ExampleComponent {
  config1: ImagePickerConf = {
    borderRadius: '16px',
    language: 'en',
  };
  config2: ImagePickerConf = {
    borderRadius: '50%',
    language: 'es',
    width: '200px',
    height: '200px',
  };
  config3: ImagePickerConf = {
    borderRadius: '4px',
    language: 'en',
  };
  initialImage = 'https:example-server.com/public/main.png';
}
```

```html
<h2>Basic ussage</h2>
<ngp-image-picker [_config]="config1"></ngp-image-picker>
<br />
<h2>Custom comfig</h2>
<ngp-image-picker [_config]="config2"></ngp-image-picker>
<br />
<h2>Initial Image</h2>
<ngp-image-picker [_imageSrc]="initialImage" ($imageChanged)="onImageChanged($event)" [_config]="config3"> </ngp-image-picker>
```

![Image 1](https://ngp-image-picker.surge.sh/assets/images/1.png)

### More about the component

The `NgpImagePicker` component has a setting to change the width and length of the loaded image. In addition to the language (|en|es|fr|de|). It also has an initial compression ratio option that by default is null.
It is important to note that the quality factor for image compression is only for formats such as: jpeg and webp.
The interface looks like this:

```typescript
export interface ImagePickerConf {
  width?: string;
  height?: string;
  borderRadius?: string;
  compressInitial?: number; // Range from [1-100]
  language?: string; // |en|es|fr|de| //
}
```

A basic configuration object with compression applied would be:

```typescript
export class ExampleComponent {
  config1: ImagePickerConf = {
    language: 'en',
    compressInitial: 90
  };
 ```

 The above example means that once an image is loaded from the file system, a compression quality is applied to it with a value of 0.9,
 and the resulting image will be reformatted as a jpeg.

### Editing panel

Once you have selected an image, 4 buttons are enabled below the image:

1. load a new image.
2. Open the editing panel.
3. Download the image.
4. Delete the image.

In the edit panel, you can change the quality ratio to compress the file size (in kb). Also changing width and height in px keeping aspect ratio or not, is selectable. You can change the image format as you wish, the options are 'png', 'webp','jpeg'.
The 'Png' format is not affected by changing the quality ratio.
Another capability is that you can crop the image by simply dragging and dropping the cropping component. And by clicking on the crop button.

**I just added a new tab for applying filters**. Now you can not only crop, compress and reformat your image, but you have new features like:

1. Contrast level
2. Brigthness level
3. Gray
4. Sepia
5. Saturation
6. Blur

🔥🔥🔥🔥🔥 You can have in your website a component like the instagram or linkedin for editing your images. 🔥🔥🔥🔥🔥

![Image 1](https://ngp-image-picker.surge.sh/assets/images/tab-section.png)
![Image 2](https://ngp-image-picker.surge.sh/assets/images/2.png)

### Control section

![Image 3](https://ngp-image-picker.surge.sh/assets/images/n-1.png)
![Image 3](https://ngp-image-picker.surge.sh/assets/images/n-2.png)
![Image 3](https://ngp-image-picker.surge.sh/assets/images/n-3.png)
![Image 3](https://ngp-image-picker.surge.sh/assets/images/n-4.png)

### Croping images

![Image 4](https://ngp-image-picker.surge.sh/assets/images/5.png)

### All together

### [DEMO](https://ngp-image-picker.surge.sh/)
