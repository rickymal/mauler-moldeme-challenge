import axios from 'axios';
import type IApiService from './IApiService'

export default class MoldemeService implements IApiService {
  url: string;

  constructor(url: string) {
    this.url = url
  }

  async login(email: string, password: string): Promise<{status : number, data: { auth_token : string, user : {name : string}}}> {
    return await axios.post(this.url, { email, password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}