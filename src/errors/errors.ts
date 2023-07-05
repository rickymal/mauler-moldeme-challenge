/*
  Criei para utilizar erros personalizados porém não era necessário o generics
*/
type MoldemeNameErrors = 
  | 'BAD_REQUEST_EXCEPTION'
  | 'UNAUTHORIZED_REQUEST_EXCEPTION'
  | 'INTERVAL_SERVER_ERROR_EXCEPTION'

class CustomError<Tname extends string> extends Error {
  reason: any

  constructor(name : Tname, message : string = '', reason : any = '') {
    super()
    this.name = name
    this.message = message
    this.reason = reason
  }
}

export class BadRequestException extends CustomError<MoldemeNameErrors> {}
export class UnauthorizedException extends CustomError<MoldemeNameErrors> {}
export class InternalServerErrorException extends CustomError<MoldemeNameErrors> {}