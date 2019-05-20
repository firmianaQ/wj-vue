
import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
Vue.use(Router)


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index,
      meta: {
        title: '怪兽问卷'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['./views/Login.vue'], resolve),
      meta: {
        title: '登录-怪兽问卷'
      }
    }, 
    {
      path: '/github',
      name: 'github',
      component: resolve => require(['./components/LoginCallback/github.vue'], resolve),
      meta: {
        title: 'github'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: resolve => require(['./views/Register.vue'], resolve),
      meta: {
        title: '注册-怪兽问卷'
      }
    },
    {
      path: '/create',
      name: 'create_wj',
      component: resolve => require(['./views/create_wj.vue'], resolve),
      meta: {
        requireAuth: true,
        title: '创建问卷-怪兽问卷'
      }
    },
    {
      path: '/edit/:wjId',
      name: 'edit',
      component: resolve => require(['./views/edit.vue'], resolve),
      meta: {
        requireAuth: true,
        title: '编辑问卷-怪兽问卷'
      }
    },
    {
      path: '/analysis/:wjId',
      name: 'analysis',
      component: resolve => require(['./views/analysis.vue'], resolve),
      meta: {
        requireAuth: true,
        title: '数据分析-怪兽问卷'
      }
    },
    {
      path: '/list',
      name: 'list_wj',
      component: resolve => require(['./views/list_wj.vue'], resolve),
      meta: {
        requireAuth: true,
        title: '我的问卷-怪兽问卷'
      }
    },
    {
      path: '/type1',
      name: 'type1_wj',
      component: resolve => require(['./views/type1_wj.vue'], resolve),
      meta: {
        requireAuth: true,
        title: '创建问卷-怪兽问卷'
      }
    },
    {
      path: '/dj/:wjId',
      name: 'dj',
      component: resolve => require(['./views/dj.vue'], resolve),
      meta: {
        title: '怪兽问卷'
      }
    },
    {
      path: '/succ',
      name: 'succ',
      component: resolve => require(['./views/dj_succ.vue'], resolve),
      meta: {
        title: '怪兽问卷'
      }
    },
    {
      path: "/404",
      name: "notFound",
      component:  resolve => require(['./components/404.vue'], resolve)
    }, 
    {
      path: "*", // 此处需特别注意置于最底部
      redirect: "/404"
    }
    // ,
    // {
    //   path: '/type2_wj',
    //   name: 'type2_wj',
    //   component: resolve => require(['./views/type2_wj.vue'], resolve),
    //   meta: {
    //     requireAuth: true,
    //   }
    // },
    // {
    //   path: '/type3_wj',
    //   name: 'type3_wj',
    //   component: resolve => require(['./views/type3_wj.vue'], resolve),
    //   meta: {
    //     requireAuth: true,
    //   }
    // }
  ]
})



