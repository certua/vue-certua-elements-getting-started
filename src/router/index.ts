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
      path: '/overview-insurance',
      children: [
        {
          path: '',
          component: () => import('../views/insurance/InsuranceOverviewView.vue')
        }
      ]
    },
    {
      path: '/open-banking/components',
      children: [
        // {
        //   path: '',
        //   redirect: (to) => {
        //     return '/components/introduction'
        //   }
        // },
        {
          path: 'connect',
          name: 'connect',

          component: () => import('../views/open-banking/ConnectView.vue')
        },
        {
          path: 'manage-connections',
          name: 'manage-connections',

          component: () => import('../views/open-banking/ManageConnectionsView.vue')
        },
        {
          path: 'account-summary',
          name: 'account-summary',

          component: () => import('../views/open-banking/AccountSummaryView.vue')
        },
        {
          path: 'transactions',
          name: 'transactions',

          component: () => import('../views/open-banking/TransactionsView.vue')
        },
        {
          path: 'cashflow',
          name: 'cashflow',

          component: () => import('../views/open-banking/CashflowView.vue')
        }
      ]
    },
    {
      path: '/insurance/components',
      children: [
        {
          path: '',
          redirect: (to) => {
            return '/insurance/components/introduction'
          }
        },
        {
          path: 'introduction',
          name: 'introduction',
          component: () => import('../views/insurance/ComponentsOverviewView.vue')
        },
        {
          path: 'quote-and-buy',
          name: 'quote-and-buy',
          component: () => import('../views/insurance/QuoteAndBuyView.vue'),
          children: [
            {
              path: '/:pathMatch(.*)*',
              redirect(to) {
                return '/components/quote-and-buy'
              }
              //component: () => import('../views/insurance/QuoteAndBuyView.vue')
            }
          ]
        },
        {
          path: 'claims',
          name: 'claims',
          component: () => import('../views/insurance/ClaimsView.vue')
        },
        {
          path: 'fnol',
          name: 'fnol',
          component: () => import('../views/insurance/FnolView.vue')
        },
        {
          path: 'quick-quote',
          name: 'quick-quote',
          component: () => import('../views/insurance/QuickQuoteView.vue')
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/onboarding/LoginView.vue')
        },
        {
          path: 'quotes-list',
          name: 'quotes-list',
          component: () => import('../views/insurance/QuotesListView.vue')
        },
        {
          path: 'policies-list',
          name: 'policies-list',
          component: () => import('../views/insurance/PolicyListView.vue')
        },
        {
          path: 'view-policy',
          name: 'view-policy',
          children: [
            {
              path: '',
              component: () => import('../views/insurance/ViewPolicyView.vue')
            },
            {
              path: ':id',
              name: 'view-policy',
              component: () => import('../views/insurance/ViewPolicyView.vue')
            }
          ]
        },
        {
          path: 'manage-policy',
          name: 'manage-policy',
          component: () => import('../views/insurance/NewViewPolicyView.vue')
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 75
      }
    }
  }
})

export default router
