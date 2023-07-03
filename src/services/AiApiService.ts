import type {IAiApiService} from "./IAiApiService";
import BaseApiService from './BaseApiService'
import axios, { AxiosError } from "axios";

export default class AiApiService extends BaseApiService implements IAiApiService {

  async perform(coords: Array<{ x: number, y: number }>, trainingTime: string, iterationTime: string) {
    let max_generations;
    let max_time;

    if (trainingTime) {
      max_time = trainingTime
    } else {
      max_time = null
    }

    if (iterationTime) {
      max_generations = iterationTime
    } else {
      max_generations = null
    }

    if (this.url) {
      const response = await axios.post(`${this.url}/perform`, {
        params: {
          max_generations: iterationTime,
          max_time: trainingTime
        },
        coords: coords
      })

      return {
        status: response.status,
        data: {
          length: response.data.total_distance,
          pathChoosed: response.data.best_route,
          conv: response.data.conv,
          div: response.data.div
        }
      }
    }

    // API que deveria cuidar desse retorno.
    return {
      status: 400,
      data: {
        length: null,
        pathChoosed: null,
      },
      message: "url invalida, recebido:" + this.url
    }
  }
}
