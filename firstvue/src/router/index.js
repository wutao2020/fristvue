import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'
import User from '../views/user/User.vue'
import Menu from '../views/menu/Menu.vue'
import Role from '../views/role/Role.vue'
import Dict from '../views/dict/Dict.vue'
import UserCenter from '../views/user/UserCenter.vue'
import store from '../store'
import axios from "axios";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      {
        path: '/index',
        name: 'Index',
        component: Index
      },
      {
        path: '/user/userCenter',
        name: 'UserCenter',
        component: UserCenter
      },
      // {
      //   path: '/user/users',
      //   name: 'Users',
      //   component: User
      // },
      //
      // {
      //   path: '/role/roles',
      //   name: 'Roles',
      //   component: Role
      // },
      // {
      //   path: '/menu/menus',
      //   name: 'Menus',
      //   component: Menu
      // },
      // {
      //   path: '/dict/dicts',
      //   name: 'Dicts',
      //   component: Dict
      // },
    ]
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let hasRoute = store.state.menus.hasRoute
  let menus = store.state.menus.menuList
  let token = localStorage.getItem("token")
  if (to.path == '/login') {
    console.log("login!!!!!!!!!!!")
    next()
  } else if (token==undefined||token==null||token=='undefined'||token=='null'||token=='') {
    console.log("还没有token！！！")
    next({path: "/login"})
  }else if (to.path == '/' || to.path == '') {
    next({path: "/index"})
  }else if (!hasRoute) {
    let newRoutes = router.options.routes;
    axios.get("admin/menu/nav", {headers:{
        Authorization: localStorage.getItem("token")
      }}).then(res => {
      console.log(res.data.data)
      store.commit("setMenuList", res.data.data.nav)
      store.commit("setPermList", res.data.data.authoritys)
      res.data.data.nav.forEach(menu => {
        if (menu.children) {
          menu.children.forEach(e => {
            let route = menuToRoute(e)
            if(route) {
              newRoutes[0].children.push(route)
            }
          })
        }
      })
      console.log("oldRoutes---------------")
      console.log(newRoutes)
      router.addRoutes(newRoutes)
      store.commit("changeRouteStatus", true)
      next({path: to.path})
    })
  } else {
    console.log("已经有路由了------------")
    next()
  }
})
const menuToRoute = (menu) => {
  console.log("正在添加menu--》")
  console.log(menu)
  if (!menu.component) {
    return null
  }
  // 复制属性
  let route = {
    name: menu.name,
    path: menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  route.component = () => import('@/views/' + menu.component +'.vue')
  return route
}
export default router
