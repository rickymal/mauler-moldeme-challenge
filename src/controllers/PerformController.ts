import type IMoldemeService from "../services/IMoldemeService";
import { BadRequestException, UnauthorizedException, InternalServerErrorException } from '../errors/errors'
import BaseController from './BaseController'
import type ControllerCallbacks from '../utils/ControllerCallbacks'
import type GenericError from "@/types/GenericError";
import type IAiApiService from '../services/IAiApiService'

export default class PerformController extends BaseController {
  auth: string;
  cbs: ControllerCallbacks;

  constructor(private moldemeService: IMoldemeService, private iaService: IAiApiService, auth: string, cbs: ControllerCallbacks) {
    super()
    this.auth = auth
    this.cbs = cbs
  }

  onBadRequestException(error: GenericError) {
    if (this.cbs.onUpdateCoordsFailed) {
      this.cbs.onUpdateCoordsFailed(error.response.data)
    }
  }

  onUnauthorizedRequestException(error: GenericError) {
    if (this.cbs.redirectPage) {
      this.cbs.redirectPage('login', 'perform')
    }
  }

  async getAllCoordinates() {
    try {
      const response = await this.moldemeService.getAllCoordinates(this.auth)
      if (response.status == 200) {
        return response.data.data
      }
    } catch (error: any) {
      this.handleControllerError(error)
    }
    return null
  }

  async findGoodPath(trainingTime: string, iterationTime: string) {
    const coords = await this.getAllCoordinates()

    if (!coords) {
      return null
    }

    try {
      if (this.cbs.onDataPerforming) {
        this.cbs.onDataPerforming(coords, { trainingTime, iterationTime })
      }
      const response = await this.iaService.perform(coords, trainingTime, iterationTime)

      if (response.status == 200) {
        setTimeout(() => {
          if (this.cbs.onDataPerformed) {
            this.cbs.onDataPerformed(response.data)
          }
        }, 5000);
      }
    } catch (error: any) {
      this.handleControllerError(error)
    }
    return null
  }
}
