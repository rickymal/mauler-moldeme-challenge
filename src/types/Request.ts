export interface BaseRequestStructure {
  status: number;
  message?: string;
}

export interface CoordsType {
  id?: number,
  x: number,
  y: number,
  created_at?: string
  updated_at?: string

}


export interface ModelResult {
  conv(conv: any): unknown;
  div: any;
  pathChoosed: Array<Array<number>>;
  length: string | number;
}

export interface Coordinates extends BaseRequestStructure {
  data: CoordsType
}

interface ModelData {
  [key: string]: number;
}

export interface Conv {
  [modelName: string]: ModelData;
}

export interface Div {
  'quantidade de rotas divergentes': ModelData;
}

interface CoordsData {
  best_route: [number, number][];
  conv: Conv;
  div: Div;
  total_distance: number;
}

export interface CoordsResult extends BaseRequestStructure{
  status: number;
  data: CoordsData;
  message: string;
}

// interface CoordsResult {
//   status: number;
//   data: {
//       length: {x: number; y: number;}[]; // ou o tipo apropriado para 'length'
//       pathChoosed: {x: number; y: number;}[];
//       conv: any; // ou o tipo apropriado para 'conv'
//       div: any; // ou o tipo apropriado para 'div'
//   };
//   message: string;
// }

// export interface CoordsResult{
//   data: { pathChoosed: Array<{ x: number, y: number }>, length: string | number }
// }

export interface CoordinatesPage extends BaseRequestStructure {
  data: {
    data: Array<CoordsType>
    limit: number
    page: number
    pages: number
    total: number
  }
}

export interface AuthRequest extends BaseRequestStructure {
  data: { auth_token: string, user: { name: string | null } }
}