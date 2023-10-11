<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Trust In Ageing
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
        <!-- Logout button -->
        <!-- <q-btn @click="$router.push('/login')">Logout</q-btn> -->
        <q-btn class="q-ml-lg" @click="auth.logout()">Logout</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
// import { useRouter } from 'vue-router' // <- import useRouter here
import { useAuthStore } from '../stores/auth.store.js'

const linksList = [
  {
    title: 'Dashboard',
    caption: 'Main',
    icon: 'dashboard',
    link: '/dashboard'
  },
  {
    title: 'Data Viewer',
    caption: 'data viewer',
    icon: 'timeline',
    link: '/data'
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {
    const auth = useAuthStore()
    const leftDrawerOpen = ref(false)
    // const router = useRouter()

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      auth
    }
  }
})
</script>
