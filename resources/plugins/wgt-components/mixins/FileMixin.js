import FormFieldMixin from './FormFieldMixin.js'

export default{
  mixins:[FormFieldMixin],
  methods:{
    fileSizeForHumans(sizeInBytes){
      return Math.round(sizeInBytes / 1000) +'kb'
    },
    trimedName(name){
      return name.substr(0, 32) + '...'
    }
  },
  computed:{
    showDeleteImage(){

      if(this.showSpinner){
        return false
      }

      if(!this.isEdit){
        return true
      }

      if(this.isEdit && !this.newValue.unstored){
        return true
      }

      if(this.newValue.unstored){
        if(this.image.error.length>0){
          return true
        }
      }
      return false

    },
    showSpinner(){

      if(this.newValue.resizing){
        return true
      }

      if(this.isEdit && this.newValue.unstored){
        return true
      }

      if(this.isLoading){
        return true
      }

      return false

    },
    isStored(){

      if(!this.newValue) return false

      if(this.newValue.admin_links.delete){
        return true
      }

      return false

    },

  },
}
