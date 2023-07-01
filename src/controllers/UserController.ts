import type IApiService from "../services/IApiService";

export default class UserController {
  constructor(private service: IApiService) { }
  async login(email: string, password: string): Promise<{ auth: string, name: string }> {


    const response = await this.service.login(email, password)

    if (response.status == 200) {
      return { auth: response.data.auth_token, name: response.data.user.name }
    }

    else if (response.status == 400) {
      throw new Error(response.data.message)
    }

    else if (response.status == 500) {
      throw new Error(response.data)
    }

    else {
      throw new Error("Erro desconhecido, contate o administrador do sistema")
    }

  }

}