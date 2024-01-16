import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router=new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component:resolve => require(['@/components/login/login'],resolve),
    },
    {
      path: '/login',
      name: 'login',
      component:resolve => require(['@/components/login/login'],resolve),
    },
    {
      path: '/list',
      name: 'list',
      component:resolve => require(['@/components/list/list'],resolve),
    },
    {
      path: '/detail',
      name: 'detail',
      component:resolve => require(['@/components/detail/detail'],resolve),
    },
    {
      path: '/apply',
      name: 'apply',
      component:resolve => require(['@/components/apply/apply'],resolve),
    }
  ]
})
export default router

router.beforeEach((to, from, next) => {
  next()
  // console.log(to,from,next)
  const ApiKey=window.localStorage.getItem('tcxmglH5-key');
  const secret=window.localStorage.getItem('tcxmglH5-secret');
  if(ApiKey&&secret){
    next()
  }else if (!ApiKey&&!secret&&to.name!='login'){
    alert('您还未登录成功')
    next({path:'/'})
  }
  if(to.name=='login'){
    next()
  }
})
