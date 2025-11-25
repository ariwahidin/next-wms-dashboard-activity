// API Client untuk integrasi dengan backend nanti

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    this.baseUrl = baseUrl
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }
}

export const apiClient = new ApiClient()
