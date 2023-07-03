import { type Conv, type CoordsResult, type CoordsType, type Div } from '@/types/Request'

export interface SuccessData {
  length: any; 
  pathChoosed: any; 
  conv: Conv; 
  div: Div;
}

export interface ErrorData {
  length: null; 
  pathChoosed: null; 
  conv?: Conv; 
  div?: Div;
}

interface SuccessResponse {
  status: number;
  data: SuccessData;
  message?: undefined;
}

interface ErrorResponse {
  status: number;
  data: ErrorData;
  message: string;
}


export interface IAiApiService {
  perform(coords: Array<{ x: number; y: number; }>, trainingTime: string, iterationTime: string): Promise<SuccessResponse | ErrorResponse>;
}