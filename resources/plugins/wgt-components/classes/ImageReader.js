export class ImageReader {

    constructor(file) {

      // this.reader = new FileReader();

      this.file =file;

      this.readerResult = null;

    }

    async getImageData() {
      
      this.readerResult = await this.loadImage();
      
      return this.readerResult;

    }

    loadImage() {
      return new Promise((resolve, reject) => {

        let reader = new FileReader();
        
        reader.onload = ()=>resolve(reader.result)

        reader.readAsDataURL(this.file);

      });
    }

    async limitMax (width,height){

      let finalImage = await this._limitMax(width,height)

      return finalImage;
    }

    async extrictFit (width,height){

      let finalImage = await this._extrictFit(width,height)

      return finalImage;
    }


    _limitMax(maxW,maxH){
      return new Promise((resolve,reject)=>{
        var image = new Image()

        image.onload= (imageEvent)=>{

          var imgCanvas=document.createElement('canvas'),
              imageW = image.width,
              imageH = image.height,
              oriWoverH = imageW / imageH,
              finalW=image.width,
              finalH=image.height

          if(imageW > maxW){

            finalW = maxW
            finalH = finalW / oriWoverH

          }

          if(finalH > maxH){
              finalH = maxH
              finalW = finalH * oriWoverH
          }

          imgCanvas.width = finalW;
          imgCanvas.height = finalH;

          var myContext = imgCanvas.getContext('2d')

          myContext.drawImage(image, 0, 0, finalW, finalH);

          URL.revokeObjectURL(image.src)

          resolve(this._newImageData(imgCanvas,finalW,finalH))

        }

      image.src=this.readerResult

    })

    }

    extrictFit(imageWidth,imageHeight){
      return new Promise((resolve)=>{

     
        var image= new Image();

        image.onload=()=>{

          var imgCanvas=document.createElement('canvas');

          imgCanvas.setAttribute('height',imageHeight);
          imgCanvas.setAttribute('width',imageWidth);

          var oriW=image.width,
              oriH=image.height,
              oriWoverH = oriW / oriH,
              newW = imageWidth,
              newH = imageHeight,
              newWoverH = imageWidth / imageHeight;

          var sx = 0,
              sy = 0,
              sWidth=oriW,
              sHeight=oriH,
              dx = 0,
              dy = 0,
              dWidth = imageWidth,
              dHeight= imageHeight

          if(oriWoverH > 1){
            if( oriWoverH < newWoverH){
              sHeight = sWidth / newWoverH;
              sy = (oriH - sHeight) / newWoverH
            }else{
              sWidth =  sHeight * newWoverH;
              sx = (oriW - sWidth )/ newWoverH
            }
          }else{
            dWidth= oriW / oriH * imageHeight;
            dx=(imageWidth - dWidth ) / 2 ;
          }

          var ctx=imgCanvas.getContext('2d');

          ctx.fillStyle="#eeeeee"
          ctx.fillRect(0,0,imageWidth,imageHeight);
          ctx.drawImage(image,sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight);

          URL.revokeObjectURL(image.src)

          resolve(this._newImageData(imgCanvas,finalW,finalH))
        }

        image.src=this.reader.result;

      })
    }

    _newImageData(canvas,width,height){
      return new Promise ((resolve,reject)=>{
      canvas.toBlob((blob)=>{

        resolve({
          'blob':blob,
          src:URL.createObjectURL(blob),
          'width':width,
          'height':height,
          isVertical:(height > height) ? true : false
        })
        
      },'image/jpeg',0.95)
    })
    }

    returnData(data){
      return data;
    }

}
