export interface ApiErrorOptions extends ErrorOptions {
  status?: number
}

export class ApiError extends Error {
  public status: number

  constructor(msg?: string, { status = 500, ...options }: ApiErrorOptions = {}) {
    super(msg, options)
    this.status = status
  }
}
