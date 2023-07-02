import type IMoldemeService from "../services/IMoldemeService";
import BaseController from "./BaseController";
import { type AuthRequest } from '../types/Request'

export default class UserController extends BaseController {
  constructor(private service: IMoldemeService) { super() }
  async login(email: string, password: string): Promise<AuthRequest> {
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
      return {
        status: error.response.status,
        data: {
          user: {
            name: null
          },
          auth_token: ''
        }
      }
    }
  }
}