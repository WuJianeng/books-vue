import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import books from '../components/books.vue'
import address from '../components/address.vue'
import report from '../components/report.vue'

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
  }
]

const router = new VueRouter({
  routes
})

export default router
