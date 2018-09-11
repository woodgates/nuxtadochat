
<script>

import FieldUpdateMixin from './mixins/FieldUpdateMixin.js';

export default {
  inheritAttrs:false,
  mixins:[FieldUpdateMixin],
  props: {
    name: {
      type: String,
      required:true
    },
    postUrl: {
      type: String,
    },
    getItem: {
      type: String
    },
    editMode: {
      type: Boolean,
      default: false
    },
    redirectUrl:{
      type:String,
    }
  },

  data() {
    return {
      itemFields:{},
      isEdit:this.editMode,
      isLoading:false,
      getUrl:this.getItem,
      blockingSubmit:[],
      hasBackErrors:false,
      vform:{}
    }
  },

  methods: {

    reset() {

      this.isLoading = false;

      this.backErrors.clear();

      this.itemFields = {};

   //   VueEvents.$emit('reset-form-fields',{'form':this.name})
    },

    generateFormData() {

      let form = new FormData()

      this.vform.inputs.forEach(field=>{
      
        form.append(field.$attrs.name,field.value)

      })

      return form

    },

    submitForm(event) {
      event.preventDefault();

      this.isLoading = true

      var form = this.generateFormData();

      return new Promise((resolve, reject) => {
        this.$axios.$post(this.postUrl, form)
          .then(response => {

            this.onSubmitSuccess(response);

          })
          .catch(error => {

            this.onSubmitFail(error.response.data);

          });
      });
    },

    onSubmitSuccess(respuesta){
      this.isLoading = false
    
      this.vform.reset();

      this.$emit('submit-success', respuesta);

    },

    onSubmitFail(error) {

      this.isLoading = false

      this.$nextTick()

      this.backErrors.record(error.errors)

      this.hasBackErrors = this.backErrors.any()

      this.$forceUpdate()

      this.$toast.open({
        'message' :'Hubo un error, corrige la informacion por favor.',
        'type'  : 'is-warning'
      });

    },

    showMessage(messageText,messageType) {

      this.$toast.open({
        message:messageText,
        position:'is-top',
        type:messageType
      });

    },

    get() {
      return new Promise((resolve, reject) => {
        axios['get'](this.getUrl)
          .then(response => {

            this.getSuccess(response.data);

        //    resolve(response.data);

          })
          .catch(error => {

            reject(error.response.data);

          });
      });
    },

    getSuccess(data) {

      this.itemFields = data.data;

    },

    redirect(message,type){

      this.$toast.open({
        'message':message,
        'type':type,
        'onAfterLeave':()=>{
          window.location = this.redirectUrl
        }
      })

    },

    restoreField(fieldInfo){
      this.itemFields[fieldInfo['name']] = fieldInfo['value']
    },

    keyLength(){
      return Object.keys(this.backErrors.errors).length
    }

  },

  computed:{

    itemId(){
      return this.itemFields.id
    },

    blockSubmit(){

      if(this.hasBackErrors ||
          ( this.frontErrors.items.length > 0 ) ||
          this.isLoading ||
          this.fieldsBlockingSubmit){
        return true
      }

      return false
    },

    fieldsBlockingSubmit(){

        return this.blockingSubmit.length

    },


  },

  created(){

  },
  mounted() {
    
    this.vform = this.$refs.vform;

  }
}
</script>

<style lang="css">
</style>
