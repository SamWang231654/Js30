Vue.component('FilterComponent',{
    data:function(){
        return {
            buttonList:[
                {text:'全部',value:'all'},
                {text:'未完成',value:'open'},
                {text:'完成',value:'done'}
            ]
        }
    },
    template:`
    <p>
        <button v-for="item of buttonList" :key="item.text" @click="$emit('filter',item.value)">
        {{item.text}}
        </button>
    </p>
    `
})
//外到內
Vue.component('InputComponent',{
    data:function(){
        return{
        compositionStatus:false,
        }
    },
    props:['value'],
    template:`
        <p>
            <input type="text" 
            v-bind:value="value"
            v-on:input="$emit('input',$event.target.value)"
            @compositionstart="cstarHandler"
            @compositionend="cendHandler"
            @keyup.enter="inputHandler" >
        </p>
    `,
    methods: {
        cstarHandler(){ //輸入法開始
            this.compositionStatus = true
        },
        cendHandler(){  //輸入法結束
            this.compositionStatus = false
        },
        inputHandler(){
            if(this.compositionStatus) return false
            this.$emit('custom-input');
        },
    }
})
//內到外
Vue.component('InputComponent2',{
    data:function(){
        return{
        compositionStatus:false,
        inputText:'',
        }
    },
    template:`
        <p>
            <input type="text" 
            v-model="inputText"
            @compositionstart="cstarHandler"
            @compositionend="cendHandler"
            @keyup.enter="inputHandler" >
        </p>
    `,
    methods: {
        cstarHandler(){ //輸入法開始
            this.compositionStatus = true
        },
        cendHandler(){  //輸入法結束
            this.compositionStatus = false
        },
        inputHandler(){
            if(this.compositionStatus) return false
            this.$emit('custom-input',this.inputText);
            this.inputText = '';
        },
    }
})

//Create Read Update Delete
new Vue({
    el:"#app",
    data:{
        inputText:'',
        list:[], 
        editing:null,
        editingText:'',
        show:'all'
    },
    computed:{
        filterList(){
            //all,open,done
            if(this.show === "all"){
                return this.list
            }else if(this.show === "open"){
                return this.list.filter((item)=>{
                    return item.status === false
                })
            }else if(this.show === "done"){
                return this.list.filter((item)=>{
                    return item.status === true
                })
            }else{
                return []
            }
        },
    },
    methods:{
        filterHandler(value){
            this.show = value
        },
        
        deleteHandler(item){
            this.list = this.list.filter((target)=>{ 
                return target != item;
            })
            // this.list.splice(index,1)
        },
        editHandler(item){
            this.editing = item
            this.editingText = item.content
        },
        completeHandler(){
            this.editing.content = this.editingText
            this.cancelHandler()
        },
        cancelHandler(){
            this.editingText = ""
            this.editing = null
        },
        inputHandler(){
            this.list.push({
                timestamp:new Date().getTime(),
                status:false,
                content:this.inputText
            })
            this.inputText = ''
        },
        input2Handler(value){
            this.list.push({
                timestamp:new Date().getTime(),
                status:false,
                content:value
            })
        },
    }
})