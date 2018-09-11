<template lang="html">

  <div class="wgt-field image-uploader">

    <label class="label" slot="title">
      <span>{{imageTitle}}</span>
    </label>

    <p class="help">{{help}}</p>

    <div class="field has-addons">

      <p class="control" >
        <input :id="name" :name="name" class="input" type="file" placeholder="Imagen"
        @change="previewThumbnail" accept="image/*" >
      </p>

      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <a class="button is-info" @click="selectImages" :class="{'is-loading':showSpinner}">
              <span class="icon is-small">
                <i class="mdi mdi-plus mdi-24px"></i>
              </span>
              <span>Seleccionar</span>
            </a>
          </div>

          <div class="level-item">
            <a class="button is-danger" :disabled="!showDeleteImage" @click="deleteImage" :class="{'is-loading':showSpinner}">
                <i class="mdi mdi-delete mdi-24px"></i>
              <span>Borrar</span>
            </a>
          </div>

        </div>
      </div>
    </div>

    <wgt-fielderror
    :message="fieldErrors"
    :size="size"
    >
    </wgt-fielderror>

    <br>

    <figure class="image" :class="imageClass" v-if="getImgScr">

      <img class="image-preview" :src="getImgScr" v-if="!showSpinner">

      <div class="action-icon"  v-if="showDeleteImage">
        <b-tooltip label="Borrar">
          <button  v-if="showDeleteImage" class="delete" @click="deleteImage"></button>
        </b-tooltip>
      </div>

      <wgt-spinner :size="imageHeight / 2" v-if="showSpinner"></wgt-spinner>

    </figure>

    <article 
      class="message is-danger"
      v-if="hasErrors">
      
      <div class="message-header">
        <p>Hay problemas con la imagen</p>
        <button class="delete" aria-label="delete" @click="delPreviewImg"></button>
      </div>
    
    </article>

  </div>

</template>

<script>

import {ImageReader} from './classes/ImageReader.js';

import FileMixin from './mixins/FileMixin.js'

export default {
  mixins:[FileMixin],
  props:{
    getUrl:{
      type:String
    },
    imageSrc:{
      type:String,
      default: ''
    },
    noImageSrc:{
      type:String,
      required: true
    },
    imageTitle:{
      type:String,
      default:''
    },
    imageClass:{
      type:String,
      default:'is-4by3'
    },
    imageWidth:{
      type:Number,
      default:640
    },
    imageHeight:{
      type:Number,
      default:480
    },
    imageData:{
      type:Object
    },

  },
  data(){
    return {
      actualImage:this.imageData,
    }
  },
  methods:{
    selectImages(e){
      e.preventDefault;

      this.oldValue = this.actualImage;

      this.imageInput.click();

    },

    previewThumbnail(event) {

      var input = event.target;

      if (input.files && input.files[0]) {

        var file= input.files[0];

        this.newValue={
          name:file.name,
          size:0,
          upload:true,
          src:'',
          blob:'',
          error:[],
          height:0,
          width:0,
          isVertical:true,
          resizing:true,
          unstored:true,
          view_links:{
            'view':false
          },
          admin_links:{
            'delete':false
          }
        };

        if(this.backErrors){
          this.clearErrors()
          this.$nextTick()
        };

        var vm=this;

        new ImageReader(
          file,this.newValue,
          function(){
            this.extrictFit(vm.imageWidth,vm.imageHeight)
       //     this.limitMax(vm.imageWidth,vm.imageHeight)
          });

      }else{
        this.delUploadedImg(event);
        this.newValue = {};
      };

    },
    deleteImage(event){

      event.preventDefault;

      if(this.hasNuevaImagen){

        this.newValue={};

      }else if (this.actualImage.admin_links.delete) {

        var vm = this;

        this.$dialog.confirm({
          type:'is-danger',
          title:'Confirmacion de Borrado',
          message:'Confirma el borrado de esta imagen.',
          confirmText:'Ok',
          hasIcon:true,
          onConfirm:()=>{
            vm.saveField();
          }
        });
      };

      this.delUploadedImg(event);

    },
    delUploadedImg(event){

      this.imageInput.value='';

      this.newValue = {};

    },

    delPreviewImg(event){

      if(this.hasNuevaImagen){

        this.delUploadedImg(event);

      }else if(this.prevImgSrc){

        this.prevImgSrc='';

        this.getImgScr = this.noImageSrc;

        this.$emit('imgdeleted',this.name);

      }
      return true;
    },

    saveField(){

      this.isLoading = true

      this.$emit('field-updated', this.formObject);

    },
    updatedOk(response){

      this.isLoading = false

      this.newValue={}

      this.oldValue ={}

      this.actualImage=response.data

    },
    resetField(){
      this.delPreviewImg();
    }
  },

  computed:{
    getImgScr(){

      if(this.hasNuevaImagen){

        return this.newValue.src;

      }

      if (this.actualImage) {

       return this.actualImage.view_links.view;

      }

      return false;

    },
    imageInput(){
      return document.getElementById(this.name);
    },

    hasErrors(){
      if((this.newValue.error)&&(this.newValue.error.length > 0)){
          return true;
      }
      return false;
    },

    TYPE(){
      return 'file'
    },

    formObject(){

      var infoForForm = {
        'componentId':this._uid,
        'itemId':this.itemId,
        'form':this.form,
        'name':this.name,
        'type':'file',
      }

      if(this.hasNuevaImagen){

        infoForForm.original_name = this.newValue.name

        infoForForm.data = this.newValue.blob

      }

      return infoForForm

    },
    hasNuevaImagen(){
      if(this.newValue.src){
        return true
      }
      return false
    },
    showDeleteImage(){
      if(this.isLoading){
        return false
      }

      if(!this.getImgScr){
        return false
      }

      if(this.showSpinner){
        return false
      }

      return true

    },

  },
  watch:{
    newValue:{
      handler(){



        if(this.newValue.upload && this.isEdit && !this.newValue.resizing){

          this.$emit('field-updated', this.formObject);

        }

      },
      deep:true
    },
    imageData:{
      handler(){
        this.actualImage = this.imageData
      },
      deep:true
    }
  },
  mounted(){


  }
}
</script>

<style lang="scss" scoped>
.image-uploader{

  & input[type="file"]{
    display:none;
  }
  & progress{
    position: absolute;
    left:10%;
    width:80%;
    top:45%
  }

  & figure{
    margin-bottom: 0.75rem;
    background: rgb(239, 239, 239);
  }

  & .image-preview{
    padding: 5px;
    border: solid 1px #EFEFEF;
  }
  & .action-icon{
    position: absolute;
    right:15px;
    top:15px;
  }

  & .sl-spinner{
    position:absolute;
    top:25%;
    margin: auto;
    left:0;
    right:0;
  }
}
</style>
