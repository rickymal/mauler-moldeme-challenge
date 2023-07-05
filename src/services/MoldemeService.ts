import axios from 'axios';
import type IMoldemeService from '../types/IMoldemeService'
import BaseApiService from './BaseApiService'

export default class MoldemeService extends BaseApiService implements IMoldemeService {

  async login(email: string, password: string): Promise<{status : number, data: { auth_token : string, user : {name : string}}}> {
    const endpoint = 'login'
    return await axios.post(`${this.url}/${endpoint}`, { email, password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async deleteCoordinates(auth : string, id : string) : Promise<{ status: number, data: any; }> {
    return await axios.delete(`https://recrutamento.molde.me/location/${id}`, {
      headers : {
        Authorization: auth
      }
    })
  }

  async addCoordinates(auth : string, x_axis : number, y_axis : number) {
    return await axios.post('https://recrutamento.molde.me/location', { x: x_axis, y: y_axis }, {
      headers : {
        Authorization: auth
      }
    });
  }

  async getCoordinatesByPage(auth : string, page : number, limit : number) {
    return await axios.get('https://recrutamento.molde.me/location', {
      headers : {
        Authorization: auth
      },
      params : { limit, page }
    })
  }

  async getAllCoordinates(auth : string) {
    return await axios.get('https://recrutamento.molde.me/location', {
      headers : {
        Authorization: auth
      }
    })
  }
}
