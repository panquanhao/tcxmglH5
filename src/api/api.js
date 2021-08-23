let baseUrl
// console.log(document.URL,document.URL.split('/'))
if(document.domain == '47.100.109.184'){
  if(window.location.port=='8081'){
    baseUrl='http://47.100.109.184:8081/xmgl/backend/'
  }else{
    baseUrl='http://47.100.109.184/xmgl/backend/'
  }
}else{
  baseUrl='http://192.168.200.192/xmgl/backend/'
}
console.log(document.domain)
export default{
  login(){//登录
    return baseUrl+'mobile/user/login'
  },
  list(){//列表
    return baseUrl+'mobile/project/index'
  },
  detail(){//详情
    return baseUrl+'mobile/project/info'
  },
  projectDownFill(){//文件下载
    return baseUrl+'contract/project/getFile'
},
  config(){//配置参数
    return baseUrl+'mobile/invoice/init'
  },
  detailList(){//详情页列表
    return baseUrl+'mobile/invoice/apply'
  },
  store(){//存储
    return baseUrl+'mobile/invoice/applyStore'
  },
  applyState(){//状态设置
    console.log(1111111)
    return baseUrl+'mobile/invoice/applyState'
  },
}
