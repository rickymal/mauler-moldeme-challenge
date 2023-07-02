import { BadRequestException, UnauthorizedException, InternalServerErrorException } from '../errors/errors'
import type ResponseError from "../types/GenericError"

export default abstract class BaseController {

  onBadRequestException(error: ResponseError) {
    throw new BadRequestException('BAD_REQUEST_EXCEPTION', error.message)
  }

  onUnauthorizedRequestException(error: ResponseError) {
    throw new UnauthorizedException('UNAUTHORIZED_REQUEST_EXCEPTION', error.message)
  }

  onInternalServerErrorException(error: ResponseError) {
    throw new InternalServerErrorException('INTERVAL_SERVER_ERROR_EXCEPTION', error.message)
  }

  handleControllerError(error: any) {
    if (error.response) {
      console.log({resp : error.response})
      switch (error.response.status) {
        case 400: {
          this.onBadRequestException(error)
          break;
        }
        case 401: {
          this.onUnauthorizedRequestException(error)
          break;
        }
        case 500: {
          this.onInternalServerErrorException(error)
          break;
        }
      }
    }
    else if (error.request) {
      console.error(error.request)
    }
    else {
      console.error(error)
    }
  }
}