import { IState } from '../components/edit-image/edit-image.component';

export const convertImageUsingCanvas = (
  datas,
  changeHeight = false,
  state: IState,
  options?: { getDimFromImage?: boolean },
): Promise<string> => {
  return new Promise(async (resolve, _) => {
    let img = document.createElement('img');
    img.src = datas + '';
    img.crossOrigin = 'Anonymous';
    let quality = state.quality / 100;
    let maintainRatio = state.maintainAspectRatio;

    img.onload = () => {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      let ratio = img.width / img.height;
      let width = state.maxWidth;
      let height = state.maxHeight;

      if (options?.getDimFromImage) {
        width = img.width;
        height = img.height;
      }

      if (maintainRatio) {
        canvas.width = width;
        canvas.height = width / ratio;
        if (changeHeight) {
          canvas.width = height * ratio;
          canvas.height = height;
        }
      } else {
        canvas.width = width;
        canvas.height = height;
      }
      // ctx.filter=`sepia(1)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let type = state.format;
      var dataURI = canvas.toDataURL(`image/${type}`, quality);
      resolve({
        dataUri: dataURI,
        width: canvas.width,
        height: canvas.height,
      });
    };
  }).then((data: any) => {
    state.maxHeight = data.height;
    state.maxWidth = data.width;

    if (state.arrayCopiedImages.length <= 20) {
      state.arrayCopiedImages.push({
        lastImage: data.dataUri,
        width: state.maxWidth,
        height: state.maxHeight,
        quality: state.quality,
        format: state.format,
      });
    } else {
      state.arrayCopiedImages[state.arrayCopiedImages.length - 1] = {
        lastImage: data.dataUri,
        width: state.maxWidth,
        height: state.maxHeight,
        quality: state.quality,
        format: state.format,
      };
    }
    return data.dataUri;
  });
};
