import type IApiService from "../services/IApiService";

export default class PerformController {
  auth: string;
  cbs: DashboardControllerCallbacks;

  constructor(private moldeme_service: IApiService, private ia_service : IIApiService,  auth : string, cbs : DashboardControllerCallbacks) {
    this.auth = auth
    this.cbs = cbs
  }

  async get_all_coordinates() {    
    try {
      const response = await this.moldeme_service.get_all_coordinates(this.auth)
      if (response.status == 200) {
        return response.data.data
      }
    } catch (error: any) {
      if (error.response) {
        const response = error.response
        if (response.status == 400) {
          this.cbs.onUpdateCoordsFailed(response.data, { x_axis, y_axis })
        }
        else if (response.status == 401) {
          this.cbs.redirectPage('login','perform')
        }
      }
      else if (error.response) {
      }
      else {
      }
    }

    return null
  }
  

  async find_good_path() {   
    const coords = await this.get_all_coordinates()

    if(!coords) {
      return null
    }

    try {
      this.cbs.on_data_performing(coords)
      const response = await this.ia_service.perform(coords)
      
      if (response.status == 200) {
        setTimeout(() => {
          this.cbs.on_data_performed(response.data.path_choosed)
        }, 5000);
      }
    } catch (error: any) {
      if (error.response) {
        const response = error.response
        if (response.status == 400) {
          this.cbs.onUpdateCoordsFailed(response.data, { x_axis, y_axis })
        }
        else if (response.status == 401) {
          this.cbs.redirectPage()
        }
      }
      else if (error.response) {
      }
      else {
      }
    } 
    return null
  }
}