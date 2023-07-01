import type IApiService from "../services/IApiService";
import ControllerCallbacks from '../utils/ControllerCallbacks'

export default class PerformController {
  auth: string;
  cbs: ControllerCallbacks;

  constructor(private moldemeService: IApiService, private iaService: IAiApiService, auth: string, cbs: ControllerCallbacks) {
    this.auth = auth
    this.cbs = cbs
  }

  async handleErrors(error: any) {
    if (error.response) {
      const response = error.response
      if (response.status == 400) {
        this.cbs.onUpdateCoordsFailed(response.data)
      }
      else if (response.status == 401) {
        this.cbs.redirectPage('login', 'perform')
      }
    }
  }

  async getAllCoordinates() {
    try {
      const response = await this.moldemeService.getAllCoordinates(this.auth)
      if (response.status == 200) {
        return response.data.data
      }
    } catch (error: any) {
      this.handleErrors(error);
    }

    return null
  }

  async findGoodPath(trainingTime, iterationTime) {
    try {
      const coords = await this.getAllCoordinates()

      if (!coords) {
        return null
      }

      this.cbs.onDataPerforming(coords, { trainingTime, iterationTime })
      const response = await this.iaService.perform(coords, trainingTime, iterationTime)

      if (response.status == 200) {
        setTimeout(() => {
          this.cbs.onDataPerformed(response.data)
        }, 5000);
      }
    } catch (error: any) {
      this.handleErrors(error);
    }

    return null
  }
}
