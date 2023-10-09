import { defineStore } from 'pinia'
import axios from 'axios'
import ApiService from 'src/services/ApiService'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    //TODO: use sessionStorage?
    user: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null,
    returnUrl: null, // the url to reroute to when done loggin in
    router: null
  }),
  getters: {
    isLoggedIn(state) {

      return state.user && state.user.access_token
    },
    // for quasar uploader
    getHeaderQuasar(state) {
      return { name: 'Authorization', value: `Bearer ${state.user.access_token}` }
      //return  { 'Authorization': `Bearer ${state.user.access_token}` }
    },
    getHeader(state) {
      return { Authorization: `Bearer ${state.user.access_token}` }
    },
    getToken(state) {
      return state.user.access_token
    }
  },
  actions: {
    async login(username, password) {
      try {
        var bodyFormData = new FormData();
        bodyFormData.append('username', username);
        bodyFormData.append('password', password);
        const user = await axios.post(ApiService.getAuthBaseUrl() + 'login', bodyFormData)

        // update pinia state
        this.user = user.data

        // store user details and jwt in local storage to keep user logged in between page refreshes
        sessionStorage.setItem('user', JSON.stringify(this.user))

        // redirect to previous url or default to home page
        this.router.push(this.returnUrl || '/')

      } catch (e) {
        console.log(e)
        alert('impossibile effettuare il login')
      }
    },
    async logout(toLogin = true) {
      //await axios.post(ApiService.getAuthBaseUrl() + 'logout')
      this.user = null
      sessionStorage.removeItem('user')
      if (toLogin)
        this.router.push('/login')
    }

  }
})
