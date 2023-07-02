import type IAiApiService from "./IAiApiService";
import BaseApiService from './BaseApiService'
import { type CoordsType } from "../types/Request";

export default class AiApiService extends BaseApiService implements IAiApiService {

  async perform(coords: {data : {data : Array<CoordsType>}}, trainingTime : string, iterationTime : string) {
    return {
      status: 200,
      data: {
        length: 10000,
        pathChoosed: coords.data.data.map(ctx => ({x: ctx.x, y: ctx.y})),
      }
    }
  }
}