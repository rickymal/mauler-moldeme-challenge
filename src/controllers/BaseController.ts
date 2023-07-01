import { BadRequestException, UnauthorizedException, InternalServerErrorException } from '../errors/errors.ts'


export default abstract class BaseController {

  onBadRequestException(error) {
    throw new BadRequestException(error)
  }

  onUnauthorizedRequestException(error) {
    throw new UnauthorizedException(error)
  }

  onInternalServerErrorException(error) {
    throw new InternalServerErrorException(error)
  }

  handleControllerError(error) {
    if (error.response) {
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