import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      alias: '/home',
      component: HomeView
    },
    {
      path: '/financial/connection/success',
      redirect: (to) => {
        return '/components/connect'
      }
    },
    {
      path: '/components',
      children: [
        {
          path: '',
          redirect: (to) => {
            return '/components/connect'
          }
        },
        {
          path: 'connect',
          name: 'connect',

          component: () => import('../views/ConnectView.vue')
        },
        {
          path: 'manage-connections',
          name: 'manage-connections',

          component: () => import('../views/ManageConnectionsView.vue')
        },
        {
          path: 'account-summary',
          name: 'account-summary',

          component: () => import('../views/AccountSummaryView.vue')
        },
        {
          path: 'transactions',
          name: 'transactions',

          component: () => import('../views/TransactionsView.vue')
        },
        {
          path: 'cashflow',
          name: 'cashflow',

          component: () => import('../views/CashflowView.vue')
        }
      ]
    }
  ]
})

export default router
