import { config } from '@config'
import axios, { AxiosInstance } from 'axios'

export let api: AxiosInstance

export function initApi(): void {
  api = axios.create({ baseURL: config.API_URL })
}
