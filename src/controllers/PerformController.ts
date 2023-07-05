import type IMoldemeService from "../types/IMoldemeService";
import BaseController from './BaseController'
import type ControllerCallbacks from '../utils/ControllerCallbacks'
import type ResponseError from "../types/GenericError";
import type { IAiApiService, SuccessData } from '../types/IAiApiService'

export default class PerformController extends BaseController {
  auth: string;
  cbs: ControllerCallbacks;

  constructor(private moldemeService: IMoldemeService, private iaService: IAiApiService, auth: string, cbs: ControllerCallbacks) {
    super()
    this.auth = auth
    this.cbs = cbs
  }

  onBadRequestException(error: ResponseError) {
    if (this.cbs.onPerformCoordsFailed) {
      this.cbs.onPerformCoordsFailed(error.response.data)
    }
  }

  onUnauthorizedRequestException(error: ResponseError) {
    if (this.cbs.redirectPage) {
      this.cbs.redirectPage('login', 'perform')
    }
  }

  async getAllCoordinates() {
    try {
      const response = await this.moldemeService.getAllCoordinates(this.auth)
      if (response.status == 200) {
        return response
      }
    } catch (error: any) {
      this.handleControllerError(error)
      return error
    }
    return null
  }

  is_valid_number(number: number) {
    return Number.isInteger(number) && number > 0
  }
  
  /* 
    O método abaixo verifica se a entrada do usuário é valida. Porém não verifica se há coordenadas a serem enviadas.
    Uma possível melhoria seria realizar essa verificação, assim como fazer com que o componente em vue realize um tratamento adequado caso não exista coordenadas e/ou a entrada do usuário não for válida  

    O método 'perform' retorna um falso status caso uma url não tenha sido inserida 
    Por essa razão caso ocorra algum erro na busca pelo serviço em python (improvável visto que rodam juntos)
    o response.status será 400 sem entrar no erro.

    O retorno 'null' não é adequado para o método
  */
  async findGoodPath(trainingTime: string, iterationTime: string) {
    const coords = await this.getAllCoordinates()

    const is_training_value_valid = !trainingTime || this.is_valid_number(parseInt(trainingTime))
    const is_iteration_value_valid = !iterationTime || this.is_valid_number(parseInt(iterationTime))

    if (!(is_iteration_value_valid || is_training_value_valid)) {
      return null
    }

    try {
      if (this.cbs.onDataPerforming) {
        this.cbs.onDataPerforming(coords, { trainingTime, iterationTime })
      }

      const response = await this.iaService.perform(coords.data.data.map((el: { x: number | string; y: number | string; }) => ([el.x, el.y])), trainingTime, iterationTime)

      if (response.status == 200) {
        if (this.cbs.onDataPerformed) {
          this.cbs.onDataPerformed(response.data as SuccessData)
        }
        return response
      }
      else if (response.status == 400) {
        throw Error("url da api interna inválida")
      }
    } catch (error: any) {
      this.handleControllerError(error)
      return error
    }

    return null
  }
}
