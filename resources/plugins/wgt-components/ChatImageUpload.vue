<template>
  <div class="chat-image-upload">


      <p class="control" >
        <input :id="name" :name="name" class="input" type="file" placeholder="Imagen"
        @change="previewThumbnail" accept="image/*" >
      </p>

  </div>
</template>

<script>

  import {ImageReader} from './classes/ImageReader.js';

  export default {
    props:{
      imageWidth:{
        type:Number,
        default:800
      },
      imageHeight:{
        type:Number,
        default:600
      },
      name:{
        type:String,
        default:"chat_image_upload"
      }
    },
    data(){
      return {
        newFile:{}
      }
    },
    methods:{

      previewThumbnail(event) {

        var input = event.target;

        if (input.files && input.files[0]) {

        this.loadImage(input.files[0])

        }else{
      //    this.delUploadedImg(event);
          this.newFile = {};
        };

      },

      loadImage(file){

          this.newFile={
            name:file.name,
            status:{
              isReading:true,
              isUnstored:true,
              isUploading:false
            },
            error:[],       
            view_links:{
              'view':false
            },
            admin_links:{
              'delete':false
            }
          };

          let image = new ImageReader(file);

          image.getImageData().then((response)=>{
            image.limitMax(640,480).then((response)=>{
              this.newFile.status.isReading = false
              this.newFile.data = response
              this.$emit('input',response)
            })
          })


      }
    }

  }
</script>

<style scoped>

</style>