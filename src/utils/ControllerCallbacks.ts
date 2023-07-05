import type { ModelResult } from '../types/Interfaces';
import { type CoordsResult, type CoordsType } from '../types/Interfaces';

export default interface ControllerCallbacks {
  onPerformCoordsFailed?: any;
  onDataPerformed?: (result: ModelResult) => void
  onDataPerforming?: (coords: {data : {data: CoordsType[]}}, params: { trainingTime: string; iterationTime: string; }) => void;
  onUpdateCoordsFailed?: (reason : string) => void
  getCoordinates?: () => void
  onCoordsUpdated?: (arg : { x_axis: number; y_axis: number; }) => void
  switchPage?: (coords : {data : Array<CoordsType>}) => void;
  redirectPage?: (to: string, next: string) => void;
  
}