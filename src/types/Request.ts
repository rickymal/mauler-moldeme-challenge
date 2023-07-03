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

export interface Coordinates extends BaseRequestStructure {
  data: CoordsType
}

export interface CoordsResult extends BaseRequestStructure {
  data: { pathChoosed: Array<{ x: number, y: number }>, length: string | number }
}

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