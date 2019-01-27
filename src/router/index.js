import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/device',
    component: Layout,
    redirect: 'noredirect',
    name: 'DeviceManage',
    meta: { title: '设备管理', icon: 'example' },
    children: [
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/devicemanage/product/list'),
        meta: { title: '产品', icon: 'table' }
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/devicemanage/product/detail'),
        hidden: true,
        meta: { title: '产品详情' }
      },
      {
        path: 'device',
        name: 'Device',
        component: () => import('@/views/devicemanage/device/list'),
        meta: { title: '设备', icon: 'table' }
      },
      {
        path: 'group',
        name: 'Group',
        component: () => import('@/views/devicemanage/group/list'),
        meta: { title: '分组', icon: 'table' }
      },
      {
        path: '/group/:id',
        name: 'GroupDetail',
        component: () => import('@/views/devicemanage/group/detail'),
        hidden: true,
        meta: { title: '分组详情' }
      }
    ]
  },

  {
    path: '/monitor',
    component: Layout,
    redirect: 'noredirect',
    name: 'Monitor',
    meta: { title: '运维管理', icon: 'example' },
    children: [
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/monitor/realtimemonitor/index'),
        meta: { title: '实时监控', icon: 'table' }
      },
      {
        path: 'onlinedebug',
        name: 'OnlineDebug',
        component: () => import('@/views/monitor/onlinedebug/index'),
        meta: { title: '在线调试', icon: 'table' }
      },
      {
        path: 'firmwareupdate',
        name: 'FirmwareUpdate',
        component: () => import('@/views/monitor/firmwareupdate/index'),
        meta: { title: '固件升级', icon: 'table' }
      },
      {
        path: 'remoteconfig',
        name: 'RemoteConfig',
        component: () => import('@/views/monitor/remoteconfig/index'),
        meta: { title: '远程配置', icon: 'table' }
      }
    ]
  },

  {
    path: 'platform',
    component: Layout,
    children: [
      {
        path: 'https://www.baidu.com/',
        meta: { title: '平台主页', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
