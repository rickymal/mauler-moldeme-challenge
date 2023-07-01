import { ref } from "vue";
import type IMoldemeService from "../services/IMoldemeService";
import { urlToHttpOptions } from "url";
import BaseController from "./BaseController";
import ControllerCallbacks from '../utils/ControllerCallbacks'
export default class DashboardController extends BaseController {
  limit: number;
  page: number;
  route: any;
  pages_info: Map<string, number>;
  pages_cache: Map<number, { id: number; x: number; y: number; created_at: string; updated_at: string; }>;
  coordinates: any;

  cbs: ControllerCallbacks
  auth: string;

  constructor(private service: IMoldemeService, auth: string, cbs?: ControllerCallbacks) {
    super()
    this.page = 1
    this.limit = 2
    this.auth = auth
    this.pages_info = new Map<string, number>()
    this.pages_cache = new Map<number, { id: number, x: number, y: number, created_at: string, updated_at: string }>()
    this.pages_info.set('pages', Number.POSITIVE_INFINITY)
    this.cbs = cbs || {}
  }

  onUnauthorizedRequestException(error) {
    this.cbs.redirectPage('login', 'dashboard')
  }

  using_first_page() {
    return this.page == 1
  }

  using_last_page() {
    return this.pages_info.get('pages') && this.page == this.pages_info.get('pages')
  }

  async paginate_data(pagination: number) {
    this.page += pagination
    if (this.page < 1) {
      this.page = 1
      return null
    } else if (this.page > (this.pages_info.get('pages') as number)) {
      this.page = this.pages_info.get('pages') || 1
      return null
    }

    try {
      const response = await this.service.get_coordinates_by_page(this.auth, this.page, this.limit)
      if (response.status == 200) {
        this.pages_info.set('pages', response.data.pages)
        this.cbs.switchPage(response.data)
      }
    } catch (error: any) {
      this.handleControllerError(error)
    }

  }

  async add_coordinate(x_axis: number, y_axis: number) {

    try {
      const response = await this.service.add_coordinates(this.auth, x_axis, y_axis)

      if (response.status == 200) {
        this.cbs.onCoordsUpdated({ x_axis, y_axis })
      }
    } catch (error: any) {
      this.handleControllerError(error)
    }
  }


  async delete_coordinate(id: number) {
    try {
      const response = await this.service.delete_coordinates(this.auth, id)

      if (response.status == 200) {
        this.paginate_data(0)
      }
    } catch (error: any) {
      this.handleControllerError(error)
    }
  }
}