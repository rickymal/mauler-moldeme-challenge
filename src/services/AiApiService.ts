import IAiApiService from "./IAiApiService";
import BaseApiService from './BaseApiService'

export default class AiApiService extends BaseApiService implements IAiApiService {

  async perform(coords: Array<{ x: number, y: number }>, trainingTime : number, iterationTime : number) {
    return {
      status: 200,
      data: {
        length: 10000,
        pathChoosed: coords.map(ctx => ({x: ctx.x, y: ctx.y})),
      }
    }
  }
}