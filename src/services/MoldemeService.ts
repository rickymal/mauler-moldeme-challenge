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

}