import axios from 'axios'

const API_HOST = 'http://localhost:5005'
// const API_HOST = 'http://159.89.91.230:5000'

export const http = axios.create({
  baseURL: `${API_HOST}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

