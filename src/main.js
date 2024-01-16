// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import { List } from 'vant';
import { PullRefresh } from 'vant';
// import { Form } from 'vant';
import { Field } from 'vant';
import { Picker } from 'vant';
import { DatetimePicker } from 'vant';
import { Notify } from 'vant';
import { Dialog } from 'vant';
import { Toast } from 'vant';

Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Notify);
Vue.use(DatetimePicker);
Vue.use(Picker);
// Vue.use(Form);
Vue.use(Field);
Vue.use(List);
Vue.use(PullRefresh);
Vue.config.productionTip = false
Vue.prototype.$http=axios
var Base64 = require('js-base64').Base64
var  CryptoJS = require("crypto-js");
var key='df211e51b8c0ab15ee6f51420fb6b2ffab1a22a1a39afc19a043c3ee6d0eee89ea0e77621d044329852499060e1aafd298e54d0646accfb99d366c2b11905e89'
/* eslint-disable no-new */
/*跳转登录页,携带当前页面路由，以期在登录页面完成登录后返回当前页面*/
const toLogin=()=>{
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
}
/*请求失败后的错误统一处理 请求失败的状态码*/
const errorHandle = (status, other) => {
  console.log(status)
  // 状态码判断
  // switch (status) {
  //   // 401: 未登录状态，跳转登录页
  //   case 401:
  //     toLogin();
  //     break;
  //   // 403 token过期
  //   // 清除token并跳转登录页
  //   case 403:
  //     tip('登录过期，请重新登录');
  //     localStorage.removeItem('token');
  //     store.commit('loginSuccess', null);
  //     setTimeout(() => {
  //       toLogin();
  //     }, 1000);
  //     break;
  //   // 404请求不存在
  //   case 404:
  //     tip('请求的资源不存在');
  //     break;
  //   default:
  //     console.log(other);
  // }
}
let pending=[]
let CancelToken = axios.CancelToken; 
let removePending = (config) => {
  if (pending.length > 0) {
    for (let p in pending) {
      if (pending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
        pending[p].f(); // 执行取消操作
        pending.splice(p, 1); // 把这条记录从数组中移除
      }
    }
  }
}
/*设置请求时间*/
axios.defaults.timeout=10000
/*设置post请求头 */
axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded'
/* 请求拦截，处理token*/
axios.interceptors.request.use(
  config => {
    removePending(config); // 在一个ajax发送前执行一下取消操作
    config.cancelToken = new CancelToken((c) => {
      // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
      pending.push({ u: config.url + '&' + config.method, f: c });
    });
    const ApiKey=window.localStorage.getItem('tcxmglH5-key');
    const secret=window.localStorage.getItem('tcxmglH5-secret');
    ApiKey && (config.headers['ApiKey'] = ApiKey);
    secret && (config.headers['ApiSecret'] = secret);
    // console.log(config)
    return config;
  },
  error => Promise.error(error))
/* 响应拦截，处理返回的数据*/
axios.interceptors.response.use(
  // 请求成功
  res => {

    if(res.data.code==403){
       router.replace({
        path: '/login',
      });
      return
    }
		let postName = res.config.url.split('/');
    if(postName[postName.length -1]=='login'){ 
			let date = new Date()
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			month = (month > 9) ? month : ("0" + month);
			day = (day < 10) ? ("0" + day) : day;
			let today = year + '' + month + '' + day;
	  
			let key = CryptoJS.enc.Utf8.parse("eba75de20321eb1f"); //为了避免补位，直接用16位的秘钥
			let iv = CryptoJS.enc.Utf8.parse(today.split("").reverse().join('')+today); //16位初始向量
			let  encrypted = CryptoJS.AES.decrypt(res.data.ret.id, key, {
			  iv: iv,
			  mode:CryptoJS.mode.CBC,
			  padding:CryptoJS.pad.Pkcs7
		
			});
			let aa=encrypted.toString(CryptoJS.enc.Utf8)
			let f=aa.slice(0,(month*1+day*1)*2)+aa.slice((month*1+day*1)*2+64)
			let c=Base64.decode(f)
			localStorage.setItem("tcxmglH5-key", c);
		}
    // let apikey=res.headers.apikey
    // let a=apikey+key
    // // console.log(apikey,res.headers.apisecret)
    // localStorage.setItem("tcxmglH5-key",apikey)
    // localStorage.setItem("tcxmglH5-secret",res.headers.apisecret)
    // let apisecretArr=res.headers.apisecret.split('.')
    // // console.log(a,apisecretArr)
    // var apssecret = apisecretArr[0]+'.'+apisecretArr[1];
    // let b=CryptoJS.HmacSHA512(apssecret,a);
    // var hashInBase64 = CryptoJS.enc.Base64.stringify(b).replace(/\//g,'_')
    // let hash=hashInBase64.replace(/\+/g,'-')
    let apikey = res.headers.apikey;
    let a = apikey + localStorage.getItem('tcxmglH5-key');
    localStorage.setItem("tcxmglH5-key", apikey);
    localStorage.setItem("tcxmglH5-secret", res.headers.apisecret);
    let apisecretArr = res.headers.apisecret.split('.');
    var apssecret = apisecretArr[0]+'.'+apisecretArr[1];
    let b = CryptoJS.HmacSHA512(apssecret,a);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(b).replace(/\//g,'_')
    let hash=hashInBase64.replace(/\+/g,'-')
    if(hash.substr(0, hash.length - 2)===apisecretArr[2]){
      let data=Base64.decode(apisecretArr[1])
      let asd=JSON.parse(data)
      let time =Date.parse(new Date())/1000
      if(time<=asd.expire){
        res.status === 200 ? Promise.resolve(res) : Promise.reject(res)
      }else{
        router.replace({
          path: '/login',
        });
      }
      // console.log(asd,time,123)
    }
    // console.log( hash.substr(0, hash.length - 2),b,333)
    if(res.status===200){
      return  Promise.resolve(res.data)
    }else {
      return  Promise.reject(res)
    }
  },
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
    }
  }
)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
