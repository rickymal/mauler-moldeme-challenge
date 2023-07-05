export default abstract class BaseApiService {
  url: string;
  
  constructor(url: string) {
    this.url = url
  }
}