export default{

  methods:{

    confirmDelete(items){

      if(!Array.isArray(items)){
        items = [items]
      }

      let dialogMessage = 'Confirma el borrado de este item.'

      let confirmMessage = 'Item borrado exitosamente'

      if(items.length > 1){

          dialogMessage = 'Confirma el borrado de estos items.'

          confirmMessage = 'Items borrados exitosamente'
      }

      this.$dialog.confirm({
        type:'is-danger',
        message:dialogMessage,
        confirmText:'Ok',
        hasIcon:true,
        onConfirm:()=>{

          this.isLoading = true

          let itemsToDelete =[]

          items.forEach((item)=>{

            itemsToDelete.push(this.delete(item))

          })

          Promise.all(itemsToDelete).then((response)=>{

            this.onDeleteSuccess(confirmMessage)

          }).catch((error)=>{

            this.onDeleteFail(error)

          })

        }
      })

    },

    delete(item){

      return new Promise((resolve, reject) => {

        axios['delete'](item.admin_links.delete)

          .then(response => {

            resolve(response.data);

          })
          .catch(error => {

            if(error.response.status === 419){
              VueEvents.$emit('login-redirect')

              return
            }

            reject(error.response.data);

          });
      });

    },

    onDeleteSuccess(message){

      VueEvents.$emit('deleted-successfully',{
        'name':this.name,
        'message':message}
      )

    },
    onDeleteFail(error){

      this.$emit('delete-fail',error)

    }

  },

  mounted(){

    VueEvents.$on('delete-items',(data)=>{

      if(data.name === this.name){
        this.confirmDelete(data.items)
      }
    })

  }
}
