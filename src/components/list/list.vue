<template>
  <div class="box">
    <div class="top">项目列表</div>
    <div class="search">
      <img src="../../../static/image/search.png" alt="">
      <input type="text" v-model="searchValue" placeholder="输入项目编号或名称" @input="seaarch">
    </div>
    <div class="list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="我是有底线的"
        :offset='10'
        @load="onLoad"
      >
        <div class="item" v-for="(i,k) in list" :key="k" @click="goDeatil(i.id)">
          <div class="itemTitle">{{i.no}}</div>
          <div class="itemName">{{i.name}}</div>
        </div>
        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
      </van-list>
    </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import api from '../../api/api'
export default {
  name: 'HelloWorld',
  data () {
    return {
      searchValue:'',
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page:0,
    }
  },
mounted(){
     this.httpList()
},
    
  methods:{
      seaarch(){  
        let that=this
        
        if(window.lazy){
          window.clearTimeout(window.lazy)
        }
        window.lazy=window.setTimeout(()=>{
            that.page=0
            that.list=[]
            that.httpList()
          },400)
      },
      onLoad() {
        // setTimeout(() => {
          if (this.refreshing) {
            this.list = [];
            this.refreshing = false;
          }

          this.httpList()
          this.loading = false;

          // if (this.list.length >= 40) {
          //   this.finished = true;
          // }
        // }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.page=0
      this.list=[]
      this.onLoad();
    },
    goDeatil(id){
      this.$router.push({
        path:`/detail`,
        query: {
            id: id
          }
      })
    },
    httpList(bool){
      this.$http.get(api.list()+`?name=${this.searchValue}&page=${this.page}&perPage=14`).then((res)=>{
       console.log(res)
       if(res){
         if(res.code==200){
        //  if(this.page==0){
        //    this.list=[]
        //  }
          if(res.ret.list.length>0){
            this.page+=1
            for(var i=0;i<res.ret.list.length;i++){
              this.list.push(res.ret.list[i])
            }
          }else{
            
            this.finished = true;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.box
  padding 0.2rem
  width calc(100vw - 0.4rem)
  height calc(100vh - 0.4rem)
  font-size 0.26rem
  overflow hidden
  .top
    width 100%
    height 0.5rem
    text-align center
    line-height 0.5rem
    font-size 0.32rem
    font-weight bold
  .search
    width 100%
    height 0.8rem
    background #F2F2F2
    display flex
    align-items center
    img
      width 0.36rem
      height 0.36rem
      margin-left 0.2rem
    input
      width calc(100% - 1.12rem)
      height 100%
      padding 0 0.1rem
      background none
  .list
    width 100%
    height calc(100% - 1.5rem)
    margin-top 0.2rem 
    overflow-y scroll
    .item
      height 1.2rem
      border-bottom 0.01rem solid #F2F2F2
      display flex
      flex-direction column
      justify-content center
      div+div
        margin-top 0.2rem
      .itemTitle
        font-weight bolder
      div
        width 100%
        white-space:nowrap;    
        overflow:hidden;
        text-overflow:ellipsis; 
        line-height 0.32rem
    .item+.item
      margin-top 0.1rem    

</style>
