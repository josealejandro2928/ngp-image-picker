import { Injectable } from '@angular/core';

export interface ImageConverterInput {
  width?: number;
  height?: number;
  quality?: number;
  dataType?: string;
  maintainRatio?: boolean;
  changeHeight?: boolean;
  changeWidth?: boolean;
}
@Injectable()
export class StoreService {
  imageEditorState: ImageConverterInput = {
    width: 0,
    height: 0,
    quality: 0.92,
    dataType: 'jpeg',
    maintainRatio: true,
    changeHeight: false,
    changeWidth: false,
  };

  constructor() {}
}
