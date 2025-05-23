import { io } from "socket.io-client"
import { API_HOST } from 'utils/http.ts'

export const socket = io(API_HOST, {
  transports: ["websocket"],
})
