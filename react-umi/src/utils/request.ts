import { extend, RequestOptionsInit } from 'umi-request'

interface IRequestOptions extends RequestOptionsInit {
  params?: Record<string, any>
  skipAuth?: boolean
  timeout?: number
}

interface IResponseWrap<T = any> {
  code?: number
  message?: string
  data?: T
}

const DEFAULT_PREFIX = '/api'
const DEFAULT_TIMEOUT = 10000

class Request {
  private client = extend({ prefix: DEFAULT_PREFIX, timeout: DEFAULT_TIMEOUT, errorHandler: this.errorHandler.bind(this) })

  constructor() {
    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((url, options) => this.requestInterceptor(url, options))
    // umi-request 的 response interceptor 第二个参数需要符合它的 error handler 类型，使用 any 避开严格类型约束
    // first arg: response handler, second arg: error handler
    this.client.interceptors.response.use((response) => response as any)
  }

  private requestInterceptor(url: string, options: IRequestOptions = {}) {
    const token = this.getToken()
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    }

    if (token && !options.skipAuth) {
      ; (headers as any).Authorization = `Bearer ${token}`
    }

    const newOptions: IRequestOptions = {
      ...options,
      headers,
    }

    return { url, options: newOptions }
  }

  private async responseErrorInterceptor(error: any) {
    const { response } = error
    if (response?.status === 401) {
      this.handleTokenExpired()
    }
    throw error
  }

  private errorHandler(error: any) {
    // 这里可以统一上报或通知，当前保留抛出以便上层处理
    throw error
  }

  getToken() {
    try {
      return localStorage.getItem('token') || sessionStorage.getItem('token')
    } catch {
      return null
    }
  }

  setToken(token: string, remember = false) {
    try {
      const storage = remember ? localStorage : sessionStorage
      storage.setItem('token', token)
    } catch {
      // ignore
    }
  }

  clearToken() {
    try {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    } catch {
      // ignore
    }
  }

  handleTokenExpired() {
    this.clearToken()
    // 重定向到登录
    window.location.href = '/login'
  }

  // 常用方法
  async get<T = any>(url: string, params?: Record<string, any>, options?: IRequestOptions): Promise<IResponseWrap<T>> {
    const res = await this.client(url, { method: 'GET', params, ...options })
    return res as IResponseWrap<T>
  }

  async post<T = any>(url: string, data?: any, options?: IRequestOptions): Promise<IResponseWrap<T>> {
    const res = await this.client(url, { method: 'POST', data, ...options })
    return res as IResponseWrap<T>
  }

  async put<T = any>(url: string, data?: any, options?: IRequestOptions): Promise<IResponseWrap<T>> {
    const res = await this.client(url, { method: 'PUT', data, ...options })
    return res as IResponseWrap<T>
  }

  async delete<T = any>(url: string, data?: any, options?: IRequestOptions): Promise<IResponseWrap<T>> {
    const res = await this.client(url, { method: 'DELETE', data, ...options })
    return res as IResponseWrap<T>
  }
}

export default new Request()
