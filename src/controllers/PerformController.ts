import type IMoldemeService from "../services/IMoldemeService";
import BaseController from './BaseController'
import type ControllerCallbacks from '../utils/ControllerCallbacks'
import type ResponseError from "../types/GenericError";
import type { IAiApiService, SuccessData } from '../services/IAiApiService'

export default class PerformController extends BaseController {
  auth: string;
  cbs: ControllerCallbacks;

  constructor(private moldemeService: IMoldemeService, private iaService: IAiApiService, auth: string, cbs: ControllerCallbacks) {
    super()
    this.auth = auth
    this.cbs = cbs
  }

  onBadRequestException(error: ResponseError) {
    if (this.cbs.onPerformCoordsFailed) {
      this.cbs.onPerformCoordsFailed(error.response.data)
    }
  }

  onUnauthorizedRequestException(error: ResponseError) {
    if (this.cbs.redirectPage) {
      this.cbs.redirectPage('login', 'perform')
    }
  }

  async getAllCoordinates() {
    try {
      const response = await this.moldemeService.getAllCoordinates(this.auth)
      if (response.status == 200) {
        return response
        return response.data.data
      }
    } catch (error: any) {
      this.handleControllerError(error)
      return error
    }
    return null
  }

  is_valid_number(number: number) {
    return Number.isInteger(number) && number > 0
  }

  async findGoodPath(trainingTime: string, iterationTime: string) {
    const coords = await this.getAllCoordinates()

    // Melhorar esses retornos (genérico)
    const is_training_value_valid = !trainingTime || this.is_valid_number(parseInt(trainingTime))
    const is_iteration_value_valid = !iterationTime || this.is_valid_number(parseInt(iterationTime))

    if (!(is_iteration_value_valid || is_training_value_valid)) {
      return null
    }

    try {
      if (this.cbs.onDataPerforming) {
        this.cbs.onDataPerforming(coords, { trainingTime, iterationTime })
      }
      const response = await this.iaService.perform(coords.data.data.map((el: { x: number | string; y: number | string; }) => ([el.x, el.y])), trainingTime, iterationTime)

      // a corrigir
      if (response.status == 200) {
        if (this.cbs.onDataPerformed) {
          this.cbs.onDataPerformed(response.data as SuccessData)
        }
        return response
      }
      else if (response.status == 400) {
        throw Error("url da api interna inválida")
      }
    } catch (error: any) {
      this.handleControllerError(error)
      return error
    }

    return null
  }
}
