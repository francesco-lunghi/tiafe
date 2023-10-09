<template>
  <q-page class="bg-light-blue row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">UNIPV</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                clearable
                v-model="email"
                type="email"
                label="email"
              />
              <q-input
                square
                filled
                clearable
                v-model="password"
                type="password"
                label="password"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="light-blue-7"
              size="lg"
              class="full-width"
              label="Login"
              @click.prevent="handleSubmit"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <!-- <p class="text-grey-6">Not reigistered? Created an Account</p> -->
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router' // <- import useRouter here

import { useAuthStore } from '../stores/auth.store.js'

export default {
  name: 'LoginPage',
  data() {
    onMounted(() => {
    })
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const auth = useAuthStore()
    async function handleSubmit() {
      // const response = await axios.post('login', {
      //   email: email.value,
      //   password: password.value,
      // })

      // localStorage.setItem('token', response.data.token)
      // router.push({
      //   path: '/',
      // })
      // console.log(response.data)
      auth.login(email.value, password.value)
    }
    return {
      email,
      password,
      handleSubmit,
    }
  },
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
