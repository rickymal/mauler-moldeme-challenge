import type IMoldemeService from "../types/IMoldemeService";
import BaseController from "./BaseController";


export default class UserController extends BaseController {
  constructor(private service: IMoldemeService) { super() }
  
  async login(email: string, password: string) {
    try {
      const response = await this.service.login(email, password)
      if (response.status == 200) {
        return response
      } else {
        return {
          status: response.status,
          data: {
            user: {
              name: null
            },
            auth_token: ''
          }
        }
      }
    } catch (error: any) {
      this.handleControllerError(error)
      return error
    }
  }
}