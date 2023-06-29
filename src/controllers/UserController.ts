import type IApiService from "../services/IApiService";

export default class UserController {
  constructor(private service: IApiService) { }
  async login(email: string, password: string): Promise<{ auth: string, name: string }> {

    // return {
    //   auth: "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMiwiZnVsbCI6ZmFsc2UsImV4cCI6MTY4ODA5Mzk2Nn0.gygsS6zVCXYJJUC00rPM_iiZAVBuUN22oAnL_5rGw7w",
    //   name: "Henrique Mauler"
    // }

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