import { type CoordsResult, type CoordsType } from '@/types/Request'

export default interface IAiApiService {
  perform: (coords : {data : {data : Array<CoordsType>}}, trainingTime : string, iterationTime : string) => Promise<CoordsResult>
}