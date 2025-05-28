import axios from 'axios'

export const API_HOST = '//dev-api.underwritewise.com:5005'
// export const API_HOST = 'http://67.205.183.132:5005'

export const http = axios.create({
  baseURL: `${API_HOST}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

