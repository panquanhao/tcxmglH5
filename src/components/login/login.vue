<template>
    <div class="loginBox" :style="back">
      <div class="box">
        <div class="title">同测联行开票申请 <span></span></div>
        <div class="login">
          <div class="name">
            <img src="../../../static/image/username.png" alt=""><input type="text" placeholder="请输入账号" v-model="user">
          </div>
          <div class="pwd">
            <img src="../../../static/image/password.png" alt=""><input type="password" placeholder="请输入密码" v-model="pwd">
          </div>
          <div class="bt">
            <button @click="login()">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import api from '../../api/api'
    import Qs from 'qs'
    const CryptoJS = require('crypto-js');
    let date = new Date()
    let year = date.getFullYear();
    
    let month = date.getMonth() + 1;
    
    let day = date.getDate();
    
    month = (month > 9) ? month : ("0" + month);
    day = (day < 10) ? ("0" + day) : day;
    let today = year + '' + month + '' + day;
    //16位十六进制数作为密钥（秘钥为随机生成，必须与后端保持一致！）
    const key = CryptoJS.enc.Utf8.parse("eba75de20321eb1f");
    //16位十六进制数作为密钥偏移量（秘钥为随机生成，必须与后端保持一致！）
    const iv = CryptoJS.enc.Utf8.parse(today.split("").reverse().join('')+today);
    export default { 
        name: "login",
        data(){
            return{
                pwd:'',
                user:'',
                back:{
                  backgroundImage:"url(" + require("../../../static/image/background.png") + ")"
              },
            }
        },
        components:{
          api,
        },
        methods:{
            login(){
              // this.$router.push({
              //               path:`/list`
              //           })
              //           return
                let that=this
                let Base64 = require('js-base64').Base64;
                let str1=this.Encrypt(`${this.user} ${this.pwd}`)

                let params = {
                    pwd:Base64.encode(Base64.encode(`${str1}`).split("").reverse().join('')+'mm')
                };
                this.$http.post(api.login(),Qs.stringify(params)).then((res)=>{
                    console.log(res,123)
                    this.$toast.success(res.msg);
                    if(res.code==200){
                        that.$router.push({
                            path:`/list`
                        })
                    }
                }).catch((err)=>{
                    this.$toast.fail('用户名或密码错误');
                    console.log(err,'错了')
                })
            },
        Encrypt(word){
            const srcs = CryptoJS.enc.Utf8.parse(word);
            let encrypted = CryptoJS.AES.encrypt(srcs, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            
            //将结果进行base64加密
            return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        }
        }
    }
</script>

<style scoped lang="stylus">
  .loginBox
    width 100vw
    height 100vh
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size 0.28rem
    .box
      padding 1rem 0.3rem
      background #ffffff
      border-radius 0.1rem
      width 5rem
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction column
    .title
      color #202020
      margin-bottom 1rem
      font-size 0.36rem
      font-weight bolder
      position relative
      span
        position absolute
        left 0
        bottom 0
        width 100%
        height 0.1rem
        background rgba(57, 98, 225, 0.5)
    .login
      background #ffffff
      width 100%
      font-size 0.28rem
      div
        width 100%
        position relative
        img 
          width 0.36rem
          height 0.36rem
          position absolute
          left 0.1rem
          top calc(50% - 0.18rem)
        input 
          padding 0.2rem 0.5rem  
          width calc(100% - 1rem)
          height 0.4rem
          border 1px solid #d8d8d8
          outline-color #3962E1
          border-radius 0.1rem
      div+div
        margin-top 0.8rem    
      .bt
        width 100%
        display flex
        justify-content center
        button
          border none
          color #ffffff
          background #3962E1
          width 5rem
          height 0.8rem
          border-radius 0.1rem
</style>
