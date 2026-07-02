import { Location } from 'src/Domain/Model/Location';

export class RouteDeviationEvent {
  travelId: string;
  driverId: number;
  location: Location;
}
