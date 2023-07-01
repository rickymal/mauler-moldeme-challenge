type MoldemeNameErrors = 
  | 'ON_BAD_REQUEST_EXCEPTION'
  | 'ON_UNAUTHORIZED_REQUEST_EXCEPTION'
  | 'ON_INTERVAL_SERVER_ERROR_EXCEPTION'



class CustomError<Tname extends string> extends Error {
  constructor(name : Tname, message : string, reason : any) {
    super()
    this.name = name
    this.message = message
    this.reason = reason
  }

}

export class BadRequestException extends CustomError<MoldemeNameErrors> {}
export class UnauthorizedException extends CustomError<MoldemeNameErrors> {}
export class InternalServerErrorException extends CustomError<MoldemeNameErrors> {}