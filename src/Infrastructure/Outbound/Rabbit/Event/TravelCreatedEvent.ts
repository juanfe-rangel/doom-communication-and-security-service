import { Location } from 'src/Domain/Model/Location';

export type TravelCreatedEvent = {
  travelId: string;
  organizerId: number;
  driverId: number;
  passengersId: number[];
  conditions?: string;
  origin: Location;
  destination: Location;
};
