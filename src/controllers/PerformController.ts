import type IMoldemeService from "../services/IMoldemeService";
import {BadRequestException, UnauthorizedException, InternalServerErrorException} from '../errors/errors.ts'
import BaseController from './BaseController'

export default class PerformController extends BaseController {
  auth: string;
  cbs: ControllerCallbacks;

  constructor(private moldeme_service: IMoldemeService, private ia_service : IAiApiService,  auth : string, cbs : ControllerCallbacks) {
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

  async get_all_coordinates() {    
    try {
      const response = await this.moldeme_service.get_all_coordinates(this.auth)
      if (response.status == 200) {
        return response.data.data
      }
    } catch (error: any) {
      this.handleControllerError(error)
    }
    return null
  }
  
  async find_good_path(training_time, iteration_time) {   
    const coords = await this.get_all_coordinates()

    if(!coords) {
      return null
    }

    try {
      this.cbs.on_data_performing(coords, {training_time, iteration_time})
      const response = await this.ia_service.perform(coords, training_time, iteration_time)
      
      if (response.status == 200) {
        setTimeout(() => {
          this.cbs.on_data_performed(response.data)
        }, 5000);
      }
    } catch (error: any) {
      this.handleControllerError(error)
    } 
    return null
  }
}