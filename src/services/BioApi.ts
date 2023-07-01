import IIApiService from "./IIApiService";

export default class BioApi implements IIApiService {
  constructor() {
  }

  async perform(coords: Array<{ x: number, y: number }>) {
    return {
      status: 200,
      data: {
        legnth: 10000,
        path_choosed: coords,
      }
    }
  }
}