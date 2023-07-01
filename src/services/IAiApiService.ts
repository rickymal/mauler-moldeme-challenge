export default interface IAiApiService {
  deleteCoordinates(auth: any, id: any): { status: number, data: any };
  login: (username: string, password: string) => {status : number, data: { auth_token : string, user : {name : string}}}
}