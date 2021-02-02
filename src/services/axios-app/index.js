import axios from 'axios'
import { notification } from 'antd'

// Ubah baseURL sesuai dengan alamat service
const apiClientApp = axios.create({
  // baseURL: 'https://jnds.herokuapp.com',
  baseURL: 'http://localhost:8080',
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
})

apiClientApp.interceptors.request.use(request => {
  return request
})

apiClientApp.interceptors.response.use(undefined, error => {
  // Errors handling
  const { response } = error
  const { data } = response
  if (data) {
    notification.warning({
      message: data,
    })
  }
})

export default apiClientApp