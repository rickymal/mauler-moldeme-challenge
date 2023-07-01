import type IApiService from "../services/IApiService";
import ControllerCallbacks from '../utils/ControllerCallbacks'

export default class PerformController {
  auth: string;
  cbs: ControllerCallbacks;

  constructor(private moldeme_service: IApiService, private ia_service: IAiApiService, auth: string, cbs: ControllerCallbacks) {
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

  async get_all_coordinates() {
    try {
      const response = await this.moldeme_service.get_all_coordinates(this.auth)
      if (response.status == 200) {
        return response.data.data
      }
    } catch (error: any) {
      this.handleErrors(error);
    }

    return null
  }

  async find_good_path(training_time, iteration_time) {
    try {
      const coords = await this.get_all_coordinates()

      if (!coords) {
        return null
      }

      this.cbs.on_data_performing(coords, { training_time, iteration_time })
      const response = await this.ia_service.perform(coords, training_time, iteration_time)

      if (response.status == 200) {
        setTimeout(() => {
          this.cbs.on_data_performed(response.data)
        }, 5000);
      }
    } catch (error: any) {
      this.handleErrors(error);
    }

    return null
  }
}
