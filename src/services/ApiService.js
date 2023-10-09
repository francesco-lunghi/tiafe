import axios from "axios"
import { useAuthStore } from "../stores/auth.store"


const instance = axios.create({
  baseURL: 'http://localhost:8000/',
  baseURLDocker: 'http://localhost:8000/',
  baseURLProd: '/',
  //timeout: config.apiServer.timeout
})

instance.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    const token = authStore.getToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(function (response) {
  return response
}, function (error) {
  console.log(error.response.data)
  if (error.response.status === 401) {
    const authStore = useAuthStore()
    authStore.logout()
  }
  return Promise.reject(error)
})

const ApiService = {
  getBaseUrl() {
    return instance.defaults.baseURL
  },
  get(url, config = {}) {
    return instance.get(url, config)
      .then(res => res)
      .catch(reason => Promise.reject(reason))
  },

  post(url, data, config = {}) {
    return instance.post(url, data, config)
      .then(res => res)
      .catch(reason => Promise.reject(reason))
  },
  put(url, data) {
    return instance.put(url, data)
      .then(res => res)
      .catch(reason => Promise.reject(reason))
  },
  delete(url) {
    return instance.delete(url)
      .then(res => res)
      .catch(reason => Promise.reject(reason))
  },


  awaitAll() {
    return axios.all(Array.from(arguments))
      .then(axios.spread((...responses) => responses))
      .catch(reasons => Promise.reject(reasons))
  }

}

export default ApiService
