import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home/Home.vue')
  },
  {
    path: '/price',
    name: 'Price',
    component: () => import('../views/Price/Price.vue')
  },
  {
    path: '/create',
    redirect: '/create/generate',
    name: 'Create',
    component: () => import('../components/CreateLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'generate',
        name: 'Generate',
        component: () => import('../views/Create/Generate.vue'),
        meta: { roles: ['user'], title: '生成视频' },
      },
      {
        path: 'space',
        name: 'Space',
        component: () => import('../views/Create/Space.vue'),
        meta: { roles: ['user'], title: '我的空间' },
      },
      {
        path: 'subscription',
        name: 'Subscription',
        component: () => import('../views/Create/Subscription.vue'),
        meta: { roles: ['user'], title: '我的订阅' },
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    // meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// //路由守卫
// router.beforeEach((to, from, next) => {
//   console.log("q", to.meta, userRole)
//   // 需要登录但未登录
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     console.log("需要登录但未登录")
//     return next('/login')
//   }

//   // 检查权限
//   if (to.meta.roles && !to.meta.roles.includes(userRole)) {
//        console.log("检查权限")
//     return next('/') // 无权限则重定向到首页
    
//   }
//   console.log("ok")

//   next()
// })

export default router
