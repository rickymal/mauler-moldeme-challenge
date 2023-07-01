import type IMoldemeService from "../services/IMoldemeService";
import {BadRequestException, UnauthorizedException, InternalServerErrorException} from '../errors/errors.ts'
import BaseController from './BaseController'

export default class PerformController extends BaseController {
  auth: string;
  cbs: ControllerCallbacks;

  constructor(private moldemeService: IMoldemeService, private iaService : IAiApiService,  auth : string, cbs : ControllerCallbacks) {
    super()
    this.auth = auth
    this.cbs = cbs
  }

  onBadRequestException(error) {
    this.cbs.onUpdateCoordsFailed(response.data)
  }

  onUnauthorizedRequestException(error) {
    this.cbs.redirectPage('login','perform')
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
  
  async findGoodPath(trainingTime, iterationTime) {   
    const coords = await this.getAllCoordinates()

    if(!coords) {
      return null
    }

    try {
      this.cbs.onDataPerforming(coords, {trainingTime, iterationTime})
      const response = await this.iaService.perform(coords, trainingTime, iterationTime)
      
      if (response.status == 200) {
        setTimeout(() => {
          this.cbs.onDataPerformed(response.data)
        }, 5000);
      }
    } catch (error: any) {
      this.handleControllerError(error)
    } 
    return null
  }
}