
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashBoardPage.vue') },

      { path: 'data', component: () => import('src/pages/DataViewerPage.vue') },
      {
        path: 'login',
        // meta:
        // {
        //   public: true
        // },
        component: () => import('src/pages/LoginPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
