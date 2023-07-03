import { type CoordsResult, type CoordsType } from '@/types/Request';

export default interface ControllerCallbacks {
  onPerformCoordsFailed?: any;
  onDataPerformed?: (result: { pathChoosed: { x: number; y: number; }[]; length: string | number; }) => void
  onDataPerforming?: (coords: CoordsType[], params: { trainingTime: string; iterationTime: string; }) => void;
  onUpdateCoordsFailed?: (reason : string) => void
  getCoordinates?: () => void
  onCoordsUpdated?: (arg : { x_axis: number; y_axis: number; }) => void
  switchPage?: (coords : {data : Array<CoordsType>}) => void;
  redirectPage?: (to: string, next: string) => void;
  
}