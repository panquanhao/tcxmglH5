<template>
<div class='applyBox'>
    <div class="top"><img src="../../../static/image/goBack.png" alt="" @click="goBack"> <span v-show="!judge">申请开票</span> <span v-show="judge">修改发票</span></div>
    <div class="center">
        <div class="cItem">
            <span>甲方公司</span>
            <div @click="jfSelect">{{detail.jfgs}}</div>
        </div>
        <div class="cItem">
            <span>发票抬头</span>
            <div @click="fpttSelect">{{detail.fptt}}<img src="../../../static/image/addto.png" @click.stop="addTt"/></div>
        </div>
        <div class="cItem">
            <span>纳税识别号</span>
            <div>{{detail.nssbh}}</div>
        </div>
        <div class="cItem">
            <span>开户银行</span>
            <div>{{detail.khyh}}</div>
        </div>
        <div class="cItem">
            <span>银行账号</span>
            <div>{{detail.yhzh}}</div>
        </div>
        <div class="cItem">
            <span>联系人</span>
            <div @click="lxrSelect">{{detail.lxr}}</div>
        </div>
    </div>
    <div class="bottom">
        <div class="item">
            <span>*发票类型</span>
            <div @click="typeSelect"><input type="text" disabled placeholder="请选择" v-model="type"></div>
        </div>
        <div class="item">
            <span>*开票金额</span>
            <div><input type="text"  placeholder="请输入" v-model="money"></div>
        </div>
        <div class="item">
            <span>*开票内容</span>
            <div><input type="text"  placeholder="请输入" v-model="centent" :disabled='editJudge'></div>
        </div>
        <div class="item">
            <span>开票理由</span>
            <div><input type="text"  placeholder="请输入" v-model="reason"  :disabled='editJudge'></div>
        </div>
        <div class="item">
            <span>开票备注</span>
            <div><input type="text"  placeholder="请输入" v-model="remarks"  :disabled='editJudge'></div>
        </div>
        <div class="item">
            <span>申请日期</span>
            <div @click="timeSelect"><input type="text" disabled  placeholder="请选择" v-model="time1"></div>
        </div>
    </div>
    <div class="bt" v-show="!judge"><span @click="commit">提交申请</span></div>
    <div class="bt" v-show="judge"><span @click="commit">提交修改</span></div>
    <div class="type" v-if="typeShow">
       <div class="typeBox">
            <van-picker
            title="发票类型"
            show-toolbar
            :columns="columns"
            @confirm="typeEnd"
            @cancel="typeCancel"
            />
       </div>
    </div>
    <div class="time" v-show="timeShow">
       <div class="timeBox">
            <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择年月日"
            @confirm="timeEnd"
            @cancel="timeCancel"
            />
       </div>
    </div>
    <div class="type" v-if="jfShow">
       <div class="typeBox">
            <van-picker
            title="甲方公司"
            show-toolbar
            :columns="jfList"
            @confirm="jfEnd"
            @cancel="jfCancel"
            />
       </div>
    </div>
    <div class="type" v-if="fpttShow">
       <div class="typeBox">
            <van-picker
            title="发票抬头"
            show-toolbar
            :columns="fpttList"
            @confirm="fpttEnd"
            @cancel="fpttCancel"
            />
       </div>
    </div>
    <div class="type" v-if="lxrShow">
       <div class="typeBox">
            <van-picker
            title="联系人"
            show-toolbar
            :columns="lxrList"
            @confirm="lxrEnd"
            @cancel="lxrCancel"
            />
       </div>
    </div>
   
</div>
</template>

<script>
import api from '../../api/api'
import Qs  from 'qs'
export default {
name:'',
data() {
return {

    jfList:[{values:[],defaultIndex:0}],
    jfList1:[],
    jfShow:false,
    fpttList:[{values:[],defaultIndex:0}],//选择展示
    fpttList1:1,//用来匹配
    fpttShow:false,
    lxrList:[{values:[],defaultIndex:0}],
    lxrList1:[],
    lxrShow:false,
    columns: [{values:[],defaultIndex:0}],
    typeShow: false,
    timeShow:false,
    currentDate: new Date(),
    type:'',
    time:'',
    time1:'',
    centent:'',
    money:'',
    reason:'',
    remarks:'',
    detail:{
        id:'',
        jfgs:'',
        jfgsId:'',
        fptt:'',
        fpttId:'',
        nssbh:'',
        khyh:'',
        yhzh:'',
        remarks:'',
        lxr:'',
        lxrId:''
    },
    typeList:[],
    fpId:'',
    judge:false,
    editJudge:false,
}
},
//生命周期 - 创建完成（访问当前this实例）
created() {
     this.$http.get(api.config()).then((res)=>{
       
        if(res.code==200){
            for(let k in res.ret.invoice_type){
                let obj={
                    id:k,
                    name:res.ret.invoice_type[k]
                }
                this.typeList.push(obj)
                this.columns[0].values.push(res.ret.invoice_type[k])
            }
        }
    }).catch((err)=>{
        console.log(err)
    })
    this.detail.id=this.$route.query.id
    this.detail.id=this.$route.query.id
    // console.log(this.$route.query)
    if(this.$route.query.fpId){
        let a=this.$route.query.time.split('/')
        this.judge=true
        this.fpId=this.$route.query.fpId
        this.type=this.$route.query.type==1?'普通发票':'增值税专用发票'
        this.columns[0].defaultIndex=this.$route.query.type==1?0:1
        this.money=this.$route.query.amount1
        this.centent=this.$route.query.content
        this.reason=this.$route.query.reason
        this.time1=this.$route.query.time
        this.remarks=this.$route.query.remarks
        this.currentDate=new Date(a[0]*1,a[1]*1-1,a[2]*1)
        if(this.$route.query.state!=1){
            this.editJudge=true
        }
    }
    // console.log(this.$route.query)
    this.$http.get(api.detail()+`?id=${this.detail.id}`).then((res)=>{
        console.log(res)
        if(res.code==200){
            this.detail.jfgs=res.ret.customer.name
            this.detail.fptt=res.ret.customer.invoice_title
            this.detail.nssbh=res.ret.customer.no
            this.detail.khyh=res.ret.customer.bank
            this.detail.yhzh=res.ret.customer.bank_account
            this.detail.jfgsId=res.ret.customer_id
            this.detail.fpttId=res.ret.finance_id
            this.detail.lxr=res.ret.customer.liaison
            this.detail.lxrId=res.ret.liaison_id
        }
    }).then(()=>{
        this.httpGs()
    }).catch((err)=>{
        console.log(err)
    })
   
},
//生命周期 - 挂载完成（访问DOM元素）
mounted() {
    var date = new Date();
    let year=date .getFullYear()
    let m=date .getMonth();
    let d=date .getDate();
    let str2=year+'/'+(m+1)+'/'+d
    var date2 = new Date(str2).getTime()
    
    this.time=date2
    this.time1=this.getLocalTime(this.time)
    console.log(this.time)
    // this.
},
//方法
methods: {
    addTt(){
        // alert(123)
    },
    //发票抬头
    fpttSelect(){
        this.$http.get(api.applyFptt()+`?id=${this.detail.jfgsId}`).then((res)=>{
            if(res.code==200){
                this.fpttList1=res.ret.finance
                this.fpttList[0].values=[]
                for(var i=0;i<res.ret.finance.length;i++){
                    this.fpttList[0].values.push(res.ret.finance[i].invoice_title)
                    if(res.ret.finance[i].invoice_title==this.detail.fptt){
                        this.fpttList[0].defaultIndex=i
                    }
                }
                this.fpttShow=true
            }
        }).catch((err)=>{
            console.log(err)
        })
        
    },
    fpttEnd(picker, value, index){
        // console.log(picker, value, index)
        this.detail.fpttId=this.fpttList1[value[0]].id
        this.detail.fptt=picker[0]
        this.fpttList[0].defaultIndex=[0]
        this.detail.nssbh=this.fpttList1[value[0]].no
        this.detail.khyh=this.fpttList1[value[0]].bank
        this.detail.yhzh=this.fpttList1[value[0]].bank_account
        this.fpttShow=false
    },
    fpttCancel(){
        this.fpttShow=false
    },
    //联系人
    lxrSelect(){
        this.$http.get(api.applyFptt()+`?id=${this.detail.jfgsId}`).then((res)=>{
            if(res.code==200){
                this.lxrList1=res.ret.liaison
                this.lxrList[0].values=[]
                for(var i=0;i<res.ret.liaison.length;i++){
                    this.lxrList[0].values.push(res.ret.liaison[i].liaison)
                    if(res.ret.liaison[i].liaison==this.detail.lxr){
                        this.lxrList[0].defaultIndex=i
                    }
                }
                this.lxrShow=true
            }
        }).catch((err)=>{
            console.log(err)
        })
        
    },
    lxrEnd(picker, value, index){
        // console.log(picker, value, index)
        this.detail.lxrId=this.lxrList1[value[0]].id
        this.detail.lxr=picker[0]
        this.fpttList[0].defaultIndex=[0]
        this.lxrShow=false
    },
    lxrCancel(){
        this.lxrShow=false
    },
    //甲方
    jfSelect(){
        this.jfShow=true
    },
    jfEnd(picker, value, index){
        // console.log(picker, value, index)
        this.detail.jfgsId=this.jfList1[value[0]].id
        this.detail.jfgs=this.jfList1[value[0]].name
        this.jfList[0].defaultIndex=value[0]
        this.jfShow=false
        this.$http.get(api.applyFptt()+`?id=${this.detail.jfgsId}`).then((res)=>{
            if(res.code==200){
                this.fpttList1=res.ret.finance
                this.fpttList[0].defaultIndex=0
                for(var i=0;i<res.ret.finance.length;i++){
                    this.fpttList[0].values.push(res.ret.finance[i].invoice_title)
                }
                this.detail.fptt=res.ret.finance.length>0?res.ret.finance[0].invoice_title:''
                this.detail.fpttId=res.ret.finance.length>0?res.ret.finance[0].id:''
                this.detail.nssbh=res.ret.finance.length>0?res.ret.finance[0].no:''
                this.detail.khyh=res.ret.finance.length>0?res.ret.finance[0].bank:''
                this.detail.yhzh=res.ret.finance.length>0?res.ret.finance[0].bank_account:''

                this.lxrList1=res.ret.liaison
                this.lxrList[0].defaultIndex=0
                for(var i=0;i<res.ret.liaison.length;i++){
                    this.lxrList[0].values.push(res.ret.liaison[i].liaison)
                }
                this.detail.lxr=res.ret.liaison.length>0?res.ret.liaison[0].liaison:''
                this.detail.lxrId=res.ret.liaison.length>0?res.ret.liaison[0].id:''
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    jfCancel(){
        this.jfShow=false
    },
    //类型
    typeSelect(){
        if(this.editJudge){
            return
        }
        this.typeShow=true
    },
    typeEnd(value, index) {
        // console.log(value,index)
        this.type=value
        this.typeShow=false
    },
    typeCancel() {
        this.typeShow=false
    },
    timeSelect(){
        if(this.editJudge){
            return
        }
        this.timeShow=true
    },
    timeCancel(value){
        this.timeShow=false
    }, 
    timeEnd(value){
        // console.log(value)
        console.log(value)
        this.timeShow=false
        this.time=+new Date(value)
        this.time1=this.getLocalTime(this.time)
        console.log(this.time)
    },
    commit(){
        if(this.centent==''){
            this.$toast.success('开票内容必填');
            return
        }
        let data={
            project_id:this.detail.id,
            customer_id:this.detail.jfgsId,
            content:this.centent,
            amount:this.money,
            reason:this.reason,
            application_time:+new Date(this.currentDate)/1000,
            type:0,
            id:0,
            finance_id:this.detail.fpttId,
            remarks:this.remarks,
            liaison_id:this.detail.lxrId
        }
        if(this.judge){
            data.id=this.fpId
        }
        for(var i=0;i<this.typeList.length;i++){
            if(this.type==this.typeList[i].name){
                data.type=this.typeList[i].id
            }
        }
        // console.log(data)
        let that=this
        this.$http.post(api.store(),Qs.stringify(data)).then((res)=>{
            
            if(res.code==200){
                this.$toast.success('保存成功');
                // if(this.judge){
                    this.goBack()
                // }
            }else{
                this.$toast.fail(res.msg);
                // this.$notify({ type: 'primary', message: res.msg });
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    goBack(){
        this.$router.back()
    },
    getLocalTime(nS) {     
      if(nS==0){
        return ''
      }else{
        let a=new Date(parseInt(nS)).toLocaleString().split('上午')[0]
        if(a.indexOf('下午')>-1){
          return a.split('下午')[0]
        }else{
          return a.split('上午')[0]
        }
        
      }
      
      // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
    },
    httpGs(){
        this.$http.get(api.applyGsList()).then((res)=>{
            // console.log(res)
            if(res.code==200){
                this.jfList1=res.ret
                for(var i=0;i<res.ret.length;i++){
                    this.jfList[0].values.push(res.ret[i].name)
                    if(this.detail.jfgs==res.ret[i].name){
                        this.jfList[0].defaultIndex=i
                    }
                }
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
}
}
</script>
<style lang='stylus' scoped>
.applyBox
  width 100%
  height 100%
  font-size 0.28rem
  overflow-y scroll
  background #f2f2f2
  .top
    background #ffffff
    width calc(100% - 0.6rem)
    height 0.5rem
    padding 0.2rem 0.3rem 0 0.3rem
    text-align center
    line-height 0.5rem
    font-size 0.32rem
    position relative
    img  
      position absolute
      left 0.2rem
      top 0.28rem
      width 0.32rem
      height 0.33rem
    span
      font-weight bold  
  .center
    padding 0.2rem 0.3rem 0  0.3rem
    width calc(100% - 0.6rem)
    background #ffffff    
    .cItem
      display flex
      padding 0.2rem 0
      align-items center
      font-size 0.26rem
      border-bottom 1px solid #f2f2f2
      span    
        width 1.7rem
      div
        width calc(100% - 2rem)  
        line-height 0.4rem
        min-height 0.4rem
        position relative
        img 
          position absolute
          right -0.3 rem
          top 0
          width 0.4rem
          height 0.4rem
  .bottom
    margin-top 0.2rem
    padding 0  0.3rem
    width calc(100% - 0.6rem)
    background #ffffff   
    .item
      display flex
      padding 0.2rem 0
      align-items center
      font-size 0.26rem
      width 100%
      border-bottom 1px solid #f2f2f2
      span    
        width 1.7rem
      div
        flex 1
        input
          width 100%
          height 0.4rem
  .bt
    display flex
    justify-content center
    margin-top 1rem
    span
      width 6.4rem
      height 0.8rem
      background #3962E1
      color #ffffff
      border-radius 0.1rem
      text-align center
      line-height 0.8rem      
  .type
    position fixed
    left 0
    top 0
    width 100vw
    height 100vh
    background rgba(0,0,0,0.5)    
    .typeBox
      width 100%
      position absolute
      bottom 0
      left 0
  .time    
    position fixed
    left 0
    top 0
    width 100vw
    height 100vh
    background rgba(0,0,0,0.5)    
    .timeBox
      width 100%
      position absolute
      bottom 0
      left 0
.van-overlay
  background rgba(0,0,0,0)      
input[disabled]{
    background #ffffff
}      
</style>