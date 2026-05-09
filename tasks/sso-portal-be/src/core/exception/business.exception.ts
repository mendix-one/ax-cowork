export class BusinessException extends Error {
  private _code: number
  private _reason: string
  private _data?: any

  constructor(code: number, reason: string, data?: any) {
    super(reason)
    this._code = code
    this._reason = reason
    this._data = data
  }

  get code(): number {
    return this._code
  }

  set code(value: number) {
    this._code = value
  }

  get reason(): string {
    return this._reason
  }

  set reason(value: string) {
    this._reason = value
  }

  get data(): any {
    return this._data
  }

  set data(value: any) {
    this._data = value
  }
}
