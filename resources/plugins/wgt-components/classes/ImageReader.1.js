export class ImageReader {

    constructor(file,lImg,callback) {

      this.finalImageData={}

      this.reader = new FileReader();

      this.file =file;
      this.lImg=lImg;

      this.reader.onload= (event)=>{

        callback.call(this);

      };

      this.reader.readAsDataURL(file);

    }

    limitMax(maxW,maxH){

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

        return this.setNewImageValues(imgCanvas,finalW,finalH)

      }

      image.src=this.reader.result

    }

    extrictFit(imageWidth,imageHeight){

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

        this.setNewImageValues(imgCanvas,imageWidth,imageHeight)
      }

      image.src=this.reader.result;
    }

    setNewImageValues(canvas,width,height){

      canvas.toBlob((blob)=>{

        this.lImg.data.size=blob.size
        this.lImg.data.blob = blob;
        this.lImg.data.src=URL.createObjectURL(blob)
        this.lImg.data.width=width
        this.lImg.data.height=height
        this.lImg.data.isVertical = (height > height) ? true : false

        this.lImg.status.isReading = false
        
      },'image/jpeg',0.95)

    }

    returnData(data){
      return data;
    }

}
