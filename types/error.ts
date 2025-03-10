export interface ErrorResponse {
  url: string
  statusCode: number
  statusMessage: string
  message: string
  stack: string
  data: {
    error: string
  }
}
