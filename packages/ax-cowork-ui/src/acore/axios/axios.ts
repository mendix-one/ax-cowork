import impAxios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import { notification } from 'antd'
import { ApiError, BusinessError, NetworkError } from './errors'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/app'

// HTTP header the BE/SSO BusinessExceptionFilter writes when an endpoint surfaces a
// business-rule failure as a 200 OK with the in-band `{ code, error, data? }` envelope.
const BUSINESS_CODE_HEADER = 'code'

interface BusinessEnvelope {
  code: number
  error: string
  data?: unknown
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

const http: AxiosInstance = impAxios.create({
  baseURL: BASE_URL,
  // Send the HttpOnly session cookie set by ax-cowork-be on every request. Works same-origin
  // (Vite proxy in dev, served by BE in prod); for true cross-origin the BE must reply with
  // Access-Control-Allow-Credentials: true.
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — converts the three failure shapes into typed rejections AND surfaces
// system-level errors via a notification so consumers don't have to (business errors stay
// silent here; the caller decides how to surface them inline).
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // Detect a 200 OK carrying a business envelope. The filter sets both the `code` header
    // and a matching body — we read the header first (cheap) then validate the body shape.
    const codeHeader = response.headers[BUSINESS_CODE_HEADER]
    if (codeHeader !== undefined) {
      const body = response.data as Partial<BusinessEnvelope> | undefined
      const code = typeof body?.code === 'number' ? body.code : Number(codeHeader)
      const error = typeof body?.error === 'string' ? body.error : 'Business error'
      return Promise.reject(new BusinessError(code, error, body?.data))
    }
    return response
  },
  (err: AxiosError) => {
    if (impAxios.isCancel(err)) {
      // Caller-initiated abort — don't notify, just propagate as NetworkError.
      return Promise.reject(new NetworkError('Request canceled'))
    }
    if (err.response) {
      const status = err.response.status
      const data = err.response.data as { code?: string; message?: string } | undefined
      const apiError = new ApiError(status, data?.code ?? 'Unknown_Error', data?.message ?? err.message)
      notification.error({ title: 'System error', description: `Please try again or contact support!` })
      return Promise.reject(apiError)
    }
    const netError = new NetworkError(err.message || 'Network request failed')
    notification.error({ title: 'System error', description: `Please try again or contact support!` })
    return Promise.reject(netError)
  },
)

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers, signal } = options
  const response = await http.request<T>({ url: path, method, data: body, headers, signal })
  return response.data
}

export const axios = {
  get: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) => request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) => request<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) => request<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) => request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) => request<T>(path, { ...opts, method: 'DELETE' }),
}
