export default{
  inject: ['$validator'],
  props:{
    name:{
      type:String,
      required: true
    },
    label:{
      type:String,
      default: ''
    },
    help:{
      type:String,
      default:''
    },
    value:{
      type:[Object,String,Number,Array,Boolean]
    },
    formId:{
      type:String
    },
    itemIdProps:{
      type:Number
    },
    editMode:{
      type:Boolean
    },
    size:{
      type:String
    }

  },
  data(){
    return{
      isEdit:(this.editMode || this.$parent.isEdit),
      form:this.formId || this.$parent.name,
      newValue:this.value || '',
      oldValue:this.value,
      isLoading:false,
      backErrors:[],
      itemId:this.itemIdProps,
      disabled:true
    }
  },
  methods:{

    editField(event){

      this.disabled = false

      this.oldValue = this.value

      this.focus()

    },

    saveField(){

      this.disabled = true

   //   if(this.isEdit){
        this.isLoading = true
   //   }

      VueEvents.$emit('field-updated', this.formObject);

    },

    focus(){
      Vue.nextTick(()=> {
        this.$refs.input.focus()
      });
    },

    cancelEdit(){

      this.disabled = true

      this.newValue = this.oldValue;
      this.clearErrors()

      this.$emit('input',this.newValue)
      VueEvents.$emit('field-edit-canceled', this.formObject);

    },

    updatedOk(){
      this.oldValue = this.newValue;
      this.isLoading = false

    },

    updatedFailed(message){
      this.disabled = false
      this.isLoading = false
      this.newValue=this.oldValue

      if(this.$refs.label){
        this.$refs.label.activateEdit()
      }

    },
    setValueMixin(value){

      if(this.backErrors){
        this.clearErrors()
      }

      this.newValue = value
      this.$emit('input', value)
      this.$emit('change',value)

    },
    startLoading(){
      this.isLoading = true
      this.disabled=true
    },
    endLoading(){
      this.isLoading = false
      this.disabled=false
    },
    clearErrors(){
      this.backErrors = ''
      VueEvents.$emit('clear-errors',
        {
          form:this.form,
          field:this.name
        }
      )
    },

    resetField(){
      this.newValue=''
      this.disabled=false
      this.isLoading=false
    }

  },
  computed:{
    fieldErrors(){

      if(this.backErrors){
        return this.backErrors
      }

      let scopedField = (this.form) ? this.form + '.' + this.name : this.name

      if(this.frontErrors.first(scopedField)){
        return this.frontErrors.first(scopedField)
      }

      return ''

    },
    TYPE(){
      return 'text'
    },
    formValue(){
      return this.value
    },
    formObject(){
      return {
        'form':this.form,
        'componentId':this._uid,
        'itemId':this.itemId,
        'name':this.name,
        'type':this.TYPE,
        'value':this.formValue
      }
    },
    showSave(){

      if(this.fieldErrors) return false

      return this.newValue!=this.oldValue

    },

    fieldClass(){
      return (this.fieldErrors) ? 'is-danger' : ''
    }
  },

  mounted(){

    this.disabled = this.isEdit

    VueEvents.$on('field-updated-ok',
    (response)=>{
      if((response.componentId === this._uid)) {

        this.updatedOk(response)

      }

    });

    VueEvents.$on('loaded-values',
      (data)=>{

        if(data.form === this.form){
          this.itemId = data.itemId
        }

    });

    VueEvents.$on('field-update-failed',
      (response)=>{
        if((response.componentId === this._uid)) {

          if(this.backErrors){
            this.backErrors = response.errors[this.name][0]
          }
 
          this.updatedFailed(response)
  
        }
    });

    VueEvents.$on('form-submit-failed',
    (response)=>{
      if((response.form === this.form) && response.errors[this.name] ) {

        this.backErrors = response.errors[this.name][0]

      }
    });

    VueEvents.$on('reset-form-fields',
      (response)=>{
        if(response.form === this.form){
          this.resetField()
        }
    });

    VueEvents.$on('start-loading-form',
      (response)=>{
        if(response.form === this.form){
          this.startLoading()
        }
    });

    VueEvents.$on('end-loading-form',
      (response)=>{
        if(response === this.form){
          this.endLoading()
        }
    });

  },
  updated(){

    if(this.itemIdProps){
        this.itemId=this.itemIdProps
    }

  }
}
