import { AppRouteRecord } from '@/types/router'

export const dashboardRoutes: AppRouteRecord = {
  name: 'Dashboard',
  path: '/dashboard',
  component: '/index/index',
  meta: {
    title: 'menus.dashboard.title',
    icon: 'ri:pie-chart-line',
    roles: ['R_SUPER', 'R_ADMIN', 'R_NORMAL']
  },
  children: [
    {
      path: 'console',
      name: 'Console',
      component: '/dashboard/console',
      meta: {
        title: 'menus.dashboard.console',
        keepAlive: false,
        fixedTab: true
      }
    },
    {
      path: 'detail',
      name: 'Detail',
      component: '/dashboard/detail',
      meta: {
        title: 'menus.dashboard.detail',
        keepAlive: false,
        fixedTab: true
      }
    },
    {
      path: 'tabulate',
      name: 'Tabulate',
      component: '/dashboard/tabulate',
      meta: {
        title: 'menus.dashboard.tabulate',
        keepAlive: false,
        fixedTab: true
      }
    },
    {
      path: 'calendar',
      name: 'Calendar',
      component: '/dashboard/calendar',
      meta: {
        title: 'menus.dashboard.calendar',
        keepAlive: false,
        fixedTab: true
      }
    }
  ]
}
