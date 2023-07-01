import IAiApiService from "./IAiApiService";
import BaseApiService from './BaseApiService'

export default class AiApiService extends BaseApiService implements IAiApiService {

  async perform(coords: Array<{ x: number, y: number }>, training_time : number, iteration_time : number) {
    return {
      status: 200,
      data: {
        length: 10000,
        path_choosed: coords.map(ctx => ({x: ctx.x, y: ctx.y})),
      }
    }
  }
}