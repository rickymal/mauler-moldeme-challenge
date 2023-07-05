import {type AuthRequest, type BaseRequestStructure, type CoordinatesPage, type Coordinates} from './Interfaces'

export default interface IMoldemeService {
  login(email: string, password: string): Promise<AuthRequest>
  deleteCoordinates(auth : string, id : string) : Promise<BaseRequestStructure>
  addCoordinates(auth : string, x_axis : number, y_axis : number) : Promise<Coordinates>
  getCoordinatesByPage(auth : string, page : number, limit : number) : Promise<CoordinatesPage>
  getAllCoordinates(auth : string) : Promise<{status : number, data : {data : CoordinatesPage}}>
}