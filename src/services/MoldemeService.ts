import axios from 'axios';
import type IApiService from './IApiService'

export default class MoldemeService implements IApiService {
  url: string;

  constructor(url: string) {
    this.url = url
  }

  async login(email: string, password: string): Promise<{status : number, data: { auth_token : string, user : {name : string}}}> {
    const endpoint = 'login'
    return await axios.post(`${this.url}/${endpoint}`, { email, password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async delete_coordinates(auth : string, id : string) : Promise<{ status: number, data: any; }> {
    return await axios.delete(`https://recrutamento.molde.me/location/${id}`, {
      headers : {
        Authorization: auth
      }
    })
  }

  async add_coordinates(auth : string, x_axis : number, y_axis : number) {
    return await axios.post('https://recrutamento.molde.me/location', { x: x_axis, y: y_axis }, {
      headers : {
        Authorization: auth
      }
    });
  }

  async get_coordinates_by_page(auth : string, page : number, limit : number) {
    return await axios.get('https://recrutamento.molde.me/location', {
      headers : {
        Authorization: auth
      },
      params : { limit, page }
    })
  }

  async get_all_coordinates(auth : string) {
    return await axios.get('https://recrutamento.molde.me/location', {
      headers : {
        Authorization: auth
      }
    })
  }
}