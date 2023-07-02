import type IMoldemeService from "../services/IMoldemeService";
import BaseController from "./BaseController";
import type ControllerCallbacks from '../utils/ControllerCallbacks'
import type GenericError from "@/types/GenericError";

export default class dashboardController extends BaseController {
  limit: number;
  page: number;
  route: any;
  pagesInfo: Map<string, number>;
  pagesCache: Map<number, { id: number; x: number; y: number; created_at: string; updated_at: string; }>;
  coordinates: any;

  cbs: ControllerCallbacks
  auth: string;

  constructor(private service: IMoldemeService, auth: string, cbs?: ControllerCallbacks) {
    super()
    this.page = 1
    this.limit = 2
    this.auth = auth
    this.pagesInfo = new Map<string, number>()
    this.pagesCache = new Map<number, { id: number, x: number, y: number, created_at: string, updated_at: string }>()
    this.pagesInfo.set('pages', Number.POSITIVE_INFINITY)
    this.cbs = cbs || {}
  }

  onUnauthorizedRequestException(error: GenericError) {
    if (this.cbs.redirectPage) {
      this.cbs.redirectPage('login', 'dashboard')
    }
  }

  onBadRequestException(error: GenericError): void {
    if (this.cbs.onUpdateCoordsFailed) {
      this.cbs.onUpdateCoordsFailed("Coordenadas devem ser entre 0 e 1000")
    }
  }

  using_first_page() {
    return this.page == 1
  }

  using_last_page() {
    return this.pagesInfo.get('pages') && this.page == this.pagesInfo.get('pages')
  }

  async paginateData(pagination: number) {
    this.page += pagination
    if (this.page < 1) {
      this.page = 1
      return null
    } else if (this.page > (this.pagesInfo.get('pages') as number)) {
      this.page = this.pagesInfo.get('pages') || 1
      return null
    }

    try {
      const response = await this.service.getCoordinatesByPage(this.auth, this.page, this.limit)
      if (response.status == 200) {
        this.pagesInfo.set('pages', response.data.pages)
        if (this.cbs.switchPage) {
          this.cbs.switchPage(response.data)
        }
      }
    } catch (error: any) {
      this.handleControllerError(error)
    }
  }

  async addCoordinate(x_axis: number, y_axis: number) {
    try {
      const response = await this.service.addCoordinates(this.auth, x_axis, y_axis)

      if (response.status == 200) {
        if (this.cbs.onCoordsUpdated) {
          this.cbs.onCoordsUpdated({ x_axis, y_axis })
        }
      }
    } catch (error: any) {
      this.handleControllerError(error)
    }
  }

  async deleteCoordinate(id: number | string) {
    try {
      const response = await this.service.deleteCoordinates(this.auth, id as string)

      if (response.status == 200) {
        this.paginateData(0)
      }
    } catch (error: any) {
      this.handleControllerError(error)
    }
  }
}