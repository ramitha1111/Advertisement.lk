// for docker
import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api.advertisements.lk/api',
    withCredentials: true,
})

export default api

//for local
/*import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.1.55:3000/api',
    withCredentials: true
})

export default api*/
