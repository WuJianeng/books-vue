import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import books from '../components/books.vue'
import address from '../components/address.vue'
import report from '../components/report.vue'
import user from '../components/user.vue'

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    component: login
  },
  {
    // 重定向路由规则
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/books', component: books },
      { path: '/address', component: address },
      { path: '/report', component: report }
    ]
  },
  {
    path: '/user',
    component: user
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫，防止没登陆而访问其他页面
router.beforeEach((to, from, next) => {
  // to: 将要访问的路径
  // from: 从哪个路径跳转而来
  // next: 是一个函数，表示放行
  if (to.path === '/login') return next()
  // 获取 token
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
