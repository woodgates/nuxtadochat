import {Errors} from '../classes/error.js';

export default{
  data() {
    return {
      backErrors: new Errors(),
    }
  },

  methods:{

    updateField(patchUrl,fieldData) {

      var form = new FormData();

      form.append('_method', 'PATCH');
      form.append('name', fieldData.name);
      form.append('value',fieldData.value);

      if(fieldData.type === 'file'){
        form.append(fieldData.name,fieldData.data,fieldData.original_name)
      }else{
        form.append(fieldData.name,fieldData.value)
      }

      return new Promise((resolve, reject) => {
        axios.post(patchUrl, form)
          .then(response => {

            this.onUpdateSuccess(response.data,fieldData);

            resolve(response.data);

          })
          .catch(error => {

            if(error.response.status === 419){
      //        VueEvents.$emit('login-redirect')

              return
            }

            this.onUpdateFail(error.response,fieldData);

          });
      });

    },

    onUpdateSuccess(response,data) {

      var updateResponse = {
        name  : data.name,
        form  : this.name,
        itemId: data.itemId,
        componentId:data.componentId,
        message:response.message
      }

      if(data.type=='file'){
        updateResponse.data = response['file-data'];
      }

    //  VueEvents.$emit('field-updated-ok',updateResponse);

    },

    onUpdateFail(response,data){

      if(response.data.errors){

        this.backErrors.record(response.data.errors);

        // VueEvents.$emit('field-update-failed',{
        //   'form'    :this.name,
        //   'errors'  :this.backErrors.get(),
        //   'itemId'  :data.itemId,
        //   'componentId':data.componentId,
        // });

        return;

      }

      // VueEvents.$emit('http-error-response',{
      //   'form'    :this.name,
      //   'response':response
      // })

    },

    restoreField(field){

      return true

    },

    getPatchUrl(){

      return this.itemFields.admin_links.patch

    }
  },

  computed:{
    hasErrors(){

      return this.backErrors.any()
    
    },
  },

  mounted(){

    // VueEvents.$on('field-updated',
    //   (fieldInfo) => {

    //     if(fieldInfo.form === this.name){

    //       this.updateField(this.getPatchUrl(fieldInfo),fieldInfo)

    //     }
    // })

    // VueEvents.$on('field-edit-canceled',
    //   (fieldInfo) => {
    //     if(fieldInfo.form === this.name){

    //       this.restoreField(fieldInfo)

    //     }
    // })


  }
}
