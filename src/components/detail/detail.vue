<template>
<div class='detailBox'>
    <div class="top"><img src="../../../static/image/goBack.png" alt="" @click="goBack"> 项目信息<span @click="add" >+申请开票</span></div>
    <div class="center">
        <div class="item">
            <span>项目编号</span> <div>{{detail.no}}</div>
        </div>
        <div class="item">
            <span>项目名称</span> <div>{{detail.name}}</div>
        </div>
        <div class="item">
            <span>市场负责人</span> <div>{{detail.scfzr}}</div>
        </div>
        <div class="item">
            <span>甲方公司</span> <div>{{detail.jfgs}}</div>
        </div>
        <div class="item">
            <span>合同金额</span> <div>{{detail.money}}元</div>
        </div>
        <div class="item">
            <span>付款次数</span> <div>{{detail.num}}</div>
        </div>
    </div>
    <div class="bottom">
        <div class="bt">
            <span :class="tabNum==1?'span':''" @click="select(1)">待开票</span>
            <span :class="tabNum==2?'span':''" @click="select(2)">已开票未到账</span>
            <span :class="tabNum==3?'span':''" @click="select(3)">已到账</span>
            <span :class="tabNum==4?'span':''" @click="select(4)">已作废</span>
        </div>
        <div class="tab">
            <div class="tabBox" v-for="(i,k) in list" :key='k'>
                <div class="operation">
                    <span v-show="i.state==1" @click="revoke(i.id)">撤销</span><span v-show="i.state<4" @click="edit(i)">修改</span><span v-show="i.state==2" @click="toVoid(i.id)">作废</span>
                </div>
                <div class="tabItem">
                    <span>发票类型</span>
                    <div>{{i.type|filterA}}</div>
                </div>
                <div class="tabItem">
                    <span>开票金额</span>
                    <div>{{i.amount}}元</div>
                </div>
                <div class="tabItem">
                    <span>开票内容</span>
                    <div>{{i.content}}</div>
                </div>
                <div class="tabItem">
                    <span>开票理由</span>
                    <div>{{i.reason}}</div>
                </div>
                <div class="tabItem">
                    <span>申请日期</span>
                    <div>{{i.time}}</div>
                </div>
                <div v-show="i.judge">
                    <div v-for="(item,key) in i.child" :key="'a'+key">
                        <div class="tabItem">
                            <span>发票1</span>
                            <div>{{item.fph}}</div>
                        </div>
                        <div class="tabItem">
                            <span>发票金额</span>
                            <div>{{item.fpje}}元</div>
                        </div>
                        <div class="tabItem">
                            <span>发票税额</span>
                            <div>{{item.fpse}}元</div>
                        </div>
                        <div class="tabItem">
                            <span>开票日期</span>
                            <div>{{item.kprq}}</div>
                        </div>
                        <div class="tabItem">
                            <span>到账日期</span>
                            <div>{{item.dzrq}}</div>
                        </div>
                    </div>
                </div>
                <div v-show="!i.judge&&tabNum!=1" class="judge" @click="open(true,k)"><img src="../../../static/image/dowm.png"/>共{{i.child.length}}张</div>
                <div v-show="i.judge&&tabNum!=1" class="judge" @click="open(false,k)"><img src="../../../static/image/up.png"/>收起</div>
            </div>
            <p v-show="list.length==0">暂无此类发票</p>
        </div>
    </div>
</div>
</template>

<script>
import api from '../../api/api'
import Qs from 'qs'
export default {
name:'',
data() {
return {
    tabNum:1,
    list:[],
    judge:false,
    num:1,
    detail:{
        id:'',
        no:'',
        name:'',
        jfgs:'',
        num:'',
        money:0,
        scfzr:''
    }
}
},
filters:{
	//过滤器一：（使用时没有参数，即{{msg|filterA}}）
	  filterA(value){
	      if(value==1){
          return  '普通发票'
        }else if(value==2){
          return  '增值税专用发票'
        }
	  }
},
//生命周期 - 创建完成（访问当前this实例）
created() {
    this.detail.id=this.$route.query.id
    // console.log(this.$route.query.id)
    this.$http.get(api.detail()+`?id=${this.detail.id}`).then((res)=>{
        console.log(res)
        if(res.code==200){
            this.detail.no=res.ret.no
            this.detail.name=res.ret.name
            this.detail.money=toThousands(res.ret.contract_amount/100)
            this.detail.num=res.ret.payments_num
            this.detail.jfgs=res.ret.customer.name
            this.detail.scfzr=res.ret.marketing_director
        }
    }).catch((err)=>{
        console.log(err)
    })
    this.httpList()
},
//生命周期 - 挂载完成（访问DOM元素）
mounted() {

},
//方法
methods: {
    revoke(id){//撤销
    let that=this
        this.$dialog.confirm({
            title: '',
            message: '是否撤销此条申请?',
            })
            .then(() => {
                console.log(id)
                that.toVoidAndRevokeEnd(id,1)
            })
            .catch(() => {
                // on cancel
            });
    },
    toVoid(id){//z作废
      let that=this
        this.$dialog.confirm({
            title: '',
            message: '是否作废这张发票?',
            })
            .then(() => {
                that.toVoidAndRevokeEnd(id,2)
            })
            .catch(() => {
                // on cancel
            });
    },
    toVoidAndRevokeEnd(id,state){
        // console.log(id,state)
        // this.$http.post(api.applyState(),Qs)
        this.$http.post(api.applyState(),Qs.stringify({state:state,id:id})).then((res)=>{
            this.$notify({ type: 'primary', message: res.msg });
            if(res.code==200){
                this.httpList()
                this.$toast.success(res.msg);
            }else{
                this.$toast.fail(res.msg);
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    add(){
        let that=this
        this.$router.push({
            path:`/apply`,
            query: {
            id: that.detail.id
          }
        })
    },
    edit(i){
        console.log(i)
        let that=this
        this.$router.push({
            path:`/apply`,
            query: {
                id: that.detail.id,
                amount1:i.amount1,
                type:i.type,
                time:i.time,
                content:i.content,
                fpId:i.id,
                reason:i.reason,
                state:i.state
            }
        })
    },
    select(num){
        this.tabNum=num
        this.httpList()
    },
    open(bool,k){
        this.list[k].judge=bool
    },
    goBack(){
        this.$router.go(-1)
    },
    httpList(type){
        this.$http.get(api.detailList()+`?id=${this.detail.id}&type=${this.tabNum}`).then((res)=>{
            // console.log(res)
            if(res.code==200){
                this.list=[]
                for(var i=0;i<res.ret.list.length;i++){
                    let obj={
                        id:res.ret.list[i].id,
                        type:res.ret.list[i].type,
                        amount:toThousands(res.ret.list[i].amount/100),
                        amount1:res.ret.list[i].amount/100,
                        content:res.ret.list[i].content,
                        reason:res.ret.list[i].reason,
                        time:this.getLocalTime(res.ret.list[i].application_time*1000),
                        time1:res.ret.list[i].application_time*1000,
                        child:[],
                        judge:false,
                        state:0,//1。未开始，2.已开票未到账，3已开票有到账，4完成,5.作废
                    }
                    if(this.tabNum==1){
                        obj.state=1
                    }
                    if(this.tabNum==2){
                        obj.state=2
                    }
                    for(var j=0;j<res.ret.list[i].invoice_info.length;j++){
                        let a={
                            fph:res.ret.list[i].invoice_info[j].big_no+','+res.ret.list[i].invoice_info[j].small_no,
                            fpje:toThousands(res.ret.list[i].invoice_info[j].invoice_amount/100),
                            fpse:toThousands(res.ret.list[i].invoice_info[j].tax_amount/100),
                            kprq:this.getLocalTime(res.ret.list[i].invoice_info[j].invoice_time*1000),
                            dzrq:this.getLocalTime(res.ret.list[i].invoice_info[j].received_time*1000),
                        }
                        if(res.ret.list[i].invoice_info[j].received_time*1000>0){
                            obj.state=3
                        }
                        obj.child.push(a)
                    }
                    if(res.ret.list[i].invoice_state==3){
                        obj.state=4
                    }
                    if(res.ret.list[i].state==2){
                        obj.state=5
                    }
                    if(this.tabNum==4){
                        obj.state=5
                    }
                    // console.log(obj)
                    this.list.push(obj)
                }
                // console.log(this.list)
            }
        }).catch((err)=>{
            console.log(res)
        })
    },
    getLocalTime(nS) {     
      if(nS==0){
        return '--'
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
}
}
</script>
<style lang='stylus' scoped>
.detailBox
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
    font-weight bold
    line-height 0.5rem
    font-size 0.32rem
    position relative
    span
      position absolute
      right 0.3rem
      font-size 0.30rem
      font-weight bold
      top 0.2rem
      color #3962E1
    img  
      position absolute
      left 0.2rem
      top 0.28rem
      width 0.32rem
      height 0.33rem
  .center
    padding 0.2rem 0.3rem 0  0.3rem
    width calc(100% - 0.6rem)
    background #ffffff
    .item
      display flex
      padding 0.2rem 0
      align-items center
      font-size 0.26rem
      border-bottom 1px solid #f2f2f2
      span    
        width 1.5rem
      div
        width calc(100% - 1.5rem)  
        line-height 0.4rem
  .bottom 
    width calc(100% - 0.6rem)
    padding 0.3rem 0.3rem 0.2rem 0.3rem
    .bt
      display flex
      align-items center
      justify-content  center
      span
        padding 0.2rem
        color #3962E1
        border 1px solid #3962E1
      .span
        background #3962E1
        color #ffffff  
      span:nth-child(2)
        border-right none 
      span:nth-child(1)
        border-right none
        border-top-left-radius: 0.1rem;
        border-bottom-left-radius:0.1rem;
      span:nth-child(4)
        border-left none
        border-top-right-radius: 0.1rem;
        border-bottom-right-radius:0.1rem;
    .tab
      width 100%
      padding 0.2rem 0  
      .tabBox+.tabBox
        margin-top 0.2rem
      .tabBox
        padding 0 0.15rem
        position relative
        background #ffffff
        border-radius 0.1rem
        padding 0.16rem
        .tabItem
          display flex
          align-items center
          span
            width 1.5rem
          div
            width calc(100% - 1.5rem)  
            padding 0.2rem 0
      .judge
        display flex
        align-items center
        justify-content center
        color #8F8F8F
        img
          width 0.26rem
          height 0.26rem    
          margin-right 0.06rem
      p
        width 100%
        text-align center
        padding 1rem 0
        font-size 0.4rem       
        color #8f8f8f
      .operation
        position absolute
        right 0
        top 0.3rem
        span
          margin-right 0.1rem
          color #3962E1
</style>